<template>
    <div>
        <div class="statistic">
            <div class="statistic_icon">
                <span class="iconfont">&#xe610;</span>
            </div>
            <div v-show="type === '0'" class="statistic_type">
                <div
                    v-for="(item, index) in home_type_options"
                    :key="index"
                    class="type_itme"
                >
                    <p class="type">
                        {{ item }}
                    </p>
                    <p class="number">
                        {{
                            index == 0
                                ? `${houses_tatics.total || 0}`
                                : index == 1
                                ? `${houses_tatics.mortgageNum || 0}`
                                : index == 2
                                ? `${houses_tatics.sequestrationNum || 0}`
                                : ""
                        }}套
                    </p>
                </div>
            </div>
            <div v-show="type === '1'" class="statistic_type">
                <div
                    v-for="(item, index) in houses_tatics.countVOList"
                    :key="index"
                    class="type_itme"
                >
                    <p class="type">
                        {{ item.name }}
                    </p>
                    <p class="number">{{ item.num }}套</p>
                </div>
            </div>
        </div>
        <div class="select_condition">
            <el-select
                v-model="form.commonType"
                placeholder="共有方式"
                style="margin-right:20px;"
            >
                <el-option
                    v-for="item in commonType_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
            <el-select
                v-model="form.mortgage"
                placeholder="抵押状态"
                style="margin-right:20px;"
            >
                <el-option
                    v-for="item in mortgage_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
            <el-select
                v-model="form.sequestration"
                placeholder="查封状态"
                style="margin-right:20px;"
            >
                <el-option
                    v-for="item in sequestration_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
            </el-select>
            <el-button
                type="primary"
                icon="el-icon-search "
                @click="$emit('query')"
                :loading="queryLoading"
                >搜索</el-button
            >
        </div>
        <div v-kr-loading="loading">
            <kr-table
                :options="tableOptions"
                :total="total"
                :rows="rows"
                :columns="columns"
                :current="current"
                @on-page-change="onPageChange"
            ></kr-table>
        </div>
        <el-dialog
            :title="detail_type ? '查封详情' : '抵押详情'"
            :visible.sync="tableInfoVisible"
            :close-on-click-modal="false"
        >
            <kr-Table-Info :data="detail_info" :cells="cells" />
        </el-dialog>
    </div>
</template>
<script>
import { houseAnalysis, houseStaticsAnalysis } from "api/zxfx/house-analysis";
const krTableInfo = () =>
    import(
        /* webpackChunkName: "info-table-info" */ "@/components/kr-table-info/index.vue"
    );
export default {
    name: "table-list",
    props: {
        type: String,
        idCard: String
    },
    components: {
        krTableInfo
    },
    data() {
        const $shelf = this;
        return {
            tableInfoVisible: false,
            value: "",
            houses_tatics: {
                mortgageNum: "",
                sequestrationNum: "",
                total: "",
                countVOList: []
            },

            home_type_options: ["房屋总数", "抵押房屋", "查封房屋"],
            columnsList: [
                {
                    type: "0",
                    columns: [
                        {
                            title: "所在区",
                            key: "szq"
                        },
                        {
                            title: "街道",
                            key: "jd"
                        },
                        {
                            title: "门牌号",
                            key: "mp"
                        },
                        {
                            title: "附号",
                            key: "fh"
                        },
                        {
                            title: "栋号",
                            key: "dh"
                        },
                        {
                            title: "单元",
                            key: "dy"
                        },
                        {
                            title: "楼层",
                            key: "lc	"
                        },
                        {
                            title: "房号",
                            key: "fh2"
                        },
                        {
                            title: "面积",
                            key: "mj"
                        },
                        {
                            title: "金额",
                            key: "je"
                        },
                        {
                            title: "用途",
                            key: "yt"
                        },
                        {
                            title: "所属人",
                            key: "ryXm"
                        },
                        {
                            title: "身份证号",
                            key: "ryZjh",
                            width: 170
                        },
                        {
                            title: "份额",
                            key: "fe"
                        },
                        {
                            title: "共有方式",
                            key: "gyfs"
                        },
                        {
                            title: "抵押状态",
                            key: "dyzt",
                            component: {
                                render(h, row) {
                                    switch (row.dyzt) {
                                        case "1":
                                            return (
                                                <div>
                                                    <i class="mortgage_type_1"></i>
                                                    已抵押
                                                </div>
                                            );
                                        case "2":
                                            return (
                                                <div>
                                                    <i class="mortgage_type_2"></i>
                                                    已赎回
                                                </div>
                                            );
                                        case "3":
                                            return (
                                                <div>
                                                    <i class="mortgage_type_3"></i>
                                                    审核中
                                                </div>
                                            );
                                        case "4":
                                            return (
                                                <div>
                                                    <i class="mortgage_type_4"></i>
                                                    未抵押
                                                </div>
                                            );
                                        default:
                                            break;
                                    }
                                }
                            }
                        },
                        {
                            title: "查封状态",
                            key: "cfzt",
                            component: {
                                render(h, row) {
                                    if (row.cfzt === "1") {
                                        return (
                                            <div>
                                                <i class="mortgage_type_1"></i>
                                                已查封
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div>
                                                <i class="mortgage_type_4"></i>
                                                未查封
                                            </div>
                                        );
                                    }
                                }
                            }
                        },
                        {
                            title: "登记状态",
                            key: "djzt"
                        },
                        {
                            title: "取得方式",
                            key: "qdfs"
                        },
                        {
                            title: "登记时间",
                            sortable: "custom",
                            key: "djsj",
                            width: 180
                        },
                        {
                            title: "上手人姓名",
                            width: 120,
                            key: "ssXm"
                        },
                        {
                            title: "上手人身份证号",
                            width: 150,

                            key: "ssZjh"
                        },
                        {
                            width: 120,
                            title: "下手人姓名",
                            key: "xsXm"
                        },
                        {
                            width: 150,
                            title: "下手人身份证号",
                            key: "xsZjh"
                        },
                        {
                            title: "操作",
                            width: 150,
                            fixed: "right",
                            component: {
                                render(h, row) {
                                    return (
                                        <div>
                                            <el-button
                                                type="text"
                                                onClick={() =>
                                                    $shelf.lookDetails(row, 0)
                                                }
                                            >
                                                抵押详情
                                            </el-button>
                                            <el-button
                                                type="text"
                                                onClick={() =>
                                                    $shelf.lookDetails(row, 1)
                                                }
                                            >
                                                查封详情
                                            </el-button>
                                        </div>
                                    );
                                }
                            }
                        }
                    ]
                },
                {
                    type: "1",
                    columns: [
                        {
                            title: "所在区",
                            key: "szq"
                        },
                        {
                            title: "街道",
                            key: "jd"
                        },
                        {
                            title: "门牌号",
                            key: "mp"
                        },
                        {
                            title: "附号",
                            key: "fh"
                        },
                        {
                            title: "栋号",
                            key: "dh"
                        },
                        {
                            title: "单元",
                            key: "dy"
                        },
                        {
                            title: "楼层",
                            key: "lc	"
                        },
                        {
                            title: "房号",
                            key: "fh2"
                        },
                        {
                            title: "面积",
                            key: "mj"
                        },
                        {
                            title: "金额",
                            key: "je"
                        },
                        {
                            title: "用途",
                            key: "yt"
                        },
                        {
                            title: "所属人",
                            key: "ryXm"
                        },
                        {
                            title: "身份证号",
                            key: "ryZjh",
                            width: 170
                        },
                        { title: "与分析人家庭关系", key: "yhzgx", width: 150 },
                        {
                            title: "份额",
                            key: "fe"
                        },
                        {
                            title: "共有方式",
                            key: "gyfs"
                        },
                        {
                            title: "抵押状态",
                            key: "dyzt",
                            component: {
                                render(h, row) {
                                    switch (row.dyzt) {
                                        case "1":
                                            return (
                                                <div>
                                                    <i class="mortgage_type_1"></i>
                                                    已抵押
                                                </div>
                                            );
                                        case "2":
                                            return (
                                                <div>
                                                    <i class="mortgage_type_2"></i>
                                                    已赎回
                                                </div>
                                            );
                                        case "3":
                                            return (
                                                <div>
                                                    <i class="mortgage_type_3"></i>
                                                    审核中
                                                </div>
                                            );
                                        case "4":
                                            return (
                                                <div>
                                                    <i class="mortgage_type_4"></i>
                                                    未抵押
                                                </div>
                                            );
                                        default:
                                            break;
                                    }
                                }
                            }
                        },
                        {
                            title: "查封状态",
                            key: "cfzt",
                            component: {
                                render(h, row) {
                                    if (row.cfzt === "1") {
                                        return (
                                            <div>
                                                <i class="mortgage_type_1"></i>
                                                已查封
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div>
                                                <i class="mortgage_type_4"></i>
                                                未查封
                                            </div>
                                        );
                                    }
                                }
                            }
                        },
                        {
                            title: "登记状态",
                            key: "djzt"
                        },
                        {
                            title: "取得方式",
                            key: "qdfs"
                        },
                        {
                            title: "登记时间",
                            sortable: "custom",
                            key: "djsj",
                            width: 180
                        },
                        {
                            title: "上手人姓名",
                            width: 120,
                            key: "ssXm"
                        },
                        {
                            title: "上手人身份证号",
                            width: 150,

                            key: "ssZjh"
                        },
                        {
                            width: 120,
                            title: "下手人姓名",
                            key: "xsXm"
                        },
                        {
                            width: 150,
                            title: "下手人身份证号",
                            key: "xsZjh"
                        },
                        {
                            title: "操作",
                            width: 150,
                            fixed: "right",
                            component: {
                                render(h, row) {
                                    return (
                                        <div>
                                            <el-button
                                                type="text"
                                                onClick={() =>
                                                    $shelf.lookDetails(row, 0)
                                                }
                                            >
                                                抵押详情
                                            </el-button>
                                            <el-button
                                                type="text"
                                                onClick={() =>
                                                    $shelf.lookDetails(row, 1)
                                                }
                                            >
                                                查封详情
                                            </el-button>
                                        </div>
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
            current: 1,
            rows: [],
            total: 0,
            queryLoading: false,
            loading: false,
            time: null,
            options: [],
            form: {
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                idCard: "",
                pageNum: 0,
                pageSize: 10,
                mortgage: "",
                commonType: "",
                sequestration: "",
                type: 0
            },
            commonType_options: [
                { label: "夫妻共有", value: 1 },
                { label: "家庭共有", value: 2 },
                { label: "合伙共有", value: 3 },
                { label: "合资共有", value: 4 }
            ],
            mortgage_options: [
                { label: "已抵押", value: 1 },
                { label: "已赎回", value: 2 },
                { label: "审核中", value: 3 },
                { label: "未抵押", value: 4 }
            ],
            sequestration_options: [
                { label: "已查封", value: 1 },
                { label: "未查封", value: 2 }
            ],
            detail_type: 0,
            detail_info: {},
            cells: []
        };
    },
    computed: {},
    watch: {
        idCard() {
            this.form.idCard = this.idCard;
        }
    },
    methods: {
        onPageChange(pageNum, pageSize) {
            this.form.pageNum = pageNum - 1;
            this.form.pageSize = pageSize;
            this.current = pageNum;
            this.getData();
        },
        // 点击图表详情事件
        lookDetails(row, type) {
            this.detail_type = type;
            this.detail_info = row;
            if (type === 0) {
                this.cells = [
                    { label: "权力设定时间", key: "qlsdsj", colspan: 0 },
                    { label: "抵押权人", key: "dyqr", colspan: 0 },
                    {
                        label: "被担保债权数额",
                        key: "bdbzqse",
                        colspan: 0
                    },
                    { label: "债务人", key: "zwr", colspan: 0 },
                    { label: "抵押面积", key: "dymj", colspan: 0 },
                    { label: "债务履行期限", key: "zwrxqx", colspan: 0 },
                    { label: "状态", key: "dyzt", colspan: 0 },
                    { label: "抵押件号", key: "dyjh", colspan: 0 }
                ];
            } else {
                this.cells = [
                    { label: "限制登记单位", key: "xzdjdw", colspan: 0 },
                    {
                        label: "限制登记文书文号",
                        key: "xzdjwswh",
                        colspan: 0
                    },
                    {
                        label: "限制登记文书送达时间",
                        key: "xzdjwssdsj",
                        colspan: 0
                    }
                ];
            }
            this.tableInfoVisible = true;
        },
        getData() {
            for (const key in this.form) {
                this.form[key] = this.form[key] !== "" ? this.form[key] : null;
            }
            this.loading = true;
            houseAnalysis(this.form).then(res => {
                if (res.data) {
                    let { rows, total } = res.data;
                    this.setTable(rows);
                    this.total = total;
                }
                this.loading = false;
                this.queryLoading = false;
            });
        },
        query() {
            this.queryLoading = true;
            this.getData();
        },
        setTable(value) {
            let table = value.map(el => {
                switch (el.gyfs) {
                    case "1":
                        el.gyfs = "夫妻共有";
                        break;
                    case "2":
                        el.gyfs = "家庭共有";
                        break;
                    case "3":
                        el.gyfs = "合伙共有";
                        break;
                    case "4":
                        el.gyfs = "合资共有";
                        break;
                    default:
                        break;
                }
                el.mj = el.mj + "cm²";
                el.je = el.je + "元";
                return el;
            });
            this.rows = table;
        }
    },
    created() {
        this.tableOptions["max-height"] = document.body.offsetHeight - 350;
        this.form.idCard = this.idCard;
        this.form.type = Number(this.type);
        this.columnsList.forEach(el => {
            if (el.type === this.type) {
                this.columns = el.columns;
            }
        });
    },
    mounted() {
        houseStaticsAnalysis(this.form).then(res => {
            if (res.data) {
                this.houses_tatics = res.data;
            }
        });
    },
    beforeDestroy() {}
};
</script>
<style lang="scss" scoped>
@import "@/styles/basic-color.scss";

.select_condition {
    height: 32px;
    width: 1000px;
    display: flex;
}
.statistic {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #e3e6f8;
    border-left: 3px solid $color-primary;
    height: 90px;
    margin-bottom: 10px;
    padding-left: 20px;

    .statistic_icon {
        text-align: center;
        line-height: 56px;
        width: 62px;
        height: 56px;
        background-color: #e7f3ff;
        .iconfont {
            font-size: 42px;
            color: $color-primary;
        }
    }
    .statistic_type {
        display: flex;
        .type_itme {
            padding: 0 20px 0 50px;
            .type {
                color: rgba(0, 0, 0, 0.427450980392157);
                font-weight: 400;
                font-style: normal;
                line-height: 22px;
            }
            .number {
                font-size: 20px;
                color: rgba(0, 0, 0, 0.847058823529412);
                line-height: 38px;
                text-align: right;
            }
        }
    }
}
</style>
<style lang="scss">
@import "@/styles/basic-color.scss";
.mortgage_type_1,
.mortgage_type_2,
.mortgage_type_3,
.mortgage_type_4 {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 5px;
}
// 状态 1 已抵押 2 已赎回 3 审核中 4 未抵押
.mortgage_type_4 {
    background-color: $color-success;
}
.mortgage_type_1 {
    background-color: $color-danger;
}
.mortgage_type_3 {
    background-color: $mortgage-type;
}
.mortgage_type_2 {
    background-color: $color-primary;
}
</style>
