const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const miniRoot = path.join(root, 'miniprogram')

function readJson(filePath) {
  const absolute = path.join(root, filePath)
  return JSON.parse(fs.readFileSync(absolute, 'utf8'))
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const appConfig = readJson('miniprogram/app.json')
const projectConfig = readJson('project.config.json')

assert(appConfig.pages[0] === 'pages/today/index', '“今日”必须是第一个注册页面')
assert(appConfig.tabBar && appConfig.tabBar.custom === true, '项目必须启用自定义 TabBar')
assert(appConfig.tabBar.list.length === 3, '一级导航应包含今日、行程、花费三个 Tab')
assert(projectConfig.miniprogramRoot === 'miniprogram/', 'miniprogramRoot 配置不正确')

const tabLabels = appConfig.tabBar.list.map((item) => item.text).join(',')
assert(tabLabels === '今日,行程,花费', `Tab 顺序错误：${tabLabels}`)

appConfig.pages.forEach((pagePath) => {
  ;['js', 'json', 'wxml', 'wxss'].forEach((extension) => {
    const filePath = path.join(miniRoot, `${pagePath}.${extension}`)
    assert(fs.existsSync(filePath), `缺少页面文件：${filePath}`)
    if (extension === 'json') JSON.parse(fs.readFileSync(filePath, 'utf8'))
  })
})

const customTabFiles = ['index.js', 'index.json', 'index.wxml', 'index.wxss']
customTabFiles.forEach((file) => {
  assert(fs.existsSync(path.join(miniRoot, 'custom-tab-bar', file)), `缺少自定义 TabBar 文件：${file}`)
})

console.log(`✓ 页面配置有效：${appConfig.pages.length} 个页面`)
console.log(`✓ 一级导航有效：${tabLabels}`)
console.log('✓ 项目结构校验通过')

