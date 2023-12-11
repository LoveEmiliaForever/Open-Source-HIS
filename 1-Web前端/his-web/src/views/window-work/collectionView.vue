<template>
  <div id="windowWorkCollection">
    <el-form :model="searchForm" ref="searchForm" :rules="searchFormRules" v-if="dataShowFlag">
      <el-form-item label="患者姓名" prop="patientName">
        <el-input v-model="patientName" placeholder="输入患者名字"></el-input>
      </el-form-item>
      <el-form-item label="患者身份证号" prop="idNum">
        <el-input v-model="idNum" placeholder="输入患者身份证"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchPatient">查找应缴费金额</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="moneyData" border stripe v-if="!dataShowFlag && moneyData" show-summary>
      <el-table-column prop="patientName" label="缴费人"></el-table-column>
      <el-table-column prop="itemName" label="缴费项目"></el-table-column>
      <el-table-column prop="itemMoney" label="缴费金额" sortable></el-table-column>
    </el-table>
    <el-button size="default" @click="payMoney" v-if="!dataShowFlag && moneyData">完成缴费</el-button>
  </div>
</template>

<style>
#windowWorkCollection{
  display: flex;
  flex-direction: column;
  align-items: center;
}
#windowWorkCollection > .el-form{
  margin-top: 3rem;
  width: 50%;
}
#windowWorkCollection > .el-button{
  width: 100%;
  margin-top: 2rem;
}
</style>

<script>
import { mapMutations, mapState } from 'vuex'
import axios from 'axios'
import { ElMessage } from 'element-plus'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'collectionView',
  data () {
    return {
      dataShowFlag: true,
      moneyData: false,
      searchForm: {
        patientName: '',
        idNum: ''
      },
      searchFormRules: {
        patientName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        idNum: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      searchPatientAPI: '/window-work/collection/searchPatient',
      payMoneyAPI: '/window-work/collection/payMoney'
    }
  },
  computed: {
    ...mapState('windowWork', ['patientName2', 'idNum2']),
    patientName: {
      get () {
        return this.patientName2
      },
      set (newValue) {
        this.setPatientName(newValue)
      }
    },
    idNum: {
      get () {
        return this.idNum2
      },
      set (newValue) {
        this.setIdNum(newValue)
      }
    }
  },
  methods: {
    ...mapMutations('windowWork', ['setPatientName', 'setIdNum']),
    searchPatient () {
      this.searchForm.patientName = this.patientName
      this.searchForm.idNum = this.idNum
      this.$refs.searchForm.validate()
        .then(() => {
          axios.get(this.searchPatientAPI, {
            params: {
              token: localStorage.getItem('token'),
              patientName: this.searchForm.patientName,
              idNum: this.searchForm.idNum
            }
          }).then((result) => {
            this.moneyData = result.data
            this.dataShowFlag = false
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    },
    payMoney () {
      axios.post(this.payMoneyAPI, {
        token: localStorage.getItem('token'),
        payedItem: this.moneyData
      }).then(() => {
        this.dataShowFlag = true
        ElMessage({
          type: 'success',
          message: '缴费成功'
        })
      }).catch((result) => { this.$store.state.errorReport(result) })
    }
  }
}
</script>
