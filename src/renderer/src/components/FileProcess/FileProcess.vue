<template>
  <div class="file-processor">
    <div class="rect lt"></div>
    <div class="rect rt"></div>
    <div class="rect lb"></div>
    <div class="rect rb"></div>

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

    <el-button
      type="success"
      :disabled="!selectedFiles.length || isCalculating"
      :loading="isCalculating"
      @click="handleCalculate"
    >
      {{ isCalculating ? '计算中 ...' : '开始计算' }}
    </el-button>

    <el-dialog
      v-model="uploadDialogVisible"
      :title="uploadDialogTitle"
      width="750px"
      :before-close="handleDialogClose"
    >
      <el-form :model="uploadForm" label-width="160px">
        <el-form-item label="报告类型" prop="reportType">
          <el-select
            v-model="uploadForm.reportType"
            placeholder="请选择报告类型"
            class="form-input"
            clearable
            @change="uploadForm.managementUnit = ''"
          >
            <el-option
              v-for="item in reportTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="管养单位" prop="managementUnit">
          <el-select
            v-model="uploadForm.managementUnit"
            placeholder="请选择管养单位"
            class="form-input"
            clearable
            :disabled="!uploadForm.reportType"
          >
            <template v-for="unit in currentManagementUnits" :key="unit.value || unit.label">
              <el-option
                v-if="unit.value"
                :label="unit.label"
                :value="unit.value"
              >
                <span>{{ unit.label }}</span>
                <span
                  v-if="unit.children && unit.children.length"
                  style="color: #909399; font-size: 0.9em; margin-left: 8px"
                  >(市级)</span
                >
              </el-option>

              <el-option-group
                v-if="unit.children && unit.children.length"
                :label="unit.label + ' - 下属单位'"
              >
                <el-option
                  v-for="childItem in unit.children"
                  :key="childItem.value"
                  :label="childItem.label"
                  :value="childItem.value"
                >
                  <span style="padding-left: 20px">{{ childItem.label }}</span>
                </el-option>
              </el-option-group>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item :label="uploadZipLabel" prop="zipFile">
          <div class="file-upload-container">
            <el-upload
              action="#"
              :auto-upload="false"
              :on-change="handleZipFileChange"
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
            <div v-if="uploadForm.zipFile" class="file-card">
              <div class="file-info">
                <el-icon class="file-icon">
                  <Document />
                </el-icon>
                <span class="file-name">{{ uploadForm.zipFile.name }}</span>
              </div>
              <el-button
                type="danger"
                :icon="Delete"
                circle
                size="small"
                @click="removeSelectedZipFile"
              />
            </div>
          </div>
        </el-form-item>

        <el-form-item label="管养单位明细" prop="managementDetailFile">
          <div class="file-upload-container">
            <el-upload
              action="#"
              :auto-upload="false"
              :on-change="(file) => handleExcelFileChange(file, 'managementDetailFile')"
              :show-file-list="false"
              accept=".xlsx, .xls"
            >
              <el-button type="primary" :icon="DocumentAdd">选择文件</el-button>
              <el-tooltip
                content="请上传“管养单位明细.xlsx” (仅支持.xlsx, .xls格式)"
                placement="right"
                effect="light"
              >
                <el-icon class="hint-icon">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </el-upload>
            <div v-if="uploadForm.managementDetailFile" class="file-card">
              <div class="file-info">
                <el-icon class="file-icon">
                  <Document />
                </el-icon>
                <span class="file-name">{{ uploadForm.managementDetailFile.name }}</span>
              </div>
              <el-button
                type="danger"
                :icon="Delete"
                circle
                size="small"
                @click="removeSelectedExcelFile('managementDetailFile')"
              />
            </div>
          </div>
        </el-form-item>

        <el-form-item label="单位层级明细" prop="unitLevelDetailFile">
          <div class="file-upload-container">
            <el-upload
              action="#"
              :auto-upload="false"
              :on-change="(file) => handleExcelFileChange(file, 'unitLevelDetailFile')"
              :show-file-list="false"
              accept=".xlsx, .xls"
            >
              <el-button type="primary" :icon="DocumentAdd">选择文件</el-button>
              <el-tooltip
                content="请上传“单位层级明细.xlsx” (仅支持.xlsx, .xls格式)"
                placement="right"
                effect="light"
              >
                <el-icon class="hint-icon">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </el-upload>
            <div v-if="uploadForm.unitLevelDetailFile" class="file-card">
              <div class="file-info">
                <el-icon class="file-icon">
                  <Document />
                </el-icon>
                <span class="file-name">{{ uploadForm.unitLevelDetailFile.name }}</span>
              </div>
              <el-button
                type="danger"
                :icon="Delete"
                circle
                size="small"
                @click="removeSelectedExcelFile('unitLevelDetailFile')"
              />
            </div>
          </div>
        </el-form-item>

        <el-form-item label="路况技术评定" prop="roadConditionFile">
          <div class="file-upload-container">
            <el-upload
              action="#"
              :auto-upload="false"
              :on-change="(file) => handleExcelFileChange(file, 'roadConditionFile')"
              :show-file-list="false"
              accept=".xlsx, .xls"
            >
              <el-button type="primary" :icon="DocumentAdd">选择文件</el-button>
              <el-tooltip
                content="请上传“路况技术评定.xlsx” (仅支持.xlsx, .xls格式)"
                placement="right"
                effect="light"
              >
                <el-icon class="hint-icon">
                  <QuestionFilled />
                </el-icon>
              </el-tooltip>
            </el-upload>
            <div v-if="uploadForm.roadConditionFile" class="file-card">
              <div class="file-info">
                <el-icon class="file-icon">
                  <Document />
                </el-icon>
                <span class="file-name">{{ uploadForm.roadConditionFile.name }}</span>
              </div>
              <el-button
                type="danger"
                :icon="Delete"
                circle
                size="small"
                @click="removeSelectedExcelFile('roadConditionFile')"
              />
            </div>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleCancelUpload">取消</el-button>
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

    <div v-if="isUploading || isCalculating" class="progress-mask">
      <el-progress type="circle" :percentage="progress" :width="80" color="#5fbfff" />
      <div class="progress-text">
        {{ progressStatusText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  UploadFilled,
  QuestionFilled,
  DocumentAdd,
  Delete,
  Document
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import service from '../../api/request' // 请确保路径正确
import { useUploadStore } from '../../store/upload' // 请确保路径正确
import { emit } from '../../utils/eventBus' // 请确保路径正确

const uploadStore = useUploadStore()

const reportTypes = [
  { label: '高速公路抽检路段公路技术状况监管分析报告', value: 'EXPRESSWAY', name: '高速公路' },
  { label: '养护工程路段技术状况监管分析报告', value: 'MAINTENANCE', name: '养护工程' },
  { label: '建设工程路段技术状况监管分析报告', value: 'CONSTRUCTION', name: '建设工程' },
  { label: '农村公路抽检路段公路技术状况监管分析报告', value: 'RURAL', name: '农村公路' },
  {
    label: '普通国省干线抽检路段公路技术状况监管分析报告',
    value: 'NATIONAL_PROVINCIAL',
    name: '普通国省干线'
  }
]

// 管养单位配置 - 请根据实际截图详细填充此对象
const managementUnitsConfig = {
  EXPRESSWAY: [
    { value: '宁夏交投高速公路管理有限公司', label: '宁夏交投高速公路管理有限公司' },
    {
      value: '中铁建公路运营有限公司银昆项目经理部',
      label: '中铁建公路运营有限公司银昆项目经理部'
    },
    { value: '宁夏银百高速公路管理有限公司', label: '宁夏银百高速公路管理有限公司' },
    { value: '宁夏海平高速公路管理有限公司', label: '宁夏海平高速公路管理有限公司' },
    { value: '银川黄河河东大桥管理有限责任公司', label: '银川黄河河东大桥管理有限责任公司' }
  ],
  RURAL: [
    {
      label: '吴忠市交通局',
      value: '吴忠市交通局_city',
      children: [
        { value: '利通区住房建设和交通局', label: '利通区住房建设和交通局' },
        { value: '红寺堡区住房建设和交通局', label: '红寺堡区住房建设和交通局' },
        { value: '盐池县住房建设和交通局', label: '盐池县住房建设和交通局' },
        { value: '同心县住房建设和交通局', label: '同心县住房建设和交通局' },
        { value: '青铜峡市住房建设和交通局', label: '青铜峡市住房建设和交通局' },
        { value: '太阳山管委会住房建设和交通局', label: '太阳山管委会住房建设和交通局' },
        { value: '同心县公路管理段', label: '同心县公路管理段' }
      ]
    },
    {
      label: '银川市交通局',
      value: '银川市交通局_city',
      children: [
        { value: '兴庆区住房建设和交通局', label: '兴庆区住房建设和交通局' },
        { value: '西夏区住房建设和交通局', label: '西夏区住房建设和交通局' },
        { value: '贺兰县住房建设和交通局', label: '贺兰县住房建设和交通局' },
        { value: '灵武市住房建设和交通局', label: '灵武市住房建设和交通局' },
        { value: '永宁县住房建设和交通局', label: '永宁县住房建设和交通局' },
        { value: '金凤区住房建设和交通局', label: '金凤区住房建设和交通局' }
      ]
    },
    {
      label: '石嘴山市交通局',
      value: '石嘴山市交通局_city',
      children: [
        { value: '大武口区住房建设和交通局', label: '大武口区住房建设和交通局' },
        { value: '惠农区住房建设和交通局', label: '惠农区住房建设和交通局' },
        { value: '平罗县住房建设和交通局', label: '平罗县住房建设和交通局' }
      ]
    },
    {
      label: '中卫市交通局',
      value: '中卫市交通局_city',
      children: [
        { value: '沙坡头区住房建设和交通局', label: '沙坡头区住房建设和交通局' },
        { value: '中宁县住房建设和交通局', label: '中宁县住房建设和交通局' },
        { value: '海原县住房建设和交通局', label: '海原县住房建设和交通局' }
      ]
    },
    {
      label: '固原市交通局',
      value: '固原市交通局_city',
      children: [
        { value: '原州区住房建设和交通局', label: '原州区住房建设和交通局' },
        { value: '西吉县住房建设和交通局', label: '西吉县住房建设和交通局' },
        { value: '隆德县住房建设和交通局', label: '隆德县住房建设和交通局' },
        { value: '泾源县住房建设和交通局', label: '泾源县住房建设和交通局' },
        { value: '彭阳县住房建设和交通局', label: '彭阳县住房建设和交通局' },
        { value: '泾源县公路管理段', label: '泾源县公路管理段' }
      ]
    }
  ],
  NATIONAL_PROVINCIAL: [
    {
      label: '宁夏公路管理中心', // 假设这是市级单位
      value: '宁夏公路管理中心_city',
      children: [
        { value: '宁夏公路管理中心吴忠分中心', label: '宁夏公路管理中心吴忠分中心' },
        { value: '宁夏公路管理中心银川分中心', label: '宁夏公路管理中心银川分中心' },
        { value: '宁夏公路管理中心固原分中心', label: '宁夏公路管理中心固原分中心' },
        { value: '宁夏公路管理中心中卫分中心', label: '宁夏公路管理中心中卫分中心' },
        { value: '宁夏公路管理中心石嘴山分中心', label: '宁夏公路管理中心石嘴山分中心' }
      ]
    }
    // ... 根据截图填充市级和可能的县区级单位
  ],
  MAINTENANCE: [], // 养护工程单位列表将动态生成
  CONSTRUCTION: [] // 建设工程单位列表将动态生成
}

const uploadDialogVisible = ref(false)
const uploadForm = ref({
  reportType: '',
  managementUnit: '', // 新增：管养单位
  zipFile: null, // 修改：专门存储ZIP文件
  managementDetailFile: null, // 新增：管养单位明细.xlsx
  unitLevelDetailFile: null, // 新增：单位层级明细.xlsx
  roadConditionFile: null // 新增：路况技术评定.xlsx
})

const files = ref([])
const selectedFiles = ref([])
const isCalculating = ref(false)
const isUploading = ref(false)
const progress = ref(0)
const progressStatusText = ref('正在处理...')

const progressSpeed = computed(() => {
  return isCalculating.value ? 1 : 2
})

const checkAll = computed({
  get() {
    if (!files.value || files.value.length === 0) return false
    return selectedFiles.value.length === files.value.length
  },
  set(value) {
    selectedFiles.value = value ? [...files.value] : []
  }
})

const isIndeterminate = computed(() => {
  return (
    files.value &&
    files.value.length > 0 &&
    selectedFiles.value.length > 0 &&
    selectedFiles.value.length < files.value.length
  )
})

const isFormValid = computed(() => {
  return (
    uploadForm.value.reportType &&
    uploadForm.value.managementUnit && // 校验管养单位
    uploadForm.value.zipFile &&
    uploadForm.value.managementDetailFile &&
    uploadForm.value.unitLevelDetailFile &&
    uploadForm.value.roadConditionFile
  )
})

const uploadDialogTitle = computed(() => {
  const selectedReportType = reportTypes.find((rt) => rt.value === uploadForm.value.reportType)
  if (selectedReportType) {
    return `上传${selectedReportType.name}数据`
  }
  return '上传数据'
})

const uploadZipLabel = computed(() => {
  const selectedReportType = reportTypes.find((rt) => rt.value === uploadForm.value.reportType)
  if (selectedReportType) {
    return `上传${selectedReportType.name}数据`
  }
  return '上传数据'
})

const currentManagementUnits = computed(() => {
  const type = uploadForm.value.reportType
  if (!type) return []

  if (type === 'MAINTENANCE' || type === 'CONSTRUCTION') {
    // 合并高速和国省干线的单位，去重（简单示例，可优化）
    const expresswayUnits = managementUnitsConfig.EXPRESSWAY || []
    const nationalProvincialUnits = managementUnitsConfig.NATIONAL_PROVINCIAL || []
    const combined = [...expresswayUnits]

    nationalProvincialUnits.forEach((npUnit) => {
      if (npUnit.children && npUnit.children.length) {
        // 市级带区县
        let existingCityGroup = combined.find((c) => c.label === npUnit.label && c.children)
        if (existingCityGroup) {
          npUnit.children.forEach((child) => {
            if (!existingCityGroup.children.find((cChild) => cChild.value === child.value)) {
              existingCityGroup.children.push(child)
            }
          })
        } else {
          combined.push(JSON.parse(JSON.stringify(npUnit))) // 深拷贝
        }
      } else {
        // 只有一项或本身就是子项（非分组）
        if (!combined.find((c) => c.value === npUnit.value)) {
          combined.push(npUnit)
        }
      }
    })
    return combined
  }
  return managementUnitsConfig[type] || []
})

const removeSelectedZipFile = () => {
  uploadForm.value.zipFile = null
}

const removeSelectedExcelFile = (fileTypeKey) => {
  uploadForm.value[fileTypeKey] = null
}

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

const handleZipFileChange = (file) => {
  if (file.raw.type !== 'application/zip' && !file.raw.name.endsWith('.zip')) {
    ElMessage.error('仅支持ZIP格式文件')
    uploadForm.value.zipFile = null // 清空错误文件
    return false
  }
  uploadForm.value.zipFile = file.raw
}

const handleExcelFileChange = (file, fileTypeKey) => {
  const fileName = file.raw.name.toLowerCase()
  if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
    ElMessage.error('仅支持Excel格式文件 (.xlsx, .xls)')
    uploadForm.value[fileTypeKey] = null // 清空错误文件
    return false
  }
  uploadForm.value[fileTypeKey] = file.raw
}

const resetUploadForm = () => {
  uploadForm.value = {
    reportType: '',
    managementUnit: '',
    zipFile: null,
    managementDetailFile: null,
    unitLevelDetailFile: null,
    roadConditionFile: null
  }
}

const resetFileList = () => {
  files.value = []
  selectedFiles.value = []
}

const updateProgressText = () => {
  if (isUploading.value) {
    progressStatusText.value = `上传中 ${progress.value}%`
  } else if (isCalculating.value) {
    progressStatusText.value = `计算中 ${progress.value}%`
  }
}

watch(progress, updateProgressText)

const handleCancelUpload = () => {
  uploadDialogVisible.value = false
  if (!isUploading.value) {
    resetUploadForm()
  }
}

const handleUploadConfirm = async () => {
  if (!isFormValid.value) {
    ElMessage.warning('请填写完整信息并上传所有必需文件')
    return
  }

  uploadStore.setFormData({
    // 从 store 中移除 pqi 和 totalMileage
    reportType: uploadForm.value.reportType,
    managementUnit: uploadForm.value.managementUnit // 将管养单位也存入store，如果后续计算需要
  })

  const formData = new FormData()
  formData.append('reportType', uploadForm.value.reportType) // 将报告类型也传给unzip接口
  formData.append('managementUnit', uploadForm.value.managementUnit) // 将管养单位传给unzip接口

  if (uploadForm.value.zipFile) {
    formData.append('zipFile', uploadForm.value.zipFile) // key for zip file
  }
  if (uploadForm.value.managementDetailFile) {
    formData.append('managementDetailFile', uploadForm.value.managementDetailFile)
  }
  if (uploadForm.value.unitLevelDetailFile) {
    formData.append('unitLevelDetailFile', uploadForm.value.unitLevelDetailFile)
  }
  if (uploadForm.value.roadConditionFile) {
    formData.append('roadConditionFile', uploadForm.value.roadConditionFile)
  }

  isUploading.value = true
  uploadDialogVisible.value = false
  progress.value = 0
  progressStatusText.value = '上传中 0%'

  const timer = setInterval(() => {
    if (progress.value < 90) {
      progress.value = Math.min(progress.value + progressSpeed.value * 2, 99)
    }
  }, 300)

  try {
    const res = await service.post('/api/unzip', formData, {
      headers: {
        // 'Content-Type': 'multipart/form-data' // Axios会自动设置
      }
    })
    files.value = res.data.files // 假设unzip接口返回的是解压后的可选文件列表

    progress.value = 100
    progressStatusText.value = '上传完成'
    await new Promise((resolve) => setTimeout(resolve, 500))
    ElMessage.success('文件上传成功')
  } catch (error) {
    let errorMessage
    if (error.response) {
      if (error.response.data && (error.response.data.error || error.response.data.message)) {
        errorMessage = error.response.data.error || error.response.data.message
      } else {
        errorMessage = `服务器错误 (${error.response.status})`
      }
    } else if (error.request) {
      errorMessage = '网络请求超时或无响应，请检查网络连接'
    } else {
      errorMessage = '上传失败，网络连接问题或未知错误'
    }
    ElMessage.error(errorMessage)
    progress.value = 0 // 上传失败，进度条归零
  } finally {
    clearInterval(timer)
    isUploading.value = false
    // 上传成功后不清空表单，允许用户基于当前表单继续操作或修改
    // 如果需要每次上传后清空，则调用 resetUploadForm()
  }
}

const handleCalculate = async () => {
  if (!selectedFiles.value.length) {
    ElMessage.warning('请至少选择一个文件进行计算')
    return
  }
  isCalculating.value = true
  progress.value = 0
  progressStatusText.value = '计算中 0%'

  const timer = setInterval(() => {
    if (progress.value < 90) {
      progress.value = Math.min(progress.value + progressSpeed.value, 99)
    }
  }, 500)

  try {
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const requestData = {
      files: selectedFiles.value,
      reportType: uploadStore.reportType, // 从store获取
      managementUnit: uploadStore.managementUnit, // 从store获取
      // mileage: uploadStore.totalMileage, // 已移除
      // pqi: uploadStore.pqi, // 已移除
      timestamp: currentTimestamp
    }

    // 注意：原代码中 docxResponse 没有被使用，如果需要请取消注释并处理
    // const [docxResponse, mdResponse] = await Promise.all([
    //   service.post('/api/calculate/docx', requestData),
    //   service.post('/api/calculate/md', requestData)
    // ]);
    // if (docxResponse?.data?.filename && mdResponse?.data?.filename) { ... }

    const mdResponse = await service.post('/api/calculate/md', requestData)
    // 假设 calculate/docx 接口暂时不需要，如果需要，请取消上方注释并调整逻辑
    // 暂时只处理 mdResponse
    if (mdResponse?.data?.filename) {
      // 调整为只检查mdResponse
      // const docxFilename = docxResponse.data.filename; // 如果有docx，取消注释
      const mdFilename = mdResponse.data.filename

      let storedFilenames = JSON.parse(localStorage.getItem('reportFilenames') || '[]')
      // storedFilenames.push(docxFilename); // 如果有docx，取消注释
      storedFilenames.push(mdFilename)
      localStorage.setItem('reportFilenames', JSON.stringify(storedFilenames))

      progress.value = 100
      progressStatusText.value = '计算完成'
      await new Promise((resolve) => setTimeout(resolve, 500))

      ElMessage.success('报告已生成')
      resetUploadForm() // 计算成功后清空表单
      resetFileList()
      uploadStore.reset() // 重置 store
    } else {
      // 即使请求成功，但返回的数据不符合预期
      ElMessage.error('报告生成失败，服务器未返回有效文件名。')
      progress.value = 0
    }
  } catch (error) {
    let errorMessage
    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `计算服务错误 (${error.response.status})`
    } else if (error.request) {
      errorMessage = '计算请求超时或无响应，请检查网络连接'
    } else if (error.message) {
      errorMessage = error.message
    } else {
      errorMessage = '计算失败，网络连接问题或未知错误'
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
  if (!path) return ''
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
  margin-left: 8px;
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.progress-text {
  margin-top: 15px;
  color: white;
  font-size: 16px;
}

.form-input {
  width: 65%;
}

.file-upload-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.file-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background-color: #f8f8f8;
  border-radius: 4px;
  border: 1px solid #eaeaea;
}

.file-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  margin-right: 10px;
}

.file-icon {
  color: #5fbfff;
  margin-right: 8px;
  font-size: 18px;
}

.file-name {
  color: #333;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
