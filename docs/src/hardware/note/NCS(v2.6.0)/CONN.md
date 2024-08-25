## 连接配置
### 连接回调
```c
// 连接回调
static void connected(struct bt_conn *conn, uint8_t err)
{
    // 连接地址
    char addr[BT_ADDR_LE_STR_LEN];
    if (err) {
        LOG_INF("CONNECT ERR CODE -> %d\n", err);
        return;
    }
    // 获取连接地址
    bt_addr_le_to_str(bt_conn_get_dst(conn), addr, sizeof(addr));
    LOG_INF("CONNECTED -> %s\n", addr);

    // 递增引用计数
    current_conn = bt_conn_ref(conn);

    // 修改连接参数
    const static struct bt_le_conn_param new_bt_param =  BT_LE_CONN_PARAM_INIT(0x0018, 0x0028, 0, 400);
    
    err = bt_conn_le_param_update(conn, &new_bt_param);
    if(err) {
        LOG_INF("CONN PARAM UPDATA FAILED CODE -> %d", err);
    } else {
        LOG_INF("CONN PARAM UPDATA SUCCESS");
    }
}
```
### 断开连接回调
```c
// 断开连接回调
static void disconnected(struct bt_conn *conn, uint8_t reason)
{
    // 连接地址
    char addr[BT_ADDR_LE_STR_LEN];
    // 获取连接地址
    bt_addr_le_to_str(bt_conn_get_dst(conn), addr, sizeof(addr));
    LOG_INF("DISCONNECTED -> %s COUSE -> %d\n", addr, reason);

    // 递减引用计数
    if (current_conn) {
        bt_conn_unref(current_conn);
        current_conn = NULL;
    }
}
```
### nus 接收回调注册
```c
// nus 接收回调函数
static void bt_receive_cb(struct bt_conn *conn, const uint8_t *const data,
                          uint16_t len)
{
    int err;
    // 接收地址
    char addr[BT_ADDR_LE_STR_LEN];
    // 获取接收地址
    err = bt_addr_le_to_str(bt_conn_get_dst(conn), addr, sizeof(addr));
    LOG_INF("RECEIVED FROM  -> %s\n", addr);


    LOG_HEXDUMP_INF(data, len, "RECEIVED DATA");
    // 从机发送数据
    bt_nus_send(conn, data, len);
}
```
### nus 回调注册
```c

// nus 回调注册
static struct bt_nus_cb nus_cb = {
    .received = bt_receive_cb,
};
```
### nus 初始化
```c
// nus 初始化
static void m_nus_init(void)
{
    int err;

    err = bt_nus_init(&nus_cb);
    if(err) {
        LOG_INF("FAILED INIT NUS CODE -> %d\n", err);
        return ;
    }
}
```
### 在 bt_ready 中初始化 nus 并注册回调函数
```c
m_nus_init();

// 广播开始

static struct bt_conn_cb conn_callbacks = {
            .connected		    = connected,
            .disconnected   	= disconnected,
            .le_data_len_updated= on_le_data_len_updated,
        }; 
        bt_conn_cb_register(&conn_callbacks);
```

## 修改连接参数
### 在 prj.conf 中配置默认参数
```c
// 最小连接间隔 (6 * 1.25) -> 7.5 ms
CONFIG_BT_PERIPHERAL_PREF_MIN_INT=6
// 最大连接间隔
CONFIG_BT_PERIPHERAL_PREF_MAX_INT=6
// 外设延迟
CONFIG_BT_PERIPHERAL_PREF_LATENCY=0
// 监督超时
CONFIG_BT_PERIPHERAL_PREF_TIMEOUT=400
// 是否自动更新，如果不配置怎需要用 bt_conn_le_param_update(). 来手动更新 
CONFIG_BT_GAP_AUTO_UPDATE_CONN_PARAMS=y
```
## 设置 PHY
### 定义函数
并在 on_connected 回调函数末尾调用
```c
static void update_phy(struct bt_conn *conn)
{
    int err;
    const struct bt_conn_le_phy_param preferred_phy = {
        .options = BT_CONN_LE_PHY_OPT_NONE,
        .pref_rx_phy = BT_GAP_LE_PHY_2M,
        .pref_tx_phy = BT_GAP_LE_PHY_2M,
    };
    err = bt_conn_le_phy_update(conn, &preferred_phy);
    if (err) {
        LOG_ERR("bt_conn_le_phy_update() returned %d", err);
    }
}
```
实现 `on_le_phy_updated()` 回调函数
```c
void on_le_phy_updated(struct bt_conn *conn, struct bt_conn_le_phy_info *param)
{
    // PHY Updated
    if (param->tx_phy == BT_CONN_LE_TX_POWER_PHY_1M) {
        LOG_INF("PHY updated. New PHY: 1M");
    }
    else if (param->tx_phy == BT_CONN_LE_TX_POWER_PHY_2M) {
        LOG_INF("PHY updated. New PHY: 2M");
    }
    else if (param->tx_phy == BT_CONN_LE_TX_POWER_PHY_CODED_S8) {
        LOG_INF("PHY updated. New PHY: Long Range");
    }
}
```
在 prj.conf 中定义更新声明
```c
CONFIG_BT_USER_PHY_UPDATE=y
```
将回调注册添加到 `connection_callbacks` 结构体中
```c
.le_phy_updated = on_le_phy_updated,
```
## 定义更新数据长度
### 主从设备在 prj.conf 中添加
```c
CONFIG_BT_USER_DATA_LEN_UPDATE=y
CONFIG_BT_CTLR_DATA_LENGTH_MAX=251
CONFIG_BT_BUF_ACL_RX_SIZE=251
CONFIG_BT_BUF_ACL_TX_SIZE=251
CONFIG_BT_L2CAP_TX_MTU=247
```
### 定义函数
并在 on_connected 回调函数调用
```c
static void update_data_length(struct bt_conn *conn)
{
    int err;
    struct bt_conn_le_data_len_param my_data_len = {
        .tx_max_len = BT_GAP_DATA_LEN_MAX,
        .tx_max_time = BT_GAP_DATA_TIME_MAX,
    };
    err = bt_conn_le_data_len_update(my_conn, &my_data_len);
    if (err) {
        LOG_ERR("data_len_update failed (err %d)", err);
    }
}
```
定义更新回调函数
```c
void on_le_data_len_updated(struct bt_conn *conn, struct bt_conn_le_data_len_info *info)
{
    uint16_t tx_len     = info->tx_max_len; 
    uint16_t tx_time    = info->tx_max_time;
    uint16_t rx_len     = info->rx_max_len;
    uint16_t rx_time    = info->rx_max_time;
    LOG_INF("Data length updated. Length %d/%d bytes, time %d/%d us", tx_len, rx_len, tx_time, rx_time);
}
```
将回调注册添加到 `connection_callbacks` 结构体中
```c
.le_data_len_updated = on_le_data_len_updated,
```
## 更新 **MTU**
### 定义函数
定义结构体
```c
static struct bt_gatt_exchange_params exchange_params;
```
定义更新函数
```c
static void update_mtu(struct bt_conn *conn)
{
    int err;
    exchange_params.func = exchange_func;

    err = bt_gatt_exchange_mtu(conn, &exchange_params);
    if (err) {
        LOG_ERR("bt_gatt_exchange_mtu failed (err %d)", err);
    }
}
```
实现回调函数
```c
static void exchange_func(struct bt_conn *conn, uint8_t att_err,
			  struct bt_gatt_exchange_params *params)
{
	LOG_INF("MTU exchange %s", att_err == 0 ? "successful" : "failed");
    if (!att_err) {
        uint16_t payload_mtu = bt_gatt_get_mtu(conn) - 3;   // 3 bytes used for Attribute headers.
        LOG_INF("New MTU: %d bytes", payload_mtu);
    }
}
```