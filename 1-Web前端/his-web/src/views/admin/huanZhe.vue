<template>
  <BasicFrame>
    <div class="contents">
      <el-button type="primary" size="default" @click="onClick">添加新信息</el-button>
      <el-table :data="keShiInfor">
        <el-table-column label="id" prop="accountId"></el-table-column>
        <el-table-column label="患者名字" prop="name"></el-table-column>
        <el-table-column label="身份证号" prop="idNum"></el-table-column>
        <el-table-column label="电话" prop="phoneNum"></el-table-column>
        <el-table-column label="性别" prop="gender"></el-table-column>
        <el-table-column label="生日" prop="birth"></el-table-column>
      </el-table>
      <el-dialog v-model="flag" title="添加新信息" @close="this.$refs.form.resetFields()">
        <el-form :model="form" ref="form" :rules="rules">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" type="text" placeholder="输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idNum">
            <el-input v-model="form.idNum" placeholder="输入身份证号码" type="text"></el-input>
          </el-form-item>
          <el-form-item label="性别" size="normal" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio label="男" border>
                男
              </el-radio>
              <el-radio label="女" border>
                女
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日日期" size="normal" prop="birth">
            <el-date-picker v-model="form.birth" type="date" placeholder="选择您的生日日期" value-format="YYYY-MM-DD"></el-date-picker>
          </el-form-item>
          <el-form-item label="联系电话" prop="phoneNum">
            <el-input v-model="form.phoneNum" placeholder="输入联系电话"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </BasicFrame>
</template>

<style></style>

<script>
import BasicFrame from '../../components/basicFrame.vue'
import axios from 'axios'
export default {
  name: 'huanZhe',
  components: {
    BasicFrame
  },
  data () {
    return {
      keShiInfor: [],
      keShiAPI: '/huanZhe',
      keShiAddAPI: '/huanZhe/add',
      flag: false,
      form: {
        name: '',
        gender: '',
        idNum: '',
        phoneNum: '',
        birth: ''
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
      }
    }
  },
  methods: {
    async getKeShi () {
      await axios.get(this.keShiAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.keShiInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    onClick () {
      this.flag = true
    },
    onSubmit () {
      this.$refs.form.validate()
        .then(() => {
          axios.post(this.keShiAddAPI, {
            token: localStorage.getItem('token'),
            name: this.form.name,
            idNum: this.form.idNum,
            gender: this.form.gender,
            phoneNum: this.form.phoneNum,
            birth: this.form.birth
          }).then((result) => {
            this.flag = false
            this.$refs.form.resetFields()
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    }
  },
  async beforeMount () {
    await this.getKeShi()
  }
}
</script>
