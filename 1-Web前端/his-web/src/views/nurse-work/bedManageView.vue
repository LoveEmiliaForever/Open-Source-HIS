<template>
  <div id="nurseWorkBedManage">
    <el-tabs>
      <el-tab-pane label="分管床位信息">
        <el-table :data="bedInfor">
          <el-table-column type="expand">
            <template #default="inpatientProps">
              <table border class="record-table table">
                <tr class="table-header">
                  <td>病人名字</td>
                  <td>治疗医生</td>
                  <td colspan="2">入院时间</td>
                </tr>
                <tr>
                  <td>{{ inpatientProps.row.patientName }}</td>
                  <td>{{ inpatientProps.row.treatingDoctor }}</td>
                  <td colspan="2">{{ inpatientProps.row.startDate }}</td>
                </tr>
                <tr class="table-header">
                  <td>楼层号</td>
                  <td>房间号</td>
                  <td colspan="2">床位号</td>
                </tr>
                <tr>
                  <td>{{ inpatientProps.row.floor }}</td>
                  <td>{{ inpatientProps.row.room }}</td>
                  <td colspan="2">{{ inpatientProps.row.bed }}</td>
                </tr>
                <tr class="table-header">
                  <td colspan="4">入院理由</td>
                </tr>
                <tr class="table-big-td">
                  <td colspan="4">{{ inpatientProps.row.inpatientReason }}</td>
                </tr>
                <tr class="table-header">
                  <td colspan="4">口服与外用药</td>
                </tr>
                <tr>
                  <td colspan="4">
                    <el-table :data="inpatientProps.row.prescription" border class="table-complex">
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
                  </td>
                </tr>
              </table>
            </template>
          </el-table-column>
          <el-table-column label="床位" prop="bedName">
          </el-table-column>
          <el-table-column label="病人" prop="patientName">
          </el-table-column>
          <el-table-column label="主治医生" prop="treatingDoctor">
          </el-table-column>
          <el-table-column label="入院时间" prop="startDate">
          </el-table-column>
          <el-table-column align="right">
            <template #default="scope">
              <el-button v-if="scope.row.clearStatus === '未清洁'" type="success" @click="bedClear(scope.row.bedName)">清洁签到</el-button>
              <el-button v-else type="success" plain disabled>已清洁</el-button>
              <el-button @click="bedExchangeDialog = true; selectedBedName = scope.row.bedName;">提交换床申请</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog v-model="bedExchangeDialog" title="换床申请" @close="this.$refs.form.resetFields()">
          <el-form :model="form" ref="form" :rules="rules">
            <el-form-item label="目标床位" prop="targetName">
              <el-input v-model="form.targetName"></el-input>
            </el-form-item>
            <el-form-item label="换床理由" prop="applicantReason">
              <el-input type="textarea" v-model="form.applicantReason"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="药品注射管理">
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
                <el-table-column prop="bedName" label="床位"></el-table-column>
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
      </el-tab-pane>
      <el-tab-pane label="换床申请查看">
        <div>
          <el-table :data="allApplyInfor" v-if="allApplyInfor" :row-class-name="tableRowClassName">
            <el-table-column type="expand" fixed>
              <template #default="props">
                <div class="applyDetail">
                  <p>换床理由：{{ props.row.applicantReason }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="申请床位" prop="applicantName">
            </el-table-column>
            <el-table-column label="目标床位" prop="targetName">
            </el-table-column>
            <el-table-column label="申请提交时间" prop="applyTime" sortable>
            </el-table-column>
            <el-table-column label="审批状态" prop="grantStatus" :filters="statusFilters" :filter-method="statusFilterMethod">
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
#nurseWorkBedManage .table{
  border-collapse: collapse;
  text-align: center;
  width: 100%;
}
#nurseWorkBedManage .record-table{
  border-collapse: collapse;
  text-align: center;
  margin: 2rem 10%;
  width: 80%;
}
#nurseWorkBedManage .table-header{
  font-weight: 700;
}
#nurseWorkBedManage .table td{
  padding: 0.5rem;
}
#nurseWorkBedManage .table-big-td td{
  padding: 3rem 0.5rem;
}
#nurseWorkBedManage .grant-success{
  color: #529b2e;
}
#nurseWorkBedManage .grant-reject{
  color:#c45656;
}
#nurseWorkBedManage .grant-error{
  color:#b88230;
}
#nurseWorkBedManage .grant-not{
  color: #73767a;
}
#nurseWorkBedManage .applyDetail{
  padding: 0.5rem 1.5rem;
}
#nurseWorkBedManage .applyDetail p{
  margin-bottom: 1rem;
}
</style>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'bedManageView',
  data () {
    return {
      bedInfor: [],
      bedExchangeDialog: false,
      selectedBedName: '',
      form: {
        targetName: '',
        applicantReason: ''
      },
      rules: {
        targetName: [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^\d+-\d+-\d+$/, message: '床位名应为：数字-数字-数字', trigger: 'blur' }
        ],
        applicantReason: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      injectionInfor: [],
      bedInforAPI: '/nurse-work/bedManage/bedInfor',
      bedClearAPI: '/nurse-work/bedManage/bedClear',
      exchangeBedAPI: '/nurse-work/bedManage/exchangeBed',
      injectionInforAPI: '/nurse-work/bedManage/injectionInfor',
      injectStatusChangeAPI: '/nurse-work/bedManage/injectStatusChange',
      allApplyInfor: false,
      ExchangeApplyInforAPI: '/nurse-work/bedManage/ExchangeApplyInfor'
    }
  },
  computed: {
    statusFilters: {
      get () {
        const result = []
        const temp = []
        for (const item of ['同意', '拒绝', '超时：系统自动拒绝', '待审批']) {
          temp.push(item)
        }
        for (const item of [...new Set(temp)]) {
          const tempObj = {}
          tempObj.text = item
          tempObj.value = item
          result.push(tempObj)
        }
        return result
      }
    }
  },
  methods: {
    async getBedInfor () {
      await axios.get(this.bedInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.bedInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    async getInjectionInfor () {
      await axios.get(this.injectionInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.injectionInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    bedClear (bedName) {
      axios.post(this.bedClearAPI, {
        token: localStorage.getItem('token'),
        bedName: bedName,
        date: new Date().toLocaleDateString()
      }).then(() => {
        ElMessage({
          type: 'success',
          message: '今日清洁签到成功'
        })
        this.getBedInfor()
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    onSubmit () {
      this.$refs.form.validate().then(() => {
        axios.post(this.exchangeBedAPI, {
          token: localStorage.getItem('token'),
          applicantName: this.selectedBedName,
          targetName: this.form.targetName,
          applyTime: new Date(),
          applicantReason: this.form.applicantReason
        }).then(() => {
          ElMessage({
            type: 'success',
            message: '提交成功'
          })
          this.selectedBedName = ''
          this.$refs.form.resetFields()
          this.bedExchangeDialog = false
        }).catch((result) => { this.$store.state.errorReport(result) })
      }).catch(() => {})
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
    },
    async getAllApplyInfor () {
      await axios.get(this.ExchangeApplyInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.allApplyInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    tableRowClassName ({ row, rowIndex }) {
      switch (row.grantStatus) {
        case '同意':
          return 'grant-success'
        case '拒绝':
          return 'grant-reject'
        case '超时：系统自动拒绝':
          return 'grant-error'
        default:
          return 'grant-not'
      }
    },
    statusFilterMethod (value, row) {
      return row.grantStatus === value
    }
  },
  async beforeMount () {
    await this.getBedInfor()
    await this.getInjectionInfor()
    await this.getAllApplyInfor()
  }
}
</script>
