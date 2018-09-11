<template>
  <div>
    <transition name="fade">
      <div class="modals" @click="closeIt" v-if="show">
      </div>
    </transition>
    <transition name="slide-fade">
      <div class="modal-box" @click.stop :style="{height: height + 'px'}" v-if="show">
        <div class="modal-title">
          {{title}}
          <Button type="info" @click="$emit('modalConfirm')" v-if="submitBtn">提交</Button>
        </div>
        <div class="modal-content">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data () {
    return {
      height: 0
    }
  },
  mounted () {
    this.height = document.body.clientHeight - 50
  },
  props: [
    'title',
    'submitBtn',
    'deleteBtn',
    'show'
  ],
  methods: {
    closeIt () {
      this.$emit('modalCancel')
    }
  }
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
  z-index: 99;
}
.modal-box{
  position: fixed;
  right: 0;
  top: 50px;
  width: 24vw;
  margin: 0;
  background-color: #f9f9f9;
  z-index: 100;
}
.modal-box .ivu-form-item-content{
  text-align: left;
}
.modal-title{
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  color: #212121;
  font-size: 16px;
  text-align: left;
  padding: 10px;
  border-bottom: #dedede solid 1px;
  background-color: #f1f1f1;
  overflow: hidden;
}
.modal-title button{
  float: right;
}
.modal-content{
  position: relative;
  width: 100%;
  float: left;
  height: 95vh;
  padding: 15px;
  margin-top: 5vh;
  overflow-x: hidden;
  overflow-y: auto;
}
.modal-bottom{
  position: relative;
  width: 100%;
  float: left;
  text-align: right;
  padding: 10px;
  border-top: #dedede solid 1px;
  background-color: #f4f4f4;
  overflow: hidden;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translateX(160px);
  opacity: 0;
}
/* bg */
.fade-enter-active {
  transition: opacity 0.1s;
}
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
</style>
