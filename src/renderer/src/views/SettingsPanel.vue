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
          <h3 class="section-title">各类型指标配置</h3>
          <el-form label-width="310px" label-position="left">
            <el-form-item label="公路类型">
              <el-select v-model="calculationData.roadType" @change="handleRoadTypeChange">
                <el-option label="高速公路" value="expressway"></el-option>
                <el-option label="国省干线" value="nationalProvincial"></el-option>
                <el-option label="农村公路" value="rural"></el-option>
              </el-select>
            </el-form-item>

            <template v-if="calculationData.roadType === 'expressway'">
              <el-form-item label="本年度上级交通运输主管部门下达的PQI指标 ≥">
                <el-input-number
                  v-model="calculationData.expressway_pqiTarget"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                <span class="unit-suffix">%</span>
              </el-form-item>
              <h4 class="subsection">路面质量指标</h4>
              <el-form-item label="公路网级沥青路面PQI ≥">
                <el-input-number
                  v-model="calculationData.expressway_networkPQI"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
              </el-form-item>
              <el-form-item label="路面PQI技术等级为优的里程占比 ≥">
                <el-input-number
                  v-model="calculationData.expressway_excellentRate"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                <span class="unit-suffix">%</span>
              </el-form-item>
              <h4 class="subsection">基本单元指标(1000m)</h4>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="PQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.expressway_unitPQI"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="PCI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.expressway_unitPCI"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="RQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.expressway_unitRQI"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="RDI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.expressway_unitRDI"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="SRI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.expressway_unitSRI"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <div style="flex: 1"></div>
              </div>
            </template>

            <template v-else-if="calculationData.roadType === 'nationalProvincial'">
              <el-form-item label="本年度上级交通运输主管部门下达的PQI指标 ≥">
                <el-input-number
                  v-model="calculationData.nationalProvincial_pqiTarget"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                <span class="unit-suffix">%</span>
              </el-form-item>
              <h4 class="subsection">路面质量指标</h4>
              <h4 class="subsection road-level-title">一级及二级公路</h4>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item
                  label="公路网级沥青路面PQI ≥"
                  style="flex: 1; margin-bottom: 0"
                  label-width="200px"
                >
                  <el-input-number
                    v-model="calculationData.nationalProvincial_networkPQI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item
                  label="公路优等路率 ≥"
                  style="flex: 1; margin-bottom: 0"
                  label-width="170px"
                >
                  <el-input-number
                    v-model="calculationData.nationalProvincial_networkExcellentRate1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                  <span class="unit-suffix">%</span>
                </el-form-item>
              </div>
              <h4 class="subsection road-level-title">三级及四级公路</h4>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item
                  label="公路网级沥青路面PQI ≥"
                  style="flex: 1; margin-bottom: 0"
                  label-width="200px"
                >
                  <el-input-number
                    v-model="calculationData.nationalProvincial_networkPQI2"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item
                  label="公路优等路率 ≥"
                  style="flex: 1; margin-bottom: 0"
                  label-width="170px"
                >
                  <el-input-number
                    v-model="calculationData.nationalProvincial_networkExcellentRate2"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                  <span class="unit-suffix">%</span>
                </el-form-item>
              </div>
              <h4 class="subsection">基本单元指标(1000m)</h4>
              <h4 class="subsection road-level-title">一级及二级公路</h4>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="PQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.nationalProvincial_unitPQI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="PCI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.nationalProvincial_unitPCI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="RQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.nationalProvincial_unitRQI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="RDI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.nationalProvincial_unitRDI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="SRI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.nationalProvincial_unitSRI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <div style="flex: 1"></div>
              </div>
              <h4 class="subsection road-level-title">三级及四级公路</h4>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="PQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.nationalProvincial_unitPQI2"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="PCI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.nationalProvincial_unitPCI2"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="RQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.nationalProvincial_unitRQI2"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <div style="flex: 1"></div>
              </div>
            </template>

            <template v-else-if="calculationData.roadType === 'rural'">
              <el-form-item label="本年度上级交通运输主管部门下达的PQI指标 ≥">
                <el-input-number
                  v-model="calculationData.rural_pqiTarget"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                <span class="unit-suffix">%</span>
              </el-form-item>
              <h4 class="subsection">路面质量指标</h4>
              <h4 class="subsection road-level-title">一级及二级公路</h4>
              <el-form-item label="公路网级沥青路面PQI ≥">
                <el-input-number
                  v-model="calculationData.rural_networkPQI1"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
              </el-form-item>
              <h4 class="subsection road-level-title">三级及四级公路</h4>
              <el-form-item label="公路网级沥青路面PQI ≥">
                <el-input-number
                  v-model="calculationData.rural_networkPQI2"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
              </el-form-item>
              <h4 class="subsection">基本单元指标(1000m)</h4>
              <h4 class="subsection road-level-title">一级及二级公路</h4>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="PQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.rural_unitPQI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="PCI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.rural_unitPCI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="RQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.rural_unitRQI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="RDI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.rural_unitRDI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="SRI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.rural_unitSRI1"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <div style="flex: 1"></div>
              </div>
              <h4 class="subsection road-level-title">三级及四级公路</h4>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="PQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.rural_unitPQI2"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <el-form-item label="PCI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.rural_unitPCI2"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
              <div style="display: flex; gap: 20px; margin-bottom: 22px">
                <el-form-item label="RQI ≥" style="flex: 1; margin-bottom: 0" label-width="120px">
                  <el-input-number
                    v-model="calculationData.rural_unitRQI2"
                    :min="0"
                    :max="100"
                    controls-position="right"
                  />
                </el-form-item>
                <div style="flex: 1"></div>
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

        expressway_pqiTarget: 92,
        expressway_networkPQI: 90,
        expressway_excellentRate: 88,
        expressway_unitPQI: 80,
        expressway_unitPCI: 80,
        expressway_unitRQI: 80,
        expressway_unitRDI: 75,
        expressway_unitSRI: 75,

        nationalProvincial_pqiTarget: 90.5,
        nationalProvincial_networkPQI1: 85,
        nationalProvincial_networkExcellentRate1: 80,
        nationalProvincial_networkPQI2: 80,
        nationalProvincial_networkExcellentRate2: 75,
        nationalProvincial_unitPQI1: 75,
        nationalProvincial_unitPCI1: 75,
        nationalProvincial_unitRQI1: 75,
        nationalProvincial_unitRDI1: 70,
        nationalProvincial_unitSRI1: 70,
        nationalProvincial_unitPQI2: 70,
        nationalProvincial_unitPCI2: 70,
        nationalProvincial_unitRQI2: 70,

        rural_pqiTarget: 85,
        rural_networkPQI1: 85,
        rural_networkPQI2: 80,
        rural_unitPQI1: 75,
        rural_unitPCI1: 75,
        rural_unitRQI1: 75,
        rural_unitRDI1: 70,
        rural_unitSRI1: 70,
        rural_unitPQI2: 70,
        rural_unitPCI2: 70,
        rural_unitRQI2: 70
      },
      yearOptions: Array.from({ length: 21 }, (_, i) => currentYear + i),
      planOptions: ['十四五', '十五五', '十六五', '十七五', '十八五']
    }
  },
  watch: {
    provinceYear: 'loadProvinceSettings',
    nationalPlan: 'loadNationalSettings',
    'calculationData.roadType': 'handleRoadTypeChange'
  },
  async mounted() {
    await this.loadProvinceSettings()
    await this.loadNationalSettings()
    await this.loadCalculationSettings()
  },
  methods: {
    handleRoadTypeChange() {
      this.loadCalculationSettings()
    },
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
    loadRoadTypeDefaults(roadType) {
      let typeSpecificDefaults = {}
      if (roadType === 'expressway') {
        typeSpecificDefaults = {
          expressway_pqiTarget: 92,
          expressway_networkPQI: 90,
          expressway_excellentRate: 88,
          expressway_unitPQI: 80,
          expressway_unitPCI: 80,
          expressway_unitRQI: 80,
          expressway_unitRDI: 75,
          expressway_unitSRI: 75
        }
      } else if (roadType === 'nationalProvincial') {
        typeSpecificDefaults = {
          nationalProvincial_pqiTarget: 90.5,
          nationalProvincial_networkPQI1: 85,
          nationalProvincial_networkExcellentRate1: 80,
          nationalProvincial_networkPQI2: 80,
          nationalProvincial_networkExcellentRate2: 75,
          nationalProvincial_unitPQI1: 75,
          nationalProvincial_unitPCI1: 75,
          nationalProvincial_unitRQI1: 75,
          nationalProvincial_unitRDI1: 70,
          nationalProvincial_unitSRI1: 70,
          nationalProvincial_unitPQI2: 70,
          nationalProvincial_unitPCI2: 70,
          nationalProvincial_unitRQI2: 70
        }
      } else if (roadType === 'rural') {
        typeSpecificDefaults = {
          rural_pqiTarget: 85,
          rural_networkPQI1: 85,
          rural_networkPQI2: 80,
          rural_unitPQI1: 75,
          rural_unitPCI1: 75,
          rural_unitRQI1: 75,
          rural_unitRDI1: 70,
          rural_unitSRI1: 70,
          rural_unitPQI2: 70,
          rural_unitPCI2: 70,
          rural_unitRQI2: 70
        }
      }
      this.calculationData = {
        ...this.calculationData,
        ...typeSpecificDefaults,
        roadType: roadType
      }
    },
    mapApiDataToCalculationData(apiData, roadType) {
      let updatedFields = {}
      if (!apiData) return

      if (roadType === 'expressway') {
        updatedFields.expressway_pqiTarget = apiData.pqiTarget
        updatedFields.expressway_networkPQI = apiData.networkPQI
        updatedFields.expressway_excellentRate = apiData.excellentRate
        updatedFields.expressway_unitPQI = apiData.unitPQI
        updatedFields.expressway_unitPCI = apiData.unitPCI
        updatedFields.expressway_unitRQI = apiData.unitRQI
        updatedFields.expressway_unitRDI = apiData.unitRDI
        updatedFields.expressway_unitSRI = apiData.unitSRI
      } else if (roadType === 'nationalProvincial') {
        updatedFields.nationalProvincial_pqiTarget = apiData.pqiTarget
        updatedFields.nationalProvincial_networkPQI1 = apiData.networkPQI1
        updatedFields.nationalProvincial_networkExcellentRate1 =
          apiData.nationalProvincialNetworkExcellentRate1
        updatedFields.nationalProvincial_networkPQI2 = apiData.networkPQI2
        updatedFields.nationalProvincial_networkExcellentRate2 =
          apiData.nationalProvincialNetworkExcellentRate2
        updatedFields.nationalProvincial_unitPQI1 = apiData.unitPQI1
        updatedFields.nationalProvincial_unitPCI1 = apiData.unitPCI1
        updatedFields.nationalProvincial_unitRQI1 = apiData.unitRQI1
        updatedFields.nationalProvincial_unitRDI1 = apiData.unitRDI1
        updatedFields.nationalProvincial_unitSRI1 = apiData.unitSRI1
        updatedFields.nationalProvincial_unitPQI2 = apiData.unitPQI2
        updatedFields.nationalProvincial_unitPCI2 = apiData.unitPCI2
        updatedFields.nationalProvincial_unitRQI2 = apiData.unitRQI2
      } else if (roadType === 'rural') {
        updatedFields.rural_pqiTarget = apiData.pqiTarget
        updatedFields.rural_networkPQI1 = apiData.networkPQI1
        updatedFields.rural_networkPQI2 = apiData.networkPQI2
        updatedFields.rural_unitPQI1 = apiData.unitPQI1
        updatedFields.rural_unitPCI1 = apiData.unitPCI1
        updatedFields.rural_unitRQI1 = apiData.unitRQI1
        updatedFields.rural_unitRDI1 = apiData.unitRDI1
        updatedFields.rural_unitSRI1 = apiData.unitSRI1
        updatedFields.rural_unitPQI2 = apiData.unitPQI2
        updatedFields.rural_unitPCI2 = apiData.unitPCI2
        updatedFields.rural_unitRQI2 = apiData.unitRQI2
      }
      this.calculationData = { ...this.calculationData, ...updatedFields, roadType: roadType }
    },
    async loadCalculationSettings() {
      const currentRoadType = this.calculationData.roadType
      try {
        const response = await this.$axios.get(`/api/settings/calculation/${currentRoadType}`)
        if (response.data) {
          this.mapApiDataToCalculationData(response.data, currentRoadType)
        } else {
          this.loadRoadTypeDefaults(currentRoadType)
        }
      } catch (error) {
        if (error.response?.status === 404) {
          this.loadRoadTypeDefaults(currentRoadType)
        } else {
          this.$message.error('加载计算指标配置失败')
          this.loadRoadTypeDefaults(currentRoadType)
        }
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
