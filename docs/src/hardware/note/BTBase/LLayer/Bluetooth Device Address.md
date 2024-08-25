## 蓝牙硬件地址
> The fundamental identifier of a Bluetooth device, similar to an Ethernet Media Access Control (MAC) adddress, is the Bluetooth device address. This 48-bit (6-byte) number uniquely identifies a device among peers. There are two types of device addresses, and one or both can be set on a particular device: 
> Public device address 
> 	This is the equivalent to a fixed, BR/EDR, factory-programmed device address. It must be registered with the IEEE Registration Authority and will never change during the lifetime of the device. 
> Random device address 
> 	This address can either be preprogrammed on the device or dynamically generated at runtime. It has many practical uses in BLE, as discussed in more detail in “Address Types” on page 44. Each procedure must be performed using one of the two, to be specified by the host

**蓝牙设备的基本标识符是蓝牙设备地址，类似于以太网的媒体访问控制（MAC）地址类似**，蓝牙设备地址是蓝牙设备的基本标识符。这个 48 位（6 字节）的数字是对等设备中的唯一标识。
设备地址有两种类型可在特定设备上设置一种或两种：
### 公共设备地址
	这相当于固定的、BR/EDR 的、工厂编程的设备地址。它必须在 IEEE 注册机构注册，并且在设备生命周期内不会更改。
### 随机设备地址
	该地址可以在设备上预先编程，也可以在运行时动态生成。运行时动态生成。它在 BLE 中有许多实际用途
**每个程序都必须使用由主机指定的两种地址之一。**