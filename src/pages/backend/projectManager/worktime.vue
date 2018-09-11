<template>
  <div class="pages-box">
    <div class="pages-bar">
      <div class="pages-title">
        <Icon type="ios-alarm-outline" size="22" style="margin-right:10px;color:#22d7bb;"/>工时统计
      </div>
      <Icon type="shuffle" style="float:right;color:#22d7bb;cursor:pointer" size="22" @click="changeMode"></Icon>
    </div>
    <div class="pages-content-box">
      <Table border :columns="columns0" :data="workTimeLists" :height="tableHeight" :loading="loading" stripe v-show="mode"></Table>
      <div class="data-box" v-show="!mode">
        <div class="data-box-title">
          日期工时统计
          <!-- 右上角选择器 -->
          <div class="switch-box">
            <div class="month-switch">
              <Icon type="chevron-left" @click="preMonth"></Icon>
              <span>{{nowDate}}</span>
              <Icon type="chevron-right" @click="nextMonth"></Icon>
            </div>
            <div class="name-switch" v-show="haveRight(project.owner_id)">
              <Dropdown trigger="click" @on-click="switchDate">
                <a href="javascript:void(0)">
                  {{nowDateName}}
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem v-for="(item, index) in allName" :key="item.name" :name="index">{{item.nickname}}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div class="data-box-content">
          <charts-bar barId="dateWorkTime" :drawData="workDateTimeLists.data" :xAxis="workDateTimeLists.name" width="80" height="35"></charts-bar>
        </div>
      </div>
      <div class="data-box" v-show="!mode">
        <div class="data-box-title">
          项目工时统计
          <!-- 右上角选择器 -->
          <div class="switch-box">
            <div class="name-switch" v-show="haveRight(project.owner_id)">
              <Dropdown trigger="click" @on-click="switchTask">
                <a href="javascript:void(0)">
                  {{nowTaskName}}
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem v-for="(item, index) in allName" :key="item.name" :name="index">{{item.nickname}}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div class="data-box-content">
          <charts-bar barId="taskWorkTime" :drawData="workTaskTimeLists.data" :xAxis="workTaskTimeLists.name" width="80" height="35"></charts-bar>
        </div>
      </div>
    </div>
    <!-- 操作任务modal -->
    <Mymodal title="编辑任务" submitBtn="true" @modalConfirm="editTimeDo" @modalCancel="closeTimeDo" v-show="modal">
      <Form ref="formValidate" :label-width="80">
        <FormItem label="" style="margin:12px 0;">
          <DatePicker type="date" placeholder="请选择日期" style="width: 40%" v-model="setTime.work_date" disabled readonly></DatePicker>
          <Select v-model="setTime.during_hour" style="width: 30%;margin-right:20px;">
              <Option v-for="item in timeArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Mymodal>
    <Modal v-model="modal0" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>Delete confirmation</span>
      </p>
      <div style="text-align:center">
        <p>确定删除吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long  @click="doDelete">Delete</Button>
      </div>
    </Modal>
  </div>
</template>
<script src="https://unpkg.com/lodash@4.13.1/lodash.min.js"></script>
<script>
import {saveDate} from '@/utils/filters'
import {Message, Notice} from 'iview'
import Bar from '@/components/echarts/bar'
export default {
  components: {
    'charts-bar': Bar
  },
  data () {
    return {
      mode: 0,
      project: {},
      workTimeLists: [],
      workTaskTimeLists: {
        name: [],
        time: []
      },
      nowTaskName: '',
      nowTaskuid: 0,
      workDateTimeLists: {
        name: [],
        data: []
      },
      nowDateName: '',
      nowDateuid: 0,
      allName: [],
      nowYear: new Date().getFullYear(),
      nowMonth: new Date().getMonth() + 1,
      token: window.sessionStorage.getItem('token'),
      setTime: {},
      loading: false,
      modal: false,
      modal0: false,
      deleteCurrent: '',
      tableHeight: 0,
      timeArray: [{label: '时长1小时', value: 1}, {label: '时长2小时', value: 2}, {label: '时长3小时', value: 3}, {label: '时长4小时', value: 4}, {label: '时长5小时', value: 5}, {label: '时长6小时', value: 6}, {label: '时长7小时', value: 7}, {label: '时长8小时', value: 8}, {label: '时长9小时', value: 9}, {label: '时长10小时', value: 10}, {label: '时长11小时', value: 11}, {label: '时长12小时', value: 12}],
      columns0: [
        {
          title: '任务名',
          key: 'task',
          sortable: true,
          render: (h, params) => {
            if (params.row.work_date < params.row.created_at.slice(0, 10)) {
              return <div title='延迟填写'><div style='position: relative;width: 5px;height: 5px;border-radius: 50%;background-color: #ffad33;display:inline-block;margin-right:5px;'></div>{params.row.task.name}</div>
            } else {
              return <div>{params.row.task.name}</div>
            }
          }
        },
        {
          title: '工作日期',
          key: 'work_date',
          sortable: true,
          render: (h, params) => {
            return <div>{saveDate(params.row.work_date)}</div>
          }
        },
        {
          title: '工作时长',
          key: 'during_hour',
          sortable: true
        },
        {
          title: '参与人',
          key: 'member',
          sortable: true,
          render: (h, params) => {
            return <div>{params.row.member.nickname}</div>
          }
        },
        {
          title: '录入日期',
          key: 'created_at',
          sortable: true
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            if (params.row.member_id === parseInt(window.sessionStorage.getItem('memberId'))) {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.editTime(params.index)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.deleteTime(params.index)
                    }
                  }
                }, '删除')
              ])
            } else {
              return <div></div>
            }
          }
        }
      ]
    }
  },
  mounted () {
    let height = document.documentElement.clientHeight
    this.tableHeight = height * 0.8
    let param = {
      project_id: this.$route.query.id,
      token: this.token
    }
    let self = this
    this.get('/iov_apis/to_switch_info', param).then(function (res) {
      if (res.data.code === 200) {
        self.nowDateName = res.data.me.nickname
        self.nowTaskName = res.data.me.nickname
        self.project = res.data.project
        self.allName = res.data.members
        self.getDateTime(1)
        self.getTaskTime(1)
      } else {
      }
    })
  },
  methods: {
    /* 打开编辑弹框 */
    editTime (index) {
      this.modal = true
      let temp = this.workTimeLists[index]
      this.setTime = JSON.parse(JSON.stringify(temp))
      this.setTime.index = index
    },
    deleteTime (index) {
      this.modal0 = true
      this.deleteCurrent = index
    },
    /* 删除工时条 */
    doDelete () {
      this.loading = true
      let param = {
        id: this.workTimeLists[this.deleteCurrent].id,
        token: this.token
      }
      let self = this
      this.post('/iov_apis/my_time_delete', param).then(function (res) {
        if (res.data.code === 200) {
          Notice.open({
            title: '通知',
            desc: '删除成功！ '
          })
          self.modal0 = false
          self.workTimeLists.splice(self.deleteCurrent, 1)
        } else {
          Message.info('删除失败！' + res.data.msg)
        }
        self.loading = false
      })
    },
    /* 提交修改结果 */
    editTimeDo () {
      console.log(this.setTime)
      this.loading = true
      let param = {
        id: this.setTime.id,
        during_hour: this.setTime.during_hour,
        token: this.token
      }
      let self = this
      this.post('/iov_apis/my_time_edit', param).then(function (res) {
        if (res.data.code === 200) {
          Notice.open({
            title: '通知',
            desc: '修改成功！ '
          })
          self.modal = false
          self.workTimeLists[self.setTime.index].during_hour = self.setTime.during_hour
          console.log(self.setTime.index)
        } else {
          Message.info('修改失败！' + res.data.msg)
        }
        self.loading = false
      })
    },
    closeTimeDo () {
      this.modal = false
    },
    /* 切换图表形式 */
    changeMode () {
      this.mode = !this.mode
      if (!this.workTimeLists[0]) {
        console.log('2')
        this.getTableTime()
      }
    },
    /* 图表数据 任务工时 */
    getTaskTime (first) {
      let params = {}
      console.log(first)
      if (first) {
        params = {
          project_id: this.project.id,
          token: this.token
        }
      } else {
        params = {
          project_id: this.project.id,
          token: this.token,
          uid: this.nowTaskuid
        }
      }
      let self = this
      this.post('/iov_apis/get_task_work_time', params).then(function (res) {
        if (res.data.code === 200) {
          console.log('success')
          self.workTaskTimeLists = []
          self.workTaskTimeLists = res.data.data
        } else {
          console.log('fail')
        }
      })
    },
    /* 图表数据 日期工时 */
    getDateTime (first) {
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
          month: this.nowMonth,
          year: this.nowYear,
          uid: this.nowDateuid
        }
      }
      let self = this
      this.post('/iov_apis/get_date_work_time', params).then(function (res) {
        if (res.data.code === 200) {
          console.log('success')
          self.workDateTimeLists.name = res.data.xaxis
          self.workDateTimeLists.data = res.data.data
        } else {
          console.log('fail')
        }
      })
    },
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
      this.getDateTime(0)
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
        this.getDateTime(0)
      }
    }, 500),
    /* 切换日期图表的用户 */
    switchDate: _.debounce(function (event) {
      console.log(event)
      this.nowDateName = this.allName[event].nickname
      this.nowDateuid = this.allName[event].id
      this.getDateTime(0)
    }),
    switchTask: _.debounce(function (event) {
      console.log(event)
      this.nowTaskName = this.allName[event].nickname
      this.nowTaskuid = this.allName[event].id
      this.getTaskTime(0)
    }),
    getTableTime () {
      let params = {
        project_id: this.project.id,
        token: this.token
      }
      let self = this
      /* 请求表格数据 第一次切换时再请求 */
      this.post('/iov_apis/get_work_time', params).then(function (res) {
        if (res.data.code === 200) {
          console.log('success')
          self.workTimeLists = res.data.data
          self.loading = false
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
  }
}
</script>
<style scoped>
.pages-box >>>.ivu-table-wrapper{
  margin:20px;
}
.switch-box{
  position: relative;
  float: right;
}
.month-switch{
  position: relative;
  float: left;
  font-size: 16px;
  color: #aaa;
  z-index: 99;
  margin-right: 20px;
}
.month-switch span{
  float: left;
}
.month-switch >>> .ivu-icon{
  margin: 0 8px;
  float: left;
  cursor: pointer;
}
.name-switch{
  position: relative;
  float: right;
}
</style>
