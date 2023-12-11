<template>
  <div id="docWorkCheck">
    <div v-if="!this.recordId">
      <p style="color: red;font-weight: 700;font-size: 1.2rem;">还没有创建并提交病历，先行创建并提交病历后开放此页面</p>
    </div>
    <div id="docWorkCheckContain" v-if="this.recordId">
      <el-table :data="this.observe" border>
        <el-table-column type="expand">
          <template #default="props3">
            <p>留院观察理由：</p>
            <p>{{ props3.row.observeReason }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="observeItem" label="观察项目"></el-table-column>
        <el-table-column prop="location" label="观察地址"></el-table-column>
      </el-table>
      <el-button type="primary" @click="this.observeDialog = true">新增留院观察</el-button>
      <el-dialog v-model="observeDialog" title="添加新留院观察" @close="this.$refs.observeForm.resetFields()">
        <el-form :model="observeForm" ref="observeForm" :rules="rules">
          <el-form-item prop="observeReason" label="检查项目">
            <el-input v-model="observeForm.observeReason" placeholder="输入留院观察理由"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addNewObserve">添加留院观察</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<style>
#docWorkCheck .el-button{
  margin: 1rem 0;
}
#docWorkCheckContain{
  padding: 2rem;
}
#docWorkCheck .check-image{
  width: 50%;
  margin: 0 25%;
}
#docWorkCheck .check-image img{
  width: 100%;
}
</style>

<script>
import { mapMutations, mapState } from 'vuex'
import axios from 'axios'
import { ElMessage } from 'element-plus'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'observeView',
  data () {
    return {
      observe: false,
      observeDialog: false,
      observeForm: {
        observeReason: ''
      },
      rules: {
        observeReason: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      observeAPI: '/doc-work/observe/observe',
      addObserveAPI: '/doc-work/observe/addObserve'
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
    async getObserve () {
      await axios.get(this.observeAPI, {
        params: {
          token: localStorage.getItem('token'),
          patientId: this.patientId,
          recordId: this.recordId
        }
      }).then((result) => {
        this.observe = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    addNewObserve () {
      this.$refs.observeForm.validate()
        .then(() => {
          axios.post(this.addObserveAPI, {
            token: localStorage.getItem('token'),
            patientId: this.patientId,
            recordId: this.recordId,
            observeReason: this.observeReason
          }).then(() => {
            ElMessage({
              type: 'success',
              message: '新留院观察添加完毕'
            })
            this.observeDialog = false
            this.$refs.observeForm.resetFields()
            this.getObserve()
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    }
  },
  async beforeMount () {
    await this.getObserve()
  }
}
</script>
