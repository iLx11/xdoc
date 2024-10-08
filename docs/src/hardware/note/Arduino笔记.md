---
title: Arduino笔记
date: 2022-08-16 13:19:03
tags:
categories: 
classes: 笔记 
---

### 点亮led灯

##### io输入

```c
//int deng = 2;                        //IO2（D4）
int deng = 14;                       //IO14（D5）

void setup() {
  pinMode(deng, OUTPUT);             //设置指定io为输出模式
  digitalWrite(deng, 0);             //初始化为低电平，关闭灯状态
  delay(3000);                       //先暂停3秒钟，保持关闭状态

//  digitalWrite(deng, HIGH); 
//  digitalWrite(deng, LOW);
}

void loop() {
  digitalWrite(deng, 1);              //置引脚高电平，点亮LED
}
```

#####  io输出

```c
  pinMode(button,INPUT_PULLUP);      //设置按钮引脚为上拉模式
  pinMode(deng, OUTPUT);             //设置指定io为输出模式
  digitalWrite(deng, 0);             //初始化为低电平，关闭灯状态
```

```c
if(digitalRead(button)==0){        //如果读取到按钮引脚为低电平，视为按钮被按下
    digitalWrite(deng, 1);           //置引脚高电平，点亮LED
  }
```

### 串口监视器

```c
void setup(){  
Serial.begin(115200);             //开启串口监视器，设置波特率115200
  Serial.println("");               //打印输出一个空换行
  Serial.println("程序开始运行");    //打印输出一句话
}
```

### 模拟输出

```c
  for(int i=0;i<=1023;i++){           //模拟输出0-1023，对应电源电压0V-5V
    analogWrite(deng, i);             //i的值不断变大，LED亮度逐渐提高
    delay(1);                         //暂停时间，单位毫秒，用来延缓过程，展现效果
  }
```

##### 舵机

```c
#include <Servo.h>                  //加载舵机库         
Servo myservo;                      //定义一个舵机对象
int _servo = 14;                    //IO14（D5）
void setup() {
  myservo.attach(_servo);           //设置指定io为舵机
  myservo.write(0);                 //开机设置舵机为0度
}

void loop() {
  for(int i=0;i<=90;i++){           //控制舵机角度由0度旋转到90度    
    myservo.write(i);               //i的值不断变大，角度偏转
    delay(50);                      //暂停时间，单位毫秒，用来延缓过程，展现效果
  }
  for(int i=90;i>=0;i--){           //控制舵机角度由90度返回到0度          
    myservo.write(i);               //i的值不断变小，角度偏转
    delay(50);                      //暂停时间，单位毫秒，用来延缓过程，展现效果
  }  
}
```

### 模拟输入

##### 读取电位器的输入

```c
int analogPin = A0;                     // 模拟引脚A0
int ledPin = 14;                        // LED引脚（D5）
void setup() {
//  Serial.begin(115200);
//  Serial.println();
  pinMode(ledPin, OUTPUT);
}

void loop() {
  //ESP8266的模拟输入是0V-1V，区别于UNO和Nano的0V-5V
  //ESP8266的模拟输入和模拟输出一样也是0-1023，同样区别于UNO和Nano的0-255
  
  int analogValue = analogRead(analogPin);    //整形变量接收模拟值  
  analogWrite(ledPin, analogValue);           //把接收到的模拟值，设置为LED的模拟输出值，改变LED亮度
  delay(1);
  
//  delay(500);
//  Serial.println(analogValue);
}
```

### 变量

```c
bool bl=0;      //布尔值，0和1

byte be=1;      //一个字节存储8位无符号数，从0到255。

int  i=2;       //整数，占用2字节。整数的范围为-32,768到32,767

long l=3;       //长整数,占用4字节，从-2,147,483,648到2,147,483,647。 

float f=3.14;   //浮点型数据，就是有一个小数点的数字。

char c='a';     //一个字符

String s="hello world!";   //特殊类型，字符串，字符的集合，拥有丰富的处理函数，可以对数据判断分析

unsigned int ui=3;         //（无符号整型）与整型数据同样大小，占据2字节。它只能用于存储正数而不能存储负数，范围0-65,535

unsigned long ul=4;       //（无符号长整型）与标准长整型不同，无符号长整型无法存储负数，其范围从0-4,294,967,295

const int abc=1;          //const前缀为常量，这里定义了整形常量，常量的定义后，不能对它的值再去改变
```

### EEPROM储存

##### byte 与 bool 类型储存

```c
#include <EEPROM.h>         //加载EEPROM的库

bool is=1;                  //布尔类型值
byte byte_1=220;            //byte类型数值
char char_1= 'a';           //char字符 
```

```c
void setup(){

 EEPROM.begin(1024);                  //开启EEPROM，开辟1024个位空间 

  //1.读取与保存byte类型，bool类型值的0和1包含0-255内
  EEPROM.write(0,byte_1);              //给EEPROM 第0位，写入byte_1的值
  EEPROM.commit();                     //保存EEPROM改变，区别于uno和nano，esp8266需要使用此函数   保存EEPROM 
  byte byte_2=EEPROM.read(0);          //用byte类型读取接收EEPROM的值
  Serial.print("byte_2的值："); 
  Serial.println(byte_2);              //打印输出byte_2的值,等同于byte_1的值
  
  //2.读取与保存char类型,和byte类型大致一样，读取时需要转换一下类型
  EEPROM.write(0,char_1);              //给EEPROM 第0位，写入char_1的值
  EEPROM.commit();                     //保存EEPROM改变，区别于uno和nano，esp8266需要使用此函数   保存EEPROM 
  char char_2=char(EEPROM.read(0));    //如果用char类型读取，需要转换接收EEPROM的值的类型
  Serial.print("char_2的值："); 
  Serial.println(char_2);              //打印输出abc_2的值,等同于char_1的值
}
```

##### int 型储存

```c
#include <EEPROM.h> 
int a=1234;
//使用union结构，多个不同类型变量，共用一个内存空间
union int_value{        //int 类型，定义一个结构
  int i;                //int类型成员变量
  byte b[2];            //byte类型数组成员
};
int_value e_int;        //定义一个结构对象
void setup() {
  Serial.begin(115200); 
  Serial.println("");   
  EEPROM.begin(1024);         //开启EEPROM，开辟1024个位空间

  //一个字节保存不了的int，我们把它拆为2个字节保存，最后可以再组装回来，实现对int类型的保存和读取
  
  e_int.i=a;                       //给e_int.i重新赋值为a
  EEPROM.write(0,e_int.b[0]);     //给EEPROM 第0位，写入e_int.b[0]的值
  EEPROM.write(1,e_int.b[1]);     //给EEPROM 第1位，写入e_int.b[1]的值
  EEPROM.commit();                //保存EEPROM改变
  byte a1=EEPROM.read(0);         //a1获取EEPROM 0 位的值
  byte a2=EEPROM.read(1);         //a2获取EEPROM 1 位的值
  e_int.b[0]=a1;
  e_int.b[1]=a2;
  Serial.print("e_int.i的值："); 
  Serial.println(e_int.i);        //这里打印输出的e_int.i，其实就是间接的a

  //最后说一下，long类型和int一样，用union类型操作，只是把成员改一下，long占用4个字节，读取和写入对应的一样的道理，这里就不再展示了
  //float类型和long类型一样
}

void loop() {

}
```

##### string 类型

```c
#include <EEPROM.h> 
String str="hello";                        //String字符串

void setup() {
  Serial.begin(115200); 
  Serial.println("");   
  EEPROM.begin(1024);                      //开启EEPROM，开辟1024个位空间
  
  //String类型，更会复杂，需要加点技巧，实现保存和读取
  
  Serial.print("str的值：");
  Serial.println(str);                     //先打印输出初始的str字符串的值 
  str="hello world";                       //重新给str字符串赋值
  set_String(0,1,str);           		  //保存str字符串到EEPROM(长度位，起始位，字符串)
  String s=get_String(EEPROM.read(0),1);  //读取EEPROM里的str字符串(所取位数，起始位)

  Serial.print("s的值："); 
  Serial.println(s);                      //打印输出此时的s对应str字符串的值  
}

void loop() {

}

//用EEPROM的a位保存字符串的长度，字符串的从EEPROM的b位开始保存，str为要保存的字符串
void set_String(int a,int b,String str){
  EEPROM.write(a, str.length());//EEPROM第a位，写入str字符串的长度
  //通过一个for循环，把str所有数据，逐个保存在EEPROM
  for (int i = 0; i < str.length(); i++){
    EEPROM.write(b + i, str[i]);
  }
  EEPROM.commit();//执行保存EEPROM
}

//获取指定EEPROM位置的字符串，a是字符串长度，b是起始位，从EEPROM的b位开始读取
String get_String(int a, int b){ 
  String data = "";
  //通过一个for循环，从EEPROM中逐个取出每一位的值，并连接起来
  for (int i = 0; i < a; i++){
    data += char(EEPROM.read(b + i));
  }
  return data;
}

```

### AP模式

```c
#include <ESP8266WiFi.h>      
const char *ssid = "";             //AP的SSID（WiFi名字）
const char *password = "";            //AP的密码
int led=14;                                   //设置指示灯io，D5
void setup() {
  Serial.begin(115200);
  Serial.println("");
  pinMode(led,OUTPUT);
  digitalWrite(led,0);  
  WiFi.mode(WIFI_AP);                         //设置为AP模式
  WiFi.softAP(ssid, password);                //配置AP信息，并开启AP
  
  //默认IP为192.168.4.1 , 这里我自定义设置AP的ip段
  IPAddress softLocal(192,168,1,1);           //IP地址，用以设置IP第4字段
  IPAddress softGateway(192,168,1,1);         //IP网关，用以设置IP第3字段
  IPAddress softSubnet(255,255,255,0);
  //配置自定义的IP信息
  WiFi.softAPConfig(softLocal, softGateway, softSubnet);  
  IPAddress myIP = WiFi.softAPIP();           //用变量myIP接收AP当前的IP地址
  Serial.println(myIP);                       //打印输出myIP的IP地址

}
void loop() { 
  int gotoAP=WiFi.softAPgetStationNum();    //获取当前连接到AP的设备数量  
  //如果没有设备连接到AP，熄灭LED灯，否则点亮LED灯
  if(gotoAP==0){                            //连接数为0，说明AP没有设备连接 
    digitalWrite(led,0);                    //熄灭LED灯
  }else{
    digitalWrite(led,1);                    //点亮LED灯
  }  
}

```

### 超声波模块

```c
#include "SR04.h"                 //超声波库
int E=4;                          //IO4(D2),Echo  获取返回的超声波时间差
int T=5;                          //IO5(D1),Trig  给超声波模块发送指令
SR04 sr04 = SR04(E,T);            //配置超声波的IO引脚
int deng = 14;                    //IO14（D5），LED指示灯 
void setup() {
  Serial.begin(115200);
  Serial.println("");
  pinMode(deng, OUTPUT);          //设置指定io为输出模式
  digitalWrite(deng, 0);          //初始化为低电平，关闭灯状态
}

void loop() {
  int a=sr04.Distance();          //获取当前距离值，返回给a
  //如果距离小于等于10厘米，点亮led，如果距离大于10厘米，再次熄灭led
  if(a<=10){
    digitalWrite(deng, 1); 
  }
  else{
    digitalWrite(deng, 0); 
  }
  //打印输出拼接格式，例如：  距离：24厘米
  Serial.print("距离:");
  Serial.print(a);
  Serial.println("厘米");
  delay(500);
} 
```

## oled显示屏

#### Adafruit库

```c
#include <Wire.h>  
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#define SDA_PIN 8

#define SCL_PIN 9

Adafruit_ssd1306syp display(SDA_PIN,SCL_PIN);

#define SCREEN_WIDTH 128 // 设置OLED宽度,单位:像素

#define SCREEN_HEIGHT 64 // 设置OLED高度,单位:像素
 
// 自定义重置引脚,虽然教程未使用,但却是Adafruit_SSD1306库文件所必需的
#define OLED_RESET 3
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
```



```c
 // 初始化OLED并设置其IIC地址为 0x3C
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
```

```c
display.update(); //画面更新，也就是保存更改，在你制定显示内容后一定要调用此函数才能显示

display.clear(); //清空显示

display.setTextColor(WHITE); //设置颜色（白色，取决于你的显示屏） display.setTextColor(BLACK, WHITE); //反白，白底黑字
display.setCursor(0, 0); //设置光标位置

display.setTextSize(1); //设置字号

display.print("123"); //打印文字，不换行

display.println(“123”); //打印文字，换行

display.println(0xDEADBEEF, HEX); //以HEX格式输出

display.drawLine(0, 0, 127, 63,WHITE); 画线，从坐标（0,0)画直线到坐标(127,63)
    
display.display();
```

##### 显示汉字

```c
#define SCREEN_WIDTH 128 // 设置OLED宽度,单位:像素
#define SCREEN_HEIGHT 64 // 设置OLED高度,单位:像素
#define OLED_RESET 3
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
static const unsigned char PROGMEM hans_ni[] = {
    0x08,0x80,0x08,0x80,0x08,0x80,0x11,0xFE,0x11,0x02,0x32,0x04,0x34,0x20,0x50,0x20,
0x91,0x28,0x11,0x24,0x12,0x24,0x12,0x22,0x14,0x22,0x10,0x20,0x10,0xA0,0x10,0x40,/*"你",0*/
};

static const unsigned char PROGMEM hans_hao[] = {
    0x10,0x00,0x10,0xFC,0x10,0x04,0x10,0x08,0xFC,0x10,0x24,0x20,0x24,0x20,0x25,0xFE,
0x24,0x20,0x48,0x20,0x28,0x20,0x10,0x20,0x28,0x20,0x44,0x20,0x84,0xA0,0x00,0x40,/*"好",0*/
};

void loop()
{
    hans_display_0();
}
 
void hans_display_0(void)
{
    // 显示之前清屏
    display.clearDisplay();
 
    // 显示文字 (左上角x坐标,左上角y坐标, 图形数组, 图形宽度像素点, 图形高度像素点, 设置颜色)
    display.drawBitmap(20 * 1, 16, hans_ni, 16, 16, 1);
    display.drawBitmap(20 * 2, 16, hans_hao, 16, 16, 1);
 
    //显示图形
    display.display();
    delay(2000);
}
```

<img src="https://gitee.com/iLx1/resource-img/raw/master/Snipaste_2022-02-27_20-28-11.png" style="zoom: 50%; float: left;" />

<img src="https://gitee.com/iLx1/resource-img/raw/master/Snipaste_2022-02-27_20-31-23.png" alt="Snipaste_2022-02-27_20-31-23" style="zoom: 50%; float: left;" />

<img src="https://gitee.com/iLx1/resource-img/raw/master/Snipaste_2022-02-27_20-32-03.png" alt="Snipaste_2022-02-27_20-32-03" style="zoom: 50%; float:left;" />

##### 图片

需要bmp格式的单色图片

#### U8库

```c
#include <U8g2lib.h>
#include <Wire.h>
```

##### 定义接口

```c
#define SCL 5
#define SDA 4
U8G2_SSD1306_128X64_NONAME_F_SW_I2C u8g2(U8G2_R0, /*clock=*/SCL, /*data=*/SDA, /*reset=*/U8X8_PIN_NONE);
```

setup

```c
  u8g2.begin();
  u8g2.setFont(u8g2_font_unifont_t_symbols);
  u8g2.firstPage();
  u8g2.enableUTF8Print();//enable UTF8
  u8g2.setFont(u8g2_font_wqy12_t_gb2312b);//设置中文字符集
  do
  {
    u8g2.setCursor(0, 15); //指定显示位置
    u8g2.print("WELCOME"); //使用print来显示字符串
    u8g2.setCursor(0, 30); //指定显示位置
    u8g2.print("MASTER"); //使用print来显示字符串
  } while (u8g2.nextPage());
```

更多使用方法

https://www.bilibili.com/read/cv15542275?spm_id_from=333.788.b_636f6d6d656e74.16



# 建立web服务器，用页面控制硬件

```c
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266WebServer.h>
#include <FS.h>  

ESP8266WiFiMulti wifiMulti;     // 建立ESP8266WiFiMulti对象

ESP8266WebServer esp8266_server(80);    // 建立网络服务器对象，该对象用于响应HTTP请求。监听端口（80）
```

##### 连接wifi

```c
wifiMulti.addAP("lnettwo", "lhl15352319937"); // 将需要连接的一系列WiFi ID和密码输入这里
```

##### 判断wifi是否连接

```c
int i = 0;  
  while (wifiMulti.run() != WL_CONNECTED) { // 尝试进行wifi连接。
    delay(1000);
    Serial.print(i++); Serial.print(' ');//打印连接时长
  }
```

##### 连接成功后打印ip

```c
 // WiFi连接成功后将通过串口监视器输出连接成功信息 
  Serial.println('\n');
  Serial.print("Connected to ");
  Serial.println(WiFi.SSID());              // 通过串口监视器输出连接的WiFi名称
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());           // 通过串口监视器输出ESP8266-NodeMCU的IP
```

##### 启动闪存系统

Serial Peripheral Interface Flash File System（SPIFFS）

```c++
#include <FS.h>
```

```c
 if(SPIFFS.begin()){                       // 启动闪存文件系统
    Serial.println("SPIFFS Started.");
  } else {
    Serial.println("SPIFFS Failed to Start.");
  }
```

[安装教程](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/spiffs/upload-files/)

上传代码前需要点ESP8266 Sketch  Data upload

#### esp8266_server服务器对象

```c
esp8266_server.on("/LED-Control", handleLEDControl); // 告知系统如何处理/LED-Control请求

```

同时html包含

```html
<form action="LED-Control"><input type="submit" value="LED控制"></form>
```

```html
<form action="/LED-Control">
		<input type="text" name="value1">
		</br>
		<input type="text" name="value2">
		</br>
		<input type="submit" value="OK">
	</form>
```

#### 通过Ajax控制及传输数据

```c
  esp8266_server.on("/setLED", handleLED);
  esp8266_server.on("/readADC", handleADC);
```

```c
void handleLED() {
 String ledState = "OFF";
 String LED_State = esp8266_server.arg("LEDstate"); //参考xhttp.open("GET", "setLED?LEDstate="+led, true);
 Serial.println(LED_State);
 
 if(LED_State != "0"){
  digitalWrite(LED_BUILTIN,LOW); //LED 点亮
  ledState = "ON"; //反馈参数
 } else {
  digitalWrite(LED_BUILTIN,HIGH); //LED 熄灭
  ledState = "OFF"; //反馈参数
 }
 esp8266_server.send(200, "text/plain", ledState); //发送网页
}


void handleADC() {
 int a = analogRead(A0);
 String adcValue = String(a);
 
 esp8266_server.send(200, "text/plain", adcValue); //发送模拟输入引脚到客户端ajax请求
}
```

##### 在js中

```js
<button type="button" onclick="sendData(1)">点亮 LED</button>
<button type="button" onclick="sendData(0)">关闭 LED</button><br>
```

```js
//-------------js原生方法----------------------------------------------------------------
function sendData(led) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("LEDState").innerHTML =
      this.responseText;
    }
  };
  xhttp.open("GET", "setLED?LEDstate="+led, true);
  xhttp.send();
}
//------------jq方法----------------------------------------------------------------------
 function sendData(led){
    $.ajax({
      type:'GET',
      url:'setLED',
      data:{
        LEDstate:led,
      },
      success:(res)=>{
        if(res.status == 200){
          console.log(res);
          document.getElementById("LEDState").innerHTML = res;
          var text = '灯已打开';
          if(res == "ON"){
          transText(text);
        }else{
        text = '灯已关闭';
          transText(text);
        }
        }
      },
    })
 }

//结合文本转语音
 function transText(text){
      var url = "http://tts.youdao.com/fanyivoice?le=zh&keyfrom=speaker-target&word='" +encodeURI(text);
      new Audio(url).play();
    }
setInterval(function() {
  // Call a function repetatively with 2 Second interval
  getData();
}, 2000); //2000mSeconds update rate
 
function getData() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("ADCValue").innerHTML =
      this.responseText;
    }
  };
  xhttp.open("GET", "readADC", true);
  xhttp.send();
}
```

##### 处理GET请求

```c
   	esp8266_server.on("/ledHandle", ledHandle);
	esp8266_server.onNotFound(handleUserRequet);      // 告知系统如何处理用户请求

 	 esp8266_server.begin();                           // 启动网站服务
 	 Serial.println("HTTP server started");
```

##### 处理用户请求

```c
void loop(void) {
  esp8266_server.handleClient();                    // 处理用户请求
}
```

#### 处理/LED-Control请求  

```c
void handleLEDControl(){
   bool ledStatus = digitalRead(LED_BUILTIN);     // 此变量用于储存LED状态     
   ledStatus == HIGH ? digitalWrite(LED_BUILTIN, LOW) : digitalWrite(LED_BUILTIN, HIGH);  // 点亮或者熄灭LED  
     
   esp8266_server.sendHeader("Location", "/LED.html");       
   esp8266_server.send(303);  
}
```

#####   从浏览器发送的信息中获取控制数值（字符串格式）

```c
  String value1 = esp8266_server.arg("value1"); 
  String value2 = esp8266_server.arg("value2");
```

##### 获取数值后赋值

```c
// 从浏览器发送的信息中获取PWM控制数值（字符串格式）
  String ledPwm = esp8266_server.arg("ledPwm"); 

  // 将字符串格式的PWM控制数值转换为整数
  int ledPwmVal = ledPwm.toInt();

  // 实施引脚PWM设置
  analogWrite(LED_BUILTIN, ledPwmVal);
```

```c
 // 建立基本网页信息显示当前数值以及返回链接
  String httpBody = "value1: " + value1 + "<br> value2: " + value2 + "<p><a 			href=\"/LED.html\"><-LED Page</a></p>";           
  esp8266_server.send(200, "text/html", httpBody);
```



#### 处理用户浏览器的HTTP访问

```c
void handleUserRequet() {         
     
  // 获取用户请求网址信息
  String webAddress = esp8266_server.uri();

  // 通过handleFileRead函数处处理用户访问
  bool fileReadOK = handleFileRead(webAddress);

  // 如果在SPIFFS无法找到用户访问的资源，则回复404 (Not Found)
  if (!fileReadOK){                                                 
    esp8266_server.send(404, "text/plain", "404 Not Found"); 
  }
}
```

#### 处理浏览器HTTP访问

```c
bool handleFileRead(String path) {            //处理浏览器HTTP访问

  if (path.endsWith("/")) {                   // 如果访问地址以"/"为结尾
    path = "/index.html";                     // 则将访问地址修改为/index.html便于SPIFFS访问
  } 
    
  String contentType = getContentType(path);  // 获取文件类型
  
  if (SPIFFS.exists(path)) {                     // 如果访问的文件可以在SPIFFS中找到
    File file = SPIFFS.open(path, "r");          // 则尝试打开该文件
    esp8266_server.streamFile(file, contentType);// 并且将该文件返回给浏览器
    file.close();                                // 并且关闭文件
    return true;                                 // 返回true
  }
  return false;                                  // 如果文件未找到，则返回false
}
```

#### 获取文件类型

```c
// 获取文件类型
String getContentType(String filename){
  if(filename.endsWith(".htm")) return "text/html";
  else if(filename.endsWith(".html")) return "text/html";
  else if(filename.endsWith(".css")) return "text/css";
  else if(filename.endsWith(".js")) return "application/javascript";
  else if(filename.endsWith(".png")) return "image/png";
  else if(filename.endsWith(".gif")) return "image/gif";
  else if(filename.endsWith(".jpg")) return "image/jpeg";
  else if(filename.endsWith(".ico")) return "image/x-icon";
  else if(filename.endsWith(".xml")) return "text/xml";
  else if(filename.endsWith(".pdf")) return "application/x-pdf";
  else if(filename.endsWith(".zip")) return "application/x-zip";
  else if(filename.endsWith(".gz")) return "application/x-gzip";
  return "text/plain";
}
```

### DNS服务器

```c
#include <DNSServer.h>
```

```c
const char *ssid = "webcontrol";             //AP的SSID（WiFi名字）
const char *password = "12345678";            //AP的密码

const byte DNS_PORT = 53; //DNS服务端口号，一般为53
DNSServer dnsServer;
```

##### setup

```c
  IPAddress softLocal(192, 168, 3, 6);        //IP地址，用以设置IP第4字段
  IPAddress softGateway(192, 168, 3, 6);      //IP网关，用以设置IP第3字段
  IPAddress softSubnet(255, 255, 255, 0);

  WiFi.mode(WIFI_AP_STA);                 //设置为AP模式(热点)
  WiFi.softAPConfig(softLocal, softGateway, softSubnet);
  WiFi.softAP(ssid, password);

 dnsServer.start(DNS_PORT, "www.me.com", softLocal);
```

##### loop

```c
dnsServer.processNextRequest();//处理DNS请求服务
```

## UDP协

```c
//UDP定义
IPAddress sta_client;                        //保存sta设备的ip地址
unsigned int localUdp = 1234;     //监听端口
unsigned int remoteUdp = 4321;     //发送端口
unsigned int remoteUdp1 = 4322;     //发送端口
char comPacket[255];                 //数据缓存
WiFiUDP Udp;                        //定义udp
```

##### 初始化函数

```c
void udpBegin() {
  if (Udp.begin(localUdp)) { //启动Udp监听服务
    Serial.println("监听成功");
    //打印本地的ip地址，在UDP工具中会使用到
    //WiFi.localIP().toString().c_str()用于将获取的本地IP地址转化为字符串
    Serial.printf("现在收听IP：%s, UDP端口：%d\n", WiFi.localIP().toString().c_str(), localUdp);
  } else {
    Serial.println("监听失败");
  }
}
```

##### 发送接收函数

```c
//UDP发送函数
void sendBack(const char *buffer, int xx) {
  if (xx == 1) {
    Udp.beginPacket(remoteIp1, remoteUdp);//配置远端ip地址和端口
  } else if (xx == 2) {
    Udp.beginPacket(remoteIp2, remoteUdp);
  }
  //  Udp.write(buffer); //把数据写入发送缓冲区
  Udp.print(buffer);
  Udp.endPacket(); //发送数据
}
void udpDo() {
  //解析Udp数据包
  int packetSize = Udp.parsePacket();//获得解析包
  if (packetSize)//解析包不为空
  {
    //收到Udp数据包
    //Udp.remoteIP().toString().c_str()用于将获取的远端IP地址转化为字符串
    Serial.printf("收到来自远程IP：%s（远程端口：%d）的数据包字节数：%d\n", Udp.remoteIP().toString().c_str(), Udp.remotePort(), packetSize);

    // 读取Udp数据包并存放在incomingPacket
    int len = Udp.read(comPacket, 255);//返回数据包字节数
    if (len > 0)
    {
      comPacket[len] = 0;//清空缓存
      Serial.printf("UDP数据包内容为: %s\n", comPacket);//向串口打印信息

      //strcmp函数是string compare(字符串比较)的缩写，用于比较两个字符串并根据比较结果返回整数。
      //基本形式为strcmp(str1,str2)，若str1=str2，则返回零；若str1<str2，则返回负数；若str1>str2，则返回正数。
      if (strcmp(comPacket, "LED_OFF") == 0) // 命令LED_OFF
      {
        //        digitalWrite(LED_BUILTIN, HIGH); // 熄灭LED
        //        sendBack("LED has been turn off\n");
      }
      else if (strcmp(comPacket, "LED_ON") == 0) //如果收到LED_ON
      {
        //        digitalWrite(LED_BUILTIN, LOW); // 点亮LED
        //        sendBack("LED has been turn on\n");
      }
      else // 如果指令错误，调用sendCallBack
      {
        //        sendBack("Command Error!");
      }
    }
  }
}
```





## 闪存系统操作

##### 写入文件

```c
File dataFile = SPIFFS.open(file_name, "w");// 建立File对象用于向SPIFFS中的file对象写入信息

  dataFile.println("Hello IOT World.");       // 向dataFile写入字符串信息
  dataFile.close();                           // 完成文件写入后关闭文件
  Serial.println("Finished Writing data to SPIFFS");
```

##### 确认闪存中是否有file_name文件

```c
 **if** (SPIFFS.exists(file_name)){

  **Serial**.print(file_name);

  **Serial**.println(" FOUND.");

 } **else** {

  **Serial**.print(file_name);

  **Serial**.print(" NOT FOUND.");

 }
```

#####  建立File对象用于从SPIFFS中读取文件

```c
File dataFile = SPIFFS.open(file_name, "r"); 
```

##### 读取文件内容并且通过串口监视器输出文件信息

```c
 File dataFile = SPIFFS.open(file_name, "r"); 

**for**(int i=0; i<dataFile.size(); i++){

  **Serial**.print((char)dataFile.read());    //dataFile.read()将会读取dataFile文件内容

 }
```

##### 增加信息

```c
 File dataFile = SPIFFS.open(file_name, "a");// 建立File对象用于向SPIFFS中的file对象（即/notes.txt）写入信息
    dataFile.println("This is Appended Info."); // 向dataFile添加字符串信息
    dataFile.close();                           // 完成文件操作后关闭文件   
    Serial.println("Finished Appending data to SPIFFS");
```

##### 读取目录

```
String folder_name = "/taichi-maker";     //被读取的文件夹
```

```
 Dir dir = SPIFFS.openDir(folder_name); // 建立“目录”对象


 **while** (dir.next()) { // dir.next()用于检查目录中是否还有“下一个文件”

  **Serial**.println(dir.fileName()); // 输出文件名

 }
```

#### 从闪存中删除file_name文件

```c
if** (SPIFFS.remove(file_name)){

  **Serial**.print(file_name);

  **Serial**.println(" remove sucess");

 } **else** {

  **Serial**.print(file_name);

  **Serial**.println(" remove fail");
 }            
```

#### 显示闪存文件系统信息

```c
FSInfo fs_info;			//建立了FSInfo 对象，用于存储闪存状态信息
 
  // 闪存文件系统信息
  SPIFFS.info(fs_info);
 
  // 可用空间总和（单位：字节）
  Serial.print("totalBytes: ");     
  Serial.print(fs_info.totalBytes); 
  Serial.println(" Bytes"); 
 
  // 已用空间（单位：字节）
  Serial.print("usedBytes: "); 
  Serial.print(fs_info.usedBytes);
  Serial.println(" Bytes"); 
 
  // 最大文件名字符限制（含路径和'\0'）
  Serial.print("maxPathLength: "); 
  Serial.println(fs_info.maxPathLength);
 
  // 最多允许打开文件数量
  Serial.print("maxOpenFiles: "); 
  Serial.println(fs_info.maxOpenFiles);
 
  // 存储块大小
  Serial.print("blockSize: "); 
  Serial.println(fs_info.blockSize);
 
  // 存储页大小
  Serial.print("pageSize: ");
  Serial.println(fs_info.pageSize);
```

### 字符串转 char数组

```c
const char* aa = str.c_str();
```

### IP地址转字符串

```c
String aa = WiFi.localIP().toString().c_str();
```

