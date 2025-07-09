## 配置 menuconfig

### **ESP PSRAM：**

`Support for external, SPI-connected RAM`

KCONFIG Name: SPIRAM

This enables support for an external SPI RAM chip, connected in parallel with the main SPI flash chip.

### **Mode (QUAD/OCT) of SPI RAM chip in use：**

`Octal Mode PSRAM`

KCONFIG Name: SPIRAM_MODE

### **Type of SPIRAM chip in use：**

`Auto-detect`
KCONFIG Name: SPIRAM_TYPE

### **启动初始化：**

`Initialize SPI RAM during startup`
KCONFIG Name: SPIRAM_BOOT_INIT

If this is enabled, the SPI RAM will be enabled during initial boot. Unless you have specific requirements, you'll want to leave this enabled so memory allocated during boot-up can also be placed in SPI RAM.

## 修改 `lv_conf.h`

```c
#define LV_MEM_CUSTOM 1  // [! code highlight]
#if LV_MEM_CUSTOM == 0
    /*Size of the memory available for `lv_mem_alloc()` in bytes (>= 2kB)*/
    #define LV_MEM_SIZE (48U * 1024U)          /*[bytes]*/

    /*Set an address for the memory pool instead of allocating it as a normal array. Can be in external SRAM too.*/
    #define LV_MEM_ADR 0     /*0: unused*/
    /*Instead of an address give a memory allocator that will be called to get a memory pool for LVGL. E.g. my_malloc*/
    #if LV_MEM_ADR == 0
        #undef LV_MEM_POOL_INCLUDE
        #undef LV_MEM_POOL_ALLOC
    #endif

#else       /*LV_MEM_CUSTOM*/
    #define LV_MEM_CUSTOM_INCLUDE <stdlib.h>   /*Header for the dynamic memory function*/
    #define LV_MEM_CUSTOM_ALLOC   malloc
    #define LV_MEM_CUSTOM_FREE    free
    #define LV_MEM_CUSTOM_REALLOC realloc
    // 预留4MB PSRAM给LVGL 
    #define LV_MEM_SIZE (1024 * 1024 * 4) // [! code highlight]
#endif     /*LV_MEM_CUSTOM*/

```

## **显示缓冲区优化**

```c
// 缓冲行数 (根据分辨率调整) 避免 SPI 传输数据过大
#define BUFFER_LINES 10
void lv_port_disp_init(void) {
    ...
    lv_disp_draw_buf_t *draw_buf_dsc_2 = malloc(sizeof(lv_disp_draw_buf_t));
      // 在PSRAM中分配双缓冲区
      lv_color_t *buf1 = heap_caps_malloc(LV_HOR_RES_MAX * BUFFER_LINES * sizeof(lv_color_t), MALLOC_CAP_SPIRAM);
      lv_color_t *buf2 = heap_caps_malloc(LV_HOR_RES_MAX * BUFFER_LINES * sizeof(lv_color_t), MALLOC_CAP_SPIRAM);
      lv_disp_draw_buf_init(draw_buf_dsc_2, buf1, buf2, LV_HOR_RES_MAX * BUFFER_LINES);

    static lv_disp_drv_t disp_drv; /*Descriptor of a display driver*/
  lv_disp_drv_init(&disp_drv);   /*Basic initialization*/

  /*Set up the functions to access to your display*/

  /*Set the resolution of the display*/
  disp_drv.hor_res = LV_HOR_RES_MAX;
  disp_drv.ver_res = LV_VER_RES_MAX;
  /*Used to copy the buffer's content to the display*/
  disp_drv.flush_cb = disp_driver_flush;
  /*Set a display buffer*/
  disp_drv.draw_buf = draw_buf_dsc_2;
  /*Required for Example 3)*/
  disp_drv.full_refresh = 0;
  /*Finally register the driver*/
  lv_disp_drv_register(&disp_drv);
}
  
```

## **显式分配大内存到PSRAM**

```c
#include "esp_heap_caps.h"
uint8_t* img_buf = heap_caps_malloc(320*240*2, MALLOC_CAP_SPIRAM); // RGB565图像缓冲区
```

## 使用 heap_caps_get_free_size() 检查内存

```c
ESP_LOGI("MEM", "Free internal RAM: %d", heap_caps_get_free_size(MALLOC_CAP_8BIT));
ESP_LOGI("MEM", "Free PSRAM: %d", heap_caps_get_free_size(MALLOC_CAP_SPIRAM));
```

