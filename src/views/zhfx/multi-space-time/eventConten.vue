<template>
    <div class="container">
        <span
            v-for="(item, index) in row.events"
            :key="index"
            @click="getDetail(item, row.date)"
        >
            <el-link type="primary">{{ item.showInfo }}</el-link>
            <span class="dhcolor" v-if="index != row.events.length - 1">
                ,
            </span>
        </span>
    </div>
</template>

<script>
export default {
    name: "relationPath",
    props: {
        accountList: {
            type: Array
        },
        row: {
            type: Object
        }
    },
    data() {
        return {};
    },
    methods: {
        getDetail(item, date) {
            this.$emit("detail", { item: item, date: date });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/styles/basic-color.scss";
.dhcolor {
    color: $color-primary;
}
.container {
    width: 100%;
    overflow-x: auto;
    // display: flex;
    // flex-direction: row;
    // flex-wrap: nowrap;
    // white-space: nowrap;
    // .box {
    //     height: 30px;
    //     line-height: 30px;
    //     .line {
    //         border-bottom: 1px solid #d0d0d0;
    //         line-height: 15px;
    //         margin: 0 10px;
    //         padding: 0 30px;
    //         .type {
    //             color: $color-primary;
    //             cursor: pointer;
    //         }
    //     }
    // }
}
</style>
