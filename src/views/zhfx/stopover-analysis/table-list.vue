<template>
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
            :rows="rows"
            :columns="columns"
            :current="current"
            @on-page-change="onPageChange"
        ></kr-table>
    </div>
</template>
<script>
import {
    getDetialForMap,
    getDetialForStatistics
    // live,
    // train,
    // bus,
    // fly,
    // transfer,
    // family,
    // invest
} from "../../../api/zhfx/stopover-analysis";
export default {
    name: "table-list",
    props: {
        type: { type: String, default: "" },
        data: { type: Object, default: () => {} }
    },
    components: {},
    data() {
        return {
            columnsList: [
                {
                    type: "出行-车辆卡口",
                    columns: [
                        {
                            title: "机动车所有人",
                            key: "jdcsyr"
                        },
                        { title: "证件号码", key: "sfzmhm", width: 170 },
                        {
                            title: "车辆类型",
                            key: "cllx",
                            width: 180
                        },
                        { title: "车牌号", key: "cthphm", width: 170 },
                        { title: "车辆品牌", key: "clpp1" }
                    ]
                },
                {
                    type: "出行-高速公路-2020年前",
                    columns: [
                        {
                            title: "入口时间",
                            key: "rksj2"
                        },
                        { title: "入口车牌", key: "rkcp", width: 170 },
                        {
                            title: "出口时间",
                            key: "cksj",
                            width: 180
                        },
                        { title: "实际里程(米)", key: "sjlcm", width: 170 },
                        { title: "入口车型", key: "rkcx" }
                    ]
                },
                {
                    type: "出行-高速公路-2020年后",
                    columns: [
                        {
                            title: "入口时间",
                            key: "rksj2"
                        },
                        { title: "入口车牌", key: "rkcp", width: 170 },
                        {
                            title: "出口时间",
                            key: "cksj",
                            width: 180
                        },
                        { title: "实际里程(米)", key: "sjlcm", width: 170 },
                        { title: "入口车型", key: "rkcx" }
                    ]
                },
                {
                    type: "民航离港",
                    columns: [
                        {
                            title: "离港时间",
                            key: "lgsj"
                        },
                        { title: "旅客名", key: "lkzwxm", width: 170 },
                        {
                            title: "进港时间",
                            key: "jgsj",
                            width: 180
                        },
                        {
                            title: "到达航站三字代码",
                            key: "ddhzszdm",
                            width: 170
                        },
                        { title: "起飞港站三字代码", key: "qfgzszdm" }
                    ]
                },
                {
                    type: "铁路订票",
                    columns: [
                        {
                            title: "姓名",
                            key: "xm"
                        },
                        { title: "发站", key: "fz", width: 170 },
                        {
                            title: "到站",
                            key: "dz",
                            width: 180
                        },
                        { title: "发车日期", key: "fcrq", width: 170 },
                        { title: "车票状态", key: "cpzt" }
                    ]
                },
                {
                    type: "运管售票",
                    columns: [
                        {
                            title: "乘车人姓名",
                            key: "ccrxm"
                        },
                        { title: "车票价格", key: "cpjg", width: 170 },
                        {
                            title: "目的地",
                            key: "mddmc",
                            width: 180
                        },
                        { title: "始发", key: "sfczmc", width: 170 },
                        { title: "时间", key: "tpsj" }
                    ]
                },

                {
                    type: "旅馆住宿",
                    columns: [
                        {
                            title: "姓名",
                            key: "xm"
                        },
                        { title: "身份证明号码", key: "sfzmhm", width: 170 },
                        {
                            title: "旅店名称",
                            key: "ldmc",
                            width: 180
                        },
                        { title: "旅店详细地址", key: "ldxxdz", width: 170 },
                        { title: "入住时间", key: "rzfh" }
                    ]
                },
                {
                    type: "企业投资",
                    columns: [
                        {
                            title: "企业名称",
                            key: "qymc"
                        },
                        {
                            title: "统一社会信用代码",
                            key: "tyshxydm",
                            width: 170
                        },
                        {
                            title: "股东类型",
                            key: "gdlx",
                            width: 180
                        },

                        { title: "股东姓名", key: "gdxm" }
                    ]
                },
                {
                    type: "账户交易",
                    columns: [
                        {
                            title: "任务流水号",
                            key: "rwlsh"
                        },
                        { title: "申请机构代码", key: "sqjgdm", width: 170 },
                        {
                            title: "目标机构代码",
                            key: "mbjgdm",
                            width: 180
                        },
                        { title: "交易类型", key: "jylx", width: 170 },
                        { title: "交易金额", key: "je" }
                    ]
                }
            ],
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
            transferType_options: [
                {
                    value: "1",
                    label: "转账"
                },
                {
                    value: "2",
                    label: "过户"
                },
                {
                    value: "3",
                    label: "洗钱"
                },
                {
                    value: "4",
                    label: "提现"
                }
            ],
            total: 0,
            pageNum: 1,
            pageSize: 10,
            columns: [],
            current: 1,
            rows: []
        };
    },
    computed: {},
    watch: {},
    methods: {
        // query() {
        //     this.transferForm.amount = Number(this.transferForm.amount) || null;
        //     getDetialForMap({
        //         ...this.transferForm,
        //         dabh: this.$route.query.dabh,
        //         sourceIdCard: this.data.sourceIdCard,
        //         targetIdCard: this.data.targetIdCard,
        //         sourceNodeId: this.data.sourceNodeId,
        //         targetNodeId: this.data.targetNodeId,
        //         pageSize: this.pageSize,
        //         pageNum: this.pageNum
        //     }).then(res => {
        //         let { rows, total } = res.data;
        //         this.rows = this.filterData(rows);
        //         this.total = total;
        //     });
        // },
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
        onPageChange(pageNum, pageSize) {
            this.current = pageNum;
            this.pageNum = pageNum - 1;
            this.pageSize = pageSize;
            if (this.data.ids.length != 0) {
                this.getDimensionInfo_kj(this.type);
            } else {
                this.getDimensionInfo_lb(this.type);
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
        },
        //针对空间
        getDimensionInfo_kj(key) {
            getDetialForMap({
                dataIds: this.data.ids,
                pageNum: this.pageNum || 1,
                pageSize: this.pageSize || 10,
                typeCode: key,
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm
            }).then(res => {
                let { rows = [], total = 0 } = res.data;
                this.rows = this.filterData(rows);
                this.total = total;
            });
            // switch (key) {
            //     case "01":
            //         getDetialForMap({
            //             dataIds: this.data.ids,
            //             pageNum: this.pageNum || 1,
            //             pageSize: this.pageSize || 10,
            //             typeCode: "01"
            //         }).then(res => {
            //             let { rows = [], total = 0 } = res.data;
            //             this.rows = this.filterData(rows);
            //             this.total = total;
            //         });
            //         return;

            //     default:
            //         return;
            // }
        },
        //针对列表
        getDimensionInfo_lb(key) {
            var query = {
                ...this.data.query,
                address: this.data.row.address,
                pageNum: this.pageNum,
                pageSize: this.pageSize || 10,
                typeCode: key,
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                idCards: [this.data.row.idCard]
            };
            getDetialForStatistics(query).then(res => {
                let { rows = [], total = 0 } = res.data;
                this.rows = this.filterData(rows);
                this.total = total;
            });
            // switch (key) {
            //     case "01":
            //         var query = {
            //             address: this.data.row.address,
            //             pageNum: this.pageNum,
            //             pageSize: this.pageSize || 10,
            //             typeCode: "01",
            //             ...this.data.query
            //         };
            //         getDetialForStatistics(query).then(res => {
            //             let { rows = [], total = 0 } = res.data;
            //             this.rows = this.filterData(rows);
            //             this.total = total;
            //         });
            //         return;

            //     default:
            //         return;
            // }
        }
    },
    created() {
        this.data.list;
        if (this.data.ids.length != 0) {
            this.data.list.forEach(element => {
                if (element.name == this.type) {
                    this.type;
                    this.getDimensionInfo_kj(element.value);
                }
            });
        } else {
            console.log(this.data);
            this.data.list.forEach(element => {
                if (element.name == this.type) {
                    this.type;
                    this.getDimensionInfo_lb(element.value);
                }
            });
            // this.getDimensionInfo_lb(element.value);
        }
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
.query_select {
    display: flex;
}
</style>
