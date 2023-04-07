<template>
  <div class="panel-tab__content">
    <ConyForSelect ref="ConyForSelect" v-model="copyForItemList" :id="id"/>
  </div>
</template>

<script>
import ConyForSelect from './CopyForSelect';

export default {
  name: "CopyFor",
  props: {
    id: String,
    value: String,
    type: String
  },
  components: {
    ConyForSelect
  },
  inject: ['prefix'],
  data () {
    return {
      copyForItemList: [],
      copyItemElementList: undefined,
      selectedUser: {
        ids: [],
        text: []
      },
      userIds:''
    }
  },
  methods: {
    //重置表单变量
    resetFormVariable () {
      // 获取当前图元元素
      this.bpmnELement = window.bpmnInstances.bpmnElement;
      // 获取当前图元元素的扩展属性，如果扩展属性已经存在则直接赋值，如果不存在则创建
      let elExtensionElements = this.bpmnELement.businessObject.get("extensionElements") || window.bpmnInstances.moddle.create("bpmn:ExtensionElements", { values: [] });
      // 获取抄送元素，遍历values数组，返回数组中类型type为flowable:CopyItemList的数组元素，如果没有则返回空数组，如果没有则创建一个抄送属性
      if(elExtensionElements.values){
        this.copyItemElementList = elExtensionElements.values.filter(ex => ex.$type === `${this.prefix}:CopyItemList`)?.[0] ||
          window.bpmnInstances.moddle.create(`${this.prefix}:CopyItemList`, { copyItemList: [] });
        // 初始化抄送元素数据，也即抄送属性数据
        this.copyForItemList = this.copyItemElementList.copyItemList;
        this.updateElementExtensions();
      }else{
        this.$refs.ConyForSelect.update('', {})
      }
    },
    updateElementExtensions () {

      // 更新回扩展元素，如果扩展属性已经存在则直接赋值，如果不存在则创建
      let elExtensionElements = this.bpmnELement.businessObject.get("extensionElements") || window.bpmnInstances.moddle.create("bpmn:ExtensionElements", { values: [] });
      // 遍历values数组，返回数组中类型type不为flowable:CopyItemList的数组元素，如果没有则返回空数组
      let otherExtensions = elExtensionElements.values.filter(ex => ex.$type !== `${this.prefix}:CopyItemList`);
      this.copyItemElementList.copyItemList = (this.copyForItemList || []).map(item => {
        this.userIds = item.value?.toString()
        this.selectedUser.ids = item.value?.toString().split(',')
        this.selectedUser.text = item.name?.split(',')
        return window.bpmnInstances.moddle.create(`${this.prefix}:CopyItem`, {
          value: item.value,
          name: item.name,
          type: item.type
        });
      });
      const newElExtensionElements = window.bpmnInstances.moddle.create(`bpmn:ExtensionElements`, {
        values: otherExtensions.concat(this.copyItemElementList)
      });
      // 更新到元素上
      window.bpmnInstances.modeling.updateProperties(this.bpmnELement, {
        extensionElements: newElExtensionElements
      });
      this.$refs.ConyForSelect.update(this.userIds, this.selectedUser)
    }
  },
  watch: {
    'copyForItemList': {
      handler (newValue) {
        this.updateElementExtensions();
      }
    },
    id: {
      immediate: true,
      handler (val) {
        if (val && val.length) {
          this.$nextTick(() => {
            this.resetFormVariable();
          });
        }
      }
    }
  }
}
</script>

<style>
</style>
