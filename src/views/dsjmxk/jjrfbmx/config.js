export const exportConfig = {
    // 数据导出配置
    includes: [
        "holiday",
        "jysj",
        "mc",
        "cxkh",
        "jydfxm",
        "jydfkh",
        "jydfzjhm",
        "je",
        "summary",
        "tradeWay",
        "jywdmc"
    ],
    formatters: {
        holiday: {
            title: "节假日"
            // formatter: val => val || "-"
        },
        jysj: {
            title: "交易时间",
            width: 170
        },

        mc: {
            title: "户主姓名",
            width: 90
        },

        cxkh: {
            title: "户主账号",
            width: 170
        },

        jydfxm: {
            title: "对方姓名",
            width: 90
        },

        jydfkh: {
            title: "对方账号",
            width: 170
        },

        jydfzjhm: {
            title: "身份证",
            width: 170
        },

        je: {
            title: "金额",
            width: 110
        },

        summary: {
            title: "摘要"
        },

        tradeWay: {
            title: "交易方式"
        },

        jywdmc: {
            title: "交易网点"
        }
    }
};
export const columns = [
    // 表格列配置
    {
        title: "节假日",
        key: "holiday",
        formatter(row) {
            return row.holiday || "-";
        }
    },
    {
        title: "交易时间",
        key: "jysj",
        width: 170,
        sortable: "custom"
    },
    {
        title: "户主姓名",
        key: "mc",
        width: 90
    },
    { title: "户主账号", key: "cxkh", width: 170 },
    // { title: "账号标签", key: "clpp1" },
    { title: "对方姓名", key: "jydfxm", width: 90 },
    { title: "对方账号", key: "jydfkh", width: 170 },
    { title: "身份证", key: "jydfzjhm", width: 170 },
    {
        title: "金额",
        width: 110,
        key: "je",
        formatter(row) {
            return row.jylx + " " + row.je;
        },
        sortable: "custom"
    },
    { title: "摘要", key: "summary" },
    { title: "交易方式", key: "tradeWay" },
    { title: "交易网点", key: "jywdmc" }
];
export const amountOptions = [
    { value: "0-5000", text: "￥5,000以内" },
    { value: "5000-10000", text: "￥5,000~10,000" },
    { value: "10000-50000", text: "￥10,000~￥50,000" },
    { value: "50000-100000", text: "￥50,000~￥100,000" },
    { value: "100000-", text: "100,000￥以上" }
];
