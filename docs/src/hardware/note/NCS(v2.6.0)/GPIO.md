对于reset引脚来说，`PSELRESET[0]`和`PSELREET[1]`的值都是PIN=18，PORT=0，CONNECT=0的情况下，P0.18才会作为Reset引脚使用。否则，P0.18作为普通GPIO使用。**Reset信号无法映射到其他GPIO**。
软件控制reset引脚作为普通GPIO使用：
- 在nRF5 SDK中，**不要**设置全局宏定义`CONFIG_GPIO_AS_PINRESET`
- 在NCS中：`CONFIG_GPIO_AS_PINRESET=n`
NFC引脚是固定的两个，对于nRF52833来说是P0.09和P0.10。默认情况下这两个IO是GPIO，只有UICR中对应的bit写1之后，这两个IO才能作为NFC来工作。
软件控制NFC引脚作为普通GPIO使用：
- 在nRF5 SDK中，在Keil/SES/Makefile中设置全局宏定义`CONFIG_NFCT_PINS_AS_GPIOS`
- 在NCS中，在prj.conf或其他配置文件中，添加`CONFIG_NFCT_PINS_AS_GPIOS=y`
添加后，系统启动时会自动擦写UICR并重启。
## 在Zephyr DeviceTree中配置GPIO
GPIO的配置是一个**属性**，因此必须写在一个节点（Node）内，例如`led_0`内。
`/zephyr,user`是一个自由的节点，就是用来绕过Device Binding，专门放开发者一些自由的device tree属性的，想在里面写什么都可以。
```c
/{
    zephyr,user{
        my-gpios = <&gpio0 12 (GPIO_ACTIVE_HIGH|GPIO_PUSH_PULL|GPIO_PULL_DOWN)>;
    };
};
```
然后是属性的名字，**属性的名称必须以`gpios`结尾**，也可以只写`gpios`。这样它才能被编译系统识别。
然后是属性的值，这是一个phandle-array类型的属性，可以写很多组。每个元素都是由三个部分组成：
- GPIO Controller：也就是我们俗称的port。这里可以直接引用label，例如`&gpio0`。
- GPIO Pin Number：这个就是引脚编号。P0.12的编号就是12。
- GPIO配置：激活状态、输入输出、上下拉等等。可以在这里配置，也可以后续在应用代码里配置修改。
激活状态`GPIO_ACTIVE_LOW`的意思是“逻辑1 = 低电平”；`GPIO_ACTIVE_HIGH`的意思是“逻辑1 = 高电平”。**这是用于配置激活状态的参数，而不是部分人误解的配置默认输出高低电平的参数。**
## 在代码中控制GPIO
prj.conf
```bash
CONFIG_GPIO=y
```
include
```c
#include <zephyr/devicetree.h>
#include <zephyr/device.h>
#include <zephyr/drivers/gpio.h>
```
### 使用device tree中定义的gpios来控制
在main函数中创建一个`gpio_dt_sepc`结构体，这个是操作一个单独GPIO的句柄：
```c
 const struct gpio_dt_spec my_gpio = GPIO_DT_SPEC_GET(DT_PATH(zephyr_user), my_gpios);
```
### 配置与读写
```c
// write
gpio_pin_configure_dt(&my_gpio, GPIO_OUTPUT);
gpio_pin_set_dt(&my_gpio, 1);

//read
gpio_pin_configure_dt(&my_gpio, GPIO_INPUT);
int val = gpio_pin_get_dt(&my_gpio);
```
### 绕过device tree配置，直接控制GPIO
使用的所有GPIO都不会在DeviceTree中有提示，如果有GPIO使用冲突，编译时无法帮你检查出来。
```c
//获取GPIO Port的句柄
const struct device *dev_gpio0 = DEVICE_DT_GET(DT_NODELABEL(gpio0));

gpio_pin_configure(dev_gpio0, 12, GPIO_OUTPUT);
gpio_pin_set(dev_gpio0, 12, 1);

gpio_pin_configure(dev_gpio0, 12, GPIO_INPUT);
int val = gpio_pin_get(dev_gpio0, 12);
```
### 配置IO口电流驱动能力
#### 参数有
```c
/** Standard drive for '0' (default, used with GPIO_OPEN_DRAIN) */
#define NRF_GPIO_DRIVE_S0	(0U << 8U)
/** High drive for '0' (used with GPIO_OPEN_DRAIN) */
#define NRF_GPIO_DRIVE_H0	(1U << 8U)
/** Standard drive for '1' (default, used with GPIO_OPEN_SOURCE) */
#define NRF_GPIO_DRIVE_S1	(0U << 9U)
/** High drive for '1' (used with GPIO_OPEN_SOURCE) */
#define NRF_GPIO_DRIVE_H1	(1U << 9U)
/** Standard drive for '0' and '1' (default) */
#define NRF_GPIO_DRIVE_S0S1	(NRF_GPIO_DRIVE_S0 | NRF_GPIO_DRIVE_S1)
/** Standard drive for '0' and high for '1' */
#define NRF_GPIO_DRIVE_S0H1	(NRF_GPIO_DRIVE_S0 | NRF_GPIO_DRIVE_H1)
/** High drive for '0' and standard for '1' */
#define NRF_GPIO_DRIVE_H0S1	(NRF_GPIO_DRIVE_H0 | NRF_GPIO_DRIVE_S1)
/** High drive for '0' and '1' */
#define NRF_GPIO_DRIVE_H0H1	(NRF_GPIO_DRIVE_H0 | NRF_GPIO_DRIVE_H1)
```
#### 配置
```c
#include <zephyr/dt-bindings/gpio/nordic-nrf-gpio.h>

...

gpio_pin_configure_dt(&my_gpio, GPIO_OUTPUT | GPIO_OPEN_DRAIN | NRF_GPIO_DRIVE_H0);
// 开漏输出，且低电平为高电流驱动能力
```
## 使用GPIO中断
```c
void button_pressed(const struct device *dev, struct gpio_callback *cb,uint32_t pins)
{
	printk("Button pressed at %lu \n", k_cycle_get_32());
}

void main()
{
    ...
        
    // get the gpio dt specifier
    const struct gpio_dt_spec button = GPIO_DT_SPEC_GET(DT_ALIAS(sw0), gpios);

    // configure pin
    gpio_pin_configure_dt(&button, GPIO_INPUT);

    // configure interrupt: rising edge
    gpio_pin_interrupt_configure_dt(&button, GPIO_INT_EDGE_TO_ACTIVE);

    // init and add your callbacks
    static struct gpio_callback button_cb_data;
    gpio_init_callback(&button_cb_data, button_pressed, BIT(button.pin));
    gpio_add_callback(button.port, &button_cb_data);
    
    ...
}
```
# Zephyr中分配外设引脚
在device tree中看到更多的是使用`pinctrl`去控制。
```c
  
&spi3 {
	status = "okay";
	cs-gpios = <&arduino_header 16 GPIO_ACTIVE_LOW>; /* D10 */
	pinctrl-0 = <&spi3_default>;
	pinctrl-1 = <&spi3_sleep>;
	pinctrl-names = "default", "sleep";
};

&pinctrl{
	spi3_default: spi3_default {
        group1 {
            psels = <NRF_PSEL(SPIM_SCK, 1, 15)>, // P1.15
                <NRF_PSEL(SPIM_MISO, 1, 14)>,    // P1.14
                <NRF_PSEL(SPIM_MOSI, 1, 13)>;    // P1.13
        };
    };

    spi3_sleep: spi3_sleep {
        group1 {
            psels = <NRF_PSEL(SPIM_SCK, 1, 15)>, // P1.15
                <NRF_PSEL(SPIM_MISO, 1, 14)>,    // P1.14
                <NRF_PSEL(SPIM_MOSI, 1, 13)>;    // P1.13
            low-power-enable;
        };
    };
}
```
以上代码定义了两种状态，分别叫"default"和"sleep"，两种状态的GPIO配置并不相同。那么在厂商提供的驱动代码中，只需要一行`pinctrl_apply_state()`函数，就能把所有的GPIO同时切换到另一种状态。这个是方便了驱动代码的编写。
只需注意，外设的引脚也是可以配置IO口电流驱动能力、上下拉的，例如：
```c
i2c0_default: i2c0_default {
    group1 {
        psels = <NRF_PSEL(TWIM_SDA, 0, 26)>,
            <NRF_PSEL(TWIM_SCL, 0, 27)>;
        nordic,drive-mode = <NRF_DRIVE_S0D1>; // standard 0, disconnect 1
        bias-pull-up;                         // internal pull-up
    };
};
```