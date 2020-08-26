<template>
    <div>
        <el-date-picker
            v-if="row.type == 2"
            v-model="content"
            type="datetime"
            :disabled="row.condition == 'notnull' ? true : false"
            @change="valueChange"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 215px"
            placeholder="选择日期时间"
        >
        </el-date-picker>
        <el-input
            v-else
            v-model="content"
            :disabled="row.condition == 'notnull' ? true : false"
            placeholder="请输入内容"
            style="width: 215px"
            clearable
            @change="valueChange"
        ></el-input>
    </div>
</template>

<script>
export default {
    props: {
        row: {
            type: Object,
            default: () => {
                return {};
            }
        },
        index: {
            type: Number
        }
    },
    data() {
        return {
            content: ""
        };
    },
    mounted() {
        this.content = this.row.content;
    },
    methods: {
        valueChange() {
            var reg = /^(\-|\+)?\d+(\.\d+)?$/;
            if (this.row.type == 0) {
                if (!reg.test(this.content)) {
                    this.$message.warning("该字段是数据类型,请输入数字");
                    this.content = "";
                }
            }
            this.$emit("valueChange", this.content, "content", this.index);
        }
    },
    watch: {
        row() {
            setTimeout(() => {
                this.content = this.row.content;
            });
        }
    }
};
</script>

<style scoped></style>
