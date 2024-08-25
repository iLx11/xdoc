下载浏览器驱动
Chrome:	https://sites.google.com/a/chromium.org/chromedriver/downloads
Edge:	https://developer.microsoft.com/en-us/microsoft-edge/tools/webdriver/
Firefox:	https://github.com/mozilla/geckodriver/releases
Safari:	https://webkit.org/blog/6900/webdriver-support-in-safari-10/
之后配置环境变量
### 使用
```python
from selenium import webdriver  
  
driver = webdriver.Chrome()  
driver.get("https://www.baidu.com")  
  
input = driver.find_element_by_css_selector('#kw')  
input.send_keys("test")  
  
button = driver.find_element_by_css_selector('#su')  
button.click()
```
在页面中获取一个元素
```python
find_element_by_id

find_element_by_name

find_element_by_xpath

find_element_by_link_text

find_element_by_partial_link_text

find_element_by_tag_name

find_element_by_class_name

find_element_by_css_selector
```
获取多个元素
```python
find_elements_by_name

find_elements_by_xpath

find_elements_by_link_text

find_elements_by_partial_link_text

find_elements_by_tag_name

find_elements_by_class_name

find_elements_by_css_selector
```
获取数据
```python
driver = webdriver.Chrome()

# 获取请求链接
driver.current_url

# 获取 cookies
driver.get_cookies()

# 获取源代码
driver.page_source

# 获取文本的值
input.text
```
### 隐藏打开流程
首先下载phantomjs 
http://phantomjs.org/download.html

![python爬虫11 | 这次，将带你爬取b站上的NBA形象大使蔡徐坤和他的球友们](https://vip.fxxkpython.com/wp-content/uploads/2020/04/python2-1587537041.jpg "python爬虫11 | 这次，将带你爬取b站上的NBA形象大使蔡徐坤和他的球友们")

将 Chrome 换成 phantomjs
```python
browser = webdriver.PhantomJS()
```