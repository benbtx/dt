<template>
    <div>
        <template v-if="visible == 'upload'">
            <div>
                <div>
                    当前选择的模板 : {{ selectedRow.name }}
                    <el-button
                        type="primary"
                        size="small"
                        style="margin-left: 20px"
                        @click="changVisible('model')"
                        >选择模板</el-button
                    >
                    <el-button
                        type="primary"
                        size="small"
                        style="margin-left: 20px"
                        @click="changVisible('addModel')"
                        >自定义模板</el-button
                    >
                </div>
                <kr-excel-import
                    :url="'/data-source/upload'"
                    storeName="phoneList"
                    :params="formData1"
                    :checkout="checkout"
                    :hasTemplate="hasTemplate"
                    :cbUploaded="cbUploaded"
                    ref="excelImport"
                ></kr-excel-import>
            </div>
        </template>
        <template v-if="visible == 'model'">
            <div>
                <div>
                    当前选择的模板 : {{ selectedRow.name }}
                    <el-button
                        type="primary"
                        size="small"
                        style="margin-left: 20px"
                        @click="changVisible('upload')"
                        >确认选择</el-button
                    >
                    <el-button
                        type="primary"
                        size="small"
                        style="margin-left: 20px"
                        @click="changVisible('addModel')"
                        >自定义模板</el-button
                    >
                </div>
                <kr-table
                    :options="tableOptions"
                    :columns="columns"
                    :rows="templateTable"
                    :indexRow="false"
                    :showPagination="false"
                ></kr-table>
            </div>
        </template>
        <template v-if="visible == 'addModel'">
            <div class="template-create" :class="$style.inner">
                <div :class="$style.header">
                    <!-- 输入表单字段区 -->
                    <el-form
                        ref="ruleForm"
                        :model="formData"
                        :rules="rules"
                        :inline="true"
                        :class="$style.filter"
                    >
                        <el-form-item
                            label="模板名称: "
                            prop="name"
                            :class="$style.item"
                        >
                            <el-input
                                style="width:240px;"
                                placeholder="请输入模板名称"
                                v-model.trim="formData.name"
                                clearable
                            ></el-input>
                        </el-form-item>
                    </el-form>
                    <div :class="$style.btns">
                        <import-headers
                            v-model="importedHeaders"
                            @remove="handleRemoveFile"
                            @error="handleError"
                        ></import-headers>
                        <el-button
                            type="primary"
                            style="margin-left: 10px;"
                            @click="saveTemplate"
                            >仅保存模板</el-button
                        >
                        <el-button
                            type="primary"
                            @click="changVisible('upload')"
                            style="margin-left: 10px;"
                            >返回</el-button
                        >
                    </div>
                </div>

                <!-- 主体部分 -->
                <div :class="$style.body">
                    <!-- 操作区域 -->
                    <ul :class="$style.workbench" v-if="selectField">
                        <!-- 固定行 -->
                        <li v-for="item in selectField" :key="item.value">
                            <span
                                ><el-checkbox
                                    v-model="item.isChecked"
                                    style="margin-right: 10px"
                                ></el-checkbox
                                >{{ item.formattedText }}</span
                            >
                            <!--<div :class="$style.line">-->
                            <!--<i class="el-icon-arrow-right"></i>-->
                            <!--</div>-->
                            <div>
                                <el-select
                                    size="mini"
                                    style="width: 110px"
                                    placeholder="请选择类型"
                                    v-model="item.type"
                                    clearable
                                >
                                    <el-option
                                        v-for="it in options"
                                        :key="it.value"
                                        :label="it.label"
                                        :value="it.value"
                                    ></el-option>
                                </el-select>
                            </div>
                            <div>
                                <span>{{
                                    item.type === 0
                                        ? "小数精度"
                                        : item.type == 1
                                        ? "文本长度"
                                        : item.type == 2
                                        ? "日期类型"
                                        : ""
                                }}</span>
                                <el-input-number
                                    size="mini"
                                    style="margin-left: 5px"
                                    v-if="item.type === 0 || item.type == 1"
                                    v-model="item.limit"
                                    :min="0"
                                    controls-position="right"
                                    :placeholder="
                                        item.type === 0
                                            ? '小数精度'
                                            : '文本长度'
                                    "
                                ></el-input-number>
                                <el-select
                                    v-if="item.type == 2"
                                    size="mini"
                                    style="width: 100px;margin-left: 5px"
                                    placeholder="请选择类型"
                                    v-model="item.limit"
                                    clearable
                                >
                                    <el-option
                                        v-for="it in dateOptions"
                                        :key="it.value"
                                        :label="it.label"
                                        :value="it.value"
                                    ></el-option>
                                </el-select>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 表格预览 -->
                <div :class="$style.table">
                    <el-table
                        :header-cell-style="{ color: 'rgb(51, 51, 51);' }"
                        :data="importedHeaders.list"
                        empty-text="请上传话单"
                        border
                        :header-row-style="{ backgroundColor: '#f0f0f0' }"
                    >
                        <el-table-column
                            align="center"
                            v-for="item in importedHeaders.headers"
                            :key="item.symbol"
                            :prop="item.symbol"
                            :label="item.formattedText"
                            :show-overflow-tooltip="true"
                            :render-header="renderHeader"
                        ></el-table-column>
                    </el-table>
                </div>
            </div>
        </template>
        <template v-if="visible == 'detail'">
            <el-row>
                <div>
                    <el-button
                        type="primary"
                        @click="changVisible('model')"
                        style="margin: 10px 0"
                        >返回</el-button
                    >
                </div>
                <el-col
                    :soan="12"
                    v-for="(item, index) in templateDetailField"
                    :key="index"
                    style="padding: 10px 0px"
                >
                    <span>{{ item.columnName }}</span>
                    <span style="padding-left: 10px">
                        <el-select
                            size="mini"
                            style="width: 110px"
                            disabled=""
                            placeholder="请选择类型"
                            v-model="item.fieldType"
                            clearable
                        >
                            <el-option
                                v-for="it in options"
                                :key="it.value"
                                :label="it.label"
                                :value="it.value"
                            ></el-option> </el-select
                    ></span>
                    <span style="padding-left: 10px">
                        <el-input-number
                            size="mini"
                            style="margin-left: 5px"
                            v-if="
                                item.fieldType == '0' || item.fieldType == '1'
                            "
                            v-model="item.bridle"
                            disabled=""
                            controls-position="right"
                        ></el-input-number>
                        <el-select
                            v-if="item.fieldType == '2'"
                            size="mini"
                            style="width: 100px;margin-left: 5px"
                            disabled
                            v-model="item.bridle"
                            clearable
                        >
                            <el-option
                                v-for="it in dateOptions"
                                :key="it.value"
                                :label="it.label"
                                :value="it.value"
                            ></el-option>
                        </el-select>
                    </span>
                </el-col>
            </el-row>
        </template>
    </div>
</template>

<script>
import ImportHeaders from "./import";
import {
    saveTemplate,
    getTemplateList,
    delTemplate,
    templateDetail,
    defaultTemplatel,
    newTable
} from "@/api/zhfx/data-comparison.js";
export default {
    components: {
        ImportHeaders
    },
    data() {
        const shelf = this;
        return {
            formData1: {
                createGroup: "1",
                createUser: "1",
                plateId: "",
                tableName: "",
                type: "我的上传"
            },
            tableOptions: {
                "max-height": 500
            },
            templateTable: [],
            templateDetailField: [],
            systemHeaders: [
                { value: 1, name: "用户号码" },
                { value: 2, name: "主被叫" }
            ],
            rules: {
                name: [
                    {
                        required: true,
                        message: "模板名称不能为空",
                        trigger: "blur"
                    }
                ]
            },
            formData: {
                name: ""
            },
            importedHeaders: {},
            systemSelected: {},
            fileList: [],
            selectedId: "",
            selectedRow: "",
            url: "",
            visible: "upload",
            columns: [
                {
                    title: "序号",
                    key: "index",
                    width: "150",
                    component: {
                        render(h, row, option, index) {
                            const num = (index + 1).toString().padStart(3, " ");
                            return (
                                <el-radio
                                    value={shelf.selectedId}
                                    label={row.id}
                                    onInput={ev => {
                                        shelf.selectedRow = row;
                                        shelf.selectedId = ev;
                                    }}
                                    class="template-radio"
                                >
                                    {num}
                                </el-radio>
                            );
                        }
                    }
                },
                { title: "模板名称", key: "name" },
                // { title: "运营商", key: "operator", width: "100" },
                {
                    title: "模板内容",
                    key: "content",
                    showOverflowTooltip: true
                },
                {
                    title: "创建时间",
                    key: "createTime",
                    formatter(row) {
                        return shelf
                            .$dayjs(row.createTime)
                            .format("YYYY-MM-DD HH:mm:ss");
                    }
                },
                {
                    title: "操作",
                    key: "operate",
                    width: "200",
                    component: {
                        render(h, row) {
                            return (
                                <div>
                                    <el-button
                                        type="text"
                                        onClick={() => {
                                            shelf.templateDetail(row.id);
                                        }}
                                    >
                                        查看详情
                                    </el-button>
                                    <el-button
                                        type="text"
                                        onClick={() => {
                                            shelf.delTemplate(row.id);
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
            queryDataSourceTypeOptions: [],
            options: [
                { value: 0, label: "数字" },
                { value: 1, label: "文本" },
                { value: 2, label: "日期" }
            ],
            dateOptions: [
                { value: "yyyy-MM-dd HH:mm:ss", label: "yyyy-MM-dd HH:mm:ss" },
                { value: "yyyy/MM/dd HH:mm:ss", label: "yyyy/-MM/dd HH:mm:ss" },
                { value: "yyyy-MM-dd", label: "yyyy-MM-dd" },
                { value: "yyyy/MM/dd", label: "yyyy/-MM/dd" }
            ],
            selectField: []
        };
    },
    mounted() {
        this.getDefaultTemplatel();
        this.tableOptions["max-height"] = document.body.offsetHeight - 350;
    },
    computed: {},
    methods: {
        changVisible(title) {
            this.visible = title;
            if (title == "model") {
                this.getTemplateList();
            }
        },
        checkout() {
            let flag = false;
            if (!this.selectedRow.id) {
                this.$message.warning("请选择模板");
                return flag;
            }
            flag = true;
            return flag;
        },
        hasTemplate() {
            const flag = !!this.selectedRow.id;
            if (!flag) {
                this.$message.warning("请选择模板");
            }
            this.formData1.plateId = this.selectedRow.id;
            if (flag) {
                this.newTable("00");
            }
            return flag;
        },
        uploadFile(data) {
            const { file } = data;
            const formData = new FormData();
            formData.append("file", file);
            this.phoneImportUpload(formData);
        },

        beforeUpload(file) {
            const reg = /(.xls|.xlsx|.csv|.txt|.bcp)$/;
            const isExcel = reg.test(file.name);
            const isLt10M = file.size / 1024 / 1024 < 100;

            if (!isExcel) {
                this.$message.error("只能上传excel文件！");
            }

            if (!isLt10M) {
                this.$message.error("文件大小不能超过100M！");
            }

            return isExcel && isLt10M;
        },

        cbUploaded(next, data) {
            this.$message.success("上传成功");
            this.$emit("update", data);
            next();
        },

        // 移除文件勾子
        handleRemoveFile() {
            this.systemSelected = {};
        },
        // 读取 excel 报错
        handleError() {
            this.$message.alert("Excel文件内容格式错误！", {
                title: "错误",
                type: "error"
            });
        },

        renderHeader(h, { column }) {
            return h("span", {}, [column.label]);
        },

        saveTemplate() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    let list = [],
                        is = true;
                    this.selectField.map((value, index) => {
                        if (value.isChecked) {
                            if (value.type === "") {
                                is = false;
                                this.$message.warning("请设置选择字段的类型");
                                return;
                            }
                            if (value.limit === "") {
                                is = false;
                                this.$message.warning(
                                    "请设置选择字段的限制条件"
                                );
                                return;
                            }
                            list.push({
                                columnName: value.formattedText,
                                bridle: value.limit,
                                field: "field" + (index + 1),
                                fieldName: value.text,
                                fieldType: value.type,
                                resourceColumn: index
                            });
                        }
                    });
                    if (!is) {
                        return;
                    }
                    this.$refs.ruleForm.clearValidate();
                    this.changVisible("model");
                    saveTemplate({
                        createGroup: "1",
                        createUser: "1",
                        name: this.formData.name,
                        templateDetailDTOS: list
                    }).then(data => {
                        if (data.code == 0) {
                            this.formData.name = "";
                            this.importedHeaders = [];
                            this.selectField = [];
                            this.$message.success("保存成功");
                            this.getTemplateList();
                        }
                    });
                } else {
                    return false;
                }
            });
        },

        getTemplateList() {
            this.$emit("changeLoading", true);
            getTemplateList({
                createUser: "1",
                name: ""
            })
                .then(data => {
                    this.$emit("changeLoading", false);
                    this.templateTable = [];
                    if (data.code == 0 && data.data) {
                        this.templateTable = data.data;
                    }
                })
                .catch(() => {
                    this.$emit("changeLoading", false);
                });
        },

        delTemplate(id) {
            this.$msgbox({
                title: "警告",
                message: "是否确认删除",
                showCancelButton: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                confirmButtonClass: "confirmButton",
                customClass: "confirmDio"
            }).then(() => {
                delTemplate({ id }).then(data => {
                    if (data.code == 0) {
                        this.$message.success("删除成功");
                        this.getTemplateList();
                    }
                });
            });
        },
        templateDetail(id) {
            this.changVisible("detail");
            templateDetail({ id }).then(data => {
                this.templateDetailField = [];
                if (data.code == 0 && data.data) {
                    this.templateDetailField = data.data;
                }
            });
        },
        getDefaultTemplatel() {
            defaultTemplatel({
                createUser: "1"
            }).then(data => {
                if (data.code == 0) {
                    this.selectedRow = data.data;
                    this.selectedId = this.selectedRow.id;
                }
            });
        },

        newTable(type) {
            newTable({
                type: type
            }).then(data => {
                if (data.code == 0) {
                    this.formData1.tableName = data.data;
                }
            });
        },

        getType(type) {
            let text = "";
            this.options.map(value => {
                if (value.value == type) {
                    text = value.label;
                }
            });
            return text;
        },
        getLimit(type) {
            return type == 0
                ? "小数位精度"
                : type == 1
                ? "文本长度"
                : type == 2
                ? "日期格式"
                : "";
        }
    },
    watch: {
        importedHeaders() {
            this.selectField = [];
            if (
                this.importedHeaders.headers &&
                this.importedHeaders.headers.length
            ) {
                this.importedHeaders.headers.map(value => {
                    this.selectField.push({
                        ...value,
                        isChecked: false,
                        type: "",
                        limit: ""
                    });
                });
            }
        }
    }
};
</script>

<style lang="scss" module>
@import "@/styles/basic-color.scss";
.upload {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 10px;
    :global {
        .el-upload-dragger {
            width: 1100px;
            height: 500px;
            display: flex;
            &:hover {
                border-color: #00a8bc;
            }
        }
    }

    .inner {
        margin: auto;
        font-size: 14px;

        .text {
            color: #666;
        }

        .tip {
            color: #999;
            margin-top: 20px;
        }
    }
}
:global {
    .template-radio {
        .el-radio__label {
            display: inline-block;
            width: 40px;
        }
    }
}
.inner {
    padding: 25px;
    padding-bottom: 100px;
    background: #fff;

    .header {
        // margin-bottom: 20px;
        display: flex;
        justify-content: space-between;

        .delete {
            text-decoration: line-through;
            color: #999;
        }
        .selected {
            color: red;
        }
    }
}
:global {
    .template-create {
        min-height: 100%;
        .el-table th {
            background-color: #fafafa;
        }
    }
}
.filter {
    display: flex;
    .item {
        display: flex;
        align-items: center;
        &:not(:first-child) {
            margin-left: 40px;
        }
    }
}
.inner {
    padding: 25px;
    padding-bottom: 50px;
    background: #fff;
    .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        .btns {
            display: flex;
        }
    }
    .body {
        display: grid;
        grid-template-columns: auto 400px;
        grid-template-areas: "view info" "table table";
        .workbench {
            display: grid;
            grid-template-columns: 1fr 1fr;
            @media screen and (max-width: 1800px) {
                grid-template-columns: 1fr;
            }
            grid-auto-rows: 30px;
            gap: 10px 20px;
            padding: 0;
            justify-self: center;
            list-style: none;
            .optinalSelect {
                width: 120px;
            }
            li {
                // margin-bottom: 10px;
                display: grid;
                grid-template-columns: 160px 100px 260px;
                place-items: center;
                .required {
                    position: relative;
                    &:before {
                        position: absolute;
                        left: -10px;
                        content: "*";
                        color: red;
                        font-weight: bold;
                    }
                }
                .line {
                    position: relative;
                    width: 100%;
                    height: 0;
                    border: 1px solid $color-primary;
                    border-radius: 1px;
                    i {
                        padding: 2px;
                        position: absolute;
                        left: calc(50% - 10px);
                        top: calc(50% - 11px);
                        background-color: $color-primary;
                        border: 2px solid #fff;
                        border-radius: 50%;
                        color: #fff;
                        font-weight: bold;
                    }
                }
            }
        }

        .info {
            align-self: start;
            justify-self: self-end;
            width: 300px;
            border: 1px solid #e6a23c;
            p {
                padding: 5px 20px;
                background-color: rgba(253, 246, 236, 0.8);
                color: #e6a23c;
                border-bottom: 1px solid #e6a23c;
                font-weight: bold;
            }
            ul {
                padding-right: 20px;
                list-style: none;
                li {
                    position: relative;
                    line-height: 1.7;
                    text-align: justify;
                    &::before {
                        position: absolute;
                        top: 3px;
                        left: -24px;
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        background-color: #e6a23c;
                        border-radius: 50%;
                        text-align: center;
                        line-height: 20px;
                        content: attr(data-index);
                    }
                    span {
                        color: red;
                        font-weight: bold;
                    }
                }
            }
        }
    }
    .table {
        margin-top: 20px;
        overflow-x: auto;
    }
}
</style>
