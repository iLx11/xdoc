# 使用 VSCode 开发嵌入式

因为是开源的，所以不用寻找激活码或者破解，非常方便、高效，还可以同时配置 esp32 开发环境，或者开发纯软件

# 环境与工具

- Windows 10
- STM32CubeMX
- vscode 
- MinGW
- OpenOCD
- arm-none-eabi-gcc

## STM32CubeMX

下载最新版即可

下载链接：

https://www.st.com/en/development-tools/stm32cubemx.html#get-software

## OpenOCD

OpenOCD是用于对STM32进行下载仿真的工具，是一个开源软件包，解压到某个目录，后面会在Clion中链接这个目录

下载地址：

[https://link.zhihu.com/?target=http%3A//gnutoolchains.com/arm-eabi/openocd/](https://link.zhihu.com/?target=http://gnutoolchains.com/arm-eabi/openocd/)

下载完成之后将 bin 目录添加到系统环境变量中

右键 "此电脑" -》 "属性" -》找到 "高级系统设置" -》 "环境变量" -》"系统变量" -》"path"双击 -》"新建"

## vscode

下载地址：

https://code.visualstudio.com/Download

同样把 vscode 的安装 bin 目录添加到系统环境变量中

## MinGW

具体参考我的另一篇文章，"CLion 嵌入式"

下载完成之后将`mingw64/bin` 目录添加到系统环境变量中

## arm-none-eabi-gcc

下载链接：

https://developer.arm.com/downloads/-/gnu-rm

解压后将 bin目录添加到系统环境变量中

## 所有环境配置完成之后

打开 cmd 依次输入，如果都有信息输出则为配置成功

```shell
mingw32-make -v
arm-none-eabi-gcc -v
openocd -v
```



# 创建工程

打开 cubeMX 配置好板子之后

工程管理`Toolchain/IDE` 选择 Makefile 就可以

![image-20240228230322221](https://picr.oss-cn-qingdao.aliyuncs.com/img/202402282303760.png)

在生成的工程文件夹中，打开终端 cmd ，输入

```shell
code .
```

表示用 vscode 打开，如果报错说明 vscode 没有正确添加到系统目录中，也可以拖动打开

在终端中输入，就可以对工程进行编译

```bash
mingw32-make
```

如果没有问题会显示下面的输出，并在工程文件夹中生成 `build` 目录

以及 `elf` 、`hex\bin` 文件

其中：

- `text`：程序占用的 FLASH 空间大小（不包括初始化数据）。
- `data`：初始化的全局变量和静态变量占用的 RAM 大小。
- `bss`：未初始化的全局变量和静态变量占用的 RAM 大小。
- `dec` 和 `hex`：是内存使用的十进制和十六进制表示。

![image-20240228230742853](https://picr.oss-cn-qingdao.aliyuncs.com/img/202402282307284.png)

如果要配置比较直观的输出，类似：

```bash
Memory region         Used Size  Region Size  %age Used
             RAM:       25128 B        64 KB     38.34%
           FLASH:       69044 B       512 KB     13.17%
```

需要修改一下 `Makefile` 文件

```makefile
# before: 
$(BUILD_DIR)/$(TARGET).elf: $(OBJECTS) Makefile
	$(CC) $(OBJECTS) $(LDFLAGS) -o $@
	$(SZ) $@

# after
$(BUILD_DIR)/$(TARGET).elf: $(OBJECTS) Makefile
	$(CC) $(OBJECTS) $(LDFLAGS) -o $@
	$(SZ) $@
	@$(MAKE) memory_usage
```

然后在文件末尾，`dependencies` 上面增加

```makefile
#######################################
# Show memory usage
#######################################
# 根据自己的芯片修改数据
FLASH_SIZE = 524288  # 512KB
RAM_SIZE = 65536     # 64KB

memory_usage:
	@$(SZ) $(BUILD_DIR)/$(TARGET).elf | awk 'NR==2 { \
	flash_used = $$1 + $$2; \
	ram_used = $$3; \
	flash_percent = flash_used / $(FLASH_SIZE) * 100; \
	ram_percent = ram_used / $(RAM_SIZE) * 100; \
	printf "\nMemory region         Used Size  Region Size  %%age Used\n"; \
	printf "             RAM: %10d B  %10d KB  %8.2f%%\n", ram_used, $(RAM_SIZE) / 1024, ram_percent; \
	printf "           FLASH: %10d B  %10d KB  %8.2f%%\n", flash_used, $(FLASH_SIZE) / 1024, flash_percent; \
	}'

# 上面为增加内容
#######################################
# dependencies
#######################################
-include $(wildcard $(BUILD_DIR)/*.d)

# *** EOF ***
```

### 如果报这个错误：

```bash
 'awk' 不是内部或外部命令，也不是可运行的程序 或批处理文件。 mingw32-make[1]: *** [Makefile:204: memory_usage] Error 255 mingw32-make[1]: Leaving directory 'xxxxxx' mingw32-make: *** [Makefile:180: build/bootloader.elf] Error 2
```

#### 1. 打开 MSYS 终端

打开 MSYS 或 MinGW 的终端窗口。

#### 2. 使用 `pacman` 命令安装 Gawk

在 MSYS 中，你可以使用包管理器 `pacman` 来安装 Gawk。运行以下命令：

```bash
pacman -S gawk
```

这个命令会自动下载并安装 Gawk 工具。

#### 3. 验证安装

安装完成后，运行以下命令来确认 Gawk 是否已成功安装：

```
gawk --version
```

如果显示 Gawk 的版本信息，则表示安装成功。

#### 4. 设置系统环境变量（可选）

如果你想从 Windows 命令行或其他环境中使用 Gawk，可以将 MSYS 的安装路径添加到 Windows 系统的 `PATH` 环境变量中。

如果不行则添加下面的路径到系统变量

```bash
xxxx\MSYS2\usr\bin
```



## 下载到硬件

### 如果是 DapLink

```shell
openocd -f interface/cmsis-dap.cfg -f target/stm32f1x.cfg -c "program build/<工程名>.elf verify reset exit"
```

### 如果是 ST-Link

```shell
openocd -f interface/stlink.cfg -f target/stm32f1x.cfg -c "program build/<工程名>.elf verify reset exit"
```

其中 `stm32f1x.cfg` 可以在 openocd 安装目录 `share/openocd/scripts/target`，中找到适合自己的板子进行更换

`<工程名>` 表示需要替换成自己的工程名

## 配置任务

如果是输入命令行的方式编译和下载非常的不方便，所以需要在 vscode 中创建任务，我们只执行任务就可以了

点击终端->配置任务->创建 / 打开 task.json

##### 以后的开发只需要把这个文件复制到 `.vscode`目录下就可以

```json
{
  // See https://go.microsoft.com/fwlink/?LinkId=733558
  // for the documentation about the tasks.json format
  "version": "2.0.0",
  "tasks": [
    {
      "label": "download",
      "type": "shell",
      "command": "openocd",
      "args": [
        "-f",
        "interface/stlink.cfg",
        "-f",
        "target/stm32f1x.cfg",
        "-c",
        "program build/test.elf verify reset exit"
      ],
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": true,
        "panel": "shared",
        "showReuseMessage": false,
        "clear": false
      },
      "problemMatcher": []
    },
    {
      "label": "build",
      "type": "shell",
      "command": "mingw32-make",
      "args": [
        "-j8"
      ],
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": true,
        "panel": "shared",
        "showReuseMessage": false,
        "clear": false
      },
      "group": {
        "kind": "build",
        "isDefault": true
      }
    },
    {
      "label": "clean",
      "type": "shell",
      "command": "make",
      "args": [
        "clean"
      ],
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": true,
        "panel": "shared",
        "showReuseMessage": false,
        "clear": false
      }
    },
    {
      "label": "rebuild",
      "type": "shell",
      "dependsOrder": "sequence",
      "dependsOn": [
        "clean",
        "build"
      ]
    }
  ]
}
```

#### 熟悉的命令行就变成配置内容，并且填写在这个文件中了，然后可以找到对应位置修改

### 运行任务时：

`点击终端(Terminal) -> 运行任务(Run Task) -> build / download`

编译可以使用快捷键

```js
ctrl + shift + b
```



## 调试程序

编译和下载完成之后就可以进一步调试了

#### 点击左边工具栏有虫子的图标 -》运行和调试 -》 创建launch.json文件 -》选择cortex-debug

默认会创建一个jlink的配置

### 替换为

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Cortex Debug",
            "cwd": "${workspaceFolder}",
            "svdFile": "STM32F103.svd",
            "executable": "build/<工程名>.elf",
            "configFiles": [
                "interface/stlink.cfg",
                "target/stm32f1x.cfg",
            ],
            "request": "launch",
            "type": "cortex-debug",
            "runToEntryPoint": "main",
            "servertype": "openocd",
            "liveWatch": {
                "enabled": true,
                "samplesPerSecond": 1
            }
        }
    ]
}
```

### 按下 F5 进入调试

## printf 重定向

### 使串口支持 printf 和 fprintf（可选）

在makefile的145行左右，添加以下代码

```c
-u_printf_float -u_fprintf_float 
```

重写函数

```c
//printf的重定向
//1、使用printf一定要加\n
//2、使用时 包含stdio.h
//3、makefile 145h 加-u_printf_float以支持输出浮点数 printf输出到设备
//4、makefile 145h 加-u_fprintf_float以支持fprontf输出浮点数 fprintf输出到文件
#ifdef __GNUC__
	#define PUTCHAR_PROTOTYPE int __io_putchar(int ch)
#else
	#define PUTCHAR_PROTOTYPE int fputc(int ch, FILE *f)
#endif
PUTCHAR_PROTOTYPE
{
  uint8_t temp[1]={ch};
  HAL_UART_Transmit(&huart1,temp,1,0xffff);//要提前配置huart1，PA9_TX PA10_RX
  return ch;
}
int _write(int file, char *ptr, int len)
{
  int DataIdx;
  for (DataIdx=0;DataIdx<len;DataIdx++)
  {
    __io_putchar(*ptr++);
  }
  return len;
}
```

### 使用时

```c
printf("hello world \n");
```

