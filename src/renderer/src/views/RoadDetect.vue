<template>
  <div>
    <AppHeader></AppHeader>
    <div class="main">
      <div class="row1">
        <!-- 文件处理区域 -->
        <div class="file-process">
          <FileProcess />
        </div>
        <div class="report-process">
          <ReportContent />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader/AppHeader.vue'
import FileProcess from '../components/FileProcess/FileProcess.vue'
import ReportContent from '../components/ReportContent/ReportContent.vue'

export default {
  components: {
    AppHeader,
    FileProcess,
    ReportContent
  }
}
</script>

<style scoped>
.main {
  width: 100%;
  margin-top: 100px;
}

.row1 {
  width: 100%;
  height: 500px;
  margin-bottom: 20px;
  padding: 0 20px;
  display: flex;
  justify-content: space-evenly;
  gap: 20px;
  align-items: flex-start;
  box-sizing: border-box;
  flex-wrap: wrap;
}

.file-process {
  width: 350px;
  height: 440px;
  margin-right: 50px;
  margin-bottom: 50px;
}
.report-process {
  width: 520px;
  height: 482px;
  margin-right: 50px;
  margin-bottom: 50px;
}
</style>
