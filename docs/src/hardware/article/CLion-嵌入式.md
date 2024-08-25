---
title: CLion-嵌入式
date: 2023-02-13 19:23:43
tags:
categories:
classes: 教程
---

### 取代 keil 迁移到更高级的 IDE

CLion 有强大的代码补全、界面风格、各种插件、流畅性等众多优点

##### 基于`HAL库`开发为准



# 环境与工具

- Windows 10
- STM32CubeMX
- Clion
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

https://link.zhihu.com/?target=http%3A//gnutoolchains.com/arm-eabi/openocd/



## CLion 

在官网下载 2022 / 2023 的版本即可

然后在下面的网址找一个能用的激活码，翻翻评论之类的，输入 Clion  进行激活

https://gist.github.com/ihabhamad/3fc931475b1fcc4528ec43be6fae624e?permalink_comment_id=4620170

 

#### 在CLion 中配置 OpenOCD 与上一步下载的 STM32CubeMX

![image-20230213124855858](https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121439179.png)





## MinGW

直接下载 MSYS2 包管理器下载 mingw64 即可，之后配置时会自动检测到。如果没有检测到的话，就手动导入包管理工具安装的目录找到 mingw64 就好。

以下是安装环境的教程：

### 安装MSYS2

MSYS2 也是一个包管理软件，用来安装环境非常简单。推荐使用。

[https://www.msys2.org/](https://www.lovestu.com/wp-content/plugins/cp-link-open/link.php?a=aHR0cHM6Ly93d3cubXN5czIub3JnLw==)

进入官网，下载安装包即可。

![img](https://www.lovestu.com/wp-content/uploads/2022/09/1662985763379.webp)

安装包一路下一步即可，我是安装在D盘的。

进入：D:\msys64，启动msys2.exe。

输入`pacman -Su` 更新一下包，一路Y即可

![img](https://www.lovestu.com/wp-content/uploads/2022/09/1662985989564.webp)

第二次输入Y以后，窗口会关闭。再次打开即可。

### 安装MinGW

在msys2中输入命令

```
pacman -Sy base-devel
```

然后输入Y即可，稍等一会，即可安装完成。然后安装mingw环境。还是Y即可。

 

```
 pacman -S mingw-w64-x86_64-toolchain
```

这样，就把所有的环境给安装下来了，非常简单。

 

至此，需要的东西，全部都给安装下来了，可以愉快的玩耍C语言了。



### 配置平时C语言编译环境

和配置硬件的编译环境有区别

之前安装好了MinGW，一般就在msys64的目录下，我默认在C盘，我msys64安装在D盘，所以MinGW也在D盘。

有mingw64和mingw32，64位系统用mingw64就好，按照下图配置好构建工具和编译器就行。

![img](https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121440615.webp)

然后设置CMake，默认是Debug，如果没有，手动添加就是了。这儿是可以设置多个编译器环境的，例如使用微软的MSVC，当然了，我们只安装了MinGW，用这个就好了。

![img](https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121440539.webp)



## arm-none-eabi-gcc

下载链接：

https://developer.arm.com/downloads/-/gnu-rm

![image-20230213125939109](https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121441954.png)



##### 解压后将 bin 目录配置到系统环境目录

cmd 输入

```bash
arm-none-eabi-gcc -v
```

如果有信息输出,那就是装好了



### CLion 配置硬件开发编译环境





![image-20230812143107205](https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121441069.png)

## CLion 中创建 STM32 工程



#### 创建一个新工程







![image-20230213154707455](https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121441016.png)



#### 完成后点击create



##### 如遇以下问题（如果安装的是新版的CLion 则不会遇到）

'please install java jre xxxxxxxxx'

![image-20230213154844389](https://img.gejiba.com/images/552f4a051e8d1706032592e7a5ebd489.png)



##### 解决方式：

删除CLion 安装目录下的jbr文件夹，将新版安装目录下的jbr文件夹拷贝进来

jbr文件下载：

https://github.com/JetBrains/JetBrainsRuntime/releases/tag/jbr11_0_13b1751.25

解压后替换即可



### 点击 Open with STM32CubeMX



### 在 stm32cubemx 中的重要配置

（配置好板子之类的自己的需求后）

![image-20230213155707849](https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121444109.png)



生成的代码会分开单独的源文件和头文件，否则会全部放在main.c文件，不便于整理，降低代码可读性

![image-20230213155854761](https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121443989.png)

 



#### 配置完成后点击

![image-20230213161311788](https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121443450.png)



#### 遇到这个框点击 close

![image-20230213161401668](https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121444919.png)



#### 之后返回 CLion

这个是板子配置文件，我们先不选择，之后进行配置

![image-20230213161600221](https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121443652.png)



#### 在工程文件夹下创建 config 目录

#### config 目录下 新建命名为  stlink.cfg/daplink  的文件

##### 文件中粘贴硬件配置

前两行设置了仿真器的类型和接口，下面几行指定了**Flash大小**、**芯片类型**、**下载速度**等，如果这些参数不一样可以根据实际情况更改以下文件

如果对自己的芯片不知道怎么设置，可以参考OpenOCD自带的一系列配置文件，路径在OpenOCD安装目录的`share\openocd\scripts`下：

只需要关注这几个目录：

- **board**：板卡配置，各种官方板卡
- **interface**：仿真器类型配置，比如ST-Link、CMSIS-DAP等都在里面
- **target**：芯片类型配置，STM32F1xx、STM32L0XX等等都在里面



##### stlink

```bash
# choose st-link/j-link/dap-link etc.
#adapter driver cmsis-dap
#transport select swd
 
source [find interface/stlink.cfg]
transport select hla_swd
 
source [find target/stm32f1x.cfg]
 
# download speed = 10MHz
adapter speed 10000
```

##### daplink

```bash
# choose st-link/j-link/dap-link etc.
source [find interface/cmsis-dap.cfg]
transport select swd
# 0x10000 = 64K Flash Size
# 0x80000 = 512K Flash Size
set FLASH_SIZE 0x20000
source [find target/stm32f4x.cfg]
# download speed = 10MHz
adapter speed 10000
#reset_config none
```



### 编译 &  烧录 & 调试



![image-20230213163258711](https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121448988.png)



<img src="https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121448875.png" alt="image-20230213163437368" style="zoom:80%;" />



#### 选择配置文件

![image-20230213163609813](https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121449374.png)



#### 则配置完成



### 点击编译按钮

#### 用于烧录的 .hex 和 .bin 文件将在工程目录下生成，此步用于串口烧录

##### 目录名：

```bash
cmake-build-debug-mingw
```



### 点击上传/烧录按钮

#### 如果在上面配置了下载器，并连接好了板子，将会直接烧录



### 增加断点后可以进行调试

![image-20230213163732427](https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121449718.png)







#### 之后就可以愉快的在舒适的 IDE 中进行编码了





### 重定向 printf

新建一个`retarget.h`文件内容如下：

```c
#ifndef _RETARGET_H__
#define _RETARGET_H__

#include "stm32f1xx_hal.h"
#include <sys/stat.h>
#include <stdio.h>

void RetargetInit(UART_HandleTypeDef *huart);

int _isatty(int fd);

int _write(int fd, char *ptr, int len);

int _close(int fd);

int _lseek(int fd, int ptr, int dir);

int _read(int fd, char *ptr, int len);

int _fstat(int fd, struct stat *st);

#endif //#ifndef _RETARGET_H__
```



再新建一个`retarget.c`文件内容如下：

```c
#include <_ansi.h>
#include <_syslist.h>
#include <errno.h>
#include <sys/time.h>
#include <sys/times.h>
#include <retarget.h>
#include <stdint.h>

#if !defined(OS_USE_SEMIHOSTING)

#define STDIN_FILENO  0
#define STDOUT_FILENO 1
#define STDERR_FILENO 2

UART_HandleTypeDef *gHuart;

void RetargetInit(UART_HandleTypeDef *huart) {
    gHuart = huart;

    /* Disable I/O buffering for STDOUT stream, so that
     * chars are sent out as soon as they are printed. */
    setvbuf(stdout, NULL, _IONBF, 0);
}

int _isatty(int fd) {
    if (fd >= STDIN_FILENO && fd <= STDERR_FILENO)
        return 1;

    errno = EBADF;
    return 0;
}

int _write(int fd, char *ptr, int len) {
    HAL_StatusTypeDef hstatus;

    if (fd == STDOUT_FILENO || fd == STDERR_FILENO) {
        hstatus = HAL_UART_Transmit(gHuart, (uint8_t *) ptr, len, HAL_MAX_DELAY);
        if (hstatus == HAL_OK)
            return len;
        else
            return EIO;
    }
    errno = EBADF;
    return -1;
}

int _close(int fd) {
    if (fd >= STDIN_FILENO && fd <= STDERR_FILENO)
        return 0;

    errno = EBADF;
    return -1;
}

int _lseek(int fd, int ptr, int dir) {
    (void) fd;
    (void) ptr;
    (void) dir;

    errno = EBADF;
    return -1;
}

int _read(int fd, char *ptr, int len) {
    HAL_StatusTypeDef hstatus;

    if (fd == STDIN_FILENO) {
        hstatus = HAL_UART_Receive(gHuart, (uint8_t *) ptr, 1, HAL_MAX_DELAY);
        if (hstatus == HAL_OK)
            return 1;
        else
            return EIO;
    }
    errno = EBADF;
    return -1;
}

int _fstat(int fd, struct stat *st) {
    if (fd >= STDIN_FILENO && fd <= STDERR_FILENO) {
        st->st_mode = S_IFCHR;
        return 0;
    }

    errno = EBADF;
    return 0;
}

#endif //#if !defined(OS_USE_SEMIHOSTING)
```



添加这两个文件到工程，更新CMake

打开 cmakeLists.txt

![image-20230812135626077](https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121358943.png)

没有路径就添加后更新cmake，已有的话就直接更新

![image-20230812135841389](https://picr.oss-cn-qingdao.aliyuncs.com/img/202308121358618.png)



编译之后会发现几个系统函数重复定义了，被重复定义的函数位于`Src`目录的`syscalls.c`文件中，我们把里面重复的几个函数删掉即可



在main函数的初始化代码中添加对头文件的引用并注册重定向的串口号：

```text
#include "retarget.h"

RetargetInit(&huart1);
```



上面的修改完成之后可能会发现无法正常读取浮点数

可以修改CMakeList.txt，加入下述编译选项

```text
set(COMMON_FLAGS "-specs=nosys.specs -specs=nano.specs -u _printf_float -u _scanf_float")
```
