<template>
  <div id="work-time">
    <el-calendar v-model="selectedDay" v-if="allMonthDayInfor" id="work-time-shower">
      <template #date-cell="{ data }">
        <div v-if="Number(data.day.split('-')[1]) !== selectedDay.getMonth() + 1"></div>
        <div v-else :class="cellClass(allMonthDayInfor[String(Number(data.day.split('-')[2]))])">
          <p>{{ data.day.split('-').slice(1).join('-') }}</p>
          <p v-if="!allMonthDayInfor[String(Number(data.day.split('-')[2]))].workFlag">此日无排班</p>
          <div v-if="allMonthDayInfor[String(Number(data.day.split('-')[2]))].workFlag">
            <p>排班至：{{ allMonthDayInfor[String(Number(data.day.split('-')[2]))].workDepartment }}</p>
            <p>排班时间：{{ allMonthDayInfor[String(Number(data.day.split('-')[2]))].workTimeRange }}</p>
          </div>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<style>
#work-time-shower .is-today{
  font-weight: 700;
  font-size: 120%;
}
#work-time-shower .is-selected{
  border: 3px solid rgba(0, 0, 0, 0.315);
}
#work-time-shower .el-calendar-day{
  padding: 0.1rem !important;
  border-radius: 1rem;
}
.none-work{
  background-color: #b1b3b8;
  color: #73767a;
}
.none-work,.daytime-work, .nighttime-work{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.daytime-work.outpatient-work{
  background-color: #f0f9eb!important;
  color:#529b2e;
}
.daytime-work.emergency-work{
  background-color: #fef0f0!important;
  color: #c45656;
}
.daytime-work.hospitalization-work{
  background-color: #ecf5ff!important;
  color: #337ecc;
}
.nighttime-work.outpatient-work{
  background-color: #95d475!important;
  color: #f0f9eb;
}
.nighttime-work.emergency-work{
  background-color: #f89898!important;
  color: #fef0f0;
}
.nighttime-work.hospitalization-work{
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
      selectedDay: new Date(),
      allMonthDayInfor: false,
      workTimeInforAPI: '/user/work-time/workTimeInfor'
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
    }
  },
  async beforeMount () {
    await axios.get(this.workTimeInforAPI, {
      params: {
        token: localStorage.getItem('token'),
        targetYear: new Date().getFullYear(),
        targetMonth: new Date().getMonth()
      }
    }).then((result) => { this.allMonthDayInfor = result.data })
      .catch((result) => { this.$store.state.errorReport(result) })
  }
}
</script>
