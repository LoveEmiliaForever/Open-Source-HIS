<template>
  <BasicFrame>
    <div id="patientInfor" class="contents">
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
          <td rowspan="2"><el-button type="success" @click="dialogFlag = true">更改个人信息的联系电话</el-button></td>
        </tr>
        <tr>
          <td>{{ patientBasicInfor.idNum  }}</td>
          <td>{{ patientBasicInfor.phoneNum  }}</td>
        </tr>
      </table>
      <el-dialog title="更改联系电话号码" @close="dialogFlag = false" v-model="dialogFlag">
        <el-form :model="form" ref="form" :rules="rules">
          <el-form-item label="新的电话号码" prop="phoneNum">
            <el-input v-model="form.phoneNum"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </BasicFrame>
</template>

<style>
#patientInfor{
  padding: 2rem;
}
#patientInfor .table{
  border-collapse: collapse;
  text-align: center;
  width: 100%;
  font-size: 2rem;
}
#patientInfor .table-header{
  font-weight: 700;
}
#patientInfor .table td{
  padding: 2rem;
}
</style>

<script>
import axios from 'axios'
import BasicFrame from '@/components/basicFrame.vue'
import { mapState } from 'vuex'
import { ElMessage } from 'element-plus'

export default {
  name: 'userView',
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
      patientBasicInforAPI: '/patient/single-information/patientBasicInfor',
      dialogFlag: false,
      form: {
        phoneNum: ''
      },
      rules: {
        phoneNum: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      changePhoneNumAPI: '/patient/single-information/changePhoneNumAPI'
    }
  },
  computed: mapState(['childrenPermissions']),
  methods: {
    async getBasicInfor () {
      await axios.get(this.patientBasicInforAPI, {
        params: {
          token: localStorage.getItem('token')
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
          axios.post(this.changePhoneNumAPI, {
            token: localStorage.getItem('token'),
            phoneNum: this.form.phoneNum
          }).then(() => {
            ElMessage({
              type: 'success',
              message: '更改成功'
            })
            this.getBasicInfor()
            this.dialogFlag = false
            this.$refs.form.resetFields()
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    }
  },
  async beforeMount () {
    await this.getBasicInfor()
  }
}
</script>
