<template>
  <div class="login">
    <Row>
        <Col :xs="{ span: 16, offset: 4 }" :sm="{ span: 12, offset: 6 }" :md="{ span: 6, offset: 9 }" :lg="{ span: 4, offset: 10 }">
          <img src="@/assets/img/logintitle.png" alt="" id="title">
        </Col>
        <Col :xs="{ span: 20, offset: 2 }" :sm="{ span: 12, offset: 6 }" :md="{ span: 6, offset: 9 }" :lg="{ span: 6, offset: 9 }">
          <div class="login-box">
            <div id="warning">{{warning}}</div>
            <Form ref="formCustom">
              <Spin size="large" style="margin:0 46%;position:absolute;z-index:999;bottom:0" v-show="loading"></Spin>
              <Input v-model="name" placeholder="usrname" style="width:60%;"></Input>
              <Input type="password" v-model="password" placeholder="password" style="width:60%;" @on-keyup.enter="handleSubmit"></Input>
            </Form>
          </div>
          <Button type="primary" id="submitbtn" long @click="handleSubmit">SUBMIT</Button>
          <h5>@copyright desaySV</h5>
        </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      name: '',
      password: '',
      warning: '',
      loading: false
    }
  },
  methods: {
    handleSubmit () {
      if ((this.name === '') || (this.password === '')) {
        this.warning = 'input should not be empty'
      } else {
        var self = this
        this.loading = true
        var postData = {name: this.name, password: this.password}
        this.post('/iov_apis/login', postData).then(function (res) {
          console.log(res)
          self.loading = false
          if (res.data.code === 200) {
            window.sessionStorage.setItem('memberId', res.data.id)
            window.sessionStorage.setItem('token', res.data.token)
            window.sessionStorage.setItem('userName', res.data.nickname)
            window.sessionStorage.setItem('avatar', res.data.avatar)
            self.$router.push('/bristlegrass')
          } else {
            self.warning = 'fail! Please check your input'
          }
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.login{
  background-image: url('~@/assets/img/loginbg.jpg');
  background-size: 100% 100%;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
.login #title{
  width: 100%;
  margin: 170px 0 0 0;
}
.login-box{
  position: relative;
  width: 100%;
  margin: 25px 0 20px 0;
  min-height: 14vh;
  border-radius: 6px;
}
.login-box .ivu-input-type .ivu-input{
  height: 38px;
  outline: none;
}
.login-box .ivu-input-wrapper{
  margin: 10px 0;
}
.login .ivu-btn-long{
  width: 60%;
  height: 35px;
  margin: 0 20%;
}
.login h5{
  color: #bbb;
  margin: 30px 0;
}
#warning{
  font-size: 14px;
  color: red;
  height: 14px;
}
</style>
