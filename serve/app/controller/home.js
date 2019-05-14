'use strict';
const Controller = require('egg').Controller;
const fs = require('mz/fs');
const moment = require('moment');
const path = require('path');
const awaitWriteStream = require('await-stream-ready').write;
const xmind2excel = require('../xmind2excel.js');
class HomeController extends Controller {
  async getXmindJSON() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    // 接收标记字段
    const targs = file.field;
    // 创建文件
    const reader = fs.createReadStream(file.filepath);
    // 获取上传文件名
    const fileName = file.filename.substr(0, file.filename.length - 6) + moment(new Date()).format('(YYYY-MM-DD#HHmmss)');
    // xmind路径
    const xmindFile = path.join(__dirname, '../public/xmind', fileName + '.xmind');
    // 写入
    const stream = fs.createWriteStream(xmindFile);
    await awaitWriteStream(reader.pipe(stream));
    ctx.body = { data: xmind2excel.x2e(xmindFile, targs), fileName };
    // 下载完后删除
    fs.unlink(xmindFile);
  }
}
module.exports = HomeController;
