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
    // getDetialForMap,
    getDetialForAccompany
    // live,
    // train,
    // bus,
    // fly,
    // transfer,
    // family,
    // invest
} from "../../../api/dsjmxk/multiple-spatiotemporal-adjoint";
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
                    type: "卡口",
                    columns: [
                        {
                            title: "姓名",
                            key: "name"
                        },
                        { title: "证件号码", key: "identifier", width: 170 },
                        {
                            title: "地点",
                            key: "place",
                            width: 180
                        },
                        { title: "日期", key: "eventTime" }
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
        // getDimensionInfo_kj(key) {},
        //针对列表
        getDimensionInfo(key) {
            var query = {
                dataIds: this.data.ids || this.data.row.ids,
                pageNum: this.pageNum,
                pageSize: this.pageSize || 10,
                type: key
            };
            // query.pageNum = 1;
            getDetialForAccompany(query).then(res => {
                let { rows = [], total = 0 } = res.data;
                this.rows = this.filterData(rows);
                this.total = total;
            });
            // switch (key) {
            //     case "01":

            //         return;

            //     default:
            //         return;
            // }
        }
    },
    created() {
        this.data.list;
        this.data.list.forEach(element => {
            if (element.name == this.type) {
                this.type;
                this.getDimensionInfo(element.code);
            }
        });
        // if (this.data.ids.length != 0) {
        //     this.data.list.forEach(element => {
        //         if (element.name == this.type) {
        //             this.type;
        //             this.getDimensionInfo_kj(element.value);
        //         }
        //     });
        // } else {
        //     console.log(this.data);

        //     // this.getDimensionInfo_lb(element.value);
        // }
    },
    mounted() {
        this.columnsList.map(value => {
            if (value.type.indexOf(this.type) > -1) {
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
