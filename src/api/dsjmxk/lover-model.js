import axios from "../../utils/axios";

// 寻找潜在情人
export function loverPotential(data, method = "post") {
    return axios({
        url: "/lover/potential",
        method: method,
        data: data
    });
}

// 同住详情
export function loverDetailLive(data, method = "post") {
    return axios({
        url: "/lover/detail/live",
        method: method,
        data: data
    });
}

// 同行详情
export function loverDetailTravel(data, method = "post") {
    return axios({
        url: "/lover/detail/travel",
        method: method,
        data: data
    });
}

// 交易异常详情
export function loverDetailTransfer(data, method = "post") {
    return axios({
        url: "/lover/detail/transfer",
        method: method,
        data: data
    });
}
