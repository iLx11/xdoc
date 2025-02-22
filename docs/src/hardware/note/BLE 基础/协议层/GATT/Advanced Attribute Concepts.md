## Attribute Caching
### 属性缓存
关于客户端可以采取哪些措施来避免每次重新连接到服务器时都执行发现
> Clients can ascertain if the result of discovery can be cached for future use by observing the following conditions: 
> No Service Changed characteristic present on the server 
> 	Clients can freely and permamently cache all handles found with no restrictions. The server guarantees they will not change during the lifetime of the device. 
> Service Changed characteristic present on the server
> 	 In this case, a client needs to subscribe to the server-initiated updates by writing into the corresponding CCCD enclosed within the Service Changed characteristic (see “Characteristic Descriptors” on page 61). This will allow the server to alert the client of any structural changes. If the client and the server are bonded as described in “Security Modes and Procedures” on page 46, the client can cache attribute handles across connections and expect them to remain identical. If the devices are not bonded, the client will need to perform discovery every time it reconnects to the server> 

客户端可以通过观察以下条件来确定是否可以缓存 discovery 的结果以供将来使用：
- **服务器上不存在服务更改特征**
	客户端可以自由且永久地缓存所有找到的句柄，没有任何限制。服务器保证它们在设备的生命周期内不会改变。
- **服务器上存在服务更改特征**
	在这种情况下，客户端需要通过写入服务更改特征中包含的相应 CCCD 来订阅服务器发起的更新。这将允许服务器提醒客户端任何结构更改。**如果客户端和服务器已经绑定，则客户端可以跨连接缓存属性句柄并期望它们保持一致。如果设备未绑定，则客户端每次重新连接到服务器时都需要执行发现**
## GATT Attribute Data in Advertising Packets
### 广告数据包中的 GATT 属性数据
尽管 GATT 主要依赖于中央和外围设备之间建立的连接，但也可以将服务器托管的部分属性信息包含在广播包中，从而在扫描时向任何观察者或中央设备提供一个或多个服务器属性。
> The Core Specification Supplement in the “Specification Adopted Documents page” specifies the fields that the GATT server must insert in the payload of an advertising packet to make a particular service’s data available to scanners.

核心规范补充指定了 GATT 服务器必须在广播包插入有效负载的字段，以使特定服务的数据可供扫描设备使用。
> The contents of the Service Data field can correspond to the complete or partial value of a particular characteristic or descriptor within the corresponding service. It is up to each profile specification to define which, because only the profile has sufficient knowl‐ edge about the data to decide which pieces of information are the most relevant to be broadcasted

![Pasted image 20240530170714.png](https://picr.oss-cn-qingdao.aliyuncs.com/img/Pasted%20image%2020240530170714.png)
服务数据字段的内容可以对应于相应服务中特定特征或描述符的完整或部分值，每个配置文件规范都应自行定义哪些内容。因为只有配置文件对数据有足够的了解，才能决定哪些信息最相关，最值得广播

