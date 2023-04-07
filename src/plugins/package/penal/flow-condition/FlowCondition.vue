<template>
  <div class="panel-tab__content">
    <a-form-model :model="flowConditionForm" label-width="90px" size="mini" @submit.native.prevent>
      <a-form-model-item label="流转类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select v-model="flowConditionForm.type" @change="updateFlowType">
          <a-select-option label="普通流转路径" value="normal">普通流转路径</a-select-option>
          <a-select-option label="默认流转路径" value="default">默认流转路径</a-select-option>
          <a-select-option label="条件流转路径" value="condition">条件流转路径</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="条件格式" v-if="flowConditionForm.type === 'condition'" key="condition" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select v-model="flowConditionForm.conditionType">
          <a-select-option label="表达式" value="expression">表达式</a-select-option>
          <a-select-option label="脚本" value="script">脚本</a-select-option>
        </a-select>
      </a-form-model-item>
      <!-- <a-form-model-item label="表达式" v-if="flowConditionForm.conditionType && flowConditionForm.conditionType === 'expression'" key="express">
        <el-input v-model="flowConditionForm.body" clearable @change="updateFlowCondition" />
      </a-form-model-item> -->
      <a-form-model-item label="条件设置" v-if="flowConditionForm.conditionType && flowConditionForm.conditionType === 'expression'" key="express" class="condition_copyer">
        <div class="condition_content drawer_content">
          <ul v-if="conditionConfig.conditionList.length > 0">
            <li v-for="(item,index) in conditionConfig.conditionList" :key="index">
                <span class="ellipsis">{{item.type==1?'发&ensp;起&ensp;人':item.showName}}：</span>
                <div v-if="item.type==1" style="width:200px;">
                  <org-transfer-modal
                    ref="orgTransfer"
                    :multi="true"
                    @back="backDepartInfo"
                    :checkedData="checkedData"
                    :textVals2="textVals"
                  ></org-transfer-modal>
                  <!-- <a-input-number style="display:none" type="text" v-model="item.val1"/> -->
                </div>
                <div v-else-if="item.type == 'String' && item.showType == 'checkBox'">
                    <p class="check_box">
                      <a :class="toggleStrClass(item,item1.key)&&'active'" @click="toStrChecked(item,item1.key)"
                      v-for="(item1,index1) in JSON.parse(item.fixedDownBoxValue)" :key="index1">{{item1.value}}</a>
                    </p>
                </div>
                <div v-else-if="item.type == 'String'">
                  <a-input type="text" :placeholder="'请输入'+item.showName" v-model="item.val1"/>
                </div>
                <div v-else>
                  <p>
                    <select v-model="item.optType" @change="changeOptType(item)">
                      <option value="1">小于</option>
                      <option value="2">大于</option>
                      <option value="3">小于等于</option>
                      <option value="4">等于</option>
                      <option value="5">大于等于</option>
                      <option value="6">介于两个数之间</option>
                    </select>
                    <a-input-number v-if="item.optType!=6" type="text" :placeholder="'请输入'+item.showName" default-value="2" v-model="item.val1"/>
                  </p>
                  <p v-if="item.optType==6">
                    <a-input-number type="text" style="width:75px;" class="mr_10" default-value="2" v-model="item.val1"/>
                    <select style="width:40px !important;" v-model="item.opt1">
                      <option value="<">&lt;</option>
                      <option value="<=">&lt;=</option>
                    </select>
                    <span class="ellipsis" style="display:inline-block;width:60px;vertical-align: text-bottom;">{{item.showName}}</span>
                    <select style="width:40px !important;" class="ml_10" v-model="item.opt2">
                      <option value="<">&lt;</option>
                      <option value="<=">&lt;=</option>
                    </select>
                    <a-input-number type="text" style="width:75px;" default-value="2" v-model="item.val2"/>
                  </p>
                </div>
                <a v-if="item.type==1" @click="conditionConfig.nodeUserList= []; removeEle(conditionConfig.conditionList,item,'name')">删除</a>
                <a v-else @click="removeEle(conditionConfig.conditionList,item,'name')">删除</a>
            </li>
          </ul>
          <div class="button-group">
            <a-button type="primary" size="small" @click="addCondition">添加条件</a-button>
            <a-button type="primary" ghost size="small" @click="formatCondition">确定</a-button>
          </div>
          <a-modal
            :width="500"
            :visible="visible"
            :maskClosable="false"
            @ok="handleOk"
            @cancel="handleCancel"
            cancelText="关闭">
              <p>请选择用来区分审批流程的条件字段</p>
              <p class="check_box">
                <a :class="toggleClass(conditionsList,{name:'promoter'},'name')&&'active'" @click="toChecked(conditionsList,{name:'promoter'},'name')">发起人</a>
                <a v-for="(item,index) in conditions" :key="index" :class="toggleClass(conditionsList,item,'name')&&'active'" 
                @click="toChecked(conditionsList,item,'name')">{{item.showName}}</a>
              </p>
          </a-modal>
        </div>
      </a-form-model-item>
      <template v-if="flowConditionForm.conditionType && flowConditionForm.conditionType === 'script'">
        <a-form-model-item label="脚本语言" key="language" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-model="flowConditionForm.language" clearable @change="updateFlowCondition" />
        </a-form-model-item>
        <a-form-model-item label="脚本类型" key="scriptType" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-model="flowConditionForm.scriptType">
            <a-select-option label="内联脚本" value="inlineScript">内联脚本</a-select-option>
            <a-select-option label="外部脚本" value="externalScript">外部脚本</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="脚本" v-if="flowConditionForm.scriptType === 'inlineScript'" key="body" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-model="flowConditionForm.body" type="textarea" clearable @change="updateFlowCondition" />
        </a-form-model-item>
        <a-form-model-item label="资源地址" v-if="flowConditionForm.scriptType === 'externalScript'" key="resource" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-model="flowConditionForm.resource" clearable @change="updateFlowCondition" />
        </a-form-model-item>
      </template>
    </a-form-model>
  </div>
</template>

<script>
import OrgTransferModal from '@/plugins/modal/OrgTransferModal'
export default {
  name: "FlowCondition",
  components: {
    OrgTransferModal
  },
  props: {
    businessObject: Object,
    type: String,
    conditions: {
      type: Array,
      required: false
    },
    conditionList: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      visible:false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      checkedList: [],
      conditionsList: [], //当前条件数据
      conditionConfig: {
        conditionList:[]
      },
      conditionCopyList: this.conditionList,
      flowConditionForm: {},
      checkedData:[],
      textVals:''
    };
  },
  watch: {
    businessObject: {
      immediate: true,
      handler() {
        this.$nextTick(() => this.resetFlowCondition());
      }
    }
  },
  methods: {
    resetFlowCondition() {
      this.bpmnElement = window.bpmnInstances.bpmnElement;
      this.bpmnElementSource = this.bpmnElement.source;
      this.bpmnElementSourceRef = this.bpmnElement.businessObject.sourceRef;
      if (this.bpmnElementSourceRef && this.bpmnElementSourceRef.default && this.bpmnElementSourceRef.default.id === this.bpmnElement.id) {
        // 默认
        this.flowConditionForm = { type: "default" };
      } else if (!this.bpmnElement.businessObject.conditionExpression) {
        // 普通
        this.flowConditionForm = { type: "normal" };
      } else {
        // 带条件
        const conditionExpression = this.bpmnElement.businessObject.conditionExpression;
        const id = this.bpmnElement.businessObject.id;
        this.flowConditionForm = { ...conditionExpression, type: "condition", id: id};
        // resource 可直接标识 是否是外部资源脚本
        if (this.flowConditionForm.resource) {
          this.$set(this.flowConditionForm, "conditionType", "script");
          this.$set(this.flowConditionForm, "scriptType", "externalScript");
          return;
        }
        if (conditionExpression.language) {
          this.$set(this.flowConditionForm, "conditionType", "script");
          this.$set(this.flowConditionForm, "scriptType", "inlineScript");
          return;
        }
        //原有条件分支数据
        if(this.conditionList && this.conditionList[id]){
          this.conditionConfig.conditionList = this.conditionList[id]
          this.conditionConfig.conditionList.map((item, index) => {
            if (item['name'] == 'promoter') {
              this.checkedData = item.val1
              this.textVals = item.val2
            }
          });
        }
        this.$set(this.flowConditionForm, "conditionType", "expression");
      }
    },
    updateFlowType(flowType) {
      // 正常条件类
      if (flowType === "condition") {
        this.flowConditionRef = window.bpmnInstances.moddle.create("bpmn:FormalExpression");
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          conditionExpression: this.flowConditionRef
        });
        return;
      }
      // 默认路径
      if (flowType === "default") {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
          conditionExpression: null
        });
        window.bpmnInstances.modeling.updateProperties(this.bpmnElementSource, {
          default: this.bpmnElement
        });
        return;
      }
      // 正常路径，如果来源节点的默认路径是当前连线时，清除父元素的默认路径配置
      if (this.bpmnElementSourceRef.default && this.bpmnElementSourceRef.default.id === this.bpmnElement.id) {
        window.bpmnInstances.modeling.updateProperties(this.bpmnElementSource, {
          default: null
        });
      }
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, {
        conditionExpression: null
      });
    },
    updateFlowCondition() {
      let { conditionType, scriptType, body, resource, language } = this.flowConditionForm;
      let condition;
      if (conditionType === "expression") {
        condition = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body });
      } else {
        if (scriptType === "inlineScript") {
          condition = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { body, language });
          this.$set(this.flowConditionForm, "resource", "");
        } else {
          this.$set(this.flowConditionForm, "body", "");
          condition = window.bpmnInstances.moddle.create("bpmn:FormalExpression", { resource, language });
        }
      }
      window.bpmnInstances.modeling.updateProperties(this.bpmnElement, { conditionExpression: condition });
    },
    /**表达式条件分支开始 */
    formatCondition(){
      let conditionList = this.conditionConfig.conditionList;
      let expression = '';
      let lineDesc = '';
      if(conditionList.length > 0){
        let expressions = [];
        let initiator = [];
        for (var i = 0; i < conditionList.length; i++) {
          var { name, type, showType, showName, optType, val1, opt1, val2, opt2, fixedDownBoxValue } = conditionList[i];
          if (name == 'promoter') {
            if (this.nextDepartOptions.length != 0) {
              for(var i = 0; i < this.nextDepartOptions.length; i++){
                initiator.push(this.nextDepartOptions[i].type + "==" + this.nextDepartOptions[i].id) 
              }
              expression += initiator.join("|");
              lineDesc += '发起人属于：' 
              lineDesc += this.nextDepartOptions.map(item => item.name).join("或") + " 并且 "
            }
          }
          if (type == "String" && showType == "checkBox") {
            if (val1) {
              lineDesc += showName + '属于：' + this.dealStr(val1, JSON.parse(fixedDownBoxValue)) + " 并且 "
              expressions.push(name + "==" + val1)
            }
          }
          if (type == "String") {
            if (val1) {
              lineDesc += showName + '属于：' + this.dealStr(val1, JSON.parse(fixedDownBoxValue)) + " 并且 "
              expressions.push(name + "==" + val1)
            }
          }
          if (type == "Number" ) {
            if (optType != 6 && val1) {
              var optTypeStr = ["", "<", ">", "<=", "==", ">="][optType]
              lineDesc += `${showName} ${optTypeStr} ${val1} 并且 `
              expressions.push(name + optTypeStr + val1)
              
            } else if (optType == 6 && val1 && val2) {
              lineDesc += `${val1} ${opt1} ${showName} ${opt2} ${val2} 并且 `
              expressions.push(`${val1}${opt1}${name}${opt2}${val2}`)
            }
          }      
        }
        lineDesc = lineDesc.substring(0, lineDesc.length - 4)
        if(expressions.length > 0){
          if(expression && expression.length > 0){
            expression += '&'
          }
          expression += expressions.join("&")
        }
        if(expression && expression.length > 0){
          expression = '${'+ expression +'}'
        }
      }
      
      //添加数据以便保存
      if(!this.conditionCopyList){
        this.conditionCopyList = {}
      }
      let id = this.flowConditionForm.id
      this.conditionCopyList[id] = this.conditionConfig.conditionList;
      this.$emit('ok', this.conditionCopyList)

      //更新流程条件
      this.flowConditionForm.body = expression;
      this.updateFlowCondition()
      this.$message.success("条件设置成功")
    },
    conditionStr(nodeConfig, index) {
      var { conditionList, nodeUserList } = nodeConfig.conditionNodes[index];
      if (conditionList.length == 0) {
        return (index == nodeConfig.conditionNodes.length - 1) && nodeConfig.conditionNodes[0].conditionList.length != 0 ? '其他条件进入此流程' : '请设置条件'
      } else {
        let str = ""
        for (var i = 0; i < conditionList.length; i++) {
            var { name, type, showType, showName, optType, val1, opt1, val2, opt2, fixedDownBoxValue } = conditionList[i];
            if (name == 'promoter') {
              if (nodeUserList.length != 0) {
                str += '发起人属于：'
                str += nodeUserList.map(item => item.name).join("或") + " 并且 "
              }
            }
            if (type == "String" && showType == "checkBox") {
              if (val1) {
                str += showName + '属于：' + this.dealStr(val1, JSON.parse(fixedDownBoxValue)) + " 并且 "
              }
            }
            if (type == "String") {
              if (val1) {
                str += showName + '属于：' + this.dealStr(val1, JSON.parse(fixedDownBoxValue)) + " 并且 "
              }
            }
            if (type == "Number") {
              if (optType != 6 && val1) {
                var optTypeStr = ["", "<", ">", "<=", "==", ">="][optType]
                str += `${showName} ${optTypeStr} ${val1} 并且 `
              } else if (optType == 6 && val1 && val2) {
                str += `${val1} ${opt1} ${showName} ${opt2} ${val2} 并且 `
              }
            }
        }
        return str ? str.substring(0, str.length - 4) : '请设置条件'
      }
    },
    changeOptType(item) {
      if (item.optType == 1) {
        item.val1 = 2;
      } else {
        item.val1 = 1;
        item.val2 = 2;
      }
    },
    dealStr(str, obj) {
      let arr = [];
      let list = str.split(",");
      for (var elem in obj) {
        list.map(item => {
          if (item == elem) {
            arr.push(obj[elem].value)
          }
        })
      }
      return arr.join("或")
    },
    addCondition(){
      this.conditionsList = [];
      this.visible = true;
      if (this.conditionConfig.conditionList) {
        for (var i = 0; i < this.conditionConfig.conditionList.length; i++) {
          var { name } = this.conditionConfig.conditionList[i]
          if (name == 'promoter') {
            this.conditionsList.push({ name: 'promoter', showName: "发起人"})
          } else {
            this.conditionsList.push(this.conditions.filter(item => item.name == name)[0])
          }
        }
      }
    },
    handleOk() {
      //1.弹窗有，条件配置中没有则增加
      //2.弹窗有，条件配置中有则不变
      for (var i = 0; i < this.conditionsList.length; i++) {
          var { name, showName, showType, type, fixedDownBoxValue } = this.conditionsList[i];
          if (this.toggleClass(this.conditionConfig.conditionList, this.conditionsList[i], "name")) {
            continue;
          }
          if (name == 'promoter') {
              this.conditionConfig.nodeUserList == [];
              this.conditionConfig.conditionList.push({
                type: 1,
                name,
                showName: '发起人'
              });
          } else {
              if (type == "Number" || type == "BigDecimal") {
                //opt*两数之间时显示的操作符，val*操作数值
                this.conditionConfig.conditionList.push({
                  showType,
                  name,
                  type: 2,
                  showName,
                  optType: "1",
                  val1: "2",
                  opt1: "<", 
                  val2: "",
                  opt2: "<", 
                  type,
                })
              } else if (type == "String" && showType == "checkBox") {
                this.conditionConfig.conditionList.push({
                  showType,
                  name,
                  type: 2,
                  showName,
                  val1: "",
                  type,
                  fixedDownBoxValue
                })
              }
          }
      }
      //3.弹窗中有，条件配置中有则从条件配置中删除
      for (let i = this.conditionConfig.conditionList.length - 1; i >= 0; i--) {
        if (!this.toggleClass(this.conditionsList, this.conditionConfig.conditionList[i], "name")) {
          this.conditionConfig.conditionList.splice(i, 1);
        }
      }
      this.conditionConfig.conditionList.sort(function (a, b) { return a.name - b.name; });
      this.visible = false;
    },
    handleCancel(){
      this.visible = false
    },
    toggleClass(arr, elem, key = 'id') {
      return arr.some(item => item[key] == elem[key]);
    },
    toChecked(arr, elem, key = 'id') {
      var isIncludes = this.toggleClass(arr, elem, key);
      !isIncludes ? arr.push(elem) : this.removeEle(arr, elem, key);
    },
    removeEle(arr, elem, key = 'id') {
      var includesIndex;
      arr.map((item, index) => {
        if (item[key] == elem[key]) {
          includesIndex = index
        }
      });
      arr.splice(includesIndex, 1);
    },
    /**表达式条件分支结束 */
    backDepartInfo(info, textVals, checkedData) {
      this.nextDepartOptions = info
      this.checkedData = checkedData
      if(!this.conditionConfig.conditionList){
        this.conditionConfig.conditionList = []
        this.conditionConfig.conditionList.push({
          type: 1,
          name: 'promoter',
          showName: '发起人',
          val1: checkedData,
          val2: textVals
        });
      }else{
        this.conditionConfig.conditionList.map((item, index) => {
          if (item['name'] == 'promoter') {
            item['val1'] = checkedData
            item['val2'] = textVals
          }
        });
      }
    },
  },
  beforeDestroy() {
    this.bpmnElement = null;
    this.bpmnElementSource = null;
    this.bpmnElementSourceRef = null;
  }
};
</script>

<style lang="less" scoped>
.ant-form-item{
  margin-bottom:4px !important;
}
.radio_box a,
.check_box a {
    font-size: 12px;
    position: relative;
    padding-left: 20px;
    margin-right: 30px;
    cursor: pointer;
    color: #333;
}
.check_box.not a:hover {
    color: #333;
}
.check_box.not a::before,
.check_box.not a:hover::before {
    border: none;
}
.check_box.not.active {
    background: #f3f3f3;
}
.radio_box a:hover::before,
.check_box a:hover::before {
    border: 1px solid #46a6fe;
}
.radio_box a::before,
.check_box a::before {
    position: absolute;
    width: 14px;
    height: 14px;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    left: 0;
    top: 1px;
    content: "";
}
.radio_box a::before {
    border-radius: 50%;
}
.check-dot.active::after,
.radio_box a.active::after,
.check_box a.active::after {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    top: 3px;
    left: 3px;
    content: "";
}

.radio_box a.active::after {
    background: #46a6fe;
}

.check_box a.active::after {
    background: url(~@/assets/check_box.png) no-repeat center;
}

.condition_copyer {
  .el-drawer__body {
    .priority_level {
      position: absolute;
      top: 11px;
      right: 30px;
      width: 100px;
      height: 32px;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      border: 1px solid rgba(217, 217, 217, 1);
    }
  }
  .condition_content {
    p{
      margin-bottom: 0 !important;
    }
    p.tip {
      margin: 20px 0;
      width: 510px;
      text-indent: 17px;
      line-height: 45px;
      background: rgba(241, 249, 255, 1);
      border: 1px solid rgba(64, 163, 247, 1);
      color: #46a6fe;
      font-size: 14px;
    }

    ul {
      max-height: 500px;
      overflow-y: scroll;
      margin-bottom: 0;
      list-style-type: none;
      padding-left: 0 !important;
      li {
        line-height: 32px !important;
        padding-bottom: 6px;

        &>span {
          float: left;
          margin-right: 8px;
          max-width: 70px;
          line-height: 32px;
          text-align: left;
        }

        &>div {
          display: inline-block;
          // width: 370px;

          &>p:not(:last-child) {
            margin-bottom: 10px;
          }
        }

        &:not(:last-child)>div>p {
          margin-bottom: 20px;
        }

        &>a {
          margin-left: 10px;
        }

        select,
        input {
          // width: 100%;
          height: 32px;
          background: rgba(255, 255, 255, 1);
          border-radius: 4px;
          border: 1px solid rgba(217, 217, 217, 1);
        }

        select+input {
          max-width: 260px;
          min-width: 100px;
        }

        input{
          padding: 4px 11px;
        }

        select {
          margin-right: 10px;
          max-width: 100px;
          min-width: 80px;
        }

        p.selected_list {
          padding-left: 10px;
          border-radius: 4px;
          min-height: 32px;
          border: 1px solid rgba(217, 217, 217, 1);
          word-break: break-word;
        }

        p.check_box {
          line-height: 32px;
        }
      }
    }

    .el-button {
      margin-bottom: 20px;
    }
  }
}

.condition_list {
  .el-dialog__body {
    padding: 16px 26px;
  }

  p {
    color: #666666;
    margin-bottom: 10px;

    &>.check_box {
      margin-bottom: 0;
      line-height: 36px;
    }
  }
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.button-group{
  margin-top:6px;
  button:nth-child(n+2){
    margin-left: 6px;
  }
}

</style>
