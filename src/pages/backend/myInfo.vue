<template>
    <div class="my-info">
      <div class="info-title"><span>账户信息</span></div>
      <div class="info-box">
        <Spin size="large" style="margin:0 50%;position:absolute;" v-show="loading"></Spin>
        <div id="avatar-box">
          <Upload action="/iov_apis/android/add" :before-upload="handleUpload"><img :src="info.avatar" alt=""></Upload>
          <div id="avatar-warning" v-show="file">
            <Button type="info" @click="submitAvatar">提交</Button>
          </div>
        </div>
        <div class="info-content">
          <p>账户名 ： {{info.nickname}}</p>
          <p>注册时间 ： {{info.created_at | cutit}}</p>
          <p>所属 ： {{info.bu ? info.bu : ''}}  {{info.department ? info.department : ''}}  {{info.team ? info.team : ''}}</p>
        </div>
      </div>
      <div class="form-content">
        <div class="label">登录名</div>
        <div class="form-content-mid">
          <span v-show="editIt !== 0">当前登录名为<b> {{info.name}} </b>。如需修改请点击右侧对应修改按键，请填入英文字母作为登录名。</span>
          <div v-show="editIt === 0">
            <Form ref="formValidate" :label-width="0">
              <FormItem label="" style="margin:12px 0;">
                <Input v-model="setData.name" placeholder="Enter login name" style="width: 300px"></Input>
                <Button type="success" @click="doEdit('name')">提交</Button>
              </FormItem>
            </Form>
          </div>
        </div>
        <div class="form-content-action">
          <span class="seted"><Icon type="ios-checkmark-outline" size="16"></Icon>已设置</span>
          <span @click="edit(0)">修改</span>
        </div>
      </div>
      <div class="form-content">
        <div class="label">登录密码</div>
        <div class="form-content-mid">
          <span v-show="editIt !== 1">如需修改密码请点击右侧对应修改按键，初始密码为123456，强烈建议使用此功能替换初始密码。</span>
          <div v-show="editIt === 1">
            <Form ref="formValidate" :label-width="0">
              <FormItem label="" style="margin:12px 0;">
                <Input v-model="setData.password" placeholder="Enter login password" style="width: 300px"></Input>
                <Button type="success" @click="doEdit('password')">提交</Button>
              </FormItem>
            </Form>
          </div>
        </div>
        <div class="form-content-action">
          <span class="seted"><Icon type="ios-checkmark-outline" size="16"></Icon>已设置</span>
          <span @click="edit(1)">修改</span>
        </div>
      </div>
      <div class="form-content">
        <div class="label">所属部门</div>
        <div class="form-content-mid">
          <span v-show="editIt !== 2">如需修改请点击右侧对应修改按键，初始所属为空，强烈建议使用此功能设置所属部门，方便工作设置。</span>
          <div v-show="editIt === 2">
            <Form ref="formValidate" :label-width="0">
              <FormItem label="" style="margin:12px 0;">
                <Select style="width: 20%;margin-right:20px;" @on-change="chooseBu">
                  <Option v-for="(item, index) in bu" :value="index" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select style="width: 20%;margin-right:20px;" @on-change="chooseDepartment">
                  <Option v-for="(item, index) in departments" :value="index" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select style="width: 20%;margin-right:20px;" @on-change="chooseTeam">
                  <Option v-for="(item, index) in teams" :value="index" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Button type="success" @click="doEdit('belongsto')">提交</Button>
              </FormItem>
            </Form>
          </div>
        </div>
        <div class="form-content-action">
          <span class="seted" v-show="info.team"><Icon type="ios-checkmark-outline" size="16"></Icon>已设置</span>
          <span class="unseted" v-show="!info.team"><Icon type="ios-help-outline" size="16"></Icon>未设置</span>
          <span @click="edit(2)">修改</span>
        </div>
      </div>
    </div>
</template>
<script>
import {Message, Notice} from 'iview'
import Validate from '@/utils/validator'
var allDepartments = []
var allTeams = []
export default {
  data () {
    return {
      loading: true,
      token: window.sessionStorage.getItem('token'),
      info: {},
      bu: [],
      departments: [],
      teams: [],
      members: [],
      file: '',
      editIt: -1,
      setData: {
        name: '',
        password: '',
        bu: '',
        department: '',
        team: ''
      },
      action: {
        name: function (data, token) {
          let vali = new Validate()
          vali.add(data.name, [{method: 'matchEmpty', msg: '登录名不能为空'}])
          let result = vali.start()
          if (!result) {
            var params = {
              token: token,
              name: data.name
            }
            var apiUrl = '/iov_apis/my_info_edit/name'
            return {
              params: params,
              apiUrl: apiUrl
            }
          } else {
            Message.info('提交失败！' + result)
          }
        },
        password: function (data, token) {
          let vali = new Validate()
          vali.add(data.password, [{method: 'matchEmpty', msg: '密码不能为空'}])
          let result = vali.start()
          if (!result) {
            var params = {
              token: token,
              password: data.password
            }
            var apiUrl = '/iov_apis/my_info_edit/password'
            return {
              params: params,
              apiUrl: apiUrl
            }
          } else {
            Message.info('提交失败！' + result)
          }
        },
        belongsto: function (data, token) {
          let vali = new Validate()
          vali.add(data.bu, [{method: 'matchEmpty', msg: 'BU不能为空'}])
          vali.add(data.department, [{method: 'matchEmpty', msg: '部门不能为空'}])
          vali.add(data.team, [{method: 'matchEmpty', msg: '组别不能为空'}])
          let result = vali.start()
          if (!result) {
            var params = {
              token: token,
              bu: data.bu,
              department: data.department,
              team: data.team
            }
            var apiUrl = '/iov_apis/my_info_edit/belongsto'
            return {
              params: params,
              apiUrl: apiUrl
            }
          } else {
            Message.info('提交失败！' + result)
            return false
          }
        }
      }
    }
  },
  methods: {
    edit (index) {
      this.editIt = index
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
      this.setData.bu = id
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
      this.setData.department = id
    },
    chooseTeam  (event) {
      let id = this.teams[event].id
      console.log(id)
      this.setData.team = id
    },
    doEdit (theKey) {
      let self = this
      let result = this.action[theKey](this.setData, this.token)
      if (result) {
        this.post(result.apiUrl, result.params).then(function (res) {
          if (res.data.code === 200) {
            Notice.open({
              title: '通知',
              desc: '修改成功！ '
            })
            /* 刷新 */
            self.reloadList()
            self.editIt = -1
            self.bu = []
            self.department = []
            self.team = []
            self.setData = {
              name: '',
              password: '',
              bu: '',
              department: '',
              team: ''
            }
          } else {
            Message.info('修改失败！请稍候再试')
          }
        }).catch(function (ret) {
          Message.info('修改失败！请稍候再试')
        })
      }
    },
    handleUpload (file) {
      this.file = file
      return false
    },
    submitAvatar () {
      // 验证提交数据
      let vali = new Validate()
      vali.add(this.file, [{method: 'matchEmpty', msg: '文件不能为空'}])
      let result = vali.start()
      // 如果没有错误返回则提交
      if (!result) {
        let param = new FormData()
        let self = this
        // 创建form对象
        param.append('file', this.file, this.file.name)
        param.append('token', this.token)
        this.post('/iov_apis/my_info_edit/avatar', param).then(function (res) {
          console.log(res)
          if (res.data.code === 200) {
            Message.info('上传成功！')
            self.reloadList()
            self.file = ''
          } else {
            Message.info('上传失败！' + res.data.msg)
          }
        }).catch(function (ret) {
          Message.info('上传失败！' + ret)
        })
      } else {
        // 验证失败
        Message.info('提交失败！' + result)
      }
    },
    reloadList () {
      let self = this
      this.loading = true
      let postData = {
        token: window.sessionStorage.getItem('token')
      }
      this.post('/iov_apis/my_info', postData).then(function (res) {
        self.info = res.data.data
        self.loading = false
        self.bu = res.data.bu
        allDepartments = res.data.departments
        allTeams = res.data.teams
      })
    }
  },
  mounted () {
    this.reloadList()
  },
  filters: {
    cutit: function (value) {
      if (!value) return ''
      return value.slice(0, 10)
    }
  }
}
</script>
<style>
.my-info{
  background-color: #fff;
  height: 94vh;
  min-height: 600px;
  width: 60%;
  float: left;
  padding: 0 15px;
  margin: 0 20%;
  overflow: auto;
}
.info-title{
  position: relative;
  float: left;
  width: 100%;
  padding: 15px 15px;
  color: #212121;
  font-size: 16px;
  border-bottom: #eee solid 1px;
  text-align: left;
}
.info-title span{
  border-left: #22d7bb solid 3px;
  padding-left: 10px;
  height: 25px;
}
.info-box{
  padding: 10px 15px 30px 15px;
  border-bottom: #eee solid 1px;
  float: left;
  width:100%;
}
#avatar-box{
  width: 11%;
  text-align: center;
  float: left;
}
#avatar-warning{
  font-size: 10px;
  color: #2d8cf0;
  cursor: pointer;
}
#avatar-box img{
  width: 80%;
  float: left;
  margin: 10px 10%;
  border-radius: 15px;
  box-shadow: 2px 2px 2px #ddd;
  cursor: pointer;
}
.info-content{
  width: 80%;
  float: left;
  color: #212121;
  font-size: 12px;
  text-align: left;
  line-height: 24px;
  padding: 35px;
}
.form-content{
  position: relative;
  float: left;
  border-bottom: #eee dashed 1px;
  width: 100%;
  padding: 40px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.label{
  position: relative;
  float: left;
  width: 11%;
  text-align: center;
  color: #212121;
  font-weight: 600;
}
.form-content-mid{
  position: relative;
  float: left;
  width: 70%;
  height: 100%;
  text-align: left;
  padding-left: 35px;
}
.form-content-mid span b{
  font-size: 14px;
}
.form-content-action{
  position: relative;
  float: left;
  width: 20%;
  text-align: right;
}
.form-content-action span{
  color: #3e76f6;
}
.form-content-action .seted{
  color: #19be6b;
  border-right: #19be6b solid 1px;
  padding-right: 7px;
  margin-right: 5px;
}
.form-content-action .unseted{
  color: #f90;
  border-right: #f90 solid 1px;
  padding-right: 7px;
  margin-right: 5px;
}
.form-content-action .ivu-icon{
  margin-right: 3px;
}
.form-content-action span:last-child{
  cursor: pointer;
}
</style>
