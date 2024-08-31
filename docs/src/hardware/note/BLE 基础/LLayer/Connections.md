## 连接
> To establish a connection, a master first starts scanning to look for advertisers that are currently accepting connection requests. The advertising packets can be filtered by Bluetooth Address or based in the advertising data itself. When a suitable advertising slave is detected, the master sends a connection request packet to the slave and, provided the slave responds, establishes a connection. The connection request packet includes the frequency hop increment, which determines the hopping sequence that both the master and the slave will follow during the lifetime of the connection.

要建立连接，主设备首先开始扫描以查找当前正在接受连接请求的广告设备。广告数据包可以通过蓝牙地址进行过滤，也可以基于广告数据本身进行过滤。当检测到合适的广告从设备时，主设备会向从设备发送连接请求数据包，如果从设备响应，则建立连接。
连接请求数据包包括跳频增量，它决定了主设备和从设备在连接生命周期内将遵循的跳频序列。
**连接只是在预定的时间从设备和主设备之间的一系列数据交换。每次数据交换称为一个连接事件。**
![connection](https://picr.oss-cn-qingdao.aliyuncs.com/img/Pasted%20image%2020240521113715.png)

> The following three connection parameters are another set of key variables communi‐ cated by the master during the establishment of a connection
> **Connection interval**
> 	The time between the beginning of two consecutive connection events. This value ranges from 7.5 ms (high throughput) to 4 s (lowest possible throughput but also least power hungry).
> **Slave latency**
> 	The number of connection events that a slave can choose to skip without risking a disconnection.
> **Connection supervision timeout**
> 	The maximum time between two received valid data packets before a connection is considered lost.

**以下三个连接参数是主机在建立连接期间传递的另一组关键变量：**
- **连接间隔**
	蓝牙 LE 设备大部分时间都处于“睡眠”状态（因此名称中的“低能耗”）。在连接中，这是通过商定连接间隔来实现的，该间隔表示设备相互通信的频率。当他们完成通信时，他们会关闭 radio ，设置一个计时器并进入空闲模式，当计时器超时时，他们都会醒来并再次通信。此操作的实现由 Bluetooth LE 堆栈处理，但由应用程序通过设置连接间隔来决定希望设备通信的频率。
	两个连续连接事件开始之间的时间。这个值范围从 7.5 ms（高吞吐量）到 4 s（最低可能吞吐量，但也省电）。
- **从机延迟**
	允许外围设备在没有任何要发送的数据时跳过唤醒一定数量的连接事件。不会因为跳过的连接事件而断开连接。
- **连接监控超时**
	连接前，超过有效数据包之间接收的最长时间，视为丢失。
## 白名单
> An important feature available in BLE controllers, white lists allow hosts to filter devices when advertising, scanning, and establishing connections on both sides. White lists are simply arrays of Bluetooth device addresses that are populated by the host and stored and used in the controller. 
> A device scanning or initiating a connection can use a white list to limit the number of devices that will be detected or with which it can connect, and the advertising device can use a white list to specify which peers it will accept an incoming connection from. The setting that defines whether a white list is to be used or not is called a filter policy. This essentially acts as a switch to turn white list filtering on and off.

白名单是 BLE 控制器中的一项重要功能，当双方进行广告、扫描和建立连接时允许主机过滤设备。白名单是由主机填充并存储的简单蓝牙设备地址数组，并在控制器中使用。
设备扫描或发起连接时，可以使用白名单来限制扫描或发起连接的数量，可以使用白名单来指定将被检测到或可以连接的设备，以及广告设备，接受来自哪些对等点的传入连接。
定义是否使用白名单的设置称为过滤策略，本质上是白名单过滤的开关。
## 数据包
> Data packets are the workhorse of the protocol and are used to transport user data bidirectionally between the master and slave. These packets have a usable data payload of 27 bytes, but additional procotols further up the stack typically limit the actual amount of user data to 20 bytes per packet, although that logically depends on the protocol being used.

数据包是协议的主力，用于在主从设备之间双向传输用户数据。这些数据包的可用数据有效载荷为 `27` 字节，但堆栈上层的附加处理器，通常会将每个数据包的实际用户数据量限制在 `20` 字节。但这取决于所使用的协议。
链路层是可靠的数据承载层。所有数据包都要根据 24 位 CRC 进行检查，并在错误检查检测到传输失败时请求重传。并且重传没有上限。链路层将重新发送数据包，直到数据包最终被再接收器确认。
> Other than advertising, scanning, establishing (and tearing down) connections, and transmitting and receiving data, the Link Layer is also responsible for several control procedures, including these two critical processes: 
> **Changing the connection parameters**
> 	 Each connection is established with a given set of connection parameters set by the master, but conditions and requirements might change during the lifetime of the connection. A slave might suddenly require a higher throughput for a short burst of data, or conversely, it might detect that in the near future a longer connection interval will suffice to keep the connection alive. The Link Layer allows the master and the slave to request new connection parameters and, in the case of the master, to set them unilaterally at any time. That way, each connection can be fine-tuned to provide the best balance between throughput and power consumption. 
>  **Encryption** 
> 	 Security is critical in BLE, and the Link Layer provides the means to exchange data securely over an encrypted link. The keys are generated and managed by the host, but the Link Layer performs the actual data encryption and decryption transpar‐ ently to the upper layers.

**除了通告、扫描、建立（和解除）连接以及传输和接收数据之外，链路层还负责几个控制程序，包括以下两个关键过程：**
- **更改连接参数**
	**每个连接都是使用主设备设置的一组给定连接参数建立的，但条件和要求可能会在连接的生命周期内发生变化**。从设备可能突然需要更高的吞吐量来传输短时间的数据，或者相反，它可能会检测到在不久的将来，更长的连接间隔足以保持连接的活动状态。链路层允许主设备和从设备请求新的连接参数，并且主设备可以随时单方面设置它们。每个连接都可以进行微调，以提供吞吐量和功耗之间的最佳平衡。
- **加密**
	安全性在 BLE 中至关重要，链路层提供了通过加密链路安全地交换数据的方法。密钥由主机生成和管理，但链路层对上层透明地执行实际的数据加密和解密。