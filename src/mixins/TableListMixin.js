//导入过滤对象中为空的属性、防抖方法
import { filterObj, simpleDebounce } from '@/utils/util';
// 导入封装好的请求方法
import { deleteAction, getAction, downFile, deletePathAction, downFileTemplate } from '@/api/manage'
import Vue from 'vue'

export const TableListMixin = {
    data() {
        return {
            /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
            queryParam: {},
            /* 数据源 */
            dataSource: [],
            /* 分页参数 */
            ipagination: {
                current: 1,
                pageSize: 15,
                pageSizeOptions: ['15', '30', '50', '100'],
                showTotal: (total, range) => {
                    return range[0] + "-" + range[1] + " 共" + total + "条"
                },
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0
            },
            /* 筛选参数 */
            filters: {},
            /* table加载状态 */
            loading: false,
            /* table选中keys*/
            selectedRowKeys: [],
            /* table选中records*/
            selectionRows: [],
            /* 查询折叠 */
            toggleSearchStatus: false,
            selections: '',
            // 获取高度的参照元素，默认为id为app的元素
            targetEl: '#app',
            // 表格最高可用高度 
            tableHeight: 0,
        }
    },
    created() {
        if (!this.disableMixinCreated) {
            console.log(' -- mixin created -- ')
                // 获取列表数据
            this.loadData();
            //初始化字典配置 在自己页面定义
            this.initDictConfig();
        }
        // 调用获取页面高度方法
        this.getHeight()
            // 监听表格高度
        window.addEventListener("resize", this.getHeight);
    },
    methods: {
        // 获取表格高度
        getHeight() {
            // this.tableHeight = window.innerHeight - this.extraHeight;
            // console.log(this.tableHeight)
            // 获取参照物元素
            const targetEl = document.querySelector(this.targetEl)
                // 获取表格元素
            const tableEl = document.querySelector('.ant-table-wrapper')

            if (targetEl && tableEl) {
                // 获取表格最高可用高度
                this.tableHeight = targetEl.offsetHeight - (tableEl.offsetParent.offsetTop + tableEl.offsetTop)
                console.log(this.tableHeight);
            }
        },
        // 获取列表数据
        loadData(arg) {
            if (!this.url.list) {
                this.$message.error("请设置url.list属性!")
                return
            }
            //加载数据 若传入参数1则加载第一页的内容
            if (arg === 1) {
                this.ipagination.current = 1;
            }
            let params = this.getQueryParams(); //查询条件
            this.loading = true;
            getAction(this.url.list, params).then((res) => {
                if (res.success) {
                    //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
                    this.dataSource = res.result.records || res.result;
                    if (res.result.total) {
                        this.ipagination.total = res.result.total;
                    } else {
                        this.ipagination.total = 0;
                    }
                    //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
                } else {
                    this.$message.warning(res.message)
                }
            }).finally(() => {
                this.loading = false
            })
        },
        // 查询参数渲染
        getQueryParams() {
            //获取高级查询条件
            let sqp = {}
            if (this.superQueryParams) {
                sqp['superQueryParams'] = encodeURI(this.superQueryParams)
                sqp['superQueryMatchType'] = this.superQueryMatchType
            }
            let param = Object.assign(sqp, this.param, this.isorter, this.filters);
            param.field = this.getQueryField();
            param.pageNo = this.ipagination.current;
            param.pageSize = this.ipagination.pageSize;
            return filterObj(param);
        },
        getQueryField() {
            //TODO 字段权限控制
            let str = "id,";
            this.columns.forEach(function(value) {
                str += "," + value.dataIndex;
            });
            return str;
        },
        //初始化字典配置 在自己页面定义
        initDictConfig() {
            console.log("--这是一个假的方法!")
        },
        //分页、排序、筛选变化时触发
        handleTableChange(pagination, filters, sorter) {
            //分页、排序、筛选变化时触发
            //TODO 筛选
            console.log(pagination)
            if (Object.keys(sorter).length > 0) {
                this.isorter.column = sorter.field;
                this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
            }
            this.ipagination = pagination;
            this.loadData();
        },
        // 检索：查询按钮
        searchQuery() {
            this.loadData(1);
        },
        // 检索：重置按钮
        searchReset() {
            for (let key in this.queryParam) {
                if (key != 'ids') {
                    this.queryParam[key] = null
                }
            }
            console.log(this.queryParam)

            for (let key in this.param) {
                if (key != 'ids') {
                    this.param[key] = null
                }
            }
            console.log(this.param)
            simpleDebounce(this.loadData, 0)(1);
        },
        // 检索展开、隐藏按钮
        handleToggleSearch() {
            if (this.toggleSearchStatus) {
                this.extraHeight -= 56
            } else {
                this.extraHeight += 56
            }
            this.getHeight()
            this.toggleSearchStatus = !this.toggleSearchStatus;
        },
        // 新增按钮：给列表添加数据
        handleAdd: function() {
            this.$refs.modalForm.add();
            this.$refs.modalForm.title = "新增";
            this.$refs.modalForm.disableSubmit = false;
        },
        // 编辑按钮：列表单行编辑
        handleEdit: function(record) {
            this.$refs.modalForm.edit(record);
            this.$refs.modalForm.title = "编辑";
            this.$refs.modalForm.disableSubmit = false;
        },
        // 查看详情：列表单行查看详情
        handleDetail: function(record) {
            this.$refs.modalForm.detail(record);
            this.$refs.modalForm.title = "详情";
            this.$refs.modalForm.disableSubmit = true;
        },
        // 列表多选
        onSelectChange(selectedRowKeys, selectionRows) {
            this.selectedRowKeys = selectedRowKeys;
            this.selectionRows = selectionRows;
        },
        // 清空列表选择
        onClearSelected() {
            this.selectedRowKeys = [];
            this.selectionRows = [];
        },
        // 列表内容删除：多选或单选 || 对象传参
        batchDel: function(id) {
            console.log('id:', id)
            let ids = id || this.selectedRowKeys.toString()
            console.log(ids)
            let that = this;
            this.$confirm({
                title: "确认删除",
                content: "是否删除数据?",
                onOk: function() {
                    that.loading = true;
                    deleteAction(that.url.deleteBatch, { ids: ids }).then((res) => {
                        if (res.success) {
                            //重新计算分页问题
                            that.reCalculatePage(that.selectedRowKeys.length)
                            that.$message.success("删除成功");
                            that.loadData();
                            that.onClearSelected();
                        } else {
                            that.$message.warning(res.message);
                        }
                    }).finally(() => {
                        that.loading = false;
                    });
                }
            });
        },
        // 列表内容删除：多选或单选 || 路径传参
        batchPathDel: function(id) {
            let ids = id || this.selectedRowKeys.toString()
            let that = this;
            console.log(that.url.deleteBatch);
            this.$confirm({
                title: "确认删除",
                content: "是否删除数据?",
                onOk: function() {
                    that.loading = true;
                    deletePathAction(that.url.deleteBatch, ids).then((res) => {
                        if (res.success) {
                            //重新计算分页问题
                            that.reCalculatePage(that.selectedRowKeys.length)
                            that.$message.success("删除成功");
                            that.loadData();
                            that.onClearSelected();
                        } else {
                            that.$message.warning(res.message);
                        }
                    }).finally(() => {
                        that.loading = false;
                    });
                }
            });
        },
        // 删除成功后操作
        reCalculatePage(count) {
            //总数量-count
            let total = this.ipagination.total - count;
            //获取删除后的分页数
            let currentIndex = Math.ceil(total / this.ipagination.pageSize);
            // 判断是否为0，最低为1
            currentIndex = currentIndex === 0 ? 1 : currentIndex
                //删除后的分页数<所在当前页
            if (currentIndex < this.ipagination.current) {
                this.ipagination.current = currentIndex;
            }
            console.log('currentIndex', currentIndex)
        },
        // 子组件传值：新增/修改 成功时，重载列表
        modalFormOk() {
            // 新增/修改 成功时，重载列表
            this.loadData();
            //清空列表选中
            this.onClearSelected()
        },

        // 下载模版 post请求
        downloadPost(fileName, format) {
            downFileTemplate(this.url.downloadUrl).then(data => {
                console.log(data)
                if (!data || data.size === 0) {
                    Vue.prototype['$message'].warning('文件下载失败')
                    return
                }
                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    window.navigator.msSaveBlob(new Blob([data]), fileName)
                } else {
                    let url = window.URL.createObjectURL(new Blob([data]))
                    let link = document.createElement('a')
                    link.style.display = 'none'
                    link.href = url
                    link.setAttribute('download', fileName + `.${format}`)
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link) //下载完成移除元素
                    window.URL.revokeObjectURL(url) //释放掉blob对象
                }
            })
        },
        // 下载模版 get请求
        download(fileName, format) {
            downFile(this.url.downloadGetUrl).then(data => {
                console.log(data)
                if (!data || data.size === 0) {
                    Vue.prototype['$message'].warning('文件下载失败')
                    return
                }
                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    window.navigator.msSaveBlob(new Blob([data]), fileName)
                } else {
                    let url = window.URL.createObjectURL(new Blob([data]))
                    let link = document.createElement('a')
                    link.style.display = 'none'
                    link.href = url
                    link.setAttribute('download', fileName + `.${format}`)
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link) //下载完成移除元素
                    window.URL.revokeObjectURL(url) //释放掉blob对象
                }
            })
        },

        //导入
        handleImport() {
            this.$refs.importmodal.show()
        },
        // 导出
        handleExportXls(fileName) {
            if (!fileName || typeof fileName != "string") {
                fileName = "导出文件"
            }
            let param = this.getQueryParams();
            if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
                param['selections'] = this.selectedRowKeys.join(",")
            }
            console.log("导出参数", param)
            downFile(this.url.exportXlsUrl, param,
                param.selections = this.selectedRowKeys ? this.selectedRowKeys.toString() : '').then((data) => {
                console.log(data);
                if (!data) {
                    this.$message.warning("文件下载失败")
                    return
                }
                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), fileName + '.xls')
                } else {

                    let url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.ms-excel' }))
                    let link = document.createElement('a')
                    link.style.display = 'none'
                    link.href = url
                    link.setAttribute('download', fileName + '.xls')
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link); //下载完成移除元素
                    window.URL.revokeObjectURL(url); //释放掉blob对象
                }
            })

        },
    },
    destroyed() {
        window.removeEventListener("resize", this.getHeight);
    },
}