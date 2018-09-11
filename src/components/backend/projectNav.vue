<template>
    <div class="project-nav">
      <div class="switch-project">
        <router-link to="/bristlegrass/projects"><Icon type="ios-arrow-back" size="20" style="float:left;margin-top:5px;cursor:pointer;"/></router-link>
        <span style="color:#212121;font-size:16px;font-weight:500;">{{projectName}}</span>
        <div id="switch">
          <Dropdown trigger="click" @on-click="switchIt">
            <a href="javascript:void(0)">
              <Icon type="ios-loop-strong"></Icon>
            </a>
            <DropdownMenu slot="list">
              <DropdownItem v-for="(item, index) in projects" :key="item.id" :name="index">{{item.name}}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div class="nav">
        <Menu :theme="theme2" :open-names="opened" :active-name="actived" style="width:100%" @on-select="Nav" @on-open-change="openIt">
          <Submenu name="1">
            <template slot="title">
              工作台
            </template>
            <!-- <router-link :to="{path: '/bristlegrass/project',query: {id: this.$route.query.id, name: this.$route.query.name}}">
              <MenuItem name="1-1">我的任务</MenuItem>
            </router-link> -->
            <router-link :to="{path: '/bristlegrass/project',query: {id: this.$route.query.id, name: this.$route.query.name}}">
              <MenuItem name="1-1">项目任务</MenuItem>
            </router-link>
          </Submenu>
          <Submenu name="2">
            <template slot="title">
              项目详情
            </template>
            <router-link :to="{path: '/bristlegrass/project/theProject',query: {id: this.$route.query.id, name: this.$route.query.name}}">
              <MenuItem name="2-1">项目简介</MenuItem>
            </router-link>
            <router-link :to="{path: '/bristlegrass/project/file',query: {id: this.$route.query.id, name: this.$route.query.name}}">
              <MenuItem name="2-2">项目文档</MenuItem>
            </router-link>
          </Submenu>
          <Submenu name="3">
            <template slot="title">
              统计分析
            </template>
            <router-link :to="{path: '/bristlegrass/project/dataintro',query: {id: this.$route.query.id, name: this.$route.query.name}}">
              <MenuItem name="3-1">项目概况</MenuItem>
            </router-link>
            <!-- <MenuItem name="3-2">成员进度</MenuItem>
            <MenuItem name="3-3">进度统计</MenuItem> -->
            <router-link :to="{path: '/bristlegrass/project/WorkTime',query: {id: this.$route.query.id, name: this.$route.query.name}}">
              <MenuItem name="3-2">工时统计</MenuItem>
            </router-link>
          </Submenu>
        </Menu>
      </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
      projectName: this.$route.query.name,
      projects: [],
      theme2: 'light',
      actived: window.sessionStorage.getItem('project_nav_avtived' + this.$route.query.id) ? window.sessionStorage.getItem('project_nav_avtived' + this.$route.query.id) : '1-1',
      opened: window.sessionStorage.getItem('project_nav_opened' + this.$route.query.id) ? window.sessionStorage.getItem('project_nav_opened' + this.$route.query.id).split(',') : ['1']
    }
  },
  mounted () {
    let self = this
    let postData = {
      token: window.sessionStorage.getItem('token')
    }
    this.post('/iov_apis/myprojects', postData).then(function (res) {
      console.log(res.data)
      self.projects = res.data.data
    })
    console.log(this.$route.params)
    if (this.$route.params.jump === 1) {
      this.actived = '1-1'
      this.opened = ['1']
    }
  },
  methods: {
    Nav (event) {
      console.log(event)
      this.actived = event
      /* 从外层点进来会使用该项目的菜单 */
      window.sessionStorage.setItem('project_nav_avtived' + this.$route.query.id, event)
    },
    openIt (event) {
      console.log(event)
      this.opened = event
      window.sessionStorage.setItem('project_nav_opened' + this.$route.query.id, event)
    },
    switchIt (event) {
      console.log(this.$route.name)
      this.projectName = this.projects[event].name
      this.$router.push({name: this.$route.name, query: {id: this.projects[event].id, name: this.projects[event].name}})
    }
  }
}
</script>
<style>
.project-nav{
  position: relative;
  float: left;
  width: 100%;
  background-color: #fff;
  border-right: #ddd solid 1px;
  min-height: 94vh;
}
.project-nav .nav{
  float: left;
  width: 100%;
}
.project-nav .ivu-menu-vertical.ivu-menu-light:after{
    width: 0;
}
.project-nav .ivu-menu{
  z-index: 8;
}
.project-nav .project-nav .ivu-menu-light {
  background: none;
}
.project-nav .ivu-menu-light.ivu-menu-vertical .ivu-menu-item{
  color: #212121;
}
.project-nav .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
  color: #22d7bb;
  border-right: 2px solid #22d7bb;
}
.project-nav .ivu-menu-vertical .ivu-menu-submenu-title-icon{
  color: rgb(34, 215, 187);
  font-weight: bold;
}
.switch-project{
  position: relative;
  float: left;
  width: 100%;
  padding: 10px 20px;
  border-bottom: #eee solid 1px;
  margin-bottom: 26px;
  font-size: 14px;
  height: 5.2vh;
  min-height: 50px;
  line-height: 30px;
}
#switch{
  position: relative;
  float: right;
}
</style>
