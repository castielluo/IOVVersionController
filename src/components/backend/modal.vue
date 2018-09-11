<template>
  <div class="modals">
    <div class="modal-box">
      <div class="modal-title">{{title}}</div>
      <div class="modal-content">
        <slot></slot>
      </div>
      <div class="modal-bottom">
        <Button type="error" @click="$emit('modalDelete')" style="float:left" v-if="deleteBtn">删除</Button>
        <Button type="info" @click="$emit('modalConfirm')" v-if="submitBtn">提交</Button>
        <Button type="error" @click="$emit('modalCancel')">关闭</Button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  props: [
    'title',
    'submitBtn',
    'deleteBtn'
  ]
}
</script>
<style scoped>
.modals{
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,.5);
  left: 0;
  top: 0;
  z-index: 999;
}
.modal-box{
  position: relative;
  float: left;
  width: 36vw;
  margin: 10vh 32vw;
  background-color: #f9f9f9;
  border-radius: 6px;
  min-height: 10vh;
}
.modal-box >>> .ivu-form-item-content{
  text-align: left;
}
.modal-title{
  position: relative;
  width: 100%;
  float: left;
  color: #212121;
  font-size: 16px;
  text-align: left;
  padding: 10px;
  border-bottom: #dedede solid 1px;
  background-color: #f1f1f1;
  border-radius: 6px 6px 0 0;
  overflow: hidden;
}
.modal-content{
  position: relative;
  width: 100%;
  float: left;
  min-height: 10vh;
  padding: 15px;
}
.modal-bottom{
  position: relative;
  width: 100%;
  float: left;
  text-align: right;
  padding: 10px;
  border-top: #dedede solid 1px;
  background-color: #f4f4f4;
  border-radius: 0 0 6px 6px;
  overflow: hidden;
}
</style>
