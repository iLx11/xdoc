## 读取 STS31 传感器温度
### 使用APP_TIMER, SCHEDULER, TWI_MNGR 库函数
#### include
```c
#include "app_error.h"
#include "app_timer.h"
#include "app_scheduler.h"
#include "app_util_platform.h"
#include "compiler_abstraction.h"
#include "nrf_drv_clock.h"
#include "nrf_pwr_mgmt.h"
#include "nrf_twi_mngr.h"
#include "sts31.h"
#include <stdio.h>

#include "nrf_log.h"
#include "nrf_log_ctrl.h"
#include "nrf_log_default_backends.h"
```
#### define
```c
#define TWI_INSTANCE_ID 0

#define MAX_PENDING_TRANSACTIONS 5

#define SCHED_MAX_EVENT_DATA_SIZE APP_TIMER_SCHED_EVENT_DATA_SIZE

#define SCHED_QUEUE_SIZE 10

NRF_TWI_MNGR_DEF(m_nrf_twi_mngr, MAX_PENDING_TRANSACTIONS, TWI_INSTANCE_ID);
APP_TIMER_DEF(test_timer);

static uint8_t read_trans[2] = { ((STS31_FETCH_DATA >> 8) & 0xFF),
                                 STS31_FETCH_DATA & 0xFF };
uint8_t read_buff[3] = { 0 };
```
### 程序
```c
// 数据读取回调
static void read_data_callback(ret_code_t result, void *p_user_data)
{
    // if (result != NRF_SUCCESS) {
    //   NRF_LOG_WARNING("read data error code ->  %d", (int)result);
    //   // return;
    // }
    float data = 0;
    data = (-45 + 175 * (read_buff[0] * 256 + read_buff[1]) / 65535.0);
    // NRF_LOG_DEBUG("STS31 READ_BUFF:");
    // NRF_LOG_HEXDUMP_DEBUG(read_buff, 3);
    NRF_LOG_INFO("THE TEMPERATURE IS -> " NRF_LOG_FLOAT_MARKER "\r\n",
                 NRF_LOG_FLOAT(data));
}

// 数据读取
static void read_data(void)
{
    static nrf_twi_mngr_transfer_t const transfers[] = { STS31_READ(
        read_trans, read_buff) };
    static nrf_twi_mngr_transaction_t NRF_TWI_MNGR_BUFFER_LOC_IND
        transaction = { .callback = read_data_callback,
                        .p_user_data = NULL,
                        .p_transfers = transfers,
                        .number_of_transfers =
                            sizeof(transfers) / sizeof(transfers[0]) };
    APP_ERROR_CHECK(nrf_twi_mngr_schedule(&m_nrf_twi_mngr, &transaction));
}

// TWI 初始化
static void twi_config(void)
{
    uint32_t err_code;

    nrf_drv_twi_config_t const config = { .scl = STS31_SCL_PIN,
                                          .sda = STS31_SDA_PIN,
                                          .frequency = NRF_DRV_TWI_FREQ_100K,
                                          .interrupt_priority =
                                              APP_IRQ_PRIORITY_LOWEST,
                                          .clear_bus_init = false };

    err_code = nrf_twi_mngr_init(&m_nrf_twi_mngr, &config);
    APP_ERROR_CHECK(err_code);
}

static void lfclk_config(void)
{
	uint32_t err_code;
    err_code = nrf_drv_clock_init();
    APP_ERROR_CHECK(err_code);

    nrf_drv_clock_lfclk_request(NULL);
}

void timmer_callback(void *p_context)
{
    // 读取数据
    read_data();
    // NRF_LOG_INFO("APP TIMMER RUNNING..");
}

// 定时器初始化
static void timer_init(void)
{
    uint32_t err_code;
    err_code = app_timer_init();
    APP_ERROR_CHECK(err_code);
    // 创建一个定时器（时钟 id， 时钟模式，
    err_code =
        app_timer_create(&test_timer, APP_TIMER_MODE_REPEATED, timmer_callback);
    APP_ERROR_CHECK(err_code);
    // Start repeated timer (start blinking LED).
    err_code = app_timer_start(test_timer, APP_TIMER_TICKS(1000), NULL);
}

// 数据读取初始化
void read_init(void)
{
    // 传感器模式初始化
    // sts31_init();

    timer_init();
}

void log_init(void)
{
    ret_code_t err_code;

    err_code = NRF_LOG_INIT(NULL);
    APP_ERROR_CHECK(err_code);

    NRF_LOG_DEFAULT_BACKENDS_INIT();
}

int main(void)
{
    ret_code_t err_code;

    lfclk_config();
    log_init();
    err_code = nrf_pwr_mgmt_init();
    APP_ERROR_CHECK(err_code);
    
    twi_config();
    read_init();
    APP_SCHED_INIT(SCHED_MAX_EVENT_DATA_SIZE, SCHED_QUEUE_SIZE);

    APP_ERROR_CHECK(nrf_twi_mngr_perform(&m_nrf_twi_mngr, NULL,
                                         sts31_init_transfers, 1, NULL));

	NRF_LOG_RAW_INFO(
        "\r\nTWI sts31 data test start -------------------------. \r\n");
    NRF_LOG_FLUSH();
    
    while (true) {
        app_sched_execute();
        nrf_pwr_mgmt_run();
        NRF_LOG_FLUSH();
    }
}
```