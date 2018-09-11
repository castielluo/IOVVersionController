<template>
  <div class="pie-box">
    <div :id="pieId" :style="{width: '8vw', height: '8vw'}"></div>
  </div>
</template>
<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
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
    'rate',
    'pieId',
    'title',
    'pieData'
  ],
  mounted () {
    this.drawPie(0)
    console.log(this.pieData)
  },
  watch: {
    pieData: function () {
      console.log(this.pieData)
      this.drawPie(1)
    }
  },
  methods: {
    drawPie (clear) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById(this.pieId))
      if (clear) {
        /* 如果数据变化 清空后重新绘制 以免参数遗留 */
        myChart.clear()
      }
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        title: {
          text: [this.rate] + '\n\n' + [this.title],
          left: 'center',
          top: '24%',
          padding: [18, 0],
          textStyle: {
            color: '#aaa',
            fontSize: 14,
            align: 'center',
            lineHeight: 16
          }
        },
        legend: {
          orient: 'vertical',
          x: 'left'
        },
        series: [
          {
            name: '进度',
            type: 'pie',
            radius: ['70%', '80%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            color: ['#22d7bb', '#ccc'],
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.pieData
          }
        ]
      })
    }
  }
}
</script>
<style scoped>
.pie-box{
  position: relative;
  width: 50%;
  display: flex;
  justify-content: center;
  text-align: center;
  float: left;
}
</style>
