<template>
  <el-container id="signUp-main">
    <el-container id="signUp-body">
      <el-header>
        <p>患者账号注册</p>
      </el-header>
      <el-form :model="signUpForm" ref="signUpForm" :rules="rules">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="signUpForm.name" type="text" placeholder="输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" size="normal" prop="gender">
          <el-radio-group v-model="signUpForm.gender">
            <el-radio label="男" border>
              男
            </el-radio>
            <el-radio label="女" border>
              女
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNum">
          <el-input v-model="signUpForm.idNum" placeholder="输入身份证号码" type="text"></el-input>
        </el-form-item>
        <el-form-item label="生日日期" size="normal" prop="birth">
          <el-date-picker v-model="signUpForm.birth" type="date" placeholder="选择您的生日日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNum">
          <el-input v-model="signUpForm.phoneNum" placeholder="输入联系电话"></el-input>
        </el-form-item>
        <el-form-item class="signUp-form-button">
          <el-button type="primary" @click="onSignUp">注册患者账号</el-button>
        </el-form-item>
        <el-form-item class="signUp-form-button">
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-container>
  </el-container>
</template>

<style>
#signUp-main{
  width: 100vw;
  height: 100vh;
  background-image: url(../assets/images/注册页面背景.webp);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
#signUp-body{
  width: 30%;
  height: 70%;
  background-color: white;
  border-radius: 1rem;
  padding: 3%;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.158);
  display: flex;
  justify-content: center;
  align-items: center;
  flex: none;
}
#signUp-body .el-header{
  height: 20%;
  font-size: 3rem;
  color:rgba(0, 0, 0, 0.678);
  font-weight: 700;
}
#signUp-body .el-form{
  width:100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
#signUp-body .el-form .el-input{
  flex-grow: 1;
  height: 100%;
}
#signUp-body .el-form label{
  height: 100%;
  display: flex;
  align-items: center;
}
#signUp-body .el-form .el-form-item{
  flex-grow: 1;
}
.el-form-item__content{
  height: 100%;
}
#signUp-body .el-radio-group{
  width: 100%;
  height: 100%;
  justify-content: space-between;
}
#signUp-body .el-radio{
  width: 45%;
  height: 100%;
  margin: 0;
}
#signUp-body .signUp-form-button{
  display: flex;
  justify-content: center;
  align-items: center;
}
#signUp-body .signUp-form-button *{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script>
import { ElNotification } from 'element-plus'
export default {
  name: 'signUpView',
  data () {
    return {
      signUpForm: {
        name: '',
        gender: '',
        idNum: '',
        birth: '',
        phoneNum: ''
      },
      rules: {
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
      signUpInforAPI: '/sign-up/register'
    }
  },
  methods: {
    onSignUp () {
      this.$refs.signUpForm.validate()
        .then(() => {
          this.axios.post(this.signUpInforAPI, {
            patientName: this.name,
            patientGender: this.gender,
            patientIdNum: this.idNum,
            patientBirth: this.birth,
            patientPhoneNum: this.phoneNum
          })
            .then(() => {
              ElNotification({
                duration: 1500,
                title: '注册成功',
                message: '患者账号注册成功！',
                position: 'bottom-right',
                type: 'success'
              })
              this.$router.push({ name: 'login' })
            })
            .catch((result) => {
              if (result.response) {
                ElNotification({
                  dangerouslyUseHTMLString: true,
                  duration: 1500,
                  title: '错误',
                  message: result.response.data,
                  position: 'bottom-right',
                  type: 'error'
                })
              } else {
                ElNotification({
                  duration: 1500,
                  title: '未知错误',
                  message: '出现未知错误',
                  position: 'bottom-right',
                  type: 'error'
                })
              }
            })
        })
        .catch(() => {})
    },
    onCancel () {
      this.$router.push({ name: 'login' })
    }
  }
}
</script>
