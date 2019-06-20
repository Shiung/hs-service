<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'navebar',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['meueStatus', 'userInfo'])
  },
  methods: {
    ...mapActions(['meue_status', 'log_out']),
    logOut () {
      this.log_out()
      this.$router.push({name: 'login'})
    }
  }
}
</script>

<template src="./template.html"></template>
<style lang="scss" src="./style.scss" scoped></style>
