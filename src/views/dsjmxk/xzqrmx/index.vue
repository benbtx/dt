<template>
    <imp-panel>
        <div v-if="showVenn" style="height:100%" slot="body">
            <div class="header">
                <div class="suspiciousLevel">
                    <el-select
                        v-model="suspiciousLevel"
                        placeholder="可疑程度"
                        clearable
                    >
                        <el-option
                            v-for="item in suspiciousLevelArr"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div style="width:106px">
                    <el-select v-model="gender" placeholder="性别" clearable>
                        <el-option
                            v-for="item in genderArr"
                            :key="item.label"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </div>
                <div style="width: 221px">
                    <el-date-picker
                        v-model="period"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        style="width: 230px; margin-right: 20px;"
                        value-format="yyyyMMdd"
                        :picker-options="$pickerOptions"
                        @change="deteChange"
                    ></el-date-picker>
                </div>
                <div>
                    <el-button type="primary" @click="query"
                        ><span class="el-icon-search"></span>搜索</el-button
                    >
                </div>
                <div class="print">
                    <!-- <el-button type="primary" size="mini">打印</el-button>
                    <el-button size="mini">导出</el-button> -->
                    <kr-export
                        buttonType="primary"
                        :exportConfig="exportMulConfig"
                        :fileName="fileName"
                    ></kr-export>
                </div>
            </div>
            <div class="content" v-kr-loading="isLoading">
                <div class="mywrapper">
                    <div class="vennWrapper">
                        <highcharts :options="chartOptions"></highcharts>
                    </div>
                    <div class="mylabel">
                        <div
                            class="dot"
                            v-for="item in labelData"
                            :key="item.color"
                        >
                            <b :style="{ backgroundColor: item.color }"></b
                            >{{ item.text }}<span>{{ item.count }}人</span>
                        </div>
                        <div class="warnWrapper" style="width: 396px">
                            <el-alert type="warning">
                                <div class="warnPaddin">
                                    通话异常：特殊时段通话，频繁通话，单向通话，首尾通话
                                </div>
                                <div class="warnPaddin">
                                    交易异常：特殊金额交易，特殊节日交易，单向固定金额交易
                                </div>
                                <div class="warnPaddin">
                                    同行同住：一起出行或一起住宿
                                </div>
                            </el-alert>
                        </div>
                    </div>
                </div>
                <div>
                    <kr-table
                        :total="total"
                        :rows="rows"
                        :columns="columns"
                        :current="current"
                        @on-page-change="onPageChange"
                        @sort-change="sortChange"
                    ></kr-table>
                </div>
            </div>
            <kr-detail-info ref="detailInfo" :row="row" :date="date" />
        </div>
        <kr-no-data v-else />
        <kr-choose
            :isPerson="true"
            @startAnalysis="startAnalysis"
            :isCheckbox="false"
            :btnLoading="btnLoading"
            :hsaRadio="false"
            warnTitle
            :all="all"
            slot="aside"
            @clearAll="showVenn = false"
        ></kr-choose>
    </imp-panel>
</template>

<script type="text/babel">
import { searchLoverkRelationConfig } from "@/components/kr-excel-export/export.config.js";
import Highcharts from "highcharts";
import exportingInit from "highcharts/modules/exporting";
import venn from "highcharts/modules/venn";
venn(Highcharts);
exportingInit(Highcharts);
const WARNLEVEL1 = "#F14865";
const WARNLEVEL2 = "#FF9900";
const WARNLEVEL3 = "#FEDB69";
const WARNLEVEL4 = "#FFFFCC";
const WARNLEVEL5 = "#F1F2F6";
import { getSAObjectByDABH } from "api/zhfx/relation-network.js";
import { loverPotential } from "api/dsjmxk/lover-model";
export default {
    data() {
        const $shelf = this;
        return {
            btnLoading: false,
            fileName: "",
            all: [],
            showVenn: false,
            isLoading: false,
            period: "",
            date: [],
            suspiciousLevel: "",
            suspiciousLevelArr: [
                { label: "一级", value: 1 },
                { label: "二级", value: 2 },
                { label: "三级", value: 3 },
                { label: "四级", value: 4 },
                { label: "五级", value: 5 }
            ],
            vennData: {},
            labelData: {},
            gender: "",
            genderArr: [
                { label: "男", value: 1 },
                { label: "女", value: 2 }
            ],

            rows: [],
            total: 10,
            columns: [
                {
                    title: "可疑程度",
                    key: "suspiciousLevel",
                    sortable: "custom",
                    width: 120,
                    component: {
                        render(h, row) {
                            let level = "";
                            switch (row.suspiciousLevel) {
                                case 1:
                                    level = "一级";
                                    return (
                                        <button class="suspiciou_level_1">
                                            {level}
                                        </button>
                                    );
                                case 2:
                                    level = "二级";
                                    return (
                                        <button class="suspiciou_level_2">
                                            {level}
                                        </button>
                                    );
                                case 3:
                                    level = "三级";
                                    return (
                                        <button class="suspiciou_level_3">
                                            {level}
                                        </button>
                                    );
                                case 4:
                                    level = "四级";
                                    return (
                                        <button class="suspiciou_level_4">
                                            {level}
                                        </button>
                                    );
                                case 5:
                                    level = "五级";
                                    return (
                                        <button class="suspiciou_level_5">
                                            {level}
                                        </button>
                                    );
                            }
                        }
                    }
                },
                { title: "姓名", key: "name", width: 140 },
                { title: "性别", key: "sex", width: 50 },
                { title: "身份证号", key: "idCard", width: 170 },
                { title: "可疑记录", key: "suspiciousRecord" },
                {
                    title: "操作",
                    width: 100,
                    component: {
                        render(h, row) {
                            return (
                                <el-button
                                    type="text"
                                    onClick={() => $shelf.lookDetails(row)}
                                >
                                    查看详情
                                </el-button>
                            );
                        }
                    }
                }
            ],
            current: 1,
            row: {},
            table: [],
            idCard: "",
            pageNum: 0,
            pageSize: 10,
            startTime: "",
            endTime: ""
        };
    },
    computed: {
        networkRelationConfig() {
            return searchLoverkRelationConfig;
        },
        chartOptions() {
            const $shelf = this;
            return {
                plotOptions: {
                    venn: {
                        dataLabels: {
                            useHTML: true,
                            enabled: true
                        }
                    }
                },
                tooltip: {
                    useHTML: true,
                    headerFormat: "<small>{point.key}</small><table>",
                    pointFormat:
                        '<tr><td style="color: {series.color}"></td></tr>',
                    footerFormat: "</table>"
                },
                series: [
                    {
                        type: "venn",
                        name: "寻找情人模型",
                        data: [
                            {
                                sets: ["同行同住"],
                                value: 28,
                                name: `${$shelf.vennData.together}人</br>同行同住`
                            },
                            {
                                sets: ["通话异常"],
                                value: 28,
                                name: `${$shelf.vennData.call}人</br>通话异常`
                            },
                            {
                                sets: ["交易异常"],
                                value: 28,
                                name: `${$shelf.vennData.transfer}人</br>交易异常`
                            },
                            {
                                sets: ["同行同住", "通话异常"],
                                value: 8,
                                name: `${$shelf.vennData.togetherAndCall}人`
                            },
                            {
                                sets: ["同行同住", "交易异常"],
                                value: 8,
                                name: `${$shelf.vennData.togetherAndTransfer}人`
                            },
                            {
                                sets: ["通话异常", "交易异常"],
                                value: 8,
                                name: `${$shelf.vennData.transferAndCall}人`
                            },
                            {
                                sets: ["通话异常", "交易异常", "同行同住"],
                                value: 4,
                                name: `${$shelf.vennData.allCount}人`
                            }
                        ]
                    }
                ],
                title: {
                    text: ""
                },
                colors: [
                    WARNLEVEL3,
                    WARNLEVEL5,
                    WARNLEVEL5,
                    WARNLEVEL2,
                    WARNLEVEL2,
                    WARNLEVEL4,
                    WARNLEVEL1
                ],
                credits: {
                    enabled: false
                },
                exporting: {
                    buttons: {
                        contextButton: {
                            enabled: false
                        }
                    }
                }
            };
        }
    },
    methods: {
        exportMulConfig() {
            let { fnGetData, networkRelationConfig: config } = this;
            return [{ config, fnGetData }];
        },
        fnGetData() {
            return this.table;
        },
        query() {
            loverPotential({
                suspiciousLevel: this.suspiciousLevel || null,
                sex: this.gender || null,
                startTime: this.startTime || null,
                endTime: this.endTime || null,
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                idCard: this.idCard
            }).then(res => {
                if (res.data) {
                    this.setTable(res.data.suspiciousData.rows);
                    this.total = res.data.suspiciousData.total;
                }
            });
        },
        deteChange() {
            if (this.period) {
                this.startTime = this.period[0];
                this.endTime = this.period[1];
            } else {
                this.startTime = null;
                this.endTime = null;
            }
            this.date = [this.startTime, this.endTime];
        },
        lookDetails(row) {
            this.$refs.detailInfo.isVisible = true;
            this.row = {
                ...row,
                sourceIdCard: this.idCard,
                startTime: this.startTime,
                endTime: this.endTime
            };
        },
        sortChange({ prop, order }) {
            loverPotential({
                dabh: this.$route.query.dabh,
                idCard: this.idCard,
                sortName: prop,
                sortRule: order.replace("ending", ""),
                pageSize: this.pageSize,
                pageNum: this.pageNum
            }).then(res => {
                if (res.data) {
                    this.setTable(res.data.suspiciousData.rows);
                    this.total = res.data.suspiciousData.total;
                }
            });
        },
        onPageChange(pageNum, pageSize) {
            this.current = pageNum;
            this.pageNum = pageNum - 1;
            this.pageSize = pageSize;
        },
        startAnalysis(person) {
            this.idCard = person.zjhm;
            if (person.length === 0) {
                this.$message({
                    message: "请选择一个对象",
                    type: "error"
                });
                return;
            }
            this.btnLoading = true;
            this.fileName = `寻找情人-${person.zjhm ? person.mc : person.ztmc}`;
            this.filterVisible = true;
            setTimeout(() => {
                this.isLoading = true;
            });
            loverPotential({
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                idCard: this.idCard
            }).then(res => {
                if (res.data) {
                    let {
                        together,
                        transfer,
                        call,
                        togetherAndTransfer,
                        togetherAndCall,
                        transferAndCall,
                        allCount
                    } = res.data;
                    this.vennData = {
                        together,
                        transfer,
                        call,
                        togetherAndTransfer,
                        togetherAndCall,
                        transferAndCall,
                        allCount
                    };

                    this.labelData = {
                        level1: {
                            count: allCount,
                            color: WARNLEVEL1,
                            text: "红色可疑程度一级"
                        },
                        level2: {
                            count: togetherAndCall + togetherAndTransfer,
                            color: WARNLEVEL2,
                            text: "橙色可疑程度二级"
                        },
                        level3: {
                            count: together,
                            color: WARNLEVEL3,
                            text: "黄色可疑程度三级"
                        },
                        level4: {
                            count: transferAndCall,
                            color: WARNLEVEL4,
                            text: "浅黄色可疑程度四级"
                        },
                        level5: {
                            count: call + transfer,
                            color: WARNLEVEL5,
                            text: "灰色可疑程度五级"
                        }
                    };
                    this.setTable(res.data.suspiciousData.rows);
                    this.total = res.data.suspiciousData.total;
                    this.showVenn = true;
                    this.isLoading = false;
                    this.btnLoading = false;
                }
            });
        },
        setTable(value) {
            let table = [];
            value.map(el => {
                let suspiciousRecord = "";
                let dimensionList = [];
                let isFirst = true;
                if (!(el.travelNum === 0)) {
                    isFirst = false;
                    dimensionList.push("同行");
                    suspiciousRecord += `同行:${el.travelNum}次`;
                }
                if (!(el.liveNum === 0)) {
                    if (isFirst) {
                        suspiciousRecord += `同住:${el.liveNum}次`;
                        isFirst = false;
                    } else {
                        suspiciousRecord += `, 同住:${el.liveNum}次`;
                    }
                    dimensionList.push("同住");
                }
                if (!(el.transferNum === 0)) {
                    if (isFirst) {
                        suspiciousRecord += `交易异常:${el.transferNum}次`;
                        isFirst = false;
                    } else {
                        suspiciousRecord += `, 交易异常:${el.transferNum}次`;
                    }
                    dimensionList.push("交易异常");
                }
                if (!(el.callNum === 0)) {
                    if (isFirst) {
                        suspiciousRecord += `通话异常:${el.callNum}次`;
                    } else {
                        suspiciousRecord += `, 通话异常:${el.callNum}次`;
                    }
                    dimensionList.push("通话异常");
                }
                table.push({
                    name: el.name,
                    sex: el.sex == "1" ? "男" : "女",
                    idCard: el.idCard,
                    suspiciousLevel: el.suspiciousLevel,
                    suspiciousRecord,
                    dimensionList
                });
            });
            this.rows = table;
        }
    },
    components: {},
    watch: {},
    created() {
        getSAObjectByDABH({
            dabh: this.$route.query.dabh,
            isMultipleCases: this.$route.query.isMultipleCases,
            dwbm: this.$route.query.dwbm
        }).then(res => {
            if (res.code === 0) {
                this.all = res.data.saxxModels;
            }
        });
    },
    mounted() {}
};
</script>

<style lang="scss">
@import "@/styles/basic-color.scss";
.suspiciou_level_1,
.suspiciou_level_2,
.suspiciou_level_3,
.suspiciou_level_4,
.suspiciou_level_5 {
    width: 58px;
    height: 28px;
    color: #fff;
    border-radius: 3px;
    outline: none;
    border: none;
}
.suspiciou_level_1 {
    background-color: $worning-level-1;
}
.suspiciou_level_2 {
    background-color: $worning-level-2;
}
.suspiciou_level_3 {
    background-color: $worning-level-3;
    color: #000;
}
.suspiciou_level_4 {
    background-color: $worning-level-4;
    color: #000;
}
.suspiciou_level_5 {
    background-color: $worning-level-5;
    color: #000;
}
</style>
<style lang="scss" scoped>
@import "@/styles/basic-color.scss";
.mywrapper /deep/ .highcharts-label {
    text-align: center;
}
.warnWrapper /deep/ .is-light {
    background-color: rgba(233, 186, 122, 0.2);
    border: 1px solid $color-warning;
    color: $color-warning;
}
.warnWrapper /deep/ .el-icon-close:before {
    position: relative;
    right: -8px;
    top: -5px;
    color: $color-warning;
}
.suspiciousLevel /deep/ .el-input {
    width: 160px;
}
.warnPaddin {
    height: 22px;
    line-height: 22px;
}
.print {
    position: absolute;
    right: 0;
}
.mylabel {
    width: 100%;
    display: flex;
    height: 100%;
    flex-direction: column;
    flex-flow: column;
    margin-top: 20px;
}
.mywrapper {
    display: flex;
}
.header {
    display: flex;
    padding: 10px;
    height: 60px;
    line-height: 100%;
    > div {
        margin-right: 20px;
    }
}
.content {
    padding: 30px 0 50px 20px;
    height: calc(100% - 60px);
    overflow-x: hidden;
}
.dot {
    display: flex;
    width: 250px;
    height: 20px;
    line-height: 20px;
    position: relative;
    margin-bottom: 15px;
    span {
        position: absolute;
        right: 0;
    }
    b {
        align-self: center;
        content: "";
        position: relative;
        display: inline-block;
        margin-right: 10px;
        width: 30px;
        height: 15px;
        border-radius: 4px;
    }
}
</style>
