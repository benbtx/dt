<template>
    <div class="dimension" v-if="visible">
        <template v-if="isSystem">
            <div class="dimension_top">
                <div class="detail_top_text">系统扩展</div>
                <i class="el-icon-close" @click="close"></i>
            </div>
            <div class="dimension_mid">
                <kr-section-title title="分析维度选择"></kr-section-title>
                <div class="mid_options">
                    <button
                        v-for="item in optionsData"
                        :key="item.id"
                        :class="{
                            options_selected: item.selected && item.num,
                            disabled: item.num === 0
                        }"
                        @click="getConditions(item)"
                    >
                        {{ item.name }}({{ item.num }})
                    </button>
                </div>
            </div>
            <div class="dimension_bottom">
                <kr-section-title title="维度条件设置"></kr-section-title>
                <el-scrollbar
                    v-if="ruleForm.conditions.length == 0 ? false : true"
                    style="height: 160px;"
                    wrap-style="overflow-x: hidden;"
                >
                    <div class="bottom_conditions">
                        <el-form :model="ruleForm" ref="ruleForm">
                            <el-form-item
                                v-for="(item, index) in ruleForm.conditions"
                                :key="index"
                                :prop="`conditions.${index}.value`"
                                :rules="rules"
                                :label="item.placeholder"
                            >
                                <el-input
                                    v-model="item.value"
                                    :placeholder="item.placeholder"
                                ></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-scrollbar>
            </div>
        </template>
        <template v-else v-show="showHandle">
            <div class="dimension_top">
                <div class="detail_top_text">手动扩展</div>
                <i class="el-icon-close" @click="close"></i>
            </div>
            <div class="bottom_conditions" style="padding: 0px 20px 0px;">
                <el-form :model="manual" ref="manual" :rules="handleRules">
                    <el-form-item prop="name">
                        <el-select
                            v-model="manual.name"
                            clearable
                            :style="{ marginTop: '20px' }"
                            placeholder="身份证号 / 姓名"
                        >
                            <el-option
                                v-for="item in allPerson"
                                :key="item.zjhm || item.tyshxydm"
                                :label="item.mc || item.ztmc"
                                :value="item.zjhm || item.tyshxydm"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="relation">
                        <el-input
                            v-model="manual.relation"
                            placeholder="输入关系"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </template>
        <div class="dimension_button">
            <template v-if="isSystem">
                <el-button @click="resetForm('ruleForm')">条件重置</el-button>
                <el-button
                    type="primary"
                    @click="submitForm('ruleForm')"
                    :style="{ width: isSystem ? '' : '220px' }"
                    >确认扩展</el-button
                >
            </template>
            <template v-else>
                <el-button
                    type="primary"
                    @click="handleSubmit"
                    :style="{ width: isSystem ? '' : '220px' }"
                    >确认扩展</el-button
                ></template
            >
        </div>
    </div>
</template>

<script>
export default {
    name: "dimension-filtering",
    props: {
        allPerson: null,
        visible: {
            type: Boolean,
            default: true
        },
        condition: {
            type: Object,
            default: () => {}
        },
        isSystem: {
            type: Boolean,
            default: false
        },
        association: {
            type: Array,
            default: () => []
        }
    },
    data() {
        let reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
        let checkValue = (rule, value, callback) => {
            if (value === "") {
                return callback();
            } else if (!reg.test(value)) {
                callback(new Error("请输入数字值"));
            } else {
                callback();
            }
        };
        return {
            handleRules: {
                name: [
                    {
                        required: true,
                        message: "请输入姓名或身份证",
                        trigger: "change"
                    }
                ],
                relation: [
                    {
                        required: true,
                        message: "请输入关系",
                        trigger: "blur"
                    }
                ]
            },
            manual: {
                name: "",
                relation: ""
            },
            ruleForm: {
                conditions: []
            },
            rules: [
                {
                    validator: checkValue,
                    trigger: "change"
                }
            ],
            optionsData: [
                {
                    id: "01",
                    name: "同户",
                    selected: false,
                    conditions: []
                },
                {
                    id: "02",
                    name: "主要人员",
                    selected: false,
                    conditions: []
                },
                {
                    id: "03",
                    name: "银行卡转账",
                    selected: false,
                    conditions: [
                        {
                            value: "",
                            key: "transferAmount",
                            placeholder: "交易金额"
                        },
                        {
                            value: "",
                            key: "transferCount",
                            placeholder: "交易次数"
                        }
                    ]
                },
                {
                    id: "04",
                    name: "同住",
                    selected: false,
                    conditions: [
                        {
                            value: "",
                            key: "liveCount",
                            placeholder: "同住次数"
                        }
                    ]
                },
                {
                    id: "05",
                    name: "同行-飞机",
                    selected: false,
                    conditions: [
                        {
                            value: "",
                            key: "airplaneCount",
                            placeholder: "飞机同行次数"
                        }
                    ]
                },
                {
                    id: "06",
                    name: "同行-大巴",
                    selected: false,
                    conditions: [
                        {
                            value: "",
                            key: "busCount",
                            placeholder: "大巴同行次数"
                        }
                    ]
                },
                {
                    id: "07",
                    name: "同行-火车",
                    selected: false,
                    conditions: [
                        {
                            value: "",
                            key: "trainCount",
                            placeholder: "火车同行次数"
                        }
                    ]
                },
                {
                    id: "08",
                    name: "投资",
                    selected: false,
                    conditions: []
                },
                {
                    id: "09",
                    name: "通话",
                    selected: false,
                    conditions: [
                        {
                            value: "",
                            key: "callCount",
                            placeholder: "通话次数"
                        },
                        {
                            value: "",
                            key: "callAmount",
                            placeholder: "通话总时长"
                        }
                    ]
                }
            ]
        };
    },
    methods: {
        handleSubmit() {
            this.$refs.manual.validate(valid => {
                if (valid) {
                    let flag;
                    this.allPerson.find(item => {
                        if (item.zjhm === this.manual.name || item.tyshxydm) {
                            flag = item;
                        }
                    });
                    this.$emit("submitForm", flag, this.manual.relation);
                    this.$refs.manual.clearValidate();
                    this.manual = {
                        name: "",
                        relation: ""
                    };
                    this.close();
                } else {
                    return false;
                }
            });
        },
        submitForm(formName) {
            if (!this.$refs[formName]) {
                var list = [];
                this.optionsData.map(value => {
                    if (value.selected) {
                        list.push(value);
                    }
                });
                this.$emit("submit", list);
                return;
            }
            this.$refs[formName].validate(valid => {
                if (valid) {
                    var list = [];
                    this.optionsData.map(value => {
                        if (value.selected) {
                            list.push(value);
                        }
                    });
                    this.$emit("submit", list);
                } else {
                    return false;
                }
            });
            this.resetForm();
            this.close();
        },
        resetForm() {
            this.ruleForm.conditions = [];
            this.optionsData.map(el => {
                el.selected = false;
                el.conditions.map(el => (el.value = ""));
            });
        },
        close() {
            this.$emit("update:visible", !this.visible);
        },
        getConditions(val) {
            if (!val.selected && val.num) {
                val.conditions.forEach(el => {
                    this.ruleForm.conditions.push(el);
                });
            } else {
                val.conditions.forEach(el => {
                    let index = this.ruleForm.conditions.indexOf(el);
                    this.ruleForm.conditions.splice(index, 1);
                });
            }
            val.selected = !val.selected;
        }
    },
    watch: {
        condition() {
            let weidu = [];
            this.ruleForm.conditions = [];
            if (this.condition.dimensionality) {
                weidu = this.condition.dimensionality.split(",");
                this.optionsData.map(value => {
                    value.selected = false;
                });
                weidu.map(key => {
                    this.optionsData.map(value => {
                        if (key == value.id) {
                            value.selected = true;
                            value.conditions.map(d => {
                                d.value = this.condition[d.key];
                                this.ruleForm.conditions.push(d);
                            });
                        }
                    });
                });
            }
        },
        association() {
            if (this.association[0]) {
                for (let index in this.optionsData) {
                    this.$set(
                        this.optionsData,
                        index,
                        Object.assign(
                            {},
                            this.optionsData[index],
                            this.association[index]
                        )
                    );
                }
            }
        }
    },
    mounted() {}
};
</script>

<style lang="scss" scoped>
.dimension /deep/ .el-form-item__error {
    top: 85%;
}
.bottom_conditions {
    & /deep/ .el-form-item__error {
        top: 100% !important;
    }
    & /deep/ .el-select {
        display: block;
    }
}
.dimension {
    width: 250px;
    /* height: 100%; */
    background-color: #fff;
    /* overflow-y: scroll; */
    /* overflow-y: overlay; */
    border-radius: 5px;
    /* &::-webkit-scrollbar {
        width: 8px;
    }
    &::-webkit-scrollbar-track {
        background-color: #fff;
    }
    &::-webkit-scrollbar-thumb {
        background-color: #dddee0;
    }
    &::-webkit-scrollbar-thumb:hover {
        background-color: #c7c9cc;
    }
    &::-webkit-scrollbar-thumb:active {
        background-color: #c7c9cc;
    } */
    box-shadow: 0 2px 10px rgba(10, 16, 20, 0.44);
    font-size: 14px;
    .dimension_top {
        display: flex;
        height: 40px;
        width: 250px;
        font-size: 14px;
        justify-content: space-between;
        background-color: rgba(7, 33, 72, 1);
        padding: 10px 15px;
        color: #fff;
        .el-icon-close {
            font-size: 12px;
            padding-top: 5px;
            cursor: pointer;
        }
    }
    .dimension_mid {
        padding: 20px 0;
        border-bottom: 1px solid rgba(7, 33, 72, 0.1);
        .mid_options {
            display: flex;
            flex-wrap: wrap;
            /* padding-left: 0px; */
            button {
                width: 110px;
                height: 32px;
                color: #52536b;
                border-radius: 5px;
                background-color: #e3e6f8;
                border: 1px solid #fff;
                border-color: #fff;
                padding: 0px;
                margin-top: 10px;
                margin-left: 10px;
                outline: none;
                cursor: pointer;
            }
            .options_selected {
                color: #fff !important;
                border-color: #c6e2ff;
                background-color: #1490ff;
            }
        }
    }
    .dimension_bottom {
        padding: 20px 0 15px;
        border-bottom: 1px solid rgba(7, 33, 72, 0.1);
        .bottom_conditions {
            text-align: center;
            .el-form {
                padding-top: 15px;
                .el-form-item {
                    display: inline-block;
                    width: 221px;
                    height: 60px;
                    .el-input {
                        margin-bottom: 15px;
                    }
                }
            }
        }
    }
    .dimension_button {
        display: flex;
        justify-content: space-between;
        padding: 20px 15px;
        .el-button {
            width: 100px;
            height: 40px;
        }
    }
}
.disabled {
    opacity: 0.4;
    cursor: not-allowed !important;
}
</style>
