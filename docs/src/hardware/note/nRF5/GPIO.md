
Nordic GPIO口输入模式可以配置为没有pull，有上拉电阻，有下拉电阻，悬浮等4种状态。GPIO输出模式下驱动力灵活可配，可以配置为普通驱动力（2mA），高驱动力（10mA），甚至断开状态（跟开漏输出很像）。
除此之外，Nordic GPIO模块还有两个非常重要的功能：
- sense功能。当系统进入sleep模式（也称system OFF模式），只能通过IO口等特殊唤醒源来唤醒并产生复位。当某个IO口使能了sense功能，那么它就可以用来唤醒sleep模式了。Sense使能的时候，可以配置成高电平唤醒或者低电平唤醒。一般使用nrf_gpio_cfg_sense_input这个函数来使能IO口的sense功能。
- detect功能。Detect功能是sense功能的进一步扩展，sense除了可以唤醒sleep模式，还可以用来产生中断，即detect功能。你可以把DETECT看成一个中断标志位，这个中断标志位是由每一个端口所有IO口进行或操作的结果，所以DETECT信号状态直接跟随外部IO口状态，只要有一个外部IO口有效，那么DETECT信号就一直为高**，只有所有外部IO口状态都无效时，DETECT信号才会重新变成低。
### GPIO相关寄存器
#### 输出相关寄存器
- OUT（0x504）：写GPIO端口，按位（0-31）写入1（HIGH）对应端口输出高；写0（LOW）对应端口输出低；
- OUTSET（0x0508）：输出置位寄存器，按位（0-31）写入1（HIGH）对应端口输出高；写0（LOW）无效
- OUTCLR（0x050C）：输出清0寄存器，按位（0-31）写入1（HIGH）对应端口输出低；写0（LOW）无效
#### 输入相关寄存器
- IN（0x510）：端口输入寄存器，引脚为低电平时读取值为0，引脚为高电平时读取值为1
- 2.3 控制寄存器
- DIR（0x514）：方向寄存器，写0对应PIN脚设置为输入；写1对应引脚设置为输出
- DIRSET（0x518）：方向设置寄存器，写1设置为输出，写0无效
- DIRCLR（0x51C）：方向清除寄存器，写1设置为输入，写0无效
- LATCH（0x520）：锁存寄存器，如上图即将所有引脚电平变化可存储在LATCH寄存器中
- DETECTMODE（0x524）：检测模式配置寄存器，写0直接连接到引脚检测，写1通过锁存器Latch
- PIN_CNF[0-31]（0x700）：功能配置寄存器，可配置输入输出、上下拉、睡眠（SYSTEM OFF）后的唤醒电平（外部IO中断）
```c
#define LED 17

// 输出模式
nrf_gpio_cfg_output(LED);
// 拉低
nrf_gpio_pin_clear(LED);
// 拉高
nrf_gpio_pin_set(LED);
nrf_gpio_pin_toggle(LED);

```
## GPIOTE
GPIOTE，全称GPIO Tasks and Events，GPIOTE首先是一个外设模块，因此它遵守芯片外设最基本规则：每一个时刻每一个GPIO口只能被一个外设使用，因此当某一个IO口被用做GPIOTE了，那么它就不能再作为普通GPIO来使用了，也就是上面提到的GPIO API将变得无效，此时必须使用nrf_drv_gpiote.h里面的API。Nordic将状态机引入到每一个外设，也就是说，每一个外设都有自己的输入（task），输出（event）和状态。
GPIOTE的作用就是让GPIO也具有task和event的功能，也就是说，对GPIOTE来说，将某一个IO口置1，其实是触发TASKS_SET；检测某一个IO口上升沿，其实是等待EVENTS_IN。让IO口支持task和event机制，将为后面的PPI自动化操作打下基础，关于PPI详细说明，请参考“如何理解nRF5芯片外设PPIhttps://www.cnblogs.com/iini/p/9348504.html”。

GPIO模块只能用来操作IO口输入和输出，**如果需要处理IO口中断，则必须通过GPIOTE模块来做**，GPIOTE支持两种类型中断：EVENTS_IN中断以及EVENTS_PORT中断。
- IN event中断。EVENTS_IN用来检测沿，即上升沿，下降沿或者双沿。nRF52只有8个IN event channel（nRF51只有4个），它只能同时支持8路IN Event中断，每一路IN Event中断相互独立，互不影响，基于此IN Event中断可以用来同时捕获多路IO口中断。由于nRF51/52设计问题，一旦打开IN event中断，nRF52将增加10到20微安电流，nRF51将增加几百微安电流。（nRF53的IN event中断和port event中断两者功耗差不多）
- Port event 中断。EVENTS_PORT用来检测IO口低电平或者高电平，从芯片本身来说，每一个IO口都可以产生Port Event中断，但是GPIOTE驱动引入了一个宏：NRFX_GPIOTE_CONFIG_NUM_OF_LOW_POWER_EVENTS，用来控制可以同时使能多少个IO口来产生Port Event中断，Port Event中断功耗非常低（低于1uA），基本可以忽略不计。Port event中断虽然属于GPIOTE模块，但Port event的产生却完全取决于GPIO模块的DETECT信号，**DETECT每产生一次上升沿生成一次Port event中断**。
- 如前所述，DETECT信号是所有IO口相或的结果（832是32个IO口，840是48个IO口），只要其中某一个IO口有效，DETECT信号就一直为高**，这里容易产生一个副作用：但一个IO口产生Port event中断后，它还保持有效，那么这个时候DETECT信号就一直为高，此时如果另一个IO口从无效变成有效（产生中断），由于DETECT信号已经为高电平，所以这个IO口的中断将被忽略。为此，在处理port event中断的时候，nRF5 SDK app_button模块将每个port event的极性设为toggle，也就是每进入一次port event ISR handler，nRF5 SDK都会把DETECT的极性翻转一次，比如将检测为高有效变成检测为低有效，这就相当于将DETECT信号清0了，这样一旦外部有第2个IO口产生中断，DETECT将再次由低变高，从而再次生成一次Port event中断。如果应用逻辑允许，nRF52/51推荐使用port event处理IO口中断。
EVENTS_IN和EVENTS_PORT两种IO口中断初始化区别如下所示：
```c
// false表示Port event中断，每个IO口都可以作为port event中断输入口
nrf_drv_gpiote_in_config_t config = GPIOTE_CONFIG_IN_SENSE_TOGGLE(false);
err_code = nrf_drv_gpiote_in_init(pin_no, &config, gpiote_event_handler); 

// true表示IN event中断，nRF52总共有8个IN event中断。注：这里检测的是双沿
nrf_drv_gpiote_in_config_t config = GPIOTE_CONFIG_IN_SENSE_TOGGLE(true);
err_code = nrf_drv_gpiote_in_init(pin_no, &config, gpiote_event_handler);
```
### 初始化按键配置中断
```c
#include "nrf_gpiote.h"

static void gpio_init() {
    ret_code_t err_code;
    err_code = nrfx_gpiote_init();
    APP_ERROR_CHECK(err_code);
    
    // led out
    nrfx_gpiote_out_config_t led_out = NRFX_GPIOTE_CONFIG_OUT_SIMPLE(false);
    err_code = nrfx_gpiote_out_init(LED, &led_out);
    nrfx_gpiote_out_set(LED);

    // button in
    /*
	    NRFX_GPIOTE_CONFIG_IN_SENSE_HITOLO(true/false)
		Macro for configuring a pin to use a GPIO
		IN or PORT EVENT to detect high-to-low transition.
    */
    nrfx_gpiote_in_config_t button_in = NRFX_GPIOTE_CONFIG_IN_SENSE_HITOLO(true);
    button_in.pull = NRF_GPIO_PIN_PULLUP;
    err_code = nrfx_gpiote_in_init(BUTTON, &button_in, button_handle);
    // 使能中断
    nrfx_gpiote_in_event_enable(BUTTON, true);
}
```
中断回调函数
```c
static void timer_handler(void * p_context) {
    // Toggle LED.
    nrf_drv_gpiote_out_toggle(LED_1);
    if (current_int_priority_get() == APP_IRQ_PRIORITY_THREAD) {
        NRF_LOG_INFO("Timeout handler is executing in thread/main mode.");
    } else {
        NRF_LOG_INFO("Timeout handler is executing in interrupt handler mode.");
    }
}
```

