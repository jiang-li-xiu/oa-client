<template>
  <section v-if="show" class="h-transfer" :class="[list.length == 1 ? 'single-tab' : '']">
    <div class="mask"></div>
    <!-- 内容面板 -->
    <div class="transfer__content">
      <!-- 面板顶部标题 -->
      <header class="transfer__header">
        <i class="el-icon-monitor"></i>
        {{ title }}
        <i class="el-icon-close" @click="closeTransfer"></i>
      </header>
      <!-- 穿梭框主要内容 -->
      <div class="transfer__body">
        <!-- 左边穿梭框 -->
        <div class="transfer-pane">
          <!-- 操作栏 -->
          <!-- <div class="transfer-pane-tools">
            
          </div> -->
          <!-- 穿梭框 -->
          <div class="transfer-pane-body" style="height: 370px">
            <div class="enough-mask" v-show="isEnough">
              <span class="p-center">最多选择{{ maxNum }}项</span>
            </div>
            <!-- 搜索框 -->
            <el-input
              v-model="searchString"
              class="search-input"
              size="mini"
              style="padding: 6px 12px"
              type="search"
              placeholder="搜索"
              prefix-icon="el-icon-search"
            ></el-input>
            <el-scrollbar style="height: 100%">
              <div
                style="width: 100%; display: flex; justify-content: center; flex-direction: column; align-items: center"
              >
                <el-radio-group
                  v-model="labelType"
                  size="small"
                  style="overflow: hidden"
                  class="el-radio-orgs"
                  @change="radioChange"
                >
                  <el-radio-button label="org" class="radio-left">组织架构</el-radio-button>
                  <el-radio-button label="role" class="radio-right">角色列表</el-radio-button>
                </el-radio-group>
              </div>
              <div v-show="tabShow == 'org'" style="padding: 0 10px 0 10px">
                <p
                  class="ellipsis tree_nav"
                  v-if="activeName == 1 && !searchVal"
                  style="width: 100%; margin-left: 20px; margin-bottom: 0"
                >
                  <span @click="getDepartmentList(null, null)" class="ellipsis">通讯录</span>
                  <span
                    v-for="(item, index) in titleDepartments"
                    class="ellipsis"
                    :key="index + 'a'"
                    @click="getDepartmentList(item.id, item.name)"
                    >{{ item.name }}</span
                  >
                </p>
                <template>
                  <ul class="select-box">
                    <template v-for="elem in list">
                      <template v-if="elem.type === 'department'">
                        <li v-for="item in elem.data" :key="item.id" class="check_box">
                          <a :class="elem.isActive(item) && 'active'" @click="elem.change(item)">
                            <img src="@/assets/icon_file.png" />{{ item.name }}</a
                          >
                          <i @click="elem.next(item)">下级</i>
                        </li>
                      </template>
                      <template v-if="elem.type === 'employee'">
                        <li v-for="item in elem.data" :key="item.id" class="check_box">
                          <a :class="elem.isActive(item) && 'active'" @click="elem.change(item)">
                            <img src="@/assets/icon_people.png" />{{ item.name }}
                          </a>
                        </li>
                      </template>
                    </template>
                  </ul>
                </template>
              </div>
              <div v-show="tabShow == 'role'" style="padding: 0 10px 0 10px">
                <ul class="select-box">
                  <template v-for="elem in roleList">
                    <li
                      v-for="item in elem.data"
                      :key="item.roleId"
                      class="check_box"
                      :class="{ active: elem.isActive && elem.isActive(item) }"
                      @click="elem.change(item)"
                    >
                      <a :title="item.description" :class="{ active: elem.isActiveItem && elem.isActiveItem(item) }">
                        <img src="@/assets/icon_role.png" />{{ item.name || item.roleName }}
                      </a>
                    </li>
                  </template>
                </ul>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <!-- 右边穿梭框 -->

        <div class="transfer-pane" style="position: relative">
          <el-scrollbar class="transfer-pane-body shadow right-pane" v-model="checkedData">
            <template>
              <div class="select-result l">
                <p class="clear">
                  已选（{{ selectedNum }}）
                  <a @click="delList()">清空</a>
                </p>
                <ul>
                  <template v-for="{ type, data, cancel } in resHandle">
                    <template v-if="type === 'role'">
                      <li v-for="item in data" :key="item.roleId">
                        <img src="@/assets/icon_role.png" />
                        <span>{{ item.name || item.roleName }}</span>
                        <img src="@/assets/cancel.png" @click="cancel(item)" />
                      </li>
                    </template>
                    <template v-if="type === 'department'">
                      <li v-for="item in data" :key="item.id">
                        <img src="@/assets/icon_file.png" />
                        <span>{{ item.name || item.roleName }}</span>
                        <img src="@/assets/cancel.png" @click="cancel(item)" />
                      </li>
                    </template>
                    <template v-if="type === 'employee'">
                      <li v-for="item in data" :key="item.id">
                        <img src="@/assets/icon_people.png" />
                        <span>{{ item.name || item.roleName }}</span>
                        <img src="@/assets/cancel.png" @click="cancel(item)" />
                      </li>
                    </template>
                  </template>
                </ul>
              </div>
            </template>
          </el-scrollbar>
        </div>
      </div>
      <footer class="transfer-footer">
        <a-button @click="confirm" type="primary">确定</a-button>
        <a-button @click="closeTransfer" class="cancel">取消</a-button>
      </footer>
    </div>
  </section>
</template>

<script>
import { debounce } from '@/utils/index.js'
import { getAction } from '@/api/manage'

export default {
  name: 'fc-org-transfer',
  props: {
    // v-model 已经选择过的数据 用于回显
    value: {
      type: Array,
      default: () => [],
    },
    resList: {
      type: Array,
      default: () => [{ type: 'role', data: [], cancel: function () {} }],
    },
    // 字符串数组使用配置文件的预设值
    // 对象数组需要包含 key/conf 两个属性 conf 会覆盖对应key的默认配置
    tabList: {
      type: Array,
      default: () => ['dep', 'role'],
    },
    title: {
      type: String,
      default: '组织机构',
    },
    show: {
      type: Boolean,
      reuired: true,
    },
    // 可选择的最大数量
    maxNum: {
      type: Number,
      default: 99,
    },
    currnetDatas: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isEnough: false, // 是否选择了足够的人数
      searchString: '', //查询条件
      list: [], //组织机构数据
      roleList: [], //角色数据
      labelType: 'org',
      tabShow: 'org',
      activeName: 1,
      searchVal: '',
      titleDepartments: [], //组织架构选择组织数据
      checkedEmployessList: [], //已选人员数据
      checkedDepartmentList: [], //已选部门数据
      checkedRoleList: [], //已选角色数据
      checkedData: [], //完整的已选择数据
      checkedDatas: [], //完整的已选择数据
    }
  },
  computed: {
    selectedNum() {
      let num = this.checkedEmployessList.length + this.checkedRoleList.length + this.checkedDepartmentList.length
      return num
    },
    resHandle: {
      get() {
        let data = [
          {
            type: 'role',
            data: this.checkedRoleList,
            cancel: (item) => this.removeEle(this.checkedRoleList, item, 'roleId'),
          },
          {
            type: 'employee',
            data: this.checkedEmployessList,
            cancel: (item) => this.removeEle(this.checkedEmployessList, item),
          },
          {
            type: 'department',
            data: this.checkedDepartmentList,
            cancel: (item) => this.removeEle(this.checkedDepartmentList, item),
          },
        ]
        this.checkedData = data
        return data
      },
      set(val) {
        let data = [
          {
            type: 'role',
            data: this.checkedRoleList,
            cancel: (item) => this.removeEle(this.checkedRoleList, item, 'roleId'),
          },
          {
            type: 'employee',
            data: this.checkedEmployessList,
            cancel: (item) => this.removeEle(this.checkedEmployessList, item),
          },
          {
            type: 'department',
            data: this.checkedDepartmentList,
            cancel: (item) => this.removeEle(this.checkedDepartmentList, item),
          },
        ]
        this.checkedData = val
        return data
      },
    },
  },
  created() {
    this.getCheckedData()
  },
  mounted() {
    this.getRoleList()
    this.getDepartmentList()
    //this.isNumEnough()
    this.debounceSearch = debounce(this.searchDepUser, 500)
  },
  methods: {
    getCheckedData() {
      this.checkedDatas = this.currnetDatas
      this.checkedDatas.map((item) => {
        // 判断类型
        if (item.type === 'role') {
          this.checkedRoleList = item.data // 已选角色数据
        } else if (item.type === 'employee') {
          this.checkedEmployessList = item.data // 已选人员数据
        } else if (item.type === 'department') {
          this.checkedDepartmentList = item.data //已选部门数据
        }
      })
      this.checkedData = this.resHandle

      // console.log(this.checkedData)
    },
    //获取组织架构数据
    getDepartmentList(id, name) {
      this.searchString = ''
      let that = this
      getAction('/workflow/departmentByLayer', { pid: id }).then((res) => {
        if (res.success) {
          that.dataTransfer(res.result)
          if (id != null && id != undefined && name != '' && name != undefined) {
            let titleDepartments = that.titleDepartments
            //判断是否存在，存在则截取数据之后的数据，否则添加
            let len = titleDepartments.length
            for (var i = 0; i < len; i++) {
              if (titleDepartments[i].id == id) {
                that.titleDepartments = titleDepartments.slice(0, i + 1)
                return
              }
            }
            that.titleDepartments.push({ id: id, name: name })
          } else {
            that.titleDepartments = []
          }
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    //组织架构数据处理
    dataTransfer(data) {
      this.list = [
        {
          type: 'department',
          data: data.department,
          isActive: (item) => this.toggleClass(this.checkedDepartmentList, item),
          change: (item) => this.toChecked(this.checkedDepartmentList, item),
          next: (item) => this.getDepartmentList(item.id, item.name),
        },
        {
          type: 'employee',
          data: data.employee,
          isActive: (item) => this.toggleClass(this.checkedEmployessList, item),
          change: (item) => this.toChecked(this.checkedEmployessList, item),
        },
      ]
    },
    // 角色列表
    getRoleList() {
      getAction('/workflow/roleList', {}).then((res) => {
        if (res.success) {
          this.roleList = [
            {
              type: 'role',
              data: res.result,
              isActiveItem: (item) => this.toggleClass(this.checkedRoleList, item, 'roleId'),
              change: (item) => this.toChecked(this.checkedRoleList, item, 'roleId'),
            },
          ]
        } else {
          that.$message.warning(res.message)
        }
      })
    },

    //点击勾选
    toggleClass(arr, elem, key = 'id') {
      return arr.some((item) => item[key] == elem[key])
    },

    //勾选
    toChecked(arr, elem, key = 'id') {
      var isIncludes = this.toggleClass(arr, elem, key)
      !isIncludes ? arr.push(elem) : this.removeEle(arr, elem, key)
    },

    //移除元素
    removeEle(arr, elem, key = 'id') {
      var includesIndex
      arr.map((item, index) => {
        console.log(item, elem)
        if (item[key] == elem[key]) {
          includesIndex = index
        }
      })
      arr.splice(includesIndex, 1)
    },

    //右侧清空
    delList() {
      this.checkedEmployessList = []
      this.checkedRoleList = []
      this.checkedDepartmentList = []
    },

    //查询事件
    searchDepUser() {
      if (!this.searchString) {
        return
      }
      let that = this
      getAction('/workflow/departmentQuery', { condition: this.searchString }).then((res) => {
        if (res.success) {
          that.dataTransfer(res.result)
        } else {
          that.$message.warning(res.message)
        }
      })
    },

    //组织架构和角色列表切换
    radioChange() {
      this.tabShow = this.labelType
    },

    // 加载子树数据的方法
    onLoad(node, resolve) {},

    isNumEnough() {
      let count = this.checkedEmployessList.length + this.checkedRoleList.length + this.checkedDepartmentList.length
      this.isEnough = count >= this.maxNum
    },

    //关闭弹出框
    closeTransfer() {
      this.$emit('update:show', false)
      this.isEnough = false
      this.searchString = ''
      // 清空选择的数据
      this.$nextTick(() => {
        this.checkedData = []
        this.checkedDatas = []
        this.titleDepartments = []
        this.checkedEmployessList = []
        this.checkedDepartmentList = []
        this.checkedRoleList = []
        this.resHandle = []
      })
    },

    //确认选择
    confirm() {
      // const res = {}
      // console.log(this.tabKeys, this.checkedData)
      // for (const type of this.tabKeys) {
      //   res[type] = this.selectedData[type].concat(this.aloneCheckedData[type])
      // }
      // this.$emit('confirm', res)
      // this.closeTransfer()
      console.log(this.checkedData)
      const res = {}
      let data = this.checkedData
        .map((item, i) => {
          console.log(item)
          if (item.data.length !== 0) {
            return item.data
          }
        })
        .filter((item2) => item2 !== undefined)
      //  将多个数组对象合并成一个数组对象
      let removal = []
      data.map(function (value, index, array) {
        removal = removal.concat(value)
      })
      let visibleSummary = removal.map((element) => {
        return element.name || element.roleName
      })
      console.log('确认选择', removal, visibleSummary, this.checkedData)
      this.$emit('confirm', removal, visibleSummary.toString(), this.checkedData)
      this.closeTransfer()
    },

    getConfProp(propName, tabKey) {
      const conf = this.getActiveConf(tabKey)
      return conf ? conf[propName] : null
    },

    getNodeProp(data, propName, tabKey) {
      try {
        const prop = this.getConfProp(propName, tabKey)
        if (typeof prop === 'string') {
          return data[prop]
        }
        if (typeof prop === 'function') {
          return prop(data)
        }
      } catch (e) {
        console.error(e)
        return '执行出错，可联系开发人员'
      }
    },
  },
  updated() {
    this.getCheckedData()
  },

  watch: {
    //查询监听
    searchString() {
      this.debounceSearch()
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
}
</script>
<style lang="stylus">

.h-transfer{
  text-align: left;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 2999;
  line-height: 32px;

  > .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .el-tabs--border-card {
    box-shadow: none;
    border: none;
  }

  .el-tabs__content {
    overflow: visible;
    min-height: 250px;
  }

  .el-tabs__nav {
    width: 100%;
    display: flex;

    > .el-tabs__item {
      flex-grow: 1;
    }
  }

  &.single-tab .el-tabs__item {
    text-align: center;
    background: #f5f7fa !important;
    border-bottom: 1px solid #e4e7ed;
    border-right-width: 0px;
  }

  .searchResPane{
    position: absolute;
    overflow-y: auto;
    z-index: 99;
    left: 0;
    top: 100%;
    width: 100%;
    height: 100%;
    background: white;
    border: 1px solid #dcdfe6;
    transition: top .5s;

    &.active{
        top: 0;
    }

    .hidden-tag{
      color:#999;
      font-size:12px;
      text-align:right;
      padding-top:4px;
      padding-right:12px;
      cursor pointer

      &:hover{
          color: #66b1ff;
      }
    }

    .item{
      padding: 4px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height 1.5
      &:hover{
          background-color: #ecf5ff;
          color: #66b1ff;
          cursor: pointer;
      }

      .search-res-tip{
        font-size:12px;
        color:#999;
        max-width: 280px;
      }
    }
  }

  .enough-mask{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    color: white;
    font-size: 16px;
    z-index: 100;
    height: 100%;
    background: rgba(0,0,0,0.5);
    letter-spacing: 4px;
  }

  .p-center{
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
  }

  .transfer__content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  background: white;
  overflow: hidden;
  border-radius: 4px;
}

.transfer__header {
  margin-bottom: 6px;
  background: #1890FF;
  padding: 6px 24px;
  color: white;
  text-align: center;
  .el-icon-close{
    cursor:pointer;
    float: right;
    margin-top: 10px;
  }
}

.transfer__body {
  padding: 12px 0;
  display: flex;
  justify-content: space-around;
}

.cancel{
  margin-left: 10px
}

.transfer-pane {
  width: 360px;
  border: 1px solid #DCDFE6;
  background: rgb(244, 246, 248)
}

.search-input  input{
  border: 1px solid #DCDFE6 !important;
  &:focus{
    border-color:#409EFF !important;
  }
}

.transfer-pane-tools {
  margin-bottom: 10px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 44px;
  right: 12px;

  span:last-child {
    cursor: pointer;
  }
}

.transfer-pane-body {
  position relative
  width: 100%;
  height: 330px;
  overflow hidden
  font-size: 14px;

  >>> .el-scrollbar__view{
    height: 100%;
  }

  /deep/ .el-input__prefix{
    left: 14px;
    top: 2px;
  }

  .el-tabs__item {
    height: 26px;
    line-height: 26px;
  }
}

.transfer-icons {
  display: flex;
  flex-direction: column;
  justify-content: center;

  i {
    margin-top: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    font-size: 20px;
    color: #696969;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;

  .node-label {
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }

  .node-checkbox {
    position: absolute;
    right: 0;
  }

  i {
    &:hover {
      color: #1485f8;
      cursor: pointer;
    }

    font-size: 10px;
  }
}

.right-pane {
  box-sizing: border-box;
  overflow-x: hidden;
  // height: 290px;
  margin-bottom: 10px;

  .selected-item {
    padding: 0px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
      background-color: #F5F7FA;
    }

    span {
      max-width: 90%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    i {
      &:hover {
        color: #1485f8;
        cursor: pointer;
      }
    }
  }
}

.transfer-footer{
  text-align: center;
  padding-bottom: 12px;
}

.dot{
  width: 2px;
  height: 2px;
  display: inline-block;
  border-radius: 50%;
  background: #4caf50;
}

  .text-ellipsis{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/*组织架构切换样式*/
.radio-left{
  /deep/.el-radio-button__inner{
    width:165px;
    border-radius: 32px 0 0 32px !important;
  }
}

.radio-right{
  /deep/.el-radio-button__inner{
    width:165px;
    border-radius: 0 32px 32px 0 !important;
  }
}

.select-box {
  overflow-y: auto;
  list-style-type: none;
  padding:0;

  li {
    padding: 5px 0;
    i {
      float: right;
      padding-left: 24px;
      padding-right: 10px;
      color: #3195f8;
      font-size: 12px;
      cursor: pointer;
      background: url(../../../assets/next_level_active.png) no-repeat 10px center;
      border-left: 1px solid rgb(238, 238, 238);
    }

    a.active+i {
      color: rgb(197, 197, 197);
      background-image: url(../../../assets/next_level.png);
      pointer-events: none;
    }

    img {
      width: 14px;
      vertical-align: middle;
      margin-right: 5px;
    }
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
    background: url(../../../assets/check_box.png) no-repeat center;
}
}

.select-result {
  width: 100%;
  height: 100%;
  font-size: 12px;
  ul {
    overflow-y: auto;
    list-style-type: none;
    padding:0;
    li {
      margin: 11px 26px 13px 19px;
      line-height: 17px;

      span {
        vertical-align: middle;
      }

      img {
        &:first-of-type {
          width: 14px;
          vertical-align: middle;
          margin-right: 5px;
        }

        &:last-of-type {
          float: right;
          margin-top: 2px;
          width: 14px;
        }
      }
    }
  }

  p {
    padding-left: 19px;
    padding-right: 20px;
    line-height: 37px;
    border-bottom: 1px solid #f2f2f2;

    a {
      float: right;
    }
  }
}
.ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.tree_nav span {
  display: inline-block;
  padding-right: 10px;
  margin-right: 5px;
  max-width: 6em;
  color: #38adff;
  font-size: 12px;
  cursor: pointer;
  background: url(../../../assets/jiaojiao.png) no-repeat right center;
}
.tree_nav span:last-of-type {
  background: none;
}
</style>
