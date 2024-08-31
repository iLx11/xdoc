## 包配置
接收与发送的包配置需要相同，length 需要按所发的字节调整
**无线数据包包含以下字段：前导码(PREAMBLE)、地址(ADDRESS)、S0、长度(LENGTH)、S1、有效载荷(PAYLOAD)和CRC。**
Radio数据包的内容如第307页的“On air packet layout（空中包结构）”所示。Radio数据包中的不同字段按如下顺序从左到右发送：
![Pasted image 20240429092208.png](https://picr.oss-cn-qingdao.aliyuncs.com/img/Pasted%20image%2020240429092208.png)
图中未显示静态有效负载附加项（其长度在**STATLEN**中定义，在标准BLE数据包中为0字节长）。静态有效负载附加项在有效负载和CRC字段之间发送。无线电设备按照上面所示的顺序从左到右发送数据包中的不同字段。前导码将以最低有效位优先(LSB)在空中发送。
前导码以最低有效位优先在空中发送。**前导码的大小取决于MODE寄存器中选择的模式：**

- 对于**MODE**=Ble_ 1Mbit以及所有Nordic专用操作模式（**MODE**=Nrf_1Mbit和**MODE**=Nrf_2Mbit），前置码为一个字节，**PCNF0**寄存器中的**PLEN**字段必须相应的设置。如果地址的第一位为0，则前导码将设置为0xAA，否则前导码会设置为0x55。
- 对于**MODE**=Ble_2Mbit，必须通过**PCNF0**寄存器中的**PLEN**字段将前导码设置为2字节长。如果地址的第一位为0，则前导码将设置为0xAAAA，否则前导码会设置为0x5555。
- 对于**MODE**=Ble_LR125Kbit和**MODE**=Ble_LR500Kbit，前导码是0x3C重复10次。
- 对于**MODE**=Ieee802154_250Kbit，前导码长度为4字节，并设置为全零。
### 空中包格式
- ADDRESS和PAYLOAD字段在空中传输的字节顺序始终是最低有效**字节**优先，而CRC字段是最高有效**字节**优先。ADDRESS字段总是在空中首先发送和接收最低有效**位**。CRC字段总是首先发送和接收最高有效**位**。
- S0、LENGTH、S1和PAYLOAD字段的位序，即发送和接收位的顺序，可通过**PCNF1**中的**ENDIAN**进行配置。
- S0+LENGTH+S1+PAYLOAD+static add-on 是存储在RAM中的数据包，PACKETPTR寄存器指向的RAM空间分布应该也是这样的
- S0、LENGTH和S1字段的大小可以分别通过**PCNF0**中的**S0LEN**、**LFLEN**和**S1LEN**单独配置。如果这些字段中的任何一个被配置为长度小于8位，则使用字段中最低有效位。
- S0，LENGTH，S1是可选部分，它们的长度分别由PCNF0.S0LEN，PCNF0.LFLEN ，PCNF0.S1LEN决定，大小端由PCNF1.ENDIAN控制
- **S0 S1都可以设置为0**，就不用管它们，LENGTH是4bit的，但也会占用一个Byte的RAM空间，**所以PACKETPTR指向的发送或接收RAM对应Byte0即为这一包数据包的长度（STATLEN = 0下的情况）**
- 如果S0、LENGTH或S1的长度为零，则该字段将在内存中省略，否则每个字段将表示为一个单独的**字节**，而不管它们的空中数据包中的位数。
- 与**MAXLEN**的配置无关，S0、LENGTH、S1和PAYLOAD的组合长度不能超过258字节。
### 地址配置
空中无线电地址字段(ADDRESS)由两部分组成，基址字段(BASE)和地址前缀字段(PREFIX)。
基址字段的大小可通过**PCNF1**中的**BALEN**进行配置。如果**BALEN**小于4，基址将从最低有效字节截断。请参阅第308页的“Definition of logical addresses（逻辑地址定义）”。
空中地址在**BASEn**和**PREFIXn**寄存器中定义，只有在写入这些寄存器时，用户才能与实际的空中地址相关。对于其他无线电地址寄存器，如**TXADDRESS**、**RXADDRESS**和**RXMATCH**寄存器，使用范围从0到7的逻辑无线电地址。空中无线电地址和逻辑地址之间的关系在第308页的“Definition of logical addresses（逻辑地址定义）”中描述。
### CRC
Radio中的CRC生成器计算整个包的CRC时不包括前导码字段。如果需要，地址字段也可以从CRC计算中删除。
CRC多项式是可配置的，如第309页上n位CRC的CRC生成所示，其中**CRCPOLY**寄存器中的位0对应于X0，位1对应于X1等等。
CRC是通过CRC生成器串行馈送数据包来计算的。在通过CRC生成器对数据包计时之前，CRC生成器的锁存器b0到bn将用**CRCINIT**寄存器中指定的预定义值初始化。当通过CRC生成器对整个数据包计时时，锁存器b0到bn将保存生成的CRC。Radio在传输和接收期间都将使用该值，但CPU在任何时候都无法读取该值。然而，**无论接收到的CRC是否通过校验，CPU都可以通过RXCRC寄存器读取接收到的CRC。**
**在接收到包括CRC的整个数据包后，如果未检测到CRC错误，则Radio将生成CRCOK事件，或者如果检测到CRC错误，则生成CRCERROR事件。**
**在接收到数据包后，可以从CRCSTATUS寄存器读取CRC校验的状态。**

### Radio状态
任务**TASK**和事件**EVENT**用于控制Radio的工作状态。
Radio可以输入下表所述的状态。

| 状态        | 描述                           |
| --------- | ---------------------------- |
| DISABLED  | Radio内部没有任何操作，功耗最低           |
| RXRU      | Radio正在升高功率准备接收              |
| RXIDLE    | Radio已经准备好开始接收               |
| RX        | 接收已开始，正在监视RXAddress寄存器中启用的地址 |
| TXRU      | Radio正在升高功率准备传输              |
| TXIDLE    | Radio已经准备好开始传输               |
| TX        | Radio正在传输数据包                 |
| RXDISABLE | Radio正在关闭接收                  |
| TXDISABLE | Radio正在关闭发送                  |

![](https://picr.oss-cn-qingdao.aliyuncs.com/img/Pasted%20image%2020240428181101.png)

**连续接收**:
RXEN->RXRU->READY事件->START任务->ADDRESS事件->PAYLOAD事件->END事件->DELAY->START任务->ADDRESS事件->PAYLOAD事件->END事件->DISABLE任务->DISBALED事件，

### 接收信号强度指示器
Radio实现了一种测量接收信号功率的机制。该功能被称为接收信号强度指示器（received signal strength indicator-RSSI）。
RSSI被连续测量并使用单极IIR滤波器对其值进行滤波。在信号电平变化后，RSSI将在大约  `RSSI settle`   后稳定下来。
通过使用**RSSISTART**任务开始接收信号强度的采样。可以从**RSSISAMPLE**寄存器读取采样。
RSSI的采样周期由  `RSSI`   定义。**RSSISAMPLE**将在该采样周期之后保持滤波后的接收信号强度。

为了使RSSI采样有效，必须在接收模式（**RXEN**任务）下启用Radio，并且必须开始接收（**READY**事件后的**START**任务）。
### RADIO 初始化
```c
void radio_configure() {
    // Radio config
    // 发射功率
    NRF_RADIO->TXPOWER   = (RADIO_TXPOWER_TXPOWER_0dBm << RADIO_TXPOWER_TXPOWER_Pos);
    // 频点
    NRF_RADIO->FREQUENCY = 7UL;  // Frequency bin 7, 2407MHz
    // 空中速率
    NRF_RADIO->MODE      = (RADIO_MODE_MODE_Nrf_1Mbit << RADIO_MODE_MODE_Pos);

    // Radio address config
    NRF_RADIO->PREFIX0 =
        ((uint32_t)swap_bits(0xC3) << 24) // Prefix byte of address 3 converted to nRF24L series format
      | ((uint32_t)swap_bits(0xC2) << 16) // Prefix byte of address 2 converted to nRF24L series format
      | ((uint32_t)swap_bits(0xC1) << 8)  // Prefix byte of address 1 converted to nRF24L series format
      | ((uint32_t)swap_bits(0xC0) << 0); // Prefix byte of address 0 converted to nRF24L series format

    NRF_RADIO->PREFIX1 =
        ((uint32_t)swap_bits(0xC7) << 24) // Prefix byte of address 7 converted to nRF24L series format
      | ((uint32_t)swap_bits(0xC6) << 16) // Prefix byte of address 6 converted to nRF24L series format
      | ((uint32_t)swap_bits(0xC4) << 0); // Prefix byte of address 4 converted to nRF24L series format

    NRF_RADIO->BASE0 = bytewise_bitswap(0x01234567UL);  // Base address for prefix 0 converted to nRF24L series format
    NRF_RADIO->BASE1 = bytewise_bitswap(0x89ABCDEFUL);  // Base address for prefix 1-7 converted to nRF24L series format

    NRF_RADIO->TXADDRESS   = 0x00UL;  // Set device address 0 to use when transmitting
    NRF_RADIO->RXADDRESSES = 0x01UL;  // Enable device address 0 to use to select which addresses to receive

    // Packet configuration
    NRF_RADIO->PCNF0 = (PACKET_S1_FIELD_SIZE     << RADIO_PCNF0_S1LEN_Pos) |
                       (PACKET_S0_FIELD_SIZE     << RADIO_PCNF0_S0LEN_Pos) |
                       (PACKET_LENGTH_FIELD_SIZE << RADIO_PCNF0_LFLEN_Pos); //lint !e845 "The right argument to operator '|' is certain to be 0"

    // Packet configuration
    NRF_RADIO->PCNF1 = (RADIO_PCNF1_WHITEEN_Disabled << RADIO_PCNF1_WHITEEN_Pos) |
                       (RADIO_PCNF1_ENDIAN_Big       << RADIO_PCNF1_ENDIAN_Pos)  |
                       (PACKET_BASE_ADDRESS_LENGTH   << RADIO_PCNF1_BALEN_Pos)   |
                       (PACKET_STATIC_LENGTH         << RADIO_PCNF1_STATLEN_Pos) |
                       (PACKET_PAYLOAD_MAXSIZE       << RADIO_PCNF1_MAXLEN_Pos); //lint !e845 "The right argument to operator '|' is certain to be 0"

    // CRC Config
    NRF_RADIO->CRCCNF = (RADIO_CRCCNF_LEN_Two << RADIO_CRCCNF_LEN_Pos); // Number of checksum bits
    NRF_RADIO->CRCINIT = 0xFFFFUL;   // Initial value
    NRF_RADIO->CRCPOLY = 0x11021UL;  // CRC poly: x^16 + x^12^x^5 + 1
    if ((NRF_RADIO->CRCCNF & RADIO_CRCCNF_LEN_Msk) == (RADIO_CRCCNF_LEN_Two << RADIO_CRCCNF_LEN_Pos))
    {
        NRF_RADIO->CRCINIT = 0xFFFFUL;   // Initial value
        NRF_RADIO->CRCPOLY = 0x11021UL;  // CRC poly: x^16 + x^12^x^5 + 1
    }
    else if ((NRF_RADIO->CRCCNF & RADIO_CRCCNF_LEN_Msk) == (RADIO_CRCCNF_LEN_One << RADIO_CRCCNF_LEN_Pos))
    {
        NRF_RADIO->CRCINIT = 0xFFUL;   // Initial value
        NRF_RADIO->CRCPOLY = 0x107UL;  // CRC poly: x^8 + x^2^x^1 + 1
    }
}
```
### 发送包
```c
#define PACKET_SIZE 10
static uint8_t packet[PACKET_SIZE];

int main(void){
	NRF_RADIO->PACKETPTR = (uint32_t)& packet[0];
}

void send_packet() {
    // RADIO has ramped up and is ready to be started
    NRF_RADIO->EVENTS_READY = 0U;
    // Enable RADIO in TX mode
    NRF_RADIO->TASKS_TXEN   = 1;
    while (NRF_RADIO->EVENTS_READY == 0U)
    {
        // wait
    }
    // Packet sent or received
    NRF_RADIO->EVENTS_END  = 0U;
    // Start RADIO
    NRF_RADIO->TASKS_START = 1U;
    while (NRF_RADIO->EVENTS_END == 0U)
    {
        // wait
    }
    NRF_LOG_INFO("The packet was sent");
    APP_ERROR_CHECK(err_code);
    // RADIO has been disabled
    NRF_RADIO->EVENTS_DISABLED = 0U;
    // Disable radio
    NRF_RADIO->TASKS_DISABLE = 1U;
    while (NRF_RADIO->EVENTS_DISABLED == 0U)
    {
        // wait
    }
}

```
### 接收包
```c
#define PACKET_SIZE 10
static uint8_t packet[PACKET_SIZE];

int main(void){
	NRF_RADIO->PACKETPTR = (uint32_t)& packet[0];
}

uint32_t read_packet()
{
    uint32_t result = 0;
    NRF_RADIO->EVENTS_READY = 0U;
    NRF_RADIO->TASKS_RXEN = 1U;
    while (NRF_RADIO->EVENTS_READY == 0U) {}
    
    NRF_RADIO->EVENTS_END = 0U;
    NRF_RADIO->TASKS_START = 1U;
    while (NRF_RADIO->EVENTS_END == 0U) {}
	// CRC status
    if (NRF_RADIO->CRCSTATUS == 1U) {
        result = packet;
    }
    
    NRF_RADIO->EVENTS_DISABLED = 0U;
    NRF_RADIO->TASKS_DISABLE = 1U;
    while (NRF_RADIO->EVENTS_DISABLED == 0U) {}
    return result;
}
```
## 中断
### 配置
```c
void read_test() {
  // uint32_t result = 0;
  NRF_RADIO->EVENTS_READY = 0U;
  // Enable radio and wait for ready
  NRF_RADIO->TASKS_RXEN = 1U;

  while (NRF_RADIO->EVENTS_READY == 0U) {
    // wait
  }
  NRF_RADIO->EVENTS_END = 0U;
  // Start listening and wait for address received event
  NRF_RADIO->TASKS_START = 1U;
}

void radio_irq_init(void) {
  //   NRF_RADIO->EVENTS_DISABLED = 0;
  //   NRF_RADIO->EVENTS_READY = 0;
  NRF_RADIO->EVENTS_END = 0;
  // 包地址赋值
  NRF_RADIO->PACKETPTR = (uint32_t)& packet[0];
  // use shortscut
  NRF_RADIO->SHORTS   = RADIO_SHORTS_END_START_Msk;
  NRF_RADIO->INTENSET = RADIO_INTENCLR_END_Msk;
  NVIC_ClearPendingIRQ(RADIO_IRQn);
  // NVIC_SetPriority(RADIO_IRQn, 1);
  NVIC_EnableIRQ(RADIO_IRQn);
  read_test();
}
```
### 中断回调
```c
// 中断回调
void RADIO_IRQHandler(void) {
  NRF_LOG_INFO("Packet was received");
  if (NRF_RADIO->EVENTS_READY == 1) {
    NRF_RADIO->EVENTS_READY = 0;
  }

  if (NRF_RADIO->EVENTS_END == 1) {
    if (NRF_RADIO->CRCSTATUS == 1U) {
	     NRF_LOG_INFO("LEN ==> %u", packet[0]);
	     NRF_LOG_HEXDUMP_INFO(packet + 1, packet[0]);
    }
    NRF_RADIO->EVENTS_END = 0U;
    /* 
	    Start listening and wait for address received event
	    如果设置了 shortcut 将不用配置标志位
    */
    NRF_RADIO->TASKS_START = 1U;
    // reset
    NRF_RADIO->EVENTS_CRCOK = 0;
    NRF_RADIO->EVENTS_CRCERROR = 0;
  }

  if (NRF_RADIO->EVENTS_PAYLOAD == 1) {
    NRF_RADIO->EVENTS_PAYLOAD = 0;
  }
}

```