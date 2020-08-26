<template>
    <div>
        <kr-table
            :total="total"
            :rows="rows"
            :columns="header"
            :current="current"
            @on-page-change="handlePageChange"
        ></kr-table>
        <slot name="footer"></slot>
    </div>
</template>

<script>
export default {
    name: "excel_import_table_list",

    props: {
        body: {
            type: Array,
            default() {
                return [];
            }
        },
        header: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    computed: {
        total() {
            return this.body.length;
        },
        rows() {
            const { current, size } = this;
            return this.body.slice((current - 1) * size, current * size);
        }
    },
    watch: {
        total(val) {
            this.current = 1;
        }
    },
    data() {
        return {
            current: 1,
            size: 10
        };
    },
    methods: {
        handlePageChange(pageNum, pageSize) {
            this.current = pageNum;
            this.size = pageSize;
        }
    }
};
</script>

<style lang="scss" module></style>
