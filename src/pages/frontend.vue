<template>
  <div class="front">
    <yd-navbar title="版本管理" fixed></yd-navbar>
    <yd-cell-group class="options-bar">
      <yd-cell-item>
        <span slot="left" @click="show0 = true">类型（{{type}}）<Icon type="ios-arrow-down" /></span>
        <span slot="right" @click="show1 = true">平台（{{plat}}）<Icon type="ios-arrow-down" /></span>
      </yd-cell-item>
    </yd-cell-group>
    <yd-cell-group class="list-box">
      <div class="front-list" v-for="item in filterItems" :key="item.id">
        <div class="front-list-left">
          <img :src="item.avatar" alt="">
          <span>{{item.name}}</span>
        </div>
        <div class="front-list-middle">
          <div class="version-info">
            <p>日期：<span>{{item.created_at | dateLimit}}</span></p>
            <p>版本：<span>{{item.version}}</span></p>
            <p>Build版本号：<span>{{item.build_version}}</span></p>
            <p>属性：<span>{{item.plat}} / {{item.type}}</span></p>
            <p>上传：<span>{{item.uploader}}</span></p>
          </div>
        </div>
        <div class="front-list-right">
          <a :href="item.savePath" target="_blank"><div class="dl-btn">下载</div></a>
        </div>
      </div>
    </yd-cell-group>
    <yd-actionsheet :items="myItems0" v-model="show0" cancel="取消"></yd-actionsheet>
    <yd-actionsheet :items="myItems1" v-model="show1" cancel="取消"></yd-actionsheet>
  </div>
</template>

<script>
import { Loading } from 'vue-ydui/dist/lib.rem/dialog'
export default {
  name: 'front',
  data () {
    return {
      type: '全部包',
      plat: '全部',
      show0: false,
      show1: false,
      myItems0: [
        {
          label: '全部包',
          callback: () => {
            this.type = '全部包'
            this.itemsFilter.type = ''
          }
        },
        {
          label: '测试包',
          callback: () => {
            this.type = '测试包'
            this.itemsFilter.type = 'debug'
          }
        },
        {
          label: '正式包',
          callback: () => {
            this.type = '正式包'
            this.itemsFilter.type = 'release'
          }
        }
      ],
      myItems1: [
        {
          label: '全部',
          callback: () => {
            this.plat = '全部'
            this.itemsFilter.plat = ''
          }
        },
        {
          label: 'Android',
          callback: () => {
            this.plat = 'Android'
            this.itemsFilter.plat = 'Android'
          }
        },
        {
          label: 'iOS',
          callback: () => {
            this.plat = 'iOS'
            this.itemsFilter.plat = 'iOS'
          }
        }
      ],
      items: [],
      itemsFilter: {
        type: '',
        plat: ''
      }
    }
  },
  filters: {
    dateLimit: function (value) {
      if (!value) return ''
      return value.slice(0, 16)
    }
  },
  mounted () {
    Loading.open('正在加载')
    var self = this
    this.get('/iov_apis/front/versions', {token: window.sessionStorage.getItem('token')}).then(function (res) {
      console.log(res.data)
      self.items = res.data
      setTimeout(function () { Loading.close() }, 1000)
    })
  },
  computed: {
    filterItems: function () {
      var type = this.itemsFilter.type
      var plat = this.itemsFilter.plat
      return this.items.filter(function (item) {
        if (type && plat) {
          return (item.type === type) && (item.plat === plat)
        } else if (type) {
          return item.type === type
        } else if (plat) {
          return item.plat === plat
        } else {
          return item
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.front-list{
  position: relative;
  float: left;
  width: 100vw;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  background-color: #fff;
  border-bottom: #eee solid 1px;
}
.front-list-right{
  position: relative;
  width: 18vw;
}
.front-list-middle{
  position: relative;
  width: 57vw;
}
.front-list-left{
  position: relative;
  width: 25vw;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
}
.front-list-left img{
  width: 15vw;
  height: 15vw;
  margin-bottom: 6px;
}
.front-list-left span{
  font-size: 12px;
  color: #666;
}
.version-info{
  width: 63vw;
  text-align: left;
  font-size: 15px;
  color: #212121;
  margin: 16px 0;
}
.version-info p{
  margin: 4px 0;
}
.version-info span{
  color: #666;
  text-indent: 1rem;
}
.options-bar{
  position:fixed;top:1rem;left:0;width:100vw;z-index:9;
}
.list-box{
  margin-top: 2rem;
}
.dl-btn{
  width: 15vw;
  text-align: center;
  border: #444 solid 1px;;
  border-radius: 0.2rem;
  font-size: 0.3rem;
  height: 0.5rem;
  line-height: 0.5rem;
}
.front .yd-cell-right{
  font-size: 0.3rem
}
</style>
