### 基本写法
```cmake
# SPDX-License-Identifier: Apache-2.0

# 指定CMake版本
cmake_minimum_required(VERSION 3.20.0)

# 从环境变量${ZEPHYR_BASE}找到NCS中的Zephyr安装目录
# 并把整个Zephyr系统当作包来导入
find_package(Zephyr REQUIRED HINTS $ENV{ZEPHYR_BASE})

# 设定项目名称
project(hello_world)

# 把main.c添加为app目标的源码
target_sources(app PRIVATE src/main.c)
```
这里的`PRIVATE`控制的是编译的行为：
- `PRIVATE`：main.c修改后，只会重新编译app目标
- `PUBLIC`：main.c修改后，app目标要重新编译，且所有与APP目标链接的其他目标也要重新编译
## 条件添加源码
某个CMake变量值为true时，才把源码添加到目标中去
```cmake
# Include UART ASYNC API adapter
target_sources_ifdef(CONFIG_BT_NUS_UART_ASYNC_ADAPTER app PRIVATE
  src/uart_async_adapter.c
)
```
## 目录添加
 添加其他目录的 CMakeLists.txt
```cmake
|-CMakeLists.txt
|-aaa
|  |-CMakeLists.txt
|  `-main.c
`-bbb
   |-CMakeLists.txt
   `-hello.c
```
根目录的CMakeLists.txt中
```python
add_subdirectory(aaa)
add_subdirectory(bbb)
```
目录也是可以条件添加的
```cmake
add_subdirectory_ifdef(CONFIG_ADC adc)
```
## 添加include目录
```cmake
# 添加CMakeLists.txt所在目录下的inc/目录到app目标
target_include_directories(app PRIVATE inc)

# 也是可以条件添加的
zephyr_include_directories_ifdef(CONFIG_MEMFAULT configuration/memfault)
```
## 设置变量
和宏定义类似
```cmake
# 指定自己项目的device tree overlay文件（和VS Code中添加build target时，手动选择overlay是一样的）
set(DTC_OVERLAY_FILE app.oerlay)
```
