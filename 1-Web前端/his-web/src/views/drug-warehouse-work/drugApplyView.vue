<template>
  <div id="drugWarehouseWorkDrugApply">
    <el-table :data="allApplyInfor" v-if="allApplyInfor">
      <el-table-column type="expand" fixed>
        <template #default="props">
          <div class="applyDetail">
            <p>申请理由：{{ props.row.applicantReason }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请药品名称" prop="drugName">
      </el-table-column>
      <el-table-column label="申请药品数量" prop="drugNum">
      </el-table-column>
      <el-table-column label="审批状态" prop="grantStatus" :filters="statusFilters" :filter-method="statusFilterMethod">
      </el-table-column>
      <el-table-column align="right">
        <template #default="scope">
          <el-button v-if="scope.row.grantStatus === '待审批'" type="success" @click="agreeApply(scope.row.drugName, scope.row.applyTime)">同意申请</el-button>
          <el-button v-else type="success" plain disabled>同意申请</el-button>
          <el-button v-if="scope.row.grantStatus === '待审批'" type="danger" @click="rejectApply(scope.row.drugName, scope.row.applyTime)">拒绝申请</el-button>
          <el-button v-else type="danger" plain disabled>拒绝申请</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style>
#drugWarehouseWorkDrugApply .applyDetail{
  padding: 0.5rem 1.5rem;
}
#drugWarehouseWorkDrugApply .applyDetail p{
  margin-bottom: 1rem;
}
</style>

<script>
import axios from 'axios'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'bedExchangeView',
  data () {
    return {
      allApplyInfor: false,
      applyInforAPI: '/drug-warehouse-work/drugApply/applyInfor',
      applyInforChangeAPI: '/drug-warehouse-work/drugApply/applyInforChange'
    }
  },
  computed: {
    statusFilters: {
      get () {
        const result = []
        const temp = []
        for (const item of ['同意', '拒绝', '待审批']) {
          temp.push(item)
        }
        for (const item of [...new Set(temp)]) {
          const tempObj = {}
          tempObj.text = item
          tempObj.value = item
          result.push(tempObj)
        }
        return result
      }
    }
  },
  methods: {
    async getAllApplyInfor () {
      await axios.get(this.applyInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.allApplyInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    statusFilterMethod (value, row) {
      return row.grantStatus === value
    },
    agreeApply (applicantName, applyTime) {
      axios.post(this.applyInforChangeAPI, {
        token: localStorage.getItem('token'),
        applicantName: applicantName,
        applyTime: applyTime,
        grantStatus: '同意'
      }).then(() => { this.getAllApplyInfor() }).catch((result) => { this.$store.state.errorReport(result) })
    },
    rejectApply (applicantName, applyTime) {
      axios.post(this.applyInforChangeAPI, {
        token: localStorage.getItem('token'),
        applicantName: applicantName,
        applyTime: applyTime,
        grantStatus: '拒绝'
      }).then(() => { this.getAllApplyInfor() }).catch((result) => { this.$store.state.errorReport(result) })
    }
  },
  async beforeMount () {
    await this.getAllApplyInfor()
  }
}
</script>
