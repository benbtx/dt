<template>
    <el-select
        v-model="value"
        placeholder="请选择"
        clearable
        @change="valueChange"
    >
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            v-if="isType(item.type)"
        ></el-option>
    </el-select>
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
        type: {
            type: String
        },
        index: {
            type: Number
        }
    },
    data() {
        return {
            options: [
                {
                    value: "=",
                    label: "等于",
                    type: "0,1,2"
                },
                {
                    value: "!=",
                    label: "不等于",
                    type: "0,1,2"
                },
                {
                    value: ">",
                    label: "大于",
                    type: "0,2"
                },
                {
                    value: "<",
                    label: "小于",
                    type: "0,2"
                },
                {
                    value: "like",
                    label: "包含",
                    type: "1"
                },
                {
                    value: "notlike",
                    label: "不包含",
                    type: "1"
                },
                {
                    value: "notnull",
                    label: "不为空",
                    type: "0,1,2"
                }
            ],
            value: ""
        };
    },
    mounted() {
        this.value = this.row.condition;
    },
    methods: {
        isType(t) {
            return t.indexOf(this.type) !== -1 ? true : false;
        },
        valueChange() {
            this.$emit("valueChange", this.value, "condition", this.index);
        }
    },
    watch: {
        row() {
            this.value = this.row.condition;
        }
    }
};
</script>

<style scoped></style>
