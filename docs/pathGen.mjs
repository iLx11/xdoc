import path from 'path'
import fs from 'fs'
import { dir } from 'console'

const srcDirPath = path.join(__dirname, 'src')

// 判断与拆分路径
const pathDethGen = (sidebarPath, pathStrArr, joinPath, depth) => {
  if (depth == pathStrArr.length - 1) {
    return dirs.reduce((pre, cur) => {
      pre.push({
        text: cur.name,
        link: `${sidebarPath}${cur.name}`,
      })
      return pre
    }, [])
  } else {
    fs.readdir(joinPath, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.info(err)
        return
      }
      return pathDethGen(
        sidebarPath,
        pathStrArr,
        path.join(readPath, pathStrArr[depth]),
        depth + 1
      )
    })
  }
}

export const sidebarPathGen = (sidebarPath) => {
  // const pathStrArr = String(sidebarPath.replace(/^\/|\/$/g, '')).split('/')
  try {
    const files = fs.readdirSync(path.join(srcDirPath, sidebarPath), {
      withFileTypes: true,
    })
    const dirs = files.filter(
      (dir) => dir.name.includes('.md') && !dir.name.includes('index')
    )
    return dirs.reduce((pre, cur) => {
      const mdFile = cur.name.replace('.md', '')
      pre.push({
        text: mdFile,
        link: `${sidebarPath}/${mdFile}`,
      })
      return pre
    }, [])
  } catch (e) {
    console.info(e)
  }
}
// console.info(sidebarPathGen('/fontend/note'))
