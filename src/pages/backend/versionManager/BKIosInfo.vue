<template>
    <div class="box-ios-info">
      <h1>ios
        <router-link to="/bristlegrass/iosadd"><Button type="info" class="add-btn">添加</Button></router-link>
      </h1>
      <Row>
        <Col span="24">
          <Card v-for="(item, index) in dataInfo" v-bind:key="item.id">
            <div class="lastest" v-if="index === 0">
              <img src="@/assets/img/new.png" alt="">
            </div>
            <p slot="title">
              {{item.name}}  {{item.version}}
            </p>
            <a href="#" slot="extra" @click.prevent="deleteIt(index)" style="color:#f00">
              Delete
            </a>
            <ul class="version-ul">
              <li>
                <div class="version_label">Time</div>
                <div class="version_content">{{item.created_at}}</div>
              </li>
              <li>
                <div class="version_label">Build_version</div>
                <div class="version_content">{{item.build_version}}</div>
              </li>
              <li>
                <div class="version_label">By</div>
                <div class="version_content">{{item.uploader}}</div>
              </li>
              <li>
                <div class="version_label">Type</div>
                <div class="version_content">iOS</div>
              </li>
              <li>
                <div class="version_label">Addr</div>
                <div class="version_content"><a :href="item.savePath" target="_blank">下载</a></div>
              </li>
            </ul>
          </Card>
          <Spin size="large" style="margin:0 50%;" v-show="loading"></Spin>
          <Modal v-model="modal0" width="360">
            <p slot="header" style="color:#f60;text-align:center">
              <Icon type="ios-information-circle"></Icon>
              <span>Delete confirmation</span>
            </p>
            <div style="text-align:center">
              <p>Are you sure you want to delete {{currentDeleteName}} {{currentDeleteVersion}}</p>
            </div>
            <div slot="footer">
              <Button type="error" size="large" long  @click="doDelete">Delete</Button>
            </div>
          </Modal>
        </Col>
      </Row>
    </div>
</template>
<script>
import {Notice} from 'iview'
export default {
  data () {
    return {
      loading: true,
      height: 200,
      dataInfo: [],
      modal0: false,
      currentDelete: -1,
      currentDeleteName: '',
      currentDeleteVersion: '',
      token: window.sessionStorage.getItem('token')
    }
  },
  methods: {
    download (index) {
      window.open(this.dataInfo[index].savePath)
    },
    deleteIt (index) {
      console.log(index)
      this.modal0 = true
      this.currentDelete = index
      this.currentDeleteName = this.dataInfo[index].name
      this.currentDeleteVersion = this.dataInfo[index].version
    },
    doDelete () {
      this.modal0 = false
      let self = this
      let postData = {
        id: this.dataInfo[this.currentDelete].id,
        token: this.token
      }
      this.loading = true
      this.post('/iov_apis/deleteVersion', postData).then(function (res) {
        self.loading = false
        if (res.data.code === 200) {
          Notice.open({
            title: '通知',
            desc: '删除成功！ '
          })
          self.dataInfo.splice(self.currentDelete, 1)
        } else {
          Notice.open({
            title: '通知',
            desc: '删除失败！ '
          })
        }
      }).catch(function (ret) {
      })
    }
  },
  mounted () {
    let self = this
    this.get('/iov_apis/ios/versions', {token: this.token}).then(function (res) {
      console.log(res.data)
      self.loading = false
      self.dataInfo = res.data
    })
  }
}
</script>
<style>
.box-ios-info{
  text-align: left;
  padding: 20px 5vw;
}
.box-ios-info .add-btn{
  float: right;
}
.box-ios-info h1{
  border-bottom: #eee solid 1px;
  padding-bottom: 10px;
  font-size: 18px;
}
.box-ios-info .ivu-card{
  float: left;
  width: 15.5vw;
  margin: 30px 2vw 0px 0;
}
.ivu-card-body{
  float: left;
  width: 100%;
}
.version-ul li{
  margin: 4px 0;
  float: left;
  width: 100%;
}
.version_label{
  width: 30%;
  float: left;
}
.version_content{
  width: 70%;
  float: left;
  text-align: right;
  overflow: hidden;
}
.lastest{
  position: absolute;
  left: -38px;
  top: 0px;
  width: 40px;
  height: 40px;
  z-index: 99;
}
.lastest img{
  position: relative;
  float: left;
  width: 100%;
}
</style>
