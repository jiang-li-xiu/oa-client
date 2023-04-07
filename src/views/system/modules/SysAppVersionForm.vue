<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="应用名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" :max-length="200" placeholder="请输入用户名称"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="appid" class="appid" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="appid">
              <a-input v-model="model.appid" :max-length="50" placeholder="请输入appid"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="新版本号" class="version" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="version">
              <a-input v-model="model.version" placeholder="请输入当前版本号"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="更新提示" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="note">
              <a-textarea v-model="model.note" :rows="4" :max-length="100" placeholder="请输入更新提示"></a-textarea>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="应用文件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="url">
              <a-upload
                v-model="model.url"
                accept=".wgt,.apk,.ipa"
                :action="minioAction"
                :multiple="false"
                :remove="removeFile"
                :file-list="fileList"
                :headers="head"
                @download="downloadFile"
                :before-upload="beforeUpload"
                @change="uploadOneFile"
                :showUploadList="showUploadList">
                <a-button :disabled="formDisabled"> <a-icon type="upload"/> 上传文件 </a-button>
              </a-upload>   
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
    <div>
      <h3>填写说明：</h3>
      <ul>
        <li><span style="font-weight:600;">版本号：</span>
          当新应用的版本号前两位大于旧应用版本号前两位时，则全更新；
          新应用的版本号前两位等于旧应用版本号前两位，但新应用的版本号最后一位大于旧应用版本号最后一位时，则热更新。
          如：当前版本号为1.2.0，新应用版本号为1.3.0时全更新；当前版本号为1.2.0，新应用版本号为1.2.1时热更新
        </li>
        <li>
          <span style="font-weight:600;">版本号：</span>
          <ul>
            <li>版本格式：主版本号.次版本号.修订号，版本号递增规则如下:</li>
            <li>主版本号：当做了不兼容的 API 修改</li>
            <li>次版本号：当做了向下兼容的功能性新增</li>
            <li>修订号：当做了向下兼容的问题修正</li>
          </ul>
        </li>
      </ul>
    </div>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { FileHandleMixin } from '@/mixins/FileHandleMixin'
  export default {
    name: 'SysAppVersionForm',
    mixins:[ FileHandleMixin ],
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules:{
          name:[{ required: true, message: '请输入应用名称!' }],
          appid:[{ required: true, message: '请输入appid!' }, {validator: this.validateAppid}],
          version: [{ required: true, message: '请输入版本号' }, {validator: this.validateVersion}],
          url:[{ required: true, message: '请上传更新文件!', trigger: 'blur' }]
        },
        url: {
          add: "/sys/sysAppVersion/add",
          edit: "/sys/sysAppVersion/edit",
          queryById: "/sys/sysAppVersion/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        if(this.fileList && this.model.url){
          this.fileList = [{uid: this.model.fileId, name: this.model.name, url: this.model.url, status: 'done'}]
        }
        this.visible = true;
      },
      /**上传文件开始 */
      beforeUpload(file, fileList){
        var that = this
        this.confirmLoading = true
        return new Promise((resolve, reject) => {
          // 判断是否为符合上传的文件格式
          var fileName = file.name.split('.')
          var ext = fileName[fileName.length - 1].toLocaleLowerCase()
          var extList = /^[wgt|apk|ipa]+$/
          if(!extList.test(ext)){
            that.$message.error("只支持.wgt、.apk和.ipa格式文件上传")
            reject(false)
          }else if(fileList?.length > 0){
            that.fileList = []
          }
          resolve(true)
        }).finally(() => {
          this.confirmLoading = false
        })
      },
      uploadOneFile(info) {
        let that = this
        let fileList = [...info.fileList]
        if (info.file.status === 'uploading') {
          that.fileList = fileList;
        }
        if (info.file.status === 'done') {
          if(info.file.response.success){
            let result = info.file.response.result;
            that.model.url = result?.url
            that.model.fileId = result?.id
            console.log(" that.model:" + JSON.stringify( that.model))
          }else{
            that.$message.error(info.file.response.message)
          }
          
        }
      },
      /**文件上传结束 */
      /**版本名称正则校验 */
      validateVersion(rule, value, callback) {
        if(!value){
          callback()
        }else{
          if(new RegExp(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/).test(value)){
            callback()
          }else{
            callback("请输入正确格式版本号！");
          }
        }
      },
      /**appid校验 */
      validateAppid(rule, value, callback){
        if(!value){
          callback()
        }else{
          if(new RegExp(/^[A-Za-z0-9_]+$/).test(value)){
            callback()
          }else{
            callback("请输入正确格式appid");
          }
        }
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
    }
  }
</script>

<style lang="less" scoped>
.version::after{
  content: '升级时应用版本号必须高于上一次设置的值，且必须是:x.x.x格式, 需要和manifest文件一致';
  color: #9f9d9d;
  font-size: 12px;
  margin-left: 20.83333333%;
}

.appid::after{
  content: 'uni-app应用标识（AppID),需要和manifest文件一致';
  color: #9f9d9d;
  font-size: 12px;
  margin-left: 20.83333333%;
}
</style>