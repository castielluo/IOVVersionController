<template>
  <div class="pages-box">
    <div class="pages-bar">
      <div class="pages-title">
        <Icon type="grid" size="22" style="margin-right:10px;color:#22d7bb;"></Icon>项目简介
      </div>
      <Button type="info" class="add-btn" @click="deleteProject" v-show="haveRight(project.owner_id)">删除项目</Button>
    </div>
    <div class="pages-content-box">
      <Spin size="large" style="margin:0 50%;position:absolute;z-index:99" v-show="loading"></Spin>
      <div id="project-info-box">
        <div class="data-box-title">
            项目名称
        </div>
        <h2>{{project.name}}</h2>
        <span>{{project.created_at}}</span>
      </div>
      <div id="members-box">
        <div class="data-box-title">
            项目成员
        </div>
        <div class="member" v-for="(item, index) in groupMembers" :key="index">
          <img :src="item.avatar" alt="">
          <p>{{item.nickname}}</p>
          <p>{{item.bu_name}} {{item.department_name}} {{item.team_name}}</p>
        </div>
      </div>
    </div>
    <Modal v-model="modal0" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>Delete confirmation</span>
      </p>
      <div style="text-align:center">
        <p>删除项目将删除项目下所有数据，包括任务类型，任务，成员工时等，仍然确定要删除吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long  @click="doDelete">Delete</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {Notice} from 'iview'
export default {
  data () {
    return {
      modal0: false,
      project: {},
      token: window.sessionStorage.getItem('token'),
      groupMembers: [],
      loading: true
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
        self.groupMembers = res.data.members
        self.loading = false
      } else {
      }
    })
  },
  methods: {
    deleteProject () {
      this.modal0 = true
    },
    doDelete () {
      this.modal0 = false
      let self = this
      let postData = {
        id: this.project.id,
        token: this.token
      }
      this.post('/iov_apis/project_delete', postData).then(function (res) {
        self.loading = false
        if (res.data.code === 200) {
          Notice.open({
            title: '通知',
            desc: '删除成功！ '
          })
          // 跳转到外部页面 此语句失效
          self.$router.push('/bristlegrass/projects')
        } else {
          Notice.open({
            title: '通知',
            desc: '删除失败！ ' + res.data.msg
          })
        }
      }).catch(function (ret) {
      })
    }
  }
}
</script>
<style>
#project-info-box, #members-box{
  position: relative;
  float: left;
  width: 98%;
  margin: 10px 1% 0 1%;
  background-color: #fff;
  padding: 20px;
  text-align: left;
}
#project-info-box h2{
  color: #666;
  font-size: 16px;
  font-weight: 400;
  float: left;
  margin-top: 10px;
}
#project-info-box span{
  float: right;
  color: #aaa;
  margin-top: 10px;
}
.member{
  position: relative;
  float: left;
  margin: 0 10px 0 0;
  width: 5vw;
}
.member img{
  position: relative;
  float: left;
  width: 4vw;
  margin: 0 0.5vw 10px 0.5vw;
  border-radius: 50%;
  box-shadow: 3px 3px 3px #ccc;
}
.member p{
  position: relative;
  float: left;
  width: 5vw;
  text-align: center;
  font-size: 12px;
  color: #666;
}
</style>
