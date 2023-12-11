<template>
  <div id="vocationApply">
    <div id="vocationApplyShower">
      <p>请假申请查看</p>
      <el-collapse v-model="activeNames" accordion v-if="applyInfors">
        <el-collapse-item v-for="(item, index) in Object.entries(applyInfors)" :key="index" :title="'请假时间段：' + item[1].vocationRange" :name="index" :class="grantBgClass(item[1].grantStatus)">
          <p>{{ item[1].applicantReason }}</p>
          <p :class="grantClass(item[1].grantStatus)">审批状态：{{ item[1].grantStatus }}</p>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div id="vocationApplySubmit">
      <el-form :model="vocationApplyForm" ref="vocationApplyForm" :rules="rules" label-position="top">
        <el-form-item label="请假时间段：" prop="vocationRange">
          <el-date-picker v-model="vocationApplyForm.vocationRange" type="datetimerange" start-placeholder="请假开始时间" end-placeholder="请假结束时间" range-separator="到" value-format="YYYY-MM-DD HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="请假理由：" prop="applicantReason">
          <el-input v-model="vocationApplyForm.applicantReason" placeholder="输入请假原因" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">提交申请</el-button>
          <el-button @click="reset">重置内容</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style>
#vocationApply .grant-success{
  color: #529b2e;
}
#vocationApply .grant-reject{
  color:#c45656;
}
#vocationApply .grant-error{
  color:#b88230;
}
#vocationApply .grant-not{
  color: #73767a;
}
#vocationApply .el-collapse-item__header,.el-collapse-item__wrap{
  padding-left: 1rem !important;
}
#vocationApply .grant-bg-success .el-collapse-item__header,.grant-bg-success .el-collapse-item__wrap{
  background-color: #f0f9eb;
}
#vocationApply .grant-bg-reject .el-collapse-item__header,.grant-bg-reject .el-collapse-item__wrap{
  background-color: #fef0f0;
}
#vocationApply .grant-bg-error .el-collapse-item__header,.grant-bg-error .el-collapse-item__wrap{
  background-color: #fdf6ec;
}
#vocationApply .grant-bg-not .el-collapse-item__header,.grant-bg-not .el-collapse-item__wrap{
  background-color: #f4f4f5;
}
#vocationApply{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
#vocationApplyShower{
  height: 38vh;
  width: 95%;
  overflow: scroll;
}
#vocationApplySubmit{
  margin-top: 1vh;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
#vocationApplySubmit .el-form-item__content{
  display: flex;
  justify-content: space-around;
}
#vocationApplySubmit .el-button{
  width: 40%;
}
</style>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'

export default {
  name: 'vocationApplyView',
  data () {
    return {
      vocationApplyForm: {
        vocationRange: '',
        applicantReason: ''
      },
      rules: {
        vocationRange: [
          { required: true, message: '选择请假时间段', trigger: 'blur' }
        ],
        applicantReason: [
          { required: true, message: '请输入请假理由', trigger: 'blur' }
        ]
      },
      applyInfors: false,
      activeNames: 0,
      vocationApplyAPI: '/user/vocation-apply/submitApply',
      applyInforAPI: '/user/vocation-apply/applyInfor'
    }
  },
  methods: {
    grantClass (grantStatus) {
      switch (grantStatus) {
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
    grantBgClass (grantStatus) {
      switch (grantStatus) {
        case '同意':
          return 'grant-bg-success'
        case '拒绝':
          return 'grant-bg-reject'
        case '超时：系统自动拒绝':
          return 'grant-bg-error'
        default:
          return 'grant-bg-not'
      }
    },
    submit () {
      this.$refs.vocationApplyForm.validate()
        .then(() => {
          axios.post(this.vocationApplyAPI, {
            token: localStorage.getItem('token'),
            vocationRange: this.vocationApplyForm.vocationRange,
            applicantReason: this.vocationApplyForm.applicantReason
          }).then(() => {
            ElMessage({
              message: '申请提交成功！',
              type: 'success'
            })
            axios.get(this.applyInforAPI, {
              params: {
                token: localStorage.getItem('token')
              }
            }).then((result) => {
              this.applyInfors = result.data
            }).catch((result) => { this.$store.state.errorReport(result) })
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    },
    reset () {
      this.$refs.vocationApplyForm.resetFields()
    }
  },
  async beforeMount () {
    await axios.get(this.applyInforAPI, {
      params: {
        token: localStorage.getItem('token')
      }
    }).then((result) => {
      this.applyInfors = result.data
    }).catch((result) => { this.$store.state.errorReport(result) })
  }
}
</script>
