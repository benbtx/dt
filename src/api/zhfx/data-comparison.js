import axios from "../../utils/axios";

//获取数据源
export const getSystemData = args =>
    axios({
        method: "post",
        url: "/data-source/queryDataSource",
        data: args
    });

//分享数据源
export const shareDataSource = args =>
    axios({
        method: "post",
        url: "/data-source/shareDataSource",
        params: args
    });

//数据源类型
export const getDataSourceType = () =>
    axios({
        method: "post",
        url: "/data-source/queryDataSourceType"
    });

//保存模板
export const saveTemplate = args =>
    axios({
        method: "post",
        url: "/import-template/save",
        data: args
    });
//模板列表
export const getTemplateList = args =>
    axios({
        method: "post",
        url: "/import-template/list",
        params: args
    });

//删除模板
export const delTemplate = args =>
    axios({
        method: "post",
        url: "/import-template/delete",
        params: args
    });

//模板明细
export const templateDetail = args =>
    axios({
        method: "post",
        url: "/import-template/detail",
        params: args
    });

//默认模板
export const defaultTemplatel = args =>
    axios({
        method: "post",
        url: "/import-template/recent",
        params: args
    });

//生产Table
export const asyncNewTable = async args => {
    return await axios({
        method: "post",
        url: "/nextId/get",
        params: args
    });
};

export const newTable = args =>
    axios({
        method: "post",
        url: "/nextId/get",
        params: args
    });
//删除数据源
export const deleteDataSource = args =>
    axios({
        method: "post",
        url: "/data-source/delete",
        params: args
    });

//查询数据源字段
export const getFieldList = args =>
    axios({
        method: "post",
        url: "/data-source/queryFieldList",
        params: args
    });

//查询数据源明细
export const getDataSourceDetail = args =>
    axios({
        method: "post",
        url: "/data-source/queryTmpDataSourceList",
        data: args
    });

// 导出暂存数据源明细
export const exportTmpDataSource = args =>
    axios({
        method: "post",
        url: "/data-source/exportTmpDataSourceList",
        data: args,
        responseType: "blob"
    });

//导出
export const exportSaveAs = args =>
    axios({
        method: "get",
        url: "/data-source/exportSaveAs",
        params: args,
        responseType: "arraybuffer"
    });

//开始比对
export const doCompare = args =>
    axios({
        method: "post",
        url: "/data/compare/doCompare",
        data: args
    });

//另存为
export const saveAs = args =>
    axios({
        method: "post",
        url: "/data-source/saveAsDataSource",
        params: args
    });
//保存模型
export const saveModel = args =>
    axios({
        method: "post",
        url: "/compare-model/save",
        data: args
    });

//查询模型
export const getModelList = args =>
    axios({
        method: "post",
        url: "/compare-model/query",
        data: args
    });

//查询模型
export const deleteModel = args =>
    axios({
        method: "post",
        url: "/compare-model/delete",
        params: args
    });

//查询模型
export const renameModel = args =>
    axios({
        method: "post",
        url: "/compare-model/rename",
        params: args
    });

//共享模型
export const shareModel = args =>
    axios({
        method: "post",
        url: "/compare-model/share",
        params: args
    });
