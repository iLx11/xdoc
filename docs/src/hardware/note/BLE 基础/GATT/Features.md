### 特性
## Exchange MTU
> This succinct two-packet procedure allows each ATT peer to let the other end know about the maximum transmission unit (MTU, or effectively maximum packet length) it can hold in its buffers and can therefore accept. 
> This procedure is used only whenever either the client or the server (or both) can handle MTUs longer than the default ATT_MTU of 23 bytes (see “Logical Link Control and Adaptation Protocol (L2CAP)” on page 25) and wants to inform the other end that it can send packets longer than the default values that the specification requires. L2CAP will then fragment these bigger packets into small Link Layers packets and recombine them from small Link Layers packets.

这种简洁的双包程序允许每个 ATT 对等体让另一端知道其缓冲区中可以容纳的最大传输单元 (MTU，或实际最大数据包长度)
仅当客户端或服务器（或两者）可以处理比默认 ATT_MTU 23 字节更长的 MTU 并想要通知另一端它可以发送比规范要求的默认值更长的数据包时，才使用此程序。然后，L2CAP 会将这些较大的数据包分割成小的链路层数据包，并将它们从小的链路层数据包重新组合。
## Service and Characteristic Discovery
> the client has no knowledge about the attributes that might be present in a GATT server when it first connects to it. It isre es therefosential for the client to begin by performing a series of packet exchanges to determine the amount, location, and nature of all the attributes that might be of interest. procedures in this category can, in some cases, sub‐ sequently be skipped.

客户端在首次连接到 GATT 服务器时，并不知道该服务器中可能存在的属性。因此，客户端必须首先执行一系列数据包交换，以确定可能感兴趣的所有属性的数量、位置和性质。
> For primary service discovery, GATT offers the two following options: 
> Discover all primary services 
> 	Using this feature, clients can retrieve a full list of all primary services (regardless of service UUIDs) from the remote server. This is commonly used when the client supports more than one service and therefore wants to find out about the full service support on the server side. Because the client can specify a handle range when issuing the required request, it must set 0x0001-0xFFFF as the handle range to implement this feature, covering the full attribute range of the server. 
> Discover primary service by service UUID 
> 	Whenever the client knows which service it is looking for (usually because it sup‐ ports only that single service itself), it can simply look for all instances of a particular service using this feature, also with the requirement of setting the handle range to 0x0001-0xFFFF.

**对于主服务发现，GATT 提供以下两个选项：**
- 发现所有主服务
	使用此功能，客户端可以从远程服务器检索所有主服务的完整列表（无论服务 UUID 如何）。这通常用于客户端支持多个服务并因此想要了解服务器端的完整服务支持情况的情况。由于客户端可以在发出所需请求时指定句柄范围，因此它必须将 0x0001-0xFFFF 设置为句柄范围才能实现此功能，从而覆盖服务器的完整属性范围。
- 通过服务 UUID 发现主服务
	每当客户端知道它正在寻找哪个服务时（通常是因为它本身仅支持该单个服务），它都可以使用此功能简单地查找特定服务的所有实例，同样需要将句柄范围设置为 0x0001-0xFFFF。
这些过程中的每一个都会产生引用属于单个服务的属性的句柄范围。发现所有主要服务功能还会获取各个服务的 UUID。当客户端已经在服务器上找到服务时，它可以继续使用以下功能执行关系发现（发现任何包含的服务）
> Find included services 
> 	This allows a client to query the server about any included services within a service. The handle range provided in such a query refers to the boundaries of an existing service, previously obtained using service discovery. As with service discovery, the client also receives a set of handle ranges, along with UUIDs when applicable. 
> In terms of characteristic discovery, GATT offers the following options: 
> Discover all characteristics of a service
> 	 Once a client has obtained the handle range for a service it might be interested in, it can then proceed to retrieve a full list of its characteristics. The only input is the handle range, and in exchange, the server returns both the handle and the value of all characteristic declaration attributes enclosed within that service (see “Charac‐ teristic declaration attribute” on page 59). 
> Discover characteristics by UUID 
> 	This procedure is identical to the previous one, except the client discards all re‐ sponses that do not match the particular characteristic UUID it targets. 
> Once the boundaries (in terms of handles) of a target characteristic have been estab‐ lished, the client can go on to characteristic descriptor discovery: 
> Discover all characteristic descriptors 
> 	Now in possession of a set of handle ranges and UUIDs for some or all of the characteristics in a service, the client can use this feature to retrieve all the descrip‐ tors within a particular characteristic. The server replies with a list of UUID and handle pairs for the different descriptor declarations (see “Characteristic Descrip‐ tors” on page 61). 
> All the features in this section can be performed over open, unsecured connections, because discovery is allowed for all clients without any restrictions.

- 查找包含的服务 
	这允许客户端向服务器查询服务中包含的任何服务。此类查询中提供的句柄范围指的是先前使用服务发现获得的现有服务的边界。与服务发现一样，客户端还会收到一组句柄范围以及适用时的 UUID。
**在特性发现方面，GATT 提供以下选项：**
- 发现服务的所有特性
	一旦客户端获得了它可能感兴趣的服务的句柄范围，它就可以继续检索其特性的完整列表。唯一的输入是句柄范围，作为交换，服务器返回句柄和该服务中包含的所有特性声明属性的值（请参阅第 59 页的“特性声明属性”）。
- 通过 UUID 发现特性 
	此过程与上一个过程相同，只是客户端会丢弃所有 UUID 不匹配的响应。
一旦确定了目标特征的边界（就句柄而言），客户端便可以继续进行特征描述符发现：
- 发现所有特征描述符
	现在，客户端掌握了服务中部分或全部特征的一组句柄范围和 UUID，可以使用此功能检索特定特征内的所有描述符。服务器将回复不同描述符声明的 UUID 和句柄对列表（请参阅第 61 页上的“特征描述符”）。
本节中的所有功能都可以通过开放、不安全的连接执行，因为允许所有客户端进行发现，没有任何限制。