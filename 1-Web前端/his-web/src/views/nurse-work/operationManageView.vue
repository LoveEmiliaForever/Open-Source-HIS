<template>
  <div>
    <el-table :data="operationInfor">
      <el-table-column prop="patientName" label="被手术人"></el-table-column>
      <el-table-column prop="job" label="本人职务"></el-table-column>
      <el-table-column prop="operationRoom" label="手术室编号"></el-table-column>
      <el-table-column prop="startDate" label="手术开始时间" sortable></el-table-column>
      <el-table-column prop="endDate" label="手术结束时间" sortable></el-table-column>
      <el-table-column prop="status" label="手术状态" :filters="nameFilters" :filter-method="nameFilterMethod"></el-table-column>
      <el-table-column align="right" label="可选操作">
        <template #default="scope">
          <el-button v-if="scope.row.status === '手术已结束'" type="success" @click="operationDialog = true; tempOperationId = scope.row.operationId">提交手术报告</el-button>
          <el-button v-else type="success" disabled>提交手术报告</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提交手术报告" v-model="operationDialog" @close="this.$refs.form.resetFields()">
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item label="手术报告" prop="operationReport">
          <el-input type="textarea" v-model="form.operationReport"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitReport(tempOperationId)">提交手术报告</el-button>
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
  name: 'operationManageView',
  data () {
    return {
      operationInfor: '',
      operationDialog: false,
      tempOperationId: '',
      form: {
        operationReport: ''
      },
      rules: {
        operationReport: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      operationInforAPI: '/nurse-work/operationManage/operationInfor',
      operationInforChangeAPI: '/nurse-work/operationManage/operationInforChange'
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
    },
    nameFilters: {
      get () {
        const result = []
        const temp = []
        for (const item of ['手术未开始', '手术进行中', '手术已结束']) {
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
    ...mapMutations('docWork', ['setPatientId', 'setRecordId']),
    async getOperationInfor () {
      await axios.get(this.operationInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.operationInfor = result.data
        for (const item of this.operationInfor) {
          if (new Date(item.startDate) > new Date() && new Date(item.endDate) > new Date()) {
            item.status = '手术未开始'
          } else if (new Date(item.startDate) <= new Date() && new Date(item.endDate) >= new Date()) {
            item.status = '手术进行中'
          } else if (new Date(item.startDate) < new Date() && new Date(item.endDate) < new Date()) {
            item.status = '手术已结束'
          }
        }
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    submitReport (operationId) {
      this.$refs.form.validate()
        .then(() => {
          axios.post(this.operationInforChangeAPI, {
            token: localStorage.getItem('token'),
            operationId: operationId,
            operationReport: this.form.operationReport
          }).then(() => {
            ElMessage({
              type: 'success',
              message: '成功提交报告'
            })
            this.getOperationInfor()
            this.$refs.form.resetFields()
            this.operationDialog = false
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    },
    nameFilterMethod (value, row) {
      return row.status === value
    }
  },
  async beforeMount () {
    await this.getOperationInfor()
  }
}
</script>
