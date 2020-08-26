import axios from "../../utils/axios";

// 共同关系模型
export function commonRelationAnalysis(data, method = "post") {
    return axios({
        url: "/common/relation/analysis",
        method: method,
        data: data
    });
}
