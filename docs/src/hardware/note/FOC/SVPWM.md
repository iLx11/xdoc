# 空间矢量脉宽调制(SV PWM )

**SVPWM是由三相功率逆变器的六个功率开关元件组成的特定开关模式产生的脉宽调制波，能够使输出电流波形尽可能接近于理想的正弦波形。**

空间电压矢量PWM与传统的正弦PWM不同，**它是从三相输出电压的整体效果出发，着眼于如何使电机获得理想圆形磁链轨迹。**

**SVPWM技术与SPWM相比较，绕组电流波形的谐波成分小，使得电机转矩脉动降低，旋转磁场更逼近圆形，而且使直流母线电压的利用率有了很大提高，且更易于实现数字化。**

## SVPWM基本原理

**SVPWM 的理论基础是平均值等效原理**，即在一个开关周期内通过对基本电压矢量加以组合，使其平均值与给定电压矢量相等。在某个时刻，电压矢量旋转到某个区域中，可由组成这个区域的两个相邻的非零矢量和零矢量在时间上的不同组合来得到。

两个矢量的作用时间在一个采样周期内分多次施加，从而控制各个电压矢量的作用时间，使电压空间矢量接近按圆轨迹旋转，通过逆变器的不同开关状态所产生的实际磁通去逼近理想磁通圆，并由两者的比较结果来决定逆变器的开关状态，从而形成PWM 波形。

**逆变电路：**
![image-20250422220357746](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250422220357746.png)

**设直流母线侧电压为Udc，逆变器输出的三相相电压为UA、UB、UC，** 其分别加在**空间上互差120°的三相平面静止坐标系上**，可以定义**三个电压空间矢量 UA(t)、UB(t)、UC(t)，** 它们的方向始终在各相的轴线上，而大小则随时间按正弦规律做变化，时间相位互差120°。**假设Um为相电压有效值，f为电源频率，则有：**
$$
\left\{\begin{array}{l}
U_{A}(t)=U_{m} \cos (\theta) \\
U_{B}(t)=U_{m} \cos (\theta-2 \pi / 3) \\
U_{C}(t)=U_{m} \cos (\theta+2 \pi / 3)
\end{array}\right.
$$
**其中**，$\theta=2 \pi f t$，则三相电压空间矢量相加的合成空间矢量U(t)就可以表示为：
$$
U(t)=U_A(t)+U_B(t)e^{j2\pi/3}+U_C(t)e^{j4\pi/3}=\frac{3}{2}U_me^{j\theta}
$$
可见U(t)是一个旋转的空间矢量，它的幅值为相电压峰值的1.5倍，**Um为相电压峰值，且以角频率 $ω=2πf$ 按逆时针方向匀速旋转的空间矢量，而空间矢量 U(t) 在三相坐标轴（a，b，c）上的投影就是对称的三相正弦量。**

____



由于逆变器三相桥臂共有6个开关管，为了研究各相上下桥臂不同开关组合时逆变器输出的空间电压矢量，特定义开关函数 $Sx( x= a、b、c)$  为：
$$
S_x=
\begin{cases}
1\text{上桥臂导通} \\
0\text{下桥臂导通} & 
\end{cases}
$$
(Sa、Sb、Sc)的全部可能组合共有八个，包括6个非零矢量Ul(001)、U2(010)、U3(011)、U4(100)、U5(101)、U6(110)、和两个零矢量U0(000)、U7(111)

**下面以其中一 种开关组合为例分 析，假设 Sx ( x= a、b、c)= (100)， 此 时**

![image-20250422224023143](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250422224023143.png)
$$
\begin{cases}
U_{ab}=U_{dc},U_{bc}=0,U_{ca}=-U_{dc} \\
U_{aN}-U_{bN}=U_{dc},U_{aN}-U_{cN}=U_{dc} \\
U_{aN}+U_{bN}+U_{cN}=0 & 
\end{cases}
$$
求解上述方程可得：$U_{aN}=2U_d  /  3、U_{bN}=-U_d/3、U_{cN}=-U_d/3$ 。同理可计算出其它各种组合下的空间电压矢量，列表如下：

**开关状态与相电压和线电压的对应关系：**

![image-20250422224546982](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250422224546982.png)

**八个基本电压空间矢量的大小和位置**

![image-20250423133307607](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250423133307607.png)

其中非零矢量的幅值相同（模长为 $2U_{dc}/3$），相邻的矢量间隔60°，而两个零矢量幅值为零，位于中心。在每一个扇区，选择相邻的两个电压矢量以及零矢量，按照伏秒平衡的原则来合成每个扇区内的任意电压矢量，即：
$$
\int_{0}^{T}U_{ref}dt=\int_{0}^{T_{x}}U_{x}dt+\int_{T_{x}}^{T_{x}+T_{y}}U_{y}dt+\int_{T_{x}+T_{y}}^{T}U_{0}^{*}dt
$$
或者等效：
$$
U_{ref}*T=U_x*T_x+U_y*T_y+U_0*T_0
$$
此式意义为：矢量 Uref 在 T 时间内所产生的积分效果值和Ux、Uy、U0 分别在时间 Tx、Ty、T0内产生的积分效果相加总和值相同。

**其中，Uref 为期望电压矢量；T为采样周期；Tx、Ty、T0分别为对应两个非零电压矢量 Ux、Uy 和零电压矢量U0在一个采样周期的作用时间；其中U0包括了U0和U7两个零矢量。**

由于三相正弦波电压在电压空间向量中合成一个等效的旋转电压，其旋转速度是输入电源角频率，等效旋转电压的轨迹将是上图空间矢量的大小和位置所示的圆形。

**所以要产生三相正弦波电压，可以利用以上电压向量合成的技术，在电压空间向量上，将设定的电压向量由U4(100)位置开始，每一次增加一个小增量，每一个小增量设定电压向量可以用该区中相邻的两个基本非零向量与零电压向量予以合成，如此所得到的设定电压向量就等效于一个在电压空间向量平面上平滑旋转的电压空间向量，从而达到电压空间向量脉宽调制的目的。**

## SVPWM 法则推导

三相电压给定所合成的电压向量旋转角速度为 $ω=2πf$ ，旋转一周所需的时间为 $T=1/ f$  ；若载波频率是 $fs$  ，则频率比为 $R=fs/f$ 。这样将电压旋转平面等切割成 $R$ 个小增量，亦即设定电压向量每次增量的角度是：
$$
γ = 2/ R = 2πf/fs = 2Ts/T
$$
假设欲合成的电压向量 $U_{ref}$ 在第Ⅰ区中第一个增量的位置，如图所示，欲用 U4、U6、U0 及U7 合成，用平均值等效可得：
$$
U_{ref}*T_s = U_4*T_4 + U_6 * T_6
$$
**电压空间向量在第Ⅰ区的合成与分解：**

![image-20250423105908379](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250423105908379.png)

在两相静止参考坐标系 $（α，β）$ 中，令 $U_{ref}$ 和 $U_4$ 间的夹角是 $θ$，由正弦定理可得：
$$
\begin{cases}
|U_{ref}|\cos\theta=\frac{T_4}{T_s}|U_4|+\frac{T_6}{T_s}|U_6|\cos\frac{\pi}{3}\quad\quad\alpha\text{轴} \\
 \\
|U_{ref}|\sin\theta=\frac{T_6}{T_s}|U_6|\sin\frac{\pi}{3}\quad\quad\quad\quad\quad\quad \beta\text{轴} & 
\end{cases}
$$
因为 $|U_4 |=|U_6|=2U_{dc}/3$ ，所以可以得到各矢量的状态保持时间为：
$$
\begin{cases}
T_4=mT_S\sin(\frac{\pi}{3}-\theta) \\
T_6=mT_S\sin\theta & 
\end{cases}
$$
式中 $m$ 为 SVPWM 调制系数（调制比），$m =\sqrt{3}|U_{ref}|/U_{dc}$ 。

而零电压向量所分配的时间为：
$$
T_7 = T_0 = (T_S - T_4 - T_6 ) /2
$$
或者 $T7 =(TS-T4-T6 )$

得到以 $U_4、U_6、U_7$ 及 $U_0$ 合成的 $U_{ref}$ 的时间后，接下来就是如何产生实际的脉宽调制波形。

在SVPWM 调制方案中，零矢量的选择是最具灵活性的，适当选择零矢量，可最大限度地减少开关次数，尽可能避免在负载电流较大的时刻的开关动作，最大限度地减少开关损耗。

一个开关周期中空间矢量按分时方式发生作用，在时间上构成一个空间矢量的序列，空间矢量的序列组织方式有多种，按照空间矢量的对称性分类，可分为两相开关换流与三相开关换流。

## 7 段式 SVPWM

以减少开关次数为目标，将基本矢量作用顺序的分配原则选定为：在每次开关状态转换时，只改变其中一相的开关状态。并且对零矢量在时间上进行了平均分配，以使产生的 PWM 对称，从而有效地降低PWM 的谐波分量。

因此要改变电压向量U4(100)、U2(010)、 U1(001)的大小，需配合零电压向量U0(000)，而要改变U6(110)、U3(011)、U5(100)，需配合零电压向量
U7(111)。这样通过在不同区间内安排不同的开关切换顺序，就可以获得对称的输出波形。

**UREF 所在的位置和开关切换顺序对照序**

| UREF所在的位置        | 开关切换顺序    |
| --------------------- | --------------- |
| I区(0°≤0≤60°)         | 0-4-6-7-7-6-4-0 |
| II区(60° ≤ 0 ≤ 2 0 )  | 0-2-6-7-7-6-2-0 |
| III区(120°≤0≤180°)    | 0-2-3-7-7-3-2-0 |
| IV区(180° /八 0≤240°) | 0-1-3-7-7-3-1-0 |
| V区(240°≤0≤300°)      | 0-1-5-7-7-5-1-0 |
| VI区(300° ≤0≤360°)    | 0-4-5-7-7-5-4-0 |

图中电压向量出现的先后顺序为 U0、U4、U6、U7、U6、U4、U0，各电压向量的三相波形则与开关表示符号相对应。

**再下一个 $T_S$ 时段，Uref 的角度增加一个$γ$ ，可以重新计算新的 $T_0、T_4、T_6 及 T_7$ 值，得到新的合成三相波形；这样每一个载波周期TS就会合成一个新的矢量，随着θ的逐渐增大，$U_{ref}$ 将依序进入第Ⅰ、Ⅱ、Ⅲ、Ⅳ、Ⅴ、Ⅵ区。在电压向量旋转一周期后，就会产生 R 个合成矢量。**

## 5 段式 SVPWM

对7段而言，发波对称，谐波含量较小，但是每个开关周期有6次开关切换，为了进一步减少开关次数，采用每相开关在每个扇区状态维持不变的序列安排，使得每个开关周期只有3次开关切换，但是会增大谐波含量。

| UREF所在的位置        | 开关切换顺序 |
| --------------------- | ------------ |
| I区(0°≤0≤60°)         | 4-6-7-7-6-4  |
| II区(60° ≤ 0 ≤ 2 0 )  | 2-6-7-7-6-2  |
| III区(120°≤0≤180°)    | 2-3-7-7-3-2  |
| IV区(180° /八 0≤240°) | 1-3-7-7-3-1  |
| V区(240°≤0≤300°)      | 1-5-7-7-5-1  |
| VI区(300° ≤0≤360°)    | 4-5-7-7-5-4  |

## SVPWM 控制算法

通过以上SVPWM 的法则推导分析可知要实现SVPWM信号的实时调制，**首先需要知道参考电压矢量 $U_{ref}$ 所在的区间位置，然后利用所在扇区的相邻两电压矢量和适当的零矢量来合成参考电压矢量。**

电压空间向量在第Ⅰ区的合成与分解图，是在静止坐标系（α，β）中描述的电压空间矢量图，**电压矢量调制的控制指令是矢量控制系统给出的矢量信号 $U_{ref}$ ，它以某一角频率 $ω$ 在空间逆时针旋转，当旋转到矢量图的某个 60°扇区中时，系统计算该区间所需的基本电压空间矢量，并以此矢量所对应的状态去驱动功率开关元件动作。** 当控制矢量在空间旋转 360°后，逆变器就能输出一个周期的正弦波电压。

### 合成矢量Uref 所处扇区N 的判断

空间矢量调制的第一步是判断由 $U_α$ 和 $U_β$ 所决定的空间电压矢量所处的扇区。假定合成的电压矢量落在第 $I$ 扇区，可知其等价条件如下：
$$
0º<\arctan(U_β/U_α)<60 º
$$
以上等价条件再结合矢量图几何关系分析，可以判断出合成电压矢量 $U_{ref}$ 落在第 X 扇区的充分必要条件，得出下表：

| 扇区 | 落在此扇区的充要条件                            |
| ---- | ----------------------------------------------- |
| Ⅰ    | $U_α>0 ，U_β>0 \quad且\quad U_β/U_α<\sqrt{3}$   |
| Ⅱ    | $U_α>0  \quad且\quad U_β/\|U_α\|>\sqrt{3}$      |
| Ⅲ    | $U_α<0 ，U_β>0  \quad且\quad -U_β/U_α<\sqrt{3}$ |
| Ⅳ    | $U_α<0 ，U_β<0  \quad且\quad U_β/U_α<\sqrt{3}$  |
| Ⅴ    | $U_β<0  \quad且\quad -U_β/\|U_α\|>\sqrt{3}$     |
| Ⅵ    | $U_α>0 ，U_β<0  \quad且\quad -U_β/U_α<\sqrt{3}$ |

若进一步分析以上的条件，有可看出参考电压矢量 $U_{ref}$ 所在的扇区完全由$U_β$ , $\sqrt3U_\alpha - U_\beta \quad和\quad -\sqrt3U_\alpha - U_\beta$ 三式决定，因此：
$$
\begin{cases}
U_1=U_\beta \\
U_2=\frac{\sqrt{3}}{2}U_\alpha-\frac{U_\beta}{2} \\
U_3=-\frac{\sqrt{3}}{2}U_\alpha-\frac{U_\beta}{2} & 
\end{cases}
$$
**再定义，若U1>0 ，则A=1，否则 A=0；若U 2>0 ，则B=1，否则 B=0；若U3>0 ，则 C=1，否则 C=0。**

可以看出 A，B，C 之间共有八种组合，但由判断扇区的公式可知 A，B，C 不会同时为1 或同时为 0，所以实际的组合是六种，A，B，C 组合取不同的值对应着不同的扇区，并且是一一对应的，因此完全可以由 A，B，C 的组合判断所在的扇区。

**为区别六种状态，令$N=4*C+2*B+A$ ，则可以通过下表计算参考电压矢量 Uref 所在的扇区。**

**值与扇区对应关系：**

| N       | 3    | 1    | 5    | 4    | 9    | 2    |
| ------- | ---- | ---- | ---- | ---- | ---- | ---- |
| 扇 区号 | I    | II   | III  | IV   | V    | VI   |

采用上述方法，只需经过简单的加减及逻辑运算即可确定所在的扇区，对于提高系统的响应速度和进行仿真都是很有意义的。