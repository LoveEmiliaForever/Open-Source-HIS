<template>
  <div id="windowWorkPatientInformation">
    <el-tabs tab-position="right">
      <el-tab-pane label="创建新病人档案">
        <p>创建新的病人档案</p>
        <el-form :model="createForm" ref="createForm" :rules="createFormRules">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="createForm.name" type="text" placeholder="输入患者姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="createForm.gender">
              <el-radio label="男" border>
                男
              </el-radio>
              <el-radio label="女" border>
                女
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="身份证号" prop="idNum">
            <el-input v-model="createForm.idNum" placeholder="输入患者身份证号码" type="text"></el-input>
          </el-form-item>
          <el-form-item label="生日日期" prop="birth">
            <el-date-picker value-format="YYYY-MM-DD" v-model="createForm.birth" type="date" placeholder="选择患者生日日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="联系电话" prop="phoneNum">
            <el-input v-model="createForm.phoneNum" placeholder="输入患者联系电话"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="createPatient">注册患者账号</el-button>
            <el-button @click="this.$refs.createForm.resetFields()">重置内容</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改病人档案">
        <p>修改病人档案</p>
        <el-form :model="reviseSearchForm" ref="reviseSearchForm" :rules="reviseSearchFormRules" v-if="reviseFormShowFlag">
          <el-form-item label="患者姓名" prop="patientName">
            <el-input v-model="patientName" placeholder="输入患者名字"></el-input>
          </el-form-item>
          <el-form-item label="患者身份证号" prop="idNum">
            <el-input v-model="idNum" placeholder="输入患者身份证"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchPatient">查找病人档案</el-button>
          </el-form-item>
        </el-form>
        <el-form :model="reviseForm" ref="reviseForm" :rules="reviseFormRules" v-if="!reviseFormShowFlag">
          <el-form-item label="患者姓名" disabled>
            <el-input v-model="patientName" placeholder="患者名字"></el-input>
          </el-form-item>
          <el-form-item label="患者身份证号" disabled>
            <el-input v-model="idNum" placeholder="患者身份证"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="reviseForm.gender">
              <el-radio label="男" border>
                男
              </el-radio>
              <el-radio label="女" border>
                女
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日日期" prop="birth">
            <el-date-picker value-format="YYYY-MM-DD" v-model="reviseForm.birth" type="date" placeholder="选择患者生日日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="联系电话" prop="phoneNum">
            <el-input v-model="reviseForm.phoneNum" placeholder="输入患者联系电话"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="revisePatient">修改信息</el-button>
            <el-button @click="this.reviseFormShowFlag = true">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
#windowWorkPatientInformation > .el-tabs > .el-tabs__header{
  width: 20%;
  margin-left: 3%;
}
#windowWorkPatientInformation > .el-tabs p{
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-left: 3%;
}
#windowWorkPatientInformation .el-form{
  margin-top: 5rem;
  padding: 0 20%;
}
#windowWorkPatientInformation .el-form .el-form-item{
  margin-bottom: 1rem;
}
</style>

<script>
import { mapMutations, mapState } from 'vuex'
import axios from 'axios'
import { ElMessage } from 'element-plus'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'patientInformationView',
  data () {
    return {
      createForm: {
        name: '',
        gender: '',
        idNum: '',
        birth: '',
        phoneNum: ''
      },
      createFormRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        idNum: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { pattern: /^\d+$/, message: '请输入正确的身份证号', trigger: 'blur' }
        ],
        birth: [
          { required: true, message: '请选择生日', trigger: 'blur' }
        ],
        phoneNum: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ]
      },
      reviseFormShowFlag: true,
      reviseSearchForm: {
        patientName: '',
        idNum: ''
      },
      reviseSearchFormRules: {
        patientName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        idNum: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      reviseForm: {
        gender: '',
        birth: '',
        phoneNum: ''
      },
      reviseFormRules: {
        gender: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        birth: [
          { required: true, message: '请选择生日', trigger: 'blur' }
        ],
        phoneNum: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ]
      },
      createPatientAPI: '/window-work/patient-information/createPatient',
      searchPatientAPI: '/window-work/patient-information/searchPatient',
      revisePatientAPI: '/window-work/patient-information/revisePatient'
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
    createPatient () {
      this.$refs.createForm.validate()
        .then(() => {
          axios.post(this.createPatientAPI, {
            token: localStorage.getItem('token'),
            name: this.createForm.name,
            gender: this.createForm.gender,
            idNum: this.createForm.idNum,
            birth: this.createForm.birth,
            phoneNum: this.createForm.phoneNum
          }).then(() => {
            this.$refs.createForm.resetFields()
            ElMessage({
              type: 'success',
              message: '新的患者档案创建成功！'
            })
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    },
    searchPatient () {
      this.reviseSearchForm.patientName = this.patientName
      this.reviseSearchForm.idNum = this.idNum
      this.$refs.reviseSearchForm.validate()
        .then(() => {
          axios.get(this.searchPatientAPI, {
            params: {
              token: localStorage.getItem('token'),
              patientName: this.reviseSearchForm.patientName,
              idNum: this.reviseSearchForm.idNum
            }
          }).then((result) => {
            this.reviseForm.gender = result.data.gender
            this.reviseForm.birth = result.data.birth
            this.reviseForm.phoneNum = result.data.phoneNum
            this.reviseFormShowFlag = false
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    },
    revisePatient () {
      this.$refs.reviseForm.validate()
        .then(() => {
          axios.post(this.revisePatientAPI, {
            token: localStorage.getItem('token'),
            name: this.patientName,
            gender: this.reviseForm.gender,
            idNum: this.idNum,
            birth: this.reviseForm.birth,
            phoneNum: this.reviseForm.phoneNum
          }).then(() => {
            this.reviseFormShowFlag = true
            ElMessage({
              type: 'success',
              message: '患者档案修改成功！'
            })
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    }
  }
}
</script>
