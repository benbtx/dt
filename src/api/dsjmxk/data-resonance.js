/**
 * Created by sl on 2020/7/16.
 */
import axios from "../../utils/axios";

//resonance/analysisResonance 共振分析 数据共振分析
export function getResonanceData(data) {
    return axios({
        url: "/resonance/analysisResonance",
        method: "post",
        data: data
    });
}

//accompany/detial 数据共振分析-明细
export function getDetialForResonance(data) {
    return axios({
        url: "/accompany/detial",
        method: "post",
        data: data
    });
}
