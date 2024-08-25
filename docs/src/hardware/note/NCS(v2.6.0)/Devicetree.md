## DeviceTree的语法
DeviceTree基本结构示例
​DeviceTree的源码称为DTS（DeviceTree Source），后缀为.dts。
```c
/dts-v1/

/{
	a-node{
		a_node_label: a-sub-node {
			foo = <3>;
		};
		another-sub-node {
			foo = <3>;
			bar = <&a_node_label>;
		};	
	};
};
```
1. `/dts-v1/`，指明了DeviceTree的版本；
2. 设备树具有唯一的根节点`/`；
3. 节点的**名称**写在大括号之前。如`a-node`、`a-sub-node`和`another-sub-node`；
4. 节点的**属性**写在大括号内，是键值对（Key-Value Pair）的形式。如`foo = <3>;`；
5. 子节点直接写在父节点的大括号内，从而可以表达树状的层次关系；
6. 可以给节点写一个标签，例如`a_node_label`，标签与节点之间用冒号`:`连接。
### 标签（Label）的意义：
1. 要指明一个节点，标准的做法必须指明绝对路径，例如：`/a-node/a-sub-node`。  
    有了标签，就可以省略路径，直接用标签表示一个节点，如`a_node_label`。
2. 标签可以被作为**属性**引用，让一个节点成为另一个节点的某个属性的**值**。注意，这里说的是成为「属性的值」，而不是成为「子节点」。
### DeviceTree节点的名称
DeviceTree中的节点名称遵循以下命名规则：`name@address`
1. `name`：必须以字母开头。长度在1~31子节。允许大小写字母、数字、**英文逗号、小数点、加号、减号、下划线**；
2. `@address`：称为**「Unit Address」**，如果节点有`reg`属性，则address的值必须与`reg`描述的**第一个寄存器地址**相等，可以理解为某个外设在它的总线上的首地址。如果某个节点没有reg属性，则`@address`**必须省略**。  
address和reg都是16进制。但address不需要写`0x`前缀，而reg的16进制值需要写`0x`前缀。
​ 实际上，Zephyr对address有一些特殊的规则，见：[Unit address](https://docs.zephyrproject.org/latest/build/dts/intro-syntax-structure.html#id7)
- 挂在SPI总线上的设备：address表示片选线（CS）的编号，如果没有片选线，则为`0`；
- RAM：address直接为RAM的物理起始地址，如`memory@20000000`，表示`0x20000000`；
- Flash：address直接为Flash的物理起始地址，如`flash@800000`，表示`0x08000000`。
- Flash分区：可以在DeviceTree里存一个Flash分区表，分区的address是相对于Flash物理首地址的偏移量
```c
flash@8000000 {
    /* ... */
    partitions {
        partition@0 { /* ... */ };
        partition@20000 {  /* ... */ };
        /* ... */
    };
};
```
### 示例
```c
  
// address必须和reg首地址相等，无论是ARM地址还是i2c地址
i2c@40003000 {
    reg = <0x40003000 0x1000>;
    /* ... */
    ds3231@68 {
        reg = <0x68>;
        /* ... */
    }
};

// 不带地址的节点，不含@address字段
buttons{
   /* ... */
};

// 英文逗号也是name的一部分
zephyr,user {
	/* ... */
};
```
### DeviceTree的属性
 DeviceTree中每个节点可以有几个属性来描述这个节点。
​ 属性是键值对。属性的名称可以含**大小写字母、数字、逗号、小数点、下划线，加号、减号、问号、"#"号**。
​ 属性是有**类型**的，并且，Zephyr中的属性类型和标准的DeviceTree还有一定的区别，总之是更详细了，见下表：

| 类型            | 属性示例                                                       | 说明                                   |
| ------------- | ---------------------------------------------------------- | ------------------------------------ |
| string        | `a-string="hello world!";`                                 | 字符串                                  |
| string-array  | `a-string-array="string one","string two"."string three";` | 字符串数组                                |
| int           | 10进制：`an-int = <1>;`  <br>16进制：`an-int = <0xab>;`          | 32bit整数                              |
| array         | `foo = <0xdeadbeef 1234 0>;`                               | 整数数组                                 |
| uint8-array   | `a-byte-array = [00 01 ab];`                               | 字节数组，16进制，可省略0x                      |
| boolean       | `my-true-boolean;`                                         | 无值属性。值存在则表示`true`，不存在则表示`false`      |
| phandle       | `a-phandle = <&mynode>;`                                   | 节点句柄，指向其他的节点。可以认为是一个指针（p）或句柄（handle） |
| phandles      | `some-phandles = <&mynode0 &mynode1 &mynode2>;`            | 节点句柄数组                               |
| phandle-array | `a-phandle-array = <&mynode0 1 2>, <&mynode1 3 4>;`        | 见下方详细说明                              |
​ 其实最基本的属性就是整数、布尔、字符串。以及由它们构成的数组。
​ `phandle`本质也是整数，当给一个节点赋予标签时，其实是给这个节点添加了一个隐藏属性`phandle = <n>;`。构建系统会确保整个DeviceTree中的`n`不会重复。所以这里`a-phandle = <&mynode>;`，`&mynode`的值就是这个标签指向的节点的隐藏phandle属性的值。
​`phandle-array`类型。其实，将其取名为「结构体数组」更加合适。这个数组的每一个元素都是一个特殊的结构体，结构体的第一个值必定是一个`phandle`，后续的值可以是任意值，数量也可以任意。
Zephyr将这种类型用来做硬件通道的配置，例如`<&gpio0 1 GPIO_INPUT>`表示gpio0，1号引脚，模式为输入。后续的硬件支持章节会更详细地讲解实例。
### DeviceTree的文件引用
`.dts`可以引用其他的`.dts`或`.dtsi`。这样**板卡级dts**就可以引用厂商写好的**芯片级dtsi**，从而减少编写dts的工作量。
## overlay文件
### overlay文件的位置
在我们开发应用时，往往需要基于厂商的开发板Dts，新增一些功能，或者禁用一些功能。Zephyr提供了overlay的方式让我们可以**覆写**原始的板卡级dts。
​ 在一些例程中，可以看到`boards/<board>.overlay`文件：
### overlay的使用
#### 覆盖/新增属性
直接在原有节点覆盖/新增属性，可以从根节点开始写
```c
/{
	zephyr,user {
		test-gpios = <&gpio0 17 0>;
	};
}
```
​ 也可以直接用label写
```c
&timer0 {
	status = "okay";
}
```
#### 删除属性
```c
/{
	aliases {
		/delete-property/ led1;
	};
}
```
#### 删除节点
```c
/{
	/delete-node/ leds;
}
```
### 完整的dts文件
每个项目构建时，编译之前，会在构建目录下生成最终的完整dts。位置为`${project_folder}/build/zephyr/zephyr.dts`
### 最终输出
​ Linux的DTS会被编译为DTB，然后在启动时由Bootloader传递给kernel。但Zephyr运行在性能较差的嵌入式平台上，故不可能专门运行一个解析器去读DTB。
​ 因此，DTS实际上实在编译时被Zephyr的构建系统（一套python脚本）变成了头文件，这个头文件的位置是：
`${project_folder}/build/zephyr/include/generated/devicetree_generated.h`

# DeviceTree配置硬件信息
## 标准属性
​DeviceTree中有一些标准的属性，这些属性和Linux是一样的，在DeviceTree Specification中是有定义的。
#### #reg, #address-cells 与 #size-cells
**reg**属性代表此节点在总线上占用的地址和范围。是由**多对** **(address, length)**组合而成的。而**#address-cells** 和**#size-cells**则表示了这个总线上的节点的reg属性里，每个address和size要占用多少个uint32单元。
```css
soc {
	#address-cells  = <1>;
	#size-cells = <1>;
	serial@0 {
		reg = <0x0 0x100 0x200 0x300>;	
	}
}
```
先看父节点`soc`，可以得知这条总线上，所有寄存器的address和size各占一个uint32单元。则serial有两个寄存器，第一个寄存器首地址是0x0，长度是0x100；第二个寄存器首地址是0x200，长度是0x300。
如果地址长度为64位或更多（即要占用多个Uint32单元），则reg中的写法为大端模式（Big-Endian ），即高地址在前，低地址在后。
### ranges
当一个节点定义了ranges属性，那么它的子节点就可以使用**相对地址**，而非**绝对地址**。
```css
soc {
	peripheral@40000000 {
		ranges = <0x0 0x40000000 0x10000000>;	
	}
}
```
peripheral基地址为0x40000000。而ADC的地址从0xe000开始，这是一个相对地址。则ADC在ARM地址空间的绝对地址为0x4000e000。
**ranges属性的格式为：**
`ranges = <子空间首地址 父空间首地址 长度>`
子空间首地址为0时，子节点的地址就是相对地址。
### status
**status**用来指定是否启用一个设备（节点），根据DeviceTree Spec有以下几个选项：
- "okay" ： 设备是可操作的
- "disabled" ： 设备目前是不可操作的（但未来可能可以操作，比如设备插入、安装后）
- "fail" ： 设备不可操作。设备中检测到错误。
- "fail-sss"：设备不可操作。其中sss的部分会根据不同的设备而变换，用于指定特定的错误码
- "reserved" ： 设备可操作，但不应该使用。通常用于设备被其他软件控制的情况。
**但是实际上Zephyr中基本只会用「okay」和「disabled」 ，用来启用或禁用节点。**
### compatible
**compatible**用来说明一个节点设备的兼容性。它的值是一个字符串或一个字符串数组。
Zephyr构建系统就是用它来为每个节点找到合适的驱动程序。其具体的应用后面会讲解。
compatible的每个值的通常命名方式是”vendor,device”，即某个供应商的某个产品。这不是强制的要求，也可以没有vendor。
如果compatible有多个值，zephyr会按顺序寻找驱动。会使用找到的第一个驱动。
## 重要概念——域（Domain）
DeviceTree是基于**总线地址的层次结构**。除了DeviceTree本身基于地址的树之外，在逻辑上，还存在一些其他的树，例如GPIO树、中断树、ADC树等等。
我们将这种附加在DeviceTree上的，逻辑上的树称为**域（Domain）**。
很容易发现，每个域都有一个自己的“**根节点**”，称为**控制器（Controller）**。不难发现，其实控制器才是真正的我们编程操作的对象，而域中的子节点，都是我们为了方便理解，而抽象出来的概念，这与本文第2章节的观点是一致的。
### 域的控制器与子节点
​ 控制器节点通常会有一个布尔类型属性 `*-controller`，来表示自己是某个域的控制器
```c
gpio0: gpio@0000000 {
	compatible = "nordic,nrf-gpio";
	gpio-controller;
	#gpio-cells = < 0x2 >;
	...
}
```
​ 而域中的子节点，就可以使用`phandle-array`类型的属性来说明自己属于哪个域。此属性的第一个值是指向**控制器的**句柄。后续的值是此节点在这个域中的**配置**。这一条配置被称为**specifie**r
```c
buttons {
	compatible = "gpio-keys";
	button0: button_0 {
		gpios = < &gpio0 0xc 0x11 >;
		...	
	}
}
```
控制器节点中会有一个`#*-cells`属性来指明specifier的大小，需要占用多少个`uint32`单元。
### 中断域
中断域和GPIO域有点类似，但有点区别：
```c
soc {
	interrupt-parent = < &nvic >;
	nvic: interrupt-controller@e000e100 {
		...
		interrupt-controller;
		#interrupt-cells = < 0x2 >;	
	};
	adc@4e0000000 {
		...
		interrupts = < 0x7 0x1 >;
	}
}
```
adc的`interrupts`属性只写了specifier，并没有写controller指向哪里。
这是因为，根据DeviceTree标准，构建系统默认把devicetree父节点当作中断域的controller。如果父节点不是controller，则继续向上寻找。直到遇到controller，或者遇到`interrupt-parent`属性时，才会指定父节点。
`adc`节点向上寻找，遇到`soc`节点，在`soc`节点内，指明了其中断域控制器是`nvic`。于是`adc`节点中断域的控制器就是nvic。
### 其他类似的域
类似的还有adc域、pwm域、pin-ctrl域等等。这些域的子节点也都采用了**specifier**的方式，来记录配置信息：