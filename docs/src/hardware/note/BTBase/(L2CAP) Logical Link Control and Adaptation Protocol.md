> The rather cryptically named Logical Link Control and Adaptation Protocol (L2CAP) provides two main pieces of functionality. First, it serves as a protocol multiplexer that takes multiple protocols from the upper layers and encapsulates them into the standard BLE packet format (and vice versa).

逻辑链路控制和适配协议（L2CAP）提供了两大功能。首先，它是一个协议多路复用器，可从上层获取多个协议，并将其封装为标准的 BLE 数据包格式（反之亦然）。
它还执行碎片和重组，这是一个需要大量数据的过程。将上层的数据包分解成适合 27 字节的块，以适应 BLE 数据包的最大有效负载大小。
在接收路径上，将接收到的多个已分片的数据包，重新组合成一个单个大数据包然后发送到上层，到主机上层相应实体。
做个简单的比较，L2CAP 与 TCP 类似，它允许多种协议通过单个物理链路无缝共存，每个协议都有不同的数据包大小和要求。
> For Bluetooth Low Energy, the L2CAP layer is in charge or routing two main protocols: the Attribute Protocol (ATT) and the Security Manager Protocol (SMP).

对于低功耗蓝牙，L2CAP 层负责或路由两个主要协议：**属性协议 (ATT) 和安全管理器协议 (SMP)。**
> From an application developer’s point of view, it is important to note that, whenever only default packet sizes are used, the L2CAP packet header takes up four bytes, which means that the effective user payload length is 27 - 4 = 23 bytes

从应用程序开发人员的角度需要注意的是，在只使用默认数据包大小的情况下，L2CAP 数据包头占 4 个字节，这意味着有效的用户有效载荷长度为 27 - 4 = 23 个字节
