<template>
    <div class="my-tasks-box">
      <div class="task-bar">
        <div class="task-title">
          <Icon type="ios-alarm-outline" size="22" style="margin-right:10px;color:#22d7bb;"/>我的任务
        </div>
      </div>
      <div class="tasks-content-box">
        <Table border :columns="columns0" :data="taskLists" :loading="loading" stripe :height="tableHeight"></Table>
      </div>
      <!-- 操作任务modal -->
     <Mymodal title="编辑任务" submitBtn="true" @modalConfirm="editTaskAction" @modalCancel="closeEditTaskAction" v-show="modal">
      <Form ref="formValidate" :label-width="80">
        <FormItem label="任务进度" style="margin:12px 0;">
            <Switchs size="large" v-model="setTask.status">
              <span slot="open">完成</span>
              <span slot="close">进行</span>
            </Switchs>
        </FormItem>
        <FormItem label="添加工时" style="margin:18px 0 12px 0;">
            <Button type="primary" shape="circle" icon="ios-plus-empty" @click="addTime"></Button>
            <span>注：同一天同一任务只允许填写一次工时</span>
        </FormItem>
        <FormItem label="" style="margin:12px 0;" v-for="(item, index) in setTask.workingTime" :key="index">
          <DatePicker type="date" placeholder="请选择日期" style="width: 40%" v-model="item.date"></DatePicker>
          <Select v-model="item.during" style="width: 30%;margin-right:20px;">
              <Option v-for="item in timeArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Icon type="close" size="large" @click="cancelThis(index)" style="cursor:pointer"/>
        </FormItem>
      </Form>
     </Mymodal>
     <!-- click task modal -->
     <Mymodal title="任务详情" @modalConfirm="modal2 = false" @modalCancel="modal2 = false" v-show="modal2">
       <div class="task-modal-title">
         <div class="task-modal-name">{{showTask.name}}</div>
         <div class="task-modal-tabs">
           <div class="owner-box">
             <span>创建人</span>
             <span>{{showTask.creater_name}}</span>
           </div>
           <div class="end-box">
             <span>截止日期</span>
             <span>{{showTask.end_at | cutit}}</span>
           </div>
         </div>
       </div>
       <div class="task-modal-des">
         {{showTask.des ? showTask.des : '暂无'}}
       </div>
       <div class="task-modal-members">
         <div class="task-modal-members-title">
           <Icon type="ios-people" />参与人
         </div>
         <div class="task-modal-member" :class="{'status-deactived': member.status == 0, 'status-actived': member.status == 1, 'status-done': member.status == 2}" v-for="member in showTask.members" :key="member.id">
           {{member.nickname | cutname}}
         </div>
       </div>
       <div class="task-modal-emergency">
          <span>
           创建于{{showTask.created_at | cutit}} &nbsp;&nbsp;&nbsp;&nbsp;
           紧急程度：{{showTask.emergency === 0 ? '高' : ''}}{{showTask.emergency === 1 ? '中' : ''}}{{showTask.emergency === 2 ? '低' : ''}}
          </span>
       </div>
       <div class="task-modal-table-title">我的工时</div>
       <div class="task-modal-table">
         <Table border :columns="columns1" height="100" :data="showTask.workTime" stripe v-if="showTask.workTime"></Table>
       </div>
       <div class="task-modal-comment">
         <div class="task-modal-comment-title">评论区</div>
         <div class="task-modal-comment-content"></div>
       </div>
     </Mymodal>
    </div>
</template>
<script>
import {Message, Notice} from 'iview'
import {saveDate} from '@/utils/filters'
export default {
  data () {
    return {
      taskLists: [],
      token: window.sessionStorage.getItem('token'),
      loading: true,
      modal: false,
      modal2: false,
      tableHeight: 0,
      editTask: {},
      showTask: {},
      setTask: {
        listIndex: 0,
        status: false,
        workingTime: []
      },
      timeArray: [{label: '时长1小时', value: 1}, {label: '时长2小时', value: 2}, {label: '时长3小时', value: 3}, {label: '时长4小时', value: 4}, {label: '时长5小时', value: 5}, {label: '时长6小时', value: 6}, {label: '时长7小时', value: 7}, {label: '时长8小时', value: 8}, {label: '时长9小时', value: 9}, {label: '时长10小时', value: 10}, {label: '时长11小时', value: 11}, {label: '时长12小时', value: 12}],
      columns0: [
        {
          title: '任务名',
          key: 'name'
        },
        {
          title: '截止时间',
          key: 'end_at',
          sortable: true,
          render: (h, params) => {
            return <div>{saveDate(params.row.end_at)}</div>
          }
        },
        {
          title: '紧急程度',
          key: 'emergency',
          sortable: true,
          render: (h, params) => {
            return <div>{params.row.emergency === 0 ? '高' : ''}{params.row.emergency === 1 ? '中' : ''}{params.row.emergency === 2 ? '低' : ''}</div>
          }
        },
        {
          title: '状态',
          key: 'status',
          sortable: true,
          render: (h, params) => {
            return <div>{params.row.status === 0 ? '未开始' : ''}{params.row.status === 1 ? '进行中' : ''}{params.row.status === 2 ? '结束' : ''}</div>
          }
        },
        {
          title: '创建人',
          key: 'creater_name'
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
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
                    this.viewTask(params.index)
                  }
                }
              }, '查看'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.operateTask(params.index)
                  }
                }
              }, '操作')
            ])
          }
        }
      ],
      columns1: [
        {
          title: '工作日期',
          key: 'work_date',
          render: (h, params) => {
            return <div>{saveDate(params.row.work_date)}</div>
          }
        },
        {
          title: '工作时长',
          key: 'during_hour'
        },
        {
          title: '录入日期',
          key: 'created_at'
        }
      ]
    }
  },
  mounted () {
    let height = document.documentElement.clientHeight
    this.tableHeight = height * 0.8
    let self = this
    this.post('/iov_apis/my_tasks', {id: this.$route.query.id, token: this.token}).then(function (res) {
      console.log(res)
      if (res.data.code === 200) {
        self.taskLists = res.data.data
        self.loading = false
      } else {
        Message.info('数据获取失败，请稍候重试！' + res.data.msg)
      }
    }).catch(function (ret) {
      Message.info('数据获取失败，请稍候重试！' + ret)
    })
  },
  methods: {
    operateTask (index) {
      this.modal = true
      this.editTask = JSON.parse(JSON.stringify(this.taskLists[index]))
      /* 设置一致 并在提交时用以判断是否改变 */
      if (this.editTask.myStatus === 0) {
        this.setTask.status = false
      } else if (this.editTask.myStatus === 1) {
        this.setTask.status = false
      } else {
        this.setTask.status = true
      }
      this.setTask.listIndex = index
      console.log(this.editTask)
      this.modal = true
    },
    viewTask (index) {
      this.showTask = this.taskLists[index]
      console.log(this.showTask)
      this.modal2 = true
    },
    editTaskAction () {
      console.log(this.setTask)
      let emptyItem = 0
      /* 其中 如果本身状态是0 未按动switch提交 将视为启动项目 */
      if (((this.editTask.myStatus === 1) && (this.setTask.status === false)) || ((this.editTask.myStatus === 2) && (this.setTask.status === true))) {
        console.log('状态未改变')
        emptyItem++
      }
      for (let set in this.setTask.workingTime) {
        if ((this.setTask.workingTime[set].date === '') || (this.setTask.workingTime[set].during === '')) {
          emptyItem += 2
          console.log('hoho')
        }
      }
      if (emptyItem > 1) {
        console.log('禁止上传')
        Message.info('请完善修改项再行提交！')
        return
      }
      let param = {
        task_id: this.editTask.id,
        token: this.token,
        worktime: this.setTask.workingTime,
        status: this.setTask.status
      }
      console.log(param)
      let self = this
      this.post('/iov_apis/my_task_edit', param).then(function (res) {
        if (res.data.code === 200) {
          Notice.open({
            title: '通知',
            desc: '修改成功！ '
          })
          /* 改变成功 清空弹框并改变taskLists数据 */
          self.modal = false
          self.taskLists[self.setTask.listIndex].status = res.data.data.status
          self.taskLists[self.setTask.listIndex] = res.data.data
          self.closeEditTaskAction()
        } else {
          Message.info('修改失败！' + res.data.msg)
        }
      })
    },
    addTime () {
      this.setTask.workingTime.push({date: '', during: ''})
    },
    cancelThis (index) {
      console.log(index)
      this.setTask.workingTime.splice(index, 1)
    },
    closeEditTaskAction () {
      console.log('2')
      this.modal = false
      this.setTask = {
        listIndex: 0,
        status: false,
        workingTime: []
      }
    }
  },
  filters: {
    cutit: function (value) {
      if (!value) return ''
      return value.slice(0, 10)
    },
    cutname: function (value) {
      if (!value) return ''
      return value.slice(-1)
    }
  }
}
</script>
<style scoped>
.my-tasks-box{
  position: relative;
  width: 100%;
  background-color: #eee;
  min-height: 94vh;
}
.my-tasks-box .task-bar{
  position: relative;
  float: left;
  width: 100%;
  height: 5.2vh;
  min-height: 50px;
  line-height: 30px;
  padding: 10px 2%;
  font-size: 16px;
  color: #222;
  text-align: left;
  background-color: #fff;
  border-bottom: #eee solid 1px;
}
.my-tasks-box .task-bar .task-title{
  display: flex;
  align-items: center;
  float: left;
}
.my-tasks-box .tasks-content-box{
  width: 100%;
  float: left;
  height: 78.2vh;
  overflow-y: auto;
  overflow-x: auto;
  white-space: nowrap;
}
.my-tasks-box .tasks-content-box .ivu-table-wrapper{
  margin: 25px;
}
.task-modal-title{
  position: relative;
  width: 100%;
  float: left;
  text-align: left;
}
.task-modal-name{
  font-size: 20px;
  width: 70%;
  float: left;
}
.task-modal-tabs{
  position: relative;
  width: 30%;
  float: left;
  color: #aaa;
  font-weight: 400;
  text-align: center;
  font-size: 10px;
}
.task-modal-tabs span{
  float: left;
  width: 100%;
}
.owner-box{
  position: relative;
  width: 50%;
  float: left;
  border-right: #ddd solid 1px;
}
.end-box{
  position: relative;
  float: left;
  width: 50%;
}
.task-modal-des{
  position: relative;
  float: left;
  width: 100%;
  padding:18px 10px;
  margin: 10px 0;
  font-size: 14px;
  text-align:left;
  text-indent: 14px;
  color: #666;
  border:#eee solid 1px;
}
.task-modal-members{
  position: relative;
  float: left;
  width: 100%;
  padding:8px 10px;
  border-bottom: #eee solid 1px;
}
.task-modal-members-title{
  text-align: left;
  position: relative;
  float: left;
  width: 100%;
  display: flex;
  align-items: center;
  color: #aaa;
  margin: 10px 0 6px 0;
}
.task-modal-members-title .ivu-icon{
  font-size: 20px;
  color: #aaa;
  margin-right: 6px;
}
.task-modal-table{
  position: relative;
  float: left;
  width: 100%;
  padding:8px 10px;
}
.task-modal-table-title{
  text-align: left;
  position: relative;
  float: left;
  width: 100%;
  display: flex;
  align-items: center;
  color: #aaa;
  margin: 10px 10px 6px 10px;
}
.task-modal-member{
  position: relative;
  float: left;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: #fff;
  overflow: hidden;
  text-align: center;
  line-height: 30px;
  margin: 0 5px 0 0;
}
.status-deactived{
  background-color: #bbb;
}
.status-actived{
  background-color: #f90;
}
.status-done{
  background-color: #19be6b;
}
.task-modal-emergency{
  position: relative;
  float: left;
  width: 100%;
  padding:8px 10px;
  color: #aaa;
  font-size: 12px;
  border-bottom: #eee solid 1px;
}
.task-modal-comment{
  position: relative;
  float: left;
  width: 100%;
  padding:8px 10px;
}
.task-modal-comment-title{
  text-align: left;
  position: relative;
  float: left;
  width: 100%;
  color: #aaa;
  margin: 5px 0 4px 0;
}
.task-modal-comment-content{
  position: relative;
  float: left;
  width: 100%;
  padding:18px 10px;
  margin: 10px 0;
  font-size: 14px;
  color: #666;
  border:#eee solid 1px;
  min-height: 2vh;
}
</style>
