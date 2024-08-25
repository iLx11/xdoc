PPI（Programmable Peripheral Interconnect），可编程外设互联，是将不同外设“连接”在一起，让他们协同工作的机制。PPI 是 nRF52832 一个很重要的功能，通过 PPI，我们可以将各种不同的外设“连接”在一起，让它们在无需在 CPU 参与的情况下自动工作。nRF52832 的PPI 主要的链接对象是 任务和事件。
**PPI 的两端一端链接的是事件端点（EEP），一端链接的是任务端点（TEP）**。**因此PPI可以通过一个外设上发生的事件自动的触发另一个外设上的任务**。
外设事件需要通过与事件相关的 寄存器地址 连接到一个事件端点（EEP）,另一端的外设任务事件通过此任务寄存器地址 连接到一个任务端点（TEP），然后PPI就能够自动触发
- PPI 通过PPI通道，一端接事件，一端接任务。 由事件触发任务。  
- PPI一共32个通道，可编程通道为 0~ 19， 20个。还有12个 固定的 预编程通道：
- PPI 通道组 group.6 个通道， 把不同的通道集合组里，进行统一管理。
- fork 从任务： 一个PPI通道触发的任务可以有2个，主任务 CH[n].TEP 和 从任务 FORK[n].TEP。
**CHEN 和CHENSET寄存器，都可以写1 Enable PPI通道，效果是一样的**
## PPI通道配置
#### PPI GPIOTE 的使用（寄存器版本）：
```c
static void gpiote_init(void) {
	nrf_gpio_cfg_input(BSP_BUTTON_0,NRF_GPIO_PIN_PULLUP);//设置管脚位上拉输入

	NRF_GPIOTE->CONFIG[0] =  (GPIOTE_CONFIG_POLARITY_HiToLo << GPIOTE_CONFIG_POLARITY_Pos)//绑定GPIOTE通道0
	                         | (BSP_BUTTON_0<< GPIOTE_CONFIG_PSEL_Pos)  // 配置输入事件状态 
							 | (GPIOTE_CONFIG_MODE_Event << GPIOTE_CONFIG_MODE_Pos);//事件模式

  	NRF_GPIOTE->CONFIG[1] =  (GPIOTE_CONFIG_POLARITY_Toggle << GPIOTE_CONFIG_POLARITY_Pos)//绑定GPIOTE通道1
							 | (BSP_LED_0 << GPIOTE_CONFIG_PSEL_Pos) // 配置任务输出状态
							 | (GPIOTE_CONFIG_MODE_Task << GPIOTE_CONFIG_MODE_Pos);//任务模式					
}

void ppi_init(void) {
    // 配置PPI的端口，通道0一端接按键任务，另外一端接输出事件
    NRF_PPI->CH[0].EEP = (uint32_t)(&NRF_GPIOTE->EVENTS_IN[0]);//事件
    NRF_PPI->CH[0].TEP = (uint32_t)(&NRF_GPIOTE->TASKS_OUT[1]);//任务
 
    // 使能PPI的通道0
    NRF_PPI->CHEN = (PPI_CHEN_CH0_Enabled << PPI_CHEN_CH0_Pos);//使能第0通道
}

int main(void) {
	gpiote_init();
	ppi_init();
	while(1){
	}
}
```
#### PPI GPIOTE 的使用（库函数版本）：
（库函数的使用都得配置sdk_config.h文件）
```c
nrf_ppi_channel_t my_ppi_channel;

static void gpiote_init(void) {
    ret_code_t err_code;
    //初始化GPIOTE
    err_code = nrf_drv_gpiote_init();
    APP_ERROR_CHECK(err_code);

    nrf_drv_gpiote_out_config_t out_config =  GPIOTE_CONFIG_OUT_TASK_TOGGLE(true);
    //绑定输出端口
    err_code = nrf_drv_gpiote_out_init(PIN_OUT, &out_config);
    APP_ERROR_CHECK(err_code);
	  //配置为输出任务模式使能
	  nrf_drv_gpiote_out_task_enable(PIN_OUT); 

    nrf_drv_gpiote_in_config_t in_config = GPIOTE_CONFIG_IN_SENSE_HITOLO (true);
    in_config.pull = NRF_GPIO_PIN_PULLUP;
     //绑定输入端口
    err_code = nrf_drv_gpiote_in_init(PIN_IN, &in_config, NULL);
    APP_ERROR_CHECK(err_code);
     //配置输入事件使能
    nrf_drv_gpiote_in_event_enable(PIN_IN, true);										
}

void ppi_init(void) {
 ret_code_t err_code;
  
	//初始化PPI的模块
  err_code = nrf_drv_ppi_init();
  APP_ERROR_CHECK(err_code);

  /*
  nrfx_err_t nrfx_ppi_channel_alloc(nrf_ppi_channel_t * p_channel)
{
    nrfx_err_t err_code = NRFX_SUCCESS;
    nrf_ppi_channel_t channel;
    uint32_t mask = 0;
    err_code = NRFX_ERROR_NO_MEM;

    mask = NRFX_PPI_PROG_APP_CHANNELS_MASK;
    for (channel = NRF_PPI_CHANNEL0;
         mask != 0;
         mask &= ~nrfx_ppi_channel_to_mask(channel), channel++)//自动从通道0开始寻找通道，找到没使用的
    {
        NRFX_CRITICAL_SECTION_ENTER();
        if ((mask & nrfx_ppi_channel_to_mask(channel)) && (!is_allocated_channel(channel)))
        {
            channel_allocated_set(channel);
            *p_channel = channel;
            err_code   = NRFX_SUCCESS;
        }
        NRFX_CRITICAL_SECTION_EXIT();
        if (err_code == NRFX_SUCCESS)
        {
            NRFX_LOG_INFO("Allocated channel: %d.", channel);
            break;
        }
    }

    NRFX_LOG_INFO("Function: %s, error code: %s.", __func__, NRFX_LOG_ERROR_STRING_GET(err_code));
    return err_code;
}
  */
  err_code = nrfx_ppi_channel_alloc(&my_ppi_channel);

  APP_ERROR_CHECK(err_code);
  //设置PPI通道my_ppi_channel的EEP和TEP 两端对应的硬件
  //nrfx_err_t nrfx_ppi_channel_assign(nrf_ppi_channel_t channel, uint32_t eep, uint32_t tep)
  err_code = nrfx_ppi_channel_assign(my_ppi_channel,
                                     nrfx_gpiote_in_event_addr_get(PIN_IN),
                                     nrfx_gpiote_out_task_addr_get(PIN_OUT));
  APP_ERROR_CHECK(err_code);
  //使能PPI通道
  err_code = nrfx_ppi_channel_enable(my_ppi_channel);
  APP_ERROR_CHECK(err_code);	
}
```
## PPI group 的使用

通过 CHG[n] 寄存器配置组绑定的通道：
```c
// 把通道0和通道1 绑定到PPI group0之上  
NRF_PPI->CHG[0] = 0x03;
```
### 寄存器版本
```c
...//gpiote_init
void ppi_init(void) {
    // 配置PPI通道0，一端接GPIOTE事件0，一端接GPIOTE任务1
    NRF_PPI->CH[0].EEP = (uint32_t)(&NRF_GPIOTE->EVENTS_IN[0]);
    NRF_PPI->CH[0].TEP = (uint32_t)(&NRF_GPIOTE->TASKS_OUT[1]);
	 // 配置PPI通道1，一端接GPIOTE事件2，一端接GPIOTE任务3
	NRF_PPI->CH[1].EEP = (uint32_t)(&NRF_GPIOTE->EVENTS_IN[2]);
    NRF_PPI->CH[1].TEP = (uint32_t)(&NRF_GPIOTE->TASKS_OUT[3]);
    //把通道0和通道1 绑定到PPI group0之上
	NRF_PPI->CHG[0]=0x03;	
}
/*通过按钮来管理组的开启与关闭*/
int main(void) {    
	gpiote_init();
	ppi_init();
	KEY_Init();
	LED_Init();
	LED3_Close();
	LED4_Close();
    while (true) {
        if( KEY3_Down()== 0) {
			LED4_Close();
		 	NRF_PPI->TASKS_CHG[0].EN = 1;//使能PPI group0
			LED3_Toggle();
		} 
		if( KEY4_Down()== 0) { 
			LED3_Close();
			NRF_PPI->TASKS_CHG[0].DIS = 1;//关闭PPI group0
			LED4_Toggle();
    	}
	}
}
```
### 库函数版本
```c
nrf_ppi_channel_t my_ppi_channel1;
nrf_ppi_channel_t my_ppi_channel2;
nrf_ppi_channel_group_t qf_ppi_group;
...
void ppi_init(void) {
 ret_code_t err_code;
  
	//初始化PPI的模块
  err_code = nrf_drv_ppi_init();
  APP_ERROR_CHECK(err_code);

  //配置PPI的频道
  err_code = nrfx_ppi_channel_alloc(&my_ppi_channel1);

  APP_ERROR_CHECK(err_code);
  //设置PPI通道my_ppi_channel的EEP和TEP 两端对应 输出任务1和输入事件3
  err_code = nrfx_ppi_channel_assign(my_ppi_channel1,
                                     nrfx_gpiote_in_event_addr_get(BSP_BUTTON_0),
                                     nrfx_gpiote_out_task_addr_get(LED_1));
	APP_ERROR_CHECK(err_code);
	
 //配置PPI的频道
  err_code = nrfx_ppi_channel_alloc(&my_ppi_channel2);
  APP_ERROR_CHECK(err_code);
	
  //设置PPI通道my_ppi_channel的EEP和TEP 两端对应 输出任务2和输入事件4
  err_code = nrfx_ppi_channel_assign(my_ppi_channel2,
                                     nrfx_gpiote_in_event_addr_get(BSP_BUTTON_1),
                                     nrfx_gpiote_out_task_addr_get(LED_2));
  APP_ERROR_CHECK(err_code);
	 
	//申请PPI组，分配的组号保存到my_ppi_group
  err_code = nrfx_ppi_group_alloc(&qf_ppi_group);
  APP_ERROR_CHECK(err_code);	
		
  //PPI通道my_ppi_channel加入到PPI组my_ppi_group
  err_code = nrfx_ppi_channel_include_in_group(my_ppi_channel1,qf_ppi_group);
  APP_ERROR_CHECK(err_code);
  //PPI通道my_ppi_channel2加入到PPI组my_ppi_group
  err_code = nrfx_ppi_channel_include_in_group(my_ppi_channel2,qf_ppi_group);
  APP_ERROR_CHECK(err_code);			
}

int main(void) {  
	ret_code_t err_code; 
	gpiote_init();
	ppi_init();
	qf_led_key_init();
    while (true)
    {
     if(nrf_gpio_pin_read(BUTTON_3) == 0)
     {
        nrf_gpio_pin_clear(LED_3);
        nrf_gpio_pin_set(LED_4);
        while(nrf_gpio_pin_read(BUTTON_3) == 0){}//等待按键释放
        //使能PPI组my_ppi_group
        err_code = nrfx_ppi_group_enable(qf_ppi_group);
        APP_ERROR_CHECK(err_code);
     }
     if(nrf_gpio_pin_read(BUTTON_4) == 0)
     {
        //D4点亮，D3熄灭，指示：PPI组禁止
        nrf_gpio_pin_clear(LED_4);
        nrf_gpio_pin_set(LED_3);
        while(nrf_gpio_pin_read(BUTTON_4) == 0){}//等待按键释放
        //禁止PPI组my_ppi_group
        err_code = nrfx_ppi_group_disable(qf_ppi_group);
        APP_ERROR_CHECK(err_code);
     }
    }
}
```
## PPI FORK
### 寄存器版本
```c
...//gpiote_init
void ppi_init(void) {
    // 配置PPI一端接输入事件0，一端接输出任务1
    NRF_PPI->CH[0].EEP = (uint32_t)(&NRF_GPIOTE->EVENTS_IN[0]);
    NRF_PPI->CH[0].TEP = (uint32_t)(&NRF_GPIOTE->TASKS_OUT[1]);
	  //输出端接通道0的fork分支端，在CH[0] TASKS_OUT[1]的基础上加上TASKS_OUT[2]
    NRF_PPI->FORK[0].TEP= (uint32_t)(&NRF_GPIOTE->TASKS_OUT[2]); 
    // 使能通道0
    NRF_PPI->CHEN = (PPI_CHEN_CH0_Enabled << PPI_CHEN_CH0_Pos);
}
...
while (true){
}
```
### 库函数版本
```c
//同最开始GPIOTE使用示例
void ppi_init(void) {
  ret_code_t err_code;  
  //初始化PPI的模块
  err_code = nrf_drv_ppi_init();
  APP_ERROR_CHECK(err_code);

  //配置PPI的频道
  err_code = nrfx_ppi_channel_alloc(&my_ppi_channel);

  APP_ERROR_CHECK(err_code);
  //设置PPI通道my_ppi_channel的EEP和TEP 两端对应的硬件
  err_code = nrfx_ppi_channel_assign(my_ppi_channel,
                                     nrfx_gpiote_in_event_addr_get(BSP_BUTTON_0),
                                     nrfx_gpiote_out_task_addr_get(BSP_LED_0));
  APP_ERROR_CHECK(err_code);
	
	//配置PPI通道0的分支任务端点
	//nrfx_err_t nrfx_ppi_channel_fork_assign(nrf_ppi_channel_t channel, uint32_t fork_tep)
  err_code = nrfx_ppi_channel_fork_assign(my_ppi_channel,
	                                             nrf_drv_gpiote_out_task_addr_get(BSP_LED_1));
  //使能PPI通道
  err_code = nrfx_ppi_channel_enable(my_ppi_channel);
  APP_ERROR_CHECK(err_code);	
}
```