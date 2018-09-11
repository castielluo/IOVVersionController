<template>
<div class="siderBar">
            <Menu :theme="theme2" active-name="1-1" :open-names="['1']" style="width:100%">
                <Submenu name="1">
                    <template slot="title">
                        <Icon type="stats-bars"></Icon>
                        版本管理
                    </template>
                    <router-link to="/backend/aninfo">
                        <MenuItem name="1-1">Android</MenuItem>
                    </router-link>
                    <router-link to="/backend/iosinfo">
                        <MenuItem name="1-3">iOS</MenuItem>
                    </router-link>
                </Submenu>
                <Submenu name="2">
                    <template slot="title">
                        <Icon type="document"></Icon>
                        文件管理
                    </template>
                    <MenuGroup title="技术文档">
                        <router-link to="">
                            <MenuItem name="2-1">部署文件</MenuItem>
                        </router-link>
                        <router-link to="">
                            <MenuItem name="2-2">接口文档</MenuItem>
                        </router-link>
                        <router-link to="">
                            <MenuItem name="2-3">技术博客</MenuItem>
                        </router-link>
                    </MenuGroup>
                </Submenu>
            </Menu>
    <br>
</div>
</template>
<script>
export default {
  data () {
    return {
      theme2: 'light',
      width: '100%'
    }
  }
}
</script>
<style>
.siderBar{
    position: relative;
    border-radius: 8px;
    padding: 10px 0 10px 10px;
    background-color: #fff;
    box-shadow: #ccc 0px 0px 6px;
    border-top: #2d8cf0 solid 3px;
}
.ivu-menu-vertical.ivu-menu-light:after{
    width: 0;
}
a{
    color: #495060;
}

</style>
