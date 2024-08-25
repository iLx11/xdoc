### LOG
```c  
CONFIG_LOG=y                 # 启用日志系统
CONFIG_USE_SEGGER_RTT=y      # 启用RTT
CONFIG_LOG_BACKEND_RTT=y     # 日志后端选用RTT
CONFIG_LOG_BACKEND_UART=n    # 日志后端不选用串口
CONFIG_LOG_PRINTK=n          # 不启用PRINTK日志
```
### 常用的日志函数和宏
1. **`LOG_INF`, `LOG_WRN`, `LOG_ERR`**：
    - 这些宏用于记录信息、警告和错误级别的日志消息。消息级别越高，代表的情况越严重。
2. **`LOG_DBG`**：
    - 这个宏用于记录调试级别的日志消息。这些消息通常用于详细跟踪代码的执行路径。
3. **`LOG_HEXDUMP_INF`, `LOG_HEXDUMP_WRN`, `LOG_HEXDUMP_ERR`, `LOG_HEXDUMP_DBG`**：
    - 这些宏用于记录十六进制数据的日志消息，通常用于记录数据包或者内存区域的内容。
4. **`LOG_MODULE_REGISTER`**：
    - 这个宏用于在模块中注册日志模块名称。注册日志模块后，可以使用 `LOG_<LEVEL>` 记录相应模块的日志消息。
### 配置日志
要使用 Zephyr 的日志功能，您需要确保在项目的配置文件（例如 `prj.conf`）中启用了日志功能。具体配置项包括：
- **`CONFIG_LOG`**：启用日志功能。
- **`CONFIG_LOG_MINIMAL`**：启用最小日志功能。如果您只需要基本的日志功能，可以将此选项设置为 "y"。
- **`CONFIG_LOG_DEFAULT_LEVEL`**：设置默认的日志级别。只有大于或等于此级别的日志消息才会被记录。
例如，在配置文件中可以这样配置：
```c
CONFIG_LOG=y
CONFIG_LOG_MINIMAL=y
CONFIG_LOG_DEFAULT_LEVEL=3
```

### 使用方式
1. 在代码中包含头文件：
```c
#include <zephyr/logging/log.h>
```
2. 在需要记录日志的地方使用相应的日志宏：
```c
LOG_INF("This is an information message");
LOG_WRN("This is a warning message");
LOG_ERR("This is an error message");
LOG_DBG("This is a debug message");

const u8_t data[] = {0x01, 0x02, 0x03};
LOG_HEXDUMP_INF(data, sizeof(data), "Hexdump of data");

```
### 日志输出
Zephyr 默认将日志消息输出到串口控制台，但也可以配置输出到其他目标，例如文件或者网络。配置方式包括修改 `prj.conf` 文件中的相关选项或者通过 Shell 命令行进行配置。