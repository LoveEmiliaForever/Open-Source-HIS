<template>
  <BasicFrame>
    <div id="technicianDocWork" class="contents">
      <table border class="table">
        <tr class="table-header">
          <td>病人姓名</td>
          <td>病人性别</td>
          <td>病人生日</td>
        </tr>
        <tr>
          <td>{{ patientBasicInfor.name  }}</td>
          <td>{{ patientBasicInfor.gender  }}</td>
          <td>{{ patientBasicInfor.birth  }}</td>
        </tr>
        <tr class="table-header">
          <td>病人身份证号</td>
          <td>病人联系电话</td>
          <td rowspan="2"><el-button type="success" @click="callPatient">当前检查完毕：叫号下一位病人</el-button></td>
        </tr>
        <tr>
          <td>{{ patientBasicInfor.idNum  }}</td>
          <td>{{ patientBasicInfor.phoneNum  }}</td>
        </tr>
      </table>
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="检查结果" prop="checkResult">
          <el-input type="textarea" rows="10" v-model="form.checkResult"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交结果报告</el-button>
        </el-form-item>
      </el-form>
    </div>
  </BasicFrame>
</template>

<style>
#technicianDocWork{
  padding: 1rem;
}
#technicianDocWork .table{
  border-collapse: collapse;
  text-align: center;
  width: 100%;
  margin-bottom: 2rem;
}
#technicianDocWork .table-header{
  font-weight: 700;
}
#technicianDocWork .table td{
  padding: 0.5rem;
}
</style>

<script>
import BasicFrame from '@/components/basicFrame.vue'
import { mapState } from 'vuex'
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  name: 'technicianDocWorkView',
  components: {
    BasicFrame
  },
  data () {
    return {
      patientBasicInfor: {
        name: '',
        gender: '',
        idNum: '',
        birth: '',
        phoneNum: ''
      },
      patientId: '',
      checkId: '',
      form: {
        checkResult: ''
      },
      rules: {
        checkResult: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      formFlag: false,
      firstFlag: true,
      registerInforAPI: '/technician-doc-work/registerInfor',
      patientBasicInforAPI: '/technician-doc-work/patientBasicInfor',
      checkInforChangeAPI: '/technician-doc-work/checkInforChange'
    }
  },
  computed: mapState(['childrenPermissions']),
  methods: {
    async callPatient () {
      if (!this.formFlag && !this.firstFlag) {
        ElMessage({
          type: 'error',
          message: '未提交报告'
        })
      } else {
        await axios.get(this.registerInforAPI, {
          params: {
            token: localStorage.getItem('token')
          }
        }).then((result) => {
          ElMessage({
            type: 'success',
            message: '已叫号下一个病人'
          })
          this.patientId = result.data.patientId
          this.checkId = result.data.checkId
          this.formFlag = false
          this.firstFlag = false
          this.$refs.form.resetFields()
          this.getBasicInfor()
        }).catch((result) => { this.$store.state.errorReport(result) })
      }
    },
    async getBasicInfor () {
      await axios.get(this.patientBasicInforAPI, {
        params: {
          token: localStorage.getItem('token'),
          patientId: this.patientId
        }
      }).then((result) => {
        this.patientBasicInfor.name = result.data.name
        this.patientBasicInfor.gender = result.data.gender
        this.patientBasicInfor.idNum = result.data.idNum
        this.patientBasicInfor.birth = result.data.birth
        this.patientBasicInfor.phoneNum = result.data.phoneNum
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    onSubmit () {
      this.$refs.form.validate()
        .then(() => {
          axios.post(this.checkInforChangeAPI, {
            token: localStorage.getItem('token'),
            checkId: this.checkId,
            checkResult: this.checkResult
          }).then(() => {
            this.formFlag = true
            ElMessage({
              type: 'success',
              message: '检查报告已提交'
            })
          }).catch((result) => { this.$store.state.errorReport(result) })
        }).catch(() => {})
    }
  },
  async beforeMount () {
    await this.callPatient()
  }
}
</script>
