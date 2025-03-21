<template>
  <div>
    <AppHeader></AppHeader>
    <div class="settings-panel">
      <div class="rect lt"></div>
      <div class="rect rt"></div>
      <div class="rect lb"></div>
      <div class="rect rb"></div>
      <el-tabs type="border-card">
        <!-- 省厅指标 -->
        <el-tab-pane label="省厅指标">
          <h3 class="section-title">
            交通厅
            <el-select v-model="provinceYear" style="width: 120px">
              <el-option v-for="y in yearOptions" :key="y" :label="y + '年'" :value="y" />
            </el-select>
            公路养护考核指标
          </h3>

          <el-form label-width="220px" label-position="right">
            <el-form-item label="高速公路 MQI 优等路率 ≥">
              <el-input-number
                v-model="provinceData.expressway"
                :min="0"
                :max="100"
                controls-position="right"
              />
              %
            </el-form-item>
            <el-form-item label="普通国道 MQI 优良路率 ≥">
              <el-input-number
                v-model="provinceData.nationalHighway"
                :min="0"
                :max="100"
                controls-position="right"
              />
              %
            </el-form-item>
            <el-form-item label="普通省道 MQI 优良路率 ≥">
              <el-input-number
                v-model="provinceData.provincialHighway"
                :min="0"
                :max="100"
                controls-position="right"
              />
              %
            </el-form-item>
            <el-form-item label="农村公路 MQI 优良中等路率 ≥">
              <el-input-number
                v-model="provinceData.ruralRoad"
                :min="0"
                :max="100"
                controls-position="right"
              />
              %
            </el-form-item>
            <el-button type="primary" @click="saveProvinceSettings">保存设置</el-button>
          </el-form>
        </el-tab-pane>

        <!-- 交通部指标 -->
        <el-tab-pane label="交通部指标">
          <div class="national-form-wrapper">
            <h3 class="section-title">
              交通部
              <el-select v-model="nationalPlan" style="width: 150px">
                <el-option v-for="p in planOptions" :key="p" :label="p + '规划'" :value="p" />
              </el-select>
              养护发展纲要要求
            </h3>

            <el-form label-width="220px" label-position="right">
              <!-- 高速公路部分 -->
              <h4 class="subsection">高速公路指标</h4>
              <el-form-item label="技术状况(MQI)优等路率 ≥">
                <el-input-number
                  v-model="nationalData.mqiExcellent"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                %
              </el-form-item>
              <el-form-item label="路面技术状况(POI)优等路率 ≥">
                <el-input-number
                  v-model="nationalData.poiExcellent"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                %
              </el-form-item>
              <el-form-item label="一、二类桥梁比例 ≥">
                <el-input-number
                  v-model="nationalData.bridgeRate"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                %
              </el-form-item>
              <el-form-item label="沥青路面材料循环利用率 ≥">
                <el-input-number
                  v-model="nationalData.recycleRate"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                %
              </el-form-item>

              <!-- 普通国道部分 -->
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
              <el-form-item label="POI 优良路率 ≥">
                <div class="region-inputs">
                  <span>东</span>
                  <el-input-number
                    v-model="nationalData.nationalPoi.east"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                  <span>中</span>
                  <el-input-number
                    v-model="nationalData.nationalPoi.central"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                  <span>西</span>
                  <el-input-number
                    v-model="nationalData.nationalPoi.west"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </div>
              </el-form-item>

              <!-- 普通省道部分 -->
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
              <el-form-item label="POI 优良路率 ≥">
                <div class="region-inputs">
                  <span>东</span>
                  <el-input-number
                    v-model="nationalData.provincialPoi.east"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                  <span>中</span>
                  <el-input-number
                    v-model="nationalData.provincialPoi.central"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                  <span>西</span>
                  <el-input-number
                    v-model="nationalData.provincialPoi.west"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </div>
              </el-form-item>

              <!-- 农村公路 -->
              <h4 class="subsection">农村公路指标</h4>
              <el-form-item label="MQI 优良中等路率 ≥">
                <el-input-number
                  v-model="nationalData.ruralMqi"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                %
              </el-form-item>
              <el-form-item label="年均养护工程实施比例 ≥">
                <el-input-number
                  v-model="nationalData.maintenanceRate"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                %
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
        expressway: 90,
        nationalHighway: 85,
        provincialHighway: 80,
        ruralRoad: 85
      },
      nationalData: {
        mqiExcellent: 90,
        poiExcellent: 88,
        bridgeRate: 95,
        recycleRate: 95,
        nationalMqi: { east: 90, central: 85, west: 80 },
        nationalPoi: { east: 88, central: 80, west: 75 },
        provincialMqi: { east: 85, central: 80, west: 72 },
        provincialPoi: { east: 80, central: 75, west: 70 },
        ruralMqi: 85,
        maintenanceRate: 5
      },
      yearOptions: Array.from({ length: 10 }, (_, i) => currentYear + i),
      planOptions: ['十四五', '十五五', '十六五', '十七五', '十八五']
    }
  },
  watch: {
    provinceYear: 'loadProvinceSettings',
    nationalPlan: 'loadNationalSettings'
  },
  async mounted() {
    await this.loadProvinceSettings()
    await this.loadNationalSettings()
    this.$forceUpdate()
  },
  methods: {
    async loadProvinceSettings() {
      try {
        const response = await this.$axios.get(`/api/settings/province/${this.provinceYear}`)
        this.provinceData = response.data
      } catch (error) {
        if (error.response?.status === 404) {
          this.$message.warning(`未找到${this.provinceYear}年配置，将使用默认值`)
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
          this.$message.warning(`未找到${this.nationalPlan}规划配置，将使用默认值`)
        } else {
          this.$message.error('加载交通部配置失败')
        }
      }
    },
    transformNationalData(data) {
      return {
        mqiExcellent: data.mqiExcellent,
        poiExcellent: data.poiExcellent,
        bridgeRate: data.bridgeRate,
        recycleRate: data.recycleRate,
        nationalMqi: {
          east: data.nationalMqiEast,
          central: data.nationalMqiCentral,
          west: data.nationalMqiWest
        },
        nationalPoi: {
          east: data.nationalPoiEast,
          central: data.nationalPoiCentral,
          west: data.nationalPoiWest
        },
        provincialMqi: {
          east: data.provincialMqiEast,
          central: data.provincialMqiCentral,
          west: data.provincialMqiWest
        },
        provincialPoi: {
          east: data.provincialPoiEast,
          central: data.provincialPoiCentral,
          west: data.provincialPoiWest
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
        this.$message.error('保存失败')
      }
    },
    async saveNationalSettings() {
      try {
        await this.$axios.post('/api/settings/national', {
          plan: this.nationalPlan,
          ...this.nationalData
        })
        this.$message.success('交通部指标保存成功')
      } catch (error) {
        this.$message.error('保存失败')
      }
    }
  }
}
</script>

<style scoped>
.settings-panel {
  margin: 20px auto 0;
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
  max-height: 68vh;
  overflow-y: auto;
  padding-right: 15px;
  margin-right: -15px;
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
  gap: 15px;
  align-items: center;
}

.region-inputs span {
  width: 30px;
  text-align: right;
}

::v-deep .el-input-number {
  width: 90px !important;
}

.region-inputs .el-input-number {
  width: 90px !important;
}
</style>
