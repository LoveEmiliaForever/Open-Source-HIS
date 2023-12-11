<template>
  <BasicFrame>
    <el-tabs type="border-card" class="contents" v-if="childrenPermissions">
      <el-tab-pane label="下属考勤查看" v-if="childrenPermissions.subordinateAttendance">
        <attendanceView></attendanceView>
      </el-tab-pane>
      <el-tab-pane label="请假申请管理" v-if="childrenPermissions.subordinateVocationApply">
        <vocationApplyView></vocationApplyView>
      </el-tab-pane>
      <el-tab-pane label="管理对下属投诉" v-if="childrenPermissions.subordinateComplaint">
        <complaintView></complaintView>
      </el-tab-pane>
      <el-tab-pane label="下属考评管理" v-if="childrenPermissions.subordinateEvaluation">
        <evaluationView></evaluationView>
      </el-tab-pane>
      <el-tab-pane label="下属排班管理" v-if="childrenPermissions.subordinateWorkTime">
        <workTimeView></workTimeView>
      </el-tab-pane>
    </el-tabs>
  </BasicFrame>
</template>

<style>
</style>

<script>
import BasicFrame from '@/components/basicFrame.vue'
import attendanceView from './subordinate/attendanceView.vue'
import vocationApplyView from './subordinate/vocationApplyView.vue'
import complaintView from './subordinate/complaintView.vue'
import evaluationView from './subordinate/evaluationView.vue'
import workTimeView from './subordinate/workTimeView.vue'
import { mapState } from 'vuex'

export default {
  name: 'subordinateView',
  components: {
    BasicFrame,
    attendanceView,
    vocationApplyView,
    complaintView,
    evaluationView,
    workTimeView
  },
  computed: mapState(['childrenPermissions'])
}
</script>
