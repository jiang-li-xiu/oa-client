<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    :footer="null"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-tabs defaultActiveKey="activeKey" @change="changeTabs">
      <a-tab-pane key="1" :tab="tabName" ref="tabpane" class="tab-height">
        <component :is="loadComponent" @ok="submitCallback" @close="handleClose" :record="record" :disabled="disabled" :visible="show" :type="type"></component>
      </a-tab-pane>
      <a-tab-pane key="2" tab="流转记录">
        <div class="block">
          <a-timeline>
            <a-timeline-item v-for="(item,index) in historyTaskList" :key="index" :icon="setIcon(item.finishTime)" :color="setColor(item.finishTime)">
              <p style="font-weight: 700">{{ item.taskName }}</p>
              <a-card class="box-card" shadow="hover">
                <a-descriptions :column="3" :labelStyle="{'font-weight': 'bold'}">
                  <a-descriptions-item label="实际办理">{{ item.assigneeName || '-'}}</a-descriptions-item>
                  <a-descriptions-item label="候选办理">{{ item.candidate || '-'}}</a-descriptions-item>
                  <a-descriptions-item label="耗时">{{ item.duration || '-'}}</a-descriptions-item>
                </a-descriptions>
                <a-descriptions :column="3" :labelStyle="{'font-weight': 'bold'}">
                  <a-descriptions-item label="接收时间">{{ item.createTime || '-'}}</a-descriptions-item>
                  <a-descriptions-item label="办结时间">{{ item.finishTime || '-' }}</a-descriptions-item>
                </a-descriptions>
                <div v-if="item.commentList &&item.commentList.length > 0">
                  <div v-for="(comment, index) in item.commentList" :key="index">
                    <el-divider content-position="left" >
                      <el-tag :type="approveTypeTag(comment.type)" size="mini">{{ commentType(comment.type) }}</el-tag>
                      <el-tag type="info" effect="plain" size="mini">{{ comment.time }}</el-tag>
                    </el-divider>
                    <span>{{ comment.fullMessage }}</span>
                  </div>
                </div>
              </a-card>
            </a-timeline-item>
          </a-timeline>
        </div>
      </a-tab-pane>
      <a-tab-pane key="3" tab="流程跟踪" :force-render=true>
        <process-viewer 
        ref="processViewer" 
        :key="`designer-${loadIndex}`" 
        :style="'height:' + height" 
        :xml.sync="xmlData"           
        :finishedInfo="finishedInfo" 
        :allCommentList="historyTaskList"/>
      </a-tab-pane>
    </a-tabs>
  </j-modal>
</template>

<script>

  import ActUsProcdefForm from './ActUsProcdefForm'
  import ProcessViewer from './ProcessViewer'
  import { postAction, getAction } from '@/api/manage'
  export default {
    name: 'ActUsProcdefModal',
    components: {
      ActUsProcdefForm,
      ProcessViewer
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false,
        activeKey: 1,
        loadComponent:'',
        record:{},
        show: false,
        historyTaskList:[],
        loadIndex: 0,
        height: document.documentElement.clientHeight - 205 + 'px;',
        xmlData: undefined,
        finishedInfo: {
          finishedSequenceFlowSet: [],
          finishedTaskSet: [],
          unfinishedTaskSet: [],
          rejectedTaskSet: []
        },
        tabName:"表单信息",
        type:"handel",
        disabled: true
      }
    },
    computed: {
      commentType() {
        return (val) => {
          switch (val) {
            case '1':
              return '通过'
            case '2':
              return '退回'
            case '3':
              return '驳回'
            case '4':
              return '委派'
            case '5':
              return '转办'
            case '6':
              return '不通过'
            case '7':
              return '删除'
            case '8':
              return '取消'
            case '9':
              return '跳过'
          }
        }
      },
      approveTypeTag() {
        return val => {
          switch (val) {
            case '1': return 'success'
            case '2': return 'warning'
            case '3': return 'danger'
            case '4': return 'primary'
            case '5': return 'success'
          }
        }
      }
    },
    /* mounted () {
      const that = this;
      window.onresize = () => {
        this.getHeight()
      }
    }, */
    methods: {
      getHeight(){
        var height = this.$refs.tabpane.$el.offsetHeight 
        var height2 = document.documentElement.clientHeight - 205;
        if(height <= 0 || height > height2){
          height = height2
        }
        this.height = height + 'px'
      },
      changeTabs(data){
        if(data==3){
          this.$refs.processViewer.init();
        }     
      },
      open (record, tabName, path, type) {
        this.show=true
        this.type = type
        this.visible=true
        this.record = record
        this.tabName = tabName
        this.loadComponent = () => import(`@/views/${path}`)
        this.title = record.processName
        this.loadIndex = this.record.procInsId
        this.getModelDetail()
        this.getFlowViewer()
      },
      handleClose(){
        this.record = {}
        this.type="handel"
        this.show = false
        this.visible = false
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      /**获取审批记录 */
      getModelDetail(){
        let that = this;
        let param = {
          procInsId: this.record.procInsId,
          deployId: this.record.deployId,
          taskId: this.record.taskId
        }
        getAction("/workflow/process/detail",param).then(res=>{
          if(res.success){
            that.historyTaskList = res.result.historyTaskList
            that.disabled = !res.result.editable
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      /**获取审批流程图 */
      getFlowViewer() {
        let that = this;
        let param = {
          procInsId: this.record.procInsId,
          definitionId: this.record.procDefId
        }
        getAction("/workflow/process/flowViewer",param).then(res=>{
          if(res.success){
            var data = res.result;
            if(data){
              this.finishedInfo.finishedTaskSet = data.finishedTaskSet;
              this.finishedInfo.unfinishedTaskSet = data.unfinishedTaskSet;
              this.finishedInfo.rejectedTaskSet = data.rejectedTaskSet;
              this.finishedInfo.finishedSequenceFlowSet = data.finishedSequenceFlowSet;
              this.xmlData = data.xmlData
            }
          }else{
            that.$message.warning(res.message);
          }
        })
      },
      setIcon(val) {
        if (val) {
          return "el-icon-check";
        } else {
          return "el-icon-time";
        }
      },
      setColor(val) {
        if (val) {
          return "#2bc418";
        } else {
          return "#b3bdbb";
        }
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>
