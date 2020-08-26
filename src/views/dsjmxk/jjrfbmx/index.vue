<template>
    <imp-panel ref="impPanel" id="box">
        <!--见被注释的代码-->
        <collapse-tool-page
            ref="collapsetoolpage"
            :prop_tags="allTagText"
            @handleClose="handleConditionClose"
            @resetFilter="resetCondition"
            @startAnalysis="doFilter"
        >
            <div slot="conditions" class="conditions">
                <kr-section-title
                    title="节假日选择"
                    :size="18"
                ></kr-section-title>
                <div class="checkbox-group">
                    <el-checkbox
                        :indeterminate="checkBox.isIndeterminate"
                        v-model="checkBox.checkAll"
                        @change="handleCheckAllChange"
                        >全选</el-checkbox
                    >
                    <el-checkbox-group
                        v-model="conditions.holiday"
                        @change="handleCheckedHolidayChange"
                    >
                        <el-checkbox
                            v-for="(item, index) in holidayOptions"
                            :label="item"
                            :key="index"
                            >{{ item }}</el-checkbox
                        >
                    </el-checkbox-group>
                </div>
                <div class="daySet">
                    重要节日前后时间设置： <span class="label">节日前</span>
                    <el-select
                        filterable
                        allow-create
                        size="small"
                        @change="formChange"
                        v-model.number="conditions.before"
                    >
                        <el-option label="0天`" value=""></el-option>
                        <el-option
                            v-for="day of [1, 2, 3, 4, 5, 6]"
                            :key="day"
                            :label="`${day}天`"
                            :value="day"
                        ></el-option> </el-select
                    ><span class="label">节日后</span>
                    <el-select
                        filterable
                        allow-create
                        size="small"
                        @change="formChange"
                        v-model.number="conditions.after"
                    >
                        <el-option
                            v-for="day of [0, 1, 2, 3, 4, 5, 6]"
                            :key="day"
                            :label="`${day}天`"
                            :value="day"
                        ></el-option>
                    </el-select>
                </div>
                <kr-section-title
                    title="交易金额选择"
                    :size="18"
                ></kr-section-title>
                <div class="dealAmount">
                    <el-radio
                        v-model="conditions.amount"
                        v-for="(opt, i) of amountOptions"
                        :key="i"
                        :label="opt.value"
                        @change="amountRangeChange"
                        size="small"
                        >{{ opt.text }}</el-radio
                    >
                    <el-radio v-model="conditions.amount" size="small" label=""
                        >自定义金额
                        <el-input
                            placeholder="最低"
                            style="width:100px;margin-left:6px"
                            size="small"
                            @change="formChange"
                            v-model="conditions.minAmount"
                        ></el-input>
                        <span style="color:#DCDFE6">——</span>
                        <el-input
                            placeholder="最高"
                            style="width:100px;"
                            size="small"
                            @change="formChange"
                            v-model="conditions.maxAmount"
                        ></el-input>
                    </el-radio>
                </div>
            </div>
            <div slot="content">
                <kr-no-data
                    style="height: calc(100vh - 240px);"
                    v-show="!searchConditions.idCard || !allRows.length"
                    :text="boneText"
                >
                    <!-- 没执行查询时，显示该组件 -->
                </kr-no-data>
                <div
                    class="contentArear"
                    v-show="searchConditions.idCard && allRows.length"
                >
                    <div class="toolBar">
                        <div>
                            <el-button-group style="margin-left:14px">
                                <el-button
                                    :type="showScatter ? 'primary' : ''"
                                    size="small"
                                    @click="showScatter = true"
                                    >散点图</el-button
                                >
                                <el-button
                                    @click="showScatter = false"
                                    :type="showScatter ? '' : 'primary'"
                                    size="small"
                                    >柱形图</el-button
                                >
                            </el-button-group>
                            <el-date-picker
                                style="margin-left:14px"
                                size="small"
                                type="daterange"
                                range-separator="~"
                                :picker-options="$pickerOptions"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyyMMdd"
                                format="yyyy-MM-dd"
                                v-model="conditions.dateRange"
                                @change="formChange(), doFilter()"
                            ></el-date-picker>
                        </div>
                        <kr-export
                            style="margin-right:14px;"
                            buttonType="primary"
                            buttonSize="small"
                            title="导出"
                            :fileName="exportFileName"
                            :exportConfig="exportMulConfig"
                        ></kr-export>
                    </div>
                    <div style="padding:14px;box-sizing:border-box;">
                        <el-scrollbar
                            id="el-scrollbar"
                            slot="body"
                            style="height: calc(100vh - 230px);"
                            wrap-style="overflow-x: hidden;"
                        >
                            <div v-loading="loading">
                                <scatter-graph
                                    v-if="showScatter"
                                    :scatterDatas="scatterList"
                                    ref="scatterGrapg"
                                />
                                <bar-graph
                                    v-if="!showScatter"
                                    :barData="barData"
                                ></bar-graph>
                            </div>
                            {{ total }}
                            <kr-table
                                v-loading="loading"
                                :total="total"
                                :rows="rows"
                                :columns="columns"
                                :current="current"
                                @on-page-change="onPageChange"
                                @sort-change="sortChange"
                            ></kr-table>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
        </collapse-tool-page>

        <kr-choose
            ref="personChoose"
            @startAnalysis="startAnalysis($event)"
            @clearAll="reset"
            :all="allPerson"
            slot="aside"
            :isPerson="true"
            :isCheckbox="false"
            :hsaRadio="false"
            warnTitle
        ></kr-choose>
    </imp-panel>
</template>
;
<script>
// 静态配置
import { columns, exportConfig, amountOptions } from "./config";
// api
import { fetchHolidays, fetchTransferDataList } from "@/api/dsjmxk/jjrfbmx.js";
import { getSAObjectByDABH } from "api/zhfx/relation-network.js";
// components
import scatterGraph from "./component/scatter-graph";
import barGraph from "./component/bar-graph";
export default {
    components: {
        scatterGraph,
        barGraph
    },
    props: {},
    data() {
        return {
            showScatter: true, // 展示散点图或者柱状图
            showForm: true, // 展示条件表单
            exportFileName: "节假日贪腐数据列表",
            loading: false,
            allPerson: [],
            conditions: {
                amount: "",
                holiday: [],
                dateRange: [],
                before: 0,
                after: 0,
                minAmount: null,
                maxAmount: null
            },
            checkBox: {
                checkAll: false,
                checkedItems: [],
                isIndeterminate: false
            },
            searchConditions: {}, // 实际请求用到的参数
            conditionsTags: [], // tag所使用的条件，方便调控tag双向绑定
            rules: {},
            holidayOptions: [],
            amountOptions,
            columns,
            allRows: [],
            scatterList: [],
            barData: [],
            total: 20,
            current: 1,
            pageSize: 10,
            sortName: null,
            sortRule: null
        };
    },
    watch: {},
    computed: {
        boneText() {
            if (!this.searchConditions.idCard) {
                return "请选择一个对象开始分析并查看结果！";
            } else if (!this.allRows.length) {
                return "未查询到数据！";
            }
        },
        rows() {
            let { current, pageSize } = this;
            let start = (current - 1) * pageSize;
            let end = current * this.pageSize;
            return this.allRows.slice(start, end);
        },
        allTagText() {
            return this.conditionsTags.map(item => item.text);
        }
    },
    created() {
        getSAObjectByDABH(this.$route.query).then(res => {
            if (res.code === 0) {
                this.allPerson = res.data;
            }
        });
        fetchHolidays().then(res => {
            if (res.code === 0) {
                this.holidayOptions = res.data;
            }
        });
    },
    mounted() {},
    methods: {
        exportMulConfig() {
            let { exportAllData: fnGetData } = this;
            return [{ config: exportConfig, fnGetData }];
        },
        reset() {
            // 重置页面条件及数据
            this.searchConditions = {};
            this.conditionsCHN = [];
            this.allRows = [];
        },
        doFilter() {
            this.$refs.personChoose.handleClick();
        },
        // checkbox
        handleCheckAllChange(val) {
            this.conditions.holiday = val
                ? this.holidayOptions.map(item => item)
                : [];
            this.checkBox.isIndeterminate = false;
            this.formChange();
        },
        handleCheckedHolidayChange(value) {
            let checkedCount = value.length;
            this.checkBox.checkAll =
                checkedCount === this.holidayOptions.length;
            this.checkBox.isIndeterminate =
                checkedCount > 0 && checkedCount < this.holidayOptions.length;
            this.formChange();
        },
        // checkbox end
        // 分析条件的tag
        formChange() {
            let CHN = {
                minAmount: "最低金额",
                maxAmount: "最高金额",
                holiday: "节假日",
                dateRange: "日期区间",
                before: "节日前",
                after: "节日后"
            };
            let arr = [];
            Object.entries(this.conditions).map(entries => {
                let [key, value] = entries;
                if (CHN[key] && value) {
                    if (key === "dateRange" && value && value.length) {
                        arr.push({
                            key,
                            value,
                            text: CHN[key] + ":" + value.join("~")
                        });
                    } else if (key === "holiday" && value && value.length) {
                        value.map(item => {
                            arr.push({
                                key,
                                value: item,
                                text: CHN[key] + ":" + item
                            });
                        });
                    } else if (key === "before" || key === "after") {
                        arr.push({
                            key,
                            value,
                            text: CHN[key] + ":" + value + "天"
                        });
                    } else if (key === "minAmount" || key === "maxAmount") {
                        arr.push({
                            key,
                            value,
                            text: CHN[key] + ":" + value
                        });
                    }
                }
            });
            this.conditionsTags = arr;
        },
        // 分析条件的tag end
        amountRangeChange(valueStr) {
            let [minAmount, maxAmount] = valueStr.split("-");
            this.conditions.minAmount = minAmount;
            this.conditions.maxAmount = maxAmount;
            this.formChange();
            this.doFilter();
        },
        async exportAllData() {
            let name = this.$refs.personChoose.checkedPersons.mc;
            this.exportFileName = name + "-节假日贪腐数据列表";
            return this.allRows;
        },
        handleConditionClose({ tag }) {
            let aimObj = this.conditionsTags.find(item => item.text === tag);
            if (aimObj) {
                let { key, value } = aimObj;
                if (key === "holiday") {
                    let index = this.conditions.holiday.findIndex(
                        item => item === value
                    );
                    this.conditions.holiday.splice(index, 1);
                } else if (key === "dateRange") {
                    this.conditions.dateRange = [];
                } else {
                    this.conditions[key] = "";
                }
            }
            this.formChange();
            this.doFilter();
        },
        resetCondition() {},
        async startAnalysis(person) {
            if (!person.zjhm) {
                return this.$message.error("请先选择一个对象再执行分析！");
            }
            let { zjhm: idCard } = person;
            let {
                holiday,
                minAmount,
                maxAmount,
                dateRange,
                before,
                after
            } = this.conditions;
            // eslint-disable-next-line no-useless-escape
            let numReg = new RegExp(/^(\-|\+)?\d+(\.\d+)?$/); // 允许输入小数
            let regMin = !(numReg.test(minAmount) || !minAmount);
            let regMax = !(numReg.test(maxAmount) || !maxAmount);
            if (
                // 校验最大金额和最小金额，合法输入为空字符串或者数字
                // 非法则报错并阻塞
                regMin ||
                regMax
            ) {
                return this.$message.error("交易金额必须为数字！");
            }
            let [startTime, endTime] = dateRange;
            let conditions = {
                idCard,
                minAmount,
                maxAmount,
                holiday,
                period: [before || 0, after || 0].join("-"),
                startTime,
                endTime,
                ...this.$route.query
            };
            this.loading = true;
            let result = await fetchTransferDataList(conditions);
            this.searchConditions = { ...conditions };
            if (result && result.code === 0) {
                let rows = result.data || [];
                this.solveData(rows);
                this.showForm = false;
            }
            this.loading = false;
        },
        solveData(rows = []) {
            // 数据处理
            let barData = [];
            let allRows = [];
            let scatterList = [];
            rows.map(row => {
                let {
                    date,
                    transferItems,
                    isWorkday,
                    holidayTag,
                    transferInput,
                    transferOutput
                } = row;
                date = isWorkday ? date : `${date}(${holidayTag})`;
                if (transferInput || transferOutput) {
                    barData.push({
                        date: date,
                        name: "转入",
                        amount: transferInput
                    });
                    barData.push({
                        date: date,
                        name: "转出",
                        amount: transferOutput
                    });
                }

                if (transferItems && transferItems.length) {
                    transferItems.map(detail => {
                        let {
                            je: radius,
                            jysj: tradeTime,
                            jydfkh,
                            jydfxm,
                            cxkh
                        } = detail;
                        let FIXEDJE =
                            detail.jylx === "转入" ? detail.je : 0 - detail.je;
                        allRows.push({ ...detail, date, FIXEDJE });
                        scatterList.push({
                            YAxis: FIXEDJE,
                            XAxis: date,
                            radius,
                            tradeTime,
                            jydfkh,
                            jydfxm,
                            cxkh
                        });
                    });
                }
            });
            this.allRows = allRows;
            this.scatterList = scatterList;
            this.barData = barData;
            this.total = this.allRows.length;
        },
        sortChange({ prop, order }) {
            this.sortName = prop;
            this.sortRule = order === "ascending" ? "ASC" : "DESC";
            this.allRows.sort((a, b) => {
                if (prop === "jysj") {
                    let t1 = new Date(a[prop]).getTime();
                    let t2 = new Date(b[prop]).getTime();
                    return order === "ascending" ? t1 - t2 : t2 - t1;
                }
                return order === "ascending"
                    ? a[prop] - b[prop]
                    : b[prop] - a[prop];
            });
        },
        onPageChange(current, pageSize) {
            this.current = current;
            this.pageSize = pageSize;
        }
    }
};
</script>
<style lang="scss" scoped>
.jjrfbmx {
}
#header {
    line-height: 40px;
    .header-title {
        border-radius: 3px;
        border: 1px solid #e1e1e1;
        border-left: 4px solid #409eff;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        .el-button {
            margin-right: 14px;
        }
    }
}
.conditions {
    .dealAmount,
    .checkbox-group,
    .daySet {
        box-sizing: border-box;
        padding-left: 14px;
        margin-bottom: 8px;
    }
    .daySet {
        span.label {
            margin-right: 8px;
            margin-left: 22px;
        }
        .el-select {
            width: 100px;
        }
    }
    .dealAmount {
        margin-top: 14px;
    }
}

.checkbox-group {
    display: flex;
    margin-top: 14px;
    .el-checkbox {
        margin-right: 14px;
        margin-bottom: 14px;
    }
}

.toolBar {
    margin-top: 14px;
    margin-right: 14px;
    display: flex;
    justify-content: space-between;
}
</style>
