### PyInstaller 的主要功能
1. **打包 Python 程序**：将 Python 源码和依赖库打包成一个独立的可执行文件。
2. **跨平台支持**：支持 Windows、macOS 和 Linux 平台。
3. **支持多个 Python 版本**：支持 Python 2.7 及 3.5 及以上版本。
4. **自动处理依赖项**：自动分析并包含所有 Python 依赖项。
5. **支持数据文件和动态库**：可以将数据文件和动态库一起打包。
6. **生成单个可执行文件**：可以选择将所有文件打包成一个独立的可执行文件。
### 安装 PyInstaller
使用 pip 可以轻松安装 PyInstaller：
`pip install pyinstaller`
### 使用 PyInstaller
PyInstaller 的基本用法非常简单，只需一个命令即可将 Python 脚本打包成可执行文件。
#### 基本用法
假设有一个名为 `my_script.py` 的 Python 脚本，可以使用以下命令将其打包：
`pyinstaller my_script.py`
这条命令会生成一个 `dist` 目录，其中包含打包后的可执行文件，以及一个 `build` 目录用于存放构建过程中的临时文件。
#### 生成单个可执行文件
默认情况下，PyInstaller 会创建一个包含多个文件的目录。如果想生成一个单个可执行文件，可以使用 `--onefile` 选项：
`pyinstaller --onefile my_script.py`
#### 指定图标
可以使用 `--icon` 选项指定可执行文件的图标：
`pyinstaller --onefile --icon=my_icon.ico my_script.py`
#### 打包数据文件
如果你的程序需要一些额外的数据文件，可以使用 `--add-data` 选项。不同操作系统的路径分隔符不同，格式如下：
- Windows：`--add-data "src;dest"`
- Linux/macOS：`--add-data "src:dest"`
`pyinstaller --onefile --add-data "data.txt;data" my_script.py`
### 配置文件
可以使用 `spec` 文件来进行更复杂的配置。生成 `spec` 文件：
`pyinstaller my_script.py --onefile --icon=my_icon.ico`
这会生成一个名为 `my_script.spec` 的文件，可以编辑该文件进行更详细的配置。编辑完成后，使用 `spec` 文件打包：
`pyinstaller my_script.spec`
### 常用选项
- `--onefile`：生成单个可执行文件。
- `--windowed` / `--noconsole`：在 Windows 和 macOS 上隐藏控制台窗口（适用于 GUI 程序）。
- `--icon=ICON_PATH`：指定可执行文件的图标。
- `--add-data "SRC;DEST"`：添加额外的数据文件。
- `--add-binary "SRC;DEST"`：添加额外的二进制文件。
### 处理依赖项
有些库可能需要特殊处理，可以在 `spec` 文件中手动指定，或者使用 `hidden-import` 选项：
`pyinstaller --hidden-import=module1 --hidden-import=module2 my_script.py`
### 示例：完整的使用流程
