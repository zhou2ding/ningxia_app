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
          <h3 class="section-title">路面质量指标配置</h3>
          <el-form label-width="310px" label-position="left">
            <el-form-item label="公路类型">
              <el-select v-model="calculationData.roadType" @change="loadRoadTypeDefaults">
                <el-option label="高速公路" value="expressway"></el-option>
                <el-option label="国省干线" value="nationalProvincial"></el-option>
                <el-option label="农村公路" value="rural"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="本年度上级交通运输主管部门下达的PQI指标 ≥">
              <el-input-number
                v-model="calculationData.pqiTarget"
                :min="0"
                :max="100"
                controls-position="right"
              />
              <span class="unit-suffix">%</span>
            </el-form-item>

            <h4 class="subsection">公路网级沥青路面技术状况</h4>
            <el-form-item v-if="calculationData.roadType === 'expressway'" label="高速公路PQI ≥">
              <el-input-number
                v-model="calculationData.networkPQI"
                :min="0"
                :max="100"
                controls-position="right"
              />
            </el-form-item>
            <template v-else>
              <h4 class="subsection road-level-title">一级及二级公路</h4>
              <el-form-item label="PQI ≥">
                <el-input-number
                  v-model="calculationData.networkPQI1"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
              </el-form-item>
              <h4 class="subsection road-level-title">三级及四级公路</h4>
              <el-form-item label="PQI ≥">
                <el-input-number
                  v-model="calculationData.networkPQI2"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
              </el-form-item>
            </template>

            <el-form-item
              v-if="calculationData.roadType === 'expressway'"
              label="路面PQI技术等级为优的里程占比 ≥"
            >
              <el-input-number
                v-model="calculationData.excellentRate"
                :min="0"
                :max="100"
                controls-position="right"
              />
              <span class="unit-suffix">%</span>
            </el-form-item>

            <h4 class="subsection">基本单元指标(1000m)</h4>
            <template v-if="calculationData.roadType === 'expressway'">
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="PQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitPQI"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="PCI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitPCI"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="RQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitRQI"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="RDI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitRDI"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="SRI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitSRI"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
            </template>

            <template v-else-if="calculationData.roadType === 'nationalProvincial'">
              <h4 class="subsection road-level-title">一级及二级公路</h4>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="PQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitPQI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="PCI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitPCI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="RQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitRQI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="RDI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitRDI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="SRI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitSRI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <h4 class="subsection road-level-title">三级及四级公路</h4>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="PQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitPQI2"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="PCI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitPCI2"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="RQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitRQI2"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
            </template>

            <template v-else>
              <h4 class="subsection road-level-title">一级及二级公路</h4>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="PQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitPQI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="PCI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitPCI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="RQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitRQI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="RDI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitRDI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="SRI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitSRI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <h4 class="subsection road-level-title">三级及四级公路</h4>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="PQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitPQI2"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="PCI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitPCI2"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="RQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.unitRQI2"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
            </template>

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
    const nationalPlanPeriods = {
      十四五: { start: 2021, end: 2025 },
      十五五: { start: 2026, end: 2030 },
      十六五: { start: 2031, end: 2035 },
      十七五: { start: 2036, end: 2040 },
      十八五: { start: 2041, end: 2045 }
    }
    const availablePlanOptions = ['十四五', '十五五', '十六五', '十七五', '十八五']
    let currentNationalPlan = availablePlanOptions[0]
    for (const planName of availablePlanOptions) {
      const period = nationalPlanPeriods[planName]
      if (period && currentYear >= period.start && currentYear <= period.end) {
        currentNationalPlan = planName
        break
      }
    }
    if (currentYear < nationalPlanPeriods[availablePlanOptions[0]].start) {
      currentNationalPlan = availablePlanOptions[0]
    } else if (
      currentYear > nationalPlanPeriods[availablePlanOptions[availablePlanOptions.length - 1]].end
    ) {
      const lastPlanNameInOptions = availablePlanOptions[availablePlanOptions.length - 1]
      if (currentYear > nationalPlanPeriods[lastPlanNameInOptions].end) {
        currentNationalPlan = lastPlanNameInOptions
      }
    }
    return {
      provinceYear: currentYear,
      nationalPlan: currentNationalPlan,
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
      calculationData: {
        roadType: 'expressway',
        pqiTarget: 92,
        networkPQI: 90,
        excellentRate: 88,
        unitPQI: 80,
        unitPCI: 80,
        unitRQI: 80,
        unitRDI: 75,
        unitSRI: 75,
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
      },
      yearOptions: Array.from({ length: 21 }, (_, i) => currentYear + i),
      planOptions: ['十四五', '十五五', '十六五', '十七五', '十八五']
    }
  },
  watch: {
    provinceYear: 'loadProvinceSettings',
    nationalPlan: 'loadNationalSettings',
    'calculationData.roadType': 'loadCalculationSettings'
  },
  async mounted() {
    await this.loadProvinceSettings()
    await this.loadNationalSettings()
    await this.loadCalculationSettings()
  },
  methods: {
    async loadProvinceSettings() {
      try {
        const response = await this.$axios.get(`/api/settings/province/${this.provinceYear}`)
        this.provinceData = response.data
      } catch (error) {
        if (error.response?.status === 404) {
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
    async loadCalculationSettings() {
      try {
        const response = await this.$axios.get(
          `/api/settings/calculation/${this.calculationData.roadType}`
        )
        if (response.data) {
          this.calculationData = response.data
        }
      } catch (error) {
        if (error.response?.status === 404) {
          this.loadRoadTypeDefaults()
        } else {
          this.$message.error('加载计算指标配置配置失败')
        }
      }
    },
    loadRoadTypeDefaults() {
      switch (this.calculationData.roadType) {
        case 'expressway':
          this.calculationData.pqiTarget = 92
          this.calculationData.networkPQI = 90
          this.calculationData.excellentRate = 88
          this.calculationData.unitPQI = 80
          this.calculationData.unitPCI = 80
          this.calculationData.unitRQI = 80
          this.calculationData.unitRDI = 75
          this.calculationData.unitSRI = 75
          break
        case 'nationalProvincial':
          this.calculationData.pqiTarget = 90.5
          this.calculationData.networkPQI1 = 85
          this.calculationData.networkPQI2 = 80
          this.calculationData.unitPQI1 = 75
          this.calculationData.unitPCI1 = 75
          this.calculationData.unitRQI1 = 75
          this.calculationData.unitRDI1 = 70
          this.calculationData.unitSRI1 = 70
          this.calculationData.unitPQI2 = 70
          this.calculationData.unitPCI2 = 70
          this.calculationData.unitRQI2 = 70
          break
        case 'rural':
          this.calculationData.pqiTarget = 85
          this.calculationData.networkPQI1 = 85
          this.calculationData.networkPQI2 = 80
          this.calculationData.unitPQI1 = 75
          this.calculationData.unitPCI1 = 75
          this.calculationData.unitRQI1 = 75
          this.calculationData.unitRDI1 = 70
          this.calculationData.unitSRI1 = 70
          this.calculationData.unitPQI2 = 70
          this.calculationData.unitPCI2 = 70
          this.calculationData.unitRQI2 = 70
          break
      }
    },
    transformNationalData(data) {
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
  max-height: 78vh;
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

.subsection.road-level-title {
  margin: 15px 0 8px 0;
  font-size: 15px;
  color: #606266;
  font-weight: normal;
  border-left: 2px solid #4da8ff;
  padding-left: 8px;
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
