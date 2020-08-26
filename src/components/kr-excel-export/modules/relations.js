// 六度关系分析列表
export const dimensionRelationConfig = {
    includes: ["level", "relation"],
    formatters: {
        level: {
            title: "路径层级"
        },
        relation: {
            title: "路径详情"
        }
    }
};

// 关系网分析、研判推演列表
export const networkRelationConfig = {
    includes: ["intimacy", "object", "dimension"],
    formatters: {
        intimacy: {
            title: "亲密度"
        },
        object: {
            title: "对象",
            width: 150
        },
        dimension: {
            title: "维度记录",
            width: 400
        }
    }
};

// 寻找情人分析列表
export const searchLoverkRelationConfig = {
    includes: ["suspiciousLevel", "name", "sex", "idCard", "suspiciousRecord"],
    formatters: {
        suspiciousLevel: {
            title: "可疑程度"
        },
        name: {
            title: "姓名"
        },
        sex: {
            title: "性别"
        },
        idCard: {
            title: "身份证号"
        },

        suspiciousRecord: {
            title: "可疑记录"
        }
    }
};

// 洗钱流出分析列表
export const moneyLaunderingRelationConfigOut = {
    includes: [
        "username",
        "card",
        "idCard",
        "cardType",
        "count",
        "amount",
        "percentage",
        "dealTime"
    ],
    formatters: {
        username: {
            title: "姓名"
        },
        card: {
            title: "卡号",
            width: 180
        },
        idCard: {
            title: "身份证号",
            width: 180
        },
        cardType: {
            title: "卡号类型"
        },
        amount: {
            title: "流出金额",
            width: 100
        },
        dealTime: {
            title: "流出金额时间",
            width: 180
        },
        percentage: {
            title: "流出百分比"
        },
        count: {
            title: "流出人数"
        }
    }
};

// 洗钱流入分析列表
export const moneyLaunderingRelationConfigIn = {
    includes: [
        "username",
        "card",
        "idCard",
        "cardType",
        "count",
        "amount",
        "percentage",
        "dealTime"
    ],
    formatters: {
        username: {
            title: "姓名"
        },
        card: {
            title: "卡号",
            width: 180
        },
        idCard: {
            title: "身份证号",
            width: 180
        },
        cardType: {
            title: "卡号类型"
        },
        amount: {
            title: "流入金额",
            width: 100
        },
        dealTime: {
            title: "流入金额时间",
            width: 180
        },
        percentage: {
            title: "流入百分比"
        },
        count: {
            title: "流入人数"
        }
    }
};

// 共同关系人分析列表
export const commonRelationConfig = {
    includes: ["num", "realName", "idCard", "detail"],
    formatters: {
        num: {
            title: "关联分析人数"
        },
        realName: {
            title: "共同联系人"
        },
        idCard: {
            title: "身份证号",
            width: 180
        },
        detail: {
            title: "关联分析人详情",
            width: 400
        }
    }
};

// 企业主要人员
export const colleagueConfig = {
    includes: ["xm", "zjhm", "tyshxydm", "ztmc", "zw"],
    formatters: {
        xm: { title: "姓名" },
        zjhm: { title: "证件号码", width: 140 },
        tyshxydm: { title: "统一社会信用代码", width: 140 },
        ztmc: { title: "主体名称", width: 120 },
        zw: { title: "职务" }
    }
};

// 同行-飞机
export const flyConfig = {
    includes: [
        "qfgzszdm",
        "ddhzszdm",
        "hbh",
        "hbrq",
        "hkgsdm",
        "lkxm",
        "lkzwxm",
        "dflkxm",
        "dflkzwxm",
        "xb",
        "zjhm",
        "lgsj",
        "lgrq",
        "lkzwxx",
        "dfxb",
        "dfzjhm",
        "dflkzwxx"
    ],
    formatters: {
        qfgzszdm: { title: "起飞港站三字代码", width: 120 },
        ddhzszdm: { title: "到达航站三字代码", width: 120 },
        hbh: { title: "航班号" },
        hbrq: { title: "航班日期" },
        hkgsdm: { title: "航空公司代码", width: 110 },
        lkxm: { title: "旅客姓名" },
        lkzwxm: { title: "旅客中文姓名", width: 110 },
        dflkxm: { title: "对方旅客姓名", width: 110 },
        dflkzwxm: { title: "对方旅客中文姓名", width: 120 },
        xb: { title: "性别" },
        zjhm: { title: "证件号码", width: 140 },
        lgsj: { title: "离港时间", width: 130 },
        lgrq: { title: "离港日期" },
        lkzwxx: { title: "旅客座位信息", width: 110 },
        dfxb: { title: "对方性别" },
        dfzjhm: { title: "对方证件号码", width: 140 },
        dflkzwxx: { title: "对方旅客座位信息", width: 120 }
    }
};

// 银行卡转账
export const transferConfig = {
    includes: [
        "mc",
        "ye",
        "zjhm",
        "jywdmc",
        "jysj",
        "jyrq",
        "jylx",
        "jylsh",
        "jyfsd",
        "jydsye",
        "jydfzjhm",
        "jydfxm",
        "jydfkh",
        "je",
        "bz",
        "cxkh",
        "jdbz"
    ],
    formatters: {
        mc: { title: "名称" },
        ye: { title: "交易余额" },
        zjhm: { title: "证件号码", width: 140 },
        jywdmc: { title: "交易网点名称", width: 110 },
        jysj: { title: "交易时间", width: 130 },
        jyrq: { title: "交易日期" },
        jylx: { title: "交易类型" },
        jylsh: { title: "交易流水号", width: 100 },
        jyfsd: { title: "交易发生地", width: 100 },
        jydsye: { title: "交易对手余额", width: 110 },
        jydfzjhm: { title: "对方证件号", width: 140 },
        jydfxm: { title: "交易对方名称", width: 110 },
        jydfkh: { title: "对方卡号", width: 140 },
        je: { title: "交易金额" },
        bz: { title: "币种" },
        cxkh: { title: "查询卡号", width: 140 },
        jdbz: { title: "借贷标志" }
    }
};

// 交易记录
export const transferRecordConfig = {
    includes: [
        "mc",
        "ye",
        "zjhm",
        "jywdmc",
        "jysj",
        "jyrq",
        "jylx",
        "jylsh",
        "jyfsd",
        "jydsye",
        "jydfzjhm",
        "jydfxm",
        "jydfkh",
        "je",
        "bz",
        "cxkh",
        "jdbz"
    ],
    formatters: {
        mc: { title: "名称" },
        ye: { title: "交易余额" },
        zjhm: { title: "证件号码", width: 140 },
        jywdmc: { title: "交易网点名称", width: 110 },
        jysj: { title: "交易时间", width: 130 },
        jyrq: { title: "交易日期" },
        jylx: { title: "交易类型" },
        jylsh: { title: "交易流水号", width: 100 },
        jyfsd: { title: "交易发生地", width: 100 },
        jydsye: { title: "交易对手余额", width: 110 },
        jydfzjhm: { title: "对方证件号", width: 140 },
        jydfxm: { title: "交易对方名称", width: 110 },
        jydfkh: { title: "对方卡号", width: 140 },
        je: { title: "交易金额" },
        bz: { title: "币种" },
        cxkh: { title: "查询卡号", width: 140 },
        jdbz: { title: "借贷标志" }
    }
};

// 同住
export const liveConfig = {
    includes: [
        "ldmc",
        "ldxxdz",
        "xm",
        "xb",
        "sfzmhm",
        "sfzmmc",
        "rzrq",
        "rzfh",
        "rzsj",
        "tfsj",
        "duration",
        "dfxm",
        "dfxb",
        "dfsfzmmc",
        "dfsfzmhm",
        "dfrzfh",
        "dfrzsj",
        "dftfsj",
        "dfduration"
    ],
    formatters: {
        ldmc: { title: "旅店名称" },
        ldxxdz: { title: "旅店详细地址", width: 150 },
        xm: { title: "姓名" },
        xb: { title: "性别" },
        sfzmhm: { title: "证件号码", width: 140 },
        sfzmmc: { title: "身份证明名称", width: 110 },
        rzrq: { title: "本方入住日期", width: 110 },
        rzfh: { title: "入住房号" },
        rzsj: { title: "入住时间", width: 130 },
        tfsj: { title: "退房时间", width: 130 },
        duration: { title: "住宿时长" },
        dfxm: { title: "对方名称" },
        dfxb: { title: "对方性别" },
        dfsfzmmc: { title: "对方身份证明名称", width: 130 },
        dfsfzmhm: { title: "对方证件号码", width: 140 },
        dfrzfh: { title: "对方入住房号", width: 110 },
        dfrzsj: { title: "对方入住时间", width: 130 },
        dftfsj: { title: "对方退房时间", width: 130 },
        dfduration: { title: "对方住宿时长", width: 110 }
    }
};

// 同行-大巴
export const busConfig = {
    includes: [
        "bccx",
        "bch",
        "fcrq",
        "bclx",
        "ccrxm",
        "dfccrxm",
        "ccrzjlx",
        "zjhm",
        "zwh",
        "cph",
        "cpjg",
        "qpsj",
        "mddmc",
        "sfczmc",
        "sfczbm",
        "dfzjhm",
        "dfzwh",
        "dfccrzjlx",
        "dfcpjg",
        "dfmddmc"
    ],
    formatters: {
        bccx: { title: "班车车型" },
        bch: { title: "班次号" },
        fcrq: { title: "发车日期" },
        bclx: { title: "班次类型" },
        ccrxm: { title: "乘车人姓名" },
        dfccrxm: { title: "对方乘车人姓名", width: 120 },
        ccrzjlx: { title: "乘车人证件类型", width: 120 },
        zjhm: { title: "证件号码", width: 140 },
        zwh: { title: "座位号" },
        cph: { title: "车牌号" },
        cpjg: { title: "车票价格" },
        qpsj: { title: "取票时间", width: 130 },
        mddmc: { title: "目的地名称", width: 140 },
        sfczmc: { title: "始发车站名称", width: 140 },
        sfczbm: { title: "始发车站编码", width: 110 },
        dfzjhm: { title: "对方证件号码", width: 140 },
        dfzwh: { title: "对方座位号", width: 110 },
        dfccrzjlx: { title: "对方乘车人证件类" },
        dfcpjg: { title: "对方车票价格", width: 110 },
        dfmddmc: { title: "对方目的地名称", width: 140 }
    }
};

// 同行-火车
export const trainConfig = {
    includes: [
        "ch",
        "fcrq",
        "xm",
        "zjhm",
        "zwh",
        "dz",
        "fz",
        "dfxm",
        "dfzjhm",
        "dfzwh",
        "dfcxh",
        "dfdz",
        "dffz"
    ],
    formatters: {
        ch: { title: "车号" },
        fcrq: { title: "发车日期" },
        xm: { title: "姓名" },
        zjhm: { title: "证件号码", width: 140 },
        zwh: { title: "座位号" },
        dz: { title: "到站" },
        fz: { title: "发站" },
        dfxm: { title: "对方姓名" },
        dfzjhm: { title: "对方证件号码", width: 140 },
        dfzwh: { title: "对方座位号", width: 100 },
        dfcxh: { title: "对方车厢号", width: 100 },
        dfdz: { title: "对方到站" },
        dffz: { title: "对方发站" }
    }
};

// 投资
export const investConfig = {
    includes: [
        "gdxm",
        "gdgb",
        "gdlx",
        "qymc",
        "zjhm",
        "zzhm",
        "tyshxydm",
        "rjczbl",
        "rjczbz",
        "rjczfs",
        "rjczrq",
        "rjczjewy",
        "rjczsj"
    ],
    formatters: {
        gdxm: { title: "股东姓名" },
        gdgb: { title: "股东国别" },
        gdlx: { title: "股东类型" },
        qymc: { title: "企业名称" },
        zjhm: { title: "证件号码", width: 140 },
        zzhm: { title: "证照号码", width: 140 },
        tyshxydm: { title: "统一社会信用代码", width: 140 },
        rjczbl: { title: "认缴出资比例", width: 110 },
        rjczbz: { title: "认缴出资币种", width: 110 },
        rjczfs: { title: "认缴出资方式", width: 110 },
        rjczrq: { title: "认缴出资日期", width: 110 },
        rjczjewy: { title: "认缴出资金额（万元）", width: 130 },
        rjczsj: { title: "认缴出资时间", width: 110 }
    }
};

// 同户
export const familyConfig = {
    includes: [
        "jggjdq",
        "xm",
        "xb",
        "zjhm",
        "zzxz",
        "csrq",
        "cym",
        "csdssx",
        "csdgjdq",
        "yhzgx",
        "ssssxq",
        "sspcsmc",
        "sg",
        "mz",
        "jgssxq",
        "jggjdq",
        "fwsc",
        "dfxm",
        "dfsg",
        "dfmz",
        "dfxb",
        "dfjgssxq",
        "dfyhzgx",
        "dfzjhm",
        "dfzzxz",
        "dfssssxq",
        "dfsspcsmc"
    ],
    formatters: {
        jggjdq: { title: "籍贯国家" },
        xm: { title: "姓名" },
        xb: { title: "性别" },
        zjhm: { title: "身份证号", width: 140 },
        zzxz: { title: "住址详址", width: 130 },
        csrq: { title: "出生日期" },
        cym: { title: "曾用名" },
        csdssx: { title: "出生地省市县", width: 120 },
        csdgjdq: { title: "出生地国家", width: 100 },
        yhzgx: { title: "与户主关系", width: 100 },
        ssssxq: { title: "所属省市县" },
        sspcsmc: { title: "所属派出所名称", width: 120 },
        sg: { title: "身高" },
        mz: { title: "民族" },
        jgssxq: { title: "籍贯省市县", width: 100 },
        fwsc: { title: "服务所处" },
        dfxm: { title: "对方姓名" },
        dfsg: { title: "对方身高" },
        dfmz: { title: "对方民族" },
        dfxb: { title: "对方性别" },
        dfjgssxq: { title: "对方籍贯省市县", width: 120 },
        dfyhzgx: { title: "对方与户主关系", width: 120 },
        dfzjhm: { title: "对方身份证号", width: 110 },
        dfzzxz: { title: "对方住址详址", width: 110 },
        dfssssxq: { title: "对方所属省市县", width: 120 },
        dfsspcsmc: { title: "对方所属派出所名称", width: 130 }
    }
};

// 同行
export const togetherConfig = {
    includes: [
        "name",
        "otherName",
        "travelType",
        "travelNumber",
        "travelDate",
        "licenseNumber",
        "startSite",
        "sex",
        "idCard",
        "seat",
        "otherSex",
        "otherIdCard",
        "otherSeat"
    ],
    formatters: {
        name: { title: "姓名" },
        otherName: { title: "对方姓名" },
        travelType: { title: "交通类型" },
        travelNumber: { title: "交通班次" },
        travelDate: { title: "交通日期" },
        licenseNumber: { title: "交通工具号" },
        startSite: { title: "始发地点" },
        sex: { title: "性别" },
        idCard: { title: "证件号码" },
        seat: { title: "座次信息" },
        otherSex: { title: "对方性别" },
        otherIdCard: { title: "对方证件号码" },
        otherSeat: { title: "对方座次信息" }
    }
};

// 交易异常
export const transferException = {
    includes: [
        "mc",
        "jydfxm",
        "je",
        "exceptionType",
        "ye",
        "zjhm",
        "jywdmc",
        "jysj",
        "jyrq",
        "jylx",
        "jylsh",
        "jyfsd",
        "jydsye",
        "jydfzjhm",
        "jydfkh",
        "bz",
        "cxkh",
        "jdbz"
    ],
    formatters: {
        mc: { title: "名称" },
        jydfxm: { title: "交易对方名称" },
        je: { title: "交易金额" },
        exceptionType: { title: "异常类型" },
        ye: { title: "交易余额" },
        zjhm: { title: "证件号码" },
        jywdmc: { title: "交易网点名称" },
        jysj: { title: "交易时间" },
        jyrq: { title: "交易日期" },
        jylx: { title: "交易类型" },
        jylsh: { title: "交易流水号" },
        jyfsd: { title: "交易发生地" },
        jydsye: { title: "交易对手余额" },
        jydfzjhm: { title: "对方证件号" },
        jydfkh: { title: "对方卡号" },
        bz: { title: "币种" },
        cxkh: { title: "查询卡号" },
        jdbz: { title: "借贷标志" }
    }
};

// 洗钱特征分析 图标详情

export const moneyLaunderingRelationConfigDetail = {
    includes: [
        "username",
        "card",
        "idCard",
        "cardType",
        "amount",
        "percentage",
        "dealTime"
    ],
    formatters: {
        username: {
            title: "对方姓名"
        },
        card: {
            title: "对方账号",
            width: 180
        },
        idCard: {
            title: "对方身份证号",
            width: 180
        },
        cardType: {
            title: "账号类型"
        },
        amount: {
            title: "交易金额",
            width: 100
        },
        dealTime: {
            title: "交易时间",
            width: 180
        },
        percentage: {
            title: "流入百分比"
        }
    }
};
