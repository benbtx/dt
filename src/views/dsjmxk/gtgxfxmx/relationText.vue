<template>
    <div>
        <span
            v-for="(item, index) in row.commonRelationVOS"
            :key="index"
            class="text_color"
            @click="getDetail(item)"
        >
            {{ index ? ", " : "" }}{{ item.realName
            }}<span
                v-for="(dimension, index1) in item.dimensionalityList"
                :key="index1"
                >({{ dimension.relationType }}:{{ dimension.count }})</span
            >
        </span>
    </div>
</template>
<script>
export default {
    name: "relationText",
    props: {
        row: {
            type: Object
        }
    },
    components: {},
    data() {
        return {};
    },
    computed: {},
    watch: {},
    methods: {
        getDetail(info) {
            this.$emit("detail", info, this.row.realName);
        }
    },
    created() {},
    mounted() {},
    beforeDestroy() {}
};
</script>
<style lang="scss" scoped>
@import "@/styles/basic-color.scss";

.text_color {
    color: $color-primary;
    cursor: pointer;
}
</style>
