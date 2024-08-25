## 链路层
链路层是直接与 PHY 接口的部分，通常以定制硬件和软件相结合的方式实现。
它通常由定制硬件和软件组合而成。它也是整个协议栈中唯一受到严格实时限制的层，因为它负责遵守
规范规定的所有时序要求。因此，它通常通过标准接口与协议栈的高层隔离开来
将其复杂性和实时性要求隐藏起来，不与其他层接触
> The Link Layer defines the following roles:
   Advertiser
	  A device sending advertising packets.
  Scanner
	  A device scanning for advertising packets.
  Master
	  A device that initiates a connection and manages it later.
  Slave
	  A device that accepts a connection request and follows the master’s timing.These roles can be logically grouped into two pairs: advertiser and scanner (when not in an active connection) and master and slave (when in a connection)
### 链接层定义了以下角色：
- 广告设备
	发送广告数据包的设备。
- 扫描设备
	扫描广告数据包的设备。
- 主设备
	启动连接并随后管理连接的设备。
- 从设备
	接受连接请求并遵循主设备计时的设备。**这些角色可以在逻辑上分为两对： 广告设备和扫描设备（未处于活动连接时）以及主设备和从设备（处于连接状态时）**