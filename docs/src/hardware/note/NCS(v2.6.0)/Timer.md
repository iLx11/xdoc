### include 
```c
#include <zephyr.h>

#include <zephyr/logging/log.h>
```

## 配置定时
```c
#define TIMER_INTERVAL_MS   K_MSEC(500)

K_TIMER_DEFINE(my_timer, NULL, NULL);

k_timeout_t peri = {.ticks = 0};


// 定时器回调函数
static void m_timer_cb(struct k_timer *timer_id) {
    
    LOG_INF("TIMER FUNC EXEC");
    
}

// 定时器初始化
static void m_timer_init(void) {
    // 初始化，配置定时器完成回调和停止回调
    k_timer_init(&my_timer, m_timer_cb, NULL);
    /* 
		启动定时器
		第三个参数`K_NO_WAIT` `K_FOREVER` 为单次计时器
    */
    k_timer_start(&my_timer, TIMER_INTERVAL_MS, TIMER_INTERVAL_MS);
}

```