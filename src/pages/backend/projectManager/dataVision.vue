<template>
  <div class="all-data-index">
    <div style="position:fixed;z-index:9;top:50px;left:0;width:100%;background-color:#fff;height:120px;padding:15px 0;">
      <h1>项目数据统计</h1>
      <div class="my-man-box">
        <div v-for="(item, index) in members" :key="index" :class="{'menu-actived': index == menu1_actived, 'member': true}" @click="switchMember(index)">
          {{item.nickname}}
        </div>
      </div>
    </div>
    <div class="this-data-box">
      <!-- <div class="data-menu">
        <div :class="{'menu-wrapper': true, 'menu-actived': menu2_actived === 0}" @click="menu2_actived = 0">按项目统计</div>
        <div :class="{'menu-wrapper': true, 'menu-actived': menu2_actived === 1}" @click="menu2_actived = 1">按日期统计</div>
      </div> -->
      <div class="chart">
        <div class="charts-box">
          <div class="data-box-title">
            项目概况
          </div>
          <div class="own-projects" v-for="(item, index) in own_projects" :key="index">
            <div class="own-project-title">
              <p>项目名称</p>
              <p>{{item.name}}</p>
            </div>
            <div class="own-project-allnum">
              <p>Ta的任务数</p>
              <p>{{item.allNum}}</p>
            </div>
            <div class="own-project-donenum">
              <p>Ta的任务完成</p>
              <p>{{item.doneNum}}</p>
            </div>
            <div class="own-project-delay">
              <p>Ta的延时任务数</p>
              <p>{{item.delayNum}}</p>
            </div>
          </div>
        </div>
        <div class="charts-box">
          <div class="data-box-title">
            项目用时统计
          </div>
          <div class="data-box-content">
            <charts-bar barId="projectWorkTime" :drawData="workTaskTimeLists.data" :xAxis="workTaskTimeLists.name" width="40" height="35"></charts-bar>
          </div>
        </div>
        <div class="charts-box">
          <div class="data-box-title">
            项目日期工时
            <div class="switch-box">
              <div class="month-switch">
                <Icon type="chevron-left" @click="preMonth"></Icon>
                <span>{{nowDate}}</span>
                <Icon type="chevron-right" @click="nextMonth"></Icon>
              </div>
            </div>
          </div>
          <div class="data-box-content">
            <charts-bar barId="projectWorkTimeDate" :drawData="workDateTimeLists.data" :xAxis="workDateTimeLists.name" width="40" height="35"></charts-bar>
          </div>
        </div>
        <div class="charts-box">
          <div class="data-box-title">
            项目工时表格
          </div>
          <div class="data-box-content">
            <table border="0" cellspacing="0">
              <tr v-for="(item, index) in time_table" :key="index">
                <td>{{item.name}}</td>
                <td>
                  <table border="0" cellspacing="0">
                    <tr v-for="(item1, index1) in item.tasks" :key="index1">
                      <td>{{item1.name}}</td>
                      <td>
                        <table border="0" cellspacing="0" class="inner-table">
                          <tr v-for="(item2, index2) in item1.worktime" :key="index2">
                            <td width="20vw">{{item2.work_date | cutit}}</td>
                            <td width="10vw">{{item2.during_hour}}小时</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
          <!--  -->
        </div>
      </div>
    </div>
  </div>
</template>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
<script>
import Bar from '@/components/echarts/bar'
export default {
  components: {
    'charts-bar': Bar
  },
  data () {
    return {
      token: window.sessionStorage.getItem('token'),
      members: [],
      nowYear: new Date().getFullYear(),
      nowMonth: new Date().getMonth() + 1,
      menu1_actived: 0,
      menu2_actived: 0,
      own_projects: [],
      workTaskTimeLists: {
        data: [],
        name: []
      },
      workDateTimeLists: {
        data: [],
        name: []
      },
      time_table: []
    }
  },
  mounted () {
    this.myMan()
    this.projectSummary(0)
    this.projectsTimeSummary(0)
    this.getDateTime(0)
    this.getDateTimeTable(0)
  },
  methods: {
    /* 日期工时 切换日期 */
    preMonth: _.debounce(function () {
      console.log(this.nowMonth)
      if (this.nowMonth === 1) {
        this.nowMonth = 12
        this.nowYear -= 1
      } else {
        this.nowMonth -= 1
      }
      /* 切换月份请求接口 */
      this.getDateTime(1)
    }, 500),
    nextMonth: _.debounce(function () {
      if (this.nowMonth === new Date().getMonth() + 1) {
        return false
      } else {
        console.log(this.nowMonth)
        if (this.nowMonth === 12) {
          this.nowMonth = 1
          this.nowYear += 1
        } else {
          this.nowMonth += 1
        }
        /* 切换月份请求接口 */
        this.getDateTime(1)
      }
    }, 500),
    switchMember (index) {
      this.menu1_actived = index
      this.projectSummary(1)
      this.projectsTimeSummary(1)
      this.getDateTime(1)
      this.getDateTimeTable(1)
    },
    projectSummary (index) {
      let self = this
      let postData = {}
      if (index) {
        postData= {
          token: this.token,
          uid: this.members[this.menu1_actived].id
        }
      } else {
        postData= {
          token: this.token
        }
      }
      this.post('/iov_apis/projects_summary', postData).then(function (res) {
        console.log(res.data)
        if (res.data.code === 200) {
          self.own_projects = res.data.data
        }
      })
    },
    projectsTimeSummary (index) {
      let self = this
      let postData = {}
      if (index) {
        postData= {
          token: this.token,
          uid: this.members[this.menu1_actived].id
        }
      } else {
        postData= {
          token: this.token
        }
      }
      this.post('/iov_apis/projects_time_summary', postData).then(function (res) {
        console.log(res.data)
        if (res.data.code === 200) {
          self.workTaskTimeLists.data = {name: "", type: "bar", data: res.data.ydata}
          self.workTaskTimeLists.name = res.data.xdata
        }
      })
    },
    myMan () {
      let self = this
      let postData= {
        token: this.token
      }
      this.post('/iov_apis/my_man', postData).then(function (res) {
        console.log(res.data)
        if (res.data.code === 200) {
          self.members = res.data.data
          for (let i in res.data.data) {
            if (res.data.data[i].id === parseInt(window.sessionStorage.getItem('memberId'))) {
              console.log(i)
              self.menu1_actived = i
            }
          }
        }
      })
    },
    /* 图表数据 日期工时 */
    getDateTime (index) {
      let params = {}
      if (!index) {
        params = {
          token: this.token
        }
      } else {
        params = {
          token: this.token,
          month: this.nowMonth,
          year: this.nowYear,
          uid: this.members[this.menu1_actived].id
        }
      }
      let self = this
      this.post('/iov_apis/get_date_project_time', params).then(function (res) {
        if (res.data.code === 200) {
          console.log('success')
          self.workDateTimeLists.name = res.data.xaxis
          self.workDateTimeLists.data = res.data.data
        } else {
          console.log('fail')
        }
      })
    },
    getDateTimeTable (index) {
      let params = {}
      if (!index) {
        params = {
          token: this.token
        }
      } else {
        params = {
          token: this.token,
          uid: this.members[this.menu1_actived].id
        }
      }
      let self = this
      this.post('/iov_apis/get_date_time_table', params).then(function (res) {
        if (res.data.code === 200) {
          console.log('success')
          self.time_table = res.data.data
        } else {
          console.log('fail')
        }
      })
    }
  },
  computed: {
    nowDate () {
      return this.nowYear + '-' + this.nowMonth
    }
  },
  filters: {
    cutit: function (value) {
      if (!value) return ''
      return value.slice(0, 10)
    }
  }
}
</script>
<style scoped>
.all-data-index{
  text-align: left;
  padding: 10px 0 0 0;
  float: left;
  height: 100%;
  overflow-y: auto;
  background-color: #eee;
}
.all-data-index h1{
  border-bottom: #eee solid 1px;
  margin-bottom: 10px;
  margin: 0 5vw 0 5vw;
  padding-bottom: 10px;
}
.my-man-box{
  position: relative;
  float: left;
  width: 100vw;
  margin: 5px 5vw;
}
.member, .menu-wrapper{
  position: relative;
  float: left;
  margin: 5px 14px 6px 0;
  padding: 0px 12px;
  background-color: #c2c9c5;
  color: #fff;
  text-align: center;
  font-size: 14px;
  border-radius: 14px;
  height: 28px;
  line-height: 28px;
  cursor: pointer;
}
.member:hover, .menu-wrapper:hover{
  background-color: #19be6b!important;
}
.menu-actived{
  background-color: #19be6b!important;
}
.date-choose{
  position: relative;
  float: right;
  width: 15%;
}
.month-switch{
  position: relative;
  float: right;
  font-size: 16px;
  color: #aaa;
  z-index: 99;
  margin: 10px 10px 0 0;
}
.month-switch span{
  float: left;
}
.month-switch >>> .ivu-icon{
  margin: 0px 16px;
  float: left;
  cursor: pointer;
}
.this-data-box{
  position: relative;
  float: left;
  width: 100vw;
  padding-top: 110px;
}
.data-menu{
  position: relative;
  float: left;
  width: 90vw;
  padding: 0;
  margin: 0 5vw;
}
.chart{
  position: relative;
  float: left;
  width: 100%;
  background-color: #eee;
  padding: 10px 0;
}
.charts-box{
  position: relative;
  float: left;
  width: 44.5%;
  background-color: #fff;
  padding: 10px 20px 10px 20px;
  height: 42vh;
  overflow-y: auto;
}
.charts-box:nth-child(2n){
  margin: 10px 5% 10px 0.5%;
}
.charts-box:nth-child(2n+1){
  margin: 10px 0.5% 10px 5%;
}
/* 项目概况 */
.own-projects{
  position: relative;
  float: left;
  width: 100%;
  box-shadow: 3px 3px 10px#eee;
  padding: 10px 0;
  margin: 6px 0 8px 0;
}
.own-project-title,.own-project-allnum,.own-project-donenum,.own-project-delay{
  position: relative;
  float: left;
  width: 25%;
  text-align: center;
}
.own-project-title p:first-child,.own-project-allnum p:first-child,.own-project-donenum p:first-child,.own-project-delay p:first-child{
  font-size: 12px;
  color: #aaa;
}
.own-project-title p:last-child,.own-project-allnum p:last-child,.own-project-donenum p:last-child,.own-project-delay p:last-child{
  font-size: 16px;
  color: #666;
  line-height: 30px;
}
/* 项目工时统计 */
.data-box-content{
  position: relative;
  float: left;
  width: 100%;
}
table{
  position: relative;
  float: left;
  width: 100%;
}
td{
  border:#eee solid 1px;
  text-align: center;
  font-size: 16px;
  margin: 0;
  line-height: 36px;
}
.inner-table tr:first-child td{
  border-top:none;
  border-left: none;
}
.inner-table tr:last-child td{
  border-left: none;
  border-bottom:none
}
</style>
