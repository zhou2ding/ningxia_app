import { defineStore } from 'pinia'

export const useUploadStore = defineStore('upload', {
  state: () => ({
    reportType: '',
    totalMileage: 0,
    pqi: 0
  }),
  actions: {
    setFormData(data) {
      this.reportType = data.reportType
      this.totalMileage = data.totalMileage
      this.pqi = data.pqi
    },
    reset() {
      this.reportType = ''
      this.totalMileage = 0
      this.pqi = 0
    }
  }
})
