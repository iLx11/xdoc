### 为什么要开发扩展

1.Node.js不适合cpu密集型业务，开发扩展使用libuv线程池做异步计算

2.需要更高的执行性能，例如使用c++、Rust等比javascript更高效的语言

3.已有c++库，直接封装成Node.js扩展提供给javascript调用，避免重复开发

4.通过javascript无法实现的能力，开发扩展增强Node.js能力

### 什么是扩展

Node.js扩展是文件扩展名为.node的二进制文件，本质上是动态链接库，可以理解为改了名的.dll或.so文件，可以被require加载

### Node.js扩展的三种形式

| 扩展类型  | 基本描述                                        | Node.js版本变化时改代码 | Node.js版本变化时重新编译 |
| --------- | ----------------------------------------------- | ----------------------- | ------------------------- |
| 直接写C++ | 直接引用v8、libuv等库进行开发                   | 是                      | 是                        |
| NAN       | 使用NAN(Native Abstraction for Node.js)进行开发 | 否                      | 是                        |
| N-API     | 使用node-addon-api进行开发                      | 否(ABI版本需一致)       | 否(ABI版本需一致)         |

N-API方式调用Node.js稳定的二进制ABI接口(Application BinaryInterface)，只要ABI版本号一致就不需要重新编译

可以从Node.js官网历史版本下载页面，NODE_MODULE_VERSION看到Node.js版本与ABI版本的对应关系，[nodejs.org/zh-cn/downl…](https://link.juejin.cn/?target=https%3A%2F%2Fnodejs.org%2Fzh-cn%2Fdownload%2Freleases%2F)

或者执行process.versions.modules查看ABI版本；process.versions查看相关配套版本：

```c
> process.versions
{
    node: '18.0.0',
    v8: '10.1.124.8-node.13',
    uv: '1.43.0',
    zlib: '1.2.11',
    brotli: '1.0.9',
    ares: '1.18.1',
    modules: '108',
    nghttp2: '1.47.0',
    napi: '8',
    llhttp: '6.0.4',
    openssl: '3.0.2+quic',
    cldr: '41.0',
    icu: '71.1',
    tz: '2022a',
    unicode: '14.0',
    ngtcp2: '0.1.0-DEV',
    nghttp3: '0.1.0-DEV'
}
```

## 安装依赖项

手动安装步骤如下：

### 1. 安装node-gyp

```bash
npm install -g node-gyp
```

### 2. 安装Visual Studio Build Tools

可以参考node-gyp文档中的下载链接和步骤进行安装https://github.com/nodejs/node-gyp

安装完成后更新npm配置，列如版本号是2022

```bash
npm config set msvs_version 2022
```

安装headers，头文件和Node.js版本是对应的，如果用nvm等工具切换过Node.js版本，请重新安装

```bash
node-gyp install --dist-url=http://mirrors.tools.huawei.com/Node.js/
```

此步骤会将node_api.h等头文件下载到本地，按Node.js版本号区分目录，例如：

```bash
C:\Users\z00443016\AppData\Local\node-gyp\Cache\18.0.0\include\node
```

配置IDE时会需要用到

### 3. 安装python

官网下载地址：

https://www.python.org/downloads/

安装完成后将python和python/Scripts/目录加入到Path环境变量

```bash
python\Script
python\
```

更新npm配置，

```bash
npm config set python D:\xxxx\python
```

### 4.  从hellow world开始

以c++开发为例，复制官网示例到本地。

https://github.com/nodejs/node-addon-examples/tree/main/1_hello_world/node-addon-api

执行npm install会自动调用node-gyp编译，生成build/Release/hello.node的目标文件，这个文件就是最终被js引用的扩展包，可以被require调用。

没有自动调用编译的话

```bash
node-gyp configure build
```

执行示例文件中的hello.js，会调用hello.cc中定义的hello方法输出'world'。

```javascript
var addon = require('bindings')('hello');

// 或者直接require hello.node文件
// var addon = require('./build/Release/hello.node');

console.log(addon.hello()); // 'world'
```

如需重新编译，可以执行

```bash
node-gyp rebuild
```

## 编写NodeJS C++插件源码构建配置文件

NodeJS C++插件的源码构建方式主要有 node-gyp 和 cmake.js，这里采用 node-gyp 的方式 

### 修改 package.json

```c
"gypfile": true
```

### bingding.gyp

```json
{
  'targets': [
    {
      'target_name': 'addon',
      'sources': [ 'addon.cpp' ],
      'include_dirs':[ 'thirdlib' ],
      'libraries':[ '-lmyadd' ],
      # 'library_dirs':[ '<(module_root_dir)/thirdlib/bin_win/Debug' ]
      'conditions': [
        ['OS=="win"',{
          'library_dirs':[ '<(module_root_dir)/thirdlib/bin_win/Debug' ]
        }],
        ['OS=="linux"',{
          'library_dirs':[ '<(module_root_dir)/thirdlib/bin_unix' ]
        }],
        ['OS=="mac"',{ # not test
          'library_dirs':[ '<(module_root_dir)/thirdlib/bin_unix' ]
        }]
      ]
  	}
	]
}
```

## 调试扩展

vsCode安装c++ intelliSense扩展应用

【Run(Ctrl + Shift + D)】-> 【create a launch.json file】-> 【C++ (GDB/LLDB)】

配置.vscode/launch.json，完成调试配置就可以断点调试了

在vscode中按F5进行调试

```json
{
  // 使用 IntelliSense 了解相关属性。 
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "(Windows) 启动",
      "type": "cppvsdbg",
      "request": "launch",
      "program": "C:/Program Files/nodejs/node.exe",
      "args": [
        "${workspaceFolder}/hello.js"
      ],
      "stopAtEntry": false,
      "cwd": "${fileDirname}",
      "environment": [],
      "console": "externalTerminal"
    }
  ]
}
```



 