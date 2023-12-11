<template>
  <div id="subordinateVocationApply">
    <el-table :data="allApplyInfor" v-if="allApplyInfor" :row-class-name="tableRowClassName">
      <el-table-column type="expand" fixed>
        <template #default="props">
          <div class="applyDetail">
            <p>请假时间段：{{ props.row.vocationRange }}</p>
            <p>请假理由：{{ props.row.applicantReason }}</p>
            <p>审批状态：{{ props.row.grantStatus }}</p>
            <el-button v-if="props.row.grantStatus === '待审批'" type="success" @click="agreeApply(props.row.applicantName, props.row.applyTime)">同意-请假申请</el-button>
            <el-button v-else type="success" plain disabled>同意-请假申请</el-button>
            <el-button v-if="props.row.grantStatus === '待审批'" type="danger" @click="rejectApply(props.row.applicantName, props.row.applyTime)">拒绝-请假申请</el-button>
            <el-button v-else type="danger" plain disabled>拒绝-请假申请</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="申请人" prop="applicantName" :filters="nameFilters" :filter-method="nameFilterMethod">
      </el-table-column>
      <el-table-column label="申请提交时间" prop="applyTime" sortable>
      </el-table-column>
      <el-table-column label="审批状态" prop="grantStatus" :filters="statusFilters" :filter-method="statusFilterMethod">
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-input v-model="searchCondition" placeholder="输入搜索信息" />
        </template>
        <template #default="scope">
          <el-button v-if="scope.row.grantStatus === '待审批'" type="success" @click="agreeApply(scope.row.applicantName, scope.row.applyTime)">同意-请假申请</el-button>
          <el-button v-else type="success" plain disabled>同意-请假申请</el-button>
          <el-button v-if="scope.row.grantStatus === '待审批'" type="danger" @click="rejectApply(scope.row.applicantName, scope.row.applyTime)">拒绝-请假申请</el-button>
          <el-button v-else type="danger" plain disabled>拒绝-请假申请</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style>
#subordinateVocationApply .grant-success{
  color: #529b2e;
}
#subordinateVocationApply .grant-reject{
  color:#c45656;
}
#subordinateVocationApply .grant-error{
  color:#b88230;
}
#subordinateVocationApply .grant-not{
  color: #73767a;
}
#subordinateVocationApply .applyDetail{
  padding: 0.5rem 1.5rem;
}
#subordinateVocationApply .applyDetail p{
  margin-bottom: 1rem;
}
</style>

<script>
import axios from 'axios'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'vocationApplyView',
  data () {
    return {
      allApplyInfor: false,
      allApplyInforCopy: false,
      searchCondition: '',
      vocationApplyInforAPI: '/subordinate/vocation-apply/vocationApplyInfor',
      applyInforChangeAPI: '/subordinate/vocation-apply/applyInforChange'
    }
  },
  watch: {
    searchCondition (newValue, oldValue) {
      const result = []
      for (const item of this.allApplyInforCopy) {
        let flag = false
        for (const text of Object.entries(item)) {
          if (text[1].includes(newValue)) {
            flag = true
          }
        }
        if (flag) {
          result.push(item)
        }
      }
      this.allApplyInfor = result
    }
  },
  computed: {
    nameFilters: {
      get () {
        const result = []
        const temp = []
        for (const item of Object.entries(this.allApplyInfor)) {
          temp.push(item[1].applicantName)
        }
        for (const item of [...new Set(temp)]) {
          const tempObj = {}
          tempObj.text = item
          tempObj.value = item
          result.push(tempObj)
        }
        return result
      }
    },
    statusFilters: {
      get () {
        const result = []
        const temp = []
        for (const item of Object.entries(this.allApplyInfor)) {
          temp.push(item[1].grantStatus)
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
      await axios.get(this.vocationApplyInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.allApplyInfor = result.data
        this.allApplyInforCopy = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    tableRowClassName ({ row, rowIndex }) {
      switch (row.grantStatus) {
        case '同意':
          return 'grant-success'
        case '拒绝':
          return 'grant-reject'
        case '超时：系统自动拒绝':
          return 'grant-error'
        default:
          return 'grant-not'
      }
    },
    nameFilterMethod (value, row) {
      return row.applicantName === value
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
