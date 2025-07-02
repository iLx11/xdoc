# clarke 正变换

通俗点讲就是将难以控制的电机三相，降维投影到两个坐标轴，缩减控制变量。

复杂的三相变化问题就降解为了α-β坐标轴的坐标上的数值变化问题。

![image-20250702204324790](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250702204324790.png)

利用三角函数进行投影：
 ![image-20250702204429475](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250702204429475.png)



显然，针对α-β坐标系中α轴，有：
$$
\begin{aligned}
 & \mathrm{I_\alpha=i_a-sin30^\circ i_b-cos60^\circ i_c} \\
 & \mathrm{I_\alpha=i_a-\frac{1}{2}i_b-\frac{1}{2}i_c}
\end{aligned}
$$
针对α-β坐标系中β轴，有：
$$
\begin{aligned}
 & \mathrm{I_\beta=cos30^\circ i_b-cos30^\circ i_c} \\
 & \mathrm{I_\beta=\frac{\sqrt{3}}{2}i_b-\frac{\sqrt{3}}{2}i_c}
\end{aligned}
$$
把上面的投影结果列成矩阵形式，有：
$$
\begin{bmatrix}
\mathrm{I}_\alpha \\
\mathrm{I}_\beta
\end{bmatrix}=
\begin{bmatrix}
1 & -\frac{1}{2} & -\frac{1}{2} \\
0 & \frac{\sqrt{3}}{2} & -\frac{\sqrt{3}}{2}
\end{bmatrix}
\begin{bmatrix}
\mathrm{i}_\mathrm{a} \\
\mathrm{i}_\mathrm{b} \\
\mathrm{i}_\mathrm{c}
\end{bmatrix}
$$
但是这个式子并不是最终的投影式，之后需要添加幅值的系数，原因如下：

用 $α$ 相电流输入 $1A$ 电流的特例来举例，当电流输入时候，根据基尔霍夫电流定律（电路中任一个节点上，在任意时刻，流入节点的电流之和等于流出节点的电流之和，如下图），有：
$$
\mathrm{i}_\mathrm{a} + \mathrm{i}_\mathrm{b} + \mathrm{c}_\mathrm{a} = 0
$$
![image-20250702210947899](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250702210947899.png)

设 $\mathrm{i}_\mathrm{a}$ 为-1，则根据上面的式子，$\mathrm{i}_\mathrm{b} = \mathrm{i}_\mathrm{c} = \frac{1}{2}$ ，列成矩阵形式后，如下所示：
$$
\begin{bmatrix}
\mathrm{i}_a \\
\mathrm{i}_b \\
\mathrm{i}_c
\end{bmatrix} =
\begin{bmatrix}
-1 \\
\frac{1}{2} \\
\frac{1}{2}
\end{bmatrix}
$$
将 $\mathrm{i}_\mathrm{a}, \mathrm{i}_\mathrm{b}, \mathrm{i}_\mathrm{c}$ 代入：
$$
\begin{aligned}

\begin{bmatrix}
\mathrm{I}_\alpha \\
\mathrm{I}_\beta
\end{bmatrix} & =
\begin{bmatrix}
1 & -\frac{1}{2} & \frac{1}{2} \\
0 & \frac{\sqrt{3}}{2} & -\frac{\sqrt{3}}{2}
\end{bmatrix}
\begin{bmatrix}
\mathrm{i}_\mathrm{a} \\
\mathrm{i}_\mathrm{b} \\
\mathrm{i}_\mathrm{c}
\end{bmatrix} \\
 & =
\begin{bmatrix}
1 & -\frac{1}{2} & -\frac{1}{2} \\
0 & \frac{\sqrt{3}}{2} & -\frac{\sqrt{3}}{2}
\end{bmatrix}
\begin{bmatrix}
-1 \\
\frac{1}{2} \\
\frac{1}{2}
\end{bmatrix} \\
 & =
\begin{bmatrix}
-\frac{3}{2} \\
0
\end{bmatrix}
\end{aligned}
$$
由于 b,c 相电流投影的存在，导致在 a 相输入 $1A$ 电流，反应在 $\alpha$ 轴上的电流并不是等赋值的 $1A$ ，而是 $-\frac{3}{2}$。

因此，为了让式子等辐值，即使得 a 相 $1A$ 时，反应在α轴上的电流也是 $1A$ ，就得乘上系数 $\frac{2}{3}$

基于等赋值变换，就能够得到 α、β 相位与 $\mathrm{i}_\mathrm{a}, \mathrm{i}_\mathrm{b}, \mathrm{i}_\mathrm{c}$ 的关系
$$
\begin{bmatrix}
\mathrm{I}_\alpha \\
\mathrm{I}_\beta
\end{bmatrix}= \frac{2}{3}
\begin{bmatrix}
1 & -\frac{1}{2} & -\frac{1}{2} \\
0 & \frac{\sqrt{3}}{2} & -\frac{\sqrt{3}}{2}
\end{bmatrix}
\begin{bmatrix}
\mathrm{i}_\mathrm{a} \\
\mathrm{i}_\mathrm{b} \\
\mathrm{i}_\mathrm{c}
\end{bmatrix}
$$
代入：
$$
\begin{aligned}
\mathrm{I_{\alpha}}=\frac{2}{3}(\mathrm{i_a}-\frac{1}{2}\mathrm{i_b}-\frac{1}{2}\mathrm{i_c}) \\
\mathrm{I_{\alpha}}=\frac{2}{3}[\mathrm{i_a}-\frac{1}{2}(\mathrm{i_b}+\mathrm{i_c})]
\end{aligned}
$$
根据基尔霍夫电流定律：
$$
\mathrm{i_a} + \mathrm{i_b} + \mathrm{i_c} = 0 \\\\
\begin{aligned}
\frac{1}{2}\mathrm{i_a} & =-\frac{1}{2}(\mathrm{i_b+i_c}) \\\\
\mathrm{Ia} & =\frac{2}{3}[\mathrm{i_a}+\frac{1}{2}\mathrm{i_a}] \\
\mathrm{Ia} & =\frac{2}{3}\times\frac{3}{2}\mathrm{i_a} \\
\mathrm{Ia} & =\mathrm{i_a}
\end{aligned}
$$
 进一步的，可求 $\mathrm{I_\beta}$
$$
\begin{aligned}
\mathrm{I_\beta} & =\frac{2}{3}\times(\frac{\sqrt{3}}{2}\mathrm{i_b}-\frac{\sqrt{3}}{2}\mathrm{i_c}) \\
 & =\frac{\sqrt{3}}{3}\times(\mathrm{i_b-i_c}) \\
 & =\frac{1}{\sqrt{3}}\times(\mathrm{i_b-i_c})
\end{aligned}
$$
根据基尔霍夫电流定律：
$$
\begin{aligned}
 & \mathrm{i_c}=-(\mathrm{i_a+i_b}) \\\\
 & \mathrm{I_\beta}=\frac{1}{\sqrt{3}}\times(\mathrm{i_b-i_c}) \\
 & =\frac{1}{\sqrt{3}}\times(\mathrm{i_b+i_a+i_b}) \\
 & =\frac{1}{\sqrt{3}}\times(2\mathrm{i_b+i_a})
\end{aligned}
$$


最终可以得到：
$$
\begin{cases}
\mathrm{I_\alpha = i_a}\\
\mathrm{I_\beta=\frac{1}{\sqrt{3}}\times(2i_b+i_a)}
\end{cases}
$$

# clarke 逆变换

将 $\mathrm{I\alpha}$ 代入 $\mathrm{i_\alpha}$, 推导出 $\mathrm{i_b}$
$$
\begin{aligned}
\mathrm{I_\beta} & =\frac{1}{\sqrt{3}}\times(2\mathrm{i_b+i_a}) \\
\mathrm{I_\beta} & =\frac{1}{\sqrt{3}}\times(2\mathrm{i_b}+\mathrm{I_a}) \\
\sqrt{3}\mathrm{I_{\beta}} & =2\mathrm{i}_{\mathrm{b}}+\mathrm{I}_{\mathrm{a}} \\
2i_{\mathrm{b}} & =\sqrt{3}\mathrm{I}_\beta-\mathrm{I}_\alpha \\
\mathrm{i_b} & =\frac{\sqrt{3}\mathrm{I}_\beta-\mathrm{I}_\alpha}{2}
\end{aligned}
$$
根据基尔霍夫电流定律推导出 $\mathrm{i_c}$
$$
\begin{aligned}
\mathrm{i_c} & =-(\mathrm{i_a+i_b}) \\
 & =-\mathrm{I}_\alpha-\mathrm{i}_\mathrm{b} \\
 & =-\mathrm{I}_\alpha-\frac{\sqrt{3}\mathrm{I}_\beta-\mathrm{I}_\alpha}{2} \\
 & =\frac{-2\mathrm{I}_\alpha-\sqrt{3}\mathrm{I}_\beta+\mathrm{I}_\alpha}{2} \\
 & =\frac{-\mathrm{I}_\alpha-\sqrt{3}\mathrm{I}_\beta}{2}
\end{aligned}
$$
最终得到：
$$
\begin{cases}
\mathrm{i_a=I_a} \\
\mathrm{i_b=\frac{\sqrt{3}I_\beta-I_\alpha}{2}} \\
\mathrm{i_c=\frac{-I_\alpha-\sqrt{3}I_\beta}{2}} & 
\end{cases}
$$
