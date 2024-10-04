\1. 安装 Nedb

使用npm进行安装：

```bash
npm install nedb
```

\2. 创建数据库实例

（1）简单示例

```javascript
const Datastore = require('nedb');
const db = new Datastore({ filename: 'path/to/database.db', autoload: true });
```

（2） options 参数说明

- filename（可选）：数据持久化的文件路径。如果留空，数据库将被自动视为内存数据库。注意路径不能以~结尾，因为这是NeDB用于执行安全写入的临时文件的标志。
- inMemoryOnly（可选，默认为false）：指定是否为内存数据库。
- timestampData（可选，默认为false）：是否为所有文档添加插入和最后更新的时间戳字段，分别是 createdAt 和 updatedAt。用户指定的值会覆盖自动生成的值，通常用于测试。
- autoload（可选，默认为false）：如果使用此选项，数据库将在创建时自动从数据文件加载（无需调用loadDatabase）。在加载完成之前发出的任何命令都会被缓冲，将在加载完成后执行。
- onload（可选）：如果使用自动加载，这是在loadDatabase之后调用的处理程序。它接受一个错误参数。如果使用自动加载而没有指定此处理程序，如果在加载期间发生错误，将抛出一个错误。
- afterSerialization（可选）：用于在序列化后、写入磁盘之前转换数据的钩子。可以用于在写入数据库到磁盘之前加密数据。此函数以字符串作为参数（NeDB数据文件的一行），并输出转换后的字符串，绝对不能包含\n字符，否则会丢失数据。
- beforeDeserialization（可选）：afterSerialization的反向操作。确保同时包含两者，否则可能导致数据丢失。出于相同的原因，确保两个函数是彼此的反函数。NeDB会检查是否声明了其中一个而没有另一个，并通过对各种长度的随机字符串进行测试，检查它们是否是彼此的反函数来防止数据丢失。此外，如果检测到数据损坏过多，NeDB将拒绝启动，因为这可能意味着您没有在使用序列化钩子之前使用对应的反序列化钩子（请参见下文）。
- corruptAlertThreshold（可选）：介于0和1之间，默认为10%。如果数据文件损坏的百分比超过此阈值，NeDB将拒绝启动。0表示不容忍任何损坏，1表示不关心。
- compareStrings（可选）：函数compareStrings(a, b)比较字符串a和b，返回-1、0或1。如果指定了此函数，它将覆盖默认的字符串比较，后者对于非美国字符（特别是重音字母）不太适用。本机的localCompare在大多数情况下都是正确的选择。

### 3. 插入数据

```javascript
const newData = { name: 'John Doe', age: 25, city: 'New York' };
db.insert(newData, (err, insertedData) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Data inserted:', insertedData);
  }
});
```

### 4. 查询数据

下面是官网的一些示例

```javascript
// 假设数据库有这些数据
// { _id: 'id1', planet: 'Mars', system: 'solar', inhabited: false, satellites: ['Phobos', 'Deimos'] }
// { _id: 'id2', planet: 'Earth', system: 'solar', inhabited: true, humans: { genders: 2, eyes: true } }
// { _id: 'id3', planet: 'Jupiter', system: 'solar', inhabited: false }
// { _id: 'id4', planet: 'Omicron Persei 8', system: 'futurama', inhabited: true, humans: { genders: 7 } }
// { _id: 'id5', completeData: { planets: [ { name: 'Earth', number: 3 }, { name: 'Mars', number: 2 }, { name: 'Pluton', number: 9 } ] } }

// 查找所有太阳系统行星
db.find({ system: 'solar' }, function (err, docs) {
  // docs is an array containing documents Mars, Earth, Jupiter
  // If no document is found, docs is equal to []
});

// 查询找名称里包含ar的，使用正则表达式查询
db.find({ planet: /ar/ }, function (err, docs) {
  // docs contains Mars and Earth
});

// 查找从太阳系继承的
db.find({ system: 'solar', inhabited: true }, function (err, docs) {
  // docs is an array containing document Earth only
});

// 使用点分匹配多级的文档
db.find({ "humans.genders": 2 }, function (err, docs) {
  // docs contains Earth
});

// 使用点分来索引子文档数组
db.find({ "completeData.planets.name": "Mars" }, function (err, docs) {
  // docs contains document 5
});

db.find({ "completeData.planets.name": "Jupiter" }, function (err, docs) {
  // docs is empty
});

db.find({ "completeData.planets.0.name": "Earth" }, function (err, docs) {
  // docs contains document 5
  // If we had tested against "Mars" docs would be empty because we are matching against a specific array element
});


// 深度比较，与点分有所不同
db.find({ humans: { genders: 2 } }, function (err, docs) {
  // docs is empty, because { genders: 2 } is not equal to { genders: 2, eyes: true }
});

// 返回所有数据
db.find({}, function (err, docs) {
});

// The same rules apply when you want to only find one document
db.findOne({ _id: 'id1' }, function (err, doc) {
  // doc is the document Mars
  // If no document is found, doc is null
});
```

查询操作支持一些运算符，如大于、小于、包含、存在、正则表达式等，示例如下：

```javascript
// 数值比较
db.find({ "humans.genders": { $gt: 5 } }, function (err, docs) {
  // docs contains Omicron Persei 8, whose humans have more than 5 genders (7).
});

// 字符串比较
db.find({ planet: { $gt: 'Mercury' }}, function (err, docs) {
  // docs contains Omicron Persei 8
})

// in 包含
db.find({ planet: { $in: ['Earth', 'Jupiter'] }}, function (err, docs) {
  // docs contains Earth and Jupiter
});

// 是否存在
db.find({ satellites: { $exists: true } }, function (err, docs) {
  // docs contains only Mars
});

// 联合使用操作符
db.find({ planet: { $regex: /ar/, $nin: ['Jupiter', 'Earth'] } }, function (err, docs) {
  // docs only contains Mars because Earth was excluded from the match by $nin
});
```

### 5. 查询和分页

当使用NeDB进行查询（`find`、`findOne`或`count`）而没有指定回调函数时，会返回一个Cursor对象。可以使用`sort`、`skip`和`limit`来修改游标，然后使用`exec(callback)`来执行。

```javascript
// 假设数据库包含以下4个文档
// doc1 = { _id: 'id1', planet: 'Mars', system: 'solar', inhabited: false, satellites: ['Phobos', 'Deimos'] }
// doc2 = { _id: 'id2', planet: 'Earth', system: 'solar', inhabited: true, humans: { genders: 2, eyes: true } }
// doc3 = { _id: 'id3', planet: 'Jupiter', system: 'solar', inhabited: false }
// doc4 = { _id: 'id4', planet: 'Omicron Persei 8', system: 'futurama', inhabited: true, humans: { genders: 7 } }

// 在没有使用查询条件的情况下，返回所有结果（在游标修改器之前）
db.find({}).sort({ planet: 1 }).skip(1).limit(2).exec(function (err, docs) {
  // docs 是 [doc3, doc1]
});

// 可以按照反向顺序排序
db.find({ system: 'solar' }).sort({ planet: -1 }).exec(function (err, docs) {
  // docs 是 [doc1, doc3, doc2]
});

// 可以按照一个字段，然后按照另一个字段排序，以此类推
db.find({}).sort({ firstField: 1, secondField: -1 }) ...   // 你明白这是如何工作的！
```

这段代码展示了如何使用NeDB进行排序和分页。通过`sort`方法，可以按照指定字段对结果进行排序，而`skip`和`limit`则用于分页。这提供了在NeDB中自定义返回结果顺序和数量的灵活性。

### 6. 投影

投影是指在查询时指定返回结果中的字段，NeDB提供了投影的功能，类似于MongoDB。投影的语法为：{ a: 1, b: 1 } 表示只返回a和b字段，{ a: 0, b: 0 } 表示省略a和b字段。不同的是，你不能同时使用这两种模式，除非是_id字段，默认情况下总是返回的，但你可以选择省略。投影也可以用于嵌套文档。

```javascript
// 以上述数据库为例

// 仅保留给定的字段
db.find({ planet: 'Mars' }, { planet: 1, system: 1 }, function (err, docs) {
  // docs 是 [{ planet: 'Mars', system: 'solar', _id: 'id1' }]
});

// 仅保留给定的字段，但省略 _id
db.find({ planet: 'Mars' }, { planet: 1, system: 1, _id: 0 }, function (err, docs) {
  // docs 是 [{ planet: 'Mars', system: 'solar' }]
});

// 仅省略给定的字段，并删除 _id
db.find({ planet: 'Mars' }, { planet: 0, system: 0, _id: 0 }, function (err, docs) {
  // docs 是 [{ inhabited: false, satellites: ['Phobos', 'Deimos'] }]
});

// 失败示例：同时使用两种模式
db.find({ planet: 'Mars' }, { planet: 0, system: 1 }, function (err, docs) {
  // err 是错误消息，docs 是 undefined
});

// 也可以以 Cursor 方式使用，但这种语法与 MongoDB 不兼容
db.find({ planet: 'Mars' }).projection({ planet: 1, system: 1 }).exec(function (err, docs) {
  // docs 是 [{ planet: 'Mars', system: 'solar', _id: 'id1' }]
});

// 对嵌套文档进行投影
db.findOne({ planet: 'Earth' }).projection({ planet: 1, 'humans.genders': 1 }).exec(function (err, doc) {
  // doc 是 { planet: 'Earth', _id: 'id2', humans: { genders: 2 } }
});
```

### 7. 查询数量

```javascript
// Count all planets in the solar system
db.count({ system: 'solar' }, function (err, count) {
  // count equals to 3
});

// Count all documents in the datastore
db.count({}, function (err, count) {
  // count equals to 4
});
```

### 8. 更新

db.update(query, update, options, callback)

（1）参数说明

update

指定文档应如何修改。它可以是一个新文档，也可以是一组修饰符，但不能同时使用。

- 新文档将替换匹配的文档。
- 修饰符创建它们需要修改的字段，可以应用于子文档。

**可用的字段修饰符有**

$set（更改字段的值）

$unset（删除字段）

$inc（递增字段的值）

$min/$max 仅在提供的值小于/大于当前值时更改字段的值。

**对于数组，有**

$push

$pop

$addToSet

$pull

$each

$slice

**options**

是一个具有两个可能参数的对象

- multi（默认为 false）允许如果设置为 true，则修改多个文档
- upsert（默认为 false）如果要根据更新规则插入新文档，如果查询不匹配任何内容。如果您的更新是一个没有修饰符的简单对象，则它是插入的文档。在其他情况下，查询将递归地去除所有运算符。
- returnUpdatedDocs（默认为 false，不兼容 MongoDB），如果设置为 true 并且更新不是 upsert，则会返回由查询匹配并更新的文档数组。即使更新实际上没有修改它们，也会返回更新的文档。

```javascript
// 使用与“查找文档”部分相同的示例集合
// { _id: 'id1', planet: 'Mars', system: 'solar', inhabited: false }
// { _id: 'id2', planet: 'Earth', system: 'solar', inhabited: true }
// { _id: 'id3', planet: 'Jupiter', system: 'solar', inhabited: false }
// { _id: 'id4', planet: 'Omicron Persia 8', system: 'futurama', inhabited: true }

// 替换文档
db.update({ planet: 'Jupiter' }, { planet: 'Pluto'}, {}, function (err, numReplaced) {
  // numReplaced = 1
  // 文档 #3 已被替换为 { _id: 'id3', planet: 'Pluto' }
  // 请注意，_id 保持不变，文档已被替换（'system' 和 'inhabited' 字段不再存在）
});

// 设置现有字段的值
db.update({ system: 'solar' }, { $set: { system: 'solar system' } }, { multi: true }, function (err, numReplaced) {
  // numReplaced = 3
  // Mars、Earth、Jupiter 上的 'system' 字段现在具有值 'solar system'
});

// 在子文档中使用点符号表示法设置不存在字段的值
db.update({ planet: 'Mars' }, { $set: { "data.satellites": 2, "data.red": true } }, {}, function () {
  // Mars 文档现在是 { _id: 'id1', system: 'solar', inhabited: false
  //                      , data: { satellites: 2, red: true }
  //                      }
  // 请注意，要设置子文档中的字段，您必须使用点符号表示法
  // 使用对象表示法将仅替换顶级字段
  db.update({ planet: 'Mars' }, { $set: { data: { satellites: 3 } } }, {}, function () {
    // Mars 文档现在是 { _id: 'id1', system: 'solar', inhabited: false
    //                      , data: { satellites: 3 }
    //                      }
    // 您失去了“data.red”字段，这可能不是预期的行为
  });
});

// 删除字段
db.update({ planet: 'Mars' }, { $unset: { planet: true } }, {}, function () {
  // 现在 Mars 文档不包含 planet 字段
  // 您当然也可以使用点符号表示法取消嵌套字段
});

// Upsert 文档
db.update({ planet: 'Pluto' }, { planet: 'Pluto', inhabited: false }, { upsert: true }, function (err, numReplaced, upsert) {
  // numReplaced = 1, upsert = { _id: 'id5', planet: 'Pluto', inhabited: false }
  // 已向集合添加了新文档 { _id: 'id5', planet: 'Pluto', inhabited: false }
});

// 如果使用修饰符进行 upsert，那么 upserted 文档是由修饰符修改的查询
// 这比听起来简单:)
db.update({ planet: 'Pluto' }, { $inc: { distance: 38 } }, { upsert: true }, function () {
  // 添加了新文档 { _id: 'id5', planet: 'Pluto', distance: 38 }
});
```

### 9. 删除

`db.remove(query, options, callback)` 将根据选项删除与查询匹配的所有文档：

- query：与用于查找和更新的查询相同
- options：目前只有一个选项：multi，如果设置为 true，允许删除多个文档。默认为 false
- callback：可选，签名为：(err, numRemoved)

```javascript
// 使用与“查找文档”部分相同的示例集合
// { _id: 'id1', planet: 'Mars', system: 'solar', inhabited: false }
// { _id: 'id2', planet: 'Earth', system: 'solar', inhabited: true }
// { _id: 'id3', planet: 'Jupiter', system: 'solar', inhabited: false }
// { _id: 'id4', planet: 'Omicron Persia 8', system: 'futurama', inhabited: true }

// 从集合中删除一个文档
// 选项设置为 {}，因为默认情况下 multi 为 false
db.remove({ _id: 'id2' }, {}, function (err, numRemoved) {
  // numRemoved = 1
});

// 删除多个文档
db.remove({ system: 'solar' }, { multi: true }, function (err, numRemoved) {
  // numRemoved = 3
  // 所有来自太阳系的行星都被移除了
});

// 移除具有“match-all”查询的所有文档
db.remove({}, { multi: true }, function (err, numRemoved) {
});
```

### 10. 索引

使用 datastore.ensureIndex(options, cb) 创建索引。

ensureIndex 可以在需要时调用，即使已经插入了一些数据，但最好在应用程序启动时调用。

**参数 options 选项包括：**

- fieldName（必需）：要创建索引的字段的名称。使用点表示法在嵌套文档中索引字段。
- unique（可选，默认为 false）：强制字段的唯一性。请注意，唯一索引将在尝试为未定义该字段的两个文档创建索引时引发错误。
- sparse（可选，默认为 false）：不要为未定义该字段的文档创建索引。如果希望接受未定义该字段的多个文档，请与 “unique” 选项一起使用。
- expireAfterSeconds（秒数，可选）：如果设置，创建的索引是一个 TTL（生存时间）索引，当系统日期变得大于索引字段上的日期加上 expireAfterSeconds 时，将自动删除文档。未指定索引字段或索引字段不是日期对象的文档将被忽略。

**注意：_id 会自动带有唯一约束的索引，不需要调用 ensureIndex。 **

删除索引使用 `datastore.removeIndex(fieldName, cb)` 。

如果数据存储是持久的，则创建的索引将保存在数据文件中，当第二次加载数据库时，索引会自动创建。

```javascript
// 创建索引
db.ensureIndex({ fieldName: 'somefield' }, function (err) {
  // 如果出错，err 不为 null
});

// 使用索引添加唯一约束
db.ensureIndex({ fieldName: 'somefield', unique: true }, function (err) {
});

// 使用稀疏唯一索引
db.ensureIndex({ fieldName: 'somefield', unique: true, sparse: true }, function (err) {
});

// 当唯一约束未满足时的错误消息格式
db.insert({ somefield: 'nedb' }, function (err) {
  // err 为 null
  db.insert({ somefield: 'nedb' }, function (err) {
    // err 为 { errorType: 'uniqueViolated', key: 'name', message: 'Unique constraint violated for key name' }
  });
});

// 移除字段 somefield 上的索引
db.removeIndex('somefield', function (err) {
});

// 使用 expireAfterSeconds 在创建后 1 小时删除文档的示例（db 的 timestampData 选项在此处为 true）
db.ensureIndex({ fieldName: 'createdAt', expireAfterSeconds: 3600 }, function (err) {
});

// 使用该选项设置过期日期
db.ensureIndex({ fieldName: 'expirationDate', expireAfterSeconds: 0 }, function (err) {
  // 现在，所有文档将在系统时间达到其 expirationDate 字段中的日期时过期
});
```