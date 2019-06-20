<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'sidebar',
  computed: {
    ...mapGetters(['meueStatus']),
    routeLocation () {
      return this.routes[this.currentRoute]
    }
  },
  methods: {
    ...mapActions(['meue_status']),
    rwdClose () {
      if (window.innerWidth < 768) {
        this.meue_status()
      }
    }
  }
}
</script>

<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
