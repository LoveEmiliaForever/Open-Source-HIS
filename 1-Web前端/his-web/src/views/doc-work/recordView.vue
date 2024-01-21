<template>
  <div id="docWorkRecord">
    <el-form :model="recordInforForm" ref="recordInforForm" :rules="rules">
      <table border class="record-table table">
        <tr class="table-header">
          <td>病人名字</td>
          <td>治疗医生</td>
          <td>病历创建时间</td>
          <td>就诊时间</td>
        </tr>
        <tr>
          <td><el-form-item><el-input placeholder="系统自动生成" disabled></el-input></el-form-item></td>
          <td><el-form-item__content><el-input placeholder="系统自动生成" disabled></el-input></el-form-item__content></td>
          <td><el-form-item><el-input :placeholder="new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()" disabled></el-input></el-form-item></td>
          <td><el-form-item><el-input :placeholder="new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()" disabled></el-input></el-form-item></td>
        </tr>
        <tr class="table-header">
          <td>身高/cm</td>
          <td>体温/°C</td>
          <td>收缩压/mmHg</td>
          <td>发病时间</td>
        </tr>
        <tr>
          <td><el-form-item prop="tall"><el-input v-model="recordInforForm.tall" placeholder="输入身高"></el-input></el-form-item></td>
          <td><el-form-item prop="temperature"><el-input v-model="recordInforForm.temperature" placeholder="输入体温"></el-input></el-form-item></td>
          <td><el-form-item prop="systolicBloodPressure"><el-input v-model="recordInforForm.systolicBloodPressure" placeholder="输入收缩压"></el-input></el-form-item></td>
          <td rowspan="3"><el-form-item prop="onsetTime"><el-date-picker value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" v-model="recordInforForm.onsetTime" type="datetime" placeholder="选择发病时间"></el-date-picker></el-form-item></td>
        </tr>
        <tr class="table-header">
          <td>体重/kg</td>
          <td>脉率/次每分钟</td>
          <td>舒张压/mmHg</td>
        </tr>
        <tr>
          <td><el-form-item prop="weight"><el-input v-model="recordInforForm.weight" placeholder="输入体重"></el-input></el-form-item></td>
          <td><el-form-item prop="pulseRate"><el-input v-model="recordInforForm.pulseRate" placeholder="输入脉率"></el-input></el-form-item></td>
          <td><el-form-item prop="diastolicBloodPressure"><el-input v-model="recordInforForm.diastolicBloodPressure" placeholder="输入舒张压"></el-input></el-form-item></td>
        </tr>
        <tr class="table-header">
          <td colspan="4">既往史</td>
        </tr>
        <tr class="table-big-td">
          <td colspan="4"><el-form-item prop="PH"><el-input type="textarea" v-model="recordInforForm.PH" placeholder="输入既往史"></el-input></el-form-item></td>
        </tr>
        <tr class="table-header">
          <td colspan="4">现病史</td>
        </tr>
        <tr class="table-big-td">
          <td colspan="4"><el-form-item prop="HPI"><el-input type="textarea" v-model="recordInforForm.HPI" placeholder="输入现病史"></el-input></el-form-item></td>
        </tr>
        <tr class="table-header">
          <td colspan="4">主诉</td>
        </tr>
        <tr class="table-big-td">
          <td colspan="4"><el-form-item prop="chiefComplaint"><el-input type="textarea" v-model="recordInforForm.chiefComplaint" placeholder="输入主诉"></el-input></el-form-item></td>
        </tr>
        <tr class="table-header">
          <td colspan="4">诊断</td>
        </tr>
        <tr class="table-big-td">
          <td colspan="4"><el-form-item prop="diagnosis"><el-input type="textarea" v-model="recordInforForm.diagnosis" placeholder="输入诊断"></el-input></el-form-item></td>
        </tr>
        <tr class="table-header">
          <td colspan="4">医嘱</td>
        </tr>
        <tr class="table-big-td">
          <td colspan="4"><el-form-item prop="doctorAdvice"><el-input type="textarea" v-model="recordInforForm.doctorAdvice" placeholder="输入医嘱"></el-input></el-form-item></td>
        </tr>
      </table>
      <el-form-item>
        <el-button type="primary" @click="submitRecord">创建或更改病历</el-button>
        <el-button @click="this.$refs.recordInforForm.resetFields()">重置内容</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style>
#docWorkRecord .record-table{
  border-collapse: collapse;
  text-align: center;
  margin: 2rem 10%;
  width: 80%;
}
#docWorkRecord .table-header td{
  font-weight: 700;
  padding: 0.5rem;
}
#docWorkRecord .el-form-item{
  margin: 0;
}
#docWorkRecord .el-form-item__content{
  display: flex;
  justify-content: space-around;
}
#docWorkRecord .el-form-item__content button{
  width: 30%;
}
</style>

<script>
import { mapMutations, mapState } from 'vuex'
import axios from 'axios'
import { ElMessage } from 'element-plus'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'recordView',
  data () {
    return {
      recordInforForm: {
        patientName: '',
        treatingDoctor: '',
        recordCreatedDate: '',
        visitDate: '',
        tall: '',
        weight: '',
        temperature: '',
        pulseRate: '',
        systolicBloodPressure: '',
        diastolicBloodPressure: '',
        onsetTime: '',
        PH: '',
        HPI: '',
        chiefComplaint: '',
        diagnosis: '',
        doctorAdvice: ''
      },
      rules: {
        tall: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        weight: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        temperature: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        pulseRate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        systolicBloodPressure: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        diastolicBloodPressure: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        onsetTime: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        PH: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        HPI: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        chiefComplaint: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        diagnosis: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        doctorAdvice: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      patientChangeFlag: true,
      setRecordInforAPI: '/doc-work/record/setRecordInfor'
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
  watch: {
    patientId () {
      this.$refs.recordInforForm.resetFields()
      this.patientChangeFlag = true
    }
  },
  methods: {
    ...mapMutations('docWork', ['setPatientId', 'setRecordId']),
    submitRecord () {
      this.$refs.recordInforForm.validate()
        .then(() => {
          if (this.patientChangeFlag) {
            axios.post(this.setRecordInforAPI, {
              token: localStorage.getItem('token'),
              patientId: this.patientId,
              recordCreatedDate: new Date(),
              visitDate: new Date(),
              tall: this.recordInforForm.tall,
              weight: this.recordInforForm.weight,
              temperature: this.recordInforForm.temperature,
              pulseRate: this.recordInforForm.pulseRate,
              systolicBloodPressure: this.recordInforForm.systolicBloodPressure,
              diastolicBloodPressure: this.recordInforForm.diastolicBloodPressure,
              onsetTime: this.recordInforForm.onsetTime,
              PH: this.recordInforForm.PH,
              HPI: this.recordInforForm.HPI,
              chiefComplaint: this.recordInforForm.chiefComplaint,
              diagnosis: this.recordInforForm.diagnosis,
              doctorAdvice: this.recordInforForm.doctorAdvice
            }).then((result) => {
              ElMessage({
                type: 'success',
                message: '成功创建病历'
              })
              this.recordId = result.data.recordId
              this.patientChangeFlag = false
            }).catch((result) => { this.$store.state.errorReport(result) })
          } else {
            axios.post(this.setRecordInforAPI, {
              token: localStorage.getItem('token'),
              recordId: this.recordId,
              patientId: this.patientId,
              recordCreatedDate: new Date(),
              visitDate: new Date(),
              tall: this.recordInforForm.tall,
              weight: this.recordInforForm.weight,
              temperature: this.recordInforForm.temperature,
              pulseRate: this.recordInforForm.pulseRate,
              systolicBloodPressure: this.recordInforForm.systolicBloodPressure,
              diastolicBloodPressure: this.recordInforForm.diastolicBloodPressure,
              onsetTime: this.recordInforForm.onsetTime,
              PH: this.recordInforForm.PH,
              HPI: this.recordInforForm.HPI,
              chiefComplaint: this.recordInforForm.chiefComplaint,
              diagnosis: this.recordInforForm.diagnosis,
              doctorAdvice: this.recordInforForm.doctorAdvice
            }).then((result) => {
              ElMessage({
                type: 'success',
                message: '修改病历成功'
              })
            }).catch((result) => { this.$store.state.errorReport(result) })
          }
        }).catch(() => {})
    }
  },
  async beforeMount () {}
}
</script>
