<template>
    <div>
        <el-upload
            v-show="excelData.length === 0"
            drag
            :auto-upload="false"
            :action="url"
            :class="$style.upload"
            accept=".xlsx, .xls, .csv"
            :disabled="loading"
            ref="upload"
            :on-change="handleChange"
            :data="params"
            :on-error="handleError"
            :on-success="handleSuccess"
            :http-request="uploadFile"
            :multiple="multiple"
        >
            <!-- <div :class="$style.cover"></div> -->
            <div :class="$style.inner">
                <kr-icon
                    class="upload-icon"
                    :icon="loading ? 'el-icon-loading' : 'el-icon-upload'"
                    :size="100"
                ></kr-icon>
                <div :class="$style.text" v-show="!loading">
                    点击或将文件拖拽到这里上传
                </div>
                <div :class="$style.tip" v-show="!loading" slot="tip">
                    支持扩展名：.xls .xlsx .csv
                </div>
            </div>
        </el-upload>
        <table-list
            v-show="excelData.length !== 0"
            :body="excelData"
            :header="excelHeader"
        >
            <template slot="footer">
                <div :class="$style.footer">
                    <el-button
                        :class="$style.item"
                        size="large"
                        @click="handleClickCancel"
                        >{{ loaded ? "返回" : "取消" }}</el-button
                    >
                    <el-button
                        v-show="!loaded"
                        :class="$style.item"
                        size="large"
                        type="primary"
                        @click="submitFile"
                        :loading="posting"
                        >导入</el-button
                    >
                </div>
            </template>
        </table-list>
        <!--<el-dialog-->
            <!--title="导入中"-->
            <!--:visible.sync="visible"-->
            <!--:show-close="false"-->
            <!--width="30%"-->
        <!--&gt;-->
            <!--<div>-->
                <!--<div>-->
                    <!--正在导入:{{-->
                        <!--fileList[uploadIndex] ? fileList[uploadIndex].name : ""-->
                    <!--}}-->
                <!--</div>-->
                <!--<div>导入文件进度:{{ uploadIndex }}/{{ fileList.length }}</div>-->
            <!--</div>-->
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button @click="cancel">终止上传</el-button>-->
            <!--</span>-->
        <!--</el-dialog>-->
    </div>
</template>

<script>
import XLSX from "xlsx";
import isUTF8 from "./isUTF8";
import TableList from "./table-list";
import axios from "@/utils/axios";

export default {
    name: "kr_excel_import",

    components: { TableList },
    props: {
        url: {
            type: String,
            required: true
        },
        storeName: {
            type: String,
            required: true
        },
        checkout: {
            type: Function,
            default: () => true
        },
        params: {
            type: Object,
            default() {
                return {};
            }
        },
        cbUploaded: {
            type: Function,
            default: () => {}
        },
        //多文件上传
        multiple: {
            type: Boolean,
            default: false
        },
        //多文件模式下文件依次上传
        oneByOne: {
            type: Boolean,
            default: false
        },

        // 表头
        sheetHeader: {
            type: Array,
            default() {
                return [];
            }
        },
        hasTemplate: {
            type: Function,
            default: () => true
        },
        // 自定义校验方法，需要选择话单模板
        f: {
            type: Function,
            defult: () => true
        }
    },
    data() {
        return {
            loaded: false,
            posting: false,
            visible: false,
            formdataList: [],
            fileList: [],
            uploadIndex: 0,
            isPreventUpload: false,
            excelHeader: [],
            excelData: [],
            loading: false
        };
    },
    computed: {},
    beforeDestroy() {
        this.handleClickCancel();
    },
    methods: {
        // 撤销预览和上传
        handleClickCancel() {
            this.excelHeader = [];
            this.excelData = [];
            this.$refs.upload.clearFiles();
            this.loaded = false;
            this.formdataList = [];
            this.fileList = [];
            this.uploadIndex = 0;
        },

        // 上传文件
        uploadFile(param) {
            if (this.oneByOne && this.multiple) {
                const formdata = new FormData();
                formdata.append("file", param.file);
                for (let key in this.params) {
                    if (this.params[key]) {
                        formdata.append(key, this.params[key]);
                    }
                }
                this.formdataList.push(formdata);
                if (this.formdataList.length == this.fileList.length) {
                    this.visible = true;
                    this.oneByOneUpload(0);
                }
            } else {
                this.allUpload(param);
            }
        },

        handleChange(param, paramList) {
            // 验证是否已选择话单模板(导入时话单是才验证)
            if (!this.hasTemplate()) {
                this.$refs.upload.clearFiles();
                return;
            }
            this.fileList = paramList;
            this.isPreventUpload = false;
            const file = !this.multiple ? param.raw : paramList[0].raw;
            const regCsv = /(.csv)$/;
            const regExcel = /(.xls|.xlsx)$/;
            const isExcel = regExcel.test(file.name);
            const isCsv = regCsv.test(file.name);
            const fileSizeLimit = file.size / 1024 / 1024 < 50;
            let isFirstFile = true;
            if (this.multiple && param.uid != paramList[0].uid) {
                isFirstFile = false;
            }
            if (!(isExcel || isCsv)) {
                this.$message.error("只能上传excel/csv文件！");
                this.$refs.upload.clearFiles();
                return false;
            }
            if (!fileSizeLimit) {
                this.$message.error("单个文件大小不能超过50M！");
                this.$refs.upload.clearFiles();
                return false;
            }
            if (isExcel && isFirstFile) {
                return this.readExcelFile(file, this.excelDataFormatter);
            }
            if (isCsv && isFirstFile) {
                return this.readCsvFile(file);
            }
        },

        // 手动上传
        submitFile() {
            if (this.checkout()) {
                this.posting = true;
                this.$refs.upload.submit();
            }
        },

        // 上传成功
        handleSuccess(data, isover) {
            // this.$message.success("上传成功！");
            this.loaded = true;
            this.posting = false;
            this.cbUploaded(this.handleClickCancel, data);
            // if (isover) {
            //     this.loaded = true;
            //     this.posting = false;
            //     this.cbUploaded(this.handleClickCancel, data);
            // }
        },

        // 上传失败
        handleError() {
            // this.$message.error("上传失败！");
            this.posting = false;
        },
        readCsvFile(file, fileType) {
            // 加载csv文件 ,第一次进入函数先验证文件编码,所以默认不传
            // 第二次则传入对应的文件类型进行读取
            // readCsv(file);
            let _this = this;
            const reader = new FileReader();
            reader.onload = function(ev) {
                let data = ev.target.result;
                if (!fileType) {
                    data = new Uint8Array(data);
                    if (isUTF8(data)) {
                        return _this.readCsvFile(file, "utf-8");
                    } else {
                        return _this.readCsvFile(file, "gb2312");
                    }
                }

                const [excelHeader, excelData] = _this.csv2list(
                    data.replace(/"/g, "")
                );
            };

            reader.onerror = () => {
                this.$message.error("加载文件失败！");
            };

            if (fileType) {
                // 如果传入fileType 直接按fileType读取
                // 否则先验证类型
                reader.readAsText(file, fileType);
            } else {
                reader.readAsArrayBuffer(file);
            }
        },
        // 加载 excel 文件
        readExcelFile(file, callback) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                const data = ev.target.result;
                const workbook = XLSX.read(data, { type: "binary" });
                if (callback) {
                    callback(workbook);
                }
            };
            reader.onloadstart = () => {};
            reader.onloadend = () => {};
            reader.onerror = () => {
                this.$message.error("加载文件失败！");
            };

            reader.readAsBinaryString(file);
        },

        // 处理读取到的表格数据
        excelDataFormatter(workbook) {
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const readData = XLSX.utils.sheet_to_csv(sheet);
            const [excelHeader, excelData] = this.csv2list(readData);

            this.excelHeader = excelHeader;
            this.excelData = excelData;
        },

        // csv 数据转换整理为表格数据
        csv2list(csv) {
            let arr = csv.split("\n");
            if (!arr[arr.length - 1]) {
                // 部分csv数据切割后会加一行空行，如果数据行最后一行为空则pop()
                arr.pop();
            }
            let header = [];
            if (this.sheetHeader.length) {
                // 外部表头
                header = this.sheetHeader;
            } else {
                header = arr.shift().split(",");
                // 按模板导入的方式来处理，不管表头是否为空都将整个excel导入
                // if (header[header.length - 1] === "") {
                //   // 如果最后列表头为空则 pop
                //   header.pop();
                // }
                // 给每个字段分配一个 key
                header = header.map((item, index) => {
                    return {
                        title: item,
                        key: XLSX.utils.encode_col(index)
                    };
                });
            }

            // 构造数据
            const body = arr
                .filter(item => {
                    // 过滤空行
                    return item.replace(/,/g, "").trim() !== "";
                })
                .map(item => {
                    const temp = item.split(",");
                    const obj = {};
                    header.map((it, i) => {
                        obj[it.key] = temp[i];
                    });
                    return obj;
                });

            return [header, body];
        },

        //一起上传
        allUpload(param) {
            const formdata = new FormData();
            formdata.append("file", param.file);
            for (let key in this.params) {
                if (this.params[key]) {
                    formdata.append(key, this.params[key]);
                }
            }
            axios
                .postFile(this.url, formdata)
                .then(res => {
                    if (res.code === 0) {
                        if (!this.multiple) {
                            this.handleSuccess(res.data, true);
                        }
                    } else {
                        this.handleError();
                    }
                })
                .catch(err => {
                    this.handleError(err);
                });
        },

        //排队上传
        oneByOneUpload(index) {
            this.uploadIndex = index;
            axios
                .postFile(this.url, this.formdataList[index])
                .then(res => {
                    if (res.code === 0) {
                        if (
                            this.formdataList[index + 1] &&
                            !this.isPreventUpload
                        ) {
                            this.handleSuccess(res.data);
                            this.oneByOneUpload(index + 1);
                        } else {
                            this.handleSuccess(res.data, true);
                            this.visible = false;
                            this.isPreventUpload = false;
                        }
                    } else {
                        this.handleError();
                        if (
                            this.formdataList[index + 1] &&
                            !this.isPreventUpload
                        ) {
                            this.handleSuccess(res.data);
                            this.oneByOneUpload(index + 1);
                        } else {
                            this.handleSuccess(res.data, true);
                            this.visible = false;
                            this.isPreventUpload = false;
                        }
                    }
                })
                .catch(err => {
                    this.handleError(err);
                });
        },

        cancel() {
            this.visible = false;
            this.isPreventUpload = false;
            this.handleClickCancel();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/styles/basic-color.scss";
.upload-icon {
    color: $color-primary;
}
</style>

<style lang="scss" module>
.upload {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    margin-top: 10px;
    :global {
        .el-upload {
            width: 100%;
            .el-upload-dragger {
                width: 100%;
                height: 60vh;
                display: flex;
                &:hover {
                    border-color: #00a8bc;
                }
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
.footer {
    margin-top: 20px;
    text-align: center;
    .item {
        margin: 0 20px;
    }
}
</style>
