nRF52832 片内集成了一个 UART 外设，其主要特性如下：
- 全双工。
- 自动的流控。
- 奇偶校验并自动产生校验位。
- 1 位停止位。
nRF52832 的 UART 通过 TXD 和 RXD 寄存器发送和接收数据，UART 的原理框图如下 图所示：
![sdf](https://picr.oss-cn-qingdao.aliyuncs.com/img/Pasted%20image%2020240430101920.png)
UART 共有 4 个引脚配置寄存器，通过这 4 个寄存器可以将 UART的4个信号映射到任何一个物理引脚。UART的发送通过STARTTX任务启动和停止， 发送成功后，会产生 TXDRDY 事件。UART 的接收通过 STARTRX 和 STOPRX 任务启动和 停止，当数据由硬件 FIFO 提取到 RXD 寄存器时，产生 RXDRDY 事件。
### UART 发送
UART 通过触发 STARTTX 任务（即向任务寄存器 STARTTX 中写入 1）启动发送序列， 数据通过写入到 TXD 寄存器发送，每次发送一个字节，之后 TXD 中的数据逐个传送到物 理线路。当 TXD 中的数据传送完成之后，UART 产生 TXDRDY 事件，这时可以向 TXD 寄 存器写入下一个要发送的数据
如果要停止 UART 发送，触发 STOPTX 任务（即向任务寄存器 STOPTX 中写入 1）即可，触发后，UART 发送会立即停止。
一旦使能了串口硬件流控，向 TXD 中写入数据后，如果 CTS 信号有效（CTS 为低电平， 允许发送），TXD 中的数据会被传送到物理线路，否则，发送会被挂起直到 CTS 信号有效

### UART 接收
UART 通过触发 STARTRX 任务（即向任务寄存器 STARTRX 中写入 1）启动接收序列， UART 接收有 6 个字节的硬件 FIFO，在接收的数据被覆盖之前可以存储 6 个字节。
UART 接收的数据通过 RXD 寄存器读出，当 RXD 寄存器中的数据被读出后，FIFO 中 的数据会移动到 RXD 寄存器。
