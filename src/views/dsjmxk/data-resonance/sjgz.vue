<template>
    <imp-panel>
        <div style="height:100%;padding: 10px;" slot="body">
            <collapse-tool-page
                :prop_tags="tags"
                @handleClose="handleClose"
                @resetFilter="resetFilter"
                @startAnalysis="confirmAnalysis"
                ref="collapsetoolpage"
            >
                <div slot="conditions">
                    <div class="tj">
                        <kr-section-title
                            title="设置伴随条件"
                            :size="18"
                        ></kr-section-title>
                        <el-row
                            :gutter="2"
                            style="margin-top:20px;margin-bottom:20px"
                        >
                            <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="8">
                                <span>
                                    间隔距离范围
                                    <el-input
                                        style="width:120px"
                                        size="mini"
                                        v-model="input_jgjl"
                                        placeholder="请输入内容"
                                        onkeyup="value=value.replace(/\D|^0/g,'')"
                                        @blur="blurInput"
                                        @clear="clearInput"
                                    ></el-input>
                                    米以内</span
                                >
                            </el-col>
                            <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="8">
                                <span>
                                    间隔时间范围
                                    <el-input
                                        style="width:120px"
                                        size="mini"
                                        v-model="input_jgsj"
                                        placeholder="请输入内容"
                                        onkeyup="value=value.replace(/\D|^0/g,'')"
                                        @blur="blurInput"
                                        @clear="clearInput"
                                    ></el-input>
                                    分钟以内</span
                                >
                            </el-col>
                        </el-row>

                        <kr-section-title
                            title="维度选择"
                            :size="18"
                        ></kr-section-title>

                        <el-checkbox
                            :indeterminate="isIndeterminate"
                            v-model="checkAll"
                            @change="handleCheckAllChange"
                            >全选</el-checkbox
                        >

                        <el-checkbox-group
                            ref="wd"
                            style="margin:20px 0px 0px 20px;display: inline-block"
                            v-model="checkedSJLX"
                            @change="handleCheckedWDChange"
                        >
                            <el-checkbox
                                v-for="item in sjlxdata"
                                :label="item.name"
                                :key="item.value"
                                @change="handleChange"
                                >{{ item.name }}</el-checkbox
                            >
                        </el-checkbox-group>
                    </div>
                </div>

                <div slot="content" style="height:100%">
                    <div class="noData" v-if="ydata.length == 0">
                        <span class="noData_text">要选择对象才有数据！</span>
                    </div>
                    <div v-else style="height:100%">
                        <div class="toolbar_statistical">
                            <el-row
                                :gutter="1"
                                style="margin:20px 0px 5px 40px"
                            >
                                <el-col
                                    v-for="item in tjlxdata"
                                    :key="item.id"
                                    :xs="12"
                                    :sm="8"
                                    :md="4"
                                    :lg="2"
                                    :xl="2"
                                >
                                    <el-button
                                        :type="item.status ? 'primary' : ''"
                                        @click="statisticalSearch(item)"
                                        >{{ item.name }}</el-button
                                    >
                                    <!-- :class="{
                                    sjlx_select: item.status
                                }" -->
                                </el-col>
                                <el-col
                                    :xs="12"
                                    :sm="12"
                                    :md="10"
                                    :lg="8"
                                    :xl="8"
                                >
                                    <el-date-picker
                                        style="width: 230px; margin-right: 20px;"
                                        v-show="isdate"
                                        v-model="period"
                                        type="daterange"
                                        align="right"
                                        unlink-panels
                                        range-separator="~"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :picker-options="$pickerOptions"
                                        value-format="yyyy-MM-dd"
                                        @change="deteChange"
                                    ></el-date-picker>
                                    <el-date-picker
                                        style="width: 160px"
                                        v-show="isweek"
                                        v-model="startweek"
                                        type="week"
                                        format="yyyy 第 WW 周"
                                        placeholder="开始周"
                                        :firstDayOfWeek="1"
                                        @change="startWeekChange"
                                    >
                                        ></el-date-picker
                                    >
                                    <span v-show="isweek"> ~</span>
                                    <el-date-picker
                                        style="width: 160px"
                                        v-show="isweek"
                                        v-model="endweek"
                                        type="week"
                                        format="yyyy 第 WW 周"
                                        placeholder="结束周"
                                        :firstDayOfWeek="7"
                                        @change="endWeekChange"
                                    >
                                        ></el-date-picker
                                    >
                                    <el-date-picker
                                        v-show="ismonth"
                                        v-model="month"
                                        type="monthrange"
                                        range-separator="~"
                                        start-placeholder="开始月份"
                                        end-placeholder="结束月份"
                                    >
                                        ></el-date-picker
                                    >
                                </el-col>
                            </el-row>
                        </div>

                        <div class="content" v-kr-loading="isLoading">
                            <div class="mywrapper">
                                <div class="chartContain">
                                    <highcharts
                                        :options="chartOptions"
                                        style="height:330px"
                                    ></highcharts>
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
                    </div>
                </div>
            </collapse-tool-page>

            <!-- <kr-detail-info ref="detailInfo" :row="row" /> -->
            <!-- <detail-info slot="body" ref="detailInfo" :row="row" /> -->
            <table-list
                slot="body"
                ref="detailInfo"
                :detailtable="detailtable"
            />

            <key-select
                ref="keypersonnelselect"
                :person="checkedsarsinfo"
                @pickKeyPersonnel="pickKeyPersonnel"
            ></key-select>
        </div>
        <kr-choose
            ref="personChoose"
            @startAnalysis="choosePerson($event)"
            @clearAll="clearAll"
            :all="sars"
            :buttonTitle="buttonTitle"
            :isPerson="true"
            slot="aside"
            :max="100"
            @search="searchPerson"
        ></kr-choose>
    </imp-panel>
</template>

<script type="text/babel">
import { getLxByKj, getSAObjectByDABH } from "@/api/zhfx/dskfx.js";
import {
    getResonanceData
    // getDetialForResonance
} from "@/api/dsjmxk/data-resonance.js";
import { DSK_COLOR } from "@/config/index.js";
import { cloneDeep } from "loadsh";
import keySelect from "./key-select";
// import detailInfo from "./detail-info";
import tableList from "./table-list";
// import collapseToolPage from "./collapse-tool-page";
export default {
    // components: {
    //     keypersonnelSelect
    // },
    components: {
        // "imp-panel": panel,
        // collapseToolPage,
        tableList,
        // timeLine,
        keySelect
    },
    data() {
        const $shelf = this;
        return {
            // tags: [],
            // isShowfxtj: false,
            buttonTitle: ["确认选择", "清空对象"],
            input_jgjl: "1000",
            input_jgsj: "120",
            bstj: ["间隔距离1000米以内", "间隔时间120分钟以内"], //伴随条件包括距离时间
            checkAll: false,
            checkedSJLX: [], //事件类型//默认全选中
            isIndeterminate: true,
            checkedSJLX_copy: [], //事件类型/默认全选中，用去重置和全选

            dabh: "1", //档案编号
            sars: [],
            checkedsarsinfo: [], //重新构造 传给map 全部信息
            keyperson: "",
            datetype: "daterange",
            period: ["2019-05-27", "2020-08-27"],
            startweek: new Date(),
            endweek: new Date(),
            month: ["2019-05-01", "2020-08-01"],
            isdate: true,
            isweek: false,
            ismonth: false,
            selected_tjlx: "day",
            tjlxdata: [
                {
                    name: "按天",
                    value: "daterange",
                    status: true
                },
                {
                    name: "按周",
                    value: "week",
                    status: false
                },
                {
                    name: "按月",
                    value: "month",
                    status: false
                }
            ],

            // xdata: ["小张3", "小彭", "小潘", "小潘", "小潘"],
            //  ydata: [5, 3, 106, 129, 144],
            xdata: [],
            ydata: [],

            all: [],
            // showVenn: false,
            isLoading: false,
            detailtable: [],

            // suspiciousLevel: "",
            // suspiciousLevelArr: [
            //     { label: "一级", value: 1 },
            //     { label: "二级", value: 2 },
            //     { label: "三级", value: 3 },
            //     { label: "四级", value: 4 },
            //     { label: "五级", value: 5 }
            // ],
            // vennData: {},
            // labelData: {},
            // gender: "",
            // genderArr: [
            //     { label: "男", value: 1 },
            //     { label: "女", value: 2 }
            // ],

            rows: [],
            total: 10,
            columns: [
                {
                    title: "主体分析对象",
                    width: 120,
                    key: "mainBodyName"
                },
                {
                    title: "身份证号",
                    key: "mainBodyIdCard"
                },
                {
                    title: "共振分析对象",
                    width: 120,
                    key: "resonanceBodyName"
                },
                {
                    title: "共振对象身份证号",
                    key: "resonanceBodyIdCard"
                },
                {
                    title: "共振频率",
                    width: 120,

                    // sortable: true
                    sortable: "custom",
                    key: "frequency"
                },

                {
                    title: "总共振次数",
                    width: 120,
                    // sortable: true,
                    sortable: "custom",
                    key: "nums"
                },
                {
                    title: "共振维度",
                    key: "typesNames"
                },
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
            pickerOptions: {
                shortcuts: [
                    {
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近一个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近三个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ]
            },
            idCard: "",
            pageNum: 0,
            pageSize: 10,
            startTime: "",
            endTime: ""
        };
    },
    watch: {
        // tags: {
        //     handler() {
        //         // this.$nextTick(function() {
        //         //     //操作外层div 高度
        //         //     if (document.querySelector(".footer") != null) {
        //         //         //toobar 高度
        //         //         var toolbar_height = getComputedStyle(
        //         //             document.querySelector(".toolbar")
        //         //         ).height;
        //         //         var h = parseInt(toolbar_height) + 20; //加上底部20px
        //         //         // alert(toolbar_height);
        //         //         document.querySelector(".footer").style.height =
        //         //             "calc(100% - " + h + "px)";
        //         //     }
        //         // });
        //         // setTimeout(() => {
        //         //     //操作外层div 高度
        //         //     if (document.querySelector(".footer") != null) {
        //         //         //toobar 高度
        //         //         var toolbar_height = getComputedStyle(
        //         //             document.querySelector(".toolbar")
        //         //         ).height;
        //         //         var h = parseInt(toolbar_height) + 20; //加上底部20px
        //         //         // alert(toolbar_height);
        //         //         document.querySelector(".footer").style.height =
        //         //             "calc(100% - " + h + "px)";
        //         //     }
        //         // }, 1000);
        //     },
        //     immediate: true
        // },
        input_jgjl() {
            this.getSjjlList();
        },
        input_jgsj() {
            this.getSjjlList();
        }
    },
    computed: {
        tags: {
            get: function() {
                return [...this.bstj, ...this.checkedSJLX];
            },
            set: function(deleteValue) {
                var sjd = this.bstj.filter(value => {
                    return value != deleteValue;
                });
                this.bstj = sjd;
                var sjlx = this.checkedSJLX.filter(value => {
                    return value != deleteValue;
                });
                this.checkedSJLX = sjlx;
            }
        },
        chartOptions() {
            const $shelf = this;
            return {
                chart: {
                    type: "column"
                },
                title: {
                    // text: "数据共振图表",
                    text: "",
                    align: "left",
                    style: {
                        color: "#000",
                        fontWeight: "bold"
                    }
                },
                // subtitle: {
                //     text: `${$shelf.keyperson}与案件其他成员的数据共振情况`,
                //     align: "left"
                // },
                xAxis: {
                    // categories: ["小张", "小彭", "小潘", "小潘", "小潘"]
                    categories: $shelf.xdata
                },
                yAxis: {
                    allowDecimals: false,
                    min: 0,
                    title: {
                        text: ""
                    }
                },
                // series: [
                //     {
                //         name: "",
                //         data: [5, 3, 3, 3, 3]
                //     }
                // ]
                // series: [{ name: "共振次数", data: [5, 3, 106, 129, 144] }]
                series: [{ name: "共振次数", data: $shelf.ydata }]
            };
        }
    },
    methods: {
        //重置条件
        resetFilter() {
            //重置
            this.input_jgjl = "1000";
            this.input_jgsj = "120";
            this.checkedSJLX = this.checkedSJLX_copy;
        },
        handleClose(val) {
            //             //删除
            var sjd = this.bstj.filter(value => {
                if (value == val.tag) {
                    //清空选项
                    if (val.tag.indexOf("时间") > -1) {
                        this.input_jgsj = "";
                    }
                    if (val.tag.indexOf("距离") > -1) {
                        this.input_jgjl = "";
                    }
                }
                return value != val.tag;
            });
            this.bstj = sjd;
            var sjlx = this.checkedSJLX.filter(value => {
                return value != val.tag;
            });
            this.checkedSJLX = sjlx;
        },
        confirmAnalysis() {
            this.startAnalysis();
        },

        //搜索条件
        // toggle() {
        //     this.isShowfxtj = !this.isShowfxtj;
        // },
        // resetTJ() {
        //     // this.tags = this.tags_copy;
        //     // this.bstj = this.checkedSJD_copy;
        //     this.input_jgjl = "";
        //     this.input_jgsj = "";
        //     this.checkedSJLX = this.checkedSJLX_copy;
        // },
        blurInput() {
            // console.log(event);
            this.getSjjlList();
            // Window.eventBus.$emit("getTags", {
            //     tags: [...this.bstj, ...this.checkedSJLX]
            // });
            this.tags = [...this.bstj, ...this.checkedSJLX];
        },
        clearInput() {
            this.getSjjlList();
            // Window.eventBus.$emit("getTags", {
            //     tags: [...this.bstj, ...this.checkedSJLX]
            // });
            this.tags = [...this.bstj, ...this.checkedSJLX];
        },

        getSjjlList() {
            // this.loading = true;
            // var _this = this;
            this.sjddata = [];
            this.bstj = [];
            if (this.input_jgjl != "") {
                this.sjddata.push({
                    name: "间隔距离" + this.input_jgjl + "米以内",
                    value: this.input_jgjl
                });
                this.bstj.push("间隔距离" + this.input_jgjl + "米以内");
            }
            if (this.input_jgsj != "") {
                this.sjddata.push({
                    name: "间隔时间" + this.input_jgsj + "分以内",
                    value: this.input_jgsj
                });
                this.bstj.push("间隔时间" + this.input_jgsj + "分以内");
            }
            // this.checkedSJD_copy = cloneDeep(this.bstj);

            // this.sjddata.push();

            // getSdxx()
            //     .then(response => {
            //         for (var item of response.data) {
            //             item.status = true;
            //             _this.bstj.push(item.name);
            //         }
            //         _this.checkedSJD_copy = cloneDeep(_this.bstj);

            //         _this.sjddata = [
            //             ...response.data,
            //             { name: "自定义", value: "07" }
            //         ];
            //     })
            //     .catch(() => {
            //         _this.sjddata = [];
            //     });
        },
        getsjlxList() {
            var _this = this;
            this.sjlxdata = [];
            getLxByKj()
                .then(response => {
                    for (var item of response.data) {
                        item.status = true;
                        _this.checkedSJLX.push(item.name);
                    }
                    _this.checkedSJLX_copy = cloneDeep(_this.checkedSJLX);
                    // _this.tags_copy = [
                    //     ..._this.checkedSJLX,
                    //     ..._this.tags_copy
                    // ];
                    _this.sjlxdata = response.data;
                    // Window.eventBus.$emit("getTags", {
                    //     tags: [...this.bstj, ...this.checkedSJLX],
                    //     cztags: [...this.bstj, ...this.checkedSJLX_copy]
                    // });
                    this.tags = [...this.bstj, ...this.checkedSJLX];
                })
                .catch(() => {
                    _this.sjlxdata = [];
                });
        },
        handleCheckAllChange(val) {
            this.checkedSJLX = val ? this.checkedSJLX_copy : [];
            this.isIndeterminate = false;
            // Window.eventBus.$emit("getTags", {
            //     tags: [...this.bstj, ...this.checkedSJLX]
            // });
            this.tags = [...this.bstj, ...this.checkedSJLX];
        },
        handleCheckedWDChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.checkedSJLX_copy.length;
            this.isIndeterminate =
                checkedCount > 0 && checkedCount < this.checkedSJLX.length;
            // Window.eventBus.$emit("getTags", {
            //     tags: [...this.bstj, ...this.checkedSJLX]
            // });
            this.tags = [...this.bstj, ...this.checkedSJLX];
        },
        handleChange() {
            // console.log(value);
            this.checkedSJLX;
            // Window.eventBus.$emit("getTags", {
            //     tags: [...this.bstj, ...this.checkedSJLX]
            // });
            this.tags = [...this.bstj, ...this.checkedSJLX];
        },

        //搜索条件

        //根据案件查图信息
        getSAR() {
            var _this = this;
            //根据url获取案件编号
            this.checkedsars = [];
            this.query = {
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm
            };
            getSAObjectByDABH(this.query)
                .then(response => {
                    // this.loading = false;
                    //根据人员个数产生随机色
                    // var colors = this.getColor(response.data.saxxModels.length);
                    //追加颜色字段
                    //   for (const item of  response.data.saxxModels) {
                    //      item.color=_this.getRandomColor();
                    //      item.gjindexs=[];
                    //      item.gjline=[];
                    //  }
                    _this.xdata = [];
                    _this.ydata = [];
                    response.data.saxxModels.forEach((item, i) => {
                        // item.color=colors[i].style.background;
                        item.color = DSK_COLOR[i];
                        item.gjindexs = [];
                        item.gjline = [];
                        item.status = false;
                        _this.xdata.push(item.mc);
                        // _this.ydata.push(1);
                    });
                    // console.log(response.data.saxxModels);
                    _this.sars = response.data.saxxModels;
                })
                .catch(() => {
                    // this.loading = false;
                    _this.sars = [];
                });
        },

        //确认选择
        choosePerson() {
            // var _this = this;
            if (this.$refs.personChoose.checkedPersons.length < 2) {
                this.$message("请选择至少两个对象！");
                return;
            }

            this.checkedsarsinfo = this.$refs.personChoose.checkedPersons; //person;

            //弹出选择主节点
            this.$refs.keypersonnelselect.isVisible = true;
        },
        // 搜索
        searchPerson() {
            // console.log("search");
        },
        //情况对象
        clearAll() {
            this.checkedsarsinfo = [];
            this.mapPoint = [];
            //   this.ymdataInfo=[]
            this.ymDataInfo = [];
        },

        pickKeyPersonnel() {
            //确认了主对象 ,choose组件 中当前人员状态 变成 主 对象
            var id = this.$refs.keypersonnelselect.keyperson; //id
            var arr = this.$refs.keypersonnelselect.person.filter(element => {
                return element.zjhm == id;
            });

            this.showVenn = true;
            if (arr.length > 0) {
                this.keyperson = arr[0].mc;
            }
        },
        statisticalSearch(item) {
            var _this = this;
            this.period = "";
            this.startweek = "";
            this.endweek = "";
            this.month = "";
            this.tjlxdata.forEach(element => {
                if (item.name == element.name) {
                    element.status = true;
                    _this.datetype = element.value;
                } else {
                    element.status = false;
                }
            });
            switch (item.name) {
                case "按天":
                    this.period = [
                        new Date("2019-05-27"),
                        new Date("2020-08-27")
                    ];
                    this.isdate = true;
                    this.isweek = false;
                    this.ismonth = false;
                    //查询接口
                    this.selected_tjlx = "day";
                    break;
                case "按周":
                    this.startweek = new Date();
                    this.endweek = new Date();
                    this.isdate = false;
                    this.isweek = true;
                    this.ismonth = false;
                    this.selected_tjlx = "week";
                    break;
                case "按月":
                    this.month = [
                        new Date("2019-05-01"),
                        new Date("2020-08-01")
                    ];
                    this.isdate = false;
                    this.isweek = false;
                    this.ismonth = true;
                    this.selected_tjlx = "month";
                    break;
            }
        },
        startAnalysis() {
            var _this = this;
            if (this.$refs.personChoose.checkedPersons.length < 2) {
                this.$message("请选择至少两个对象！");
                return;
            }

            this.checkedsarsinfo = this.$refs.personChoose.checkedPersons; //person;

            //弹出选择主节点
            if (this.$refs.keypersonnelselect.keyperson == "") {
                this.$refs.keypersonnelselect.isVisible = true;
                return;
            }
            if (this.input_jgjl == "" || this.input_jgsj == "") {
                this.$message("请输入间隔时间和间隔距离");
                this.$refs.collapsetoolpage.isShowfxtj = true;
                return;
            }
            this.ry;
            this.checkedsarsinfo.forEach(element => {
                element.iskeypersonnel = false;
                if (element.zjhm == _this.$refs.keypersonnelselect.keyperson) {
                    element.iskeypersonnel = true;
                }
            });

            //开始分析。。。
            // this.mapPoint = [];

            //加个时间判断
            this.$refs.collapsetoolpage.isShowfxtj = false;
            if (
                (this.isdate == true && this.period == "") ||
                (this.isdate == true && this.period == null)
            ) {
                this.$message("请选择开始日期和结束日期");
                return;
            }
            if (this.isweek == true) {
                if (
                    this.startweek == "" ||
                    this.endweek == "" ||
                    this.startweek == null ||
                    this.endweek == null
                ) {
                    this.$message("请选择开始周和结束周");
                    return;
                }
            }
            if (this.ismonth == true) {
                if (this.month == "" || this.month == null) {
                    this.$message("请选择开始月份和结束月份");
                    return;
                }
            }

            this.getResonance();
        },
        getResonance() {
            var _this = this;
            // this.ymdata=[];
            //构造事件类型数据 this.sjddata
            var sjlx = [];
            this.sjlxdata.forEach(element => {
                _this.checkedSJLX.forEach(e => {
                    if (element.name == e) {
                        sjlx.push(element.value);
                    }
                });
            });
            // //构造时间段数据 this.sjddata
            // var sjd = [];
            // this.sjddata.forEach(element => {
            //     _this.bstj.forEach(e => {
            //         if (element.name == e) {
            //             sjd.push(element.value);
            //         }
            //     });
            // });
            //构造伴随人员信息
            var bsperson = [];
            this.checkedsarsinfo.forEach(element => {
                if (element.zjhm != _this.$refs.keypersonnelselect.keyperson) {
                    bsperson.push(element.zjhm);
                }
            });
            //构造时间
            var week_start;
            var week_end;
            var month_start;
            var month_end;

            if (
                (this.isdate == true && this.period == "") ||
                (this.isdate == true && this.period == null)
            ) {
                this.$message("请选择时间");
                return;
            }
            if (this.isweek == true) {
                if (
                    this.startweek == "" ||
                    this.endweek == "" ||
                    this.startweek == null ||
                    this.endweek == null
                ) {
                    this.$message("请选择时间");
                    return;
                } else {
                    // week_start = this.startweek.toLocaleDateString().split("/");
                    week_start = this.startweek
                        .toLocaleDateString()
                        .split("/")
                        .map(element => {
                            if (element.length == 1) {
                                return (element = "0" + element);
                            } else {
                                return element;
                            }
                        })
                        .join("-");
                    week_end = this.endweek
                        .toLocaleDateString()
                        .split("/")
                        .map(element => {
                            if (element.length == 1) {
                                return (element = "0" + element);
                            } else {
                                return element;
                            }
                        })
                        .join("-");
                }
            }
            if (this.ismonth == true) {
                if (this.month == "" || this.month == null) {
                    this.$message("请选择时间");
                    return;
                } else {
                    month_start = this.month[0]
                        .toLocaleDateString()
                        .split("/")
                        .map(element => {
                            if (element.length == 1) {
                                return (element = "0" + element);
                            } else {
                                return element;
                            }
                        })
                        .join("-");
                    month_end = this.month[1]
                        .toLocaleDateString()
                        .split("/")
                        .map(element => {
                            if (element.length == 1) {
                                return (element = "0" + element);
                            } else {
                                return element;
                            }
                        })
                        .join("-");
                }
            }
            var start = this.isdate
                ? this.period[0]
                : this.isweek
                ? this.getYesterday(new Date(week_start))
                : month_start;
            var end = this.isdate
                ? this.period[1]
                : this.isweek
                ? this.getLastWeek(new Date(week_end))
                : month_end;

            this.query = {
                beginTime: start,
                // dabh: this.dabh || "84646445c6fe11ea82f0",
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                distance: this.input_jgjl,
                finishTime: end,
                intervalsTime: this.input_jgsj,
                masterIdCard: this.$refs.keypersonnelselect.keyperson,
                resonancerIdCards: bsperson,
                types: sjlx.toString(),
                statisticalTimeType: this.selected_tjlx
            };
            getResonanceData(this.query)
                .then(response => {
                    // console.log(response);
                    //处理柱状图
                    if (response.data.names.length == 0) {
                        this.$message("未查询到图表相关信息！");
                        this.xdata = [];
                        this.ydata = [];
                        // return;
                    } else {
                        this.xdata = response.data.names;
                        response.data.values;
                        var y = [];
                        response.data.values.forEach(element => {
                            y.push(parseFloat(element));
                        });
                        this.ydata = y;
                    }

                    //处理统计列表
                    if (response.data.items.length == 0) {
                        this.$message("未查询到相关列表信息！");
                        // return;
                    }
                    for (let i in response.data.items) {
                        response.data.items[i].xh = parseInt(i) + 1;
                    }
                    // _this.rows = response.data.statisticsList;
                    // _this.total = response.data.total;
                    _this.table = response.data.items;
                    _this.table = _this.table.sort(
                        (a, b) => b.length - a.length
                    );
                    _this.total = _this.table.length;
                    _this.getTablePage();
                })
                .catch(e => {
                    // console.log(e);

                    _this.ymDataInfo = [];
                });
        },

        startWeekChange() {
            if (this.startweek) {
                this.startweek;
            }
        },
        endWeekChange() {},

        deteChange() {
            if (this.period) {
                this.startTime = this.period[0];
                this.endTime = this.period[1];
            } else {
                this.startTime = null;
                this.endTime = null;
            }
        },
        lookDetails(row) {
            this.$refs.detailInfo.isVisible = true;
            this.detailtable = row.items2;
        },
        sortChange({ prop, order }) {
            prop;
            order;
            if (order == "ascending") {
                if (prop == "frequency") {
                    this.table = this.table.sort(
                        (a, b) => a.frequency - b.frequency
                    );
                } else if (prop == "nums") {
                    this.table = this.table.sort((a, b) => a.nums - b.nums);
                } else {
                    this.table = this.table.sort((a, b) => a.length - b.length);
                }
            } else if (order == "descending") {
                if (prop == "frequency") {
                    this.table = this.table.sort(
                        (a, b) => b.frequency - a.frequency
                    );
                } else if (prop == "nums") {
                    this.table = this.table.sort((a, b) => b.nums - a.nums);
                } else {
                    this.table = this.table.sort((a, b) => b.length - a.length);
                }
            }
            // this.getLjdTj();
            this.getTablePage();
        },
        onPageChange(pageNum, pageSize) {
            this.current = pageNum;
            this.pageNum = pageNum - 1;
            this.pageSize = pageSize;
            this.getTablePage();
        },
        getTablePage() {
            let start = (this.current - 1) * this.pageSize;
            let end = this.current * this.pageSize;
            if (!this.table[end]) {
                end = this.table.length;
            }
            this.rows = this.table.slice(start, end);
        },
        getYesterday(date) {
            var time = date.getTime() - 24 * 60 * 60 * 1000;
            var yesterday = new Date(time);
            // var month = yesterday.getMonth();
            // var day = yesterday.getDate();
            yesterday =
                yesterday.getFullYear() +
                "-" +
                (yesterday.getMonth() > 9
                    ? yesterday.getMonth() + 1
                    : "0" + (yesterday.getMonth() + 1)) +
                "-" +
                (yesterday.getDate() > 9
                    ? yesterday.getDate()
                    : "0" + yesterday.getDate());
            return yesterday;
        },
        getLastWeek(date) {
            var time = date.getTime() + 5 * 24 * 60 * 60 * 1000;
            var lastweek = new Date(time);
            // var month = yesterday.getMonth();
            // var day = yesterday.getDate();
            lastweek =
                lastweek.getFullYear() +
                "-" +
                (lastweek.getMonth() > 9
                    ? lastweek.getMonth() + 1
                    : "0" + (lastweek.getMonth() + 1)) +
                "-" +
                (lastweek.getDate() > 9
                    ? lastweek.getDate()
                    : "0" + lastweek.getDate());
            return lastweek;
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
        // setTagsListener() {
        //     var _this = this;
        //     Window.eventBus.$on("setTags", function name(val) {
        //         if (val.tag.length == 0) {
        //             //重置
        //             _this.input_jgjl = "1000";
        //             _this.input_jgsj = "120";
        //             _this.checkedSJLX = _this.checkedSJLX_copy;
        //         } else {
        //             //删除
        //             var sjd = _this.bstj.filter(value => {
        //                 if (value == val.tag) {
        //                     //清空选项
        //                     if (val.tag.indexOf("时间") > -1) {
        //                         _this.input_jgsj = "";
        //                     }
        //                     if (val.tag.indexOf("距离") > -1) {
        //                         _this.input_jgjl = "";
        //                     }
        //                 }
        //                 return value != val.tag;
        //             });
        //             _this.bstj = sjd;
        //             var sjlx = _this.checkedSJLX.filter(value => {
        //                 return value != val.tag;
        //             });
        //             _this.checkedSJLX = sjlx;
        //         }
        //     });
        // },
        // setStartAnalysisListener() {
        //     // var _this = this;
        //     // Window.eventBus.$on("startAnalysis", function() {
        //     //     _this.startAnalysis();
        //     // });
        // }
    },
    created() {
        if (location.href.search("=") != -1) {
            this.dabh = location.href.split("=")[1];
        } else {
            this.$message("未传入案件编号！");
            return;
        }
        this.getSAR();

        this.getsjlxList();
    },
    mounted() {}
};
</script>

<style lang="scss">
// @import "@/styles/basic-color.scss";
// .suspiciou_level_1,
// .suspiciou_level_2,
// .suspiciou_level_3,
// .suspiciou_level_4,
// .suspiciou_level_5 {
//     width: 58px;
//     height: 28px;
//     color: #fff;
//     border-radius: 3px;
//     outline: none;
//     border: none;
// }
// .suspiciou_level_1 {
//     background-color: $worning-level-1;
// }
// .suspiciou_level_2 {
//     background-color: $worning-level-2;
// }
// .suspiciou_level_3 {
//     background-color: $worning-level-3;
//     color: #000;
// }
// .suspiciou_level_4 {
//     background-color: $worning-level-4;
//     color: #000;
// }
// .suspiciou_level_5 {
//     background-color: $worning-level-5;
//     color: #000;
// }
</style>
<style lang="scss" scoped>
@import "@/styles/basic-color.scss";
.mywrapper /deep/ .highcharts-label {
    text-align: center;
}
// .warnWrapper /deep/ .is-light {
//     background-color: rgba(233, 186, 122, 0.2);
//     border: 1px solid $color-warning;
//     color: $color-warning;
// }
// .warnWrapper /deep/ .el-icon-close:before {
//     position: relative;
//     right: -8px;
//     top: -5px;
//     color: $color-warning;
// }
// .suspiciousLevel /deep/ .el-input {
//     width: 160px;
// }
// .warnPaddin {
//     height: 22px;
//     line-height: 22px;
// }
.mywrapper /deep/ .highcharts-credits {
    display: none;
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
    // display: flex;
}
//搜索条件
.toolbar {
    width: 100%;
    // height: 100px;

    z-index: 10;
}
.footer {
    // height: calc(100% - 126px);
    width: 100%;
    bottom: 20px;
    position: absolute;
}
.sjlx_select {
    background: $color-primary;
}
.toolbar_zd {
    height: 60px;
}
.fxtjhead {
    height: 100%;
    min-height: 58px;
    width: 100%;
    border: 2px solid #eee;
    border-left: 2px solid $color-primary;
    font-size: 18px;
    background: white;
    position: relative;
    z-index: 12;
}
.togglebtn {
    position: absolute;
    right: 20px;
    top: 180px;
    color: $color-primary;
    cursor: pointer;
}
.fxtjbox {
    position: absolute;
    // z-index: 1001;
    z-index: 10;
    // width: 100%;
    width: calc(100% - 20px);
    height: 240px;
    background: white;
    border: 1px solid #eee;
    box-shadow: 1px 1px 2px #888888;
}

.tj {
    // margin-left: 40px;
    margin: 20px 40px 0px 40px;
}
.fxtjbtn {
    // width: 100%;
    position: absolute;
    right: 20px;
    top: 20px;
}
.qrfxbtn {
    position: absolute;
    right: 20px;
    top: 60px;
}
.toolbar_cz {
    position: absolute;
    right: 100px;
    top: 180px;
}
.primarycolor {
    color: $color-primary;
}
.togglebtn {
    position: absolute;
    right: 20px;
    top: 180px;
    color: $color-primary;
    cursor: pointer;
}
.el-tag {
    margin-left: 10px;
    margin-bottom: 10px;
}

//搜索条件
.content {
    padding: 30px 0 50px 20px;
    height: calc(100% - 100px);
    width: 100%;
    overflow-x: hidden;
}
.chartContain {
    // height: 330px;
    width: 100%;
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
.noData {
    // z-index: 11;
    height: 100%;
    width: 100%;
    background-image: url("~@/assets/image/暂无数据.png");
    background-repeat: no-repeat;
    background-size: 50% 80%;
    background-position: 50% 50%;
    position: relative;
    .noData_text {
        position: absolute;
        bottom: calc(40% - 120px);
        left: calc(50% - 120px);
        font-size: 24px;
        color: #ccc;
    }
}
</style>
