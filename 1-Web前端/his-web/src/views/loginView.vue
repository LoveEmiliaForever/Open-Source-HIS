<template>
  <el-container id="login-main">
    <el-header id="login-title">
      <p>HIS账号登录</p>
    </el-header>
    <el-container id="login-body">
      <el-container id="login-form-container">
        <p>HIS系统登录</p>
        <el-form :model="accountForm" ref="accountForm" :rules="rules" id="login-form">
          <el-form-item label="账号：" prop="userNum">
            <el-input type="text" v-model="accountForm.userNum" placeholder="账号为身份证号"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="passWord">
            <el-input type="password" v-model="accountForm.passWord" placeholder="输入密码"></el-input>
          </el-form-item>
          <el-form-item class="login-form-button">
            <el-button type="primary" @click="onLogin">登录</el-button>
          </el-form-item>
          <el-form-item class="login-form-button">
            <el-button @click="onRegister">注册</el-button>
          </el-form-item>
        </el-form>
      </el-container>
    </el-container>
  </el-container>
</template>

<style>
#login-main{
  background-image: url("../assets/images/登录页面背景.webp");
  background-size: cover;
  width: 100vw;
  height: 100vh;
}
#login-title{
  height: 10%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: 700;
  color:rgb(39, 171, 211);
  text-shadow: 0px 3px 10px rgba(0, 0, 0, 0.178);
  visibility: hidden;
}
#login-title > p{
  background-color: white;
  padding: 0.5rem 2rem;
  border-radius: 1rem;
}
#login-body{
  height: 80%;
  width: 100%;
  display: flex;
  justify-content: center;
}
#login-form-container{
  background-color: white;
  width: 50%;
  height: 70%;
  flex: none;
  padding: 2rem;
  margin-top: 5%;
  border-radius: 1rem;
  align-items: center;
  flex-direction: column;
}
#login-form-container p{
  height: 20%;
  font-size: 4rem;
  font-weight: 700;
  color:rgb(39, 171, 211);
  text-shadow: 0px 3px 10px rgba(0, 0, 0, 0.178);
  display: flex;
  justify-content: center;
  align-items: center;
}
#login-form{
  width: 90%;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
#login-form .el-form-item{
  width: 100%;
  flex-grow: 1;
  margin: 0;
  justify-content: center;
  align-items: center;
}
#login-form .el-form-item__content{
  display: flex;
  justify-content: center;
  align-items: center;
}
#login-form .el-form-item__error{
  top: 90% !important;
  font-size: 1rem !important;
}
#login-form .el-form-item *{
  font-size: 1.4rem;
  font-weight: 600;
}
#login-form .el-form-item .el-input{
  height: 70%;
}
#login-form .el-form-item label{
  height: 100%;
  display: flex;
  align-items: center;
}
.login-form-button{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-form-button *{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-form-button .el-button{
  width: 100%;
  height: 70%;
  padding: 0.5rem;
}
</style>

<script>
import axios from 'axios'
import { ElNotification } from 'element-plus'

export default {
  name: 'loginView',
  data () {
    return {
      accountForm: {
        userNum: '',
        passWord: ''
      },
      rules: {
        userNum: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { pattern: /^\d+$/, message: '账号应为纯数字类型', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ]
      },
      tokenInforAPI: '/login/token'
    }
  },
  methods: {
    onLogin () {
      this.$refs.accountForm.validate().then(
        () => {
          this.axios.get(this.tokenInforAPI, {
            params: {
              userNum: this.accountForm.userNum,
              passWord: this.accountForm.passWord
            }
          }).then((result) => {
            ElNotification({
              duration: 1500,
              title: '成功',
              message: '登录成功',
              position: 'bottom-right',
              type: 'success'
            })
            localStorage.setItem('token', result.data.token)
            this.$router.push({ name: 'home' })
          }).catch((result) => {
            if (result.response) {
              ElNotification({
                duration: 1500,
                title: '错误',
                message: result.response.data.error,
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
        }
      ).catch(() => {})
    },
    onRegister () {
      this.$router.push({ name: 'signUp' })
    }
  },
  beforeRouteEnter (to, from, next) {
    if (localStorage.getItem('token') !== null) {
      axios.get('/login', {
        params: {
          token: localStorage.getItem('token')
        }
      })
        .then(() => {
          ElNotification({
            title: '已经登录',
            message: '已经登录',
            position: 'bottom-right',
            type: 'success'
          })
          next((VueSelf) => { VueSelf.$router.push({ name: 'home' }) })
        })
        .catch(() => {
          ElNotification({
            title: '登录信息过期或错误：请重新登录',
            message: 'login visit error',
            position: 'bottom-right',
            type: 'error'
          })
          localStorage.removeItem('token')
          next()
        })
    } else {
      next()
    }
  }
}
</script>
