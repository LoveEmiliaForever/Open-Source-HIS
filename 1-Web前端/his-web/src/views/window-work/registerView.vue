<template>
  <div id="windowWorkRegister">
    <div id="registerInforShower" table-layout="auto">
      <el-table :data="registerInfor">
        <el-table-column prop="patientName" label="挂号人"></el-table-column>
        <el-table-column prop="idNum" label="身份证号"></el-table-column>
        <el-table-column prop="registerDepartment" label="挂号科室"></el-table-column>
        <el-table-column prop="registerDate" label="挂号时间" sortable></el-table-column>
        <el-table-column prop="registerNum" label="挂号-号码"></el-table-column>
      </el-table>
    </div>
    <div id="registerFormShower">
      <el-form :model="registerForm" ref="registerForm" :rules="rules">
        <el-form-item label="挂号人名" prop="patientName">
          <el-input v-model="patientName" placeholder="输入病人名字"></el-input>
        </el-form-item>
        <el-form-item label="挂号人身份证" prop="idNum">
          <el-input v-model="idNum" placeholder="输入病人身份证"></el-input>
        </el-form-item>
        <el-form-item label="挂号科室" prop="registerDepartment" v-if="registerDepartmentInfor">
          <el-select v-model="registerForm.registerDepartment" placeholder="选择挂号科室">
            <el-option v-for="(item, index) of registerDepartmentInfor" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onRegister">立即挂号</el-button>
        </el-form-item>
      </el-form>
      <p v-if="this.registerNum">{{ patientName }} 挂号的号码是：{{ registerNum }}</p>
    </div>
  </div>
</template>

<style>
#windowWorkRegister{
  display: flex;
  justify-content: space-around;
}
#registerInforShower{
  width: 66%;
}
#registerFormShower{
  width: 25%;
  height: 16rem;
  border: 1px solid rgba(0, 0, 0, 0.062);
  border-radius: 1rem;
  padding: 1rem;
  padding-bottom: 0;
}
#registerFormShower p{
  font-size: 1.5rem;
}
</style>

<script>
import { mapMutations, mapState } from 'vuex'
import axios from 'axios'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'registerView',
  data () {
    return {
      registerInfor: [],
      registerDepartmentInfor: false,
      registerForm: {
        patientName: this.patientName2,
        idNum: this.idNum2,
        registerDepartment: ''
      },
      rules: {
        patientName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        idNum: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        registerDepartment: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      registerNum: false,
      departmentInforAPI: '/window-work/register/departmentInfor',
      submitRegisterInforAPI: '/window-work/register/submitRegisterInfor'
    }
  },
  computed: {
    ...mapState('windowWork', ['patientName2', 'idNum2']),
    patientName: {
      get () {
        return this.patientName2
      },
      set (newValue) {
        this.setPatientName(newValue)
      }
    },
    idNum: {
      get () {
        return this.idNum2
      },
      set (newValue) {
        this.setIdNum(newValue)
      }
    }
  },
  methods: {
    ...mapMutations('windowWork', ['setPatientName', 'setIdNum']),
    onRegister () {
      this.registerForm.patientName = this.patientName
      this.registerForm.idNum = this.idNum
      this.$refs.registerForm.validate()
        .then(() => {
          axios.post(this.submitRegisterInforAPI, {
            patientName: this.registerForm.patientName,
            idNum: this.registerForm.idNum,
            registerDepartment: this.registerForm.registerDepartment,
            registerDate: new Date()
          }).then((result) => {
            this.registerNum = result.data.registerNum
            this.registerInfor.push({
              patientName: this.registerForm.patientName,
              idNum: this.registerForm.idNum,
              registerDepartment: this.registerForm.registerDepartment,
              registerDate: `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}`,
              registerNum: this.registerNum
            })
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    }
  },
  async beforeMount () {
    await axios.get(this.departmentInforAPI, {
      params: {
        token: localStorage.getItem('token')
      }
    }).then((result) => {
      this.registerDepartmentInfor = result.data
    }).catch((result) => { this.$store.state.errorReport(result) })
  }
}
</script>
