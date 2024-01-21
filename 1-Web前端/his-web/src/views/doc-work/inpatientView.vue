<template>
  <div id="docWorkInpatient">
    <el-button @click="refresh">刷新数据</el-button>
    <div v-if="!this.recordId">
      <p style="color: red;font-weight: 700;font-size: 1.2rem;">还没有创建并提交病历，先行创建并提交病历后开放此页面</p>
    </div>
    <div v-if="inpatientFlag">
      <p style="color: red;font-weight: 700;font-size: 1.2rem;">病人正在住院中，住院信息如下：</p>
    </div>
    <div v-if="inpatientFlag && this.recordId">
      <table v-if="inpatientInfor" border class="record-table table">
        <tr class="table-header">
          <td>病人名字</td>
          <td>治疗医生</td>
          <td>入院时间</td>
          <td>出院时间</td>
        </tr>
        <tr>
          <td>{{ inpatientInfor.patientName }}</td>
          <td>{{ inpatientInfor.treatingDoctor }}</td>
          <td>{{ inpatientInfor.startDate }}</td>
          <td>{{ inpatientInfor.endDate }}</td>
        </tr>
        <tr class="table-header">
          <td>楼层号</td>
          <td>房间号</td>
          <td colspan="2">床位号</td>
        </tr>
        <tr>
          <td>{{ inpatientInfor.floor }}</td>
          <td>{{ inpatientInfor.room }}</td>
          <td colspan="2">{{ inpatientInfor.bed }}</td>
        </tr>
        <tr class="table-header">
          <td colspan="4">入院理由</td>
        </tr>
        <tr class="table-big-td">
          <td colspan="4">{{ inpatientInfor.inpatientReason }}</td>
        </tr>
        <tr class="table-header">
          <td colspan="4">出院理由</td>
        </tr>
        <tr class="table-big-td">
          <td colspan="4">{{ inpatientInfor.inpatientOutReason }}</td>
        </tr>
      </table>
    </div>
    <div v-if="!inpatientFlag && this.recordId" id="docWorkInpatientForm">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="入院理由" prop="inpatientReason">
          <el-input type="textarea" v-model="form.inpatientReason" placeholder="输入病人入院理由"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交住院</el-button>
          <el-button @click="this.$refs.form.resetFields()">重置内容</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style>
#docWorkInpatient .table{
  border-collapse: collapse;
  text-align: center;
  width: 100%;
}
#docWorkInpatient .record-table{
  border-collapse: collapse;
  text-align: center;
  margin: 2rem 10%;
  width: 80%;
}
#docWorkInpatient .table-header{
  font-weight: 700;
}
#docWorkInpatient .table td{
  padding: 0.5rem;
}
#docWorkInpatient .table-big-td td{
  padding: 3rem 0.5rem;
}
#docWorkInpatientForm{
  margin: 2rem 10%;
  width: 80%;
}
</style>

<script>
import { mapMutations, mapState } from 'vuex'
import axios from 'axios'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'inpatientView',
  data () {
    return {
      inpatientInfor: false,
      inpatientFlag: false,
      form: {
        inpatientReason: ''
      },
      rules: {
        inpatientReason: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      inpatientFlagAPI: '/doc-work/inpatient/inpatientFlag',
      inpatientInforAPI: '/doc-work/inpatient/inpatientInfor',
      inpatientInforSubmitAPI: '/doc-work/inpatient/inpatientInforSubmit'
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
    async refresh () {
      this.getInpatientFlag()
    },
    async getInpatientFlag () {
      await axios.get(this.inpatientFlagAPI, {
        params: {
          token: localStorage.getItem('token'),
          patientId: this.patientId
        }
      }).then((result) => {
        this.inpatientFlag = result.data.inpatientFlag
        if (this.inpatientFlag) {
          this.getInpatientInfor()
        }
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    async getInpatientInfor () {
      await axios.get(this.inpatientInforAPI, {
        params: {
          token: localStorage.getItem('token'),
          patientId: this.patientId
        }
      }).then((result) => {
        this.inpatientInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    onSubmit () {
      this.$refs.form.validate()
        .then(() => {
          axios.post(this.inpatientInforSubmitAPI, {
            token: localStorage.getItem('token'),
            patientId: this.patientId,
            startDate: new Date(),
            inpatientReason: this.form.inpatientReason
          }).then((result) => {
            this.getInpatientInfor()
            this.inpatientFlag = true
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    }
  },
  async beforeMount () {
    await this.getInpatientFlag()
  }
}
</script>
