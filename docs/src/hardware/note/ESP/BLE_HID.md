## 实现步骤

- **初始化蓝牙控制器**：配置并启用蓝牙硬件。
- **初始化 Bluedroid 栈**：初始化 Bluetooth 协议栈。
- **配置 HID 设备**：设置 HID 报告描述符，注册 HID 回调函数。
- **处理 HID 事件**：处理配对、连接、断开等事件。
- **发送键盘报告**：根据按键事件发送 HID 报告到主机。



## ESP-IDF 蓝牙 HID 函数详解

### 蓝牙控制器初始化与启用

#### `esp_bt_controller_init`

**原型**：

```c
esp_err_t esp_bt_controller_init(const esp_bt_controller_config_t *cfg);
```

**功能**：
初始化蓝牙控制器。需要在调用任何其他蓝牙函数之前先初始化控制器。

**参数**：

- `cfg`: 指向蓝牙控制器配置结构体的指针。

**返回值**：

- `ESP_OK`：成功。
- 其他错误码表示失败。

#### `esp_bt_controller_enable`

**原型**：

```c
esp_err_t esp_bt_controller_enable(esp_bt_mode_t mode);
```

**功能**：
启用蓝牙控制器，并指定工作模式（例如 Bluetooth Classic、BLE 或同时支持两者）。

**参数**：

- `mode`: 蓝牙工作模式，常用值为 `ESP_BT_MODE_CLASSIC_BT` 或 `ESP_BT_MODE_BTDM`（双模式）。

**返回值**：

- `ESP_OK`：成功。
- 其他错误码表示失败。

### Bluedroid 栈初始化与启用

#### `esp_bluedroid_init`

**原型**：

```c
esp_err_t esp_bluedroid_init(void);
```

**功能**：
初始化 Bluedroid 栈。需要在控制器启用后调用。

**返回值**：
- `ESP_OK`：成功。
- 其他错误码表示失败。

#### `esp_bluedroid_enable`

**原型**：

```c
esp_err_t esp_bluedroid_enable(void);
```

**功能**：
启用 Bluedroid 栈。

**返回值**：
- `ESP_OK`：成功。
- 其他错误码表示失败。

### HID 设备配置与回调

#### `esp_hidd_device_register_app`

**原型**：

```c
esp_err_t esp_hidd_device_register_app(esp_hidd_app_param_t *param, esp_hidd_callbacks_t *callbacks);
```

**功能**：
注册 HID 设备应用，包括设置设备信息和回调函数。

**参数**：

- `param`: 指向 HID 应用参数结构体的指针，包含设备描述符、报告描述符等信息。
- `callbacks`: 指向 HID 回调函数结构体的指针，用于处理 HID 事件。

**返回值**：

- `ESP_OK`：成功。
- 其他错误码表示失败。

#### `esp_hidd_device_init`

**原型**：

```c
esp_err_t esp_hidd_device_init(void);
```

**功能**：
初始化 HID 设备模块。

**返回值**：
- `ESP_OK`：成功。
- 其他错误码表示失败。

### HID 报告发送

#### `esp_hidd_device_send_report`

**原型**：
```c
esp_err_t esp_hidd_device_send_report(esp_hidd_conn_state_t conn_state, uint8_t report_type, uint8_t report_id, uint8_t *report, size_t report_len);
```

**功能**：
发送 HID 报告到主机。

**参数**：
- `conn_state`: 连接状态，通常为已连接状态。
- `report_type`: 报告类型（如输入报告、输出报告等）。
- `report_id`: 报告 ID，用于区分不同的报告。
- `report`: 指向要发送的报告数据的指针。
- `report_len`: 报告数据的长度。

**返回值**：
- `ESP_OK`：成功。
- 其他错误码表示失败。

### 辅助功能函数

#### `esp_bt_gap_set_device_name`

**原型**：
```c
esp_err_t esp_bt_gap_set_device_name(const char *name);
```

**功能**：
设置设备的蓝牙名称。

**参数**：

- `name`: 指向设备名称字符串的指针。

**返回值**：

- `ESP_OK`：成功。
- 其他错误码表示失败。

#### `esp_bt_gap_set_scan_mode`

**原型**：
```c
esp_err_t esp_bt_gap_set_scan_mode(esp_bt_scan_mode_t mode);
```

**功能**：
设置设备的扫描模式（可见性和可连接性）。

**参数**：

- `mode`: 扫描模式，常用值为 `ESP_BT_CONNECTABLE`、`ESP_BT_NON_CONNECTABLE` 等。

**返回值**：

- `ESP_OK`：成功。
- 其他错误码表示失败。

## 详细流程解析

### 初始化蓝牙控制器

首先，需要初始化并启用蓝牙控制器。这是整个蓝牙功能的基础。

```c
esp_bt_controller_config_t bt_cfg = BT_CONTROLLER_INIT_CONFIG_DEFAULT();
esp_err_t ret = esp_bt_controller_init(&bt_cfg);
if (ret != ESP_OK) {
    // 处理错误
}

ret = esp_bt_controller_enable(ESP_BT_MODE_CLASSIC_BT);
if (ret != ESP_OK) {
    // 处理错误
}
```

### 初始化 Bluedroid 栈

在控制器启用后，初始化并启用 Bluedroid 栈。

```c
ret = esp_bluedroid_init();
if (ret != ESP_OK) {
    // 处理错误
}

ret = esp_bluedroid_enable();
if (ret != ESP_OK) {
    // 处理错误
}
```

### 配置 HID 设备

#### 设置设备名称和扫描模式

```c
ret = esp_bt_gap_set_device_name("ESP32 Keyboard");
if (ret != ESP_OK) {
    // 处理错误
}

ret = esp_bt_gap_set_scan_mode(ESP_BT_CONNECTABLE | ESP_BT_GENERAL_DISCOVERABLE);
if (ret != ESP_OK) {
    // 处理错误
}
```

#### 配置 HID 报告描述符

HID 报告描述符定义了设备的功能和支持的报告类型。一个典型的键盘报告描述符如下：

```c
static const uint8_t hid_report_descriptor[] = {
    0x05, 0x01, // Usage Page (Generic Desktop)
    0x09, 0x06, // Usage (Keyboard)
    0xA1, 0x01, // Collection (Application)
    0x05, 0x07, // Usage Page (Key Codes)
    0x19, 0xE0, // Usage Minimum (224)
    0x29, 0xE7, // Usage Maximum (231)
    0x15, 0x00, // Logical Minimum (0)
    0x25, 0x01, // Logical Maximum (1)
    0x75, 0x01, // Report Size (1)
    0x95, 0x08, // Report Count (8)
    0x81, 0x02, // Input (Data, Variable, Absolute)
    0x95, 0x01, // Report Count (1)
    0x75, 0x08, // Report Size (8)
    0x81, 0x03, // Input (Constant, Variable, Absolute)
    0x95, 0x06, // Report Count (6)
    0x75, 0x08, // Report Size (8)
    0x15, 0x00, // Logical Minimum (0)
    0x25, 0x65, // Logical Maximum (101)
    0x05, 0x07, // Usage Page (Key Codes)
    0x19, 0x00, // Usage Minimum (0)
    0x29, 0x65, // Usage Maximum (101)
    0x81, 0x00, // Input (Data, Array)
    0xC0        // End Collection
};
```

#### 设置 HID 应用参数和回调

```c
esp_hidd_app_param_t app_param = {
    .hid_desc_len = sizeof(hid_report_descriptor),
    .hid_desc = hid_report_descriptor,
    .cdesc_len = 0,
    .cdesc = NULL
};

esp_hidd_callbacks_t callbacks = {
    .connect_cb = &hid_event_callback,
    .disconnect_cb = &hid_event_callback,
    .get_report_cb = &hid_event_callback,
    .set_report_cb = &hid_event_callback,
    .intr_data_cb = &hid_event_callback
};

ret = esp_hidd_device_register_app(&app_param, &callbacks);
if (ret != ESP_OK) {
    // 处理错误
}
```

### 处理 HID 事件

通过回调函数处理 HID 设备的事件，如连接、断开、报告请求等。

```c
static void hid_event_callback(esp_hidd_event_t event, esp_hidd_event_param_t *param) {
    switch (event) {
        case ESP_HIDD_EVENT_BLE_CONNECT:
            // 处理连接事件
            break;
        case ESP_HIDD_EVENT_BLE_DISCONNECT:
            // 处理断开事件
            break;
        // 处理其他事件
        default:
            break;
    }
}
```

### 发送键盘报告

根据按键事件构建 HID 报告并发送给主机。

```c
typedef struct {
    uint8_t modifier;
    uint8_t reserved;
    uint8_t keycode[6];
} __attribute__((packed)) hid_keyboard_report_t;

bool send_key_report(uint8_t modifier, uint8_t keycode[6]) {
    hid_keyboard_report_t report;
    report.modifier = modifier;
    report.reserved = 0;
    if (keycode) {
        memcpy(report.keycode, keycode, sizeof(report.keycode));
    } else {
        memset(report.keycode, 0, sizeof(report.keycode));
    }

    return esp_hidd_device_send_report(/*连接状态*/, /*报告类型*/, /*报告ID*/, (uint8_t *)&report, sizeof(report)) == ESP_OK;
}
```

## 代码示例

以下是一个简化的完整示例，展示如何使用 ESP-IDF 实现一个蓝牙键盘。

```c
#include <stdio.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_bt.h"
#include "esp_bt_main.h"
#include "esp_hidd_device.h"
#include "esp_gap_bt_api.h"

// HID 报告描述符
static const uint8_t hid_report_descriptor[] = {
    0x05, 0x01, // Usage Page (Generic Desktop)
    0x09, 0x06, // Usage (Keyboard)
    0xA1, 0x01, // Collection (Application)
    0x05, 0x07, // Usage Page (Key Codes)
    0x19, 0xE0, // Usage Minimum (224)
    0x29, 0xE7, // Usage Maximum (231)
    0x15, 0x00, // Logical Minimum (0)
    0x25, 0x01, // Logical Maximum (1)
    0x75, 0x01, // Report Size (1)
    0x95, 0x08, // Report Count (8)
    0x81, 0x02, // Input (Data, Variable, Absolute)
    0x95, 0x01, // Report Count (1)
    0x75, 0x08, // Report Size (8)
    0x81, 0x03, // Input (Constant, Variable, Absolute)
    0x95, 0x06, // Report Count (6)
    0x75, 0x08, // Report Size (8)
    0x15, 0x00, // Logical Minimum (0)
    0x25, 0x65, // Logical Maximum (101)
    0x05, 0x07, // Usage Page (Key Codes)
    0x19, 0x00, // Usage Minimum (0)
    0x29, 0x65, // Usage Maximum (101)
    0x81, 0x00, // Input (Data, Array)
    0xC0        // End Collection
};

// HID 事件回调函数
static void hid_event_callback(esp_hidd_event_t event, esp_hidd_event_param_t *param) {
    switch (event) {
        case ESP_HIDD_EVENT_BLE_CONNECT:
            printf("HID BLE Connected\n");
            break;
        case ESP_HIDD_EVENT_BLE_DISCONNECT:
            printf("HID BLE Disconnected\n");
            break;
        case ESP_HIDD_EVENT_GET_REPORT:
            // 处理 GET_REPORT 请求
            break;
        case ESP_HIDD_EVENT_SET_REPORT:
            // 处理 SET_REPORT 请求
            break;
        default:
            break;
    }
}

void app_main(void) {
    esp_err_t ret;

    // 初始化 NVS
    ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    // 初始化蓝牙控制器
    esp_bt_controller_config_t bt_cfg = BT_CONTROLLER_INIT_CONFIG_DEFAULT();
    ret = esp_bt_controller_init(&bt_cfg);
    if (ret != ESP_OK) {
        printf("Bluetooth controller initialize failed: %s\n", esp_err_to_name(ret));
        return;
    }

    // 启用蓝牙控制器
    ret = esp_bt_controller_enable(ESP_BT_MODE_CLASSIC_BT);
    if (ret != ESP_OK) {
        printf("Bluetooth controller enable failed: %s\n", esp_err_to_name(ret));
        return;
    }

    // 初始化 Bluedroid
    ret = esp_bluedroid_init();
    if (ret != ESP_OK) {
        printf("Bluedroid initialize failed: %s\n", esp_err_to_name(ret));
        return;
    }

    // 启用 Bluedroid
    ret = esp_bluedroid_enable();
    if (ret != ESP_OK) {
        printf("Bluedroid enable failed: %s\n", esp_err_to_name(ret));
        return;
    }

    // 设置设备名称
    ret = esp_bt_gap_set_device_name("ESP32 Keyboard");
    if (ret != ESP_OK) {
        printf("Set device name failed: %s\n", esp_err_to_name(ret));
        return;
    }

    // 设置可见和可连接模式
    ret = esp_bt_gap_set_scan_mode(ESP_BT_SCAN_MODE_CONNECTABLE_DISCOVERABLE);
    if (ret != ESP_OK) {
        printf("Set scan mode failed: %s\n", esp_err_to_name(ret));
        return;
    }

    // 配置 HID 应用参数
    esp_hidd_app_param_t app_param = {
        .hid_desc_len = sizeof(hid_report_descriptor),
        .hid_desc = hid_report_descriptor,
        .cdesc_len = 0,
        .cdesc = NULL
    };

    // 配置 HID 回调函数
    esp_hidd_callbacks_t callbacks = {
        .connect_cb = hid_event_callback,
        .disconnect_cb = hid_event_callback,
        .get_report_cb = hid_event_callback,
        .set_report_cb = hid_event_callback,
        .intr_data_cb = hid_event_callback
    };

    // 注册 HID 应用
    ret = esp_hidd_device_register_app(&app_param, &callbacks);
    if (ret != ESP_OK) {
        printf("HID device register app failed: %s\n", esp_err_to_name(ret));
        return;
    }

    // 初始化 HID 设备
    ret = esp_hidd_device_init();
    if (ret != ESP_OK) {
        printf("HID device init failed: %s\n", esp_err_to_name(ret));
        return;
    }

    printf("Bluetooth HID Keyboard initialized.\n");

    // 示例：发送 'A' 键的按下和释放
    uint8_t modifier = 0x00; // 无修饰键
    uint8_t keycode[6] = {0x04, 0, 0, 0, 0, 0}; // HID_KEY_A = 0x04

    // 按下 'A'
    if (send_key_report(modifier, keycode)) {
        printf("Sent key press 'A'\n");
    }

    vTaskDelay(100 / portTICK_PERIOD_MS);

    // 释放所有键
    if (send_key_report(0, NULL)) {
        printf("Sent key release\n");
    }
}

// 发送键盘报告的函数
bool send_key_report(uint8_t modifier, uint8_t keycode[6]) {
    typedef struct {
        uint8_t modifier;
        uint8_t reserved;
        uint8_t keycode[6];
    } __attribute__((packed)) hid_keyboard_report_t;

    hid_keyboard_report_t report;
    report.modifier = modifier;
    report.reserved = 0;
    if (keycode) {
        memcpy(report.keycode, keycode, sizeof(report.keycode));
    } else {
        memset(report.keycode, 0, sizeof(report.keycode));
    }

    // 假设连接状态为已连接，报告类型为输入报告，报告ID为 0
    return esp_hidd_device_send_report(ESP_HIDD_CONN_STATE_CONNECTED, ESP_HIDD_REPORT_TYPE_INPUT, 0, (uint8_t *)&report, sizeof(report)) == ESP_OK;
}
```





### 添加 HID 服务之前需要首先添加电池管理服务

创建服务函数

```c
void hidd_le_create_service(esp_gatt_if_t gatts_if)
{
    /* Here should added the battery service first, because the hid service should include the battery service.
       After finish to added the battery service then can added the hid service. */
    esp_ble_gatts_create_attr_tab(bas_att_db, gatts_if, BAS_IDX_NB, 0);

}
```

