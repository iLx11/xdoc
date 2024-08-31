GATT 首先定义交互设备可以采用的角色
> **Client** 
> 	The GATT client corresponds to the ATT client discussed in “Attribute Protocol (ATT)” on page 26. It sends requests to a server and receives responses (and serverinitiated updates) from it. The GATT client does not know anything in advance about the server’s attributes, so it must first inquire about the presence and nature of those attributes by performing service discovery. After completing service 51 discovery, it can then start reading and writing attributes found in the server, as well as receiving server-initiated updates. 
> **Server** 
> 	The GATT server corresponds to the ATT server discussed in “Attribute Protocol (ATT)” on page 26. It receives requests from a client and sends responses back. It also sends server-initiated updates when configured to do so, and it is the role responsible for storing and making the user data available to the client, organized in attributes. Every BLE device sold must include at least a basic GATT server that can respond to client requests, even if only to return an error response

- **客户端**
	GATT 客户端与第 26 页 "属性协议 (ATT) "中讨论的 ATT 客户端相对应。它向服务器发送请求，并从服务器接收响应（和服务器发起的更新）。GATT 客户端事先对服务器的属性一无所知，因此必须首先通过服务发现来查询这些属性的存在和性质。完成服务发现后，客户端就可以开始读写服务器中的属性，并接收服务器发起的更新。
- **服务器**
	GATT 服务器与第 26 页 "属性协议 (ATT) "中讨论的 ATT 服务器相对应。它接收客户端的请求并发送响应。它还会在配置时发送服务器发起的更新，并负责存储和向客户端提供以属性形式组织的用户数据。每个出售的 BLE 设备都必须至少包含一个基本的 GATT 服务器，它可以响应客户端的请求，即使只是返回错误响应。
GATT 的角色完全独立于 GAP 角色，并且同时彼此兼容。
这意味着 GAP 中心和 GAP 外围设备都可以充当 GATT 客户端或服务器，甚至同时充当两者