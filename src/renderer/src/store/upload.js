import { defineStore } from 'pinia'

export const useUploadStore = defineStore('upload', {
  state: () => ({
    reportType: '',
    managementUnit: '',
    projectName: '',
    // 用于存储unzip接口返回的文件路径map
    processedFilePaths: null
  }),
  actions: {
    setFormData(data) {
      this.reportType = data.reportType
      this.managementUnit = data.managementUnit || ''
      this.projectName = data.projectName || ''
      // 用于设置文件路径
      if (data.processedFilePaths) {
        this.processedFilePaths = data.processedFilePaths
      }
    },
    // 一个专门的action来更新文件路径
    setProcessedFilePaths(paths) {
      this.processedFilePaths = paths
    },
    reset() {
      this.reportType = ''
      this.managementUnit = ''
      this.projectName = ''
      this.processedFilePaths = null // 重置时清空
    }
  }
})
