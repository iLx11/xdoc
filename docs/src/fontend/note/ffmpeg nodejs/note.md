下载包

```bash
pnpm i @ffmpeg-installer/ffmpeg
pnpm i @ffprobe-installer/ffprobe
pnpm i fluent-ffmpeg
```



视频截图

```js
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffprobePath = require('@ffprobe-installer/ffprobe').path
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')

// 配置 ffmpeg 路径
ffmpeg.setFfmpegPath(ffmpegPath)
// 配置 ffprobe 路径
ffmpeg.setFfprobePath(ffprobePath)

export const ffmpegTest = () => {
  //   ffmpeg.setFfmpegPath(pathToFfmpeg)
  // 每间隔2秒截取缩略图
  const videoFilePath = path.join(__dirname, '../../public/video/test.mp4')
  // 使用fluent-ffmpeg获取截图
  ffmpeg(videoFilePath)
    .on('end', function () {
      console.log('ok ')
    })
    .on('error', function (err) {
      console.info('error ->', err)
    })
    .screenshots({
      timestamps: ['10%', '2', '8', '10'],
      filename: 'temp_%i_%s.png',
    //   folder: '/path/to/output',
      size: '320x240',
    })
}

```

