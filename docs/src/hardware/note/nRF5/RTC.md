### 使能 RTC
sdk_config.c
```c
nRF_Drivers --> NRFX_RTC_ENABLED
nRF_Drivers --> RTC_ENABLED
nRF_Drivers --> RTC_ENABLED --> RTC(0)_ENABLED
```
在没有协议栈的操作下选择RTC0，在有协议栈并且有定时器模块的情况下选择RTC2，因为协议栈的时钟源使用的是RTC0，定时器模块使用了RTC1
### **RTC— Real-time counter**
nRF52832 的 RTC— Real-time counter 是实时计数器。 注意不要和单片机上的实时时钟搞混淆。
单片机上的RTC— Real-time Clock，是提供精确的实时时间或者为电子系统提供精确的时间基准。
nRF52832 的 RTC— Real-time counter 是在低频时钟源 LFCLK 上提供的一个通用的低功耗定时器。
- 使用 RTC 必须 启动 LFCLK时钟；
- nRF52xx 有 RTC0、RTC1、RTC2 三个RTC 模块；
- TICK 事件（滴答事件）常用于低功耗，无滴答RTOS，可在关闭CPU的时候保持RTOS的调度；
- 24位 COUNTER 的分辨率为 30.517us；
- PRESCALER 寄存器在 RTC 停止时可读可写。在启动以后写无效。 PRESCALER 在 START、 CLEAR 和 TRIGOVRFLW 任务发生时都会重新启动。 **fRTC [kHz] = 32.768 / (PRESCALER + 1 )** 分频值 被锁在这些任务内部寄存器 PRESC 中
- 溢出事件： 在模块输入端通过 TRIGOVRFLW task 将COUNTER 计数器的值设置为 0xFFFFF0。计数器计数16次， 到 0xFFFFFF，然后溢出到0时就发生 OVRFLW 事件。Important: The OVRFLW event is disabled by default.
![[Pasted image 20240428094806.png]]
## 配置与初始化
### COMPARE EVENT 、TICK EVENT
##### 寄存器版本
```c
#define LFCLK_FREQUENCY           (32768UL)                               /**< LFCLK频率为HZ. */
#define RTC_FREQUENCY             (8UL)                                   /**< 所需的RTC工作时钟 RTC_FREQUENCY 为HZ. */
#define COMPARE_COUNTERTIME       (3UL)                                   /**<设备比较次数*/
#define COUNTER_PRESCALER         ((LFCLK_FREQUENCY/RTC_FREQUENCY) - 1)   /* f = LFCLK/(prescaler + 1) */


void rtc_config(void) {
	// 使能 RTC中断.
    NVIC_EnableIRQ(RTC0_IRQn);                    
    // 设置预分频值，通过想要的频率算预分频值
    NRF_RTC0->PRESCALER     = COUNTER_PRESCALER;                      
    NRF_RTC0->CC[0]         = COMPARE_COUNTERTIME * RTC_FREQUENCY;  //设置比较的值.

    // 写1使能,Enable TICK event and TICK interrupt:
    NRF_RTC0->EVTENSET      = RTC_EVTENSET_TICK_Msk;
    NRF_RTC0->INTENSET      = RTC_INTENSET_TICK_Msk;

    // Enable COMPARE0 event and COMPARE0 interrupt:
    NRF_RTC0->EVTENSET      = RTC_EVTENSET_COMPARE0_Msk;
    NRF_RTC0->INTENSET      = RTC_INTENSET_COMPARE0_Msk;
}
```
##### 触发中断
```c
/*:
触发滴答中断和比较中断
 */
void RTC0_IRQHandler() {
    if ((NRF_RTC0->EVENTS_TICK != 0) && 
        ((NRF_RTC0->INTENSET & RTC_INTENSET_TICK_Msk) != 0)){
        NRF_RTC0->EVENTS_TICK = 0;
        LED1_Toggle();
    }
    
    if ((NRF_RTC0->EVENTS_COMPARE[0] != 0) && 
        ((NRF_RTC0->INTENSET & RTC_INTENSET_COMPARE0_Msk) != 0)){
        NRF_RTC0->EVENTS_COMPARE[0] = 0;
        LED2_Toggle();
    }
}
```
##### 库函数版本
```c
static void rtc_handler(nrf_drv_rtc_int_type_t int_type)
{
    if (int_type == NRF_DRV_RTC_INT_COMPARE0)
    {
        nrf_gpio_pin_toggle(COMPARE_EVENT_OUTPUT);
    }
    else if (int_type == NRF_DRV_RTC_INT_TICK)
    {
        nrf_gpio_pin_toggle(TICK_EVENT_OUTPUT);
    }
}

static void rtc_config(void)
{
    uint32_t err_code;

    //初始化RTC实例
    nrf_drv_rtc_config_t config = NRF_DRV_RTC_DEFAULT_CONFIG;
    config.prescaler = 4095;
    /*
    nrfx_err_t nrfx_rtc_init(nrfx_rtc_t const * const  p_instance,
                         nrfx_rtc_config_t const * p_config,
                         nrfx_rtc_handler_t        handler)
    */
    err_code = nrf_drv_rtc_init(&rtc, &config, rtc_handler);//回调事件
    APP_ERROR_CHECK(err_code);

    //void nrfx_rtc_tick_enable(nrfx_rtc_t const * const p_instance, bool enable_irq)
    nrf_drv_rtc_tick_enable(&rtc,true);

    /*
    将比较通道设置为在COMPARE_COUNTERTIME秒后触发中断
    nrfx_err_t nrfx_rtc_cc_set(nrfx_rtc_t const * const p_instance,
                           uint32_t channel,
                           uint32_t val,
                           bool enable_irq)
    */
    err_code = nrf_drv_rtc_cc_set(&rtc,0,COMPARE_COUNTERTIME * 8,true);
    APP_ERROR_CHECK(err_code);

    //启动RTC实例
    nrf_drv_rtc_enable(&rtc);
}
```
### OVRFLW EVENT
溢出次数是固定的 16次， 所以可以根据修改频率来获取自己需要的时间
#### 寄存器
```c
//..定义
#define LFCLK_FREQUENCY           (32768UL)                               /**< LFCLK频率为HZ. */
#define RTC_FREQUENCY             (8UL)                                   /**< 所需的RTC工作时钟 RTC_FREQUENCY 为HZ. */
#define COUNTER_PRESCALER         ((LFCLK_FREQUENCY/RTC_FREQUENCY) - 1)   /* f = LFCLK/(prescaler + 1) */

/*低速时钟使能 ...*/
...

/** 
    功能，配置RTC溢出事件
 */
void rtc_config(void) {
    NVIC_EnableIRQ(RTC0_IRQn);  
    NRF_RTC0->PRESCALER  = COUNTER_PRESCALER;                   
    	
    NRF_RTC0->TASKS_TRIGOVRFLW=1;//触发溢出任务,0xfffff0
    // 使能溢出通道和溢出中断
    NRF_RTC0->EVTENSET      = RTC_EVTENSET_OVRFLW_Msk;
    NRF_RTC0->INTENSET      = RTC_INTENSET_OVRFLW_Msk;
}
/*
中断
*/
void RTC0_IRQHandler() {
    if ((NRF_RTC0->EVENTS_OVRFLW!= 0) && 
        ((NRF_RTC0->INTENSET & RTC_INTENSET_OVRFLW_Msk) != 0)){
			NRF_RTC0->EVENTS_OVRFLW = 0;//清除事件
			NRF_RTC0->TASKS_TRIGOVRFLW=1;//重新触发溢出
			LED1_Toggle();//led灯翻转
    }
}
```
#### 库函数
```c
/** 配置溢出中断事件
 */
static void rtc_handler(nrf_drv_rtc_int_type_t int_type) {
    if (int_type == NRF_DRV_RTC_INT_OVERFLOW){
		nrf_gpio_pin_toggle(BSP_LED_0);
		nrf_rtc_task_trigger(rtc.p_reg,NRF_RTC_TASK_TRIGGER_OVERFLOW);//重新触发一次溢出事件
    }
}

/** RTC配置函数
 */
static void rtc_config(void) {
	uint32_t err_code;	
	//初始化RTC
	nrf_drv_rtc_config_t config = NRF_DRV_RTC_DEFAULT_CONFIG;
	config.prescaler = 4095;
	err_code = nrf_drv_rtc_init(&rtc, &config, rtc_handler);
	APP_ERROR_CHECK(err_code);

	nrf_rtc_task_trigger(rtc.p_reg,NRF_RTC_TASK_TRIGGER_OVERFLOW);//触发溢出事件
	//使能溢出通道和溢出中断
	nrf_drv_rtc_overflow_enable(&rtc,true);
	APP_ERROR_CHECK(err_code);
	
	//使能RTC模块
	nrf_drv_rtc_enable(&rtc);

}
```