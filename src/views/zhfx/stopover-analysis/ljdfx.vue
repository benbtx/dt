<template>
    <imp-panel ref="impPanel">
        <kr-analysis-page slot="body" titleA="列表统计" titleB="地图分析">
            <div
                slot="component-chart"
                style="padding:10px;height: calc(100% - 20px);"
            >
                <div class="toolbar">
                    <!-- :class="{ 'toolbar_zd': !isShowfxtj}" -->
                    <div class="fxtjhead">
                        <!-- <el-card class="box-card"> -->

                        <!-- <kr-section-title title="分析条件" :size="18"></kr-section-title> -->

                        <div
                            style="margin-left: 40px;margin-top:20px;display:flex"
                        >
                            <div style="flex-basis: 100px;">分析条件 ：</div>
                            <div style="width:80%">
                                <el-tag
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

                        <!-- </el-card> -->
                    </div>
                    <div class="fxtjbox" v-show="isShowfxtj">
                        <div class="tj">
                            <kr-section-title
                                title="时段选择"
                                :size="18"
                            ></kr-section-title>

                            <el-checkbox-group
                                ref="sd"
                                style="margin:20px 0px"
                                v-model="checkedSJD"
                            >
                                <!-- :label="{'value':item.value,'name':item.name,}" -->
                                <!-- :label="item.name" -->
                                <template v-for="item in sjddata">
                                    <el-checkbox
                                        style="margin-bottom:10px"
                                        v-if="item.name != '自定义'"
                                        :label="item.name"
                                        :key="item.value"
                                        >{{ item.name }}</el-checkbox
                                    >
                                    <el-checkbox
                                        style="margin-bottom:10px"
                                        v-else
                                        ref="zdysj"
                                        :label="item.name"
                                        :key="item.value"
                                        >{{ item.name }}
                                        <el-time-picker
                                            style="width:180px"
                                            size="mini"
                                            value-format="HH:mm"
                                            is-range
                                            v-model="zdytime"
                                            range-separator="-"
                                            start-placeholder="开始时间"
                                            end-placeholder="结束时间"
                                            placeholder="选择时间范围"
                                        >
                                        </el-time-picker>
                                    </el-checkbox>
                                </template>
                                <!-- <el-checkbox v-for="item in sjddata"  :label="item.name" :key="item.value">{{item.name}}</el-checkbox> -->
                            </el-checkbox-group>
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
                            :bigScreenBtn="true"
                            :markerNumber="true"
                            :isLine="false"
                            :isShowDatePick="true"
                            :isShowSearch="true"
                            :markerClick="true"
                            :ryinfo="checkedsarsinfo"
                            @changeInput="changeInput($event)"
                            @timeChange="timeChange"
                            @selectChange="selectChange($event)"
                            @handleBigScreen="handleBigScreen($event)"
                            @handleMarkerClick="handleMarkerClick($event)"
                        ></kr-map>
                    </div>
                </div>
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
            @startAnalysis="startAnalysis($event)"
            @clearAll="clearAll"
            :all="sars"
            :isPerson="true"
            slot="aside"
            :max="100"
            @search="searchPerson"
        ></kr-choose>
        <detail-info slot="body" ref="detailInfo" :row="row" />
    </imp-panel>
</template>
<script type="text/babel">
import {
    getSdxx,
    getType,
    getZysj,
    getTackTypes,
    // getNyInfo,
    // getInfobyny,
    getTimeLine,
    // getTrackTimeLine,
    getPosition,
    getLJDStatistics,
    // getTrack,
    getSAObjectByDABH
} from "@/api/zhfx/stopover-analysis";
import { cloneDeep } from "loadsh";

// import panel from "../../../components/common/panel.vue";
import { DSK_COLOR } from "@/config/index.js";
import detailInfo from "./detail-info";
import timeLine from "./time-line";

export default {
    // mixins: [ treeter ],
    components: {
        // "imp-panel": panel,
        detailInfo,
        timeLine
        // "kr-map": krmap

        // 'el-select-tree': selectTree
    },
    data() {
        const $shelf = this;
        return {
            // tags: [
            //     // { name: "标签一", type: "" },
            //     // { name: "标签二", type: "success" },
            // ],
            zdytime: ["10:40", "11:40"],
            // tags_copy: [],
            checkAll: false,
            isIndeterminate: true,

            checkedSJD: [], //时间段
            checkedSJLX: [], //事件类型事件类型//默认全选中
            checkedSJD_copy: [], //时间段
            checkedSJLX_copy: [], //事件类型事件类型//默认全选中
            // table: [],
            // current: 1,
            total: 0,
            pageData: [],
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
                    title: "姓名",
                    width: 120,
                    // sortable: true,
                    key: "name"
                },
                {
                    title: "身份证号",
                    key: "idCard"
                },
                {
                    title: "事件频次",
                    sortable: true,
                    key: "count"
                },
                {
                    title: "地址",
                    key: "address"
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
            size: 10, //列表当前pagesize
            page: 1, //列表当前pagenum
            sortName: "count",
            sortRule: "DESC",

            // pageSize: 10,

            // rows: {},
            row: {}, //detail info 组建传值

            historyTabe: [],
            isShowfxtj: false,
            query: null,
            dabh: "",
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
            mapPoint: [
                //     {
                //         id:'1',
                //         longitude: 114.001,
                //         latitude: 22.55,
                //         value_: 0,
                //         time: "2019-08-21 09:21:20",
                //         num: "c093a3d182b911eabf9a0242ac110002",
                //         name: "刘某",
                //         color: "blue",
                //         infowindow:'时间：2019-08-21 09:21:20<br>时长：10<br>地点：XXXXX<br>',
                //     },
                //     {
                //         id:'2',
                //         longitude: 114.0143,
                //         latitude: 22.55,
                //         value_: 1,
                //         time: "2019-08-21 09:21:20",
                //         num: "c095f6a882b911eabf9a0242ac110002",
                //         name: "3513",
                //         color: "green",
                //         infowindow:'时间：2019-08-21 09:21:20<br>时长：10<br>地点：XXXXX<br>',
                //     },
            ],
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

            // dskfx_time: "",

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

            // ymdataInfo: [

            //     {
            //         year: "2020",
            //         month: "9",

            //         status: false,
            //         points:[{
            //             name:'张三',
            //             date: " 13 13:35:26 ",
            //             info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //         },{
            //             name:'张三',
            //             date: " 13 13:35:26 ",
            //             info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //         },{
            //             name:'张三',
            //             date: " 13 13:35:26 ",
            //             info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //         }],
            //     },

            //     // {
            //     //     name:'张三',
            //     //     date: " 13 13:35:26 ",
            //     //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //     //     year: "2020",
            //     //     month: "9",
            //     //     status: false,
            //     // },
            //     // {
            //     //     name:'张三',
            //     //     date: " 13 13:35:26 ",
            //     //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //     //     year: "2020",
            //     //     month: "9",
            //     //     status: false,
            //     // },
            //     // {
            //     //     name:'张三',
            //     //     date: " 13 13:35:26 ",
            //     //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //     //     year: "2020",
            //     //     month: "9",
            //     //     status: false,
            //     // },{
            //     //     name:'张三',
            //     //     date: " 13 13:35:26 ",
            //     //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //     //     year: "2020",
            //     //     month: "9",
            //     //     status: false,
            //     // }

            //     // {
            //     //     year: "2020",
            //     //     month: "8",
            //     //     value: "",
            //     //     status: false
            //     // },
            //     // {
            //     //     year: "2020",
            //     //     month: "7",
            //     //     value: "",
            //     //     status: false
            //     // },
            //     // {
            //     //     year: "2019",
            //     //     month: "8",
            //     //     value: "",
            //     //     status: false
            //     // },
            //     // {
            //     //     year: "2019",
            //     //     month: "7",
            //     //     value: "",
            //     //     status: false
            //     // }

            //     // {
            //     //    year:'2020',
            //     //    months:[9,8,7]
            //     // },{
            //     //    year:'2019',
            //     //    months:[9,8,7]
            //     // },
            // ],

            hascurrentjd: true,
            hasnojd: false,

            activeName: "first",
            gxlx: "PPTransfer", //人与人关系类型

            saryx: "",
            lxr: "",

            maxnum: 100000,
            minnum: 1,
            // sjdvalue: "",
            nr: "",
            yxh: "",
            startvalue: "",
            endvalue: "",

            loading: false,
            archiveNum: "1", //档案编号
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
            ],

            selectIconDialog: false,
            formLabelWidth: "100px",
            defaultProps: {
                children: "children",
                label: "value",
                id: "id"
            },
            maxId: 7000000,
            menuTree: [],
            form: {
                id: null,
                name: "",
                sort: 0,
                icon: "",
                href: "",
                isShow: "",
                delivery: false,
                parentId: null,
                desc: ""
            },

            currentRow: {},
            dialogVisible: false,
            dialogLoading: false,

            roleTree: [],
            listLoading: false,
            searchKey: "",
            typeId: ""
            // tableData: {
            //     pagination: {
            //         total: 0,
            //         pageNo: 1,
            //         pageSize: 10,
            //         parentId: 0
            //     },
            //     rows: []
            // },
            // jdform: {
            //     code: null,
            //     description: "",
            //     parent: -1,
            //     id: -1
            // }
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
        }
    },
    computed: {
        tags: {
            get: function() {
                return [...this.checkedSJD, ...this.checkedSJLX];
            },
            set: function(deleteValue) {
                // deleteValue;
                // this.sjlxdata;
                // this.sjdvalue;
                // this.checkedSJD;
                // this.checkedSJLX;
                var sjd = this.checkedSJD.filter(value => {
                    return value != deleteValue;
                });
                this.checkedSJD = sjd;
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
        handleClose(tag) {
            // var tags = this.tags.filter(value => {
            //     return value != tag;
            // });
            // console.log(tags);
            //当前删除的元素
            this.tags = tag;

            //条件改变自动重新加载数据
            this.startAnalysis();
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
        timeChange() {
            //条件改变自动重新加载数据
            this.startAnalysis();
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
            this.checkedSJD = this.checkedSJD_copy;
            this.checkedSJLX = this.checkedSJLX_copy;
        },
        // 开始分析
        startAnalysis() {
            // console.log("开始分析");
            // var _this = this;
            //获取当前选择人员的轨迹信息 mapPoint{name:'刘某',points},{name:'3513',points}
            //人员信息增加 ‘显示轨迹按钮’，点击地图上显示那个时间轴拖动 ，再次点击关闭，切换人员点击则传入相应坐标
            //传值给map 对象

            // if (this.dskfx_time == "") {
            //     this.$message("请选择开始日期和结束日期！");
            //     return;
            // }
            // this.$refs.map.datesj_time
            // this.$refs.map.$refs.datesj.value

            this.isShowfxtj = false;

            if (
                this.$refs.map.datesj_time == null ||
                this.$refs.map.datesj_time == ""
            ) {
                this.$message("请选择开始日期和结束日期！");
                return;
            }
            if (this.$refs.personChoose.checkedPersons.length == 0) {
                this.$message("请选择人员对象！");
                return;
            }

            // if (this.checkedsars.length == 0) {
            //     this.$message("请选择对象！");
            //     return;
            // }
            // if (person.length == 0) {
            //     this.$message("请选择对象！");
            //     return;
            // }
            //构造 checkedsarsinfo
            // _this.checkedsarsinfo = [];
            // this.sars.forEach(element => {
            //     if (_this.checkedsars.toString().search(element.identifier) > -1) {
            //         _this.checkedsarsinfo.push(element);
            //     }
            // });
            this.checkedsarsinfo = this.$refs.personChoose.checkedPersons; //person;

            //获取时间轴年月 ,默认选择最新一个月数据
            // this.getNyList();

            this.getLjdTimeLine();
            // this.getGjTimeLine();

            this.getLjdPosition();

            this.getLjdTj();
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
                    list.push({ name: item.dataType, value: item.value });
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
            // if (location.href.search("=") != -1) {
            //     this.query = { dabh: location.href.split("=")[1] };
            // } else {
            //     this.$message("未传入案件编号！");
            //     return;
            // }
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

        getSjdList() {
            // this.loading = true;
            var _this = this;
            this.sjddata = [];
            getSdxx()
                .then(response => {
                    // this.loading = false;
                    for (var item of response.data) {
                        item.status = true;
                        _this.checkedSJD.push(item.name);
                    }
                    _this.checkedSJD_copy = cloneDeep(_this.checkedSJD);

                    // _this.tags_copy = [..._this.checkedSJD, ..._this.tags_copy];
                    // _this.sjddata = response.data;
                    _this.sjddata = [
                        ...response.data,
                        { name: "自定义", value: "007" }
                    ];
                })
                .catch(() => {
                    // this.loading = false;
                    _this.sjddata = [];
                });
        },
        getsjlxList() {
            var _this = this;
            this.sjlxdata = [];
            getType()
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
        getZysjList() {
            var _this = this;
            this.zysjoptions = [];
            this.sjdoptions = [];
            this.query = {
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm
            };
            getZysj(this.query)
                .then(response => {
                    _this.zysjoptions = response.data.importantTimes;
                    _this.sjdoptions = response.data.intervals;
                    if (
                        response.data.importantTimes.length == 0 ||
                        response.data.intervals.length == 0
                    ) {
                        return;
                    }
                    _this.zysjvalue =
                        response.data.importantTimes[0].importantTimeId;

                    _this.sjdvalue = response.data.intervals[0].intervalId;
                })
                .catch(() => {
                    _this.zysjoptions = [];
                    _this.sjdoptions = [];
                });
        },
        getGjlxList() {
            var _this = this;
            this.selectOptions.options = [];
            getTackTypes()
                .then(response => {
                    _this.selectOptions.options = response.data;
                })
                .catch(() => {
                    _this.selectOptions.options = [];
                });
        },

        getLjdTimeLine() {
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
                _this.checkedSJD.forEach(e => {
                    if (element.name == e && element.name != "自定义") {
                        sjd.push(element.value);
                    }
                });
            });
            //构造人员信息
            var person = [];
            this.checkedsarsinfo.forEach(element => {
                person.push({
                    idCards: element.zjhm,
                    logo: "01"
                });
            });
            this.query = {
                beginTime:
                    this.$refs.map.datesj_time == "" ||
                    this.$refs.map.datesj_time == null
                        ? ""
                        : this.$refs.map.datesj_time[0],
                // dabh: this.dabh || "84646445c6fe11ea82f0",
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                finishTime:
                    this.$refs.map.datesj_time == "" ||
                    this.$refs.map.datesj_time == null
                        ? ""
                        : this.$refs.map.datesj_time[1] || "2020-09-30",
                // "idCards": [
                //     {
                //     "idCards":"792892196811231931",
                //     "logo":"01"
                //     }
                // ],
                idCards: person,
                // importantTimeId: this.zysjvalue,
                // intervalId: this.sjdvalue,
                types: sjlx.toString(),
                timesInterval: sjd.toString(),
                customPeriod: this.$refs.zdysj[0].isChecked
                    ? this.zdytime[0] + "to" + this.zdytime[1]
                    : ""
                // trackTypeCodes: this.tracktype.toString()
            };
            getTimeLine(this.query)
                .then(response => {
                    if (response.data.length == 0) {
                        this.$message("未查询到相关空间轨迹轴信息！");
                        // return;
                    }
                    for (var item of response.data) {
                        item.status = false;
                    }
                    //添加颜色字段
                    for (var i = 0; i < response.data.length; i++) {
                        for (var j = 0; j < _this.checkedsarsinfo.length; j++) {
                            if (
                                response.data[i].identifier ==
                                _this.checkedsarsinfo[j].zjhm
                            ) {
                                response.data[i].color =
                                    _this.checkedsarsinfo[j].color;
                            }
                        }
                        //添加图片位置字段
                        // switch (response.data[i].value) {
                        //     case "01":
                        //         // response.data[i].img=require('../../assets/image/kakou16.png');
                        //         response.data[i].img = "icon-qiakoushexiangtou";
                        //         break;
                        //     case "02":
                        //         response.data[i].img = "icon-qiakoushexiangtou";
                        //         break;
                        //     case "03":
                        //         response.data[i].img = "icon-qiakoushexiangtou";
                        //         break;
                        //     case "04":
                        //         response.data[i].img =
                        //             "icon-tubiaozhizuomoban_feiji";
                        //         break;
                        //     case "05":
                        //         response.data[i].img = "icon-huoche";
                        //         break;
                        //     case "06":
                        //         response.data[i].img = "icon-qiakoushexiangtou";
                        //         break;
                        //     case "07":
                        //         response.data[i].img = "icon-jiudian1";
                        //         break;
                        //     case "08":
                        //         response.data[i].img = "icon-qiakoushexiangtou";
                        //         break;
                        //     case "09":
                        //         response.data[i].img = "icon-qiakoushexiangtou";
                        //         break;
                        //     default:
                        //         // response.data[i].img=require('../../assets/image/kakou16.png');
                        //         response.data[i].img = "icon-qiakoushexiangtou";
                        //         break;
                        // }
                        switch (response.data[i].value) {
                            case "01":
                                // response.data.items[i].img=require('../../assets/image/kakou48.png');
                                response.data[i].img = "icon-qiche1";
                                break;
                            case "02":
                                response.data[i].img = "icon-gaosu";
                                break;
                            case "03":
                                response.data[i].img = "icon-gaosu";
                                break;
                            case "04":
                                response.data[i].img =
                                    "icon-tubiaozhizuomoban_feiji";
                                break;
                            case "05":
                                response.data[i].img = "icon-huoche";
                                break;
                            case "06":
                                response.data[i].img = "icon-piaoju";
                                break;
                            case "07":
                                response.data[i].img = "icon-jiudian1";
                                break;
                            case "08":
                                response.data[i].img = "icon-touziyixiangyuce";
                                break;
                            case "09":
                                response.data[i].img = "icon-qiandai";
                                break;
                            default:
                                response.data[i].img = "icon-qiche1";
                            // break;
                        }
                    }

                    // console.log(11);
                    _this.ls_ymDataInfo = cloneDeep(response.data);
                    _this.ymDataInfo = response.data;
                })
                .catch(e => {
                    // console.log(e);
                    // _this.ymDataInfo = [
                    //     {
                    //         dataId: null,
                    //         eventTime: null,
                    //         identifier: null,
                    //         name: "2020-07",
                    //         title: null,
                    //         dataType: null,
                    //         longitude: null,
                    //         latitude: null,
                    //         status: false,
                    //         content: null,
                    //         value: null,
                    //         img: "icon-qiakoushexiangtou"
                    //     },
                    //     {
                    //         dataId: "d84e626af1cc49f5bb46432f372d88e9",
                    //         eventTime: "2020-07-15 16:27:55",
                    //         identifier: "792892196811231931",
                    //         name: "1931",
                    //         title: "出行-车辆卡口-川A 58323",
                    //         dataType: "出行-车辆卡口",
                    //         longitude: "104.08",
                    //         latitude: "30.71",
                    //         status: false,
                    //         content:
                    //             "过车时间:2020-07-15 16:27:55    车身颜色:-    卡口名称:卡口2892    车辆类型:-    车辆品牌:-    车辆型号:-",
                    //         value: "01",
                    //         img: "icon-qiakoushexiangtou"
                    //     },
                    //     {
                    //         dataId: "7453dcdfac034498acb5416c3783ba73",
                    //         eventTime: "2020-07-12 12:59:50",
                    //         identifier: "792892196811231931",
                    //         name: "1931",
                    //         title: "出行-高速公路-出口-",
                    //         dataType: "出行-高速公路-2020年后",
                    //         longitude: null,
                    //         latitude: null,
                    //         status: false,
                    //         content:
                    //             "过车时间:2020-07-12 12:59:50.0    车身颜色:-    收费站名称:收费站7439    车辆类型:-    车辆品牌:-    车辆型号:-",
                    //         value: "03",
                    //         img: "icon-qiakoushexiangtou"
                    //     },

                    //     {
                    //         dataId: null,
                    //         eventTime: null,
                    //         identifier: null,
                    //         name: "2020-06",
                    //         title: null,
                    //         dataType: null,
                    //         longitude: null,
                    //         latitude: null,
                    //         status: false,
                    //         content: null,
                    //         value: null,
                    //         img: "icon-qiakoushexiangtou"
                    //     },
                    //     {
                    //         dataId: "b502deee19844700a86e679dc90f149a",
                    //         eventTime: "2020-06-30 22:48:55",
                    //         identifier: "792892196811231931",
                    //         name: "1931",
                    //         title: "出行-车辆卡口-川A 58323",
                    //         dataType: "出行-车辆卡口",
                    //         longitude: "104.1",
                    //         latitude: "30.7",
                    //         status: false,
                    //         content:
                    //             "过车时间:2020-06-30 22:48:55    车身颜色:-    卡口名称:卡口3223    车辆类型:-    车辆品牌:-    车辆型号:-",
                    //         value: "01",
                    //         img: "icon-qiakoushexiangtou"
                    //     },

                    //     {
                    //         dataId: "d28451cf96454c70a8c6929e11c3ceca",
                    //         eventTime: "2020-06-19 10:54:42",
                    //         identifier: "792892196811231931",
                    //         name: "1931",
                    //         title: "出行-高速公路-出口-",
                    //         dataType: "出行-高速公路-2020年后",
                    //         longitude: null,
                    //         latitude: null,
                    //         status: false,
                    //         content:
                    //             "过车时间:2020-06-19 10:54:42.0    车身颜色:-    收费站名称:收费站6188    车辆类型:-    车辆品牌:-    车辆型号:-",
                    //         value: "03",
                    //         img: "icon-qiakoushexiangtou"
                    //     },

                    //     {
                    //         dataId: null,
                    //         eventTime: null,
                    //         identifier: null,
                    //         name: "2020-05",
                    //         title: null,
                    //         dataType: null,
                    //         longitude: null,
                    //         latitude: null,
                    //         status: null,
                    //         content: null,
                    //         value: null,
                    //         img: "icon-qiakoushexiangtou"
                    //     },
                    //     {
                    //         dataId: "1e43914bc069470093b1651dbfc36981",
                    //         eventTime: "2020-05-29 16:00:30",
                    //         identifier: "792892196811231931",
                    //         name: "1931",
                    //         title: "出行-车辆卡口-川A 58323",
                    //         dataType: "出行-车辆卡口",
                    //         longitude: "104.08",
                    //         latitude: "30.7",
                    //         status: false,
                    //         content:
                    //             "过车时间:2020-05-29 16:00:30    车身颜色:-    卡口名称:卡口8000    车辆类型:-    车辆品牌:-    车辆型号:-",
                    //         value: "01",
                    //         img: "icon-qiakoushexiangtou"
                    //     },
                    //     {
                    //         dataId: "fccd38df5e094728b89ac214dd939828",
                    //         eventTime: "2020-05-27 23:57:21",
                    //         identifier: "792892196811231931",
                    //         name: "1931",
                    //         title: "出行-高速公路-出口-",
                    //         dataType: "出行-高速公路-2020年后",
                    //         longitude: null,
                    //         latitude: null,
                    //         status: false,
                    //         content:
                    //             "过车时间:2020-05-27 23:57:21.0    车身颜色:-    收费站名称:收费站1218    车辆类型:-    车辆品牌:-    车辆型号:-",
                    //         value: "03",
                    //         img: "icon-qiakoushexiangtou"
                    //     },
                    //     {
                    //         dataId: "fccd38df5e094728b89ac214dd939828",
                    //         eventTime: "2020-05-27 23:26:21",
                    //         identifier: "792892196811231931",
                    //         name: "1931",
                    //         title: "出行-高速公路-入口-川A 58323",
                    //         dataType: "出行-高速公路-2020年后",
                    //         longitude: null,
                    //         latitude: null,
                    //         status: false,
                    //         content:
                    //             "过车时间:2020-05-27 23:26:21.0    车身颜色:-    收费站名称:收费站5778    车辆类型:-    车辆品牌:-    车辆型号:-",
                    //         value: "03",
                    //         img: "icon-qiakoushexiangtou"
                    //     }
                    // ];

                    _this.ymDataInfo = [];
                });
        },
        getLjdPosition() {
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
                _this.checkedSJD.forEach(e => {
                    if (element.name == e && element.name != "自定义") {
                        sjd.push(element.value);
                    }
                });
            });
            //构造人员信息
            var person = [];
            this.checkedsarsinfo.forEach(element => {
                person.push({
                    idCards: element.zjhm,
                    logo: "01"
                });
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
                finishTime:
                    this.$refs.map.datesj_time == "" ||
                    this.$refs.map.datesj_time == null
                        ? ""
                        : this.$refs.map.datesj_time[1] || "2020-09-30",
                // "idCards": [
                //     {
                //     "idCards":"792892196811231931",
                //     "logo":"01"
                //     }
                // ],
                idCards: person,
                // importantTimeId: this.zysjvalue,
                // intervalId: this.sjdvalue,
                types: sjlx.toString(),
                timesInterval: sjd.toString(),
                customPeriod: this.$refs.zdysj[0].isChecked
                    ? this.zdytime[0] + "to" + this.zdytime[1]
                    : ""
                // trackTypeCodes: this.tracktype.toString()
            };
            getPosition(this.query)
                .then(response => {
                    // console.log(response);
                    if (response.data.length == 0) {
                        this.$message("未查询到相关地图轨迹点信息！");
                        return;
                    }

                    var allpoint = [];
                    for (var i = 0; i < response.data.length; i++) {
                        for (
                            var j = 0;
                            j < response.data[i].items.length;
                            j++
                        ) {
                            // this.mapPoint.push({...response.data[i].items[j],value});
                            //添加图片位置字段
                            // switch (response.data[i].items[j].value) {
                            //     case "01":
                            //         // response.data[i].img=require('../../assets/image/kakou16.png');
                            //         response.data[i].items[j].img =
                            //             "icon-qiakoushexiangtou";
                            //         break;
                            //     case "02":
                            //         response.data[i].items[j].img =
                            //             "icon-qiakoushexiangtou";
                            //         break;
                            //     case "03":
                            //         response.data[i].items[j].img =
                            //             "icon-qiakoushexiangtou";
                            //         break;
                            //     case "04":
                            //         response.data[i].items[j].img =
                            //             "icon-tubiaozhizuomoban_feiji";
                            //         break;
                            //     case "05":
                            //         response.data[i].items[j].img =
                            //             "icon-huoche";
                            //         break;
                            //     case "06":
                            //         response.data[i].items[j].img =
                            //             "icon-qiakoushexiangtou";
                            //         break;
                            //     case "07":
                            //         response.data[i].items[j].img =
                            //             "icon-jiudian1";
                            //         break;
                            //     case "08":
                            //         response.data[i].items[j].img =
                            //             "icon-qiakoushexiangtou";
                            //         break;
                            //     case "09":
                            //         response.data[i].items[j].img =
                            //             "icon-qiakoushexiangtou";
                            //         break;
                            //     default:
                            //         // response.data[i].img=require('../../assets/image/kakou16.png');
                            //         response.data[i].items[j].img =
                            //             "icon-qiakoushexiangtou";
                            //         break;
                            // }
                            switch (response.data[i].items[j].value) {
                                case "01":
                                    // response.data.items[i].img=require('../../assets/image/kakou48.png');
                                    response.data[i].items[j].img =
                                        "icon-qiche1";
                                    break;
                                case "02":
                                    response.data[i].items[j].img =
                                        "icon-gaosu";
                                    break;
                                case "03":
                                    response.data[i].items[j].img =
                                        "icon-gaosu";
                                    break;
                                case "04":
                                    response.data[i].items[j].img =
                                        "icon-tubiaozhizuomoban_feiji";
                                    break;
                                case "05":
                                    response.data[i].items[j].img =
                                        "icon-huoche";
                                    break;
                                case "06":
                                    response.data[i].items[j].img =
                                        "icon-piaoju";
                                    break;
                                case "07":
                                    response.data[i].items[j].img =
                                        "icon-jiudian1";
                                    break;
                                case "08":
                                    response.data[i].items[j].img =
                                        "icon-touziyixiangyuce";
                                    break;
                                case "09":
                                    response.data[i].items[j].img =
                                        "icon-qiandai";
                                    break;
                                default:
                                    response.data[i].items[j].img =
                                        "icon-qiakoushexiangtou";
                                // break;
                            }
                            allpoint.push(response.data[i].items[j]);
                        }
                    }
                    var allpoint_copy = cloneDeep(allpoint);

                    // allpoint.pop();

                    for (var k = 0; k < allpoint_copy.length; k++) {
                        for (var l = 0; l < response.data.length; l++) {
                            // console.log(1);
                            if (
                                allpoint_copy[k].longitude ==
                                    response.data[l].longitude &&
                                allpoint_copy[k].latitude ==
                                    response.data[l].latitude
                            ) {
                                allpoint_copy[k].item = [];
                                allpoint_copy[k].item = response.data[l].items;
                            }
                        }
                    }
                    this.ls_mapPoint = cloneDeep(allpoint_copy);

                    this.mapPoint = allpoint_copy;
                })
                .catch(e => {
                    // console.log(e);

                    _this.ymDataInfo = [];
                });
        },
        getLjdTj() {
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
                _this.checkedSJD.forEach(e => {
                    if (element.name == e && element.name != "自定义") {
                        sjd.push(element.value);
                    }
                });
            });
            //构造人员信息
            var person = [];
            this.checkedsarsinfo.forEach(element => {
                person.push({
                    idCards: element.zjhm,
                    logo: "01"
                });
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
                finishTime:
                    this.$refs.map.datesj_time == "" ||
                    this.$refs.map.datesj_time == null
                        ? ""
                        : this.$refs.map.datesj_time[1] || "2020-09-30",
                idCards: person,
                types: sjlx.toString(),
                timesInterval: sjd.toString(),
                customPeriod: this.$refs.zdysj[0].isChecked
                    ? this.zdytime[0] + "to" + this.zdytime[1]
                    : "",
                pageNum: this.page,
                pageSize: this.size,
                sortName: this.sortName,
                sortRule: this.sortRule
            };
            getLJDStatistics(this.query)
                .then(response => {
                    console.log(response);
                    if (response.data.length == 0) {
                        this.$message("未查询到相关地图轨迹点信息！");
                        // return;
                    }
                    //   for (var i = 0; i < response.data.length; i++) {
                    //      for (var j = 0; j < response.data[i].items.length; j++) {
                    //         this.mapPoint.push({...response.data[i].items[j],value});
                    //      }
                    //   }

                    for (var i in response.data.rows) {
                        response.data.rows[i].xh = parseInt(i) + 1;
                    }
                    _this.pageData = response.data.rows;
                    _this.total = response.data.total;
                    //            :total="total"
                    // :rows="pageData"
                    // :columns="columns"
                    // :current="page"
                })
                .catch(e => {
                    console.log(e);

                    _this.ymDataInfo = [];
                });
        },

        sortChange({ prop, order }) {
            // if (order == "ascending") {
            //     this.table = this.table.sort((a, b) => a.length - b.length);
            // } else if (order == "descending") {
            //     this.table = this.table.sort((a, b) => b.length - a.length);
            // }

            // this.getTablePage();
            if (order == "ascending") {
                this.sortRule = "ASC";
            } else if (order == "descending") {
                this.sortRule = "DESC";
            }
            this.sortName = prop;
            this.getLjdTj();
        },
        onPageChange(current, size) {
            // this.current = current;
            this.page = current;
            this.size = size;
            // this.getTablePage();
            this.getLjdTj();
        },

        // getTablePage() {
        //     let start = (this.page - 1) * this.pageSize;
        //     let end = this.page * this.pageSize;
        //     if (!this.table[end]) {
        //         end = this.table.length;
        //     }
        //     this.rows = this.table.slice(start, end);
        // },
        lookDetails(row) {
            var lx_zh = [];
            // var list = [];
            if (row.types.length == 0) {
                this.$message("暂无数据");
                return;
            }

            for (var item of row.types) {
                if (lx_zh.indexOf(item.name) == -1) lx_zh.push(item.name);
                // if (list.indexOf(item.value) == -1) {
                //     list.push({ name: item.name, value: item.value });
                // }
            }
            var dt = {
                dimensionList: lx_zh,
                ids: [],
                list: row.types,
                query: this.query,
                row: row
            };
            this.$refs.detailInfo.isVisible = true;
            this.row = dt;
        }
        // getTablePage() {}
    },
    created() {
        if (location.href.search("=") != -1) {
            this.dabh = location.href.split("=")[1];
        } else {
            this.$message("未传入案件编号！");
            return;
        }
        this.getSAR();

        this.getSjdList();
        this.getsjlxList();

        this.getZysjList();
        this.getGjlxList();
    },
    mounted() {
        window.showSingalTips = this.showTips;
        window.showPop = this.showPop;
    }
};
</script>

<style type="text/scss" lang="scss" scoped>
@import "@/styles/basic-color.scss";
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
    // height: 120px;
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
    width: 100%;
    border: 2px solid #eee;
    border-left: 2px solid $color-primary;
    font-size: 18px;
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
    z-index: 1001;
    // width: 100%;
    width: calc(100% - 20px);
    height: 240px;
    background: white;
    border: 1px solid #eee;
    box-shadow: 1px 1px 2px #888888;
    // box-shadow: -1px 1px 2px #888888;
}
.tj {
    // margin-left: 40px;
    margin: 20px 40px 0px 40px;
}
.fxtjbtn {
    // width: 100%;
    position: absolute;
    right: 40px;
    top: 30px;
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
.togglebtn_sq {
    top: 20px;
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

.dskmap {
    display: flex;
    // height: 100%;
    height: calc(100% - 120px);
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

.noData {
    height: 100%;
    width: 100%;
    background-image: url("~@/assets/image/暂无数据.png");
    background-repeat: no-repeat;
    background-size: 50% 50%;
    background-position: 50% 50%;
    position: relative;
    .noData_text {
        position: absolute;
        bottom: calc(50% - 180px);
        left: calc(50% - 120px);
        font-size: 24px;
        color: #ccc;
    }
}
</style>
