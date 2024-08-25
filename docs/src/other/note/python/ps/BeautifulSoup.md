高效的网页解析库
### 安装
```python
pip install beautifulsoup4
# HTML 解析器
pip install lxml
```
### 使用
```python
soup = BeautifulSoup(html_doc,'lxml')

# 获取标题的内容
print(soup.title.string)

# 获取 p 标签里面的内容
print(soup.p.string)

# 获取 title 的父级标签
print(soup.title.parent.name)
#head

# 获取超链接
print(soup.a)
#<a class="sister" href="http://example.com/1" id="link1">一个笑话长</a>

# 获取所有超链接
print(soup.find_all('a'))
#[<a class="sister" href="http://example.com/1" id="link1">一个笑话长</a>, <a class="sister" href="http://example.com/2" id="link2">一个笑话短</a>]

# 获取 id 为 link2 的超链接
print(soup.find(id="link2"))
#<a class="sister" href="http://example.com/2" id="link2">一个笑话短</a>

# 获取网页中所有的内容
print(soup.get_text())

# css 获取 ---------------------
print(soup.select("title"))  
print(soup.select("body a"))  
print(soup.select("p > #link1"))
```

### 保存到 excel
```python
import xlwt

book=xlwt.Workbook(encoding='utf-8',style_compression=0)  
  
sheet=book.add_sheet('豆瓣电影Top250',cell_overwrite_ok=True)  
sheet.write(0,0,'名称')  
sheet.write(0,1,'图片')
```
