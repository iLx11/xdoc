在蓝牙低功耗（BLE）通信中，主端（Central）设备通过扫描周围的广播（Advertising）设备来发现可连接的从端（Peripheral）设备。主端扫描相关的主要参数包括：
- **扫描间隔（Scan Interval）**：两次扫描之间的时间间隔，单位为毫秒（ms）。
- **扫描窗口（Scan Window）**：每次扫描持续的时间，单位为毫秒（ms）。
- **扫描类型（Scan Type）**：主动扫描（Active Scan）或被动扫描（Passive Scan）。
扫描间隔和扫描窗口的关系如下：
- 扫描窗口 <= 扫描间隔
- 较长的扫描窗口会增加扫描发现的概率，但同时也会增加功耗。
- 主动扫描会发送扫描请求以获取更多信息，而被动扫描只监听广播。
#### 扫描参数的解释
- **扫描间隔（Scan Interval）**：设置为 0x0060（60 个 0.625 ms 单位），即 37.5 ms。
- **扫描窗口（Scan Window）**：设置为 0x0030（30 个 0.625 ms 单位），即 18.75 ms。
#### 不同参数的影响
1. **较短的扫描间隔和较长的扫描窗口**：
    - 增加了扫描时间，有助于更快地发现设备，但会增加功耗。
    - 适用于需要快速响应的应用场景。
2. **较长的扫描间隔和较短的扫描窗口**：
    - 减少了扫描时间，降低了功耗，但可能会漏掉一些广播包。
    - 适用于对功耗敏感的应用场景。
### prj.conf
```c
CONFIG_BT=y
CONFIG_BT_CENTRAL=y
```
### include
```c
#include <zephyr/bluetooth/bluetooth.h>
#include <zephyr/bluetooth/hci.h>
#include <zephyr/bluetooth/conn.h>
#include <zephyr/bluetooth/uuid.h>
#include <zephyr/bluetooth/gatt.h>
// #include <bluetooth/scan.h>
```
### 扫描函数
```c
// 硬件搜索回调
static void device_found(const bt_addr_le_t *addr, int8_t rssi, uint8_t type,
			 struct net_buf_simple *ad)
{
	char addr_str[BT_ADDR_LE_STR_LEN];
	int err;

	if (default_conn) {
		return;
	}

	// 过滤广播类型
	if (type != BT_GAP_ADV_TYPE_ADV_IND &&
	    type != BT_GAP_ADV_TYPE_ADV_DIRECT_IND) {
		return;
	}
	// 过滤接收信号强度
	if (rssi < -50) {
		return;
	}
	// 读取地址
	bt_addr_le_to_str(addr, addr_str, sizeof(addr_str));
	LOG_INF("Device found: %s (RSSI %d)\n", addr_str, rssi);
	
	// 配置过滤条件并创建连接，过滤地址
	if (strcmp(addr_str, "11:22:33:44:55:66")) {
		// 停止扫描
		if (bt_le_scan_stop()) {
			return;
		}
		// 创建连接，默认参数
		err = bt_conn_le_create(addr, BT_CONN_LE_CREATE_CONN,
				BT_LE_CONN_PARAM_DEFAULT, &default_conn);
		if (err) {
			LOG_INF("Create conn to %s failed (%d)\n", addr_str, err);
			start_scan();
		}
	}
	
}

// 扫描参数配置
struct bt_le_scan_param scan_param = {
	// 扫描类型主动或被动扫描，只接收广播数据不发送额外请求
	.type = BT_LE_SCAN_TYPE_PASSIVE,
	// 没有特殊过滤或限制，每次扫描的数据都会报告
	.options = BT_LE_SCAN_OPT_NONE,
	// 扫描间隔 N * 0.625 ms
	.interval = 0x0060,
	// 扫描窗口
	.window = 0x0030,
};

static void start_scan(void)
{
	int err;

	err = bt_le_scan_start(&scan_param, device_found);
	if (err) {
		LOG_INF("Scanning failed to start (err %d)\n", err);
		return;
	}

	LOG_INF("Scanning successfully started\n");
}
```
### main.c
```c
int main(void)
{
    int err;

    err = bt_enable(NULL);
    if (err)
    {
        LOG_ERR("Bluetooth init failed (err %d)", err);
        return 0;
    }
    LOG_INF("Bluetooth initialized");

    start_scan();
    return 0;
}
```
## 另一种配置过滤的方式
### include
```c
#include <bluetooth/bluetooth.h>
#include <bluetooth/hci.h>
#include <bluetooth/conn.h>
#include <bluetooth/scan.h>
```
### 配置过滤与扫描
```c
struct bt_scan_init_param scan_init = {
	.connect_if_match = 1,
	.scan_param = NULL, // 使用默认扫描参数
	.conn_param = NULL // 使用默认连接参数
};s

// 初始化扫描模块
err = bt_scan_init(&scan_init);
if (err) {
	LOG_ERR("Scanning initialization failed (err %d)", err);
	return;
}

// 添加设备名称过滤器
err = bt_scan_filter_add(BT_SCAN_FILTER_TYPE_NAME, "TargetDeviceName");
if (err) {
	LOG_ERR("Adding name filter failed (err %d)", err);
	return;
}

// 启用过滤器
err = bt_scan_filter_enable(BT_SCAN_NAME_FILTER, false);
if (err) {
	LOG_ERR("Enabling name filter failed (err %d)", err);
	return;
}

// 启动扫描
err = bt_scan_start(BT_SCAN_TYPE_SCAN_ACTIVE);
if (err) {
	LOG_ERR("Scanning failed to start (err %d)", err);
	return;
}

LOG_INF("Scanning successfully started");
```