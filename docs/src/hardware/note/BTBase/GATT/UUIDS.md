> A universally unique identifier (UUID) is a 128-bit (16 bytes) number that is guaranteed (or has a high probability) to be globally unique. UUIDs are used in many protocols and applications other than Bluetooth, and their format, usage, and generation is speci‐ fied in ITU-T Rec. X.667, alternatively known as ISO/IEC 9834-8:2005

通用唯一标识符（UUID）是一个 128 位（16 字节）的数字，保证（或极有可能）是全球唯一的。除蓝牙外，UUID 还用于许多协议和应用中，其格式、使用和生成在 ITU-T Rec.X.667，又称 ISO/IEC 9834-8:2005。
> For efficiency, and because 16 bytes would take a large chunk of the 27-byte data payload length of the Link Layer, the BLE specification adds two additional UUID formats: 16- bit and 32-bit UUIDs. These shortened formats can be used only with UUIDs that are defined in the Bluetooth specification (i.e., that are listed by the Bluetooth SIG as stan‐ dard Bluetooth UUIDs).

为了提高效率，并且由于 16 字节将占用链路层 27 字节数据有效负载长度的很大一部分，因此 BLE 规范添加了两种额外的 UUID 格式：16 位和 32 位 UUID。这些缩短的格式只能与蓝牙规范中定义的 UUID（即，由蓝牙 SIG 列为标准蓝牙 UUID）一起使用。
>To reconstruct the full 128-bit UUID from the shortened version, insert the 16- or 32- bit short value (indicated by xxxxxxxx, including leading zeros) into the Bluetooth Base UUID: xxxxxxxx-0000-1000-8000-00805F9B34FB

要从缩短版重建完整的 128 位 UUID，可以将 16 位或 32 位短值（用 xxxxxxxx 表示，包括前导零）插入蓝牙基本 UUID：
**xxxxxxxx-0000-1000-8000-00805F9B34FB**
这样就得到了完整的 128 UUID
> The SIG provides (shortened) UUIDs for all the types, services, and profiles that it defines and specifies. But if your application needs its own, either because the ones offered by the SIG do not cover your requirements or because you want to implement a new use case not previously considered in the profile specifications, you can generate them using the ITU’s UUID generation page. 
> Shortening is not available for UUIDs that are not derived from the Bluetooth Base UUID (commonly called vendor-specific UUIDs). In these cases, you’ll need to use the full 128-bit UUID value at all times.

SIG 为其定义和指定的所有类型、服务和配置文件提供（缩短的）UUID。
但是，如果需要自己的 UUID，或者 SIG 提供的 UUID 不能满足要求，或是实现一个在配置文件规范中没有考虑到的新用例，可以使用国际电信联盟的 UUID 生成页面生成这些 UUID。
如果 UUID 不是从蓝牙基本 UUID 派生的（通常称为供应商的 UUID），则不能使用缩短功能。需要始终使用完整的 128 位 UUID 值。