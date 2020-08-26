<template>
    <div>
        <el-form :model="form" ref="form" :rules="rules" :inline="true">
            <el-form-item>
                <el-date-picker
                    v-model="time"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="$pickerOptions"
                    style="width: 250px; margin-right: 20px;"
                    value-format="yyyyMMdd"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-select
                    class="period"
                    v-model="form.num"
                    filterable
                    allow-create
                    default-first-option
                >
                    <span slot="prefix">{{
                        type === "0" ? "流入人数" : "流出人数"
                    }}</span>
                    <el-option
                        v-for="item in num_options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="period">
                <el-select
                    class="period"
                    v-model="form.period"
                    filterable
                    allow-create
                    default-first-option
                >
                    <span slot="prefix">洗钱周期</span>
                    <el-option
                        v-for="item in period_options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="percentage">
                <el-input
                    class="percentage"
                    v-model="form.percentage"
                    clearable
                    placeholder="请输入"
                    ref="input"
                    ><span slot="prefix" @click="focus('input')">
                        {{
                            type === "0"
                                ? "请输入流入百分比"
                                : "请输入流出百分比"
                        }}</span
                    ><i
                        slot="suffix"
                        class="el-input__icon "
                        @click="focus('input')"
                        >%</i
                    ></el-input
                >
            </el-form-item>
            <el-form-item prop="range">
                <el-input
                    class="range"
                    v-model="form.range"
                    clearable
                    placeholder="请输入"
                    ref="input1"
                    ><span slot="prefix" @click="focus('input1')"
                        >对象交易金额范围</span
                    ><i
                        slot="suffix"
                        class="el-input__icon "
                        @click="focus('input1')"
                        >以上</i
                    ></el-input
                >
            </el-form-item>
            <el-button
                type="primary"
                icon="el-icon-search "
                @click="$emit('query')"
                :loading="queryLoading"
                >搜索</el-button
            >
        </el-form>
        <div v-kr-loading="loading">
            <kr-table
                :options="tableOptions"
                :total="total"
                :rows="rows"
                :columns="columns"
                :current="form.pageNum"
                @on-page-change="onPageChange"
                @sort-change="sortChange"
            ></kr-table>
        </div>
    </div>
</template>
<script>
import { launderingAnalysis } from "api/dsjmxk/xqtzfxmx";
import { cloneDeep } from "loadsh";
export default {
    name: "table-list",
    props: {
        type: String,
        idCards: String
    },
    components: {},
    data() {
        const $shelf = this;
        let reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
        let checkValue = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("不能为空值"));
            } else if (!reg.test(value)) {
                callback(new Error("请输入数字值"));
            } else {
                callback();
            }
        };
        return {
            columnsList: [
                {
                    type: "1",
                    columns: [
                        { title: "姓名", key: "username", width: 100 },
                        { title: "身份证号", key: "idCard", "min-width": 180 },
                        { title: "卡号", key: "card", "min-width": 180 },
                        { title: "卡号类型", key: "cardType", width: 80 },
                        {
                            title: "流入金额",
                            sortable: "custom",
                            key: "amount",
                            "min-width": 120
                        },
                        {
                            title: "流出金额时间",
                            sortable: "custom",
                            key: "dealTime",
                            width: 160
                        },
                        {
                            title: "流出百分比",
                            sortable: "custom",
                            key: "percentage",
                            width: 130
                        },
                        {
                            title: "流出人数",
                            sortable: "custom",
                            key: "count",
                            width: 110
                        },
                        {
                            title: "操作",
                            width: 100,
                            fixed: "right",
                            component: {
                                render(h, row) {
                                    return (
                                        <el-button
                                            type="text"
                                            onClick={() =>
                                                $shelf.lookDetails(row)
                                            }
                                        >
                                            图表详情
                                        </el-button>
                                    );
                                }
                            }
                        }
                    ]
                },
                {
                    type: "0",
                    columns: [
                        { title: "姓名", key: "username", width: 100 },
                        { title: "身份证号", key: "idCard", "min-width": 180 },
                        { title: "卡号", key: "card", "min-width": 180 },
                        { title: "卡号类型", key: "cardType", width: 80 },
                        {
                            title: "流入百分比",
                            sortable: "custom",
                            key: "percentage",
                            width: 130
                        },
                        {
                            title: "流入人数",
                            sortable: "custom",
                            key: "count",
                            width: 110
                        },
                        {
                            title: "流入总金额",
                            sortable: "custom",
                            key: "amount",
                            "min-width": 120
                        },
                        {
                            title: "流入金额时间",
                            sortable: "custom",
                            key: "dealTime",
                            width: 160
                        },
                        {
                            title: "操作",
                            width: 100,
                            fixed: "right",
                            component: {
                                render(h, row) {
                                    return (
                                        <el-button
                                            type="text"
                                            onClick={() =>
                                                $shelf.lookDetails(row)
                                            }
                                        >
                                            图表详情
                                        </el-button>
                                    );
                                }
                            }
                        }
                    ]
                }
            ],
            tableOptions: {
                "max-height": 500
            },
            columns: [],
            rows: [],
            total: 0,
            queryLoading: false,
            loading: false,
            time: [],
            num_options: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 }
            ],
            period_options: [
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 }
            ],
            form: {
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                idCards: "",
                startTime: null,
                endTime: null,
                flow: 0,
                percentage: "",
                sortName: null,
                sortRule: null,
                range: "",
                num: "",
                period: "",
                pageNum: 1,
                pageSize: 10
            },
            rules: {
                percentage: [
                    {
                        validator: checkValue,
                        trigger: "blur",
                        required: true
                    }
                ],
                period: [
                    {
                        validator: checkValue,
                        trigger: "change",
                        required: true
                    }
                ],
                range: [
                    {
                        validator: checkValue,
                        trigger: "blur",
                        required: true
                    }
                ]
            }
        };
    },
    computed: {},
    watch: {
        idCards() {
            this.form.idCards = this.idCards;
        }
    },
    methods: {
        async getAllTableData() {
            let param = cloneDeep(this.form);
            let table;
            param.pageSize = this.total;
            table = await launderingAnalysis(param);
            return table.data ? table.data.rows : [];
        },
        onPageChange(pageNum, pageSize) {
            this.form.pageNum = pageNum;
            this.form.pageSize = pageSize;
            this.getData();
        },
        sortChange({ prop, order }) {
            this.form.sortName = prop;
            this.form.sortRule = order.replace("ending", "");
            this.getData();
        },
        // 点击图表详情事件
        lookDetails(row) {
            this.$emit("lookDetails", row);
        },
        getData() {
            this.loading = true;
            let form = { ...this.form };
            let [start = null, end = null] = this.time || [];
            form.startTime = start;
            form.endTime = end;
            for (const key in form) {
                form[key] = form[key] !== "" ? form[key] : null;
            }
            launderingAnalysis(form).then(res => {
                if (res.data) {
                    let { rows, total } = res.data;
                    this.setTable(rows);
                    this.total = total;
                } else {
                    this.rows = [];
                    this.total = 0;
                }
                this.queryLoading = false;
                this.$emit("changeBtnLoading", false);
                this.loading = false;
            });
        },
        focus(name) {
            this.$nextTick(() => {
                this.$refs[name].focus();
            });
        },
        query(formName) {
            if (!this.form.idCards) {
                return;
            }
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.queryLoading = true;
                    this.getData();
                } else {
                    return false;
                }
            });
        },
        setTable(value) {
            this.rows = value.map(el => {
                el.amount = "￥" + el.amount;
                return el;
            });
        }
    },
    created() {
        this.tableOptions["max-height"] = document.body.offsetHeight - 350;
        this.form.flow = Number(this.type);
        // 初始化idCards，删除将无法进行tab切换表单验证
        this.form.idCards = this.idCards;
        this.columnsList.forEach(el => {
            if (el.type === this.type) {
                this.columns = el.columns;
            }
        });
    },
    mounted() {},
    beforeDestroy() {}
};
</script>
<style lang="scss" scoped>
.range {
    width: 220px;
    margin-right: 20px;
    & /deep/ input {
        padding-left: 120px;
    }
}

.percentage {
    width: 220px;
    margin-right: 20px;
    & /deep/ input {
        padding-left: 120px;
    }
}

.period {
    width: 220px;
    margin-right: 20px;
    & /deep/ input {
        padding-left: 70px;
    }
}
</style>
