Paring（配对）和bonding（绑定）是实现蓝牙射频通信安全的一种机制，有两点需要注意：
- paring/bonding实现的是蓝牙链路层的安全，对应用来说完全透明，也就是说，不管有没有paring/bonding，你发送或接收应用数据的方式是一样的，不会因为加了paring/bonding应用数据传输需要做某些特殊处理；
- 安全有两种选项：加密或者签名，目前绝大多数应用都是选择加密
实现蓝牙通信安全，除了paring/bonding这种底层方式，用户也可以在应用层去实现相同功能，两者从功能上和安全性上没有本质区别，只不过应用层自己实现的话，需要自己选择密码算法，密钥生成，密钥交换等，如果你不是这方面的专家，你的应用就有可能会存在安全漏洞。
Paring/bonding则把上述过程标准化，放在了蓝牙协议栈中，并且其安全性得到了充分评估，用户可以 “无感的” 用上安全的蓝牙通信。
## 1. 基本概念解读
**Paring（配对）**
配对包括**配对能力交换，设备认证，密钥生成，连接加密以及机密信息分发等过程**，配对的目的有三个：**加密连接，认证设备，以及生成密钥**。从手机角度看，一旦设备跟手机配对成功，蓝牙配置菜单将包含该配对设备
**Bonding（绑定）**
配对过程中会生成一个长期密钥（LTK，long-term Key），如果配对双方把这个LTK存储起来放在Flash中，那么这两个设备再次重连的时候，就可以跳过配对流程，而直接使用LTK对蓝牙连接进行加密，设备的这种状态称为bonding。
如果paring过程中不存储LTK（不分发LTK）也是可以的，paring完成后连接也是加密的，但是如果两个设备再次重连，那么就需要重走一次paring流程，否则两者还是明文通信。在不引起误解的情况下，**我们经常把paring当成paring和bonding两者的组合，因为只paring不bonding的应用情况非常少见**。在不引起混淆的情况下，下文就不区分paring和bonding的区别，换句话说，我们会把paring和bonding两个概念等同起来进行混用。

**SM****（security manager****）**，蓝牙协议栈的安全管理层，规定了跟蓝牙安全通信有关的所有要素，包括paring，bonding，以及下文提到的SMP。

**SMP****（security manager protocol****）**，安全管理协议，SMP着重两个设备之间的蓝牙交互命令序列，对paring的空中包进行了严格时序规定。

**OOB****（out of band****，带外）**，OOB就是不通过蓝牙射频本身来交互，而是通过比如人眼，NFC，UART等带外方式来交互配对信息，在这里人眼，NFC，UART通信方式就被称为OOB通信方式。

**Passkey**，又称pin码，是指用户在键盘中输入的一串数字，以达到认证设备的目的。低功耗蓝牙的passkey必须为6位。

**Numeric comparison**（数字比较），numeric comparison其实跟passkey一样，也是用来认证设备的，只不过passkey是通过键盘输入的，而numeric comparison是显示在显示器上的，numeric comparison也必须是6位的数字。

**MITM****（man in the middle****）**，MITM是指A和B通信过程中，C会插入进来以模拟A或者B，并且具备截获和篡改A和B之间所有通信报文的能力，从而达到让A或者B信任它，以至于错把C当成B或者A来通信。如果对安全要求比较高，需要具备MITM保护能力，在SM中这个是通过认证（authentication）来实现的，SM中实现认证的方式有三种：OOB认证信息，passkey以及numeric comparison，大家根据自己的实际情况，选择其中一种即可。

**LESC****（LE secure connections****）**，又称SC，蓝牙4.2引入的一种新的密钥生成方式和验证方式，SC通过基于椭圆曲线的Diffie-Hellman密钥交换算法来生成设备A和B的共享密钥，此密钥生成过程中需要用到公私钥对，以及其他的密码算法库。LESC同时还规定了相应的通信协议以生成该密钥，并验证该密钥。需要注意的是LESC对paring的其他方面也会产生一定的影响，所以我们经常会把LESC看成是一种新的配对方式。

**Legacy paring**，在LESC引入之前的密钥生成方式，称为legacy paring，换句话说，legacy paring是相对LESC来说的，不支持LESC的配对即为legacy paring（legacy配对）。

**TK****（Temporary Key****，临时密钥）**，legacy paring里面的概念，如果采用just work配对方式，TK就是为全0；如果采用passkey配对方式，TK就是passkey；如果采用OOB配对方式，TK就是OOB里面的信息。

**STK****（short term key****，短期密钥）**，legacy配对里面的概念，STK是通过TK推导出来的，通过TK对设备A和B的随机数进行加密，即得到STK。

**LTK****（long term key****，长期密钥）**，legacy配对和LESC配对都会用到LTK，如前所述，LTK是用来对未来的连接进行加密和解密用的。**Legacy paring****中的LTK****由从设备根据相应的算法自己生成的**（LTK生成过程中会用到EDIV（分散因子）和Rand（随机数）），然后通过蓝牙空中包传给主机。LESC配对过程中，先通过Diffie-Hellman生成一个共享密钥，然后这个共享密钥再对设备A和B的蓝牙地址和随机数进行加密，从而得到LTK，LTK由设备A和B各自同时生成，因此LTK不会出现在LESC蓝牙空中包中，大大提高了蓝牙通信的安全性。

**IRK****（Identity Resolving Key****，蓝牙设备地址解析密钥）**，有些蓝牙设备的地址为可解析的随机地址，比如iPhone手机，由于他们的地址随着时间会变化，那如何确定这些变化的地址都来自同一个设备呢？答案就是IRK，IRK通过解析变化的地址的规律，从而确定这些地址是否来自同一个设备，换句话说，IRK可以用来识别蓝牙设备身份，因此其也称为Identity information。IRK一般由设备出厂的时候按照一定要求自动生成。

**Identity Address****（设备唯一地址）**，蓝牙设备地址包括public，random static， private resolvable，random unresolved共四类。如果设备不支持privacy，那么identity address就等于public或者random static设备地址。如果设备支持privacy，即使用private resolvable蓝牙设备地址，在这种情况下，虽然其地址每隔一段时间会变化一次，但是identity address仍然保持不变，其取值还是等于内在的public或者random static设备地址。Identity Address和IRK都可以用来唯一标识一个蓝牙设备。

**IO capabilities****（输入输出能力）**，是指蓝牙设备的输入输出能力，比如是否有键盘，是否有显示器，是否可以输入Yes/No两个确认值。

**Key size****（密钥长度）**，一般来说，密钥默认长度为16字节，为了适应一些低端的蓝牙设备处理能力，你也可以把密钥长度调低，比如变为10个字节。