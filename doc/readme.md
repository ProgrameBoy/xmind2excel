# xmind 用例转化为 Excel 文件

## 部署方案

### 依赖环境

- 前端：node.js
- 后端：node.js

### 安装模块命令

- 先安装淘宝NPM镜像 ：npm install -g cnpm --registry=https://registry.npm.taobao.org
- 前端：cnpm install
- 后端：cnpm install

### 启动命令

- 前端：npm run dev
- 后端：npm run dev

### 默认端口

- 前端：http://testvm:8080
- 后端：http://testvm:7001   // 如果修改后台端口需要同步修改前端访问后台接口 

### 修改前端访问后台接口  
- 默认：http://testvm:7001/submitxmind  
- 路径：web/src/assets/js/httpConfigPort.js/ 第2行

### 端口与启动修改地址

- 前端： web/config/index.js/ 第16行
- 后端： sever/config/config.default.js/ 第30行


