
import loginViewVue from '../loginView.vue';
<template>
  <div id="subordinateAttendance">
    <el-tabs v-model="selectedStaff">
      <el-tab-pane v-for="(item, index) of Object.entries(staffInfor)" :key="index" :label="item[0]" :name="item[0]">
        <el-calendar v-model="selectedDay">
          <template #date-cell="{ data }">
            <div v-if="Number(data.day.split('-')[1]) !== selectedDay.getMonth() + 1"></div>
            <div v-else :class="item[1][String(Number(data.day.split('-')[2]))].dayStatusClass">
              <p>{{ data.day.split('-').slice(1).join('-') }}</p>
              <p v-if="item[1][String(Number(data.day.split('-')[2]))].dayStatusClass === 'day-normal'">正常签到</p>
              <p v-else-if="item[1][String(Number(data.day.split('-')[2]))].dayStatusClass === 'day-late'">迟到</p>
              <p v-else-if="item[1][String(Number(data.day.split('-')[2]))].dayStatusClass === 'day-absenteeism'">旷工</p>
              <p v-else-if="item[1][String(Number(data.day.split('-')[2]))].dayStatusClass === 'day-vocation'">请假</p>
            </div>
          </template>
        </el-calendar>
        <el-table v-if="attendDetail" :data="attendDetail" :row-class-name="tableRowClassName">
          <el-table-column prop="name" label="签到人"></el-table-column>
          <el-table-column prop="dateTime" label="签到时间"></el-table-column>
          <el-table-column prop="status" label="签到结果"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style></style>

<script>
import axios from 'axios'
export default {
  name: 'attendanceView',
  data () {
    return {
      selectedStaff: null,
      staffInfor: false,
      selectedDay: new Date(),
      attendDetail: false,
      staffInforAPI: '/subordinate/attendance/staffInfor',
      attendInforDetailAPI: '/subordinate/attendance/attendInforDetail'
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
        this.getStaffInfor(newValue.getFullYear(), newValue.getMonth())
      }
      this.getAttendDetail()
    }
  },
  methods: {
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
    },
    async getAttendDetail () {
      await axios.get(this.attendInforDetailAPI, {
        params: {
          token: localStorage.getItem('token'),
          targetYear: this.selectedDay.getFullYear(),
          targetMonth: this.selectedDay.getMonth(),
          targetDay: this.selectedDay.getDay(),
          targetStaff: this.selectedStaff
        }
      }).then((result) => {
        this.attendDetail = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    }
  },
  async beforeMount () {
    await this.getStaffInfor(new Date().getFullYear(), new Date().getMonth())
    await this.getAttendDetail()
  }
}
</script>
