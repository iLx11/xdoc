## 项目配置
### prj.conf
```c
CONFIG_BT=y
# 启用外围设备支持
CONFIG_BT_PERIPHERAL=y
# 设备名称
CONFIG_BT_DEVICE_NAME="Nordic_UART_Service"
# 支持的最大连接数
CONFIG_BT_MAX_CONN=1
# 设备支持的最大配对设备数量
CONFIG_BT_MAX_PAIRED=1

CONFIG_HEAP_MEM_POOL_SIZE=2048
```
### include
```c
#include <zephyr/bluetooth/bluetooth.h>
#include <zephyr/bluetooth/hci.h>
#include <zephyr/bluetooth/conn.h>
#include <zephyr/bluetooth/uuid.h>
#include <zephyr/bluetooth/gatt.h>
```
### 广播数据
```c
// 设备名
#define DEVICE_NAME     CONFIG_BT_DEVICE_NAME
#define DEVICE_NAME_LEN (sizeof(DEVICE_NAME) - 1)

static const uint8_t m_id[5] = {0x39, 0x06, 0x11, 0x22, 0x33};

static const struct bt_data ad[] = {
    // 广播标志， 无限期，不支持经典
    BT_DATA_BYTES(BT_DATA_FLAGS, (BT_LE_AD_GENERAL | BT_LE_AD_NO_BREDR)),
    // 设备信息
    BT_DATA(BT_DATA_NAME_COMPLETE, DEVICE_NAME, DEVICE_NAME_LEN),
    // 厂商和数据
    BT_DATA(BT_DATA_MANUFACTURER_DATA, m_id, 5),
};

static const struct bt_data sd[] = {
	// 通用唯一标识码
    BT_DATA_BYTES(BT_DATA_UUID128_ALL, BT_UUID_NUS_VAL),
};
```
### 广播准备
```c
static void bt_ready(int err)
{
    if (err) {
        printk("BT INIT FAILED CODE -> %d\n", err);
        return;
    }
    // 地址存储数组
    char ad_str[BT_ADDR_LE_STR_LEN];
    bt_addr_le_t addr = { 0 };
    size_t count = 1;

    // 开始广播
    err =
        bt_le_adv_start(BT_LE_ADV_CONN, ad, ARRAY_SIZE(ad), sd, ARRAY_SIZE(sd));
    if (err) {
        printk("ADV START FAILED CODE -> %d\n", err);
    }

    // 获取地址
    bt_id_get(&addr, &count);
    bt_addr_le_to_str(&addr, ad_str, sizeof(ad_str));
    printk("ADVERTISING AS -> %s\n", ad_str);
}
```
### 在 main 中调用
```c
int err;

// 使能 bt
err = bt_enable(bt_ready);
if (err) {
	printk("BT ENABLE FAILED CODE -> %d\n", err);
}
```
## 配置 public 地址
```c
#include <zephyr/bluetooth/controller.h>

static void set_bt_addr(const char *addr_str, const char *type_str)
{
	int err;
	bt_addr_le_t addr;

	err = bt_addr_le_from_str(addr_str, type_str, &addr);
	if (err) {
		printk("Invalid BT address (err %d)\n", err);
	}

	if (addr.type == BT_ADDR_LE_PUBLIC) {
		bt_ctlr_set_public_addr(addr.a.val);
		return;
	} else {
		err = bt_id_create(&addr, NULL);
		if (err < 0) {
			printk("Creating new ID failed (err %d)\n", err);
		}
	}
}
// 调用时
set_bt_addr("11:22:33:44:55:66", "public");
```
## 添加回调
### 创建连接对象
```c
// 创建连接对象
static struct bt_conn *current_conn;
```
### 连接回调
```c
// 连接回调
static void connected(struct bt_conn *conn, uint8_t err) {
    // 连接地址
    char addr[BT_ADDR_LE_STR_LEN];
	if (err) {
		printk("CONNECT ERR CODE -> %d\n", err);
		return;
	}
    // 获取连接地址
	bt_addr_le_to_str(bt_conn_get_dst(conn), addr, sizeof(addr));
	printk("CONNECTED -> %s\n", addr);

    // 递增引用计数
	current_conn = bt_conn_ref(conn);
}
```
### 连接断开回调
```c
// 断开连接回调
static void disconnected(struct bt_conn *conn, uint8_t reason) {
    // 连接地址
    char addr[BT_ADDR_LE_STR_LEN];
    // 获取连接地址
	bt_addr_le_to_str(bt_conn_get_dst(conn), addr, sizeof(addr));
	printk("DISCONNECTED -> %s COUSE -> %d\n", addr, reason);

    // 递减引用计数
	if (current_conn) {
		bt_conn_unref(current_conn);
		current_conn = NULL;
	}
}
```
### 在 bt_ready 中注册回调
```c
// 注册回调函数
BT_CONN_CB_DEFINE(conn_callbacks) = {
.connected    = connected,
.disconnected = disconnected,
#ifdef CONFIG_BT_NUS_SECURITY_ENABLED
	.security_changed = security_changed,
#endif

/**
 *  或者使用 
	static struct bt_conn_cb conn_callbacks = {
		.connected		    = connected,
		.disconnected   	= disconnected,
		.le_param_req		= le_param_req,
		.le_param_updated	= le_param_updated
	}; 
	bt_conn_cb_register(&conn_callbacks);
*/
```
### 广播参数设置
1. **广播数据内容（Advertising Data）**：
- 广播数据内容是广播包中的有效载荷，通常包含设备的标识、状态信息或其他有用的数据。通过设置广播数据内容，可以让接收方了解广播设备的特征和功能。
- 在 NCS 中，可以使用 Advertising API 来设置广播数据内容，包括设备名称、服务 UUID、制造商特定数据等。
2. **广播类型（Advertising Type）**：
- 广播类型决定了广播包的传输方式，常见的类型包括可连接广播（Connectable Advertising）、非连接广播（Non-connectable Advertising）和可连接广播的扫描响应（Scannable Advertising）等。
- 在 NCS 中，可以通过设置广播参数的类型来选择合适的广播类型。
3. **广播间隔（Advertising Interval）**：
- 广播间隔指的是两个连续广播包之间的时间间隔。较短的广播间隔可以提高广播的频率，但会增加功耗；而较长的广播间隔可以降低功耗，但可能降低设备被发现的速度。
- 在 NCS 中，可以通过设置广播参数的间隔来调整广播间隔，以满足特定的功耗和性能需求。
4. **广播功率（Advertising Power Level）**：
- 广播功率指的是设备发送广播包时使用的发射功率水平。较高的广播功率可以增加设备的广播范围，但会增加功耗；较低的广播功率可以降低功耗，但可能降低设备被发现的概率。
- 在 NCS 中，可以通过设置广播参数的功率水平来调整广播功率，以适应不同的通信环境和需求。
5. **广播频道（Advertising Channels）**：
- 广播频道是设备用于发送广播包的无线信道。在蓝牙 Low Energy（BLE）中，共有 40 个广播频道可供选择，通常在 37、38 和 39 号频道上进行广播。
- 在 NCS 中，可以通过设置广播参数的频道来选择要使用的广播频道。
6. **定向广播（Directed Advertising）**：
- 定向广播是一种针对特定设备的广播方式，只有目标设备可以接收到广播包。这种方式可以提高通信的安全性和效率。
- 在 NCS 中，可以通过设置广播参数来指定目标设备的地址和类型，以进行定向广播。
### 更新广播
```c
bt_le_adv_update_data(ad1, ARRAY_SIZE(ad1), sd1, ARRAY_SIZE(sd1));
```
.A device scanning for advertising packets might receive one if it happens to scan while an advertising packet is being transmitted, and it might simply receive the data contained in it or continue by initiating a connection.
Connections, on the other hand, require two peers that synchronously perform data exchanges at regular intervals and provide guarantees on data transmission and throughput.
each advertising packet contains up to 31 bytes of data (the actual available user data length will be lower due to headers and format overheads)
Since a scan response packet is sent only upon request from the observer, the most critical and important data should always be placed in the advertising packet itself, not in the scan response packet.
Non-discoverable mode:
	Not being discoverable means other devices cannot learn about the presence of the peripheral or perform any inquiries about its nature.


