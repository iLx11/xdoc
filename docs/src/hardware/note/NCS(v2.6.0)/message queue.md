**定义数据**
```c
typedef struct {
    uint32_t x_reading;
    uint32_t y_reading;
    uint32_t z_reading;
} SensorReading;
```
**定义消息队列**
```c
K_MSGQ_DEFINE(device_message_queue, sizeof(SensorReading), 16, 4);
```
**写入消息队列**
```c
ret = k_msgq_put(&device_message_queue,&acc_val,K_FOREVER);
if (ret){
	LOG_ERR("Return value from k_msgq_put = %d", ret);
}
```
**读取消息**
```c
ret = k_msgq_get(&device_message_queue,&temp,K_FOREVER);
if (ret){
	LOG_ERR("Return value from k_msgq_get = %d", ret);
}
```