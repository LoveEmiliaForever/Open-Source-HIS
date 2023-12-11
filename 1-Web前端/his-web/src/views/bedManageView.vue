<template>
  <BasicFrame>
    <el-tabs type="border-card" class="contents" v-if="childrenPermissions">
      <el-tab-pane label="床位信息总览" v-if="childrenPermissions.bedManageBedInfor">
        <bedInforView></bedInforView>
      </el-tab-pane>
      <el-tab-pane label="换床申请管理" v-if="childrenPermissions.bedManageBedExchange">
        <bedExchangeView></bedExchangeView>
      </el-tab-pane>
    </el-tabs>
  </BasicFrame>
</template>

<style>
</style>

<script>
import BasicFrame from '@/components/basicFrame.vue'
import bedInforView from './bed-manage/bedInforView.vue'
import bedExchangeView from './bed-manage/bedExchangeView.vue'
import { mapState } from 'vuex'

export default {
  name: 'badManageView',
  components: {
    BasicFrame,
    bedInforView,
    bedExchangeView
  },
  computed: mapState(['childrenPermissions'])
}
</script>
