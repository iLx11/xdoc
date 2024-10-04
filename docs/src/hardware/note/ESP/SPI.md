```C
#include "spi2.h"

#include <stdio.h>

#include "driver/gpio.h"
#include "driver/spi_master.h"
#include "esp_log.h"

static const char *TAG = "spi2";

static spi_device_handle_t spi;

// 初始化 SPI 总线
void spi_device_init(void) {
  spi_bus_config_t buscfg = {
      .miso_io_num = PIN_NUM_MISO,
      .mosi_io_num = PIN_NUM_MOSI,
      .sclk_io_num = PIN_NUM_CLK,
      .quadwp_io_num = -1,     // 不使用 Quad SPI
      .quadhd_io_num = -1,     // 不使用 Quad SPI
      .max_transfer_sz = 4096  // 最大传输字节数
  };

  // 初始化 SPI 总线
  esp_err_t ret = spi_bus_initialize(SPI2_HOST, &buscfg, 1);  // DMA 通道
  if (ret != ESP_OK) {
    ESP_LOGI(TAG, "Failed to initialize SPI bus");
  } else {
    ESP_LOGI(TAG, "SPI bus initialized successfully");
  }

  // 配置 SPI 设备并添加到总线上
  spi_device_interface_config_t devcfg = {
      .clock_speed_hz = 10 * 1000 * 1000,  // 时钟速度 10 MHz
      .mode = 0,                           // SPI 模式 0
      .spics_io_num = PIN_NUM_CS,          // CS 引脚
      .queue_size = 7,                     // 事务队列大小
      .flags = SPI_DEVICE_HALFDUPLEX,      // 半双工模式
  };

  // 将设备添加到总线上
  esp_err_t ret = spi_bus_add_device(SPI2_HOST, &devcfg, &spi);
  if (ret != ESP_OK) {
    ESP_LOGE(TAG, "Failed to add device to SPI bus");
  } else {
    ESP_LOGI(TAG, "SPI device added successfully");
  }
}

// 发送并接收数据
void spi_transaction(spi_device_handle_t spi) {
  // 设置要发送的数据
  uint8_t tx_data[] = {0x9A, 0xBC, 0xDE, 0xF0};
  uint8_t rx_data[sizeof(tx_data)] = {0};

  spi_transaction_t trans = {
      .length = 8 * sizeof(tx_data),  // 数据位长度
      .tx_buffer = tx_data,           // 发送缓冲区
      .rx_buffer = rx_data,           // 接收缓冲区
  };

  // 执行 SPI 事务
  esp_err_t ret = spi_device_transmit(spi, &trans);
  //   esp_err_t ret = spi_device_polling_transmit(spi, &trans);
  if (ret == ESP_OK) {
    ESP_LOGI(TAG, "SPI transaction completed successfully");
    ESP_LOG_BUFFER_HEX("Received", rx_data, sizeof(rx_data));
  } else {
    ESP_LOGE(TAG, "SPI transaction failed");
  }
}

void spi_func_test(void) {
  spi_device_init();
  init_spi_device();
}
```

