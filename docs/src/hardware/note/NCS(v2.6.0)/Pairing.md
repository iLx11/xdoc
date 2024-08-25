**Add a security requirement to characteristic**
在 特性的声明中，通过更改 `BT_GATT_PERM_WRITE` 为 `BT_GATT_PERM_WRITE_ENCRYPT` 来添加加密要求。
这会将安全级别要求从级别 1 更改为级别 2。
```c
BT_GATT_CHARACTERISTIC(BT_UUID_LBS_LED,
			       BT_GATT_CHRC_WRITE,
			       BT_GATT_PERM_WRITE_ENCRYPT,
			       NULL, write_led, NULL),
```
**Add the Security Management Protocol layer to the Bluetooth LE stack.**
**将安全管理协议层添加到 Bluetooth LE 堆栈。**
Kconfig 符号 `CONFIG_BT_SMP` 会将安全管理器协议添加到蓝牙 LE 堆栈中，该堆栈是可以通过蓝牙 LE 配对设备的层。
```c
CONFIG_BT_SMP=y
```
**添加回调函数，用于连接的安全级别发生更改。**
 将 `security_changed` 成员添加到回调结构中
```c
 .security_changed = on_security_changed,
```
#### 定义回调函数
```c
static void on_security_changed(struct bt_conn *conn, bt_security_t level,
			     enum bt_security_err err)
{
	char addr[BT_ADDR_LE_STR_LEN];

	bt_addr_le_to_str(bt_conn_get_dst(conn), addr, sizeof(addr));

	if (!err) {
		LOG_INF("Security changed: %s level %u\n", addr, level);
	} else {
		LOG_INF("Security failed: %s level %u err %d\n", addr, level,
			err);
	}
}
```
 **更改特性权限，要求与身份验证配对**
 在特性的声明中，通过更改 `BT_GATT_PERM_WRITE_ENCRYPT` 为 `BT_GATT_PERM_WRITE_AUTHEN` 来添加身份验证要求。
```c
BT_GATT_CHARACTERISTIC(BT_UUID_LBS_LED,
			       BT_GATT_CHRC_WRITE,
			       BT_GATT_PERM_WRITE_AUTHEN,
			       NULL, write_led, NULL),
```
这会将此特征的写入权限的安全级别从 2 级提高到 3 级或 4 级，具体取决于您使用的是旧配对还是 LE 安全连接。
在此阶段，即使仍然可以与板配对，手机也无法控制 LED。这是因为应用程序的安全级别不符合特征权限的要求。
**定义身份验证回调函数**
定义回调函数 `auth_passkey_display`
这将打印中央设备与外围设备配对所需的密钥。
```c
static void auth_passkey_display(struct bt_conn *conn, unsigned int passkey)
{
	char addr[BT_ADDR_LE_STR_LEN];
	bt_addr_le_to_str(bt_conn_get_dst(conn), addr, sizeof(addr));
	LOG_INF("Passkey for %s: %06u\n", addr, passkey);
}
```
定义回调函数 `auth_cancel`
这将让我们知道配对何时被取消。
```c
static void auth_cancel(struct bt_conn *conn)
{
	char addr[BT_ADDR_LE_STR_LEN];
	bt_addr_le_to_str(bt_conn_get_dst(conn), addr, sizeof(addr));
	LOG_INF("Pairing cancelled: %s\n", addr);
}
```
声明经过身份验证的配对回调结构 `struct bt_conn_auth_cb` 。
```c
static struct bt_conn_auth_cb conn_auth_callbacks = {
	.passkey_display = auth_passkey_display,
	.cancel = auth_cancel,
};
```
**注册身份验证回调。**
```c
err = bt_conn_auth_cb_register(&conn_auth_callbacks);
if (err) {	
	LOG_INF("Failed to register authorization callbacks.\n");	
	return -1;
}
```
该应用程序现在满足与安全级别 3 或 4 所需的 MITM 身份验证配对的要求。
之后需要删除绑定信息，配对时需要输入 PIN
## Implement bonding and a Filter Accept List
如果断开手机与外围设备的连接，然后重新连接，则无需再次配对即可重新加密链接。但是，如果我们重置设备并尝试重新连接，则需要再次配对。这是因为默认情况下，SMP 中支持绑定（通过 `CONFIG_BT_BONDABLE`）。
但是，密钥存储和恢复需要将数据写入闪存，然后从闪存中恢复数据。因此，您需要在应用程序中包含处理闪存的蓝牙设置，以便能够通过 `CONFIG_BT_SETTINGS` 来存储和恢复闪存的绑定信息。
启用 `CONFIG_BT_SETTINGS` 及其依赖项 `CONFIG_SETTINGS` ，以确保蓝牙堆栈负责存储（和恢复）配对密钥。
### prj.conf
```c
CONFIG_SETTINGS=y
CONFIG_BT_SETTINGS=y
CONFIG_FLASH=y
CONFIG_FLASH_PAGE_LAYOUT=y
CONFIG_FLASH_MAP=y
CONFIG_NVS=y
```
### include
```c
#include <zephyr/settings/settings.h>
```
初始化蓝牙后调用 `settings_load()` ，以便恢复以前的绑定。
我们必须手动调用 API 函数 `settings_load()` 才能持久地存储配对密钥和配置。
 **删除存储的绑定**
 调用 `bt_unpair()` 擦除所有绑定的设备
```c
int err= bt_unpair(BT_ID_DEFAULT,BT_ADDR_LE_ANY);
if (err) {
	LOG_INF("Cannot delete bond (err: %d)\n", err);
} else	{
	LOG_INF("Bond deleted succesfully \n");
}				
```
### **向应用程序添加过滤器接受列表。**(白名单)
启用对筛选器、接受列表和隐私功能的支持。
启用筛选器接受列表 API （ `CONFIG_BT_FILTER_ACCEPT_LIST` ） 和私有功能支持，这样就可以生成和使用可解析的私有地址 （ `CONFIG_BT_PRIVACY` ）。
prj.conf
```c
CONFIG_BT_FILTER_ACCEPT_LIST=y
CONFIG_BT_PRIVACY=y
```
根据过滤器接受列表添加新的广告参数。
定义未使用过滤器接受列表时的广告参数 `BT_LE_ADV_CONN_NO_ACCEPT_LIST`
```c
#define BT_LE_ADV_CONN_NO_ACCEPT_LIST  BT_LE_ADV_PARAM(BT_LE_ADV_OPT_CONNECTABLE|BT_LE_ADV_OPT_ONE_TIME, \
				       BT_GAP_ADV_FAST_INT_MIN_2, \
				       BT_GAP_ADV_FAST_INT_MAX_2, NULL)
```
定义使用过滤器接受列表时的广告参数 `BT_LE_ADV_CONN_ACCEPT_LIST`
`BT_LE_ADV_OPT_FILTER_CONN` 过滤掉来自列表中未列出的设备的连接请求。
```c
#define BT_LE_ADV_CONN_ACCEPT_LIST BT_LE_ADV_PARAM(BT_LE_ADV_OPT_CONNECTABLE|BT_LE_ADV_OPT_FILTER_CONN|BT_LE_ADV_OPT_ONE_TIME, \
				       BT_GAP_ADV_FAST_INT_MIN_2, \
				       BT_GAP_ADV_FAST_INT_MAX_2, NULL)
```
定义循环键列表的函数 `setup_accept_list()` ，并将地址添加到过滤器接受列表
定义回调 `setup_accept_list_cb` 以将地址添加到过滤器接受列表。
定义将为绑定列表的每次迭代调用的回调函数，以将对等地址添加到筛选器接受列表，使用 `bt_le_filter_accept_list_add()`
```c
static void setup_accept_list_cb(const struct bt_bond_info *info, void *user_data)
{
	int *bond_cnt = user_data;
	if ((*bond_cnt) < 0) {
		return;
	}
	int err = bt_le_filter_accept_list_add(&info->addr);
	printk("Added following peer to whitelist: %x %x \n",info->addr.a.val[0],info->addr.a.val[1]);
	if (err) {
		printk("Cannot add peer to Filter Accept List (err: %d)\n", err);
		(*bond_cnt) = -EIO;
	} else {
		(*bond_cnt)++;
	}
}
```
定义一个函数来遍历所有现有绑定，使用 `bt_foreach_bond()` 然后调用 `setup_accept_list_cb()`
对于每个债券，我们将调用 `setup_accept_list_cb()` 将对等地址添加到过滤器接受列表中。
```c
static int setup_accept_list(uint8_t local_id)
{
	int err = bt_le_filter_accept_list_clear();
	if (err) {
		printk("Cannot clear Filter Accept List (err: %d)\n", err);
		return err;
	}
	int bond_cnt = 0;
	bt_foreach_bond(local_id, setup_accept_list_cb, &bond_cnt);
	return bond_cnt;
}
```
定义使用过滤器接受列表开始广告的函数 `advertise_with_acceptlist()` 。
创建一个工作队列函数，调用 `setup_accept_list()` 建立过滤接受列表，然后使用过滤接受列表（如果非空）开始发送广告，否则不使用过滤接受列表发送广告。
在此函数中，如果列表为空，我们将进行 `BT_LE_ADV_CONN_NO_ACCEPT_LIST` 广告。
```c
void advertise_with_acceptlist(struct k_work *work)
{
	int err=0;
	int allowed_cnt= setup_accept_list(BT_ID_DEFAULT);
	if (allowed_cnt<0){
		printk("Acceptlist setup failed (err:%d)\n", allowed_cnt);
	} else {
		if (allowed_cnt==0){
			printk("Advertising with no Filter Accept list\n"); 
			err = bt_le_adv_start(BT_LE_ADV_CONN_NO_ACCEPT_LIST, ad, ARRAY_SIZE(ad),
					sd, ARRAY_SIZE(sd));
		}
		else {
			printk("Acceptlist setup number  = %d \n",allowed_cnt);
			err = bt_le_adv_start(BT_LE_ADV_CONN_ACCEPT_LIST, ad, ARRAY_SIZE(ad),
				sd, ARRAY_SIZE(sd));	
		}
		if (err) {
		 	printk("Advertising failed to start (err %d)\n", err);
			return;
		}
		printk("Advertising successfully started\n");
	}
}
K_WORK_DEFINE(advertise_acceptlist_work, advertise_with_acceptlist);
```
在 main 中提交此工作队列，就在原始广播代码之前
```c
k_work_submit(&advertise_acceptlist_work);
```
 删除未使用过滤器的广播代码，在 `on_disconnected()` 回调中提交相同的工作队列
 在断开连接事件的回调中提交工作 `advertise_acceptlist()` 队列。因此，如果有任何新的绑定，我们将在断开连接时将其更新到过滤器接受列表。
```c
k_work_submit(&advertise_acceptlist_work);
```
增加最大配对设备数量，使用 `CONFIG_BT_MAX_PAIRED`  增加一次允许的配对设备数，其默认值为 1。