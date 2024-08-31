> Attributes are the smallest data entity defined by GATT (and ATT). They are address‐ able pieces of information that can contain relevant user data (or metadata) about the structure and grouping of the different attributes contained within the server. Both GATT and ATT can work only with attributes, so for clients and servers to interact, all information must be organized in this form

属性是 GATT（和 ATT）定义的最小数据实体。它们是能够寻址的信息块，可以包含有关服务器中不同属性的结构和分组的相关用户数据（或元数据）。GATT 和 ATT 都只能与属性一起工作，因此客户端和服务器要进行交互，所有信息都必须以这种形式组织起来
属性通常被存储在非易失性存储器和 RAM 的混合中
**每个属性都包含本身的信息和实际数据，属性的信息在包含在下面几个字段中**
### Handle
> The attribute handle is a unique 16-bit identifier for each attribute on a particular GATT server. It is the part of each attribute that makes it addressable, and it is guaranteed not to change (with the caveats described in “Attribute Caching” on page 66) between trans‐ actions or, for bonded devices, even across connections. Because value 0x0000 denotes an invalid handle, the amount of handles available to every GATT server is 0xFFFE (65535), although in practice, the number of attributes in a server is typically closer to a few dozen.

属性句柄是特定 GATT 服务器上每个属性的唯一 16 位标识符。它是每个属性中可寻址的部分，保证在不同的传输操作之间不会改变，对于绑定的设备，甚至在不同的连接之间也不会改变。
由于 0x0000 表示无效句柄，因此每个 GATT 服务器可用的句柄数量为 0xFFFE (65535)，但在实际应用中，服务器中的属性数量通常接近几十个。
> Within a GATT server, the growing values of handles determine the ordered sequence of attributes that a client can access. But gaps between handles are allowed, so a client cannot rely on a contiguous sequence to guess the location of the next attribute. Instead, the client must use the discovery feature (“Service and Characteristic Discovery” on page 69) to obtain the handles of the attributes it is interested in

在 GATT 服务器中，句柄值的增长决定了客户端可以访问的属性的有序序列。但句柄之间是允许有间隙的，因此客户端不能依靠连续的序列来猜测下一个属性的位置。相反，客户端必须使用发现功能，来获取其感兴趣的属性的句柄
### Type
> The attribute type is nothing other than a UUID (see “UUIDs” on page 52). This can be a 16-, 32-, or 128-bit UUID, taking up 2, 4, or 16 bytes, respectively. The type deter‐ mines the kind of data present in the value of the attribute, and mechanisms are available to discover attributes based exclusively on their type (see “Service and Characteristic Discovery” on page 69). 

属性类型其实是 UUID。它可以是 16 位、32 位或 128 位 UUID，分别占用 2、4 或 16 个字节。类型决定属性值中存在的数据类型，并且可使用机制来仅根据属性的类型来发现属性
> Although the attribute type is always a UUID, many kinds of UUIDs can be used to fill in the type. They can be standard UUIDs that determine the layout of the GATT server’s attribute hierarchy (further discussed in “Attribute and Data Hierarchy” on page 56), such as the service or characteristic UUIDs, profile UUIDs that specify the kind of data contained in the attribute, such as Heart Rate Measurement or Temperature, and even proprietary, vendor-specific UUIDs, the meaning of which is assigned by the vendor and depends on the implementation

虽然属性类型始终是 UUID，但可以使用多种 UUID 来填充类型。它们可以是确定 GATT 服务器属性层次结构布局的标准 UUID，例如服务或特征 UUID、指定属性中包含的数据类型的配置文件 UUID ，例如心率测量或温度，甚至专有的、特定于供应商的 UUID，其含义由供应商分配并​​取决于如何实现
### Permissions
>  are metadata that specify which ATT operations (see “ATT operations” on page 26) can be executed on each particular attribute and with which specific security requirements. 

是指定可以对每个特定属性执行哪些 ATT 操作，以及具体安全要求的元数据。
ATT 和 GATT 定义了下面的权限
> Access Permissions 
> Similar to file permissions, access permissions determine whether the client can read or write (or both) an attribute value (introduced in “Value” on page 55). Each attribute can have one of the following access permissions: 
> None 
> 	The attribute can neither be read nor written by a client. 
> Readable 
> 	The attribute can be read by a client. 
> Writable 
> 	The attribute can be written by a client. 
> Readable and writable
> 	 The attribute can be both read and written by the client

#### 访问权限
与文件权限类似，访问权限决定客户端是否可以读取或写入（或两者）属性值。每个属性可以具有以下访问权限之一：
- 无
	客户端既不能读取也不能写入该属性。
- 可读
	该属性可由客户端读取。
- 可写
	该属性可以由客户端写入。
- 可读写
	该属性可由客户端读取和写入
> Encryption 
> Determines whether a certain level of encryption is required for this attribute to be accessed by the client. (See “Authentication” on page 45, “Security Modes and Pro‐ cedures” on page 46, and “Security Modes” on page 45 for more information on authentication and encryption.) These are the allowed encryption permissions, as defined by GATT:
>  **No encryption required (Security Mode 1, Level 1)** 
> 	 The attribute is accessible on a plain-text, non-encrypted connection. 
>  **Unauthenticated encryption required (Security Mode 1, Level 2)** 
> 	 The connection must be encrypted to access this attribute, but the encryption keys do not need to be authenticated (although they can be). 
>  **Authenticated encryption required (Security Mode 1, Level 3)** 
> 	 The connection must be encrypted with an authenticated key to access this attribute.

#### 加密
确定客户端访问此属性是否需要一定级别的加密。这些是允许的加密权限，如 GATT 所定义：
 - **无需加密（安全模式 1，级别 1）**
	该属性可通过纯文本、非加密连接访问。
- **需要未经身份验证的加密（安全模式 1，级别 2）**
	必须对连接进行加密才能访问此属性，但加密密钥不需要进行身份验证（尽管可以进行身份​​验证）。
- **需要经过身份验证的加密（安全模式 1，级别 3）**
	必须使用经过身份验证的密钥对连接进行加密才能访问此属性。
> Authorization 
> Determines whether user permission (also known as authorization, as discussed in “Security Modes and Procedures” on page 46) is required to access this attribute. An attribute can choose only between requiring or not requiring authorization: 
> **No authorization required** 
> 	Access to this attribute does not require authorization. 
> **Authorization required** 
> 	Access to this attribute requires authorization.

#### 授权
确定访问此属性是否需要用户许可，属性只能在需要或不需要授权之间进行选择：
- **无需授权**
	访问该属性不需要授权。
- **需要授权**
	访问此属性需要授权。
### Value
> The attribute value holds the actual data content of the attribute. There are no restric‐ tions on the type of data it can contain (you can imagine it as a non-typed buffer that can be cast to whatever the actual type is, based on the attribute type), although its maximum length is limited to 512 bytes by the specification.

属性值保存属性的实际数据内容。它可以包含的数据类型没有限制（可以将其想象为一个非类型化缓冲区，可以根据属性类型将其转换为任何实际类型），尽管其最大长度限制为 512 字节。
![Pasted image 20240522173643.png](https://picr.oss-cn-qingdao.aliyuncs.com/img/Pasted%20image%2020240522173643.png)

> Athough the Bluetooth specification defines attributes in the ATT section, that is as far as ATT goes when it comes to them. ATT operates in attribute terms and relies on all the concepts exposed in “Attributes” on page 53 to provide a series of precise protocol data units (PDUs, commonly known as packets) that permit a client to access the at‐ tributes on a server. GATT goes further to establish a strict hierarchy to organize attributes in a reusable and practical manner, allowing the access and retrieval of information between client and server to follow a concise set of rules that together consitute the framework used by all GATT-based profiles.

尽管蓝牙规范在 ATT 部分中定义了属性，但这只是 ATT 涉及到的属性。 ATT 以属性术语运行，并依赖“属性”中的概念来提供一系列精确的协议数据单元（PDU，通常称为数据包），允许客户端访问服务器上的属性。 
GATT 进一步建立了严格的层次结构，以可重用且实用的方式组织属性，允许客户端和服务器之间的信息访问和检索遵循一组简洁的规则，这些规则共同构成了所有基于 GATT 的配置文件所使用的框架。
![Pasted image 20240522174539.png](https://picr.oss-cn-qingdao.aliyuncs.com/img/Pasted%20image%2020240522174539.png)

> The attributes in a GATT server are grouped into services, each of which can contain zero or more characteristics. These characteristics, in turn, can include zero or more descriptors. This hierarchy is strictly enforced for any device claiming GATT compati‐ bility (essentially, all BLE devices sold), which means that all attributes in a GATT server are included in one of these three categories, with no exceptions. No dangling attributes can live outside of this hierarchy, as exchanging data between BLE devices depends on it

**GATT 服务器中的属性被分组为服务，每个服务可以包含零个或多个特征。这些特征又可以包括零个或多个描述符**。对于任何声称 GATT 兼容性的设备（本质上是所有出售的 BLE 设备）都严格执行此层次结构，这意味着 GATT 服务器中的所有属性都包含在这三个类别之一中，无一例外。任何悬空属性都不能存在于该层次结构之外，因为 BLE 设备之间的数据交换取决于它
