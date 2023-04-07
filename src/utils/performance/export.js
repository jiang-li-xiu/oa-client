/*
 * @Author: Yelucc
 * @Date: 2021-04-10 11:24:59
 * @LastEditors: Yelucc
 * @LastEditTime: 2021-04-10 12:01:22
 * @Description: 导出
 */

import XLSX from "xlsx"
import FileSaver from "file-saver"
/**
 * 默认导出
 */
export function defaultJsonExport(data,name){
    let ws = XLSX.utils.json_to_sheet(data)
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb,ws,"Sheet1")
    let wbfile = XLSX.write(wb,{ bookType: 'xlsx', bookSST: true, type: 'array' })
    FileSaver.saveAs(new Blob([wbfile],{type: 'application/octet-stream'}),name+".xlsx")
}
