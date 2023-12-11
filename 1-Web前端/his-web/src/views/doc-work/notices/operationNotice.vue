<template>
  <div id="operationNotice">
    <div class="notice">
      <h1>手术知情书</h1>
      <p class="text">我，________________（患者姓名），已经充分理解了我将要接受的手术________________（手术名称）的目的、过程、可能的风险和并发症，以及其他可能的治疗方案。我明白没有任何手术能保证完全成功，我已经有足够的机会向医生提问并讨论我的疑虑。</p>
      <p class="text">我理解手术可能会带来一些并发症，包括但不限于感染、出血、疼痛、麻醉并发症、器官损伤、术后并发症和可能的再次手术。我明白这些风险可能会对我的健康产生长期影响。</p>
      <p class="text">我同意________________（医生姓名）医生和他/她的团队进行上述手术。我明白医生会尽他/她的最大努力来预防并发症，但是不能保证手术结果。</p>
      <p class="text">我已经阅读并理解了这份免责声明，我签名表示我同意接受手术。</p>
      <p class="date">日期：{{ `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}` }}</p>
      <div class="sign">
        <p class="patientSign">患者签名：</p>
        <p class="doctorSign">医生签名：</p>
      </div>
    </div>
  </div>
</template>

<style>
#operationNotice .notice{
  margin: 2rem 10%;
  width: 80%;
  display: flex;
  flex-direction: column;
}
#operationNotice h1{
  align-self: center;
  margin: 1rem 0;
}
#operationNotice .text{
  width: 94%;
  margin: 1rem 3%;
  line-height: 2rem;
  text-indent:2em;
}
#operationNotice .date{
  margin-top: 1rem;
  width: 97%;
  margin-left: 3%;
}
#operationNotice .sign{
  margin: 1rem 20%;
  width: 60%;
  display: flex;
  justify-content: space-between;
}
</style>

<script>
export default {
  name: 'operationNotice',
  async mounted () {
    window.print()
    window.close()
  }
}
</script>
