# 学习资源：
### 国外教程：
https://academy.nordicsemi.com/courses/nrf-connect-sdk-fundamentals/
### 国内博客：
https://www.cnblogs.com/jayant97/articles/17794804.html
# 官方文档：
## 旧版文档：
nRF Connect SDK
https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/index.html
Zephyr Project
https://developer.nordicsemi.com/nRF_Connect_SDK/doc/2.6.0/zephyr/index.html
Kconfig
https://developer.nordicsemi.com/nRF_Connect_SDK/doc/2.6.0/kconfig/index.html
## 新版文档：
https://developer.nordicsemi.com/nRF_Connect_SDK/doc/2.5.0/nrf/index.html
### nRF Connect SDK:
https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/index.html
### **Zephyr Project**
https://docs.nordicsemi.com/bundle/ncs-latest/page/zephyr/index.html
## API :
### Devicetree API:
https://developer.nordicsemi.com/nRF_Connect_SDK/doc/latest/zephyr/doxygen/html/group__devicetree.html
### Hardware API
https://docs.nordicsemi.com/bundle/ncs-latest/page/zephyr/develop/api/overview.html
https://docs.nordicsemi.com/bundle/ncs-latest/page/zephyr/hardware/peripherals/index.html
### SoftDevice 
https://docs.nordicsemi.com/bundle/s112_api/page/modules.html

## Samples:
https://docs.nordicsemi.com/bundle/ncs-latest/page/zephyr/samples/index.html
## Kconfig
https://docs.nordicsemi.com/bundle/ncs-latest/page/kconfig/index.html
## 规格书
https://docs.nordicsemi.com/bundle/nRF52832_PS_v1.9/resource/nRF52832_PS_v1.9.pdf
`${NCS}/zephyr/tests`：zephyr所有的API的测试用例。如果不知道某个Zephyr API怎么用，可以从这里面找。
## 环境搭建与 DeviceTree 基础请查看上述国内博客
### 命令行编译
按 " CTRL + ` "，可以呼出终端。点击“+”号右边的下拉箭头，选择nRF Connect：
这样打开的终端，其环境变量指向前面安装的toolchain
```bash
# 利用当前已经创建的build target进行编译
west build
```
更多用法：
```bash
west build -h
```
编译时可以指定项目根目录、build目录、板子名称、配置文件、overlay文件等。你可以先用上面的图形化的方式在VS Code中进行编译，然后在VS Code终端中查看这次编译的命令是什么。
### 命令行烧录
```bash
west flash
```
这样直接烧录，有一部分项目可能会烧写失败，显示：
```bash
-west flash:using runner nrfjprog
FATAL ERRoR:The hex file contains data placed in the UIcR,which needs a fullerase before reprogramming.Run west
flash again with --force, --erase, or --recover
```
这是因为，Nordic的MCU中通常都有一个用于存储用户信息的寄存器（UICR），可以认为是一块特殊的flash区域，存储了客户自己的加密密钥、引脚配置等产品信息。由于信息安全的原因，是不允许在保持UICR不变的情况下烧写新的固件的。相关资料，可以参考Nordic芯片数据手册的UICR章节。
这种情况下只能全片擦除然后再烧录
```bash
west flash --force --erase
```
此外，还有一种可能是，调试接口启用了保护，需要recover这颗芯片来解除保护。
通常，右下角会有弹窗来问你是否要recover，就选择Yes就好。
如果没有效果，也可以用命令行来recover
```bash
nrfjprog --recover
```
如果是nRF5340这种双核芯片，那么网络核也要recover
```bash
nrfjprog --recover --coprocessor CP_NETWORK
```


蓝牙广播参数设置  
1. 通过指定的库函数修改广播参数，广播内容；并通过工具 app 进行验证  
2. 学习和掌握 SDK 中指定广播库函数的 api 以及数据填充，广播参数修改方法  
3. 学习如何更新广播数据  
4. 深入理解库函数-协议栈的调用逻辑，层级关系以及协议栈的使用限制，并针对调用逻辑，层级关系以及协议栈相关接口的使用给出学习报告