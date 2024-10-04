在 Node.js 中操作 Excel 文件，通常使用第三方库，如 `xlsx` 或 `exceljs`。

------

## 1. **使用** `xlsx` **库操作 Excel 文件**

`xlsx` 是一个轻量的 Excel 文件处理库，支持 Excel 文件的读取和写入，兼容 `.xlsx` 和 `.xls` 文件格式。

### 安装

```bash
npm install xlsx
```

### 读取 Excel 文件

使用 `xlsx` 读取 Excel 文件，并提取其中的数据。

```javascript
const XLSX = require('xlsx');

// 读取 Excel 文件
const workbook = XLSX.readFile('example.xlsx');

// 获取工作簿中的所有表名
const sheetNames = workbook.SheetNames;

// 读取第一个工作表
const firstSheet = workbook.Sheets[sheetNames[0]];

// 将工作表转换为 JSON 格式
const data = XLSX.utils.sheet_to_json(firstSheet);

console.log(data); // 打印工作表数据
```

### 创建并写入 Excel 文件

你可以通过 `xlsx` 创建新的 Excel 文件并将其保存。

```javascript
const XLSX = require('xlsx');

// 创建一个新的工作簿
const workbook = XLSX.utils.book_new();

// 创建数据
const data = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
];

// 将 JSON 数据转换为工作表
const worksheet = XLSX.utils.json_to_sheet(data);

// 添加工作表到工作簿
XLSX.utils.book_append_sheet(workbook, worksheet, 'People');

// 将工作簿写入到 Excel 文件
XLSX.writeFile(workbook, 'people.xlsx');
```

### 常用 API

- `XLSX.readFile(path)`：读取文件，返回工作簿对象。
- `XLSX.utils.sheet_to_json(sheet)`：将工作表转换为 JSON。
- `XLSX.utils.json_to_sheet(data)`：将 JSON 数据转换为工作表。
- `XLSX.writeFile(workbook, path)`：将工作簿写入文件。
- `XLSX.utils.book_new()`：创建一个新工作簿。
- `XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)`：将工作表添加到工作簿中。

------

## 2. **使用** `exceljs` **库操作 Excel 文件**

`exceljs` 是功能更丰富的库，支持更复杂的 Excel 操作，例如设置单元格样式、格式、合并单元格等。

### 安装

```bash
npm install exceljs
```

### 读取 Excel 文件

可以通过 `exceljs` 读取 Excel 文件的内容，处理其中的工作表和单元格。

```javascript
const ExcelJS = require('exceljs');

// 创建工作簿对象
const workbook = new ExcelJS.Workbook();

// 读取 Excel 文件
workbook.xlsx.readFile('example.xlsx').then(() => {
  const worksheet = workbook.getWorksheet(1); // 获取第一个工作表

  // 遍历每一行
  worksheet.eachRow((row, rowNumber) => {
    console.log(`Row ${rowNumber}: ${row.values}`);
  });
});
```

### 创建并写入 Excel 文件

你可以通过 `exceljs` 创建一个新的 Excel 文件，设置单元格样式并保存文件。

```javascript
const ExcelJS = require('exceljs');

// 创建一个新的工作簿
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('My Sheet');

// 添加标题行
worksheet.columns = [
  { header: 'Name', key: 'name', width: 20 },
  { header: 'Age', key: 'age', width: 10 },
];

// 添加数据行
worksheet.addRow({ name: 'Alice', age: 25 });
worksheet.addRow({ name: 'Bob', age: 30 });

// 设置单元格样式
worksheet.getCell('A1').font = { bold: true }; // 加粗标题
worksheet.getCell('B1').alignment = { horizontal: 'center' }; // 水平居中

// 保存工作簿到 Excel 文件
workbook.xlsx.writeFile('mySheet.xlsx').then(() => {
  console.log('Excel 文件已保存');
});
```

### 设置单元格样式

`exceljs` 提供了丰富的样式设置功能：

```javascript
// 设置字体、颜色和对齐
worksheet.getCell('A1').font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF0000FF' } };
worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };

// 设置边框
worksheet.getCell('A1').border = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
};

// 设置填充
worksheet.getCell('A1').fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFFF0000' },
};
```

### 合并单元格

可以合并单元格，将多个单元格显示为一个。

```javascript
worksheet.mergeCells('A1:B2'); // 将 A1 到 B2 合并为一个单元格
worksheet.getCell('A1').value = 'Merged Cells'; // 设置合并后单元格的值
```

### 常用 API

- `workbook.addWorksheet(name)`：添加一个新的工作表。
- `worksheet.addRow(data)`：向工作表中添加一行。
- `worksheet.getCell(address)`：获取指定单元格。
- `worksheet.columns`：设置工作表的列（包括标题和宽度）。
- `worksheet.eachRow(callback)`：遍历每一行。
- `workbook.xlsx.readFile(path)`：读取 Excel 文件。
- `workbook.xlsx.writeFile(path)`：写入 Excel 文件。
- `worksheet.mergeCells(range)`：合并指定范围的单元格。

------

### `xlsx` 和 `exceljs` 的对比

- `xlsx`：轻量级，适合简单的数据读取和写入，操作相对简单，但不支持复杂的样式设置。
- `exceljs`：功能强大，支持复杂的样式、单元格格式、合并单元格等，适合需要更多自定义功能的场景。