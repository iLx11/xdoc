### 配置分区表 (partitions.csv)

```
# Name, Type, SubType, Offset, Size, Flags
nvs,      data, nvs,     0x9000,  0x4000,
otadata,  data, ota,     0xd000,  0x2000,
phy_init, data, phy,     0xf000,  0x1000,
factory,  app,  factory, 0x10000, 2M,
ota_0,    app,  ota_0,   ,        2M,
ota_1,    app,  ota_1,   ,        2M,
lvgl_res, data, spiffs,  ,        4M,      # 资源分区
```

### 配置 SPIFFS 镜像生成 (CMakeLists.txt)

在根目录创建资源文件夹 `resources/images` 和 `resources/fonts` ，在内部放置图片和字体的资源文件，烧录固件的时候也会将资源烧录进对应的分区，并创建文件目录

```cmake
# 在项目CMakeLists.txt中添加
spiffs_create_partition_image(
    lvgl_res            # 分区名称
    ${CMAKE_CURRENT_SOURCE_DIR}/resources  # 资源目录
    FLASH_IN_PROJECT    # 随项目一起烧录
)
```

### 实现函数

```c
#include "esp_flash.h"
#include "esp_spiffs.h"
#include "lvgl.h"
#include "esp_heap_caps.h"
#include "esp_log.h"

static const char* TAG = "esp_flash";

static bool spiffs_ready(lv_fs_drv_t * drv);
static void * spiffs_open(lv_fs_drv_t * drv, const char * path, lv_fs_mode_t mode);
static lv_fs_res_t spiffs_close(lv_fs_drv_t * drv, void * file_p);
static lv_fs_res_t spiffs_read(lv_fs_drv_t * drv, void * file_p, void * buf, uint32_t btr, uint32_t * br);
static lv_fs_res_t spiffs_seek(lv_fs_drv_t * drv, void * file_p, uint32_t pos, lv_fs_whence_t whence);
static lv_fs_res_t spiffs_tell(lv_fs_drv_t * drv, void * file_p, uint32_t * pos_p);

/********************************************************************************
 * @brief: 初始化 lvgl 资源系统
 * @return {*}
 ********************************************************************************/
void init_lvgl_res_sys() {
    // 初始化SPIFFS
    esp_vfs_spiffs_conf_t conf = {
        .base_path = "/spiffs",
        .partition_label = "lvgl_res",
        .max_files = 5,
        .format_if_mount_failed = false
    };
    
    esp_err_t ret = esp_vfs_spiffs_register(&conf);
    if (ret != ESP_OK) {
        ESP_LOGE("SPIFFS", "Failed to mount SPIFFS (%s)", esp_err_to_name(ret));
        return;
    }
    
    // 注册LVGL文件系统接口
    lv_fs_drv_t fs_drv;
    lv_fs_drv_init(&fs_drv);
    
    fs_drv.letter = 'S';  // 驱动器字母（S: 表示SPIFFS）
    fs_drv.ready_cb = spiffs_ready;
    fs_drv.open_cb = spiffs_open;
    fs_drv.close_cb = spiffs_close;
    fs_drv.read_cb = spiffs_read;
    fs_drv.seek_cb = spiffs_seek;
    fs_drv.tell_cb = spiffs_tell;
    
    lv_fs_drv_register(&fs_drv);
}


/********************************************************************************
 * @brief: 将资源动态写入 flash
 * @return {*}
 ********************************************************************************/
void write_resource_to_flash() {
    // 初始化SPIFFS
    esp_vfs_spiffs_conf_t conf = {
        .base_path = "/spiffs",
        .partition_label = "lvgl_res",
        .max_files = 5,
        .format_if_mount_failed = true
    };
    esp_vfs_spiffs_register(&conf);

    // 写入资源文件
    FILE* f = fopen("/spiffs/image.bin", "wb");
    if (f != NULL) {
        const uint8_t image_data[] = { /* 资源数据 */ };
        fwrite(image_data, 1, sizeof(image_data), f);
        fclose(f);
        ESP_LOGI("RES", "Resource written to flash");
    }
    
    // 卸载文件系统
    esp_vfs_spiffs_unregister(conf.partition_label);
}

/********************************************************************************
 * @brief: 检查 SPIFFS 就绪
 * @param {lv_fs_drv_t *} drv
 * @return {*}
 ********************************************************************************/
static bool spiffs_ready(lv_fs_drv_t * drv) {
    return true;
}

/********************************************************************************
 * @brief: 打开 SPIFFS 文件
 * @param {lv_fs_drv_t *} drv
 * @param {char *} path
 * @param {lv_fs_mode_t} mode
 * @return {*}
 ********************************************************************************/
static void * spiffs_open(lv_fs_drv_t * drv, const char * path, lv_fs_mode_t mode) {
    const char * flags = "";
    if(mode == LV_FS_MODE_WR) flags = "wb";
    else if(mode == LV_FS_MODE_RD) flags = "rb";
    else if(mode == (LV_FS_MODE_WR | LV_FS_MODE_RD)) flags = "rb+";
    
    char full_path[64];
    snprintf(full_path, sizeof(full_path), "/spiffs/%s", path);
    
    return (void*)fopen(full_path, flags);
}

/********************************************************************************
 * @brief: 关闭 SPIFFS 文件
 * @param {lv_fs_drv_t *} drv
 * @param {void *} file_p
 * @return {*}
 ********************************************************************************/
static lv_fs_res_t spiffs_close(lv_fs_drv_t * drv, void * file_p) {
    fclose((FILE*)file_p);
    return LV_FS_RES_OK;
}

/********************************************************************************
 * @brief: 读取 SPIFFS 文件
 * @param {lv_fs_drv_t *} drv
 * @param {void *} file_p
 * @param {void *} buf
 * @param {uint32_t} btr
 * @param {uint32_t *} br
 * @return {*}
 ********************************************************************************/
static lv_fs_res_t spiffs_read(lv_fs_drv_t * drv, void * file_p, void * buf, uint32_t btr, uint32_t * br) {
    *br = fread(buf, 1, btr, (FILE*)file_p);
    return *br == btr ? LV_FS_RES_OK : LV_FS_RES_UNKNOWN;
}

/********************************************************************************
 * @brief: 定位 SPIFFS 文件
 * @param {lv_fs_drv_t *} drv
 * @param {void *} file_p
 * @param {uint32_t} pos
 * @param {lv_fs_whence_t} whence
 * @return {*}
 ********************************************************************************/
static lv_fs_res_t spiffs_seek(lv_fs_drv_t * drv, void * file_p, uint32_t pos, lv_fs_whence_t whence) {
    int w;
    switch(whence) {
        case LV_FS_SEEK_SET: w = SEEK_SET; break;
        case LV_FS_SEEK_CUR: w = SEEK_CUR; break;
        case LV_FS_SEEK_END: w = SEEK_END; break;
        default: return LV_FS_RES_INV_PARAM;
    }
    fseek((FILE*)file_p, pos, w);
    return LV_FS_RES_OK;
}

/********************************************************************************
 * @brief: 获取 SPIFFS 文件位置
 * @param {lv_fs_drv_t *} drv
 * @param {void *} file_p
 * @param {uint32_t *} pos_p
 * @return {*}
 ********************************************************************************/
static lv_fs_res_t spiffs_tell(lv_fs_drv_t * drv, void * file_p, uint32_t * pos_p) {
    *pos_p = ftell((FILE*)file_p);
    return LV_FS_RES_OK;
}

/********************************************************************************
 * @brief: 从 SPIFFS 加载图像
 * @param {char*} path
 * @return {*}
 ********************************************************************************/
lv_img_dsc_t* load_image_from_flash(const char* path) {
    // 打开文件
    FILE* f = fopen(path, "rb");
    if (!f) {
        ESP_LOGE("RES", "Failed to open %s", path);
        return NULL;
    }

    // 获取文件大小
    fseek(f, 0, SEEK_END);
    long size = ftell(f);
    fseek(f, 0, SEEK_SET);
    
    // 在PSRAM中分配内存
    lv_img_dsc_t* img = (lv_img_dsc_t*)heap_caps_malloc(sizeof(lv_img_dsc_t), MALLOC_CAP_SPIRAM);
    if (!img) {
        fclose(f);
        return NULL;
    }
    
    img->data = heap_caps_malloc(size, MALLOC_CAP_SPIRAM);
    if (!img->data) {
        free(img);
        fclose(f);
        return NULL;
    }
    
    // 读取数据
    img->data_size = size;
    fread((void*)img->data, 1, size, f);
    fclose(f);
    
    // 设置图像头（根据实际格式）
    img->header.always_zero = 0;
    img->header.w = 240;  // 图像宽度
    img->header.h = 320;  // 图像高度
    img->header.cf = LV_IMG_CF_TRUE_COLOR;  // 颜色格式
    
    return img;
}

/********************************************************************************
 * @brief: 测试资源加载
 * @return {*}
 ********************************************************************************/
void resource_test() {
    // 加载图像资源
    lv_img_dsc_t* bg_img = load_image_from_flash("/spiffs/images/bg.bin");
    
    // 创建图像对象
    lv_obj_t* img = lv_img_create(lv_scr_act());
    lv_img_set_src(img, bg_img);
    lv_obj_align(img, LV_ALIGN_CENTER, 0, 0);
    
    // 加载字体
    lv_font_t* font16 = lv_font_load("S:/fonts/font16.bin");
    
    // 创建文本标签
    lv_obj_t* label = lv_label_create(lv_scr_act());
    lv_obj_set_style_text_font(label, font16, 0);
    lv_label_set_text(label, "Hello External Flash!");
    lv_obj_align(label, LV_ALIGN_BOTTOM_MID, 0, -10);
}
```

