## Services
> GATT services group conceptually related attributes in one common section of the attribute information set in the GATT server. The specification refers to all the attributes within a single service as the service definition. Therefore, a GATT server’s attributes are in fact a succession of service definitions, each one starting with a single attribute that marks the beginning of a service (aptly named a service declaration.) This attribute’s type and value format is strictly specified in GATT

GATT 服务将概念上相关的属性，分组到 GATT 服务器中属性信息集的一个公共部分中。该规范将单个服务中的所有属性称为服务定义。
**因此，GATT 服务器的属性实际上是一系列服务定义，每个定义都以单个属性开头，该属性标记服务的开始（称为服务声明）。该属性的类型和值格式在 GATT 中严格指定**\
![[Pasted image 20240524094721.png]]
句柄类似于用于寻址属性的行号。服务声明属性的 Type 字段包含 UUID （ `0x2800` ），是一个唯一的 SIG 定义的 UUID，仅用于指示服务的开始。
“权限”字段表示“只读”，无需身份验证。“值”字段保存所声明服务的 UUID。
从概念上可以将 GATT 服务视为面向对象语言中的类，并完成实例化，因为服务可以在单个 GATT 服务器中多次实例化（但大多数服务都类似于单例）。
> Inside a service definition (that is to say, inside a service), you can add one or more references to another services, using include definitions. Include definitions consist of a single attribute (the include declaration) that contains all the details required for the client to reference the included service. 
> Included services can help avoid duplicating data in a GATT server. If a service will be referenced by other services, you can use this mechanism to save memory and simplify the layout of the GATT server. In the previous analogy with classes and objects, you could see include definitions as pointers or references to an existing object instance.

在服务定义内部可以使用包含定义添加对另一服务的一个或多个引用。包含定义由单个属性（包含声明）组成，该属性包含客户端引用所包含服务所需的所有详细信息。 
包含的服务可以帮助避免在 GATT 服务器中重复数据。如果一个服务将被其他服务引用，则可以使用此机制来节省内存并简化 GATT 服务器的布局。
## Characteristics
> You can understand characteristics as containers for user data. They always include at least two attributes: the characteristic declaration (which provides metadata about the actual user data) and the characteristic value (which is a full attribute that contains the user data in its value field). 
> Additionally, the characteristic value can be followed by descriptors, which further ex‐ pand on the metadata contained in the characteristic declaration. The declaration, value, and any descriptors together form the characteristic definition, which is the bundle of attributes that make up a single characteristic.

**可以将特征理解为用户数据的容器。它们始终包含至少两个属性：特征声明（提供有关实际用户数据的元数据）和特征值（这是在其值字段中包含用户数据的完整属性）**。此外，特征值后面可以跟描述符，进一步扩展特征声明中包含的元数据。
声明、值和任何描述符一起形成特征定义，它是构成单个特征的属性包。
### Characteristic declaration attribute
![[Pasted image 20240524100551.png]]
特征声明属性的 Type 字段包含仅用于声明特征的 UUID （ `0x2803` ）。声明属性具有只读权限，确保客户端可以读取值，但不能写入该值。
“值”字段包含有关所声明特征的重要信息，特别是三个单独的字段：
- **Characteristic properties**:
	特征属性：允许在此特征上执行哪些类型的 GATT 操作。
![[Pasted image 20240524101345.png]]
- **Characteristic value handle**:
	特征值句柄：包含用户数据（值）的属性的句柄（地址），即特征值属性。
- **Characteristic UUID**:
	特征 UUID：所声明的特征的 UUID。
### Characteristic value attribute
### 特征值属性
在声明特征的属性之后是特征值属性。这是存储实际用户数据的地方。其句柄和类型是“特征声明属性值”字段中引用的句柄。当然，它的 Value 字段是存储实际用户数据的地方。“权限”字段指示客户端是否可以读取和/或写入此属性。
## Characteristic Descriptors
> GATT characteristic descriptors (commonly called simply descriptors) are mostly used to provide the client with metadata (additional information about the characteristic and its value). They are always placed within the characteristic definition and after the characteristic value attribute. Descriptors are always made of a single attribute, the characteristic descriptor declaration, whose UUID is always the descriptor type and whose value contains whatever is defined by that particular descriptor type.

GATT 特征描述符（通常简称为描述符）主要用于向客户端提供元数据（有关特征及其值的附加信息）。它们始终放置在特征定义内、特征值属性之后。
描述符始终由单个属性（特征描述符声明）组成，其 UUID 始终是描述符类型，其值包含该特定描述符类型定义的任何内容。
![[Pasted image 20240524114734.png]]**它们通常分为两类，GATT 定义的和自定义的**。
以下是 GATT 定义的一些最常用的描述符
> **Extended Properties Descriptor** 
> This descriptor, when present, simply contains the two additional property bits
> **Characteristic User Description Descriptor**
> As the name implies, this descriptor contains a user-readable description for the char‐ acteristic within which it is placed. This is a UTF-8 string that could read, for example, “Temperature in the living room.”
> **Client Characteristic Configuration Descriptor**
> This descriptor type (often abbreviated CCCD) is without a doubt the most important and commonly used, and it is essential for the operation of most of the profiles and use cases. Its function is simple: it acts as a switch, enabling or disabling server-initiated updates (covered in more detail in “Server-Initiated Updates” on page 72), but only for the characteristic in which it finds itself enclosed.

**扩展属性描述符** 
	该描述符（如果存在）仅包含两个附加属性位
**特征用户描述描述符**
	顾名思义，该描述符包含对其所在特性的用户可读描述。这是一个 UTF-8 字符串，例如“客厅的温度”。
**客户端特征配置描述符**
	这种描述符类型（通常缩写为 CCCD）是最重要和最常用的，它对于大多数配置文件和用例的操作至关重要。它的功能很简单：它充当一个开关，启用或禁用服务器启动的更新，仅包括特性被关闭时。
### Client characteristic configuration descriptor (CCCD)  
客户端特征配置描述符 （CCCD）
客户端特征配置描述符 （CCCD） 是一种特定类型的特征描述符，当特征支持服务器启动的操作（即通知和指示）时，它是必需的。**是一个可写描述符，允许 GATT 客户端启用和禁用该特征的通知或指示。GATT客户端可以通过在CCCD中启用该特定特征的指示或通知来订阅它希望接收更新的特征。**
CCCD 属性的格式如下图所示。CCCD 的 UUID 是 `0x2902` 。CCCD 必须始终是可读和可写的。类型为 CCCD 的描述符的 Value 字段中只有 2 位。
第一位表示是否启用通知，第二位表示指示。
![[Pasted image 20240524182217.png]]
