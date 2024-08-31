### pri.conf
```c
CONFIG_ADC=y
```
### overlay
```c
/ {
	zephyr,user {
		io-channels = <&adc 0>;
	};
};
```
#### 配置 ADC 通道
```c
&adc {
	#address-cells = <1>;
	#size-cells = <0>;
	status = "okay";
	channel@0 {
		reg = <0>;
		zephyr,gain = "ADC_GAIN_1_6";
		zephyr,reference = "ADC_REF_INTERNAL";
		zephyr,acquisition-time = <ADC_ACQ_TIME_DEFAULT>;
		zephyr,input-positive = <NRF_SAADC_AIN0>; /* P0.02 for nRF52xx, P0.04 for nRF5340 */
		zephyr,resolution = <12>;
	};
};
```
Channel 和_reg_中 @ 后面的 0 表示引用 ADC 的通道 0
增益`zephyr,gain`设置为`ADC_GAIN_1_6` ，这意味着读数将衰减`(x 1/6` )
nRF SAADC 支持以下增益：1/6、1/5、1/4、1/3、1/2、1、2、4
参考电压`zephyr,reference` ，我们将使用内部 +0.6，由`ADC_REF_INTERNAL`指定
采集时间`zephyr,acquisition-time`  ，我们将使用硬件ADC_ACQ_TIME_DEFAULT,即10us 
模拟输入`zephyr,input-positive` ，我们将通过**不**指定输入负属性来使用单端输入，并将其设置为 AIN0 ( `NRF_SAADC_AIN0` )。由于单端模式只是差分模式，负端在内部连接到 GND，因此噪声可能会导致测量值出现轻微的负值。
### 模拟输入映射
nRF SoC 之间的映射可能有所不同，如下表所示：

| **SoC/SiP 系统级芯片/系统级封装** | AIN0  | AIN1  | AIN2  | AIN3  | AIN4  | AIN5  | AIN6  | AIN7  |
| ----------------------- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| nRF52833                | P0.02 | P0.03 | P0.04 | P0.05 | P0.28 | P0.29 | P0.30 | P0.31 |
| nRF5340                 | P0.04 | P0.05 | P0.06 | P0.07 | P0.25 | P0.26 | P0.27 | P0.28 |
| nRF9160                 | P0.13 | P0.14 | P0.15 | P0.16 | P0.17 | P0.18 | P0.19 | P0.20 |
可以通过在`zephyr,input-positive`中指定`NRF_SAADC_VDD`或`NRF_SAADC_VDDHDIV5`来使用 SADDC 来测量内部电压
分辨率`zephyr,resolution` 选择 12 位
### 获取节点并进行采集
```c
#include <zephyr/drivers/adc.h>

static const struct adc_dt_spec adc_channel = ADC_DT_SPEC_GET(DT_PATH(zephyr_user));

int main(void) {

  // 判断设备状态	
  if (!adc_is_ready_dt(&adc_channel)) {
    LOG_INF("ADC controller devivce %s not ready", adc_channel.dev->name);
    return 0;
  }
  ret = adc_channel_setup_dt(&adc_channel);
  if (ret < 0) {
    LOG_INF("Could not setup channel #%d", 0);
    return 0;
  }
	
  int16_t buf;
  struct adc_sequence sequence = {
      .buffer = &buf,
      /* buffer size in bytes, not number of samples */
      .buffer_size = sizeof(buf),
      // Optional
      //.calibrate = true,
  };

  ret = adc_sequence_init_dt(&adc_channel, &sequence);
  if (ret < 0) {
    LOG_INF("Could not initalize sequnce");
    return 0;
  }
  while (1) {
    ret = adc_read(adc_channel.dev, &sequence);
    if (ret < 0) {
      LOG_ERR("Could not read (%d)", ret);
      continue;
    }

    int32_t val_mv = buf;
    ret = adc_raw_to_millivolts_dt(&adc_channel, &val_mv);
    // // snprintf(value_str, sizeof(value_str), "%f", val_mv);
    // /* conversion to mV may not be supported, skip if not */
    // if (ret < 0)
    // {
    //     LOG_INF(" (value in mV not available)\n");
    // }
    // else
    // {
    //     LOG_INF(" = %s mV", val_mv);
    // }
    k_sleep(K_MSEC(500));
    LOG_INF(" = %d mV", val_mv);

    LOG_INF("-----------");
  }
}

```