<template>
    <imp-panel ref="impPanel">
        <kr-analysis-page slot="body" titleA="列表详情" titleB="地图分析">
            <div
                slot="component-chart"
                style="padding:10px;height: calc(100% - 20px);"
            >
                <div class="toolbar">
                    <div class="fxtjhead">
                        <div
                            style="margin-left: 40px;margin-top:20px;display:flex"
                        >
                            <div style="flex-basis: 100px;">
                                分析条件 ：
                            </div>
                            <div style="width:80%">
                                <el-tag
                                    ref="tag"
                                    :key="tag.name"
                                    v-for="tag in tags"
                                    closable
                                    :disable-transitions="false"
                                    @close="handleClose(tag)"
                                >
                                    {{ tag }}
                                </el-tag>
                            </div>
                        </div>

                        <div class="fxtjbtn">
                            <el-button
                                type="primary"
                                size="mini"
                                @click="toggle()"
                            >
                                分析条件
                                <i
                                    class="el-icon-d-arrow-left"
                                    style="transition: all .3s linear"
                                    :style="{
                                        transform: !isShowfxtj
                                            ? 'rotate(-90deg)'
                                            : 'rotate(90deg)'
                                    }"
                                ></i>
                            </el-button>
                        </div>
                        <!-- <div class="qrfxbtn">
                            <el-button
                                type="primary"
                                size="mini"
                                @click="startAnalysis"
                            >
                                确认分析
                                <i class="el-icon-search"></i>
                            </el-button>
                        </div> -->
                    </div>

                    <!-- v-show="isShowfxtj" -->
                    <!-- :class="{
                            showfxtj: isShowfxtj,
                            noshowfxtj: !isShowfxtj
                        }" -->
                    <div class="fxtjbox" v-show="isShowfxtj">
                        <div class="tj">
                            <kr-section-title
                                title="设置伴随条件"
                                :size="18"
                            ></kr-section-title>
                            <el-row
                                :gutter="2"
                                style="margin-top:20px;margin-bottom:20px"
                            >
                                <el-col
                                    :xs="10"
                                    :sm="10"
                                    :md="10"
                                    :lg="10"
                                    :xl="8"
                                >
                                    <span>
                                        间隔距离范围
                                        <el-input
                                            style="width:120px"
                                            size="mini"
                                            v-model="input_jgjl"
                                            placeholder="请输入内容"
                                            onkeyup="value=value.replace(/\D|^0/g,'')"
                                            @blur="blurInput"
                                        ></el-input>
                                        米以内</span
                                    >
                                </el-col>
                                <el-col
                                    :xs="10"
                                    :sm="10"
                                    :md="10"
                                    :lg="10"
                                    :xl="8"
                                >
                                    <span>
                                        间隔时间范围
                                        <el-input
                                            style="width:120px"
                                            size="mini"
                                            v-model="input_jgsj"
                                            placeholder="请输入内容"
                                            onkeyup="value=value.replace(/\D|^0/g,'')"
                                            @blur="blurInput"
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
                                    >{{ item.name }}</el-checkbox
                                >
                            </el-checkbox-group>
                        </div>
                        <div class="toolbar_cz">
                            <el-button
                                type=""
                                class="primarycolor"
                                size="mini"
                                @click="resetTJ()"
                                >重置</el-button
                            >
                            <el-button
                                type="primary"
                                size="mini"
                                @click="startAnalysis()"
                                >确认分析</el-button
                            >
                        </div>
                        <div class="togglebtn" @click="toggle()">
                            <i
                                class="el-icon-d-arrow-left"
                                style="transition: all .3s linear"
                                :style="{
                                    transform: !isShowfxtj
                                        ? 'rotate(-90deg)'
                                        : 'rotate(90deg)'
                                }"
                            ></i>
                            {{ isShowfxtj ? "收起" : "展开" }}
                        </div>
                    </div>
                </div>
                <!-- <div class="footer"> -->
                <div id="DSKmap" class="dskmap">
                    <!-- :class="{ 'dskmap_isfull': !isShowfxtj}" -->
                    <div class="dskmap-left">
                        <time-line
                            ref="timeline"
                            :ymDataInfo="this.ymDataInfo"
                            highlightPoint
                            @handleHighLightPoint="handleHighLightPoint($event)"
                        ></time-line>
                    </div>
                    <div class="dskmap-right">
                        <kr-map
                            ref="map"
                            :highlightPoint="highlightPoint"
                            :mapPoint="mapPoint"
                            :isMarkerClusterer="true"
                            :isdiffcluster="true"
                            :bigScreenBtn="true"
                            :markerNumber="true"
                            :isLine="false"
                            :isShowBsTrack="true"
                            :circleRadius="parseInt(input_jgjl)"
                            :isShowDatePick="true"
                            :isShowSearch="true"
                            :markerClick="true"
                            :ryinfo="checkedsarsinfo"
                            @changeInput="changeInput($event)"
                            @selectChange="selectChange($event)"
                            @handleBigScreen="handleBigScreen($event)"
                            @handleMarkerClick="handleMarkerClick($event)"
                        ></kr-map>
                    </div>
                </div>
                <!-- </div> -->
            </div>
            <!-- <div slot="component-table">需求设计中。。。</div> -->
            <kr-analysis-page-table slot="component-table" title="列表详情">
                <div style="padding: 20px">
                    <kr-table
                        :total="total"
                        :rows="pageData"
                        :columns="columns"
                        :current="page"
                        :indexRow="false"
                        @sort-change="sortChange"
                        @on-page-change="onPageChange"
                    ></kr-table>
                </div>
            </kr-analysis-page-table>
        </kr-analysis-page>

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
        <detail-info slot="body" ref="detailInfo" :row="row" />
        <keypersonnel-select
            slot="body"
            ref="keypersonnelselect"
            :person="checkedsarsinfo"
            @pickKeyPersonnel="pickKeyPersonnel"
        />
    </imp-panel>
</template>
<script type="text/babel">
import {
    getAccompanyData,
    // getDetialForAccompany,
    // getSdxx,
    // getType,
    getLxByKj,
    // getZysj,
    // getTackTypes,
    // getTimeLine,
    // getPosition,
    // getLJDStatistics,
    // getTrack,
    getSAObjectByDABH
} from "@/api/dsjmxk/multiple-spatiotemporal-adjoint";
import { cloneDeep } from "loadsh";

// import panel from "../../../components/common/panel.vue";
import { DSK_COLOR } from "@/config/index.js";
import detailInfo from "./detail-info";
import timeLine from "./time-line";
import keypersonnelSelect from "./keypersonnel-select";

export default {
    // mixins: [ treeter ],
    components: {
        // "imp-panel": panel,
        detailInfo,
        timeLine,
        keypersonnelSelect
    },
    data() {
        const $shelf = this;
        return {
            // toolbar_height: "",
            buttonTitle: ["确认选择", "清空对象"],
            input_jgjl: "1000",
            input_jgsj: "120",

            zdytime: "",
            // tags_copy: [],
            bstj: ["间隔距离1000米以内", "间隔时间120分钟以内"], //伴随条件包括距离时间
            checkAll: false,
            checkedSJLX: [], //事件类型//默认全选中
            isIndeterminate: true,
            checkedSJLX_copy: [], //事件类型/默认全选中，用去重置和全选

            table: [], //全部数据，前端分页
            pageData: [],
            current: 1,
            size: 10,
            total: 0,
            page: 1,
            pageSize: 10,
            rows: {},
            row: {},
            columns: [
                {
                    title: "序号",
                    width: 80,
                    key: "xh"
                    // sortable: "custom",
                    // formatter(row) {
                    //     return row.length;
                    // }
                },
                {
                    title: "伴随人员",
                    width: 120,
                    key: "accompanyPersons"
                },
                {
                    title: "间隔时间",
                    width: 120,
                    key: "intervalsTime"
                },
                {
                    title: "间隔距离",
                    width: 120,
                    key: "distance"
                },
                {
                    title: "主体人员",
                    width: 120,
                    key: "mainPerson"
                },
                {
                    title: "维度",
                    width: 120,
                    key: "typeName"
                },

                {
                    title: "发生时间",
                    sortable: true,
                    // sortable: "custom",
                    key: "time"
                },
                {
                    title: "地址",
                    key: "place"
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
            // historyTabe: [],
            isShowfxtj: false,
            query: null,
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

            selectOptions: {
                options: [
                    { name: "国内轨迹", value: "1" },
                    { name: "上班轨迹", value: "2" },
                    { name: "节假日轨迹", value: "3" },
                    { name: "出入境轨迹", value: "4" },
                    { name: "上下班轨迹", value: "5" }
                ],
                title: "轨迹类型"
            },
            tracktype: [],
            highlightPoint: null,
            ls_ymDataInfo: [],
            ls_mapPoint: [],
            ls_mapPoint_bs: [],
            mapPoint: [],
            iconMarker: "",

            zysjoptions: [
                {
                    importantTimeId: "选项1",
                    importantTimeName: "黄金糕"
                },
                {
                    importantTimeId: "选项2",
                    importantTimeName: "双皮奶"
                }
            ],
            zysjvalue: "",

            sjdoptions: [
                {
                    intervalId: "选项1",
                    intervalName: "前后1天"
                },
                {
                    intervalId: "选项4",
                    intervalName: "前后3天"
                },
                {
                    intervalId: "选项5",
                    intervalName: "前后5天"
                }
            ],
            sjdvalue: "",

            sjddata: [
                {
                    name: "通话",
                    value: "TH",
                    status: false
                },
                {
                    name: "住宿",
                    value: "ZS",
                    status: false
                },
                {
                    name: "出行",
                    value: "CX",
                    status: false
                }
            ],
            sjlxdata: [
                {
                    name: "通话",
                    value: "TH",
                    status: false
                },
                {
                    name: "住宿",
                    value: "ZS",
                    status: false
                },
                {
                    name: "出行",
                    value: "CX",
                    status: false
                }
            ],

            ymdata: [
                // {
                //     year: "",
                //     month: "",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2020",
                //     month: "",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2020",
                //     month: "9",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2020",
                //     month: "8",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2020",
                //     month: "7",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2019",
                //     month: "",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2019",
                //     month: "9",
                //     value: "",
                //     status: false
                // }
            ],

            ymDataInfo: [],

            hascurrentjd: true,
            // hasnojd: false,

            // activeName: "first",
            // gxlx: "PPTransfer", //人与人关系类型

            saryx: "",
            lxr: "",

            // sjdvalue: "",
            // nr: "",
            // yxh: "",
            // startvalue: "",
            // endvalue: "",

            // loading: false,
            dabh: "1", //档案编号
            options: [],
            list: [],

            checkedsars: [], //只包含了id
            checkedsarsinfo: [], //重新构造 传给map 全部信息
            sars: [
                // {
                //     num: "c093a3d182b911eabf9a0242ac110012",
                //     archivesNum: "c092c85582b911eabf9a",
                //     name: "王某",
                //     sex: "女",
                //     identifier: "792892196811231931",
                //         "zjhm": "792892196811231931",
                //     phone: "18828193833",
                //     gjindexs: [],
                //     gjline: [],
                //     color: "blue",
                //     state: false,
                //     isDeleted: "N",
                //     createTime: "2020-04-20 11:48:09.0",
                //          "mc": "1931",
                // },
            ]
        };
    },
    watch: {
        tags() {
            // var he = getComputedStyle(document.querySelector(".toolbar"))
            //     .height;
            // alert(he);
            // this.$nextTick(function() {
            //     //操作外层div 高度
            //     if (document.querySelector(".dskmap") != null) {
            //         //toobar 高度
            //         he = getComputedStyle(document.querySelector(".toolbar"))
            //             .height;
            //         alert(he);
            //     }
            // });
            setTimeout(() => {
                //操作外层div 高度
                if (document.querySelector(".dskmap") != null) {
                    if (this.tags.length == 0) {
                        // //toobar 高度
                        // document.querySelector(".toolbar").style.height =
                        //     "58px";
                        // document.querySelector(".dskmap").style.height =
                        //     "calc(100% - 58px)";
                    } else {
                        //toobar 高度
                        var toolbar_height = getComputedStyle(
                            document.querySelector(".toolbar")
                        ).height;
                        // alert(toolbar_height);
                        document.querySelector(".dskmap").style.height =
                            "calc(100% - " + toolbar_height + ")";
                    }
                }
            }, 1000);
        },
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
                // deleteValue;
                // this.sjlxdata;
                // this.sjdvalue;
                // this.bstj;
                // this.checkedSJLX;
                var sjd = this.bstj.filter(value => {
                    if (deleteValue.indexOf("距离") > -1) {
                        this.input_jgjl = "";
                    }
                    if (deleteValue.indexOf("时间") > -1) {
                        this.input_jgsj = "";
                    }
                    return value != deleteValue;
                });
                this.bstj = sjd;
                var sjlx = this.checkedSJLX.filter(value => {
                    return value != deleteValue;
                });
                this.checkedSJLX = sjlx;
                // this.tags = newValue;
                // this.name = names[0]
                // this.url = names[names.length - 1]
            }
        }
    },
    methods: {
        pickKeyPersonnel() {
            //确认了主对象 ,choose组件 中当前人员状态 变成 主 对象
            this.$refs.keypersonnelselect.keyperson; //id
        },
        blurInput() {
            // console.log(event);
            this.getSjjlList();
        },
        handleClose(tag) {
            // var tags = this.tags.filter(value => {
            //     return value != tag;
            // });
            // console.log(tags);
            //当前删除的元素
            this.tags = tag;
        },

        handleCheckAllChange(val) {
            this.checkedSJLX = val ? this.checkedSJLX_copy : [];
            this.isIndeterminate = false;
        },
        handleCheckedWDChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.checkedSJLX_copy.length;
            this.isIndeterminate =
                checkedCount > 0 && checkedCount < this.checkedSJLX.length;
        },
        toggle() {
            this.isShowfxtj = !this.isShowfxtj;
        },
        changeInput(item) {
            // console.log(item);
            //过滤人员
            if (item != "") {
                var ls_ym = [];
                var ls_map = [];
                this.ls_ymDataInfo.forEach(element => {
                    if (element.dabh == null || element.name == item) {
                        ls_ym.push(element);
                    }
                });
                this.ls_mapPoint.forEach(element => {
                    if (element.name == item) {
                        ls_map.push(element);
                    }
                });
                this.ymDataInfo = ls_ym;
                this.mapPoint = ls_map;
            } else {
                this.ymDataInfo = this.ls_ymDataInfo;
                this.mapPoint = this.ls_mapPoint;
            }

            // this.ls_ymDataInfo;
            // this.ls_mapPoint;
        },
        resetTJ() {
            // this.tags = this.tags_copy;
            // this.bstj = this.checkedSJD_copy;
            this.input_jgjl = "1000";
            this.input_jgsj = "120";
            this.bstj = ["间隔距离1000米以内", "间隔时间120分钟以内"];
            this.checkedSJLX = this.checkedSJLX_copy;
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
        // 开始分析
        startAnalysis() {
            // this.isShowfxtj = false;

            // if (
            //     this.$refs.map.datesj_time == null ||
            //     this.$refs.map.datesj_time == ""
            // ) {
            //     this.$message("请选择开始日期和结束日期！");
            //     return;
            // }
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
                this.isShowfxtj = true;
                return;
            }
            this.ry;
            this.checkedsarsinfo.forEach(element => {
                element.iskeypersonnel = false;
                if (element.zjhm == _this.$refs.keypersonnelselect.keyperson) {
                    element.iskeypersonnel = true;
                }
            });

            //加个时间判断
            if (
                this.$refs.map.datesj_time == "" ||
                this.$refs.map.datesj_time == null
            ) {
                this.$message("请开始日期和结束日期");
            }

            //开始分析。。。
            // this.mapPoint = [];

            this.isShowfxtj = false;

            // //获取时间轴年月 ,默认选择最新一个月数据
            // // this.getNyList();

            // this.getLjdTimeLine();
            // // this.getGjTimeLine();

            // this.getLjdPosition();

            // this.getLjdTj();
            this.getBSData();
        },

        selectChange(type) {
            this.tracktype = type;
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

        // isShowGJ(item, val, v) {
        //     // item.state=!item.state;
        // },
        btnZbdw(item) {
            //地图点击 左侧人员 高亮 右侧人员定位
            item.status = !item.status;
            //其他变为false,
            this.ymDataInfo.forEach(function(it) {
                if (item != it) {
                    it.status = false;
                }
            });
            // this.highlightPoint={longitude:item.longitude,latitude:item.latitude};
            this.highlightPoint = item;
        },
        btnKsfx() {},

        getTime(item) {
            if (item.month == "") {
                return;
            }
            item.status = true;
            //其他变为false,
            this.ymdata.forEach(function(it) {
                if (item.value != it.value) {
                    it.status = false;
                }
            });

            this.getInfobyny(item);
        },
        handleHighLightPoint(e) {
            // console.log(e);
            // console.log("列表触发地图联动： " + e);
            this.$refs.map.showPoint1(e);
        },
        handleMarkerClick(e) {
            var _this = this;
            // console.log("地图触发列表联动： " + e);
            // this.btnZbdw(e);
            //地图点击 左侧人员 高亮 右侧人员定位
            // item.status = !item.status;
            //其他变为false,
            this.ymDataInfo.forEach(function(it) {
                if (e.dataId != it.dataId) {
                    it.status = false;
                } else {
                    it.status = true;
                    _this.highlightPoint = it;
                }
            });
        },

        showTips(data) {
            //打开对话框
            window.ljd = data;
            var map = this.$refs.map.map;
            const pt = new window.BMap.Point(data.longitude, data.latitude);
            map.centerAndZoom(pt, map.getZoom());
            // var newstr = "23";

            var lx_zh = [];
            var lx = [];

            for (var item of data.item) {
                if (lx_zh.indexOf(item.dataType) == -1)
                    lx_zh.push(item.dataType);
                if (lx.indexOf(item.dataType) == -1) lx.push(item.dataType);
            }

            const infoWindow = new window.BMap.InfoWindow(
                "地址:" +
                    data.place +
                    "<br><br>" +
                    "事件频次:" +
                    data.item.length +
                    "&nbsp&nbsp<input type='button' style='border:1px solid #1490FF;color:#1490FF' value='查看详情' data-item='' onclick=' window.showPop()'>",
                // "事件频次:" + curpoint.item.length,
                {
                    //  <kr-icon
                    //     class="kjpic"
                    //     :icon="item.img"
                    //     :size="16"
                    //     :color="item.color"
                    // ></kr-icon>
                    // title: "<img src=''>", //data.img
                    enableMessage: false, //设置不允许信息窗发送短息
                    width: 120, // 信息窗口宽度
                    height: 80 // 信息窗口高度
                }
            );

            map.openInfoWindow(infoWindow, pt);

            // console.log("1111111111111111111111111", data);
            // data.item;
        },
        showPop() {
            var allpoint = window.ljd.item;
            var lx_zh = [];
            var list = [];
            var ids = [];

            for (var item of allpoint) {
                ids.push(item.dataId);
                if (lx_zh.indexOf(item.dataType) == -1)
                    lx_zh.push(item.dataType);
                if (list.indexOf(item.value) == -1) {
                    list.push({ name: item.dataType, code: item.value });
                }
            }
            var dt = { dimensionList: lx_zh, ids: ids, list: list };
            this.$refs.detailInfo.isVisible = true;
            this.row = dt;
            //显示弹出框
        },

        handleBigScreen(isBigScreen) {
            //处理大屏幕
            // console.log("大屏： " + isBigScreen);
            this.$refs.map.map.enableAutoResize();
            if (!isBigScreen) {
                //折叠人员列表
                this.$refs.impPanel.hasAside = false;
                var fullDiv = document.getElementById("DSKmap");
                this.fullscreen(fullDiv);
            } else {
                this.$refs.impPanel.hasAside = true;
                this.fullscreen();
            }
        },
        //全屏
        fullscreen(div) {
            if (!div) {
                // 退出全屏
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                // 进入全屏
                if (div.requestFullscreen) {
                    div.requestFullscreen();
                } else if (div.webkitRequestFullScreen) {
                    div.webkitRequestFullScreen();
                } else if (div.mozRequestFullScreen) {
                    div.mozRequestFullScreen();
                } else if (div.msRequestFullscreen) {
                    div.msRequestFullscreen();
                }
            }
        },

        // handleClose(done) {
        //     this.dialogVisible = false;
        // },

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
                    response.data.saxxModels.forEach((item, i) => {
                        // item.color=colors[i].style.background;
                        item.color = DSK_COLOR[i];
                        item.gjindexs = [];
                        item.gjline = [];
                        item.status = false;
                    });
                    // console.log(response.data.saxxModels);
                    _this.sars = response.data.saxxModels;
                })
                .catch(() => {
                    // this.loading = false;
                    _this.sars = [];
                });
        },

        search(item) {
            item.status = !item.status;

            // this.getDWDGX();
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
                })
                .catch(() => {
                    _this.sjlxdata = [];
                });
        },
        getBSData() {
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
            //构造时间段数据 this.sjddata
            var sjd = [];
            this.sjddata.forEach(element => {
                _this.bstj.forEach(e => {
                    if (element.name == e) {
                        sjd.push(element.value);
                    }
                });
            });
            //构造伴随人员信息
            var bsperson = [];
            this.checkedsarsinfo.forEach(element => {
                if (element.zjhm != _this.$refs.keypersonnelselect.keyperson) {
                    bsperson.push(element.zjhm);
                }
            });
            this.query = {
                beginTime:
                    this.$refs.map.datesj_time == "" ||
                    this.$refs.map.datesj_time == null
                        ? ""
                        : this.$refs.map.datesj_time[0] || "2020-06-01",
                // dabh: this.dabh || "84646445c6fe11ea82f0",
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                distance: this.input_jgjl,
                finishTime:
                    this.$refs.map.datesj_time == "" ||
                    this.$refs.map.datesj_time == null
                        ? ""
                        : this.$refs.map.datesj_time[1] || "2020-09-30",
                intervalsTime: this.input_jgsj,
                // idCards: person,
                masterIdCard: this.$refs.keypersonnelselect.keyperson,
                slaverIdCards: bsperson,
                types: sjlx.toString()
            };
            getAccompanyData(this.query)
                .then(response => {
                    // console.log(response);
                    //处理地图相关点 主对象和伴随对象点
                    if (response.data.allMap.length == 0) {
                        this.$message("未查询到主对象相关空间轨迹轴信息！");
                        // return;
                    } else {
                        var allpoint = [];
                        for (let i = 0; i < response.data.allMap.length; i++) {
                            for (
                                let j = 0;
                                j < response.data.allMap[i].items.length;
                                j++
                            ) {
                                // this.mapPoint.push({...response.data.allMap[i].items[j],value});
                                //添加图片位置字段
                                switch (
                                    response.data.allMap[i].items[j].value
                                ) {
                                    case "01":
                                        response.data.allMap[i].items[j].img =
                                            "icon-qiche1";
                                        break;
                                    case "02":
                                        response.data.allMap[i].items[j].img =
                                            "icon-gaosu";
                                        break;
                                    case "03":
                                        response.data.allMap[i].items[j].img =
                                            "icon-gaosu";
                                        break;
                                    case "04":
                                        response.data.allMap[i].items[j].img =
                                            "icon-tubiaozhizuomoban_feiji";
                                        break;
                                    case "05":
                                        response.data.allMap[i].items[j].img =
                                            "icon-huoche";
                                        break;
                                    case "06":
                                        response.data.allMap[i].items[j].img =
                                            "icon-piaoju";
                                        break;
                                    case "07":
                                        response.data.allMap[i].items[j].img =
                                            "icon-jiudian1";
                                        break;
                                    case "08":
                                        response.data.allMap[i].items[j].img =
                                            "icon-touziyixiangyuce";
                                        break;
                                    case "09":
                                        response.data.allMap[i].items[j].img =
                                            "icon-qiandai";
                                        break;
                                    default:
                                        response.data.allMap[i].items[j].img =
                                            "icon-qiakoushexiangtou";
                                    // break;
                                }
                                allpoint.push(response.data.allMap[i].items[j]);
                            }
                        }
                        var allpoint_copy = cloneDeep(allpoint);

                        // allpoint.pop();

                        for (let k = 0; k < allpoint_copy.length; k++) {
                            for (
                                let l = 0;
                                l < response.data.allMap.length;
                                l++
                            ) {
                                // console.log(1);
                                if (
                                    allpoint_copy[k].longitude ==
                                        response.data.allMap[l].longitude &&
                                    allpoint_copy[k].latitude ==
                                        response.data.allMap[l].latitude
                                ) {
                                    allpoint_copy[k].item = [];
                                    allpoint_copy[k].item =
                                        response.data.allMap[l].items;
                                }
                            }
                        }
                        this.ls_mapPoint = cloneDeep(allpoint_copy);

                        // this.mapPoint = allpoint_copy;
                    }
                    // if (response.data.slaver.length == 0) {
                    //     this.$message("未查询到伴随对象相关空间轨迹轴信息！");
                    //     // return;
                    // } else {
                    //     var allpoint_bs = [];
                    //     for (let i = 0; i < response.data.master.length; i++) {
                    //         for (
                    //             let j = 0;
                    //             j < response.data.master[i].items.length;
                    //             j++
                    //         ) {
                    //             // this.mapPoint.push({...response.data.master[i].items[j],value});
                    //             //添加图片位置字段
                    //             switch (
                    //                 response.data.master[i].items[j].value
                    //             ) {
                    //                 case "01":
                    //                     response.data.master[i].items[j].img =
                    //                         "icon-qiche1";
                    //                     break;
                    //                 case "02":
                    //                     response.data.master[i].items[j].img =
                    //                         "icon-gaosu";
                    //                     break;
                    //                 case "03":
                    //                     response.data.master[i].items[j].img =
                    //                         "icon-gaosu";
                    //                     break;
                    //                 case "04":
                    //                     response.data.master[i].items[j].img =
                    //                         "icon-tubiaozhizuomoban_feiji";
                    //                     break;
                    //                 case "05":
                    //                     response.data.master[i].items[j].img =
                    //                         "icon-huoche";
                    //                     break;
                    //                 case "06":
                    //                     response.data.master[i].items[j].img =
                    //                         "icon-piaoju";
                    //                     break;
                    //                 case "07":
                    //                     response.data.master[i].items[j].img =
                    //                         "icon-jiudian1";
                    //                     break;
                    //                 case "08":
                    //                     response.data.master[i].items[j].img =
                    //                         "icon-touziyixiangyuce";
                    //                     break;
                    //                 case "09":
                    //                     response.data.master[i].items[j].img =
                    //                         "icon-qiandai";
                    //                     break;
                    //                 default:
                    //                     response.data.master[i].items[j].img =
                    //                         "icon-qiakoushexiangtou";
                    //                 // break;
                    //             }
                    //             allpoint_bs.push(
                    //                 response.data.master[i].items[j]
                    //             );
                    //         }
                    //     }
                    //     var allpoint_copy_bs = cloneDeep(allpoint_bs);

                    //     // allpoint.pop();

                    //     for (let k = 0; k < allpoint_copy_bs.length; k++) {
                    //         for (
                    //             let l = 0;
                    //             l < response.data.master.length;
                    //             l++
                    //         ) {
                    //             console.log(1);
                    //             if (
                    //                 allpoint_copy_bs[k].longitude ==
                    //                     response.data.master[l].longitude &&
                    //                 allpoint_copy_bs[k].latitude ==
                    //                     response.data.master[l].latitude
                    //             ) {
                    //                 allpoint_copy_bs[k].item = [];
                    //                 allpoint_copy_bs[k].item =
                    //                     response.data.master[l].items;
                    //             }
                    //         }
                    //     }
                    //     this.ls_mapPoint_bs = cloneDeep(allpoint_copy_bs);

                    //     // this.mapPoint = [...allpoint_copy_bs, ...this.mapPoint];
                    // }
                    this.mapPoint = allpoint_copy;

                    //处理时间线
                    if (response.data.timeLine.length == 0) {
                        this.$message("未查询到相关时间线信息！");
                        // return;
                    }
                    // for (let item of response.data.timeLine) {

                    // }
                    //添加颜色字段
                    for (let i = 0; i < response.data.timeLine.length; i++) {
                        response.data.timeLine[i].status = false;
                        for (let j = 0; j < _this.checkedsarsinfo.length; j++) {
                            if (
                                response.data.timeLine[i].identifier ==
                                _this.checkedsarsinfo[j].zjhm
                            ) {
                                response.data.timeLine[i].color =
                                    _this.checkedsarsinfo[j].color;
                            }
                        }
                        //添加图片位置字段
                        switch (response.data.timeLine[i].value) {
                            case "01":
                                response.data.timeLine[i].img = "icon-qiche1";
                                break;
                            case "02":
                                response.data.timeLine[i].img = "icon-gaosu";
                                break;
                            case "03":
                                response.data.timeLine[i].img = "icon-gaosu";
                                break;
                            case "04":
                                response.data.timeLine[i].img =
                                    "icon-tubiaozhizuomoban_feiji";
                                break;
                            case "05":
                                response.data.timeLine[i].img = "icon-huoche";
                                break;
                            case "06":
                                response.data.timeLine[i].img = "icon-piaoju";
                                break;
                            case "07":
                                response.data.timeLine[i].img = "icon-jiudian1";
                                break;
                            case "08":
                                response.data.timeLine[i].img =
                                    "icon-touziyixiangyuce";
                                break;
                            case "09":
                                response.data.timeLine[i].img = "icon-qiandai";
                                break;
                            default:
                                response.data.timeLine[i].img = "icon-qiche1";
                            // break;
                        }
                    }

                    // console.log(11);
                    _this.ls_ymDataInfo = cloneDeep(response.data.timeLine);
                    _this.ymDataInfo = response.data.timeLine;

                    //处理统计列表
                    if (response.data.statisticsList.length == 0) {
                        this.$message("未查询到相关列表信息！");
                        // return;
                    }
                    for (let i in response.data.statisticsList) {
                        response.data.statisticsList[i].xh = parseInt(i) + 1;
                    }
                    // _this.pageData = response.data.statisticsList;
                    // _this.total = response.data.total;
                    _this.table = response.data.statisticsList;
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

        sortChange({ order }) {
            if (order == "ascending") {
                // this.table = this.table.sort((a, b) => a.time - b.time);
                this.table = this.table.sort(function(a, b) {
                    return (
                        Date.parse(a.time.replace(/-/g, "/")) -
                        Date.parse(b.time.replace(/-/g, "/"))
                    );
                });
            } else if (order == "descending") {
                // this.table = this.table.sort((a, b) => b.time - a.time);
                this.table = this.table.sort(function(a, b) {
                    return (
                        Date.parse(b.time.replace(/-/g, "/")) -
                        Date.parse(a.time.replace(/-/g, "/"))
                    );
                });
            }
            // this.getLjdTj();
            this.getTablePage();
        },
        getTablePage() {
            let start = (this.current - 1) * this.pageSize;
            let end = this.current * this.pageSize;
            if (!this.table[end]) {
                end = this.table.length;
            }
            this.pageData = this.table.slice(start, end);
        },
        onPageChange(current, size) {
            this.current = current;
            this.size = size;
            this.getTablePage();
        },
        lookDetails(row) {
            // var _this = this;
            // this.query = {
            //     dataIds: row.ids,
            //     pageNum: 1,
            //     pageSize: 20,
            //     type: "string"
            // };
            // getDetialForAccompany(this.query)
            //     .then(response => {})
            //     .catch(() => {
            //         // this.loading = false;
            //     });

            var lx_zh = [];

            for (var item of row.accompanyTypes) {
                if (lx_zh.indexOf(item.name) == -1) lx_zh.push(item.name);
            }
            var dt = {
                dimensionList: lx_zh,
                ids: row.ids,
                list: row.accompanyTypes,
                query: this.query,
                row: row
            };
            this.$refs.detailInfo.isVisible = true;
            this.row = dt;
        },
        getDetail() {}
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

        // this.getZysjList();
        // this.getGjlxList();
    },
    mounted() {
        window.showSingalTips = this.showTips;
        window.showPop = this.showPop;
    }
};
</script>

<style type="text/scss" lang="scss" scoped>
@import "@/styles/basic-color.scss";

.showfxtj {
    // -webkit-transform: translate3d(0, -380px, 0);
    // transform: translate3d(0, -380px, 0);
    // transition: transform 0.8s;
    // transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    -webkit-transition: -webkit-transform 0.8s;
    transition: transform 0.8s;
    -webkit-transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
    transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
}

.noshowfxtj {
    // -webkit-transform: translate3d(0, -380px, 0);
    // transform: translate3d(0, -380px, 0);
    // transition: transform 0.8s;
    // transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
    -webkit-transform: translate3d(0, -380px, 0);
    transform: translate3d(0, -380px, 0);
    -webkit-transition: -webkit-transform 0.8s;
    transition: transform 0.8s;
    -webkit-transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
    transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
}

.el-pagination {
    float: right;
    margin-top: 15px;
}
.el-input-number {
    width: 120px;
}
.content {
    // margin-top: 20px;
    /* height: calc(100% - 20px); */
    /* height: calc(100% - 60px); */
}

.toolbar {
    // background: red;
    // right: 20px;
    width: 100%;
    // height: 100px;
    // position: absolute;
    // width: calc(100% - 200px);
    z-index: 10;
    // margin-bottom: 20px;
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
.el-tag + .el-tag {
    // margin-top: 10px;
}
.el-tag {
    margin-left: 10px;
    margin-bottom: 10px;
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
    // -webkit-transform: translate3d(0, 0, 0);
    // transform: translate3d(0, 0, 0);
    // transition: transform 0.8s;
    // transition-timing-function: cubic-bezier(0.7, 0, 0.3, 1);
    // transition: display 2s;
    // transition: all 0.4s ease-in-out;
    // transform: translateY(100%);
    // box-shadow: -1px 1px 2px #888888;
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

.sjlx {
    width: 101px;
    height: 32px;
    line-height: 32px;
    background: #e3e6f8;
}
.sjlx_select {
    background: $color-primary;
}
.sjlx {
}

.timediv {
    height: 35px;
    padding-left: 10px;
    cursor: pointer;
    position: relative;
    top: -5px;
}
.eventdiv {
    height: 120px;
    padding-left: 10px;
    width: 90%;
}
.eventdiv_event {
    /* height: 50px; */
    margin-left: -20px;
    background: $color-primary;
    color: white;
    height: 40px;
    width: 80px;
    border-radius: 5px;
    text-align: center;
    line-height: 40px;
}

// $height: 70px;
.dskmap {
    display: flex;
    // height: 100%;
    height: calc(100% - 100px);
    // height: calc(100% - #{$height});
}
.dskmap_isfull {
    height: calc(100% - 60px);
}
.dskmap-left {
    // flex-basis: 240px;
    flex-basis: 200px;
}
.dskmap-right {
    flex: 1;
    height: 100%;
}

.timelb {
    // margin-top: 20px;
    // overflow-y: auto;
    height: calc(100% - 2px);
}

#tab_sjkj {
    /deep/ {
        .el-tabs__content {
            height: calc(100% - 41px);
        }
    }
}
#tab_sjkj {
    /deep/ {
        .el-tab-pane {
            // height: calc(100% - 41px);
            height: 100%;
        }
    }
}

#tab_sjkj {
    /deep/ {
        #pane-second {
            // height: calc(100% - 41px);
            display: block !important; // element 的tab 控件对地图有影响去掉此样式
        }
    }
}
.primaryColor {
    color: $color-primary;
}
.toolbar {
    /deep/ .el-divider--horizontal {
        margin: 5px 0;
    }
}

//地图左侧时间线开始

$jj_ny_content: 50px;
$jj_content_content: 50px;
//事件线控件区域
.eventlinekjqy {
    // margin-left: 10px;
    // padding-left: 10px;
    // height: 500px;
    // overflow-y: scroll;
    // overflow-y: auto;
}
.eventlinechild {
    /* min-height: 300px; */
    display: flex;
    padding: 0px 20px;
}
.child_point {
    border-radius: 5px;
    height: 8px;
    width: 8px;
    // border: 1px solid #4d5252;
    // background-color: rgb(21, 214, 214);
    z-index: 2;
    position: relative;
    top: 6px;
    margin-left: -8px;
}
.child_line_ny {
    /* border: 1px solid rgb(21, 214, 214); */
    border: 1px solid #eee;
    margin-left: -5px;
    // margin-top: 8px;
    margin-bottom: -9px;
    height: $jj_ny_content; //年月和内容之间的间距
}
.child_line {
    border: 1px solid #eee;
    margin-left: -5px;
    // margin-top: 8px;
    margin-bottom: -9px;
    height: $jj_content_content; //内容和内容之间的间距
}

.child_content_ny {
    height: $jj_ny_content; //年月的高度
    padding-left: 10px;
}
.child_content {
    height: $jj_content_content; //内容的高度
    margin-left: 10px;
    padding-top: 4px;
    padding-bottom: 4px;
}
.currentryjd {
    // margin-left: -8px;
    color: $color-primary;
    background: #e5f4ff;
}
.currentrypoint {
    border: 2px solid $color-primary;
    background-color: white;
}

//地图左侧时间线结束
</style>
