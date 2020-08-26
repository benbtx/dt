<template>
    <el-dialog
        :visible.sync="isVisible"
        :close-on-click-modal="false"
        top="2vh"
        @open="open"
        @close="optionValue = ''"
        title="查看详情"
        width="1140px"
    >
        <div class="wrapper">
            <!-- <div v-if="type == '银行卡转账'" class="query_select">
                <el-input
                    v-model="transferForm.amount"
                    clearable
                    placeholder="请输入交易金额"
                    class="iput-normal-width"
                    @change="onKeyUp"
                ></el-input>
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
                        style="width: 230px; margin-left: 30px;"
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
                    style="width: 230px; margin-left: 30px;"
                    value-format="hh:mm:ss"
                    @change="deteChange"
                ></el-time-picker>
                <el-select
                    v-model="transferForm.transferType"
                    v-if="false"
                    clearable
                    disabled
                    class="iput-normal-width"
                    style="margin-left: 30px;"
                    placeholder="交易类型"
                >
                    <el-option
                        v-for="item in transferType_options"
                        :label="item.label"
                        :value="item.value"
                        :key="item.value"
                    ></el-option>
                </el-select>
                <el-button
                    type="primary"
                    style="margin-left: 10px;"
                    icon="el-icon-search "
                    @click="query"
                    >搜索</el-button
                >
            </div> -->
            <kr-table
                :total="total"
                :rows="row"
                :indexRow="indexRow"
                :columns="columns"
                :current="current"
                :options="options"
                @on-page-change="onPageChange"
                @sort-change="sortChange"
            ></kr-table>
        </div>
    </el-dialog>
</template>
<script>
import // getDetialForMap,
// getDetialForAccompany
// live,
// train,
// bus,
// fly,
// transfer,
// family,
// invest
"../../../api/dsjmxk/multiple-spatiotemporal-adjoint";
export default {
    name: "table-list",
    props: {
        // type: { type: String, default: "" },
        // data: { type: Object, default: () => {} },
        detailtable: { type: Array } //所有数据
    },
    components: {},
    data() {
        return {
            indexRow: false,
            table: [], //所有数据 ，由rows生成 ,每条生成2个data 数据
            row: [], //某一页data
            isVisible: false,
            options: {
                stripe: true,
                spanMethod({ rowIndex, columnIndex }) {
                    if (columnIndex === 0) {
                        if (rowIndex % 2 === 0) {
                            return {
                                rowspan: 2,
                                colspan: 1
                            };
                        } else {
                            return {
                                rowspan: 0,
                                colspan: 0
                            };
                        }
                    }
                }
            },
            //  columns: [],
            columns: [
                { title: "序号", key: "xh", width: 50 },
                { title: "分析人姓名", key: "fxrxm", width: 120 },
                { title: "身份证号", key: "sfzh", width: 150 },
                { title: "维度", key: "wd", width: 100 },
                { title: "时间", key: "sj", width: 150, sortable: "custom" },
                { title: "地址", key: "dz", width: 150 },
                { title: "详情", key: "qt" }
            ],

            // columnsList: [
            //     {
            //         type: "出行-车辆卡口",
            //         columns: [
            //             {
            //                 title: "序号",
            //                 key: "jdcsyr"
            //             },
            //             {
            //                 title: "机动车所有人",
            //                 key: "jdcsyr"
            //             },
            //             { title: "证件号码", key: "sfzmhm", width: 170 },
            //             {
            //                 title: "车辆类型",
            //                 key: "cllx",
            //                 width: 180
            //             },
            //             { title: "车牌号", key: "cthphm", width: 170 },
            //             { title: "车辆品牌", key: "clpp1" }
            //         ]
            //     }
            // ],
            transferForm: {
                startPeriod: null,
                endPeriod: null,
                transferType: null,
                amount: "",
                startTime: null,
                endTime: null
            },
            period: "",
            time: "",
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

            total: 0,
            // pageNum: 1,
            pageSize: 10, //由于合并实际取20条数据

            current: 1
            // rows: []
        };
    },
    computed: {},
    watch: {},
    methods: {
        open() {
            // this.optionValue = this.row.dimensionList[0];
            var _this = this;
            // this.data.list;
            this.table = [];
            // //重新构造数据
            // this.detailtable.forEach((element, i) => {
            //     _this.table.push({
            //         xh: i + 1,
            //         fxrxm: element.mainBodyName,
            //         sfzh: element.mainBodyIdCard,
            //         wd: element.mainType,
            //         sj: element.mainTime,
            //         dz: element.mainPlace,
            //         qt: element.mainContent
            //     });
            //     _this.table.push({
            //         xh: i + 1,
            //         fxrxm: element.resonancePersons,
            //         sfzh: element.resonancePersonsIdCard,
            //         wd: element.resonanceType,
            //         sj: element.resonanceTime,
            //         dz: element.resonancePlace,
            //         qt: element.resonanceContent
            //     });
            // });
            //构造第一页数据
            this.total = this.detailtable.length;
            this.getTablePage();
        },

        getTablePage() {
            // let start = (this.current - 1) * this.pageSize;
            // let end = this.current * this.pageSize;
            // if (!this.table[end]) {
            //     end = this.table.length;
            // }
            // this.row = this.table.slice(start, end);
            var _this = this;
            _this.row = [];

            let start = (this.current - 1) * this.pageSize;
            let end = this.current * this.pageSize;
            if (!this.detailtable[end]) {
                end = this.detailtable.length;
            }
            var row = this.detailtable.slice(start, end);
            //重新构造数据
            row.forEach((element, i) => {
                _this.row.push({
                    xh: i + 1 + start,
                    fxrxm: element.mainBodyName,
                    sfzh: element.mainBodyIdCard,
                    wd: element.mainType,
                    sj: element.mainTime,
                    dz: element.mainPlace,
                    qt: element.mainContent
                });
                _this.row.push({
                    xh: i + 1 + start,
                    fxrxm: element.resonancePersons,
                    sfzh: element.resonancePersonsIdCard,
                    wd: element.resonanceType,
                    sj: element.resonanceTime,
                    dz: element.resonancePlace,
                    qt: element.resonanceContent
                });
            });
            // this.row =;

            // let start = (this.current - 1) * (this.pageSize * 2);
            // let end = this.current * (this.pageSize * 2);
            // if (!this.table[end]) {
            //     end = this.table.length;
            // }
            // this.row = this.table.slice(start, end);
        },

        onPageChange(pageNum, pageSize) {
            this.current = pageNum;
            this.pageNum = pageNum - 1;
            this.pageSize = pageSize;
            this.getTablePage();
        },
        sortChange({ prop, order }) {
            prop;
            order;
            // if (order == "ascending") {
            //     this.table = this.table.sort((a, b) => a.length - b.length);
            // } else if (order == "descending") {
            //     this.table = this.table.sort((a, b) => b.length - a.length);
            // }
            if (order == "ascending") {
                this.table = this.table.sort(function(a, b) {
                    return (
                        Date.parse(a.sj.replace(/-/g, "/")) -
                        Date.parse(b.sj.replace(/-/g, "/"))
                    );
                });
            } else if (order == "descending") {
                this.table = this.table.sort(function(a, b) {
                    return (
                        Date.parse(b.sj.replace(/-/g, "/")) -
                        Date.parse(a.sj.replace(/-/g, "/"))
                    );
                });
            }
            // this.getLjdTj();
            this.getTablePage();
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
            } else {
                this.transferForm.startTime = null;
                this.transferForm.endTime = null;
            }
        },

        onKeyUp() {
            this.transferForm.amount = this.transferForm.amount.replace(
                /[^\d.]/g,
                ""
            );
        },
        filterData(data) {
            data.map(row => {
                for (var key in row) {
                    if (row.hasOwnProperty(key)) {
                        row[key] =
                            row[key] != null && row[key] != "null"
                                ? row[key]
                                : "";
                    }
                }
                return row;
            });
            return data;
        }
        // //针对空间
        // // getDimensionInfo_kj(key) {},
        // //针对列表
        // getDimensionInfo(key) {
        //     var query = {
        //         dataIds: this.data.ids || this.data.row.ids,
        //         pageNum: this.pageNum,
        //         pageSize: this.pageSize || 10,
        //         type: key
        //     };
        //     // query.pageNum = 1;
        //     getDetialForAccompany(query).then(res => {
        //         let { rows = [], total = 0 } = res.data;
        //         this.rows = this.filterData(rows);
        //         this.total = total;
        //     });
        //     // switch (key) {
        //     //     case "01":

        //     //         return;

        //     //     default:
        //     //         return;
        //     // }
        // }
    },
    created() {
        // var _this = this;
    },
    mounted() {},
    beforeDestroy() {}
};
</script>
<style lang="scss" scoped>
.query_select {
    display: flex;
}
</style>
