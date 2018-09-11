<template>
    <div class="bkhome">
      <Row>
        <Col span="24" style="padding-top:30px;background-color:#ffffff;">
          <div id="title-box">
            <div id="icon">
                <img src="@/assets/img/icon.png" alt="">
            </div>
            <h1>项目集成通用平台</h1>
            <h2>Project Integration</h2>
          </div>
        </Col>
      </Row>
    </div>
</template>
<script>
export default {
  data () {
    return {
      value: 0,
      setting: {
        autoplay: true,
        autoplaySpeed: 6000,
        dots: 'inside',
        radiusDot: false,
        trigger: 'hover',
        arrow: 'hover'
      }
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>
<style>
.bkhome{
    background-color: #f4f4f4;
    height: 94vh;
}
.bkhome h1{
    font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    color: #3b5c7e;
    font-size: 28px;
    -webkit-font-smoothing: antialiased;
    font-weight: 300;
    text-align: left;
}
.bkhome h2{
    font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    color: #3b5c7e;
    font-size: 24px;
    -webkit-font-smoothing: antialiased;
    font-weight: 200;
    text-align: left;
}
.bkhome #title-box{
    position: relative;
    width: 30%;
    margin: 0 67% 30px 3%;
    float: left;
}
.bkhome #title-box #icon{
    position: relative;
    float: left;
    width: 12%;
    margin-right: 20px;
}
.bkhome #title-box #icon img{
    width: 100%
}

</style>
