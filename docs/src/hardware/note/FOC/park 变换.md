# park 正变换

通俗点讲就是在不断旋转变化的转子上再建立一个坐标系，因此可以通过 $\mathrm{I_α−I_β}$ 坐标系和两个坐标系夹角 $\theta$ 获得在新坐标系 $\mathrm{I_q−I_d}$ 上的映射

![image-20250702224050499](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250702224050499.png)

新坐标系不断旋转产生的差角 θ，称为电角度

映射后的 park 矩阵形式如下，根据规范 $i_d$ 要写在上面的行：
$$
\begin{bmatrix}
\mathrm{i_d} \\
\mathrm{i_q}
\end{bmatrix}=
\begin{bmatrix}
\cos\theta & & \sin\theta \\
-\sin\theta & & \cos\theta
\end{bmatrix}
\begin{bmatrix}
\mathrm{i_\alpha} \\
\mathrm{i_\beta}
\end{bmatrix}
$$
又因为矩阵运算 
$$
AB = C ==> A^{-1}C = B
$$
可以用 (A 的伴随 / A 的行列式) 求出 A 的逆
$$
\begin{bmatrix}
\cos\theta & & \sin\theta \\
-\sin\theta & & \cos\theta
\end{bmatrix}^{-1}
$$
A 的逆为
$$
\begin{aligned}
\begin{bmatrix}
\cos\theta & & \sin\theta \\
-\sin\theta & & \cos\theta
\end{bmatrix}^{-1} &= 
\frac{1}{\cos^2\theta - (-\sin\theta \sin\theta)}
\begin{bmatrix}
\cos\theta & & -\sin\theta \\
\sin\theta & & \cos\theta
\end{bmatrix} \\
\\
\begin{bmatrix}
\cos\theta & & \sin\theta \\
-\sin\theta & & \cos\theta
\end{bmatrix}^{-1} &= 
\frac{1}{\cos^2\theta + \sin^2\theta}
\begin{bmatrix}
\cos\theta & & -\sin\theta \\
\sin\theta & & \cos\theta
\end{bmatrix}
\end{aligned}
$$
因为毕达哥拉斯恒等式为：
$$
\sin^2x + \cos^2x = 1
$$
所以最终的 park 逆变换矩阵为：
$$
\begin{bmatrix}
\mathrm{i_\alpha} \\
\mathrm{i_\beta}
\end{bmatrix}=
\begin{bmatrix}
\cos\theta & & -\sin\theta \\
\sin\theta & & \cos\theta
\end{bmatrix}
\begin{bmatrix}
\mathrm{i_d} \\
\mathrm{i_q}
\end{bmatrix}
$$
等式为：
$$
\mathrm{i_\alpha=i_d\cos\theta - i_q\sin\theta} \\ 
\mathrm{ i_\beta=i_d\sin\theta +i_q\cos\theta}
$$
在实际的 FOC 应用中，电角度是实时有编码器求出的，因此是已知的。 $\mathrm{I_q−I_d}$ 可以合成一个矢量，加上电角度（旋转）的存在，因此可以看成一个旋转的矢量。在通过 $\mathrm{I_q−I_d}$ 和电角度求得 $\mathrm{I_α−I_β}$ 后，我们就可以通过前面提到的克拉克逆变换求得 $\mathrm{i}_\mathrm{a}, \mathrm{i}_\mathrm{b}, \mathrm{i}_\mathrm{c}$的波形，这正是FOC的基本过程

通常在简单的 FOC 应用中，我们只需要控制 $\mathrm{I_q}$ 的电流大小，而把 $\mathrm{I_d}$ 设置为0。此时，$\mathrm{I_q}$ 的大小间接就决定了定子三相电流的大小，进而决定了定子产生磁场的强度。进一步我们可以说，它决定了电机产生的力矩大小

而 $\mathrm{I_q}$ 是旋转的矢量，同时 $\mathrm{I_q}$ 又会间接影响磁场的强度，这正是FOC的名称**磁场定向控制**的由来