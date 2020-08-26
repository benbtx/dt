<template>
    <el-dialog
        :visible.sync="isVisible"
        :close-on-click-modal="false"
        top="2vh"
        @open="open"
        @close="optionValue = ''"
        title="确认选择"
        width="640px"
    >
        <el-alert
            title="多时空伴随分析需要选择一个对象作为主体分析 "
            type="warning"
        ></el-alert>
        <kr-section-title title="主对象选择" :size="18"></kr-section-title>
        <template>
            <el-radio-group v-model="keyperson" style="margin-top:20px">
                <el-radio
                    v-for="(item, index) in person"
                    :key="index"
                    :label="item.zjhm"
                    >{{ item.mc }}</el-radio
                >
            </el-radio-group>
        </template>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isVisible = false">取 消</el-button>
            <el-button type="primary" @click="btn_Confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: "keypersonnel-select",
    components: {},
    props: {
        person: {
            type: Array
        }
    },
    data() {
        return {
            isVisible: false,
            keyperson: "" //选中人员的 label 值 即为zjhm
        };
    },
    computed: {},
    methods: {
        open() {
            // this.optionValue = this.row.dimensionList[0];
        },
        btn_Confirm() {
            if (this.keyperson == "") {
                this.$message("请选择一个对象");
                return;
            }
            this.isVisible = false;
            this.$emit("pickKeyPersonnel");
        }
    }
};
</script>
<style lang="scss" scoped></style>
