import "babel-polyfill"; // 解决Ie9
import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import "./element";
import * as filters from "./filtres/index"; // 全局过滤器
import dayjs from "dayjs";
import {
    getLastMonthYestdy,
    getLastThreeMonthYestdy,
    getLastSixMonthYestdy,
    getLastYearYestdy
} from "@/utils/time.js";

import "./plugin/component";

import "element-ui/lib/theme-chalk/index.css";
import "./assets/icons/iconfont.css";

// 注册全局实用程序过滤器（register global utility filters）.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});
Vue.prototype.$dayjs = dayjs;

Vue.prototype.$pickerOptions = {
    shortcuts: [
        {
            text: "最近一周",
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
            }
        },
        {
            text: "最近一个月",
            onClick(picker) {
                const times = getLastMonthYestdy(new Date()).reverse();
                picker.$emit("pick", times);
            }
        },
        {
            text: "最近三个月",
            onClick(picker) {
                const times = getLastSixMonthYestdy(new Date()).reverse();
                picker.$emit("pick", times);
            }
        },
        {
            text: "最近半年",
            onClick(picker) {
                const times = getLastThreeMonthYestdy(new Date()).reverse();
                picker.$emit("pick", times);
            }
        },
        {
            text: "最近一年",
            onClick(picker) {
                const times = getLastYearYestdy(new Date()).reverse();
                picker.$emit("pick", times);
            }
        }
    ]
};

Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
