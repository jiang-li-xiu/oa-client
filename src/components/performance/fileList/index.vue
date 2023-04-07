<template>
  <div class="upload-file">
    <!-- 文件列表 -->
    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
      <div v-for="(file) in list" :key="file.fileId" >
        <li :key="file.fileId" class="el-upload-list__item ele-upload-list__item-content">
          <div :underline="false" @click="download(file.fileName)">
            <span class="el-icon-document" style="margin-left: 10px;"> {{ file.finalName }} </span>
            <span>({{ file.fileSizeKb | formatFileSize }})</span>
          </div>
          <div class="ele-upload-list__item-content-action" style="margin-right: 15px;">
            <div  :underline="true"  type="info"  @click="download(file.fileName)" >下载</div>
          </div>
        </li>
      </div>
    </transition-group>
  </div>
</template>

<script>
import {formatFileSize} from "@/utils/performance/ruoyi";
import {getFileByIds} from "@/api/performance/system/file";

export default {
  name: 'fileList',
  filters: {
    formatFileSize
  },
  props: {
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true
    },
    // 文件id串
    fileStr: {
      type: String,
      default: ''
    },
    echoFileStr: {
      type: String,
    }
  },
  data() {
    return {
      files: []
    };
  },
  computed: {
    // 列表
    list: {
      set(val) {
        let fileString = ''

        if (val === undefined) {
          return
        }

        this.files.push(val)
        if (this.files.length !== 0) {
          fileString = this.files.map(f => f.fileId).join(',');
        }
        this.$emit('update:fileStr', fileString);
      },
      get() {
        return this.files
      }
    },
  },
  watch: {
    echoFileStr(val1, val2) {
      this.setFileList(val1)
    },
  },
  methods: {
    setFileList(idsStr) {
      if (idsStr === '' || idsStr === null || idsStr === undefined) {
        this.files = []
        return
      }

      const fileIds = idsStr.split(',');
      getFileByIds(fileIds).then(response => {
        this.files = response.data
      })
    }
  },
  mounted() {
    this.setFileList(this.echoFileStr)
  }
};
</script>

<style scoped lang="scss">
.upload-file {
  margin-top: -10px;
}

.upload-file-uploader {
  margin-bottom: 5px;
}

.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 3;
  size: 20px;
  margin-bottom: 10px;
  position: relative;
}

.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}

.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
</style>
