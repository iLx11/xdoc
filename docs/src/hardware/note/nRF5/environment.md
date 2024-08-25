### Visual Studio Code

https://code.visualstudio.com/download

### GNU Tools Arm Embedded
arm 交叉编译器
https://developer.arm.com/downloads/-/gnu-rm

### SDK

https://www.nordicsemi.com/Products/Development-software/nrf5-sdk/download#infotabs

#### SDK 介绍

https://devzone.nordicsemi.com/guides/short-range-guides/b/getting-started/posts/introduction-to-nordic-nrf5-sdk-and-softdevice

### nRF Command Line Tools

用于对 nRF51, nRF52, nRF53 和 nRF91 系列芯片进行开发、编程和调试的工具。

https://www.nordicsemi.com/Products/Development-tools/nrf-command-line-tools/download#infotabs

安装过程中，不要去更改默认选项，直接按照默认选项去安装即可。 在安装完成后，可以打开命令行，键入如下命令，可以看到对 nrfjprog 和 mergehex 的相关使用说明

```bash
 nrfjprog --help 
 or mergehex --help
```

## 编译 & 烧录

解压 SDK 并编辑打开

```
GNU_INSTALL_ROOT := C:/Program Files (x86)/GNU Arm Embedded Toolchain/10
2021.10/bin/
GNU_VERSION := 10.3.1
GNU_PREFIX := arm-none-eabi
```

GNU_INSTALL_ROOT 将当前电脑交叉编译环境中的路径填充至此处 可在命令行中键入如下内容查看交叉编译环境的版本信息

```bash
arm-none-eabi-gcc --version
```

选择 examples/peripheral/blinky/pca10040/blank/armgcc ->在集成终端中打开

##### 在终端中键入 make -j6，对 blinky 例程进行编译

##### 在终端中键入 make erase，擦除芯片
makefile 实际执行
```makefile
erase:
  nrfjprog -f nrf52 --eraseall
```
命令解释
```bash
 -e  --eraseall
Erases all user available program flash memory and
the UICR page. Can be combined with the --qspieraseall operation.
Limi tations:
For nRF51 devices, if the devicetcame from Nordic with a pre-programmed SoftDevice,
nonly the user available code flash and UICR wi11 beserased.
```
##### 在终端中键入 make flash，将编译产生的 hex 文件烧录到 nRF5 开发板
makefile 实际执行
```makefile
# Flash the program

flash: default

  @echo Flashing: $(OUTPUT_DIRECTORY)/nrf52832_xxaa.hex

  nrfjprog -f nrf52 --program $(OUTPUT_DIRECTORY)/nrf52832_xxaa.hex --sectorerase

  nrfjprog -f nrf52 --reset
```
命令解释：
```bash
-f  --family <family>       
Selects the device family for the operation.Valid
argument optionS are NRF51，NRF52,NRF53，NRF91，
and UNKNOWN.
If UNKNOwN familyis given,an automatic family
detection of the device is performed.Note that
providing the actual family is faster than
performingtheautomaticfamilydetection.If
-family option is not given, the default is taken
from nrfjprog.ini.Must becombined with another
command.

 --program <hex_file>
Programs the specified image_file into the device.
Supported file formats ares.hex,N.ihex,L.elf,
,axf，and.bin.
A valid format_must_be specified
by the filename extension.

--sectorerase is given, only the targeted
non-volatile memory pages excluding UICR wi11
be erased
```
nRF5 SDK有一个非常重要的配置文件：`sdk_config.h` ，可以通过 sdk_config.h文件对整个芯片软件架构配置， 
使用`make sdk_config`命令，这个命令可以打开图形配置界面，需要有 java 运行环境