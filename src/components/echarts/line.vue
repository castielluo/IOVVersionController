<template>
  <div class="line-box">
    <div :id="lineId" :style="{width: '100%', height: '30vh'}"></div>
  </div>
</template>
<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
export default {
  name: 'hello',
  data () {
    return {
    }
  },
  props: [
    'lineId',
    'lineData',
    'xaxis'
  ],
  mounted () {
    this.drawLine(0)
  },
  watch: {
    lineData: function () {
      console.log(this.lineData)
      this.drawLine(1)
    }
  },
  methods: {
    drawLine (clear) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById(this.lineId))
      if (clear) {
        /* 如果数据变化 清空后重新绘制 以免参数遗留 */
        myChart.clear()
      }
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        color: ['#007bff', '#22d7bb', '#ffc107'],
        legend: {
          data: ['邮件营销', '联盟广告']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xaxis,
          axisLine: {
            lineStyle: {
              color: ['#22d7bb']
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: ['#22d7bb']
            }
          },
          splitLine: {
            show: false
          }
        },
        series: this.lineData
      })
    }
  }
}
</script>
<style scoped>
.line-box{
  position: relative;
  width: 90%;
  display: flex;
  justify-content: center;
  text-align: center;
  float: left;
  margin: -20px 5% 10px 5%;
}
</style>
