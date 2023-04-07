<template>
  <div>
    <j-modal
      :title="title"
      :width="width"
      :visible="visible"
      switchFullscreen
      :fullscreen=true
      :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
      @cancel="handleCancel"
      cancelText="关闭">
      <a-spin :tip="tips" :spinning="loading">
        <process-designer
          :key="designerOpen"
          style="border:1px solid rgba(0, 0, 0, 0.1);"
          ref="modelDesigner"
          v-loading="designerData.loading"
          :bpmnXml="designerData.bpmnXml"
          :designerForm="designerData.form"
          :conditions="conditions"
          :conditionList = "conditionList"
          @save="onSaveDesigner"
        />
      </a-spin>
    </j-modal>
  </div>
</template>

<script>
  import ProcessDesigner from '@/plugins/modal/ProcessDesignerModal';
  import { postAction } from '@/api/manage'
  export default {
    name: 'ActReWorkflowModal',
    components: {
      ProcessDesigner
    },
    props: {
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false,
        designerData: {
          loading: false,
          bpmnXml: '',
          modelId: '',
          form: {
            processName: '',
            processKey: ''
          }
        },
        conditions:[],
        conditionList:{},
        designerOpen: false,
        tips: '加载中...',
        loading: false
      }
    },
    methods: {
      design (record) {
        let bpmnXml = record.processXml;
        this.visible=true
        this.designerData.title = record.processName;
        this.designerData.modelId = record.id;
        this.designerData.bpmnXml = bpmnXml != null ? bpmnXml : '';
        this.designerData.form.processName = record.processName;
        this.designerData.form.processKey = 'lst_' + record.id;
        this.conditions = record.conditions;
        this.conditionList = record.conditionList
        this.$nextTick(()=>{
          this.$refs.modelDesigner.design(record);
        })
      },
      /**保存流程设计数据 */
      onSaveDesigner(bpmnXml, conditionList) {
        let that = this;
        let postData = {
          id: this.designerData.modelId, //模型id
          processXml: bpmnXml, // 模型xml文件
          conditionList: conditionList //条件数据
        }
        this.$confirm({
          title: '提示',
          content: (h)=>(<div style="color:#ff4d4f;">是否保存该模型！</div>),
          okText: '是',
          okType: 'danger',
          cancelText: '否',
          centered: true,
          onOk() {
            that.loading = true
            postAction('/workflow/actReWorkflow/saveDesign', postData).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$confirm({
                    title: '保存成功',
                    okText: '完成',
                    okType: 'primary',
                    cancelText: '继续编辑',
                    centered: true,
                    onOk(){
                      that.close()
                      that.$emit('refresh')
                    }
                  })
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.loading = false
            })
          }
        });
      },
      add () {
        this.editVisible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      edit (record) {
        this.editVisible=true
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
      },
      handleEditCancel () {
        this.close()
      }
    }
  }
</script>