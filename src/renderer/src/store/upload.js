import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import service from '../api/request'
import { emit } from '../utils/eventBus'

async function getCalculationSettings(reportType) {
  const mapping = {
    EXPRESSWAY: 'expressway',
    NATIONAL_PROVINCIAL: 'nationalProvincial',
    RURAL: 'rural'
  }
  const settingType = mapping[reportType]
  if (!settingType) {
    return {} // 如果类型未知，返回空对象
  }

  // 默认值定义保持不变，作为最终的保障
  const defaults = {
    expressway: {
      pqiTarget: 90,
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
    const apiData = response.data

    // 如果API没有返回数据，直接返回该类型的默认值
    if (!apiData) {
      return defaults[settingType]
    }

    // **核心修正：将带前缀的API数据映射为不带前缀的通用对象**
    const finalSettings = {}
    const defaultForType = defaults[settingType]

    if (settingType === 'expressway') {
      finalSettings.pqiTarget = apiData.expressway_pqiTarget ?? defaultForType.pqiTarget
      finalSettings.networkPQI = apiData.expressway_networkPQI ?? defaultForType.networkPQI
      finalSettings.excellentRate = apiData.expressway_excellentRate ?? defaultForType.excellentRate
      finalSettings.unitPQI = apiData.expressway_unitPQI ?? defaultForType.unitPQI
      finalSettings.unitPCI = apiData.expressway_unitPCI ?? defaultForType.unitPCI
      finalSettings.unitRQI = apiData.expressway_unitRQI ?? defaultForType.unitRQI
      finalSettings.unitRDI = apiData.expressway_unitRDI ?? defaultForType.unitRDI
      finalSettings.unitSRI = apiData.expressway_unitSRI ?? defaultForType.unitSRI
    } else if (settingType === 'nationalProvincial') {
      finalSettings.pqiTarget = apiData.nationalProvincial_pqiTarget ?? defaultForType.pqiTarget
      finalSettings.networkPQI1 =
        apiData.nationalProvincial_networkPQI1 ?? defaultForType.networkPQI1
      finalSettings.networkExcellentRate1 =
        apiData.nationalProvincial_networkExcellentRate1 ?? defaultForType.networkExcellentRate1
      finalSettings.networkPQI2 =
        apiData.nationalProvincial_networkPQI2 ?? defaultForType.networkPQI2
      finalSettings.networkExcellentRate2 =
        apiData.nationalProvincial_networkExcellentRate2 ?? defaultForType.networkExcellentRate2
      finalSettings.unitPQI1 = apiData.nationalProvincial_unitPQI1 ?? defaultForType.unitPQI1
      finalSettings.unitPCI1 = apiData.nationalProvincial_unitPCI1 ?? defaultForType.unitPCI1
      finalSettings.unitRQI1 = apiData.nationalProvincial_unitRQI1 ?? defaultForType.unitRQI1
      finalSettings.unitRDI1 = apiData.nationalProvincial_unitRDI1 ?? defaultForType.unitRDI1
      finalSettings.unitSRI1 = apiData.nationalProvincial_unitSRI1 ?? defaultForType.unitSRI1 // SRI_12 在计算payload里没有使用，但以防万一还是映射
      finalSettings.unitPQI2 = apiData.nationalProvincial_unitPQI2 ?? defaultForType.unitPQI2
      finalSettings.unitPCI2 = apiData.nationalProvincial_unitPCI2 ?? defaultForType.unitPCI2
      finalSettings.unitRQI2 = apiData.nationalProvincial_unitRQI2 ?? defaultForType.unitRQI2
    } else if (settingType === 'rural') {
      finalSettings.pqiTarget = apiData.rural_pqiTarget ?? defaultForType.pqiTarget
      finalSettings.networkPQI1 = apiData.rural_networkPQI1 ?? defaultForType.networkPQI1
      finalSettings.networkPQI2 = apiData.rural_networkPQI2 ?? defaultForType.networkPQI2
      // 农村公路的单元指标在计算payload里没有使用，但为了函数完整性，仍然可以映射
      finalSettings.unitPQI1 = apiData.rural_unitPQI1 ?? defaultForType.unitPQI1
      finalSettings.unitPCI1 = apiData.rural_unitPCI1 ?? defaultForType.unitPCI1
      // ... etc.
    }

    return finalSettings
  } catch (error) {
    console.warn(`获取“${settingType}”的计算指标配置失败，将使用默认值。错误:`, error)
    return defaults[settingType] // API请求失败，返回默认值
  }
}

export const useUploadStore = defineStore('upload', {
  state: () => ({
    reportType: '',
    managementUnit: '',
    projectName: '',
    processedFilePaths: null,

    isUploading: false,
    isCalculating: false,

    progress: 0,
    progressStatusText: '准备就绪'
  }),

  actions: {
    setFormData(data) {
      this.reportType = data.reportType
      this.managementUnit = data.managementUnit || ''
      this.projectName = data.projectName || ''
    },

    setProcessedFilePaths(paths) {
      this.processedFilePaths = paths
    },

    reset() {
      this.reportType = ''
      this.managementUnit = ''
      this.projectName = ''
      this.processedFilePaths = null
      this.isUploading = false
      this.isCalculating = false
      this.progress = 0
      this.progressStatusText = '准备就绪'
    },

    async uploadAndUnzipFiles(formDataPayload) {
      if (this.isUploading) {
        ElMessage.warning('文件已在上传中，请稍候。')
        return false
      }

      this.isUploading = true
      this.progress = 0
      this.progressStatusText = '上传中 0%'

      const timer = setInterval(() => {
        if (this.progress < 90) {
          this.progress = Math.min(this.progress + 2, 99)
          this.progressStatusText = `上传中 ${this.progress}%`
        }
      }, 300)

      try {
        const res = await service.post('/api/unzip', formDataPayload, {})
        const processedFilePathsMap = res.data.files
        if (!processedFilePathsMap || Object.keys(processedFilePathsMap).length === 0) {
          throw new Error('服务器未返回有效的文件路径')
        }

        this.setProcessedFilePaths(processedFilePathsMap)
        this.progress = 100
        this.progressStatusText = '上传完成'
        await new Promise((resolve) => setTimeout(resolve, 500))
        ElMessage.success('文件上传成功')

        return true
      } catch (error) {
        let errorMessage = error.message || '上传失败，网络连接问题或未知错误'
        if (error.response) {
          errorMessage =
            error.response.data?.error ||
            error.response.data?.message ||
            `服务器错误 (${error.response.status})`
        }
        ElMessage.error(errorMessage)
        this.progress = 0
        return false
      } finally {
        clearInterval(timer)
        this.isUploading = false
      }
    },

    async startCalculation() {
      if (this.isCalculating) {
        ElMessage.warning('计算任务已在进行中，请勿重复点击。')
        return
      }
      if (!this.processedFilePaths) {
        ElMessage.error('文件映射关系丢失，请重新上传数据。')
        return
      }

      this.isCalculating = true
      this.progress = 0
      this.progressStatusText = '计算中 0%'

      const timer = setInterval(() => {
        if (this.progress < 90) {
          this.progress = Math.min(this.progress + 1, 99)
          this.progressStatusText = `计算中 ${this.progress}%`
        }
      }, 500)

      try {
        const settings = await getCalculationSettings(this.reportType)
        const payload = { report_type: this.reportType }
        const cleanedManagementUnit = this.managementUnit.replace(/_city$/, '')
        switch (this.reportType) {
          case 'MAINTENANCE':
          case 'CONSTRUCTION':
            payload.maintain = {
              project_name: this.projectName,
              before_root_dir: this.processedFilePaths.firstInspectionExcel,
              maintain_xlsx_file: this.processedFilePaths.secondInspectionExcel,
              after_root_dir: this.processedFilePaths.diseaseDataExcel
            }
            break

          case 'EXPRESSWAY':
            payload.express_way = {
              root_path: this.processedFilePaths.threeDimensionalDataZip,
              maintenance_unit_file: this.processedFilePaths.managementDetailFile,
              unit_level_file: this.processedFilePaths.unitLevelDetailFile,
              pingding_file: this.processedFilePaths.cicsDataFile,
              level_file: this.processedFilePaths.roadConditionFile,
              danwei: this.managementUnit,
              pqi_valuewd1: settings.pqiTarget ?? 90,
              pqi_valuewd2: settings.networkPQI ?? 90,
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
              nc_base_dir: this.processedFilePaths.threeDimensionalDataZip,
              unit_xlsx: this.processedFilePaths.unitLevelDetailFile,
              root_dir: this.processedFilePaths.threeDimensionalDataZip,
              xlsx_file: this.processedFilePaths.managementDetailFile,
              gy_value: cleanedManagementUnit,
              pqi_wd1: settings.pqiTarget ?? 85,
              pqi_12: settings.networkPQI1 ?? 85,
              pqi_34: settings.networkPQI2 ?? 80
            }
            break

          case 'NATIONAL_PROVINCIAL':
            payload.national_province = {
              root_path: this.processedFilePaths.threeDimensionalDataZip,
              xlsx_file: this.processedFilePaths.managementDetailFile,
              CICScardata: this.processedFilePaths.cicsDataFile,
              unit_path: this.processedFilePaths.unitLevelDetailFile,
              file_path: this.processedFilePaths.roadConditionFile,
              bitumen_folder_path: this.processedFilePaths.previousYearDiseaseZip,
              gy_value: cleanedManagementUnit,
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
            throw new Error(`未知的报告类型: ${this.reportType}`)
        }

        const mdResponse = await service.post('/api/calculate/md', payload)

        if (mdResponse?.data?.filename) {
          const mdFilename = mdResponse.data.filename
          let storedFilenames = JSON.parse(localStorage.getItem('reportFilenames') || '[]')
          storedFilenames.push(mdFilename)
          localStorage.setItem('reportFilenames', JSON.stringify(storedFilenames))

          this.progress = 100
          this.progressStatusText = '计算完成'
          await new Promise((resolve) => setTimeout(resolve, 500))

          ElMessage.success('报告已生成')
          emit('refresh-report-list')
          this.reset()
        } else {
          throw new Error('报告生成失败，服务器未返回有效文件名。')
        }
      } catch (error) {
        let errorMessage = error.message || '计算失败，发生未知错误'
        if (error.response) {
          errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            `计算服务错误 (${error.response.status})`
        }
        ElMessage.error(errorMessage)
        this.isCalculating = false
        this.progress = 0
        this.progressStatusText = '计算失败'
      } finally {
        clearInterval(timer)
      }
    }
  }
})
