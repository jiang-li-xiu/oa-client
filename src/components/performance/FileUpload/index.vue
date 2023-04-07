<template>
  <div class="upload-file">
    <el-upload
      :action="uploadFileUrl"
      :before-upload="handleBeforeUpload"
      :file-list="files"
      :limit="5"
      :multiple="true"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :headers="headers"
      class="upload-file-uploader"
      ref="upload"
    >
      <!-- 上传按钮 -->
      <el-button size="mini" type="primary">选取文件</el-button>
      <!-- 上传提示 -->
      <div class="el-upload__tip" slot="tip" v-if="showTip">
        请上传
        <span v-if="fileSize">
          大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b></span
        >
        <span v-if="fileType">
          格式为 <b style="color: #f56c6c">{{ fileType.join(" / ") }}</b></span
        >
        的文件
      </div>
    </el-upload>

    <!-- 文件列表 -->
    <transition-group
      class="upload-file-list el-upload-list el-upload-list--text"
      name="el-fade-in-linear"
      tag="ul"
    >
      <div
        v-for="(file, index) in list"
        v-bind:key="file.fileId"
        class="mt20 mb20 file-content"
      >
        <li
          :key="file.fileId"
          class="el-upload-list__item ele-upload-list__item-content"
        >
          <div :underline="false">
            <span class="el-icon-document"> {{ file.finalName }} </span> 
           <span>  ( {{file.fileSizeKb | formatFileSize}} )</span>
          </div>
          <!-- <div class="ele-upload-list__item-content-action"> -->
            <!--            <div :underline="false" v-if="file.code === 200" type="success">上传成功</div>
                        <div :underline="false" v-if="file.code !== 200" type="danger">上传失败</div>-->
            <div class="delete-font-color cursor" :underline="false" @click="handleDelete(index)" type="warning">
              删除
            </div>
          <!-- </div> -->
        </li>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { formatFileSize } from "@/utils/performance/ruoyi";
import { getFileByIds } from "@/api/performance/system/file";

export default {
  name: "FileUpload",
  filters: {
    formatFileSize,
  },
  props: {
    // 值
    value: [String, Object, Array],
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => [
        "doc",
        "xls",
        "ppt",
        "docx",
        "xlsx",
        "pptx",
        "txt",
        "pdf",
        "jpg",
        "jpeg",
        "png",
      ],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true,
    },
    // 文件id串
    fileStr: {
      type: String,
      default: "",
    },
    echoFileStr: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/common/upload", // 上传的图片服务器地址
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      files: [],
    };
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize);
    },
    // 列表
    list: {
      set(val) {
        let fileString = "";

        if (val === undefined) {
          return;
        }
        // 传入为数字时，表示删除文件
        if (typeof val === "number") {
          this.files.splice(val, 1);

          if (this.files.length !== 0) {
            fileString = this.files.map((f) => f.fileId).join(",");
          }
          this.$emit("update:fileStr", fileString);
          return;
        }

        this.files.push(val);
        if (this.files.length !== 0) {
          fileString = this.files.map((f) => f.fileId).join(",");
        }
        this.$emit("update:fileStr", fileString);
      },
      get() {
        return this.files;
      },
    },
  },
  watch: {
    echoFileStr(val1, val2) {
      this.setFileList(val1);
    },
  },
  methods: {
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      // 校检文件类型
      if (this.fileType) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        const isTypeOk = this.fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true;
          return !!(fileExtension && fileExtension.indexOf(type) > -1);
        });
        if (!isTypeOk) {
          this.$message.error(
            `文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`
          );
          return false;
        }
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      return true;
    },
    // 文件个数超出
    handleExceed() {
      this.$message.error(`文件数量超出限制，最多上传5个文件`);
    },
    // 上传失败
    handleUploadError(err) {
      this.$message.error("上传失败, 请重试");
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      this.$message.success("上传成功");
      this.list = res;
    },
    // 删除文件
    handleDelete(index) {
      this.list = index;
    },
    setFileList(idsStr) {
      if (idsStr === "" || idsStr === null) {
        this.files = [];
        return;
      }
      console.log(idsStr);
      const fileIds = idsStr.split(",");
      getFileByIds(fileIds).then((response) => {
        this.files = response.data;
      });
    },
  },
  created() {},
  mounted() {
    this.setFileList(this.echoFileStr);
  },
};
</script>

<style scoped lang="scss">
.file-content{
  width: 60%;
  font-weight: normal;
}

.upload-file-uploader {
  margin-bottom: 5px;
}

.upload-file-list .el-upload-list__item {
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}

.upload-file-list .ele-upload-list__item-content {
  display: flex;
  // justify-content: space-between;
  align-items: center;
  color: inherit;
}

.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}


// 删除字体颜色
.delete-font-color{
  color: red;
  margin-left:20px;
}
</style>
