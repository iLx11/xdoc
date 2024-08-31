> The Generic Attribute Profile (GATT) builds on the Attribute Protocol (ATT) and adds a hierarchy and data abstraction model on top of it. In a way, it can be considered the backbone of BLE data transfer because it defines how data is organized and exchanged between applications. 
> It defines generic data objects that can be used and reused by a variety of application profiles (known as GATT-based profiles). It maintains the same client/server architecture present in ATT, but the data is now encapsulated in services, which consist of one or more characteristics. Each characteristic can be thought of as the union of a piece of user data along with metadata (descriptive information about that value such as prop‐ erties, user-visible name, units, and more).

通用属性配置文件 (GATT) 建立在属性协议 (ATT) 的基础上，并添加了层次结构和数据抽象模型。从某种意义上来说，它可以被认为是 BLE 数据传输的支柱，因为它定义了应用程序之间数据的组织和交换方式。它定义了可由各种应用程序使用和重用的通用数据对象配置文件（称为基于 GATT 的配置文件）。
它保持了 ATT 中相同的客户端和服务器架构，但数据现在封装在服务中，服务由一个或多个特征组成。每个特征都可以被认为是一段用户数据与元数据（有关该值的描述性信息，例如属性、用户可见的名称、单位等）的联合。
## Services and Characteristics
> The Generic Attribute Profile (GATT) establishes in detail how to exchange all profile and user data over a BLE connection.

通用属性配置文件 （GATT） 详细规定了如何通过 BLE 连接交换所有配置文件和用户数据。
> GATT uses the Attribute Protocol as its transport protocol to exchange data between devices. This data is organized hi‐ erarchically in sections called services, which group conceptually related pieces of user data called characteristics. This determines many fundamental aspects of GATT dis‐ cussed in this chapter.

GATT 使用属性协议作为其传输协议来在设备之间交换数据。**这些数据按层次结构组织在称为`服务`的部分中，这些部分将概念上相关的用户数据片段（称为`特征`）分组。**
