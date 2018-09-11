<template>
    <div class="box-an-add">
      <h1>上传新版本</h1>
      <div class="label">名称：</div>
      <Input v-model="name" placeholder="" style="width: 40%"></Input><br />
      <div class="label">文件链接：</div>
      <Input v-model="savePath" placeholder="" style="width: 40%"></Input><br />
      <div class="label">版本号：</div>
      <Input v-model="version" placeholder="" style="width: 40%"></Input><br />
      <div class="label">Build版本号：</div>
      <Input v-model="build_version" placeholder="" style="width: 40%"></Input><br />
      <div class="label">类型：</div>
      <Select v-model="type" style="width:40%">
        <Option v-for="item in types" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select><br />
      <div class="label">备注：</div>
      <Input v-model="des" type="textarea" placeholder="" style="width: 40%;margin-bottom:40px;"></Input><br />
      <Button type="primary" size="large" @click="submit">提交</Button>
      <Button class="cancel" type="error" size="large" @click.once="backWard">取消</Button>
    </div>
</template>
<script>
import Validate from '../../../utils/validator'
import {Message} from 'iview'
export default {
  data () {
    return {
      name: '',
      version: '',
      build_version: '',
      des: '',
      file: '',
      savePath: '',
      token: window.sessionStorage.getItem('token'),
      types: [
        {
          value: 'release',
          label: '正式包'
        },
        {
          value: 'debug',
          label: '测试包'
        }
      ],
      type: ''
    }
  },
  methods: {
    backWard () {
      this.$router.back(-1)
    },
    handleUpload (file) {
      this.file = file
      return false
    },
    submit () {
      // 验证提交数据
      let vali = new Validate()
      vali.add(this.name, [{method: 'matchEmpty', msg: '名称不能为空'}])
      vali.add(this.savePath, [{method: 'matchEmpty', msg: '文件链接不能为空'}])
      vali.add(this.version, [{method: 'matchEmpty', msg: '版本号不能为空'}])
      vali.add(this.build_version, [{method: 'matchEmpty', msg: 'build版本号不能为空'}])
      vali.add(this.type, [{method: 'matchEmpty', msg: '类型不能为空'}])
      let result = vali.start()
      // 如果没有错误返回则提交
      if (!result) {
        let param = new FormData() // 创建form对象
        var self = this
        param.append('savePath', this.savePath)
        param.append('name', this.name)
        param.append('version', this.version)
        param.append('des', this.des)
        param.append('type', this.type)
        param.append('plat', 'iOS')
        param.append('build_version', this.build_version)
        param.append('token', this.token)
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        this.post('/iov_apis/ios/add', param, config).then(function (res) {
          console.log(res)
          if (res.data.code === 200) {
            Message.info('上传成功！')
            setTimeout(function () {
              self.$router.back(-1)
            }, 1000)
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
    }
  }
}
</script>
<style>
.box-an-add{
  position: relative;
  text-align: left;
  width: 50vw;
  margin: 20px 25vw;
  box-shadow: 0 0 10px #eee;
  padding: 20px 35px;
  border-radius: 6px;
}
.box-an-add h1{
  border-bottom: #eee solid 1px;
  margin-bottom: 30px;
  padding-bottom: 16px;
  font-size: 18px;
}
.box-an-add .label{
  font-size: 15px;
}
.box-an-add .cancel{
  margin-left: 20px;
}
.box-an-add .ivu-input-type{
  margin: 6px 0 10px 0;
}
.box-an-add .ivu-select{
  margin: 6px 0 10px 0;
}
</style>
