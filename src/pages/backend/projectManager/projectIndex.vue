<template>
    <div class="now-project">
      <Row>
        <Col :xs="24" :sm="16" :md="7" :lg="3">
          <project-nav></project-nav>
        </Col>
        <Col :xs="24" :sm="24" :md="17" :lg="21">
          <router-view :key="this.$route.query.id"/>
        </Col>
      </Row>
    </div>
</template>
<script>
import projectNav from '@/components/backend/projectNav'
export default {
  data () {
    return {
      msg: ''
    }
  },
  components: {
    'project-nav': projectNav
  }
}
</script>
<style>
.now-project{
  position: relative;
  float: left;
  width: 100%;
}
</style>
