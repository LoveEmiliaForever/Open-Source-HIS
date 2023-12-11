<template>
  <BasicFrame>
    <el-tabs type="border-card" class="contents" v-if="childrenPermissions">
      <el-tab-pane label="药品管理" v-if="childrenPermissions.drugWarehouseWorkDrugManage">
        <drugManageView></drugManageView>
      </el-tab-pane>
      <el-tab-pane label="药品补充申请管理（总管）" v-if="childrenPermissions.drugWarehouseWorkDrugApply">
        <drugApplyView></drugApplyView>
      </el-tab-pane>
    </el-tabs>
  </BasicFrame>
</template>

<style>
</style>

<script>
import BasicFrame from '@/components/basicFrame.vue'
import drugManageView from './drug-warehouse-work/drugManageView.vue'
import drugApplyView from './drug-warehouse-work/drugApplyView.vue'
import { mapState } from 'vuex'

export default {
  name: 'userView',
  components: {
    BasicFrame,
    drugManageView,
    drugApplyView
  },
  computed: mapState(['childrenPermissions'])
}
</script>
