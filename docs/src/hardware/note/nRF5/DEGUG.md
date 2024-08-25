`APP_ERROR_CHECK` 是nRF5 SDK定义的一个用来检查API返回值是否正确的函数，在nRF5 SDK中，NRF_SUCCESS（0）为正确返回值，其它返回值皆为错误值。nRF5 SDK所有协议栈API调用，以及SDK库函数调用，都会用APP_ERROR_CHECK去检查调用的返回值。当出现非法调用时，比如传入的实参不对，API返回值就不会为NRF_SUCCESS，此时APP_ERROR_CHECK就会派上大用场。
APP_ERROR_CHECK行为**受宏DEBUG和有没有挂仿真器两个因素的影响，当没有定义DEBUG宏时，系统将直接产生软复位；当定义了DEBUG宏并且没有挂仿真器时，系统将把错误信息保存在call stack中**。不管怎么配置，APP_ERROR_CHECK都会把相应的错误信息打印出来，以方便你去排查问题，如下所示。通过打印出来的错误信息，你就可以知道是哪个文件哪一行代码出了什么类型的错误。
## LOG
**日志打印（log）模块**是分析程序流程和程序Bug的重要手段，嵌入式软件开发中，一般使用自己封装的Log程序模块，而不会使用printf函数输出信息，原因如下：
可以在Log中封装数据流的接口，从而根据需求打印到各种终端，如下
（1）：UART接口设备，可通过UART打印。
（2）：显示屏设备，可以通过显示屏显示。
（3）：用Jlink仿真器时，可通过Jlink RTT打印。
### 包含
```c
#include "nrf_log.h"
#include "nrf_log_ctrl.h"
#include "nrf_log_default_backends.h"
```
### makefile
```makefile
INC_FOLDERS += \
	$(SDK_ROOT)/components/libraries/log \
	$(SDK_ROOT)/external/segger_rtt \
	$(SDK_ROOT)/components/libraries/log/src \
	$(SDK_ROOT)/external/fprintf \
	$(SDK_ROOT)/components/libraries/memobj \
	$(SDK_ROOT)/components/libraries/balloc \

SRC_FILES += \
	$(SDK_ROOT)/external/segger_rtt/SEGGER_RTT.c \
	$(SDK_ROOT)/external/segger_rtt/SEGGER_RTT_Syscalls_GCC.c \
	$(SDK_ROOT)/external/segger_rtt/SEGGER_RTT_printf.c \
	$(SDK_ROOT)/components/libraries/log/src/nrf_log_backend_rtt.c \
	$(SDK_ROOT)/components/libraries/log/src/nrf_log_backend_serial.c \
	$(SDK_ROOT)/components/libraries/log/src/nrf_log_backend_uart.c \
	$(SDK_ROOT)/components/libraries/log/src/nrf_log_default_backends.c \
	$(SDK_ROOT)/components/libraries/log/src/nrf_log_frontend.c \
	$(SDK_ROOT)/components/libraries/log/src/nrf_log_str_formatter.c \
	$(SDK_ROOT)/modules/nrfx/drivers/src/nrfx_uart.c \
	$(SDK_ROOT)/modules/nrfx/drivers/src/nrfx_uarte.c \
	$(SDK_ROOT)/integration/nrfx/legacy/nrf_drv_uart.c \
	$(SDK_ROOT)/components/libraries/memobj/nrf_memobj.c \
	$(SDK_ROOT)/components/libraries/util/app_error_weak.c \
	$(SDK_ROOT)/components/libraries/balloc/nrf_balloc.c \
```
### sdk_config.c
#### RTT 宏
```c
//==========================================================
// <e> NRF_LOG_BACKEND_RTT_ENABLED - nrf_log_backend_rtt - Log RTT backend
//==========================================================
#ifndef NRF_LOG_BACKEND_RTT_ENABLED
#define NRF_LOG_BACKEND_RTT_ENABLED 1
#endif
// <o> NRF_LOG_BACKEND_RTT_TEMP_BUFFER_SIZE - Size of buffer for partially processed strings. 
// <i> Size of the buffer is a trade-off between RAM usage and processing.
// <i> if buffer is smaller then strings will often be fragmented.
// <i> It is recommended to use size which will fit typical log and only the
// <i> longer one will be fragmented.

#ifndef NRF_LOG_BACKEND_RTT_TEMP_BUFFER_SIZE
#define NRF_LOG_BACKEND_RTT_TEMP_BUFFER_SIZE 64
#endif

// <o> NRF_LOG_BACKEND_RTT_TX_RETRY_DELAY_MS - Period before retrying writing to RTT 
#ifndef NRF_LOG_BACKEND_RTT_TX_RETRY_DELAY_MS
#define NRF_LOG_BACKEND_RTT_TX_RETRY_DELAY_MS 1
#endif

// <o> NRF_LOG_BACKEND_RTT_TX_RETRY_CNT - Writing to RTT retries. 
// <i> If RTT fails to accept any new data after retries
// <i> module assumes that host is not active and on next
// <i> request it will perform only one write attempt.
// <i> On successful writing, module assumes that host is active
// <i> and scheme with retry is applied again.

#ifndef NRF_LOG_BACKEND_RTT_TX_RETRY_CNT
#define NRF_LOG_BACKEND_RTT_TX_RETRY_CNT 3
#endif

// </e>
```
#### UART
```c
// <e> NRF_LOG_BACKEND_UART_ENABLED - nrf_log_backend_uart - Log UART backend
//==========================================================
#ifndef NRF_LOG_BACKEND_UART_ENABLED
#define NRF_LOG_BACKEND_UART_ENABLED 1
#endif
// <o> NRF_LOG_BACKEND_UART_TX_PIN - UART TX pin 
#ifndef NRF_LOG_BACKEND_UART_TX_PIN
#define NRF_LOG_BACKEND_UART_TX_PIN 6
#endif

// <o> NRF_LOG_BACKEND_UART_BAUDRATE  - Default Baudrate
 
// <323584=> 1200 baud 
// <643072=> 2400 baud 
// <1290240=> 4800 baud 
// <2576384=> 9600 baud 
// <3862528=> 14400 baud 
// <5152768=> 19200 baud 
// <7716864=> 28800 baud 
// <10289152=> 38400 baud 
// <15400960=> 57600 baud 
// <20615168=> 76800 baud 
// <30801920=> 115200 baud 
// <61865984=> 230400 baud 
// <67108864=> 250000 baud 
// <121634816=> 460800 baud 
// <251658240=> 921600 baud 
// <268435456=> 1000000 baud 

#ifndef NRF_LOG_BACKEND_UART_BAUDRATE
#define NRF_LOG_BACKEND_UART_BAUDRATE 30801920
#endif

// <o> NRF_LOG_BACKEND_UART_TEMP_BUFFER_SIZE - Size of buffer for partially processed strings. 
// <i> Size of the buffer is a trade-off between RAM usage and processing.
// <i> if buffer is smaller then strings will often be fragmented.
// <i> It is recommended to use size which will fit typical log and only the
// <i> longer one will be fragmented.

#ifndef NRF_LOG_BACKEND_UART_TEMP_BUFFER_SIZE
#define NRF_LOG_BACKEND_UART_TEMP_BUFFER_SIZE 64
#endif

// </e>
```
### 日志级别
为了使打印的日志更具有针对性，比如只打印错误部分日志，或者只打印警告部分日志，日志级别便应运而生
nRF52832日志级别分为5个等级，设置在”sdk_config.h“中定义，如下图：	
- Off：		关闭日志输出
- Error：		只输出错误信息，对应的Log输出函数为 ” NRF_LOG_ERROR “
- Warning：	只输出警告信息，对应的Log输出函数为 ” NRF_LOG_WARNING “
- Info：		只输出基本信息，对应的Log输出函数为 ” NRF_LOG_INFO “
- Debug：		只输出调试信息，对应的Log输出函数为 ” NRF_LOG_DEBUG “
日志级别举例：
- 选择 Off 时，全部不打印
- 选择 Warning 时，只打印 Error， Warning 信息
- 选择 Debug 时，全部打印
### 更改日志级别
#### sdk_config.c
```c
// <0=> Off 
// <1=> Error 
// <2=> Warning 
// <3=> Info 
// <4=> Debug 

#ifndef NRF_LOG_DEFAULT_LEVEL
#define NRF_LOG_DEFAULT_LEVEL 4
#endif

// 使用
NRF_LOG_DEBUG()
NRF_LOG_INFO() ...
```
### 初始化 LOG 
```c
static void log_init(void) {
    ret_code_t err_code = NRF_LOG_INIT(NULL);
    APP_ERROR_CHECK(err_code);
    NRF_LOG_DEFAULT_BACKENDS_INIT();
}
```
### LOG 打印时间戳
This will achieve adding time-stamps to NRF logs, in some of the nRF example applications.

1. Add this to main .c

```c
uint32_t get_rtc_counter(void)
{
    return NRF_RTC1->COUNTER;
}
```
2. Change this in main.c
```c
uint32_t err_code = NRF_LOG_INIT();

// turn TASKS_START into 1
NRF_RTC1->TASKS_START = 1;
```
to this
```c
uint32_t err_code = NRF_LOG_INIT(get_rtc_counter);
```
3. Change sdk_config.h

from this
```c
#define NRF_LOG_USES_TIMESTAMP 0
```
to this
```c
#define NRF_LOG_USES_TIMESTAMP 1
```

### 打印输出浮点数 (float)
```c

#define NRF_LOG_FLOAT_MARKER "%s%d.%02d"

NRF_LOG_INFO("My float number: " NRF_LOG_FLOAT_MARKER "\r\n", NRF_LOG_FLOAT(f));
```