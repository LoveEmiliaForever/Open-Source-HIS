<template>
  <div id="bedManageBedInfor">
    <el-tabs>
      <el-tab-pane v-for="(floor, index) of panes" :key="index" :label="index + 1 + '楼'">
        <div class="grid-container">
          <div v-for="(room, index) of floor" :key="index" :class="`room${index + 1} room`">
            <p class="roomName">房间：{{ index + 1 }}</p>
            <div v-for="(bed, index) of room" :key="index" :class="`bed${index + 1} bed ${bedClass(bed.status)}`">
              <p>床位：{{ bed.bedName }}</p>
              <p>状态：{{ bed.status }}</p>
              <p v-if="bed.status === '使用中'">病人：{{ bed.patientName }}</p>
              <p v-if="bed.status !== '空闲中'">护士：{{ bed.nurse }}</p>
            </div>
          </div>
          <div class="aisle">
            <p>走廊过道</p>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
#bedManageBedInfor .grid-container{
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 1rem;
}
.grid-container .room{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 1rem;
  padding: 0.5rem;
}
.grid-container .room .roomName{
  grid-column: 1/3;
  grid-row: 1;
  text-align: center;
}
.grid-container .aisle{
  grid-column: 1/6;
  grid-row: 2;
  display: grid;
  align-items: center;
  justify-items: center;
  height: 10vh;
  border: 1px solid rgba(0, 0, 0, 0.08);
}
.grid-container .bed{
  height: 20vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 1rem;
}
#bedManageBedInfor .use{
  background-color: #f8e3c5;
}
#bedManageBedInfor .need-clear{
  background-color: #fcd3d3;
}
#bedManageBedInfor .blank{
  background-color: #d1edc4;
}
</style>

<script>
import axios from 'axios'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'bedInforView',
  data () {
    return {
      panes: [],
      bedInforAPI: '/bed-management/bedInfor'
    }
  },
  methods: {
    async getBedInfor () {
      await axios.get(this.bedInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.panes = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    bedClass (status) {
      switch (status) {
        case '使用中':
          return 'use'
        case '需清理':
          return 'need-clear'
        default:
          return 'blank'
      }
    }
  },
  async beforeMount () {
    await this.getBedInfor()
  }
}
</script>
