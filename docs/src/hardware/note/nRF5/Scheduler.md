调度程序用于将执行从中断处理程序模式转移到线程&主模式。这确保了所有中断处理程序都很短，并且所有中断都被尽快处理。这对于某些应用程序非常有益。
从概念上讲，调度程序通过使用事件队列来工作。通过使用 `app_sched_event_put()`将事件放入队列中来安排事件。这通常是通过在中断处理程序模式下运行的事件处理程序来完成的。通过调用`app_sched_execute()`事件将会被执行并一一从队列中弹出，直到队列为空。这通常在主循环中完成。没有优先级的概念，因此事件总是按照它们放入队列的顺序执行。
#### 包含
```c
#include "app_timer.h"
#include "nrf_drv_clock.h"
#include "app_scheduler.h"

// makefile
$(SDK_ROOT)/components/libraries/scheduler/app_scheduler.c \
$(SDK_ROOT)/components/libraries/timer/app_timer.c \
$(SDK_ROOT)/components/libraries/util/app_util_platform.c \
$(SDK_ROOT)/integration/nrfx/legacy/nrf_drv_clock.c \
$(SDK_ROOT)/components/drivers_nrf/nrf_soc_nosd/nrf_nvic.c \
$(SDK_ROOT)/modules/nrfx/drivers/src/nrfx_clock.c \
$(SDK_ROOT)/modules/nrfx/drivers/src/nrfx_power.c \
```
#### include path
```c
$(SDK_ROOT)/components/libraries/scheduler \
```    
#### sdk.config.c
```c
//==========================================================
// <e> APP_SCHEDULER_ENABLED - app_scheduler - Events scheduler
//==========================================================
#ifndef APP_SCHEDULER_ENABLED
#define APP_SCHEDULER_ENABLED 1
#endif
// <q> APP_SCHEDULER_WITH_PAUSE  - Enabling pause feature
 

#ifndef APP_SCHEDULER_WITH_PAUSE
#define APP_SCHEDULER_WITH_PAUSE 0
#endif

// <q> APP_SCHEDULER_WITH_PROFILER  - Enabling scheduler profiling
 

#ifndef APP_SCHEDULER_WITH_PROFILER
#define APP_SCHEDULER_WITH_PROFILER 0
#endif

// </e>
```
## Initialization
The scheduler is initialized using the `APP_SCHED_INIT()` macro, which takes two parameters:
- `EVENT_SIZE`: the maximum size of events to be passed through the scheduler.
- `QUEUE_SIZE`: the maximum number of entries in the scheduler queue.
```c
// Scheduler settings
#define SCHED_MAX_EVENT_DATA_SIZE   sizeof(nrf_drv_gpiote_pin_t)
#define SCHED_QUEUE_SIZE            10
```
Then write the following line above your main loop in order to initialize the Scheduler using the above parameters:
```c
APP_SCHED_INIT(SCHED_MAX_EVENT_DATA_SIZE, SCHED_QUEUE_SIZE);
```
add a call to `app_sched_execute()` in your main loop. The `app_sched_execute()` function will pull events and call its handler in thread mode. It will execute all events scheduled since the last time it was called.
```c
app_sched_execute();
```
### 调度中断或事件
调度的回调事件
```c
void button_scheduler_event_handler(void *p_event_data, uint16_t event_size) {
	button_handler(*((nrfx_gpiote_pin_t*)p_event_data));
}
```
通过按键中断时间来添加调度事件
```c
static void gpiote_event_handler(nrfx_gpiote_pin_t pin, nrf_gpiote_polarity_t action) {
    // 将中断处理的事件添加调度，更改 button_handler(pin);
    app_sched_event_put(&pin, sizeof(pin), button_scheduler_event_handler);
}```
按键处理函数
```c
static void button_handler(nrf_drv_gpiote_pin_t pin) {
    uint32_t err_code;
    // Handle button press.
    switch (pin) {
	    case BUTTON_1:
	        NRF_LOG_INFO("Start toggling LED 1.");
	        // 开始定时器
	        err_code = app_timer_start(m_led_a_timer_id, APP_TIMER_TICKS(500), NULL);
	        APP_ERROR_CHECK(err_code);
	        break;
	    case BUTTON_2:
	        NRF_LOG_INFO("Stop toggling LED 1.");
	        err_code = app_timer_stop(m_led_a_timer_id);
	        APP_ERROR_CHECK(err_code);
	        break;
	    default:
	        break;
    }
    // 判断在主线程还是中断处理中执行
    if (current_int_priority_get() == APP_IRQ_PRIORITY_THREAD) {
        NRF_LOG_INFO("Button handler is executing in thread/main mode.");
    } else {
        NRF_LOG_INFO("Button handler is executing in interrupt handler mode.");
    }
}
```
#### LED 与按键中断配置 gpio_init()... 参考 GPIO
main 函数
```c
int main(void) {
    lfclk_request();
    log_init();
    gpio_init();
    timer_init();
    APP_SCHED_INIT(SCHED_MAX_EVENT_DATA_SIZE, SCHED_QUEUE_SIZE);
    NRF_LOG_INFO("Scheduler tutorial example started.");
    while (true) {
        app_sched_execute();
    }
}
```
## 调度 Timmer
#### 更改调度事件大小
```c
// 更改最大的传递的事件大小
#define SCHED_MAX_EVENT_DATA_SIZE   sizeof(nrf_drv_gpiote_pin_t)
// 为
#define SCHED_MAX_EVENT_DATA_SIZE   MAX(sizeof(nrf_drv_gpiote_pin_t), APP_TIMER_SCHED_EVENT_DATA_SIZE)
```
#### 修改 sdk.config.c 
```
#define APP_TIMER_CONFIG_USE_SCHEDULER 1
```
现在定时器的运行在线程模式中