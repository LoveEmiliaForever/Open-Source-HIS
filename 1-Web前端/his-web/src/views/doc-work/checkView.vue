<template>
  <div id="docWorkCheck">
    <div v-if="!this.recordId">
      <p style="color: red;font-weight: 700;font-size: 1.2rem;">还没有创建并提交病历，先行创建并提交病历后开放此页面</p>
    </div>
    <div id="docWorkCheckContain" v-if="this.recordId">
      <el-table :data="this.checkResult" border>
        <el-table-column type="expand">
          <template #default>
            <div class="check-image">
              <img src="/static/images/医学检查图片.webp">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="checkName" label="检查项目"></el-table-column>
        <el-table-column prop="checkDoctor" label="检查医生"></el-table-column>
      </el-table>
      <el-button type="primary" @click="this.checkDialog = true">新增检查</el-button>
      <el-dialog v-model="checkDialog" title="添加新检查" @close="this.$refs.itemForm.resetFields()">
        <el-form :model="itemForm" ref="itemForm" :rules="rules">
          <el-form-item prop="itemName" label="检查项目">
            <el-autocomplete v-model="itemForm.itemName" :fetch-suggestions="inforSearch" :trigger-on-focus="true"></el-autocomplete>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addNewCheck">添加检查项目</el-button>
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
  name: 'checkView',
  data () {
    return {
      checkResult: false,
      checkDialog: false,
      itemForm: {
        itemName: ''
      },
      rules: {
        itemName: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      checkItemList: [],
      checkResultAPI: '/doc-work/check/checkResult',
      checkItemInforAPI: '/doc-work/check/checkItemInfor',
      addCheckItemAPI: '/doc-work/check/addCheckItem'
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
    async getCheckResult () {
      await axios.get(this.checkResultAPI, {
        params: {
          token: localStorage.getItem('token'),
          patientId: this.patientId,
          recordId: this.recordId
        }
      }).then((result) => {
        this.checkResult = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    inforSearch (queryString, cb) {
      const result = []
      const temp = this.checkItemList.filter(item => item.includes(queryString))
      for (const item of temp) {
        const tempObj = {
          value: item
        }
        result.push(tempObj)
      }
      console.log(result)
      cb(result)
    },
    addNewCheck () {
      this.$refs.itemForm.validate()
        .then(() => {
          axios.post(this.addCheckItemAPI, {
            token: localStorage.getItem('token'),
            patientId: this.patientId,
            recordId: this.recordId,
            itemName: this.itemForm.itemName
          }).then(() => {
            ElMessage({
              type: 'success',
              message: '新检查项目添加完毕'
            })
            this.checkDialog = false
            this.$refs.itemForm.resetFields()
            this.getCheckResult()
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    }
  },
  async beforeMount () {
    await this.getCheckResult()
    await axios.get(this.checkItemInforAPI, {
      params: {
        token: localStorage.getItem('token')
      }
    }).then((result) => {
      this.checkItemList = result.data
    }).catch((result) => { this.$store.state.errorReport(result) })
  }
}
</script>
