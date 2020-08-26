<template>
    <el-select
        v-model="value"
        placeholder="请选择"
        clearable
        @change="valueChange"
    >
        <el-option
            v-for="item in options"
            :key="item.enName"
            :label="item.cnName"
            :value="item.enName"
        >
        </el-option>
    </el-select>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            default: () => {
                return [];
            }
        },
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
            value: ""
        };
    },
    mounted() {
        this.value = this.row.field;
    },
    methods: {
        valueChange() {
            this.$emit("valueChange", this.value, "field", this.index);
        }
    },
    watch: {
        options() {
            if (this.value) {
                let index = this.options.findIndex(
                    value => value.enName == this.value
                );
                if (index == -1) {
                    this.value = "";
                }
            }
        },
        row() {
            this.value = this.row.field;
        }
    }
};
</script>

<style scoped></style>
