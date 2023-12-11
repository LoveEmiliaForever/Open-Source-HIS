<template>
  <div>
    <el-table :data="applyInfor">
      <el-table-column prop="tiemRange" label="手术时间段">
      </el-table-column>
      <el-table-column align="right">
        <template #default="scope">
          <el-button type="success" @click="dialogo = true; selectedOperationId = scope.row.operationId">同意</el-button>
          <el-button type="danger" @click="reject(scope.row.operationId)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="选择手术室" v-model="dialogo" @close="selectedRoom = ''">
      <el-select v-model="selectedRoom" placeholder="选择手术室">
        <el-option label="1" :value="1"></el-option>
        <el-option label="2" :value="2"></el-option>
        <el-option label="3" :value="3"></el-option>
        <el-option label="4" :value="4"></el-option>
        <el-option label="5" :value="5"></el-option>
      </el-select>
      <el-button type="primary" @click="agree">同意手术申请</el-button>
    </el-dialog>
  </div>
</template>

<style></style>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'operationManageView',
  data () {
    return {
      dialogo: false,
      selectedOperationId: '',
      applyInfor: [],
      selectedRoom: '',
      applyInforAPI: '/operation-room-manage/operationManage/applyInfor',
      applyInforChangeAPI: '/operation-room-manage/operationManage/applyInforChange'
    }
  },
  methods: {
    async getApplyInfor () {
      await axios.get(this.applyInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.applyInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    agree () {
      if (this.selectedRoom === '') {
        ElMessage({
          type: 'error',
          message: '选择手术室'
        })
      } else {
        axios.post(this.applyInforChangeAPI, {
          token: localStorage.getItem('token'),
          operationRoom: this.selectedRoom,
          operationId: this.selectedOperationId,
          status: '同意'
        }).then((result) => {
          this.selectedRoom = ''
          this.dialogo = false
          this.getApplyInfor()
          this.$emit('change')
        }).catch((result) => { this.$store.state.errorReport(result) })
      }
    },
    reject (operationId) {
      axios.post(this.applyInforChangeAPI, {
        token: localStorage.getItem('token'),
        operationId: this.selectedOperationId,
        status: '拒绝'
      }).then((result) => {
        this.getApplyInfor()
        this.$emit('change')
      }).catch((result) => { this.$store.state.errorReport(result) })
    }
  },
  async beforeMount () {
    await this.getApplyInfor()
  }
}
</script>
