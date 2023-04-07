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
    <crm-custom-liaison-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></crm-custom-liaison-form>
  </j-modal>
</template>

<script>

  import CrmCustomLiaisonForm from './CrmCustomLiaisonForm'
  export default {
    name: 'CrmCustomLiaisonModal',
    components: {
      CrmCustomLiaisonForm
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
      add () {
        this.visible=true
        this.title = "添加联系人"
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      edit (record) {
        this.visible=true
        this.title = "编辑联系人"
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
      submitCallback(formData){
        this.$emit('ok', formData);
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>