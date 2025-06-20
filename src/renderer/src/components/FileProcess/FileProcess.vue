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
        :disabled="uploadStore.isUploading"
        :loading="uploadStore.isUploading"
        @click="showUploadDialog"
      >
        {{ uploadStore.isUploading ? '上传中 ...' : '上传数据' }}
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
          <el-tooltip :content="getFileName(file)" placement="top" :show-after="500" effect="dark">
            <el-checkbox :label="file">
              <span class="file-entry" :class="{ 'is-folder': isFolder(getFileName(file)) }">
                <el-icon v-if="isFolder(getFileName(file))" class="file-icon"><Folder /></el-icon>
                <el-icon v-else class="file-icon"><Document /></el-icon>
                <span>{{ getFileName(file) }}</span>
              </span>
            </el-checkbox>
          </el-tooltip>
        </div>
      </el-checkbox-group>
    </div>

    <el-button
      type="success"
      :disabled="!selectedFiles.length || uploadStore.isCalculating"
      :loading="uploadStore.isCalculating"
      @click="handleCalculate"
    >
      {{ uploadStore.isCalculating ? '计算中 ...' : '开始计算' }}
    </el-button>

    <el-dialog
      v-model="uploadDialogVisible"
      :title="uploadDialogTitle"
      width="950px"
      :before-close="handleDialogClose"
    >
      <el-form :model="uploadForm" label-width="210px" ref="uploadFormRef">
        <el-form-item label="报告类型" prop="reportType">
          <el-select
            v-model="uploadForm.reportType"
            placeholder="请选择报告类型"
            class="form-input"
            clearable
            @change="handleReportTypeChange"
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

        <template v-if="isStandardRoadType">
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
                  v-if="unit.value && (!unit.children || unit.children.length === 0)"
                  :label="unit.label"
                  :value="unit.value"
                >
                  <span>{{ unit.label }}</span>
                </el-option>
                <el-option
                  v-if="unit.value && unit.children && unit.children.length"
                  :label="unit.label"
                  :value="unit.value"
                >
                  <span>{{ unit.label }}</span>
                  <span style="color: #909399; font-size: 0.9em; margin-left: 8px">(市级)</span>
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

          <el-form-item label="三维多功能路况快速检测车数据" prop="threeDimensionalDataZip">
            <div class="file-upload-container">
              <el-upload
                action="#"
                :auto-upload="false"
                :on-change="(file) => handleZipFileChange(file, 'threeDimensionalDataZip')"
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
              <div v-if="uploadForm.threeDimensionalDataZip" class="file-card">
                <div class="file-info">
                  <el-icon class="file-icon">
                    <Document />
                  </el-icon>
                  <span class="file-name">{{ uploadForm.threeDimensionalDataZip.name }}</span>
                </div>
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  size="small"
                  @click="removeSelectedFile('threeDimensionalDataZip')"
                />
              </div>
            </div>
          </el-form-item>

          <el-form-item label="CICS车检测数据" prop="cicsDataFile">
            <div class="file-upload-container">
              <el-upload
                action="#"
                :auto-upload="false"
                :on-change="(file) => handleExcelFileChange(file, 'cicsDataFile')"
                :show-file-list="false"
                accept=".xlsx, .xls"
              >
                <el-button type="primary" :icon="DocumentAdd">选择Excel文件</el-button>
                <el-tooltip content="仅支持.xlsx, .xls格式文件" placement="right" effect="light">
                  <el-icon class="hint-icon">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </el-upload>
              <div v-if="uploadForm.cicsDataFile" class="file-card">
                <div class="file-info">
                  <el-icon class="file-icon">
                    <Document />
                  </el-icon>
                  <span class="file-name">{{ uploadForm.cicsDataFile.name }}</span>
                </div>
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  size="small"
                  @click="removeSelectedFile('cicsDataFile')"
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
                <el-button type="primary" :icon="DocumentAdd">选择Excel文件</el-button>
                <el-tooltip
                  content="请上传“管养单位明细表” (仅支持.xlsx, .xls格式)"
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
                  @click="removeSelectedFile('managementDetailFile')"
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
                <el-button type="primary" :icon="DocumentAdd">选择Excel文件</el-button>
                <el-tooltip
                  content="请上传“单位层级明细表” (仅支持.xlsx, .xls格式)"
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
                  @click="removeSelectedFile('unitLevelDetailFile')"
                />
              </div>
            </div>
          </el-form-item>

          <el-form-item
            v-if="
              uploadForm.reportType === 'NATIONAL_PROVINCIAL' ||
              uploadForm.reportType === 'EXPRESSWAY'
            "
            label="路况技术评定"
            prop="roadConditionFile"
          >
            <div class="file-upload-container">
              <el-upload
                action="#"
                :auto-upload="false"
                :on-change="(file) => handleExcelFileChange(file, 'roadConditionFile')"
                :show-file-list="false"
                accept=".xlsx, .xls"
              >
                <el-button type="primary" :icon="DocumentAdd">选择Excel文件</el-button>
                <el-tooltip
                  content="请上传“路况技术评定表” (仅支持.xlsx, .xls格式)"
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
                  @click="removeSelectedFile('roadConditionFile')"
                />
              </div>
            </div>
          </el-form-item>

          <el-form-item
            v-if="uploadForm.reportType === 'NATIONAL_PROVINCIAL'"
            label="上一年病害数据"
            prop="previousYearDiseaseZip"
          >
            <div class="file-upload-container">
              <el-upload
                action="#"
                :auto-upload="false"
                :on-change="(file) => handleZipFileChange(file, 'previousYearDiseaseZip')"
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
              <div v-if="uploadForm.previousYearDiseaseZip" class="file-card">
                <div class="file-info">
                  <el-icon class="file-icon">
                    <Document />
                  </el-icon>
                  <span class="file-name">{{ uploadForm.previousYearDiseaseZip.name }}</span>
                </div>
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  size="small"
                  @click="removeSelectedFile('previousYearDiseaseZip')"
                />
              </div>
            </div>
          </el-form-item>
        </template>

        <template v-if="isProjectType">
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="uploadForm.projectName"
              placeholder="请输入项目名称"
              class="form-input"
              clearable
              maxlength="100"
              show-word-limit
            />
          </el-form-item>

          <el-form-item label="第一次检测数据" prop="firstInspectionExcel">
            <div class="file-upload-container">
              <el-upload
                action="#"
                :auto-upload="false"
                :on-change="(file) => handleExcelFileChange(file, 'firstInspectionExcel')"
                :show-file-list="false"
                accept=".xlsx, .xls"
              >
                <el-button type="primary" :icon="DocumentAdd">选择Excel文件</el-button>
                <el-tooltip content="仅支持.xlsx, .xls格式文件" placement="right" effect="light">
                  <el-icon class="hint-icon">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </el-upload>
              <div v-if="uploadForm.firstInspectionExcel" class="file-card">
                <div class="file-info">
                  <el-icon class="file-icon">
                    <Document />
                  </el-icon>
                  <span class="file-name">{{ uploadForm.firstInspectionExcel.name }}</span>
                </div>
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  size="small"
                  @click="removeSelectedFile('firstInspectionExcel')"
                />
              </div>
            </div>
          </el-form-item>

          <el-form-item label="第二次检测数据" prop="secondInspectionExcel">
            <div class="file-upload-container">
              <el-upload
                action="#"
                :auto-upload="false"
                :on-change="(file) => handleExcelFileChange(file, 'secondInspectionExcel')"
                :show-file-list="false"
                accept=".xlsx, .xls"
              >
                <el-button type="primary" :icon="DocumentAdd">选择Excel文件</el-button>
                <el-tooltip content="仅支持.xlsx, .xls格式文件" placement="right" effect="light">
                  <el-icon class="hint-icon">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </el-upload>
              <div v-if="uploadForm.secondInspectionExcel" class="file-card">
                <div class="file-info">
                  <el-icon class="file-icon">
                    <Document />
                  </el-icon>
                  <span class="file-name">{{ uploadForm.secondInspectionExcel.name }}</span>
                </div>
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  size="small"
                  @click="removeSelectedFile('secondInspectionExcel')"
                />
              </div>
            </div>
          </el-form-item>

          <el-form-item label="病害数据" prop="diseaseDataExcel">
            <div class="file-upload-container">
              <el-upload
                action="#"
                :auto-upload="false"
                :on-change="(file) => handleExcelFileChange(file, 'diseaseDataExcel')"
                :show-file-list="false"
                accept=".xlsx, .xls"
              >
                <el-button type="primary" :icon="DocumentAdd">选择Excel文件</el-button>
                <el-tooltip content="仅支持.xlsx, .xls格式文件" placement="right" effect="light">
                  <el-icon class="hint-icon">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </el-upload>
              <div v-if="uploadForm.diseaseDataExcel" class="file-card">
                <div class="file-info">
                  <el-icon class="file-icon">
                    <Document />
                  </el-icon>
                  <span class="file-name">{{ uploadForm.diseaseDataExcel.name }}</span>
                </div>
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  size="small"
                  @click="removeSelectedFile('diseaseDataExcel')"
                />
              </div>
            </div>
          </el-form-item>
        </template>
      </el-form>

      <template #footer>
        <el-button @click="handleCancelUpload">取消</el-button>
        <el-button
          type="primary"
          :disabled="!isFormValid"
          :loading="uploadStore.isUploading"
          @click="handleUploadConfirm"
        >
          {{ uploadStore.isUploading ? '上传中...' : '确认上传' }}
        </el-button>
      </template>
    </el-dialog>

    <div v-if="uploadStore.isUploading || uploadStore.isCalculating" class="progress-mask">
      <el-progress type="circle" :percentage="uploadStore.progress" :width="80" color="#5fbfff" />
      <div class="progress-text">
        {{ uploadStore.progressStatusText }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  UploadFilled,
  QuestionFilled,
  DocumentAdd,
  Delete,
  Folder,
  Document
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useUploadStore } from '../../store/upload'

const uploadFormRef = ref(null)

const reportTypes = [
  { label: '养护工程路段技术状况监管分析报告', value: 'MAINTENANCE', name: '养护工程' },
  { label: '建设工程路段技术状况监管分析报告', value: 'CONSTRUCTION', name: '建设工程' },
  { label: '高速公路抽检路段公路技术状况监管分析报告', value: 'EXPRESSWAY', name: '高速公路' },
  {
    label: '普通国省干线抽检路段公路技术状况监管分析报告',
    value: 'NATIONAL_PROVINCIAL',
    name: '普通国省干线'
  },
  {
    label: '农村公路抽检路段公路技术状况监管分析报告',
    value: 'RURAL',
    name: '农村公路',
    disabled: true
  }
]

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
      label: '宁夏公路管理中心',
      value: '宁夏公路管理中心_city',
      children: [
        { value: '宁夏公路管理中心吴忠分中心', label: '宁夏公路管理中心吴忠分中心' },
        { value: '宁夏公路管理中心银川分中心', label: '宁夏公路管理中心银川分中心' },
        { value: '宁夏公路管理中心固原分中心', label: '宁夏公路管理中心固原分中心' },
        { value: '宁夏公路管理中心中卫分中心', label: '宁夏公路管理中心中卫分中心' },
        { value: '宁夏公路管理中心石嘴山分中心', label: '宁夏公路管理中心石嘴山分中心' }
      ]
    }
  ],
  MAINTENANCE: [],
  CONSTRUCTION: []
}

const initialUploadForm = () => ({
  reportType: '',
  managementUnit: '',
  threeDimensionalDataZip: null,
  cicsDataFile: null,
  managementDetailFile: null,
  unitLevelDetailFile: null,
  roadConditionFile: null,
  previousYearDiseaseZip: null,
  projectName: '',
  firstInspectionExcel: null,
  secondInspectionExcel: null,
  diseaseDataExcel: null
})

const uploadDialogVisible = ref(false)
const uploadForm = ref(initialUploadForm())

const files = ref([])
const selectedFiles = ref([])
const isCalculating = ref(false)
const isUploading = ref(false)
const progress = ref(0)
const progressStatusText = ref('正在处理...')
const uploadStore = useUploadStore()

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

const isStandardRoadType = computed(() => {
  const type = uploadForm.value.reportType
  return ['EXPRESSWAY', 'RURAL', 'NATIONAL_PROVINCIAL'].includes(type)
})

const isProjectType = computed(() => {
  const type = uploadForm.value.reportType
  return ['MAINTENANCE', 'CONSTRUCTION'].includes(type)
})

const isFormValid = computed(() => {
  const form = uploadForm.value
  if (!form.reportType) {
    return false
  }

  switch (form.reportType) {
    // 高速公路
    case 'EXPRESSWAY':
      return !!(
        form.managementUnit &&
        form.threeDimensionalDataZip &&
        form.cicsDataFile &&
        form.managementDetailFile &&
        form.unitLevelDetailFile &&
        form.roadConditionFile
      )

    // 农村公路
    case 'RURAL':
      return !!(
        form.managementUnit &&
        form.threeDimensionalDataZip &&
        form.cicsDataFile &&
        form.managementDetailFile &&
        form.unitLevelDetailFile
      )

    // 普通国省干线
    case 'NATIONAL_PROVINCIAL':
      return !!(
        form.managementUnit &&
        form.threeDimensionalDataZip &&
        form.cicsDataFile &&
        form.managementDetailFile &&
        form.unitLevelDetailFile &&
        form.roadConditionFile &&
        form.previousYearDiseaseZip
      )

    // 养护工程 或 建设工程
    case 'MAINTENANCE':
    case 'CONSTRUCTION':
      return !!(
        form.projectName &&
        form.projectName.length > 0 &&
        form.projectName.length <= 100 &&
        form.firstInspectionExcel &&
        form.secondInspectionExcel &&
        form.diseaseDataExcel
      )

    // 如果出现未知的报告类型，默认为无效
    default:
      return false
  }
})

const isFolder = (name) => {
  if (!name) return false
  // 一个简单的判断：如果名称中没有点'.', 或者点在第一个位置（如.env），则认为是文件夹
  const lastDotIndex = name.lastIndexOf('.')
  return lastDotIndex === -1 || lastDotIndex === 0
}

const uploadDialogTitle = computed(() => {
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
    // For project types, management units might be derived differently or not directly selected.
    // Based on original logic, they try to combine Expressway and National/Provincial.
    // However, the new requirement states "项目名称" for these types,
    // so this list might not be directly used for selection in the form for these types.
    // Keeping the logic for now if it's used elsewhere or as a fallback.
    const expresswayUnits = managementUnitsConfig.EXPRESSWAY || []
    const nationalProvincialUnits = managementUnitsConfig.NATIONAL_PROVINCIAL || []
    const combined = [...expresswayUnits.map((u) => ({ ...u, children: undefined }))] // Flatten expressway

    nationalProvincialUnits.forEach((npUnit) => {
      if (npUnit.children && npUnit.children.length) {
        let existingCityGroup = combined.find(
          (c) => c.label === npUnit.label && c.value.endsWith('_city')
        )
        if (existingCityGroup) {
          if (!existingCityGroup.children) existingCityGroup.children = []
          npUnit.children.forEach((child) => {
            if (!existingCityGroup.children.find((cChild) => cChild.value === child.value)) {
              existingCityGroup.children.push(child)
            }
          })
        } else {
          combined.push(JSON.parse(JSON.stringify(npUnit)))
        }
      } else {
        if (!combined.find((c) => c.value === npUnit.value)) {
          combined.push(npUnit)
        }
      }
    })
    return combined
  }
  return managementUnitsConfig[type] || []
})

const removeSelectedFile = (fileKey) => {
  uploadForm.value[fileKey] = null
}

const showUploadDialog = () => {
  resetUploadForm()
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

const handleReportTypeChange = () => {
  // Reset fields that depend on report type
  uploadForm.value.managementUnit = ''
  uploadForm.value.threeDimensionalDataZip = null
  uploadForm.value.cicsDataFile = null
  uploadForm.value.managementDetailFile = null
  uploadForm.value.unitLevelDetailFile = null
  uploadForm.value.roadConditionFile = null
  uploadForm.value.previousYearDiseaseZip = null
  uploadForm.value.projectName = ''
  uploadForm.value.firstInspectionExcel = null
  uploadForm.value.secondInspectionExcel = null
  uploadForm.value.diseaseDataExcel = null

  // If form ref is available, clear validation for the entire form
  if (uploadFormRef.value) {
    uploadFormRef.value.clearValidate()
  }
}

const handleZipFileChange = (file, fileTypeKey) => {
  if (file.raw.type !== 'application/zip' && !file.raw.name.endsWith('.zip')) {
    ElMessage.error('仅支持ZIP格式文件')
    uploadForm.value[fileTypeKey] = null
    // Manually clear validation for this specific field if possible or re-validate
    if (uploadFormRef.value) {
      uploadFormRef.value.clearValidate(fileTypeKey)
    }
    return false
  }
  uploadForm.value[fileTypeKey] = file.raw
  if (uploadFormRef.value) {
    // Trigger validation after successful selection
    uploadFormRef.value.validateField(fileTypeKey)
  }
}

const handleExcelFileChange = (file, fileTypeKey) => {
  const fileName = file.raw.name.toLowerCase()
  if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
    ElMessage.error('仅支持Excel格式文件 (.xlsx, .xls)')
    uploadForm.value[fileTypeKey] = null
    if (uploadFormRef.value) {
      uploadFormRef.value.clearValidate(fileTypeKey)
    }
    return false
  }
  uploadForm.value[fileTypeKey] = file.raw
  if (uploadFormRef.value) {
    // Trigger validation
    uploadFormRef.value.validateField(fileTypeKey)
  }
}

const resetUploadForm = () => {
  uploadForm.value = initialUploadForm()
  if (uploadFormRef.value) {
    uploadFormRef.value.resetFields() // Element Plus specific method to reset form and clear validation
  }
}

const resetFileList = () => {
  files.value = []
  selectedFiles.value = []
}

onMounted(() => {
  if (uploadStore.processedFilePaths && Object.keys(uploadStore.processedFilePaths).length > 0) {
    files.value = Object.values(uploadStore.processedFilePaths)
    selectedFiles.value = [...files.value]
  }
})

watch(
  () => uploadStore.processedFilePaths,
  (newFilePaths) => {
    // 当 store 中的文件路径不为空时，更新UI
    if (newFilePaths && Object.keys(newFilePaths).length > 0) {
      files.value = Object.values(newFilePaths)
      selectedFiles.value = [...files.value] // 默认全选
    } else {
      // 当 store 中的文件路径被清空 (null) 时，也清空UI
      resetFileList()
    }
  },
  {
    immediate: true, // 关键：让 watch 在组件加载时立即执行一次
    deep: true // 确保能监听到对象内部的变化
  }
)

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
  // 1. 前端表单校验
  if (!isFormValid.value) {
    ElMessage.warning('请填写所有必填项并上传必需文件')
    return
  }

  // 2. 准备 FormData 对象
  const formDataPayload = new FormData()
  formDataPayload.append('reportType', uploadForm.value.reportType)
  if (isStandardRoadType.value) {
    formDataPayload.append('managementUnit', uploadForm.value.managementUnit)
    if (uploadForm.value.threeDimensionalDataZip) {
      formDataPayload.append('threeDimensionalDataZip', uploadForm.value.threeDimensionalDataZip)
    }
    if (uploadForm.value.cicsDataFile) {
      formDataPayload.append('cicsDataFile', uploadForm.value.cicsDataFile)
    }
    if (uploadForm.value.managementDetailFile) {
      formDataPayload.append('managementDetailFile', uploadForm.value.managementDetailFile)
    }
    if (uploadForm.value.unitLevelDetailFile) {
      formDataPayload.append('unitLevelDetailFile', uploadForm.value.unitLevelDetailFile)
    }
    if (uploadForm.value.roadConditionFile) {
      formDataPayload.append('roadConditionFile', uploadForm.value.roadConditionFile)
    }
    if (
      uploadForm.value.reportType === 'NATIONAL_PROVINCIAL' &&
      uploadForm.value.previousYearDiseaseZip
    ) {
      formDataPayload.append('previousYearDiseaseZip', uploadForm.value.previousYearDiseaseZip)
    }
  } else if (isProjectType.value) {
    formDataPayload.append('projectName', uploadForm.value.projectName)
    if (uploadForm.value.firstInspectionExcel) {
      formDataPayload.append('firstInspectionExcel', uploadForm.value.firstInspectionExcel)
    }
    if (uploadForm.value.secondInspectionExcel) {
      formDataPayload.append('secondInspectionExcel', uploadForm.value.secondInspectionExcel)
    }
    if (uploadForm.value.diseaseDataExcel) {
      formDataPayload.append('diseaseDataExcel', uploadForm.value.diseaseDataExcel)
    }
  }

  // 3. 将元数据存入 Pinia Store (不变)
  uploadStore.setFormData({
    reportType: uploadForm.value.reportType,
    projectName: uploadForm.value.projectName,
    managementUnit: uploadForm.value.managementUnit
  })

  // 4. 【关键改动】立刻关闭弹窗
  uploadDialogVisible.value = false

  // 5. 调用 Store 的 Action 来处理上传。
  //    因为弹窗已经关闭，我们不再需要用 await 来等待它的返回结果去控制弹窗。
  //    组件的任务（收集数据、关闭弹窗）已经完成，剩下的交给 Store 在后台处理。
  uploadStore.uploadAndUnzipFiles(formDataPayload)
}

const handleCalculate = async () => {
  if (!selectedFiles.value.length) {
    ElMessage.warning('请至少选择一个文件进行计算')
    return
  }
  // 直接调用 store 的 action，将所有复杂逻辑交给 store
  await uploadStore.startCalculation()
}

const getFileName = (path) => {
  if (!path) return ''

  // 1. 从完整路径中获取最后一部分（文件名或目录名）
  let baseName = path.split(/[\\/]/).pop()

  // 2. 检查是否以 '_extracted' 结尾，如果是则移除
  if (baseName.endsWith('_extracted')) {
    baseName = baseName.slice(0, -10)
  }

  return baseName
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
  box-sizing: border-box;
}

.file-item .el-checkbox {
  width: 100%;
}

.file-item :deep(.el-checkbox__label) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
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
