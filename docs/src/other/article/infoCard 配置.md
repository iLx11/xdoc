### 做一个实用又美观的名片

传统名片的限制

- ~~设计简单布局固定~~
- ~~承载的数据量有限~~
- ~~数据固定无法修改~~

**使用 NFC + 网页显示的 `info_card`** 

- **采用赛博朋克机械风设计，新颖又美观**
- **数据使用解析站实时解析，直观又方便**
- **数据量理论没有限制， 稳定又安心**
- **可以随时对数据进行修改，调整信息显示，灵活又高效**

## 准备材料

### 硬件准备：

一个 NFC 芯片和一个绘制了线圈的 PCB 卡片

没错，就是这么简单

（芯片我使用的是 tb 里 NTAG213 国产，PCB 直接打印此工程 1mm 厚度，选择自己喜欢的阻焊颜色即可）

### 软件准备：

**首先我来说明一下项目的原理：**

这个项目的原理就是：

`解析站` + `数据地址链接`

数据地址存储在网站的 get 请求参数中，实现了解析站固定，而数据不固定且任意修改，自由调整的功能

示例：

```bash
https://xxxxxx/?i=https://xxxx
```

以目前我的名片数据来看：

```bash
https://lxw-resume.rth1.xyz/?i=https://lxw-resume.rth1.xyz/aaa.json
```

`/?=` 前面是解析站点链接，`/?=`  后面是解析数据链接

相当于我把两个不同的东西放在同一个站点了

**所以要介绍一下免费的静态网页托管网站：**

https://host.retiehe.com/
注册登录或完成其他认证后就可以免费使用了，目前可以使用我已经部署的解析站点，然后自己在其他地方处理一下能通过 `get`  请求获取 `json`  数据的地方，类似云服务器的函数功能

```bash
https://lxw-resume.rth1.xyz
```

或者自己部署一下静态的资源，我的代码也已经开源了，可以将 `静态网页部署文件`文件夹里面的所有内容按照原本的结构上传到上面的网页托管网站，就是 `index.html` 一定要在根目录里，同时创建文件夹后，依次上传文件，开源地址：

```bash
https://github.com/iLx11/info-card-app.git
```

然后在里面新建一个 json 文件

内容是：

```json
{
  "main": {
    "name": "iLLLL(点击任意文本可以复制)",
    "avatar": "头像的图片链接，可以为空",
    "info": [
      {
        "label": "phone",
        "value": "1380002323"
      },
      {
        "label": "邮箱",
        "value": "123@qq.com"
      },
      {
        "label": "手机号",
        "value": "13800000000"
      },
      {
        "label": "xxx",
        "value": "可以无限制添加"
      }
    ]
  },
  "other": {
    "info": [
      {
        "name": "抖音",
        "avatar": "https://logodix.com/logo/2205276.png",
        "label": "iLx1",
        "value": "探索生活增加体验",
        "click": "https://www.douyin.com/"
      },
      {
        "name": "twitter",
        "avatar": "https://logodix.com/logo/63580.png",
        "label": "iLx1",
        "value": "探索生活增加体验",
        "click": "https://twitter.com/iLx1"
      },
      {
        "name": "视频号",
        "avatar": "",
        "label": "iLx1",
        "value": "探索生活增加体验",
        "click": "https://channels.weixin.qq.com/"
      },
      {
        "name": "这条信息的名称",
        "avatar": "头像链接，可以为空",
        "label": "账号名称之类的",
        "value": "显示的文本",
        "click": "点击后跳转的链接，可以为空，这几条数据可以自由删减，仿照上面的格式复制修改就行"
      }
    ]
  }
}
```

确保放在根目录，然后访问此 json 文件的链接，复制下来，类似：
```bash
https://lxw-resume.rth1.xyz/aaa.json
```

然后最后的链接组合起来就是：

```bash
https://lxw-resume.rth1.xyz/?i=https://lxw-resume.rth1.xyz/aaa.json
```

然后把这个链接写入到 NFC 中，最后手机开启 NFC 读取后跳转到网站就可以啦

## 其他网站

如果链接太长，可以通过下面几个网站来缩短链接，再写入到 NFC 中，所以不用担心 NFC 存储的字节不够用了：

```js
- [縮短網址 | PicSee 免登入．永久有效．追蹤成效](https://picsee.io/)
- [缩我短链接-永久免费生成-老牌网址缩短工具-连通性好](https://suowo.cn/)
- [永久免費縮短網址絕無廣告-ssur](https://ssur.cc/)
- [免登入短網址生成器 - 立即縮短您的連結 | Url-Insight](https://www.url-ins.com/shorten/)
- [摩尔活码 - 微信活码/门店活码/城市活码/永久活码生成制作工具！](https://molelink.cn/hm)
```

如果需要获取头像的链接，可以借助图床网站，上传照片后就会获得一个链接可以填写在数据中进行显示,

可以试一下看哪个能用：

```js
- [图床](https://sm.ms/)
- [FGHRSH 私家图床 - FGHRSH Image Hosting](https://img.fghrsh.net/)
- [牛图网 - 免费图片空间,图片上传,免费传图,免费上传图片,免费图片存储,免费外链,免费空间,PNG上传,GIF上传,JPEG上传,最好的图片上传站](https://niupic.com/)
- [路过图床 - 免费图片上传, 专业图片外链, 免费公共图床](https://imgtu.com/)
- [小贱贱图床 _ 免费图床-微博图床 -免费CDN图床-图床API](https://pic.xiaojianjian.net/)
- [Gimhoy图床 _ 无限制永久免费图床 - 微博图床 - 全网CDN - 永久外链图床 - tuchuang - 图片外链 - 外链相册 - 国内图床 - 论坛图片 - 淘宝图片 _ pic.Gimhoy.com](https://pic.gimhoy.com/)
- [聚合图床 - 免费无限图片上传](https://www.superbed.cn/)
- [笑果图床（LOL图床） - 免费公共图床，快速分享图片外链，分享美好生活](https://imagelol.com/?utm_source=iplaysoft.com&hmsr=iplaysoft.com)
- [Image Upload - SM.MS - Simple Free Image Hosting](https://sm.ms/?utm_source=iplaysoft.com&hmsr=iplaysoft.com)
- [图壳，图片最稳定的家 _ 免费、安全、可靠图床](https://imgkr.com/?utm_source=iplaysoft.com&hmsr=iplaysoft.com)
- [路过图床 - 免费图片上传, 专业图片外链, 免费公共图床](https://imgtu.com/?utm_source=iplaysoft.com&hmsr=iplaysoft.com)
- [遇见图床 - 永久免费图床 专业图片上传 永久外链 全球CDN分发。](https://www.hualigs.cn/?utm_source=iplaysoft.com&hmsr=iplaysoft.com)
- [Z4A图床-做国内最良心的免费图床 - Z4A图床](https://z4a.net/?utm_source=iplaysoft.com&hmsr=iplaysoft.com)
- [ImgURL免费图床](https://imgurl.org/?utm_source=iplaysoft.com&hmsr=iplaysoft.com)
- [Catbox](https://catbox.moe/?utm_source=iplaysoft.com&hmsr=iplaysoft.com)
- [牛图网 - 免费图片空间,图片上传,免费传图,免费上传图片,免费图片存储,免费外链,免费空间,PNG上传,GIF上传,JPEG上传,最好的图片上传站](https://www.niupic.com/?utm_source=iplaysoft.com&hmsr=iplaysoft.com)
- [ImgBB — 免费图片存取_上传图片](https://imgbb.com/?utm_source=iplaysoft.com&hmsr=iplaysoft.com)
- [Postimages — 免费图片托管 _ 图片上传](https://postimages.org/?utm_source=iplaysoft.com&hmsr=iplaysoft.com)
- [ImageHub - 图仓 - 免费图床，提供免费图片托管服务](https://www.imagehub.cc/?utm_source=iplaysoft.com&hmsr=iplaysoft.com)
- [老王图床 - 免费图片上传, 专业图片外链, 免费公共图床, 老王图床](https://img.gejiba.com/?utm_source=iplaysoft.com&hmsr=iplaysoft.com)
- [Imgur_ The magic of the Internet](https://imgur.com/?utm_source=iplaysoft.com&hmsr=iplaysoft.com)
- [ImgURL免费图床](https://imgurl.org/)
```

