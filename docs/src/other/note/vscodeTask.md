## 1. **基本结构**

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "Example Task",
            "type": "shell",
            "command": "echo Hello, VS Code!",
            "group": "build",
            "problemMatcher": []
        }
    ]
}
```

- `version`: 任务配置的版本，VS Code 目前支持 `"2.0.0"`。
- `tasks`: 任务列表，可以包含多个任务。

------

## 2. **常见字段**

### 1) `label`

> 任务的名称，可以在 VS Code 任务列表中看到。

```json
"label": "Build Project"
```

### 2) `type`

> 任务的类型，决定任务的执行方式。

- `"shell"`: 运行 shell 命令（如 Bash、PowerShell）。
- `"process"`: 运行外部程序（如 Python、CMake）。

```json
"type": "shell"
```

### 3) `command`

> 任务执行的命令，比如 `make`、`npm install`、`python script.py`。

```json
"command": "make"
```

### 4) `args`

> 命令的参数，可以将多个参数拆分为列表。

```json
"args": ["-j4"]
```

等同于：

```sh
make -j4
```

### 5) `group`

> 任务分组，常用于快捷键触发：

- `"build"`: 构建任务（可以用 `Ctrl+Shift+B` 运行）。
- `"test"`: 测试任务（可以用 `Run Test Task` 运行）。

```json
"group": {
    "kind": "build",
    "isDefault": true
}
```

- `isDefault: true` 表示该任务是默认构建任务（`Ctrl+Shift+B`）。

### 6) `problemMatcher`

> 用于解析编译器输出并在 VS Code "Problems" 面板中显示错误信息。

- `"$gcc"`: 适用于 `gcc/g++` 编译错误。
- `"$tsc"`: 适用于 TypeScript 编译错误。

```json
"problemMatcher": ["$gcc"]
```

### 7) `dependsOn`

> 指定当前任务依赖的其他任务，会先执行依赖任务。

```json
"dependsOn": ["Generate CMake"]
```

### 8) `detail`

> 任务的详细描述。

```json
"detail": "This task compiles the project using Make."
```

在 VS Code 的 `tasks.json` 里，`presentation` 字段用于控制任务的终端显示方式，比如是否清除之前的输出、是否在后台运行等。它可以用来优化任务的可视化体验。

------

## **`presentation` 字段的常见配置**

```json
"presentation": {
    "echo": true,
    "reveal": "always",
    "focus": false,
    "panel": "shared",
    "clear": true
}
```

### **1) `echo` (是否回显命令)**

> - `true`: 在终端显示执行的命令（默认）。
> - `false`: 不显示执行的命令。

```json
"echo": true
```

💡 **示例**

```sh
> make -j4
Compiling...
```

如果 `echo: false`，不会显示 `> make -j4`，只会看到编译输出。

------

### **2) `reveal` (任务终端的显示方式)**

> - `"always"`: 总是显示任务终端（默认）。
> - `"silent"`: 任务执行时不会自动显示终端，除非有错误。
> - `"never"`: 任务终端完全隐藏。

```json
"reveal": "always"
```

💡 **用法** 如果任务是编译代码，你可能希望 `"always"` 以便查看进度。如果任务是后台运行的，比如启动服务器，使用 `"silent"` 或 `"never"` 可以避免干扰。

------

### **3) `focus` (是否聚焦终端)**

> - `true`: 任务启动时自动聚焦终端。
> - `false`: 任务启动时不改变焦点（默认）。

```json
"focus": false"
```

💡 **示例** 当 `focus: true` 时，任务运行后终端窗口会自动获取焦点，比如：

```sh
> Starting build...
```

当 `focus: false` 时，终端运行任务但不会干扰你的当前窗口。

------

### **4) `panel` (多个任务共享终端)**

> - `"shared"`: 任务终端是共享的（多个任务共用）。
> - `"dedicated"`: 每个任务都有自己的终端。
> - `"new"`: 每次运行任务都会打开一个新的终端。

```json
"panel": "shared"
```

💡 **示例** 如果你运行多个任务，如 `cmake ..` 和 `make`，`"shared"` 让它们在同一个终端显示，`"dedicated"` 让它们分开。

------

### **5) `clear` (是否清除终端)**

> - `true`: 运行任务前清除终端内容（默认 `false`）。
> - `false`: 继续在已有的终端里追加输出。

```json
"clear": true
```

💡 **示例** 如果 `clear: true`，每次运行任务都会清空终端，避免旧日志干扰。

