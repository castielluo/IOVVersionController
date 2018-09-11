<template>
  <div class="iov-footer">
    <div class="footer-left-box">
      <img src="@/assets/img/s7.png" alt="">
      <h5>IOV · 车联网</h5><br />
      <h5>Copyright © 2016 惠州市德赛西威汽车电子股份有限公司 版权所有</h5>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IOVFooter',
  data () {
    return {
      msg: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.iov-footer{
  width: 100%;
  background-color: #2e2e2e;
  color: #f1f1f1;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  height: 10vh;
  min-height: 80px;
}
.footer-left-box{
  position: relative;
  height: 5vh;
  margin: 2.5vh 3vw;
}
.footer-left-box img{
  float: left;
}
.footer-left-box h5{
  color: #777;
  font-size: 12px;
  margin-left: 40px;
  float: left;
}
</style>
