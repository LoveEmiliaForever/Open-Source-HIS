<template>
  <div id="attendance">
    <el-button type="success" @click="attendToday">今日签到</el-button>
    <el-calendar v-model="selectedDay" v-if="allMonthDayInfor" id="attend-shower">
      <template #date-cell="{ data }">
        <div v-if="Number(data.day.split('-')[1]) !== selectedDay.getMonth() + 1"></div>
        <div v-else :class="allMonthDayInfor[String(Number(data.day.split('-')[2]))].dayStatusClass">
          <p>{{ data.day.split('-').slice(1).join('-') }}</p>
          <p v-if="allMonthDayInfor[String(Number(data.day.split('-')[2]))].dayStatusClass === 'day-normal'">正常签到</p>
          <p v-else-if="allMonthDayInfor[String(Number(data.day.split('-')[2]))].dayStatusClass === 'day-late'">迟到</p>
          <p v-else-if="allMonthDayInfor[String(Number(data.day.split('-')[2]))].dayStatusClass === 'day-absenteeism'">旷工</p>
          <p v-else-if="allMonthDayInfor[String(Number(data.day.split('-')[2]))].dayStatusClass === 'day-vocation'">请假</p>
        </div>
      </template>
    </el-calendar>
    <el-table v-if="attendDetail" :data="attendDetail" :row-class-name="tableRowClassName">
      <el-table-column prop="name" label="签到人"></el-table-column>
      <el-table-column prop="dateTime" label="签到时间"></el-table-column>
      <el-table-column prop="status" label="签到结果"></el-table-column>
    </el-table>
  </div>
</template>

<style>
#attendance{
  display: flex;
  flex-direction: column;
  height: 100%;
}
#attendance > .el-button{
  width: 14%;
  margin-right: 1.5%;
  align-self: flex-end;
}
#attend-shower .is-today{
  font-weight: 700;
  font-size: 120%;
}
#attend-shower .is-selected{
  border: 3px solid rgba(0, 0, 0, 0.315);
}
#attend-shower .el-calendar-day{
  padding: 0.1rem !important;
  border-radius: 1rem;
}
.day-normal,.day-late,.day-absenteeism,.day-not-data,.day-vocation{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.day-normal,.row-normal{
  color:#529b2e !important;
  background-color: #f0f9eb !important;
}
.day-late,.row-late{
  color:#b88230 !important;
  background-color: #fdf6ec !important;
}
.day-absenteeism,.row-absenteeism{
  color:#c45656 !important;
  background-color: #fef0f0 !important;
}
.day-not-data,.row-not-data{
  color:#73767a !important;
  background-color: #f4f4f5 !important;
}
.day-vocation,.row-vocation{
  color:#000000 !important;
  background-color: #03327033 !important;
}
</style>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
export default {
  name: 'attendanceView',
  components: {
  },
  data () {
    return {
      selectedDay: new Date(),
      allMonthDayInfor: false,
      attendDetail: false,
      attendAPI: '/user/attendance/attend',
      attendInforAPI: '/user/attendance/attendInfor',
      attendInforDetailAPI: '/user/attendance/attendInforDetail'
    }
  },
  computed: {
    tableRowClassName: {
      get () {
        switch (this.attendDetail[0].status) {
          case '正常签到':
            return 'row-normal'
          case '迟到':
            return 'row-late'
          case '旷工':
            return 'row-absenteeism'
          case '请假':
            return 'row-vocation'
          default:
            return 'row-not-data'
        }
      }
    }
  },
  watch: {
    selectedDay (oldValue, newValue) {
      if (oldValue.getFullYear() === newValue.getFullYear() && oldValue.getMonth() === newValue.getMonth()) {
        console.log()
      } else {
        this.getAllMonthDayInfor(newValue.getFullYear(), newValue.getMonth())
      }
      this.getAttendDetail()
    }
  },
  methods: {
    async getAllMonthDayInfor (targetYear, targetMonth) {
      await axios.get(this.attendInforAPI, {
        params: {
          token: localStorage.getItem('token'),
          targetYear: targetYear,
          targetMonth: targetMonth
        }
      }).then((result) => {
        this.allMonthDayInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    async getAttendDetail () {
      await axios.get(this.attendInforDetailAPI, {
        params: {
          token: localStorage.getItem('token'),
          targetYear: this.selectedDay.getFullYear(),
          targetMonth: this.selectedDay.getMonth(),
          targetDay: this.selectedDay.getDay()
        }
      }).then((result) => {
        this.attendDetail = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    attendToday () {
      axios.post(this.attendAPI, {
        token: localStorage.getItem('token'),
        attendDate: new Date()
      }).then(() => {
        ElMessage({
          message: '打卡成功！',
          type: 'success'
        })
        this.getAllMonthDayInfor(new Date().getFullYear(), new Date().getMonth())
      }).catch(() => {
        ElMessage.error('打卡失败！')
      })
    }
  },
  async beforeMount () {
    await this.getAllMonthDayInfor(new Date().getFullYear(), new Date().getMonth())
    await this.getAttendDetail()
  }
}
</script>
