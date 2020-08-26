<template>
    <imp-panel>
        <kr-analysis-page slot="body" titleA="推演分析" titleB="列表详情">
            <kr-tree-graph
                slot="component-chart"
                ref="graph"
                :graph="graph"
                :historyData="historyData"
                :root="root"
                :condition="saveCondition"
                @expand="expand"
                @handExpand="handExpand"
                @analysisHistory="analysisHistory"
                @saveAnalysis="openSave"
                @dateChange="dateChange"
                :date="time"
                @lineClick="lineClick"
                @nodeClick="nodeClick"
            >
                <div slot="info" style="height: 100%">
                    <systemExpansion
                        @submitForm="submitForm"
                        ref="systemExpansion"
                        :visible.sync="filterVisible"
                        v-kr-loading="systemLoading"
                        :association="association"
                        :condition="filter"
                        :isSystem="isSystem"
                        :allPerson="allPerson"
                        @submit="filterSubmit"
                    ></systemExpansion>
                    <node-details
                        :nodeInfo="nodeInfo"
                        :visible.sync="nodeVisible"
                    />
                </div>

                <!-- 保存分析  分析记录 -->
                <el-dialog
                    slot="info"
                    :modal-append-to-body="false"
                    :title="title"
                    :visible.sync="dialogVisible"
                    :width="title == '保存分析' ? '400px' : '800px'"
                >
                    <div v-kr-loading="historyLoading">
                        <kr-table
                            v-if="title == '分析记录'"
                            :options="tableOptions"
                            :total="historyTotal"
                            :rows="historyTabe"
                            :columns="historyColumns"
                            :showPagination="true"
                            @on-page-change="historyHandlePageChange"
                        ></kr-table>
                        <el-form
                            v-if="title == '保存分析'"
                            :model="ruleForm"
                            :rules="rules"
                            ref="ruleForm"
                            label-width="100px"
                            class="demo-ruleForm"
                        >
                            <el-form-item label="名称" prop="title">
                                <el-input
                                    ref="focusInput"
                                    v-model="ruleForm.title"
                                    style="width: 200px"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                label="描述"
                                prop="desc"
                                style="margin-top: 20px"
                            >
                                <el-input
                                    v-model="ruleForm.desc"
                                    type="textarea"
                                    placeholder="请输入内容"
                                    style="width: 200px"
                                    maxlength="50"
                                    show-word-limit
                                ></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false"
                            >关闭</el-button
                        >
                        <el-button
                            type="primary"
                            v-if="title == '保存分析'"
                            @click="save"
                            >确 定</el-button
                        >
                    </div>
                </el-dialog>
            </kr-tree-graph>
            <kr-analysis-page-table
                slot="component-table"
                title="列表详情"
                style="overflow-x: auto;"
            >
                <div slot="title-button">
                    <kr-export
                        buttonType="primary"
                        :exportConfig="exportMulConfig"
                        :fileName="fileName"
                    ></kr-export>
                </div>
                <div style="padding: 20px;">
                    <kr-table
                        :total="total"
                        :rows="rows"
                        :columns="columns"
                        :current="page"
                        :indexRow="indexRow"
                        @sort-change="sortChange"
                        @on-page-change="onPageChange"
                    ></kr-table>
                </div>
            </kr-analysis-page-table>
        </kr-analysis-page>
        <kr-choose
            @startAnalysis="startAnalysis"
            :btnLoading="btnLoading"
            @clearAll="clearAll"
            :isCheckbox="false"
            :hsaRadio="false"
            warnTitle
            :all="all"
            slot="aside"
        ></kr-choose>
        <kr-detail-info slot="body" ref="detailInfo" :row="row" :date="date" />
    </imp-panel>
</template>

<script type="text/babel">
import { networkRelationConfig } from "@/components/kr-excel-export/export.config.js";
import systemExpansion from "./module/system-expansion";
import { getSAObjectByDABH } from "api/zhfx/relation-network.js";
import nodeDetails from "../relation-network-analysis/node-details";
import {
    inferenceAssociation,
    inferenceQuery,
    inferenceRefresh
} from "api/zhfx/inference.js";
import {
    delAnalysis,
    saveAnalysisList,
    getAnalysisList
} from "@/api/zhfx/dimension-relation-analysis.js";
export default {
    components: {
        nodeDetails,
        systemExpansion
    },
    data() {
        const $shelf = this;
        return {
            results: [],
            tableOptions: {
                "max-height": 500
            },
            btnLoading: false,
            fileName: "",
            time: [],
            allPerson: [],
            historyTabe: [],
            historyTotal: 0,
            historyData: {},
            root: {},
            graph: [],
            mainId: "",
            systemLoading: false,
            association: [],
            row: {},
            isSystem: true,
            total: 0,
            page: 1,
            pageSize: 10,
            indexRow: false,
            rows: [],
            table: [],
            condition: {
                airplaneCount: null, //飞机同行次数
                busCount: null, //大巴同行次数
                callAmount: null, //通话时长
                callCount: null, //通话次数
                dabh: this.$route.query.dabh, //案件编号,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                dimensionality: null, //维度
                startTime: null, //开始时间
                endTime: null, //结束时间
                idCard: null,
                liveCount: null, //同住次数
                intimacyRange: null, //关系层级
                trainCount: null, //火车同
                transferAmount: null, //交易金额
                transferCount: null //交易次数
            },
            saveCondition: {},
            columns: [
                {
                    title: "关联度",
                    width: 100,
                    key: "intimacy",
                    sortable: "custom",
                    formatter(row) {
                        return row.intimacy;
                    }
                },
                {
                    title: "对象",
                    key: "object"
                },
                {
                    title: "维度记录",
                    key: "dimension"
                },
                {
                    title: "操作",
                    width: 100,
                    component: {
                        render(h, row) {
                            return (
                                <el-button
                                    type="text"
                                    onClick={() => $shelf.lookDetails(row)}
                                >
                                    查看详情
                                </el-button>
                            );
                        }
                    }
                }
            ],
            date: [],
            all: [],
            checkList: [],
            filter: {},
            filterVisible: false,
            historyPage: 1,
            historyPageSize: 10,
            dialogVisible: false,
            historyLoading: false,
            title: "",
            ruleForm: {
                title: "",
                desc: ""
            },
            rules: {
                title: [
                    { required: true, message: "请输入名称", trigger: "blur" },
                    {
                        min: 1,
                        max: 20,
                        message: "长度在 1 到 20 个字符",
                        trigger: "blur"
                    }
                ],
                desc: [
                    { required: true, message: "请输入描述", trigger: "blur" },
                    {
                        min: 1,
                        max: 50,
                        message: "长度在 1 到50 个字符",
                        trigger: "blur"
                    }
                ]
            },
            nodeVisible: false,
            nodeInfo: {},
            historyColumns: [
                {
                    title: "名称",
                    key: "title"
                },
                {
                    title: "描述",
                    key: "desc"
                },
                {
                    title: "保存时间",
                    key: "createTime",
                    formatter(row) {
                        return $shelf
                            .$dayjs(row.createTime)
                            .format("YYYY-MM-DD HH:mm:ss");
                    }
                },
                {
                    title: "操作",
                    component: {
                        render(h, row) {
                            return (
                                <div>
                                    <el-button
                                        type="text"
                                        onClick={() => $shelf.handleDel(row)}
                                    >
                                        删除
                                    </el-button>
                                    <el-button
                                        type="text"
                                        onClick={() => $shelf.handleEdit(row)}
                                    >
                                        编辑
                                    </el-button>
                                </div>
                            );
                        }
                    }
                }
            ]
        };
    },
    computed: {
        networkRelationConfig() {
            return networkRelationConfig;
        }
    },
    mounted() {
        this.tableOptions["max-height"] = document.body.offsetHeight - 350;
    },
    methods: {
        clearAll() {
            this.$refs.graph.emptyData();
            this.rows = [];
            this.table = [];
        },
        exportMulConfig() {
            let { fnGetData, networkRelationConfig: config } = this;
            return [{ config, fnGetData }];
        },
        fnGetData() {
            return this.table;
        },
        submitForm(node, relation) {
            this.$refs.graph.handlAdd({
                age: node.age,
                auto: 0,
                idCard: node.zjhm ? node.zjhm : node.tyshxydm,
                id: node.zjhm ? node.zjhm : node.tyshxydm,
                labels: null,
                nodeId: node.zjhm ? node.zjhm : node.tyshxydm,
                nodeType: node.tyshxydm ? "01" : "00",
                objectType: 2,
                organization: null,
                position: null,
                realName: node.mc ? node.mc : node.ztmc,
                sex: node.xb,
                type: "add",
                relation: relation
            });
        },
        nodeClick(info) {
            this.filterVisible = false;
            this.nodeVisible = true;
            this.nodeInfo = info.data;
        },
        filterSubmit(params) {
            let dimensionality = [];
            this.initCondition();
            params.map(value => {
                dimensionality.push(value.id);
                value.conditions.map(item => {
                    this.condition[item.key] = item.value;
                    this.saveCondition[item.key] = item.value;
                });
            });
            this.condition.dimensionality = dimensionality.join(",");
            this.condition.dimensionality = this.condition.dimensionality
                ? this.condition.dimensionality
                : null;
            this.saveCondition.dimensionality = this.condition.dimensionality
                ? this.condition.dimensionality
                : null;
            inferenceQuery(this.condition).then(res => {
                if (res.data) {
                    this.setGraph(res.data, this.condition.transferAmount);
                    this.condition.transferAmount = null;
                }
                setTimeout(() => {
                    this.setTable(this.$refs.graph.linksData);
                });
            });
        },
        initCondition() {
            this.condition.airplaneCount = null;
            this.condition.busCount = null;
            this.condition.callAmount = null;
            this.condition.callCount = null;
            this.condition.dimensionality = null;
            this.condition.liveCount = null;
            this.condition.trainCount = null;
            this.condition.transferAmount = null;
            this.condition.transferCount = null;
            this.saveCondition = {
                airplaneCount: null,
                busCount: null,
                callAmount: null,
                callCount: null,
                dimensionality: null,
                liveCount: null,
                trainCount: null,
                transferAmount: null,
                transferCount: null
            };
        },
        onPageChange(page, pageSize) {
            this.page = page;
            this.pageSize = pageSize;
            this.getTablePage();
        },
        lookDetails(row) {
            this.$refs.detailInfo.isVisible = true;
            this.row = row;
        },
        getTablePage() {
            let start = (this.page - 1) * this.pageSize;
            let end = this.page * this.pageSize;
            if (!this.table[end]) {
                end = this.table.length;
            }
            this.rows = this.table.slice(start, end);
        },
        sortChange({ order }) {
            if (order == "ascending") {
                this.table = this.table.sort((a, b) => a.intimacy - b.intimacy);
            } else if (order == "descending") {
                this.table = this.table.sort((a, b) => b.intimacy - a.intimacy);
            }
            this.getTablePage();
        },
        handleEdit(row) {
            let obj = JSON.parse(row.content);
            if (obj.startTime) {
                this.time = [obj.startTime, obj.endTime];
            } else {
                this.time = ["", ""];
            }
            inferenceRefresh({
                ...obj.condition,
                params: obj.params
            })
                .then(data => {
                    this.dialogVisible = false;
                    this.setHistoryData(
                        data.data,
                        obj.links,
                        obj.params,
                        obj.nodes
                    );
                    setTimeout(() => {
                        this.setTable(this.$refs.graph.linksData);
                    });
                })
                .catch(() => {
                    this.dialogVisible = false;
                });
        },
        // 开始分析
        startAnalysis(persons) {
            if (persons.length === 0) {
                this.$message({
                    message: "请选择一个对象",
                    type: "error"
                });
                return;
            }
            this.nodeVisible = false;
            this.btnLoading = true;
            this.fileName = `研判推演-${
                persons.zjhm ? persons.mc : persons.ztmc
            }`;
            this.page = 1;
            this.pageSize = 10;
            this.total = 0;
            this.rows = [];
            this.systemLoading = true;
            this.filterVisible = true;
            setTimeout(() => {
                this.systemLoading = true;
            });
            this.condition.idCard = persons.zjhm || persons.tyshxydm;
            this.root = {
                age: persons.age,
                auto: 0,
                idCard: persons.zjhm ? persons.zjhm : persons.tyshxydm,
                id: persons.zjhm ? persons.zjhm : persons.tyshxydm,
                labels: null,
                nodeId: persons.zjhm ? persons.zjhm : persons.tyshxydm,
                nodeType: persons.tyshxydm ? "01" : "00",
                objectType: 1,
                organization: null,
                position: null,
                realName: persons.mc ? persons.mc : persons.ztmc,
                sex: persons.xb
            };
            inferenceAssociation({
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                idCard: this.condition.idCard
            }).then(res => {
                if (res.data) {
                    this.association = res.data;
                    this.systemLoading = false;
                    this.btnLoading = false;
                }
            });
            this.$refs.systemExpansion.resetForm();
        },
        setTable(value) {
            this.table = [];
            value.map(el => {
                let { source, target } = el;
                let dimensionList = [];
                let dimension = "";
                if (target.data.relation.relationTypeVOS) {
                    target.data.relation.relationTypeVOS.forEach(
                        (el, index) => {
                            dimension += `${index ? ",  " : ""}${
                                el.relationType
                            }:${el.score || 0}`;
                            dimensionList.push(el.relationType);
                        }
                    );
                    this.table.push({
                        intimacy: target.data.relation.intimacy,
                        object: `${source.data.realName} 与 ${target.data.realName}`,
                        sourceIdCard:
                            source.data.idCard || this.condition.idCard,
                        targetIdCard: target.data.idCard,
                        sourceNodeId:
                            source.data.nodeId || this.condition.idCard,
                        targetNodeId: target.data.nodeId,
                        dimensionList,
                        dimension,
                        amountCondition: target.data.amountCondition
                    });
                }
            });
            this.total = this.table.length;
            this.table = this.table.sort((a, b) => b.intimacy - a.intimacy);
            this.getTablePage();
        },
        handleDel(row) {
            this.historyLoading = true;
            delAnalysis({
                relativeId: row.relativeId
            }).then(data => {
                if (data.code == 0) {
                    this.$message.success("删除成功");
                    this.analysisHistory();
                }
            });
        },
        setGraph(data, amountCondition) {
            let list = [];
            data.nodeInfos.map(value => {
                if (value.nodeId != this.condition.idCard) {
                    data.relationVOS.map(item => {
                        if (
                            value.nodeId == item.source ||
                            value.nodeId == item.target
                        ) {
                            value.id = value.nodeId;
                            value.relation = {
                                auto: item.auto,
                                intimacy: item.intimacy,
                                relationTypeVOS: item.relationTypeVOS
                            };
                        }
                    });
                    value.amountCondition = amountCondition;
                    list.push(value);
                }
            });
            this.graph = list;
        },
        openSave() {
            this.dialogVisible = true;
            this.title = "保存分析";
        },
        save() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    if (this.title == "保存分析") {
                        this.saveHistory();
                    } else if (this.title == "添加节点") {
                        this.addNode();
                        this.dialogVisible = false;
                    } else if (this.title == "添加关系") {
                        this.addLine();
                        this.dialogVisible = false;
                    }
                } else {
                    return false;
                }
            });
        },
        saveHistory() {
            this.dialogVisible = false;
            let obj = this.$refs.graph.getParams();
            if (obj.params.length == 0) {
                this.$message.warning("没有进行任何推演不能保存");
                return;
            }
            obj.condition = {
                dabh: this.condition.dabh,
                endTime: this.condition.endTime,
                startTime: this.condition.startTime
            };
            saveAnalysisList({
                caseId: this.$route.query.dabh,
                content: JSON.stringify(obj),
                queryCriteria: "",
                querySaveType: 3,
                title: this.ruleForm.title,
                desc: this.ruleForm.desc
            }).then(data => {
                if (data.code == 0) {
                    this.$message.success("保存成功");
                }
            });
        },
        // 分析记录
        analysisHistory() {
            this.dialogVisible = true;
            this.historyLoading = true;
            this.title = "分析记录";
            getAnalysisList({
                caseId: this.$route.query.dabh,
                querySaveType: 3,
                pageNum: this.historyPage,
                pageSize: this.historyPageSize
            }).then(data => {
                this.historyLoading = false;
                if (data.code == 0) {
                    this.historyTabe = data.data.rows;
                    this.historyTotal = data.data.total;
                }
            });
        },
        historyHandlePageChange(current, size) {
            this.historyPage = current;
            this.historyPageSize = size;
            this.analysisHistory();
        },
        expand(id) {
            this.isSystem = true;
            this.filterVisible = true;
            this.systemLoading = true;
            this.condition.idCard = id;
            this.nodeVisible = false;
            inferenceAssociation({
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                idCard: this.condition.idCard
            }).then(res => {
                this.association = res.data;
                this.systemLoading = false;
            });
        },
        handExpand() {
            this.filterVisible = true;
            this.nodeVisible = false;
            this.isSystem = false;
        },
        setHistoryData(data, links, params, nodes) {
            this.initData(data, params);
            this.historyData = {
                links,
                data: data,
                nodes
            };
        },

        initData(data, params, depth = 0) {
            data.id = data.nodeId;
            data.depth = depth;
            let index = params.findIndex(
                p => p.idCard == data.id && data.depth == p.level
            );
            if (index != -1) {
                data.condition = params[index];
            }
            if (data.childList) {
                data.children = data.childList;
                delete data.childList;
                data.children.map(value => {
                    this.initData(value, params, depth + 1);
                });
            }
        },
        lineClick(data) {
            if (data) {
                let { source, target } = data;
                let dimensionList = target.data.relation.relationTypeVOS.map(
                    value => value.relationType
                );
                this.row = {
                    sourceIdCard: source.data.idCard || this.condition.idCard,
                    targetIdCard: target.data.idCard,
                    sourceNodeId: source.data.nodeId || this.condition.nodeId,
                    targetNodeId: target.data.nodeId,
                    dimensionList,
                    object: `${source.data.realName} 与 ${target.data.realName}`,
                    amountCondition: target.data.amountCondition
                };
                this.$refs.detailInfo.isVisible = true;
            }
        },
        dateChange(value) {
            this.condition.startTime = value && value[0] ? value[0] : null;
            this.condition.endTime = value && value[1] ? value[1] : null;
            this.date = [this.condition.startTime, this.condition.endTime];
            if (!this.condition.idCard) {
                this.$message.warning("请选择一个分析对象");
                return;
            }
            this.root = { ...this.root };
        }
    },

    created() {
        this.setTable(this.table);
        getSAObjectByDABH({
            dabh: this.$route.query.dabh,
            isMultipleCases: this.$route.query.isMultipleCases,
            dwbm: this.$route.query.dwbm
        }).then(res => {
            this.all = res.data;
            this.allPerson = [...this.all.saqyModels, ...this.all.saxxModels];
        });
    },
    watch: {
        dialogVisible() {
            if (!this.dialogVisible && this.$refs.ruleForm) {
                this.$refs.ruleForm.clearValidate();
                this.ruleForm = {
                    title: "",
                    desc: ""
                };
            }
            if (this.dialogVisible && this.title == "保存分析") {
                setTimeout(() => {
                    this.$refs.focusInput.focus();
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped></style>
