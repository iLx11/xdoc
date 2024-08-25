要实现一个BLE应用，首先需要一个支持BLE射频的芯片，然后还需要提供一个与此芯片配套的BLE协议栈，最后在协议栈上开发自己的应用。可以看出BLE协议栈是连接芯片和应用的桥梁，是实现整个BLE应用的关键。
简单来说，BLE协议栈主要用来对你的应用数据进行**层层封包**，以生成一个满足BLE协议的空中数据包，也就是说，把应用数据包裹在一系列的帧头（header）和帧尾（tail）中。具体来说，BLE协议栈主要由如下几部分组成：
- **PHY层**（Physical layer物理层）。PHY层用来指定BLE所用的无线频段，调制解调方式和方法等。PHY层做得好不好，直接决定整个BLE芯片的功耗，灵敏度以及selectivity等射频指标。
- **LL层**（Link Layer链路层）。LL层是整个BLE协议栈的核心，也是BLE协议栈的难点和重点。像Nordic的BLE协议栈能同时支持20个link（连接），就是LL层的功劳。LL层要做的事情非常多，比如具体选择哪个射频通道进行通信，怎么识别空中数据包，具体在哪个时间点把数据包发送出去，怎么保证数据的完整性，ACK如何接收，如何进行重传，以及如何对链路进行管理和控制等等。LL层只负责把数据发出去或者收回来，对数据进行怎样的解析则交给上面的GAP或者GATT。
- **HCI（Host controller interface）**。HCI是可选的（[具体请参考文章： 三种蓝牙架构实现方案（蓝牙协议栈方案）](http://www.cnblogs.com/iini/p/8834970.html)），HCI主要用于2颗芯片实现BLE协议栈的场合，用来规范两者之间的通信协议和通信命令等。
- **GAP层（Generic access profile**）。GAP是对LL层payload（有效数据包）如何进行解析的两种方式中的一种，而且是最简单的那一种。GAP简单的对LL payload进行一些规范和定义，因此GAP能实现的功能极其有限。GAP目前主要用来进行广播，扫描和发起连接等。
Generic Access Profile (GAP):
Covering the usage model of the lower-level radio protocols to define roles, procedures, and modes that allow devices to broadcast data, discover devices, establish connections, manage connections, and negotiate security levels, GAP is, in essence, the topmost control layer of BLE. This profile is mandatory for all BLE devices, and all must comply with it.

- **L2CAP层（Logic link control and adaptation protocol）**。L2CAP对LL进行了一次简单封装，LL只关心传输的数据本身，L2CAP就要区分是加密通道还是普通通道，同时还要对连接间隔进行管理。
- **SMP（Secure manager protocol）**。SMP用来管理BLE连接的加密和安全的，如何保证连接的安全性，同时不影响用户的体验，这些都是SMP要考虑的工作。
- **ATT（Attribute protocol）**。简单来说，ATT层用来定义用户命令及命令操作的数据，比如读取某个数据或者写某个数据。BLE协议栈中，开发者接触最多的就是ATT。BLE引入了attribute概念，用来描述一条一条的数据。Attribute除了定义数据，同时定义该数据可以使用的ATT命令，因此这一层被称为ATT层。
- **GATT（Generic attribute profile ）**。GATT用来规范attribute中的数据内容，并运用group（分组）的概念对attribute进行分类管理。没有GATT，BLE协议栈也能跑，但互联互通就会出问题，也正是因为有了GATT和各种各样的应用profile，BLE摆脱了ZigBee等无线协议的兼容性困境，成了出货量最大的2.4G无线通信产品。
Generic Attribute Profile (GATT) 
Dealing with data exchange in BLE, GATT defines a basic data model and proce‐ dures to allow devices to discover, read, write, and push data elements between them. It is, in essence, the topmost data layer of BLE.

开发人员发送 0x53
1. 当设备B拿到数据0x53后，该如何解析这个数据呢？它到底表示湿度还是电量，还是别的意思？这个就是GAP层要做的工作，GAP层引入了LTV（Length-Type-Value）结构来定义数据，比如020105，02-长度，01-类型（强制字段，表示广播flag，广播包必须包含该字段），05-值。由于广播包最大只能为31个字节，它能定义的数据类型极其有限，像这里说的电量，GAP就没有定义，因此要通过广播方式把电量数据发出去，只能使用供应商自定义数据类型0xFF，即04FF590053，其中04表示长度，FF表示数据类型（自定义数据），0x0059是供应商ID（自定义数据中的强制字段），0x53就是我们的数据(设备双方约定0x53就是表示电量，而不是其他意思)。

最终空中传输的数据包将变成：

- AAD6BE898E600E3B75AB2A02E102010504FF5900**53**8EC7B2
    - AA – 前导帧(preamble)
    - D6BE898E – 访问地址(access address)
    - 60 – LL帧头字段(LL header)
    - 0E – 有效数据包长度(payload length)
    - 3B75AB2A02E1 – 广播者设备地址(advertiser address)
    - 02010504FF5900**53 –** **广播数据**
    - 8EC7B2 – CRC24值

## Softdevice概述
Softdevice命名规则一。Softdevice包括两种底层协议栈：BLE和ANT，BLE包括两种角色：central（又称master）和peripheral（又称slave），为此需要给这些不同类型的协议栈进行命名区分。协议栈命名格式为**Sxyz**，其中
- x – 表示协议栈的类型，1表示BLE协议栈，2表示ANT协议栈，3表示同时支持BLE和ANT
- y – 表示BLE角色，1表示从设备，2表示主设备，3表示同时支持主设备和从设备
- z – 表示芯片类型，0表示nRF51系列，2表示nRF52系列
- 比如S110，表示只支持从设备模式的nRF51 BLE协议栈 
- 比如S130，表示既支持从设备模式又支持主设备模式的nRF51 BLE协议栈
- 比如S132，表示既支持从设备模式又支持主设备模式的nRF52 BLE协议栈
- 比如S212，表示nRF52 ANT协议栈
- 比如S332，表示nRF52既支持BLE协议栈又支持ANT协议栈，而且BLE协议栈既支持从设备模式又支持主设备模式