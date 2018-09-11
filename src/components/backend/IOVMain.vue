<template>
<div class="main" :style="{height: height + 'px'}">
    <router-view/>
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
  }
}
</script>
<style>
.main{
    position: relative;
    border-radius: 8px;
    margin-top: 50px;
    background-color: #fff;
    float: left;
    overflow: hidden;
}
</style>
