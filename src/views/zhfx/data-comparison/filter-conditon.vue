<template>
    <div>
        <kr-section-title title="对比字段选择"></kr-section-title>
        <div>
            <el-checkbox-group v-model="checkList" @change="checkChange">
                <el-row class="check">
                    <el-col
                        :span="4"
                        v-for="(item, index) in field"
                        :key="index"
                        class="check-list"
                    >
                        <el-checkbox :label="item.enName">{{
                            item.cnName
                        }}</el-checkbox>
                    </el-col>
                </el-row>
            </el-checkbox-group>
        </div>
        <kr-section-title
            title="查询条件"
            style="padding-top: 20px"
        ></kr-section-title>
        <div>
            <kr-table
                :total="table.length"
                :rows="table"
                :columns="columns"
                :options="tableOptions"
                :indexRow="false"
                :showPagination="false"
            ></kr-table>
            <div class="add" @click="addCondition">
                +添加查询条件
            </div>
        </div>
    </div>
</template>

<script>
import { cloneDeep } from "loadsh";
import field from "./components/field";
import condition from "./components/condition";
import content from "./components/content";
export default {
    props: {
        field: {
            type: Array,
            default: () => {
                return [];
            }
        },
        conditions: {
            type: Array,
            default: () => {
                return [];
            }
        },
        checkConditions: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        const shelf = this;
        return {
            isChange: 0,
            checkList: [],
            options: [],
            tableOptions: {
                border: false,
                "empty-text": "请添加条件"
            },
            columns: [
                {
                    title: "查询字段",
                    component: {
                        render(h, row, _, index) {
                            return h(field, {
                                props: {
                                    options: shelf.options,
                                    row: row,
                                    index: index
                                },
                                on: {
                                    valueChange: shelf.valueChange
                                }
                            });
                        }
                    }
                },
                {
                    title: "查询关系",
                    component: {
                        render(h, row, _, index) {
                            return h(condition, {
                                props: {
                                    row: row,
                                    index: index,
                                    type: row.type,
                                    isChange: shelf.isChange
                                },
                                on: {
                                    valueChange: shelf.valueChange
                                }
                            });
                        }
                    }
                },
                {
                    title: "查询内容",
                    component: {
                        render(h, row, _, index) {
                            return h(content, {
                                props: {
                                    row: row,
                                    index: index
                                },
                                on: {
                                    valueChange: shelf.valueChange
                                }
                            });
                        }
                    }
                },
                {
                    title: "操作",
                    width: 100,
                    component: {
                        render(h, row, _, index) {
                            return (
                                <div>
                                    <el-button
                                        type="text"
                                        onClick={() => shelf.handleDel(index)}
                                    >
                                        删除
                                    </el-button>
                                </div>
                            );
                        }
                    }
                }
            ],
            table: [],
            id: 1
        };
    },
    methods: {
        valueChange(value, field, index) {
            this.table[index][field] = value;
            if (field == "field" && value != "") {
                this.table[index].content = "";
                this.table[index].condition = "";
                this.options.map(it => {
                    if (it.enName == value) {
                        this.table[index].type = it.type.toString();
                    }
                });
            }
            if (this.table[index].condition == "notnull") {
                this.table[index].content = "";
            }
            this.table = [...this.table];
        },
        handleDel(index) {
            this.table.splice(index, 1);
        },
        checkChange() {
            this.options = [];
            this.checkList.map(value => {
                this.field.map(item => {
                    if (item.enName == value) {
                        this.options.push(item);
                    }
                });
            });
        },
        addCondition() {
            this.table.push({
                id: this.id,
                field: null,
                condition: null,
                content: null,
                type: null
            });
            this.id += 1;
        }
    },
    watch: {
        checkConditions() {
            this.checkList = cloneDeep(this.checkConditions);
        },
        conditions() {
            this.table = cloneDeep(this.conditions);
        },
        field() {
            this.checkChange();
        }
    }
};
</script>

<style scoped lang="scss">
.check {
    padding: 0 20px;
    .check-list {
        padding-top: 20px;
    }
}
.add {
    line-height: 30px;
    border: 1px dashed gainsboro;
    border-radius: 3px;
    text-align: center;
    cursor: pointer;
}
</style>
