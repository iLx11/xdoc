**启用随机数生成**
```c
CONFIG_ENTROPY_GENERATOR=y
```
为 FIFO 使用分配适当的堆
```C
CONFIG_HEAP_MEM_POOL_SIZE=1024
```
定义FIFO
```C
K_FIFO_DEFINE(my_fifo);
```
**定义FIFO项的数据类型**
```c
struct data_item_t {
	void *fifo_reserved;
	uint8_t  data[MAX_DATA_SIZE];
	uint16_t len;
}; 
```
结构体的第一个成员 `fifo_reserved` 是所有 FIFO 的必需成员，由内核内部使用。第二个成员 是大小为 的 `uint8_t` `MAX_DATA_SIZE` 数组， `data` 最后一个成员 `len` 将保存写入数组的实际数据。
**将数据项添加到 FIFO 中**
在 `producer_func()` 函数中添加
```c
    while (1) {
        int bytes_written; 
        /* Generate a random number between MIN_DATA_ITEMS & MAX_DATA_ITEMS to represent the number of data items to send 
        every time the producer thread is scheduled */
        uint32_t data_number = MIN_DATA_ITEMS + sys_rand32_get()%(MAX_DATA_ITEMS-MIN_DATA_ITEMS+1);
        for (int i =0; i<=data_number;i++){
            /* Create a data item to send */
            struct data_item_t *buf= k_malloc(sizeof(struct data_item_t));
            if (buf == NULL){
            /* Unable to locate memory from the heap */
                LOG_ERR("Unable to allocate memory");
                return;
            }
                bytes_written = snprintf(buf->data,MAX_DATA_SIZE,"Data Seq. %u:\t%u",dataitem_count,sys_rand32_get());
                buf->len = bytes_written; 
                dataitem_count++;
                k_fifo_put(&my_fifo,buf);
        }
        LOG_INF("Producer: Data Items Generated: %u",data_number);
        k_msleep(PRODUCER_SLEEP_TIME_MS);
    }
```
**从FIFO读取数据项**
在 `consumer_func()` 函数中添加
```c
while (1) {
	struct data_item_t *rec_item;
	rec_item = k_fifo_get(&my_fifo, K_FOREVER);
	LOG_INF("Consumer: %s\tSize: %u",rec_item->data,rec_item->len);
	k_free(rec_item);
}
```
定义线程
```c
/* Stack size for both the producer and consumer threads */
#define STACKSIZE		 2048
#define PRODUCER_THREAD_PRIORITY 6
#define CONSUMER_THREAD_PRIORITY 7

K_THREAD_DEFINE(producer, STACKSIZE, producer_func, NULL, NULL, NULL, PRODUCER_THREAD_PRIORITY, 0,
		0);
K_THREAD_DEFINE(consumer, STACKSIZE, consumer_func, NULL, NULL, NULL, CONSUMER_THREAD_PRIORITY, 0,
		0);
```