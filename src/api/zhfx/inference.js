import axios from "../../utils/axios";

// 各维度可关联对象数
export function inferenceAssociation(data, method = "post") {
    return axios({
        url: "/inference/association",
        method,
        data
    });
}

// 研判推演
export function inferenceQuery(data, method = "post") {
    return axios({
        url: "/inference/query",
        method,
        data
    });
}

// 刷新推演
export function inferenceRefresh(data, method = "post") {
    return axios({
        url: "/inference/refresh",
        method,
        data
    });
}
