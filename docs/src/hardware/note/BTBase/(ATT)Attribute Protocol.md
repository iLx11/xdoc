> The Attribute Protocol (ATT) is a simple client/server stateless protocol based on at‐ tributes presented by a device. In BLE, each device is a client, a server, or both, irre‐ spective of whether it’s a master or slave. 
> The protocol is strict when it comes to its sequencing: if a request is still pending (no response for it has been yet received) no further requests can be sent until the response is received and processed. This applies to both directions independently in the case where two peers are acting both as a client and server.

属性协议（ATT）是一种简单的客户机/服务器无状态协议，基于设备提交的属性。在 BLE 中，每个设备既是客户端，也是服务器，或两者兼而有之。
该协议在排序方面非常严格：如果一个请求仍在等待中（服务器没有响应请求仍处于待处理状态，也就是尚未收到响应），则在收到响应之前，不能发送其他请求。
在两个对等网络同时充当客户端和服务器的情况下，它们各自独立运行。
> Each server contains data organized in the form of attributes, each of which is assigned a 16-bit attribute handle, a universally unique identifier (UUID), a set of permissions, and finally, of course, a value. The attribute handle is simply an identifier used to access an attribute value. The UUID specifies the type and nature of the data contained in the value

**每个服务器都包含以属性形式组织的数据，每个属性分配一个 16 位属性句柄、一个通用唯一标识符 （UUID）、一组权限(permissions)、一个值(value)。**
- 属性句柄只是用于访问属性值的标识符。
- UUID 指定值中包含数据的类型和性质
- 权限：处理该属性所需的安全级别（加密和/或授权），此外还指示该属性是可读属性还是可写属性。
- **Value**
	- 属性中存储的实际用户数据（例如：传感器读数）。此字段接受任何数据类型。它可以保存心率监测器值（每分钟心跳次数）、温度读数，甚至是 string。
	- 它还可以保存有关另一个属性的信息（元数据）
![[Pasted image 20240522091124.png]]
> When a client wants to read or write attribute values from or to a server, it issues a read or write request to the server with the handle. The server will respond with the attribute value or an acknowledgement. In the case of a read operation, it is up to the client to parse the value and understand the data type based on the UUID of the attribute. On the other hand, during a write operation, the client is expected to provide data that is consistent with the attribute type and the server is free to reject the operation if that is not the case.

当客户端要从服务器读取或写入属性值时，会向服务器发出一个带有句柄的读取或写入请求。服务器将回复属性值或确认。**在读取操作中，客户端需要根据属性的 UUID 来解析值并理解数据类型。另一方面，在写操作中，客户端应提供与属性类型一致的数据，如果不一致，服务器可拒绝该操作。**