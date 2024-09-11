---
title: USB笔记
date: 2023-10-19 09:41:30
tags:
categories:
classes: 笔记
---

# 描述符

### 配置描述符

```c
0 blength 1 数字
1 bDescriptorType 常量
2 wTotalL.ength 2 数字
4 bNumInterfaces 1 数字
5 bConfigurationValue 、 数字
6 iConfiguration 1 索引
7 bmAttributes 1 基于位映射
8 MaxPower 1 mA
```

`blength`： 描述符长度，配置描述符固定为9字节

`bDescriptorType`： 固定为0x02

`wTotalLength`： 表示配置描述符的长度，也就是包含接口、端点（及其他特定类）描述符信息的总长度，它以双字节来表示（而不是BCD

`bNumInterfaces`：表示接口数量

- 如果一个设备包含多个接口，且每个接口代表一个独立的功能，称为复合设备（CompositeDevice）。例如，带鼠标功能的多媒体键盘可以实现鼠标与键盘的功能，带录音与扬声器功能的设备可以实现录制与播放功能。
- 无论一个复合设备有多少个接口，主机只会给该设备分配一个地址，但对于组合设备而言，主机会给每个功能（设备）分配一个地址。

`bConfigurationValue`： 表示配置值。我们已经提过，一个USB设备可以有多个配置，该配置值就是每个配置的标识。设备只有在配置完成后才算完成总线枚举过程，主机在枚举过程中会读取设备支持的所有配置描述符，最后才发送命令来选择一个配置。如果选择的配置值与该字段值一样，说明该值对应的配置被激活。

`iConfiguration`: 为描述该配置字符串的索引值。如果没有，可以设置为0。

`bmAttributes`: 表示USB设备的配置特性，它是基于位映射的字段（一个或多个数据位代表一定的功能配置)

`MaxPower`: 表示电流大小，以2 mA 为一个单位，0x32 表示100 mA

### 接口描述符

```c
0 blength 1 数字
1 bDescriptorType 1 常量
2 bInterfaceNumber 1 数字
3 bAlternateSetting 1 数字
4 bNumEndpoints 1 数字
5 blnterfaceClass 1 类
bInterfaceSubClass 1 子类
7 bInterfaceProtocol 协议
8 iInterface 1 索引
```

`bLength`: 表示接口描述符的长度

`bDescriptorType`: 表示描述符的类型，此处为0x04

`bInterfaceNumber`: 表示接口的编号

- （接口数量由配置描述符中的bNumInterfaces字段决定），如果一个配置有多个接口，那么每个接口都有一个从0开始递增的独立编号

`bAlternateSetting`: 表示备用接口编号，其用法与接口编号一样，可以理解为下一层级的接口编号，一般比较少使用（不使用可以设置为0）。

- 一个设备允许拥有多个配置，主机在总线枚举过程中会选择并激活其中一个，而备用接口编号则允许在只有一个配置的情况下，在同一个接口内实现多种模式切换，从而达到实现多个配置的目的。

`bNumEndooints`： 表示接口使用的端点数量。

- 该字段表示的端点数量不包含端点 0，该字段的值为0x01，表示USB操纵杆使用了两个端点
- 如果接口仅使用端点 0，则接口描述符不再返回端点描述符，通过默认控制管道进行数据传输，此时字段为 0

`bInterfaceClass`. `blnterfaceSubClass` .`bInterfaceProtocol` 三 个字段分别表示

接口类、接口子类、接口协议，它们分别与设备描述符中的bDeviceClass、bDeviceSubClass与bDeviceProtocol的意义是对应

- 如果将设备描述符中的 bDeviceClass 字段设置为0，则在接口描述符中会进一步定义具体要求的接口功能
- 如果bInterfaceClass字段的值为0xFF，表示接口类由厂商自定义；如果为0x00，则为将来标准化保留，其他字段的值由USB-IF分配。HID类设备中接口描述符的bIntrfaceClass字段总是为 `0x03`
- bInrterfaceClass 字段为 `0x03`是将自己枚举为HID设备类，也同时意味着已经决定按HID设备类的方式与主机通信，之后在 hid 描述符中配置

`bInterfaceSubClass`:  字段的值的设置随 bInterfaceClass的不同而不同。如果 bInterfaceClas字段的值为0，则该字段的值也必须为0

`bInterfaceProtocol`:   0=none, 1=keyboard, 2=mouse

### 端点描述符

```c
0 bLength
1 bDescriptorType
2 bEndpointAddress
3 bmAttributes
4 wMaxPacketSize
6 bInterval
```

`bLength`: 表示端点描述符的长度

- 可以灵活调整，接口数量也可以调整，实际应用中端点调整操作相对较多
- 如果在源代码中进行增加或删除端点描述符的数量，也必须同时对该字段进行修改

`bDescriptorType`: 固定为0×05

由于使用4位来表示端点号，所以端点地址的有效范围为0~15（低速设备仅定义了3个端点，全速与高速设备可使用所有16个端点

需要特别注意两点：：其一，端点的方向定义是以主机为参考的。也就是说，输出（OUT）端点的数据传输方向是从主机到设备（下行），而输入（IN）端点则恰好相反。其二，端点方向的定义对控制端点是无效的。

`中断传输`是一种轮询的单向传输方式，主机以固定时间间隔对中断端点进行查询，主要用于传输少量或中量对处理时间有要求的数据。例如，鼠标、键盘类设备就适用中断传输中断传输的延迟有保证，但并非实时传输，它是一种延迟有限且支持错误重传的可靠传输对于低速、全速、低速端点，中断传输的最大数据包长度分别可以达到8字节、64字节1024字节

`批量传输`（也称块传输）是一种可靠的单向传输，但对传输时间与速率没有保证，适合数据量比较大的传输，U盘就是批量传输的典型应用。批量传输相对其他传输类型具有最低的优先级，主机总是优先安排其他类型的传输，当总线带宽有富余时才安排批量传输。如果USB总线带宽很紧张，则批量传输的优先级会降低，相应的传输速率会比较低，花费的时间自然也比较长，但是在总线空闲时，其传输速率是最快的（理论上）。需要注意的是：低速USB设备不支持批量传输。高速端占的最大数据包长度为512字节，全速端点的最大数据包长度可以为8字节、16字节、32字节、64字节。 `同步传输`（也称等时传输）是一种实时但不可靠的传输（不支持错误重发机制），适用于传输大量速率恒定且对服务周期有要求的数据。例如，音频与视频设备需要数据及时发送与接收，但对数据的正确性要求并不是非常高。需要注意的是，只有高速和全速端点支持同步传输，高速与全速同步端点的最大数据包长度分别为1024字节与1023字节。 `控制传输`对时间与速率均无要求，但是必须保证数据能够被传输。USB规范为控制传输保留了一定的总线带宽，以期达到尽快得到传输的目的。USB 规范还使用很多机制来保证数据传输的正确与可靠性（后述）。需要注意的是，控制传输类型是双向的，所以给控制端点定义方向是无效的。 控制传输是一种特殊的传输方式，其传输过程相对其他三种而言更复杂一些，后续我们会结合源代码深入探讨。所有USB设备都有默认的控制传输方式，它主要用于USB主机与设备之间的配置信息通信。例如，USB设备连接主机时，主机需要通过控制传输获取描述符以及对设备进行一些配置。当然，普通数据的传输也可以使用控制传输完成（后续会有相应的实例），只不过一般情况更倾向于使用其他传输类型。控制传输对于最大数据包长度有固定的要求。高速与低速设备分别为64字节与8字节，而全速设备可以是8字节、16字节、32字节、64字节之一。

`bmAttributes`: 决定以上 4 种传输类型

`wMaxPacketSize`:  表示端点支持（接收或发送）的最大数据包字节长度

`bInterval`: 表示主机轮询中断端点（对于其他端点的意义可参考USB规范）的时间间隔，其范围为1~255，单位时间则取决于设备速率模式（低速与全速设备为1ms，高速设备为125μs），而时间长度则取决于端点类型。例如，对于全速与低速中断端点，其范围可设置为1~255，对应的时间范围为1~255ms；对于高速中断端点，该字段可设置范围为 1～16，时间间隔为2menal-l，对应的时间范围为125μs(2°×125μs)～4096ms(2 ×125μs)

## HID 描述符

- 如果将自己枚举为 HID 设备，就意味着必须有对应的  HID 描述符、报告（Report) 描述符以及可选的实体（Physical）描述符
- 必须用特定格式进行数据传输，描述符就是为了定义数据用途与格式
- 如果一个设备只有一个接口描述符，无论有几个端点描述符， HID 描述符只有一个

| 管道          | 要求 | 说明                                          |
| ------------- | ---- | --------------------------------------------- |
| 控制（端点0） | 必须 | 传输USB描述符、类请求到吗以及供查询的消息数据 |
| 中断输入      | 必须 | 设备到主机                                    |
| 中断输出      | 可选 | 主机到设备                                    |

```c
blengh
bDescriptorType
bcdHID
bCountryCode
bNumDescriptors
bDescriptorType
wDescriptorLength
```

`bLength`: 代表HD描述符的长度

`bDescriptorType`: 表动述符类型，此处固定为0×21

`bcdHID`: 使用BCD码表示的HID规范备号

`bCountryCode`: 代表国家代码，用来标识本地件

`bNumDescriptors`: 表示附加特定类描述符的数量，通常至少为1，之后的字段用来描述该附加特定类描述符的类型与长度

# 报告描述符

## 报告描述符的可用标签

| 主标签         | 全局标签         | 局部标签           |
| -------------- | ---------------- | ------------------ |
| Input          | Usage Page       | Usage              |
| Output         | Logical Minimum  | Usage Minimum      |
| Feature        | Logical Maximum  | Usage Maximum      |
|                | Physical Minimum | Designator Index   |
| Collection     | Physical Maximum | Designator Minimum |
| End Collection | Unit Exponent    | Designator Maximum |
|                | Unit             | String Index       |
|                | Report Size      | String Minimum     |
|                | Report ID        | String Maximum     |
|                | Report Count     | Delimiter          |
|                | Push             |                    |
|                | Pop              |                    |

# 本文目前基于 HAL 库进行修改

### 之后添加固件库的修改



## 两个接口(符合设备）的配置描述符

第一个接口专门用于收发数据

第二个接口包含三个设备，通过描述符 ID 区分不同的设备

— 三个设备分为实现键盘、鼠标、和媒体功能

## 修改 FS 配置描述符

```c
__ALIGN_BEGIN static uint8_t USBD_CUSTOM_HID_CfgDesc[USB_CUSTOM_HID_CONFIG_DESC_SIZ] __ALIGN_END =
{
  0x09, /* bLength: 长度，设备字符串的长度为9字节 */
  USB_DESC_TYPE_CONFIGURATION, /* bDescriptorType: 类型，配置描述符的类型 */

	// 0x40 -> 0x49 modify 增加第二个接口的 hid 描述符的长度
  0x49,//USB_CUSTOM_HID_CONFIG_DESC_SIZ, /* wTotalLength: 配置描述符的总长度 */
  0x00,

  // 0x01 -> 0x02 modify 此项为接口数量，设置两个接口
  0x02,         /*bNumInterfaces: 配置所支持的接口数量1个*/
  0x01,         /*bConfigurationValue: 该配置的值*/
  0x00,         /*iConfiguration: 该配置的字符串的索引值，该值为0表示没有字符串*/
  0xC0,         /*bmAttributes: bus powered */
  0x32,         /*MaxPower 100 mA: 从总线上获得的最大电流为100mA*/
 
  /************** 接口描述符 ****************/
  /* 09 */
  0x09,         /*bLength: 长度，接口描述符的长度为9字节 */
  USB_DESC_TYPE_INTERFACE,/*bDescriptorType: 接口描述符的类型*/
  0x00,         /*bInterfaceNumber: 该接口的编号*/
  0x00,         /*bAlternateSetting: 该接口的备用编号*/

	// 配置两个端点设置收发（IN/OUT)
  0x02,         /*bNumEndpoints: 该接口所使用的端点数*/
  0x03,         /*bInterfaceClass: 该接口所使用的类为HID*/
  0x00,         /*bInterfaceSubClass : 该接口所用的子类 1=BOOT, 0=no boot*/
  0x00,         /*nInterfaceProtocol : 该接口使用的协议 0=none, 1=keyboard, 2=mouse*/
  0,            /*iInterface: 该接口字符串的索引*/
  /******************** HID描述符 *************************/
  /* 18 */
  0x09,         /*bLength: HID描述符的长度为9字节*/
  CUSTOM_HID_DESCRIPTOR_TYPE, /*bDescriptorType: HID的描述符类型*/
  0x11,         /*bCUSTOM_HIDUSTOM_HID: HID协议的版本*/
  0x01,
  0x00,         /*bCountryCode: 国家代号*/
  0x01,         /*bNumDescriptors: 下级描述符的数量*/
  0x22,         /*bDescriptorType: 下级描述符的类型*/

	// 第一个接口报告描述符的大小
  USBD_CUSTOM_HID_REPORT_DESC_SIZE,/*wItemLength: 下一集描述符的长度*/
  0x00,
  /******************** 输入端点描述符 ********************/
  /* 27 */
  0x07,          /*bLength: 端点描述符的长度为7字节*/
  USB_DESC_TYPE_ENDPOINT, /*bDescriptorType: 端点描述符的类型*/
  CUSTOM_HID_EPIN_ADDR, /*bEndpointAddress: 该端点(输入)的地址,D7:0(OUT),1(IN),D6~D4:保留,D3~D0:端点号*/
  0x03, /*bmAttributes: 端点的属性为为中断端点. D0~D1表示传输类型:0(控制传输),
			1(等时传输),2(批量传输),3(中断传输) 非等时传输端点:D2~D7:保留为0 等时传输端点：
			D2~D3表示同步的类型:0(无同步),1(异步),2(适配),3(同步) D4~D5表示用途:0(数据端点),
			1(反馈端点),2(暗含反馈的数据端点),3(保留)，D6~D7:保留,*/
  CUSTOM_HID_EPIN_SIZE, /*wMaxPacketSize: 该端点支持的最大包长度 */
  0x00,
  0x5          /*bInterval: 轮询间隔*/
  /* 34 */
  /******************** 输出端点描述符 ********************/
  0x07,	         /* bLength: 端点描述符的长度为7字节 */
  USB_DESC_TYPE_ENDPOINT,	/* bDescriptorType: 端点描述符的类型 */
  CUSTOM_HID_EPOUT_ADDR,  /*bEndpointAddress: 该端点(输入)的地址,D7:0(OUT),1(IN),D6~D4:保留,D3~D0:端点号*/
  0x03,	/* bmAttributes: 端点的属性为为中断端点. D0~D1表示传输类型:0(控制传输),1(等时传输),
			2(批量传输),3(中断传输) 非等时传输端点:D2~D7:保留为0 等时传输端点：
			D2~D3表示同步的类型:0(无同步),1(异步),2(适配),3(同步) D4~D5表示用途:0(数据端点),
			1(反馈端点),2(暗含反馈的数据端点),3(保留)，D6~D7:保留 */
  CUSTOM_HID_EPOUT_SIZE,	/* wMaxPacketSize: 该端点支持的最大包长度  */
  0x00,
  0x5	   /* bInterval: 轮询间隔 */
  /* 41 */
 
  /****************************** 第二个接口描述符 ****************************************/
  /* 41 */
  0x09,         /*bLength: 长度，接口描述符的长度为9字节 */
  USB_DESC_TYPE_INTERFACE,/*bDescriptorType: 接口描述符的类型*/

	// 0x00 -> 0x01 modify 配置此接口的编号
  0x01,         /*bInterfaceNumber: 该接口的编号*/
  0x00,         /*bAlternateSetting: 该接口的备用编号*/
  0x02,         /*bNumEndpoints: 该接口所使用的端点数*/
  0x03,         /*bInterfaceClass: 该接口所使用的类为HID*/
  0x00,         /*bInterfaceSubClass : 该接口所用的子类 1=BOOT, 0=no boot*/
	
	// 0x00 -> 0x01 modify 第二个接口的协议可以改为1
  0x01,         /*nInterfaceProtocol : 该接口使用的协议 0=none, 1=keyboard, 2=mouse*/

	// 0 -> 1 modify 表示字符串描述符的索引，不是主要配置
  1,            /*iInterface: 该接口字符串的索引*/
	
// 其他接口需要包含 HID 描述符
#if 1
  /******************** HID描述符 *************************/
  /* 50 */
  0x09,         /*bLength: HID描述符的长度为9字节*/
  CUSTOM_HID_DESCRIPTOR_TYPE, /*bDescriptorType: HID的描述符类型*/
  0x11,         /*bCUSTOM_HIDUSTOM_HID: HID协议的版本*/
  0x01,
  0x00,         /*bCountryCode: 国家代号*/
  0x01,         /*bNumDescriptors: 下级描述符的数量*/
  0x22,         /*bDescriptorType: 下级描述符的类型*/

	// 因为不同的接口采用不同的报告描述符，所以需要新建一个报告描述符并定义描述符长度
  USBD_CUSTOM_HID_FUNC_REPORT_DESC_SIZE,/*wItemLength: 下一集描述符的长度*/
  0x00,
#endif
  /******************** 输入端点描述符 ********************/
  /* 59 */
  0x07,          /*bLength: 端点描述符的长度为7字节*/
  USB_DESC_TYPE_ENDPOINT, /*bDescriptorType: 端点描述符的类型*/

	// 0x81 -> 0x82 modify 定义一个新的接收端点的地址
  CUSTOM_HID_FUNC_EPIN_ADDR,   /*bEndpointAddress: 该端点(输入)的地址,D7:0(OUT),1(IN),D6~D4:保留,D3~D0:端点号*/
  0x03, /*bmAttributes: 端点的属性为为中断端点. D0~D1表示传输类型:0(控制传输),
			1(等时传输),2(批量传输),3(中断传输) 非等时传输端点:D2~D7:保留为0 等时传输端点：
			D2~D3表示同步的类型:0(无同步),1(异步),2(适配),3(同步) D4~D5表示用途:0(数据端点),
			1(反馈端点),2(暗含反馈的数据端点),3(保留)，D6~D7:保留,*/

	// 根据对应接口描述符的大小，配置接收端点的大小
  CUSTOM_HID_FUNC_EPIN_SIZE, /*wMaxPacketSize: 该端点支持的最大包长度 */
  0x00,
  0x5,          /*bInterval: 轮询间隔*/
  /* 66 */
  /******************** 输出端点描述符 ********************/
  0x07,	         /* bLength: 端点描述符的长度为7字节 */
  USB_DESC_TYPE_ENDPOINT,	/* bDescriptorType: 端点描述符的类型 */

	// 0x01 -> 0x02 modify 定义一个新的发送端点的地址
  CUSTOM_HID_FUNC_EPOUT_ADDR,  /*bEndpointAddress: 该端点(输入)的地址,D7:0(OUT),1(IN),D6~D4:保留,D3~D0:端点号*/
  0x03,	/* bmAttributes: 端点的属性为为中断端点. D0~D1表示传输类型:0(控制传输),1(等时传输),
			2(批量传输),3(中断传输) 非等时传输端点:D2~D7:保留为0 等时传输端点：
			D2~D3表示同步的类型:0(无同步),1(异步),2(适配),3(同步) D4~D5表示用途:0(数据端点),
			1(反馈端点),2(暗含反馈的数据端点),3(保留)，D6~D7:保留 */

	// 根据对应接口描述符的大小，配置接收端点的大小
  CUSTOM_HID_FUNC_EPOUT_SIZE,	/* wMaxPacketSize: 该端点支持的最大包长度  */
  0x00,
  0x5,	/* bInterval: 轮询间隔 */
  /* 73 */
};
```

在 `usbd_customhid.h`中修改配置描述符的大小

```c
#define USB_CUSTOM_HID_CONFIG_DESC_SIZ       73U
```

### 第一个接口

```c
	   	/* USER CODE BEGIN 0 */
        0x06, 0x00, 0xff,              // USAGE_PAGE (Vendor Defined Page 1)
        0x09, 0x01,                    // USAGE (Vendor Usage 1)
        0xa1, 0x01,                    // COLLECTION (Application)
        0x09, 0x01,                    //   USAGE (Vendor Usage 1)
        0x15, 0x00,                    //   LOGICAL_MINIMUM (0)
        0x26, 0xff, 0x00,              //   LOGICAL_MAXIMUM (255)
        0x95, 0x40,                    //   REPORT_COUNT (64)
        0x75, 0x08,                    //   REPORT_SIZE (8)
        0x81, 0x02,                    //   INPUT (Data,Var,Abs)
        0x09, 0x01,                    // USAGE (Vendor Usage 1)
        0x15, 0x00,                    // LOGICAL_MINIMUM (0)
        0x26, 0xff, 0x00,              // LOGICAL_MAXIMUM (255)
        0x95, 0x40,                    // REPORT_COUNT (64)
        0x75, 0x08,                    // REPORT_SIZE (8)
        0x91, 0x02,                    // OUTPUT (Data,Var,Abs)
        /* USER CODE END 0 */
        0xC0    /*     END_COLLECTION	             */
```

修改 `usbd_customhid.h`的端点配置

根据报告描述符数据传输为 64

```c
#define CUSTOM_HID_EPIN_ADDR                 0x81U
#define CUSTOM_HID_EPIN_SIZE                 0x40U

#define CUSTOM_HID_EPOUT_ADDR                0x01U
#define CUSTOM_HID_EPOUT_SIZE                0x40U
```

修改 `usbd_conf.h`d中缓冲数组大小，以及第一个接口描述符的大小

```c
#define USBD_CUSTOMHID_OUTREPORT_BUF_SIZE     64
/*---------- -----------*/
#define USBD_CUSTOM_HID_REPORT_DESC_SIZE     34
```

### 第二个接口

在 `usbd_customhid.c`中定义第二个接口的报告描述符

```c
// ------------------------------------------- ADD  ---------------------------------------------------
__ALIGN_BEGIN static uint8_t HID_FUNC_ReportDesc[USBD_CUSTOM_HID_FUNC_REPORT_DESC_SIZE] __ALIGN_END =
        {
                // 键盘
                0x05, 0x01, // USAGE_PAGE (Generic Desktop) //63
                0x09, 0x06, // USAGE (Keyboard)
                0xa1, 0x01, // COLLECTION (Application)
                0x05, 0x07, // USAGE_PAGE (Keyboard)
                0x85, 0x01, // REPORT_ID(1)
                0x19, 0xe0, // USAGE_MINIMUM (Keyboard LeftControl)
                0x29, 0xe7, // USAGE_MAXIMUM (Keyboard Right GUI)
                0x15, 0x00, // LOGICAL_MINIMUM (0)
                0x25, 0x01, // LOGICAL_MAXIMUM (1)
                0x75, 0x01, // REPORT_SIZE (1)
                0x95, 0x08, // REPORT_COUNT (8)
                0x81, 0x02, // INPUT (Data,Var,Abs)
                0x95, 0x01, // REPORT_COUNT (1)
                0x75, 0x08, // REPORT_SIZE (8)
                0x81, 0x03, // INPUT (Cnst,Var,Abs)
                0x95, 0x05, // REPORT_COUNT (5)
                0x75, 0x01, // REPORT_SIZE (1)
                0x05, 0x08, // USAGE_PAGE (LEDs)
                0x19, 0x01, // USAGE_MINIMUM (Num Lock)
                0x29, 0x05, // USAGE_MAXIMUM (Kana)
                0x91, 0x02, // OUTPUT (Data,Var,Abs)
                0x95, 0x01, // REPORT_COUNT (1)
                0x75, 0x03, // REPORT_SIZE (3)
                0x91, 0x03, // OUTPUT (Cnst,Var,Abs)
                0x95, 0x06, // REPORT_COUNT (6)
                0x75, 0x08, // REPORT_SIZE (8)
                0x15, 0x00, // LOGICAL_MINIMUM (0)
                0x25, 0x65, // LOGICAL_MAXIMUM (101)
                0x05, 0x07, // USAGE_PAGE (Keyboard)
                0x19, 0x00, // USAGE_MINIMUM (Reserved (no event indicated))
                0x29, 0x65, // USAGE_MAXIMUM (Keyboard Application)
                0x81, 0x00, // INPUT (Data,Ary,Abs)

                0xc0, // END_COLLECTION

                // 鼠标
                0x05, 0x01,
                // 鼠
                0x09, 0x02,
                0xa1, 0x01,
                // 标
                0x09, 0x01,
                // 物理
                0xa1, 0x00,
                // ID
                0x85, 0x02,
                // 鼠标按键
                0x05, 0x09,
                // 三个按键
                0x19, 0x01,
                0x29, 0x03,
                0x15, 0x00,
                0x25, 0x01,
                // count
                0x95, 0x03,
                // size
                0x75, 0x01,
                // input
                0x81, 0x02,
                0x95, 0x05,
                0x75, 0x01,
                // input
                0x81, 0x03,
                // generic desktop
                0x05, 0x01,
                // x
                0x09, 0x30,
                // y
                0x09, 0x31,
                // wheel
                0x09, 0x38,
                // LMIN -127
                0x15, 0x81,
                // LMAX 127
                0x25, 0x7f,
                0x95, 0x03,
                0x75, 0x08,
                0x81, 0x06,
                0xc0,
                0xc0,

                // 媒体按键
                0x05, 0x0C,        // Usage Page (Consumer)
                0x09, 0x01,        // Usage (Consumer Control)
                0xA1, 0x01,        // Collection (Application)
                0x85, 0x03,        //   Report ID (3)
                0x09, 0xEA,        //   Usage (Volume Decrement)
                0x09, 0xE9,        //   Usage (Volume Increment)
                0x09, 0xE2,        //   Usage (Mute)
                0x09, 0xCD,        //   Usage (Play/Pause)
                0x09, 0xB5,        //   Usage (Scan Next Track)
                0x09, 0xB6,        //   Usage (Scan Previous Track)
                0x09, 0xB7,        //   Usage (Stop)
                0x0A, 0x94, 0x01,  //   Usage (AL Local Machine Browser)
                0x0A, 0x92, 0x01,  //   Usage (AL Calculator)
                0x0A, 0x83, 0x01,  //   Usage (AL Consumer Control Configuration)
                0x0A, 0x8A, 0x01,  //   Usage (AL Email Reader)
                0x0A, 0x23, 0x02,  //   Usage (AC Home)
                0x0A, 0x24, 0x02,  //   Usage (AC Back)
                0x0A, 0x25, 0x02,  //   Usage (AC Forward)
                0x0A, 0x01, 0x02,  //   Usage (AC New)
                0x0A, 0x02, 0x02,  //   Usage (AC Open)
                0x15, 0x00,        //   Logical Minimum (0)
                0x25, 0x01,        //   Logical Maximum (1)
                0x95, 0x10,        //   Report Count (16)
                0x75, 0x01,        //   Report Size (1)
                0x81, 0x02,        //   Input (Data,Var,Abs,No Wrap,Linear,Preferred State,No Null Position)
                0x75, 0x01,        //   Report Size (1)
                0x95, 0x10,        //   Report Count (16)
                0x81, 0x03,        //   Input (Const,Var,Abs,No Wrap,Linear,Preferred State,No Null Position)
                0xC0,              // End Collection

        };
```

修改 `usbd_customhid.h`的端点配置

根据报告描述符数据传输为 9

```c
// ----------------------------  ADD  --------------------------------------------------
#define CUSTOM_HID_FUNC_EPIN_ADDR                 0x82U
#define CUSTOM_HID_FUNC_EPIN_SIZE                 0x09U

#define CUSTOM_HID_FUNC_EPOUT_ADDR                0x02U
#define CUSTOM_HID_FUNC_EPOUT_SIZE                0x09U
```

修改 `usbd_conf.h`以及第二个接口描述符的大小

```c
// ------------------------ ADD  ----------------------------------
#define USBD_CUSTOM_HID_FUNC_REPORT_DESC_SIZE     185
```

## 添加端点初始化

因为添加了新的接口，以及两个新的端口，所以需要初始化配置

在 `usbd_customhid.c` 中的

`USBD_CUSTOM_HID_Init` 函数添加输入输出的初始化

```c
// ----------------  modify  ------------------------------------------

    USBD_LL_OpenEP(pdev, CUSTOM_HID_FUNC_EPIN_ADDR, USBD_EP_TYPE_INTR,  //KEYBOARD
                   CUSTOM_HID_FUNC_EPIN_SIZE);
    pdev->ep_in[CUSTOM_HID_FUNC_EPIN_ADDR & 0xFU].is_used = 1U;

// ----------------  modify  ------------------------------------------

    USBD_LL_OpenEP(pdev, CUSTOM_HID_FUNC_EPOUT_ADDR, USBD_EP_TYPE_INTR,
                   CUSTOM_HID_FUNC_EPOUT_SIZE);
    pdev->ep_out[CUSTOM_HID_FUNC_EPOUT_ADDR & 0xFU].is_used = 1U;
```

## 增加对于不同接口使用不同报告描述符的判断

在 `usbd_customhid.c` 文件中

`USBD_CUSTOM_HID_Setup` 函数

`case USB_REQ_TYPE_STANDARD:`的分支中

获取描述符的分支 `case USB_REQ_GET_DESCRIPTOR:`

修改第一个 if

```c
if (req->wValue >> 8 == CUSTOM_HID_REPORT_DESC) {
              // --------------------- MODIFY ------------------------------------
              if(req->wIndex == 0) {
                  len = MIN(USBD_CUSTOM_HID_REPORT_DESC_SIZE, req->wLength);
                  pbuf = ((USBD_CUSTOM_HID_ItfTypeDef *)pdev->pUserData)->pReport;
              }
              if(req->wIndex == 1) {
                  len = MIN(USBD_CUSTOM_HID_FUNC_REPORT_DESC_SIZE, req->wLength);
                  pbuf = HID_FUNC_ReportDesc;
              }
}
```

## 设置不同的发送函数

仿照库内的发送函数

```c
// --------------------------- ADD  -----------------------------------------------------------------------------
uint8_t USBD_CUSTOM_HID_FUNC_SendReport(USBD_HandleTypeDef  *pdev,
                                   uint8_t *report,
                                   uint16_t len)
{
    USBD_CUSTOM_HID_HandleTypeDef     *hhid = (USBD_CUSTOM_HID_HandleTypeDef *)pdev->pClassData;

    if (pdev->dev_state == USBD_STATE_CONFIGURED)
    {
        if (hhid->state == CUSTOM_HID_IDLE)
        {
            hhid->state = CUSTOM_HID_BUSY;
            USBD_LL_Transmit(pdev, CUSTOM_HID_FUNC_EPIN_ADDR, report, len);
        }
        else
        {
            return USBD_BUSY;
        }
    }
    return USBD_OK;
}
```

在 .h 中声明

对于接口2的功能，需要通过这个新建的发送函数



# USB 接收

`usbd_custom_hid_if.c` 文件

`CUSTOM_HID_OutEvent_FS`函数

编写回调函数，执行在用户自己定义的  USB 逻辑文件中

```javascript
static int8_t CUSTOM_HID_OutEvent_FS(uint8_t event_idx, uint8_t state)
{
  /* USER CODE BEGIN 6 */
  	// 第一参数是USB句柄，第二个参数的是接收的末端地址；要获取发送的数据长度的话就把第二个参数改为发送末端地址即可
    uint8_t len = USBD_GetRxCount(&hUsbDeviceFS, CUSTOM_HID_EPOUT_ADDR); 
  	// 定义一个指向USBD_CUSTOM_HID_HandleTypeDef结构体的指针
    USBD_CUSTOM_HID_HandleTypeDef* hid_handle;
  	// 得到USB接收数据的储存地址
    hid_handle = (USBD_CUSTOM_HID_HandleTypeDef *)hUsbDeviceFS.pClassData;
    // 执行接收回调
    receive_data_from_upper(hid_handle, len);
    return (USBD_OK);
  /* USER CODE END 6 */
}
```
