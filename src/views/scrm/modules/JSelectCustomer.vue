<template>
  <div>
    <a-input-search v-model="textVals" placeholder="请先选择客户" readOnly unselectable="on" @search="onSearchCustom">
      <a-button slot="enterButton" :disabled="disabled">选择客户</a-button>
    </a-input-search>
    <j-select-customer-modal
      ref="selectModal"
      :modal-width="modalWidth"
      :multi="multi"
      @ok="selectOK"
      :ids="value"
      :store="storeField"
      :text="textField"
      @initComp="initComp"
    />
  </div>
</template>

<script>
import JSelectCustomerModal from './JSelectCustomerModal'
import { underLinetoHump } from '@/components/_util/StringUtil'

export default {
  name: 'JSelectCustomer',
  components: { JSelectCustomerModal },
  props: {
    modalWidth: {
      type: Number,
      default: 1000,
      required: false,
    },
    value: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    multi: {
      type: Boolean,
      default: true,
      required: false,
    },
    // 存储字段 [key field]
    store: {
      type: String,
      default: 'id',
      required: false,
    },
    // 显示字段 [label field]
    text: {
      type: String,
      default: 'customName',
      required: false,
    },
  },
  data() {
    return {
      storeVals: '', //[key values]
      textVals: '', //[label values]
    }
  },
  computed: {
    storeField() {
      let field = this.customReturnField
      if (!field) {
        field = this.store
      }
      return underLinetoHump(field)
    },
    textField() {
      return underLinetoHump(this.text)
    },
  },
  mounted() {
    this.storeVals = this.value
  },
  watch: {
    value(val) {
      this.storeVals = val
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  methods: {
    initComp(textVals) {
      this.textVals = textVals
    },
    onSearchCustom() {
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
      this.$emit('change', this.storeVals, rows)
    },
  },
}
</script>

<style scoped></style>
