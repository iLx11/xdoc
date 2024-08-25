### 在工程里创建 Kconfig 文件
```c
menu "Application"
# 要添加的子目录
rsource "src/xxx/Kconfig"

endmenu

menu "Zephyr Kernel"
source "Kconfig.zephyr"
endmenu
```
### 在相应模块处 (src/xxx) 创建 CMakeLists.txt
```CMakeLists
target_sources_ifdef(CONFIG_GPIO_MONITOR app PRIVATE gpio_monitor.c)
```
### 以及 Kconfig
```c
config GPIO_MONITOR
	bool "Enable GPIO MONITOR"
```
#### 模块中
```c
#if CONFIG_GPIO_MONITOR
#endif
```
### 最外层 CMakeLists.txt
```c
# zephyr_include_directories(src)

target_include_directories(app PRIVATE src/xxx)

target_sources(app PRIVATE src/main.c src/xxx/xxx.c)

add_subdirectory(src/xxx)
```