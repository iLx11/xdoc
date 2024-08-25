vscode nrf 插件配置错误
错误码：
```bash
command 'nrf-connect.manageToolchains' not found
```
fix:
注册表中修改正确的 JLINK 路径 -> installPath
```bash
计算机\HKEY_LOCAL_MACHINE\SOFTWARE\SEGGER\J-Link
```
