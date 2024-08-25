## Settings 配置
### prj.conf
```c
CONFIG_STDOUT_CONSOLE=y
CONFIG_FLASH=y
CONFIG_FLASH_PAGE_LAYOUT=y
CONFIG_FLASH_MAP=y

CONFIG_SETTINGS=y
CONFIG_SETTINGS_RUNTIME=y


# Enable file systems and storage
CONFIG_FILE_SYSTEM=y
CONFIG_FILE_SYSTEM_LITTLEFS=y


# Additional configurations for LittleFS
CONFIG_FS_LITTLEFS_CACHE_SIZE=256
CONFIG_FS_LITTLEFS_LOOKAHEAD_SIZE=16

CONFIG_SETTINGS_FILE=y
```
### 实现
```c
/*
 * Copyright (c) 2019 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: Apache-2.0
 */

#include <stdio.h>
#include <string.h>

#include <zephyr/settings/settings.h>

#include <errno.h>
#include <zephyr/sys/printk.h>


#include <zephyr/fs/fs.h>
#include <zephyr/fs/littlefs.h>

char buff10[] = "kT4pM2jN7x";
char buff50[] = "kT4pM2jN7xR3yL5dP9wQ6vF8bH2nT1jL6zR5qX3kP8yL4dM7wF";
char buff100[] = "kT4pM2jN7xR3yL5dP9wQ6vF8bH2nT1jL6zR5qX3kP8yL4dM7wF2nN9tQ6vY1xR3pL7jH5dT8bQ2kP6nM9yR1vX4jL6pT3dW5bN8t";
char buff150[] = "kT4pM2jN7xR3yL5dP9wQ6vF8bH2nT1jL6zR5qX3kP8yL4dM7wF2nN9tQ6vY1xR3pL7jH5dT8bQ2kP6nM9yR1vX4jL6pT3dW5bN8tQ2kY9wL4xR7jM1vF6dP3nH5qT8kN2pQ9yL7wX4bR1mF5tP6nM8";

#define TEST_ARR buff150

static struct settings_handler my_settings = {
    .name = "mnvs"
};

static int direct_loader(const char *name, size_t len, settings_read_cb read_cb,
			  void *cb_arg, void *param)
{
	int rc;
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

	int64_t start = 0;
	k_uptime_delta(&start);
	// 存储
	rc = settings_save_one("mnvs/test", TEST_ARR, strlen(TEST_ARR));
    if (rc) {
        printk("Failed to save setting (err %d)", rc);
    }
	printk("w time -> %lld\n", k_uptime_delta(&start));

	settings_load_subtree_direct("mnvs", direct_loader, 0);
	printk("r time -> %lld\n", k_uptime_delta(&start));

	return 0;
}
```