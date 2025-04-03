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
        :icon="UploadFilled"
        :disabled="isUploading"
        :loading="isUploading"
        @click="showUploadDialog"
      >
        {{ isUploading ? '上传中 ...' : '上传数据' }}
      </el-button>
    </div>

    <!-- 文件列表 -->
    <div class="file-list">
      <div v-if="files.length" class="check-all">
        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAll">
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

    <!-- 上传文件对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传文件"
      width="500px"
      :before-close="handleDialogClose"
    >
      <el-form :model="uploadForm" label-width="120px">
        <el-form-item label="报告类型" prop="reportType">
          <el-select
            v-model="uploadForm.reportType"
            placeholder="请选择报告类型"
            class="form-input"
          >
            <el-option
              v-for="item in reportTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="总里程" prop="totalMileage">
          <el-input-number
            v-model="uploadForm.totalMileage"
            :min="0"
            :precision="2"
            :step="0.1"
            controls-position="right"
          />
          <span style="margin-left: 10px">km</span>
        </el-form-item>

        <el-form-item label="PQI指标" prop="pqi">
          <el-input-number
            v-model="uploadForm.pqi"
            :min="0"
            :max="100"
            :precision="2"
            :step="0.1"
            controls-position="right"
          />
        </el-form-item>

        <el-form-item label="上传文件" prop="file">
          <el-upload
            action="#"
            :auto-upload="false"
            :on-change="handleFileChange"
            :show-file-list="false"
            accept=".zip"
          >
            <el-button type="primary" :icon="DocumentAdd">选择ZIP文件</el-button>
            <el-tooltip content="仅支持.zip格式文件" placement="right" effect="light">
              <el-icon class="hint-icon">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </el-upload>
          <div v-if="uploadForm.file" class="file-name">
            {{ uploadForm.file.name }}
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :disabled="!isFormValid"
          :loading="isUploading"
          @click="handleUploadConfirm"
        >
          确认上传
        </el-button>
      </template>
    </el-dialog>

    <!-- 进度条遮罩 -->
    <div v-if="isUploading || isCalculating" class="progress-mask">
      <el-progress type="circle" :percentage="progress" :width="80" color="#5fbfff" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { UploadFilled, QuestionFilled, DocumentAdd } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import service from '../../api/request'
import { useUploadStore } from '../../store/upload'
import { emit } from '../../utils/eventBus'

const uploadStore = useUploadStore()

const reportTypes = [
  { label: '高速公路抽检路段公路技术状况监管分析报告', value: 'EXPRESSWAY' },
  { label: '工程后评价技术状况监管分析报告', value: 'POST_EVALUATION' },
  { label: '建设工程路段技术状况监管分析报告', value: 'CONSTRUCTION' },
  { label: '农村路抽检路段公路技术状况监管分析报告', value: 'RURAL' },
  { label: '普通国省干线抽检路段公路技术状况监管分析报告', value: 'NATIONAL_PROVINCIAL' },
  { label: '市场化路段抽检路段公路技术状况监管分析报告', value: 'MARKET' }
]

const uploadDialogVisible = ref(false)
const uploadForm = ref({
  reportType: '',
  totalMileage: 0,
  pqi: 0,
  file: null
})

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
  return selectedFiles.value.length > 0 && selectedFiles.value.length < files.value.length
})

const isFormValid = computed(() => {
  return uploadForm.value.reportType && uploadForm.value.totalMileage > 0 && uploadForm.value.file
})

const showUploadDialog = () => {
  uploadDialogVisible.value = true
}

const handleDialogClose = (done) => {
  if (isUploading.value) {
    ElMessage.warning('文件正在上传中，请稍候')
    return
  }
  resetUploadForm()
  done()
}

const handleFileChange = (file) => {
  if (file.raw.type !== 'application/zip' && !file.raw.name.endsWith('.zip')) {
    ElMessage.error('仅支持ZIP格式文件')
    return false
  }
  uploadForm.value.file = file.raw
}

const resetUploadForm = () => {
  uploadForm.value = {
    reportType: '',
    totalMileage: 0,
    pqi: 0,
    file: null
  }
}

const handleUploadConfirm = async () => {
  if (!isFormValid.value) {
    ElMessage.warning('请填写完整信息')
    return
  }

  uploadStore.setFormData({
    reportType: uploadForm.value.reportType,
    totalMileage: uploadForm.value.totalMileage,
    pqi: uploadForm.value.pqi
  })

  const formData = new FormData()
  formData.append('file', uploadForm.value.file)
  isUploading.value = true
  uploadDialogVisible.value = false
  progress.value = 0

  const timer = setInterval(() => {
    if (progress.value < 90) {
      const increment = Math.floor(Math.random() * 10 + 5)
      progress.value = Math.min(progress.value + increment, 99)
    }
  }, 300)

  try {
    const res = await service.post('/api/unzip', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    files.value = res.data.files

    progress.value = 100
    await new Promise((resolve) => setTimeout(resolve, 300))
    ElMessage.success('文件上传成功')
  } catch (error) {
    let errorMessage
    if (error.response) {
      if (error.response.data.error) {
        errorMessage = error.response.data.error
      } else {
        errorMessage = `服务器错误（${error.response.status})`
      }
    } else {
      errorMessage = '网络连接失败'
    }
    ElMessage.error(errorMessage)
  } finally {
    clearInterval(timer)
    isUploading.value = false
    resetUploadForm()
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
    const currentTimestamp = Math.floor(Date.now() / 1000); // 秒级时间戳
    const requestData = {
      files: selectedFiles.value,
      reportType: uploadStore.reportType,
      mileage: uploadStore.totalMileage,
      pqi: uploadStore.pqi,
      timestamp: currentTimestamp
    }

    // 并行调用两个 API
    const [docxResponse, mdResponse] = await Promise.all([
      service.post('/api/calculate/docx', requestData), // 调用 docx 接口
      service.post('/api/calculate/md', requestData) // 调用 md 接口
    ])

    // 检查两个请求是否都成功返回了数据和文件名
    if (docxResponse?.data?.filename && mdResponse?.data?.filename) {
      const docxFilename = docxResponse.data.filename
      const mdFilename = mdResponse.data.filename

      // 1. 获取当前已存储的文件名列表 (如果不存在则初始化为空数组)
      let storedFilenames = JSON.parse(localStorage.getItem('reportFilenames') || '[]')

      // 2. 添加新的文件名 (可以考虑去重，但根据你的描述似乎不需要)
      storedFilenames.push(docxFilename)
      storedFilenames.push(mdFilename)

      // 3. 将更新后的列表存回 localStorage
      localStorage.setItem('reportFilenames', JSON.stringify(storedFilenames))

      progress.value = 100
      await new Promise((resolve) => setTimeout(resolve, 300)) // 短暂显示100%

      ElMessage.success('报告已生成') // 修改成功提示信息

      // 成功处理后清空表单和文件列表
      resetUploadForm()
      files.value = []
      selectedFiles.value = []
      uploadStore.reset()
    }
  } catch (error) {
    let errorMessage
    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `服务器错误 (${error.response.status})`
    } else if (error.message) {
      errorMessage = error.message
    } else {
      errorMessage = '网络连接失败或未知错误'
    }
    ElMessage.error(errorMessage)
    progress.value = 0
  } finally {
    clearInterval(timer)
    isCalculating.value = false
    emit('refresh-report-list')
  }
}

const getFileName = (path) => {
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

.form-input {
  width: 100%;
}

.file-name {
  margin-top: 8px;
  color: #666;
  font-size: 14px;
}
</style>
