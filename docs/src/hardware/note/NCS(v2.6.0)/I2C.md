## 基础配置
### prj.conf 文件添加
```c
CONFIG_I2C=y
```
### .overlay 文件
```c
&pinctrl {
	i2c1_default: i2c1_default {
		group1 {
			psels = <NRF_PSEL(TWIM_SDA, 0, 0x17)>,
				<NRF_PSEL(TWIM_SCL, 0, 0x16)>;
		};
	};

	i2c1_sleep: i2c1_sleep {
		group1 {
			psels = <NRF_PSEL(TWIM_SDA, 0, 0x17)>,
				<NRF_PSEL(TWIM_SCL, 0, 0x16)>;
			low-power-enable;
		};
	};
};



&i2c1 {
	compatible = "nordic,nrf-twim";
	status = "okay";
	pinctrl-0 = <&i2c1_default>;
	pinctrl-1 = <&i2c1_sleep>;
    // mysensor: mysensor@44{
    //     compatible = "i2c-device";
    //     reg = < 0x44 >;
    //     label = "MYSENSOR";
    // };
    mysensor: mysensor@44{
        compatible = "sensirion,sht4x";
        repeatability = <2>;
        reg = < 0x44 >;
        label = "MYSENSOR";
    };
};

&i2c0 {
    status = "disabled";
};
&spi0 {
    status = "disabled";
};
&spi1 {
    status = "disabled";
};
```
## 通过 I2C 通信传感器
```c
// 节点标签
#define I2C0_NODE DT_NODELABEL(mysensor)

static uint8_t trans_buff[1] = { 0xFD };

// 获取 spec
static const struct i2c_dt_spec dev_i2c = I2C_DT_SPEC_GET(I2C0_NODE);

if (!device_is_ready(dev_i2c.bus)) {
        printk("I2C bus %s is not ready!\n\r", dev_i2c.bus->name);
        return 0;
}

ret = i2c_write_dt(&dev_i2c, trans_buff, sizeof(trans_buff));

if (ret != 0) {
	printk("Failed to write to I2C device address -> %d \n", ret);
} else {
	k_msleep(10);
	uint8_t rec_data[6] = { 0 };
	ret = i2c_read_dt(&dev_i2c, rec_data, sizeof(rec_data));
	if (ret != 0) {
		printk("Failed to read from I2C device address \n");
	} else {
		printk("receive data is -> ");
		for (uint8_t i = 0; i < sizeof(rec_data); i++) {
			printk("%d", rec_data[i]);
		}
		printk("\n");
	}
}
```