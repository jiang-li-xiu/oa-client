<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    @update:fullscreen="isFullscreen"
    cancelText="关闭">
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
    </template>
    <div :style="{'height':!fullscreen? '500px':'100%' }">
      <iframe :src="url" style="height:100%;" width="100%"></iframe>
    </div>
  </j-modal>
</template>

<script>
  export default {
    name: 'JFileDialogPreviewModal',
    components: {
    },
    data () {
      return {
        title:'文件预览',
        url: '',
        width:850,
        visible: false,
        disableSubmit: false,
        fullscreen: false
      }
    },
    methods: {
      isFullscreen(val){
        this.fullscreen = val
      },
      open (url) {
        this.visible=true
        this.url = url
      },
      close () {
        this.visible = false;
      },
      handleOk () {
        this.visible = false;
      },
      submitCallback(){
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>