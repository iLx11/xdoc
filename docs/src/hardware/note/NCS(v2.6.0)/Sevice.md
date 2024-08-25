### 开启 DIS 和  BAS 服务
prj.conf
```c
CONFIG_BT_DIS=y

CONFIG_BT_BAS=y
```
include
```c
#include <zephyr/types.h>
#include <stddef.h>
#include <zephyr/sys/util.h>

#include <zephyr/bluetooth/bluetooth.h>
#include <zephyr/bluetooth/hci.h>
#include <zephyr/bluetooth/conn.h>
#include <zephyr/bluetooth/uuid.h>
#include <zephyr/bluetooth/gatt.h>

#include <zephyr/bluetooth/services/dis.h>
#include <zephyr/bluetooth/services/bas.h>

#include <zephyr/bluetooth/controller.h>

#include <bluetooth/services/nus.h>

#include <zephyr/logging/log.h>
```
## 创建自定义服务
### 定义接收与发送缓冲数组
```c
#define MAX_TRANSMIT_SIZE 240
uint8_t data_rx[MAX_TRANSMIT_SIZE] = {0};
uint8_t data_tx[MAX_TRANSMIT_SIZE] = {0};
```
### 定义服务与特性的 UUID
```c
#define MY_SERVICE_UUID                                                     \
    0xd4, 0x86, 0x48, 0x24, 0x54, 0xB3, 0x43, 0xA1, 0xBC, 0x20, 0x97, 0x8F, \
        0xC3, 0x76, 0xC2, 0x75

#define RX_CHARACTERISTIC_UUID                                              \
    0xA6, 0xE8, 0xC4, 0x60, 0x7E, 0xAA, 0x41, 0x6B, 0x95, 0xD4, 0x9D, 0xCC, \
        0x08, 0x4F, 0xCF, 0x6A

#define TX_CHARACTERISTIC_UUID                                              \
    0xED, 0xAA, 0x20, 0x11, 0x92, 0xE7, 0x43, 0x5A, 0xAA, 0xE9, 0x94, 0x43, \
        0x35, 0x6A, 0xD4, 0xD3

#define BT_UUID_MY_SERIVCE      BT_UUID_DECLARE_128(MY_SERVICE_UUID)
#define BT_UUID_MY_SERIVCE_RX   BT_UUID_DECLARE_128(RX_CHARACTERISTIC_UUID)
#define BT_UUID_MY_SERIVCE_TX   BT_UUID_DECLARE_128(TX_CHARACTERISTIC_UUID)
```
### 定义服务
### 使用宏定义
```c
/**
- @brief 静态定义并注册服务。
- 此辅助宏用于静态地定义并注册一个GATT服务。
- @param _name 服务名称。 
*/ 
#define BT_GATT_SERVICE_DEFINE(_name, ...)				\
	const struct bt_gatt_attr attr_##_name[] = { __VA_ARGS__ };	\
	const STRUCT_SECTION_ITERABLE(bt_gatt_service_static, _name) =	\
					BT_GATT_SERVICE(attr_##_name)
/*
- @brief 特性（Characteristic）与值声明宏。
- 此辅助宏用于声明一个特征属性及其对应的属性值。
- @param _uuid 特性属性的UUID。
- @param _props 特性属性的属性，由一系列`BT_GATT_CHRC_*`宏构成的位图。
- @param _perm 特性属性的访问权限，由一系列@ref bt_gatt_perm值构成的位图。
- @param _read 特性属性读取回调函数（@ref bt_gatt_attr_read_func_t类型）。
- @param _write 特性属性写入回调函数（@ref bt_gatt_attr_write_func_t类型）。
- @param _user_data 特性属性的用户数据。 
*/ 
#define BT_GATT_CHARACTERISTIC(_uuid, _props, _perm, _read, _write, _user_data) \
	BT_GATT_ATTRIBUTE(BT_UUID_GATT_CHRC, BT_GATT_PERM_READ,                 \
			  bt_gatt_attr_read_chrc, NULL,                         \
			  ((struct bt_gatt_chrc[]) {                            \
				BT_GATT_CHRC_INIT(_uuid, 0U, _props),           \
						   })),                         \
	BT_GATT_ATTRIBUTE(_uuid, _perm, _read, _write, _user_data)

```
### 特性值
```c
特性（Characteristic）

这些定义用于描述GATT特性可以支持的各种属性或功能

BT_GATT_CHRC_BROADCAST (0x01): 允许使用服务器特性配置描述符对特性值进行广播。

BT_GATT_CHRC_READ (0x02): 允许读取特性值。

BT_GATT_CHRC_WRITE_WITHOUT_RESP (0x04): 允许无响应地写入特性值，即客户端写入后不等待服务器的确认回复。

BT_GATT_CHRC_WRITE (0x08): 允许带响应地写入特性值，即写入操作需要服务器确认。

BT_GATT_CHRC_NOTIFY (0x10): 允许在无需确认的情况下通知客户端特性值的变化（通知）。

BT_GATT_CHRC_INDICATE (0x20): 允许以需要客户端确认的方式通知特性值的变化（指示）。

BT_GATT_CHRC_AUTH (0x40): 允许对特性值进行认证签名写入，提高了数据的安全性。

BT_GATT_CHRC_EXT_PROP (0x80): 表明在特性扩展属性描述符中定义了额外的特性属性。

这些属性通过按位或（|）操作组合起来，形成一个特性定义中的属性位域值，以此来定义该特性的具体行为和交互能力。
```
### 定义服务
```c
// 定义私人服务
BT_GATT_SERVICE_DEFINE(my_service,
BT_GATT_PRIMARY_SERVICE(BT_UUID_MY_SERIVCE),
BT_GATT_CHARACTERISTIC(BT_UUID_MY_SERIVCE_RX,
			       BT_GATT_CHRC_WRITE | BT_GATT_CHRC_WRITE_WITHOUT_RESP,
			       BT_GATT_PERM_READ | BT_GATT_PERM_WRITE, 
                   on_read, on_receive, NULL),
BT_GATT_CHARACTERISTIC(BT_UUID_MY_SERIVCE_TX,
			       BT_GATT_CHRC_NOTIFY,
			       BT_GATT_PERM_READ,
                   NULL, NULL, NULL),
BT_GATT_CCC(on_cccd_changed,
        BT_GATT_PERM_READ | BT_GATT_PERM_WRITE),
);
```
### 定义回调函数
```c
// 接收回调
static ssize_t on_receive(struct bt_conn *conn,
			  const struct bt_gatt_attr *attr,
			  const void *buf,
			  uint16_t len,
			  uint16_t offset,
			  uint8_t flags)
{
    cconst uint8_t * buffer = buf;
    
	LOG_INF("Received data, handle %d, data: 0x", attr->handle);
    LOG_HEXDUMP_INF(buffer, len, "");

	return len;
}

// 读取回调
static ssize_t on_read(struct bt_conn *conn,
					    const struct bt_gatt_attr *attr,
					    void *buf, uint16_t len,
					    uint16_t offset)
{
    const uint8_t * buffer = buf;
    
	LOG_INF("Received data, handle %d, data: 0x", attr->handle);
    LOG_HEXDUMP_INF(buffer, len, "");

	return len;
}

// cccd 更改回调
void on_cccd_changed(const struct bt_gatt_attr *attr, uint16_t value)
{
    ARG_UNUSED(attr);
    switch (value) {
        case BT_GATT_CCC_NOTIFY:
            // Start sending stuff!
            LOG_INF("NORIFY_CCC");

            break;

        case BT_GATT_CCC_INDICATE:
            // Start sending stuff via indications
            break;

        case 0:
            // Stop sending stuff
            break;

        default:
            printk("Error, CCCD has been set to an invalid value");
    }
}
```
### notify
```c
static struct bt_gatt_attr *m_attr;
static uint8_t notify_value[2] = { 0 };

// 通过 UUID 获取属性
m_attr = bt_gatt_find_by_uuid(NULL, 1, BT_UUID_MY_SERIVCE_RX);

while (1) {
		// test
        notify_value[0] > 30 ? notify_value[0] = 0 : notify_value[0]++;
        bt_gatt_notify(current_conn, m_attr, &notify_value,
                       sizeof(notify_value));
        k_sleep(K_SECONDS(1));
        LOG_INF("NOTIFY SEND");
    }
```
#### 服务修改为
```c
// 定义私人服务
BT_GATT_SERVICE_DEFINE(
    my_service, BT_GATT_PRIMARY_SERVICE(BT_UUID_MY_SERIVCE),
    BT_GATT_CHARACTERISTIC(BT_UUID_MY_SERIVCE_RX,
                           BT_GATT_CHRC_READ | BT_GATT_CHRC_WRITE |
                               BT_GATT_CHRC_WRITE_WITHOUT_RESP |
                               BT_GATT_CHRC_NOTIFY,
                           BT_GATT_PERM_READ | BT_GATT_PERM_WRITE,
                           on_read, on_receive, notify_value),
    BT_GATT_CCC(on_cccd_changed, BT_GATT_PERM_READ | BT_GATT_PERM_WRITE),
    BT_GATT_CUD("user desc", BT_GATT_PERM_READ));
```