<template>
    <div class="pages-box">
     <div class="pages-bar">
      <div class="pages-title">
        <Icon type="ios-alarm-outline" size="22" style="margin-right:10px;color:#22d7bb;"/>项目任务
      </div>
      <Button type="info" class="add-btn" @click="modal = true" v-show="haveRight(project.owner_id)">新增</Button>
     </div>
     <div class="pages-content-box">
      <Spin size="large" style="margin:0 50%;position:absolute;" v-show="loading"></Spin>
      <div class="pages-content">
        <div class="tasks-lists" v-for="(item, index) in taskLists" :key="item.id">
          <div class="task-list-title">
            {{item.name}}
            <Icon type="trash-a" size="22" @click="deleteList(index)" v-show="haveRight(project.owner_id)"></Icon>
            <Icon type="ios-plus-empty" size="28" @click="addTask(index, item.id)" style="margin-top:-3px;"></Icon>
          </div>
          <div class="sort-box">
            <Select v-model="item.sortType" style="width: 100%;border:none;outline:none;" @on-change="changeSort(index)">
                <Option v-for="itemm in sortArray" :value="itemm.value" :key="itemm.value">{{ itemm.label }}</Option>
            </Select>
          </div>
          <div class="tasks" v-for="(task, index1) in item.tasks" :key="task.id" @click="showTask(index, index1)">
            <div class="edit-task" v-show="haveRight(task.creater_id)"><Icon type="ios-gear-outline" size="20" @click.stop="showEditTask(index, index1)"></Icon></div>
            <!-- <Checkbox v-model="task.status">&nbsp; </Checkbox> -->
            <div class="status status-deactived" v-if="task.status === 0"></div>
            <div class="status status-actived" v-else-if="task.status === 1"></div>
            <div class="status status-done" v-else></div>
            <!-- 紧急图标 -->
            <div class="emergency emergency-hurry" v-if="task.emergency === 0">高</div>
            <div class="emergency emergency-normal" v-else-if="task.emergency === 1">中</div>
            <div class="emergency emergency-not" v-else>低</div>
            <div class="task-text">
              {{task.name}}
              <div class="is-new" v-show="task.is_new_to_me === 1">新</div>
              <div class="is-at" v-show="task.some_body_at_me > 0">@</div>
            </div>
            <div class="task-bottom">
              <div class="task-dead-line">{{task.end_at | cutit}}</div>
              <div class="members">
                <div class="task-member" :class="{'status-deactived': member.status == 0, 'status-actived': member.status == 1, 'status-done': member.status == 2}" v-for="member in task.members" :key="member.id">
                  {{member.nickname | cutname}}
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="task-list-bottom" @click="addTask(index, item.id)">
            <Icon type="ios-plus-empty" size="22"></Icon>添加任务
          </div> -->
        </div>
      </div>
     </div>
     <!-- 添加任务类型modal -->
     <Mymodal title="添加任务类型" @modalConfirm="addList" @modalCancel="modal = false" v-show="modal" submitBtn="true">
      <Form ref="formValidate" :label-width="80">
        <FormItem label="类型名称" style="margin:12px 0;">
            <Input placeholder="Enter list name" v-model="listName"></Input>
        </FormItem>
      </Form>
     </Mymodal>
     <!-- 添加任务modal -->
     <Mymodal title="添加任务" submitBtn="true" @modalConfirm="addTasks()" @modalCancel="modal1 = false" v-show="modal1">
      <Form ref="formValidate1" :label-width="80">
        <FormItem label="任务名" style="margin:12px 0;">
            <Input placeholder="Enter task name" v-model="newTask.name"></Input>
        </FormItem>
        <FormItem label="紧急程度" style="margin:12px 0;">
            <RadioGroup v-model="newTask.emergency">
              <Radio label="0">
                <span>高</span>
              </Radio>
              <Radio label="1">
                <span>中</span>
              </Radio>
              <Radio label="2">
                <span>低</span>
              </Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="截止时间" style="margin:12px 0;">
            <DatePicker type="date" placeholder="Select date" style="width: 200px" v-model="newTask.end_at"></DatePicker>
        </FormItem>
        <FormItem label="分配给" style="margin:12px 0;">
          <Select v-model="newTask.members" multiple >
            <Option v-for="item in groupMember" :value="item.id" :key="item.id">{{ item.nickname }}</Option>
          </Select>
        </FormItem>
        <FormItem label="任务描述" style="margin:12px 0;">
            <Input v-model="newTask.des" type="textarea" placeholder="添加描述"></Input>
        </FormItem>
      </Form>
     </Mymodal>
     <!-- click task modal -->
     <rightModal title="任务详情" @modalConfirm="modal2 = false" @modalCancel="closeDetail" :show="modal2">
       <div class="task-modal-title">
         <div class="task-modal-name">{{taskDetail.name}}</div>
         <div class="task-modal-tabs">
            <span>{{taskDetail.creater_name}}</span>
            <span>{{taskDetail.end_at | cutit}}</span>
         </div>
       </div>
       <div class="task-modal-des">
         {{taskDetail.des ? taskDetail.des : '暂无'}}
       </div>
       <div class="task-modal-members">
         <div class="task-modal-members-title">
           <Icon type="ios-people" />参与人
         </div>
         <div class="task-modal-member" :class="{'status-deactived': member.status == 0, 'status-actived': member.status == 1, 'status-done': member.status == 2}" v-for="member in taskDetail.members" :key="member.id">
           {{member.nickname | cutname}}
         </div>
       </div>
       <div class="task-modal-emergency">
          <span>
           创建于{{taskDetail.created_at | cutit}} &nbsp;&nbsp;&nbsp;&nbsp;
           紧急程度：{{taskDetail.emergency === 0 ? '高' : ''}}{{taskDetail.emergency === 1 ? '中' : ''}}{{taskDetail.emergency === 2 ? '低' : ''}}
          </span>
       </div>
       <div class="task-modal-table-title" @click="worktimeshow = !worktimeshow">工时统计</div>
       <div class="task-modal-table" v-show="worktimeshow">
         <Table border :columns="columns1" :data="taskDetailTime" stripe v-if="taskDetailTime"></Table>
       </div>
       <div class="task-modal-my-status" v-show="taskDetailMyStatus !== -1">
          <div class="task-modal-my-status-label">我的状态</div>
          <Dropdown trigger="click" style="margin-left: 20px" @on-click="chooseIt">
            <a href="javascript:void(0)">
              {{taskDetailMyStatus == 0 ? '未启动' : ''}}
              {{taskDetailMyStatus == 1 ? '已启动' : ''}}
              {{taskDetailMyStatus == 2 ? '已完成' : ''}}
            </a>
            <DropdownMenu slot="list">
              <DropdownItem name="1">启动</DropdownItem>
              <DropdownItem name="2">完成</DropdownItem>
            </DropdownMenu>
          </Dropdown>
       </div>
       <div class="add-time-box" v-show="taskDetailMyStatus !== -1">
         <div class="add-time-box-title">
           添加工时
           <Button type="success" v-show="addBoxShow" @click="saveTime" style="float:right;margin-left:10px;">提交</Button>
           <Button type="info" @click="addTime" style="float:right">添加</Button>
         </div>
         <div class="add-time-box-content" v-show="addBoxShow">
            <span style="color:#666">注：同一天同一任务只允许填写一次工时。日期不可选择明天以后。</span>
            <Form ref="formValidate" :label-width="0">
              <FormItem label="" style="margin:12px 0;" v-for="(item, index) in setWorkingTime" :key="index">
                <DatePicker type="date" placeholder="请选择日期" style="width: 40%" v-model="item.date"></DatePicker>
                <Select v-model="item.during" style="width: 30%;margin-right:20px;">
                    <Option v-for="item in timeArray" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Icon type="close" size="large" @click="cancelThis(index)" style="cursor:pointer"/>
              </FormItem>
            </Form>
         </div>
       </div>
       <div class="task-modal-comment">
         <div class="task-modal-comment-title">评论区</div>
         <div class="task-modal-comment-add">
           <Form ref="formValidate1" :label-width="0">
             <Input v-model="add_comment" type="textarea" :rows="4" placeholder="Enter something..." @on-change="addCommentChange"></Input>
             <div class="tool-bar" v-show="addCommentShow">
               <div :class="{'at-who': true,'at-chosen': item.chosen}" v-for="(item, index) in atMember" :value="item.id" :key="item.id" @click="atTa(index)">@{{item.nickname}}</div>
               <Button type="success" @click="saveComment" style="float:right;margin-left:10px;">提交</Button>
             </div>
           </Form>
         </div>
         <div class="task-modal-comment-content">
           <div class="comments" v-for="(item, index) in taskDetail.comment" :key="index">
             <div class="comment-at" v-for="(item1, index1) in item.at" :key="index1">@{{item1.member_name}}&nbsp;&nbsp;</div>
             <p>{{item.comment}}</p>
             <p class="comment-author"><span>{{item.created_at}}</span><span><b>by</b>&nbsp;{{item.author_name}}</span></p>
           </div>
         </div>
       </div>
     </rightModal>
     <!-- 修改任务modal -->
     <Mymodal title="修改任务" submitBtn="true" deleteBtn="true" @modalConfirm="editTasks()" @modalCancel="modal3 = false" @modalDelete="deleteTask" v-show="modal3">
      <Form ref="formValidate1" :label-width="80">
        <FormItem label="任务名" style="margin:12px 0;">
            <Input placeholder="Enter task name" v-model="editTask.name"></Input>
        </FormItem>
        <FormItem label="紧急程度" style="margin:12px 0;">
            <RadioGroup v-model="editTask.emergency">
              <Radio label="0">
                <span>高</span>
              </Radio>
              <Radio label="1">
                <span>中</span>
              </Radio>
              <Radio label="2">
                <span>低</span>
              </Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="截止时间" style="margin:12px 0;">
            <DatePicker type="date" placeholder="Select date" style="width: 200px" v-model="editTask.end_at"></DatePicker>
        </FormItem>
        <FormItem label="分配给" style="margin:12px 0;">
          <Select v-model="editTask.members" multiple >
            <Option v-for="item in groupMember" :value="item.id" :key="item.id">{{ item.nickname }}</Option>
          </Select>
        </FormItem>
        <FormItem label="任务描述" style="margin:12px 0;">
            <Input v-model="editTask.des" type="textarea" placeholder="添加描述"></Input>
        </FormItem>
      </Form>
     </Mymodal>
     <!-- 删除任务modal -->
      <Modal v-model="modal4" width="360">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>Delete confirmation</span>
        </p>
        <div style="text-align:center">
          <p>确定删除该任务吗？</p>
        </div>
        <div slot="footer">
          <Button type="error" size="large" long  @click="doDelete">Delete</Button>
        </div>
      </Modal>
      <!-- 删除任务类型modal -->
      <Modal v-model="modal5" width="360">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>Delete confirmation</span>
        </p>
        <div style="text-align:center">
          <p>确定删除该任务类型吗？</p>
        </div>
        <div slot="footer">
          <Button type="error" size="large" long  @click="doDeleteList">Delete</Button>
        </div>
      </Modal>
    </div>
</template>
<script>
import {Message, Notice} from 'iview'
import Validate from '../../../utils/validator'
import {saveDate} from '@/utils/filters'
export default {
  data () {
    return {
      modal: false,
      modal1: false,
      modal2: false,
      modal3: false,
      modal4: false,
      modal5: false,
      loading: true,
      deleteListId: -1,
      token: window.sessionStorage.getItem('token'),
      project: {},
      listName: '',
      taskLists: [],
      editTask: {},
      newTask: {
        name: '',
        des: '',
        end_at: '',
        members: '',
        emergency: '',
        token: window.sessionStorage.getItem('token'),
        belongsto: ''
      },
      groupMember: [],
      atMember: [],
      taskDetail: [],
      taskDetailTime: [],
      taskDetailMyStatus: -1,
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
          title: '参与人',
          key: 'member',
          sortable: true,
          render: (h, params) => {
            return <div>{params.row.member.nickname}</div>
          }
        },
        {
          title: '录入日期',
          key: 'created_at'
        }
      ],
      worktimeshow: false,
      addBoxShow: false,
      addCommentShow: false,
      add_comment: '',
      setWorkingTime: [],
      timeArray: [{label: '时长1小时', value: 1}, {label: '时长2小时', value: 2}, {label: '时长3小时', value: 3}, {label: '时长4小时', value: 4}, {label: '时长5小时', value: 5}, {label: '时长6小时', value: 6}, {label: '时长7小时', value: 7}, {label: '时长8小时', value: 8}, {label: '时长9小时', value: 9}, {label: '时长10小时', value: 10}, {label: '时长11小时', value: 11}, {label: '时长12小时', value: 12}],
      showingTaskIndex: [],
      sortArray: [{label: '按创建时间倒序', value: 0}, {label: '按创建时间正序', value: 1}, {label: '只显示我的任务', value: 2}, {label: '显示所有人任务', value: 3}, {label: '按完成状态倒序', value: 4}, {label: '按完成状态正序', value: 5}, {label: '按紧急情况倒序', value: 6}, {label: '按紧急情况正序', value: 7}]
    }
  },
  mounted () {
    this.reloadList()
  },
  methods: {
    /* 添加任务类型表 */
    addList () {
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      }
      let param = {
        id: this.project.id,
        name: this.listName,
        token: this.token
      }
      let self = this
      let vali = new Validate()
      vali.add(this.listName, [{method: 'matchEmpty', msg: '名称不能为空'}])
      let result = vali.start()
      // 如果没有错误返回则提交
      if (!result) {
        this.post('/iov_apis/task_list_add', param, config).then(function (res) {
          console.log(res)
          if (res.data.code === 200) {
            Notice.open({
              title: '通知',
              desc: '添加成功！ '
            })
            self.modal = false
            self.listName = ''
            /* 刷新list */
            self.reloadList()
          } else {
            Message.info('添加失败！' + res.data.msg)
          }
        }).catch(function (ret) {
          Message.info('添加失败！' + ret)
        })
      } else {
        // 验证失败
        Message.info('提交失败！' + result)
      }
    },
    addTask (index, id) {
      this.modal1 = true
      this.newTask.belongsto = id
    },
    /* 添加任务条 */
    addTasks () {
      let self = this
      console.log(this.newTask)
      let vali = new Validate()
      vali.add(this.newTask.name, [{method: 'matchEmpty', msg: '名称不能为空'}])
      vali.add(this.newTask.emergency, [{method: 'matchEmpty', msg: '紧急程度不能为空'}])
      vali.add(this.newTask.end_at, [{method: 'matchEmpty', msg: '截止日期不能为空'}])
      vali.add(this.newTask.members, [{method: 'matchEmpty', msg: '分配不能为空'}])
      let result = vali.start()
      // 如果没有错误返回则提交
      if (!result) {
        this.post('/iov_apis/task_add', this.newTask).then(function (res) {
          console.log(res)
          if (res.data.code === 200) {
            Notice.open({
              title: '通知',
              desc: '添加成功！ '
            })
            self.modal1 = false
            self.newTask.name = ''
            self.newTask.des = ''
            self.newTask.end_at = ''
            self.newTask.members = ''
            self.newTask.emergency = ''
            self.newTask.belongsto = ''
            /* 刷新list */
            self.reloadList()
          } else {
            Message.info('添加失败！' + res.data.msg)
          }
        }).catch(function (ret) {
          Message.info('添加失败！' + ret)
        })
      } else {
        // 验证失败
        Message.info('提交失败！' + result)
      }
    },
    /* 关闭详情框 */
    closeDetail () {
      console.log()
      this.modal2 = false
      this.worktimeshow = false
      this.addBoxShow = false
      this.add_comment = ''
      this.addCommentShow = false
      this.atMember = JSON.parse(JSON.stringify(this.groupMember))
    },
    /* 刷新 */
    reloadList () {
      let self = this
      this.get('/iov_apis/tasks', {id: this.$route.query.id, token: this.token}).then(function (res) {
        if (res.data.code === 200) {
          self.taskLists = res.data.lists
          self.groupMember = res.data.groupMember
          self.loading = false
          self.project = res.data.project
        } else {
          Message.info('数据获取失败，请稍候重试！' + res.data.msg)
        }
      }).catch(function (ret) {
        Message.info('数据获取失败，请稍候重试！' + ret)
      })
    },
    /* click task show modal */
    showTask (index, index1) {
      console.log(index)
      this.modal2 = true
      if ((this.taskLists[index].tasks[index1].is_new_to_me === 1) || (this.taskLists[index].tasks[index1].some_body_at_me > 0)) {
        this.setTaskRead(this.taskLists[index].tasks[index1].id)
      }
      this.taskLists[index].tasks[index1].is_new_to_me = 0
      this.taskLists[index].tasks[index1].some_body_at_me = 0
      this.taskDetail = this.taskLists[index].tasks[index1]
      this.showingTaskIndex = {
        index: index,
        index1: index1
      }
      this.atMember = JSON.parse(JSON.stringify(this.groupMember))
      console.log(this.atMember)
    },
    setTaskRead (id) {
      let param = {
        token: this.token,
        id: id
      }
      this.post('/iov_apis/set_task_read', param).then(function (res) {
      })
    },
    showEditTask (index, index1) {
      this.editTask = JSON.parse(JSON.stringify(this.taskLists[index].tasks[index1]))
      this.editTask.emergency = String(this.editTask.emergency)
      let memberTemp = []
      for (let i of this.editTask.members) {
        memberTemp.push(i.id)
      }
      console.log(memberTemp)
      this.editTask.members = memberTemp
      this.modal3 = true
    },
    editTasks () {
      let self = this
      this.editTask.token = this.token
      console.log(this.editTask)
      let vali = new Validate()
      vali.add(this.editTask.name, [{method: 'matchEmpty', msg: '名称不能为空'}])
      vali.add(this.editTask.emergency, [{method: 'matchEmpty', msg: '紧急程度不能为空'}])
      vali.add(this.editTask.end_at, [{method: 'matchEmpty', msg: '截止日期不能为空'}])
      vali.add(this.editTask.members, [{method: 'matchEmpty', msg: '分配不能为空'}])
      let result = vali.start()
      // 如果没有错误返回则提交
      if (!result) {
        this.post('/iov_apis/task_edit', this.editTask).then(function (res) {
          console.log(res)
          if (res.data.code === 200) {
            Notice.open({
              title: '通知',
              desc: '修改成功！ '
            })
            self.modal3 = false
            /* 刷新list */
            self.reloadList()
          } else {
            Message.info('修改失败！' + res.data.msg)
          }
        }).catch(function (ret) {
          Message.info('修改失败！' + ret)
        })
      } else {
        // 验证失败
        Message.info('提交失败！' + result)
      }
    },
    /* 弹框确认 */
    deleteTask () {
      this.modal4 = true
    },
    /* 删除任务 */
    doDelete () {
      this.modal4 = false
      let self = this
      this.editTask.token = this.token
      this.post('/iov_apis/task_delete', this.editTask).then(function (res) {
        if (res.data.code === 200) {
          Notice.open({
            title: '通知',
            desc: '删除成功！ '
          })
          self.modal4 = false
          self.modal3 = false
          /* 刷新list */
          self.reloadList()
        } else {
          Message.info('删除失败！' + res.data.msg)
        }
      }).catch(function (ret) {
        Message.info('删除失败！' + ret)
      })
    },
    /* 弹框确认 */
    deleteList (index) {
      this.modal5 = true
      this.deleteListId = this.taskLists[index].id
    },
    /* 删除任务类型 */
    doDeleteList () {
      this.modal5 = false
      let self = this
      this.post('/iov_apis/task_list_delete', {id: this.deleteListId, token: this.token}).then(function (res) {
        if (res.data.code === 200) {
          Notice.open({
            title: '通知',
            desc: '删除成功！ '
          })
          self.modal5 = false
          /* 刷新list */
          self.reloadList()
        } else {
          Message.info('删除失败！' + res.data.msg)
        }
      }).catch(function (ret) {
        Message.info('删除失败！' + ret)
      })
    },
    chooseIt (e) {
      console.log(e)
      let self = this
      let param = {
        task_id: this.taskDetail.id,
        token: this.token,
        status: e
      }
      this.post('/iov_apis/my_task_edit_status', param).then(function (res) {
        if (res.data.code === 200) {
          console.log(self.showingTaskIndex.index + ',' + self.showingTaskIndex.index1)
          self.taskLists[self.showingTaskIndex.index].tasks[self.showingTaskIndex.index1] = res.data.data
          self.taskDetail = res.data.data
        }
      })
    },
    addTime () {
      this.setWorkingTime.push({date: '', during: ''})
      this.addBoxShow = true
    },
    cancelThis (index) {
      console.log(index)
      this.setWorkingTime.splice(index, 1)
    },
    /* 添加工时post */
    saveTime () {
      console.log(this.setWorkingTime)
      if (this.setWorkingTime.length === 0) {
        Message.info('请添加工时再行提交！')
        return
      }
      let emptyItem = 0
      for (let set in this.setWorkingTime) {
        if ((this.setWorkingTime[set].date === '') || (this.setWorkingTime[set].during === '')) {
          emptyItem += 1
        }
      }
      if (emptyItem) {
        console.log('禁止上传')
        Message.info('请完善填空项再行提交！')
        return
      }
      // 这里进行拦截今天以后的工时
      for (let set in this.setWorkingTime) {
        let nowDate = new Date(new Date().setHours(23, 59, 59, 999)).getTime()
        let setTime = new Date(this.setWorkingTime[set].date).getTime()
        if (setTime > nowDate) {
          Message.info('请勿选择今天以后的日期！')
          return
        }
      }
      let param = {
        task_id: this.taskDetail.id,
        token: this.token,
        worktime: this.setWorkingTime
      }
      console.log(param)
      let self = this
      this.post('/iov_apis/my_task_edit_time', param).then(function (res) {
        if (res.data.code === 200) {
          Notice.open({
            title: '通知',
            desc: '修改成功！ '
          })
          /* 改变成功 改变taskDetail和taskLists和setWorkingTime数据 */
          console.log(self.showingTaskIndex.index + ',' + self.showingTaskIndex.index1)
          self.taskLists[self.showingTaskIndex.index].tasks[self.showingTaskIndex.index1] = res.data.data
          self.taskDetail = res.data.data
          self.setWorkingTime = []
          self.addBoxShow = false
          if (res.data.exist) {
            Notice.open({
              title: '注意',
              desc: '检测到添加重复工时，系统未与录入 '
            })
          }
        } else {
          Message.info('修改失败！' + res.data.msg)
        }
      })
    },
    /* 改变排序 */
    changeSort (index) {
      console.log(index)
      let list = this.taskLists[index].tasks
      console.log(this.taskLists[index].sortType)
      if (this.taskLists[index].sortType === 0) {
        list.sort(function (a, b) {
          if (b.created_at > a.created_at) {
            return 1
          }
        })
      } else if (this.taskLists[index].sortType === 1) {
        list.sort(function (a, b) {
          if (a.created_at > b.created_at) {
            return 1
          }
        })
      } else if (this.taskLists[index].sortType === 2) {
        let newList = []
        for (let i in list) {
          for (let obj of list[i].members) {
            if (obj.id === parseInt(window.sessionStorage.getItem('memberId'))) {
              newList.push(list[i])
            }
          }
        }
        console.log(newList)
        this.taskLists[index].tasks = newList
      } else if (this.taskLists[index].sortType === 3) {
        this.reList(index)
      } else if (this.taskLists[index].sortType === 4) {
        list.sort(function (a, b) {
          if (b.status > a.status) {
            return 1
          }
        })
      } else if (this.taskLists[index].sortType === 5) {
        list.sort(function (a, b) {
          if (a.status > b.status) {
            return 1
          }
        })
      } else if (this.taskLists[index].sortType === 6) {
        list.sort(function (a, b) {
          if (b.emergency > a.emergency) {
            return 1
          }
        })
      } else if (this.taskLists[index].sortType === 7) {
        list.sort(function (a, b) {
          if (a.emergency > b.emergency) {
            return 1
          }
        })
      }
      console.log(list)
    },
    /* 重新请求一个任务类型 */
    reList (index) {
      let self = this
      let param = {
        token: this.token,
        list_id: this.taskLists[index].id
      }
      this.post('/iov_apis/reList', param).then(function (res) {
        if (res.data.code === 200) {
          self.taskLists[index].tasks = res.data.data
        }
      })
    },
    addCommentChange (event) {
      console.log(event)
      if (this.add_comment !== '') {
        this.addCommentShow = true
      } else {
        this.addCommentShow = false
      }
    },
    saveComment () {
      let self = this
      let param = {
        token: this.token,
        comment: this.add_comment,
        at: this.atMember,
        task_id: this.taskDetail.id
      }
      this.post('/iov_apis/comment', param).then(function (res) {
        if (res.data.code === 200) {
          self.atMember = JSON.parse(JSON.stringify(self.groupMember))
          self.add_comment = ''
          self.addCommentShow = false
          self.taskLists[self.showingTaskIndex.index].tasks[self.showingTaskIndex.index1]['comment'] = res.data.data
          self.taskDetail['comment'] = res.data.data
          Notice.open({
            title: '通知',
            desc: '评论成功！ '
          })
        }
      })
    },
    atTa (index) {
      console.log(index)
      this.atMember[index].chosen = !this.atMember[index].chosen
    }
  },
  /* date filter */
  filters: {
    cutit: function (value) {
      if (!value) return ''
      return value.slice(0, 10)
    },
    cutname: function (value) {
      if (!value) return ''
      return value.slice(-1)
    },
    myTask: function (value) {
      return value.filter(function (item) {
        return item.members.indexOf(window.sessionStorage.getItem('memberId'))
      })
    }
  },
  watch: {
    /* 打开详情窗口时设置工时显示 状态显示 */
    taskDetail () {
      let oldTime = JSON.parse(JSON.stringify(this.taskDetail.workTime))
      let newTime = []
      if (this.haveRight(this.project.owner_id)) {
        // 项目拥有人可以看到所有人的工时
        this.taskDetailTime = this.taskDetail.workTime
      } else {
        for (let i in oldTime) {
          if (oldTime[i].member_id === parseInt(window.sessionStorage.getItem('memberId'))) {
            newTime.push(oldTime[i])
          }
        }
        this.taskDetailTime = newTime
      }
      this.taskDetailMyStatus = -1
      for (let i of this.taskDetail.members) {
        if (i.id === parseInt(window.sessionStorage.getItem('memberId'))) {
          this.taskDetailMyStatus = i.status
        }
      }
      console.log(this.taskDetailMyStatus)
    }
  }
}
</script>
<style scoped>
.pages-box >>> .ivu-checkbox-wrapper{
  font-size: 16px;
}
.tasks-lists{
  position: relative;
  display: inline-block;
  background-color: #fff;
  border-radius: 4px;
  padding: 6px;
  width: 320px;
  margin: 1vw 0 0.5vh 1vw;
  white-space: nowrap;
  vertical-align: top;
}
.task-list-title{
  position: relative;
  float: left;
  width: 100%;
  padding: 5px 10px;
  font-size: 16px;
  color: #666;
  text-align: left;
}
.task-list-title >>> .ivu-icon{
  float: right;
  font-size: 18px;
  color: #f16643;
  cursor: pointer;
  margin: 0 0 0 20px
}
.sort-box{
  position: relative;
  float: left;
  width: 94%;
  margin: 0 3%;
}
.sort-box >>> .ivu-select-selection{
  border: 0px;
  outline: none;
}
.task-list-bottom{
  position: relative;
  float: left;
  width: 100%;
  padding:8px 10px;
  padding: 10px 12px;
  font-size: 14px;
  color: #666;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.task-list-bottom >>> .ivu-icon-ios-plus-empty{
  margin-right:5px;
}
.tasks{
  position: relative;
  width: 94%;
  float: left;
  margin: 5px 3% 8px 3%;
  padding: 10px;
  box-shadow: 0px 1px 8px #e1e1e1;
  text-align: left;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  white-space: normal;
  overflow: hidden;
}
.tasks:hover{
  box-shadow: 0px 1px 12px #bbb;
}
.status{
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 6px;
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
.emergency{
  position: absolute;
  bottom: 5px;
  left: 15px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  font-size: 10px;
  line-height: 16px;
  text-align: center;
  color: #fff;
}
.emergency-hurry{
  background-color: #f16643;
}
.emergency-normal{
  background-color: #2db7f5;
}
.emergency-not{
  background-color: #19be6b
}
.is-new, .is-at{
  width: 18px;
  height: 18px;
  border-radius: 8px;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  color: #fff;
  background-color: #f16643;
  display: inline-block;
  margin-left: 4px;
}
.task-text{
  padding: 2px 5px;
  float: left;
}
.task-bottom{
  position: relative;
  float: left;
  width: 100%;
  padding:8px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: row nowrap;
}
.task-dead-line{
  font-size: 10px;
  color: #aaa;
  float: left;
  padding: 2px 5px;
  bottom: 0;
}
.members{
  position: relative;
  float: right;
  width: 60%;
  overflow: hidden;
}
.task-member{
  position: relative;
  float: right;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  overflow: hidden;
  line-height: 26px;
  text-align: center;
  margin: 5px 0 0 5px;
  color: #fff;
  font-size: 10px;
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
  width: 100%;
  float: left;
  color: #aaa;
  font-weight: 400;
  text-align: center;
  font-size: 10px;
}
.task-modal-tabs span{
  float: left;
  margin: 5px 10px 0 0;
  text-align: left;
}
.task-modal-des{
  position: relative;
  float: left;
  width: 100%;
  padding:18px 0px;
  margin: 10px 0;
  font-size: 14px;
  text-align:left;
  text-indent: 10px;
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
.task-modal-members-title >>> .ivu-icon{
  font-size: 20px;
  color: #aaa;
  margin-right: 6px;
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
  cursor: pointer;
  padding-bottom: 10px;
  border-bottom: #eee solid 1px;
}
.task-modal-my-status{
  text-align: left;
  position: relative;
  float: left;
  width: 100%;
  margin: 10px 10px 6px 10px;
  padding: 0 10px 10px 0;
  border-bottom: #eee solid 1px;
}
.task-modal-my-status-label{
  color: #aaa;
  display: inline-block;
}
.task-modal-my-status >>> .ivu-dropdown{
  float: right;
}
.task-modal-my-status >>> .ivu-dropdown a{
  color: #2db7f5
}
.add-time-box{
  text-align: left;
  position: relative;
  float: left;
  width: 100%;
  margin: 10px 10px 6px 10px;
  padding-bottom: 10px;
  border-bottom: #eee solid 1px;
}
.add-time-box-title{
  position: relative;
  float: left;
  text-align: left;
  color: #aaa;
  width: 100%;
  line-height: 30px;
  height: 40px;
}
.add-time-box-content{
  position: relative;
  width: 100%;
  float: left;
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
  min-height: 2vh;
  /* border:#eee solid 1px; */
}
.comments{
  position: relative;
  float: left;
  width: 100%;
  text-align: left;
  font-size: 12px;
  color: #666;
  margin: 0 0 20px 0;
  border-bottom: #ddd dotted 1px;
  padding: 0 0 10px 0;
}
.comment-at{
  position: relative;
  display: inline-block;
}
.comment-author{
  position: relative;
  float: left;
  width: 100%;
}
.comment-author span:first-child{
  float: left;
  font-size: 10px;
  color: #999;
}
.comment-author span:last-child{
  float: right;
}
.task-modal-comment-add{
  position: relative;
  float: left;
  width: 100%;
}
.edit-task{
  position: absolute;
  z-index: 99;
  top: 5px;
  right: 5px;
}
.tool-bar{
  position: relative;
  float: left;
  width: 100%;
  border-bottom:#eee solid 1px;
  margin:0 0 10px 0;
  padding: 10px 0;
}
.at-who{
  position: relative;
  float: left;
  background-color: #bbb;
  color: #fff;
  text-align: center;
  padding: 3px 8px;
  font-size: 12px;
  margin-right: 6px;
  border-radius: 12px;
  height: 24px;
  cursor: pointer;
}
.at-chosen{
  background-color: #19be6b;
}
</style>
