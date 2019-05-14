<template>
  <div class="index">
    <h1>上传xmind文件导出excel文件</h1>
    <div class="wrap">
      <h2>拖入框内或选择上传</h2>
      <div
        id="drag"
        ref="drag"
        @drop.prevent="drop($event)"
        @dragover.prevent="preventDefault($event)"
        :class="{active:xmindFileName}"
        title="可拖入此框内上传或选择上传"
      >
        <div class="form">
          <input
            class="file"
            type="file"
            name="file"
            accept=".xmind"
            @change="getFile($event)"
            value="选择文件"
          >
        </div>
      </div>
      <p v-show="xmindFileName">
        <span
          class="filename"
          :title="xmindFileName"
        >已选择： {{xmindFileName || "未选择任何文件"}}</span>
        <el-button
          type="primary"
          @click="saveReport($event)"
          style="padding:10px;"
        >
          上传生成表格
          <i
            style="font-size:18px;"
            class="iconfont"
          >&#xe696;</i>
        </el-button>
      </p>
      <div
        class="progress"
        v-show="progress"
      >
        <div class="progress-div">
          <div
            class="progress-bar"
            :style="{width:this.progress + '%'}"
          ></div>
          <span class="precent">{{progress+"%"}}</span>
        </div>
        <span class="progress-mark">{{havedownload?"已完成":"上传中"}}</span>
      </div>
      <div
        class="inputtargs"
        v-show="xmindFileName"
      >添加标记：
        <input
          type="text"
          v-model="targs"
          placeholder="如需添加标记请先填写后再上传"
        >
      </div>
      <div class="badge " v-show="xmindFileName">
        <span>&nbsp;&nbsp;可选字段：</span>
        <p v-for="item in optionalStr" :key="item.value"> <input type="checkbox" :id="item.value" v-model="item.checked"> <label :for="item.value">{{item.label}}</label> </p>
        <!-- <p>
         <input type="checkbox" id="condition"><label for="condition">前置条件</label>
        </p> -->
      </div>
    </div>
    <!-- 表格 -->
    <div
      class="tablebox"
      v-show="havedownload"
    >
      <Table
        ref="table"
        :data="tableData"
      >
        <!-- 按钮 -->
        <div class="button">
          <el-button
            type="primary"
            class="copy"
            :data-clipboard-text="copyText"
            @click="copy"
          >
            复制表格内容
            <i
              style="font-size:18px;"
              class="iconfont"
            >&#xe629;</i>
          </el-button>
          <el-button
            type="primary"
            class="download"
            @click="downloadExl()"
          >
            下载excel文件
            <i
              style="font-size:20px;"
              class="iconfont"
            >&#xe78e;</i>
          </el-button>
        </div>
      </Table>
    </div>
  </div>
</template>
<script>
import Table from "@/components/Table";
import Clipboard from "clipboard";
import downloadfn from "@/assets/js/downloadexl";
export default {
  components: {
    Table
  },
  data() {
    return {
      config: {
        colwidth: [
          { wpx: 169 },
          { wpx: 63 },
          { wpx: 203 },
          { wpx: 128 },
          { wpx: 196 },
          { wpx: 184 },
          { wpx: 144 },
          { wpx: 47 },
          { wpx: 126 },
          { wpx: 70 },
          { wpx: 76 },
          { wpx: 102 }
        ],
        _this: this
      },
      // 表格展示数据
      tableData: {
        thData: ["用例名称", "操作步骤", "预期结果"],
        tdData: []
      },
      // 存储后台解析后的xmind文件数据
      xmindJSON: "",
      // 预下载的excle格式文件名
      fileName: "",
      // 已选择的xmind格式文件名
      xmindFileName: "",
      title: [
        "功能模块与路径",
        "用例编号",
        "前置条件",
        "用例名称",
        "操作步骤",
        "预期结果",
        "标记",
        "优先级",
        "用例属性",
        "编制人员",
        "用例设计时间",
        "备注",
        "班级"
      ],
      // 红色标题字段
      redTitle: ["用例名称", "操作步骤", "预期结果", "标记"],
      // 进度条
      progress: 0,
      // 选择的文件
      file: "",
      havedownload: false,
      downloadList: [],
      downloadFlag: true,
      copyText: "",
      copyflag: false,
      targs: "",
      optionalStr:[
        {
          label:"用例属性",
          value:"attribute",
          checked:false,
        },
        {
          label:"前置条件",
          value:"condition",
          checked:false
        }
      ]
      
    };
  },
  watch: {
    xmindFileName() {
      // 每次更换选择的文件进度条都重置为0
      this.progress = 0;
      this.havedownload = false;
    }
  },
  methods: {
    downloadExl() {
      // 防下载多次处理
      if (this.downloadList.includes(this.xmindFileName)) {
        if (!window.confirm("您刚刚已经下载过改文件了哦，需要重新下载吗？")){
          return false;
        }
      }
      var isrepeat = true;
      for(let key in this.xmindJSON[0]){
        if(this.xmindJSON[0][key] !== key){
          isrepeat = false;
        }
      }
      if(isrepeat){
        this.xmindJSON.shift()
      }
      downloadfn(this.xmindJSON, this.config);
      // 把已下载的xmind文件名存入已下载列表中
      this.downloadList.push(this.xmindFileName);
    },
    copy() {
      this.copyText = document.getElementById("tableText").innerText;
      let clipboard = new Clipboard(".copy");
      this.copyflag = true;
      setTimeout(() => {
        this.copyflag = false;
      }, 1000);
      this.$message(() => {
        return {
          message: "复制成功",
          type: "success"
        };
      });
    },
    // 当选择的文件更换时触发
    getFile(e) {
      // 获取选择的文件
      e = e || window.e;
      this.file = e.target.files[0];
      // 获取选择的xmind文件名
      this.xmindFileName = e.target.value.substr(
        e.target.value.indexOf("fakepath\\") + 9
      );
    },
    // 提交表单时触发
    saveReport(e) {
      this.preventDefault(e); // 阻止form表单提交跳转页面
      this.downloadFlag && this.send(); // 上传文件
      
    },
    // 拖入文件时
    drop(e) {
      this.preventDefault(e);
      this.file = e.dataTransfer.files[0];
      this.xmindFileName = this.file.name;
    },
    // 阻止默认事件
    preventDefault(e) {
      e = e || window.event;
      e.preventDefault();
    },
    // 上传文件格式是否为xmind检测
    formatDetection() {
      const filename = this.xmindFileName;
      const fileFormat = filename.substr(filename.lastIndexOf(".") + 1);
      return fileFormat == "xmind";
    },
    send() {
      // 重置表格所需展示字段
      this.tableData.thData = ["用例名称", "操作步骤", "预期结果"]
      // 是否需要新增字段
      this.optionalStr.forEach(item=>{
         item.checked && this.tableData.thData.push(item.label)
      })
      // 点击上传后需要等待上传完成才可以再次上传
      this.downloadFlag = false;
      // 判断上传文件是否为xmind格式
      if (!this.formatDetection()) {
        this.downloadFlag = true;
        alert("请上传xmind格式文件!");
        return false;
      }
      // 设置需要上传的数据
      let formData = new FormData();
      if(this.targs){
        if(!this.tableData.thData.includes("标记")){
          this.tableData.thData.push("标记")
        }
      }else {
        if(this.tableData.thData.includes("标记")){
        this.tableData.thData.splice(-1)
        }
      }
      formData.append(this.targs, this.file); // 通常我们提交（使用submit）时，会把form中的所有表单元素中的name与value组成一个查询字符串，提交到后台。但当使用ajax提交时，要使用formData对象的append(name,value)方法.
      // 添加完后清空输入框内容
      this.targs = "";
      var config = {
        // 进度条监听函数
        onUploadProgress: progressEvent => {
          var complete =
            ((progressEvent.loaded / progressEvent.total) * 100) | 0;
          this.progress = complete;
        }
      };
      this.axios
        .post(
          this.$ports.submitxmindport + "?" + new Date().getTime(),
          formData,
          config
        )
        .then(res => {
          // 接收后台解析后的xmind文件数据
          this.xmindJSON = res.data.data;
          // 表格数据处理
          let tdData = [];
          // 遍历所有数据
          this.xmindJSON.forEach(item => {
            let tr = [];
            // 筛选出所要展示的字段数据
            this.tableData.thData.forEach(val => {
              tr.push(item[val]);
            });
            tdData.push(tr);
          });
          this.tableData.tdData = tdData;
          this.havedownload = true;
          // 接收预下载的excel文件名
          this.fileName = res.data.fileName;
          // 避免多次点击上传
          this.downloadFlag = true;
        });
    }
  }
};
</script>
<style>
@import "../assets/css/index";
</style>


