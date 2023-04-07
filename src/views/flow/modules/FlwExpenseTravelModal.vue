<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <flw-expense-travel-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></flw-expense-travel-form>
  </j-modal>
</template>

<script>

  import FlwExpenseTravelForm from './FlwExpenseTravelForm'
  export default {
    name: 'FlwExpenseBudgetModal',
    components: {
      FlwExpenseTravelForm
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false,
        cunnrent:{}
      }
    },
    methods: {
      add () {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      edit (record) {
        this.cunnrent = record
        console.log(record);
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.$refs.realForm.submitForm();
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>