<template>
    <imp-panel>
        <el-tabs
            v-model="optionValue"
            type="card"
            slot="body"
            class="fcfx_content"
            v-if="idCard"
            @tab-click="tabClick"
        >
            <el-tab-pane
                v-for="(item, index) in flowTypeList"
                :key="index"
                :label="item.label"
                :name="item.name"
            >
                <keep-alive>
                    <table-list
                        v-if="optionValue === item.name"
                        :type="item.name"
                        :idCard="idCard"
                        ref="tableList"
                        @query="$refs.choose.handleClick"
                    />
                </keep-alive>
            </el-tab-pane>
        </el-tabs>
        <kr-no-data v-else />
        <kr-choose
            :all="all"
            slot="aside"
            warnTitle
            ref="choose"
            :isCheckbox="false"
            @clearAll="clearAll"
            @startAnalysis="startAnalysis"
            :isPerson="true"
            :hsaRadio="false"
        ></kr-choose>
    </imp-panel>
</template>
<script>
import { getSAObjectByDABH } from "api/zhfx/relation-network.js";
import tableList from "./table-list";

export default {
    name: "",
    props: {},
    components: {
        tableList
    },
    data() {
        return {
            optionValue: "0",
            flowTypeList: [
                { name: "0", label: "名下房产" },
                { name: "1", label: "家庭房产" }
            ],
            checkList: [],
            all: [],
            idCard: ""
        };
    },
    computed: {},
    watch: {},
    methods: {
        tabClick() {
            setTimeout(() => {
                this.$refs.tableList[0].query();
            });
        },
        clearAll() {
            this.idCard = "";
            this.$refs.tableList.map(el => {
                el.rows = [];
                return el;
            });
        },
        startAnalysis(persons) {
            if (persons.length === 0) {
                this.$message.warning("请选择分析对象");
                return;
            }
            this.idCard = persons.zjhm;
            setTimeout(() => {
                this.$refs.tableList[0].query();
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
.fcfx_content {
    padding: 10px 10px 10px 20px;
}
</style>
