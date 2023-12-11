<template>
  <div id="drugNotice">
    <div class="notice">
      <h1>手术知情书</h1>
      <p class="text">我，________________（患者姓名），已经充分理解了我将要使用的药品________________（药品名称）的目的、用法、可能的副作用和风险，以及其他可能的治疗方案。我明白没有任何药品能保证完全无副作用，我已经有足够的机会向医生提问并讨论我的疑虑。</p>
      <p class="text">我理解药品可能会带来一些副作用，包括但不限于过敏反应、肝肾功能损害、消化系统反应等。我明白这些风险可能会对我的健康产生长期影响。</p>
      <p class="text">我同意按照医生的建议使用上述药品。我明白医生会尽他/她的最大努力来预防副作用，但是不能保证药品效果。</p>
      <p class="text">我已经阅读并理解了这份免责声明，我签名表示我同意使用药品。</p>
      <p class="date">日期：{{ `${new Date().toLocaleDateString()}  ${new Date().toLocaleTimeString()}` }}</p>
      <div class="sign">
        <p class="patientSign">患者签名：</p>
        <p class="doctorSign">医生签名：</p>
      </div>
    </div>
  </div>
</template>

<style>
#drugNotice .notice{
  margin: 2rem 10%;
  width: 80%;
  display: flex;
  flex-direction: column;
}
#drugNotice h1{
  align-self: center;
  margin: 1rem 0;
}
#drugNotice .text{
  width: 94%;
  margin: 1rem 3%;
  line-height: 2rem;
  text-indent:2em;
}
#drugNotice .date{
  margin-top: 1rem;
  width: 97%;
  margin-left: 3%;
}
#drugNotice .sign{
  margin: 1rem 20%;
  width: 60%;
  display: flex;
  justify-content: space-between;
}
</style>

<script>
export default {
  name: 'drugNotice',
  async mounted () {
    window.print()
    window.close()
  }
}
</script>
