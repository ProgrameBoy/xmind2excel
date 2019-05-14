# xmind2excel
### 简介
- 提供 web 界面，用户上传 xmind 文件，服务端后台解析数据后返回给前台转换成 Excel 文件之后，提供用户下载
### 用途
- 用于测试用例的文件转换
### 选用技术方案
- 语言：js
- 前端：vue.js
- 后台：egg.js
### 依赖环境
- 前端：node.js
- 后端：node.js

### 使用
- 通过选择或拖入框内上传xmind格式的用例文件
- 可解析成一个数据表格 默认字段：用例名称、操作步骤、预期结果
- 上传后可点击下载保存为excel文件或复制表格内容
### 安装依赖模块
- 前后端命令相同
```
$ npm install
```
> 安装较慢在安装以前之前先安装淘宝镜像
```
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
```
- 安装后使用 cnpm install 
### web 需更改项
```
// node_modules\xlsx-style\dist\cpexcel.js 807 行中：
var cpt = require(’./cpt’ + 'able'); 
// 改成 
var cpt = cptable；
```
### 端口修改
- 默认ip为本地ip 0.0.0.0
- 默认端口：前端8080 后端7001
### 修改地址
- 前端： web/config/index.js/  host与port
- 后端： sever/config/config.default.js/  hostname与port
> 如修改后端地址则应该同步修改前端访问后端地址 web/src/assets/js/httpConfigPort.js   port 
### 启动服务
- 前后端相同
```
$ npm run dev
```
  