### include 
```c
#include <zephyr.h>
```
### declare & init
```c
static const struct k_sem my_sem;

// 初始化，初始计数和最大计数
k_sem_init(&my_sem, 0, 1);
```
### 同步信号量
```c
/*
	- `K_NO_WAIT`：立即返回，如果不能获取到信号量就返回错误。
	- `K_FOREVER`：永远等待，直到获取到信号量。
	-  或者是一个具体的时间段（如 `K_MSEC(100)` 表示等待100毫秒）。
*/
if(k_sem_take(&my_sem, K_FOREVER) == 0)
```
### 释放信号量
```c
k_sem_give(&my_sem);
```