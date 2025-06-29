# git

基本使用

https://zhuanlan.zhihu.com/p/576368060

两个速查表

https://cheatography.com/milefashi/cheat-sheets/git-cheatssheet/

https://cheatography.com/itsellej/cheat-sheets/git-commands/

# 生成 SSH key 步骤

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

# 测试一个新功能(分支)

## 添加并开发分支

```bash
# 添加分支，当然也可以直接在主分支里写，如果是自己的项目
git branch [new branch name]

# 切换到此分支
git checkout/switch [new branch name]

# 可以简化为一条命令，表示创建新分支并切换到该分支
git checkout -b [new branch name]

# 之后与本地三步走的流程一致
```

**新更改的内容都将与主分支的内容分隔开，包括本地三步走的流程**

将新分支推送到远程仓库

```bash
git push <remote-name> [new branch name]
```

在 github 上也会出现一个新的分支，与主分支完全分开

## 合并分支

**合并其他分支到主分支，但是当前分支一点要在主分支上**

```bash
git checkout master

# (master) 分支中
git merge [new branch name]
```

## 删除远程版本的分支

```git
git push <remote-name> --delete [new branch name]
```



# 版本回退

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

# 参考、学习或二次开发 github 上心仪的项目

在项目的页面找到 code 按钮，点击后可以看见最上面的 clone，然后复制下面的链接，https 或 ssh 都可以

```bash
# 然后在本地找一个稳重的文件夹里打开 git-bash
git clone <上面复制的网址>

# 然后就可以自由学习了
```

# 远程仓库覆盖本地

**放弃本地更改：**
如果你有未提交的更改或提交，但不需要保留它们，可以用以下命令将本地更改还原到上次提交的状态

```bash
git reset --hard
```

**同步远程分支：** 更新所有远程分支信息，以确保你的本地仓库能够看到远程最新的提交。

```bash
git fetch --all
```

**强制拉取并覆盖本地：**
强制拉取远程分支，覆盖本地分支的内容。假设你的目标分支是 `master`，可以使用：

```bash
git reset --hard origin/master
```

# 多端开发同一项目

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

# 一个项目同步到不同的远程仓库

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

# 子模块

Git 子模块是管理多个相关仓库的实用工具，但其操作需要细致处理。以下是常用操作的总结和补充说明：

---

### **添加子模块**
```bash
git submodule add <仓库URL> <子模块路径>
```
- 将子模块添加到父仓库，生成 `.gitmodules` 文件记录子模块信息。
- **注意**：添加后需提交父仓库的变更（`.gitmodules` 和子模块路径）。

---

### **克隆包含子模块的项目**
- **首次克隆**：
  
  ```bash
  git clone <父仓库URL>
  cd <父仓库目录>
  git submodule update --init --recursive
  ```
- **克隆时递归初始化子模块**：
  
  ```bash
  git clone --recurse-submodules <父仓库URL>
  ```

---

### **更新子模块到最新提交**
```bash
git submodule update --remote
```
- 默认拉取子模块远程仓库的 **默认分支**（如 `master`）。
- 若需指定分支，需在 `.gitmodules` 中添加 `branch = <分支名>`，再运行上述命令。

---

### **切换子模块的分支**
```bash
cd <子模块路径>
git checkout <分支名>
cd ..
git add <子模块路径>
git commit -m "切换子模块分支"
```

---

### **查看子模块状态**
```bash
git submodule status
```
- 显示各子模块的当前提交哈希和路径。

---

### **拉取父仓库及子模块更新**
```bash
git pull
git submodule update --init --recursive
```
- 或拉取时自动递归更新：
  ```bash
  git pull --recurse-submodules
  ```

---

### **修改子模块并提交**
```bash
cd <子模块路径>
# 修改代码后提交
git add .
git commit -m "子模块修改"
git push
# 返回父仓库提交子模块引用变更
cd ..
git add <子模块路径>
git commit -m "更新子模块引用"
git push
```

---

### **删除子模块**
1. **卸载子模块**：
   ```bash
   git submodule deinit <子模块路径>
   ```
2. **从索引中移除**：
   ```bash
   git rm <子模块路径>
   ```
3. **删除残留配置**：
   
   ```bash
   rm -rf .git/modules/<子模块名称>
   ```
4. **提交变更**：
   ```bash
   git commit -m "删除子模块"
   ```

---

### **其他常见操作**
- **更改子模块 URL**：
  
  1. 修改 `.gitmodules` 中的 URL。
  2. 同步变更：`git submodule sync`
- **查看子模块远程仓库**：
  
  ```bash
  cd <子模块路径> && git remote -v
  ```
- **递归操作所有子模块**：
  
  ```bash
  git submodule foreach 'git checkout main'
  ```

# 要删除 Git 仓库中的所有标签

### 1. **删除所有本地标签**

要删除所有本地标签，可以使用以下命令：

bash

复制

```bash
git tag | xargs git tag -d
```

这个命令的工作原理如下：

- `git tag`：列出所有本地标签。
- `xargs`：将 `git tag` 的输出作为参数传递给 `git tag -d`，从而删除每个标签。

### 2. **删除所有远程标签**

要删除所有远程标签，可以使用以下命令：

bash

复制

```bash
git ls-remote --tags origin | awk '{print $2}' | sed 's/refs\/tags\///' | xargs git push origin --delete
```

这个命令的工作原理如下：

- `git ls-remote --tags origin`：列出所有远程标签。
- `awk '{print $2}'`：提取标签的名称。
- `sed 's/refs\/tags\///'`：去除 `refs/tags/` 前缀。
- `xargs git push origin --delete`：删除远程标签。
