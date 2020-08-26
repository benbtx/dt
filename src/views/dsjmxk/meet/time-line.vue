<template>
    <div class="timelb">
        <el-card class="box-card" style="    height: 100%;overflow-y: auto;">
            <div
                id="parent"
                v-if="ymDataInfo_copy.length != 0"
                class="eventlinekjqy"
            >
                <template v-for="item in ymDataInfo_copy">
                    <div
                        v-if="item.dataId == null"
                        :key="item.id"
                        class="eventlinechild"
                    >
                        <span class="child_line_ny"></span>
                        <div class="eventdiv child_content_ny">
                            <div class="eventdiv_event">
                                <!-- {{item.year+'-'+item.month}} -->
                                {{ item.name }}
                            </div>
                        </div>
                    </div>
                    <div
                        v-else
                        :key="item.id"
                        class="eventlinechild"
                        :class="{ currentryjd: item.status }"
                        @click="btnZbdw(item)"
                    >
                        <label
                            class="child_point"
                            :class="{ currentrypoint: item.status }"
                        ></label>
                        <span class="child_line"></span>
                        <div class="child_content">
                            <!-- 13 13:35:26 张三 -->

                            <span>{{ item.eventTime.split("-")[2] }}</span>
                            <br />
                            <span>
                                <kr-icon
                                    class="kjpic"
                                    :icon="item.img"
                                    :size="16"
                                    :color="item.color"
                                ></kr-icon>
                            </span>
                            <!-- {{item.img}} -->
                            <span> {{ item.name }} </span>
                        </div>
                    </div>
                </template>
            </div>
            <div v-else>暂无数据</div>
        </el-card>
    </div>
</template>

<script>
// import tableList from "./table-list";
export default {
    name: "time-line",
    components: {
        // tableList
    },
    props: {
        ymDataInfo: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            ymDataInfo_copy: [],
            // ymDataInfo: [
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
            //         dataId: "603aeea805f844a78f448bfbbe2c0e0a",
            //         eventTime: "2020-06-29 09:21:12",
            //         identifier: "792892196811231931",
            //         name: "1931",
            //         title: "出行-高速公路-出口-",
            //         dataType: "出行-高速公路-2020年后",
            //         longitude: null,
            //         latitude: null,
            //         status: false,
            //         content:
            //             "过车时间:2020-06-29 09:21:12.0    车身颜色:-    收费站名称:收费站2588    车辆类型:-    车辆品牌:-    车辆型号:-",
            //         value: "03",
            //         img: "icon-qiakoushexiangtou"
            //     },

            //     {
            //         dataId: "fd766f6e72e0434a8c330c0356ab64c4",
            //         eventTime: "2020-06-25 08:11:29",
            //         identifier: "792892196811231931",
            //         name: "1931",
            //         title: "出行-高速公路-出口-",
            //         dataType: "出行-高速公路-2020年后",
            //         longitude: null,
            //         latitude: null,
            //         status: false,
            //         content:
            //             "过车时间:2020-06-25 08:11:29.0    车身颜色:-    收费站名称:收费站4712    车辆类型:-    车辆品牌:-    车辆型号:-",
            //         value: "03",
            //         img: "icon-qiakoushexiangtou"
            //     },
            //     {
            //         dataId: "fd766f6e72e0434a8c330c0356ab64c4",
            //         eventTime: "2020-06-25 07:47:29",
            //         identifier: "792892196811231931",
            //         name: "1931",
            //         title: "出行-高速公路-入口-川A 58323",
            //         dataType: "出行-高速公路-2020年后",
            //         longitude: null,
            //         latitude: null,
            //         status: false,
            //         content:
            //             "过车时间:2020-06-25 07:47:29.0    车身颜色:-    收费站名称:收费站5818    车辆类型:-    车辆品牌:-    车辆型号:-",
            //         value: "03",
            //         img: "icon-qiakoushexiangtou"
            //     },
            //     {
            //         dataId: "3e28483722f7440dbc37e0ed2dbfe955",
            //         eventTime: "2020-06-23 05:37:03",
            //         identifier: "792892196811231931",
            //         name: "1931",
            //         title: "出行-高速公路-出口-",
            //         dataType: "出行-高速公路-2020年后",
            //         longitude: null,
            //         latitude: null,
            //         status: false,
            //         content:
            //             "过车时间:2020-06-23 05:37:03.0    车身颜色:-    收费站名称:收费站6640    车辆类型:-    车辆品牌:-    车辆型号:-",
            //         value: "03",
            //         img: "icon-qiakoushexiangtou"
            //     },
            //     {
            //         dataId: "3e28483722f7440dbc37e0ed2dbfe955",
            //         eventTime: "2020-06-23 05:17:03",
            //         identifier: "792892196811231931",
            //         name: "1931",
            //         title: "出行-高速公路-入口-川A 58323",
            //         dataType: "出行-高速公路-2020年后",
            //         longitude: null,
            //         latitude: null,
            //         status: false,
            //         content:
            //             "过车时间:2020-06-23 05:17:03.0    车身颜色:-    收费站名称:收费站1899    车辆类型:-    车辆品牌:-    车辆型号:-",
            //         value: "03",
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
            //         dataId: "d28451cf96454c70a8c6929e11c3ceca",
            //         eventTime: "2020-06-19 10:00:42",
            //         identifier: "792892196811231931",
            //         name: "1931",
            //         title: "出行-高速公路-入口-川A 58323",
            //         dataType: "出行-高速公路-2020年后",
            //         longitude: null,
            //         latitude: null,
            //         status: false,
            //         content:
            //             "过车时间:2020-06-19 10:00:42.0    车身颜色:-    收费站名称:收费站6709    车辆类型:-    车辆品牌:-    车辆型号:-",
            //         value: "03",
            //         img: "icon-qiakoushexiangtou"
            //     },
            //     {
            //         dataId: "10d1d2ae2cdd49b39c9733d1763509a2",
            //         eventTime: "2020-06-18 13:03:14",
            //         identifier: "792892196811231931",
            //         name: "1931",
            //         title: "出行-车辆卡口-川A 58323",
            //         dataType: "出行-车辆卡口",
            //         longitude: "104.14",
            //         latitude: "30.7",
            //         status: false,
            //         content:
            //             "过车时间:2020-06-18 13:03:14    车身颜色:-    卡口名称:卡口3973    车辆类型:-    车辆品牌:-    车辆型号:-",
            //         value: "01",
            //         img: "icon-qiakoushexiangtou"
            //     },
            //     {
            //         dataId: "e6c0c56499a2444f9acb06118b63eae4",
            //         eventTime: "2020-06-18 10:34:07",
            //         identifier: "792892196811231931",
            //         name: "1931",
            //         title: "出行-车辆卡口-川A 58323",
            //         dataType: "出行-车辆卡口",
            //         longitude: "104.08",
            //         latitude: "30.73",
            //         status: false,
            //         content:
            //             "过车时间:2020-06-18 10:34:07    车身颜色:-    卡口名称:卡口5115    车辆类型:-    车辆品牌:-    车辆型号:-",
            //         value: "01",
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
            // ],
            isVisible: false,
            optionValue: ""
        };
    },
    computed: {},
    methods: {
        // open() {
        //     this.optionValue = this.row.dimensionList[0];
        // }
        btnZbdw(item) {
            //地图点击 左侧人员 高亮 右侧人员定位
            item.status = !item.status;
            //其他变为false,
            this.ymDataInfo_copy.forEach(function(it) {
                if (item != it) {
                    it.status = false;
                }
            });
            // this.highlightPoint={longitude:item.longitude,latitude:item.latitude};
            // this.highlightPoint = item;
            this.$emit("handleHighLightPoint", item);
        }
    },
    watch: {
        ymDataInfo() {
            this.ymDataInfo_copy = this.ymDataInfo;
        }
    }
};
</script>
<style lang="scss" scoped>
@import "@/styles/basic-color.scss";
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
