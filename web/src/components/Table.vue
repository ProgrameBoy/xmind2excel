<template>
  <div class="table">
    <slot></slot>
    <table class="tableth">
      <tr>
        <th
          :style="{transform:'translateY('+top+'px)'}"
          v-for="thText in data.thData"
          :class="{lasttd:thText=='标记',attribute:thText=='用例属性',condition:thText == '前置条件'}"
          :key="thText"
        >{{thText}}
        </th>
      </tr>
    </table>
    <table id="tableText">
        <tr class="copyTr"
          v-for="(tdItem, i) in data.tdData"
          :key="'th'+i"
        >
          <td
            v-for="(tdText,i) in tdItem"
            :key="tdText?tdText:Math.random()"
            :class="{lasttd:data.thData[i] == '标记',attribute:data.thData[i] == '用例属性',condition:data.thData[i] == '前置条件'}"
          >{{tdText || "&nbsp;&nbsp;"}}
          </td>
        </tr>
    </table>
    <slot></slot>
  </div>
</template>
<script>
import Vue from "vue";
export default {
  props: ["data"],
  data() {
    return {
      top: 0,
      tableShowFlag: false
    };
  },
  mounted() {
    // 标题置顶
    var tableDom = document.getElementsByClassName("table")[0];
    tableDom.onscroll = e => {
      this.top = tableDom.scrollTop;
    };
  }
};
</script>
<style>
.table {
  width: 100%;
  max-height: 750px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-left: none;
}
#tableText{
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  border-spacing: 0;
}
#tableText tr{
  width: 100%;
  box-sizing: border-box;
}

#tableText tr td{
  /* width: 30%; */
  border-top: none;
  background: #fff;
}

.tableth{
  width: 100%;
  padding:0;
  border-spacing:0;
  background:#fff;
}
.tableth tr th{
  padding:0;
  background:#fff;
  /* width:30%; */
  border-left:1px solid #ccc;
  border-bottom:1px solid #ccc;
}
.lasttd{
  width: 10%!important;
}
.attribute{
  width: 10%!important;
}
.condition{
  width: 20%!important;
}
#tableText td {
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}

</style>


