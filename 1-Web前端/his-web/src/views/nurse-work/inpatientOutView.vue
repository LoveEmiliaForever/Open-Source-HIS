<template>
  <div id="nurseWorkInpatientOut">
    <el-table :data="inpatientOutInfor">
      <el-table-column prop="bedName" label="床位">
      </el-table-column>
      <el-table-column align="right">
        <el-button type="success" @click="clearBed(bedName)">完成了床位清洁</el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<style></style>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'inpatientOutView',
  data () {
    return {
      inpatientOutInfor: [],
      inpatientOutInforAPI: '/nurse-work/inpatientOut/inpatientOutInfor',
      inpatientOutInforChangeAPI: '/nurse-work/inpatientOut/inpatientOutInforChange'
    }
  },
  methods: {
    async getInpatientOutInfor () {
      await axios.get(this.inpatientOutInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.inpatientOutInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    clearBed (bedName) {
      axios.post(this.inpatientOutInforChangeAPI, {
        token: localStorage.getItem('token'),
        bedName: bedName
      }).then(() => {
        ElMessage({
          type: 'success',
          message: '提交成功'
        })
        this.getInpatientOutInfor()
      }).catch((result) => { this.$store.state.errorReport(result) })
    }
  },
  async beforeMount () {
    await this.getInpatientOutInfor()
  }
}
</script>
