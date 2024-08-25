线程是可运行代码的基本单元。绝大多数固件代码都将在线程中运行，无论是用户定义的线程、RTOS 创建的线程（例如，系统工作队列线程）、RTOS 子系统创建的线程（例如记录器模块），还是库创建的线程（例如，AT Monitor 库）。
**线程包含以下项目：**
- **线程控制块**：
	`k_thread.` 这是类型 对于每个线程，RTOS 中都有一个线程控制块的实例，用于跟踪线程的信息，特别是其元数据。
- **堆栈**：
	每个线程都有自己的堆栈。堆栈区域的大小必须设置为与线程的特定处理要求保持一致。
- **入口点函数**：
	这是线程的主体，或者换句话说，是线程实现的功能。它通常包含一个无限循环，因为退出入口点将终止线程。入口点函数可以有三个可选的参数值，可以在启动时传递给它。
- **线程优先级**：
	优先级只是一个有符号的整数，用于控制线程的“类型”。它指示调度程序如何为线程分配 CPU 时间。
- **可选线程选项**：
	通过使用此可选字段，可以使线程在特定情况下接受特殊处理。
- **可选的启动延迟**：
	可以通过传递 K_NO_WAIT 来指示内核立即将创建的线程放入就绪线程队列（就绪队列）中，这只是启动延迟为 0。或者我们可以指定一个可选的启动延迟。
线程是使用 `K_THREAD_DEFINE()` 宏或 `k_thread_create()` 函数创建。在这两种情况下，都需要静态分配堆栈（从 V3.4.0 开始，Zephyr RTOS 不支持动态线程）。 
- `K_THREAD_DEFINE()` 宏本身管理堆栈分配，所需的堆栈大小将作为参数传递给宏。
- 如果使用 `k_thread_create()` 函数，则必须提前使用 `K_THREAD_STACK_DEFINE()` 宏分配堆栈。
在创建线程时，您可以立即启动它，也可以在指定某个延迟后启动它。线程启动后，它将被放置在就绪线程的队列（就绪队列）中。
还可以选择创建延迟设置为 K_FOREVER 的线程，这实际上使线程处于非活动状态。需要调用 `k_thread_start()` 激活，这会将线程添加到就绪线程队列中。
**如果调度程序选取线程进行执行，则其状态将转换为 Running。**
**线程更改为“未就绪”状态，这意味着它具有“休眠”、“挂起”或“正在等待”状态。**
- Sleeping：线程通过调用 `k_sleep()` 或其衍生物决定休眠一段时间。
- Suspended：另一个线程通过调用 `k_thread_suspend()` 来挂起线程。
- Waiting：线程等待不可用的内核对象（例如，互斥锁或信号量）。
**线程会自行结束或被调度程序抢占。**
- 线程通过调用 `k_yield()` 放弃 CPU 并将自身置于就绪队列的末尾来自行结束。
- 当就绪队列中有更高优先级的线程时，调度程序会在重新调度点抢占该线程。当被抢占时，线程将放置在就绪队列的末尾。
**Terminate or abort 终止或中止**
- 当线程的入口函数退出时，就会发生终止。在线程定义了非重复任务并完成这些任务的少数情况下会出现这种情况。
- 如果线程遇到致命的错误条件，如取消引用空指针，RTOS 就会自动中止线程。或者，线程可以被其他线程故意中止，也可以使用 `k_thread_abort()` 函数自行中止。