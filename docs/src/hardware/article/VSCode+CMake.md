# 环境与工具

- Windows 10
- STM32CubeMX
- vscode 
- MinGW
  - cmake
  - make

- OpenOCD
- arm-none-eabi-gcc

## STM32CubeMX

下载最新版即可

下载链接：

https://www.st.com/en/development-tools/stm32cubemx.html#get-software

## OpenOCD

OpenOCD是用于对STM32进行下载仿真的工具，是一个开源软件包，解压到某个目录

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

#### 打开 MSYS 终端

打开 MSYS 或 MinGW 的

下载 

- cmake
- make

终端窗口中输入

```bash
pacman -S make cmake
```

添加此目录到 path

```bash
xxx\MSYS2\usr\bin
```

然后输入命令验证一下

```bash
make --version
cmake --version
```



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

## vscode 插件

- c/c++

# 创建工程

打开 cubeMX 配置好板子之后

工程管理`Toolchain/IDE` 选择 cmake 就可以，cubeMX 版本须在 6.13.x 或以上



## 生成 bin 和 hex 文件

在工程目录下的 `CMakeLists.txt`  文件最后添加

```cmake
# 获取目标 ELF 文件
set(TARGET_ELF ${CMAKE_PROJECT_NAME}.elf)

# 生成 bin 文件
add_custom_command(
    TARGET ${CMAKE_PROJECT_NAME}
    POST_BUILD
    COMMAND ${CMAKE_OBJCOPY} -O binary ${TARGET_ELF} ${CMAKE_PROJECT_NAME}.bin
    COMMENT "Generating ${CMAKE_PROJECT_NAME}.bin"
)

# 生成 hex 文件
add_custom_command(
    TARGET ${CMAKE_PROJECT_NAME}
    POST_BUILD
    COMMAND ${CMAKE_OBJCOPY} -O ihex ${TARGET_ELF} ${CMAKE_PROJECT_NAME}.hex
    COMMENT "Generating ${CMAKE_PROJECT_NAME}.hex"
)
```



## 编译流程

创建 `build` 目录，然后进目录执行编译

```bash
# 1
mkdir build
# 2
cd build
# 3
# 会找上一级的 CMakeLists.txt 生成 makefile 文件
cmake ..
# 4 指定线程数进行编译
make -j8
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

## 解决代码中红色下划线

 点开 `main.c` 文件，然后点击右下角的 `Win32` ，选择 `Edit configurations (JSON)`

然后修改下面高亮部分

**第一部分**

在 `cmake\stm32cubemx\CMakeLists.txt` 文件中复制定义内容

**第二部分**

找到安装的 `gcc-arm-none-eabi` 的目录，复制 `arm-none-eabi-gcc.exe` 的路径

```json
{
    "configurations": [
        {
            "name": "TEST",
            "includePath": [
                "${workspaceFolder}/**"
            ],
            "defines": [
                "_DEBUG",
                "UNICODE",
                "_UNICODE",
                "USE_HAL_DRIVER",  // [!code highlight:2]
	            "STM32F103xE"
            ],
            "compilerPath": "D:\\RA\\CODE\\gcc-arm-none-eabi-10.3-2021.10\\bin\\arm-none-eabi-gcc.exe", // [!code highlight]
            "cStandard": "c17",
            "cppStandard": "gnu++17",
            "intelliSenseMode": "windows-gcc-x64"
        }
    ],
    "version": 4
}
```

  

## 配置任务

如果是输入命令行的方式编译和下载非常的不方便，所以需要在 vscode 中创建任务，我们只执行任务就可以了

点击终端->配置任务->创建 / 打开 task.json

会生成文件在 `.vscode/task.json` 

##### 以后的开发只需要把这个文件内容复制到 `.vscode`目录下就可以

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
        // 调整烧录工具配置文件
        "interface/stlink.cfg", // [!code highlight]
        "-f",
        // 调整板子配置文件
        "target/stm32f1x.cfg", // [!code highlight]
        "-c",
        // 这里需要更改工程名
        "program build/test.elf verify reset exit" // [!code highlight]
      ],
      "presentation": {
        "panel": "shared",
        "showReuseMessage": false,
        "clear": false
      },
      // 添加到快捷键运行
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": [],
      // 烧录前运行编译任务
      "dependsOn": [
        "build"
      ]
    },
    {
      "label": "build",
      "type": "shell",
      // 可以调整编译命令
      "command": "mkdir -p build && cd build && cmake .. && make -j8", // [!code highlight]
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": [
        "$gcc"
      ],
      "detail": "This task creates a build directory, runs CMake to generate Makefiles, and compiles the project."
    }
  ]
}

```

#### 熟悉的命令行就变成配置内容，并且填写在这个文件中了，然后可以找到对应位置修改

### 运行任务时：

`点击终端(Terminal) -> 运行任务(Run Task) -> build / download`

可以使用快捷键，选择烧录并编译或只编译

```js
ctrl + shift + b
```

## 调试程序

编译和下载完成之后，有需求可以进一步调试

**下载 `cortex-debug` 插件**

#### 点击左边工具栏有虫子的图标 -> 运行和调试 -> 创建launch.json文件 -> 选择 cortex-debug

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

### 串口重定向与其他文章相同
