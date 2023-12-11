<template>
  <div class="contents" id="drugWarehouseWorkDrugManage">
    <div>
      <el-button type="primary" @click="wareDialog = true">药品入库</el-button>
      <el-button type="warning" @click="exWareDialog = true">药品出库</el-button>
      <el-button type="danger" @click="lossesDialog = true">药品报损</el-button>
    </div>
    <el-table v-if="drugInfor" :data="drugInfor" border>
      <el-table-column prop="drugName" label="药品名称"></el-table-column>
      <el-table-column prop="drugNum" label="药品数量"></el-table-column>
      <el-table-column prop="drugType" label="中西药"></el-table-column>
      <el-table-column prop="appearance" label="物理性质"></el-table-column>
      <el-table-column prop="prescriptionStatus" label="处方归类"></el-table-column>
      <el-table-column prop="manufactureDate" label="生产日期"></el-table-column>
      <el-table-column prop="expirationDate" label="过期日期"></el-table-column>
      <el-table-column prop="warehousingDate" label="入库日期"></el-table-column>
      <el-table-column prop="ExWarehousingDate" label="出库日期"></el-table-column>
      <el-table-column prop="drugPrice" label="药品价格"></el-table-column>
    </el-table>
    <el-dialog title="药品入库" @close="wareDialog = false; this.$refs.warehousingForm.resetFields()" v-model="wareDialog">
      <el-form :model="warehousingForm" ref="warehousingForm" :rules="warehousingRules">
        <el-form-item label="药品名称" prop="drugName">
          <el-input v-model="warehousingForm.drugName"></el-input>
        </el-form-item>
        <el-form-item label="药品数量" prop="drugNum">
          <el-slider v-model="warehousingForm.drugNum" :min="1" show-input></el-slider>
        </el-form-item>
        <el-form-item label="中西药" prop="drugType">
          <el-select v-model="warehousingForm.drugType" placeholder="选择药品种类">
            <el-option label="中药" value="中药"></el-option>
            <el-option label="西药" value="西药"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物理性质" prop="appearance">
          <el-select v-model="warehousingForm.appearance" placeholder="选择药品物理性质">
            <el-option label="药片" value="药片"></el-option>
            <el-option label="胶囊" value="胶囊"></el-option>
            <el-option label="液体" value="液体"></el-option>
            <el-option label="药膏" value="药膏"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处方归类" prop="prescriptionStatus">
          <el-select v-model="warehousingForm.prescriptionStatus" placeholder="选择药品处方种类">
            <el-option label="处方药" value="处方药"></el-option>
            <el-option label="非处方药" value="非处方药"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产日期" prop="manufactureDate">
          <el-date-picker v-model="warehousingForm.manufactureDate" type="date" placeholder="选择生产日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="过期日期" prop="expirationDate">
          <el-date-picker v-model="warehousingForm.expirationDate" type="date" placeholder="选择过期日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="warehousing">立即入库</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="药品出库" @close="exWareDialog = false; this.$refs.exWarehousingForm.resetFields()" v-model="exWareDialog">
      <el-form :model="exWarehousingForm" ref="exWarehousingForm" :rules="exWarehousingRules">
        <el-form-item label="药品名称" prop="drugName">
          <el-input v-model="exWarehousingForm.drugName"></el-input>
        </el-form-item>
        <el-form-item label="药品数量" prop="drugNum">
          <el-slider v-model="exWarehousingForm.drugNum" :min="1" show-input></el-slider>
        </el-form-item>
        <el-form-item label="出库理由" prop="reason">
          <el-input v-model="exWarehousingForm.reason"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exWarehousing">立即出库</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="药品报损" @close="lossesDialog = false; this.$refs.lossesForm.resetFields()" v-model="lossesDialog">
      <el-form :model="lossesForm" ref="lossesForm" :rules="lossesRules">
        <el-form-item label="药品名称" prop="drugName">
          <el-input v-model="lossesForm.drugName"></el-input>
        </el-form-item>
        <el-form-item label="药品数量" prop="drugNum">
          <el-slider v-model="lossesForm.drugNum" :min="1" show-input></el-slider>
        </el-form-item>
        <el-form-item label="报损原因" prop="reason">
          <el-input v-model="lossesForm.reason"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="losses">立即报损</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style>
#drugWarehouseWorkDrugManage{
  padding: 1rem;
}
#drugWarehouseWorkDrugManage button{
  margin-bottom: 1rem;
}
</style>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'workTimeView',
  data () {
    return {
      drugInfor: false,
      drugInforAPI: '/drug-warehouse-work/drugManage/drugInfor',
      wareDialog: false,
      warehousingForm: {
        drugName: '',
        drugNum: '',
        drugType: '',
        appearance: '',
        prescriptionStatus: '',
        manufactureDate: '',
        expirationDate: ''
      },
      warehousingRules: {
        drugName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        drugNum: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        drugType: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        appearance: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        prescriptionStatus: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        manufactureDate: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        expirationDate: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      warehousingAPI: '/drug-warehouse-work/drugManage/warehousing',
      exWareDialog: false,
      exWarehousingForm: {
        drugName: '',
        drugNum: '',
        reason: ''
      },
      exWarehousingRules: {
        drugName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        drugNum: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      exWarehousingAPI: '/drug-warehouse-work/drugManage/exWarehousing',
      lossesDialog: false,
      lossesForm: {
        drugName: '',
        drugNum: '',
        reason: ''
      },
      lossesRules: {
        drugName: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        drugNum: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      },
      lossesAPI: '/drug-warehouse-work/drugManage/losses'
    }
  },
  methods: {
    async getDrugInfor () {
      await axios.get(this.drugInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.drugInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    warehousing () {
      this.$refs.warehousingForm.validate()
        .then(() => {
          axios.post(this.warehousingAPI, {
            token: localStorage.getItem('token'),
            warehousingDate: new Date(),
            drugName: this.warehousingForm.drugName,
            drugNum: this.warehousingForm.drugNum,
            drugType: this.warehousingForm.drugType,
            appearance: this.warehousingForm.appearance,
            prescriptionStatus: this.warehousingForm.prescriptionStatus,
            manufactureDate: this.warehousingForm.manufactureDate,
            expirationDate: this.warehousingForm.expirationDate
          }).then(() => {
            ElMessage({
              type: 'success',
              message: '入库成功'
            })
            this.$refs.warehousingForm.resetFields()
            this.wareDialog = false
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    },
    exWarehousing () {
      this.$refs.exWarehousingForm.validate()
        .then(() => {
          axios.post(this.exWarehousingAPI, {
            token: localStorage.getItem('token'),
            exWarehousingDate: new Date(),
            drugName: this.exWarehousingForm.drugName,
            drugNum: this.exWarehousingForm.drugNum,
            reason: this.exWarehousingForm.reason
          }).then(() => {
            ElMessage({
              type: 'success',
              message: '出库库成功'
            })
            this.$refs.exWarehousingForm.resetFields()
            this.exWareDialog = false
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    },
    losses () {
      this.$refs.lossesForm.validate()
        .then(() => {
          axios.post(this.lossesAPI, {
            token: localStorage.getItem('token'),
            lossesDate: new Date(),
            drugName: this.lossesForm.drugName,
            drugNum: this.lossesForm.drugNum,
            reason: this.lossesForm.reason
          }).then(() => {
            ElMessage({
              type: 'success',
              message: '报损成功'
            })
            this.$refs.lossesForm.resetFields()
            this.lossesDialog = false
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    }
  },
  async beforeMount () {
    await this.getDrugInfor()
  }
}
</script>
