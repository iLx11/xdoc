## 安全管理
> The Security Manager (SM) is both a protocol and a series of security algorithms de‐ signed to provide the Bluetooth protocol stack with the ability to generate and exchange security keys, which then allow the peers to communicate securely over an encrypted link, to trust the identity of the remote device, and finally, to hide the public Bluetooth Address if required to avoid malicious peers tracking a particular device.

安全管理器（Security Manager，SM）既是一个协议，也是一系列安全算法，用于为蓝牙协议栈提供生成和交换安全密钥的能力，从而使对等设备能够通过加密链路进行安全通信，信任远程设备的身份，并在必要时隐藏公共蓝牙地址，以避免恶意对等设备追踪特定设备。
> The Security Manager defines two roles: 
> **Initiator** 
> 	Always corresponds to the Link Layer master and therefore the GAP central. 
> **Responder** 
> 	Always corresponds to the Link Layer slave and therefore the GAP peripheral. Although it is always up to the initiator to trigger the beginning of a procedure, the responder can asynchronously request the start of any of the procedures listed in “Security Procedures”. There are no guarantees for the responder that the initiator will actually heed the request, serving more as a hint than a real, binding request. This security request can logically be issued only by the slave or peripheral end of the con‐ nection.

### 安全管理器定义了两种角色：
- **发起者**
	总是与链路层主站相对应，因此是 GAP 中心。
- **应答者**
	总是与链路层从属设备相对应，因此是 GAP 外围设备。虽然启动程序的开始总是由启动程序触发，但应答程序可以异步请求启动 "Security Procedures（安全程序）"中所列的任何程序。响应者无法保证启动者是否会真正注意到该请求，它更像是一个提示，而不是一个真正的、有约束力的请求。从逻辑上讲，这种安全请求只能由连接的从属端或外设端发出。
## Security Procedures
> The Security Manager provides support for the following three procedures: 
> **Pairing** 
> 	The procedure by which a temporary common security encryption key is generated to be able to switch to a secure, encrypted link. This temporary key is not stored and is therefore not reusable in subsequent connections. 
> **Bonding** 
> 	A sequence of pairing followed by the generation and exchange of permanent se‐ curity keys, destined to be stored in nonvolatile memory and therefore creating a permanent bond between two devices, which will allow them to quickly set up a secure link in subsequent connections without having to perform a bonding pro‐ cedure again. 
> **Encryption Re-establishment** 
> 	After a bonding procedure is complete, keys might have been stored on both sides of the connection. If encryption keys have been stored, this procedure defines how to use those keys in subsequent connections to re-establish a secure, encrypted connection without having to go through the pairing (or bonding) procedure again.

### 安全管理器为以下三个程序提供支持：
- **配对**
	生成临时通用安全加密密钥以切换到安全加密链接的过程。该临时密钥不存储，因此在后续连接中不可重复使用。
 - **绑定**
	生成和交换永久安全密钥后的一系列配对，这些密钥将存储在非易失性存储器中，从而在两台设备之间建立永久连接，使其能够在后续连接中快速建立安全链接，而无需再次执行绑定程序。
- **加密重建**
	绑定过程完成后，密钥可能已存储在连接的两侧。如果已存储加密密钥，则此程序将定义如何在后续连接中使用这些密钥，来重新建立安全的加密连接，而无需再次执行配对（或绑定）过程。
因此，配对可以创建一个安全链接，该链接只在连接期间有效。
而绑定实际上是以共享安全密钥的形式创建永久关联
> Initially (Phase 1), all information required to generate the temporary key is exchanged between the two devices. Next, (Phase 2) the actual temporary encryption key (Short Term Key or STK) is generated on both sides independently and then used to encrypt the connection. Once the connection is secured by encryption, and only if performing bonding, the permanent keys can be distributed for storage and reuse at a later time.

最初（阶段 1），两台设备交换生成临时密钥所需的所有信息。
接下来，（第 2 阶段）生成实际的临时加密密钥（短期密钥或 STK）由双方独立生成，然后用于加密连接。一旦通过加密确保了连接的安全，并且只有在执行绑定时，永久密钥才可分发存储并在以后重复使用。
![[Pasted image 20240522100134.png]]
## Pairing Algorithms
配对算法
> A pairing procedure involves an exchange of Security Manager Protocol (SMP) packets to generate a temporary encryption key called Short Term Key (STK) on both sides. The last step of a pairing procedure (regardless of whether it will then continue into a security key exchange and therefore a bonding procedure) is to encrypt the link with the previ‐ ously generated STK. During the packet exchange, the two peers negotiate one of the following STK generation methods:

 **配对过程涉及安全管理器协议 (SMP) 数据包的交换，以在双方生成短期密钥 (STK) 的临时加密密钥。**
 配对过程的最后一步（无论接下来是否会继续进行安全密钥交换以及绑定过程）是使用先前生成的 STK 来加密链接。
 **在数据包交换期间，两个对等方协商以下 STK 生成方法之一：**
> **Just Works** 
> 	The STK is generated on both sides, based on the packets exchanged in plain text. This provides no security against man-in-the-middle (MITM) attacks. 
> **Passkey Display** 
> 	One of the peers displays a randomly generated, six-digit passkey and the other side is asked to enter it (or in certain cases both sides enter the key, if no display is available). This provides protection against MITM attacks and is used whenever possible. 
> **Out Of Band (OOB)** 
> 	When using this method, additional data is transferred by means other than the BLE radio, such as another wireless technology like NFC. This method also provides protection against MITM attacks.

**Just Works** 
	STK 是双方根据以纯文本交换的数据包生成的。这无法防范中间人（MITM）攻击。
 **Passkey Display**
	其中一方显示随机生成的六位数密码，另一方被要求输入密码（在某些情况下，如果没有显示，则双方都输入密码）。这可以防止 MITM 攻击，并在可能的情况下使用。
**Out Of Band (OOB)** 
	使用这种方法时，其他数据将通过 BLE 无线电以外的方式传输，如 NFC 等其他无线技术。这种方法也可防止 MITM 攻击。

**SM规定了以下三种类型的安全机制，可用于在连接中或广告过程中强制执行各种级别的安全性程序：**
> **Encryption** 
> 	This mechanism consists of the full encryption of all packets transmitted over an established connection. 
> **Privacy** 
> 	The privacy feature allows an advertiser to hide its public Bluetooth address by using temporary, randomly generated addresses that can be recognized by a scanner that is bonded with the advertising device. 
> **Signing**
> 	 With this mechanism, a device can send an unencrypted packet over an established connection that is digitally signed (i.e., the source of which can be verfied). 
>  Each of these three mechanisms can be used independently from the others, and the application, in conjunction with the host, has the choice of enforcing any of them con‐ currently.

- **加密**
	该机制包括对已建立连接上传输的所有数据包进行完全加密。
- **隐私**
	隐私功能允许广告商通过使用临时随机生成的地址来隐藏其公开蓝牙地址，该地址可被与广告设备绑定的扫描仪识别。
- **签名**
	利用这一机制，设备可通过已建立的连接发送未加密的数据包，该数据包已进行数字签名（即可验证其来源）