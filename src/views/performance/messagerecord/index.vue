<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <div class="content">
        <el-form-item label-width="100px" label="消息ID" prop="msgId">
          <el-input
            v-model="queryParams.msgId"
            placeholder="请输入消息ID"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label-width="100px" label="标题" prop="msgTitle">
          <el-input
            v-model="queryParams.msgTitle"
            placeholder="请输入标题"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label-width="100px" label="链接类型" prop="urlType">
          <el-select
            v-model="queryParams.urlType"
            placeholder="请选择链接类型"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in urlTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" label="连接地址" prop="urlPath">
          <el-input
            v-model="queryParams.urlPath"
            placeholder="请输入连接地址"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label-width="100px" label="创建时间" prop="createTime">
          <el-date-picker
            clearable
            size="small"
            v-model="queryParams.createTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择创建时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label-width="100px" label="显示模式" prop="msgDisplayMode">
          <el-select
            v-model="queryParams.msgDisplayMode"
            placeholder="请选择显示模式"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in msgDisplayModeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" label="桌面地址" prop="desktopUrlPath">
          <el-input
            v-model="queryParams.desktopUrlPath"
            placeholder="请输入桌面地址"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label-width="100px" label="消息所有者" prop="msgOwner">
          <el-input
            v-model="queryParams.msgOwner"
            placeholder="请输入消息所有者"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label-width="100px" label="消息创建者" prop="createBy">
          <el-input
            v-model="queryParams.createBy"
            placeholder="请输入消息创建者"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label-width="100px" label="传达至" prop="sendTo">
          <el-input
            v-model="queryParams.sendTo"
            placeholder="请输入传达至"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      </div>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['business:messagerecord:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:messagerecord:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:messagerecord:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['business:messagerecord:export']"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="messagerecordList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="消息ID" align="center" prop="msgId" />
      <el-table-column label="标题" align="center" prop="msgTitle" />
      <el-table-column label="消息内容" align="center" prop="msgContent" />
      <el-table-column
        label="链接类型"
        align="center"
        prop="urlType"
        :formatter="urlTypeFormat"
      />
      <el-table-column label="连接地址" align="center" prop="urlPath" />
      <el-table-column label="消息所有者" align="center" prop="msgOwner" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="显示模式"
        align="center"
        prop="msgDisplayMode"
        :formatter="msgDisplayModeFormat"
      />
      <el-table-column label="桌面地址" align="center" prop="desktopUrlPath" />
      <el-table-column label="消息创建者" align="center" prop="createBy" />
      <el-table-column label="传达至" align="center" prop="sendTo" />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handlePublish(scope.row)"
            v-hasPermi="['business:messagerecord:edit']"
            >发布</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['business:messagerecord:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['business:messagerecord:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改welink消息提醒记录对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label-width="100px" label="标题" prop="msgTitle">
          <el-input v-model="form.msgTitle" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label-width="100px" label="消息内容" prop="msgContent">
          <el-input
          resize="none"
            v-model="form.msgContent"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label-width="100px" label="链接类型" prop="urlType">
          <el-select v-model="form.urlType" placeholder="请选择链接类型">
            <el-option
              v-for="dict in urlTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" label="连接地址" prop="urlPath">
          <el-input v-model="form.urlPath" placeholder="请输入连接地址">
            <template slot="prepend">h5://20210301134215561322354/</template>
          </el-input>
        </el-form-item>
        <el-form-item label-width='100px' label="消息所有者" prop="msgOwner">
          <!-- <el-input v-model="form.msgOwner" placeholder="请输入消息所有者" /> -->
          <dispatch-user
            :is-multiple="true"
            :id-array.sync="form.msgOwner"
            :user-name-array="form.msgOwner"
          />
        </el-form-item>
        <el-form-item label-width="100px" label="显示模式" prop="msgDisplayMode">
          <el-select v-model="form.msgDisplayMode" placeholder="请选择显示模式">
            <el-option
              v-for="dict in msgDisplayModeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="100px" label="桌面地址" prop="desktopUrlPath">
          <el-input
            v-model="form.desktopUrlPath"
            placeholder="请输入桌面地址"
          />
        </el-form-item>
        <el-form-item label-width="100px" label="传达至" prop="sendTo">
          <!-- <el-input v-model="form.sendTo" placeholder="请输入传达至" /> -->
          <dispatch-user
            :is-multiple="true"
            :id-array.sync="form.sendTo"
            :user-name-array="form.sendTo"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listMessagerecord,
  getMessagerecord,
  delMessagerecord,
  addMessagerecord,
  updateMessagerecord,
  exportMessagerecord,
  publishMessage,
} from "@/api/performance/messagerecord";
import DispatchUser from "@/components/performance/DispatchUser";
export default {
  name: "Messagerecord",
  components: {
    DispatchUser,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // welink消息提醒记录表格数据
      messagerecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 链接类型字典
      urlTypeOptions: [],
      // 显示模式字典
      msgDisplayModeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        msgId: null,
        msgTitle: null,
        msgContent: null,
        urlType: null,
        urlPath: null,
        msgOwner: null,
        createTime: null,
        msgDisplayMode: null,
        desktopUrlPath: null,
        createBy: null,
        sendTo: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        msgTitle: [
          { required: true, message: "标题不能为空", trigger: "blur" },
        ],
        msgContent: [
          { required: true, message: "消息内容不能为空", trigger: "blur" },
        ],
        urlType: [
          { required: true, message: "链接类型不能为空", trigger: "change" },
        ],
        urlPath: [
          { required: true, message: "连接地址不能为空", trigger: "blur" },
        ],
        msgOwner: [
          { required: true, message: "消息所有者不能为空", trigger: "blur" },
        ],
        msgDisplayMode: [
          { required: true, message: "显示模式不能为空", trigger: "change" },
        ],
        sendTo: [
          { required: true, message: "传达至不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("welink_url_type").then((response) => {
      this.urlTypeOptions = response.data;
    });
    this.getDicts("welink_display_type").then((response) => {
      this.msgDisplayModeOptions = response.data;
    });
  },
  methods: {
    /** 查询welink消息提醒记录列表 */
    getList() {
      this.loading = true;
      listMessagerecord(this.queryParams).then((response) => {
        this.messagerecordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 链接类型字典翻译
    urlTypeFormat(row, column) {
      return this.selectDictLabel(this.urlTypeOptions, row.urlType);
    },
    // 显示模式字典翻译
    msgDisplayModeFormat(row, column) {
      return this.selectDictLabel(
        this.msgDisplayModeOptions,
        row.msgDisplayMode
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        msgId: null,
        msgTitle: null,
        msgContent: null,
        urlType: null,
        urlPath: null,
        msgOwner: null,
        createTime: null,
        msgDisplayMode: null,
        desktopUrlPath: null,
        createBy: null,
        updateBy: null,
        updateTime: null,
        deleteStatus: "0",
        deleteBy: null,
        deleteTime: null,
        sendTo: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.msgId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加welink消息提醒记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const msgId = row.msgId || this.ids;
      getMessagerecord(msgId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改welink消息提醒记录";
      });
    },
    /** 发布按钮操作 */
    handlePublish(row) {
      this.reset();
      publishMessage(row).then((res) => {
        this.msgSuccess("发布成功");
        console.log(res);
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.msgId != null) {
            updateMessagerecord(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMessagerecord(this.form).then((response) => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const msgIds = row.msgId || this.ids;
      this.$confirm(
        '是否确认删除welink消息提醒记录编号为"' + msgIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delMessagerecord(msgIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有welink消息提醒记录数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportMessagerecord(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 80%;
}
</style>
