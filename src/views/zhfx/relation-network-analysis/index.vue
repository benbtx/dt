<template>
    <imp-panel>
        <kr-analysis-page slot="body" titleA="关系网分析" titleB="列表详情">
            <kr-graph
                slot="component-chart"
                @nodeClick="nodeClick"
                @filterClick="filterClick"
                ref="graph"
                :graph="graph"
                :selectOptions="selectOptions"
                @saveAnalysis="openSave"
                @lineClick="lineClick"
                @analysisHistory="analysisHistory"
                @selectChange="intimacyRangeChange"
                :date="time"
                @dateChange="dateChange"
                @add="add"
                v-kr-loading="loading"
            >
                <dimension-filtering
                    slot="info"
                    :condition="filter"
                    :visible.sync="filterVisible"
                    @submit="filterSubmit"
                />
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
                        <el-form
                            v-if="title == '添加节点'"
                            :model="addNodeForm"
                            :rules="addNodeRules"
                            ref="ruleForm"
                            label-width="100px"
                            class="demo-ruleForm"
                        >
                            <el-form-item label="名称" prop="node">
                                <el-select
                                    v-model="addNodeForm.node"
                                    filterable
                                    placeholder="请选择"
                                >
                                    <el-option
                                        v-for="item in nodeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                        <el-form
                            v-if="title == '添加关系'"
                            :model="addLineForm"
                            :rules="addLineRules"
                            ref="ruleForm"
                            label-width="100px"
                            class="demo-ruleForm"
                        >
                            <el-form-item label="名称" prop="label">
                                <el-input
                                    v-model="addLineForm.label"
                                    style="width: 200px"
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
            <kr-analysis-page-table slot="component-table" title="列表详情">
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
            :btnLoading="btnLoading"
            @startAnalysis="startAnalysis"
            :checkList="checkList"
            :all="all"
            slot="aside"
            @clearAll="clearAll"
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
<script type="text/babel">
import dimensionFiltering from "./dimension-filtering";
import { networkRelationConfig } from "@/components/kr-excel-export/export.config.js";
import nodeDetails from "./node-details";
import {
    network,
    getSAObjectByDABH,
    flushNetwork
} from "api/zhfx/relation-network";
import {
    delAnalysis,
    saveAnalysisList,
    getAnalysisList
} from "@/api/zhfx/dimension-relation-analysis.js";
import { cloneDeep } from "loadsh";
export default {
    components: {
        dimensionFiltering,
        nodeDetails
    },
    data() {
        const $shelf = this;
        return {
            tableOptions: {
                "max-height": 500
            },
            btnLoading: false,
            fileName: "",
            historyPage: 1,
            historyPageSize: 10,
            filter: {},
            checkList: [],
            historyTotal: 0,
            filterVisible: true,
            dialogVisible: false,
            historyLoading: false,
            loading: false,
            title: "",
            time: [],
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
            addNodeForm: {
                node: ""
            },
            addNodeRules: {
                node: [
                    {
                        required: true,
                        message: "请选择添加对象",
                        trigger: "change"
                    }
                ]
            },
            addLineForm: {
                label: ""
            },
            addLineRules: {
                label: [
                    {
                        required: true,
                        message: "请输入关系",
                        trigger: "change"
                    }
                ]
            },
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
            ],
            results: { nodeInfos: [], relationVOS: [] },
            nodeVisible: false,
            row: {},
            table: [],
            rows: [],
            nodeInfo: {},
            condition: {
                airplaneCount: null, //飞机同行次数
                busCount: null, //大巴同行次数
                callAmount: null, //通话时长
                callCount: null, //通话次数
                dabh: this.$route.query.dabh, //案件编号
                isMultipleCases: this.$route.query.isMultipleCases, // 是否多案件
                dwbm: this.$route.query.dwbm, // 单位编码
                dimensionality: null, //维度
                startTime: null, //开始时间
                endTime: null, //结束时间
                idCards: [],
                keyword: "",
                liveCount: null, //同住次数
                intimacyRange: null, //关系层级
                trainCount: null, //火车同
                transferAmount: null, //交易金额
                transferCount: null //交易次数
            },
            selectOptions: {
                options: [
                    { label: "0-20", value: "0-20" },
                    { label: "20-40", value: "20-40" },
                    { label: "40-60", value: "40-60" },
                    { label: "60-80", value: "60-80" },
                    { label: "80-100", value: "80-100" }
                ],
                title: "亲密度",
                value: ""
            },
            all: [],
            indexRow: false,
            total: 85,
            page: 1,
            pageSize: 10,
            historyTabe: [],
            columns: [
                {
                    title: "亲密度",
                    width: 100,
                    sortable: "custom",
                    key: "intimacy"
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
            nodeOptions: [],
            addParams: {},
            date: []
        };
    },
    computed: {
        networkRelationConfig() {
            return networkRelationConfig;
        },
        graph() {
            let obj = cloneDeep(this.results);
            let { nodeInfos = [], relationVOS = [] } = obj;
            nodeInfos.map(node => {
                node.id = node.idCard;
                node.nodeName = `${node.realName}${
                    node.sex ? `(${node.sex})` : ""
                }`;
            });
            relationVOS.map(link => {
                link.relation = link.relationTypeVOS;
                if (link.auto == 1) {
                    link.relation = "";
                    link.type = "add";
                    link.label = link.relationTypeVOS[0].relationType;
                }
            });
            return { nodes: nodeInfos, links: relationVOS };
        }
    },
    mounted() {
        this.tableOptions["max-height"] = document.body.offsetHeight - 350;
    },
    methods: {
        exportMulConfig() {
            let { fnGetData, networkRelationConfig: config } = this;
            return [{ config, fnGetData }];
        },
        clearAll() {
            this.condition.idCards = [];
        },
        fnGetData() {
            return this.table;
        },
        setTable(value) {
            let { nodeInfos = [], relationVOS = [] } = value;
            this.table = [];
            let nodeMap = {};
            this.total = relationVOS.length;
            nodeInfos.map(node => {
                nodeMap[node.idCard] = { ...node };
            });
            relationVOS.map(link => {
                nodeMap[link.source].name;
                let dimension = "";
                let dimensionList = [];
                link.relationTypeVOS.forEach((el, index) => {
                    if (link.auto != 1) {
                        dimension += `${index ? ",  " : ""}${
                            el.relationType
                        }:${el.score || 0}`;
                        dimensionList.push(el.relationType);
                    }
                });
                if (link.auto != 1) {
                    this.table.push({
                        intimacy: link.intimacy,
                        object: `${nodeMap[link.source].realName} 与 ${
                            nodeMap[link.target].realName
                        }`,
                        dimension,
                        sourceIdCard: link.source,
                        targetIdCard: link.target,
                        dimensionList,
                        sourceNodeId: nodeMap[link.source].nodeId,
                        targetNodeId: nodeMap[link.target].nodeId
                    });
                }
                return;
            });
            this.table = this.table.sort((a, b) => b.intimacy - a.intimacy);
            this.getTablePage();
        },
        add(type, params) {
            this.addParams = {};
            if (type == "node") {
                this.dialogVisible = true;
                this.title = "添加节点";
                this.addNodeForm = {
                    node: ""
                };
                this.addParams = params;
            } else if (type == "line") {
                this.dialogVisible = true;
                this.title = "添加关系";
                this.addParams = params;
                this.addLineForm = {
                    label: ""
                };
            }
        },
        addNode() {
            let node = {};
            this.all.saqyModels.map(value => {
                if (value.tyshxydm == this.addNodeForm.node) {
                    node = {
                        ...this.addParams,
                        objectType: 2,
                        nodeType: "01",
                        realName: value.ztmc,
                        organization: null,
                        position: null,
                        labels: null,
                        sex: "",
                        age: "",
                        idCard: value.tyshxydm,
                        nodeId: value.tyshxydm,
                        id: value.tyshxydm,
                        nodeName: value.ztmc,
                        type: "add"
                    };
                }
            });

            this.all.saxxModels.map(value => {
                if (value.zjhm == this.addNodeForm.node) {
                    node = {
                        ...this.addParams,
                        objectType: 2,
                        nodeType: "00",
                        realName: value.mc,
                        organization: null,
                        position: null,
                        labels: null,
                        sex: value.xb,
                        age: value.age,
                        idCard: value.zjhm,
                        nodeId: value.zjhm,
                        id: value.zjhm,
                        nodeName: `${value.mc}${
                            value.xb ? `(${value.xb})` : ""
                        }`,
                        type: "add"
                    };
                }
            });

            this.$refs.graph.addNodeLine([node], []);
        },
        addLine() {
            let line = {
                ...this.addParams,
                label: this.addLineForm.label,
                id: "l" + new Date().getTime(),
                type: "add"
            };
            this.$refs.graph.addNodeLine([], [line]);
        },
        historyHandlePageChange(current, size) {
            this.historyPage = current;
            this.historyPageSize = size;
            this.analysisHistory();
        },
        handleEdit(row) {
            let add = row.content ? JSON.parse(row.content) : {},
                nodes = [],
                links = [];
            let condition = JSON.parse(row.queryCriteria);

            if (add.nodeInfos) {
                add.nodeInfos.map(value => {
                    nodes.push({
                        objectType: value.objectType,
                        nodeType: value.nodeType,
                        realName: value.realName,
                        organization: value.organization,
                        position: value.position,
                        labels: value.labels,
                        sex: value.organsexization,
                        age: value.age,
                        idCard: value.idCard,
                        nodeId: value.nodeId
                    });
                });
            }
            if (add.relations) {
                add.relations.map(value => {
                    links.push({
                        auto: 1,
                        source: value.source.id,
                        sourceNodeId: value.source.id,
                        target: value.target.id,
                        targetNodeId: value.target.id,
                        relationTypeVOS: [
                            {
                                relationType: value.label
                            }
                        ]
                    });
                });
            }
            condition = { ...condition, ...add };
            condition.nodeInfos = nodes;
            condition.relations = links;
            this.dialogVisible = false;
            this.condition = JSON.parse(row.queryCriteria);
            this.filter = { ...this.condition };
            if (condition.startTime) {
                this.time = [this.condition.startTime, this.condition.endTime];
            }
            if (condition.intimacyRange) {
                this.selectOptions = {
                    options: [...this.selectOptions.options],
                    title: "亲密度选择",
                    value: this.condition.intimacyRange + ""
                };
            }
            this.checkList = this.condition.idCards.map(value => value.idCard);
            this.flushNetwork(condition, add);
        },
        sortChange({ order }) {
            if (order == "ascending") {
                this.table = this.table.sort((a, b) => a.intimacy - b.intimacy);
            } else if (order == "descending") {
                this.table = this.table.sort((a, b) => b.intimacy - a.intimacy);
            }
            this.getTablePage();
        },
        getTablePage() {
            let start = (this.page - 1) * this.pageSize;
            let end = this.page * this.pageSize;
            if (!this.table[end]) {
                end = this.table.length;
            }
            this.rows = this.table.slice(start, end);
        },
        lineClick(data) {
            if (data.relation) {
                let dimensionList = data.relation.map(
                    value => value.relationType
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
        lookDetails(row) {
            this.$refs.detailInfo.isVisible = true;
            this.row = row;
        },
        onPageChange(page, pageSize) {
            this.page = page;
            this.pageSize = pageSize;
            this.getTablePage();
        },
        filterSubmit(params) {
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
            this.getNetWork();
        },
        intimacyRangeChange(range) {
            this.condition.intimacyRange = range;
            this.getNetWork();
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
        },
        // 分析记录
        analysisHistory() {
            this.dialogVisible = true;
            this.historyLoading = true;
            this.title = "分析记录";
            getAnalysisList({
                caseId: this.$route.query.dabh,
                querySaveType: 1,
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
        openSave() {
            if (this.$refs.graph.nodesData.length == 0) {
                this.$message.warning("暂无数据，请添加数据后在保存");
                return;
            }
            this.dialogVisible = true;
            this.title = "保存分析";
        },
        dateChange(value) {
            this.condition.startTime = value && value[0] ? value[0] : null;
            this.condition.endTime = value && value[1] ? value[1] : null;
            this.date = [this.condition.startTime, this.condition.endTime];
            this.getNetWork();
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
            let save = {
                nodeInfos: [],
                relations: []
            };
            this.dialogVisible = false;
            this.$refs.graph.nodesData.map(value => {
                if (value.type == "add") {
                    save.nodeInfos.push(value);
                }
            });
            this.$refs.graph.linksData.map(value => {
                if (value.type == "add") {
                    save.relations.push(value);
                }
            });
            saveAnalysisList({
                caseId: this.$route.query.dabh,
                content: JSON.stringify(save),
                queryCriteria: JSON.stringify(this.condition),
                querySaveType: 1,
                title: this.ruleForm.title,
                desc: this.ruleForm.desc
            }).then(data => {
                if (data.code == 0) {
                    this.$message.success("保存成功");
                }
            });
        },
        // 开始分析
        startAnalysis(persons) {
            if (persons.length !== 0 && persons.length < 2) {
                this.$message({
                    message: "请选择两个对象",
                    type: "error"
                });
                return;
            }
            this.btnLoading = true;
            this.condition.idCards = [];
            if (persons.length === 0 || persons.length === 1) {
                this.fileName = "关系网分析-所有分析人";
            } else {
                this.fileName = `关系网分析-${
                    persons[0].zjhm ? persons[0].mc : persons[0].ztmc
                },${persons[1].zjhm ? persons[1].mc : persons[1].ztmc}${
                    persons[2] ? "等" : ""
                }`;
            }

            persons.forEach(el => {
                this.condition.idCards.push({
                    idCard: el.zjhm ? el.zjhm : el.tyshxydm
                });
            });
            this.getNetWork();
        },

        nodeClick(info) {
            this.filterVisible = false;
            this.nodeVisible = true;
            this.nodeInfo = info;
        },
        filterClick() {
            this.filterVisible = true;
            this.nodeVisible = false;
        },
        getNetWork() {
            this.loading = true;
            network(this.condition)
                .then(res => {
                    this.loading = false;
                    if (res.data) {
                        this.results = res.data;
                        this.setTable(res.data);
                        this.btnLoading = false;
                    } else {
                        this.results = { nodeInfos: [], relationVOS: [] };
                        this.setTable(this.results);
                    }
                })
                .catch(() => {
                    this.loading = false;
                });
        },

        flushNetwork(condition, add) {
            this.loading = true;
            flushNetwork(condition)
                .then(res => {
                    this.loading = false;
                    if (res.data) {
                        this.results = res.data;
                        if (add.nodeInfos) {
                            add.nodeInfos.map(value => {
                                this.results.nodeInfos.map(item => {
                                    if (item.nodeId == value.nodeId) {
                                        item.x = value.x;
                                        item.y = value.y;
                                        item.fy = value.fy;
                                        item.fx = value.fx;
                                    }
                                });
                            });
                        }
                    } else {
                        this.results = { nodeInfos: [], relationVOS: [] };
                    }
                })
                .catch(() => {
                    this.loading = false;
                });
        }
    },
    created() {
        this.getNetWork();
        getSAObjectByDABH({
            dabh: this.$route.query.dabh,
            isMultipleCases: this.$route.query.isMultipleCases,
            dwbm: this.$route.query.dwbm
        }).then(res => {
            this.all = res.data;
        });
    },
    watch: {
        all() {
            this.nodeOptions = [];
            this.all.saqyModels.map(value => {
                this.nodeOptions.push({
                    value: value.tyshxydm,
                    label: value.ztmc
                });
            });
            this.all.saxxModels.map(value => {
                this.nodeOptions.push({
                    value: value.zjhm,
                    label: value.mc
                });
            });
        },
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
