# 移植到工程



![image-20250705144204762](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250705144204762.png)

创建一个 gui 文件夹，将 custom 和 generated 文件夹移入，并创建一个 `CMakeLists.txt` 文件，文件内容为：

（这里以 espidf 开发为例，并且按照实际修改引用的组件）

```cmake
set(GUI_DIR "./")
set(GUI_CUSTOM_DIR "${GUI_DIR}/custom")
set(GUI_GEN_DIR "${GUI_DIR}/generated")

# include path
set(GUI_INCLUDE_DIR
  "${GUI_CUSTOM_DIR}"
  "${GUI_GEN_DIR}"
  "${GUI_GEN_DIR}/guider_customer_fonts"
  "${GUI_GEN_DIR}/guider_fonts"
  "${GUI_GEN_DIR}/images"
)

# GUI 核心源文件
file(GLOB_RECURSE GUI_SOURCES
  "${GUI_CUSTOM_DIR}/*.c"
  "${GUI_GEN_DIR}/*.c"
  "${GUI_GEN_DIR}/guider_customer_fonts/*.c"
  "${GUI_GEN_DIR}/guider_fonts/*.c"
  "${GUI_GEN_DIR}/images/*.c"
)

idf_component_register(
  SRCS ${GUI_SOURCES}
  INCLUDE_DIRS ${GUI_INCLUDE_DIR}
  REQUIRES
    esp_driver_gpio
    lvgl
    porting
)
```

之后在 `main.c` 中添加三行代码：（注意引用组件中添加 gui)

```c
#include "gui_guider.h"

lv_ui guider_ui; // [! code ++]

void app_main(void) {
  lv_init();
  lv_port_disp_init();
  lvgl_tick_timer_init();

  setup_ui(&guider_ui); // [! code ++]
  events_init(&guider_ui); // [! code ++]

  while (1) {
    lv_task_handler();
    vTaskDelay(pdMS_TO_TICKS(10)); 
  }
}
```

