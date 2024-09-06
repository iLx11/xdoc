FreeRTOS 是一个`可裁剪、可剥夺型的多任务内核`，而且`没有任务数限制`。FreeRTOS 提供了实时操作系统所需的所有功能，包括资源管理、同步、任务通信等。

FreeRTOS 是用 C 和汇编来写的，其中绝大部分都是用 C 语言编写的，只有极少数的与处理器密切相关的部分代码才是用汇编写的，FreeRTOS 结构简洁，可读性很强！最主要的是非常适合初次接触嵌入式实时操作系统学生、嵌入式系统开发人员和爱好者学习。

使用版本 `V9.0.0`，因为内核很稳定，并且网上资料很多，因为 V10.0.0 版本之后是亚马逊收购了FreeRTOS之后才出来的版本，主要添加了一些云端组件，一般采用 V9.0.0 版本足以。

 FreeRTOS 的名字，可以分为两部分:Free 和 RTOS，Free 就是免费的、自由的、 不受约束的意思，RTOS 全称是 Real Time Operating System，中文名就是实时操作系统。可以看 出 FreeROTS 就是一个免费的 RTOS 类系统。这里要注意，RTOS 不是指某一个确定的系统，而 是指一类系统。比如 UCOS，FreeRTOS，RTX，RT-Thread 等这些都是 RTOS 类操作系统。 

操作系统允许多个任务同时运行，这个叫做多任务，实际上，一个处理器核心在某一时刻 只能运行一个任务。操作系统中任务调度器的责任就是决定在某一时刻究竟运行哪个任务，任 务调度在各个任务之间的切换非常快！这就给人们造成了同一时刻有多个任务同时运行的错觉。 

FreeRTOS 是 RTOS 系统的一种，FreeRTOS 十分的小巧，可以在资源有限的微控制器中运 行，当然了，FreeRTOS 不仅局限于在微控制器中使用。但从文件数量上来看 FreeRTOS 要比 UCOSII 和 UCOSIII 小的多。  



# 移植
## Deme 
FreeRTOS 的相关例程

需要里面的  `FreeRTOSConfig.h` 文件

![](https://cdn.nlark.com/yuque/0/2024/png/25850055/1705044896586-c81fd625-c230-4a4a-9ae2-c866f4541d10.png)

##  License
这个文件夹里面就是相关的许可信息，要用 FreeRTOS 做产品的得仔细看看，尤其是要出口的产品。  

##  Source  
 FreeRTOS 的源码文件  

####  -> portable，只需要以下几个文件夹
`KEIL` ->  使用 MDK 编译环境所需文件，也是指向 RVDS 文件夹，也可以删除

`MemMang` -> 内存管理相关文件，移植所必须，里面有不同的内存管理方式，一般选择 `heap_4.c`

`RVDS` -> 使用 MDK 编译环境所需文件， RVDS 文件夹针对不同的架构的 MCU 做了详细的分类，找到对应的 `port.c`



# HAL 库
固件库

[https://www.cnblogs.com/guyandianzi/p/12936899.html](https://www.cnblogs.com/guyandianzi/p/12936899.html)

## 在 FreeRTOSConfig.h 中末尾加入
```c
#define vPortSVCHandler SVC_Handler
#define xPortPendSVHandler PendSV_Handler
#define xPortSysTickHandler SysTick_Handler
```



## 修改 stm32f4xx_it.c
#### 注释以下函数
```c
void SVC_Handler(void);
void PendSV_Handler(void);
void SysTick_Handler(void);
```

#### 因为 freertos 占用了 systick， 所以使用 tim1（可更换）作为系统时钟源
```c
// 重写 tick 函数
HAL_StatusTypeDef HAL_InitTick(uint32_t TickPriority) {
    RCC_ClkInitTypeDef clkconfig;
    uint32_t uwTimclock = 0U;

    uint32_t uwPrescalerValue = 0U;
    uint32_t pFLatency;
    HAL_StatusTypeDef status;

    /* Enable TIM1 clock */
    __HAL_RCC_TIM1_CLK_ENABLE();

    /* Get clock configuration */
    HAL_RCC_GetClockConfig(&clkconfig, &pFLatency);

    /* Compute TIM1 clock */
    uwTimclock = 2 * HAL_RCC_GetPCLK2Freq();

    /* Compute the prescaler value to have TIM1 counter clock equal to 1MHz */
    uwPrescalerValue = (uint32_t) ((uwTimclock / 1000000U) - 1U);

    /* Initialize TIM1 */
    htim1.Instance = TIM1;

    /* Initialize TIMx peripheral as follow:
    + Period = [(TIM1CLK/1000) - 1]. to have a (1/1000) s time base.
    + Prescaler = (uwTimclock/1000000 - 1) to have a 1MHz counter clock.
    + ClockDivision = 0
    + Counter direction = Up
    */
    htim1.Init.Period = (1000000U / 1000U) - 1U;
    htim1.Init.Prescaler = uwPrescalerValue;
    htim1.Init.ClockDivision = 0;
    htim1.Init.CounterMode = TIM_COUNTERMODE_UP;
    htim1.Init.AutoReloadPreload = TIM_AUTORELOAD_PRELOAD_DISABLE;

    status = HAL_TIM_Base_Init(&htim1);
    if (status == HAL_OK) {
        /* Start the TIM time Base generation in interrupt mode */
        status = HAL_TIM_Base_Start_IT(&htim1);
        if (status == HAL_OK) {
            /* Enable the TIM1 global Interrupt */
            HAL_NVIC_EnableIRQ(TIM1_UP_TIM10_IRQn);
            /* Configure the SysTick IRQ priority */
            if (TickPriority < (1UL << __NVIC_PRIO_BITS)) {
                /* Configure the TIM IRQ priority */
                HAL_NVIC_SetPriority(TIM1_UP_TIM10_IRQn, TickPriority, 0U);
                uwTickPrio = TickPriority;
            } else {
                status = HAL_ERROR;
            }
        }
    }
}

void TIM1_UP_TIM10_IRQHandler(void) {
    /* USER CODE BEGIN TIM1_UP_TIM10_IRQn 0 */
    HAL_IncTick();
    /* USER CODE END TIM1_UP_TIM10_IRQn 0 */
    HAL_TIM_IRQHandler(&htim1);
    /* USER CODE BEGIN TIM1_UP_TIM10_IRQn 1 */
    /* USER CODE END TIM1_UP_TIM10_IRQn 1 */
}
```



