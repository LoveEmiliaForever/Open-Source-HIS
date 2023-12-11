<template>
  <BasicFrame>
    <div class="contents">
      <operationRoomView v-if="childrenPermissions.operationRoomManageRoom" ref="manage"></operationRoomView>
      <operationManageView v-if="childrenPermissions.operationRoomManageApply" @change="change"></operationManageView>
    </div>
  </BasicFrame>
</template>

<style>
</style>

<script>
import BasicFrame from '@/components/basicFrame.vue'
import operationRoomView from './operation-room-manage/operationRoomView.vue'
import operationManageView from './operation-room-manage/operationManageView.vue'
import { mapState } from 'vuex'

export default {
  name: 'operationRoomManageView',
  components: {
    BasicFrame,
    operationRoomView,
    operationManageView
  },
  computed: mapState(['childrenPermissions']),
  methods: {
    change () {
      this.$refs.manage.getOperationInfor()
    }
  }
}
</script>
