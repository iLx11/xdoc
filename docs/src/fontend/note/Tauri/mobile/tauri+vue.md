# 环境工具

1、Rust

2、 Android Studio

## Rust

官网下载对应版本安装：

https://www.rust-lang.org/zh-CN/tools/install

之后可能需要重启终端或电脑确保环境变量生效

如果要卸载：

```bash
rustup self uninstall
```

## Android Studio

官网下载对应版本：
https://developer.android.google.cn/studio?hl=zh-cn

安装完成后下载 SDK：

![image-20250812224116629](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250812224116629.png)

安装 android sdk，可以按需求安装其他

![image-20250812224347316](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250812224347316.png)

安装 sdk 工具：

![image-20250812224450628](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250812224450628.png)

全部安装好后配置环境变量，上面是变量名，下面是值，所有文件位置和名称都按照自己实际来，这里只是一个参考，如果熟悉配置可以自己更改目录

分别配置这三个

```
ANDROID_HOME
C:\Users\xxx\AppData\Local\Android\Sdk

JAVA_HOME
C:\Program Files\Android\Android Studio\jbr

NDK_HOME
C:\Users\xxx\AppData\Local\Android\Sdk\ndk\27.0.12077973
```

### 配置安装模拟器

同样在初始页面：

![image-20250812225652770](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250812225652770.png)

之后按照自己需求配置和下载：
![image-20250812230019567](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250812230019567.png)

# 项目创建

## 创建新项目

使用这个命令创建一个 tauri 的基本项目结构：

```bash
npm create tauri-app@latest
```

可以自行选择开发的工具或框架

## 初始化项目

```bash
cd <项目名>
# 选择自己在上一步选择的工具进行下载 or npm install
pnpm i
# 目前以安卓为例 or npm run tauri android init
pnpm tauri android init
```

之后使用 `rustup` 添加 Android 编译目标：

```bash
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

## 开发项目

运行

```bash
# or npm run tauri android dev
pnpm tauri android dev
```

## 打包项目

### APK 签名

#### 生成签名

```bash
keytool -genkey -alias infocard -keyalg RSA -keysize 2048 -validity 36500 -keystore infocard.jks -storetype JKS
```

![image-20250813142328880](https://picr.oss-cn-qingdao.aliyuncs.com/img/image-20250813142328880.png)

在命令的同级目录中可以找到 `xxx.jks` 文件

创建 `src-tauri/gen/android/keystore.properties` 文件

文件内容如下：
```
storePassword=数据文件密码
keyPassword=证书密码
keyAlias=自定义的证书别名
# 需要输入绝对路径
storeFile=D:\\xx\\xxx自定义的数据文件名称.jks
```

然后修改 `src-tauri/gen/android/app/build.gradle.kts` 文件

```
import java.io.FileInputStream

android {
	...
	signingConfigs { // [!code ++:13]
        create("release") {
        	val keystorePropertiesFile = rootProject.file("keystore.properties")
            val keystoreProperties = Properties()
            if (keystorePropertiesFile.exists()) {
                keystoreProperties.load(FileInputStream(keystorePropertiesFile))
            }
            keyAlias = keystoreProperties["keyAlias"] as String
            keyPassword = keystoreProperties["keyPassword"] as String
            storeFile = File(keystoreProperties["storeFile"] as String)
            storePassword = keystoreProperties["storePassword"] as String
        }
    }
    buildTypes {
    ...
    	getByName("release") {
			signingConfig = signingConfigs.getByName("release") // [!code ++]
			...
		}
	}
}
```

打包为apk安装包：

```bash
pnpm tauri android build
```

然后找到安装包目录，安装在手机上

# 问题与解决

### 如果报错 JDK 版本问题

可以自己下载官方高版本的 java 后替换环境变量

然后再次执行：
```bash
pnpm tauri android init
```

