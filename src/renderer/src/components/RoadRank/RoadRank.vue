<template>
  <div class="barChart">
    <div class="title">{{ title }}</div>
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "RoadRank",
  data() {
    return {
      title: "路况排名",
      chartInstance: null,
      dataList: [
        { name: "公路1", value: 550 },
        { name: "公路2", value: 300 },
        { name: "公路3", value: 340 },
        { name: "公路4", value: 400 },
        { name: "公路5", value: 430 },
        { name: "公路6", value: 480 },
        { name: "公路7", value: 520 },
        { name: "公路8", value: 506 },
        { name: "公路9", value: 700 },
        { name: "公路10", value: 750 }
      ]
    };
  },
  mounted() {
    this.chartInstance = echarts.init(this.$refs.chart);
    this.setOption();
  },
  methods: {
    setOption() {
      const data = [...this.dataList];
      data.sort((a, b) => a.value - b.value);

      let nameList = [];
      let valueList = [];
      data.forEach(item => {
        nameList.push(item.name);
        valueList.push(item.value);
      });

      const option = {
        grid: {
          left: "8%",
          top: "12%",
          right: "8%",
          bottom: "0%",
          containLabel: true
        },
        xAxis: [
          {
            show: false
          }
        ],
        yAxis: [
          {
            axisTick: "none",
            axisLine: "none",
            offset: "7",
            axisLabel: {
              color: "rgba(255,255,255,.6)",
              fontSize: "14"
            },
            data: nameList
          }
        ],
        series: [
          {
            name: "条",
            type: "bar",
            yAxisIndex: 0,
            data: valueList,
            label: {
              show: true,
              position: "right",
              formatter: function (param) {
                return param.value;
              },
              color: "rgba(255,255,255,.8)",
              fontSize: "12"
            },
            barWidth: 15,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  offset: 0,
                  color: "#03c893"
                },
                {
                  offset: 1,
                  color: "#0091ff"
                }
              ]),
              borderRadius: 15
            },
            z: 2
          }
        ]
      };

      this.chartInstance.setOption(option);
    }
  }
};
</script>

<style scoped lang="less">
.barChart {
  width: 100%;
  height: 100%;
  background: url("../../assets/images/card4.png") no-repeat;
  background-size: 100% 100%;
  position: relative;

  .title {
    position: absolute;
    top: 0;
    left: 12px;
    text-align: left;
    color: #2b8fff;
    font-size: 18px;
    z-index: 1;
  }

  .chart {
    width: 100%;
    height: 100%;
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
