### 基础请求
```python
# urllib.request.urlopen(url, data=None, [timeout, ]*)

rep = urllib.request.urlopen('xxx.xxx')
rep.read().decode('utf-8')
```
### 复杂请求
```python
# urllib.request.Request(url, data=None, headers={}, method=None)

from urllib import request,parse  
import ssl

# 使用 ssl 未经验证的上下文
context = ssl._create_unverified_context()
  
url = 'https://biihu.cc//account/ajax/login_process/'  
headers = {  
#假装自己是浏览器  
   'User-Agent':' Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',  
}

dict = {  
    'return_url':'https://biihu.cc/',  
    'user_name':'xiaoshuaib@gmail.com',  
    'password':'123456789',  
    '_post_type':'ajax',  
}

data = bytes(parse.urlencode(dict),'utf-8')
req = request.Request(url,data=data,headers=headers,method='POST')

response = request.urlopen(req,context=context)  
print(response.read().decode('utf-8'))
```