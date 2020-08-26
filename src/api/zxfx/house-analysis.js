import axios from "../../utils/axios";

// 房产分析
export function houseAnalysis(data, method = "post") {
    return axios({
        url: "/house/analysis",
        method: method,
        data: data
    });
}

// 房产分析统计信息
export function houseStaticsAnalysis(data, method = "post") {
    return axios({
        url: "/house/statics",
        method: method,
        data: data
    });
}
