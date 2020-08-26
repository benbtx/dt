<template>
    <div>
        <el-dialog title="图表详情" :visible.sync="visible" width="80vw">
            <div class="title">
                {{ optionValue | type }}资金图表分析<span class="export">
                    <kr-export
                        buttonType="primary"
                        :exportConfig="exportMulConfig"
                        :fileName="fileName"
                    ></kr-export>
                </span>
            </div>
            <Bar :dialogData="dData"></Bar>
            <kr-el-table
                :options="options"
                :columns="dialogColumns"
                :rows="dData"
                :total="dData.length"
                :pageNum="dialogParams.pageNum"
                @on-page-change="handleDialogPageChange"
                :sortMethod="sortChange"
            ></kr-el-table>
        </el-dialog>
    </div>
</template>

<script>
import { moneyLaunderingRelationConfigDetail } from "@/components/kr-excel-export/export.config.js";
import { DialogTable as dialogColumns, options } from "./module";
import Bar from "./bar";
import { cloneDeep } from "loadsh";
const PAGE_SIZE = 10;
export default {
    components: {
        Bar
    },
    props: {
        optionValue: {
            type: String,
            default: "0"
        },
        dialogTableVisible: {
            type: Boolean,
            default: false
        },
        dialogTabLoading: {
            type: Boolean,
            default: false
        },
        dialogData: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            fileName: "",
            options,
            dData: [],
            visible: false,
            dialogColumns: dialogColumns(),
            dialogParams: {
                pageNum: 1,
                pageSize: PAGE_SIZE,
                sortRule: "DESC",
                sortName: "TIME"
            }
        };
    },
    computed: {
        networkRelationConfig() {
            return moneyLaunderingRelationConfigDetail;
        }
    },
    watch: {
        dialogTableVisible() {
            this.visible = true;
        },
        dialogData() {
            this.dData = cloneDeep(this.dialogData);
            this.sort("dealTime", "ascending");
        }
    },
    methods: {
        exportMulConfig() {
            let { fnGetData, networkRelationConfig: config } = this;
            return [{ config, fnGetData }];
        },
        fnGetData() {
            return this.dData;
        },
        handleDialogPageChange(current, size) {
            this.dialogParams = {
                ...this.dialogParams,
                pageNum: current,
                pageSize: size
            };
        },
        sortChange({ prop, order }) {
            this.sort(prop, order);
        },
        // 自定义排序
        sort(prop, order) {
            if (order === "ascending") {
                this.dData.sort((a, b) => {
                    if (prop === "dealTime") {
                        return Date.parse(a[prop]) - Date.parse(b[prop]);
                    }
                    return Number.parseInt(a[prop]) - Number.parseInt(b[prop]);
                });
            } else if (order === "descending") {
                this.dData.sort((a, b) => {
                    if (prop === "dealTime") {
                        return Date.parse(b[prop]) - Date.parse(a[prop]);
                    }
                    return Number.parseInt(b[prop]) - Number.parseInt(a[prop]);
                });
            } else {
                this.dData = cloneDeep(this.dialogData);
            }
        }
    },
    filters: {
        type(value) {
            return value === "0" ? "流出" : "流入";
        }
    },
    mounted() {}
};
</script>

<style lang="scss" scoped>
.title {
    height: 40px;
    font-size: 16px;
    position: relative;
}
.export {
    position: absolute;
    right: 0;
    top: -20px;
    z-index: 1000;
    margin: 20px;
}
</style>
