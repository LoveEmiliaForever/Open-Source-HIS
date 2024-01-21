<template>
  <BasicFrame>
    <div class="contents">
      <el-table :data="keShiInfor">
        <el-table-column label="科室名称" prop="department"></el-table-column>
        <el-table-column label="挂号费" prop="price"></el-table-column>
        <el-table-column label="医生数" prop="num"></el-table-column>
      </el-table>
    </div>
  </BasicFrame>
</template>

<style></style>

<script>
import BasicFrame from '../../components/basicFrame.vue'
import axios from 'axios'
export default {
  name: 'keShi',
  components: {
    BasicFrame
  },
  data () {
    return {
      keShiInfor: [],
      keShiAPI: '/keShi'
    }
  },
  methods: {
    async getKeShi () {
      await axios.get(this.keShiAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.keShiInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    }
  },
  async beforeMount () {
    await this.getKeShi()
  }
}
</script>
