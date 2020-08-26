<template>
    <el-upload
        action="/"
        accept=".xlsx, .xls, ,.csv"
        ref="upload"
        class="template-import"
        :auto-upload="false"
        :on-change="fileChange"
        :file-list="fileList"
        :on-remove="
            () => {
                $emit('input', {});
                $emit('remove');
            }
        "
    >
        <el-button type="primary" :loading="loading">上传文件</el-button>
    </el-upload>
</template>

<script>
import XLSX from "xlsx";
import isUTF8 from "./isUTF8";
export default {
    name: "import_excel_headers",
    props: {
        value: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            loading: false,
            fileList: []
        };
    },
    methods: {
        // 文件改变
        fileChange(fileObj, fileList) {
            if (fileList.length > 1) {
                fileList.splice(0, 1);
            }
            this.$emit("input", {});
            const file = fileObj.raw;
            const regCsv = /(.csv)$/;
            const isCsv = regCsv.test(file.name);
            // const blob = file.slice(0);
            if (isCsv) {
                return this.readCsvFile(file);
            }
            const reader = new FileReader();
            reader.onload = ev => {
                const data = ev.target.result;

                const workbook = XLSX.read(data, {
                    type: "array",
                    cellHTML: false
                    // raw: true
                });
                try {
                    const excelData = this.dealExcel(workbook);
                    this.$emit("input", excelData);
                } catch (err) {
                    console.log(err);
                    this.$refs.upload.clearFiles();
                    this.$emit("error");
                }
            };
            reader.onloadstart = () => {
                this.loading = true;
            };
            reader.onloadend = () => {
                this.loading = false;
            };
            reader.onerror = () => {
                this.$message.error("加载文件失败！");
            };
            reader.readAsArrayBuffer(file);
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
                _this.dealCsv(data.replace(/"/g, ""));
            };
            reader.onloadstart = () => {
                this.loading = true;
            };
            reader.onloadend = () => {
                this.loading = false;
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
        dealCsv(csvData) {
            try {
                let dataList = csvData.split("\n");
                let headers = dataList.shift().split(",");
                // const list = [{}, {}, {}, {}, {}];
                headers = headers.map((text, index) => {
                    const symbol = XLSX.utils.encode_col(index);
                    return {
                        formattedText: `${text}(${symbol})`,
                        index,
                        symbol,
                        text
                    };
                });
                let list = dataList.splice(0, 5).map(line => {
                    let obj = {};
                    line.split(",").map((val, index) => {
                        const symbol = XLSX.utils.encode_col(index);
                        obj[symbol] = val;
                    });
                    return obj;
                });
                this.$emit("input", { headers, list });
            } catch (err) {
                console.log(err);
                this.$refs.upload.clearFiles();
                this.$emit("error");
            }
        },
        dealExcel(workbook) {
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const range = XLSX.utils.decode_range(sheet["!ref"]);
            const cols = range.e.c - range.s.c;
            const colsArr = [];
            const list = [{}, {}, {}, {}, {}];
            for (let i = 0; i <= cols; i++) {
                const symbol = XLSX.utils.encode_col(i);
                const text = sheet[symbol + "1"] ? sheet[symbol + "1"].v : "";
                // 三元运算符是为了添加表头为空时的兼容及解决表中有额外空白数据时的报错
                colsArr.push({
                    formattedText: `${text} (${symbol})`,
                    symbol: symbol,
                    text,
                    index: i
                });
                for (let i = 0, len = list.length; i < len; i++) {
                    const index = symbol + (i + 2);
                    list[i][symbol] = sheet[index] ? sheet[index].v : "";
                }
            }
            return { headers: colsArr, list };
        }
    }
};
</script>

<style lang="scss">
.template-import {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row-reverse;
    align-items: center;

    .el-upload-list {
        margin-right: 20px;
    }
    .el-upload-list__item:first-child {
        margin-top: 0;
    }
}
</style>
