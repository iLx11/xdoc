> the Host Controller Interface (HCI) is a standard protocol that allows for the communication between a host and a controller to take place across a serial interface. It makes sense to draw a line at that level because,
> the controller is the only module with hard real-time requirements and contact with the physical layer. This means that it is often practical to separate it from the host, which implements a more complex but less timing-stringent protocol stack better suited for more advanced CPUs.

**主机控制器接口（HCI）是一种标准的协议，允许主机和控制器通过串行接口进行通信。**
在这一级别划线是合理的。**控制器是唯一有硬实时要求并与物理层接触的唯一模块。**
这意味着将控制器与主机分离通常是可行的。主机实施的协议栈更为复杂，但对时间的要求不那么严格，更适合更先进的 CPU。
> The Bluetooth specification defines HCI as a set of commands and events for the host and the controller to interact with each other, along with a data packet format and a set of rules for flow control and other procedures. Additionally, the spec defines several transports, each of which augments the HCI protocol for a specific physical transport (UART, USB, SDIO, etc.).

蓝牙规范将 HCI 定义为主机和控制器之间进行交互的一组命令和事件，以及数据包格式和一套流量控制规则和其他程序。此外，该规范还定义了几个传输，每个传输都增强了特定物理传输的 HCI 协议（UART、USB、SDIO等）。