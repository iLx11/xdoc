## 获取设备 ID
```c
uint32_t id[2];
id[0]=NRF_FICR->DEVICEID[0];//低32位
id[1]=NRF_FICR->DEVICEID[1];//高32位
```
## 内部传感器温度
TEMP寄存器保存了温度的值，0.25度 steps 意思是，每一个刻度代表0.25度，比如数值为10转换成温度就是2.5度。内部温度读取示例：
```c
// 初始化内部温度传感器
nrf_temp_init();

// 获取温度
u32 temp_get(){
	u32 temp;//不考虑0下度数
	//开始温度测量
	NRF_TEMP->TASKS_START = 1;
	/*等待温度测量完成 */
    while (NRF_TEMP->EVENTS_DATARDY == 0){
	}
	NRF_TEMP->EVENTS_DATARDY = 0;//清除临时寄存器
	
 	temp = (nrf_temp_read() / 4);	
 	
 	NRF_TEMP->TASKS_STOP = 1; //停止测量
    return temp;
}
```
## 随机数
随机数发生器 RNG 通过触发START任务进行启动，新的随机数连续产生，在准备好时 写入 VALUE 寄存器。每次新的随机数写入到 VALUE寄存器，都会触发一个 VALRDY 事件。

和温度传感器一样，可以单次获取数值进行应用，具体的分析方式参考上面的额温度传感器，下面的例子是读取一个随机数：
```c
err_code = nrf_drv_rng_init(NULL);
APP_ERROR_CHECK(err_code);

uint8_t get_rng(void) {
	uint8_t value;
	NRF_RNG->CONFIG=1;    
	NRF_RNG->TASKS_START=1;   
	NRF_RNG->EVENTS_VALRDY=0; 
	while(NRF_RNG->EVENTS_VALRDY==0){
	} 
	value=NRF_RNG->VALUE;              
	NRF_RNG->TASKS_STOP=1;             
	NRF_RNG->INTENCLR=0;               
	NRF_RNG->CONFIG=0;                 
	return value;
}
```