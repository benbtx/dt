/**
 * Created by sl on 2020/7/16.
 */
import axios from "../../utils/axios";

//accompany/analysisAccompany 多时空伴随分析
export function getAccompanyData(data) {
    return axios({
        url: "/accompany/analysisAccompany",
        method: "post",
        data: data
    });
}

//accompany/detial 多时空伴随分析-明细
export function getDetialForAccompany(data) {
    return axios({
        url: "/accompany/detial",
        method: "post",
        data: data
    });
}

// //foothold/getType 落脚点类型
// export function getType(query) {
//     return axios({
//         url: "/foothold/getType",
//         method: "get",
//         params: query
//     });
// }
//spatiotemporalAnalysis/getLxByKj 分类-根据空间属性
export function getLxByKj(query) {
    return axios({
        url: "/spatiotemporalAnalysis/getLxByKj",
        method: "get",
        params: query
    });
}

////saxx/getSAObjectByDABH 通过档案编号查询涉案对象
export function getSAObjectByDABH(query) {
    return axios({
        url: "/saxx/getSAObjectByDABH",
        method: "post",
        params: query
    });
}
