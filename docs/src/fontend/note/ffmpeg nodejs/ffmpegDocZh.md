# 适用于 Node.js 的流畅 ffmpeg-API



[![Coverage Status](https://camo.githubusercontent.com/10c06aec031b5fb658d72135eb063523ec51156c83fc1a57472a3a9fb651af93/68747470733a2f2f636f766572616c6c732e696f2f7265706f732f6769746875622f666c75656e742d66666d7065672f6e6f64652d666c75656e742d66666d7065672f62616467652e7376673f6272616e63683d6d6173746572)](https://coveralls.io/github/fluent-ffmpeg/node-fluent-ffmpeg?branch=master) [![FOSSA Status](https://camo.githubusercontent.com/ca31c706a7f462087d6b0be4e3742cebc67280801217728062c80691030ae0d0/68747470733a2f2f6170702e666f7373612e696f2f6170692f70726f6a656374732f6769742532426769746875622e636f6d253246666c75656e742d66666d7065672532466e6f64652d666c75656e742d66666d7065672e7376673f747970653d736869656c64)](https://app.fossa.io/projects/git%2Bgithub.com%2Ffluent-ffmpeg%2Fnode-fluent-ffmpeg?ref=badge_shield)

> **Fluent-ffmpeg 正在寻找新的维护者**[wiki 上有](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/wiki/Looking-for-a-new-maintainer)更多详细信息

该库将 ffmpeg 的复杂命令行用法抽象为流畅、易于使用的 Node.js 模块。为了能够使用此模块，请确保您的系统上安装了[ffmpeg](http://www.ffmpeg.org/) （包括所有必需的编码库，如 libmp3lame 或 libx264）。

> 这是 Fluent-ffmpeg 2.x 的文档。您仍然可以[在此处](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/tree/1.x)访问 Fluent-ffmpeg 1.7 的代码和文档。

##  安装



 通过 npm：

```
$ npm install fluent-ffmpeg
```



 或者作为子模块：

```
$ git submodule add git://github.com/schaermu/node-fluent-ffmpeg.git vendor/fluent-ffmpeg
```



##  用法



您将在`examples`文件夹中找到很多使用示例（包括使用[flowplayer](http://www.flowplayer.org/)和[express 的](https://github.com/visionmedia/express)实时流媒体示例！）。

###  先决条件



####  ffmpeg 和 ffprobe



Fluent-ffmpeg 需要 ffmpeg >= 0.9 才能工作。它可能适用于以前的版本，但有几个功能将不可用（并且该库不再使用较低版本进行测试）。

如果设置了`FFMPEG_PATH`环境变量，Fluent-ffmpeg 将使用它作为`ffmpeg`可执行文件的完整路径。否则，它将尝试直接调用`ffmpeg` （因此它应该位于您的`PATH`中）。您还必须安装 ffprobe（在大多数发行版中它随 ffmpeg 一起提供）。同样，如果设置了`FFPROBE_PATH`环境变量，Fluent-ffmpeg 将使用它，否则它将尝试在`PATH`中调用它。

大多数功能在使用 avconv 和 avprobe 而不是 ffmpeg 和 ffprobe 时应该可以工作，但目前尚未得到官方支持。

**Windows 用户**： ffmpeg 和 ffprobe 很可能*不在*您的`%PATH`中，因此您*必须*设置`%FFMPEG_PATH`和`%FFPROBE_PATH` 。

**Debian/Ubuntu 用户**：官方存储库的`libav-tools`包中有 ffmpeg/ffprobe 可执行文件，它们实际上是重新命名的 avconv/avprobe 可执行文件（avconv 是 ffmpeg 的一个分支）。它们应该大部分兼容，但如果您遇到任何问题，您可能需要使用真正的 ffmpeg。您可以从源代码编译它，也可以在https://ffmpeg.org/download.html上找到预构建的 .deb 包（对于 Ubuntu， `ppa:mc3man/trusty-media` PPA 提供最新版本）。

####  flvtool2 或 flvmeta



如果您打算对 FLV 视频进行编码，则必须在您的`PATH`中安装 flvtool2 或 flvmeta，否则 fluence-ffmpeg 将无法生成可流式输出文件。如果您设置`FLVTOOL2_PATH`或`FLVMETA_PATH` ， fluence-ffmpeg 将尝试使用它而不是在`PATH`中搜索。

#### 手动设置二进制路径



或者，您可以使用以下 API 命令手动设置 ffmpeg、ffprobe 和 flvtool2/flvmeta 二进制路径：

- **Ffmpeg.setFfmpegPath(path)**参数`path`是一个字符串，其中包含 ffmpeg 二进制文件的完整路径。
- **Ffmpeg.setFfprobePath(path)**参数`path`是一个字符串，其中包含 ffprobe 二进制文件的完整路径。
- **Ffmpeg.setFlvtoolPath(path)**参数`path`是一个字符串，其中包含 flvtool2 或 flvmeta 二进制文件的完整路径。

### 创建 FFmpeg 命令



Fluent-ffmpeg 模块返回一个构造函数，您可以使用它来实例化 FFmpeg 命令。

```
var FfmpegCommand = require('fluent-ffmpeg');
var command = new FfmpegCommand();
```



您还可以使用不带`new`运算符的构造函数。

```
var ffmpeg = require('fluent-ffmpeg');
var command = ffmpeg();
```



您可以将输入文件名或可读流、配置对象或两者都传递给构造函数。

```
var command = ffmpeg('/path/to/file.avi');
var command = ffmpeg(fs.createReadStream('/path/to/file.avi'));
var command = ffmpeg({ option: "value", ... });
var command = ffmpeg('/path/to/file.avi', { option: "value", ... });
```



可以使用以下选项：

- `source` ：输入文件名或可读流（如果输入文件传递给构造函数则忽略）
- `timeout` : ffmpeg 超时（以秒为单位）（默认无超时）
- `preset`或`presets` ：从中加载模块预设的目录（默认为 fluence-ffmpeg 树中的`lib/presets`目录）
- `niceness`或`priority` ：ffmpeg 的 Niceness 值，在 -20 到 20 之间；在 Windows 平台上忽略（默认为 0）
- `logger` ：具有`debug()` 、 `info()` 、 `warn()`和`error()`方法的记录器对象（默认不记录）
- `stdoutLines` ： ffmpeg stdout/stderr 中保留在内存中的最大行数（默认为 100，使用 0 表示无限存储）

###  指定输入



您可以向 Ffmpeg 命令添加任意数量的输入。输入可以是：

- 文件名（例如`/path/to/file.avi` ）；
- 图像模式（例如`/path/to/frame%03d.png` ）；
- 可读流；一条命令只能使用一个输入流，但您可以同时使用输入流和一个或多个文件名。

```
// Note that all fluent-ffmpeg methods are chainable
ffmpeg('/path/to/input1.avi')
  .input('/path/to/input2.avi')
  .input(fs.createReadStream('/path/to/input3.avi'));

// Passing an input to the constructor is the same as calling .input()
ffmpeg()
  .input('/path/to/input1.avi')
  .input('/path/to/input2.avi');

// Most methods have several aliases, here you may use addInput or mergeAdd instead
ffmpeg()
  .addInput('/path/to/frame%02d.png')
  .addInput('/path/to/soundtrack.mp3');

ffmpeg()
  .mergeAdd('/path/to/input1.avi')
  .mergeAdd('/path/to/input2.avi');
```



###  输入选项



以下方法可以将输入相关选项传递给 ffmpeg。这些方法中的每一种都适用于最后添加的输入（包括传递给构造函数的输入，如果有的话）。您必须在调用它们之前添加输入，否则将引发错误。

#### inputFormat(format)：指定输入格式



**别名**： `fromFormat()` 、 `withInputFormat()` 。

这仅对原始输入有用，因为 ffmpeg 可以自动确定输入格式。

```
ffmpeg()
  .input('/dev/video0')
  .inputFormat('mov')
  .input('/path/to/file.avi')
  .inputFormat('avi');
```



Fluent-ffmpeg 在实际运行命令之前检查格式可用性，并在指定的输入格式不可用时抛出错误。

#### inputFPS(fps)：指定输入帧率



**别名**： `withInputFps()` 、 `withInputFPS()` 、 `withFpsInput()` 、 `withFPSInput()` 、 `inputFps()` 、 `fpsInput()` 、 `FPSInput()` 。

这仅对原始输入有效，因为 ffmpeg 可以自动确定输入帧速率。

```
ffmpeg('/dev/video0').inputFPS(29.7);
```



#### native()：以本机帧速率读取输入



**别名**： `nativeFramerate()` 、 `withNativeFramerate()` 。

```
ffmpeg('/path/to/file.avi').native();
```



#### eekInput(time)：设置输入开始时间



**别名**： `setStartTime()` 。

寻求输入并仅在给定时间偏移处开始解码。 `time`参数可以是数字（以秒为单位）或时间戳字符串（格式为`[[hh:]mm:]ss[.xxx]` ）。

```
ffmpeg('/path/to/file.avi').seekInput(134.5);
ffmpeg('/path/to/file.avi').seekInput('2:14.500');
```



#### 循环（[持续时间]）：循环输入



```
ffmpeg('/path/to/file.avi').loop();
ffmpeg('/path/to/file.avi').loop(134.5);
ffmpeg('/path/to/file.avi').loop('2:14.500');
```



#### inputOptions(option...): 添加自定义输入选项



**别名**： `inputOption()` 、 `addInputOption()` 、 `addInputOptions()` 、 `withInputOption()` 、 `withInputOptions()` 。

此方法允许将任何与输入相关的选项传递给 ffmpeg。您可以使用单个参数调用它来传递单个选项，也可以选择使用空格分隔的参数：

```
/* Single option */
ffmpeg('/path/to/file.avi').inputOptions('-someOption');

/* Single option with parameter */
ffmpeg('/dev/video0').inputOptions('-r 24');
```



您还可以通过将数组传递给该方法来一次传递多个选项：

```
ffmpeg('/path/to/file.avi').inputOptions([
  '-option1',
  '-option2 param2',
  '-option3',
  '-option4 param4'
]);
```



最后，您还可以直接将命令行标记作为单独的参数传递给该方法：

```
ffmpeg('/path/to/file.avi').inputOptions(
  '-option1',
  '-option2', 'param2',
  '-option3',
  '-option4', 'param4'
);
```



###  音频选项



以下方法更改生成的输出中的音频流。

#### noAudio()：完全禁用音频



**别名**： `withNoAudio()` 。

禁用输出中的音频并删除任何先前设置的音频选项。

```
ffmpeg('/path/to/file.avi').noAudio();
```



#### audioCodec(codec): 设置音频编解码器



**别名**： `withAudioCodec()` 。

```
ffmpeg('/path/to/file.avi').audioCodec('libmp3lame');
```



Fluent-ffmpeg 在实际运行命令之前检查编解码器的可用性，并在指定的音频编解码器不可用时抛出错误。

#### audioBitrate(bitrate): 设置音频比特率



**别名**： `withAudioBitrate()` 。

设置音频比特率（以 kbps 为单位）。 `bitrate`参数可以是数字或带有可选`k`后缀的字符串。该方法用于强制保持恒定的比特率；使用`audioQuality()`使用可变比特率进行编码。

```
ffmpeg('/path/to/file.avi').audioBitrate(128);
ffmpeg('/path/to/file.avi').audioBitrate('128');
ffmpeg('/path/to/file.avi').audioBitrate('128k');
```



#### audioChannels(count): 设置音频通道数



**别名**： `withAudioChannels()` 。

```
ffmpeg('/path/to/file.avi').audioChannels(2);
```



#### audioFrequency(freq): 设置音频频率



**别名**： `withAudioFrequency()` 。

`freq`参数指定音频频率（以 Hz 为单位）。

```
ffmpeg('/path/to/file.avi').audioFrequency(22050);
```



#### audioQuality(quality): 设置音频质量



**别名**： `withAudioQuality()` 。

此方法修复了音频编解码器（VBR 编码）的质量因数。质量等级取决于实际使用的编解码器。

```
ffmpeg('/path/to/file.avi')
  .audioCodec('libmp3lame')
  .audioQuality(0);
```



#### audioFilters(filter...): 添加自定义音频过滤器



**别名**： `audioFilter()` 、 `withAudioFilter()` 、 `withAudioFilters()` 。

此方法允许添加自定义音频过滤器。您可以通过传递多个参数或数组来一次添加多个过滤器。有关可用过滤器及其语法，请参阅 Ffmpeg 文档。

传递给此方法的每个过滤器可以是过滤器字符串（例如， `volume=0.5` ）或具有以下键的过滤器规范对象：

- `filter` ：过滤器名称
- `options` ：可选；过滤器的选项字符串（例如`n=-50dB:d=5` ）、未命名选项的选项数组（例如`['-50dB', 5]` ）或将选项名称映射到值的对象（例如`{ n: '-50dB', d: 5 }` ）。当未指定`options`时，将添加不带任何选项的过滤器。

```
ffmpeg('/path/to/file.avi')
  .audioFilters('volume=0.5')
  .audioFilters('silencedetect=n=-50dB:d=5');

ffmpeg('/path/to/file.avi')
  .audioFilters('volume=0.5', 'silencedetect=n=-50dB:d=5');

ffmpeg('/path/to/file.avi')
  .audioFilters(['volume=0.5', 'silencedetect=n=-50dB:d=5']);

ffmpeg('/path/to/file.avi')
  .audioFilters([
    {
      filter: 'volume',
      options: '0.5'
    },
    {
      filter: 'silencedetect',
      options: 'n=-50dB:d=5'
    }
  ]);

ffmpeg('/path/to/file.avi')
  .audioFilters(
    {
      filter: 'volume',
      options: ['0.5']
    },
    {
      filter: 'silencedetect',
      options: { n: '-50dB', d: 5 }
    }
  ]);
```



###  视频选项



以下方法更改生成的输出中的视频流。

#### noVideo()：完全禁用视频



**别名**： `withNoVideo()` 。

此方法禁用视频输出并删除任何先前设置的视频选项。

```
ffmpeg('/path/to/file.avi').noVideo();
```



#### videoCodec(codec): 设置视频编解码器



**别名**： `withVideoCodec()` 。

```
ffmpeg('/path/to/file.avi').videoCodec('libx264');
```



Fluent-ffmpeg 在实际运行命令之前检查编解码器的可用性，并在指定的视频编解码器不可用时抛出错误。

#### videoBitrate(bitrate[,constant=false])：设置视频比特率



**别名**： `withVideoBitrate()` 。

设置目标视频比特率（以 kbps 为单位）。 `bitrate`参数可以是数字或带有可选`k`后缀的字符串。 `constant`参数指定是否应强制执行恒定比特率（默认为 false）。

请记住，根据所使用的编解码器，强制执行恒定的比特率通常会以质量为代价。获得恒定视频比特率而又不会损失太多质量的最佳方法是使用 2-pass 编码（请参阅 Fffmpeg 文档）。

```
ffmpeg('/path/to/file.avi').videoBitrate(1000);
ffmpeg('/path/to/file.avi').videoBitrate('1000');
ffmpeg('/path/to/file.avi').videoBitrate('1000k');
ffmpeg('/path/to/file.avi').videoBitrate('1000k', true);
```



#### videoFilters(filter...): 添加自定义视频过滤器



**别名**： `videoFilter()` 、 `withVideoFilter()` 、 `withVideoFilters()` 。

此方法允许添加自定义视频过滤器。您可以通过传递多个参数或数组来一次添加多个过滤器。有关可用过滤器及其语法，请参阅 Ffmpeg 文档。

传递给此方法的每个过滤器可以是过滤器字符串（例如`fade=in:0:30` ）或具有以下键的过滤器规范对象：

- `filter` ：过滤器名称
- `options` ：可选；过滤器的选项字符串（例如`in:0:30` ）、未命名选项的选项数组（例如`['in', 0, 30]` ）或将选项名称映射到值的对象（例如`{ t: 'in', s: 0, n: 30 }` ）。当未指定`options`时，将添加不带任何选项的过滤器。

```
ffmpeg('/path/to/file.avi')
  .videoFilters('fade=in:0:30')
  .videoFilters('pad=640:480:0:40:violet');

ffmpeg('/path/to/file.avi')
  .videoFilters('fade=in:0:30', 'pad=640:480:0:40:violet');

ffmpeg('/path/to/file.avi')
  .videoFilters(['fade=in:0:30', 'pad=640:480:0:40:violet']);

ffmpeg('/path/to/file.avi')
  .videoFilters([
    {
      filter: 'fade',
      options: 'in:0:30'
    },
    {
      filter: 'pad',
      options: '640:480:0:40:violet'
    }
  ]);

ffmpeg('/path/to/file.avi')
    .videoFilters(
    {
      filter: 'fade',
      options: ['in', 0, 30]
    },
    {
      filter: 'filter2',
      options: { w: 640, h: 480, x: 0, y: 40, color: 'violet' }
    }
  );
```



#### fps(fps): 设置输出帧率



**别名**： `withOutputFps()` 、 `withOutputFPS()` 、 `withFpsOutput()` 、 `withFPSOutput()` 、 `withFps()` 、 `withFPS()` 、 `outputFPS()` 、 `outputFps()` 、 `fpsOutput()` 、 `FPSOutput()` 、 `FPS()` 。

```
ffmpeg('/path/to/file.avi').fps(29.7);
```



#### 帧数(count)：指定帧数



**别名**： `takeFrames()` 、 `withFrames()` 。

将 ffmpeg 设置为仅编码一定数量的帧。

```
ffmpeg('/path/to/file.avi').frames(240);
```



###  视频帧大小选项



以下方法可以调整输出视频帧的大小。它们一起工作来生成适当的视频过滤器。

#### size(size)：设置输出帧大小



**别名**： `videoSize()` 、 `withSize()` 。

该方法设置输出帧大小。 `size`参数可以采用以下格式之一：

- `640x480` ：设置固定的输出帧尺寸。除非调用`autopad()` ，否则可能会导致视频被拉伸或挤压以适合请求的大小。
- `640x?` ：设置固定宽度并自动计算高度。如果`aspect()`也被调用，它用于计算视频高度；否则，将进行计算以保留输入的宽高比。
- `?x480` ：设置固定高度并自动计算宽度。如果`aspect()`也被调用，它用于计算视频宽度；否则，将进行计算以保留输入的宽高比。
- `50%` ：将宽度和高度重新调整为给定的百分比。纵横比始终保持不变。

请注意，为了与某些编解码器兼容，计算出的尺寸始终向下舍入为 2 的倍数。

```
ffmpeg('/path/to/file.avi').size('640x480');
ffmpeg('/path/to/file.avi').size('640x?');
ffmpeg('/path/to/file.avi').size('640x?').aspect('4:3');
ffmpeg('/path/to/file.avi').size('50%');
```



#### spect(aspect)：设置输出帧的宽高比



**别名**： `withAspect()` 、 `withAspectRatio()` 、 `setAspect()` 、 `setAspectRatio()` 、 `aspectRatio()` 。

此方法强制执行特定的输出纵横比。 `aspect`参数可以是数字或`X:Y`字符串。

请注意，当使用固定宽度和高度或百分比调用`size()`时，以及根本没有调用`size()`时，对`aspect()`的调用将被忽略。

```
ffmpeg('/path/to/file.avi').size('640x?').aspect('4:3');
ffmpeg('/path/to/file.avi').size('640x?').aspect(1.33333);
```



#### autopad([color='black']): 启用自动填充输出视频



**别名**： `applyAutopadding()` 、 `applyAutoPadding()` 、 `applyAutopad()` 、 `applyAutoPad()` 、 `withAutopadding()` `withAutoPadding()` 、 `withAutopad()` 、 `withAutoPad()` 、 `autoPad()` 。

此方法可以对输出视频应用自动填充。 `color`参数指定用于填充的颜色，并且必须是 ffmpeg 支持的颜色代码或名称（默认为“黑色”）。

此方法的行为取决于对其他视频大小方法的调用：

- 当使用百分比调用`size()`或未调用 size() 时，它会被忽略；
- 当使用`WxH`调用`size()`时，它会添加填充，以便保持输入的宽高比；
- 当使用`Wx?`调用`size()`时或`?xH` ，仅当`aspect()`时才添加填充（否则输出尺寸是根据输入宽高比计算的并且不需要填充）。

```
// No size specified, autopad() is ignored
ffmpeg('/path/to/file.avi').autopad();

// Adds padding to keep original aspect ratio.
// - with a 640x400 input, 40 pixels of padding are added on both sides
// - with a 600x480 input, 20 pixels of padding are added on top and bottom
// - with a 320x200 input, video is scaled up to 640x400 and 40px of padding
//   is added on both sides
// - with a 320x240 input, video is scaled up to 640x480 and and no padding
//   is needed
ffmpeg('/path/to/file.avi').size('640x480').autopad();
ffmpeg('/path/to/file.avi').size('640x480').autopad('white');
ffmpeg('/path/to/file.avi').size('640x480').autopad('#35A5FF');

// Size computed from input, autopad() is ignored
ffmpeg('/path/to/file.avi').size('50%').autopad();
ffmpeg('/path/to/file.avi').size('640x?').autopad();
ffmpeg('/path/to/file.avi').size('?x480').autopad();

// Calling .size('640x?').aspect('4:3') is similar to calling .size('640x480')
// - with a 640x400 input, 40 pixels of padding are added on both sides
// - with a 600x480 input, 20 pixels of padding are added on top and bottom
// - with a 320x200 input, video is scaled up to 640x400 and 40px of padding
//   is added on both sides
// - with a 320x240 input, video is scaled up to 640x480 and and no padding
//   is needed
ffmpeg('/path/to/file.avi').size('640x?').aspect('4:3').autopad();
ffmpeg('/path/to/file.avi').size('640x?').aspect('4:3').autopad('white');
ffmpeg('/path/to/file.avi').size('640x?').aspect('4:3').autopad('#35A5FF');

// Calling .size('?x480').aspect('4:3') is similar to calling .size('640x480')
ffmpeg('/path/to/file.avi').size('?x480').aspect('4:3').autopad();
ffmpeg('/path/to/file.avi').size('?x480').aspect('4:3').autopad('white');
ffmpeg('/path/to/file.avi').size('?x480').aspect('4:3').autopad('#35A5FF');
```



为了与以前的 Fluent-ffmpeg 版本兼容，此方法还接受一个额外的布尔值第一个参数，该参数指定是否应用自动填充。

```
ffmpeg('/path/to/file.avi').size('640x480').autopad(true);
ffmpeg('/path/to/file.avi').size('640x480').autopad(true, 'pink');
```



#### keepDAR()：强制保持显示宽高比



**Aliases**: `keepPixelAspect()`, `keepDisplayAspect()`, `keepDisplayAspectRatio()`.

当将具有非方形像素的输入转换为不支持非方形像素的输出格式（例如大多数图像格式）时，此方法非常有用。它会重新调整输入的比例，以使显示宽高比相同。

```
ffmpeg('/path/to/file.avi').keepDAR();
```



### 指定多个输出



#### 输出（目标[，选项]）：将输出添加到命令中



**别名**： `addOutput()` 。

向命令添加输出。 `target`参数可以是输出文件名或可写流（但最多可以将一个输出流与单个命令一起使用）。

当`target`是流时，可以传递附加`options`对象。如果存在，它将被传递给 ffmpeg 输出流`pipe()`方法。

添加输出会切换命令的“当前输出”，以便适用于输出的任何 Fluent-ffmpeg 方法确实会应用于添加的最后一个输出。出于向后兼容性的原因，您也可以在添加第一个输出*之前*调用这些方法（在这种情况下，它们将在添加第一个输出时应用于第一个输出）。应用于输出的方法都是与输入无关的方法，除了全局的`complexFilter()`之外。

另请注意，调用`output()`时，不应使用`save()`或`stream()` （以前`saveToFile()`和`writeToStream()` ）方法，因为它们已经添加了输出。使用`run()`方法开始处理。

```
var stream  = fs.createWriteStream('outputfile.divx');

ffmpeg('/path/to/file.avi')
  .output('outputfile.mp4')
  .output(stream);

ffmpeg('/path/to/file.avi')
  // You may pass a pipe() options object when using a stream
  .output(stream, { end:true });

// Output-related methods apply to the last output added
ffmpeg('/path/to/file.avi')

  .output('outputfile.mp4')
  .audioCodec('libfaac')
  .videoCodec('libx264')
  .size('320x200')

  .output(stream)
  .preset('divx')
  .size('640x480');

// Use the run() method to run commands with multiple outputs
ffmpeg('/path/to/file.avi')
  .output('outputfile.mp4')
  .output(stream)
  .on('end', function() {
    console.log('Finished processing');
  })
  .run();
```



###  输出选项



#### 持续时间（时间）：设置输出持续时间



**别名**： `withDuration()` 、 `setDuration()` 。

强制 ffmpeg 在特定输出持续时间后停止转码。 `time`参数可以是数字（以秒为单位）或时间戳字符串（格式为`[[hh:]mm:]ss[.xxx]` ）。

```
ffmpeg('/path/to/file.avi').duration(134.5);
ffmpeg('/path/to/file.avi').duration('2:14.500');
```



####  寻求（时间）：寻求输出



**别名**： `seekOutput()` 。

在将流编码到输出之前查找流。这与调用`seekInput()`不同，因为偏移量仅适用于一个输出。这也更慢，因为跳过的帧仍将被解码（但被丢弃）。

`time`参数可以是数字（以秒为单位）或时间戳字符串（格式为`[[hh:]mm:]ss[.xxx]` ）。

```
ffmpeg('/path/to/file.avi')
  .seekInput('1:00')

  .output('from-1m30s.avi')
  .seek(30)

  .output('from-1m40s.avi')
  .seek('0:40');
```



#### format(format)：设置输出格式



**别名**： `withOutputFormat()` 、 `toFormat()` 、 `outputFormat()` 。

```
ffmpeg('/path/to/file.avi').format('flv');
```



#### flvmeta()：转码后更新FLV元数据



**别名**： `updateFlvMetadata()` 。

调用此方法使 Fluent-ffmpeg 在输出文件上运行`flvmeta`或`flvtool2`以添加 FLV 元数据并使文件可流式传输。它在输出到流时不起作用，仅在输出到 FLV 格式时有用。

```
ffmpeg('/path/to/file.avi').flvmeta().format('flv');
```



#### outputOptions(option...): 添加自定义输出选项



**别名**： `outputOption()` 、 `addOutputOption()` 、 `addOutputOptions()` 、 `withOutputOption()` 、 `withOutputOptions()` 、 `addOption()` 、 `addOptions()` 。

此方法允许将任何与输出相关的选项传递给 ffmpeg。您可以使用单个参数调用它来传递单个选项，也可以选择使用空格分隔的参数：

```
/* Single option */
ffmpeg('/path/to/file.avi').outputOptions('-someOption');

/* Single option with parameter */
ffmpeg('/dev/video0').outputOptions('-r 24');
```



您还可以通过将数组传递给该方法来一次传递多个选项：

```
ffmpeg('/path/to/file.avi').outputOptions([
  '-option1',
  '-option2 param2',
  '-option3',
  '-option4 param4'
]);
```



最后，您还可以直接将命令行标记作为单独的参数传递给该方法：

```
ffmpeg('/path/to/file.avi').outputOptions(
  '-option1',
  '-option2', 'param2',
  '-option3',
  '-option4', 'param4'
);
```



###  杂项选项



#### 预设（preset）：使用 Fluent-ffmpeg 预设



**别名**： `usingPreset()` 。

Fluent-ffmpeg 支持两种预设。第一个是预设模块；要使用它们，请将预设名称作为`preset`参数传递。预设模块从`presets`构造函数选项指定的目录中加载（默认为`lib/presets` fluence-ffmpeg 子目录）。

```
// Uses <path-to-fluent-ffmpeg>/lib/presets/divx.js
ffmpeg('/path/to/file.avi').preset('divx');

// Uses /my/presets/foo.js
ffmpeg('/path/to/file.avi', { presets: '/my/presets' }).preset('foo');
```



预设模块必须导出一个以 FfmpegCommand 作为参数的`load()`函数。 Fluent-ffmpeg 预装了以下预设模块：

- `divx`
- `flashvideo`
- `podcast`

以下是包含的`divx`预设中的代码作为示例：

```
exports.load = function(ffmpeg) {
  ffmpeg
    .format('avi')
    .videoBitrate('1024k')
    .videoCodec('mpeg4')
    .size('720x?')
    .audioBitrate('128k')
    .audioChannels(2)
    .audioCodec('libmp3lame')
    .outputOptions(['-vtag DIVX']);
};
```



第二种预设是预设功能。要使用它们，请传递一个以 FfmpegCommand 作为参数的函数。

```
function myPreset(command) {
  command.format('avi').size('720x?');
}

ffmpeg('/path/to/file.avi').preset(myPreset);
```



#### complexFilter(filters[, map]): 设置复杂的filtergraph



**别名**： `filterGraph()`

`complexFilter()`方法可以为命令设置复杂的过滤器图。它需要一个过滤器规范（或一个过滤器规范数组）和一个可选的输出映射参数作为参数。

过滤器规范可以是普通的 ffmpeg 过滤器字符串（例如`split=3[a][b][c]` ）或具有以下键的对象：

- `filter` ：过滤器名称
- `options` ：可选；过滤器的选项字符串（例如`in:0:30` ）、未命名选项的选项数组（例如`['in', 0, 30]` ）或将选项名称映射到值的对象（例如`{ t: 'in', s: 0, n: 30 }` ）。当未指定`options`时，将添加不带任何选项的过滤器。
- `inputs` ：可选；过滤器的输入流说明符。该值可以是单个流说明符字符串或流说明符数组。每个说明符都可以选择括在方括号中。当未指定输入流时，ffmpeg 将使用正确类型的第一个未使用的流。
- `outputs` ：可选；过滤器的输出流说明符。该值可以是单个流说明符字符串或流说明符数组。每个说明符都可以选择括在方括号中。

输出映射参数指定要包含在过滤器图的输出中的流。它可以是单个流说明符字符串或流说明符数组。每个说明符都可以选择括在方括号中。当此参数不存在时，ffmpeg 将默认将所有未使用的输出保存到输出文件。

请注意，对于给定命令只能设置一个复杂的过滤器图。再次调用`complexFilter()`将覆盖任何先前设置的过滤器图，但您可以在一次调用中根据需要设置任意数量的过滤器。

```
ffmpeg('/path/to/file.avi')
  .complexFilter([
    // Rescale input stream into stream 'rescaled'
    'scale=640:480[rescaled]',

    // Duplicate rescaled stream 3 times into streams a, b, and c
    {
      filter: 'split', options: '3',
      inputs: 'rescaled', outputs: ['a', 'b', 'c']
    },

    // Create stream 'red' by removing green and blue channels from stream 'a'
    {
      filter: 'lutrgb', options: { g: 0, b: 0 },
      inputs: 'a', outputs: 'red'
    },

    // Create stream 'green' by removing red and blue channels from stream 'b'
    {
      filter: 'lutrgb', options: { r: 0, b: 0 },
      inputs: 'b', outputs: 'green'
    },

    // Create stream 'blue' by removing red and green channels from stream 'c'
    {
      filter: 'lutrgb', options: { r: 0, g: 0 },
      inputs: 'c', outputs: 'blue'
    },

    // Pad stream 'red' to 3x width, keeping the video on the left,
    // and name output 'padded'
    {
      filter: 'pad', options: { w: 'iw*3', h: 'ih' },
      inputs: 'red', outputs: 'padded'
    },

    // Overlay 'green' onto 'padded', moving it to the center,
    // and name output 'redgreen'
    {
      filter: 'overlay', options: { x: 'w', y: 0 },
      inputs: ['padded', 'green'], outputs: 'redgreen'
    },

    // Overlay 'blue' onto 'redgreen', moving it to the right
    {
      filter: 'overlay', options: { x: '2*w', y: 0 },
      inputs: ['redgreen', 'blue'], outputs: 'output'
    },
  ], 'output');
```



###  设置事件处理程序



在实际运行命令之前，您可能需要为其设置事件侦听器，以便在命令完成时收到通知。可以参加以下活动：

#### 'start': ffmpeg 进程已启动



`start`事件在 ffmpeg 生成后立即发出。它是用完整的命令行作为参数发出的。

```
ffmpeg('/path/to/file.avi')
  .on('start', function(commandLine) {
    console.log('Spawned Ffmpeg with command: ' + commandLine);
  });
```



#### 'codecData'：输入可用的编解码器数据



当 ffmpeg 输出有关其输入流的编解码器信息时，将发出`codecData`事件。它是通过带有以下键的对象参数发出的：

- `format` ：输入格式
- `duration` ：输入持续时间
- `audio` ：音频编解码器
- `audio_details` : 音频编码详细信息
- `video` ：视频编解码器
- `video_details` : 视频编码详细信息

```
ffmpeg('/path/to/file.avi')
  .on('codecData', function(data) {
    console.log('Input is ' + data.audio + ' audio ' +
      'with ' + data.video + ' video');
  });
```



#### 'progress'：转码进度信息



每次 ffmpeg 报告进度信息时都会发出`progress`事件。它是通过带有以下键的对象参数发出的：

- `frames` ：处理的总帧数
- `currentFps` : FFmpeg 当前正在处理的帧速率
- `currentKbps` : FFmpeg 当前正在处理的吞吐量
- `targetSize` ：目标文件的当前大小（以千字节为单位）
- `timemark` ：当前帧的时间戳（以秒为单位）
- `percent` ：进度百分比的估计

请注意， `percent`可能（非常）不准确，因为 Fluent-ffmpeg 从 ffmpeg 获取的唯一进度信息是写入的帧总数（以及相应的持续时间）。为了估计百分比，Fluent-ffmpeg 必须猜测总输出持续时间，并使用添加到命令中的第一个输入来执行此操作。尤其：

- 使用输入流时百分比不可用
- 当使用具有不同持续时间的多个输入并且第一个不是最长的时，百分比可能是错误的

```
ffmpeg('/path/to/file.avi')
  .on('progress', function(progress) {
    console.log('Processing: ' + progress.percent + '% done');
  });
```



####  ‘stderr’：FFmpeg 输出



每次 FFmpeg 向`stderr`输出一行时，都会发出`stderr`事件。它以包含 stderr 行的字符串发出（减去尾随换行符）。

```
ffmpeg('/path/to/file.avi')
  .on('stderr', function(stderrLine) {
    console.log('Stderr output: ' + stderrLine);
  });
```



#### “错误”：转码错误



当运行 ffmpeg 或准备执行时发生错误时，会发出`error`事件。它以错误对象作为参数发出。如果错误发生在 ffmpeg 执行期间，侦听器还将收到两个包含 ffmpegs stdout 和 stderr 的附加参数。

如果流用于输入或输出，则从这些流发出的任何错误都将传递到此事件，并分别作为输入和输出流的`inputStreamError`和`outputStreamError`附加到`error` 。

**警告**：您应该*始终*为`error`事件设置一个处理程序，因为当发出没有任何侦听器的`error`事件时，节点的默认行为是将错误输出到控制台并*终止程序*。

```
ffmpeg('/path/to/file.avi')
  .on('error', function(err, stdout, stderr) {
    console.log('Cannot process video: ' + err.message);
  });
```



#### 'end'：处理完成



处理完成后会发出`end`事件。侦听器接收 ffmpeg 标准输出和标准错误作为参数，但生成缩略图时除外（见下文），在这种情况下，侦听器接收生成的文件名数组。

```
ffmpeg('/path/to/file.avi')
  .on('end', function(stdout, stderr) {
    console.log('Transcoding succeeded !');
  });
```



当命令输出到流时， `stdout`为空。 `stdout`和`stderr`都受到`stdoutLines`选项的限制（默认为 100 行）。

### 开始 FFmpeg 处理



#### save(filename)：将输出保存到文件中



**别名**： `saveToFile()`

启动 ffmpeg 处理并将输出保存到文件中。

```
ffmpeg('/path/to/file.avi')
  .videoCodec('libx264')
  .audioCodec('libmp3lame')
  .size('320x240')
  .on('error', function(err) {
    console.log('An error occurred: ' + err.message);
  })
  .on('end', function() {
    console.log('Processing finished !');
  })
  .save('/path/to/output.mp4');
```



注意： `save()`方法实际上是调用`output()`和`run()`的语法糖。

#### pipeline([stream], [options])：将输出通过管道传输到可写流



**别名**： `stream()` 、 `writeToStream()` 。

开始处理并将 ffmpeg 输出传输到可写流。 `options`参数（如果存在）将传递给 ffmpeg 输出流的`pipe()`方法（请参阅 nodejs 文档）。

```
var outStream = fs.createWriteStream('/path/to/output.mp4');

ffmpeg('/path/to/file.avi')
  .videoCodec('libx264')
  .audioCodec('libmp3lame')
  .size('320x240')
  .on('error', function(err) {
    console.log('An error occurred: ' + err.message);
  })
  .on('end', function() {
    console.log('Processing finished !');
  })
  .pipe(outStream, { end: true });
```



当不存在`stream`参数时， `pipe()`方法返回一个PassThrough流，您可以通过管道将其传输到其他地方（或者只是监听事件）。

**注意**：这仅适用于节点 >= 0.10。

```
var command = ffmpeg('/path/to/file.avi')
  .videoCodec('libx264')
  .audioCodec('libmp3lame')
  .size('320x240')
  .on('error', function(err) {
    console.log('An error occurred: ' + err.message);
  })
  .on('end', function() {
    console.log('Processing finished !');
  });

var ffstream = command.pipe();
ffstream.on('data', function(chunk) {
  console.log('ffmpeg just wrote ' + chunk.length + ' bytes');
});
```



注意： `stream()`方法实际上是调用`output()`和`run()`的语法糖。

####  run()：开始处理



**别名**： `exec()` 、 `execute()` 。

此方法主要在生成多个输出时有用（否则`save()`或`stream()`方法更简单）。它开始处理指定的输出。

**警告**：调用其他处理方法（例如`save()` 、 `pipe()`或`screenshots()` ）时不要使用`run()` 。

```
ffmpeg('/path/to/file.avi')
  .output('screenshot.png')
  .noAudio()
  .seek('3:00')

  .output('small.avi')
  .audioCodec('copy')
  .size('320x200')

  .output('big.avi')
  .audioCodec('copy')
  .size('640x480')

  .on('error', function(err) {
    console.log('An error occurred: ' + err.message);
  })
  .on('end', function() {
    console.log('Processing finished !');
  })
  .run();
```



#### mergeToFile(filename, tmpdir)：连接多个输入



在命令上使用`input`和`mergeToFile`方法将多个输入连接到单个输出文件。 `mergeToFile`需要一个临时文件夹作为其第二个参数。

```
ffmpeg('/path/to/part1.avi')
  .input('/path/to/part2.avi')
  .input('/path/to/part2.avi')
  .on('error', function(err) {
    console.log('An error occurred: ' + err.message);
  })
  .on('end', function() {
    console.log('Merging finished !');
  })
  .mergeToFile('/path/to/merged.avi', '/path/to/tempDir');
```



#### Screenshots(options[, dirname]): 截图



**别名**： `thumbnail()` 、 `thumbnails()` 、 `screenshot()` 、 `takeScreenshots()` 。

使用`screenshots`方法提取一张或多张缩略图并将其另存为 PNG 文件。不过，此实现有一些注意事项：

- 它不适用于输入流。
- `progress`事件报告的进度信息不准确。
- 它与过滤器不能很好地相互作用。特别是，不要使用`size()`方法来调整缩略图大小，而应使用`size`选项。

`options`参数是一个具有以下键的对象：

- `folder` ：生成的图像文件的输出文件夹。默认为当前文件夹。
- `filename` ：输出文件名模式（见下文）。默认为“tn.png”。
- `count` ：指定生成多少个缩略图。使用此选项时，会在视频中定期生成缩略图（例如，请求 3 个缩略图时，分别在视频长度的 25%、50% 和 75% 处生成）。当指定`timemarks`或`timestamps`时， `count`将被忽略。
- `timemarks`或`timestamps` ：指定视频中应拍摄缩略图的时间戳数组。每个时间戳可以是数字（以秒为单位）、百分比字符串（例如“50%”）或格式为“hh:mm:ss.xxx”的时间戳字符串（其中小时、分钟和毫秒都是可选的）。
- `size` ：指定缩略图的目标大小（与`.size()`方法的格式相同）。**注意：**生成缩略图时不应使用`.size()`方法。

`filename`选项指定生成的文件的文件名模式。它可能包含以下格式标记：

-  “%s”：以秒为单位的偏移量
-  “%w”：屏幕截图宽度
-  '%h': 屏幕截图高度
- '%r'：屏幕截图分辨率（与'%wx%h'相同）
-  '%f': 输入文件名
- '%b'：输入基本名称（不带扩展名的文件名）
- '%i'：时间标记数组中屏幕截图的索引（可以像`%000i`一样使用它进行零填充）

如果传递了多个时间标记并且在文件名模式中未指定可变格式标记（“%s”或“%i”），则将自动添加`_%i` 。

生成缩略图时，会调度一个附加的`filenames`事件，并将生成的文件名数组作为参数。

```
ffmpeg('/path/to/video.avi')
  .on('filenames', function(filenames) {
    console.log('Will generate ' + filenames.join(', '))
  })
  .on('end', function() {
    console.log('Screenshots taken');
  })
  .screenshots({
    // Will take screens at 20%, 40%, 60% and 80% of the video
    count: 4,
    folder: '/path/to/output'
  });

ffmpeg('/path/to/video.avi')
  .screenshots({
    timestamps: [30.5, '50%', '01:10.123'],
    filename: 'thumbnail-at-%s-seconds.png',
    folder: '/path/to/output',
    size: '320x240'
  });
```



### 控制 FFmpeg 进程



#### Kill([signal='SIGKILL']): 杀死任何正在运行的 ffmpeg 进程



此方法向 ffmpeg 进程发送`signal` （默认为“SIGKILL”）。它仅在处理开始时才有意义。发送终止进程的信号将导致发出`error`事件。

```
var command = ffmpeg('/path/to/video.avi')
  .videoCodec('libx264')
  .audioCodec('libmp3lame')
  .on('start', function() {
    // Send SIGSTOP to suspend ffmpeg
    command.kill('SIGSTOP');

    doSomething(function() {
      // Send SIGCONT to resume ffmpeg
      command.kill('SIGCONT');
    });
  })
  .save('/path/to/output.mp4');

// Kill ffmpeg after 60 seconds anyway
setTimeout(function() {
  command.on('error', function() {
    console.log('Ffmpeg has been killed');
  });

  command.kill();
}, 60000);
```



#### renice([niceness=0]): 更改 ffmpeg 进程优先级



此方法会更改任何正在运行的 ffmpeg 进程（如果有）以及将来生成的任何进程的良好（优先级）值。 `niceness`参数的范围可以从 -20（最高优先级）到 20（最低优先级），默认为 0（这是大多数 *nix 系统上的默认进程良好度）。

**注意**：此方法在Windows平台上无效。

```
// Set startup niceness
var command = ffmpeg('/path/to/file.avi')
  .renice(5)
  .save('/path/to/output.mp4');

// Command takes too long, raise its priority
setTimeout(function() {
  command.renice(-5);
}, 60000);
```



###  读取视频元数据



您可以使用模块`ffprobe`方法从任何有效的 ffmpeg 输入文件中读取元数据。

```
ffmpeg.ffprobe('/path/to/file.avi', function(err, metadata) {
    console.dir(metadata);
});
```



您还可以在 FfmpegCommand 上调用 ffprobe 方法来探测其输入之一。您可以传递一个基于 0 的输入数字作为第一个参数来指定从哪个输入读取元数据，否则该方法将探测最后添加的输入。

```
ffmpeg('/path/to/file1.avi')
  .input('/path/to/file2.avi')
  .ffprobe(function(err, data) {
    console.log('file2 metadata:');
    console.dir(data);
  });

ffmpeg('/path/to/file1.avi')
  .input('/path/to/file2.avi')
  .ffprobe(0, function(err, data) {
    console.log('file1 metadata:');
    console.dir(data);
  });
```



**警告：** ffprobe 可能会使用输入流调用，但在这种情况下*，它将消耗流中的数据*，并且该数据将不再可用于 ffmpeg。在同一输入流上同时使用 ffprobe 和转码命令很可能会失败，除非该流是实时流。仅当您知道自己在做什么时才这样做。

返回的对象与从 shell 运行以下命令返回的对象相同（根据您的 ffmpeg 版本，您可能需要将`-of`替换为`-print_format` ）：

```
$ ffprobe -of json -show_streams -show_format /path/to/file.avi
```



它将包含有关容器的信息（作为`format`键）和流数组（作为`stream`键）。格式对象和每个流对象还包含元数据标签，具体取决于格式：

```
{
  "streams": [
    {
      "index": 0,
      "codec_name": "h264",
      "codec_long_name": "H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10",
      "profile": "Constrained Baseline",
      "codec_type": "video",
      "codec_time_base": "1/48",
      "codec_tag_string": "avc1",
      "codec_tag": "0x31637661",
      "width": 320,
      "height": 180,
      "has_b_frames": 0,
      "sample_aspect_ratio": "1:1",
      "display_aspect_ratio": "16:9",
      "pix_fmt": "yuv420p",
      "level": 13,
      "r_frame_rate": "24/1",
      "avg_frame_rate": "24/1",
      "time_base": "1/24",
      "start_pts": 0,
      "start_time": "0.000000",
      "duration_ts": 14315,
      "duration": "596.458333",
      "bit_rate": "702655",
      "nb_frames": "14315",
      "disposition": {
        "default": 0,
        "dub": 0,
        "original": 0,
        "comment": 0,
        "lyrics": 0,
        "karaoke": 0,
        "forced": 0,
        "hearing_impaired": 0,
        "visual_impaired": 0,
        "clean_effects": 0,
        "attached_pic": 0
      },
      "tags": {
        "creation_time": "1970-01-01 00:00:00",
        "language": "und",
        "handler_name": "\fVideoHandler"
      }
    },
    {
      "index": 1,
      "codec_name": "aac",
      "codec_long_name": "AAC (Advanced Audio Coding)",
      "codec_type": "audio",
      "codec_time_base": "1/48000",
      "codec_tag_string": "mp4a",
      "codec_tag": "0x6134706d",
      "sample_fmt": "fltp",
      "sample_rate": "48000",
      "channels": 2,
      "bits_per_sample": 0,
      "r_frame_rate": "0/0",
      "avg_frame_rate": "0/0",
      "time_base": "1/48000",
      "start_pts": 0,
      "start_time": "0.000000",
      "duration_ts": 28619776,
      "duration": "596.245333",
      "bit_rate": "159997",
      "nb_frames": "27949",
      "disposition": {
        "default": 0,
        "dub": 0,
        "original": 0,
        "comment": 0,
        "lyrics": 0,
        "karaoke": 0,
        "forced": 0,
        "hearing_impaired": 0,
        "visual_impaired": 0,
        "clean_effects": 0,
        "attached_pic": 0
      },
      "tags": {
        "creation_time": "1970-01-01 00:00:00",
        "language": "und",
        "handler_name": "\fSoundHandler"
      }
    }
  ],
  "format": {
    "filename": "http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4",
    "nb_streams": 2,
    "format_name": "mov,mp4,m4a,3gp,3g2,mj2",
    "format_long_name": "QuickTime / MOV",
    "start_time": "0.000000",
    "duration": "596.459000",
    "size": "64657027",
    "bit_rate": "867211",
    "tags": {
      "major_brand": "isom",
      "minor_version": "512",
      "compatible_brands": "mp41",
      "creation_time": "1970-01-01 00:00:00",
      "title": "Big Buck Bunny",
      "artist": "Blender Foundation",
      "composer": "Blender Foundation",
      "date": "2008",
      "encoder": "Lavf52.14.0"
    }
  }
}
```



### 查询ffmpeg能力



Fluent-ffmpeg 使您能够查询已安装的 ffmpeg 版本以获取支持的格式、编解码器、编码器和过滤器。

```
var Ffmpeg = require('fluent-ffmpeg');

Ffmpeg.getAvailableFormats(function(err, formats) {
  console.log('Available formats:');
  console.dir(formats);
});

Ffmpeg.getAvailableCodecs(function(err, codecs) {
  console.log('Available codecs:');
  console.dir(codecs);
});

Ffmpeg.getAvailableEncoders(function(err, encoders) {
  console.log('Available encoders:');
  console.dir(encoders);
});

Ffmpeg.getAvailableFilters(function(err, filters) {
  console.log("Available filters:");
  console.dir(filters);
});

// Those methods can also be called on commands
new Ffmpeg({ source: '/path/to/file.avi' })
  .getAvailableCodecs(...);
```



这些方法将一个对象传递给它们的回调，其中包含每个可用格式、编解码器或过滤器的键。

返回的格式对象如下所示：

```
{
  ...
  mp4: {
    description: 'MP4 (MPEG-4 Part 14)',
    canDemux: false,
    canMux: true
  },
  ...
}
```



- `canDemux`指示 ffmpeg 是否能够从此格式中提取流（解复用）
- `canMux`指示 ffmpeg 是否能够将流写入（mux）这种格式

返回的编解码器对象如下所示：

```
{
  ...
  mp3: {
    type: 'audio',
    description: 'MP3 (MPEG audio layer 3)',
    canDecode: true,
    canEncode: true,
    intraFrameOnly: false,
    isLossy: true,
    isLossless: false
  },
  ...
}
```



- `type`表示编解码器类型，可以是“audio”、“video”或“subtitle”
- `canDecode`告诉 ffmpeg 是否能够使用此编解码器解码流
- `canEncode`告诉 ffmpeg 是否能够使用此编解码器对流进行编码

根据您的 ffmpeg 版本（或者如果您使用 avconv 代替），可能会存在其他键，例如：

- `directRendering`告诉编解码器是否可以直接在 GPU RAM 中渲染；对于转码目的无用
- `intraFrameOnly`告诉编解码器是否只能使用 I 帧
- `isLossy`告诉编解码器是否可以进行有损编码/解码
- `isLossless`告诉编解码器是否可以进行无损编码/解码

对于某些 ffmpeg/avcodec 版本，描述包括“Foo 编解码器（解码器：libdecodefoo）（编码器：libencodefoo）”形式的编码器/解码器提及。在这种情况下，您将希望改用这些编码器/解码器（ `getAvailableCodecs`返回的编解码器对象也将包含它们）。

编码器返回的对象如下所示：

```
{
  ...
  libmp3lame: {
    type: 'audio',
    description: 'MP3 (MPEG audio layer 3) (codec mp3)',
    frameMT: false,
    sliceMT: false,
    experimental: false,
    drawHorizBand: false,
    directRendering: false
  },
  ...
}
```



- `type`表示编码器类型，可以是“audio”、“video”或“subtitle”
- `experimental`表示编码器是否是实验性的。当使用这样的编解码器时，Fluent-ffmpeg 会自动添加“-strictexperimental”标志。

过滤器返回的对象如下所示：

```
{
  ...
  scale: {
    description: 'Scale the input video to width:height size and/or convert the image format.',
    input: 'video',
    multipleInputs: false,
    output: 'video',
    multipleOutputs: false
  },
  ...
}
```



- `input`告诉该过滤器操作的输入类型，“音频”、“视频”或“无”之一。当“none”时，过滤器可能从无到有生成输出
- `multipleInputs`告诉过滤器是否可以接受多个输入
- `output`告诉该过滤器生成的输出类型，“音频”、“视频”或“无”之一。当“none”时，过滤器没有输出（仅接收器）
- `multipleInputs`告诉过滤器是否可以生成多个输出

###  克隆 FfmpegCommand



您可以通过调用`clone()`方法来创建FfmpegCommand实例的克隆。克隆将是调用时原始版本的精确副本（相同的输入、相同的选项、相同的事件处理程序等）。当您想要对同一输入应用不同的处理选项时，这主要有用。

在克隆上设置选项、添加输入或事件处理程序不会影响原始命令。

```
// Create a command to convert source.avi to MP4
var command = ffmpeg('/path/to/source.avi')
  .audioCodec('libfaac')
  .videoCodec('libx264')
  .format('mp4');

// Create a clone to save a small resized version
command.clone()
  .size('320x200')
  .save('/path/to/output-small.mp4');

// Create a clone to save a medium resized version
command.clone()
  .size('640x400')
  .save('/path/to/output-medium.mp4');

// Save a converted version with the original size
command.save('/path/to/output-original-size.mp4');
```