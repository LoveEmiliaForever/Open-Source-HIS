<template>
  <BasicFrame>
    <el-tabs type="border-card" class="contents" v-if="childrenPermissions">
      <el-tab-pane label="床位管理" v-if="childrenPermissions.nurseWorkBedManage">
        <bedManageView></bedManageView>
      </el-tab-pane>
      <el-tab-pane label="出院管理" v-if="childrenPermissions.nurseWorkInpatientOut">
        <inpatientOutView></inpatientOutView>
      </el-tab-pane>
      <el-tab-pane label="注射室" v-if="childrenPermissions.nurseWorkInjection">
        <injectionView></injectionView>
      </el-tab-pane>
      <el-tab-pane label="手术管理" v-if="childrenPermissions.nurseWorkOperationManage">
        <operationManageView></operationManageView>
      </el-tab-pane>
    </el-tabs>
  </BasicFrame>
</template>

<style>
</style>

<script>
import BasicFrame from '@/components/basicFrame.vue'
import bedManageView from './nurse-work/bedManageView.vue'
import inpatientOutView from './nurse-work/inpatientOutView.vue'
import injectionView from './nurse-work/injectionView.vue'
import operationManageView from './nurse-work/operationManageView.vue'
import { mapState } from 'vuex'

export default {
  name: 'nurseWorkView',
  components: {
    BasicFrame,
    bedManageView,
    inpatientOutView,
    injectionView,
    operationManageView
  },
  computed: mapState(['childrenPermissions'])
}
</script>
