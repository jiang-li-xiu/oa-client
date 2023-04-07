/**
 * 图片显示调用 previewFile方法  图片预览组件ref定义为previewFile
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
import { getAction } from '@/api/manage'
import Vue from 'vue'
import { Base64 } from "js-base64";
import PreviewFile from '@/components/jeecg/JFileDialogPreviewModal'

export const FileHandleMixin = {
  components: {
    PreviewFile
  },
  data(){
    return { 
      minioAction: window._CONFIG['domianURL'] + '/sys/upload/uploadMinio',
      head: {'X-Access-Token': Vue.ls.get('Access-Token')},
      showUploadList:{
        showRemoveIcon: true,
        showDownloadIcon: true
      },
      fileArr: [],
      fileList: [],
    }
  },
  created(){
    if(this.model){
      this.model.fileIdStr = this.model?.fileIdStr ?? ''
    }
  },
  methods:{
    /**
     * 文件上传,这里默认使用model.files来接收数据
     */
    uploadFile(info) {
      let that = this
      let fileList = [...info.fileList]
      if (info.file.status === 'uploading') {
        that.fileList = fileList;
      }
      if (info.file.status === 'done') {
        let result = info.file.response.result;
        let has = that.fileArr.some(item => {
          return item == result.id
        })
        // 判断文件是否已经再列表中，再列表中时不保存重复数据
        if(has){
          const index = that.fileList.indexOf(info.file);
          const newFileList = that.fileList.slice();
          newFileList.splice(index, 1);
          that.fileList = newFileList;
          that.$message.error("已有相同文件上传！")
          return
        }
        that.fileArr.push(result.id)
        that.model.fileIdStr = that.fileArr?.join(",")
      }
    },

    /**通过ids获取文件数据 */
    getFileList(params){
      return getAction('/sys/oss/file/filesByIds', params)
    },

    /*文件预览和下载数据获取*/
    getFileData(params){
      return getAction('sys/upload/preview', params)
    },

    /**文件下载 */
    downloadFile(params){
      params.id = params.uid
      if(params.response){
        params.id = params.response.result.id
      }
      this.getFileData(params).then(res=>{
        if (res.success) {
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = res.result
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
        } else {
          this.$message.error('文件下载失败')
        }
      })
    },

    /**文件预览 */
    previewFile(params){
      params.id = params.uid
      if(params.response){
        params.id = params.response.result.id
      }
      this.getFileData(params).then(res=>{
        if (res.success) {
          if (res && res.result) {
            let url = window._CONFIG['onlinePreviewDomainURL'] + '?url=' + encodeURIComponent(Base64.encode(res.result))
            this.$refs.previewFile.open(url);
            /* 这是另一种方案
            const h = this.$createElement;
            this.$info({
              title:'文件预览',
              width:850,
              okText:'关闭',
              content:h('div', {style:'height:500px'},[
                h('iframe', {attrs:{src:url}, style:{height:'100%', width: '100%'}})
              ])
            }) */
          }
        } else {
          this.$message.error("文件预览失败")
        }
      })
    },

    /**
     * 文件删除，这里不影响磁盘中的数据, 
     * 默认保存数据使用model.files接收
     * */
    removeFile(file) {
      const index = this.fileList.indexOf(file);
      if(index == -1){
        this.$message.error("需要删除的元素不存在")
      }
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      const newUploadList = this.fileArr.slice();
      newUploadList.splice(index, 1);
      this.fileArr = newUploadList;
      this.model.fileIdStr = newUploadList.join(',');
      return newUploadList;
    },
      
  }

}