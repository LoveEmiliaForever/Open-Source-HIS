<template>
  <div id="operationRoomManageRoom">
    <g-gantt-chart v-if="operationInfor"
    :chart-start="operationInfor.chartStart"
    :chart-end="operationInfor.chartEnd"
    precision="hour"
    bar-start="start"
    bar-end="end"
    color-scheme="sky"
    :grid="true">
      <g-gantt-row v-for="(item, index) of operationInfor.allInfor"
      :key="index"
      :label="index + '号-手术室'"
      :bars="item"></g-gantt-row>
    </g-gantt-chart>
  </div>
</template>

<style>
#operationRoomManageRoom{
  padding: 1rem;
}
</style>

<script>
import axios from 'axios'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'operationRoomView',
  data () {
    return {
      operationInfor: false,
      operationInforAPI: '/operation-room-manage/operationRoom',
      operationApplyInforAPI: '/operation-room-manage/operationManage/infor',
      operationApplyChangeAPI: '/operation-room-manage/operationManage/change'
    }
  },
  methods: {
    async getOperationInfor () {
      await axios.get(this.operationInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.operationInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    }
  },
  async beforeMount () {
    await this.getOperationInfor()
    console.log(this.operationInfor)
  }
}
</script>
