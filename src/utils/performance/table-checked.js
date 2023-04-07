// 列表/表格item选中帮助类
// 提供全选、单独选择、切换分页时记录之前所有选中的item
// 引用方式：
// import tableChecked from '@/mixins/table-checked.js'
// mixins: [tableChecked]
// 1. table的selection形式
//   1.1 每次请求数据之前，调用该方法，原因是在当前页改变状态时不会触发 totalCheckedList,
//       因此请求数据之前需要主动触发一次计算全部选择的列表：
//       this.updateTotalListBySelection(this.heroData, this.multipleSelection, unionKey)
//   1.2 请求数据成功后，调用该方法：
//       this.buildMultipleTableSelection(this.heroData, 'multipleTable', unionKey)
//   1.3 执行操作时需要再次调用1.1中的方法，原因是当前页操作选中状态时，不会主动触发计算，因此在最终调用时触发一次即可
//   1.4 执行操作时，将 totalCheckedList 作为全部选择的参数即可
//   1.5 清除全部选择时，将totalCheckedList 和 selectedRows 的值置为空

export default {
  data() {
    return {
      totalCheckedList: [] // 被选中的列表数据
    }
  },
  methods: {
    // 根据 unionKey 构建 target 的 unionId
    // @param target 目标 item
    // @param unionKey 数组，唯一id标识，可能有多个 key
    buildUnionId(target, unionKey) {
      if (target && unionKey && unionKey.length) {
        let unionId = ''
        unionKey.forEach(key => {
          unionId += '-' + target[key] + '-'
        })
        return unionId
      } else {
        return '--'
      }
    },

    // 延迟构建 pageData 的选中状态,必须设置延迟状态，否则会多调用一次 selectionChange 的回调，导致选中状态不对
    // 因为 table 的 checkbox 选中状态是由 multipleTable 自己维护的，选中的item会存入 multipleSelection 中，
    // 因此需要重新构建 pageData 的选中状态
    // @param pageData 当前页 item 列表
    // @param tableRefs 多选 table ref name
    // @param unionKey 统一标识key集合
    // @param callback timeout 执行完毕后，回调函数
    buildTableSelection(pageData, tableRefs, unionKey, callback) {
      setTimeout(() => {
        if (pageData && this.totalCheckedList && this.$refs[tableRefs]) {
          this.$refs[tableRefs].clearSelection()
          pageData.forEach(pageItem => {
            const specItem = this.totalCheckedList.find(totalItem => {
              return this.buildUnionId(pageItem, unionKey) === this.buildUnionId(totalItem, unionKey)
            })
            if (specItem) {
              this.$refs[tableRefs].toggleRowSelection(pageItem, true)
            }
          })
        }
        if (callback && typeof callback === 'function') {
          callback()
        }
      }, 0)
    },

    // 根据 table 多选的状态来计算所有已选的 list
    // @param pageData 当前页 list
    // @param currentSelection 当前页选中的 list
    // @param unionKey 统一标识key集合
    updateTableSelection(pageData, currentSelection, unionKey) {
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.totalCheckedList.length <= 0) {
        this.totalCheckedList = currentSelection
        return
      }

      // 最新选中的列表，全部加入到totalCheckedList中去
      currentSelection.forEach(newSelectedItem => {
        const specPageItem = this.totalCheckedList.find(totalItem => {
          return this.buildUnionId(newSelectedItem, unionKey) === this.buildUnionId(totalItem, unionKey)
        })
        if (!specPageItem) {
          this.totalCheckedList.push(newSelectedItem)
        }
      })

      // 不在最新选中列表中的item，如果之前在totalCheckedList，则需要清除
      pageData.forEach(pageItem => {
        const specNewSelectedItem = currentSelection.find(newSelectedItem => {
          return this.buildUnionId(newSelectedItem, unionKey) === this.buildUnionId(pageItem, unionKey)
        })
        if (!specNewSelectedItem) {
          const removeIndex = this.totalCheckedList.findIndex(totalItem => {
            return this.buildUnionId(totalItem, unionKey) === this.buildUnionId(pageItem, unionKey)
          })
          if (removeIndex !== -1) {
            this.totalCheckedList.splice(removeIndex, 1)
          }
        }
      })
    }
  }
}
