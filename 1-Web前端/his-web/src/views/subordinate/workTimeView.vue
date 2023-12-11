<template>
  <div id="subordinate-work-time">
    <el-tabs v-if="staffInfor" v-model="selectedStaff">
      <el-tab-pane v-for="(item, index) of Object.entries(staffInfor)" :key="index" :label="item[0]" :name="item[0]">
        <p>使用方法：选择日期 -> 选择排班情况 -> 上传排班情况</p>
        <el-calendar v-model="selectedDay" id="work-time-shower">
          <template #date-cell="{ data }">
            <div v-if="Number(data.day.split('-')[1]) !== selectedDay.getMonth() + 1"></div>
            <div v-else :class="cellClass(item[1][String(Number(data.day.split('-')[2]))])">
              <el-checkbox v-model="selectedDayArray[String(Number(data.day.split('-')[2]))]">
                <p>{{ data.day.split('-').slice(1).join('-') }}</p>
                <p v-if="!item[1][String(Number(data.day.split('-')[2]))].workFlag">此日无排班</p>
                <div v-if="item[1][String(Number(data.day.split('-')[2]))].workFlag">
                  <p>排班至：{{ item[1][String(Number(data.day.split('-')[2]))].workDepartment }}</p>
                  <p>排班时间：{{ item[1][String(Number(data.day.split('-')[2]))].workTimeRange }}</p>
                </div>
              </el-checkbox>
            </div>
          </template>
        </el-calendar>
        <el-form :model="workStatusForm" ref="workStatusForm" :rules="rules">
          <el-form-item label="排班与否" prop="workFlag">
            <el-select v-model="workStatusForm.workFlag" placeholder="当日排班与否">
              <el-option label="参与排班" :value="true">
              </el-option>
              <el-option label="暂不排班" :value="false">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排班部门" prop="workDepartment">
            <el-select :disabled="!workStatusForm.workFlag" v-model="workStatusForm.workDepartment" placeholder="当日排班部门">
              <el-option label="门诊" value="门诊">
              </el-option>
              <el-option label="急诊" value="急诊">
              </el-option>
              <el-option label="住院" value="住院">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排班时间" prop="workTimeRange">
            <el-select :disabled="!workStatusForm.workFlag" v-model="workStatusForm.workTimeRange" placeholder="当日排班时间">
              <el-option label="白天" value="白天">
              </el-option>
              <el-option label="晚上" value="晚上">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changeWorkTime">上传排班安排</el-button>
            <el-button @click="this.$refs.workStatusForm.resetFields()">重置内容</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style>
subordinate-work-time #work-time-shower .is-today{
  font-weight: 700;
  font-size: 120%;
}
subordinate-work-time #work-time-shower .is-selected{
  border: 3px solid rgba(0, 0, 0, 0.315);
}
subordinate-work-time #work-time-shower .el-calendar-day{
  padding: 0.1rem !important;
  border-radius: 1rem;
}
subordinate-work-time .none-work{
  background-color: #b1b3b8;
  color: #73767a;
}
subordinate-work-time .none-work,.daytime-work, .nighttime-work{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
subordinate-work-time .daytime-work.outpatient-work{
  background-color: #f0f9eb!important;
  color:#529b2e;
}
subordinate-work-time .daytime-work.emergency-work{
  background-color: #fef0f0!important;
  color: #c45656;
}
subordinate-work-time .daytime-work.hospitalization-work{
  background-color: #ecf5ff!important;
  color: #337ecc;
}
subordinate-work-time .nighttime-work.outpatient-work{
  background-color: #95d475!important;
  color: #f0f9eb;
}
subordinate-work-time .nighttime-work.emergency-work{
  background-color: #f89898!important;
  color: #fef0f0;
}
subordinate-work-time .nighttime-work.hospitalization-work{
  background-color: #79bbff!important;
  color: #ecf5ff;
}
</style>

<script>
import axios from 'axios'
export default {
  name: 'workTimeView',
  data () {
    return {
      staffInfor: false,
      selectedStaff: null,
      selectedDay: new Date(),
      selectedDayArray: new Array(31).fill(false),
      workStatusForm: {
        workFlag: '',
        workDepartment: '门诊',
        workTimeRange: '白天'
      },
      rules: {
        workFlag: [
          { required: true, message: '选择排班与否', trigger: 'blur' }
        ],
        workDepartment: [
          { required: true, message: '选择排班部门', trigger: 'blur' }
        ],
        workTimeRange: [
          { required: true, message: '选择排班时间', trigger: 'blur' }
        ]
      },
      staffInforAPI: '/subordinate/work-time/staffInfor',
      workTimeChangeAPI: '/subordinate/work-time/workTimeChange'
    }
  },
  watch: {
    selectedStaff () {
      this.selectedDayArray = new Array(31).fill(false)
    }
  },
  methods: {
    cellClass (dayInfor) {
      const result = []
      if (dayInfor.workFlag === false) {
        return 'none-work'
      }
      switch (dayInfor.workDepartment) {
        case '门诊':
          result.push('outpatient-work')
          break
        case '急诊':
          result.push('emergency-work')
          break
        case '住院':
          result.push('hospitalization-work')
          break
        default:
          break
      }
      switch (dayInfor.workTimeRange) {
        case '白天':
          result.push('daytime-work')
          break
        case '晚上':
          result.push('nighttime-work')
          break
        default:
          break
      }
      return result.join(' ')
    },
    changeWorkTime () {
      const formIndex = Object.keys(this.staffInfor).indexOf(this.selectedStaff)
      this.$refs.workStatusForm[formIndex].validate()
        .then(() => {
          const tempObj = {}
          for (let i = 0; i < this.selectedDayArray.length; i++) {
            if (this.selectedDayArray[i]) {
              tempObj[i] = {
                workFlag: this.workStatusForm.workFlag,
                workDepartment: this.workStatusForm.workDepartment,
                workTimeRange: this.workStatusForm.workTimeRange
              }
            }
          }
          axios.post(this.workTimeChangeAPI, {
            token: localStorage.getItem('token'),
            targetYear: this.selectedDay.getFullYear(),
            targetMonth: this.selectedDay.getMonth(),
            targetStaff: this.selectedStaff,
            workTime: tempObj
          }).then(() => {
            this.$refs.workStatusForm[formIndex].resetFields()
            this.selectedDayArray = new Array(31).fill(false)
            this.getStaffInfor(this.selectedDay.getFullYear(), this.selectedDay.getMonth())
          }).catch((result) => { this.$store.state.errorReport(result) })
        })
        .catch(() => {})
    },
    async getStaffInfor (targetYear, targetMonth) {
      await axios.get(this.staffInforAPI, {
        params: {
          token: localStorage.getItem('token'),
          targetYear: targetYear,
          targetMonth: targetMonth
        }
      }).then((result) => {
        this.staffInfor = result.data
        if (this.selectedStaff === null) {
          this.selectedStaff = Object.entries(result.data)[0][0]
        }
      }).catch((result) => { this.$store.state.errorReport(result) })
    }
  },
  async beforeMount () {
    await this.getStaffInfor(new Date().getFullYear(), new Date().getMonth())
  }
}
</script>
