<template>
  <div class="iov-header" v-bind:class="headerTheme">
    <router-link to="/bristlegrass/">
      <div class="title" :class="titleTheme">
        <img src="@/assets/img/icon.png" alt="">
        {{ msg }}
      </div>
    </router-link>
    <Menu mode="horizontal" :theme="theme1">
      <Submenu name="0">
        <template slot="title">
          <Icon type="ios-paper-outline"></Icon>
          项目管理
        </template>
        <router-link to="/bristlegrass/projects">
          <MenuItem name="0-1">我的项目</MenuItem>
        </router-link>
        <router-link to="/bristlegrass/dataVision">
          <MenuItem name="0-2">数据统计</MenuItem>
        </router-link>
      </Submenu>
      <Submenu name="1">
        <template slot="title">
          <Icon type="ios-photos-outline" />
          版本管理
        </template>
        <router-link to="/bristlegrass/aninfo">
          <MenuItem name="1-1">Android</MenuItem>
        </router-link>
        <router-link to="/bristlegrass/iosinfo">
          <MenuItem name="1-2">iOS</MenuItem>
        </router-link>
      </Submenu>
      <MenuItem name="3">
        <Icon type="ios-construct" />
        技术博客
      </MenuItem>
    </Menu>
    <div id="my-name">
      <img id="avatar" :src="avatar" alt="">
      <Dropdown trigger="click" style="margin-left: 20px" @on-click="chooseIt">
        <a href="javascript:void(0)">
          {{name}}
        </a>
        <DropdownMenu slot="list">
          <DropdownItem name="1">账号管理</DropdownItem>
          <DropdownItem name="2">退出账号</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <!-- <div id="theme-switch" :class="changeTheme" @click="changeThemebtn"></div> -->
  </div>
</template>

<script>
export default {
  name: 'IOVHeader',
  data () {
    return {
      msg: '德赛西威 · 白银',
      theme: 'dark',
      theme1: 'dark',
      name: window.sessionStorage.getItem('userName'),
      avatar: window.sessionStorage.getItem('avatar')
    }
  },
  methods: {
    logout: function () {
      window.sessionStorage.setItem('memberId', '')
      window.sessionStorage.setItem('token', '')
      window.sessionStorage.setItem('userName', '')
      window.sessionStorage.setItem('avatar', '')
      this.$router.push('/login')
    },
    changeThemebtn () {
      this.theme = this.theme === 'dark' ? 'green' : 'dark'
      this.theme1 = this.theme === 'dark' ? 'dark' : 'light'
    },
    chooseIt (event) {
      console.log(event)
      if (event === '1') {
        this.$router.push('/bristlegrass/my')
      } else {
        this.logout()
      }
    }
  },
  computed: {
    headerTheme () {
      return {
        'iov-header-green': this.theme === 'green',
        'iov-header-black': this.theme === 'dark'
      }
    },
    titleTheme () {
      return {
        'iov-title-green': this.theme === 'green',
        'iov-title-black': this.theme === 'dark'
      }
    },
    changeTheme () {
      return {
        'iov-switch-black': this.theme === 'green',
        'iov-switch-green': this.theme === 'dark'
      }
    }
  },
  filters: {
    cutname: function (value) {
      if (!value) return ''
      return value.slice(-1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.iov-header{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  float: left;
  color: #aaa;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  height: 50px;
  line-height: 50px;
}
.iov-header-green{
  background-color: #22d7bb;
}
.iov-header-black{
  box-shadow: #999 0px 3px 4px;
  background-color: #212121;
}
.iov-title-green{
  color: #212121;
}
.iov-title-black{
  color: #aaa;
  border-right: #333 solid 1px;
}
.iov-switch-green{
  background-color: #22d7bb;
  cursor: pointer;
}
.iov-switch-black{
  background-color: #212121;
  cursor: pointer;
}
.iov-header .ivu-menu-dark, .iov-header .ivu-menu-light{
  float: left;
  margin-left: 0px;
  background: none;
}
.iov-header .ivu-menu-horizontal{
  height: 50px;
  line-height: 50px;
}
.iov-header .ivu-menu-light.ivu-menu-horizontal .ivu-menu-item-active{
  color: #212121;
  border-bottom: 0px;
}
.iov-header .ivu-menu-horizontal.ivu-menu-light:after{
  height: 0px;
}
.title{
  padding-left: 16px;
  max-width: 50%;
  min-width: 12.5vw;
  float: left;
  height: 33.2px;
  line-height: 33.2px;
  min-height: 33.2px;
  margin: 8px 0 0 0;
  padding-right: 30px;
}
.title img{
  position: relative;
  float: left;
  width: 3vh;
  height: 3vh;
  margin:4px 10px 0 0;
}
#logout{
  float: right;
  font-size: 16px;
  color: #666;
  padding-right: 16px;
  z-index: 99;
  display: block;
  cursor: pointer;
}
#theme-switch{
  float: right;
  width: 3vh;
  height: 3vh;
  margin: 1.5vh;
  border-radius: 1.5vh;
}
#my-name{
  float: right;
  font-size: 16px;
  height: 50px;
  min-height: 50px;
  line-height: 50px;
  color: #fff;
  margin-right: 1vw;
  text-align: right;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
#my-name a{
  color: #ddd;
}
#my-name .ivu-dropdown-item{
  text-align: center
}
#avatar{
  width: 30px;height: 30px;border-radius: 15px;
}
</style>
