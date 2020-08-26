<template>
    <el-switch
        v-model="is"
        active-color="#1490FF"
        inactive-color="#C0C0C0"
        @change="change"
    ></el-switch>
</template>

<script>
export default {
    name: "shared",
    props: {
        row: {
            type: Object
        }
    },
    data() {
        return {
            is: false
        };
    },
    mounted() {
        this.is = this.row.isShared == "0" ? true : false;
    },
    methods: {
        change() {
            this.$emit("changeShare", this.row, this.is);
        }
    },
    watch: {
        row() {
            this.is = this.row.isShared == "0" ? true : false;
        }
    }
};
</script>

<style scoped></style>
