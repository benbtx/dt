<template>
    <div>
        <kr-section-title
            title="设置关联字段"
            style="margin-bottom: 20px"
        ></kr-section-title>
        <div>
            <el-row>
                <div style="float: left;width: 250px">{{ dataA.name }}</div>
                <div style="float: left;width: 96px">&nbsp;</div>
                <div style="float: left;width: 250px">{{ dataB.name }}</div>
            </el-row>
            <el-row
                class="field-row"
                v-for="(item, index) in field"
                :key="index"
            >
                <el-select
                    v-model="item.fieldA"
                    placeholder="请选择"
                    style="float: left;width: 250px"
                    clearable
                >
                    <el-option
                        v-for="item in dataA.field"
                        :key="item.enName"
                        :label="item.cnName"
                        :value="item.enName"
                    >
                    </el-option>
                </el-select>
                <div class="tip" style="float: left">
                    关联字段
                </div>
                <el-select
                    v-model="item.fieldB"
                    placeholder="请选择"
                    style="float: left;;width: 250px"
                    clearable
                >
                    <el-option
                        v-for="item in dataB.field"
                        :key="item.enName"
                        :label="item.cnName"
                        :value="item.enName"
                    >
                    </el-option>
                </el-select>
                <div @click="dele(index)">
                    <kr-icon
                        icon="el-icon-remove-outline"
                        :size="25"
                        style="line-height: 36px;padding-left: 10px;cursor: pointer"
                    ></kr-icon>
                </div>
            </el-row>
            <div class="add" @click="add">+关联字段</div>
        </div>
        <kr-section-title
            title="交集结果字段展示"
            style="margin: 20px 0px"
        ></kr-section-title>
        <kr-table
            :total="table.length"
            :rows="table"
            :options="tableOptions"
            :columns="columns"
            :indexRow="false"
            :showPagination="false"
        ></kr-table>
    </div>
</template>

<script>
import checked from "./components/checked";
export default {
    name: "comparison-set",
    props: ["dataA", "dataB", "relationFields", "showFields"],
    data() {
        const shelf = this;
        return {
            value: "",
            field: [],
            tableOptions: {},
            table: [],
            columns: [
                {
                    title: "",
                    component: {
                        render(h, row, _, index) {
                            return h(checked, {
                                props: {
                                    row: row.fieldA
                                },
                                on: {
                                    checkedChange: is => {
                                        shelf.table[index].fieldA.checked = is;
                                    }
                                }
                            });
                        }
                    }
                },
                {
                    title: "",
                    component: {
                        render(h, row, _, index) {
                            return h(checked, {
                                props: {
                                    row: row.fieldB
                                },
                                on: {
                                    checkedChange: is => {
                                        shelf.table[index].fieldB.checked = is;
                                    }
                                }
                            });
                        }
                    }
                }
            ]
        };
    },
    mounted() {
        this.changeData();
    },
    methods: {
        add() {
            this.field.push({ fieldA: "", fieldB: "" });
        },
        dele(index) {
            this.field.splice(index, 1);
        },
        changeData() {
            this.columns[0].title = this.dataA.name;
            this.columns[1].title = this.dataB.name;
            this.table = [];
            if (this.dataB.field) {
                this.dataB.field.map((value, index) => {
                    if (!this.table[index]) {
                        let checked =
                            this.showFields &&
                            this.showFields[1] &&
                            this.showFields[1].findIndex(
                                v => v == value.enName
                            ) != -1
                                ? true
                                : false;
                        this.table.push({
                            fieldB: {
                                ...value,
                                title: value.cnName,
                                checked
                            }
                        });
                    } else {
                        let checked =
                            this.showFields &&
                            this.showFields[1] &&
                            this.showFields[1].findIndex(
                                v => v == value.enName
                            ) != -1
                                ? true
                                : false;
                        this.table[index].fieldB = {
                            ...value,
                            title: value.cnName,
                            checked
                        };
                    }
                });
            }
            if (this.dataA.field) {
                this.dataA.field.map((value, index) => {
                    if (!this.table[index]) {
                        let checked =
                            this.showFields &&
                            this.showFields[0] &&
                            this.showFields[0].findIndex(
                                v => v == value.enName
                            ) != -1
                                ? true
                                : false;
                        this.table.push({
                            fieldA: {
                                ...value,
                                title: value.cnName,
                                checked
                            }
                        });
                    } else {
                        let checked =
                            this.showFields &&
                            this.showFields[0] &&
                            this.showFields[0].findIndex(
                                v => v == value.enName
                            ) != -1
                                ? true
                                : false;
                        this.table[index].fieldA = {
                            ...value,
                            title: value.cnName,
                            checked
                        };
                    }
                });
            }

            this.field = this.relationFields ? this.relationFields : [];
        }
    },
    watch: {
        dataA() {
            this.changeData();
        },
        dataB() {
            this.changeData();
        },
        relationFields() {
            this.changeData();
        },
        showFields() {
            this.changeData();
        }
    }
};
</script>

<style scoped lang="scss">
.tip {
    display: inline-block;
    padding: 0 20px;
    border-bottom: 1px solid gainsboro;
    margin-top: 0px;
}
.field-row {
    margin-top: 20px;
}
.add {
    line-height: 30px;
    border: 1px dashed gainsboro;
    border-radius: 3px;
    text-align: center;
    cursor: pointer;
    width: 596px;
    margin-top: 20px;
}
</style>
