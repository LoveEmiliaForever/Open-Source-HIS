<template>
  <div id="docWorkPrescription">
    <div v-if="!this.recordId">
      <p style="color: red;font-weight: 700;font-size: 1.2rem;">还没有创建并提交病历，先行创建并提交病历后开放此页面</p>
    </div>
    <div id="docWorkPrescriptionContain" v-if="this.recordId">
      <el-table :data="this.prescription" border v-if="prescription" class="table-complex">
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
        <el-table-column prop="prescriptionNum" label="处方名字"></el-table-column>
      </el-table>
      <el-button type="primary" @click="this.prescriptionDialog = true">新增处方单</el-button>
      <el-dialog v-model="prescriptionDialog" title="添加新处方单" @close="this.newPrescriptionData = []">
        <el-form :model="drugForm" ref="drugForm" :rules="rules">
          <el-form-item prop="drugName" label="药品名称">
            <el-autocomplete v-model="drugForm.drugName" :fetch-suggestions="inforSearch" :trigger-on-focus="true"></el-autocomplete>
          </el-form-item>
          <el-form-item prop="drugNum" label="药品数量">
            <el-input-number v-model="drugForm.drugNum" :min="1" :step="1"></el-input-number>
          </el-form-item>
          <el-form-item prop="doctorDrugAdvice" label="医嘱">
            <el-input v-model="drugForm.doctorDrugAdvice"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addNewDrug">添加新药品</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="newPrescriptionData" border>
          <el-table-column prop="drugName" label="药品名称"></el-table-column>
          <el-table-column prop="drugNum" label="药品数量"></el-table-column>
          <el-table-column prop="doctorDrugAdvice" label="医嘱"></el-table-column>
        </el-table>
        <el-button type="primary" @click="addNewPrescription">添加新处方</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<style>
#docWorkPrescription .el-button{
  margin: 1rem 0;
}
#docWorkPrescriptionContain{
  padding: 2rem;
}
</style>

<script>
import { mapMutations, mapState } from 'vuex'
import axios from 'axios'
import { ElMessage } from 'element-plus'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'prescriptionView',
  data () {
    return {
      prescription: false,
      prescriptionDialog: false,
      drugForm: {
        drugName: '',
        drugNum: '',
        doctorDrugAdvice: ''
      },
      rules: {
        drugName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        drugNum: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        doctorDrugAdvice: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      drugNameList: [],
      newPrescriptionData: [],
      prescriptionInforAPI: '/doc-work/prescription/prescriptionInfor',
      drugNameInforAPI: '/doc-work/prescription/drugNameInfor',
      addPrescriptionInforAPI: '/doc-work/prescription/addPrescriptionInfor'
    }
  },
  computed: {
    ...mapState('docWork', ['patientId2', 'recordId2']),
    patientId: {
      get () {
        return this.patientId2
      },
      set (newValue) {
        this.setPatientId(newValue)
      }
    },
    recordId: {
      get () {
        return this.recordId2
      },
      set (newValue) {
        this.setRecordId(newValue)
      }
    }
  },
  methods: {
    ...mapMutations('docWork', ['setPatientId', 'setRecordId']),
    async getPrescriptionInfor () {
      await axios.get(this.prescriptionInforAPI, {
        params: {
          token: localStorage.getItem('token'),
          patientId: this.patientId,
          recordId: this.recordId
        }
      }).then((result) => {
        this.prescription = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    inforSearch (queryString, cb) {
      const result = []
      const temp = this.drugNameList.filter(item => item.includes(queryString))
      for (const item of temp) {
        const tempObj = {
          value: item
        }
        result.push(tempObj)
      }
      console.log(result)
      cb(result)
    },
    addNewDrug () {
      this.$refs.drugForm.validate()
        .then(() => {
          this.newPrescriptionData.push(JSON.parse(JSON.stringify(this.drugForm)))
          this.$refs.drugForm.resetFields()
        }).catch(() => {})
    },
    addNewPrescription () {
      if (this.newPrescriptionData.length === 0) {
        ElMessage({
          type: 'error',
          message: '处方为空'
        })
        return
      }
      axios.post(this.addPrescriptionInforAPI, {
        prescriptionData: this.newPrescriptionData,
        recordId: this.recordId
      }).then(() => {
        ElMessage({
          type: 'success',
          message: '新处方添加完毕'
        })
        this.prescriptionDialog = false
        this.getPrescriptionInfor()
      }).catch((result) => { this.$store.state.errorReport(result) })
    }
  },
  async beforeMount () {
    await this.getPrescriptionInfor()
    await axios.get(this.drugNameInforAPI, {
      params: {
        token: localStorage.getItem('token')
      }
    }).then((result) => {
      this.drugNameList = result.data
    }).catch((result) => { this.$store.state.errorReport(result) })
  }
}
</script>
