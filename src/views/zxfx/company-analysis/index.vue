<template>
    <imp-panel :isBackground="false">
        <div slot="body" class="page">
            <div class="title">
                <el-button v-if="tab == 'detail'" @click="tab = 'main'"
                    >返回上一级</el-button
                >
                <el-button type="primary" style="float: right">导出</el-button>
            </div>
            <div class="content">
                <template v-if="tab == 'main'">
                    <div class="info box-shadow">
                        <div class="img">
                            <img :src="person" width="100%" height="100%" />
                        </div>
                        <div class="detail">
                            <div class="name">
                                张三（关联公司10家）
                                <span
                                    style="font-weight: normal;font-size: 14px"
                                    >男 28岁 1991/01/02
                                </span>
                            </div>
                            <el-row :gutter="20">
                                <el-col :span="8" class="row"
                                    >身份证号：</el-col
                                >
                                <el-col :span="8" class="row"
                                    >出生日期：</el-col
                                >
                                <el-col :span="8" class="row"
                                    >婚姻状态：</el-col
                                >
                                <el-col :span="8" class="row">民族：</el-col>
                                <el-col :span="8" class="row"
                                    >工作单位：</el-col
                                >
                                <el-col :span="8" class="row"
                                    >现任职务：</el-col
                                >
                                <el-col :span="8" class="row"
                                    >政治面貌：</el-col
                                >
                                <el-col :span="8" class="row"
                                    >入党时间：</el-col
                                >
                                <el-col :span="8" class="row">籍贯：</el-col>
                            </el-row>
                        </div>
                    </div>
                    <div class="legal-person box-shadow">
                        <kr-section-title
                            title="法人(4)"
                            class="section-title box-shadow"
                            :size="18"
                        ></kr-section-title>
                        <div class="legal-person-detail">
                            <div>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <div class="detail-row">
                                            <div class="proportion">
                                                <el-progress
                                                    type="circle"
                                                    :width="80"
                                                    :format="format"
                                                    :stroke-width="14"
                                                    :percentage="25"
                                                ></el-progress>
                                            </div>
                                            <div class="legal-person-info">
                                                <div class="text">
                                                    <span class="tip legal"
                                                        >法人代表</span
                                                    >
                                                    <span
                                                        class="company"
                                                        @click="tab = 'detail'"
                                                        >某公司名称</span
                                                    >
                                                </div>
                                                <el-row>
                                                    <el-col :span="12"
                                                        >成立时间：2018-05-23</el-col
                                                    >
                                                    <el-col :span="12"
                                                        >注册资本：100万元</el-col
                                                    >
                                                </el-row>
                                                <div>
                                                    <kr-icon
                                                        icon="icon-weizhi"
                                                        class="weizhi"
                                                    ></kr-icon>
                                                    四川省 成都市 天府软件园
                                                    某栋 某单元 某号
                                                </div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="detail-row">
                                            <div class="proportion">
                                                <el-progress
                                                    type="circle"
                                                    :width="80"
                                                    :format="format"
                                                    :stroke-width="14"
                                                    :percentage="25"
                                                ></el-progress>
                                            </div>
                                            <div class="legal-person-info">
                                                <div class="text">
                                                    <span class="tip legal"
                                                        >法人代表</span
                                                    >
                                                    <span class="name"
                                                        >某公司名称</span
                                                    >
                                                </div>
                                                <el-row>
                                                    <el-col :span="12"
                                                        >成立时间：2018-05-23</el-col
                                                    >
                                                    <el-col :span="12"
                                                        >注册资本：100万元</el-col
                                                    >
                                                </el-row>
                                                <div>
                                                    <kr-icon
                                                        icon="icon-weizhi"
                                                        class="weizhi"
                                                    ></kr-icon>
                                                    四川省 成都市 天府软件园
                                                    某栋 某单元 某号
                                                </div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="detail-row">
                                            <div class="proportion">
                                                <el-progress
                                                    type="circle"
                                                    :width="80"
                                                    :format="format"
                                                    :stroke-width="14"
                                                    :percentage="25"
                                                ></el-progress>
                                            </div>
                                            <div class="legal-person-info">
                                                <div class="text">
                                                    <span class="tip legal"
                                                        >法人代表</span
                                                    >
                                                    <span class="company"
                                                        >某公司名称</span
                                                    >
                                                </div>
                                                <el-row>
                                                    <el-col :span="12"
                                                        >成立时间：2018-05-23</el-col
                                                    >
                                                    <el-col :span="12"
                                                        >注册资本：100万元</el-col
                                                    >
                                                </el-row>
                                                <div>
                                                    <kr-icon
                                                        icon="icon-weizhi"
                                                        class="weizhi"
                                                    ></kr-icon>
                                                    四川省 成都市 天府软件园
                                                    某栋 某单元 某号
                                                </div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="detail-row">
                                            <div class="proportion">
                                                <el-progress
                                                    type="circle"
                                                    :width="80"
                                                    :format="format"
                                                    :stroke-width="14"
                                                    :percentage="25"
                                                ></el-progress>
                                            </div>
                                            <div class="legal-person-info">
                                                <div class="text">
                                                    <span class="tip legal"
                                                        >法人代表</span
                                                    >
                                                    <span class="company"
                                                        >某公司名称</span
                                                    >
                                                </div>
                                                <el-row>
                                                    <el-col :span="12"
                                                        >成立时间：2018-05-23</el-col
                                                    >
                                                    <el-col :span="12"
                                                        >注册资本：100万元</el-col
                                                    >
                                                </el-row>
                                                <div>
                                                    <kr-icon
                                                        icon="icon-weizhi"
                                                        class="weizhi"
                                                    ></kr-icon>
                                                    四川省 成都市 天府软件园
                                                    某栋 某单元 某号
                                                </div>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                    <div class="legal-person box-shadow">
                        <kr-section-title
                            title="股东(4)"
                            class="section-title box-shadow"
                            :size="18"
                        ></kr-section-title>
                        <div class="legal-person-detail">
                            <div>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <div class="detail-row">
                                            <div class="proportion">
                                                <el-progress
                                                    type="circle"
                                                    :width="80"
                                                    :format="format"
                                                    :stroke-width="14"
                                                    :percentage="25"
                                                ></el-progress>
                                            </div>
                                            <div class="legal-person-info">
                                                <div class="text">
                                                    <span class="tip shares"
                                                        >参股企业</span
                                                    >
                                                    <span class="company"
                                                        >某公司名称</span
                                                    >
                                                </div>
                                                <el-row>
                                                    <el-col :span="12"
                                                        >成立时间：2018-05-23</el-col
                                                    >
                                                    <el-col :span="12"
                                                        >注册资本：100万元</el-col
                                                    >
                                                </el-row>
                                                <div>
                                                    <kr-icon
                                                        icon="icon-weizhi"
                                                        class="weizhi"
                                                    ></kr-icon>
                                                    四川省 成都市 天府软件园
                                                    某栋 某单元 某号
                                                </div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="detail-row">
                                            <div class="proportion">
                                                <el-progress
                                                    type="circle"
                                                    :width="80"
                                                    :format="format"
                                                    :stroke-width="14"
                                                    :percentage="25"
                                                ></el-progress>
                                            </div>
                                            <div class="legal-person-info">
                                                <div class="text">
                                                    <span class="tip legal"
                                                        >法人代表</span
                                                    >
                                                    <span class="company"
                                                        >某公司名称</span
                                                    >
                                                </div>
                                                <el-row>
                                                    <el-col :span="12"
                                                        >成立时间：2018-05-23</el-col
                                                    >
                                                    <el-col :span="12"
                                                        >注册资本：100万元</el-col
                                                    >
                                                </el-row>
                                                <div>
                                                    <kr-icon
                                                        icon="icon-weizhi"
                                                        class="weizhi"
                                                    ></kr-icon>
                                                    四川省 成都市 天府软件园
                                                    某栋 某单元 某号
                                                </div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="detail-row">
                                            <div class="proportion">
                                                <el-progress
                                                    type="circle"
                                                    :width="80"
                                                    :format="format"
                                                    :stroke-width="14"
                                                    :percentage="25"
                                                ></el-progress>
                                            </div>
                                            <div class="legal-person-info">
                                                <div class="text">
                                                    <span class="tip legal"
                                                        >法人代表</span
                                                    >
                                                    <span class="company"
                                                        >某公司名称</span
                                                    >
                                                </div>
                                                <el-row>
                                                    <el-col :span="12"
                                                        >成立时间：2018-05-23</el-col
                                                    >
                                                    <el-col :span="12"
                                                        >注册资本：100万元</el-col
                                                    >
                                                </el-row>
                                                <div>
                                                    <kr-icon
                                                        icon="icon-weizhi"
                                                        class="weizhi"
                                                    ></kr-icon>
                                                    四川省 成都市 天府软件园
                                                    某栋 某单元 某号
                                                </div>
                                            </div>
                                        </div>
                                    </el-col>
                                    <el-col :span="12">
                                        <div class="detail-row">
                                            <div class="proportion">
                                                <el-progress
                                                    type="circle"
                                                    :width="80"
                                                    :format="format"
                                                    :stroke-width="14"
                                                    :percentage="25"
                                                ></el-progress>
                                            </div>
                                            <div class="legal-person-info">
                                                <div class="text">
                                                    <span class="tip legal"
                                                        >法人代表</span
                                                    >
                                                    <span class="company"
                                                        >某公司名称</span
                                                    >
                                                </div>
                                                <el-row>
                                                    <el-col :span="12"
                                                        >成立时间：2018-05-23</el-col
                                                    >
                                                    <el-col :span="12"
                                                        >注册资本：100万元</el-col
                                                    >
                                                </el-row>
                                                <div>
                                                    <kr-icon
                                                        icon="icon-weizhi"
                                                        class="weizhi"
                                                    ></kr-icon>
                                                    四川省 成都市 天府软件园
                                                    某栋 某单元 某号
                                                </div>
                                            </div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </div>
                    <div class="legal-person box-shadow">
                        <kr-section-title
                            title="曾担任高管"
                            class="section-title box-shadow"
                            :size="18"
                        ></kr-section-title>
                        <div class="legal-person-detail">
                            <kr-table
                                style="margin-top: 5px"
                                :rows="executiveTable"
                                :columns="executiveColumns"
                                :showPagination="false"
                            ></kr-table>
                        </div>
                    </div>
                    <div class="legal-person box-shadow">
                        <kr-section-title
                            title="实际控制权（4）"
                            class="section-title box-shadow"
                            :size="18"
                        ></kr-section-title>
                        <div class="legal-person-detail">
                            <kr-table
                                style="margin-top: 5px"
                                :rows="shareTable"
                                :columns="shareColumns"
                                :showPagination="false"
                            ></kr-table>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="info box-shadow">
                        <div class="img">
                            <img :src="person" width="100%" height="100%" />
                        </div>
                        <div class="detail">
                            <div class="name">
                                四川省某某科技有限责任公司
                            </div>
                            <el-row :gutter="20">
                                <el-col :span="8" class="row">法人：</el-col>
                                <el-col :span="8" class="row"
                                    >成立时间：</el-col
                                >
                                <el-col :span="8" class="row"
                                    >注册资本：</el-col
                                >
                                <el-col :span="8" class="row"
                                    >省份地区：</el-col
                                >
                                <el-col :span="8" class="row"
                                    >联系电话：</el-col
                                >
                                <el-col :span="8" class="row"
                                    >公司邮箱：</el-col
                                >
                                <el-col :span="24" class="row"
                                    >公司简介：</el-col
                                >
                            </el-row>
                        </div>
                    </div>
                    <div class="legal-person box-shadow">
                        <kr-section-title
                            title="企业基本信息"
                            class="section-title box-shadow"
                            :size="18"
                        ></kr-section-title>
                        <div class="legal-person-detail">
                            <div style="margin-top: 20px;font-size: 14px">
                                公司背景
                            </div>
                            <kr-table-info-news
                                :data="companyData"
                                :columnsGroup="2"
                            >
                            </kr-table-info-news>
                        </div>
                    </div>
                    <div class="legal-person box-shadow">
                        <kr-section-title
                            title="实际控制权（4）"
                            class="section-title box-shadow"
                            :size="18"
                        ></kr-section-title>
                        <div class="legal-person-detail">
                            <kr-table
                                style="margin-top: 5px"
                                :rows="shareTable"
                                :columns="shareColumns"
                                :showPagination="false"
                            ></kr-table>
                        </div>
                    </div>
                    <div class="legal-person box-shadow">
                        <kr-section-title
                            title="实际控制权（4）"
                            class="section-title box-shadow"
                            :size="18"
                        ></kr-section-title>
                        <div class="legal-person-detail">
                            <kr-table
                                style="margin-top: 5px"
                                :rows="shareTable"
                                :columns="shareColumns"
                                :showPagination="false"
                            ></kr-table>
                        </div>
                    </div>
                    <div class="legal-person box-shadow">
                        <kr-section-title
                            title="实际控制权（4）"
                            class="section-title box-shadow"
                            :size="18"
                        ></kr-section-title>
                        <div class="legal-person-detail">
                            <kr-table
                                style="margin-top: 5px"
                                :rows="shareTable"
                                :columns="shareColumns"
                                :showPagination="false"
                            ></kr-table>
                        </div>
                    </div>
                    <div class="legal-person box-shadow">
                        <kr-section-title
                            title="实际控制权（4）"
                            class="section-title box-shadow"
                            :size="18"
                        ></kr-section-title>
                        <div class="legal-person-detail">
                            <kr-table
                                style="margin-top: 5px"
                                :rows="shareTable"
                                :columns="shareColumns"
                                :showPagination="false"
                            ></kr-table>
                        </div>
                    </div>
                    <div class="legal-person box-shadow">
                        <kr-section-title
                            title="实际控制权（4）"
                            class="section-title box-shadow"
                            :size="18"
                        ></kr-section-title>
                        <div class="legal-person-detail">
                            <kr-table
                                style="margin-top: 5px"
                                :rows="shareTable"
                                :columns="shareColumns"
                                :showPagination="false"
                            ></kr-table>
                        </div>
                    </div>
                    <div class="legal-person box-shadow">
                        <kr-section-title
                            title="实际控制权（4）"
                            class="section-title box-shadow"
                            :size="18"
                        ></kr-section-title>
                        <div class="legal-person-detail">
                            <kr-table
                                style="margin-top: 5px"
                                :rows="shareTable"
                                :columns="shareColumns"
                                :showPagination="false"
                            ></kr-table>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <kr-choose
            :all="all"
            slot="aside"
            warnTitle
            :isCheckbox="false"
            @startAnalysis="startAnalysis"
            :isPerson="true"
            :hsaRadio="false"
        ></kr-choose>
    </imp-panel>
</template>

<script>
import { getSAObjectByDABH } from "api/zhfx/relation-network.js";
import person from "@/assets/image/dqfxry.png";
export default {
    name: "index",
    data() {
        const shelf = this;
        return {
            tab: "main",
            all: [],
            person: person,
            executiveTable: [],
            executiveColumns: [
                {
                    title: "企业名称",
                    key: "name",
                    component: {
                        render(h, row) {
                            return (
                                <div>
                                    <el-button type="text">
                                        四川省某某科技有限责任公司
                                    </el-button>
                                </div>
                            );
                        }
                    }
                },
                {
                    title: "职位",
                    key: "type"
                },
                {
                    title: "法人",
                    key: "source"
                },
                {
                    title: "成立时间",
                    key: "createTime",
                    formatter(row) {
                        return shelf
                            .$dayjs(row.createTime)
                            .format("YYYY-MM-DD HH:mm:ss");
                    }
                },
                {
                    title: "注册资本",
                    key: "source"
                },
                {
                    title: "省份地区",
                    key: "source"
                },
                {
                    title: "经验状态",
                    key: "source"
                }
            ],
            shareTable: [],
            shareColumns: [
                {
                    title: "控股企业",
                    key: "name",
                    component: {
                        render(h, row) {
                            return (
                                <div>
                                    <el-button type="text">
                                        四川省某某科技有限责任公司
                                    </el-button>
                                </div>
                            );
                        }
                    }
                },
                {
                    title: "投资占比",
                    key: "type"
                },
                {
                    title: "投资链",
                    key: "source"
                }
            ],
            companyData: [
                {
                    field: "name",
                    label: "法人",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "身份证号",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "注册资本",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "成立日期",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "实缴资本",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "工商注册号",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "统一社会信用代码",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "纳税人识别号",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "公司类型",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "核准日期",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "营业期限",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "组织机构代码",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "人员规模",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "经营状态",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "行业",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "登记机关",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "纳税人资质",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "参保人数",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "曾用名",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "英文名称",
                    value: "张三"
                },
                {
                    field: "name",
                    label: "英文名称",
                    value: "张三",
                    valueOfColumn: 3
                },
                {
                    field: "name",
                    label: "经营范围",
                    value: "张三",
                    valueOfColumn: 3
                }
            ],
            companyCells: []
        };
    },
    created() {
        getSAObjectByDABH(this.$route.query).then(res => {
            res.code === 0 ? (this.all = res.data.saxxModels) : "";
        });
    },
    methods: {
        startAnalysis(person) {
            console.log(person);
        },
        format(percentage) {
            return `占比${percentage}%`;
        }
    }
};
</script>

<style scoped lang="scss">
@import "@/styles/basic-color.scss";
.page {
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    box-shadow: none;
    border: none;
    border-radius: 0px;
    .title {
        height: 50px;
        padding: 9px 0px;
    }
    .content {
        height: calc(100% - 50px);
        overflow-y: auto;
        font-size: 14px;
        .info {
            height: 200px;
            padding: 20px 20px;
            background-color: #fff;
            display: flex;
            .img {
                width: 120px;
            }
            .detail {
                padding: 0 20px;
                flex: 1;
                .name {
                    font-size: 16px;
                    font-weight: 500;
                    height: 60px;
                    line-height: 60px;
                }
                .row {
                    height: 30px;
                    line-height: 30px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        .legal-person {
            margin-top: 20px;
            background-color: #fff;
            .legal-person-detail {
                padding: 0px 20px 20px 20px;
                .detail-row {
                    margin-top: 20px;
                    border: 1px solid gainsboro;
                    display: flex;
                    padding: 10px;
                    .proportion {
                        width: 90px;
                    }
                    .legal-person-info {
                        flex: 1;
                        line-height: 25px;
                    }
                }
            }
        }
        .section-title {
            height: 50px;
            line-height: 50px;
        }
    }
    .text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .tip {
        display: inline-block;
        padding: 0px 5px;
        border-radius: 3px;
        line-height: 20px;
        margin-right: 20px;
    }
    .company {
        color: $color-primary;
        cursor: pointer;
    }
    .weizhi {
        color: $color-primary;
    }
    .legal {
        border: 1px solid $worning-level-1;
        color: $worning-level-1;
        background-color: transparentize($worning-level-1, 0.7);
    }
    .shares {
        border: 1px solid $color-warning;
        color: $color-warning;
        background-color: transparentize($color-warning, 0.7);
    }
}
</style>
