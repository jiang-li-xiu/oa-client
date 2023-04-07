<template lang="html">
  <div :val="value_">
    <div class="bottom" style="margin-top: 10px;">
      <!-- <el-radio v-model="type" label="4" size="mini" border>选择日</el-radio> -->
        <el-tag type="success">选择日</el-tag>
      <el-checkbox-group v-model="appoint" >
        <div class="aaa">
          <el-checkbox style="margin:5px 0 5px 10px;;" @change="type = '4'"  v-for="j in 31" :label="j + ''"></el-checkbox>
        </div>
        <!-- <div v-for="i in 4" :key="i" style="margin-left: 10px;  line-height: 25px;">
          <el-checkbox @change="type = '4'" v-for="j in 10"
                       v-if="parseInt((i - 1) + '' + (j - 1)) < 32 && !(i == 1 && j==1)" :key="j"
                       :label="(i == 1 ? '' : i - 1) + '' + (j - 1)"></el-checkbox>
        </div> -->
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '*'
    }
  },
  data() {
    return {
      type: '4', // 类型
      cycle: { // 周期
        start: 0,
        end: 0
      },
      loop: { // 循环
        start: 0,
        end: 0
      },
      week: { // 指定周
        start: 0,
        end: 0
      },
      work: 0,
      last: 0,
      appoint: ['1'] // 指定
    }
  },
  computed: {
    value_() {
      let result = []
      switch (this.type) {
        case '1': // 每秒
          result.push('*')
          break
        case '2': // 周期
          result.push(`${this.cycle.start}-${this.cycle.end}`)
          break
        case '3': // 循环
          result.push(`${this.loop.start}/${this.loop.end}`)
          break
        case '4': // 指定
          result.push(this.appoint.join(','))
          break
        case '6': // 最后
          result.push(`${this.last === 0 ? '' : this.last}L`)
          break
        case '7': // 指定周
          result.push(`${this.week.start}#${this.week.end}`)
          break
        case '8': // 工作日
          result.push(`${this.work}W`)
          break
        default: // 不指定
          result.push('?')
          break
      }
      ;
      this.$emit('input', result.join(''))
      return result.join('')
    }
  },
  watch: {
    'value'(a, b) {
      this.updateVal()
    }
  },
  methods: {
    updateVal() {
      if (!this.value) {
        return
      }
      if (this.value === '?') {
        this.type = '5'
      } else if (this.value.indexOf('-') !== -1) { // 2周期
        if (this.value.split('-').length === 2) {
          this.type = '2'
          this.cycle.start = this.value.split('-')[0]
          this.cycle.end = this.value.split('-')[1]
        }
      } else if (this.value.indexOf('/') !== -1) { // 3循环
        if (this.value.split('/').length === 2) {
          this.type = '3'
          this.loop.start = this.value.split('/')[0]
          this.loop.end = this.value.split('/')[1]
        }
      } else if (this.value.indexOf('*') !== -1) { // 1每
        this.type = '1'
      } else if (this.value.indexOf('L') !== -1) { // 6最后
        this.type = '6'
        this.last = this.value.replace('L', '')
      } else if (this.value.indexOf('#') !== -1) { // 7指定周
        if (this.value.split('#').length === 2) {
          this.type = '7'
          this.week.start = this.value.split('#')[0]
          this.week.end = this.value.split('#')[1]
        }
      } else if (this.value.indexOf('W') !== -1) { // 8工作日
        this.type = '8'
        this.work = this.value.replace('W', '')
      } else { // *
        this.type = '4'
        this.appoint = this.value.split(',')
      }
    }
  },
  created() {
    this.updateVal()
  }
}
</script>

<style lang="css">
.el-checkbox + .el-checkbox {
  margin-left: 10px;
}

.bottom {
  margin-bottom: 10px;
}
.aaa{
  display: grid;
  grid-template-columns: repeat(10,1fr);
}
</style>
