/**
 * Created by liao on 2018/10/29.
 */

//获取时间 yyyy-mm-dd
export function getDay(date) {
    var time = new Date(date);
    var strYear = time.getFullYear();
    var strMonth = time.getMonth() + 1;
    var strDay = time.getDate();
    if (strMonth < 10) {
        strMonth = "0" + strMonth;
    }
    if (strDay < 10) {
        strDay = "0" + strDay;
    }
    var str = strYear + "-" + strMonth + "-" + strDay;
    return str;
}
//获取时间 yyyy-mm-dd 00:00:00
export function getTime(date) {
    var time = new Date(date);
    var strYear = time.getFullYear();
    var strMonth = time.getMonth() + 1;
    var strDay = time.getDate();
    var strHours = time.getHours();
    var strMinutes = time.getMinutes();
    var strSeconds = time.getSeconds();
    if (strMonth < 10) {
        strMonth = "0" + strMonth;
    }
    if (strDay < 10) {
        strDay = "0" + strDay;
    }
    if (strHours < 10) {
        strHours = "0" + strHours;
    }
    if (strMinutes < 10) {
        strMinutes = "0" + strMinutes;
    }
    if (strSeconds < 10) {
        strSeconds = "0" + strSeconds;
    }
    var str =
        strYear +
        "-" +
        strMonth +
        "-" +
        strDay +
        " " +
        strHours +
        ":" +
        strMinutes +
        ":" +
        strSeconds;
    return str;
}
//获取一天的时间
export function getYestoday(date) {
    var yesterday_milliseconds = date.getTime() - 1000 * 60 * 60 * 24;
    var yesterday = new Date();
    yesterday.setTime(yesterday_milliseconds);

    // var strYear = yesterday.getFullYear();
    // var strDay = yesterday.getDate();
    // var strMonth = yesterday.getMonth() + 1;
    // if (strMonth < 10) {
    //   strMonth = "0" + strMonth;
    // }
    return [date, new Date(yesterday)];
}
//获取一周的时间
export function getWeek(date) {
    var yesterday_milliseconds = date.getTime() - 1000 * 60 * 60 * 24 * 7;
    var yesterday = new Date();
    yesterday.setTime(yesterday_milliseconds);

    // var strYear = yesterday.getFullYear();
    // var strDay = yesterday.getDate();
    // var strMonth = yesterday.getMonth() + 1;
    // if (strMonth < 10) {
    //   strMonth = "0" + strMonth;
    // }
    // var datastr = strYear + "-" + strMonth + "-" + strDay;
    return [date, new Date(yesterday)];
}
//获得上个月在昨天这一天的日期
export function getLastMonthYestdy(date) {
    var daysInMonth = new Array(
        [0],
        [31],
        [28],
        [31],
        [30],
        [31],
        [30],
        [31],
        [31],
        [30],
        [31],
        [30],
        [31]
    );
    var strYear = date.getFullYear();
    var strDay = date.getDate();
    var strMonth = date.getMonth() + 1;
    if (strYear % 4 == 0 && strYear % 100 != 0) {
        daysInMonth[2] = 29;
    }
    if (strMonth - 1 == 0) {
        strYear -= 1;
        strMonth = 12;
    } else {
        strMonth -= 1;
    }
    strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
    if (strMonth < 10) {
        strMonth = "0" + strMonth;
    }
    if (strDay < 10) {
        strDay = "0" + strDay;
    }
    var datastr =
        strYear +
        "-" +
        strMonth +
        "-" +
        strDay +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
    return [date, new Date(datastr)];
}
//获得三月前在昨天这一天的日期
export function getLastThreeMonthYestdy(date) {
    var daysInMonth = new Array(
        [0],
        [31],
        [28],
        [31],
        [30],
        [31],
        [30],
        [31],
        [31],
        [30],
        [31],
        [30],
        [31]
    );
    var strYear = date.getFullYear();
    var strDay = date.getDate();
    var strMonth = date.getMonth() + 1;
    if (strYear % 4 == 0 && strYear % 100 != 0) {
        daysInMonth[2] = 29;
    }
    if (strMonth - 3 == 0) {
        strYear -= 3;
        strMonth = 12;
    } else {
        strMonth -= 3;
    }
    strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
    if (strMonth < 10) {
        strMonth = "0" + strMonth;
    }
    if (strDay < 10) {
        strDay = "0" + strDay;
    }
    var datastr =
        strYear +
        "-" +
        strMonth +
        "-" +
        strDay +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
    return [date, new Date(datastr)];
}

//获得三月前在昨天这一天的日期
export function getLastSixMonthYestdy(date) {
    var daysInMonth = new Array(
        [0],
        [31],
        [28],
        [31],
        [30],
        [31],
        [30],
        [31],
        [31],
        [30],
        [31],
        [30],
        [31]
    );
    var strYear = date.getFullYear();
    var strDay = date.getDate();
    var strMonth = date.getMonth() + 1;
    if (strYear % 4 == 0 && strYear % 100 != 0) {
        daysInMonth[2] = 29;
    }
    if (strMonth - 6 == 0) {
        strYear -= 6;
        strMonth = 12;
    } else {
        strMonth -= 6;
    }
    strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
    if (strMonth < 10) {
        strMonth = "0" + strMonth;
    }
    if (strDay < 10) {
        strDay = "0" + strDay;
    }
    var datastr =
        strYear +
        "-" +
        strMonth +
        "-" +
        strDay +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
    return [date, new Date(datastr)];
}

//获得上一年在昨天这一天的日期
export function getLastYearYestdy(date) {
    var strYear = date.getFullYear() - 1;
    var strDay = date.getDate();
    var strMonth = date.getMonth() + 1;
    if (strMonth < 10) {
        strMonth = "0" + strMonth;
    }
    if (strDay < 10) {
        strDay = "0" + strDay;
    }
    var datastr =
        strYear +
        "-" +
        strMonth +
        "-" +
        strDay +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
    return [date, new Date(datastr)];
}
