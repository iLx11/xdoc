#### 注册HBuilder X， 下载软件

#### 打开软件后登录

## 软件打包流程

### 新建项目

![](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20221024124001763.png)

#### 选择H5 APP

![image-20221024130243171](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20221024130243171.png)

#### 将自己的web项目文件复制粘贴于此

#### 右键项目文件夹 选择发行 -> 

![image-20221213191653152](D:\Users\Administrator\Desktop\apk打包\img\image-20221213191653152.png)

#### 原生App打包

![image-20221024130500963](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20221024130500963.png)



#### 打包页面填写证书信息

![image-20221024130709381](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20221024130709381.png)



## 生成证书

1.配置java环境

![image-20221024131012888](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20221024131012888.png)

#### 进入高级系统设置 -> 

#### 环境变量 -> 

#### 新建 JAVA_HOME 变量

##### 变量值为jdk文件所在（java环境）

![ ](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20221024131534797.png)

#### 双击进入path

#### 新建path，值为

```bash
%JAVA_HOME%\bin
```



![image-20221024131848704](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20221024131848704.png)

#### 运行cmd

```bash
//帮助
java -h
//版本
java -v
```



```bash
keytool -genkey -alias dodo -keyalg RSA -keysize 2048 -validity 36500 -keystore test.keystore
```

#### alias 后数值为证书别名

#### 密钥口令自己设置

![image-20221024134051738](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20221024134051738.png)

#### 对应在打包页面输入

#### 证书别名 -> 密钥口令 -> 选择证书文件

#### 点击打包即可

![image-20221024134322743](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20221024134322743.png)



### 等待生成APK文件