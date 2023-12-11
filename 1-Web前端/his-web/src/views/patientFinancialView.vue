<template>
  <BasicFrame>
    <div id="patientFinancial" class="contents">
      <el-table :data="financialInfor" border v-if="financialInfor" show-summary>
        <el-table-column prop="patientName" label="缴费人"></el-table-column>
        <el-table-column prop="itemName" label="缴费项目"></el-table-column>
        <el-table-column prop="payStatus" label="缴费状态" :filters="nameFilters" :filter-method="nameFilterMethod"></el-table-column>
        <el-table-column prop="itemMoney" label="缴费金额" sortable></el-table-column>
      </el-table>
    </div>
  </BasicFrame>
</template>

<style>
#patientFinancial{
  padding: 1rem;
}
</style>

<script>
import axios from 'axios'
import BasicFrame from '@/components/basicFrame.vue'
import { mapState } from 'vuex'

export default {
  name: 'userView',
  data () {
    return {
      financialInfor: false,
      financialInforAPI: '/patient/financial/financialInfor'
    }
  },
  components: {
    BasicFrame
  },
  computed: {
    ...mapState(['childrenPermissions']),
    nameFilters: {
      get () {
        const result = []
        const temp = []
        for (const item of ['已缴费', '未缴费']) {
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
    async getFinancialInfor () {
      await axios.get(this.financialInforAPI, {
        params: {
          token: localStorage.getItem('token')
        }
      }).then((result) => {
        this.financialInfor = result.data
      }).catch((result) => { this.$store.state.errorReport(result) })
    },
    nameFilterMethod (value, row) {
      return row.payStatus === value
    }
  },
  async beforeMount () {
    await this.getFinancialInfor()
  }
}
</script>
