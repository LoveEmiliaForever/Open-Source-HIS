<template>
  <BasicFrame>
    <div class="contents">
      <el-button type="primary" size="default" @click="onClick">添加新信息</el-button>
      <el-table :data="keShiInfor">
        <el-table-column label="药品Id" prop="drugId"></el-table-column>
        <el-table-column label="药品名称" prop="drugName"></el-table-column>
        <el-table-column label="药品使用" prop="drugUse"></el-table-column>
        <el-table-column label="中西药" prop="drugType"></el-table-column>
        <el-table-column label="性状" prop="appearance"></el-table-column>
        <el-table-column label="处方与否" prop="prescriptionStatus"></el-table-column>
        <el-table-column label="保存方式" prop="storageWay"></el-table-column>
        <el-table-column label="单价" prop="price"></el-table-column>
        <el-table-column label="单位" prop="drugUnit"></el-table-column>
        <el-table-column align="right">
          <template #default="scope">
            <el-button type="success" @click="changeDrug(scope.row.drugId)">更改药品信息</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog v-model="flag" title="添加新信息" @close="this.$refs.form.resetFields()">
        <el-form :model="form" ref="form" :rules="rules">
          <el-form-item label="药品名称" prop="drugName">
            <el-input v-model="form.drugName" type="text" placeholder="输入药品名称"></el-input>
          </el-form-item>
          <el-form-item label="单价" prop="price">
            <el-slider v-model="form.price" placeholder="输入单价金额大小" :min="0" :max="5000" :step="0.01" show-input></el-slider>
          </el-form-item>
          <el-form-item label="单位" prop="drugUnit">
            <el-input v-model="form.drugUnit" placeholder="输入单位" type="text"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog v-model="flag2" title="修改药品信息" @close="this.$refs.form2.resetFields()">
        <el-form :model="form2" ref="form2">
          <el-form-item label="药品保存方式" prop="storageWay">
            <el-radio-group v-model="form2.storageWay">
              <el-radio label="冷藏保存" border>
                冷藏保存
              </el-radio>
              <el-radio label="常温保存" border>
                常温保存
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="单价" prop="price">
            <el-slider v-model="form2.price" placeholder="输入单价金额大小" :min="0" :max="5000" :step="0.01" show-input></el-slider>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onChange">立即修改</el-button>
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
  name: 'yaoPin',
  components: {
    BasicFrame
  },
  data () {
    return {
      keShiInfor: [],
      keShiAPI: '/yaoPin',
      keShiAddAPI: '/yaoPin/add',
      flag: false,
      form: {
        drugName: '',
        drugUnit: '',
        price: ''
      },
      rules: {
        drugName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        drugUnit: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { pattern: /^\d+$/, message: '请输入正确的身份证号', trigger: 'blur' }
        ]
      },
      flag2: false,
      yaoPinChangeAPI: '/yaoPin/change',
      form2: {
        storageWay: '',
        price: ''
      },
      selectedDrugId: ''
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
            drugName: this.form.drugName,
            price: this.form.price,
            drugUnit: this.form.drugUnit
          }).then((result) => {
            this.flag = false
            this.$refs.form.resetFields()
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    },
    changeDrug (drugId) {
      this.flag2 = true
      this.selectedDrugId = drugId
    },
    onChange () {
      axios.post(this.yaoPinChangeAPI, {
        token: localStorage.getItem('token'),
        drugId: this.selectedDrugId,
        storageWay: this.form2.storageWay,
        price: this.form2.price
      }).then((result) => {
        this.flag2 = false
        this.$refs.form2.resetFields()
      }).catch((result) => { this.$store.state.errorReport(result) })
    }
  },
  async beforeMount () {
    await this.getKeShi()
  }
}
</script>
