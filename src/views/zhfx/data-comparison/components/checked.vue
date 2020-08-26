<template>
    <el-checkbox
        v-if="row && row.title"
        v-model="checked"
        @change="checkedChange"
        >{{ row.title }}</el-checkbox
    >
</template>

<script>
export default {
    name: "checked",
    props: {
        row: {
            type: Object
        }
    },
    data() {
        return {
            checked: false
        };
    },
    mounted() {
        if (this.row) {
            this.checked = this.row.checked;
        }
    },
    methods: {
        checkedChange() {
            this.$emit("checkedChange", this.checked);
        }
    },
    watch: {
        row() {
            if (this.row) {
                this.checked = this.row.checked;
            }
        }
    }
};
</script>

<style scoped></style>
