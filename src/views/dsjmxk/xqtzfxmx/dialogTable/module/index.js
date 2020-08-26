import dayjs from "dayjs";

export const options = {
    border: true
};
const card = {
    label: "对方账号",
    prop: "card",
    width: "170",
    formatter: function(row) {
        return row.card || "-";
    }
};

const username = {
    label: "对方姓名",
    prop: "username",
    formatter: function(row) {
        return row.username || "-";
    }
};
const idCard = {
    label: "对方身份证号",
    // width: "160",
    prop: "idCard",
    formatter: function(row) {
        return row.idCard || "-";
    }
};
const amount = {
    label: "交易金额",
    prop: "amount",
    // width: "120",
    sortable: "custom",
    formatter: function(row) {
        return `￥${row.amount}` || "-";
    }
};
const percentage = {
    label: "分流百分比",
    prop: "percentage",
    // width: "120",
    sortable: "custom",
    formatter: function(row) {
        return row.percentage || "-";
    }
};
const accountType = {
    label: "账号类型",
    prop: "accountType",
    formatter: function(row) {
        return row.accountType || "-";
    }
};
const dealTime = {
    label: "交易时间",
    prop: "dealTime",
    sortOrders: ["descending", null, "ascending"],
    // width: "150",
    sortable: "custom",
    formatter: function(row) {
        if (row.dealTime) {
            return dayjs(new Date(row.dealTime)).format("YYYY-MM-DD HH:mm:ss");
        } else {
            return "-";
        }
    }
};
export const DialogTable = () => {
    //弹出框表格列配置
    let config = [
        username,
        idCard,
        card,
        accountType,
        amount,
        dealTime,
        percentage
    ];
    return config;
};
