## 建立连接（connection establishment）
根据蓝牙spec规定，advertiser发送完一个广播包之后**150us（T_IFS）**，advertiser必须开启一段时间的射频Rx窗口，以接收来自observer的数据包。Observer就可以在这段时间里给advertiser发送连接请求。手机在第三个广播事件的时候扫到了设备B，并发出了**连接请求CONN_REQ(CONN_REQ又称为CONNECT_IND)**。

如图所示，手机在收到A1广播包ADV_IND后，以此为初始锚点（这个锚点不是连接的锚点），T_IFS时间后给Advertiser发送一个connection request命令，即A2数据包，告诉advertiser我将要过来连你，请做好准备。Advertiser根据connect_req命令信息做好接收准备

connect_req其实是在告诉advertiser，手机将在Transmit Window期间发送第一个同步包（P1）给你，请在这段时间里把你的射频接收窗口打开。设备B收到P1后，T_IFS时间后将给手机回复数据包P2（ACK包）。一旦手机收到数据包P2，连接即可认为建立成功。

所以一旦P1包发出，主机（手机）即认为连接成功，而不管有没有收到设备的ACK包。这也是为什么在Android或者iOS系统中，应用经常收到连接成功的回调事件（**该回调事件就是基于****P1包有没有发出，只要P1包发出，手机即认为连接成功，而不管有没有收到设备的ACK包**），但实际上手机和设备并没有成功建立连接。后续手机将以**P1为锚点（原点），Connection Interval为周期，周期性地**给设备B发送数据包（Packet），Packet除了充当数据传送功能，它还有如下两个非常重要的功能：

1. 同步手机和设备的时钟，也就是说，设备每收到手机发来的一个包，都会把自己的时序原点重新设置，以跟手机同步。
2. 告诉设备你现在可以传数据给我了。连接成功后，BLE通信将变成主从模式，因此把连接发起者（手机）称为**Master****或者Central**，把被连接者（之前的Advertiser）称为**Slave****或者Peripheral**。BLE通信之所以为主从模式，是因为Slave不能“随性”给Master发信息，它只有等到Master给它发了一个packet后，然后才能在规定的时间把自己的数据回传给Master。


## Connection events
连接成功后，master和slave在每一个connection interval开始的时候，都必须交互一次，即master给slave发一个包，slave再给master发一个包，整个交互过程称为一个**connection event或者gap event**。
蓝牙芯片只有在connection event期间才把射频模块打开，此时功耗比较高，其余时间蓝牙芯片都是处于idle状态的，因此蓝牙芯片平均功耗就非常低，以Nordic nRF52810为例，每1秒钟Master和Slave通信1次，平均功耗约为**6微安**左右。
Master不可能时时刻刻都有数据发给slave，所以master大部分时候都是发的空包（empty packet）给slave。同样slave也不是时时刻刻都有数据给master，因此slave回复给master的包大部分时候也是空包。另外在一个connection event期间，master也可以发多个包给slave，以提高吞吐率。


## Slave latency
如前所述，在每一个connection interval开始的时候，Master和Slave必须交互一次，哪怕两者之间交互的是empty packet（空包），但如果slave定义了slave latency，比如slave latency = 9，此时slave可以每9个connection interval才回复一次master，也就是说slave可以在前面8个connection interval期间一直睡眠，直到第9个connection interval到来之后，才回复一个packet给master，这样将大大节省slave的功耗，提高电池续航时间。
当然如果slave有数据需要上报给master，它也可以不等到第9个connection interval才上报，直接像正常情况进行传输即可，这样既节省了功耗，又提高了数据传输的实时性。

## GAP层角色总结
在BLE通信过程中，随着时间的推移，他们的状态在发生变化，两者的关系也在发生变化，为此蓝牙spec根据不同的时间段或者状态给手机和设备B取不同的名字，即GAP层定义了如下角色：
- advertiser。 发出广播的设备
- observer或者scanner。可以扫描广播的设备
- initiator。能发起连接的设备
- master或者central。连接成功后的主设备，即主动发起packet的设备
- slave或者peripheral。连接成功后的从设备，即被动回传packet的设备
角色是相互独立的，也就是说一个设备可以只支持observer角色，而不支持initiator和central角色。
advertiser和peripheral也是相互独立的，即一个设备可以只作为advertiser角色，而不支持peripheral角色。

A device can act as a central and a peripheral at the same time.
• A central can be connected to multiple peripherals.
• A peripheral can be connected to multiple centrals.