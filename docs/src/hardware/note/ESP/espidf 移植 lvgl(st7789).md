# 环境与工具

- espidf 5.4.0
- lvgl (8.3.10)
- lvgl_esp32_drivers
- st7789 芯片驱动屏幕

# lvgl (8.3.10)

下载 source code

https://github.com/lvgl/lvgl/releases/tag/v8.3.10

解压后添加到工程，外层文件夹名称 `lvgl`

# lvgl_esp32_drivers

下载 source code

https://github.com/lvgl/lvgl_esp32_drivers

解压后添加到工程，外层文件夹名称修改为 `lvgl_esp32_drivers`

# 移植步骤

## 工程配置

**1、** 将 `lvgl/examples/porting` 整个文件夹剪切出来，放在与 `lvgl` 同级目录

**2、**`porting` 文件夹中添加新的 `CMakeLists.txt`，内容为

```cmake
file(GLOB_RECURSE SOURCES ./*.c)
idf_component_register(SRCS ${SOURCES}
                    INCLUDE_DIRS .
                    REQUIRES 
                      esp_driver_gpio
                      lvgl
                      lvgl_esp32_drivers
                    )

```

**3、** 修改`lv_port_disp_template.c/h` 为 `lv_port_disp.c/h`，修改 `.h`  文件中的所有`LV_PORT_DISP_TEMPLATE_H` 为  `LV_PORT_DISP_H` 

**4、** 将 `lv_port_disp.c/h` 中的 `#if 0 ` 改为 `#if 1`

**5、**`lvgl_esp32_drivers` 文件中 `CMakeLists.txt` 添加组件引用

```cmake
idf_component_register(SRCS ${SOURCES}
                       INCLUDE_DIRS ${LVGL_INCLUDE_DIRS}
                       REQUIRES 
                        lvgl 
                        driver)
```

**6、** 工程 `cmakelists.txt` 添加组件文件夹

```cmake
set(EXTRA_COMPONENT_DIRS 
    ./lvgl
    ./lvgl_esp32_drivers
    ./porting
)
```

**7、编译解决报错**

## 问题解决

Q =======================:

```c
// 报错：
.bit_num = xxxxxxx
```

A:

```c
// 改为：
.duty_resolution = xxxxxx
```

Q =======================:

```c
// 报错：
gpio_matrix_out(xxxxxxxx)
```

A:

导入文件

```c
#include <rom/gpio.h>
#include <soc/gpio_sig_map.h>
```

Q =======================:

```c
// 报错：
LV_HOR_RES_MAX
```

A:

在 `lvgl_helpers.h` 定义两个屏幕横向和纵向最大值宏定义

```c
#define LV_HOR_RES_MAX 320
#define LV_VER_RES_MAX 172
```

Q =======================:

```c
// 报错：
gpio_pad_select_gpio
```

A:

`lvgl_esp32_drivers/lvgl_tft/disp_spi.h` 中添加导入

```c
#include <rom/gpio.h>
```

Q =======================:

```c
// 报错：
portTICK_RATE_MS
```

A:

选中错误文本，vscode 按快捷键 `ctrl + shift + h` 全局替换为 `portTICK_PERIOD_MS` 

Q =======================:

```c
// 报错：
E （434） spi: spi _bus _initialize(774): invalid dma channel，
```

A:

`lvgl_helpers.c` 文件最下面修改为

```c
#if defined (CONFIG_IDF_TARGET_ESP32C3) || defined (CONFIG_IDF_TARGET_ESP32S3)
    dma_channel = SPI_DMA_CH_AUTO;
#endif
```

## 驱动配置

### `porting/lv_port_disp.c` 文件

**1、** 修改定义为实际屏幕像素

```c
#define MY_DISP_HOR_RES 320
#define MY_DISP_VER_RES 172
```

**2、**`lv_port_disp_init` 函数中

注释掉缓存配置 1，3，留下 Example for 2，这个之后按需求更改

```c
/* Example for 1) */
  // static lv_disp_draw_buf_t draw_buf_dsc_1;
  // static lv_color_t buf_1[MY_DISP_HOR_RES * 10]; /*A buffer for 10 rows*/
  // lv_disp_draw_buf_init(&draw_buf_dsc_1, buf_1, NULL,
  //                       MY_DISP_HOR_RES * 10); /*Initialize the display buffer*/

  /* Example for 2) */
  static lv_disp_draw_buf_t draw_buf_dsc_2;
  static lv_color_t buf_2_1[DISP_BUF_SIZE];                        /*A
  buffer for 10 rows*/ static lv_color_t buf_2_2[DISP_BUF_SIZE]; /*An
  other buffer for 10 rows*/ lv_disp_draw_buf_init(&draw_buf_dsc_2, buf_2_1,
  buf_2_2, MY_DISP_HOR_RES * 10);   /*Initialize the display buffer*/

  /* Example for 3) also set disp_drv.full_refresh = 1 below*/
  // static lv_disp_draw_buf_t draw_buf_dsc_3;
  // static lv_color_t buf_3_1[MY_DISP_HOR_RES * MY_DISP_VER_RES]; /*A screen
  // sized buffer*/ static lv_color_t buf_3_2[MY_DISP_HOR_RES *
  // MY_DISP_VER_RES];            /*Another screen sized buffer*/
  // lv_disp_draw_buf_init(&draw_buf_dsc_3, buf_3_1, buf_3_2,
  //                       MY_DISP_VER_RES * LV_VER_RES_MAX);   /*Initialize the
  //                       display buffer*/
```

修改结构体配置：

```c
// 刷屏回调函数，这个函数是调用 lvgl_esp32_drivers 内驱动
/*Used to copy the buffer's content to the display*/
disp_drv.flush_cb = disp_driver_flush;
// 上面的缓存方式
/*Set a display buffer*/
disp_drv.draw_buf = &draw_buf_dsc_2;
```

**3、** `disp_init` 函数中

```c
static void disp_init(void) {
  // 这个函数是 lvgl_esp32_drivers 内初始化
  lvgl_driver_init();
}
```

**4、** 注释所有下面的 `disp_flush` 函数，包括函数定义 

**5、** 引入头文件

```c
#include "lvgl_helpers.h"
```



### `lvgl_esp32_drivers` 驱动修改

**1、** `lvgl_tft/st7789.c` 文件中 `st7789_flush` 函数增加内容

```c

void st7789_flush(lv_disp_drv_t * drv, const lv_area_t * area, lv_color_t * color_map)
{
    uint8_t data[4] = {0};
 
    uint16_t offsetx1 = area->x1;
    uint16_t offsetx2 = area->x2;
    uint16_t offsety1 = area->y1;
    uint16_t offsety2 = area->y2;
 
    offsety1 += 34; // [!code ++:2]
    offsety2 += 34;
```

**如果之后 lvgl 屏幕颜色反转可以在此函数最后添加**

```c
for (int i = 0; i < size; i++) { // [!code ++:8]
    // 获取原始值
    uint16_t color = color_map[i].full;
    // 交换高低字节
    uint16_t swapped_color = (color << 8) | (color >> 8);
    // 更新 colormap
    color_map[i].full = swapped_color;
}
st7789_send_color((void *)color_map, size * 2);
```

**或者**在 `lv_conf.h` 中修改

```c
/*Swap the 2 bytes of RGB565 color. Useful if the display has an 8-bit interface (e.g. SPI)*/
#define LV_COLOR_16_SWAP 1 // [!code highlight]
```



**2、** `lvgl_helpers.h`  中修改屏幕缓存数组大小

```c
#if defined (CONFIG_LV_TFT_DISPLAY_CONTROLLER_ST7789)
#define DISP_BUF_SIZE  (LV_HOR_RES_MAX * LV_VER_RES_MAX)
```

**3、** `lvgl_spi_conf.h` 文件，修改 spi 模式，可以根据实际情况修改

```c
#if defined (CONFIG_LV_TFT_DISPLAY_CONTROLLER_ST7789)
#define SPI_TFT_SPI_MODE    (3) // [!code highlight]
#else
#define SPI_TFT_SPI_MODE    (0)
#endif
```

 

## `SDK Configuration Editor` 小齿轮

![image-20250417145153638](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250417145153638.png)

![image-20250417145416410](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250417145416410.png)

![image-20250417145611869](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250417145611869.png)

## 主函数

### 引入头文件

```c
#include "esp_timer.h"
#include "lv_demos.h"
#include "lv_port_disp.h"
#include "lvgl.h"
```

### 定时器处理 lvgl 心跳

```c
static esp_timer_handle_t lvgl_tick_timer = NULL;
// 定时回调函数
static void lv_tick_task(void* arg) {
  (void)arg;
  lv_tick_inc(1);
}
// 初始化 LVGL tick 定时器
void lvgl_tick_timer_init(void) {
  const esp_timer_create_args_t timer_args = {.callback = &lv_tick_task,
                                              .arg = NULL,
                                              .dispatch_method = ESP_TIMER_TASK,
                                              .name = "lv_tick_timer"};
  esp_timer_create(&timer_args, &lvgl_tick_timer);
  esp_timer_start_periodic(lvgl_tick_timer, 1000);
}
```

### 简单测试函数

```c
// 测试函数
void lv_ex_test(void) {
  lv_obj_t* bj = lv_obj_create(lv_scr_act());
  lv_obj_set_size(bj, 200, 200);
  // 使用 lv_obj_align 实现居中后偏移
  lv_obj_align(bj, LV_ALIGN_CENTER, 0, 0);

  lv_obj_set_style_bg_color(bj, lv_color_hex(0xFF0000),
                            LV_PART_MAIN | LV_STATE_DEFAULT);

  // 打印 LVGL 内部坐标
  printf("[LVGL] Object position: (%d, %d)\n", lv_obj_get_x(bj),
         lv_obj_get_y(bj));

  // 打印屏幕物理分辨率
  lv_coord_t screen_w = lv_disp_get_hor_res(NULL);
  lv_coord_t screen_h = lv_disp_get_ver_res(NULL);
  printf("[LVGL] Screen resolution: %dx%d\n", screen_w, screen_h);
}
```

### 主函数，后期可以写任务来处理这部分

```c
void app_main(void) {
  // lvgl 初始化
  lv_init();
  lv_port_disp_init();
  lvgl_tick_timer_init();
  lv_ex_test();
  while (1) {
    // lvgl 任务处理
    lv_task_handler();
    vTaskDelay(pdMS_TO_TICKS(10));  // 延迟一定时间，让出CPU
  }
}

```

