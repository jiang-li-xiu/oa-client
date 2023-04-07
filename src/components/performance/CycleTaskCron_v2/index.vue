<template lang="html">
  <div class="cron" :val="value_">

      <div>
        <el-radio-group v-model="radio" @change="updateInfo">
          <el-radio-button label='1'>每日</el-radio-button>
          <el-radio-button label='2'>每周</el-radio-button>
          <el-radio-button label='3'>每月</el-radio-button>
          <el-radio-button label='4'>自定义</el-radio-button>
        </el-radio-group>
      </div>
              <week v-model="weekVal" lable="周" v-if="this.radio == '2'"></week>
              <month v-model="monthVal" lable="月"  v-if="this.radio == '4'"></month>
              <day v-model="dVal"  lable="日" v-if="this.radio == '3' || this.radio == '4'"></day>
      </div>
</template>

<script>
import SecondAndMinute from './secondAndMinute'
import hour from './hour'
import day from './day'
import month from './month'
import week from './week'
import year from './year'
export default {
  components: {
    SecondAndMinute, hour, day, month, week, year
  },
  props: {
    // value: {
    //   type: Object
    // },
    cronExpression:{
      type:String
    },
    cycleType:{
      type:String
    }
  },
  data () {
    return {
      radio: '1',
      sVal: '00',
      mVal: '00',
      hVal: '00',
      dVal: '1',
      monthVal: '*',
      weekVal: '?',
      yearVal: '*',
      cronExpressionLabel:"123",
    }
  },
  mounted(){
    console.log(this.cronExpression)
  },
  computed: {
    tableData () {
      return [{
        sVal: this.sVal,
        mVal: this.mVal,
        hVal: this.hVal,
        dVal: this.dVal,
        monthVal: this.monthVal,
        weekVal: this.weekVal,
        yearVal: this.yearVal
      }]
    },
    value_ () {
      let v = '';
      let cronExpressionLabel = '';
      let weekArr = this.weekVal.split(",");
      var s = '';
      for(var i = 0; i < weekArr.length ; i++){
        let temp =  parseInt(weekArr[i]) - 1
        s += (temp != 0 ? temp : 7 +'')
        if(i != weekArr.length - 1) s += ',';
      }
      
      switch(this.radio){
        case '1':
          v = '00 00 00 * * ? *';this.radio = '1'; cronExpressionLabel = '每天';break;
        case '2':
          v = `00 00 00 ? * ${this.weekVal} *`;this.radio = '2';cronExpressionLabel =  `周${s}`;break;
        case '3':
          v = `00 00 00 ${this.dVal} * ? *`;this.radio = '3';cronExpressionLabel =  `每个月的${this.dVal}号`;break;
        case '4':
          v = `00 00 00 ${this.dVal} ${this.monthVal} ? *`;this.radio = '4';cronExpressionLabel = `${this.monthVal}月的${this.dVal}号`;break;
      }
      console.log(cronExpressionLabel)
      // let res = {cronExpression:v,cycleType:this.radio,startTime:this.value.startTime,endTime:this.value.endTime,startDate:this.value.startDate,endDate:this.value.endDate}
      this.$emit('updateCycleInfo', {cronExpression:v,cycleType:this.radio,cronExpressionLabel:cronExpressionLabel})
      return v
    },
  },
  methods: {
    updateVal () {
      // if (!this.value) {
      //   return
      // }
      if(this.cronExpression != null && this.cycleType != null){
        let arrays = this.cronExpression.split(' ')
        this.radio = this.cycleType;
        this.sVal = arrays[0]
        this.mVal = arrays[1]
        this.hVal = arrays[2]
        this.dVal = arrays[3]
        this.monthVal = arrays[4]
        this.weekVal = arrays[5]
        this.yearVal = arrays[6]
      }
    },
   updateInfo(){
     switch(this.radio){
       case '2': this.weekVal='2';break;
       case '3': this.dVal = '1';break;
       case '4': this.dVal='1';this.monthVal = '1';break;
     }
   }
  },
  created () {
    this.updateVal()
  },
  watch: {
    'cronExpression' (a, b) {
      this.updateVal()
    },
    'cycleType' (a, b) {
      this.updateVal()
    }
  },
}
</script>

<style lang="css">
.cron {
  text-align: left;
  padding: 10px;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
}
</style>
