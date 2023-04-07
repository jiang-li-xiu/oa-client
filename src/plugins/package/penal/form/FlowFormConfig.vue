<template>
  <div class="panel-tab__content">
    <el-form ref="form" size="mini" label-width="80px" :model="formData" :rules="rules" @submit.native.prevent>
      <el-form-item label="允许编辑">
        <el-switch v-model="formData.editable" @change="updateElementFormKey" />
      </el-form-item>
      <el-form-item label="节点按钮">
        <el-checkbox-group v-model="actionList" @change="handleChange">
          <el-checkbox v-for="item in actionTypeList"
            :key="item.value"
            :label="item.value"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'flowFormConfig',
  props: {
    id: String,
    type: String
  },
  inject: ['prefix'],
  data () {
    return {
      formData: {
        editable: false
      },
      operationList: undefined,
      formOperationList: [],
      rules: {
        formId: [
          {required: true, message: '请选择在线表单！', trigger: 'blur'}
        ],
        routerName: [
          {required: true, message: '表单路由不能为空！', trigger: 'blur'}
        ]
      },
      actionList: [],
      actionTypeList: [
        {
          value: 'pass',
          label: '审批'
        },
        {
          value: 'reject',
          label: '拒绝'
        },
        {
          value: 'return',
          label: '退回'
        }],
    }
  },
  methods: {
    resetFormList () {
      this.bpmnELement = window.bpmnInstances.bpmnElement;
      let formData = this.bpmnELement.businessObject.formKey;
      let formObj = formData ? JSON.parse(formData) : undefined;
      if (formObj) {
        this.formData = {
          editable: !formObj.readOnly,
        }
      }
      let elExtensionElements = this.bpmnELement.businessObject.get("extensionElements") || window.bpmnInstances.moddle.create("bpmn:ExtensionElements", { values: [] });
      this.operationList = elExtensionElements.values.filter(ex => ex.$type === `${this.prefix}:OperationList`)?.[0] ||
        window.bpmnInstances.moddle.create(`${this.prefix}:OperationList`, { operationList: [] });
      this.formOperationList = JSON.parse(JSON.stringify(this.operationList.operationList || []));
      if(this.formOperationList && this.formOperationList.length > 0){
        let temp = []
        this.formOperationList.forEach(item => {
          temp.push(item.type)
        });
        this.actionList = temp
      }else{
        this.actionList = []
      }
      
      // 更新元素扩展属性，避免后续报错
      this.updateElementFormKey();
      this.updateElementExtensions();
    },
    updateElementFormKey () {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        let formKeyString = JSON.stringify({
          readOnly: !this.formData.editable,
        });
        window.bpmnInstances.modeling.updateProperties(this.bpmnELement, { formKey: formKeyString });
      });
    },
    updateElementExtensions () {
      // 更新回扩展元素
      let elExtensionElements = this.bpmnELement.businessObject.get("extensionElements")  || window.bpmnInstances.moddle.create("bpmn:ExtensionElements", { values: [] });
      let otherExtensions = elExtensionElements.values.filter(ex => ex.$type !== `${this.prefix}:OperationList`);
      const newElExtensionElements = window.bpmnInstances.moddle.create(`bpmn:ExtensionElements`, {
        values: otherExtensions.concat(this.operationList)
      });
      this.operationList.operationList = this.formOperationList.map(item => {
        return window.bpmnInstances.moddle.create(`${this.prefix}:FormOperation`, {
          label: item.label,
          type: item.type
        });
      });
      // 更新到元素上
      window.bpmnInstances.modeling.updateProperties(this.bpmnELement, {
        extensionElements: newElExtensionElements
      });
    },
    /**按钮选择变化 */
    handleChange() {
      let actionList = this.actionList || []
      let formOperationList = []
      this.actionTypeList.forEach((item, index) => {
        actionList.forEach((item2) => {
          if(item.value == item2){
            formOperationList.push({"type" : item.value, label : item.label})
          }
        })
      })
      // 更新回扩展元素
      let elExtensionElements = this.bpmnELement.businessObject.get("extensionElements")  || window.bpmnInstances.moddle.create("bpmn:ExtensionElements", { values: [] });
      let otherExtensions = elExtensionElements.values.filter(ex => ex.$type !== `${this.prefix}:OperationList`);
      const newElExtensionElements = window.bpmnInstances.moddle.create(`bpmn:ExtensionElements`, {
        values: otherExtensions.concat(this.operationList)
      });
      this.operationList.operationList = formOperationList.map(item => {
        return window.bpmnInstances.moddle.create(`${this.prefix}:FormOperation`, {
          label: item.label,
          type: item.type
        });
      });
      // 更新到元素上
      window.bpmnInstances.modeling.updateProperties(this.bpmnELement, {
        extensionElements: newElExtensionElements
      });
    },
  },
  watch: {
    id: {
      immediate: true,
      handler (val) {
        if (val && val.length) {
          this.$nextTick(() => {
            this.resetFormList();
          });
        }
      }
    }
  },
  beforeDestroy () {
    this.actionList = [];
  }
}
</script>

<style scoped>
  .full-line-btn {
    width: 100%;
    margin-top: 10px;
    border: 1px dashed #EBEEF5;
  }
</style>
