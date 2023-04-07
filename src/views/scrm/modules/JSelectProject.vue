<template>
  <div>
    <a-input-search
      v-model="textVals"
      placeholder="请先选择项目"
      readOnly
      unselectable="on"
      @search="onSearchDepUser">
      <a-button slot="enterButton" :disabled="disabled">选择项目</a-button>
    </a-input-search>
    <j-select-project-modal
      ref="selectModal"
      :modal-width="modalWidth"
      :multi="multi"
      @ok="selectOK"
      :ids="value"
      :store="storeField"
      :text="textField"
      @initComp="initComp"/>
  </div>
</template>

<script>
  import JSelectProjectModal from './JSelectProjectModal'
  import { underLinetoHump } from '@/components/_util/StringUtil'

  export default {
    name: 'JSelectUserByDep',
    components: {JSelectProjectModal},
    props: {
      modalWidth: {
        type: Number,
        default: 1250,
        required: false
      },
      value: {
        type: String,
        required: false
      },
      disabled: {
        type: Boolean,
        required: false,
        default: false
      },
      multi: {
        type: Boolean,
        default: true,
        required: false
      },
      // 存储字段 [key field]
      store: {
        type: String,
        default: 'id',
        required: false
      },
      // 显示字段 [label field]
      text: {
        type: String,
        default: 'projectName',
        required: false
      }
    },
    data() {
      return {
        storeVals: '', //[key values]
        textVals: '' //[label values]
      }
    },
    computed:{
      storeField(){
        let field = this.customReturnField
        if(!field){
          field = this.store;
        }
        return underLinetoHump(field)
      },
      textField(){
        return underLinetoHump(this.text)
      }
    },
    mounted() {
      this.storeVals = this.value
    },
    watch: {
      value(val) {
        this.storeVals = val
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    methods: {
      initComp(textVals) {
        this.textVals = textVals
      },
      onSearchDepUser() {
        this.$refs.selectModal.showModal()
      },
      selectOK(rows) {
        if (!rows) {
          this.storeVals = ''
          this.textVals = ''
        } else {
          let temp1 = []
          let temp2 = []
          for (let item of rows) {
            temp1.push(item[this.storeField])
            temp2.push(item[this.textField])
          }
          this.storeVals = temp1.join(',')
          this.textVals = temp2.join(',')
        }
        this.$emit("change", this.storeVals, rows)
      }
    }
  }
</script>

<style scoped>

</style>