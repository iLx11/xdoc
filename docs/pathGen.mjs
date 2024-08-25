import path from 'path'
import fs from 'fs'

const srcDirPath = path.join(__dirname, 'src')
// const srcDirPath = path.join('src')

// 判断与拆分路径
const pathDepthGen = (rootPath, sidebarPath) => {
  let genArr = []
  const files = fs.readdirSync(rootPath, {
    withFileTypes: true,
  })
  files.forEach((o) => {
    if (o.isDirectory()) {
      genArr.push({
        text: o.name,
        collapsed: true,
        items: pathDepthGen(path.join(rootPath, o.name), `${sidebarPath}${o.name}/`),
      })
    } else if (o.name.includes('.md') && !o.name.includes('index')) {
      const mdFile = o.name.replace('.md', '')
      genArr.push({
        text: mdFile,
        link: `${sidebarPath}/${mdFile}`,
      })
    }
  })
  // console.info(genArr, '--------------------------------------')
  return genArr
}
export const sidebarPathGen = (sidebarPath) => {
  return pathDepthGen(path.join(srcDirPath, sidebarPath), sidebarPath)
}

// sidebarPathGen('/hardware/note/')

