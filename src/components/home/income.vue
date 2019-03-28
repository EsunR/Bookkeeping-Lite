<template>
  <div id="income">
    <inList :time1="''" :time2="Date.parse(new Date()).toString()"></inList>
  </div>
</template>

<script>
import inList from "../subComponents/inList.vue";
export default {
  data() {
    return {
      time1: "",
      time2: Date.parse(new Date()).toString()
    };
  },
  components: {
    inList
  }
};
</script>

<style lang='scss' scoped>
</style>