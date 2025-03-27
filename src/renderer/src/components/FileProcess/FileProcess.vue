<template>
  <div class="file-processor">
    <!-- 四个边框角 -->
    <div class="rect lt"></div>
    <div class="rect rt"></div>
    <div class="rect lb"></div>
    <div class="rect rb"></div>

    <!-- 上传区域 -->
    <div class="upload-section">
      <el-button
        type="primary"
        :icon="Upload"
        :disabled="isUploading"
        :loading="isUploading"
        @click="$refs.fileInput.click()"
      >
        {{ isUploading ? '上传中 ...' : '上传zip文件' }}
      </el-button>
      <input
        type="file"
        ref="fileInput"
        accept=".zip"
        @change="handleFileUpload"
        hidden
      />

      <el-tooltip
        content="仅支持.zip格式文件"
        placement="right"
        effect="light"
      >
        <el-icon class="hint-icon"><QuestionFilled /></el-icon>
      </el-tooltip>
    </div>

    <!-- 文件列表 -->
    <div class="file-list">
      <div v-if="files.length" class="check-all">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAll"
        >
          全选
        </el-checkbox>
      </div>

      <el-checkbox-group v-model="selectedFiles">
        <div v-for="file in files" :key="file" class="file-item">
          <el-checkbox :label="file">{{ getFileName(file) }}</el-checkbox>
        </div>
      </el-checkbox-group>
    </div>

    <!-- 计算按钮 -->
    <el-button
      type="success"
      :disabled="!selectedFiles.length || isCalculating"
      :loading="isCalculating"
      @click="handleCalculate"
    >
      {{ isCalculating ? '计算中 ...' : '开始计算' }}
    </el-button>

    <!-- 进度条遮罩 -->
    <div v-if="isUploading || isCalculating" class="progress-mask">
      <el-progress
        type="circle"
        :percentage="progress"
        :width="80"
        color="#5fbfff"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Upload, QuestionFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from "axios"
import service from '../../api/request'


const fileInput = ref(null)
const files = ref([])
const selectedFiles = ref([])
const isCalculating = ref(false)
const isUploading = ref(false)
const progress = ref(0)

const checkAll = computed({
  get() {
    return selectedFiles.value.length === files.value.length
  },
  set(value) {
    selectedFiles.value = value ? [...files.value] : []
  }
})

const isIndeterminate = computed(() => {
  return selectedFiles.value.length > 0 &&
    selectedFiles.value.length < files.value.length
})

const handleFileUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  isUploading.value = true
  progress.value = 0

  const timer = setInterval(() => {
    if (progress.value < 90) {
      const increment = Math.floor(Math.random() * 10 + 5)
      progress.value = Math.min(progress.value + increment, 99)
    }
  }, 300)

  try {
    const res = await service.post('/api/unzip', formData)
    files.value = res.data.files

    progress.value = 100
    await new Promise(resolve => setTimeout(resolve, 300))
  } catch (error) {
    ElMessage.error('文件解压失败，请检查文件格式')
  } finally {
    clearInterval(timer)
    isUploading.value = false
    e.target.value = null
  }
}

const handleCalculate = async () => {
  isCalculating.value = true
  progress.value = 0

  const timer = setInterval(() => {
    if (progress.value < 90) {
      const increment = Math.floor(Math.random() * 10 + 5)
      progress.value = Math.min(progress.value + increment, 99)
    }
  }, 300)

  try {
    const res = await service.post('/api/calculate', {
      files: selectedFiles.value
    }, {
      responseType: 'blob'
    })

    progress.value = 100
    await new Promise(resolve => setTimeout(resolve, 300))

    // 下载Word文件
    const link = document.createElement('a')
    link.href = URL.createObjectURL(
      new Blob([res.data], {type: 'application/msword'})
    )
    link.download = 'result.docx'
    link.click()

    ElMessage.success('文件生成成功')
  } catch (error) {
    ElMessage.error('计算过程发生错误')
  } finally {
    clearInterval(timer)
    isCalculating.value = false
  }
}

const getFileName = (path) => {
  // 使用正则表达式处理Windows和Linux路径分隔符
  return path.split(/[\\/]/).pop()
}

const handleCheckAll = (value) => {
  selectedFiles.value = value ? [...files.value] : []
}
</script>

<style scoped>
.check-all {
  padding: 10px;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
}

.file-processor {
  width: 100%;
  height: 100%;
  padding: 20px;
  position: relative;
  border: 1px solid #0079fe;
}

.rect {
  width: 20px;
  height: 20px;
  position: absolute;
  z-index: 1;
  border-top: 2px solid #5fbfff;
  border-left: 2px solid #5fbfff;
}

.rect.lt {
  left: -1px;
  top: -1px;
}

.rect.rt {
  top: -1px;
  right: -1px;
  transform: rotate(90deg);
}

.rect.lb {
  bottom: -1px;
  left: -1px;
  transform: rotate(-90deg);
}

.rect.rb {
  bottom: -1px;
  right: -1px;
  transform: rotate(180deg);
}

.upload-section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.hint-icon {
  color: #5fbfff;
  cursor: help;
  font-size: 18px;
}

.file-list {
  margin: 15px 0;
  height: 325px;
  overflow-y: auto;
}

.file-item {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.progress-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
