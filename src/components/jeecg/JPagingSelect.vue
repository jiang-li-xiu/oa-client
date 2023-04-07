<template>
  <!-- 可根据这个精简一下 https://blog.csdn.net/cheng521521/article/details/126462097 -->
  <!-- 当前代码来源 http://my.h5house.com/ -->
  <div class="lst-select-pagination">
    <a-select
      :showSearch="showSearch"
      :allowClear="allowClear"
      :placeholder="placeholder"
      class="lst-select"
      :dropdownMatchSelectWidth="false"
      :filterOption="false"
      optionLabelProp="text"
      :value="inputValue"
      :mode="mode"
      :getPopupContainer="tirggerNode => tirggerNode.parentNode"
      :notFoundContent="fetching ? undefined : noDataText"
      :dropdownStyle="dropdownStyle"
      @search="val => hanldeDebounceGetData(val)"
      @change="val => handleDataChange(val)"
      @popupScroll="handleScroll"
      @dropdownVisibleChange="handleDropdownVisibleChange"
    >
      <a-icon type="search" slot="suffixIcon" class="icon-search" />
      <a-spin v-if="fetching" size="small" slot="notFoundContent" />
      <a-select-option
        v-for="optionItem in dataList"
        :disabled="optionItem[selectOptionsConfig['value']].toString() === '-1'"
        :key="optionItem[selectOptionsConfig['key']]"
        :value="optionItem[selectOptionsConfig['value']].toString()"
        :text="optionItem[selectOptionsConfig['text']]"
      >
        <span
          v-if="optionItem[selectOptionsConfig['value']].toString() !== '-1'"
        >
          <span
            class="select-option-text"
            :class="{ [item.className]: item.className }"
            v-for="(item, index) in selectOptionsShowContent"
            :key="index"
          >
            {{ optionItem[item.key] }}
          </span>
        </span>
        <span v-else>
          <a-spin size="small"></a-spin>
        </span>
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
import { cloneDeep, debounce } from "lodash";
export default {
  name: "gbAntSelectPagination",
  props: {
    defaultDataList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    noDataText: {
      type: String,
      default: "暂无数据"
    },
    showSearch: {
      type: Boolean,
      default: true
    },
    allowClear: {
      type: Boolean,
      default: true
    },
    mode:{
      type: String,
      require: false,
      default: () =>{
        return 'tag';
      }
    },
    data: {
      type: Array,
      require: false,
      default: () =>{
        return [];
      }
    },
    /**请求地址*/
    url: {
      type: String,
      require: false,
      default: () =>{
        return '';
      }
    },
    // 请求的通用数据
    apiCommonSearchData: {
      type: Object,
      default: () => {
        return {
          page: 1,
          pageSize: 20
        };
      }
    },
    apiInputConditionName: {
      type: String,
      default: "key"
    },
    selectOptionsConfig: {
      type: Object,
      default: () => {
        return {
          key: "id",
          value: "value",
          text: "title"
        };
      }
    },
    // 下拉框的自定义显示字段和样式名称
    selectOptionsShowContent: {
      type: Array,
      default: () => {
        return [{ key: "name", className: "" }];
      }
    },
    placeholder: {
      type: String,
      default: "请搜索"
    },
    dropdownStyle: {
      type: Object,
      default: () => {
        return {};
      }
    },
    debounceTime: {
      type: Number,
      default: 1500
    },
    paginationKeys: {
      type: Object,
      default: () => {
        return {
          page: "page",
          pageSize: "pageSize",
          totalPage: "totalPage",
          list: "list"
        };
      }
    },
    scrollTriggerHeight: {
      type: Number,
      default: 100
    },
    initData: {
      type: Object
    }
  },
  data() {
    this.hanldeDebounceGetData = debounce(
      this.hanldeDebounceGetData,
      this.debounceTime
    );
    this.lastScrollTop = 0;
    return {
      options: this.data,
      inputVal: "",
      lastFetchId: 0,
      fetching: false,
      inputValue: undefined,
      dataList: cloneDeep(this.defaultDataList),
      isLoading: false,
      isLoaded: false,
      pagination: {
        ...this.apiCommonSearchData,
        [this.paginationKeys.page]:
          this.apiCommonSearchData[this.paginationKeys.page] || 1,
        [this.paginationKeys.pageSize]:
          this.apiCommonSearchData[this.paginationKeys.pageSize] || 20
      }
    };
  },
  computed: {
    newList() {
      return {
        initData: this.initData,
        defaultDataList: this.defaultDataList
      };
    }
  },
  watch: {
    apiCommonSearchData(newVal) {
      this.pagination = {
        ...newVal,
        [this.paginationKeys.page]: newVal[this.paginationKeys.page] || 1,
        [this.paginationKeys.pageSize]:
          newVal[this.paginationKeys.pageSize] || 20
      };
    },
    newList(newVal) {
      let { initData, defaultDataList } = newVal;
      if (initData && initData[this.selectOptionsConfig.value]) {
        const defaultDataListClone = cloneDeep(defaultDataList);
        if (
          defaultDataList &&
          defaultDataList.every(
            item =>
              item[this.selectOptionsConfig.value] !==
              initData[this.selectOptionsConfig.value]
          )
        ) {
          defaultDataListClone.unshift(initData);
        }
        this.dataList = defaultDataListClone;
        this.$nextTick(() => {
          this.inputValue = initData[this.selectOptionsConfig.value].toString();
          // 设置值
          this.$emit("change", this.inputValue);
        });
      } else {
        this.dataList = defaultDataList;
      }
    }
  },
  methods: {
    async hanldeDebounceGetData(val) {
      await this.hanldeGetData(val, true);
    },
    async hanldeGetData(val, isInit) {
      if (!this.apiFn) {
        return false;
      }
      if (isInit) {
        this.pagination[this.paginationKeys.page] = 1;
        this.dataList = [];
      }
      this.$nextTick(async () => {
        this.inputVal = val;
        this.fetching = true;
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        try {
          const res = await this.apiFn({
            ...this.pagination,
            [this.apiInputConditionName]: val
          });
          if (fetchId !== this.lastFetchId) {
            return;
          }
          // 删除数据
          const dataListClone = Array.from(this.dataList);
          const loadingItemIndex = dataListClone.findIndex(
            item => item[this.selectOptionsConfig["value"]].toString() === "-1"
          );
          if (loadingItemIndex !== -1) {
            dataListClone.splice(loadingItemIndex, 1);
          }
          if (
            this.pagination[this.paginationKeys.page] >=
            res[this.paginationKeys.totalPage]
          ) {
            this.isLoaded = true;
          } else {
            this.isLoaded = false;
          }
          let newArr = res[this.paginationKeys.list];
          // 如果下拉框的数据包含初始化的数据，那么之前的数据应该删除添加的
          if (this.initData && this.initData[this.selectOptionsConfig.value]) {
            if (
              newArr.some(
                item =>
                  item[this.selectOptionsConfig.value] ===
                  this.initData[this.selectOptionsConfig.value]
              )
            ) {
              const currentIndex = dataListClone.findIndex(
                cloneItem =>
                  cloneItem[this.selectOptionsConfig.value] ===
                  this.initData[this.selectOptionsConfig.value]
              );
              dataListClone.splice(currentIndex, 1);
            }
          }
          this.dataList = dataListClone.concat(newArr);
          this.fetching = false;
        } catch (error) {
          // 删除数据
          const dataListClone = Array.from(this.dataList);
          const loadingItemIndex = dataListClone.findIndex(
            item => item[this.selectOptionsConfig["value"]].toString() === "-1"
          );
          if (loadingItemIndex !== -1) {
            dataListClone.splice(loadingItemIndex, 1);
          }
          this.dataList = dataListClone;
          this.fetching = false;
        }
      });
    },
    async handleDataChange(val) {
      const currentSelectedItemArr = this.dataList.filter(
        item => item[this.selectOptionsConfig["value"]].toString() === val
      );
      const currentSelectedItem =
        currentSelectedItemArr.length > 0 ? currentSelectedItemArr[0] : {};
      let inputValue = currentSelectedItem[this.selectOptionsConfig["value"]];
      if (inputValue) {
        this.inputValue = inputValue.toString();
      } else {
        this.inputValue = undefined;
      }
      this.$emit("handleChangeSelected", currentSelectedItem);
      this.$emit("change", this.inputValue);
    },
    handleScroll(e) {
      if (this.isLoading || this.isLoaded) {
        return false;
      }
      const ele = e.srcElement;
      const currentScrollTop = ele.scrollTop;
      const delta = currentScrollTop - this.lastScrollTop;
      this.lastScrollTop = currentScrollTop;
      if (delta > 0) {
        // 向下滚动
        if (
          ele.scrollHeight - ele.scrollTop - ele.offsetHeight <
          this.scrollTriggerHeight
        ) {
          this.isLoaded = true;
          let loadingItem = {
            [this.selectOptionsConfig["text"]]: "-1"
          };
          if (
            this.selectOptionsConfig["key"].toString() !==
            this.selectOptionsConfig["value"].toString()
          ) {
            loadingItem[this.selectOptionsConfig["key"]] = "-1";
            loadingItem[this.selectOptionsConfig["value"]] = "-1";
          } else {
            loadingItem[this.selectOptionsConfig["key"]] = "-1";
          }

          const dataListClone = Array.from(this.dataList);
          const paginationClone = Object.assign({}, this.pagination);
          paginationClone[this.paginationKeys.page] += 1;
          dataListClone.push(loadingItem);
          this.pagination = paginationClone;
          this.dataList = dataListClone;
          this.$nextTick(() => {
            this.hanldeGetData(this.inputVal);
          });
        }
      } else {
        // 向上
        return false;
      }
    },
    handleDropdownVisibleChange(open) {
      if (!open) {
        const dataListClone = Array.from(this.dataList);
        const loadingItemIndex = dataListClone.findIndex(
          item => item[this.selectOptionsConfig["value"]].toString() === "-1"
        );
        if (loadingItemIndex !== -1) {
          dataListClone.splice(loadingItemIndex, 1);
        }
        this.isLoading = false;
        this.dataList = dataListClone;
      }
    }
  }
};
</script>
<style lang="less">
.lst-select-pagination {
  .ant-select-dropdown-menu-item {
    text-align: left;
  }
  .icon-search {
    svg {
      transition: none !important;
      transform: none !important;
    }
  }
  .lst-select {
    width: 100%;
  }
  .select-option-text {
    padding-right: 10px;
    color: #bfbfbf;
    &:last-child {
      padding-right: 0;
    }
    &.primary-text {
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
</style>
