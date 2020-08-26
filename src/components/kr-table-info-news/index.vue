<template>
    <d2-crud :columns="columns" :data="rows" :options="options" />
</template>

<script>
export default {
    name: "kr-table-info",

    props: {
        data: {
            type: Array,
            default() {
                return [];
            }
        },

        columnsGroup: {
            type: Number,
            default: 3
        }
    },

    data() {
        return {
            options: {
                size: "medium",
                border: true,
                showHeader: false,
                cellStyle({ column }) {
                    return column.label.indexOf("-label") !== -1
                        ? {
                              padding: "15px",
                              background: "#FAFAFA",
                              color: "#000"
                          }
                        : {
                              padding: "15px",
                              background: "#FFF",
                              color: "#5A5A5A"
                          };
                },
                spanMethod({ row, rowIndex, columnIndex }) {
                    if (row.span) {
                        for (let key in row.span) {
                            // 提取定位返回要合并的单元格数据
                            const [rowIdx, columnIdx] = key.split("-");
                            if (
                                "row" + rowIndex === rowIdx &&
                                "column" + columnIndex === columnIdx
                            ) {
                                // 第一个元素代表 rowspan ，第二个元素代表 colspan
                                return [1, row.span[key]];
                            }
                        }
                    }
                }
            }
        };
    },

    computed: {
        refiningData() {
            const group = this.columnsGroup;
            const max = group * 2;
            const data = getInitialData(this.data);
            const layoutData = getLayoutData(data, max);
            return {
                columns: this.getColumns(group),
                rows: this.getRows(layoutData, group)
            };
        },

        columns() {
            return this.refiningData.columns;
        },

        rows() {
            return this.refiningData.rows;
        }
    },

    methods: {
        getColumns(group) {
            const columns = [];
            for (let i = 0; i < group; i++) {
                const fieldStr = `field${i + 1}-label`;
                const valueStr = `field${i + 1}-value`;
                columns.push({ title: fieldStr, key: fieldStr });
                columns.push({ title: valueStr, key: valueStr });
            }
            return columns;
        },

        getRows(data) {
            const rows = data.map((arr, rowIndex) => {
                return arr.reduce(
                    (acc, item, index) => {
                        const {
                            label,
                            value,
                            valueOfColumn,
                            labelOfColumn,
                            render
                        } = item;
                        const fieldStr = `field${index + 1}-label`;
                        const valueStr = `field${index + 1}-value`;
                        const count = valueOfColumn + labelOfColumn;
                        acc[fieldStr] = label;
                        acc[valueStr] = value
                            ? render
                                ? render(value)
                                : value
                            : "-";
                        // 定位要合并的单元格：大于1才会有合并操作
                        if (valueOfColumn && valueOfColumn > 1) {
                            if (!acc.span) {
                                acc.span = {};
                            }
                            acc.span[
                                `row${rowIndex}-column${acc.num + 1}`
                            ] = valueOfColumn;
                        }
                        acc.num += count;
                        return acc;
                    },
                    { num: 0 }
                );
            });
            return rows;
        }
    }
};
/**
 * 数据布局：添加字段默认占行数和列数
 */
function getInitialData(data) {
    const ret = data.map(item => {
        // label字段列数：默认为1，目前不支持自定义配置，
        item.labelOfColumn = 1;

        // value字段列数：默认为1，目前不支持自定义偶数配置
        if (item.valueOfColumn) {
            if (item.valueOfColumn % 2 === 0) {
                throw new Error("不支持偶数配置");
            }
        } else {
            item.valueOfColumn = 1;
        }

        return item;
    });
    return ret;
}

/**
 * 判断当前行的数据是否已满
 * @param {Array} row 每一行的数据
 * @param {Number} max 最大存放列数
 */
function rowColums(row) {
    const i = row.reduce((acc, item) => {
        const { valueOfColumn, labelOfColumn } = item;
        const count = valueOfColumn + labelOfColumn;
        return acc + count;
    }, 0);
    return i;
}

/**
 * 获取切片数据
 * @param {Array} 初始数据
 * @param {Number} 最大列数
 */
function getLayoutData(data, max) {
    const result = [];
    let row = [];

    data.forEach((item, index) => {
        const { valueOfColumn, labelOfColumn } = item;
        const count = rowColums(row) + valueOfColumn + labelOfColumn;
        if (count <= max) {
            row.push(item);
        } else {
            result.push(row);
            row = [item];
        }
        // 最后项单独处理
        if (data.length - 1 === index) {
            if (count <= max) {
                result.push(row);
            } else {
                result.push([item]);
            }
            row = [];
        }
    });
    return result;
}
</script>

<style lang="scss" module></style>
