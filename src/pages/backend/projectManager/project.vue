<template>
    <div class="project-index">
      <h1>Projects
        <Button type="info" class="add-btn" @click="modal = true">添加</Button>
      </h1>
      <Row>
        <Col span="24">
          <Spin size="large" style="margin:0 50%;position:absolute;" v-show="loading"></Spin>
          <div class="projects" v-for="(item, index) in projects" v-bind:key="item.id" :style="{background:item.color}" @click="toPro(index)">
            <div class="projectsInner">{{item.name}}</div>
            <div class="has-new" v-show="item.hasNew === 1">未读任务</div>
            <div class="my-own" v-if="item.owner_id == nowUser">
              <Icon type="android-contact"></Icon>
            </div>
          </div>
        </Col>
      </Row>
      <!-- 添加任务项目modal -->
     <Mymodal title="添加项目" submitBtn="true" @modalConfirm="addProject" @modalCancel="modal = false" v-show="modal">
      <Form ref="formValidate" :label-width="80">
        <FormItem label="项目名称" style="margin:12px 0;">
          <Input placeholder="Enter list name" v-model="newPro.name"></Input>
        </FormItem>
        <FormItem label="项目成员" style="margin:12px 0;">
          <Select style="width: 20%;margin-right:2%;" @on-change="chooseBu">
            <Option v-for="(item, index) in bu" :value="index" :key="item.id">{{ item.name }}</Option>
          </Select>
          <Select style="width: 20%;margin-right:2%;" @on-change="chooseDepartment">
            <Option v-for="(item, index) in departments" :value="index" :key="item.id">{{ item.name }}</Option>
          </Select>
          <Select style="width: 20%;margin-right:2%;" @on-change="chooseTeam">
            <Option v-for="(item, index) in teams" :value="index" :key="item.id">{{ item.name }}</Option>
          </Select>
          <div class="members-box" v-show="members[0]">
            <div class="option-members" v-for="(item, index) in members" :key="item.id" @click="chooseMember(index)">
              {{item.nickname}}
            </div>
          </div>
        </FormItem>
        <FormItem label="" style="margin:0;">
          </FormItem>
        <FormItem label="" style="margin:0;">
          <div class="project-members" v-for="(item, index) in chosenMembers" :key="item.id" @click="cancel(index)">
            {{item.nickname}}
            <Icon type="close" size="10" style="cursor:pointer"/>
          </div>
        </FormItem>
      </Form>
     </Mymodal>
    </div>
</template>
<script>
import {Message, Notice} from 'iview'
import Validate from '../../../utils/validator'
var allDepartments = []
var allTeams = []
var allMembers = []
export default {
  data () {
    return {
      loading: true,
      token: window.sessionStorage.getItem('token'),
      nowUser: window.sessionStorage.getItem('memberId'),
      projects: [],
      modal: false,
      newPro: {
        name: '',
        members: []
      },
      modal1: false,
      currentDelete: '',
      currentDeleteName: '',
      bu: [],
      departments: [],
      teams: [],
      members: [],
      chosenMembers: []
    }
  },
  mounted () {
    this.reloadList()
  },
  methods: {
    toPro (index) {
      console.log(index)
      this.$router.push({name: 'allTasks', params: {jump: 1}, query: {id: this.projects[index].id, name: this.projects[index].name}})
    },
    addProject () {
      let self = this
      console.log(this.chosenMembers)
      let postMember = []
      for (let i of this.chosenMembers) {
        postMember.push(i.id)
      }
      let vali = new Validate()
      vali.add(this.newPro.name, [{method: 'matchEmpty', msg: '项目名称不能为空'}])
      let result = vali.start()
      // 如果没有错误返回则提交
      if (!result) {
        let postData = {
          name: this.newPro.name,
          members: postMember,
          token: this.token
        }
        this.post('/iov_apis/project_add', postData).then(function (res) {
          console.log(res)
          if (res.data.code === 200) {
            Notice.open({
              title: '通知',
              desc: '添加成功！ '
            })
            self.modal = false
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
    reloadList () {
      let self = this
      let postData = {
        token: this.token
      }
      this.post('/iov_apis/myprojects', postData).then(function (res) {
        console.log(res.data)
        self.loading = false
        self.projects = res.data.data
        allMembers = res.data.members
        self.bu = res.data.bu
        allDepartments = res.data.departments
        allTeams = res.data.teams
      })
    },
    chooseBu (event) {
      let id = this.bu[event].id
      console.log(id)
      let departments = []
      for (let i of allDepartments) {
        if (i.belongsto === id) {
          departments.push(i)
        }
      }
      this.departments = departments
    },
    chooseDepartment (event) {
      let id = this.departments[event].id
      console.log(id)
      let teams = []
      for (let i of allTeams) {
        if (i.belongsto === id) {
          teams.push(i)
        }
      }
      this.teams = teams
    },
    chooseTeam  (event) {
      let id = this.teams[event].id
      console.log(id)
      let members = []
      for (let i of allMembers) {
        if (i.team === id) {
          members.push(i)
        }
      }
      this.members = members
    },
    chooseMember (index) {
      /* console.log(this.members)
      console.log(index) */
      for (let i of this.chosenMembers) {
        if (i.id === this.members[index].id) {
          Message.info('已在列表中！')
          return
        }
      }
      let memberTemp = JSON.parse(JSON.stringify(this.members[index]))
      this.chosenMembers.push(memberTemp)
    },
    cancel (index) {
      this.chosenMembers.splice(index, 1)
    }
  }
}
</script>
<style scoped>
.project-index{
  text-align: left;
  padding: 20px 5vw;
}
.project-index h1{
  border-bottom: #eee solid 1px;
  margin-bottom: 20px;
  padding-bottom: 16px;
}
.project-index .add-btn{
  float: right;
}
.projects{
    position: relative;
    float: left;
    width: 5vw;
    margin: 10px 1vw 10px 0;
    height: 5vw;
    border-radius: 6px;
    text-align: center;
    line-height: 5vw;
}
.projectsInner{
    position: relative;
    float: left;
    width: 5vw;
    height: 5vw;
    border-radius: 6px;
    text-align: center;
    line-height: 5vw;
    color: #fff;
    font-size: 0.3rem;
    cursor: pointer;
}
.projects >>> .ivu-select-dropdown{
  margin-top: 5vw;
}
.projects >>> .ivu-dropdown-item{
  padding: 0;
}
.projects >>> .ivu-dropdown-item span{
  padding: 7px 16px;
}
.members-box{
  position: relative;
  width: 100%;
  float: left;
  padding: 2px 4px;
  border: #dddee1 solid 1px;
  border-radius: 6px;
  margin-top: 10px;
  background-color: #fff;
}
.option-members{
  display: block;
  float: left;
  padding: 0px 10px;
  border-radius: 3px;
  box-shadow: 0px 0px 1px #ccc;
  margin-right: 6px;
  cursor: pointer;
  font-size: 12px;
  height: 28px;
  color: #777;
  line-height: 28px;
}
.project-members{
  display: block;
  float: left;
  padding: 0px 10px;
  margin-right: 6px;
  cursor: pointer;
  font-size: 14px;
  height: 32px;
  color: #555;
  line-height: 32px;
}
.my-own{
  position: absolute;
  right: 6px;
  bottom: 6px;
  width: 14px;
  height: 14px;
  color: #fff;
  font-size: 18px;
}
.my-own >>> .ivu-icon{
  line-height: 14px;
  float: left;
}
.has-new{
  position: absolute;
  right: -6px;
  top: -6px;
  height: 20px;
  font-size: 10px;
  line-height: 20px;
  color: #fff;
  border-radius: 10px;
  background-color: #f16643;
  padding: 0 8px;
}
</style>
