---
title: Linux笔记
date: 2022-08-16 13:15:15
tags:
categories: 123
classes: 笔记
---

## Linux笔记

Linux版本18

VMware中安装tools

将安装包提取到某个位置，在该位置打开终端执行

出现错误时复制后再提取执行

```
sudo ./vmware-install.pl
```

之后有Y选Y，再将虚拟机重启

## ubuntu docker安装

```
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

国内 daocloud 一键安装命令：

```
curl -sSL https://get.daocloud.io/docker | sh
```

## 手动安装

### 卸载旧版本

Docker 的旧版本被称为 docker，docker.io 或 docker-engine 。如果已安装，请卸载它们：

```
$ sudo apt-get remove docker docker-engine docker.io containerd runc
```

当前称为 Docker Engine-Community 软件包 docker-ce 。

安装 Docker Engine-Community，以下介绍两种方式。

### 使用 Docker 仓库进行安装

在新主机上首次安装 Docker Engine-Community 之前，需要设置 Docker 仓库。之后，您可以从仓库安装和更新 Docker 。

### 设置仓库

更新 apt 包索引。

```
$ sudo apt-get update
```

安装 apt 依赖包，用于通过HTTPS来获取仓库:

$ **sudo** **apt-get install** \
  apt-transport-https \
  ca-certificates \
  curl \
  gnupg-agent \
  software-properties-common

添加 Docker 的官方 GPG 密钥：

```
$ curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
```

9DC8 5822 9FC7 DD38 854A E2D8 8D81 803C 0EBF CD88 通过搜索指纹的后8个字符，验证您现在是否拥有带有指纹的密钥。

$ **sudo** **apt-key** fingerprint 0EBFCD88

pub  rsa4096 2017-02-22 **[**SCEA**]**
   9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid      **[** unknown**]** Docker Release **(**CE deb**)** **<**docker**@**docker.com**>**
sub  rsa4096 2017-02-22 **[**S**]**

使用以下指令设置稳定版仓库

$ **sudo** add-apt-repository \
  "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/ **\

** $(lsb_release -cs) **\

** stable"

### 安装 Docker Engine-Community

更新 apt 包索引。

```
$ sudo apt-get update
```

安装最新版本的 Docker Engine-Community 和 containerd ，或者转到下一步安装特定版本：

```
$ sudo apt-get install docker-ce docker-ce-cli containerd.io
```

要安装特定版本的 Docker Engine-Community，请在仓库中列出可用版本，然后选择一种安装。列出您的仓库中可用的版本：

$ **apt-cache** madison docker-ce

 docker-ce **|** 5:18.09.1~3-0~ubuntu-xenial **|** https:**//**mirrors.ustc.edu.cn**/**docker-ce**/**linux**/**ubuntu  xenial**/**stable amd64 Packages
 docker-ce **|** 5:18.09.0~3-0~ubuntu-xenial **|** https:**//**mirrors.ustc.edu.cn**/**docker-ce**/**linux**/**ubuntu  xenial**/**stable amd64 Packages
 docker-ce **|** 18.06.1~ce~3-0~ubuntu    **|** https:**//**mirrors.ustc.edu.cn**/**docker-ce**/**linux**/**ubuntu  xenial**/**stable amd64 Packages
 docker-ce **|** 18.06.0~ce~3-0~ubuntu    **|** https:**//**mirrors.ustc.edu.cn**/**docker-ce**/**linux**/**ubuntu  xenial**/**stable amd64 Packages
 ...

使用第二列中的版本字符串安装特定版本，例如 5:18.09.1~3-0~ubuntu-xenial。

```
$ sudo apt-get install docker-ce=<VERSION_STRING> docker-ce-cli=<VERSION_STRING> containerd.io
```

测试 Docker 是否安装成功，输入以下指令，打印出以下信息则安装成功:

$ **sudo** docker run hello-world

Unable to **find** image 'hello-world:latest' locally
latest: Pulling from library**/**hello-world

.....

### 卸载 docker

删除安装包：

```
sudo apt-get purge docker-ce
```

删除镜像、容器、配置文件等内容：

```
sudo rm -rf /var/lib/docker
```

## docker 安装 emqx

首次进入root要先设置密码

```
sudo passwd root
```

输入密码，并确认密码。

```
su root
//linuxroot
```

切换为普通用户

```
su xyx
```

 在root下执行

```
[root@localhost ~]# docker pull emqx/emqx:4.2.11
```

```
[root@localhost ~]# docker run -d --name emqx -p 1883:1883 -p 8081:8081 -p 8083:8083 -p 8084:8084 -p 8883:8883 -p 18083:18083 emqx/emqx:4.2.11
```

##### 浏览器输入服务器的*ip:18083*端口访问,默认登录账号admin 密码public

### 在ubuntu中查询ip

右上角点有线设置，可以在设置中看到IP

##### 主机的浏览器也可输入服务器的IP:18083

```
$ ifconfig -a
```

Command 'ifconfig' not found, but can be installed with:

sudo apt install net-tools

```
$ sudo apt install net-tools
```



## 执行PowerShell

1.在Windows 操作系统里，点击开始->运行->输入PowerShell，进入windows PowerShell。

2.在任意文件夹按住[shift]键单击鼠标右键，选择[在此处打开PowerShell窗口(S)]

3.按住[windows]+[R]键，输入powershell [16] 

4.在命令与指示符(cmd)中输入powershell，在cmd中实现powershell的功能

### 解决VSCODE"因为在此系统上禁止运行脚本"报错

1. 以管理员身份运行vscode;
2. 执行：get-ExecutionPolicy，显示Restricted，表示状态是禁止的;
3. 执行：set-ExecutionPolicy RemoteSigned;
4. 这时再执行get-ExecutionPolicy，就显示RemoteSigned;

### 启动已停止运行的容器

查看所有的容器命令如下：

```
$ docker ps -a
```

启动id为--的容器

```
$ docker start b750bbbcfd88 
```

### 停止一个容器

停止容器的命令如下：

```
$ docker stop ID
```

停止的容器可以通过 docker restart 重启

```
$ docker restart ID
```

### 删除容器

删除容器使用 **docker rm** 命令：

```
$ docker rm -f 1e560fca3906
```

下面的命令可以清理掉所有处于终止状态的容器。

```
$ docker container prune
```

