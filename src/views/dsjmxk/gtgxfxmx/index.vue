<template>
    <imp-panel>
        <kr-analysis-page slot="body" titleA="共同关关系析" titleB="列表详情">
            <kr-graph
                v-kr-loading="graphLoading"
                slot="component-chart"
                ref="graph"
                :graph="graph"
                @nodeClick="nodeClick"
                @saveAnalysis="openSave"
                @filterClick="filterClick"
                @lineClick="lineClick"
                :date="time"
                model="circle"
                @analysisHistory="analysisHistory"
                :selectOptions="selectOptions"
                @selectChange="numChange"
                @dateChange="dateChange"
            >
                <settingDialog
                    slot="info"
                    :visible.sync="visible"
                    @submit="settingSubmit"
                    :condition="filter"
                ></settingDialog>
                <node-details
                    slot="info"
                    :visible.sync="nodeVisible"
                    :nodeInfo="nodeInfo"
                />
                <el-dialog
                    slot="info"
                    :modal-append-to-body="false"
                    :title="title"
                    :visible.sync="dialogVisible"
                    :width="title == '分析记录' ? '800px' : '400px'"
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
                                    :autofocus="true"
                                    v-model="ruleForm.title"
                                    ref="focusInput"
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
                            v-if="title != '分析记录'"
                            @click="save"
                            >确 定</el-button
                        >
                    </div>
                </el-dialog>
            </kr-graph>
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
                        :current="pageNum"
                        :indexRow="false"
                        @sort-change="sortChange"
                        @on-page-change="onPageChange"
                    ></kr-table>
                </div> </kr-analysis-page-table
        ></kr-analysis-page>
        <kr-choose
            @startAnalysis="startAnalysis"
            :btnLoading="btnLoading"
            :isPerson="true"
            :hsaRadio="false"
            :all="all"
            slot="aside"
            @clearAll="clearAll"
            :checkList="checkList"
        ></kr-choose>
        <kr-detail-info
            slot="body"
            ref="detailInfo"
            :row="row"
            :transferAmount="condition.transferAmount"
            :date="date"
        />
    </imp-panel>
</template>

<script>
import settingDialog from "./module/settingDialog";
import { commonRelationConfig } from "@/components/kr-excel-export/export.config.js";
import { getSAObjectByDABH } from "api/zhfx/relation-network.js";
import relationText from "./relationText";
import nodeDetails from "./module/node-details.vue";
import { commonRelationAnalysis } from "@/api/dsjmxk/common-relation-analysis";
import {
    delAnalysis,
    saveAnalysisList,
    getAnalysisList
} from "@/api/zhfx/dimension-relation-analysis.js";
// import { cloneDeep } from "loadsh";
export default {
    components: {
        settingDialog,
        nodeDetails
    },

    data() {
        const shelf = this;
        return {
            btnLoading: false,
            time: [],
            fileName: "",
            graph: {
                nodes: [],
                links: []
            },
            date: [],
            graphLoading: false,
            nodeVisible: false,
            results: [],
            checkList: [],
            filter: {},
            condition: {
                dabh: this.$route.query.dabh, //案件编号
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                dimensionality: null, //维度
                startTime: null, //开始时间
                idCards: "",
                endTime: null, //结束时间
                callAmount: null, //通话时长
                callCount: null, //通话次数
                transferAmount: null, //交易金额
                transferCount: null, //交易次数
                num: null
            },
            nodeInfo: {},
            historyLoading: false,
            dialogVisible: false,
            tableOptions: {
                "max-height": 500
            },
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
            historyTotal: 0,
            historyTabe: [],
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
                        return shelf
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
                                        onClick={() => shelf.handleDel(row)}
                                    >
                                        删除
                                    </el-button>
                                    <el-button
                                        type="text"
                                        onClick={() => shelf.handleEdit(row)}
                                    >
                                        编辑
                                    </el-button>
                                </div>
                            );
                        }
                    }
                }
            ],
            all: [],
            visible: false,
            title: "",
            total: 10,
            rows: [],
            row: {},
            columns: [
                {
                    title: "关联分析人数",
                    key: "num",
                    sortable: "custom",
                    width: 130
                },
                { title: "共同联系人", key: "realName", width: 120 },
                { title: "身份证号", key: "idCard", width: 180 },
                {
                    title: "关联分析人详情",
                    component: {
                        render(h, row) {
                            return h(relationText, {
                                props: {
                                    row: row
                                },
                                on: {
                                    ["detail"]: (data, name) => {
                                        let dimensionList = data.dimensionalityList.map(
                                            value => value.relationType + "记录"
                                        );
                                        shelf.row = {
                                            sourceIdCard: row.idCard,
                                            targetIdCard: data.idCard,
                                            dimensionList,
                                            object: `${data.realName} 与 ${name}`
                                        };
                                        shelf.$refs.detailInfo.isVisible = true;
                                    }
                                }
                            });
                        }
                    }
                }
            ],
            pageNum: 1,
            pageSize: 10,
            table: [],
            selectOptions: {
                options: [],
                title: "关联人数",
                value: ""
            },
            idCards: "",
            num: "",
            startTime: "",
            endTime: ""
        };
    },

    computed: {
        networkRelationConfig() {
            return commonRelationConfig;
        }
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
    },
    methods: {
        exportMulConfig() {
            let { fnGetData, networkRelationConfig: config } = this;
            return [{ config, fnGetData }];
        },
        fnGetData() {
            var detail = "";
            let table = [];
            this.table.map(item => {
                if (item) {
                    table.push(item);
                    item.commonRelationVOS.map(it => {
                        let realName = it.realName;
                        let dimensionalityList = it.dimensionalityList;
                        dimensionalityList.map(t => {
                            let relationType = t.relationType;
                            let count = t.count;
                            detail =
                                detail +
                                `${realName}(${relationType}:${count})`;
                        });
                    });
                } else {
                    return [];
                }
            });
            table.map(item => {
                item.detail = detail;
            });
            return table;
        },
        saveHistory() {
            saveAnalysisList({
                caseId: this.$route.query.dabh,
                queryCriteria: JSON.stringify(this.condition),
                querySaveType: 5,
                title: this.ruleForm.title,
                desc: this.ruleForm.desc
            }).then(data => {
                if (data.code == 0) {
                    this.$message.success("保存成功");
                    this.dialogVisible = false;
                }
            });
        },
        initCondition() {
            this.condition.callAmount = null;
            this.condition.callCount = null;
            this.condition.dimensionality = null;
            this.condition.transferAmount = null;
            this.condition.transferCount = null;
        },
        handleEdit(row) {
            this.dialogVisible = false;
            this.condition = JSON.parse(row.queryCriteria);
            this.filter = { ...this.condition };
            this.checkList = this.condition.idCards.split(",");
            let options = [];
            this.checkList.map((el, index) => {
                let number = index + 1;
                options.push({ label: number, value: number });
            });
            if (this.condition.num) {
                this.selectOptions = {
                    options,
                    title: "关联人数",
                    value: this.condition.num + ""
                };
            }
            if (this.condition.startTime) {
                this.time = [this.condition.startTime, this.condition.endTime];
            }
            this.getCommonData();
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
        settingSubmit(params) {
            let dimensionality = [];
            this.initCondition();
            params.map(value => {
                dimensionality.push(value.id);
                value.conditions.map(item => {
                    this.condition[item.key] = item.value;
                });
            });
            this.condition.dimensionality = dimensionality.join(",");
            this.condition.dimensionality = this.condition.dimensionality
                ? this.condition.dimensionality
                : null;
            this.getCommonData();
        },
        nodeClick(info) {
            this.visible = false;
            this.nodeVisible = true;
            this.nodeInfo = info;
        },
        lineClick(data) {
            if (data.relation) {
                let dimensionList = data.relation.map(
                    value => value.relationType + "记录"
                );
                this.row = {
                    sourceIdCard: data.source.nodeId,
                    targetIdCard: data.target.nodeId,
                    sourceNodeId: data.source.nodeId,
                    targetNodeId: data.target.nodeId,
                    dimensionList,
                    object: `${data.source.realName} 与 ${data.target.realName}`
                };
                this.$refs.detailInfo.isVisible = true;
            }
        },
        filterClick() {
            this.nodeVisible = false;
            this.visible = true;
        },
        // 分析记录
        analysisHistory() {
            this.dialogVisible = true;
            this.historyLoading = true;
            this.title = "分析记录";
            getAnalysisList({
                caseId: this.$route.query.dabh,
                querySaveType: 5,
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
        dateChange(date) {
            if (!this.condition.idCards) {
                return;
            }
            if (date) {
                this.condition.startTime = date[0];
                this.condition.endTime = date[1];
            } else {
                this.condition.startTime = null;
                this.condition.endTime = null;
            }
            this.date = [this.condition.startTime, this.condition.endTime];
            this.getCommonData();
        },
        openSave() {
            if (this.$refs.graph.nodesData.length == 0) {
                this.$message.warning("暂无数据，请添加数据后在保存");
                return;
            }
            this.dialogVisible = true;
            this.title = "保存分析";
        },
        numChange(num) {
            this.condition.num = num || null;
            this.getCommonData();
        },
        save() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.saveHistory();
                } else {
                    return false;
                }
            });
        },
        historyHandlePageChange(current, size) {
            this.historyPage = current;
            this.historyPageSize = size;
            this.analysisHistory();
        },
        clearAll() {
            this.selectOptions.options = [];
            this.rows = [];
            this.results = [];
            this.table = [];
            this.fnGetData();
            this.setGraphData();
        },
        startAnalysis(persons) {
            if (persons.length <= 1) {
                this.$message({
                    message: "请至少选择两个对象",
                    type: "error"
                });
                return;
            }
            this.btnLoading = true;
            this.fileName = `共同关系分析-${
                persons[0].zjhm ? persons[0].mc : persons[0].ztmc
            },${persons[1].zjhm ? persons[1].mc : persons[1].ztmc}${
                persons[2] ? "等" : ""
            }`;

            this.condition.idCards = persons.map(el => el.zjhm).join(",");
            let options = [];
            persons.map((el, index, arr) => {
                let number = index + 1;
                if (number >= 2 && number <= arr.length) {
                    options.push({ label: number, value: number });
                }
            });
            this.selectOptions.options = options;
            this.visible = true;
            this.getCommonData();
        },
        getCommonData() {
            this.graphLoading = true;
            commonRelationAnalysis(this.condition).then(res => {
                if (res.data) {
                    this.results = res.data;
                    this.table = res.data;
                    this.total = res.data.length;
                    this.getTablePage();
                    this.setGraphData();
                    this.btnLoading = false;
                    this.graphLoading = false;
                } else {
                    this.results = [];
                    this.setGraphData();
                    this.graphLoading = false;
                }
            });
        },
        getTablePage() {
            let start = (this.pageNum - 1) * this.pageSize;
            let end = this.pageNum * this.pageSize;
            if (!this.table[end]) {
                end = this.table.length;
            }
            this.rows = this.table.slice(start, end);
        },
        sortChange({ order }) {
            if (order == "ascending") {
                this.table = this.table.sort((a, b) => a.num - b.num);
            } else if (order == "descending") {
                this.table = this.table.sort((a, b) => b.num - a.num);
            }
            this.getTablePage();
        },
        onPageChange(pageNum, pageSize) {
            this.pageNum = pageNum;
            this.pageSize = pageSize;
            this.getTablePage();
        },
        setGraphData() {
            if (this.results.length == 0) {
                this.graph = {
                    nodes: [],
                    links: []
                };
                return;
            }
            let nodes = [],
                person = [],
                links = [];
            let result = this.results.sort((a, b) => b.num - a.num);
            let max = result[0].num;
            result.map(value => {
                let m = {
                    ...value,
                    id: value.nodeId,
                    nodeName: value.sex
                        ? `${value.realName ? value.realName : ""}(${
                              value.sex
                          })`
                        : value.realName
                        ? value.realName
                        : "",
                    isImportant: value.num == max ? true : false
                };
                delete m.commonRelationVOS;
                nodes.push(m);
                if (value.commonRelationVOS && value.commonRelationVOS.length) {
                    value.commonRelationVOS.map(item => {
                        let index = person.findIndex(
                            it => it.id == item.nodeId
                        );
                        let t = {
                            ...item,
                            id: item.nodeId,
                            nodeName: item.sex
                                ? `${item.realName ? item.realName : ""}(${
                                      item.sex
                                  })`
                                : item.realName
                                ? item.realName
                                : ""
                        };
                        if (index == -1) {
                            person.push(t);
                        }
                        links.push({
                            source: m.nodeId,
                            target: t.id,
                            relation: item.dimensionalityList
                        });
                    });
                }
            });
            nodes = [...nodes, ...person];
            this.graph = {
                nodes,
                links
            };
        }
    },
    created() {
        getSAObjectByDABH({
            dabh: this.$route.query.dabh,
            isMultipleCases: this.$route.query.isMultipleCases,
            dwbm: this.$route.query.dwbm
        }).then(res => {
            res.code === 0 ? (this.all = res.data.saxxModels) : "";
        });
    },
    mounted() {
        this.tableOptions["max-height"] = document.body.offsetHeight - 350;
    }
};
</script>
