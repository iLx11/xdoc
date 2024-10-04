#### **中断模式**

ESP32 的 GPIO 支持中断配置，可以在信号发生变化时触发中断，常见的中断类型：

- **GPIO_INTR_DISABLE**: 禁用中断。
- **GPIO_INTR_POSEDGE**: 仅在信号上升沿（低到高）触发中断。
- **GPIO_INTR_NEGEDGE**: 仅在信号下降沿（高到低）触发中断。
- **GPIO_INTR_ANYEDGE**: 在信号的任意边缘变化时触发中断。
- **GPIO_INTR_LOW_LEVEL**: 低电平触发中断。
- **GPIO_INTR_HIGH_LEVEL**: 高电平触发中断。

### GPIO 配置结构体 `gpio_config_t`

该结构体用于定义 GPIO 引脚的初始化配置。

```C
typedef struct {
    uint64_t pin_bit_mask;      // 要配置的 GPIO 引脚位掩码
    gpio_mode_t mode;           // 引脚模式 (输入、输出或双向)
    gpio_pullup_t pull_up_en;   // 启用或禁用内部上拉
    gpio_pulldown_t pull_down_en; // 启用或禁用内部下拉
    gpio_int_type_t intr_type;  // 中断类型
} gpio_config_t;
```

### GPIO 配置示例

下面的示例代码展示了如何配置一个 GPIO 引脚用于输入，并在信号上升沿时触发中断。

#### 示例 1: 配置 GPIO 作为输入并处理中断

```C
#include <stdio.h>
#include "driver/gpio.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "sdkconfig.h"

#define GPIO_INPUT_PIN 18    // 定义输入引脚
#define GPIO_OUTPUT_PIN 2    // 定义输出引脚
#define GPIO_INPUT_PIN_SEL (1ULL<<GPIO_INPUT_PIN)  // 选择输入引脚
#define GPIO_OUTPUT_PIN_SEL (1ULL<<GPIO_OUTPUT_PIN) // 选择输出引脚
#define ESP_INTR_FLAG_DEFAULT 0

static QueueHandle_t  gpio_evt_queue = NULL;   // 队列用于中断处理
static const char *TAG = "GPIO_EXAMPLE";     // 日志标签

// GPIO 中断服务函数
static void IRAM_ATTR gpio_isr_handler(void* arg) {
    uint32_t gpio_num = (uint32_t) arg;
    xQueueSendFromISR(gpio_evt_queue, &gpio_num, NULL);
}

// 中断处理任务
static void gpio_task_example(void* arg) {
    uint32_t io_num;
    while(1) {
        if(xQueueReceive(gpio_evt_queue, &io_num, portMAX_DELAY)) {
            ESP_LOGI(TAG, "GPIO[%d] intr, val: %d\n", io_num, gpio_get_level(io_num));
        }
    }
}

void app_main(void) {
    gpio_config_t io_conf;

    // 配置输出引脚
    io_conf.intr_type = GPIO_INTR_DISABLE;      // 禁用中断
    io_conf.mode = GPIO_MODE_OUTPUT;            // 设置为输出模式
    io_conf.pin_bit_mask = GPIO_OUTPUT_PIN_SEL; // 选择 GPIO 输出引脚
    io_conf.pull_down_en = 0;                   // 禁用下拉
    io_conf.pull_up_en = 0;                     // 禁用上拉
    gpio_config(&io_conf);                      // 应用配置

    // 配置输入引脚
    io_conf.intr_type = GPIO_INTR_POSEDGE;      // 中断在上升沿触发
    io_conf.mode = GPIO_MODE_INPUT;             // 设置为输入模式
    io_conf.pin_bit_mask = GPIO_INPUT_PIN_SEL;  // 选择 GPIO 输入引脚
    io_conf.pull_up_en = 1;                     // 启用内部上拉
    gpio_config(&io_conf);                      // 应用配置

    // 创建中断服务队列
    gpio_evt_queue = xQueueCreate(10, sizeof(uint32_t));
    
    // 启动中断处理任务
    xTaskCreate(gpio_task_example, "gpio_task_example", 2048, NULL, 10, NULL);

    // 安装 GPIO 中断处理程序
    gpio_install_isr_service(ESP_INTR_FLAG_DEFAULT);

    // 为输入引脚注册中断服务函数
    gpio_isr_handler_add(GPIO_INPUT_PIN, gpio_isr_handler, (void*) GPIO_INPUT_PIN);

    while (1) {
        // 每秒反转输出引脚的状态
        gpio_set_level(GPIO_OUTPUT_PIN, 0);
        vTaskDelay(1000 / portTICK_PERIOD_MS);
        gpio_set_level(GPIO_OUTPUT_PIN, 1);
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
}
```

### 