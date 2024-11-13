# cJSON

## 添加到工程

文件位于 **esp-idf\components\json\cJSON**

```cmake
file(GLOB_RECURSE SOURCES ./*.c)
idf_component_register(SRCS ${SOURCES}
                    INCLUDE_DIRS .
                    REQUIRES json
                    )
```

引入头文件

```c
#include "cJSON.h"
```

## 生成JSON数据

### 创建JSON结构体

```c
cJSON *pRoot = cJSON_CreateObject();                         // 创建JSON根部结构体
cJSON *pValue = cJSON_CreateObject();                        // 创建JSON子叶结构体
```

### 添加字符串类型数据

```c
cJSON_AddStringToObject(pRoot,"mac","65:c6:3a:b2:33:c8");    // 添加字符串类型数据到根部
cJSON_AddItemToObject(pRoot, "value",pValue);
cJSON_AddStringToObject(pValue,"day","Sunday");              // 添加字符串类型数据到子叶
```

###  添加整型数据

```c
cJSON_AddNumberToObject(pRoot,"number",2);                   // 添加整型数据到根部结构体
```

### 添加数组类型数据

#### 整型数组

```c
int hex[5]={51,15,63,22,96};
cJSON *pHex = cJSON_CreateIntArray(hex,5);                   // 创建整型数组类型结构体
cJSON_AddItemToObject(pRoot,"hex",pHex);                     // 添加整型数组到数组类型结构体
```

#### JSON对象数组

```c
cJSON * pArray = cJSON_CreateArray();                        // 创建数组类型结构体
cJSON_AddItemToObject(pRoot,"info",pArray);                  // 添加数组到根部结构体
cJSON * pArray_relay = cJSON_CreateObject();                 // 创建JSON子叶结构体
cJSON_AddItemToArray(pArray,pArray_relay);                   // 添加子叶结构体到数组结构体     
cJSON_AddStringToObject(pArray_relay, "relay", "on");        // 添加字符串类型数据到子叶结构体
```

### 格式化JSON对象

```c
char *sendData = cJSON_Print(pRoot);                        // 从cJSON对象中获取有格式的JSON对象
os_printf("data:%s\n", sendData);                            // 打印数据
```

### 生成的 json 数据

```c
{
    "mac": "65:c6:3a:b2:33:c8",
    "value": 
     {
        "day": "Sunday"                
     },
    "number": 2,
    "hex": [51,15,63,22,96],
    "info": 
    [
        {
            "relay": "on"        
        }
    ]
}
```

### 释放内存

```c
cJSON_free((void *) sendData);                             // 释放cJSON_Print ()分配出来的内存空间
cJSON_Delete(pRoot);                                       // 释放cJSON_CreateObject ()分配出来的内存空间
```

## 解析JSON数据

### 判断是否JSON格式

```c
// receiveData是要剖析的数据
//首先整体判断是否为一个json格式的数据
cJSON *pJsonRoot = cJSON_Parse(receiveData);
//如果是否json格式数据
if (pJsonRoot !=NULL)
{
    ···
}
```

### 解析字符串类型数据

```c
char bssid[23] = {0};
cJSON *pMacAdress = cJSON_GetObjectItem(pJsonRoot, "mac");    // 解析mac字段字符串内容
if (!pMacAdress) return;                                      // 判断mac字段是否json格式

if (cJSON_IsString(pMacAdress))                           // 判断mac字段是否string类型
{
    strcpy(bssid, pMacAdress->valuestring);               // 拷贝内容到字符串数组
}
```

### 解析子叶结构体

```c
char strDay[23] = {0};
cJSON *pValue = cJSON_GetObjectItem(pJsonRoot, "value");      // 解析value字段内容
if (!pValue) return;                                          // 判断value字段是否json格式

cJSON *pDay = cJSON_GetObjectItem(pValue, "day");         // 解析子节点pValue的day字段字符串内容
if (!pDay) return;                                        // 判断day字段是否json格式

if (cJSON_IsString(pDay))                             // 判断day字段是否string类型
{
    strcpy(strDay, pDay->valuestring);                // 拷贝内容到字符串数组
}
```

### 解析整型数组数据

```c
cJSON *pArry = cJSON_GetObjectItem(pJsonRoot, "hex");        // 解析hex字段数组内容
if (!pArry) return;                                          // 判断hex字段是否json格式
int arryLength = cJSON_GetArraySize(pArry);              // 获取数组长度
int i;
for (i = 0; i < arryLength; i++)
{                                                        // 打印数组内容
    os_printf("cJSON_GetArrayItem(pArry, %d)= %d\n",i,cJSON_GetArrayItem(pArry, i)->valueint);        
}
```

###  解析JSON对象数组数据

```c
cJSON *pArryInfo = cJSON_GetObjectItem(pJsonRoot, "info");   // 解析info字段数组内容
cJSON *pInfoItem = NULL;
cJSON *pInfoObj = NULL;
char strRelay[23] = {0};
if (!pArryInfo) return;                                      // 判断info字段是否json格式

int arryLength = cJSON_GetArraySize(pArryInfo);          // 获取数组长度
int i;
for (i = 0; i < arryLength; i++)
{
    pInfoItem = cJSON_GetArrayItem(pArryInfo, i);        // 获取数组中JSON对象
    if(NULL != pInfoItem)
    {
        pInfoObj = cJSON_GetObjectItem(pInfoItem,"relay");// 解析relay字段字符串内容   
        if(pInfoObj)
        {
            strcpy(strRelay, pInfoObj->valuestring);      // 拷贝内容到字符串数组
        }
    }                                                   
}
```

### 释放内存

```c
cJSON_Delete(pJsonRoot); 
```

