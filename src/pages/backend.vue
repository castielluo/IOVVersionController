<template>
  <div class="backend">
    <IOVheader></IOVheader>
    <IOVmain></IOVmain>
    <!-- <IOVfooter></IOVfooter> -->
  </div>
</template>

<script>
import IOVHeader from '@/components/backend/IOVHeader'
import IOVFooter from '@/components/backend/IOVFooter'
import IOVMain from '@/components/backend/IOVMain'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  components: {
    'IOVheader': IOVHeader,
    'IOVfooter': IOVFooter,
    'IOVmain': IOVMain
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.backend{
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
}
.main-box{
   width: 98vw;
   margin: 0 1vw;
}
a{
  color: #22d7bb;
}
.border-right{
  position: absolute;
  width: 1px;
  height: 80%;
  background-color: #eee;
  top: 10%;
  right: 0;
}
.data-box{
  position: relative;
  float: left;
  width: 98%;
  margin: 15px 1% 5px 1%;
  padding: 15px;
  background-color: #fff;
}
.data-box-title{
  position: relative;
  float: left;
  width: 100%;
  padding: 0px 0 0px 10px;
  text-align: left;
  font-size: 14px;
  color: #555;
  border-left: #22d7bb solid 3px;
  height: 16px;
  line-height: 16px;
  margin-bottom: 1vh;
}
/* layout */
.pages-box{
  position: relative;
  float: left;
  width: 100%;
  background-color: #eee;
  min-height: 94vh;
}
.pages-bar{
  position: relative;
  float: left;
  width: 100%;
  height: 5.2vh;
  min-height: 50px;
  line-height: 30px;
  padding: 10px 2%;
  font-size: 16px;
  color: #222;
  text-align: left;
  background-color: #fff;
  border-bottom: #eee solid 1px;
}
.pages-bar .add-btn{
  float: right;
}
.pages-bar .pages-title{
  display: flex;
  align-items: center;
  float: left;
}
.pages-content-box{
  width: 100%;
  float: left;
  height: 85vh;
  overflow-y: auto;
  overflow-x: auto;
  white-space: nowrap;
  background-image: url('~@/assets/img/svlogo.png');
  background-repeat: no-repeat;
  background-position: 97% 98%;
  background-size: 7%;
}
.pages-content{
  position: relative;
  float: left;
  text-align: left;
  height: 85vh;
  white-space: nowrap;
}
.pages-content-box::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.pages-content-box::-webkit-scrollbar-thumb{
  border-radius: 10px;
  box-shadow: inset 0 0 5px #22d7bb;
  background: #22d7bb;
  cursor: pointer;
}
.pages-content-box::-webkit-scrollbar-track{
  background: #eee;
}
/* layout */
</style>
