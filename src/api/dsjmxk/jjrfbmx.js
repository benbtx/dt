/**
 * @file 节假日腐败模型涉及的接口
 */
import axios from "../../utils/axios";

// 获取节假日列表
export function fetchHolidays() {
    return axios({
        url: "/holiday/corruption/holidays",
        method: "get"
    });
}
// 获取转入转出数据
export function fetchTransferDataList(params) {
    return axios({
        url: "/holiday/corruption/transfer",
        method: "post",
        data: params
    });
}
