<template>
  <BasicFrame>
    <div class="contents">
      <el-button type="primary" size="default" @click="onClick">添加新信息</el-button>
      <el-table :data="keShiInfor">
        <el-table-column label="id" prop="accountId"></el-table-column>
        <el-table-column label="医生名字" prop="name"></el-table-column>
        <el-table-column label="身份证号" prop="idNum"></el-table-column>
        <el-table-column label="科室" prop="department"></el-table-column>
      </el-table>
      <el-dialog v-model="flag" title="添加新信息" @close="this.$refs.form.resetFields()">
        <el-form :model="form" ref="form" :rules="rules">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" type="text" placeholder="输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idNum">
            <el-input v-model="form.idNum" placeholder="输入身份证号码" type="text"></el-input>
          </el-form-item>
          <el-form-item label="科室" prop="department">
            <el-input v-model="form.department" placeholder="输入科室名字" type="text"></el-input>
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
  name: 'yiSheng',
  components: {
    BasicFrame
  },
  data () {
    return {
      keShiInfor: [],
      keShiAPI: '/yiSheng',
      keShiAddAPI: '/yiSheng/add',
      flag: false,
      form: {
        name: '',
        department: '',
        idNum: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        idNum: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { pattern: /^\d+$/, message: '请输入正确的身份证号', trigger: 'blur' }
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
            department: this.form.department
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
