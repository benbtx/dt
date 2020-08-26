<template>
    <el-dialog
        :visible.sync="isVisible"
        :close-on-click-modal="false"
        @open="open"
        @close="optionValue = ''"
        title="查看详情"
        width="90vw"
        class="pub_dialog"
    >
        <el-tabs
            v-if="isVisible"
            v-model="optionValue"
            type="card"
            @tab-click="tabClick"
        >
            <el-tab-pane
                v-for="(item, index) in row.dimensionList"
                :key="index"
                :label="item"
                :name="item"
            >
                <tableList
                    v-if="optionValue == item"
                    :data="row"
                    :type="optionValue"
                    :transferAmount="transferAmount"
                    :date="date"
                    ref="tableList"
                />
            </el-tab-pane>
        </el-tabs>
        <div class="export">
            <kr-export
                buttonType="primary"
                :fnGetData="fnGetData"
                :config="tableExportConfig"
                :fileName="fileName"
            ></kr-export>
        </div>
    </el-dialog>
</template>

<script>
import tableList from "./table-list";
import {
    familyConfig,
    investConfig,
    trainConfig,
    busConfig,
    liveConfig,
    transferConfig,
    flyConfig,
    colleagueConfig,
    transferRecordConfig,
    togetherConfig,
    transferException
} from "@/components/kr-excel-export/export.config.js";

export default {
    name: "kr-detail-info",
    components: {
        tableList
    },
    props: {
        // 通过表格传值，应满足默认结构,dimensionList，表示要显示的tab项
        // row:{
        //     sourceIdCard,
        //     targetIdCard,
        //     sourceNodeId,
        //     targetNodeId,
        //     dimensionList
        // }
        row: {
            type: Object,
            default: () => {
                return {
                    dimensionList: ["通话异常"]
                };
            }
        },
        // 该值针对交易金额筛选
        transferAmount: String,
        // 该值针对时间筛选
        date: Array
    },
    data() {
        return {
            isVisible: false,
            optionValue: "",
            fileName: ""
        };
    },
    computed: {
        tableExportConfig() {
            switch (this.optionValue) {
                case "企业主要人员":
                    return colleagueConfig;
                case "同行-飞机":
                    return flyConfig;
                case "银行卡转账":
                    return transferConfig;
                case "同住":
                    return liveConfig;
                case "同行-大巴":
                    return busConfig;
                case "同行-火车":
                    return trainConfig;
                case "投资":
                    return investConfig;
                case "同户":
                    return familyConfig;
                case "交易记录":
                    return transferRecordConfig;
                case "同行":
                    return togetherConfig;
                case "交易异常":
                    return transferException;
                default:
                    break;
            }
        }
    },
    methods: {
        async fnGetData() {
            return await this.$refs.tableList[0].getExportData();
        },
        open() {
            this.optionValue = this.row.dimensionList[0];
            this.fileName = `${
                this.row.object
                    ? this.row.object
                    : `${this.row.sourceIdCard} 与 ${this.row.targetIdCard}`
            }-${this.optionValue}详情-`;
        },
        tabClick() {
            this.fileName = `${
                this.row.object
                    ? this.row.object
                    : `${this.row.sourceIdCard} 与 ${this.row.targetIdCard}`
            }-${this.optionValue}详情-`;
        }
    }
};
</script>
<style lang="scss" scoped>
.pub_dialog {
    overflow: hidden;
    & /deep/ .el-tabs__header {
        margin: 0;
    }
    .export {
        position: absolute;
        right: 20px;
        top: 65px;
    }
}
</style>
