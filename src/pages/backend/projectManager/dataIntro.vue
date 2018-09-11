<template>
  <div class="pages-box">
     <div class="pages-bar">
      <div class="pages-title">
        <Icon type="arrow-graph-up-right" size="22" style="margin-right:10px;color:#22d7bb;"></Icon>项目任务概况
      </div>
     </div>
     <div class="pages-content-box">
       <div class="data-box">
         <div class="data-box-title">项目任务统计</div>
         <div class="data-half-box">
           <charts-pie pieId="finish" :rate="doneRate" :pieData="doneData" title="完成度"></charts-pie>
           <charts-pie pieId="delay" :rate="delayRate" :pieData="delayData" title="延迟率"></charts-pie>
           <div class="border-right"></div>
         </div>
         <div class="data-half-box">
           <div class="num-box">
             <span>待完成</span>
             <span style="color:#888">{{Nums.unDoneNum}}</span>
           </div>
           <div class="num-box">
             <span>延期</span>
             <span style="color:#ff5b57">{{Nums.delayNum}}</span>
           </div>
           <div class="num-box">
             <span>已完成</span>
             <span style="color:#22d7bb">{{Nums.doneNum}}</span>
           </div>
           <div class="num-box">
             <span>任务总数</span>
             <span style="color:#888">{{Nums.allNum}}</span>
           </div>
         </div>
       </div>
       <div class="charts-box">
         <div class="data-box-title">
           项目燃尽图
           <!-- 右上角选择器 -->
          <div class="switch-box">
            <div class="month-switch">
              <Icon type="chevron-left" @click="preMonthRanjin"></Icon>
              <span>{{nowDateRanjin}}</span>
              <Icon type="chevron-right" @click="nextMonthRanjin"></Icon>
            </div>
          </div>
         </div>
         <charts-line lineId="ranjin" :xaxis="ranjinX" :lineData="ranjinData"></charts-line>
       </div>
       <div class="charts-box">
         <div class="data-box-title">
           新增任务及完成任务
           <!-- 右上角选择器 -->
          <div class="switch-box">
            <div class="month-switch">
              <Icon type="chevron-left" @click="preMonthTask"></Icon>
              <span>{{nowDateTask}}</span>
              <Icon type="chevron-right" @click="nextMonthTask"></Icon>
            </div>
          </div>
        </div>
         <charts-line lineId="tasks" :xaxis="taskX" :lineData="taskData"></charts-line>
       </div>
     </div>
  </div>
</template>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
<script>
import Pie from '@/components/echarts/pie'
import Line from '@/components/echarts/line'
export default {
  data () {
    return {
      token: window.sessionStorage.getItem('token'),
      project: {},
      Nums: {},
      doneData: [],
      delayData: [],
      delayRate: 0,
      doneRate: 0,
      ranjinX: [],
      ranjinData: [],
      taskX: [],
      taskData: [],
      nowYearRanjin: new Date().getFullYear(),
      nowMonthRanjin: new Date().getMonth() + 1,
      nowYearTask: new Date().getFullYear(),
      nowMonthTask: new Date().getMonth() + 1
    }
  },
  mounted () {
    let param = {
      project_id: this.$route.query.id,
      token: this.token
    }
    let self = this
    this.get('/iov_apis/to_switch_info', param).then(function (res) {
      if (res.data.code === 200) {
        self.project = res.data.project
        self.getDate()
        self.getRanjin(1)
        self.getTasks(1)
      } else {
      }
    })
  },
  components: {
    'charts-pie': Pie,
    'charts-line': Line
  },
  methods: {
    getDate () {
      let param = {
        project_id: this.project.id,
        token: this.token
      }
      let self = this
      this.post('/iov_apis/project_data', param).then(function (res) {
        if (res.data.code === 200) {
          self.doneData = [
            {
              value: res.data.data['doneNum'],
              name: ''
            },
            {
              value: res.data.data['unDoneNum'],
              name: ''
            }
          ]
          self.doneRate = res.data.data['doneRate'].toFixed(2) + '%'
          self.delayData = [
            {
              value: res.data.data['delayNum'],
              name: ''
            },
            {
              value: res.data.data['unDelayNum'],
              name: ''
            }
          ]
          self.delayRate = res.data.data['delayRate'].toFixed(2) + '%'
          self.Nums = res.data.data
        } else {
        }
      })
    },
    /* 燃尽图取数据 */
    getRanjin (first) {
      let params = {}
      if (first) {
        params = {
          project_id: this.project.id,
          token: this.token
        }
      } else {
        params = {
          project_id: this.project.id,
          token: this.token,
          month: this.nowMonthRanjin,
          year: this.nowYearRanjin
        }
      }
      let self = this
      this.post('/iov_apis/project_date_ranjin', params).then(function (res) {
        if (res.data.code === 200) {
          self.ranjinX = res.data.xaxis
          self.ranjinData = {
            name: '剩余任务数',
            type: 'line',
            stack: '',
            data: res.data.data
          }
        } else {
        }
      })
    },
    /* 新增任务取数据 */
    getTasks (first) {
      let params = {}
      if (first) {
        params = {
          project_id: this.project.id,
          token: this.token
        }
      } else {
        params = {
          project_id: this.project.id,
          token: this.token,
          month: this.nowMonthTask,
          year: this.nowYearTask
        }
      }
      let self = this
      this.post('/iov_apis/project_date_tasks', params).then(function (res) {
        if (res.data.code === 200) {
          self.taskX = res.data.xaxis
          self.taskData = [{
            name: '新增任务数',
            type: 'line',
            stack: '',
            data: res.data.dataAdd
          },
          {
            name: '完成任务数',
            type: 'line',
            stack: '',
            data: res.data.dataDone
          }]
        } else {
        }
      })
    },
    /* 燃尽图上个月 */
    preMonthRanjin: _.debounce(function () {
      console.log(this.nowMonthRanjin)
      if (this.nowMonthRanjin === 1) {
        this.nowMonthRanjin = 12
        this.nowYear -= 1
      } else {
        this.nowMonthRanjin -= 1
      }
      /* 切换月份请求接口 */
      this.getRanjin(0)
    }, 500),
    /* 燃尽图上个月 */
    nextMonthRanjin: _.debounce(function () {
      if (this.nowMonthRanjin === new Date().getMonth() + 1) {
        return false
      } else {
        console.log(this.nowMonthRanjin)
        if (this.nowMonthRanjin === 12) {
          this.nowMonthRanjin = 1
          this.nowYear += 1
        } else {
          this.nowMonthRanjin += 1
        }
        /* 切换月份请求接口 */
        this.getRanjin(0)
      }
    }, 500),
    /* 新增任务上个月 */
    preMonthTask: _.debounce(function () {
      console.log(this.nowMonthTask)
      if (this.nowMonthTask === 1) {
        this.nowMonthTask = 12
        this.nowYear -= 1
      } else {
        this.nowMonthTask -= 1
      }
      /* 切换月份请求接口 */
      this.getTasks(0)
    }, 500),
    /* 新增任务下个月 */
    nextMonthTask: _.debounce(function () {
      if (this.nowMonthTask === new Date().getMonth() + 1) {
        return false
      } else {
        console.log(this.nowMonthTask)
        if (this.nowMonthTask === 12) {
          this.nowMonthTask = 1
          this.nowYear += 1
        } else {
          this.nowMonthTask += 1
        }
        /* 切换月份请求接口 */
        this.getTasks(0)
      }
    }, 500)
  },
  computed: {
    nowDateRanjin () {
      return this.nowYearRanjin + '-' + this.nowMonthRanjin
    },
    nowDateTask () {
      return this.nowYearTask + '-' + this.nowMonthTask
    }
  }
}
</script>
<style scoped>
.data-half-box{
  position: relative;
  float: left;
  width: 50%;
  padding: 10px 20px 10px 20px;
}
.num-box{
  position: relative;
  float: left;
  width: 25%;
}
.num-box span:first-child{
  color: #aaa;
  font-size: 12px;
  width: 100%;
  float: left;
  text-align: center;
  margin-top: 10px;
}
.num-box span:last-child{
  font-size: 50px;
  width: 100%;
  float: left;
  text-align: center;
  margin-top: 1vw;
  font-family: lcletter;
}
.charts-box{
  position: relative;
  float: left;
  width: 48.5%;
  background-color: #fff;
  padding: 20px 20px 20px 20px;
}
.charts-box:nth-child(2n+1){
  margin: 15px 1% 10px 0.5%;
}
.charts-box:nth-child(2n){
  margin: 15px 0.5% 10px 1%;
}
.switch-box{
  position: relative;
  float: right;
}
.month-switch{
  position: relative;
  float: left;
  font-size: 16px;
  color: #bbb;
  z-index: 99;
}
.month-switch span{
  float: left;
}
.month-switch >>> .ivu-icon{
  margin: 0 8px;
  float: left;
  cursor: pointer;
}
</style>
