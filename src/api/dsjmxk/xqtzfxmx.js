import axios from "../../utils/axios";

// 洗钱特征分析
export function launderingAnalysis(data, method = "post") {
    return axios({
        url: "/laundering/analysis",
        method: method,
        data: data
    });
}
