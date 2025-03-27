<template>
  <div class="scroll-table-index">
    <div class="title">{{ title }}</div>
    <el-table
      class="scroll-table"
      ref="scroll_Table"
      :highlight-current-row="false"
      @mouseenter.native="autoScroll(false)"
      @mouseleave.native="autoScroll(true)"
      :data="tableData">
      <el-table-column width="80" prop="route" label="路线"></el-table-column>
      <el-table-column width="140" prop="last" label="上期 2024-10-18"></el-table-column>
      <el-table-column width="140" prop="current" label="本期 2024-10-25"></el-table-column>
      <el-table-column width="150" prop="differ" label="于上期比涨跌(%)"></el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, nextTick} from "vue";
import {ElTable, ElTableColumn} from "element-plus";

defineProps({
  title: {
    type: String,
    default: ''
  }
})

let tableData = ref([]);
for (let i = 1; i < 50; i++) {
  tableData.value.push({
    route: "路线" + i,
    last: Number(Math.random() * 3000).toFixed(2),
    current: Number(Math.random() * 4000).toFixed(2),
    differ: Number((Math.random() - 0.5) * 100).toFixed(4)
  });
}
const scroll_Table = ref(null);
let scrollTimer = null;

async function autoScroll(stop) {
  await nextTick();
  const table = scroll_Table.value.layout.table.refs;
  const tableWrapper = table.bodyWrapper.firstElementChild.firstElementChild;
  if (stop) {
    scrollTimer = setInterval(() => {
      tableWrapper.scrollTop += 2;
      if (tableWrapper.clientHeight + tableWrapper.scrollTop == tableWrapper.scrollHeight) {
        tableWrapper.scrollTop = 0;
      }
    }, 50);
  } else {
    clearInterval(scrollTimer);
  }
}

onMounted(() => {
  autoScroll(true);
});
onBeforeUnmount(() => {
  autoScroll(false);
});
</script>

<style lang="less">
.scroll-table-index {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: url("../../assets/images/kuang.png") no-repeat;
  background-size: 100% 100%;
  position: relative;

  .title {
    position: absolute;
    top: 0;
    left: 12px;
    text-align: left;
    color: #2b8fff;
    font-size: 18px;
    z-index: 1;
  }

  .scroll-table {
    width: 96%;
    height: 88%;
    scroll-behavior: smooth;
    position: absolute;
    top: 10%;
    left: 2%;
  }

  .el-table {
    background-color: rgba(255, 255, 255, 0);

    .el-table__header-wrapper {
      background-color: rgba(255, 255, 255, 0);

      .el-table__header {
        background-color: rgba(255, 255, 255, 0);

        thead {
          tr {
            background-color: rgba(255, 255, 255, 0);
            color: #00a4ff;
          }
        }
      }
    }

    .el-table__header th {
      background-color: rgba(255, 255, 255, 0);
    }

    .el-table__inner-wrapper {
      .el-table__row {
        background-color: rgba(255, 255, 255, 0);
        color: rgba(255,255,255,.8);
      }

    }

  }

  .el-table tbody tr:hover > td {
    background: #063570 !important;
  }

}
</style>
