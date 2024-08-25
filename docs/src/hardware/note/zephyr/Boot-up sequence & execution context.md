# Boot-up sequence & execution context  
启动顺序和执行上下文
为了实现应用程序代码的任务，需要选择适当的执行原语（抢占式线程、协作线程、工作队列等），并正确设置其优先级，以免阻塞 CPU 上运行的其他任务，同时满足任务的时间要求。
## Kernel Initialization 
内核初始化
此阶段显示初始化所有已启用静态设备状态的过程。某些器件由 RTOS 开箱即用地启用，而其他器件则由应用程序配置文件 （ `prj.conf` ） 和电路板配置文件启用。这些设备包括使用Zephyr API 以静态方式定义的设备驱动程序和系统驱动程序对象。
初始化顺序通过将它们分配给特定的运行级别（例如， `PRE_KERNEL_1` 、 `PRE_KERNEL_2` ）来控制，并且使用优先级进一步定义它们在同一运行级别中的初始化顺序。在此阶段，调度程序和内核服务尚不可用，因此此阶段的这些初始化功能不依赖于任何内核服务。
**在所有 nRF Connect SDK 应用程序 `PRE_KERNEL_1` 中默认初始化的内容**
- 时钟控制驱动程序：
	这启用对硬件时钟控制器的支持。硬件可以为其他子系统提供时钟，因此也可以通过控制其时钟来提高电源效率。
- 串行驱动程序：
	这可以是 UART（E）、RTT 或其他传输。它用于发送调试输出，例如启动。仅当启用调试选项时，才会初始化此选项。
**所有 nRF Connect SDK 应用程序 `PRE_KERNEL_2` 中默认初始化的内容**
- 系统定时器驱动程序：
	这通常是 Nordic SoC 和 SiP（nRF91、nRF53、nRF52 系列）上的实时计数器外设 （RTC1）。系统计时器将用于内核的计时服务，例如 `k_sleep()` 内核计时器 API。
### **Multithreading Preparation**  
多线程准备
这是初始化多线程功能（包括调度程序）的地方。RTOS 还将创建两个线程（系统线程）：RTOS 主线程，以及在没有其他线程准备好时负责调用 SiP 和 SoC 电源管理系统的空闲线程。
在此阶段，将启动 `POST_KERNEL` 服务（如果存在）。启动 `POST_KERNEL` 服务后，将打印 Zephyr 启动横幅：
之后，将初始化 `APPLICATION` 级别服务（如果存在）。然后，启动所有应用程序定义的静态线程（使用 `K_THREAD_DEFINE()` ）。
**在所有 nRF Connect SDK 应用程序 `POST_KERNEL` 中默认初始化的内容**
这是许多库、RTOS 子系统和服务初始化的地方。这些库在配置过程中需要内核服务，因此这就是为什么它们在内核服务可用的 `POST_KERNEL` 级别中启动的原因。
默认情况下，RTOS 不会在此处初始化任何内容。但是，如果启用了许多库、RTOS 子系统和服务，它们会在此处初始化。例如，如果在延迟模式下启用了日志记录器 （ `CONFIG_LOG` ），则将启动记录器模块，并创建记录器专用线程（用于延迟模式）。此外，如果使用低功耗蓝牙 （ `CONFIG_BT` ），则这是初始化蓝牙堆栈以及创建 RX 和 TX 线程的位置。同样，如果使用系统工作队列，则这是初始化系统工作队列线程的位置。
**在所有 nRF Connect SDK 应用程序 `APPLICATION` 中默认初始化的内容**
默认情况下，如果启用某些库，则会在此处启动它们。例如在 nRF91 系列上进行开发，使用 AT 监视器库 （ `AT_MONITOR` ），则这里是初始化该库的位置。
## Thread context vs interrupt context  
线程上下文与中断上下文
### Thread context
线程上下文
- 执行上下文：线程上下文是指应用程序和系统线程运行的正常执行环境。  
- 触发事件：线程由应用程序或 RTOS 创建，并由调度程序使用定义的规则（类型和优先级）进行调度。  
- 抢占：线程上下文可以被中断或更高优先级的线程抢占。
- 持续时间：与中断上下文相比，线程可以执行更长的时间并执行更复杂的操作。
#### **Allowed Operations**: 
允许的操作：
> - Access to the full range of kernel services and OS services.  
    访问全方位的内核服务和操作系统服务。
> - Executing time-consuming operations.  
    执行耗时的操作。
> - Waiting on synchronization primitives like mutexes, semaphores, or event flags.  
>     等待同步基元，如互斥锁、信号量或事件标志。
> - Performing blocking I/O operations.  
    执行阻塞 I/O 操作。
    
#### **Not Allowed Operations: **
不允许的操作
> - Accessing hardware registers directly without proper synchronization or abstraction.  
    直接访问硬件寄存器，无需适当的同步或抽象。
> - Running time-critical operations.  
    运行时间关键型操作。

### Interrupt context 
中断上下文
- 执行上下文：中断上下文是指中断处理程序运行时的执行环境。  
- 触发事件：中断可能随时完全异步发生，并由硬件事件触发，例如计时器、外部信号或设备 I/O。  
- 抢占：中断上下文抢占当前正在运行的线程上下文。  
- 持续时间：中断处理程序应快速执行，以最大程度地减少处理中断的延迟，并且不会阻止系统线程和通信堆栈线程的执行。  
- 中断嵌套：Zephyr 允许嵌套中断，这意味着中断处理程序可以被另一个更高优先级的中断中断。
#### **Allowed Operations: ：**
允许的操作
> - Executing time-critical operations.  
>     执行时间关键型操作。
> - Access to a restricted set of kernel services.  
>     访问一组受限的内核服务。

#### **Not Allowed Operations: ：**
不允许的操作
> - Blocking operations. 阻塞操作。
> - Using most of the kernel services meant for thread context (for example, sleeping or waiting on synchronization primitives, acquiring a mutex or a semaphore that is potentially blocking).  
> 使用大多数用于线程上下文的内核服务（例如，休眠或等待同步原语，获取可能阻塞的互斥锁或信号量）。

