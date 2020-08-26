export const columnsList = [
    {
        type: "企业主要人员",
        columns: [
            {
                title: "姓名",
                key: "xm"
            },
            { title: "证件号码", key: "zjhm", width: 180 },
            {
                title: "统一社会信用代码",
                key: "tyshxydm",
                width: 180
            },
            { title: "主体名称", key: "ztmc" },
            { title: "职务", key: "zw" }
        ]
    },
    {
        type: "同行-飞机",
        columns: [
            {
                title: "起飞港站三字代码",
                key: "qfgzszdm",
                width: 140
            },
            {
                title: "到达航站三字代码",
                key: "ddhzszdm",
                width: 140
            },
            { title: "航班号", key: "hbh" },
            { title: "航班日期", key: "hbrq", width: 100 },
            { title: "航空公司代码", key: "hkgsdm", width: 110 },
            { title: "旅客姓名", key: "lkxm" },
            { title: "旅客中文姓名", key: "lkzwxm", width: 110 },
            { title: "对方旅客姓名", key: "dflkxm", width: 110 },
            {
                title: "对方旅客中文姓名",
                key: "dflkzwxm",
                width: 140
            },
            { title: "性别", key: "xb" },
            { title: "证件号码", key: "zjhm", width: 180 },
            { title: "离港时间", key: "lgsj", width: 180 },
            { title: "离港日期", key: "lgrq", width: 100 },
            { title: "旅客座位信息", key: "lkzwxx", width: 110 },

            { title: "对方性别", key: "dfxb" },
            { title: "对方证件号码", key: "dfzjhm", width: 180 },
            {
                title: "对方旅客座位信息",
                key: "dflkzwxx",
                width: 140
            }
        ]
    },
    {
        type: "同行-大巴",
        columns: [
            {
                title: "班车车型",
                key: "bccx"
            },
            { title: "班次号", key: "bch", width: 100 },
            { title: "发车日期", key: "fcrq", width: 100 },
            { title: "班次类型", key: "bclx" },
            { title: "乘车人姓名", key: "ccrxm", width: 100 },
            { title: "对方乘车人姓名", key: "dfccrxm", width: 120 },
            { title: "乘车人证件类型", key: "ccrzjlx", width: 120 },
            { title: "证件号码", key: "zjhm", width: 180 },
            { title: "座位号", key: "zwh" },
            { title: "车牌号", key: "cph" },
            { title: "车票价格", key: "cpjg" },
            { title: "取票时间", key: "qpsj" },
            { title: "目的地名称", key: "mddmc", width: 100 },
            { title: "始发车站名称", key: "sfczmc", width: 110 },
            { title: "始发车站编码", key: "sfczbm", width: 110 },
            { title: "对方证件号码", key: "dfzjhm", width: 180 },
            { title: "对方座位号", key: "dfzwh", width: 100 },
            {
                title: "对方乘车人证件类",
                key: "dfccrzjlx",
                width: 140
            },
            { title: "对方车票价格", key: "dfcpjg", width: 110 },
            { title: "对方目的地名称", key: "dfmddmc", width: 120 }
        ]
    },

    {
        type: "同行-火车",
        columns: [
            {
                title: "车号",
                key: "ch"
            },
            { title: "发车日期", key: "fcrq", width: 100 },
            { title: "姓名", key: "xm" },
            { title: "证件号码", key: "zjhm", width: 180 },
            { title: "座位号", key: "zwh" },
            { title: "到站", key: "dz" },
            { title: "发站", key: "fz" },
            { title: "对方姓名", key: "dfxm" },
            { title: "对方证件号码", key: "dfzjhm", width: 180 },
            { title: "对方座位号", key: "dfzwh", width: 100 },
            { title: "对方车厢号", key: "dfcxh", width: 100 },
            { title: "对方到站", key: "dfdz" },
            { title: "对方发站", key: "dffz" }
        ]
    },
    {
        type: "银行卡转账",
        columns: [
            {
                title: "名称",
                key: "mc",
                width: 120
            },
            { title: "交易余额", key: "ye" },
            { title: "交易金额", key: "je" },
            { title: "证件号码", key: "zjhm", width: 180 },
            { title: "交易网点名称", key: "jywdmc", width: 120 },
            { title: "交易时间", key: "jysj", width: 180 },
            { title: "交易日期", key: "jyrq", width: 100 },
            { title: "交易类型", key: "jylx" },
            { title: "交易流水号", key: "jylsh", width: 100 },
            { title: "交易发生地", key: "jyfsd", width: 100 },
            { title: "交易对手余额", key: "jydsye", width: 110 },
            { title: "对方证件号", key: "jydfzjhm", width: 180 },
            { title: "交易对方名称", key: "jydfxm", width: 110 },
            { title: "对方卡号", key: "jydfkh", width: 180 },
            { title: "币种", key: "bz" },
            { title: "查询卡号", key: "cxkh", width: 180 },
            { title: "借贷标志", key: "jdbz" }
        ]
    },
    {
        type: "通话记录",
        columns: [
            {
                title: "名称",
                key: "mc"
            },
            { title: "交易余额", key: "ye" },
            { title: "证件号码", key: "zjhm", width: 180 },
            { title: "交易网点名称", key: "jywdmc", width: 120 },
            { title: "交易时间", key: "jysj", width: 180 },
            { title: "交易日期", key: "jyrq", width: 100 },
            { title: "交易类型", key: "jylx" },
            { title: "交易流水号", key: "jylsh", width: 100 },
            { title: "交易发生地", key: "jyfsd", width: 100 }
        ]
    },
    {
        type: "交易记录",
        columns: [
            {
                title: "名称",
                key: "mc"
            },
            { title: "交易对方名称", key: "jydfxm", width: 110 },
            { title: "交易金额", key: "je" },
            { title: "交易余额", key: "ye" },
            { title: "证件号码", key: "zjhm", width: 180 },
            { title: "交易网点名称", key: "jywdmc", width: 120 },
            { title: "交易时间", key: "jysj", width: 180 },
            { title: "交易日期", key: "jyrq", width: 100 },
            { title: "交易类型", key: "jylx" },
            { title: "交易流水号", key: "jylsh", width: 100 },
            { title: "交易发生地", key: "jyfsd", width: 100 },
            { title: "交易对手余额", key: "jydsye", width: 110 },
            { title: "对方证件号", key: "jydfzjhm", width: 180 },
            { title: "对方卡号", key: "jydfkh", width: 180 },
            { title: "币种", key: "bz" },
            { title: "查询卡号", key: "cxkh", width: 180 },
            { title: "借贷标志", key: "jdbz" }
        ]
    },
    {
        type: "同住",
        columns: [
            { title: "旅店名称", key: "ldmc" },
            { title: "旅店详细地址", key: "ldxxdz", width: 180 },
            {
                title: "姓名",
                key: "xm"
            },
            { title: "性别", key: "xb" },
            { title: "证件号码", key: "sfzmhm", width: 180 },
            { title: "身份证明名称", key: "sfzmmc", width: 110 },
            { title: "本方入住日期", key: "rzrq", width: 110 },
            { title: "入住房号", key: "rzfh" },
            { title: "入住时间", key: "rzsj", width: 155 },
            { title: "退房时间", key: "tfsj", width: 155 },
            { title: "住宿时长", key: "duration" },
            { title: "对方名称", key: "dfxm" },
            { title: "对方性别", key: "dfxb" },
            {
                title: "对方身份证明名称",
                key: "dfsfzmmc",
                width: 140
            },
            { title: "对方证件号码", key: "dfsfzmhm", width: 180 },
            { title: "对方入住房号", key: "dfrzfh", width: 110 },
            {
                title: "对方入住时间",
                key: "dfrzsj",
                width: 155
            },
            {
                title: "对方退房时间",
                key: "dftfsj",
                width: 155
            },
            { title: "对方住宿时长", key: "dfduration", width: 110 }
        ]
    },
    {
        type: "同户",
        columns: [
            { title: "籍贯国家", key: "jggjdq" },
            {
                title: "姓名",
                key: "xm"
            },
            { title: "性别", key: "xb" },
            { title: "身份证号", key: "zjhm", width: 180 },
            { title: "住址详址", key: "zzxz" },
            { title: "出生日期", key: "csrq" },
            { title: "曾用名", key: "cym" },
            { title: "出生地省市县", key: "csdssx", width: 110 },
            { title: "出生地国家", key: "csdgjdq", width: 100 },
            { title: "与户主关系", key: "yhzgx", width: 100 },
            { title: "所属省市县", key: "ssssxq", width: 100 },
            { title: "所属派出所名称", key: "sspcsmc", width: 120 },
            { title: "身高", key: "sg" },
            { title: "民族", key: "mz" },
            { title: "籍贯省市县", key: "jgssxq", width: 100 },
            { title: "籍贯国家", key: "jggjdq" },
            { title: "服务所处", key: "fwsc" },
            { title: "对方姓名", key: "dfxm" },
            { title: "对方身高", key: "dfsg" },
            { title: "对方民族", key: "dfmz" },
            { title: "对方性别", key: "dfxb" },
            {
                title: "对方籍贯省市县",
                key: "dfjgssxq",
                width: 120
            },
            { title: "对方与户主关系", key: "dfyhzgx", width: 120 },
            { title: "对方身份证号", key: "dfzjhm", width: 180 },
            { title: "对方住址详址", key: "dfzzxz", width: 110 },
            {
                title: "对方所属省市县",
                key: "dfssssxq",
                width: 120
            },
            {
                title: "对方所属派出所名称",
                key: "dfsspcsmc",
                width: 150
            }
        ]
    },
    {
        type: "投资",
        columns: [
            {
                title: "股东姓名",
                key: "gdxm"
            },
            { title: "股东国别", key: "gdgb" },
            { title: "股东类型", key: "gdlx" },
            { title: "企业名称", key: "qymc" },
            { title: "证件号码", key: "zjhm", width: 180 },
            { title: "证照号码", key: "zzhm" },
            {
                title: "统一社会信用代码",
                key: "tyshxydm",
                width: 180
            },
            { title: "认缴出资比例", key: "rjczbl", width: 110 },
            { title: "认缴出资币种", key: "rjczbz", width: 110 },
            { title: "认缴出资方式", key: "rjczfs", width: 110 },
            { title: "认缴出资日期", key: "rjczrq", width: 110 },
            {
                title: "认缴出资金额（万元）",
                key: "rjczjewy",
                width: 180
            },
            { title: "认缴出资时间", key: "rjczsj", width: 110 }
        ]
    },
    {
        type: "通话异常",
        columns: [
            { title: "异常类型", key: "yclx" },
            {
                title: "呼叫类型",
                key: "hjlx"
            },
            {
                title: "通话时间",
                key: "thsj"
            },
            {
                title: "通话时长",
                key: "thsc"
            },
            {
                title: "分析人姓名",
                key: "fxrxm"
            },
            {
                title: "身份证号",
                key: "sfzh",
                width: 180
            },
            {
                title: "电话号码",
                key: "dhhm"
            },
            {
                title: "归属地",
                key: "gsd"
            }
        ]
    },
    {
        type: "交易异常",
        columns: [
            {
                title: "名称",
                key: "mc"
            },
            { title: "交易对方名称", key: "jydfxm", width: 110 },
            { title: "交易金额", key: "je" },
            { title: "异常类型", key: "exceptionType", width: 230 },
            { title: "交易余额", key: "ye" },
            { title: "证件号码", key: "zjhm", width: 180 },
            { title: "交易网点名称", key: "jywdmc", width: 120 },
            {
                title: "交易时间",
                sortable: "custom",
                key: "jysj",
                width: 180
            },
            {
                title: "交易日期",
                sortable: "custom",
                key: "jyrq",
                width: 110
            },
            { title: "交易类型", key: "jylx" },
            { title: "交易流水号", key: "jylsh", width: 100 },
            { title: "交易发生地", key: "jyfsd", width: 100 },
            { title: "交易对手余额", key: "jydsye", width: 110 },
            { title: "对方证件号", key: "jydfzjhm", width: 180 },
            { title: "对方卡号", key: "jydfkh", width: 180 },
            { title: "币种", key: "bz" },
            { title: "查询卡号", key: "cxkh", width: 180 },
            { title: "借贷标志", key: "jdbz" }
        ]
    },
    {
        type: "同行",
        columns: [
            { title: "姓名", key: "name" },
            {
                title: "对方姓名",
                key: "otherName"
            },
            {
                title: "交通类型",
                key: "travelType"
            },
            {
                title: "交通班次",
                key: "travelNumber",
                width: 120
            },
            {
                title: "交通日期",
                key: "travelDate",
                width: 100
            },
            {
                title: "交通工具号",
                key: "licenseNumber",
                width: 110
            },
            {
                title: "始发地点",
                key: "startSite"
            },
            {
                title: "性别",
                key: "sex"
            },
            {
                title: "证件号码",
                key: "idCard",
                width: 180
            },

            {
                title: "座次信息",
                key: "seat"
            },

            {
                title: "对方性别",
                key: "otherSex"
            },
            {
                title: "对方证件号码",
                key: "otherIdCard",
                width: 180
            },
            {
                title: "对方座次信息",
                key: "otherSeat",
                width: 120
            }
        ]
    }
];
