<template>
  <BasicFrame>
    <div class="contents" id="patientRegister">
      <div class="register-shower">
        <g-gantt-chart v-if="registerInfor"
        :chart-start="chartStart"
        :chart-end="chartEnd"
        precision="hour"
        bar-start="start"
        bar-end="end"
        color-scheme="sky"
        row-height="60"
        :grid="true">
          <g-gantt-row v-for="(item, index) of registerInfor"
          :key="index"
          :label="item[0].date"
          :bars="item"></g-gantt-row>
        </g-gantt-chart>
      </div>
      <div class="shower">
        <!--显示医生信息-->
        <div class="doctor-shower">
          <el-table v-if="doctorInfor" :data="doctorInfor" @row-click="doctorSelected">
            <el-table-column type="expand">
              <template #default="props">
                <p>医生介绍：</p>
                <p>{{ props.row.doctorIntroduction }}</p>
              </template>
            </el-table-column>
            <el-table-column v-if="registerDepartmentInfor" prop="department" label="科室" :filters="nameFilters" :filter-method="nameFilterMethod">
            </el-table-column>
            <el-table-column prop="doctor" label="医生">
            </el-table-column>
          </el-table>
        </div>
        <!--挂号表单-->
        <div class="register-shower">
          <p>要挂号的医生：{{ selectedDoctorName }}</p>
          <el-form :model="form" ref="form" :rules="rules">
            <el-form-item label="挂号的日期" prop="date">
              <el-date-picker v-model="form.date" type="date" placeholder="选择挂号日期" :disabled-date="disabledDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="挂号开始时间" prop="startTime">
              <el-time-select
                v-model="form.startTime"
                :max-time="form.endTime"
                placeholder="挂号开始时间"
                start="09:00"
                step="00:30"
                end="18:00"
              />
            </el-form-item>
            <el-form-item label="挂号结束时间" prop="endTime">
              <el-time-select
                v-model="form.endTime"
                :min-time="form.startTime"
                placeholder="挂号结束时间"
                start="09:00"
                step="00:30"
                end="18:00"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即预约挂号</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </BasicFrame>
</template>

<style>
#patientRegister{
  padding: 1rem;
  display: flex;
  flex-direction: column;
}
#patientRegister .shower{
  height: 28vh;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(1, 1fr);
  gap: 1rem;
}
#patientRegister .doctor-shower{
  grid-column: 1;
  grid-row: 1;
  overflow: scroll;
}
#patientRegister .register-shower{
  grid-column: 2;
  grid-row: 1;
  overflow: scroll;
}
#patientRegister .register-shower .el-form{
  padding: 1rem;
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
      chartStart: '2023-12-05 08:00',
      chartEnd: '2023-12-05 18:00',
      registerInfor: false,
      registerInforAPI: '/patient/register/registerInfor',
      registerDepartmentInfor: false,
      departmentInforAPI: '/patient/register/departmentInfor',
      doctorInfor: false,
      doctorInforAPI: '/patient/register/doctorInfor',
      selectedDoctorId: false,
      selectedDoctorName: false,
      form: {
        date: '',
        startTime: '',
        endTime: ''
      },
      rules: {
        date: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^(0[9]|1[0-2]):[0-5][0-9]$|^(1[4-7]|18):[0-5][0-9]$/, message: '挂号时间包含医生午休', trigger: 'blur' },
          { validator: this.timeCheck, message: '挂号时间包含医生午休', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '必填', trigger: 'blur' },
          { pattern: /^(0[9]|1[0-2]):[0-5][0-9]$|^(1[4-7]|18):[0-5][0-9]$/, message: '挂号时间包含医生午休', trigger: 'blur' },
          { validator: this.timeCheck, message: '挂号时间包含医生午休', trigger: 'blur' }
        ]
      },
      registerAPI: '/patient/register/register'
    }
  },
  computed: {
    ...mapState(['childrenPermissions']),
    nameFilters: {
      get () {
        const result = []
        const temp = []
        for (const item of this.registerDepartmentInfor) {
          temp.push(item)
        }
        for (const item of [...new Set(temp)]) {
          const tempObj = {}
          tempObj.text = item
          tempObj.value = item
          result.push(tempObj)
        }
        return result
      }
    }
  },
  methods: {
    async getRegisterInfor (doctorId) {
      await axios.get(this.registerInforAPI, {
        params: {
          token: localStorage.getItem('token'),
          doctorId: doctorId
        }
      }).then((result) => {
        this.registerInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    async getDoctorInfor () {
      await axios.get(this.doctorInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.doctorInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    async getDepartmentInfor () {
      await axios.get(this.departmentInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.registerDepartmentInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    nameFilterMethod (value, row) {
      return row.department === value
    },
    doctorSelected (row, column, event) {
      this.getRegisterInfor(row.doctorId)
      this.selectedDoctorId = row.doctorId
      this.selectedDoctorName = row.doctor
    },
    disabledDate (time) {
      const date = new Date()
      const dateIn7Days = new Date()
      dateIn7Days.setDate(date.getDate() + 7)
      return time.getTime() < date.getTime() || time.getTime() > dateIn7Days.getTime()
    },
    onSubmit () {
      this.$refs.form.validate()
        .then(() => {
          if (!this.selectedDoctorName) {
            ElMessage({
              type: 'error',
              message: '未选择要挂号的医生'
            })
            return
          }
          axios.post(this.registerAPI, {
            token: localStorage.getItem('token'),
            registerDate: this.form.date,
            registerStartTime: this.form.startTime,
            registerEndTime: this.form.endTime,
            doctorId: this.doctorId
          }).then(() => {
            ElMessage({
              type: 'success',
              message: '挂号成功'
            })
            this.getRegisterInfor()
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    },
    timeCheck (rule, value, callback) {
      const startTime = this.form.startTime
      const endTime = this.form.endTime
      const am = /^(0[9]|1[0-2]):[0-5][0-9]$/
      const pm = /^(1[4-7]|18):[0-5][0-9]$/
      if (startTime && endTime) {
        if (am.test(startTime) && pm.test(endTime)) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    }
  },
  async beforeMount () {
    await this.getRegisterInfor(111)
    await this.getDoctorInfor()
    await this.getDepartmentInfor()
  }
}
</script>
