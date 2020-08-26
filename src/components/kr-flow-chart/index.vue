<template>
    <div id="full" v-kr-loading="exportloading">
        <div class="toolbar box-shadow">
            <template v-for="item in toolbarList">
                <el-tooltip
                    v-if="item.type == 'radio'"
                    class="item"
                    effect="dark"
                    popper-class="toolbarBottomTooltip"
                    :content="item.name"
                    placement="bottom"
                    :key="item.name"
                >
                    <div
                        class="radioButton"
                        @click="toolbarClick(item)"
                        @mouseenter="tooltipFullscreen('toolbarBottomTooltip')"
                        :class="{ isActive: item.isCheck }"
                    >
                        <kr-icon :icon="item.icon"></kr-icon>
                    </div>
                </el-tooltip>
                <el-tooltip
                    v-if="item.type == 'button'"
                    class="item"
                    effect="dark"
                    popper-class="toolbarBottomTooltip"
                    :content="item.name"
                    placement="bottom"
                    :key="item.name"
                >
                    <div
                        class="radioButton"
                        @click="toolbarClick(item)"
                        @mouseenter="tooltipFullscreen('toolbarBottomTooltip')"
                    >
                        <kr-icon :icon="item.icon"></kr-icon>
                    </div>
                </el-tooltip>
            </template>
            <div class="toolbar-right">
                <div class="block">
                    <el-button
                        size="small"
                        style="margin-right: 10px"
                        @click="openDialog('上传数据源')"
                        >上传数据源</el-button
                    >
                    <el-button
                        size="small"
                        style="margin-right: 10px"
                        @click="openDialog('数据源管理')"
                        >数据源管理</el-button
                    >
                    <el-button
                        size="small"
                        style="margin-right: 10px"
                        @click="openDialog('模型管理')"
                        >模型管理</el-button
                    >
                    <el-button
                        type="primary"
                        size="small"
                        @click="openDialog('保存模型')"
                        >保存模型</el-button
                    >
                </div>
            </div>
        </div>
        <div class="toolbarBottom box-shadow">
            <div v-for="(item, index) in toolbarBottomList" :key="index">
                <el-tooltip
                    class="item"
                    effect="dark"
                    :content="toolbarBottomTooltip(item.name)"
                    :hide-after="0"
                    popper-class="toolbarBottomTooltip"
                    placement="right"
                    :key="item.name"
                    v-if="item.is"
                >
                    <div
                        style="margin: 20px 12px;font-size: 16px;cursor: pointer"
                        @click="toolbarBottomClick(item.name)"
                        @mouseenter="tooltipFullscreen('toolbarBottomTooltip')"
                    >
                        <kr-icon :icon="item.icon"></kr-icon>
                    </div>
                </el-tooltip>
            </div>
        </div>
        <div class="model box-shadow">
            <div class="title">比对类型</div>
            <draggable :options="{ sort: false }">
                <div
                    class="model-item"
                    v-for="item in modelList"
                    :key="item.type"
                    @dragstart="modelDragstart(item)"
                >
                    <kr-icon
                        :icon="item.icon"
                        :size="24"
                        style="padding-right: 10px"
                    ></kr-icon
                    >{{ item.type }}
                </div>
            </draggable>
        </div>
        <div class="data-source box-shadow" v-if="dataVisible">
            <div class="title">
                添加数据源
                <div class="data-source-close" @click="closeData">
                    <kr-icon icon="el-icon-close"></kr-icon>
                </div>
            </div>
            <el-tabs v-model="activeName">
                <el-tab-pane label="数据源" name="first">
                    <div
                        class="source-box"
                        :style="'max-height:' + (height - 200) + 'px'"
                    >
                        <el-collapse v-model="dataSourceActive">
                            <el-collapse-item title="我的上传" name="1">
                                <draggable :options="{ sort: false }">
                                    <div
                                        v-for="(item, index) in dataSouce"
                                        v-if="item.source == '上传'"
                                        :key="index"
                                        class="data-source-item"
                                        @dragstart="dataDragstart(item)"
                                    >
                                        {{ item.name }}
                                    </div>
                                </draggable>
                            </el-collapse-item>

                            <el-collapse-item title="另存为" name="2">
                                <draggable :options="{ sort: false }">
                                    <div
                                        v-for="(item, index) in dataSouce"
                                        v-if="item.source == '另存为'"
                                        :key="index"
                                        class="data-source-item"
                                        :draggable="
                                            item.computeState == '未完成'
                                                ? false
                                                : true
                                        "
                                        @dragstart="dataDragstart(item)"
                                    >
                                        {{
                                            item.computeState == "未完成"
                                                ? item.name +
                                                  "(" +
                                                  item.computeState +
                                                  ")"
                                                : item.name
                                        }}
                                    </div>
                                </draggable>
                            </el-collapse-item>
                            <el-collapse-item title="共享" name="3">
                                <draggable :options="{ sort: false }">
                                    <div
                                        v-for="(item, index) in dataSouce"
                                        v-if="
                                            (item.source == '另存为' ||
                                                item.source == '上传') &&
                                                item.isShared == 0
                                        "
                                        :key="index"
                                        class="data-source-item"
                                        :draggable="
                                            item.computeState == '未完成'
                                                ? false
                                                : true
                                        "
                                        @dragstart="dataDragstart(item)"
                                    >
                                        {{
                                            item.computeState == "未完成"
                                                ? item.name +
                                                  "(" +
                                                  item.computeState +
                                                  ")"
                                                : item.name
                                        }}
                                    </div>
                                </draggable>
                            </el-collapse-item>
                            <el-collapse-item title="系统数据源" name="4">
                                <draggable :options="{ sort: false }">
                                    <div
                                        v-for="(item, index) in dataSouce"
                                        v-if="item.source == '系统'"
                                        :key="index"
                                        class="data-source-item"
                                        @dragstart="dataDragstart(item)"
                                    >
                                        {{ item.name }}
                                    </div>
                                </draggable>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="比对模型" name="second">
                    <div
                        class="source-box"
                        :style="'max-height:' + (height - 200) + 'px'"
                    >
                        <el-collapse v-model="dataSourceActive">
                            <el-collapse-item title="我的模型" name="1">
                                <div
                                    v-for="(item, index) in myModel"
                                    :key="index"
                                    class="data-source-item"
                                    draggable="true"
                                    @dragstart="dataDragstart(item, 'model')"
                                >
                                    {{ item.name }}
                                </div>
                            </el-collapse-item>
                            <el-collapse-item title="共享模型" name="2">
                                <div
                                    v-for="(item, index) in shareModels"
                                    :key="index"
                                    class="data-source-item"
                                    draggable="true"
                                    @dragstart="dataDragstart(item, 'model')"
                                >
                                    {{ item.name }}
                                </div>
                            </el-collapse-item>
                            <el-collapse-item title="公共模型" name="3">
                                <div
                                    v-for="(item, index) in publicModel"
                                    :key="index"
                                    class="data-source-item"
                                    draggable="true"
                                    @dragstart="dataDragstart(item, 'model')"
                                >
                                    {{ item.name }}
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog
            :modal-append-to-body="false"
            :title="title"
            top="5vh"
            :visible.sync="dialogVisible"
            :width="
                title == '保存模型' || title == '编辑模型' ? '400px' : '60%'
            "
        >
            <div v-if="title == '保存模型'">
                <el-form
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="名称" prop="name">
                        <el-input
                            v-model="ruleForm.name"
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
                        >
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div v-else-if="title == '上传数据源'">
                <uplaod-data
                    @changeLoading="changeLoading"
                    @update="uploadSuccess"
                ></uplaod-data>
            </div>
            <div v-else v-kr-loading="loading">
                <el-tabs
                    v-model="tabsActive"
                    type="card"
                    @tab-click="tabsChange"
                >
                    <el-tab-pane
                        v-for="item in tab"
                        :label="item.title"
                        :name="item.title"
                        :key="item.title"
                    >
                        <div v-if="title == '数据源管理'">
                            <el-input
                                v-model="item.keyWord"
                                style="width: 200px"
                                placeholder="请输入数据源名称"
                            ></el-input>
                            <el-select
                                v-model="item.type"
                                style="width: 120px;margin-left: 10px"
                                placeholder="数据源类型"
                            >
                                <el-option
                                    v-for="i in queryDataSourceTypeOptions"
                                    :label="i.label"
                                    :value="i.value"
                                    :key="i.value"
                                >
                                </el-option>
                            </el-select>
                            <template
                                v-if="
                                    item.title == '我的数据源' ||
                                        item.title == '共享数据源'
                                "
                            >
                                <el-select
                                    v-model="item.source"
                                    style="width: 100px;margin-left: 10px"
                                    placeholder="来源"
                                >
                                    <el-option label="上传" value="上传">
                                    </el-option>
                                    <el-option label="另存为" value="另存为">
                                    </el-option>
                                    <el-option label="系统" value="系统">
                                    </el-option>
                                    <el-option label="共享" value="共享">
                                    </el-option>
                                </el-select>
                            </template>
                            <template
                                v-if="
                                    item.title == '共享数据源' ||
                                        item.title == '我的数据源'
                                "
                            >
                                <el-select
                                    v-model="item.isShared"
                                    style="width: 100px;margin-left: 10px"
                                    placeholder="共享"
                                >
                                    <el-option label="共享" value="0">
                                    </el-option>
                                    <el-option label="不共享" value="1">
                                    </el-option>
                                </el-select>
                            </template>
                            <el-date-picker
                                v-model="item.date"
                                type="daterange"
                                align="right"
                                unlink-panels
                                style="width: 230px;margin-left: 10px"
                                range-separator="~"
                                start-placeholder="开始日期"
                                value-format="yyyy-MM-dd"
                                end-placeholder="结束日期"
                                :picker-options="$pickerOptions"
                            ></el-date-picker>
                            <el-button
                                type="primary"
                                style="margin-left: 10px"
                                icon="el-icon-search"
                                @click="searchDataSource(item)"
                                >搜索</el-button
                            >
                        </div>
                        <div v-if="title == '模型管理'">
                            <el-input
                                v-model="item.keyWord"
                                style="width: 200px"
                                placeholder="请输入数据源名称"
                            ></el-input>
                            <el-date-picker
                                v-model="item.date"
                                type="daterange"
                                align="right"
                                unlink-panels
                                style="width: 230px;margin-left: 10px"
                                range-separator="~"
                                start-placeholder="开始日期"
                                value-format="yyyy-MM-dd"
                                end-placeholder="结束日期"
                                :picker-options="$pickerOptions"
                            ></el-date-picker>
                            <el-button
                                type="primary"
                                style="margin-left: 10px"
                                icon="el-icon-search"
                                @click="searchDataSource(item)"
                                >搜索</el-button
                            >
                        </div>
                        <kr-table
                            :key="item.title"
                            :options="tableOptions"
                            :total="item.total"
                            :rows="item.table"
                            :columns="item.columns"
                            :current="item.pageNum"
                            @sort-change="sortChange"
                            @on-page-change="handlePageChange"
                        ></kr-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <el-button
                    type="primary"
                    @click="sure"
                    v-if="title == '保存模型' || title == '编辑模型'"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
        <el-dialog
            :modal-append-to-body="false"
            :title="title1"
            top="5vh"
            :visible.sync="dialogVisible1"
            :width="title1 == '比对关联字段设置' ? '680px' : '70%'"
        >
            <filter-conditon
                v-if="title1 == '查询条件'"
                :field="filterNode.field"
                :conditions="filterNode.conditions"
                :checkConditions="filterNode.check"
                ref="conditions"
            ></filter-conditon>
            <comparison-set
                v-if="title1 == '比对关联字段设置'"
                ref="comparison"
                :dataA="dataA"
                :dataB="dataB"
                :relationFields="filterNode.relationFields"
                :showFields="filterNode.showFields"
            ></comparison-set>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">关闭</el-button>
                <el-button type="primary" @click="sureSave">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :modal-append-to-body="false"
            title="详情"
            top="5vh"
            :visible.sync="detailVisible"
            width="70%"
        >
            <div v-kr-loading="detailLoading">
                <kr-table
                    :options="detailTableOptions"
                    :rows="detailTable"
                    :columns="detailColumns"
                    :showPagination="false"
                ></kr-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDetail">关闭</el-button>
            </div>
        </el-dialog>
        <el-dialog
            :modal-append-to-body="false"
            title="另存为"
            top="5vh"
            :visible.sync="saveVisible"
            width="400px"
        >
            <div>
                <el-form
                    :model="saveForm"
                    :rules="saveRules"
                    ref="saveForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="名称" prop="name">
                        <el-input
                            v-model="saveForm.name"
                            ref="saveInput"
                            style="width: 200px"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="saveVisible = false">关闭</el-button>
                <el-button type="primary" @click="sureSaveAs">确 定</el-button>
            </div>
        </el-dialog>
        <div class="graphBox" id="main"></div>
    </div>
</template>

<script>
import * as d3 from "d3";
import { cloneDeep } from "loadsh";
import draggable from "vuedraggable";

import {
    getSystemData,
    shareDataSource,
    getDataSourceType,
    deleteDataSource,
    getFieldList,
    getDataSourceDetail,
    exportSaveAs,
    doCompare,
    newTable,
    saveAs,
    exportTmpDataSource,
    saveModel,
    getModelList,
    deleteModel,
    shareModel
} from "@/api/zhfx/data-comparison.js";

import ws from "@/utils/ws.js";

import data1 from "@/assets/image/data1.png";
import data2 from "@/assets/image/data2.png";
import data3 from "@/assets/image/data3.png";
import data4 from "@/assets/image/data4.png";
import result1 from "@/assets/image/result1.png";
import result2 from "@/assets/image/result2.png";
import result3 from "@/assets/image/result3.png";
import result4 from "@/assets/image/result4.png";
import bianji from "@/assets/image/bianji.png";
import shanchu from "@/assets/image/shanchu.png";
import xiazai from "@/assets/image/xiazai.png";
import shangchuan from "@/assets/image/shangchuan.png";
import lingcunwei from "@/assets/image/lingcunwei.png";
import shanchuhong from "@/assets/image/shanchuhong.png";
import jiaoji from "@/assets/image/jiaoji.png";
import bingji from "@/assets/image/bingji.png";
import chaji from "@/assets/image/chaji.png";
import kaishi from "@/assets/image/kaishi.png";

import uplaodData from "@/views/zhfx/data-comparison/upload-data.vue";
import filterConditon from "@/views/zhfx/data-comparison/filter-conditon.vue";
import comparisonSet from "@/views/zhfx/data-comparison/comparison-set.vue";
import shared from "@/views/zhfx/data-comparison/components/shared.vue";
export default {
    components: {
        uplaodData,
        filterConditon,
        comparisonSet,
        draggable
    },
    props: {
        graph: {
            type: Object,
            default() {
                return {
                    nodes: [],
                    links: []
                };
            }
        }
    },
    data() {
        const shelf = this;
        return {
            toolbarList: [
                {
                    name: "数据源",
                    icon: "icon-shaixuan",
                    isCheck: false,
                    type: "radio"
                },
                {
                    name: "回到中心",
                    icon: "icon-shouye",
                    isCheck: false,
                    type: "radio"
                },
                {
                    name: "清空",
                    icon: "icon-shuaxin1",
                    isCheck: false,
                    type: "radio"
                }
            ],
            toolbarBottomList: [
                { name: "全屏", icon: "icon-quanpingzuidahua", is: true },
                { name: "退出全屏", icon: "icon-tuichuquanping", is: false },
                // { name: "上一步", icon: "icon-shangyibu", is: true },
                // { name: "下一步", icon: "icon-xiayibu", is: true },
                { name: "放大", icon: "icon-fangda", is: true },
                { name: "缩小", icon: "icon-suoxiao", is: true }
            ],
            modelList: [
                { type: "交集比对", icon: "icon-jiedianjiaoji", img: jiaoji },
                { type: "并集比对", icon: "icon-bingji", img: bingji },
                { type: "差集比对", icon: "icon-chaji", img: chaji }
            ],
            imgs: {
                data1: data1,
                data2: data2,
                data3: data3,
                data4: data4,
                result1: result1,
                result2: result2,
                result3: result3,
                result4: result4
            },

            //数据
            nodesData: [],
            linksData: [],
            dataSouce: [],
            queryDataSourceTypeOptions: [],

            exportloading: false,
            isNodeDetail: false,
            publicModel: [],
            myModel: [],
            shareModels: [],
            dragType: "",
            uploadReplaceNode: "",
            saveForm: {
                name: ""
            },
            saveRules: {
                name: [
                    { required: true, message: "请输入名称", trigger: "blur" },
                    {
                        min: 1,
                        max: 20,
                        message: "长度在 1 到 20 个字符",
                        trigger: "blur"
                    }
                ]
            },
            detailTable: [],
            detailColumns: [],
            dataA: "",
            dataB: "",
            detailTableOptions: {
                "max-height": 500
            },
            tableOptions: {
                "max-height": 500
            },
            detailLoading: false,
            loading: false,
            dialogVisible: false,
            dialogVisible1: false,
            detailVisible: false,
            saveVisible: false,
            title: "",
            title1: "",
            ruleForm: {
                name: "",
                desc: ""
            },
            rules: {
                name: [
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
            tabsActive: "",
            tab: [],
            tabsList: {
                dataManage: [
                    {
                        title: "系统数据源",
                        columns: [
                            {
                                title: "数据源名称",
                                key: "name"
                            },
                            {
                                title: "数据源类型",
                                key: "type"
                            },
                            {
                                title: "来源",
                                key: "source"
                            },
                            {
                                title: "时间",
                                key: "createTime",
                                sortable: "custom",
                                formatter(row) {
                                    return shelf
                                        .$dayjs(row.createTime)
                                        .format("YYYY-MM-DD HH:mm:ss");
                                }
                            },
                            {
                                title: "操作",
                                width: 80,
                                component: {
                                    render(h, row) {
                                        return (
                                            <div>
                                                <el-button
                                                    type="text"
                                                    onClick={() => {
                                                        shelf.checkDetail(row);
                                                    }}
                                                >
                                                    查看
                                                </el-button>
                                            </div>
                                        );
                                    }
                                }
                            }
                        ],
                        table: [],
                        total: 0,
                        keyWord: "",
                        type: "",
                        date: [],
                        pageNum: 1,
                        pageSize: 10
                    },
                    {
                        title: "我的数据源",
                        columns: [
                            {
                                title: "数据源名称",
                                key: "name"
                            },
                            {
                                title: "数据源类型",
                                key: "type"
                            },
                            {
                                title: "来源",
                                key: "source"
                            },
                            {
                                title: "创建人员",
                                key: "createUser"
                            },
                            {
                                title: "共享",
                                component: {
                                    render(h, row) {
                                        return h(shared, {
                                            props: {
                                                row: row
                                            },
                                            on: {
                                                changeShare: shelf.changeShare
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                title: "时间",
                                key: "createTime",
                                sortable: "custom",
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
                                                    onClick={() => {
                                                        shelf.checkDetail(row);
                                                    }}
                                                >
                                                    查看
                                                </el-button>
                                                <el-button
                                                    type="text"
                                                    onClick={() => {
                                                        shelf.deleteDataSource(
                                                            row.num
                                                        );
                                                    }}
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
                        total: 0,
                        keyWord: "",
                        type: "",
                        date: [],
                        pageNum: 1,
                        pageSize: 10,
                        source: "",
                        isShared: ""
                    },
                    {
                        title: "共享数据源",
                        columns: [
                            {
                                title: "数据源名称",
                                key: "name"
                            },
                            {
                                title: "数据源类型",
                                key: "type"
                            },
                            {
                                title: "来源",
                                key: "source"
                            },
                            {
                                title: "创建人员",
                                key: "createUser"
                            },
                            {
                                title: "共享",
                                key: "desc",
                                component: {
                                    render(h, row) {
                                        return h(shared, {
                                            props: {
                                                row: row
                                            },
                                            on: {
                                                changeShare: shelf.changeShare
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                title: "时间",
                                key: "createTime",
                                sortable: "custom",
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
                                                    onClick={() => {
                                                        shelf.checkDetail(row);
                                                    }}
                                                >
                                                    查看
                                                </el-button>
                                            </div>
                                        );
                                    }
                                }
                            }
                        ],
                        table: [],
                        total: 0,
                        keyWord: "",
                        type: "",
                        date: [],
                        pageNum: 1,
                        pageSize: 10,
                        source: ""
                    }
                ],
                modelManage: [
                    {
                        title: "公共模型",
                        columns: [
                            {
                                title: "模型名称",
                                key: "name"
                            },
                            {
                                title: "模型描述",
                                key: "des"
                            },
                            {
                                title: "创建人",
                                key: "createUser"
                            },
                            {
                                title: "时间",
                                key: "createTime",
                                sortable: "custom",
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
                                                    onClick={() => {
                                                        shelf.editModel(row);
                                                    }}
                                                >
                                                    查看
                                                </el-button>
                                            </div>
                                        );
                                    }
                                }
                            }
                        ],
                        table: [],
                        total: 0,
                        keyWord: "",
                        pageNum: 1,
                        pageSize: 10,
                        sortName: "",
                        sortRule: "",
                        date: []
                    },
                    {
                        title: "我的模型",
                        columns: [
                            {
                                title: "模型名称",
                                key: "name"
                            },
                            {
                                title: "模型描述",
                                key: "des"
                            },
                            {
                                title: "创建人",
                                key: "createUser"
                            },
                            {
                                title: "共享",
                                key: "desc",
                                component: {
                                    render(h, row) {
                                        return h(shared, {
                                            props: {
                                                row: row
                                            },
                                            on: {
                                                changeShare: shelf.shareModel
                                            }
                                        });
                                    }
                                }
                            },
                            {
                                title: "时间",
                                key: "createTime",
                                sortable: "custom",
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
                                                    onClick={() => {
                                                        shelf.editModel(row);
                                                    }}
                                                >
                                                    查看
                                                </el-button>
                                                <el-button
                                                    type="text"
                                                    onClick={() => {
                                                        shelf.deleteModel(row);
                                                    }}
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
                        total: 0,
                        keyWord: "",
                        pageNum: 1,
                        pageSize: 10,
                        sortName: "",
                        sortRule: "",
                        date: []
                    },
                    {
                        title: "共享模型",
                        columns: [
                            {
                                title: "模型名称",
                                key: "name"
                            },
                            {
                                title: "模型描述",
                                key: "des"
                            },
                            {
                                title: "创建人",
                                key: "createUser"
                            },
                            {
                                title: "时间",
                                key: "createTime",
                                sortable: "custom",
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
                                                    onClick={() => {
                                                        shelf.editModel(row);
                                                    }}
                                                >
                                                    查看
                                                </el-button>
                                            </div>
                                        );
                                    }
                                }
                            }
                        ],
                        table: [],
                        total: 0,
                        keyWord: "",
                        pageNum: 1,
                        pageSize: 10,
                        sortName: "",
                        sortRule: "",
                        date: []
                    }
                ]
            },
            page: 1,
            dragNode: "", //正在拖动的点
            dragNodeX: "", //拖动点X偏移
            dragNodeY: "", //拖动点Y偏移,
            stepList: [],
            stepIndex: "end",
            dragModel: "",
            dragData: "",
            activeName: "first",
            dataSourceActive: "",
            dataVisible: true,
            addId: 0,
            isMouseDown: false,
            mouseDownNode: "",
            filterNode: "",
            field: [
                {
                    value: "0",
                    label: "字段0"
                },
                {
                    value: "1",
                    label: "字段1"
                },
                {
                    value: "2",
                    label: "字段2"
                },
                {
                    value: "3",
                    label: "字段3"
                },
                {
                    value: "4",
                    label: "字段4"
                }
            ],

            //svg 样式相关数据
            offsetX: 100,
            width: "",
            height: "",
            modelConf: {
                fillColor: "#fff",
                innerFillColor: "#e8f4ff",
                borderColor: "#c9c9c9",
                innerBorderColor: "#1490FF",
                strokeColor: "none",
                strokeWidth: 1,
                textFillColor: "#1490FF",
                textFontSzie: 12,
                height: 50
            },
            dataConf: {
                width: 200,
                height: 105,
                menuWidth: 18
            },
            lineConf: {
                strokeColor: "#7a7b85",
                lineTextFontSize: 12,
                strokeWidth: 1
            },

            //图形配置项
            scaleExtent: [0.2, 3], //缩放范围
            isMaker: false //是否显示箭头
        };
    },
    mounted() {
        document.body.ondrop = function(event) {
            event.preventDefault();
            event.stopPropagation();
        };
        this.getAllDataSource();
        this.getAllModel();
        this.initWs();
        this.tableOptions["max-height"] = document.body.offsetHeight - 450;
        this.detailTableOptions["max-height"] =
            document.body.offsetHeight - 300;
        document.getElementById("main").oncontextmenu = function() {
            return false;
        };
        document.addEventListener("fullscreenchange", () => {
            var userAgent = navigator.userAgent,
                isFull;
            if (userAgent.indexOf("Firefox") > -1) {
                //判断是否Firefox浏览器
                isFull = document.mozFullScreen;
            }
            if (userAgent.indexOf("Chrome") > -1) {
                isFull = document.webkitIsFullScreen;
            }
            this.toolbarBottomList.map(value => {
                if (value.name == "全屏") {
                    value.is = !isFull;
                }
                if (value.name == "退出全屏") {
                    value.is = isFull;
                }
            });
        });
        this.width = document.getElementById("main").offsetWidth;
        this.height = document.getElementById("main").offsetHeight;
        this.createSvg();
    },
    methods: {
        closeData() {
            this.dataVisible = false;
        },

        modelDragstart(model) {
            this.dragModel = model;
        },

        dataDragstart(data, type = "") {
            this.dragData = data;
            this.dragType = type;
        },
        //创建图形
        createSvg() {
            // 缩放器
            this.zoom = d3
                .zoom()
                .scaleExtent(this.scaleExtent)
                .on("zoom", this.zoomFn);

            this.drag = d3
                .drag()
                .on("start", this.dragstartFn)
                .on("drag", this.dragFn)
                .on("end", this.dragendFn);

            // SVG
            this.svg = d3
                .select("#main")
                .append("svg")
                .attr("width", this.width)
                .attr("height", this.height);

            this.svg
                .on("dragover", () => {
                    d3.event.preventDefault();
                })
                .on("drop", () => {
                    if (this.dragType == "model") {
                        this.editModel(this.dragData);
                    } else {
                        let p = this.getMovePath();
                        this.addData(p[0], p[1]);
                        this.createNodeAndLine();
                    }
                })
                .on("mousemove", () => {
                    if (this.isMouseDown == true) {
                        let link = this.links.filter(
                            line =>
                                line.target.id ==
                                    this.mouseDownNode.target.id &&
                                line.source.id == this.mouseDownNode.source.id
                        );
                        link.select("path").attr("d", link => {
                            let x = link.source.x + this.dataConf.width / 2,
                                y = link.source.y,
                                p = this.getMovePath();
                            if (link.source.dragType == "model") {
                                y = y + this.modelConf.height + 5;
                            }
                            if (
                                link.source.dragType == "dataResult" ||
                                link.source.dragType == "comparisonResult"
                            ) {
                                y = y + this.dataConf.height + 5;
                            }
                            return "M" + x + "," + y + " L" + p[0] + "," + p[1];
                        });
                        link.select("circle").attr("transform", () => {
                            let p = this.getMovePath();
                            return "translate(" + p[0] + "," + p[1] + ")";
                        });
                    }
                });

            // 缩放层
            this.zoomOverlay = this.svg
                .append("rect")
                .attr("width", this.width)
                .attr("height", this.height)
                .attr("class", "background")
                .style("fill", "none")
                .style("cursor", "move")
                .style("pointer-events", "all")
                .call(this.zoom)
                .on("dblclick.zoom", null);

            this.container = this.svg.append("g").attr("class", "container");

            this.container.on("mouseup", () => {
                if (d3.event.button == 0) {
                    this.isMouseDown = false;
                    this.mouseDownNode.target.relationFields = [];
                    this.mouseDownNode.target.showFields = [[], []];
                    this.mouseDownNode.target = this.mouseDownNode.source;
                    this.updateNodeLine();
                    this.mouseDownNode = "";
                }
            });

            //连线组
            this.linksGroup = this.container.append("g");

            //节点组
            this.nodesGroup = this.container.append("g");

            //箭头组
            this.makersGroup = this.container.append("g");
        },

        addData(x, y) {
            if (this.dragModel) {
                let item = {
                    id: "node" + this.addId,
                    dragType: "model",
                    type: this.dragModel.type,
                    img: this.dragModel.img,
                    x,
                    y
                };
                this.nodesData.push(item);
                this.addId += 1;
            }
            if (this.dragData) {
                let item = {
                    id: "node" + this.addId,
                    dragType: "dataSource",
                    type: this.dragData,
                    img: "data1",
                    x,
                    y
                };
                this.nodesData.push(item);
                this.addId += 1;
                this.getDataSourceDetail(item);
            }
            this.dragModel = "";
            this.dragData = "";
        },

        //创建节点和边
        createNodeAndLine() {
            var makers = this.makersGroup
                .selectAll(".maker")
                .data(this.linksData)
                .enter();

            makers
                .append("marker")
                .attr("class", "maker")
                .attr("id", line => "maker" + line.source.id)
                .attr("markerUnits", "strokeWidth")
                .style("fill", this.lineConf.strokeColor)
                .attr("markerWidth", 15)
                .attr("markerHeight", 10)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 0)
                .attr("refY", 0)
                .attr("orient", "auto")
                .append("path")
                .style("stroke", this.lineConf.strokeColor)
                .attr("d", "M0,-5L10,0L0,5")
                .style("cursor", "pointer");

            // 节点g
            var enterNode = this.nodesGroup
                .selectAll(".node")
                .data(this.nodesData)
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("id", node => "node-" + node.id)
                .attr(
                    "transform",
                    node => "translate(" + node.x + "," + node.y + ")"
                )
                .call(this.drag);
            enterNode.on("mouseup", node => {
                if (d3.event.button == 0 && node.dragType == "model") {
                    if (this.isMouseDown) {
                        let count = 0;
                        this.linksData.map(line => {
                            if (
                                line.target.id == node.id &&
                                line.source.id != node.id
                            ) {
                                count += 1;
                            }
                        });
                        if (count > 1) {
                            this.$message.warning("对比类型最多链接两个数据源");
                        } else {
                            this.mouseDownNode.target = node;
                        }

                        this.updateNodeLine();
                        this.isMouseDown = false;
                        this.mouseDownNode = "";
                        d3.event.stopPropagation();
                    }
                }
            });

            var modelNode = enterNode.filter(node => node.dragType == "model");
            modelNode.on("click", node => {
                let isHave = false,
                    state = false;
                this.linksData.map(line => {
                    if (
                        line.source.id == node.id &&
                        line.target.id != node.id
                    ) {
                        isHave = true;
                        if (line.target.type.state == "比对中") {
                            state = true;
                            this.$message.warning(
                                "正在比对中，不能重新设置条件"
                            );
                        }
                    }
                });
                if (!isHave) {
                    this.modelClick(node);
                }
                if (isHave && !state) {
                    this.modelClick(node);
                }
            });
            modelNode
                .append("rect")
                .attr("width", 200)
                .attr("height", 50)
                .attr("fill", "#fff")
                .style("stroke", this.modelConf.borderColor)
                .style("stroke-width", this.modelConf.strokeWidth);
            modelNode
                .append("rect")
                .attr("width", 150)
                .attr("height", 30)
                .attr("fill", this.modelConf.innerFillColor)
                .attr("y", "10")
                .attr("x", "25")
                .style("stroke", this.modelConf.innerBorderColor)
                .style("cursor", "pointer");

            modelNode
                .append("image")
                .attr("width", 16)
                .attr("height", 16)
                .attr("x", "65")
                .attr("y", "17")
                .attr("xlink:href", node => node.img)
                .style("cursor", "pointer");

            modelNode
                .append("image")
                .attr("width", this.dataConf.menuWidth)
                .attr("height", this.dataConf.menuWidth)
                .attr("x", "180")
                .attr("y", "17")
                .attr("xlink:href", shanchuhong)
                .style("cursor", "pointer")
                .on("click", node => {
                    this.deleteNode(node);
                    d3.event.stopPropagation();
                });

            modelNode
                .append("text")
                .text(node => node.type)
                .attr("dy", "30")
                .attr("dx", "85")
                .style("cursor", "pointer");

            var dataNode = enterNode.filter(
                node =>
                    node.dragType == "dataSource" ||
                    node.dragType == "dataResult" ||
                    node.dragType == "comparisonResult"
            );
            dataNode
                .filter(node => node.dragType == "dataSource")
                .append("path")
                .attr("d", () => {
                    let x = this.dataConf.width / 2,
                        y = this.dataConf.height;
                    return "M" + x + "," + y + " L" + x + "," + (y + 40);
                })
                .style("stroke", this.lineConf.strokeColor)
                .style("stroke-width", this.lineConf.strokeWidth)
                .style("fill", "none")
                .attr("marker-end", "url(#resolved)");
            dataNode
                .filter(node => node.dragType == "dataSource")
                .append("marker")
                .attr("id", "resolved")
                .attr("markerUnits", "strokeWidth")
                .style("fill", this.lineConf.strokeColor)
                .attr("markerWidth", 15)
                .attr("markerHeight", 10)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 0)
                .attr("refY", 0)
                .attr("orient", "auto")
                .append("path")
                .style("stroke", this.lineConf.strokeColor)
                .attr("d", "M0,-5L10,0L0,5")
                .style("cursor", "pointer");
            dataNode
                .append("image")
                .attr("class", "dataSource")
                .attr("width", this.dataConf.width)
                .attr("height", this.dataConf.height)
                .attr("xlink:href", node => this.getImg(node.img));
            dataNode
                .filter(node => node.dragType == "dataSource")
                .select(".dataSource")
                .on("drop", node => {
                    this.replaceData(node);
                    d3.event.stopPropagation();
                });
            dataNode
                .filter(node => node.dragType == "dataSource")
                .append("rect")
                .attr("width", this.dataConf.width)
                .attr("height", 50)
                .attr("y", 155)
                .attr("fill", "#fff")
                .style("stroke", this.modelConf.borderColor)
                .style("stroke-width", this.modelConf.strokeWidth);
            dataNode
                .filter(node => node.dragType == "dataSource")
                .append("rect")
                .attr("width", 150)
                .attr("height", 30)
                .attr("fill", this.modelConf.innerFillColor)
                .attr("y", "165")
                .attr("x", "25")
                .style("stroke", this.modelConf.innerBorderColor)
                .style("cursor", "pointer")
                .on("click", node => this.filterClick(node));

            dataNode
                .filter(node => node.dragType == "dataSource")
                .append("text")
                .text("查询条件")
                .attr("dy", "185")
                .attr("dx", "75")
                .style("cursor", "pointer")
                .on("click", node => this.filterClick(node));
            dataNode
                .append("text")
                .attr("class", "dataName")
                .attr("dy", "20")
                .attr("dx", "10")
                .attr("fill", "#fff")
                .text(function(node) {
                    let text = node.type.name;
                    if (text.length > 12) {
                        text = text.substr(0, 10) + "...";
                    }
                    return text;
                });
            dataNode
                .filter(node => node.type.state)
                .append("text")
                .attr("class", "satte")
                .attr("dy", "50")
                .attr("dx", "90")
                .attr("fill", "#fff")
                .text(node => node.type.state);
            dataNode
                .append("text")
                .attr("class", "dataCount")
                .attr("dy", "90")
                .attr("dx", "10")
                .attr("fill", "#fff")
                .text(node =>
                    node.type.count != undefined ? node.type.count + "条" : ""
                );
            dataNode
                .filter(node => node.dragType == "comparisonResult")
                .append("image")
                .attr("width", this.dataConf.menuWidth)
                .attr("height", this.dataConf.menuWidth)
                .attr("x", "100")
                .attr("y", "78")
                .attr("xlink:href", lingcunwei)
                .style("cursor", "pointer")
                .on("click", node => this.saveClick(node));
            dataNode
                .filter(node => node.dragType == "comparisonResult")
                .append("image")
                .attr("width", this.dataConf.menuWidth)
                .attr("height", this.dataConf.menuWidth)
                .attr("x", "75")
                .attr("y", "78")
                .attr("xlink:href", kaishi)
                .style("cursor", "pointer")
                .on("click", node => this.startComparison(node));
            dataNode
                .append("image")
                .attr("width", this.dataConf.menuWidth)
                .attr("height", this.dataConf.menuWidth)
                .attr("x", "125")
                .attr("y", "78")
                .attr("xlink:href", bianji)
                .style("cursor", "pointer")
                .on("click", node => {
                    if (
                        node.dragType == "comparisonResult" &&
                        node.type.state == "比对中"
                    ) {
                        this.$message.warning("正在比对中，不能查看结果");
                    } else if (
                        node.dragType == "comparisonResult" &&
                        node.type.state == "比对失败"
                    ) {
                        this.$message.warning("比对失败，不能查看结果");
                    } else {
                        this.detailVisible = true;
                        this.isNodeDetail = true;
                        this.getDetail(node, true);
                    }
                });
            dataNode
                .filter(node => node.dragType == "dataSource")
                .append("image")
                .attr("width", this.dataConf.menuWidth)
                .attr("height", this.dataConf.menuWidth)
                .attr("x", "150")
                .attr("y", "78")
                .attr("xlink:href", shangchuan)
                .style("cursor", "pointer")
                .on("click", node => this.uploadReplace(node));

            dataNode
                .filter(
                    node =>
                        node.dragType == "dataResult" ||
                        node.dragType == "comparisonResult"
                )
                .append("image")
                .attr("width", this.dataConf.menuWidth)
                .attr("height", this.dataConf.menuWidth)
                .attr("x", "150")
                .attr("y", "78")
                .attr("xlink:href", xiazai)
                .style("cursor", "pointer")
                .on("click", node => {
                    this.exportloading = true;
                    if (
                        node.type.source == "另存为" ||
                        node.dragType == "comparisonResult"
                    ) {
                        this.exportSaveAs(node);
                    } else {
                        this.exportTmpDataSource(node);
                    }
                });

            // dataNode
            //     .append("image")
            //     .attr("width", this.dataConf.menuWidth)
            //     .attr("x", "150")
            //     .attr("y", "78")
            //     .attr("xlink:href", bianji)
            //     .style("cursor", "pointer");
            dataNode
                .append("image")
                .attr("width", this.dataConf.menuWidth)
                .attr("height", this.dataConf.menuWidth)
                .attr("x", "175")
                .attr("y", "78")
                .attr("xlink:href", shanchu)
                .style("cursor", "pointer")
                .on("click", node => this.deleteNode(node));

            var links = this.linksGroup
                .selectAll(".link")
                .data(this.linksData)
                .enter()
                .append("g")
                .attr("class", "link");

            links
                .append("path")
                .attr("d", link => this.getLinkPath(link))
                .style("stroke", this.lineConf.strokeColor)
                .style("stroke-width", this.lineConf.strokeWidth)
                .style("cursor", "pointer")
                .style("fill", "none")
                .attr(
                    "marker-end",
                    link => "url(#maker" + link.source.id + ")"
                );
            links
                .filter(link => link.isMakerCircle)
                .append("circle")
                .attr("class", "nodeCircle")
                .attr("r", 10)
                .attr("transform", link => this.getnodeCircleTranlate(link))
                .attr("fill", "rgba(0,0,0,0)")
                .style("cursor", "pointer")
                .on("mousedown", link => {
                    if (d3.event.button == 0) {
                        this.mouseDownNode = link;
                        this.isMouseDown = true;
                    }
                });

            this.bindNodeLine();
        },

        //绑定数据
        bindNodeLine() {
            this.nodeGroup = this.nodesGroup
                .selectAll(".node")
                .data(this.nodesData);
            this.links = this.linksGroup
                .selectAll(".link")
                .data(this.linksData);
            this.makers = this.makersGroup
                .selectAll(".maker")
                .data(this.linksData);
        },

        //缩放和平移
        zoomFn() {
            const { transform } = d3.event;
            this.container.attr("transform", transform);
        },

        // 更新位置
        tick() {},

        //开始移动
        dragstartFn() {},

        //拖动中
        dragFn(d) {
            d.x = d3.event.x;
            d.y = d3.event.y;
            this.updateNodeLine();
        },

        //拖动结束
        dragendFn(d) {
            d.x = d3.event.x;
            d.y = d3.event.y;
        },
        // 生成关系连线路径
        getLinkPath(link, type) {
            let x = link.source.x,
                y = link.source.y,
                x1 = link.target.x,
                y1 = link.target.y;
            x = x + this.dataConf.width / 2;
            if (link.source.id == link.target.id) {
                if (link.source.dragType == "model") {
                    y = y + this.modelConf.height + 5;
                }
                if (
                    link.source.dragType == "dataResult" ||
                    link.source.dragType == "comparisonResult"
                ) {
                    y = y + this.dataConf.height + 5;
                }
                if (type == "node") {
                    return [x, y + 1];
                }
                return "M" + x + "," + y + " L" + x + "," + (y + 1);
            }
            if (link.source.dragType == "dataSource") {
                y = y + 170;
            }
            if (link.source.dragType == "model") {
                y = y + this.modelConf.height / 2;
            }
            if (
                link.source.dragType == "dataResult" ||
                link.source.dragType == "comparisonResult"
            ) {
                y = y + this.dataConf.height / 2;
            }
            if (x > x1 + this.dataConf.width) {
                x1 = x1 + this.dataConf.width + 8;
                if (
                    link.target.dragType == "dataResult" ||
                    link.target.dragType == "comparisonResult"
                ) {
                    y1 = y1 + this.dataConf.height / 2;
                }
                if (link.target.dragType == "model") {
                    y1 = y1 + this.modelConf.height / 2;
                }
            } else if (x + this.dataConf.width / 2 < x1) {
                x1 = x1 - 8;
                if (
                    link.target.dragType == "dataResult" ||
                    link.target.dragType == "comparisonResult"
                ) {
                    y1 = y1 + this.dataConf.height / 2;
                }
                if (link.target.dragType == "model") {
                    y1 = y1 + this.modelConf.height / 2;
                }
            } else {
                x1 = x1 + this.dataConf.width / 2;
                if (y < y1) {
                    y1 = y1 - 8;
                } else {
                    if (link.target.dragType == "model") {
                        if (y > y1 + this.modelConf.height) {
                            y1 = y1 + this.modelConf.height + 8;
                        }
                    }
                    if (
                        link.target.dragType == "dataResult" ||
                        link.target.dragType == "comparisonResult"
                    ) {
                        if (y > y1 + this.dataConf.height) {
                            y1 = y1 + this.dataConf.height + 8;
                        }
                    }
                }
            }
            if (type == "node") {
                return [x1, y1];
            }
            return "M" + x + "," + y + " L" + x1 + "," + y1;
        },

        //头部工具栏操作
        toolbarClick(item) {
            if (item.type == "radio") {
                this.toolbarList.map(value => {
                    if (value.name != item.name && value.type == "radio") {
                        value.isCheck = false;
                    }
                    if (value.name == item.name) {
                        value.isCheck = !value.isCheck;
                    }
                });
            }
            switch (item.name) {
                case "回到中心":
                    var zoom = d3.zoomTransform(this.zoomOverlay.node()),
                        zoomStart = cloneDeep(zoom);
                    zoom.k = 1;
                    zoom.x = 0;
                    zoom.y = 0;
                    this.addStep({
                        type: "zoom",
                        transformStart: zoomStart,
                        transformEnd: cloneDeep(zoom)
                    });
                    d3.zoom().transform(this.svg, zoom);
                    this.container.attr("transform", zoom);
                    break;
                case "数据源":
                    this.dataVisible = !this.dataVisible;
                    break;
                case "清空":
                    this.$msgbox({
                        title: "警告",
                        message: "是否清空画布",
                        showCancelButton: true,
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        confirmButtonClass: "confirmButton",
                        customClass: "confirmDio"
                    }).then(() => {
                        this.emptyData();
                    });
                    break;
            }
        },

        //左下角工具栏操作
        toolbarBottomClick(type) {
            switch (type) {
                case "全屏":
                    var fullDiv = document.getElementById("full");
                    this.fullscreen(fullDiv);
                    this.setWidthHeight();
                    break;
                case "退出全屏":
                    this.fullscreen();
                    this.setWidthHeight();
                    break;
                case "放大":
                    var zoom = d3.zoomTransform(this.zoomOverlay.node()),
                        x = zoom.x,
                        y = zoom.y,
                        zoomStart = cloneDeep(zoom);
                    zoom.k =
                        zoom.k + 0.4 < this.scaleExtent[1]
                            ? zoom.k + 0.4
                            : this.scaleExtent[1];
                    zoom.x = x;
                    zoom.y = y;
                    this.addStep({
                        type: "zoom",
                        transformStart: zoomStart,
                        transformEnd: cloneDeep(zoom)
                    });
                    d3.zoom().transform(this.svg, zoom);
                    this.container.attr("transform", zoom);
                    break;
                case "缩小":
                    var zoom = d3.zoomTransform(this.zoomOverlay.node()),
                        x = zoom.x,
                        y = zoom.y;
                    zoom.k =
                        zoom.k - 0.2 > this.scaleExtent[0]
                            ? zoom.k - 0.2
                            : this.scaleExtent[0];
                    zoom.x = x;
                    zoom.y = y;
                    this.addStep({
                        type: "zoom",
                        transformStart: zoomStart,
                        transformEnd: cloneDeep(zoom)
                    });
                    d3.zoom().transform(this.svg, zoom);
                    this.container.attr("transform", zoom);
                    break;
                case "上一步":
                    this.previousStep();
                    break;
                case "下一步":
                    this.nextStep();
                    break;
            }
        },

        //全屏
        fullscreen(div) {
            if (!div) {
                // 退出全屏
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                // 进入全屏
                if (div.requestFullscreen) {
                    div.requestFullscreen();
                } else if (div.webkitRequestFullScreen) {
                    div.webkitRequestFullScreen();
                } else if (div.mozRequestFullScreen) {
                    div.mozRequestFullScreen();
                } else if (div.msRequestFullscreen) {
                    div.msRequestFullscreen();
                }
            }
        },

        tooltipFullscreen(name) {
            var userAgent = navigator.userAgent,
                isFull;
            if (userAgent.indexOf("Firefox") > -1) {
                //判断是否Firefox浏览器
                isFull = document.mozFullScreen;
            }
            if (userAgent.indexOf("Chrome") > -1) {
                isFull = document.webkitIsFullScreen;
            }
            if (isFull) {
                setTimeout(() => {
                    var htmls = document.getElementsByClassName(name);
                    for (let n = 0; n < htmls.length; n++) {
                        document.getElementById("main").appendChild(htmls[n]);
                    }
                }, 100);
            } else {
                d3.select("#main")
                    .selectAll("." + name)
                    .remove();
            }
        },

        //添加操作步骤
        addStep(step) {
            if (this.stepIndex == "start") {
                this.stepList = [];
                this.stepIndex = "end";
            }
            if (this.stepList[this.stepIndex]) {
                this.stepList.splice(
                    this.stepIndex,
                    this.stepList.length - this.stepIndex
                );
            }
            this.stepList.push(step);
        },

        //上一步
        previousStep() {
            if (!this.stepList.length) {
                return;
            }
            this.stepIndex =
                this.stepIndex == "end"
                    ? this.stepList.length - 1
                    : this.stepIndex;
            if (this.stepIndex != "start") {
                let step = this.stepList[this.stepIndex];
                switch (step.type) {
                    case "add":
                        this.deleteNodes(step.nodes, step.links, true);
                        break;
                    case "delete":
                        this.addNodeLine(step.nodes, step.links, true);
                        break;
                    case "zoom":
                        d3.zoom().transform(this.svg, step.transformStart);
                        this.container.attr("transform", step.transformStart);
                        break;
                    case "drag":
                        step.nodes.map(value => {
                            value.x = value.x - step.endPos.x + step.startPos.x;
                            value.y = value.y - step.endPos.y + step.startPos.y;
                        });
                        this.tick();
                        break;
                }
                this.stepIndex =
                    this.stepIndex > 0 ? this.stepIndex - 1 : "start";
            }
        },

        //下一步
        nextStep() {
            if (!this.stepList.length || this.stepIndex == "end") {
                return;
            }
            let step;
            this.stepIndex = this.stepIndex == "start" ? 0 : this.stepIndex;
            step = this.stepList[this.stepIndex];
            switch (step.type) {
                case "add":
                    this.addNodeLine(step.nodes, step.links, true);
                    break;
                case "delete":
                    this.deleteNodes(step.nodes, step.links, true);
                    break;
                case "zoom":
                    d3.zoom().transform(this.svg, step.transformEnd);
                    this.container.attr("transform", step.transformEnd);
                    break;
                case "drag":
                    step.nodes.map(value => {
                        value.x = value.x + step.endPos.x - step.startPos.x;
                        value.y = value.y + step.endPos.y - step.startPos.y;
                    });
                    this.tick();
                    break;
            }
            this.stepIndex = this.stepList[this.stepIndex + 1]
                ? this.stepIndex + 1
                : "end";
        },

        toolbarBottomTooltip(name) {
            var tip = name;
            if (name == "上一步") {
                if (!this.stepList.length || this.stepIndex == "start") {
                    tip = "无上一步";
                }
            }
            if (name == "下一步") {
                if (!this.stepList.length || this.stepIndex == "end") {
                    tip = "无下一步";
                }
            }
            return tip;
        },

        emptyData() {
            this.nodesData = [];
            this.linksData = [];
            d3.select("#main")
                .select("svg")
                .remove();
            this.createSvg();
        },

        getImg(type) {
            return this.imgs[type];
        },

        filterClick(node) {
            this.title1 = "查询条件";
            this.dialogVisible1 = true;
            this.filterNode = {};
            if (!node.conditions || node.conditions.length == 0) {
                node.conditions = [];
            }
            if (!node.check || node.check.length == 0) {
                node.check = [];
            }
            this.getFieldList(node);
        },

        deleteNode(node) {
            this.tooltipFullscreen("el-message-box__wrapper");
            this.tooltipFullscreen("v-modal");
            this.$msgbox({
                title: "警告",
                message: "是否确认删除",
                showCancelButton: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                confirmButtonClass: "confirmButton",
                customClass: "confirmDio"
            }).then(() => {
                this.nodeGroup.each(function(n) {
                    if (n.id == node.id) {
                        d3.select(this).remove();
                    }
                });
                this.links.each(function(link) {
                    if (node.dragType == "model") {
                        if (link.target.id == node.id) {
                            link.target = link.source;
                            link.target.y += 1;
                        } else if (link.source.id == node.id) {
                            d3.select(this).remove();
                        }
                    } else {
                        if (
                            link.source.id == node.id ||
                            link.target.id == node.id
                        ) {
                            if (link.target.dragType == "model") {
                                link.target.showFields = [[], []];
                                link.target.relationFields = "";
                            }
                            d3.select(this).remove();
                        }
                    }
                });
                this.makers.each(function() {
                    d3.select("#maker" + node.id).remove();
                });

                for (let n = 0; n < this.nodesData.length; n++) {
                    if (node.id == this.nodesData[n].id) {
                        this.nodesData.splice(n--, 1);
                    }
                }
                for (let n = 0; n < this.linksData.length; n++) {
                    if (node.dragType == "model") {
                        if (node.id == this.linksData[n].source.id) {
                            this.linksData.splice(n--, 1);
                        }
                    } else {
                        if (
                            node.id == this.linksData[n].source.id ||
                            node.id == this.linksData[n].target.id
                        ) {
                            this.linksData.splice(n--, 1);
                        }
                    }
                }

                this.bindNodeLine();
                this.updateNodeLine();
            });
        },

        addLine(node) {
            this.linksData.push({
                source: this.mouseDownNode,
                target: node
            });
            this.createNodeAndLine();
        },

        getnodeCircleTranlate(link) {
            let n = this.getLinkPath(link, "node");
            return "translate(" + n[0] + "," + n[1] + ")";
        },

        updateNodeLine() {
            this.nodeGroup.attr(
                "transform",
                node => "translate(" + node.x + "," + node.y + ")"
            );
            this.links.select("path").attr("d", link => this.getLinkPath(link));
            this.links
                .select("circle")
                .attr("transform", link => this.getnodeCircleTranlate(link));
        },

        getMovePath() {
            let x0 = this.getLeft(document.getElementById("main"));
            let y0 = this.getTop(document.getElementById("main"));
            let transfrom = d3.zoomTransform(this.zoomOverlay.node());
            let offsetX = d3.event.clientX - x0,
                offsetY = d3.event.clientY - y0;
            let x = offsetX / transfrom.k - transfrom.x / transfrom.k,
                y = offsetY / transfrom.k - transfrom.y / transfrom.k;
            return [x, y];
        },

        modelClick(node) {
            let count = 0;
            this.linksData.map(line => {
                if (line.target.id == node.id && line.source.id != node.id) {
                    count += 1;
                }
            });
            if (count != 2) {
                this.$message.warning("比对模型必须连接两个数据源才能进行比对");
                return;
            }
            this.dataA = "";
            this.dataB = "";
            this.linksData.map(line => {
                if (line.target.id == node.id && line.source.id != node.id) {
                    if (!this.dataA) {
                        this.dataA = {
                            field: cloneDeep(
                                line.source.field && line.source.field.length
                                    ? line.source.field
                                    : []
                            ),
                            ...cloneDeep(line.source.type)
                        };
                    } else {
                        this.dataB = {
                            field: cloneDeep(
                                line.source.field && line.source.field.length
                                    ? line.source.field
                                    : []
                            ),
                            ...cloneDeep(line.source.type)
                        };
                    }
                }
            });
            if (!node.relationFields) {
                node.relationFields = [];
            } else {
                node.relationFields = [...node.relationFields];
            }
            if (!node.showFields) {
                node.showFields = [[], []];
            }
            this.dialogVisible1 = true;
            this.title1 = "比对关联字段设置";
            this.filterNode = node;
        },

        replaceData(node) {
            this.$msgbox({
                title: "警告",
                message: "是否替换数据源",
                showCancelButton: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                confirmButtonClass: "confirmButton",
                customClass: "confirmDio"
            }).then(() => {
                if (!node.type.plateId == null) {
                    this.$message.warning("只有上传的数据源才能被替换");
                } else {
                    if (this.dragData.plateId == null) {
                        this.$message.warning("只有上传的数据源才能替换");
                    } else if (node.type.plateId != this.dragData.plateId) {
                        this.$message.warning("数据源模板不同不能替换");
                    } else {
                        node.type = this.dragData;
                        this.getDataSourceDetail(node);
                        this.linksData.map(link => {
                            if (link.source.id == node.id) {
                                link.target.type = { ...this.dragData };
                                this.getDataSourceDetail(node, link.target);
                            }
                        });
                    }
                }
            });
        },

        updateSvg() {
            this.nodeGroup.select(".dataName").text(function(node) {
                let text = node.type.name;
                if (text.length > 12) {
                    text = text.substr(0, 10) + "...";
                }
                return text;
            });
            this.nodeGroup
                .select(".dataSource")
                .attr("xlink:href", node => this.getImg(node.img));
            this.nodeGroup
                .filter(
                    node =>
                        node.dragType == "dataSource" ||
                        node.dragType == "dataResult" ||
                        node.dragType == "comparisonResult"
                )
                .select(".dataCount")
                .text(node =>
                    node.type.count != undefined ? node.type.count + "条" : ""
                );
            this.nodeGroup
                .filter(node => node.dragType == "comparisonResult")
                .select(".satte")
                .text(node => node.type.state);
        },

        openDialog(title) {
            if (title == "保存模型") {
                if (this.nodesData.length == 0) {
                    this.$message.warning("暂无数据，请添加数据后在保存");
                    return;
                }
            }
            this.dialogVisible = true;
            this.title = "";
            if (title != "上传数据源") {
                this.title = title;
            }
            if (title == "数据源管理") {
                this.getDataSourceType();
                this.tab = this.tabsList.dataManage;
            }
            if (title == "模型管理") {
                this.tab = this.tabsList.modelManage;
            }
            if (title == "上传数据源") {
                setTimeout(() => {
                    this.title = title;
                });
                this.uploadReplaceNode = "";
            }
        },

        sureSave() {
            if (this.title1 == "查询条件") {
                let is = false;
                for (let n = 0; n < this.$refs.conditions.table.length; n++) {
                    let item = this.$refs.conditions.table[n];
                    if (!item.field) {
                        is = true;
                        this.$message.warning("查询条件不能为空");
                        return;
                    }
                    if (!item.condition) {
                        is = true;
                        this.$message.warning("查询条件不能为空");
                        return;
                    }
                    if (
                        (item.content == null || item.content == "") &&
                        item.condition != "notnull"
                    ) {
                        is = true;
                        this.$message.warning("查询条件不能为空");
                        return;
                    }
                }
                if (!is) {
                    this.filterNode.conditions = this.$refs.conditions.table;
                    this.filterNode.check = this.$refs.conditions.checkList;
                    this.dialogVisible1 = false;
                } else {
                    return;
                }
                let isHave = false;
                this.linksData.map(line => {
                    if (line.source.id == this.filterNode.id) {
                        line.target.conditions = this.filterNode.conditions;
                        line.target.check = this.filterNode.check;
                        this.getDataSourceDetail(line.source, line.target);
                        isHave = true;
                    }
                });
                if (isHave) {
                    return;
                }
                let node = cloneDeep(this.filterNode);
                node.name = "查询结果";
                let item = {
                    id: "node" + this.addId,
                    dragType: "dataResult",
                    type: node.type,
                    conditions: node.conditions,
                    check: node.check,
                    field: node.field,
                    img: "data2",
                    x: this.filterNode.x,
                    y: this.filterNode.y + 250
                };
                this.nodesData.push(item);
                this.addId += 1;
                this.linksData.push({
                    source: this.filterNode,
                    target: item
                });
                this.linksData.push({
                    source: item,
                    target: item,
                    isMakerCircle: true
                });
                this.getDataSourceDetail(this.filterNode, item);
                this.createNodeAndLine();
            }
            if (this.title1 == "比对关联字段设置") {
                let is = false;
                if (!this.$refs.comparison.field.length) {
                    this.$message.warning("必须设置关联字段");
                    return;
                }
                if (!this.$refs.comparison.table.length) {
                    this.$message.warning("必须选择交集结果字段");
                    return;
                } else {
                    let isChecked = false;
                    this.$refs.comparison.table.map(value => {
                        if (value.fieldA && value.fieldA.checked) {
                            isChecked = true;
                        }
                        if (value.fieldB && value.fieldB.checked) {
                            isChecked = true;
                        }
                    });
                    if (!isChecked) {
                        this.$message.warning("必须选择交集结果字段");
                        return;
                    }
                }
                for (let n = 0; n < this.$refs.comparison.field.length; n++) {
                    let item = this.$refs.comparison.field[n];
                    if (!item.fieldA || !item.fieldB) {
                        is = true;
                        this.$message.warning("关联字段不能为空");
                        return;
                    }
                }
                if (!is) {
                    this.filterNode.relationFields = this.$refs.comparison.field;
                    this.filterNode.showFields = [[], []];
                    this.$refs.comparison.table.map(value => {
                        if (value.fieldA && value.fieldA.checked) {
                            this.filterNode.showFields[0].push(
                                value.fieldA.enName
                            );
                        }
                        if (value.fieldB && value.fieldB.checked) {
                            this.filterNode.showFields[1].push(
                                value.fieldB.enName
                            );
                        }
                    });
                    this.dialogVisible1 = false;
                } else {
                    return;
                }
                let isHave = false;
                this.linksData.map(line => {
                    if (line.source.id == this.filterNode.id) {
                        isHave = true;
                    }
                });
                if (isHave) {
                    return;
                }
                let item = {
                    id: "node" + this.addId,
                    dragType: "comparisonResult",
                    type: {
                        name: this.filterNode.type + "结果",
                        source: "",
                        state: "未开始"
                    },
                    img: "result1",
                    x: this.filterNode.x,
                    y: this.filterNode.y + 100
                };
                this.nodesData.push(item);
                this.addId += 1;
                this.linksData.push({
                    source: this.filterNode,
                    target: item
                });
                this.linksData.push({
                    source: item,
                    target: item,
                    isMakerCircle: true
                });
                this.createNodeAndLine();
            }
        },

        sure() {
            if (this.title == "保存模型") {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.dialogVisible = false;
                        this.saveModel();
                    } else {
                        return false;
                    }
                });
            }
        },

        handlePageChange(current, size) {
            this.tab.map(value => {
                if (value.title == this.tabsActive) {
                    value.pageNum = current;
                    value.pageSize = size;
                    this.searchDataSource(value);
                }
            });
        },

        sortChange({ order }) {
            let item = {};
            this.tab.map(value => {
                if (value.title == this.tabsActive) {
                    item = value;
                }
            });
            if (order == "descending") {
                this.searchDataSource(item, "create_time", "desc");
            }
            if (order == "ascending") {
                this.searchDataSource(item, "create_time", "asc");
            }
        },

        setWidthHeight() {
            setTimeout(() => {
                this.width = document.getElementById("main").offsetWidth;
                this.height = document.getElementById("main").offsetHeight;
                d3.select("#main")
                    .select("svg")
                    .attr("width", this.width)
                    .attr("height", this.height);
                this.zoomOverlay
                    .attr("width", this.width)
                    .attr("height", this.height);
            }, 100);
        },

        searchDataSource(item, sortName = "", sortRule = "") {
            if (item.title == "系统数据源") {
                item.createUser = "admin";
                this.getSystemData(item, sortName, sortRule);
            } else if (item.title == "我的数据源") {
                item.createUser = "1";
                this.getSystemData(item, sortName, sortRule);
            } else if (item.title == "共享数据源") {
                item.createGroup = "1";
                item.isShared = "0";
                this.getSystemData(item, sortName, sortRule);
            } else if (item.title == "公共模型") {
                item.createUser = "admin";
                this.getModelList(item, sortName, sortRule);
            } else if (item.title == "我的模型") {
                item.createUser = "1";
                this.getModelList(item, sortName, sortRule);
            } else if (item.title == "共享模型") {
                item.createGroup = "1";
                item.isShared = "0";
                this.getModelList(item, sortName, sortRule);
            }
        },

        initTableData() {
            this.tabsList = this.$options.data().tabsList;
        },

        tabsChange() {
            this.tab.map(value => {
                if (value.title == this.tabsActive) {
                    this.searchDataSource(value);
                }
            });
        },

        getSystemData(item, sortName = "", sortRule = "") {
            this.loading = true;
            let params = {
                createUser: item.createUser,
                createGroup: item.createGroup,
                endCreateTime: item.date && item.date[1] ? item.date[1] : "",
                isShared: item.isShared,
                pageNum: item.pageNum,
                pageSize: item.pageSize,
                sortName: sortName,
                sortRule: sortRule,
                source: item.source,
                startCreateTime: item.date && item.date[0] ? item.date[0] : "",
                type: item.type,
                name: item.keyWord
            };

            getSystemData(params)
                .then(data => {
                    this.loading = false;
                    item.table = [];
                    item.total = 0;
                    if (data.code == 0) {
                        item.table = data.data.rows;
                        item.total = data.data.total;
                    }
                })
                .catch(() => {
                    this.loading = false;
                });
        },

        getAllDataSource(data) {
            if (this.uploadReplaceNode) {
                if (this.uploadReplaceNode.type.plateId == data.plateId) {
                    this.uploadReplaceNode.type = data;
                    this.getDataSourceDetail(this.uploadReplaceNode);
                    this.linksData.map(link => {
                        if (link.source.id == this.uploadReplaceNode.id) {
                            link.target.type = cloneDeep(
                                this.uploadReplaceNode.type
                            );
                            this.getDataSourceDetail(
                                this.uploadReplaceNode,
                                link.target
                            );
                        }
                    });
                } else {
                    if (this.title != "数据源管理") {
                        this.$message.warning("上传数据源模板不一致，不能替换");
                    }
                }
            }
            getSystemData({
                createUser: "",
                endCreateTime: "",
                pageNum: 1,
                pageSize: 9999,
                sortName: "",
                sortRule: "sortRule",
                source: "",
                startCreateTime: "",
                type: ""
            }).then(data => {
                this.dataSouce = [];
                if (data.code == 0) {
                    this.dataSouce = data.data.rows;
                }
            });
        },

        changeShare(row, is) {
            shareDataSource({
                dataSourceNum: row.num,
                isShared: is ? 0 : 1
            }).then(() => {
                this.tab.map(value => {
                    if (value.title == this.tabsActive) {
                        this.searchDataSource(value);
                    }
                });
            });
        },

        getDataSourceType() {
            getDataSourceType().then(data => {
                this.queryDataSourceTypeOptions = [];
                if (data.code == 0 && data.data) {
                    data.data.map(value => {
                        this.queryDataSourceTypeOptions.push({
                            value,
                            lableL: value
                        });
                    });
                }
            });
        },

        deleteDataSource(id) {
            this.tooltipFullscreen("el-message-box__wrapper");
            this.tooltipFullscreen("v-modal");
            this.$msgbox({
                title: "警告",
                message: "是否确认删除",
                showCancelButton: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                confirmButtonClass: "confirmButton",
                customClass: "confirmDio"
            }).then(() => {
                deleteDataSource({
                    dataSourceNum: id
                }).then(data => {
                    if (data.code == 0) {
                        this.$message.success("删除成功");
                        this.tab.map(value => {
                            if (value.title == this.tabsActive) {
                                value.pageNum = 1;
                                this.searchDataSource(value);
                                this.getAllDataSource(value);
                            }
                        });
                    }
                });
            });
        },

        getFieldList(node) {
            getFieldList({
                dataSourceNum: node.type.num
            }).then(data => {
                node.field = [];
                if (data.code == 0) {
                    node.field = data.data;
                    this.filterNode = node;
                }
            });
        },

        getDataSourceDetail(node, item = null) {
            let conditon = [],
                source = [];
            if (node.conditions) {
                node.conditions.map(value => {
                    let name = "";
                    node.field.map(item => {
                        if (item.enName == value.field) {
                            name = item;
                        }
                    });
                    let bridle =
                        value.condition != "notnull"
                            ? [name.enName, value.condition, value.content]
                            : [name.enName, value.condition];
                    conditon.push({
                        bridle: bridle.join(" "),
                        cnName: name.cnName,
                        enName: name.enName,
                        type: name.type
                    });
                });
            }
            getDataSourceDetail({
                dabh: this.$route.query.dabh,
                isMultipleCases:
                    this.$route.query.isMultipleCases == "true" ? true : false,
                dwbm: this.$route.query.dwbm,
                dataSourceNum: node.type.num,
                queryConditionDTOS: item ? conditon : [],
                type: node.type.source
            }).then(data => {
                if (data.code == 0) {
                    if (!item) {
                        node.type.count = data.data.count;
                    } else {
                        item.type.count = data.data.count;
                    }
                    this.updateSvg();
                }
            });
        },

        doCompare(node) {
            let joinFieldList = [],
                sourceA = "",
                sourceB = "";
            this.linksData.map(line => {
                if (
                    line.target.id == this.filterNode.id &&
                    line.source.id != this.filterNode.id
                ) {
                    if (!sourceA) {
                        sourceA = line.source;
                    } else {
                        sourceB = line.source;
                    }
                }
            });
            if (this.filterNode.relationFields) {
                this.filterNode.relationFields.map(value => {
                    let it = {};
                    this.dataA.field.map(item => {
                        if (item.enName == value.fieldA) {
                            it.joinFieldA = "a." + item.enName;
                        }
                    });
                    this.dataB.field.map(item => {
                        if (item.enName == value.fieldB) {
                            it.joinFieldB = "b." + item.enName;
                        }
                    });
                    joinFieldList.push(it);
                });
            }

            if (sourceA.dragType == "comparisonResult") {
                if (sourceA.type.state == "未开始") {
                    this.$message.warning("上级比对结果未开始，不能进行比对");
                    return;
                }
                if (sourceA.type.state == "比对中") {
                    this.$message.warning("上级比对结果未完成，不能进行比对");
                    return;
                }
                if (sourceA.type.state == "比对失败") {
                    this.$message.warning("上级比对结果失败，不能进行比对");
                    return;
                }
            }
            if (sourceB.dragType == "comparisonResult") {
                if (sourceB.type.state == "未开始") {
                    this.$message.warning("上级比对结果未开始，不能进行比对");
                    return;
                }
                if (sourceB.type.state == "比对中") {
                    this.$message.warning("上级比对结果未完成，不能进行比对");
                    return;
                }
                if (sourceB.type.state == "比对失败") {
                    this.$message.warning("上级比对结果失败，不能进行比对");
                    return;
                }
            }
            let conditonA = [],
                conditonB = [];
            if (sourceA.conditions) {
                sourceA.conditions.map(value => {
                    let name = "";
                    sourceA.field.map(item => {
                        if (item.enName == value.field) {
                            name = item;
                        }
                    });
                    let bridle =
                        value.condition != "notnull"
                            ? [name.enName, value.condition, value.content]
                            : [name.enName, value.condition];
                    conditonA.push({
                        bridle: bridle.join(" "),
                        cnName: name.cnName,
                        enName: name.enName,
                        type: name.type
                    });
                });
            }
            if (sourceB.conditions) {
                sourceB.conditions.map(value => {
                    let name = "";
                    sourceB.field.map(item => {
                        if (item.enName == value.field) {
                            name = item;
                        }
                    });
                    let bridle =
                        value.condition != "notnull"
                            ? [name.enName, value.condition, value.content]
                            : [name.enName, value.condition];
                    conditonB.push({
                        bridle: bridle.join(" "),
                        cnName: name.cnName,
                        enName: name.enName,
                        type: name.type
                    });
                });
            }
            let showFieldA = [],
                showFieldB = [];
            if (this.filterNode.showFields) {
                this.filterNode.showFields[0].map(id => {
                    this.dataA.field.map(item => {
                        if (id == item.enName) {
                            showFieldA.push({
                                cnName: item.cnName,
                                enName: item.enName,
                                type: item.type
                            });
                        }
                    });
                });
                this.filterNode.showFields[1].map(id => {
                    this.dataB.field.map(item => {
                        if (id == item.enName) {
                            showFieldB.push({
                                cnName: item.cnName,
                                enName: item.enName,
                                type: item.type
                            });
                        }
                    });
                });
            }

            let params = {
                createGroup: "1",
                createUser: "1",
                datasourceNumA: this.dataA.num,
                datasourceNumB: this.dataB.num,
                joinFieldList: joinFieldList,
                tmpDataSourceQueryDTOA: {
                    dabh: this.$route.query.dabh,
                    dataSourceNum: this.dataA.num,
                    type: this.dataA.source ? this.dataA.source : "另存为",
                    queryConditionDTOS: conditonA,
                    isMultipleCases:
                        this.$route.query.isMultipleCases == "true"
                            ? true
                            : false,
                    dwbm: this.$route.query.dwbm
                },
                tmpDataSourceQueryDTOB: {
                    dabh: this.$route.query.dabh,
                    dataSourceNum: this.dataB.num,
                    type: this.dataB.source ? this.dataB.source : "另存为",
                    queryConditionDTOS: conditonB,
                    isMultipleCases:
                        this.$route.query.isMultipleCases == "true"
                            ? true
                            : false,
                    dwbm: this.$route.query.dwbm
                },
                // queryConditionListA: conditonA,
                // queryConditionListB: conditonB,
                resTableName: "",
                showFieldA: showFieldA,
                showFieldB: showFieldB,
                step: 1,
                tableNameA: this.dataA.tableName,
                tableNameB: this.dataB.tableName,
                templateNumA: this.dataA.plateId,
                templateNumB: this.dataB.plateId,
                userId: "123456789",
                type:
                    this.filterNode.type == "交集比对"
                        ? 0
                        : this.filterNode.type == "并集比对"
                        ? 1
                        : this.filterNode.type == "差集比对"
                        ? 2
                        : ""
            };

            node.type.state = "比对中";
            node.img = "result2";
            this.updateSvg();
            newTable({
                type: "01"
            }).then(data => {
                if (data.code == 0) {
                    node.type.tableName = data.data;
                    params.resTableName = data.data;
                    doCompare(params).then(res => {
                        node.type.num = res.data;
                    });
                }
            });
        },

        changeLoading(is) {
            this.loading = is;
        },

        checkDetail(row) {
            this.detailVisible = true;
            this.isNodeDetail = false;
            this.getDetail(row);
        },

        closeDetail() {
            if (!this.isNodeDetail) {
                this.dialogVisible = true;
            }
            this.detailVisible = false;
        },

        getDetail(row, is = false) {
            this.detailLoading = true;
            let item,
                condition = [];
            if (is) {
                item = row.type;
                if (row.conditions) {
                    row.conditions.map(value => {
                        let name = "";
                        row.field.map(item => {
                            if (item.enName == value.field) {
                                name = item;
                            }
                        });
                        let bridle =
                            value.condition != "notnull"
                                ? [name.enName, value.condition, value.content]
                                : [name.enName, value.condition];
                        condition.push({
                            bridle: bridle.join(" "),
                            cnName: name.cnName,
                            enName: name.enName,
                            type: name.type
                        });
                    });
                }
            } else {
                item = row;
            }
            getDataSourceDetail({
                dabh: this.$route.query.dabh,
                isMultipleCases:
                    this.$route.query.isMultipleCases == "true" ? true : false,
                dwbm: this.$route.query.dwbm,
                dataSourceNum: item.num,
                queryConditionDTOS:
                    row.dragType && row.dragType == "dataSource"
                        ? []
                        : condition,
                type: item.source ? item.source : "另存为"
            })
                .then(data => {
                    this.detailColumns = [];
                    this.detailTable = [];
                    this.detailLoading = false;
                    if (data.code == 0) {
                        if (data.data.list) {
                            data.data.list[0].map((value, index) => {
                                this.detailColumns.push({
                                    title: value,
                                    key: index.toString()
                                });
                            });
                            data.data.list.map((value, index) => {
                                if (index != 0) {
                                    let it = {};
                                    data.data.list[index].map((item, ind) => {
                                        it[ind.toString()] = item;
                                    });
                                    this.detailTable.push(it);
                                }
                            });
                        }
                    }
                })
                .catch(() => {
                    this.detailLoading = false;
                });
        },

        initWs() {
            ws(
                process.env.VUE_APP_SITE_HOST +
                    ":" +
                    process.env.VUE_APP_SITE_SOCKET_PORT +
                    "/ias/ws/asset/123456789",
                res => {
                    if (res.msg == "计算失败") {
                        this.nodesData.map(value => {
                            if (value.type.tableName == res.data.resTableName) {
                                value.img = "result3";
                                value.type.count = res.data.total;
                                value.type.state = "比对失败";
                                this.updateSvg();
                            }
                        });
                    }
                    if (res.code == 0) {
                        this.nodesData.map(value => {
                            if (value.type.tableName == res.data.resTableName) {
                                if (!value.relationFields) {
                                    value.relationFields = [];
                                }
                                if (!value.showFields) {
                                    value.relationFields = [[], []];
                                }

                                value.img = "result4";
                                value.type.count = res.data.total;
                                value.type.state = "比对成功";
                                this.getFieldList(value);
                                this.updateSvg();
                            }
                        });
                    }
                }
            );
        },

        exportSaveAs(node) {
            if (
                node.dragType == "comparisonResult" &&
                node.type.state != "比对成功"
            ) {
                this.$message.warning("没有比对成功不能下载");
                return;
            }
            exportSaveAs({
                datasourceNum: node.type.num,
                tableName: node.type.tableName
            })
                .then(data => {
                    this.exportloading = false;
                    if (data.type != "application/json") {
                        var blob = new Blob([data], {
                            type: "application/vnd.ms-excel;charset=utf-8"
                        });
                        var url = window.URL.createObjectURL(blob);
                        var aLink = document.createElement("a");
                        aLink.style.display = "none";
                        aLink.href = url;
                        aLink.setAttribute("download", node.type.name + ".xls");
                        document.body.appendChild(aLink);
                        aLink.click();
                        document.body.removeChild(aLink);
                        window.URL.revokeObjectURL(url);
                    } else {
                        this.$message.error("文件下载错误");
                    }
                })
                .catch(() => {
                    this.exportloading = false;
                });
        },

        saveClick(node) {
            this.saveVisible = true;
            this.saveNode = node;
        },

        sureSaveAs() {
            this.$refs.saveForm.validate(valid => {
                if (valid) {
                    saveAs({
                        dataSourceNum: this.saveNode.type.num,
                        tableName: this.saveForm.name
                    }).then(data => {
                        if (data.code == 0) {
                            this.$message.success("另存成功");
                            this.getAllDataSource();
                        }
                    });
                    this.saveVisible = false;
                } else {
                    return false;
                }
            });
        },

        uploadReplace(node) {
            this.uploadReplaceNode = node;
            this.dialogVisible = true;
            this.title = "上传数据源";
        },

        uploadSuccess(data) {
            this.dialogVisible = false;
            this.getAllDataSource(data);
        },

        exportTmpDataSource(node) {
            let condition = [],
                source = [];
            if (node.conditions) {
                node.conditions.map(value => {
                    let name = "";
                    node.field.map(item => {
                        if (item.enName == value.field) {
                            name = item;
                        }
                    });
                    let bridle =
                        value.condition != "notnull"
                            ? [name.enName, value.condition, value.content]
                            : [name.enName, value.condition];
                    condition.push({
                        bridle: bridle.join(" "),
                        cnName: name.cnName,
                        enName: name.enName,
                        type: name.type
                    });
                });
            }
            exportTmpDataSource({
                dabh: this.$route.query.dabh,
                isMultipleCases:
                    this.$route.query.isMultipleCases == "true" ? true : false,
                dwbm: this.$route.query.dwbm,
                dataSourceNum: node.type.num,
                queryConditionDTOS: [...condition, ...source],
                type: node.type.source
            })
                .then(data => {
                    this.exportloading = false;
                    if (data.type != "application/json") {
                        var blob = new Blob([data], {
                            type: "application/vnd.ms-excel;charset=utf-8"
                        });
                        var url = window.URL.createObjectURL(blob);
                        var aLink = document.createElement("a");
                        aLink.style.display = "none";
                        aLink.href = url;
                        aLink.setAttribute("download", node.type.name + ".xls");
                        document.body.appendChild(aLink);
                        aLink.click();
                        document.body.removeChild(aLink);
                        window.URL.revokeObjectURL(url);
                    } else {
                        this.$message.error("文件下载错误");
                    }
                })
                .catch(() => {
                    this.exportloading = false;
                });
        },

        startComparison(node) {
            this.linksData.map(link => {
                if (link.target.id == node.id && link.source.id != node.id) {
                    this.filterNode = link.source;
                }
            });
            this.dataA = "";
            this.dataB = "";
            this.linksData.map(line => {
                if (
                    line.target.id == this.filterNode.id &&
                    line.source.id != this.filterNode.id
                ) {
                    if (!this.dataA) {
                        this.dataA = {
                            field: cloneDeep(
                                line.source.field && line.source.field.length
                                    ? line.source.field
                                    : []
                            ),
                            ...cloneDeep(line.source.type)
                        };
                    } else {
                        this.dataB = {
                            field: cloneDeep(
                                line.source.field && line.source.field.length
                                    ? line.source.field
                                    : []
                            ),
                            ...cloneDeep(line.source.type)
                        };
                    }
                }
            });
            if (node.type.state != "比对中") {
                this.doCompare(node);
            } else {
                this.$message.warning("比对中不能重新开始比对");
            }
        },

        saveModel() {
            let nodes = cloneDeep(this.nodesData);
            let links = cloneDeep(this.linksData);
            nodes.map(value => {
                links.map(link => {
                    if (link.source.id == value.id) {
                        link.source = value;
                    }
                    if (link.target.id == value.id) {
                        link.target = value;
                    }
                });
                if (value.dragType == "comparisonResult") {
                    value.type.state = "未开始";
                    value.type.count = undefined;
                    value.img = "result1";
                }
            });
            let content = {
                nodes,
                links
            };
            JSON.stringify(content);
            saveModel({
                content: JSON.stringify(content),
                createGroup: "1",
                createUser: "1",
                des: this.ruleForm.desc,
                name: this.ruleForm.name,
                oneStepCompareDTOS: []
            }).then(data => {
                if (data.code == 0) {
                    this.$message.success("保存成功");
                    this.getAllModel();
                }
            });
        },

        getModelList(item, sortName, sortRule) {
            this.loading = true;
            getModelList({
                createGroup: item.createGroup,
                createUser: item.createUser,
                endCreateTime: item.date && item.date[1] ? item.date[1] : "",
                isShared: item.isShared,
                pageNum: item.pageNum,
                pageSize: item.pageSize,
                sortName: sortName,
                sortRule: sortRule,
                startCreateTime: item.date && item.date[0] ? item.date[0] : "",
                name: item.keyWord
            })
                .then(data => {
                    this.loading = false;
                    item.table = [];
                    item.total = 0;
                    if (data.code == 0) {
                        item.table = data.data.rows;
                        item.total = data.data.total;
                    }
                })
                .catch(() => {
                    this.loading = false;
                });
        },

        deleteModel(row) {
            this.tooltipFullscreen("el-message-box__wrapper");
            this.tooltipFullscreen("v-modal");
            this.$msgbox({
                title: "警告",
                message: "是否确认删除",
                showCancelButton: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                confirmButtonClass: "confirmButton",
                customClass: "confirmDio"
            }).then(() => {
                this.loading = true;
                deleteModel({
                    compareModelNum: row.num,
                    createUser: row.createUser
                }).then(data => {
                    if (data.code == 0) {
                        this.$message.success("删除成功");
                        this.getAllModel();
                        this.tab.map(value => {
                            if (value.title == this.tabsActive) {
                                value.pageNum = 1;
                                this.getModelList(value);
                            }
                        });
                    }
                });
            });
        },

        shareModel(row, is) {
            shareModel({
                compareModelNum: row.num,
                isShared: is ? 0 : 1
            }).then(data => {
                if (data.code == 0) {
                    this.$message.success("修改成功");
                    this.tab.map(value => {
                        if (value.title == this.tabsActive) {
                            this.getModelList(value);
                        }
                    });
                }
            });
        },

        editModel(row) {
            this.dialogVisible = false;
            let data = JSON.parse(row.content);
            this.emptyData();
            this.nodesData = data.nodes;
            data.links.map(link => {
                this.nodesData.map(node => {
                    if (node.id == link.source.id) {
                        link.source = node;
                    }
                    if (node.id == link.target.id) {
                        link.target = node;
                    }
                });
            });
            this.linksData = data.links;

            this.createNodeAndLine();
        },

        getAllModel() {
            this.publicModel = [];
            this.myModel = [];
            this.shareModels = [];
            getModelList({
                createGroup: "",
                createUser: "admin",
                endCreateTime: "",
                isShared: "",
                pageNum: 1,
                pageSize: 9999,
                sortName: "",
                sortRule: "",
                startCreateTime: "",
                name: ""
            }).then(data => {
                if (data.code == 0) {
                    this.publicModel = data.data.rows;
                }
            });
            getModelList({
                createGroup: "",
                createUser: "1",
                endCreateTime: "",
                isShared: "",
                pageNum: 1,
                pageSize: 9999,
                sortName: "",
                sortRule: "",
                startCreateTime: "",
                name: ""
            }).then(data => {
                if (data.code == 0) {
                    this.myModel = data.data.rows;
                }
            });
            getModelList({
                createGroup: "1",
                createUser: "",
                endCreateTime: "",
                isShared: "0",
                pageNum: 1,
                pageSize: 9999,
                sortName: "",
                sortRule: "",
                startCreateTime: "",
                name: ""
            }).then(data => {
                if (data.code == 0) {
                    this.shareModels = data.data.rows;
                }
            });
        },

        getLeft(e) {
            let offset = e.offsetLeft;
            if (e.offsetParent != null) offset += this.getLeft(e.offsetParent);
            return offset;
        },
        getTop(e) {
            let offset = e.offsetTop;
            if (e.offsetParent != null) offset += this.getTop(e.offsetParent);
            return offset;
        }
    },
    destroyed() {},
    watch: {
        dialogVisible() {
            if (!this.dialogVisible && this.$refs.ruleForm) {
                this.$refs.ruleForm.clearValidate();
                this.ruleForm = {
                    title: "",
                    desc: ""
                };
            }
            if (this.dialogVisible && this.title == "保存模型") {
                setTimeout(() => {
                    this.$refs.focusInput.focus();
                });
            }
            this.initTableData();
            if (
                this.dialogVisible &&
                (this.title == "数据源管理" || this.title == "模型管理")
            ) {
                this.tabsActive = this.tab[0].title;
                this.searchDataSource(this.tab[0]);
            }
        },
        saveVisible() {
            if (!this.saveVisible && this.$refs.saveForm) {
                this.$refs.saveForm.clearValidate();
                this.saveForm = {
                    name: ""
                };
            }
            if (this.saveVisible) {
                setTimeout(() => {
                    this.$refs.saveInput.focus();
                });
            }
        }
    }
};
</script>

<style scoped lang="scss">
@import "@/styles/basic-color.scss";
#full {
    background-color: #fff;
    background: url("../..//assets/image/wangge.jpg") repeat;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.graphBox {
    height: 100%;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
}
.radioButton {
    display: inline-block;
    background-color: #fff;
    padding: 6px 10px;
    border-radius: 3px;
    font-size: 16px;
    border: 1px solid silver;
    margin-left: 20px;
    cursor: pointer;
    &:active {
        color: $color-primary;
        border: 1px solid $color-primary;
    }
}
.isActive {
    color: $color-primary;
    border: 1px solid $color-primary;
}
.toolbar {
    padding: 10px 0;
    background-color: #fff;
    .toolbar-right {
        float: right;
        .block {
            display: inline-block;
            margin-right: 20px;
        }
    }
}
.toolbarBottom {
    position: absolute;
    bottom: 20px;
    left: 20px;
    background-color: #fff;
}
.model {
    position: absolute;
    top: 70px;
    left: 20px;
    background-color: #fff;
    font-size: 16px;
    padding-bottom: 20px;
    border-radius: 5px;
    overflow: hidden;
    .title {
        height: 40px;
        width: 160px;
        line-height: 40px;
        background-color: $background-color;
        color: #fff;
        border-radius: 5px 5px 0px 0px;
        padding-left: 10px;
    }
    .model-item {
        margin: 20px 20px 0px 20px;
        border: 1px solid $color-primary;
        color: $color-primary;
        background-color: #e8f4ff;
        height: 40px;
        line-height: 40px;
        text-align: center;
        cursor: move;
    }
}
.data-source {
    position: absolute;
    width: 250px;
    top: 70px;
    right: 20px;
    background-color: #fff;
    font-size: 16px;
    padding-bottom: 10px;
    border-radius: 5px;
    overflow: hidden;
    .source-box {
        overflow-y: auto;
    }
    .title {
        height: 40px;
        line-height: 40px;
        background-color: $background-color;
        color: #fff;
        border-radius: 5px 5px 0px 0px;
        padding-left: 10px;
    }
    .data-source-item {
        height: 32px;
        background-color: #f6f7fc;
        line-height: 32px;
        padding-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border: 1px solid #f6f7fc;
        border-radius: 3px;
        &:hover {
            border: 1px dashed $color-primary;
            color: $color-primary;
        }
    }
    .data-source-item:not(:first-child) {
        margin-top: 10px;
    }
    .data-source-close {
        float: right;
        margin-right: 10px;
        cursor: pointer;
        &:hover {
            color: $color-primary;
        }
    }
}
</style>
<style lang="scss">
@import "@/styles/basic-color.scss";
.data-source {
    .el-tabs__item {
        padding: 0px;
        text-align: center;
        width: 125px;
    }
    .el-tabs__header {
        margin-bottom: 5px;
    }
    .el-collapse-item__header {
        background-color: #e8f4ff;
        color: $color-primary;
        padding-left: 20px;
        height: 32px;
        line-height: 32px;
        border: 1px solid $color-primary;
        margin-bottom: 5px;
    }
    .el-collapse-item__header.is-active {
        background-color: #d0e9ff;
    }
    .el-collapse-item__content {
        padding: 5px 10px 10px 10px;
    }
}
.confirmButton {
    color: #fff !important;
    border: 1px solid $color-primary !important;
    &:hover {
        background-color: $color-primary !important;
        color: #fff !important;
        border: 1px solid $color-primary !important;
    }
}
.confirmDio {
    width: 400px;
    min-width: 400px !important;
}
</style>
