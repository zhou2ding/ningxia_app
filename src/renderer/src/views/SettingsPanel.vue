<template>
  <div>
    <AppHeader></AppHeader>
    <div class="settings-panel">
      <div class="rect lt"></div>
      <div class="rect rt"></div>
      <div class="rect lb"></div>
      <div class="rect rb"></div>
      <el-tabs type="border-card">
        <el-tab-pane label="计算指标">
          <h3 class="section-title">计算参数配置</h3>
          <el-form label-width="220px" label-position="left">
            <el-form-item label="PQI指标 ≥">
              <el-input-number
                v-model="calculationData.pqiIndicator"
                :min="0"
                :max="100"
                controls-position="right"
              />
              <span class="unit-suffix">%</span>
            </el-form-item>
            <el-form-item label="总里程">
              <el-input-number
                v-model="calculationData.totalMileage"
                :min="0"
                controls-position="right"
              />
              <span class="unit-suffix">km</span>
            </el-form-item>
            <el-button type="primary" @click="saveCalculationSettings">保存设置</el-button>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="省厅指标">
          <h3 class="section-title">
            交通厅
            <el-select v-model="provinceYear" style="width: 120px">
              <el-option v-for="y in yearOptions" :key="y" :label="y + '年'" :value="y" />
            </el-select>
            公路养护考核指标
          </h3>

          <el-form label-width="220px" label-position="left">
            <el-form-item label="高速公路 MQI 优等路率 ≥">
              <el-input-number
                v-model="provinceData.expressway"
                :min="0"
                :max="100"
                controls-position="right"
              />
              <span class="unit-suffix">%</span>
            </el-form-item>
            <el-form-item label="普通国道 MQI 优良路率 ≥">
              <el-input-number
                v-model="provinceData.nationalHighway"
                :min="0"
                :max="100"
                controls-position="right"
              />
              <span class="unit-suffix">%</span>
            </el-form-item>
            <el-form-item label="普通省道 MQI 优良路率 ≥">
              <el-input-number
                v-model="provinceData.provincialHighway"
                :min="0"
                :max="100"
                controls-position="right"
              />
              <span class="unit-suffix">%</span>
            </el-form-item>
            <el-form-item label="农村公路 MQI 优良中等路率 ≥">
              <el-input-number
                v-model="provinceData.ruralRoad"
                :min="0"
                :max="100"
                controls-position="right"
              />
              <span class="unit-suffix">%</span>
            </el-form-item>
            <el-button type="primary" @click="saveProvinceSettings">保存设置</el-button>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="交通部指标">
          <div class="national-form-wrapper">
            <h3 class="section-title">
              交通部
              <el-select v-model="nationalPlan" style="width: 150px">
                <el-option v-for="p in planOptions" :key="p" :label="p + '规划'" :value="p" />
              </el-select>
              养护发展纲要要求
            </h3>

            <el-form label-width="220px" label-position="left">
              <h4 class="subsection">高速公路指标</h4>
              <el-form-item label="技术状况(MQI)优等路率 ≥">
                <el-input-number
                  v-model="nationalData.mqiExcellent"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                <span class="unit-suffix">%</span>
              </el-form-item>
              <el-form-item label="路面技术状况(PQI)优等路率 ≥">
                <el-input-number
                  v-model="nationalData.pqiExcellent"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                <span class="unit-suffix">%</span>
              </el-form-item>
              <el-form-item label="一、二类桥梁比例 ≥">
                <el-input-number
                  v-model="nationalData.bridgeRate"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                <span class="unit-suffix">%</span>
              </el-form-item>
              <el-form-item label="沥青路面材料循环利用率 ≥">
                <el-input-number
                  v-model="nationalData.recycleRate"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                <span class="unit-suffix">%</span>
              </el-form-item>

              <h4 class="subsection">普通国道指标</h4>
              <el-form-item label="MQI 优良路率 ≥">
                <div class="region-inputs">
                  <span>东</span>
                  <el-input-number
                    v-model="nationalData.nationalMqi.east"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                  <span>中</span>
                  <el-input-number
                    v-model="nationalData.nationalMqi.central"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                  <span>西</span>
                  <el-input-number
                    v-model="nationalData.nationalMqi.west"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </div>
              </el-form-item>
              <el-form-item label="PQI 优良路率 ≥">
                <div class="region-inputs">
                  <span>东</span>
                  <el-input-number
                    v-model="nationalData.nationalPqi.east"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                  <span>中</span>
                  <el-input-number
                    v-model="nationalData.nationalPqi.central"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                  <span>西</span>
                  <el-input-number
                    v-model="nationalData.nationalPqi.west"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </div>
              </el-form-item>

              <h4 class="subsection">普通省道指标</h4>
              <el-form-item label="MQI 优良路率 ≥">
                <div class="region-inputs">
                  <span>东</span>
                  <el-input-number
                    v-model="nationalData.provincialMqi.east"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                  <span>中</span>
                  <el-input-number
                    v-model="nationalData.provincialMqi.central"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                  <span>西</span>
                  <el-input-number
                    v-model="nationalData.provincialMqi.west"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </div>
              </el-form-item>
              <el-form-item label="PQI 优良路率 ≥">
                <div class="region-inputs">
                  <span>东</span>
                  <el-input-number
                    v-model="nationalData.provincialPqi.east"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                  <span>中</span>
                  <el-input-number
                    v-model="nationalData.provincialPqi.central"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                  <span>西</span>
                  <el-input-number
                    v-model="nationalData.provincialPqi.west"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </div>
              </el-form-item>

              <h4 class="subsection">农村公路指标</h4>
              <el-form-item label="MQI 优良中等路率 ≥">
                <el-input-number
                  v-model="nationalData.ruralMqi"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                <span class="unit-suffix">%</span>
              </el-form-item>
              <el-form-item label="年均养护工程实施比例 ≥">
                <el-input-number
                  v-model="nationalData.maintenanceRate"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                <span class="unit-suffix">%</span>
              </el-form-item>

              <el-button type="primary" @click="saveNationalSettings">保存设置</el-button>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import AppHeader from '../components/AppHeader/AppHeader.vue'

export default {
  name: 'SettingsPanel',
  components: {
    AppHeader
  },
  data() {
    const currentYear = new Date().getFullYear()
    return {
      provinceYear: currentYear,
      nationalPlan: '十四五',
      provinceData: {
        expressway: 92,
        nationalHighway: 99,
        provincialHighway: 85,
        ruralRoad: 90
      },
      nationalData: {
        mqiExcellent: 90,
        pqiExcellent: 88,
        bridgeRate: 95,
        recycleRate: 95,
        nationalMqi: { east: 90, central: 85, west: 80 },
        nationalPqi: { east: 88, central: 80, west: 72 },
        provincialMqi: { east: 85, central: 80, west: 72 },
        provincialPqi: { east: 80, central: 75, west: 70 },
        ruralMqi: 85,
        maintenanceRate: 5
      },
      // New data property for the "计算指标" tab
      calculationData: {
        pqiIndicator: 75, // Default value, assuming percentage
        totalMileage: 1000 // Default value in km
      },
      yearOptions: Array.from({ length: 10 }, (_, i) => currentYear + i),
      planOptions: ['十四五', '十五五', '十六五', '十七五', '十八五']
    }
  },
  watch: {
    provinceYear: 'loadProvinceSettings',
    nationalPlan: 'loadNationalSettings'
    // No watcher needed for calculationData unless it depends on year/plan
  },
  async mounted() {
    await this.loadProvinceSettings()
    await this.loadNationalSettings()
    await this.loadCalculationSettings() // Load settings for the new tab
    this.$forceUpdate() // You might not need this if Vue's reactivity handles updates correctly
  },
  methods: {
    async loadProvinceSettings() {
      try {
        const response = await this.$axios.get(`/api/settings/province/${this.provinceYear}`)
        this.provinceData = response.data
      } catch (error) {
        if (error.response?.status === 404) {
          // this.$message.warning(`未找到${this.provinceYear}年省厅配置，将使用默认值`)
          // Reset to default if not found, or handle as per your app's logic
          this.provinceData = {
            expressway: 92,
            nationalHighway: 99,
            provincialHighway: 85,
            ruralRoad: 90
          }
        } else {
          this.$message.error('加载省厅配置失败')
        }
      }
    },
    async loadNationalSettings() {
      try {
        const response = await this.$axios.get(`/api/settings/national/${this.nationalPlan}`)
        this.nationalData = this.transformNationalData(response.data)
      } catch (error) {
        if (error.response?.status === 404) {
          // this.$message.warning(`未找到${this.nationalPlan}规划交通部配置，将使用默认值`)
          // Reset to default if not found
          this.nationalData = {
            mqiExcellent: 90,
            pqiExcellent: 88,
            bridgeRate: 95,
            recycleRate: 95,
            nationalMqi: { east: 90, central: 85, west: 80 },
            nationalPqi: { east: 88, central: 80, west: 72 },
            provincialMqi: { east: 85, central: 80, west: 72 },
            provincialPqi: { east: 80, central: 75, west: 70 },
            ruralMqi: 85,
            maintenanceRate: 5
          }
        } else {
          this.$message.error('加载交通部配置失败')
        }
      }
    },
    // New method to load calculation settings
    async loadCalculationSettings() {
      try {
        // Assuming a general endpqint for these settings, not tied to year or plan
        const response = await this.$axios.get(`/api/settings/calculation`)
        if (response.data) {
          this.calculationData = response.data
        } else {
          this.$message.warning(`计算指标配置为空，将使用默认值`)
          this.calculationData = { pqiIndicator: 75, totalMileage: 1000 }
        }
      } catch (error) {
        if (error.response?.status === 404) {
          this.calculationData = { pqiIndicator: 0, totalMileage: 0 }
        } else {
          this.$message.error('加载计算指标配置失败')
        }
      }
    },
    transformNationalData(data) {
      // Basic check to prevent errors if data is not as expected
      if (!data) return {}
      return {
        mqiExcellent: data.mqiExcellent,
        pqiExcellent: data.pqiExcellent,
        bridgeRate: data.bridgeRate,
        recycleRate: data.recycleRate,
        nationalMqi: {
          east: data.nationalMqiEast,
          central: data.nationalMqiCentral,
          west: data.nationalMqiWest
        },
        nationalPqi: {
          east: data.nationalPqiEast,
          central: data.nationalPqiCentral,
          west: data.nationalPqiWest
        },
        provincialMqi: {
          east: data.provincialMqiEast,
          central: data.provincialMqiCentral,
          west: data.provincialMqiWest
        },
        provincialPqi: {
          east: data.provincialPqiEast,
          central: data.provincialPqiCentral,
          west: data.provincialPqiWest
        },
        ruralMqi: data.ruralMqi,
        maintenanceRate: data.maintenanceRate
      }
    },
    async saveProvinceSettings() {
      try {
        await this.$axios.post('/api/settings/province', {
          year: this.provinceYear,
          ...this.provinceData
        })
        this.$message.success('省厅指标保存成功')
      } catch (error) {
        let errorMessage = '未知错误'
        if (error.response) {
          if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error
          } else {
            errorMessage = `服务器错误（${error.response.status})`
          }
        } else {
          errorMessage = '网络连接失败'
        }
        this.$message.error(`省厅指标保存失败: ${errorMessage}`)
      }
    },
    async saveNationalSettings() {
      try {
        const dataToSave = {
          plan: this.nationalPlan,
          mqiExcellent: this.nationalData.mqiExcellent,
          pqiExcellent: this.nationalData.pqiExcellent,
          bridgeRate: this.nationalData.bridgeRate,
          recycleRate: this.nationalData.recycleRate,
          nationalMqiEast: this.nationalData.nationalMqi.east,
          nationalMqiCentral: this.nationalData.nationalMqi.central,
          nationalMqiWest: this.nationalData.nationalMqi.west,
          nationalPqiEast: this.nationalData.nationalPqi.east,
          nationalPqiCentral: this.nationalData.nationalPqi.central,
          nationalPqiWest: this.nationalData.nationalPqi.west,
          provincialMqiEast: this.nationalData.provincialMqi.east,
          provincialMqiCentral: this.nationalData.provincialMqi.central,
          provincialMqiWest: this.nationalData.provincialMqi.west,
          provincialPqiEast: this.nationalData.provincialPqi.east,
          provincialPqiCentral: this.nationalData.provincialPqi.central,
          provincialPqiWest: this.nationalData.provincialPqi.west,
          ruralMqi: this.nationalData.ruralMqi,
          maintenanceRate: this.nationalData.maintenanceRate
        }
        await this.$axios.post('/api/settings/national', dataToSave)
        this.$message.success('交通部指标保存成功')
      } catch (error) {
        let errorMessage = '未知错误'
        if (error.response) {
          if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error
          } else {
            errorMessage = `服务器错误（${error.response.status})`
          }
        } else {
          errorMessage = '网络连接失败'
        }
        this.$message.error(`交通部指标保存失败: ${errorMessage}`)
      }
    },
    // New method to save calculation settings
    async saveCalculationSettings() {
      try {
        await this.$axios.post('/api/settings/calculation', this.calculationData)
        this.$message.success('计算指标保存成功')
      } catch (error) {
        let errorMessage = '未知错误'
        if (error.response) {
          if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error
          } else {
            errorMessage = `服务器错误（${error.response.status})`
          }
        } else {
          errorMessage = '网络连接失败'
        }
        this.$message.error(`计算指标保存失败: ${errorMessage}`)
      }
    }
  }
}
</script>

<style scoped>
.settings-panel {
  margin: 0 auto 0;
  width: 700px;
  position: relative;
  padding: 1px;
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

.national-form-wrapper {
  max-height: 78vh; /* Consider if other tabs might need this if they grow */
  overflow-y: auto;
  padding-right: 15px; /* For scrollbar */
  margin-right: -15px; /* To counteract padding if scrollbar appears */
}

.section-title {
  margin: 20px 0;
  font-size: 18px;
  color: #0079fe;
}

.subsection {
  margin: 15px 0 10px;
  color: #555;
  border-left: 3px solid #0079fe;
  padding-left: 10px;
}

.region-inputs {
  display: flex;
  gap: 10px;
  align-items: center;
}

.region-inputs span {
  width: auto;
  text-align: left;
}

::v-deep .el-input-number {
  width: 90px !important;
}

.region-inputs .el-input-number {
  width: 90px !important;
}

.unit-suffix {
  margin-left: 6px;
}
</style>
