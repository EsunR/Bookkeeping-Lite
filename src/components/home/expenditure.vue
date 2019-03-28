<template>
  <div id="expenditure">
    <outList :time1="''" :time2="Date.parse(new Date()).toString()"></outList>
  </div>
</template>

<script>
import outList from "../subComponents/outList.vue";
export default {
  data() {
    return {
      time1: "",
      time2: Date.parse(new Date()).toString()
    };
  },
  components: {
    outList
  }
};
</script>

<style lang='scss' scoped>
</style>