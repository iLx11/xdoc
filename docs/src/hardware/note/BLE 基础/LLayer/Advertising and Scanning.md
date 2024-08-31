## 广播和扫描
> BLE has only one packet format and two types of packets (advertising and data packets), which simplifies the protocol stack implementation immensely. Advertising packets serve two purposes: 
> 	• To broadcast data for applications that do not need the overhead of a full connection establishment
> 	 • To discover slaves and to connect to them

**BLE只有一种数据包格式和两种类型的数据包（广告数据包和扫描数据包）**
这极大地简化了协议栈的实现，扫描设备接收到广告数据包后发起扫描请求，并收到广播设备的扫描数据包。
广告包有两个目的：
	**• 为不需要建立完整连接的应用程序广播数据建立**
	**• 发现从站并连接**
> Each advertising packet can carry up to 31 bytes of advertising data payload, along with the basic header information (including Bluetooth device address). Such packets are simply broadcast blindly over the air by the advertiser without the previous knowledge of the presence of any scanning device. They are sent at a fixed rate defined by the advertising interval, which ranges from 20 ms to 10.24 s. The shorter the interval, the higher the frequency at which advertising packets are broadcast, leading to a higher probability of those packets being received by a scanner, but higher amounts of packets transmitted also translate to higher power consumption. 
> Because advertising uses a maximum of three frequency channels and the advertiser and the scanner are not synchronized in any way, an advertising packet will be received successfully by the scanner only when they randomly overlap

**每个广告数据包最多可携带 31 个字节的广告数据有效负载，以及基本报头信息（包括蓝牙设备地址）。**
这些数据包只需在空中广播，而无需确认任何扫描设备的存在。它们以固定的速率发送，发送速率由 广告间隔时间从 20 毫秒到 10.24 秒不等。
广告数据包的广播频率越高，从而扫描设备接收到这些数据包的概率就越高。但传输的数据包越多，功耗也就越高。
**由于广告最多使用三个频率信道，而且广告和扫描不以任何方式同步，因此只有发送与接收随机重叠时，扫描仪才能成功接收到广告数据包。**
> The scan interval and scan window parameters define how often and for how long a scanner device will listen for potential advertising packets. As with the advertising in‐ terval, those values have
>  a deep impact on power consumption, since they directly relate to the amount of time the radio must be turned on. 
> The specification defines two basic types of scanning procedures: 
> **Passive scanning** 
> 	The scanner simply listens for advertising packets, and the advertiser is never aware of the fact that one or more packets were actually received by a scanner. 
> **Active scanning** 
> 	The scanner issues a Scan Request packet after receiving an advertising packet. The advertiser receives it and responds with a Scan Response packet. This additional packet doubles the effective payload that the advertiser is able to send to the scanner, but it is important to note that this does not provide a means for the scanner to send any user data at all to the advertiser.

**扫描间隔和扫描窗口参数定义了扫描的频率和持续时间**。扫描仪设备将侦听潜在的广告数据包。就像广告中的 interval ，这些值对功耗有深远的影响，因为它们直接关系到 radio 射频打开的时间。
**该规范定义了两种基本类型的扫描程序：**
- 被动扫描
	扫描设备只是监听广告数据包，广告设备永远不会意识到扫描设备实际接收到一个或多个数据包。
- 主动扫描
	扫描器收到广告包后发出扫描请求包。 **广告商收到它并用扫描响应数据包进行响应。这个额外的数据包使广告设备能够发送到扫描设备的有效负载加倍**。但需要注意，扫描设备并不提供任何用户信息给广播设备。
## 广播数据包分类
> Advertising packet types can be classified according to three different properties. The first is connectability: 
> **Connectable** 
> 	A scanner can initate a connection upon reception of such an advertising packet. 
> **Non-connectable** 
> 	A scanner cannot initiate a connection (this packet is intented for broadcast only). The second property is scannability: 
> **Scannable** 
> 	A scanner can issue a scan request upon reception of such an advertising packet. 
> **Non-scannable** 
> 	A scanner cannot issue a scan request upon reception of such an advertising packet. And the third is directability: 
> **Directed** 
> 	A packet of this type contains only the advertiser’s and the target scanner’s Bluetooth Addresses in its payload. No user data is allowed. All directed advertising packets are therefore connectable. 
> **Undirected** 
> 	A packet of this type is not targeted at any particular scanner, and it can contain user data in its payload.

### 广告数据包类型可根据三种不同属性进行分类。
#### 第一种是可连接性：
- 可连接
	扫描仪在接收到此类广告数据包后可以启动连接。
- 不可连接
	扫描器无法启动连接（该数据包仅用于广播）。
#### 第二个属性是可扫描性：
- 可扫描
	扫描仪在接收到此类广告数据包后可发出扫描请求。
- 不可扫描
	扫描器在接收到此类广告数据包后不能发出扫描请求。
#### 第三个属性是指向性：
- 定向
	这种类型的数据包在其有效载荷中只包含广告商和目标扫描仪的蓝牙地址。不允许包含用户数据。所有定向广告数据包是可连接的。
- 非定向
	这种类型的数据包不针对任何特定扫描仪，其有效载荷中可以包含用户数据