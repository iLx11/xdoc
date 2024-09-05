## fs-extra

### Async 异步

- [copy复制](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/copy.md)
- [emptyDir空目录](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/emptyDir.md)
- [ensureFile确保文件](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/ensureFile.md)
- [ensureDir确保目录](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/ensureDir.md)
- [ensureLink确保链接](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/ensureLink.md)
- [ensureSymlink确保符号链接](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/ensureSymlink.md)
- [mkdirp](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/ensureDir.md)
- [mkdirsMKDIR](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/ensureDir.md)
- [move移动](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/move.md)
- [outputFile输出文件](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/outputFile.md)
- [outputJson输出Json](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/outputJson.md)
- [pathExists路径存在](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/pathExists.md)
- [readJson读Json](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/readJson.md)
- [remove消除](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/remove.md)
- [writeJson写Json](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/writeJson.md)

### Sync 同步

- [copySync复制同步](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/copy-sync.md)
- [emptyDirSync空目录同步](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/emptyDir-sync.md)
- [ensureFileSync确保文件同步](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/ensureFile-sync.md)
- [ensureDirSync确保目录同步](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/ensureDir-sync.md)
- [ensureLinkSync确保链路同步](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/ensureLink-sync.md)
- [ensureSymlinkSync确保符号链接同步](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/ensureSymlink-sync.md)
- [mkdirpSyncMKDIRP同步](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/ensureDir-sync.md)
- [mkdirsSyncMKDIR同步](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/ensureDir-sync.md)
- [moveSync移动同步](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/move-sync.md)
- [outputFileSync输出文件同步](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/outputFile-sync.md)
- [outputJsonSync输出JsonSync](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/outputJson-sync.md)
- [pathExistsSync路径存在同步](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/pathExists-sync.md)
- [readJsonSync读取JsonSync](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/readJson-sync.md)
- [removeSync删除同步](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/remove-sync.md)
- [writeJsonSync写JsonSync](https://github.com/jprichardson/node-fs-extra/blob/HEAD/docs/writeJson-sync.md)

```javascript
const fs = require('fs-extra')

// Async with promises:
fs.copy('/tmp/myfile', '/tmp/mynewfile')
  .then(() => console.log('success!'))
  .catch(err => console.error(err))
// Async with callbacks:

fs.copy('/tmp/myfile', '/tmp/mynewfile', err => {
  if (err) return console.error(err)
  console.log('success!')
})

// Sync:
try {
  fs.copySync('/tmp/myfile', '/tmp/mynewfile')
  console.log('success!')
} catch (err) {
  console.error(err)
}

// Async/Await:
async function copyFiles () {
  try {
    await fs.copy('/tmp/myfile', '/tmp/mynewfile')
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}

copyFiles()
```

# buffer

```javascript
const { Buffer } = require('node:buffer')

// 创建一个 0 填充，长度为 10 的 buffer
const buf1 = Buffer.alloc(10)

// 创建指定填充
const buf2 = Buffer.alloc(10, 1)

// 创建未初始化的 buffer
const buf3 = Buffer.allocUnsafe(10)

// 创建字节数组为 [1, 2, 3] 的 buffer
const buf4 = Buffer.from([1, 2, 3])
```

## 字符串转 buffer

### 指定编码

```javascript
const buf = Buffer.from('hello world', 'utf8')

// 转为 16 进制
buf.toString('hex')
Buffer.from('hello world', 'hex')

// 转为 base64
buf.toString('base64')

// 转为二进制
buf.toString('binary')
```



## buffer 与 TypeArray

```javascript
const buf = Buffer.from([1, 2, 3])

const uint32array = new Uint32Array(buf)
const uint16array = new Uint16Array( 
  buf.buffer,
  buf.byteOffset,
  buf.length / Uint16Array.BYTES_PER_ELEMENT)
```

## Buffer.concat(list[, totalLength])

- list [](https://nodejs.cn/api/buffer.html#class-buffer) | [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 要连接的 Buffer 或 [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) 实例的列表。
- totalLength [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 连接时 list 中 Buffer 实例的总长度。
- 返回： [](https://nodejs.cn/api/buffer.html#class-buffer)

返回新的 Buffer，它是将 list 中的所有 Buffer 实例连接在一起的结果。

如果列表没有条目，或者 totalLength 为 0，则返回新的零长度 Buffer。

如果未提供 totalLength，则从 list 中的 Buffer 实例通过相加其长度来计算。

如果提供了 totalLength，则将其强制为无符号整数。 如果 list 中的 Buffer 的组合长度超过 totalLength，则结果将被截断为 totalLength。

```javascript
const buf1 = Buffer.alloc(10)
const buf2 = Buffer.alloc(14)
const buf3 = Buffer.alloc(18)

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);
```

## Buffer.isBuffer(obj)

- obj [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- 返回： [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 obj 是 Buffer，则返回 true，否则返回 false。



## Buffer.isEncoding(encoding)[#](https://nodejs.cn/api/buffer.html#静态方法bufferisencodingencoding)

- encoding [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要检查的字符编码名称。
- 返回： [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

如果 encoding 是支持的字符编码的名称，则返回 true，否则返回 false。

```javascript
console.log(Buffer.isEncoding('hex'));
// Prints: true

console.log(Buffer.isEncoding('utf/8'));
// Prints: false
```

## buf.indexOf(value[, byteOffset][, encoding])

- value [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [](https://nodejs.cn/api/buffer.html#class-buffer) | [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array) | [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要搜索的内容。
- byteOffset [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始搜索 buf 的位置。 如果为负数，则从 buf 的末尾开始计算偏移量。 **默认值：** 0。
- encoding [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 如果 value 是字符串，则这是用于确定将在 buf 中搜索的字符串的二进制表示的编码。 **默认值：** 'utf8'。
- 返回： [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) buf 中第一次出现 value 的索引，如果 buf 不包含 value，则为 -1。

如果 value 是：

- 字符串，value 根据 encoding 中的字符编码进行解释。
- Buffer 或 [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), value 将全部使用。 要比较部分 Buffer，则使用 [buf.subarray](https://nodejs.cn/api/buffer.html#bufsubarraystart-end)。
- 数字，value 将被解释为 0 和 255 之间的无符号 8 位整数值。

```javascript
const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// Prints: 0
console.log(buf.indexOf('is'));
// Prints: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// Prints: 8
console.log(buf.indexOf(97));
// Prints: 8 (97 is the decimal ASCII value for 'a')
```

## buf.keys() & buf.values()

创建并返回 [迭代器](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) 的 buf 键（索引）。

```javascript
const { Buffer } = require('node:buffer');

const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key);
}
// Prints:
//   0
//   1
//   2
//   3
//   4
//   5

for (const value of buf.values()) {
  console.log(value);
}
// Prints:
//   98
//   117
//   102
//   102
//   101
//   114
```

## buf.write(string[, offset[, length]][, encoding])[#](https://nodejs.cn/api/buffer.html#bufwritestring-offset-length-encoding)

- string [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 要写入 buf 的字符串。
- offset [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 开始写入 string 之前要跳过的字节数。 **默认值：** 0。
- length [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 要写入的最大字节数（写入的字节数不会超过 buf.length - offset）。 **默认值：** buf.length - offset。
- encoding [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) string 的字符编码。 **默认值：** 'utf8'。
- 返回： [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 写入的字节数。

根据 encoding 中的字符编码将 string 写入 buf 的 offset 处。 length 参数是要写入的字节数。 如果 buf 没有足够的空间来容纳整个字符串，则只会写入 string 的一部分。 但是，不会写入部分编码的字符。

```javascript
const buffer = Buffer.alloc(10);

// offset 为 8，只能写 2 个字节
const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// Prints: 2 bytes : ab
```





# Crypto

## Hash

- 继承： [](https://nodejs.cn/api/stream.html#class-streamtransform)

Hash 类是用于创建数据的哈希摘要的实用工具。 它可以通过以下两种方式之一使用：

- 作为可读可写的 [流](https://nodejs.cn/api/stream.html)，写入数据以在可读端生成计算的哈希摘要，或者
- 使用 [hash.update()](https://nodejs.cn/api/crypto.html#hashupdatedata-inputencoding) 和 [hash.digest()](https://nodejs.cn/api/crypto.html#hashdigestencoding) 方法生成计算的哈希。

[crypto.createHash()](https://nodejs.cn/api/crypto.html#cryptocreatehashalgorithm-options) 方法用于创建 Hash 实例。 Hash 对象不能直接使用 new 关键字创建。

```javascript
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.on('readable', () => {
  // Only one element is going to be produced by the
  // hash stream.
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});

hash.write('some data to hash');
hash.end();
```

使用 Hash 和管道流：

```javascript
const { createReadStream } = require('node:fs');
const { createHash } = require('node:crypto');
const { stdout } = require('node:process');

const hash = createHash('sha256');

const input = createReadStream('test.js');
input.pipe(hash).setEncoding('hex').pipe(stdout);拷贝
```

使用 [hash.update()](https://nodejs.cn/api/crypto.html#hashupdatedata-inputencoding) 和 [hash.digest()](https://nodejs.cn/api/crypto.html#hashdigestencoding) 方法：

```javascript
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('some data to hash');
console.log(hash.digest('hex'));
// Prints:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```

#### hash.copy([options])

- options [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) [stream.transform选项](https://nodejs.cn/api/stream.html#new-streamtransformoptions)
- 返回： [](https://nodejs.cn/api/crypto.html#class-hash)

创建新的 Hash 对象，其中包含当前 Hash 对象的内部状态的深层副本。

可选的 options 参数控制流的行为。 对于 XOF 哈希函数（例如 'shake256'），可以使用 outputLength 选项指定所需的输出长度（以字节为单位）。

在调用 [hash.digest()](https://nodejs.cn/api/crypto.html#hashdigestencoding) 方法后尝试复制 Hash 对象时会引发错误。

```javascript
// Calculate a rolling hash.
const {
  createHash,
} = require('node:crypto');

const hash = createHash('sha256');

hash.update('one');
console.log(hash.copy().digest('hex'));

hash.update('two');
console.log(hash.copy().digest('hex'));

hash.update('three');
console.log(hash.copy().digest('hex'));

// Etc.拷贝
```

#### hash.digest([字符编码][encoding])

- encoding [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) 返回值的 [字符编码](https://nodejs.cn/api/buffer.html#buffers-and-character-encodings)。
- 返回： [](https://nodejs.cn/api/buffer.html#class-buffer) | [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

计算传给被哈希的所有数据的摘要（使用 [hash.update()](https://nodejs.cn/api/crypto.html#hashupdatedata-inputencoding) 方法）。 如果提供了 encoding，将返回一个字符串； 否则返回 [Buffer](https://nodejs.cn/api/buffer.html)。

Hash 对象在调用 hash.digest() 方法后不能再次使用。 多次调用将导致抛出错误。

```javascript
// 以十六进制编码创建哈希对象
let hexDigest = crypto.createHash('sha256').update('Hello World').digest('hex')

// 使用摘要打印哈希值
console.log("哈希是： " + hexDigest)
```

#### hash.update(data[, inputEncoding])

- data [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [](https://nodejs.cn/api/buffer.html#class-buffer) | [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) | [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)
- inputEncoding [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) data 字符串的 [字符编码](https://nodejs.cn/api/buffer.html#buffers-and-character-encodings)。

方法是加密模块的Hash类的内置函数。这用于用给定的数据更新哈希。可以多次调用此方法以更新哈希的内容，因为此方法可以获取流数据，例如文件读取流。

使用给定的 data 更新哈希内容，其编码在 inputEncoding 中给出。 如果未提供 encoding，且 data 是字符串，则强制为 'utf8' 编码。 如果 data 是 [Buffer](https://nodejs.cn/api/buffer.html)、TypedArray 或 DataView，则忽略 inputEncoding。

这可以在流式传输时使用新数据多次调用。