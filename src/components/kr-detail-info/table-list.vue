<template>
    <div v-kr-loading="tableLoading">
        <!-- 通话异常 -->
        <div v-if="type === '通话异常'">
            <div class="statistic">
                <div class="statistic_icon">
                    <span class="iconfont">&#xe608;</span>
                    <span class="icon">!</span>
                </div>
                <div class="statistic_type">
                    <div
                        v-for="(item, index) in call_type_options"
                        :key="index"
                        class="type_itme"
                    >
                        <p class="type">{{ item }}</p>
                        <p class="number">次</p>
                    </div>
                </div>
            </div>
            <div class="query_select">
                <el-select
                    v-model="callAbnormalForm.callType"
                    clearable
                    placeholder="呼叫类型"
                    style="width: 230px; margin-right: 20px;"
                >
                    <el-option
                        v-for="item in callType_options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-select
                    v-model="callAbnormalForm.abnormalType"
                    clearable
                    placeholder="异常类型"
                    style="width: 230px; margin-right: 20px;"
                >
                    <el-option
                        v-for="item in abnormalType_call"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <div class="block">
                    <el-date-picker
                        v-model="period"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        style="width: 230px; margin-right: 20px;"
                        value-format="yyyyMMdd"
                        @change="deteChange"
                    ></el-date-picker>
                </div>
                <el-button
                    type="primary"
                    icon="el-icon-search "
                    :loading="loading"
                    @click="query"
                    >搜索</el-button
                >
            </div>
        </div>
        <!-- 交易异常 -->
        <div v-if="type === '交易异常'">
            <div class="statistic">
                <div class="statistic_icon">
                    <span class="iconfont">&#xe607;</span>
                    <span class="icon">!</span>
                </div>
                <div class="statistic_type">
                    <div
                        v-for="(item, index) in trading_type_options"
                        :key="index"
                        class="type_itme"
                    >
                        <p class="type">{{ item }}</p>
                        <p class="number">
                            {{
                                index == 0
                                    ? `${specialAmount}次`
                                    : index == 1
                                    ? `${averageAmount}元`
                                    : index == 2
                                    ? `${specialDate}次`
                                    : ""
                            }}
                        </p>
                    </div>
                </div>
            </div>
            <div class="query_select">
                <el-input
                    v-model="transferForm.amount"
                    clearable
                    placeholder="请输入交易金额"
                    class="iput-normal-width"
                    @change="onKeyUp"
                ></el-input>
                <el-select
                    v-model="transferForm.transferType"
                    clearable
                    class="iput-normal-width"
                    style="margin-left: 20px;"
                    placeholder="交易类型"
                >
                    <el-option
                        v-for="item in transferType_options"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value"
                    ></el-option>
                </el-select>
                <el-select
                    v-model="exceptionType"
                    clearable
                    placeholder="异常类型"
                    style="width: 230px; margin-left: 20px;"
                >
                    <el-option
                        v-for="item in exceptionType_trading"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <div class="block">
                    <el-date-picker
                        v-model="period"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions"
                        style="width: 230px; margin-left: 20px;"
                        value-format="yyyyMMdd"
                        @change="deteChange"
                    ></el-date-picker>
                </div>
                <el-time-picker
                    is-range
                    arrow-control
                    v-model="time"
                    range-separator="~"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围"
                    style="width: 230px; margin-left: 20px;"
                    value-format="hh:mm:ss"
                    @change="deteChange"
                ></el-time-picker>
                <el-button
                    type="primary"
                    style="margin-left: 10px;"
                    icon="el-icon-search "
                    @click="query"
                    :loading="loading"
                    >搜索</el-button
                >
            </div>
        </div>
        <kr-table
            :options="tableOptions"
            :total="total"
            :rows="rows"
            :columns="columns"
            :current="current"
            @sort-change="sortChange"
            @on-page-change="onPageChange"
        ></kr-table>
    </div>
</template>
<script>
import {
    colleague,
    live,
    train,
    bus,
    fly,
    transfer,
    family,
    invest
} from "api/zhfx/relation-network";
import {
    loverDetailLive,
    loverDetailTravel,
    loverDetailTransfer
} from "api/dsjmxk/lover-model";
import { columnsList } from "./table_config";

export default {
    name: "table-list",
    props: {
        type: { type: String },
        data: { type: Object, default: () => {} },
        transferAmount: { type: String, default: () => "" },
        date: { type: Array, default: () => [] }
    },
    components: {},
    data() {
        return {
            tableOptions: {
                "max-height": 500
            },
            tableLoading: false,
            loading: false,
            call_type_options: ["主叫通话", "被叫通话", "特殊时段通话"],
            trading_type_options: [
                "特殊金额转账",
                "每月平均净转出金额 ",
                "特殊日期交易"
            ],
            columnsList,
            transferForm: {
                startPeriod: null,
                endPeriod: null,
                transferType: null,
                amount: "",
                startTime: null,
                endTime: null
            },
            callAbnormalForm: {
                callType: "",
                abnormalType: "",
                startTime: "",
                endTime: ""
            },
            exceptionType: "",
            period: "",
            time: "",
            pickerOptions: {
                disabledDate: time => {
                    let start;
                    let end;
                    if (this.date[0]) {
                        start =
                            new Date(
                                this.date[0].replace(
                                    /^(\d{4})(\d{2})(\d{2})$/,
                                    "$1-$2-$3"
                                )
                            ).getTime() -
                            24 * 60 * 60 * 1000;
                        end = new Date(
                            this.date[1].replace(
                                /^(\d{4})(\d{2})(\d{2})$/,
                                "$1-$2-$3"
                            )
                        ).getTime();
                    }
                    return time.getTime() >= end || time.getTime() <= start;
                }
            },
            exceptionType_trading: [
                { value: "1", label: "特殊金额转账" },
                { value: "2", label: "特殊日期交易" }
            ],
            callType_options: [
                { value: "1", label: "主叫" },
                { value: "2", label: "被叫" }
            ],
            transferType_options: [
                { value: "转入", label: "转入" },
                { value: "转出", label: "转出" }
            ],
            abnormalType_call: [
                { value: "1", label: "特殊时段通话" },
                { value: "2", label: "频繁通话" },
                { value: "3", label: "长时间通话" }
            ],
            total: 0,
            pageNum: 0,
            pageSize: 10,
            columns: [],
            current: 1,
            rows: [],
            averageAmount: 0,
            specialAmount: 0,
            specialDate: 0
        };
    },
    computed: {},
    methods: {
        async getExportData() {
            let num = 0,
                size = this.total,
                table;
            switch (this.type) {
                case "同行":
                    table = await loverDetailTravel({
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.idCard,
                        pageSize: size,
                        pageNum: num
                    });
                    break;
                case "通话异常":
                    console.log("通话异常");
                    return;
                case "交易异常":
                    this.transferForm.amount =
                        Number(this.transferForm.amount) || null;
                    this.transferForm.transferType =
                        this.transferForm.transferType || null;
                    table = await loverDetailTransfer({
                        ...this.transferForm,
                        exceptionType: this.exceptionType || null,
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.idCard,
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    });
                    return;
                case "企业主要人员":
                    table = await colleague({
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.targetIdCard,
                        sourceNodeId: this.data.sourceNodeId,
                        targetNodeId: this.data.targetNodeId,
                        pageSize: size,
                        pageNum: num
                    });
                    break;
                case "同住":
                    if (this.data.sourceNodeId && this.data.targetNodeId) {
                        table = await live({
                            dabh: this.$route.query.dabh,
                            isMultipleCases: this.$route.query.isMultipleCases,
                            dwbm: this.$route.query.dwbm,
                            sourceIdCard: this.data.sourceIdCard,
                            targetIdCard: this.data.targetIdCard,
                            sourceNodeId: this.data.sourceNodeId,
                            targetNodeId: this.data.targetNodeId,
                            pageSize: size,
                            pageNum: num
                        });
                    } else {
                        table = await loverDetailLive({
                            dabh: this.$route.query.dabh,
                            isMultipleCases: this.$route.query.isMultipleCases,
                            dwbm: this.$route.query.dwbm,
                            sourceIdCard: this.data.sourceIdCard,
                            targetIdCard: this.data.idCard,
                            pageSize: size,
                            pageNum: num
                        });
                    }
                    break;
                case "同行-火车":
                    table = await train({
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.targetIdCard,
                        sourceNodeId: this.data.sourceNodeId,
                        targetNodeId: this.data.targetNodeId,
                        pageSize: size,
                        pageNum: num
                    });
                    break;
                case "银行卡转账":
                    table = await transfer({
                        amount:
                            this.transferAmount ||
                            this.data.amountCondition ||
                            null,
                        startTime: this.date[0],
                        endTime: this.date[1],
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.targetIdCard,
                        sourceNodeId: this.data.sourceNodeId,
                        targetNodeId: this.data.targetNodeId,
                        pageSize: size,
                        pageNum: num
                    });
                    break;
                case "交易记录":
                    table = await transfer({
                        amount: this.transferAmount || null,
                        startTime: this.date[0],
                        endTime: this.date[1],
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.targetIdCard,
                        pageSize: size,
                        pageNum: num
                    });
                    break;
                case "同行-大巴":
                    table = await bus({
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.targetIdCard,
                        sourceNodeId: this.data.sourceNodeId,
                        targetNodeId: this.data.targetNodeId,
                        pageSize: size,
                        pageNum: num
                    });
                    break;
                case "同户":
                    table = await family({
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.targetIdCard,
                        sourceNodeId: this.data.sourceNodeId,
                        targetNodeId: this.data.targetNodeId,
                        pageSize: size,
                        pageNum: num
                    });
                    break;
                case "同行-飞机":
                    table = await fly({
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.targetIdCard,
                        sourceNodeId: this.data.sourceNodeId,
                        targetNodeId: this.data.targetNodeId,
                        pageSize: size,
                        pageNum: num
                    });
                    break;
                case "投资":
                    table = await invest({
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.targetIdCard,
                        sourceNodeId: this.data.sourceNodeId,
                        targetNodeId: this.data.targetNodeId,
                        pageSize: size,
                        pageNum: num
                    });
                    break;
                default:
                    break;
            }
            return table.data.rows;
        },
        sortChange({ prop, order }) {
            if (this.type === "交易异常")
                this.transferForm.amount =
                    Number(this.transferForm.amount) || null;
            this.transferForm.transferType =
                this.transferForm.transferType || null;
            loverDetailTransfer({
                ...this.transferForm,
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                sourceIdCard: this.data.sourceIdCard,
                targetIdCard: this.data.idCard,
                sortName: prop,
                sortRule: order.replace("ending", ""),
                pageSize: this.pageSize,
                pageNum: this.pageNum
            }).then(res => {
                if (res.data) {
                    this.rows = this.filterData(res.data.itemVOResultPage.rows);
                    this.total = res.data.itemVOResultPage.total;
                    this.tableLoading = false;
                }
            });
        },
        query() {
            this.loading = true;
            if (this.type == "通话异常") {
                console.log(this.callAbnormalForm);
                return;
            }
            this.pageNum = 0;
            this.current = 1;
            this.getDimensionInfo(this.type);
        },
        deteChange() {
            if (this.time) {
                this.transferForm.startPeriod = this.time[0];
                this.transferForm.endPeriod = this.time[1];
            } else {
                this.transferForm.startPeriod = null;
                this.transferForm.endPeriod = null;
            }
            if (this.period) {
                this.transferForm.startTime = this.period[0];
                this.transferForm.endTime = this.period[1];
                if (this.type == "通话异常") {
                    this.callAbnormalForm.startTime = this.period[0];
                    this.callAbnormalForm.endTime = this.period[1];
                } else {
                    this.callAbnormalForm.startTime = null;
                    this.callAbnormalForm.endTime = null;
                }
            } else {
                this.transferForm.startTime = null;
                this.transferForm.endTime = null;
            }
        },
        onPageChange(pageNum, pageSize) {
            this.current = pageNum;
            this.pageNum = pageNum - 1;
            this.pageSize = pageSize;
            this.getDimensionInfo(this.type);
        },
        onKeyUp() {
            this.transferForm.amount = this.transferForm.amount.replace(
                /[^\d.]/g,
                ""
            );
        },
        filterData(data) {
            data.map(row => {
                for (const key in row) {
                    if (row.hasOwnProperty(key)) {
                        row[key] =
                            row[key] != null && row[key] != "null"
                                ? row[key]
                                : "";
                    }
                }
                row["sex"] = row["sex"] === "1" ? "男" : "女";
                row["otherSex"] = row["otherSex"] === "1" ? "男" : "女";
                return row;
            });
            return data;
        },
        getDimensionInfo(key) {
            this.tableLoading = true;
            switch (key) {
                case "同行":
                    loverDetailTravel({
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.idCard,
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    }).then(res => {
                        if (res.data) {
                            let { rows = [], total = 0 } = res.data;
                            this.rows = this.filterData(rows);
                            this.total = total;
                        }
                        this.tableLoading = false;
                    });
                    return;
                case "通话异常":
                    console.log("通话异常");
                    return;
                case "交易异常":
                    this.transferForm.amount =
                        Number(this.transferForm.amount) || null;
                    this.transferForm.transferType =
                        this.transferForm.transferType || null;
                    loverDetailTransfer({
                        ...this.transferForm,
                        exceptionType: this.exceptionType || null,
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.idCard,
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    }).then(res => {
                        if (res.data) {
                            let {
                                rows = [],
                                total = 0
                            } = res.data.itemVOResultPage;
                            this.averageAmount = res.data.averageAmount;
                            this.specialAmount = res.data.specialAmount;
                            this.specialDate = res.data.specialDate;
                            this.rows = this.filterData(rows);
                            this.total = total;
                        } else {
                            this.rows = [];
                            this.total = 0;
                        }
                        this.loading = false;
                        this.tableLoading = false;
                    });
                    return;
                case "企业主要人员":
                    colleague({
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.targetIdCard,
                        sourceNodeId: this.data.sourceNodeId,
                        targetNodeId: this.data.targetNodeId,
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    }).then(res => {
                        if (res.data) {
                            let { rows = [], total = 0 } = res.data;
                            this.rows = this.filterData(rows);
                            this.total = total;
                        }
                        this.tableLoading = false;
                    });
                    return;
                case "同住":
                    if (this.data.sourceNodeId && this.data.targetNodeId) {
                        live({
                            dabh: this.$route.query.dabh,
                            isMultipleCases: this.$route.query.isMultipleCases,
                            dwbm: this.$route.query.dwbm,
                            sourceIdCard: this.data.sourceIdCard,
                            targetIdCard: this.data.targetIdCard,
                            sourceNodeId: this.data.sourceNodeId,
                            targetNodeId: this.data.targetNodeId,
                            pageSize: this.pageSize,
                            pageNum: this.pageNum
                        }).then(res => {
                            if (res.data) {
                                let { rows = [], total = 0 } = res.data;
                                this.rows = this.filterData(rows);
                                this.total = total;
                            }
                            this.tableLoading = false;
                        });
                    } else {
                        loverDetailLive({
                            dabh: this.$route.query.dabh,
                            isMultipleCases: this.$route.query.isMultipleCases,
                            dwbm: this.$route.query.dwbm,
                            sourceIdCard: this.data.sourceIdCard,
                            targetIdCard: this.data.idCard,
                            pageSize: this.pageSize,
                            pageNum: this.pageNum
                        }).then(res => {
                            if (res.data) {
                                let { rows = [], total = 0 } = res.data;
                                this.rows = this.filterData(rows);
                                this.total = total;
                            }
                            this.tableLoading = false;
                        });
                    }
                    return;
                case "同行-火车":
                    train({
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.targetIdCard,
                        sourceNodeId: this.data.sourceNodeId,
                        targetNodeId: this.data.targetNodeId,
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    }).then(res => {
                        if (res.data) {
                            let { rows = [], total = 0 } = res.data;
                            this.rows = this.filterData(rows);
                            this.total = total;
                        }
                        this.tableLoading = false;
                    });
                    return;
                case "银行卡转账":
                    transfer({
                        amount:
                            this.transferAmount ||
                            this.data.amountCondition ||
                            null,
                        startTime: this.date[0],
                        endTime: this.date[1],
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.targetIdCard,
                        sourceNodeId: this.data.sourceNodeId,
                        targetNodeId: this.data.targetNodeId,
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    }).then(res => {
                        if (res.data) {
                            let { rows = [], total = 0 } = res.data;
                            this.rows = this.filterData(rows);
                            this.total = total;
                        }
                        this.loading = false;
                        this.tableLoading = false;
                    });
                    return;
                case "交易记录":
                    transfer({
                        amount: this.transferAmount || null,
                        startTime: this.date[0],
                        endTime: this.date[1],
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.targetIdCard,
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    }).then(res => {
                        if (res.data) {
                            let { rows = [], total = 0 } = res.data;
                            this.rows = this.filterData(rows);
                            this.total = total;
                        }
                        this.loading = false;
                        this.tableLoading = false;
                    });
                    return;
                case "同行-大巴":
                    bus({
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.targetIdCard,
                        sourceNodeId: this.data.sourceNodeId,
                        targetNodeId: this.data.targetNodeId,
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    }).then(res => {
                        if (res.data) {
                            let { rows = [], total = 0 } = res.data;
                            this.rows = this.filterData(rows);
                            this.total = total;
                        }
                        this.tableLoading = false;
                    });
                    return;
                case "同户":
                    family({
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.targetIdCard,
                        sourceNodeId: this.data.sourceNodeId,
                        targetNodeId: this.data.targetNodeId,
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    }).then(res => {
                        if (res.data) {
                            let { rows = [], total = 0 } = res.data;
                            this.rows = this.filterData(rows);
                            this.total = total;
                        }
                        this.tableLoading = false;
                    });
                    return;
                case "同行-飞机":
                    fly({
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.targetIdCard,
                        sourceNodeId: this.data.sourceNodeId,
                        targetNodeId: this.data.targetNodeId,
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    }).then(res => {
                        if (res.data) {
                            let { rows = [], total = 0 } = res.data;
                            this.rows = this.filterData(rows);
                            this.total = total;
                        }
                        this.tableLoading = false;
                    });
                    return;
                case "投资":
                    invest({
                        dabh: this.$route.query.dabh,
                        isMultipleCases: this.$route.query.isMultipleCases,
                        dwbm: this.$route.query.dwbm,
                        sourceIdCard: this.data.sourceIdCard,
                        targetIdCard: this.data.targetIdCard,
                        sourceNodeId: this.data.sourceNodeId,
                        targetNodeId: this.data.targetNodeId,
                        pageSize: this.pageSize,
                        pageNum: this.pageNum
                    }).then(res => {
                        if (res.data) {
                            let { rows = [], total = 0 } = res.data;
                            this.rows = this.filterData(rows);
                            this.total = total;
                        }
                        this.tableLoading = false;
                    });
                    return;
                default:
                    return;
            }
        }
    },
    created() {
        this.getDimensionInfo(this.type);
        this.tableOptions["max-height"] = document.body.offsetHeight - 350;
    },
    mounted() {
        this.columnsList.map(value => {
            if (value.type == this.type) {
                this.columns = value.columns;
            }
        });
    },

    beforeDestroy() {}
};
</script>
<style lang="scss" scoped>
@import "@/styles/basic-color.scss";
.query_select {
    display: flex;
}

.statistic {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #e3e6f8;
    border-left: 3px solid $color-primary;
    height: 90px;
    margin-bottom: 20px;
    padding-left: 20px;

    .statistic_icon {
        text-align: center;
        line-height: 56px;
        width: 62px;
        height: 56px;
        background-color: #e7f3ff;
        .iconfont {
            font-size: 32px;
            color: $color-primary;
        }
        .icon {
            font-size: 32px;
            color: $color-primary;
        }
    }
    .statistic_type {
        display: flex;
        .type_itme {
            padding: 0 20px 0 50px;
            .type {
                color: rgba(0, 0, 0, 0.427450980392157);
                font-weight: 400;
                font-style: normal;
                line-height: 22px;
            }
            .number {
                font-size: 20px;
                color: rgba(0, 0, 0, 0.847058823529412);
                line-height: 38px;
                text-align: right;
            }
        }
    }
}
</style>
