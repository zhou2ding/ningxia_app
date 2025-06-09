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
      width="700px"
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

          <el-form-item label="三位多功能路况快速检测车数据" prop="threeDimensionalDataZip">
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
import service from '../../api/request'
import { useUploadStore } from '../../store/upload'
import { emit } from '../../utils/eventBus'

const uploadStore = useUploadStore()
const uploadFormRef = ref(null)

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
  if (!form.reportType) return false

  if (isStandardRoadType.value) {
    const commonValid =
      form.managementUnit &&
      form.threeDimensionalDataZip &&
      form.cicsDataFile &&
      form.managementDetailFile &&
      form.unitLevelDetailFile

    if (form.reportType === 'NATIONAL_PROVINCIAL') {
      return commonValid && form.previousYearDiseaseZip && form.roadConditionFile
    }
    return commonValid
  }

  if (isProjectType.value) {
    return (
      form.projectName &&
      form.projectName.length > 0 &&
      form.projectName.length <= 100 &&
      form.firstInspectionExcel &&
      form.secondInspectionExcel &&
      form.diseaseDataExcel
    )
  }
  return false
})

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

const mapReportTypeToSettingType = (reportType) => {
  const mapping = {
    EXPRESSWAY: 'expressway',
    NATIONAL_PROVINCIAL: 'nationalProvincial',
    RURAL: 'rural'
  }
  return mapping[reportType]
}

async function getCalculationSettings(reportType) {
  const settingType = mapReportTypeToSettingType(reportType)
  // 对于不需要特定指标的报告类型（如 MAINTENANCE），直接返回空对象
  if (!settingType) {
    return {}
  }

  // 默认值，从 SettingsPanel.vue 复制而来，作为获取失败时的备用
  const defaults = {
    expressway: {
      pqiTarget: 92,
      networkPQI: 90,
      excellentRate: 88,
      unitPQI: 80,
      unitPCI: 80,
      unitRQI: 80,
      unitRDI: 75,
      unitSRI: 75
    },
    nationalProvincial: {
      pqiTarget: 90.5,
      networkPQI1: 85,
      networkExcellentRate1: 80,
      networkPQI2: 80,
      networkExcellentRate2: 75,
      unitPQI1: 75,
      unitPCI1: 75,
      unitRQI1: 75,
      unitRDI1: 70,
      unitSRI1: 70,
      unitPQI2: 70,
      unitPCI2: 70,
      unitRQI2: 70
    },
    rural: {
      pqiTarget: 85,
      networkPQI1: 85,
      networkPQI2: 80,
      unitPQI1: 75,
      unitPCI1: 75,
      unitRQI1: 75,
      unitRDI1: 70,
      unitSRI1: 70,
      unitPQI2: 70,
      unitPCI2: 70,
      unitRQI2: 70
    }
  }

  try {
    const response = await service.get(`/api/settings/calculation/${settingType}`)
    // 如果成功获取到数据，则返回数据，否则返回当前类型的默认值
    return response.data || defaults[settingType]
  } catch (error) {
    console.warn(`获取“${settingType}”的计算指标配置失败，将使用默认值。错误:`, error)
    // 如果接口404或发生其他错误，返回默认值
    return defaults[settingType]
  }
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
    ElMessage.warning('请填写所有必填项并上传必需文件')
    return
  }

  const formDataPayload = new FormData()
  formDataPayload.append('reportType', uploadForm.value.reportType)

  const storeData = { reportType: uploadForm.value.reportType }

  if (isStandardRoadType.value) {
    formDataPayload.append('managementUnit', uploadForm.value.managementUnit)
    formDataPayload.append('threeDimensionalDataZip', uploadForm.value.threeDimensionalDataZip)
    formDataPayload.append('cicsDataFile', uploadForm.value.cicsDataFile)
    formDataPayload.append('managementDetailFile', uploadForm.value.managementDetailFile)
    formDataPayload.append('unitLevelDetailFile', uploadForm.value.unitLevelDetailFile)
    formDataPayload.append('roadConditionFile', uploadForm.value.roadConditionFile)
    if (uploadForm.value.reportType === 'NATIONAL_PROVINCIAL') {
      formDataPayload.append('previousYearDiseaseZip', uploadForm.value.previousYearDiseaseZip)
    }
    storeData.managementUnit = uploadForm.value.managementUnit
  } else if (isProjectType.value) {
    formDataPayload.append('projectName', uploadForm.value.projectName)
    formDataPayload.append('firstInspectionExcel', uploadForm.value.firstInspectionExcel)
    formDataPayload.append('secondInspectionExcel', uploadForm.value.secondInspectionExcel)
    formDataPayload.append('diseaseDataExcel', uploadForm.value.diseaseDataExcel)
    storeData.projectName = uploadForm.value.projectName // Store project name if needed later
  }

  uploadStore.setFormData(storeData)

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
    const res = await service.post('/api/unzip', formDataPayload, {}) // Axios handles multipart/form-data

    // 获取后端返回的路径映射对象
    const processedFilePathsMap = res.data.files
    if (!processedFilePathsMap || Object.keys(processedFilePathsMap).length === 0) {
      throw new Error('服务器未返回有效的文件路径。')
    }

    // 1. 将完整的 Map 存入 Pinia Store，供 handleCalculate 使用
    uploadStore.setProcessedFilePaths(processedFilePathsMap)

    // 2. 从 Map 的 values 中提取路径列表，用于在界面上显示
    files.value = Object.values(processedFilePathsMap)

    // 3. 默认全选所有上传成功的文件
    selectedFiles.value = [...files.value]

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
    progress.value = 0
  } finally {
    clearInterval(timer)
    isUploading.value = false
    // Do not reset form here to allow re-submission or modification
  }
}

const handleCalculate = async () => {
  // 1. 检查用户是否在UI上选择了文件
  if (!selectedFiles.value.length) {
    ElMessage.warning('请至少选择一个文件进行计算')
    return
  }

  // 2. 检查Pinia中是否存在从/unzip接口获取的文件路径Map
  const filePathsMap = uploadStore.processedFilePaths
  if (!filePathsMap) {
    ElMessage.error('无法找到文件映射关系，请重新上传数据。')
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
    const reportType = uploadStore.reportType

    // 3. 异步获取计算指标（如果没有定义 getCalculationSettings 函数，此处会报错）
    const settings = await getCalculationSettings(reportType)

    // 4. 构建发送到后端的请求体 (payload)
    const payload = {
      report_type: reportType
    }

    switch (reportType) {
      case 'MAINTENANCE':
      case 'CONSTRUCTION':
        payload.maintain = {
          project_name: uploadStore.projectName,
          before_root_dir: filePathsMap.firstInspectionExcel,
          maintain_xlsx_file: filePathsMap.secondInspectionExcel,
          after_root_dir: filePathsMap.diseaseDataExcel
        }
        break

      case 'EXPRESSWAY':
        payload.express_way = {
          maintenance_unit_file: filePathsMap.managementDetailFile,
          unit_level_file: filePathsMap.unitLevelDetailFile,
          pingding_file: filePathsMap.cicsDataFile,
          level_file: filePathsMap.roadConditionFile,
          danwei: uploadStore.managementUnit,
          pqi_value: settings.networkPQI ?? 90,
          threshold: settings.excellentRate ?? 88,
          PQI_threshold: settings.unitPQI ?? 80,
          PCI_threshold: settings.unitPCI ?? 80,
          RQI_threshold: settings.unitRQI ?? 80,
          RDI_threshold: settings.unitRDI ?? 75,
          SRI_threshold: settings.unitSRI ?? 75
        }
        break

      case 'RURAL':
        payload.rural = {
          unit_xlsx: filePathsMap.unitLevelDetailFile,
          root_dir: filePathsMap.threeDimensionalDataZip,
          xlsx_file: filePathsMap.managementDetailFile,
          gy_value: uploadStore.managementUnit,
          pqi_wd1: settings.pqiTarget ?? 85,
          pqi_12: settings.networkPQI1 ?? 85,
          pqi_34: settings.networkPQI2 ?? 80
        }
        break

      case 'NATIONAL_PROVINCIAL':
        payload.national_province = {
          xlsx_file: filePathsMap.managementDetailFile,
          CICScardata: filePathsMap.cicsDataFile,
          unit_path: filePathsMap.unitLevelDetailFile,
          file_path: filePathsMap.roadConditionFile,
          gy_value: uploadStore.managementUnit,
          pqi_value: settings.pqiTarget ?? 90.5,
          wdpqi_12: settings.networkPQI1 ?? 85,
          wdpqi_34: settings.networkPQI2 ?? 80,
          pqi_12: settings.unitPQI1 ?? 75,
          pci_12: settings.unitPCI1 ?? 75,
          rqi_12: settings.unitRQI1 ?? 75,
          rdi_12: settings.unitRDI1 ?? 70,
          pqi_34: settings.unitPQI2 ?? 70,
          pci_34: settings.unitPCI2 ?? 70,
          rqi_34: settings.unitRQI2 ?? 70,
          rate_12: settings.networkExcellentRate1 ?? 80,
          rate_34: settings.networkExcellentRate2 ?? 75
        }
        break

      default:
        // 如果没有匹配的类型，抛出错误
        throw new Error(`未知的报告类型: ${reportType}`)
    }

    // 5. 发送请求
    const mdResponse = await service.post('/api/calculate/md', payload)

    if (mdResponse?.data?.filename) {
      const mdFilename = mdResponse.data.filename
      let storedFilenames = JSON.parse(localStorage.getItem('reportFilenames') || '[]')
      storedFilenames.push(mdFilename)
      localStorage.setItem('reportFilenames', JSON.stringify(storedFilenames))

      progress.value = 100
      progressStatusText.value = '计算完成'
      await new Promise((resolve) => setTimeout(resolve, 500))

      ElMessage.success('报告已生成')
      resetUploadForm()
      resetFileList() // 确保 resetFileList 函数存在，用于清空 files 和 selectedFiles
      uploadStore.reset()
    } else {
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
