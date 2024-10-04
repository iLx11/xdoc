```C
/********************************************************************************
 * @author: iLx1
 * @date: 2024-09-10 12:58:42
 * @filepath: \multi_pad_esp\hardware\usb_hw\usb_hw.c
 * @description: usb 硬件配置
 * @email: colorful_ilx1@163.com
 * @copyright: Copyright (c) iLx1, All Rights Reserved.
 ********************************************************************************/

#include "usb_hw.h"

#include <stdio.h>

#include "class/cdc/cdc_device.h"
#include "class/hid/hid_device.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "report_desc.h"
#include "sdkconfig.h"
#include "tinyusb.h"
#include "tusb_cdc_acm.h"

static const char *TAG = "cdc+hid";

// cdc 接收缓冲数组
static uint8_t cdc_rec_buff[CONFIG_TINYUSB_CDC_RX_BUFSIZE + 1];

/********************************************************************************
 * @brief: 字符串描述符
 ********************************************************************************/
static const char *hid_string_descriptor[6] = {
    // array of pointer to string descriptors
    (char[]){0x09, 0x04},  // 0: is supported language is English (0x0409)
    "TinyUSB",             // 1: Manufacturer
    "TinyUSB Device",      // 2: Product
    "123456",              // 3: Serials, should use chip ID
    "HID interface",       // 4: HID
    "My debugging CDC interface",  // 5: CDC
};

/********************************************************************************
 * @brief: 配置描述符
 ********************************************************************************/
static const uint8_t hid_configuration_descriptor[] = {
    // Configuration number, interface count, string index, total length,
    // attribute, power in mA
    TUD_CONFIG_DESCRIPTOR(1, 3, 0, TUSB_DESC_TOTAL_LEN,
                          TUSB_DESC_CONFIG_ATT_REMOTE_WAKEUP, 100),

    // Interface number, string index, boot protocol, report descriptor len, EP
    // In address, size & polling interval
    TUD_HID_DESCRIPTOR(0, 4, false, USBD_HID_REPORT_DESC_SIZE, EPNUM_HID, 16,
                       10),

    // Interface number, string index, EP notification address and size, EP data
    // address (out, in) and size.
    TUD_CDC_DESCRIPTOR(1, 5, EPNUM_CDC_NOTIF, 8, EPNUM_CDC_OUT, EPNUM_CDC_IN,
                       64),
};

/********************************************************************************
 * @brief: 获取报告描述符回调
 * @param {uint8_t} instance
 * @return {*}
 ********************************************************************************/
uint8_t const *tud_hid_descriptor_report_cb(uint8_t instance) {
  return hid_desc_report;
}

/********************************************************************************
 * @brief: 获取描述符回调
 * @return {*}
 ********************************************************************************/
uint16_t tud_hid_get_report_cb(uint8_t instance, uint8_t report_id,
                               hid_report_type_t report_type, uint8_t *buffer,
                               uint16_t reqlen) {
  (void)instance;
  (void)report_id;
  (void)report_type;
  (void)buffer;
  (void)reqlen;

  return 0;
}

/********************************************************************************
 * @brief: SET_REPORT 控制请求回调
 * @return {*}
 ********************************************************************************/
void tud_hid_set_report_cb(uint8_t instance, uint8_t report_id,
                           hid_report_type_t report_type, uint8_t const *buffer,
                           uint16_t bufsize) {}

/********************************************************************************
 * @brief: hid 初始化配置
 * @return {*}
 ********************************************************************************/
static void hid_device_init(void) {
  ESP_LOGI(TAG, "USB initialization");
  const tinyusb_config_t tusb_cfg = {
      .device_descriptor = NULL,
      .string_descriptor = hid_string_descriptor,
      .string_descriptor_count =
          sizeof(hid_string_descriptor) / sizeof(hid_string_descriptor[0]),
      .external_phy = false,
      .configuration_descriptor = hid_configuration_descriptor,
  };

  ESP_ERROR_CHECK(tinyusb_driver_install(&tusb_cfg));
  ESP_LOGI(TAG, "USB initialization DONE");
}

/********************************************************************************
 * @brief: 发送 HID 键盘数据
 * @return {*}
 ********************************************************************************/
static void app_send_hid_demo(void) {
  // 发送键盘按键
  ESP_LOGI(TAG, "Sending Keyboard report");
  uint8_t keycode[6] = {HID_KEY_A};
  tud_hid_keyboard_report(HID_ITF_PROTOCOL_KEYBOARD, 0, keycode);
  vTaskDelay(pdMS_TO_TICKS(50));
  tud_hid_keyboard_report(HID_ITF_PROTOCOL_KEYBOARD, 0, NULL);
}

/********************************************************************************
 * @brief: 接收数据回调
 * @param {int} itf
 * @param {cdcacm_event_t} *event
 * @return {*}
 ********************************************************************************/
static void tinyusb_cdc_rx_callback(int itf, cdcacm_event_t *event) {
  /* initialization */
  size_t rx_size = 0;

  /* read */
  esp_err_t ret = tinyusb_cdcacm_read(itf, cdc_rec_buff,
                                      CONFIG_TINYUSB_CDC_RX_BUFSIZE, &rx_size);
  if (ret == ESP_OK) {
    ESP_LOGI(TAG, "Data from channel %d:", itf);
    ESP_LOG_BUFFER_HEXDUMP(TAG, cdc_rec_buff, rx_size, ESP_LOG_INFO);
  } else {
    ESP_LOGE(TAG, "Read error");
  }

  /* write back */
  tinyusb_cdcacm_write_queue(itf, cdc_rec_buff, rx_size);
  tinyusb_cdcacm_write_flush(itf, 0);
}

/********************************************************************************
 * @brief: DTR RTS 变更
 * @param {int} itf
 * @param {cdcacm_event_t} *event
 * @return {*}
 ********************************************************************************/
static void tinyusb_cdc_line_state_changed_callback(int itf,
                                                    cdcacm_event_t *event) {
  int dtr = event->line_state_changed_data.dtr;
  int rts = event->line_state_changed_data.rts;
  ESP_LOGI(TAG, "Line state changed on channel %d: DTR:%d, RTS:%d", itf, dtr,
           rts);
}

/********************************************************************************
 * @brief: cdc 设备初始化
 * @return {*}
 ********************************************************************************/
void cdc_device_init(void) {
  tinyusb_config_cdcacm_t acm_cfg = {
      .usb_dev = TINYUSB_USBDEV_0,
      .cdc_port = TINYUSB_CDC_ACM_0,
      .rx_unread_buf_sz = 64,
      .callback_rx =
          &tinyusb_cdc_rx_callback,  // the first way to register a callback
      .callback_rx_wanted_char = NULL,
      .callback_line_state_changed = &tinyusb_cdc_line_state_changed_callback,
      .callback_line_coding_changed = NULL};

  ESP_ERROR_CHECK(tusb_cdc_acm_init(&acm_cfg));
  /* the second way to register a callback */
  ESP_ERROR_CHECK(tinyusb_cdcacm_register_callback(
      TINYUSB_CDC_ACM_0, CDC_EVENT_LINE_STATE_CHANGED,
      &tinyusb_cdc_line_state_changed_callback));

#if (CONFIG_TINYUSB_CDC_COUNT > 1)
  acm_cfg.cdc_port = TINYUSB_CDC_ACM_1;
  ESP_ERROR_CHECK(tusb_cdc_acm_init(&acm_cfg));
  ESP_ERROR_CHECK(tinyusb_cdcacm_register_callback(
      TINYUSB_CDC_ACM_1, CDC_EVENT_LINE_STATE_CHANGED,
      &tinyusb_cdc_line_state_changed_callback));
#endif
}

/********************************************************************************
 * @brief: usb 设备初始化
 * @return {*}
 ********************************************************************************/
void usb_device_init(void) {
  // 初始化 boot 按键
  const gpio_config_t boot_button_config = {
      .pin_bit_mask = BIT64(APP_BUTTON),
      .mode = GPIO_MODE_INPUT,
      .intr_type = GPIO_INTR_DISABLE,
      .pull_up_en = true,
      .pull_down_en = false,
  };
  ESP_ERROR_CHECK(gpio_config(&boot_button_config));
  hid_device_init();
  cdc_device_init();

  while (1) {
    // 判断 tinyusb 挂载
    if (tud_mounted()) {
      static bool send_hid_data = true;
      if (send_hid_data) {
        app_send_hid_demo();
      }
      send_hid_data = !gpio_get_level(APP_BUTTON);
    }
    vTaskDelay(pdMS_TO_TICKS(100));
  }
}
```

