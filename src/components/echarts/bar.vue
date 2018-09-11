<template>
  <div>
    <div :id="barId" :style="{width: width+'vw', height: height+'vh'}"></div>
  </div>
</template>
<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  props: [
    'barId',
    'drawData',
    'xAxis',
    'width',
    'height'
  ],
  mounted () {
    this.drawLine(0)
  },
  watch: {
    drawData: function () {
      this.drawLine(1)
      console.log(this.drawData)
    }
  },
  methods: {
    drawLine (clear) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById(this.barId))
      if (clear) {
        /* 如果数据变化 清空后重新绘制 以免参数遗留 */
        myChart.clear()
      }
      // 绘制图表
      myChart.setOption({
        title: { text: '' },
        color: ['#22d7bb', '#007bff', '#dc3545', '#ffc107', '#ddd', '#ff5b57'],
        tooltip: {},
        xAxis: {
          data: this.xAxis
        },
        yAxis: {},
        series: this.drawData
      })
    }
  }
}
</script>
