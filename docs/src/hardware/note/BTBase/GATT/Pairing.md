蓝牙 LE 协议提供了许多与安全性相关的功能，包括身份验证、完整性、机密性和隐私性。
### Pairing process 配对过程
保护无线通信的最常见做法是加密连接，这会将发送的数据转换为只有有权读取的人员才能读取的形式。若要加密链路，两个对等体需要具有相同的密钥。生成、分发和验证这些密钥以进行加密的过程称为配对过程。
除了“配对”之外，当对等体存储加密密钥时，还会使用术语“绑定”，以便他们可以在将来与同一对等体的连接中重新加密链路。在绑定期间，他们还可以交换和存储身份密钥，以便他们可以通过随机可解析的私人地址相互识别，以便将来建立联系。
- **配对**：出于加密目的生成、分发和验证密钥的过程。
- **绑定**：配对过程后分发密钥，用于在未来的重新连接中对链路进行加密。
### Perform pairing
将生成用于加密连接的密钥。在 LE Legacy 配对中，对等体交换用于生成短期密钥 （STK） 的临时密钥 （TK），然后用于加密链接。但是，由于 STK 很容易被破解，因此蓝牙 v4.2 引入了一种称为蓝牙 LE 安全连接的东西。
在 LE 安全连接中，设备生成并交换更安全类型的密钥，并使用它来生成用于加密连接的单个长期密钥 （LTK）。
传统配对定义了三种不同的传统知识交换方法，称为配对方法。LE Secure Connections 支持这三种配对方法，但也支持传统配对中不支持的第四种（数字比较）。
> - **Just Works**: 
> 	- Both peers generate the STK based on information exchanged in plain text, and the user is just asked to accept the connection. This method is unauthenticated.
> - **Passkey Entry**: 
> 	- 6-digit number is displayed on one device, and needs to be typed in on the other device. The I/O capabilities of the devices determind which one displays the number and which one inputs it.
> - **Out of Band (OOB)**: 
> 	- The encryption keys are exchanged by some other means than Bluetooth LE, for example by using NFC.
> - **Numeric Comparison (LE Secure Connections only)**: 
> 	- Both devices display a 6-digit number and the user selects “yes” or “no” to confirm the display.

**直接工作：**
	对等双方根据以纯文本交换的信息生成 STK，用户只需接受连接即可。这种方法未经验证。
**输入密码**：
	在一台设备上显示 6 位数字，需要在另一台设备上输入。设备的输入/输出能力决定哪个设备显示数字，哪个设备输入数字。
**带外（OOB）**：
	通过蓝牙 LE 以外的其他方式交换加密密钥，例如使用 NFC。
**数字比较（仅限 LE 安全连接）**：
	两台设备都显示一个 6 位数字，用户选择 "是 "或 "否 "确认显示。
使用哪种配对方法是根据 OOB 标志、中间人 （MITM） 标志以及在第 1 阶段交换的对等体的 I/O 功能来决定的。OOB 和 MITM 标志首先确定是直接使用 OOB 配对方法，还是根据 I/O 功能确定配对方法。
在 LE 安全连接中，只有一个对等体需要设置 OOB 标志，才能使用此配对方法。
### Key distribution
在此阶段，长期密钥 （LTK） 用于分发其余密钥。在传统配对中，LTK 也在此阶段生成（在 LE 安全连接中，LTK 在第 2 阶段生成）。在此阶段还会生成和交换其他密钥，以便在下次重新连接时识别对等方，并能够使用相同的 LTK 重新加密链路。
![[Pasted image 20240611094924.png]]

## Legacy pairing 传统配对
在蓝牙 v4.2 之前，传统配对是蓝牙 LE 中唯一可用的配对方法。这非常简单，并且暴露了风险，因为用于加密链接的短期密钥 （STK） 很容易被破解。
在 Legacy 配对中使用 `Just Works`  时，TK 设置为 0，这在窃听或中间人 （MITM） 方面不提供任何保护。攻击者可以很容易地暴力破解STK并窃听连接，并且也无法验证设备。
在`带外配对`中，TK 通过蓝牙 LE 以外的其他方式交换，例如，使用 NFC。该方法支持使用大至 128 位的 TK，从而增加了连接的安全性。交换过程中使用的 OOB 通道的安全性也决定了蓝牙 LE 连接的保护。如果 OOB 通道受到保护免受窃听和 MITM 攻击，则蓝牙 LE 链路也是如此。
蓝牙 SIG 不建议使用传统配对，但如果必须使用它，请使用 OOB 配对。带外身份验证是与旧配对配对时可以认为安全的唯一方法。
## LE Secure Connections LE 安全连接
因此，在蓝牙 v4.2 中引入了 LE 安全连接。LE Secure Connections 不使用 TK 和 STK，而是使用椭圆曲线 Diffie-Hellman （ECDH） 加密来生成公钥-私钥对。设备交换其公钥。他们将使用四种配对方法之一（Just Works、Passkey entry、OOB 或 Numeric Comparison）来验证对等设备的真实性，并根据 Diffie-Hellman 密钥和身份验证数据生成 LTK。
尽管使用 LE 安全连接时 `Just Works` 更安全。它仍然不提供身份验证，因此不建议将其作为配对方法。密钥条目配对方法现在使用密钥以及 ECDH 公钥和 128 位任意数字来验证连接。这意味着它比传统配对中描述的要安全得多。使用 OOB 配对仍然是推荐的选项，因为只要 OOB 通道是安全的，它就会提供保护，就像在传统配对中一样。
此外，还引入了一种称为“数字比较”的新配对方法。尽管它遵循与 Just Works 配对方法相同的过程，但它在末尾添加了另一个步骤，通过让用户根据两个对等体上显示的值执行手动检查来防止 MITM 攻击。
对等体之间交换的唯一数据是公钥。ECDH公钥加密的使用使得破解LTK变得极其困难，与传统配对相比，这是一个重大改进。
# Security models 安全模型
## Security concerns 安全问题
对于“蓝牙 LE 的安全性如何”这个问题，没有一个简单的答案？这在很大程度上取决于配对过程的执行方式以及对等设备具有的 I/O 功能。
Bluetooth LE 安全必须应对 3 种常见类型的攻击：
- Identity tracking 身份跟踪
	身份跟踪利用蓝牙地址来跟踪设备。防范此类攻击需要隐私保护。这可以通过使用随机更改的可解析专用地址来完成，其中只有绑定/受信任的设备才能解析专用地址。IRK（身份解析密钥）用于生成和解析专用地址。
- Passive eavesdropping (sniffing)  
    被动窃听（嗅探）
    被动窃听允许攻击者监听设备之间传输的数据。这可以通过加密对等体之间的通信来防止。这里的挑战是对等设备如何生成和/或交换密钥以安全地加密连接。这是使蓝牙 LE 传统配对容易受到攻击的主要缺点，并产生了对 LE 安全连接的需求。
- Active eavesdropping (Man-in-the-middle, or MITM)  
    主动窃听（中间人或 MITM）
	在主动窃听（或中间人）攻击中，攻击者冒充两个合法设备来欺骗他们连接到它。为了防止这种情况，我们需要确保与我们通信的设备实际上是我们想要与之通信的设备，而不是未经身份验证的设备。
## Security levels 安全级别
Bluetooth LE defines 4 security levels in security mode 1:  
Bluetooth LE 在安全模式 1 中定义了 4 个安全级别：
- **Level 1:** No security (open text, meaning no authentication and no encryption)   
    级别 1：无安全性（打开文本，意味着没有身份验证和加密）
- **Level 2**: Encryption with unauthenticated pairing  
    级别 2：使用未经身份验证的配对进行加密
- **Level 3**: Authenticated pairing with encryption  
    级别 3：带加密的身份验证配对
- **Level 4**: Authenticated LE Secure Connections pairing with encryption  
    级别 4：经过身份验证的 LE 安全连接与加密配对
**每个连接从安全级别 1 开始，然后根据使用的配对方法升级到更高的安全级别。**
使用 Just Works 会将连接提升到安全级别 2。此方法不能防止 MITM 攻击，因为链接只是加密的，而不是经过身份验证的。为了防止 MITM，连接需要处于安全级别 3 或更高。这可以通过将 Passkey Entry 或 OOB 配对方法与 Legacy 配对结合使用来实现，这两种方法都提供身份验证，将安全性提高到 3 级
只有当两个对等体都支持 LE 安全连接，并且使用密钥输入、数字比较或 OOB 身份验证方法时，连接才能获得安全级别 4。
属性的 Permissions 字段不仅确定属性是可读还是可写，还确定该连接所需的安全级别，以便访问该属性。例如，如果链路使用安全级别 2（未经身份验证的加密）进行加密，则对等体将无法访问任何需要更高安全级别的特征。
## Filter Accept List 筛选器接受列表
筛选器接受列表（以前称为白名单）是一种在播发和扫描中限制对设备列表的访问的方法。
**在广播中使用时**，只有过滤器接受列表中的设备才能发送连接请求以建立连接，或发送扫描请求以获取广告商的扫描响应。如果不在列表中的设备发送了这些请求，广告客户将忽略该请求。
**在扫描中使用时**，只会扫描来自列表中设备的通告和扫描响应数据包并将其报告给应用程序。扫描程序将过滤掉来自其他广告商的所有数据包。
通过使用对等方的地址和在配对过程的第 3 阶段分发的身份密钥，我们可以构建筛选器接受列表，以仅允许绑定和授权的设备连接到设备。您可以通过添加“配对模式”来决定新设备是否可以加入此列表，该模式会暂时关闭筛选器接受列表，并可以在配对完成后重新打开它。