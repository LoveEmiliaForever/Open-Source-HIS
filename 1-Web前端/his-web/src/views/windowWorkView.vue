<template>
  <BasicFrame>
    <el-tabs type="border-card" class="contents" v-if="childrenPermissions">
      <el-tab-pane label="挂号" v-if="childrenPermissions.windowWorkRegister">
        <registerView></registerView>
      </el-tab-pane>
      <el-tab-pane label="一卡通管理" v-if="childrenPermissions.windowWorkCard">
        <cardView></cardView>
      </el-tab-pane>
      <el-tab-pane label="患者档案管理" v-if="childrenPermissions.windowWorkPatientInformation">
        <patientInformationView></patientInformationView>
      </el-tab-pane>
      <el-tab-pane label="收费管理" v-if="childrenPermissions.windowWorkCollection">
        <collectionView></collectionView>
      </el-tab-pane>
    </el-tabs>
  </BasicFrame>
</template>

<style>
</style>

<script>
import BasicFrame from '@/components/basicFrame.vue'
import registerView from './window-work/registerView.vue'
import cardView from './window-work/cardView.vue'
import patientInformationView from './window-work/patientInformationView.vue'
import collectionView from './window-work/collectionView.vue'
import { mapState } from 'vuex'

export default {
  name: 'windowWorkView',
  components: {
    BasicFrame,
    registerView,
    cardView,
    patientInformationView,
    collectionView
  },
  computed: mapState(['childrenPermissions'])
}
</script>
