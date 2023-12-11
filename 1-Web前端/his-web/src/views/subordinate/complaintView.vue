<template>
  <div id="subordinateComplaint">
    <el-table :data="allComplaintInfor" v-if="allComplaintInfor" :row-class-name="tableRowClassName">
      <el-table-column type="expand" fixed>
        <template #default="props">
          <div class="complaintDetail">
            <p>投诉原因：{{ props.row.complaintReason }}</p>
            <p>回复状态：{{ props.row.replyStatus }}</p>
            <el-input v-if="props.row.replyStatus === '未回复'" type="textarea" v-model="replyText[props.$index]" placeholder="输入回复内容"></el-input>
            <el-input v-else type="textarea" disabled placeholder="已经回复，不可再回复"></el-input>
            <el-button v-if="props.row.replyStatus === '未回复'" type="success" @click="replyComplaint(props.row.complaintName, props.row.complaintTime, replyText[props.$index])">回复投诉</el-button>
            <el-button v-else type="success" plain disabled>回复投诉</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="被投诉人" prop="complaintName" :filters="nameFilters" :filter-method="nameFilterMethod">
      </el-table-column>
      <el-table-column label="投诉时间" prop="complaintTime" sortable>
      </el-table-column>
      <el-table-column label="回复状态" prop="replyStatus" :filters="statusFilters" :filter-method="statusFilterMethod">
      </el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-input v-model="searchCondition" placeholder="输入搜索信息" />
        </template>
        <template #default="scope">
          <el-input v-if="scope.row.replyStatus === '未回复'" type="textarea" v-model="replyText[scope.$index]" placeholder="输入回复内容"></el-input>
          <el-input v-else type="textarea" disabled placeholder="已经回复，不可再回复"></el-input>
          <el-button v-if="scope.row.replyStatus === '未回复'" type="success" @click="replyComplaint(scope.row.complaintName, scope.row.complaintTime, replyText[scope.$index])">回复投诉</el-button>
          <el-button v-else type="success" plain disabled>回复投诉</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style>
#subordinateComplaint .reply-success{
  color: #529b2e;
}
#subordinateComplaint .reply-warning{
  color:#b88230;
}
#subordinateComplaint .complaintDetail{
  padding: 0.5rem 1.5rem;
}
#subordinateComplaint .complaintDetail p{
  margin-bottom: 1rem;
}
#subordinateComplaint .el-button{
  margin-top: 1rem;
}
</style>

<script>
import axios from 'axios'
// .catch((result) => { this.$store.state.errorReport(result) })

export default {
  name: 'complaintView',
  data () {
    return {
      allComplaintInfor: false,
      allComplaintInforCopy: false,
      replyText: [],
      searchCondition: '',
      complaintInforAPI: '/subordinate/complaint/complaintInfor',
      complaintInforChangeAPI: '/subordinate/complaint/complaintInforChange'
    }
  },
  watch: {
    searchCondition (newValue, oldValue) {
      const result = []
      for (const item of this.allComplaintInforCopy) {
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
      this.allComplaintInfor = result
    },
    allComplaintInfor (newValue, oldValue) {
      this.replyText = []
    }
  },
  computed: {
    nameFilters: {
      get () {
        const result = []
        const temp = []
        for (const item of Object.entries(this.allComplaintInfor)) {
          temp.push(item[1].complaintName)
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
        for (const item of Object.entries(this.allComplaintInfor)) {
          temp.push(item[1].replyStatus)
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
    async getAllComplaintInfor () {
      await axios.get(this.complaintInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.allComplaintInfor = result.data
        this.allComplaintInforCopy = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    tableRowClassName ({ row, rowIndex }) {
      switch (row.replyStatus) {
        case '已回复':
          return 'reply-success'
        default:
          return 'reply-warning'
      }
    },
    nameFilterMethod (value, row) {
      return row.complaintName === value
    },
    statusFilterMethod (value, row) {
      return row.replyStatus === value
    },
    replyComplaint (complaintName, complaintTime, replyText) {
      axios.post(this.complaintInforChangeAPI, {
        token: localStorage.getItem('token'),
        complaintName: complaintName,
        complaintTime: complaintTime,
        replyText: replyText,
        replyStatus: '同意'
      }).then(() => { this.getAllComplaintInfor() }).catch((result) => { this.$store.state.errorReport(result) })
    }
  },
  async beforeMount () {
    await this.getAllComplaintInfor()
  }
}
</script>
