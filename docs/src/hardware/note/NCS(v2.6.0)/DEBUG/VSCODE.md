在生成配置菜单的“优化级别”下，选择“优化调试”选项。此选项在生成应用程序后启用其他特定于扩展的调试功能。
`CONFIG_DEBUG_OPTIMIZATIONS` – 将编译器完成的优化限制为仅影响调试的优化。
`CONFIG_DEBUG_THREAD_INFO` – 向线程对象添加其他信息，以便调试器可以发现线程。
可能有用的其他 Kconfig：
`CONFIG_I2C_DUMP_MESSAGES` – 允许记录所有 I2C 消息
`CONFIG_ASSERT` – 这将启用内核代码中的 `__ASSERT()` 宏。如果断言失败，则执行操作的策略由 `assert_post_action()` 函数的实现控制，默认情况下，该函数将触发致命错误。
## Monitor mode debugging 监视模式调试
在停止模式下，调试器在发生调试请求时停止 CPU，而在监视模式下，调试器允许 CPU 调试应用程序的各个部分，同时继续执行关键功能。监控模式对于时序关键型应用（如低功耗蓝牙或PWM）非常有用，在这些应用中，停止整个应用将影响时序关键方面。CPU 接受调试中断，运行 J-Link 通信和用户定义功能的监控代码。Logpoint 可以与监视模式一起使用，以提供调试信息，而不会使应用程序崩溃。
要为应用程序启用监视模式，需要执行
1. pri.conf ->`CONFIG_CORTEX_M_DEBUG_MONITOR_HOOK` and `CONFIG_SEGGER_DEBUGMON`.
2. 为正在使用的调试器启用监视模式。对于 nRF Connect for VS Code 扩展中的 nRF Debug，在调试控制台中输入 `-exec monitor exec SetMonModeDebug=1` 以启用监视模式。
