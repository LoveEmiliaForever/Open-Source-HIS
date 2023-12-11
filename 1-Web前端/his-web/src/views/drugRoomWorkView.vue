<template>
  <BasicFrame>
    <div class="contents" id="drugRoomWork">
      <!--显示药库药品-->
      <div class="drugInfor">
        <el-table v-if="drugInfor" :data="drugInfor" border>
          <el-table-column prop="drugName" label="药品名称"></el-table-column>
          <el-table-column prop="drugNum" label="药品数量"></el-table-column>
          <el-table-column prop="drugType" label="中西药"></el-table-column>
          <el-table-column prop="appearance" label="物理性质"></el-table-column>
          <el-table-column prop="prescriptionStatus" label="处方归类"></el-table-column>
          <el-table-column prop="drugPrice" label="药品价格"></el-table-column>
        </el-table>
      </div>
      <!--显示当前配药处方-->
      <div class="prescription">
        <table border v-if="prescription">
          <tr class="table-head">
            <td>病人姓名</td>
            <td>病人性别</td>
            <td rowspan="2">
              <el-button type="success" @click="nextPatient">当前处方出药：呼叫下一病人</el-button>
            </td>
          </tr>
          <tr>
            <td>{{ patientName }}</td>
            <td>{{ patientGender }}</td>
          </tr>
          <tr class="table-head">
            <td colspan="2">药品名称</td>
            <td>药品数量</td>
          </tr>
          <tr v-for="(item, index) of prescription" :key="index">
            <td colspan="2">{{ item.drugName }}</td>
            <td>{{ item.drugNum }}</td>
          </tr>
        </table>
      </div>
    </div>
  </BasicFrame>
</template>

<style>
#drugRoomWork{
  padding: 1rem;
  display: flex;
  justify-content: space-between;
}
#drugRoomWork .drugInfor{
  width: 49%;
  overflow: scroll;
}
#drugRoomWork .prescription{
  width: 49%;
  overflow: scroll;
}
#drugRoomWork .prescription table{
  border-collapse: collapse;
  text-align: center;
  width: 100%;
}
#drugRoomWork .prescription table td{
  padding: 0.5rem;
}
#drugRoomWork .prescription table .table-head td{
  font-weight: 700;
  font-size: 1rem;
  padding: 0.5rem;
}
</style>

<script>
import axios from 'axios'
import BasicFrame from '@/components/basicFrame.vue'
import { mapState } from 'vuex'

export default {
  name: 'userView',
  components: {
    BasicFrame
  },
  data () {
    return {
      drugInfor: false,
      drugInforAPI: '/drug-warehouse-work/drugManage/drugInfor',
      patientName: '',
      patientGender: '',
      prescription: false,
      prescriptionId: false,
      prescriptionAPI: '/drug-room-work/prescription',
      prescriptionChangeAPI: '/drug-room-work/prescriptionChange'
    }
  },
  computed: mapState(['childrenPermissions']),
  methods: {
    async getDrugInfor () {
      await axios.get(this.drugInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.drugInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    async getPrescription () {
      await axios.get(this.prescriptionAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        console.log(result)
        this.patientName = result.data.patientName
        this.patientGender = result.data.patientGender
        this.prescription = result.data.prescription
        this.prescriptionId = result.data.prescriptionId
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    nextPatient () {
      axios.post(this.prescriptionChangeAPI, {
        token: localStorage.getItem('token'),
        prescriptionId: this.prescriptionId
      })
      this.getPrescription()
    }
  },
  async beforeMount () {
    await this.getDrugInfor()
    await this.getPrescription()
  }
}
</script>
