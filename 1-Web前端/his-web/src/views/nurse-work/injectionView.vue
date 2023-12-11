<template>
  <div id="nurseWorkInjection">
    <table border class="record-table table">
      <tr class="table-header">
        <td colspan="4">注射单</td>
      </tr>
      <tr>
        <td colspan="4">
          <el-table :data="injectionInfor" border class="table-complex">
            <el-table-column type="expand">
              <template #default="props2">
                <el-table :data="props2.row.prescriptionDetail" border>
                  <el-table-column prop="drugName" label="药品名">
                  </el-table-column>
                  <el-table-column prop="drugNum" label="药品数">
                  </el-table-column>
                  <el-table-column prop="drugUse" label="药品用法">
                  </el-table-column>
                  <el-table-column prop="doctorDrugAdvice" label="药品医嘱">
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column prop="patientName" label="患者"></el-table-column>
            <el-table-column align="right">
              <template #default="scope">
                <el-button v-if="scope.row.injectionStatus === '未注射'" type="success" @click="inject(scope.row.prescriptionId)">完成注射</el-button>
              </template>
            </el-table-column>
          </el-table>
        </td>
      </tr>
    </table>
  </div>
</template>

<style>
#nurseWorkInjection .table{
  border-collapse: collapse;
  text-align: center;
  width: 100%;
}
#nurseWorkInjection .record-table{
  border-collapse: collapse;
  text-align: center;
  margin: 2rem 10%;
  width: 80%;
}
#nurseWorkInjection .table-header{
  font-weight: 700;
}
#nurseWorkInjection .table td{
  padding: 0.5rem;
}
#nurseWorkInjection .table-big-td td{
  padding: 3rem 0.5rem;
}
</style>

<script>
import { ElMessage } from 'element-plus'
import axios from 'axios'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'injectionView',
  data () {
    return {
      injectionInfor: [],
      injectionInforAPI: '/nurse-work/injection/injectionInfor',
      injectStatusChangeAPI: '/nurse-work/injection/injectStatusChange'
    }
  },
  methods: {
    async getInjectionInfor () {
      await axios.get(this.injectionInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.injectionInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    inject (prescriptionId) {
      axios.post(this.injectStatusChangeAPI, {
        token: localStorage.getItem('token'),
        prescriptionId: prescriptionId
      }).then(() => {
        ElMessage({
          type: 'success',
          message: '提交成功'
        })
        this.getInjectionInfor()
      }).catch((result) => { this.$store.state.errorReport(result) })
    }
  },
  async beforeMount () {
    await this.getInjectionInfor()
  }
}
</script>
