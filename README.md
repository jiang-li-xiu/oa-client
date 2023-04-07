Ant Design Jeecg Vue
====

当前最新版本： 3.3.0（发布日期：20220725）

Overview
----

基于 [Ant Design of Vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn/) 实现的 Ant Design Pro  Vue 版
Jeecg-boot 的前端UI框架，采用前后端分离方案，提供强大代码生成器的低代码平台。
前端页面代码和后端功能代码一键生成，不需要写任何代码，保持jeecg一贯的强大！！



#### 前端技术
 
- 基础框架：[ant-design-vue](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue 实现
- JavaScript框架：Vue
- Webpack
- node
- yarn
- eslint
- @vue/cli 3.2.1
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - 头像裁剪组件
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - Alipay AntV 数据可视化图表
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation)  - antv/g2 封装实现

####动态渲染icon方法
-引入Icon:
```nashorn js
import Icon from 'ant-design-vue/es/icon'
```
-通过组件方式使用
```nashorn js
  components: {
      Icon
    }
    <icon :type="text" style="color:red;"/>
```
-通过方法渲染
```nashorn js
customRender: (d)=>{
   var props = {"type" : d};
   return (<Icon {... { props } }/>)
 },
```

项目下载和运行
----

- 拉取项目代码
```bash
git clone https://github.com/zhangdaiscott/jeecg-boot.git
cd  jeecg-boot/ant-design-vue-jeecg
```

- 安装依赖
```
yarn install
```

- 开发模式运行
```
yarn run serve
```

- 编译项目
```
yarn run build
```

- Lints and fixes files
```
yarn run lint
```

Docker镜像启动前端（单体模式）
----

 ``` 
# 1.配置host

    127.0.0.1   jeecg-boot-system

# 2.修改前端项目的后台域名
    .env.development
    域名改成： http://jeecg-boot-system:8080/jeecg-boot
   
# 3.进入项目根目录，执行打包命令
  yarn run build

# 4.构建镜像
  docker build -t jeecgboot-ui2 .

# 5.启动镜像
  docker run --name jeecgboot-ui-vue2 -p 80:80 -d jeecgboot-ui2

# 6.访问前台项目
  http://localhost
``` 



其他说明
----

- 项目使用的 [vue-cli3](https://cli.vuejs.org/guide/), 请更新您的 cli

- 关闭 Eslint (不推荐) 移除 `package.json` 中 `eslintConfig` 整个节点代码

- 修改 Ant Design 配色，在文件 `vue.config.js` 中，其他 less 变量覆盖参考 [ant design](https://ant.design/docs/react/customize-theme-cn) 官方说明
```ecmascript 6
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  }
```



附属文档
----
- [Ant Design Vue](https://vuecomponent.github.io/ant-design-vue/docs/vue/introduce-cn)

- [报表 viser-vue](https://viserjs.github.io/demo.html#/viser/bar/basic-bar)

- [Vue](https://cn.vuejs.org/v2/guide)

- [路由/菜单说明](https://github.com/zhangdaiscott/jeecg-boot/tree/master/ant-design-vue-jeecg/src/router/README.md)

- [ANTD 默认配置项](https://github.com/zhangdaiscott/jeecg-boot/tree/master/ant-design-vue-jeecg/src/defaultSettings.js)

- 其他待补充...


备注
----

> @vue/cli 升级后，eslint 规则更新了。由于影响到全部 .vue 文件，需要逐个验证。既暂时关闭部分原本不验证的规则，后期维护时，在逐步修正这些 rules

---
*`绩效考核模块添加说明`*
===

- 所有代码都在api、views、component、utils等的performance文件夹下
- 新增依赖有 
``` 
"@riophae/vue-treeselect": "0.4.0",
"ua-parser-js": "^0.7.28",
"js-beautify": "1.13.0",
"quill": "1.3.7",
"vue-qr": "^2.4.0"
```
- main文件中增加的配置内容
```
import Pagination from "@/components/performance/Pagination"
import RightToolbar from "@/components/performance/RightToolbar" // 自定义表格工具扩展
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
```
- 新增图片在 assets/images文件夹下
- `剩余工作`
1. 改造绩效模块中使用到系统模块的接口
2. 表格的改造
3. 前后端接口数据的对接

*另一种方案是使用微前端技术（`未实操过，只是一个思路`）*
===
- 实现可以参考jeecgboot 的技术文档
- 目前项目已经引入qiankun组件应该是可以实现的
- 将绩效考核系统单独作为一个子应用，子应用可以独立构建，运行时动态加载,主子应用完全解耦，技术栈无关，靠的是协议接入（子应用必须导出 bootstrap、mount、unmount方法）


--- 
绩效考核部分页面修改步骤
====

按钮权限
---
> 这里以v-hasPermi="['business:taskApplyManager:add']"的改造为示例
1. 进入后台菜单管理页面配置按钮权限菜单
> 将授权标识设置为：business:taskApplyManager:add
2. 修改前端页面
> - v-hasPermi 改为v-has
> - "['business:taskApplyManager:add']", 去掉中括号，
3. 进入角色管理授权按钮（授权后即可看见按钮）
4. $\color{red}{备注：}$ `授权标识支持多个，多个逗号分隔`

字典
---
1. 字典数据获取
- 引入js: 
```
import { ajaxGetDictItems } from '@/api/api'
```
- 请求数据
```
<!-- 将created 中的getDicts方法改为如下 -->
ajaxGetDictItems("gs_apply_task_status", null).then((response) => {
    this.applyTaskStatueOptions = response.result;
});
```
2. 翻译修改
```
<!-- 将一下代码 -->
return this.selectDictLabel(
    this.applyTaskStatueOptions,
    row.applyTaskStatue
);

<!-- 改为 -->
return selectDictLabel(
    this.applyTaskStatueOptions, 
    row.applyTaskStatue
);
```
3. 页面使用
- 将dictValue 改为 value
- 将dictLabel 改为 label

当前登录用户信息
---
> 将this.userName = this.$store.state.user.name;改为：this.userName = this.$store.getters.userInfo.username;


获取系统用户列表
---
1. 引入js:
```
import { getUserList } from '@/api/api'
```
```
<!-- 将listUser 方法改为如下方法 -->
getUserList(this.userParams).then((response) => {
    this.userList = response.records;
});
```

文件上传和预览
---
1. 修改删除组件及接口
2. 增加文件预览和下载功能

接口数据格式
---
1. 信息描述字段名由msg改为message

数据导出
---
1. 使用页面引入导出js
```
import { exportXls } from "@/utils/performance/ruoyi";
```
2. 使用
```
handleExport() {
  const queryParams = this.queryParams;
  queryParams.approvalBy = this.$store.getters.userInfo.username;
  queryParams.exportName = "我审批的主动任务申请";
  queryParams.applyTaskIds = this.ids;
  this.$confirm({
    title: "提示",
    content: "是否导出选中数据?",
    onOk: function () {
      exportXls('/perf/taskApplyManager/exportXls', queryParams, queryParams.exportName);
    }
  });
},
```
