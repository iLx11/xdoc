### 配置分区表 (partitions.csv)

```
# Name, Type, SubType, Offset, Size, Flags
nvs,      data, nvs,     0x9000,  0x4000,
otadata,  data, ota,     0xd000,  0x2000,
phy_init, data, phy,     0xf000,  0x1000,
factory,  app,  factory, 0x10000, 2M,
ota_0,    app,  ota_0,   ,        2M,
ota_1,    app,  ota_1,   ,        2M,
lvgl_res, data, fat,  ,        4M,      # 资源分区
```

### 配置 FATFS 镜像生成 (CMakeLists.txt)

在根目录创建资源文件夹 `resources/images` 和 `resources/fonts` ，在内部放置图片和字体的资源文件，烧录固件的时候也会将资源烧录进对应的分区，并创建文件目录

```cmake
# 在项目根目录的 CMakeLists.txt中添加

# 设置资源目录
set(resource_dir "${CMAKE_CURRENT_SOURCE_DIR}/resources")

# 添加 FATFS 镜像生成规则
fatfs_create_spiflash_image(
    lvgl_res            # 分区名称
    ${resource_dir}     # 资源目录
    FLASH_IN_PROJECT    # 随项目一起烧录
)
```

### 实现函数

::: detials

esp_flash.c

```c
#include "esp_flash.h"

#include <inttypes.h>

#include "esp_crc.h"
#include "esp_heap_caps.h"
#include "esp_log.h"
#include "esp_partition.h"
#include "esp_vfs_fat.h"
#include "ff.h"

static const char *TAG = "esp_flash";

// 声明静态回调函数
static void *fs_open(lv_fs_drv_t *drv, const char *path, lv_fs_mode_t mode);
static lv_fs_res_t fs_close(lv_fs_drv_t *drv, void *file_p);
static lv_fs_res_t fs_read(lv_fs_drv_t *drv, void *file_p, void *buf,
                           uint32_t btr, uint32_t *br);
static lv_fs_res_t fs_write(lv_fs_drv_t *drv, void *file_p, const void *buf,
                            uint32_t btw, uint32_t *bw);
static lv_fs_res_t fs_seek(lv_fs_drv_t *drv, void *file_p, uint32_t pos,
                           lv_fs_whence_t whence);
static lv_fs_res_t fs_tell(lv_fs_drv_t *drv, void *file_p, uint32_t *pos_p);
static void *fs_dir_open(lv_fs_drv_t *drv, const char *path);
static lv_fs_res_t fs_dir_read(lv_fs_drv_t *drv, void *dir_p, char *fn);
static lv_fs_res_t fs_dir_close(lv_fs_drv_t *drv, void *dir_p);

// 错误码处理
static const char *f_error_msg(FRESULT res);

static wl_handle_t s_wl_handle = WL_INVALID_HANDLE;

void esp_flash_init_hw(void) {
  // 初始化 FATFS 文件系统
  lvgl_res_fs_init();
  // lvgl 文件系统注册
  lvgl_fs_register();
}

/********************************************************************************
 * @brief: 初始化 flash FATFS 文件系统
 * @return {*}
 ********************************************************************************/
esp_err_t lvgl_res_fs_init() {
  ESP_LOGI(TAG, "Initializing FAT filesystem on partition '%s'",
           PARTITION_LABEL);

  // FATFS 挂载配置
  esp_vfs_fat_mount_config_t mount_config = {
      .max_files = 5,
      .format_if_mount_failed = true,
      .allocation_unit_size = CONFIG_WL_SECTOR_SIZE,
      .disk_status_check_enable = false};

  // 用于在 SPI 闪存中初始化 FAT 文件系统并将其注册到 VFS 中
  esp_err_t ret = esp_vfs_fat_spiflash_mount_rw_wl(MOUNT_POINT, PARTITION_LABEL,
                                                   &mount_config, &s_wl_handle);
  if (ret != ESP_OK) {
    ESP_LOGI(TAG, "Failed to mount FATFS (%s)", esp_err_to_name(ret));
    return ret;
  }

  return ESP_OK;
}

/********************************************************************************
 * @brief: 打开文件
 * @param {lv_fs_drv_t} *drv
 * @param {char} *path
 * @param {lv_fs_mode_t} mode
 * @return {*}
 ********************************************************************************/
static void *fs_open(lv_fs_drv_t *drv, const char *path, lv_fs_mode_t mode) {
  // ESP_LOGW(TAG, "OPEN -------------------------------------------");
  LV_UNUSED(drv);
  uint8_t flags = 0;

  if (mode == LV_FS_MODE_WR)
    flags = FA_WRITE | FA_OPEN_ALWAYS;
  else if (mode == LV_FS_MODE_RD)
    flags = FA_READ;
  else if (mode == (LV_FS_MODE_WR | LV_FS_MODE_RD))
    flags = FA_READ | FA_WRITE | FA_OPEN_ALWAYS;

  FIL *f = lv_mem_alloc(sizeof(FIL));
  if (f == NULL) return NULL;

  FRESULT res = f_open(f, path, flags);
  if (res == FR_OK) {
    return f;
  } else {
    lv_mem_free(f);
    return NULL;
  }
}

/********************************************************************************
 * @brief: 关闭文件
 * @param {lv_fs_drv_t} *drv
 * @param {void} *file_p
 * @return {*}
 ********************************************************************************/
static lv_fs_res_t fs_close(lv_fs_drv_t *drv, void *file_p) {
  LV_UNUSED(drv);
  f_close(file_p);
  lv_mem_free(file_p);
  return LV_FS_RES_OK;
}

/********************************************************************************
 * @brief: 读取文件
 * @param {lv_fs_drv_t} *drv
 * @param {void} *file_p
 * @param {void} *buf
 * @param {uint32_t} btr
 * @param {uint32_t} *br
 * @return {*}
 ********************************************************************************/
static lv_fs_res_t fs_read(lv_fs_drv_t *drv, void *file_p, void *buf,
                           uint32_t btr, uint32_t *br) {
  LV_UNUSED(drv);
  FRESULT res = f_read(file_p, buf, btr, (UINT *)br);
  if (res == FR_OK)
    return LV_FS_RES_OK;
  else
    return LV_FS_RES_UNKNOWN;
}


 /********************************************************************************
  * @brief: 写入文件
  * @param {lv_fs_drv_t} *drv
  * @param {void} *file_p
  * @param {void} *buf
  * @param {uint32_t} btw
  * @param {uint32_t} *bw
  * @return {*}
  ********************************************************************************/
static lv_fs_res_t fs_write(lv_fs_drv_t *drv, void *file_p, const void *buf,
                            uint32_t btw, uint32_t *bw) {
  LV_UNUSED(drv);
  FRESULT res = f_write(file_p, buf, btw, (UINT *)bw);
  if (res == FR_OK)
    return LV_FS_RES_OK;
  else
    return LV_FS_RES_UNKNOWN;
}

/********************************************************************************
 * @brief: 定位文件指针
 * @param {lv_fs_drv_t} *drv
 * @param {void} *file_p
 * @param {uint32_t} pos
 * @param {lv_fs_whence_t} whence
 * @return {*}
 ********************************************************************************/
static lv_fs_res_t fs_seek(lv_fs_drv_t *drv, void *file_p, uint32_t pos,
                           lv_fs_whence_t whence) {
  LV_UNUSED(drv);
  switch (whence) {
    case LV_FS_SEEK_SET:
      f_lseek(file_p, pos);
      break;
    case LV_FS_SEEK_CUR:
      f_lseek(file_p, f_tell((FIL *)file_p) + pos);
      break;
    case LV_FS_SEEK_END:
      f_lseek(file_p, f_size((FIL *)file_p) + pos);
      break;
    default:
      break;
  }
  return LV_FS_RES_OK;
}

/********************************************************************************
 * @brief: 获取文件指针位置
 * @param {lv_fs_drv_t} *drv
 * @param {void} *file_p
 * @param {uint32_t} *pos_p
 * @return {*}
 ********************************************************************************/
static lv_fs_res_t fs_tell(lv_fs_drv_t *drv, void *file_p, uint32_t *pos_p) {
  LV_UNUSED(drv);
  *pos_p = f_tell((FIL *)file_p);
  return LV_FS_RES_OK;
}

/********************************************************************************
 * @brief: 打开目录
 * @param {lv_fs_drv_t} *drv
 * @param {char} *path
 * @return {*}
 ********************************************************************************/
static void *fs_dir_open(lv_fs_drv_t *drv, const char *path) {
  LV_UNUSED(drv);
  FF_DIR *d = lv_mem_alloc(sizeof(FF_DIR));
  if (d == NULL) return NULL;

  FRESULT res = f_opendir(d, path);
  if (res != FR_OK) {
    lv_mem_free(d);
    d = NULL;
  }
  return d;
}

/********************************************************************************
 * @brief: 读取目录
 * @param {lv_fs_drv_t} *drv
 * @param {void} *dir_p
 * @param {char} *fn
 * @return {*}
 ********************************************************************************/
static lv_fs_res_t fs_dir_read(lv_fs_drv_t *drv, void *dir_p, char *fn) {
  LV_UNUSED(drv);
  FRESULT res;
  FILINFO fno;
  fn[0] = '\0';

  do {
    res = f_readdir(dir_p, &fno);
    if (res != FR_OK) return LV_FS_RES_UNKNOWN;

    if (fno.fattrib & AM_DIR) {
      fn[0] = '/';
      strcpy(&fn[1], fno.fname);
    } else
      strcpy(fn, fno.fname);

  } while (strcmp(fn, "/.") == 0 || strcmp(fn, "/..") == 0);

  return LV_FS_RES_OK;
}

/********************************************************************************
 * @brief: 关闭目录
 * @param {lv_fs_drv_t} *drv
 * @param {void} *dir_p
 * @return {*}
 ********************************************************************************/
static lv_fs_res_t fs_dir_close(lv_fs_drv_t *drv, void *dir_p) {
  LV_UNUSED(drv);
  f_closedir(dir_p);
  lv_mem_free(dir_p);
  return LV_FS_RES_OK;
}

/********************************************************************************
 * @brief: 注册 LVGL 文件系统
 * @return {*}
 ********************************************************************************/
void lvgl_fs_register() {
  static lv_fs_drv_t fs_drv; /*A driver descriptor*/
  lv_fs_drv_init(&fs_drv);

  /*Set up fields...*/
  fs_drv.letter = LVGL_DRIVE_LETTER;
  fs_drv.cache_size = 0;

  fs_drv.open_cb = fs_open;
  fs_drv.close_cb = fs_close;
  fs_drv.read_cb = fs_read;
  fs_drv.write_cb = fs_write;
  fs_drv.seek_cb = fs_seek;
  fs_drv.tell_cb = fs_tell;

  fs_drv.dir_close_cb = fs_dir_close;
  fs_drv.dir_open_cb = fs_dir_open;
  fs_drv.dir_read_cb = fs_dir_read;

  lv_fs_drv_register(&fs_drv);
}

/********************************************************************************
 * @brief: 检查文件是否存在
 * @param {char} *path
 * @return {*}
 ********************************************************************************/
bool file_exists(const char *path) {
  FILINFO fno;
  FRESULT res = f_stat(path, &fno);

  if (res == FR_OK) {
    ESP_LOGI(TAG, "文件存在: %s (大小: %lu 字节)", path, fno.fsize);
    if (fno.fsize < 1024) {
      ESP_LOGI(TAG, "图片文件过小: %s (大小: %lu 字节)", path, fno.fsize);
    }
    return true;
  } else {
    ESP_LOGW(TAG, "文件不存在: %s (错误: %s)", path, f_error_msg(res));
    return false;
  }
}

/********************************************************************************
 * @brief: 错误码转文本函数
 * @param {FRESULT} res
 * @return {*}
 ********************************************************************************/
static const char *f_error_msg(FRESULT res) {
  switch (res) {
    case FR_OK:
      return "成功";
    case FR_DISK_ERR:
      return "磁盘错误";
    case FR_INT_ERR:
      return "内部错误";
    case FR_NOT_READY:
      return "设备未就绪";
    case FR_NO_FILE:
      return "文件不存在";
    case FR_NO_PATH:
      return "路径不存在";
    case FR_INVALID_NAME:
      return "无效文件名";
    case FR_DENIED:
      return "访问被拒绝";
    case FR_EXIST:
      return "文件/目录已存在";
    case FR_INVALID_OBJECT:
      return "无效对象";
    case FR_WRITE_PROTECTED:
      return "写保护";
    case FR_INVALID_DRIVE:
      return "无效驱动器";
    case FR_NOT_ENABLED:
      return "文件系统未启用";
    case FR_NO_FILESYSTEM:
      return "无有效文件系统";
    case FR_MKFS_ABORTED:
      return "格式化中止";
    case FR_TIMEOUT:
      return "超时";
    case FR_LOCKED:
      return "文件被锁定";
    case FR_NOT_ENOUGH_CORE:
      return "内存不足";
    case FR_TOO_MANY_OPEN_FILES:
      return "打开文件过多";
    case FR_INVALID_PARAMETER:
      return "无效参数";
    default:
      return "未知错误";
  }
}

/********************************************************************************
 * @brief: 保存图片到文件系统
 * @return {*}
 ********************************************************************************/
esp_err_t save_image_to_fs(const char *filename, const uint8_t *data,
                           size_t size) {
  char path[64];
  snprintf(path, sizeof(path), "%s/images/%s", MOUNT_POINT, filename);

  FILE *f = fopen(path, "wb");
  if (!f) {
    // ESP_LOGI(TAG, "Failed to open file: %s", path);
    return ESP_FAIL;
  }

  size_t written = fwrite(data, 1, size, f);
  fclose(f);

  if (written != size) {
    // ESP_LOGI(TAG, "Incomplete write: %u/%u bytes", written, size);
    return ESP_FAIL;
  }

  // ESP_LOGI(TAG, "Image saved to: %s (%u bytes)", path, size);
  return ESP_OK;
}

/********************************************************************************
 * @brief: 从文件系统读取图片
 * @return {*}
 ********************************************************************************/
esp_err_t read_image_from_fs(const char *filename, uint8_t *buffer,
                             size_t buffer_size, size_t *out_size) {
  char path[64];
  snprintf(path, sizeof(path), "%s/images/%s", MOUNT_POINT, filename);

  FILE *f = fopen(path, "rb");
  if (!f) {
    // ESP_LOGI(TAG, "Failed to open file: %s", path);
    return ESP_FAIL;
  }

  fseek(f, 0, SEEK_END);
  long file_size = ftell(f);
  fseek(f, 0, SEEK_SET);

  if (file_size > buffer_size) {
    fclose(f);
    // ESP_LOGI(TAG, "Buffer too small: %u < %ld", buffer_size, file_size);
    return ESP_FAIL;
  }

  size_t read = fread(buffer, 1, file_size, f);
  fclose(f);

  if (read != (size_t)file_size) {
    // ESP_LOGI(TAG, "Read incomplete: %u/%ld bytes", read, file_size);
    return ESP_FAIL;
  }

  *out_size = file_size;
  // ESP_LOGI(TAG, "Read %u bytes from %s", read, path);
  return ESP_OK;
}


/********************************************************************************
 * @brief: 从文件读取图片到 PSRAM 并显示
 * @param {char} *image_path
 * @return {*}
 ********************************************************************************/
lv_img_dsc_t *load_image_from_psram(const char *image_path) {
  // 1. 构建完整文件路径
  char full_path[128];
  snprintf(full_path, sizeof(full_path), "%s%s", MOUNT_POINT, image_path);
  ESP_LOGI(TAG, "加载图片: %s", full_path);

  // 2. 打开文件
  FILE *f = fopen(full_path, "rb");
  if (!f) {
    ESP_LOGE(TAG, "文件打开失败: %s", full_path);
    lv_obj_t *label = lv_label_create(lv_scr_act());
    lv_label_set_text_fmt(label, "文件打开失败:\n%s", image_path);
    lv_obj_set_style_text_color(label, lv_palette_main(LV_PALETTE_RED), 0);
    lv_obj_center(label);
    return NULL;
  }

  // 3. 获取文件大小
  fseek(f, 0, SEEK_END);
  size_t file_size = ftell(f);
  fseek(f, 0, SEEK_SET);
  ESP_LOGI(TAG, "文件大小: %d 字节", file_size);

  // 4. 在 PSRAM 中分配内存
  uint8_t *img_data = heap_caps_malloc(file_size, MALLOC_CAP_SPIRAM);
  if (!img_data) {
    ESP_LOGE(TAG, "PSRAM 分配失败: %d 字节", file_size);
    fclose(f);

    lv_obj_t *label = lv_label_create(lv_scr_act());
    lv_label_set_text_fmt(label, "内存不足:\n%d 字节", file_size);
    lv_obj_set_style_text_color(label, lv_palette_main(LV_PALETTE_RED), 0);
    lv_obj_center(label);
    return NULL;
  }

  // 5. 读取文件内容到 PSRAM
  size_t read_size = fread(img_data, 1, file_size, f);
  fclose(f);

  if (read_size != file_size) {
    ESP_LOGE(TAG, "读取不完整: %d/%d 字节", read_size, file_size);
    heap_caps_free(img_data);

    lv_obj_t *label = lv_label_create(lv_scr_act());
    lv_label_set_text_fmt(label, "读取失败:\n%d/%d 字节", read_size, file_size);
    lv_obj_set_style_text_color(label, lv_palette_main(LV_PALETTE_RED), 0);
    lv_obj_center(label);
    return NULL;
  }
  ESP_LOGI(TAG, "成功读取到 PSRAM: %p", img_data);

  // 6. 解析图片头信息
  lv_img_header_t header;
  if (lv_img_decoder_get_info(img_data, &header) != LV_RES_OK) {
    ESP_LOGE(TAG, "图片头解析失败");
    heap_caps_free(img_data);

    lv_obj_t *label = lv_label_create(lv_scr_act());
    lv_label_set_text(label, "图片格式不支持");
    lv_obj_set_style_text_color(label, lv_palette_main(LV_PALETTE_RED), 0);
    lv_obj_center(label);
    return NULL;
  }
  ESP_LOGI(TAG, "图片信息: %dx%d, 格式: %d", header.w, header.h, header.cf);

  // 7. 创建图像描述符
  lv_img_dsc_t *img_dsc =
      heap_caps_malloc(sizeof(lv_img_dsc_t), MALLOC_CAP_DEFAULT);
  if (!img_dsc) {
    ESP_LOGE(TAG, "描述符分配失败");
    heap_caps_free(img_data);
    return NULL;
  }

  img_dsc->header = header;
  img_dsc->data_size = file_size;
  img_dsc->data = img_data;

  return img_dsc;
}

```

esp_flash.h

```c
#ifndef ESP_FLASH_H
#define ESP_FLASH_H

#include "esp_err.h"
#include "lvgl.h"

// 配置区块大小 (4KB对齐)
#define CONFIG_BLOCK_SIZE 4096
#define CONFIG_MAGIC 0x55AA55AA

// 定义 LVGL 资源分区标签
#define PARTITION_LABEL "lvgl_res"
// 定义文件系统挂载点
#define MOUNT_POINT "/fat"
// 定义 LVGL 文件系统驱动器字母
#define LVGL_DRIVE_LETTER 'S'

void esp_flash_init_hw(void);

esp_err_t lvgl_res_fs_init();

void lvgl_fs_register();

void create_res_dir();

void display_fs_info(void);

bool file_exists(const char* path);

void list_entire_filesystem();

void format_file_size(uint32_t size, char* buffer, size_t buffer_size);

void list_files_recursive(const char* path, int depth);

lv_img_dsc_t *load_image_to_cache(const char *filename);

lv_obj_t *create_image_obj(lv_obj_t *parent, const char *filename);

esp_err_t update_image_resource(const char *filename, const uint8_t *data,
                                size_t size);

esp_err_t save_image_to_fs(const char *filename, const uint8_t *data,
                           size_t size);

esp_err_t read_image_from_fs(const char *filename, uint8_t *buffer,
                             size_t buffer_size, size_t *out_size);

lv_img_dsc_t *find_image_in_cache(const char *filename);

void free_image_cache(const char *filename);

void print_resource_usage();

void preload_com_res();


#endif
```



:::

### 文件系统信息打印显示

::: details

```c
/********************************************************************************
 * @brief: 显示文件系统信息
 * @return {*}
 ********************************************************************************/
void display_fs_info(void) {
  FATFS *fs;
  DWORD fre_clust;
  FRESULT res = f_getfree(MOUNT_POINT, &fre_clust, &fs);
  if (res == FR_OK) {
    DWORD total_sectors = (fs->n_fatent - 2) * fs->csize;
    DWORD free_sectors = fre_clust * fs->csize;
    ESP_LOGI(TAG, "分区信息: 总空间=%luKB, 可用空间=%luKB",
             total_sectors * fs->ssize / 1024, free_sectors * fs->ssize / 1024);
  } else {
    ESP_LOGE(TAG, "获取分区信息失败: %s", f_error_msg(res));
  }
}

/********************************************************************************
 * @brief: 递归遍历目录并打印文件信息
 * @param {char} *path
 * @param {int} depth
 * @return {*}
 ********************************************************************************/
void list_files_recursive(const char *path, int depth) {
  FF_DIR dir;
  FILINFO fno;
  FRESULT res;
  char full_path[256];

  // 打开目录
  res = f_opendir(&dir, path);
  if (res != FR_OK) {
    ESP_LOGE(TAG, "无法打开目录: %s (%s)", path, f_error_msg(res));
    return;
  }

  // 打印当前目录信息
  ESP_LOGI(TAG, "%*s[DIR] %s", depth * 2, "", path);

  // 遍历目录中的所有条目
  while (1) {
    res = f_readdir(&dir, &fno);
    if (res != FR_OK || fno.fname[0] == 0) {
      break;  // 错误或没有更多文件
    }

    // 跳过特殊目录项
    if (strcmp(fno.fname, ".") == 0 || strcmp(fno.fname, "..") == 0) {
      continue;
    }

    // 构建完整路径
    snprintf(full_path, sizeof(full_path), "%s/%s", path, fno.fname);

    // 处理目录
    if (fno.fattrib & AM_DIR) {
      // 递归遍历子目录
      list_files_recursive(full_path, depth + 1);
    }
    // 处理文件
    else {
      // 打印文件信息
      char size_str[16];
      format_file_size(fno.fsize, size_str, sizeof(size_str));

      ESP_LOGI(TAG, "%*s[FILE] %-40s %10s", (depth + 1) * 2, "", fno.fname,
               size_str);
    }
  }

  // 关闭目录
  f_closedir(&dir);
}

/********************************************************************************
 * @brief: 格式化文件大小为易读的格式
 * @param {uint32_t} size
 * @param {char} *buffer
 * @param {size_t} buffer_size
 * @return {*}
 ********************************************************************************/
void format_file_size(uint32_t size, char *buffer, size_t buffer_size) {
  const char *units[] = {"B", "KB", "MB", "GB"};
  double size_val = size;
  int unit_index = 0;

  while (size_val >= 1024 && unit_index < 3) {
    size_val /= 1024;
    unit_index++;
  }

  if (size_val < 10 && unit_index > 0) {
    snprintf(buffer, buffer_size, "%.2f %s", size_val, units[unit_index]);
  } else {
    snprintf(buffer, buffer_size, "%.1f %s", size_val, units[unit_index]);
  }
}

/********************************************************************************
 * @brief: 完整遍历文件系统
 * @return {*}
 ********************************************************************************/
void list_entire_filesystem() {
  ESP_LOGI(TAG, "==============================================");
  ESP_LOGI(TAG, "文件系统内容:");
  ESP_LOGI(TAG, "==============================================");

  // 获取分区信息
  FATFS *fs;
  DWORD fre_clust;
  FRESULT res = f_getfree("", &fre_clust, &fs);

  if (res == FR_OK) {
    DWORD total_sectors = (fs->n_fatent - 2) * fs->csize;
    DWORD free_sectors = fre_clust * fs->csize;

    char total_str[16], free_str[16];
    // 格式化数据大小显示
    format_file_size(total_sectors * fs->ssize, total_str, sizeof(total_str));
    format_file_size(free_sectors * fs->ssize, free_str, sizeof(free_str));
    // 显示分区大小和可用空间
    ESP_LOGI(TAG, "分区大小: %s, 可用空间: %s", total_str, free_str);
    ESP_LOGI(TAG, "----------------------------------------------");
  }

  // 从根目录开始递归遍历
  list_files_recursive("/", 0);

  ESP_LOGI(TAG, "==============================================");
}

```



:::

### 读取和显示图片字体

```c
// 创建并配置图像对象
lv_obj_t *img = lv_img_create(lv_scr_act());
// 可以手动读取后显示
// lv_img_dsc_t *img_file = load_image_from_psram("/IMAGES/1.bin");
// 直接用 lvgl 的文件系统接口，读取后显示
lv_img_set_src(img, "S:/IMAGES/1.bin");
lv_obj_center(img);

const lv_font_t *font = lv_font_load("S:/FONTS/P_128.BIN");
lv_obj_t *label = lv_label_create(lv_scr_act());
lv_label_set_text(label, "33");
lv_obj_center(label);

lv_obj_set_style_text_font(label, font, LV_PART_MAIN);
```

### 如果遇到回调函数不调用的问题

首先在 `lv_conf.h` 中打开

```c
#define LV_USE_FS_FATFS 1
#if LV_USE_FS_FATFS
    #define LV_FS_FATFS_LETTER 'S'     /*Set an upper cased letter on which the drive will accessible (e.g. 'A')*/
    #define LV_FS_FATFS_CACHE_SIZE 0    /*>0 to cache this number of bytes in lv_fs_read()*/
#endif
```

在 `lvgl/env_support/cmake/esp.cmake` 文件中引用 fatfs 的组件

```c
idf_component_register(SRCS ${SOURCES} ${EXAMPLE_SOURCES} ${DEMO_SOURCES}
      INCLUDE_DIRS ${LVGL_ROOT_DIR} ${LVGL_ROOT_DIR}/src ${LVGL_ROOT_DIR}/../
                   ${LVGL_ROOT_DIR}/examples ${LVGL_ROOT_DIR}/demos
      REQUIRES 
      	esp_timer
        fatfs // [! code highlight]
 )
```

这样 lvgl 会内部实现文件读取的接口，只需要自己初始化 fatfs 就可以