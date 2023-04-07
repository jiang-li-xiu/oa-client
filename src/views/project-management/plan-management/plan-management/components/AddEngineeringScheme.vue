<template>
  <j-modal
    :title="title"
    width="92%"
    :visible="visible"
    switchFullscreen
    :fullscreen="true"
    @ok="handleOk"
    :okButtonProps="{ class: { 'jee-hidden': disableSubmit } }"
    @cancel="close"
    cancelText="关闭"
  >
    <a-spin tip="加载中..." :spinning="loading">
      <a-form-model ref="ruleForm" :model="formParams" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="方案名称" prop="name">
              <a-input v-model="formParams.name" placeholder="请输入方案名称" :readOnly="readOnly" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <template>
              <a-button
                class="buttom"
                type="primary"
                @click="addPlanRow"
                :disabled="[2].includes(this.type)"
                v-if="this.type !== 4"
                >添加一行
              </a-button>
              <!-- <a-button
                class="buttom"
                type="primary"
                @click="handleImportLibrary"
                :disabled="[2].includes(this.type)"
                v-if="this.type !== 4"
                >方案库导入
              </a-button>
              <a-button class="buttom" type="primary" :disabled="[2].includes(this.type)" v-if="this.type !== 4"
                >方案模板导入
              </a-button> -->
              <a-upload
                v-model="formParams.upload"
                name="file"
                :multiple="true"
                accept=".xls, .xlsx"
                :headers="headers"
                @change="handleUp"
                :action="uploadUrl"
                :file-list="fileList"
              >
                <a-button type="primary" icon="upload" v-if="this.type !== 4" :disabled="[2].includes(this.type)">
                  excel导入
                </a-button>
              </a-upload>
              <a-button
                class="buttom"
                icon="download"
                @click="download('工程方案模版', 'xls')"
                v-if="this.type !== 4"
                :disabled="[2].includes(this.type)"
                >下载模板
              </a-button>
              <a-button
                class="buttom"
                type="danger"
                @click="handlebatchPathDel"
                v-if="this.type !== 4"
                :disabled="[2].includes(this.type)"
                >批量删除
              </a-button>

              <!-- 表格区域 -->
              <template v-if="![2, 4].includes(this.type)">
                <a-form-model ref="tableform" :model="form">
                  <a-table
                    :columns="columns"
                    ref="tableformRef"
                    :data-source="form.dataSource"
                    bordered
                    :rowKey="(record) => record.id"
                    :scroll="{ x: true }"
                    :indentSize="10"
                    :pagination="false"
                    :row-selection="rowSelection"
                    :expanded-row-keys.sync="expandedRowKeys"
                    :disabled="disableSubmit"
                    class="table"
                  >
                    <span slot="titleDetailName" class="form-table-heard">细目名称</span>
                    <span slot="titleProductId" class="form-table-heard">产品名称 </span>
                    <span slot="titleSpecifications" class="form-table-heard"> 技术规格和资质证书 </span>
                    <span slot="titleModel" class="form-table-heard">型号 </span>
                    <span slot="titleSupplier" class="form-table-heard">供应商 </span>
                    <span slot="titleUnit" class="form-table-heard">单位 </span>
                    <span slot="titleNum" class="form-table-heard">数量 </span>
                    <span slot="titlePurchasePrice" class="form-table-heard">单价(元) </span>
                    <span slot="titletotalPrice" class="form-table-heard">金额(元) </span>

                    <div class="overflowStyle" slot="codeNum" slot-scope="text, record">
                      <span style="white-space: pre-line">
                        {{ record.codeNum }}
                      </span>
                    </div>
                    <!-- 名称 -->
                    <template slot="detailName" slot-scope="text, row, index" class="form-table-heard">
                      <a-form-model-item :prop="'dataSource.' + index + '.detailName'" :rules="check.detailName">
                        <a-tooltip placement="top" :title="row.detailName">
                          <a-input
                            v-model="row.detailName"
                            :style="{ width: '80%' }"
                            :disabled="disableSubmit"
                            placeholder="请输入细目名称"
                          />
                        </a-tooltip>
                      </a-form-model-item>
                    </template>
                    <!-- 安装位置 -->
                    <template slot="position" slot-scope="text, row, index">
                      <a-tooltip placement="top" :title="row.position">
                        <a-input v-model="row.position" :disabled="disableSubmit" placeholder="请输入安装位置" />
                      </a-tooltip>
                    </template>
                    <template slot="technicalSpecifications" slot-scope="text, row, index">
                      <a-form-model-item
                        :prop="'dataSource.' + index + '.technicalSpecifications'"
                        :rules="check.technicalSpecifications"
                      >
                        <a-tooltip placement="top" :title="row.technicalSpecifications">
                          <a-input
                            v-model="row.technicalSpecifications"
                            :disabled="disableSubmit"
                            placeholder="请输入技术要求"
                          />
                        </a-tooltip>
                      </a-form-model-item>
                    </template>
                    <!-- 单位 -->
                    <template slot="unit" slot-scope="text, row, index">
                      <a-form-model-item :prop="'dataSource.' + index + '.unit'" :rules="check.unit">
                        <a-input v-model="row.unit" :disabled="disableSubmit" placeholder="请输入单位" />
                      </a-form-model-item>
                    </template>
                    <!-- 数量 -->
                    <template slot="num" slot-scope="text, row, index">
                      <a-form-model-item :prop="'dataSource.' + index + '.num'" :rules="check.num">
                        <a-input-number
                          :defaultValue="1"
                          :min="0"
                          v-model="row.num"
                          :disabled="disableSubmit"
                          placeholder="请输入数量"
                        />
                      </a-form-model-item>
                    </template>

                    <!-- 备注 -->
                    <template slot="remark" slot-scope="text, row, index">
                      <a-tooltip placement="top" :title="row.remark">
                        <a-input v-model="row.remark" :disabled="disableSubmit" placeholder="请输入备注" />
                      </a-tooltip>
                    </template>
                    <template slot="action" slot-scope="text, row, index">
                      <a href="javascript:;" @click="handleDelete(row, index)" :style="{ color: 'red', height: '63px' }"
                        >删除
                      </a>
                    </template>
                  </a-table>
                </a-form-model>
              </template>
              <!-- 详情表格 -->
              <template v-else>
                <a-col :span="24">
                  <a-table
                    :columns="columnsDetail"
                    :data-source="form.dataSource"
                    bordered
                    ref="tableformRef"
                    rowKey="id"
                    :scroll="{ x: true,y:800 }"
                    :indentSize="10"
                    :pagination="false"
                    :expanded-row-keys.sync="expandedRowKeys"
                    :disabled="disableSubmit"
                  >
                    <div class="overflowStyle" slot="codeNum" slot-scope="text, record">
                      <span>
                        {{ record.codeNum }}
                      </span>
                    </div>
                    <div class="overflowStyle" slot="position" slot-scope="text, record">
                      <span>
                        {{ record.position }}
                      </span>
                    </div>
                    <div class="overflowStyle" slot="detailName" slot-scope="text, record">
                      <span>
                        {{ record.detailName }}
                      </span>
                    </div>
                    <div class="overflowStyle" slot="technicalSpecifications" slot-scope="text, record">
                      <span>
                        {{ record.technicalSpecifications }}
                      </span>
                    </div>
                    <div class="overflowStyle" slot="specification" slot-scope="text, record">
                      <span>
                        {{ record.specification }}
                      </span>
                    </div>
                    <div class="overflowStyle" slot="remark" slot-scope="text, record">
                      <span>
                        {{ record.remark }}
                      </span>
                    </div>
                  </a-table>

                  <!-- <div class="subtotal">
                    <div class="left">汇总</div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number" :style="{ width: '80px' }"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number"></div>
                    <div class="number">{{ formatPurchasePrice || 0 }}</div>
                    <div class="number" :style="{ width: '260px' }"></div>
                  </div> -->
                </a-col>
              </template>
            </template>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>
    <div class="drawer-bootom-button">
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        @click="handleOk"
        v-if="this.type == 0 || this.type == 1"
        style="margin-right: 0.8rem"
      >
        确定
      </a-button>
      <a-button @click="close">取消</a-button>
    </div>
  </j-modal>
</template>

<script>
// 组件
import {
  addScheme,
  editScheme,
  getDetailLibrary,
  getProfitDetail,
  addSchemeTemplate,
  getSchemeTmplateDetail,
  editTemplateScheme,
} from '@/api/project-management/plan-management/PlanManagement.js'
// 混入
import { TableListMixin } from '@/mixins/TableListMixin'
import * as XLSX from 'xlsx/xlsx.mjs'
// 数组对象去重
import { uniqBy, uniq } from 'lodash'
export default {
  mixins: [TableListMixin],
  props: {
    // 表格数据
    proData: {
      type: Array,
      default: () => [],
    },
    // 表格配置
    columns: {
      type: Array,
      default: () => [
        {
          title: '序号',
          dataIndex: 'codeNum',
          align: 'center',
          width: 150,
          key: 'codeNum',
          ellipsis: true,
          scopedSlots: { customRender: 'codeNum' },
          customRender(text, record, index) {
            return index + 1
          },
        },
        {
          title: '安装位置',
          dataIndex: 'position',
          width: '14%',
          ellipsis: true,
          align: 'center',
          scopedSlots: {
            customRender: 'position',
          },
        },
        {
          // title: '细目名称',
          dataIndex: 'detailName',
          width: '14%',
          ellipsis: true,
          align: 'center',
          scopedSlots: {
            customRender: 'detailName',
          },
          slots: {
            title: 'titleDetailName',
          }, //表头插槽
        },
        {
          // title: '技术规格 资质证书',
          dataIndex: 'technicalSpecifications',
          width: '14%',
          ellipsis: true,
          align: 'center',
          scopedSlots: {
            customRender: 'technicalSpecifications',
          },
          slots: {
            title: 'titleSpecifications',
          }, //表头插槽
        },
        {
          // title: '单位',
          dataIndex: 'unit',
          width: '14%',
          ellipsis: true,
          align: 'center',
          scopedSlots: {
            customRender: 'unit',
          },
          slots: {
            title: 'titleUnit',
          }, //表头插槽
        },
        {
          // title: '数量',
          dataIndex: 'num',
          width: '14%',
          ellipsis: true,
          align: 'center',
          scopedSlots: {
            customRender: 'num',
          },
          slots: {
            title: 'titleNum',
          }, //表头插槽
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: '14%',
          ellipsis: true,
          align: 'center',
          scopedSlots: {
            customRender: 'remark',
          },
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          fixed: 'right',
          width: 150,
          scopedSlots: {
            customRender: 'action',
          },
        },
      ],
    },
    // 详情表格配置
    columnsDetail: {
      type: Array,
      default: () => [
        // {
        //   title: '编号',
        //   dataIndex: 'codeNum',
        //   align: 'center',
        //   width: 150,
        //   ellipsis: true,
        //   // scopedSlots: { customRender: 'codeNum' },
        // },
        {
          title: '安装位置',
          dataIndex: 'position',
          width: 150,
          ellipsis: true,
          align: 'center',
          scopedSlots: { customRender: 'position' },
        },
        {
          title: '细目名称',
          dataIndex: 'detailName',
          width: 150,
          ellipsis: true,
          align: 'center',
          scopedSlots: {
            customRender: 'detailName',
          },
        },
        {
          title: '技术规格 资质证书',
          dataIndex: 'technicalSpecifications',
          width: 300,
          ellipsis: true,
          align: 'center',
          scopedSlots: {
            customRender: 'technicalSpecifications',
          },
        },
        {
          title: '单位',
          dataIndex: 'unit',
          width: 150,
          ellipsis: true,
          align: 'center',
          scopedSlots: {
            customRender: 'unit',
          },
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: 150,
          ellipsis: true,
          align: 'center',
          scopedSlots: {
            customRender: 'num',
          },
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 200,
          ellipsis: true,
          align: 'center',
          scopedSlots: {
            customRender: 'remark',
          },
        },
      ],
    },
  },
  data() {
    return {
      fileList: [],
      // 上传地址
      uploadUrl: process.env.VUE_APP_API_BASE_URL + '/sys/common/upload',
      // 上传请求头
      headers: {
        'X-Access-Token': this.$ls.get('Access-Token'),
      },
      pictureTempListImage: [],
      // 开关
      visible: false,
      // 加载动画开关
      loading: false,
      // 是否禁用
      disableSubmit: false,
      readOnly: false,
      // 标题
      title: '新增',
      type: 0,
      // 表单配置
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
      // 表单参数
      formParams: {},
      // 汇总采购合价
      formatPurchasePrice: 0,
      // 表格配置
      btnState: false,
      // 字段对应的表头（必须一一对应）
      character: {
        position: {
          text: '安装位置',
          type: 'string'
        },
        detailName: {
          text: '细目名称',
          type: 'string',
        },
        technicalSpecifications: {
          text: '投标文件要求的技术规格、资料证书',
          type: 'string',
        },
        unit: {
          text: '单位',
          type: 'string',
        },
        num: {
          text: '数量',
          type: 'number',
        },
        remark: {
          text: '备注',
          type: 'string',
        },
        // is_main: {
        //   text: '是否主材',
        //   type: 'string',
        // },
      },
      expandedRowKeys: [],
      disableMixinCreated: true, //不执行混入
      url: {
        downloadGetUrl: '/prodProfits/model', //下载模板
      },
      form: { dataSource: [] },
      record: {},
      rules: {
        name: [{ required: true, message: '请输入方案名称', trigger: 'blur' }],
      },
      check: {
        detailName: [{ required: true, message: '请输入细目名称', trigger: 'blur' }],
        technicalSpecifications: [{ required: true, message: '请输入技术规格', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        num: [{ required: true, message: '请输入数量', trigger: 'blur' }],
      },
      is_template: false,
    }
  },

  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        onSelect: this.onSelect, //触发级联的方法
        fixed: true,
      }
    },
  },

  methods: {
    onSelectChange(selectedRowKeys, selectionRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys, selectionRows)
      this.selectedRowKeys = uniqBy(selectedRowKeys) //选中的key
      this.selectionRows = selectionRows //选中的表格数据
    },
    onSelect(record, selected) {
      // console.log(record, selected);
      //每个复选框点击都会触发
      const selectrows = [record.key]
      if (record.hasOwnProperty('children')) {
        const generator = (record) => {
          //这里做一个递归查找
          record.forEach((item) => {
            selectrows.push(item.key)

            if (item.children && item.children.length > 0) {
              generator(item.children)
            }
          })
        }
        generator(record.children)
      }
      const newselect = this.selectedRowKeys.filter((item) => !selectrows.includes(item))
      //选中和取消选中的级联
      selected ? (this.selectedRowKeys = [...this.selectedRowKeys, ...selectrows]) : (this.selectedRowKeys = newselect)
    },
    // 方案库导入
    handleImportLibrary() {
      console.log('方案库导入')
      this.$refs.importLibrary.open()
    },
    // 打开弹窗
    open() {
      this.visible = true
    },
    // 方案添加
    add(type, row) {
      this.type = 0
      this.title = '新增工程方案'
      this.record = row
      this.formParams.type = type
      this.open()
    },
     // 方案编辑
    edit(row, type) {
      if (type == 1) {
        this.title = '编辑工程方案'
        // this.getEditDetail(row.id)
      } else {
        this.title = '详情'
        this.readOnly = true
        // this.getDetail(row.id)
      }
      // this.$set(this.formParams, 'name', row?.name)
      this.type = type
      this.record = row
      this.getEditDetail(row?.id)
      setTimeout(() => {
        this.open()
      })
    },
    // 模板添加
    templateAdd(template) {
      this.type = 0
      this.title = '新增工程模板'
      this.is_template = true
      this.visible = true
    },
    // 模板编辑 1编辑 2详情
    templateEdit(row, type) {
      this.is_template = true
      if (type == 2) {
        this.title = '详情'
        this.type = 2
        this.readOnly = true
      } else {
        this.type = 1
        this.title = '编辑工程模板'
        this.readOnly = false
      }
      this.record = row
      this.$set(this.formParams, 'name', row.name)
      this.getSchemeTmplateDetail(row.id)
      setTimeout(() => {
        this.open()
      })
    },
    // mode:1方案库导入 2方案模板导入
    templateDetail(row, type, mode) {
      this.type = 2
      this.title = '详情'
      this.readOnly = true
      this.record = row
      if (mode == 1) {
        this.getEditDetail(row.id)
      } else {
        this.getSchemeTmplateDetail(row.id)
      }
      this.$set(this.formParams, 'name', row.name)
      this.open()
    },
    // 编辑详情
    getEditDetail(id) {
      getDetailLibrary(id).then((res) => {
        if (res.success) {
          this.form.dataSource = res.result.schemeInfos || res.result.schemeProductInfoVos
          this.formParams = res.result
          this.$forceUpdate()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 详情
    getDetail(id) {
      getProfitDetail({ schemeLibraryId: id }).then((res) => {
        if (res.success) {
          this.form.dataSource = res.result
          this.$forceUpdate()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 模板详情
    getSchemeTmplateDetail(id) {
      getSchemeTmplateDetail(id).then((res) => {
        if (res.success) {
          this.form.dataSource = res.result.templateInfo
          this.$forceUpdate()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 关闭弹窗，点击遮罩层或右上角叉或取消按钮时触发
    close() {
      this.visible = false
      // 重置表单
      this.$refs.ruleForm.resetFields()
      this.formParams = {}
      this.form.dataSource = []
      this.record = {}
      this.selectedRowKeys = []
      this.is_template = false
      this.$emit('refresh')
    },
    // 新增方案信息
    addPlanRow() {
      let key = Math.floor(Math.random() * 1000)
      this.form.dataSource.push({
        id: key,
        detailName: '',
        position: '',
        technicalSpecifications: '',
        unit: '',
        num: 1,
        remark: '',
      })
    },
    // 删除方案信息
    handleDelete(row, index) {
      this.form.dataSource.splice(index, 1)
    },
    // 批量删除
    handlebatchPathDel() {
      for (let k = 0; k < this.selectionRows.length; k++) {
        this.form.dataSource.splice(
          this.form.dataSource.findIndex((item) => item.id === this.selectionRows[k].id),
          1
        )
      }
    },
    // 读取
    fileFile(file) {
      return new Promise((resolve) => {
        let reader = new FileReader()
        reader.readAsBinaryString(file)
        reader.onload = (ev) => {
          resolve(ev.target.result)
        }
      })
    },

    // 导入
    async handleUp(info) {
      // console.log(info.file)
      this.fileList = info.fileList
      //如果没有数据
      if (info.file.response && info.file.response.message == null) {
        this.btnState = true
      }
      // 有数据并且填写正确
      if (info.file.response && info.file.response.message != null) {
        this.btnState = false

        let data = await this.fileFile(info.file.originFileObj)
        // console.log(data)

        let workbook = XLSX.read(data, { type: 'binary' }) //读取二进制数据
        console.log(workbook)

        let worksheet = workbook.Sheets[workbook.SheetNames[0]]
        // console.log(worksheet);
        data = XLSX.utils.sheet_to_json(worksheet)
        console.log(data)
        let arr = []
        data.forEach((item, index) => {
          let obj = {}
          for (let key in this.character) {
            if (!this.character.hasOwnProperty(key)) break
            let v = this.character[key]
            let text = v.text
            let type = v.type
            v = item[text] || ''
            type === 'string' ? (v = String(v)) : null
            type === 'number' ? (v = Number(v)) : null
            obj[key] = v
          }
          arr.push(obj)
        })
        // *如果是主材，就加上children
        let newData = arr.map((item, index) => {
          // 给每一项先设置一个随机key
          let currentKey = Math.random()
          item.key = Math.floor(currentKey * 1000)
          item.is_import = true
          // item.position = ''
          item.specification = ''
          item.model = ''
          item.supplierName = ''
          item.productId = null
          item.price = ''
          item.purchaseTotlePrice = ''
          let firstLeval = []
          firstLeval[index] = item
          // 方案并选型才有children
          // if (this.is_type == 2) {
          //   firstLeval[index].children = []
          // }
        })

        // 插入导入的数据
        // this.insert(arr)
        // 给表格添加导入的值
        this.form.dataSource.push(...arr)
        console.log(this.form.dataSource)

        this.list = info.file.response.message
      } else if (info.file.response && info.file.response.message != null && this.fileList.length > 0) {
        // 如果填写错误
        console.log(info.file.response)
        // this.fileList.splice(0)
        const h = this.$createElement
        this.$error({
          title: '提醒',
          content: h('div', {}, [h('p', `${info.file.response.message}`), h('p', '请确认无误后重新上传')]),
        })
      }
    },

    // *把当前行数据插入到导入的上一个有children的数据里
    // insert(arr) {
    //   arr.forEach((item, index) => {
    //     // if (item.remark == '主材') {
    //     if (item.is_main == '是') {
    //       let i = index + 1
    //       // console.log('arr[i]', arr[i],'i',i)
    //       if (arr[i] && arr[i].is_main !== '是') {
    //         arr[index].children.push(arr[i])
    //         arr.splice(i, 1)
    //       }
    //     } else {
    //       return this.insert(arr)
    //     }
    //   })
    //   return arr
    // },
    handleOk() {
      console.log(this.formParams, this.type, this.record)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$refs.tableform.validate(async (valid) => {
            // 校验方案信息是否为空
            if (this.form.dataSource.length == 0) return this.$message.warning('请添加方案信息!')
            if (valid) {
              let data = {
                ...this.formParams,
                type: 1,
                category: 1,
                projectId: this.record.projectId,
                time: this.record.time,
                schemeInfos: this.form.dataSource, //方案数据
              }
              let templateData = {
                ...this.formParams,
                id: this.record.id,
                type: 1,
                templateInfo: this.form.dataSource,
              }
              this.okLoading = true
              let add = this.is_template ? addSchemeTemplate : addScheme
              let edit = this.is_template ? editTemplateScheme : editScheme
              let handleData = this.is_template ? templateData : data
              console.log(handleData, add)
              if (this.type == 0) {
                // 添加方案
                add(handleData)
                  .then((res) => {
                    if (res.success) {
                      this.$message.success(res.message)
                      this.$emit('refresh')
                    } else {
                      this.$message.error(res.message)
                    }
                    this.close()
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.okLoading = false
                    }, 2000)
                  })
              } else {
                // 编辑方案
                edit(handleData)
                  .then((res) => {
                    if (res.success) {
                      this.$message.success(res.message)
                      this.$emit('refresh')
                    } else {
                      this.$message.error(res.message)
                    }
                    this.close()
                  })
                  .finally(() => {
                    setTimeout(() => {
                      this.okLoading = false
                    }, 2000)
                  })
              }
            } else {
              return false
            }
          })
        }
      })
    },
  },
  watch: {
    'form.dataSource': {
      handler(newVlaue) {
        console.log(newVlaue)
        this.formatPurchasePrice = newVlaue.reduce((p, c) => p + Number(c.purchaseTotlePrice || 0), 0).toFixed(2)
        let purchaseTotlePrice = 0
        let data = newVlaue.forEach((item) => {
          if (item.children) {
            purchaseTotlePrice = item.children.reduce((p, c) => p + Number(c.purchaseTotlePrice || 0), 0).toFixed(2)
            this.formatPurchasePrice = (Number(this.formatPurchasePrice) + Number(purchaseTotlePrice)).toFixed(2)
            console.log(this.formatPurchasePrice)
          }
        })
        const dom = this.$refs?.tableformRef?.$el.getElementsByClassName('ant-table-body')[0]
        const footerDom = document.getElementsByClassName('subtotal')[0]
        footerDom?.addEventListener(
          'scroll',
          () => {
            dom.scrollLeft = footerDom.scrollLeft
          },
          true
        )
      },
      deep: true,
      immediate: true,
    },
    // // 监听父组件传来的方案/选型数据
    // proData: {
    //   handler(val) {
    //     this.form.dataSource = val
    //   },
    //   deep: true,
    //   immediate: true,
    // },
  },
}
</script>

<style lang="less" scoped>
::v-deep .ant-table td {
  white-space: nowrap;
}
.title {
  background-color: #f8faff;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}
.buttom {
  margin: 10px 5px;
}
// 隐藏上传的文件名称图标
::v-deep .ant-upload-list {
  display: none;
}
::v-deep .ant-upload-list-text {
  display: none;
}
::v-deep .ant-input-number-handler-wrap {
  z-index: 0;
}
// 表头前加*
.form-table-heard:before {
  content: '*';
  color: red;
}
.wrap /deep/ .ant-table-tbody > tr > td {
  white-space: nowrap;
  height: 63px !important;
}

/*统一table表格的尺寸*/
.ant-table {
  table-layout: fixed;
}
.ant-table-tbody > tr > td {
  max-width: 200px;
  min-width: 70px;
  height: 70px;
  border-bottom: 0;
  /*text-align: center !important;*/
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  word-break: break-all;
}
.overflowStyle {
  // max-width: 300px !important;
  // max-height: 70px;
  // white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: break-word;
  word-break: break-all;
  text-align: left;
  white-space: pre-line
}
//隐藏a-table组件的滚动条
// /deep/.ant-table-body {
//   overflow: hidden !important;
// }
// /deep/.ant-table-footer {
//   margin: 0;
// }
// .subtotal {
//   height: 50px;
//   // position: absolute;
//   // bottom: 10px;
//   width: 100%;
//   border: 1px solid #e8e8e8;
//   background: #fafafa;
//   display: flex;
//   align-items: center;
//   font-weight: 700;
//   overflow-x: scroll;
//   overflow-y: hidden;
//   .left {
//     flex: none; /* div显示滚动条的重点 */
//     // width: 391px;
//     margin-left: 60px;
//   }
//   .number {
//     flex: none;
//     color: #666666;
//     height: 100%;
//     width: 150px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }
// }
</style>
