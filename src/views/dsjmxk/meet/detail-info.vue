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
        <el-tabs v-if="isVisible" v-model="optionValue" type="card">
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
                />
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>

<script>
import tableList from "./table-list";
export default {
    name: "details-info",
    components: {
        tableList
    },
    props: {
        row: {
            type: Object
        }
    },
    data() {
        return {
            isVisible: false,
            optionValue: ""
        };
    },
    computed: {},
    methods: {
        open() {
            this.optionValue = this.row.dimensionList[0];
        }
    }
};
</script>
<style lang="scss" scoped></style>
