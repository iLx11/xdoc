# git

基本使用

https://zhuanlan.zhihu.com/p/576368060

两个速查表

https://cheatography.com/milefashi/cheat-sheets/git-cheatssheet/

https://cheatography.com/itsellej/cheat-sheets/git-commands/

## 生成 SSH key 步骤

GitHub 官网上注册一个账号，然后桌面右键选择 Git Bash Here，进行账号配置，命

```bash
# 配置用户名("username"是自己GitHub上的用户名)
$ git config --global user.name "username"
# 配置邮箱("username@email.com"是注册GitHub账号时所用的邮箱)
$ git config --global user.email "username@email.com"
```

- 执行完成上述命令以后，查看是否配置成功。如果成功，会显示所配置的用户名和邮箱，命令：

```
$ git config --global --list
```

- 检查电脑是否已经有 SSH key，在 Git Bash Here 中输入命令：

```bash
# 这两个命令就是检查是否已经存在 id_rsa（私钥） 或 id_dsa.pub（公钥） 文件
$ cd ~/.ssh

*# 输完上边命令回车*
$ ls
```

- 执行以下命令生成 ssh-key

```bash
*# 生成 ssh，ssh-keygen 命令中间无空格*
$ ssh-keygen -t rsa
```

- 运行上面那条命令后会让你输入一个文件名，用于保存刚才生成的 SSH key 代码，遇到下边命令直接按回车就可以：

```bash
Generating public/private rsa key pair.
*# Enter file in which to save the key (/c/Users/you/.ssh/id_rsa): [Press enter]*
```

- 接着又会提示你输入两次密码（该密码是你 push 文件的时候要输入的密码，而不是 GitHub 管理者的密码），可以不输入密码，直接按回车。那么 push 的时候就不需要输入密码，直接提交到 GitHub 上了

```bash
Enter passphrase **(**empty **for** no passphrase**)**: 
*# Enter same passphrase again:*
```

- 然后会有如下代码提示，这说明 SSH key 已经创建成功，下一步只需要添加到 GitHub 的 SSH key 上就可以，生成成功后，会有如图3.3所示的：

```bash
Your identification has been saved in /c/Users/you/.ssh/id_rsa.
*# Your public key has been saved in /c/Users/you/.ssh/id_rsa.pub.# The key fingerprint is:# 01:0f:f4:3b:ca:85:d6:17:a1:7d:f0:68:9d:f0:a2:db username@email.com*
```

# 一个新仓库

## 本地三步走

```bash
git init

# git add <file-name>
git add . 

git commit -m "frist_commit"
```

## 远程两步走

```bash
# origin -> remote name
git remote add origin git@github.com:iLx11/git-test.git

# '-u' 为首次提交，之后提交就不加了
git push -u origin master
```

## 测试一个新功能

```bash
# 添加分支，当然也可以直接在主分支里写，如果是自己的项目
git branch main

# 切换到此分支
git checkout/switch main

# 之后与本地三步走的流程一致
```

将新分支推送到远程仓库

```bash
git push <remote-name>  main
```

在 github 上也会出现一个新的分支，与主分支完全分开

可以用合起来的命令完成创建并转到分支

```bash
git checkout -b main
```

合并其他分支到主分支，但是当前分支一点要在主分支上

```bash
git checkout master

# master 分支中
git merge main
```

## 版本回退

```bash
# 看所有提交的版本
git log

# 恢复指定的版本，但不删除已经提交的几个版本，和工作区的未提交的代码
git reset --soft

# 恢复指定的版本，删除此版本之后已经提交过的版本，但不删除工作区
git reset --mixed

# 恢复指定的版本，并删除此版本之后已经提交过的版本，并删除工作区的代码
git reset --hard (谨慎）
```

## 参考、学习或二次开发 github 上心仪的项目

在项目的页面找到 code 按钮，点击后可以看见最上面的 clone，然后复制下面的链接，https 或 ssh 都可以

```bash
# 然后在本地找一个稳重的文件夹里打开 git-bash
git clone <上面复制的网址>

# 然后就可以自由学习了
```

## 多端开发同一项目

首先在 github 上需要添加不同端 ssh 以实现在不同端开发并提交代码

任意一端开发完之后，正常走本地三部和远程两部流程

另一端要开发时，github 上的代码已经更新，所以需要同步一下

```bash
# 也就是所谓的把代码‘拉’下来了
git pull <origin-name> master (看具体需要哪个分支）

# 如果遇到没有更改的话
git log

git reset --hard xxxxxx
```

## 一个项目同步到不同的远程仓库

这个意思是把一个项目放到多个不同的远程仓库，像除了 github 之外的 gitee， coding， 阿里云之类的代码管理平台

```bash
# 也就是远程两步走的流程走很多次，然后每次换个名字
git remote add github xxxxxxxx
git remote add gitee xxxxxxxx
...

# 然后看一下已经添加的所有的远程仓库
git remote -v

git push <remote-name> master
```

同步多个远程仓库
