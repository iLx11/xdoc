### 安装
```python
pip install requests
```
### 请求
```python
r = requests.get('https://api.github.com/events')
r = requests.post('https://httpbin.org/post', data = {'key':'value'})

# 假装自己是浏览器
url = 'https://api.github.com/some/endpoint'  
  
headers = {'user-agent': 'my-app/0.0.1'}  
r = requests.get(url, headers=headers)

# 用 json 作为参数
r = requests.post(url, json=payload)

# 上传文件
files = {'file': open('report.xls', 'rb')}
r = requests.post(url, files=files)
r.text

# 获取 cookie 信息
r.cookies['example_cookie_name']
# 发送 cookie 信息
cookies = dict(cookies_are='working')
r = requests.get(url, cookies=cookies)
r.text

# 设置超时
requests.get('https://github.com/', timeout=0.001)
```