<template>
  <div>
    <el-table :data="inpatientInfor">
      <el-table-column prop="patientName" label="住院人"></el-table-column>
      <el-table-column prop="patientId" label="住院人Id"></el-table-column>
      <el-table-column prop="startDate" label="入院时间"></el-table-column>
      <el-table-column align="right" label="可选操作">
        <template #default="scope">
          <el-button type="success" @click="inpatientOutDialog = true; tempPatientId = scope.row.patientId">提交出院</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="出院办理" v-model="inpatientOutDialog" @close="this.$refs.form.resetFields()">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="出院理由" prop="inpatientOutReason">
          <el-input type="textarea" v-model="form.inpatientOutReason"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="inpatientOut(tempPatientId)">提交出院</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style></style>

<script>
import { mapMutations, mapState } from 'vuex'
import axios from 'axios'
import { ElMessage } from 'element-plus'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'inpatientOutView',
  data () {
    return {
      inpatientInfor: '',
      inpatientOutDialog: false,
      tempPatientId: '',
      form: {
        inpatientOutReason: ''
      },
      rules: {
        inpatientOutReason: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      inpatientInforAPI: '/doc-work/inpatient-out/inpatientInfor',
      inpatientInforChangeAPI: '/doc-work/inpatient-out/inpatientInforChange'
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
    async getInpatientInfor () {
      await axios.get(this.inpatientInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.inpatientInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    inpatientOut (patientId) {
      this.$refs.form.validate()
        .then(() => {
          axios.post(this.inpatientInforChangeAPI, {
            token: localStorage.getItem('token'),
            patientId: patientId,
            inpatientOutReason: this.form.inpatientOutReason
          }).then(() => {
            ElMessage({
              type: 'success',
              message: '成功出院'
            })
            this.getInpatientInfor()
            this.$refs.form.resetFields()
            this.inpatientOutDialog = false
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    }
  },
  async beforeMount () {
    await this.getInpatientInfor()
  }
}
</script>
