<template>
  <div class="pages-box">
    <div class="pages-bar">
      <div class="pages-title">
        <Icon type="ios-folder-outline" size="22" style="margin-right:10px;color:#22d7bb;"></Icon>项目文档
      </div>
      <Button type="info" class="add-btn" @click="addFile">添加文档</Button>
    </div>
    <div class="pages-content-box">
      <Spin size="large" style="margin:0 50%;position:absolute;z-index:99" v-show="loading"></Spin>
      <Table border :columns="columns0" :data="files" :height="tableHeight" :loading="loading" stripe></Table>
      <!-- 操作任务modal -->
      <Mymodal title="添加文档" submitBtn="true" @modalConfirm="addFileDo" @modalCancel="closeFileDo" v-show="modal">
        <Form ref="formValidate" :label-width="80">
          <FormItem label="选择文件" style="margin:12px 0;">
            <Upload action="/apis/add_project_file" :before-upload="handleUpload">
              <Button type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>
            </Upload>
          </FormItem>
          <FormItem label="文件名" style="margin:12px 0;">
            <Input placeholder="Enter file name" v-model="addFileParam.name"></Input>
          </FormItem>
          <FormItem label="文件类型" style="margin:12px 0;">
            <Select v-model="addFileParam.type" >
              <Option v-for="item in types" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </FormItem>
          <FormItem label="描述" style="margin:12px 0;">
            <Input placeholder="Enter file description" v-model="addFileParam.des"  type="textarea" :rows="4"></Input>
          </FormItem>
        </Form>
      </Mymodal>
      <!-- 删除任务类型modal -->
      <Modal v-model="modal1" width="360">
        <p slot="header" style="color:#f60;text-align:center">
          <Icon type="ios-information-circle"></Icon>
          <span>Delete confirmation</span>
        </p>
        <div style="text-align:center">
          <p>确定删除该任务类型吗？</p>
        </div>
        <div slot="footer">
          <Button type="error" size="large" long  @click="doDeleteFile">Delete</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import Validate from '@/utils/validator'
import {Message} from 'iview'
export default {
  data () {
    return {
      project: {},
      modal: false,
      token: window.sessionStorage.getItem('token'),
      groupMembers: [],
      loading: true,
      files: [],
      modal1: false,
      addFileParam: {
        name: '',
        des: '',
        type: '',
        file: ''
      },
      deleteNow: -1,
      types: ['需求文档', '接口文档', '设计图'],
      tableHeight: 0,
      columns0: [
        {
          title: '文件名',
          key: 'name',
          sortable: true
        },
        {
          title: '文件类型',
          key: 'type',
          sortable: true
        },
        {
          title: '描述',
          key: 'des',
          sortable: true
        },
        {
          title: '上传者',
          key: 'creater',
          sortable: true
        },
        {
          title: '上传时间',
          key: 'created_at',
          sortable: true
        },
        {
          title: 'Action',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            if (parseInt(params.row.creater_id) === parseInt(window.sessionStorage.getItem('memberId'))) {
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
                      this.downloadIt(params.index)
                    }
                  }
                }, '下载'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.deleteIt(params.index)
                    }
                  }
                }, '删除')
              ])
            } else {
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
                      this.downloadIt(params.index)
                    }
                  }
                }, '下载')
              ])
            }
          }
        }
      ]
    }
  },
  mounted () {
    let height = document.documentElement.clientHeight
    this.tableHeight = height * 0.8
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
    this.replyData()
  },
  methods: {
    addFile () {
      this.modal = true
    },
    downloadIt (index) {
      console.log(this.files[index])
      window.open(this.files[index].path)
    },
    deleteIt (index) {
      this.deleteNow = index
      this.modal1 = true
    },
    doDeleteFile () {
      let self = this
      let param = {
        token: this.token,
        id: this.files[this.deleteNow]
      }
      this.post('/iov_apis/delete_file', param).then(function (res) {
        if (res.data.code === 200) {
          Message.info('删除成功！')
          self.modal1 = false
          self.files.splice(self.deleteNow, 1)
        } else {
          Message.info('删除失败！')
        }
      })
    },
    addFileDo () {
      console.log(this.addFileParam)
      // 验证提交数据
      let vali = new Validate()
      vali.add(this.addFileParam.name, [{method: 'matchEmpty', msg: '名称不能为空'}])
      vali.add(this.addFileParam.type, [{method: 'matchEmpty', msg: '文件类型不能为空'}])
      vali.add(this.addFileParam.file, [{method: 'matchEmpty', msg: '文件不能为空'}])
      vali.add(this.addFileParam.file, [{method: 'maxSize', msg: '文件大小不能超过2M'}])
      let result = vali.start()
      // 如果没有错误返回则提交
      if (!result) {
        let param = new FormData()
        let self = this
        // 创建form对象
        param.append('file', this.addFileParam.file, this.addFileParam.file.name)
        param.append('name', this.addFileParam.name)
        param.append('type', this.addFileParam.type)
        param.append('des', this.addFileParam.des)
        param.append('token', this.token)
        param.append('project_id', this.$route.query.id)
        let config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        this.post('/iov_apis/add_project_file', param, config).then(function (res) {
          console.log(res)
          if (res.data.code === 200) {
            Message.info('上传成功！')
            self.modal = false
            self.addFileParam = {
              name: '',
              des: '',
              type: '',
              file: ''
            }
            self.replyData()
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
    closeFileDo () {
      this.modal = false
    },
    handleUpload (file) {
      this.addFileParam.file = file
      this.addFileParam.name = this.addFileParam.file.name
      return false
    },
    replyData () {
      let param = {
        project_id: this.$route.query.id,
        token: this.token
      }
      let self = this
      this.get('/iov_apis/get_files', param).then(function (res) {
        if (res.data.code === 200) {
          self.files = res.data.data
        } else {
        }
      })
    }
  }
}
</script>
<style scoped>
.pages-box >>>.ivu-table-wrapper{
  margin:20px;
}
</style>
