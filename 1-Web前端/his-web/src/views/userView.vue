<template>
  <BasicFrame>
    <el-tabs type="border-card" class="contents" v-if="childrenPermissions">
      <el-tab-pane label="考勤查看" v-if="childrenPermissions.userAttendance">
        <attendanceView></attendanceView>
      </el-tab-pane>
      <el-tab-pane label="请假申请" v-if="childrenPermissions.userVocationApply">
        <vocationApplyView></vocationApplyView>
      </el-tab-pane>
      <el-tab-pane label="考评查看" v-if="childrenPermissions.userEvaluation">
        <evaluationView></evaluationView>
      </el-tab-pane>
      <el-tab-pane label="排班查看" v-if="childrenPermissions.userWorkTime">
        <workTimeView></workTimeView>
      </el-tab-pane>
      <el-tab-pane label="工作数据可视化" v-if="childrenPermissions.userDataShow"></el-tab-pane>
    </el-tabs>
  </BasicFrame>
</template>

<style>
</style>

<script>
import BasicFrame from '@/components/basicFrame.vue'
import attendanceView from './user/attendanceView.vue'
import vocationApplyView from './user/vocationApplyView.vue'
import evaluationView from './user/evaluationView.vue'
import workTimeView from './user/workTimeView.vue'
import { mapState } from 'vuex'

export default {
  name: 'userView',
  components: {
    BasicFrame,
    attendanceView,
    vocationApplyView,
    evaluationView,
    workTimeView
  },
  computed: mapState(['childrenPermissions'])
}
</script>
