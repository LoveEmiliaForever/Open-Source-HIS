<template>
  <div id="docWorkOperation">
    <div v-if="!this.recordId">
      <p style="color: red;font-weight: 700;font-size: 1.2rem;">还没有创建并提交病历，先行创建并提交病历后开放此页面</p>
    </div>
    <div v-if="this.recordId">
      <el-table :data="this.operation" border>
        <el-table-column type="expand">
          <template #default="props4">
            <el-table :data="props4.row.participant" border>
              <el-table-column type="expand">
                <template #default="props5">
                  <p>手术报告：</p>
                  <p>{{ props5.row.participantReport }}</p>
                </template>
              </el-table-column>
              <el-table-column prop="participantName" label="参与者姓名"></el-table-column>
              <el-table-column prop="participantJob" label="参与者职务"></el-table-column>
            </el-table>
            <p>手术报告：</p>
            <p>{{ props4.row.operationReport }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="operationDoctor" label="主刀医生"></el-table-column>
        <el-table-column prop="operationDescription" label="手术简介"></el-table-column>
      </el-table>
      <el-button type="primary" @click="this.checkDialog = true">新增手术</el-button>
      <el-dialog v-model="checkDialog" title="添加新手术" @close="this.$refs.participantForm.resetFields(); this.$refs.operationForm.resetFields(); participant = []">
        <el-form :model="operationForm" ref="operationForm" :rules="operationFormRules">
          <el-form-item prop="operationDateRange" label="手术时间">
            <el-date-picker v-model="operationForm.operationDateRange" type="datetimerange" start-placeholder="手术开始时间" end-placeholder="手术结束时间" range-separator="到" value-format="YYYY-MM-DD hh:mm:ss">
          </el-date-picker>
          </el-form-item>
          <el-form-item prop="operationSummary" label="手术简介">
            <el-input type="textarea" v-model="operationForm.operationSummary" placeholder="输入手术简介"></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="participantForm" ref="participantForm" :rules="rules">
          <el-form-item prop="participantName" label="参与人员姓名">
            <el-autocomplete v-model="participantForm.participantName" :fetch-suggestions="inforSearch" :trigger-on-focus="true"></el-autocomplete>
          </el-form-item>
          <el-form-item prop="participantJob" label="参与人员职务">
            <el-input v-model="participantForm.participantJob" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addNewParticipant">添加新手术成员</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="participant" border>
          <el-table-column prop="participantName" label="参与人员姓名"></el-table-column>
          <el-table-column prop="participantJob" label="参与人员职务"></el-table-column>
        </el-table>
        <el-button type="primary" @click="addNewOperation">添加手术</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<style>
#docWorkOperation button{
  margin-top: 1rem;
}
</style>

<script>
import { mapMutations, mapState } from 'vuex'
import { ElMessage } from 'element-plus'
import axios from 'axios'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'operationView',
  data () {
    return {
      operation: [],
      staffInfor: [],
      staffNameList: [],
      checkDialog: false,
      operationForm: {
        operationDateRange: '',
        operationSummary: ''
      },
      operationFormRules: {
        operationDateRange: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        operationSummary: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      participantForm: {
        participantName: '',
        participantJob: ''
      },
      rules: {
        participantName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        participantJob: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      participant: [],
      operationAPI: '/doc-work/operation/operation',
      staffInforAPI: '/doc-work/operation/staffInfor',
      addOperationAPI: '/doc-work/operation/addOperation'
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
    'participantForm.participantName': {
      handler (newVal, oldVal) {
        this.participantForm.participantJob = ''
        for (const obj of this.staffInfor) {
          if (obj.name === newVal) {
            this.participantForm.participantJob = obj.job
            break
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations('docWork', ['setPatientId', 'setRecordId']),
    async getOperation () {
      await axios.get(this.operationAPI, {
        params: {
          token: localStorage.getItem('token'),
          patientId: this.patientId,
          recordId: this.recordId
        }
      }).then((result) => {
        this.operation = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    inforSearch (queryString, cb) {
      const result = []
      const temp = this.staffNameList.filter(item => item.includes(queryString))
      for (const item of temp) {
        const tempObj = {
          value: item
        }
        result.push(tempObj)
      }
      console.log(result)
      cb(result)
    },
    addNewParticipant () {
      this.$refs.participantForm.validate()
        .then(() => {
          this.participant.push(JSON.parse(JSON.stringify(this.participantForm)))
          this.$refs.participantForm.resetFields()
        }).catch(() => {})
    },
    addNewOperation () {
      this.$refs.operationForm.validate()
        .then(() => {
          axios.post(this.addOperationAPI, {
            token: localStorage.getItem('token'),
            patientId: this.patientId,
            recordId: this.recordId,
            operationDateRange: this.operationForm.operationDateRange,
            operationDescription: this.operationForm.operationSummary,
            participant: this.participant
          }).then(() => {
            ElMessage({
              type: 'success',
              message: '新手术添加完毕'
            })
            this.checkDialog = false
            this.$refs.operationForm.resetFields()
            this.$refs.participantForm.resetFields()
            this.participant = []
            this.getOperation()
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    }
  },
  async beforeMount () {
    await this.getOperation()
    await axios.get(this.staffInforAPI, {
      params: {
        token: localStorage.getItem('token')
      }
    }).then((result) => {
      this.staffInfor = result.data
      const temp = []
      for (const obj of this.staffInfor) {
        temp.push(obj.name)
      }
      this.staffNameList = temp
    }).catch((result) => { this.$store.state.errorReport(result) })
  }
}
</script>
