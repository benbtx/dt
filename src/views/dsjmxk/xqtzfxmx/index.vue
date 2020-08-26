<template>
    <imp-panel>
        <div class="export" slot="body">
            <kr-export
                buttonType="primary"
                :exportConfig="exportMulConfig"
                :fileName="fileName"
            ></kr-export>
        </div>
        <el-tabs
            v-model="optionValue"
            type="card"
            slot="body"
            class="xqfx_content"
        >
            <el-tab-pane
                v-for="(item, index) in flowTypeList"
                :key="index"
                :label="item.label"
                :name="item.name"
            >
                <keep-alive>
                    <table-list
                        @changeBtnLoading="changeBtnLoading"
                        @query="$refs.choose.handleClick()"
                        v-if="optionValue === item.name"
                        :type="item.name"
                        :idCards="idCards"
                        @lookDetails="lookDetails"
                        ref="tableList"
                    />
                </keep-alive>
            </el-tab-pane>
        </el-tabs>
        <dialogTable
            slot="body"
            :dialogData="dialogData"
            :optionValue="optionValue"
            :dialogTableVisible="dialogTableVisible"
        ></dialogTable>
        <kr-choose
            :all="all"
            slot="aside"
            warnTitle
            :btnLoading="btnLoading"
            ref="choose"
            @clearAll="clearAll"
            @startAnalysis="startAnalysis"
            :isPerson="true"
            :hsaRadio="false"
        ></kr-choose>
    </imp-panel>
</template>
<script>
import { getSAObjectByDABH } from "api/zhfx/relation-network.js";
import {
    moneyLaunderingRelationConfigOut,
    moneyLaunderingRelationConfigIn
} from "@/components/kr-excel-export/export.config.js";
import tableList from "./table-list";
import dialogTable from "./dialogTable";
export default {
    name: "",
    props: {},
    components: {
        tableList,
        dialogTable
    },
    data() {
        return {
            btnLoading: false,
            fileName: "",
            dialogTableVisible: false,
            dialogData: [],
            optionValue: "1",
            flowTypeList: [
                { name: "1", label: "资金流出分析" },
                { name: "0", label: "资金流入分析" }
            ],
            checkList: [],
            all: [],
            idCards: ""
        };
    },
    computed: {
        networkRelationConfig() {
            if (this.optionValue === "1") {
                return moneyLaunderingRelationConfigOut;
            }
            return moneyLaunderingRelationConfigIn;
        }
    },
    watch: {},
    methods: {
        changeBtnLoading(param) {
            this.btnLoading = param;
        },
        exportMulConfig() {
            let { fnGetData, networkRelationConfig: config } = this;
            return [{ config, fnGetData }];
        },
        async fnGetData() {
            return await this.$refs.tableList[0].getAllTableData();
        },
        lookDetails(row) {
            this.dialogData = row.flowCardList;
            this.dialogData.map((item, index) => {
                item.id = item.card + " " + index;
            });
            this.dialogTableVisible = !this.dialogTableVisible;
        },
        clearAll() {
            this.idCards = "";
        },
        startAnalysis(persons) {
            if (persons.length < 1) {
                this.$message.warning("至少选择一个分析对象");
                return;
            }
            this.btnLoading = true;
            this.fileName = `洗钱特征分析-${
                persons[0].zjhm ? persons[0].mc : persons[0].ztmc
            },${
                persons[1]
                    ? persons[1].zjhm
                        ? persons[1].mc
                        : persons[1].ztmc
                    : ""
            }${persons[2] ? "等" : ""}`;
            this.idCards = persons.map(el => el.zjhm).join(",");
            setTimeout(async () => {
                await this.$refs.tableList[0].query("form");
            });
        }
    },
    created() {
        getSAObjectByDABH({
            dabh: this.$route.query.dabh,
            isMultipleCases: this.$route.query.isMultipleCases,
            dwbm: this.$route.query.dwbm
        }).then(res => {
            res.code === 0 ? (this.all = res.data.saxxModels) : "";
        });
    },
    mounted() {},
    beforeDestroy() {}
};
</script>
<style lang="scss" scoped>
.xqfx_content {
    height: 100%;
    padding: 20px;
}
.export {
    position: absolute;
    right: 0;
    z-index: 1000;
    margin: 20px;
}
</style>
