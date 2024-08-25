`NVS` (Non-Volatile Storage) 是一种用于在嵌入式设备上持久化存储数据的存储机制。在 Nordic nRF Connect SDK (NCS) 中，`NVS` 使用闪存来存储数据，可以确保设备在断电后仍能保留数据。`NVS` 提供了一种简单且高效的方式来读写小型数据对象（如配置参数、状态信息等）。
### `NVS` 的基本概念
- **扇区（Sector）**：闪存被分成多个扇区，每个扇区是存储操作的最小擦除单位。
- **页面（Page）**：`NVS` 逻辑上将一个或多个扇区视为一个页面。
- **条目（Entry）**：存储在 `NVS` 中的数据项。
### `NVS` 的主要特性
1. **持久性**：数据存储在闪存中，即使设备重启或断电，数据仍然存在。
2. **键值对存储**：数据以键值对的形式存储，便于管理和查找。
3. **可穿越性**：即使在写操作过程中断电，`NVS` 也能保证数据的完整性。
### overlay
```c
/ {
    nvs_partition: partition@fc000 {
        label = "storage";
        reg = <0x000fc000 0x4000>;
    };
};
```
`reg`：定义了 `NVS` 分区的起始地址和大小，这里示例为从地址 `0x000fc000` 开始，占用 `16 KB`。
### prj.conf
```c
CONFIG_FLASH=y
CONFIG_NVS=y
```
### include
```c
#include <zephyr/drivers/flash.h>
#include <zephyr/storage/flash_map.h>
#include <zephyr/fs/nvs.h>
```
### 配置与使用
```c
static struct nvs_fs fs;

#define NVS_PARTITION		storage_partition
#define NVS_PARTITION_DEVICE	FIXED_PARTITION_DEVICE(NVS_PARTITION)
#define NVS_PARTITION_OFFSET	FIXED_PARTITION_OFFSET(NVS_PARTITION)

int main(void) {
	int rc = 0;
	struct flash_pages_info info;

	fs.flash_device = NVS_PARTITION_DEVICE;
	if (!device_is_ready(fs.flash_device)) {
		printk("Flash device %s is not ready\n", fs.flash_device->name);
		return 0;
	}
	fs.offset = NVS_PARTITION_OFFSET;
	rc = flash_get_page_info_by_offs(fs.flash_device, fs.offset, &info);
	if (rc) {
		printk("Unable to get page info\n");
		return 0;
	}
	fs.sector_size = info.size;
	fs.sector_count = 3U;

	// 挂载 nvs
	rc = nvs_mount(&fs);
	if (rc) {
		printk("Flash Init failed\n");
		return 0;
	}
}
```
### 读写数据
```c
#define TEST_ID 1
#define TEST_DATA "Hello, NVS!"

void write_nvs_data(void)
{
    int rc;
    rc = nvs_write(&fs, TEST_ID, TEST_DATA, strlen(TEST_DATA) + 1);
    if (rc < 0) {
        LOG_ERR("Failed to write to NVS (err %d)", rc);
    } else {
        LOG_INF("Data written to NVS");
    }
}

void read_nvs_data(void)
{
    char buf[32];
    int rc;
    rc = nvs_read(&fs, TEST_ID, buf, sizeof(buf));
    if (rc < 0) {
        LOG_ERR("Failed to read from NVS (err %d)", rc);
    } else {
        LOG_INF("Data read from NVS: %s", buf);
    }
}
```
## settings 配置
### prj.conf
```c
CONFIG_FLASH=y
CONFIG_FLASH_PAGE_LAYOUT=y

CONFIG_NVS=y
CONFIG_LOG=y
CONFIG_LOG_MODE_IMMEDIATE=y
CONFIG_NVS_LOG_LEVEL_DBG=y
CONFIG_REBOOT=y
CONFIG_MPU_ALLOW_FLASH_WRITE=y

CONFIG_SETTINGS=y
CONFIG_SETTINGS_RUNTIME=y
CONFIG_FLASH_MAP=y
CONFIG_SETTINGS_NVS=y
```

```c
#include <zephyr/kernel.h>
// #include <zephyr/sys/reboot.h>
#include <zephyr/device.h>
#include <string.h>
// #include <zephyr/drivers/flash.h>
// #include <zephyr/storage/flash_map.h>
#include <zephyr/settings/settings.h>
#include <settings/settings_nvs.h>

#define NVS_TEST_NAME "mnvs/test"

#define TEST_ARR buff10

static int my_settings_set(const char *key, size_t len, settings_read_cb read_cb, void *cb_arg)
{
    int rc;
	printk(" ------------- settings load -------------\n");
	printk("Loaded setting -> %s\n", key);
    if (strcmp(key, "test") == 0) {
        rc = read_cb(cb_arg, &buff10, sizeof(buff10));
        if (rc >= 0) {
            printk("Loaded setting: my_param = %s\n", buff);
        }
        return rc;
    }
    return -ENOENT;
}

static int my_settings_commit(void)
{
    printk("Settings commit");
    return 0;
}

static struct settings_handler my_settings = {
    .name = "mnvs",
    .h_set = my_settings_set,
    .h_commit = my_settings_commit,
	.h_commit = NULL,
    .h_export = NULL,
};

static int direct_loader(const char *name, size_t len, settings_read_cb read_cb,
			  void *cb_arg, void *param)
{
	int rc;
	// printk(" ------------- subtree load -------------\n");
	// printk("param -> %d\n", len);
	// printk("name -> %s\n", name);
	if (strcmp(name, "test") == 0) {
        rc = read_cb(cb_arg, &TEST_ARR, sizeof(TEST_ARR));
        if (rc >= 0) {
            // printk("Loaded setting: my_param = %s\n", buff10);
        }
        return rc;
    }
	return 0;
	return -ENOENT;
}

int main(void)
{
	int rc = 0;
	rc = settings_subsys_init();
	if(rc) {
		printk("setting init failed\n");
		return 0;
	}

	rc = settings_register(&my_settings);
	if(rc) {
		printk("setting regiter failed\n");
		return 0;
	}
	// 遍历读取
	// rc = settings_load();
    // if (rc) {
    //     printk("Settings load failed (err %d)", rc);
    //     return 0;
    // }
	// settings_runtime_get(NVS_TEST_NAME, buff, strlen(buff));
	
	int64_t start = 0;
	k_uptime_delta(&start);
	// 存储
	rc = settings_save_one("mnvs/test", TEST_ARR, strlen(TEST_ARR));
    if (rc) {
        printk("Failed to save setting (err %d)", rc);
    } else {
        // printk("Setting saved: -> %s\n", buff);
    }
	printk("w time -> %lld\n", k_uptime_delta(&start));
	start = start = k_uptime_get();
	k_uptime_delta(&start);
	// 读取并注册回调
	settings_load_subtree_direct("mnvs", direct_loader, 0);
	// 直接数据读取，调用 h_set 回调
	// settings_load_subtree("mnvs/test");
	printk("r time -> %lld\n", k_uptime_delta(&start));
	return 0;
}
```
