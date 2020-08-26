<template>
    <div class="settingDialog" v-if="visible">
        <div class="settingTop">
            <div>分析类型设置</div>
            <i
                class="el-icon-close"
                @click="$emit('update:visible', false)"
            ></i>
        </div>
        <div class="settingBody">
            <kr-section-title title="分析类型选择"></kr-section-title>
            <button
                v-for="item in optionsData"
                :key="item.id"
                :class="{
                    options_selected: item.selected
                }"
                @click="getConditions(item)"
            >
                {{ item.name }}
            </button>
        </div>
        <div
            class="settingBottom"
            v-if="ruleForm.conditions.length == 0 ? false : true"
        >
            <kr-section-title title="分析条件设置"></kr-section-title>
            <el-scrollbar
                style="height: 100%;"
                wrap-style="overflow-x: hidden;"
            >
                <div class="settingSelect">
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
        <div class="settingSubmit">
            <el-button @click="resetForm('ruleForm')">重置</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')"
                >确定</el-button
            >
        </div>
    </div>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: true
        },
        condition: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        let reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
        let checkValue = (rule, value, callback) => {
            if (value === "") {
                return callback();
            } else if (!reg.test(value)) {
                callback(new Error("请输入数值"));
            } else {
                callback();
            }
        };
        return {
            dialogVisible: true,
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
                    id: "10",
                    name: "通话记录分析",
                    selected: false,
                    conditions: [
                        {
                            value: "",
                            key: "callAmount",
                            placeholder: "通话总时长"
                        },
                        {
                            value: "",
                            key: "callCount",
                            placeholder: "通话次数"
                        }
                    ]
                },
                {
                    id: "03",
                    name: "交易记录分析",
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
                }
            ]
        };
    },
    methods: {
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
        },
        resetForm() {
            this.ruleForm.conditions = [];
            this.optionsData.map(el => {
                el.selected = false;
                el.conditions.map(el => (el.value = ""));
            });
        },
        getConditions(val) {
            if (!val.selected) {
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
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/styles/basic-color.scss";
.settingDialog {
    width: 250px;
    height: 100%;
    background-color: #fff;
    font-size: 14px;
    .settingTop {
        display: flex;
        height: 40px;
        width: 250px;
        font-size: 14px;
        justify-content: space-between;
        background-color: #072148;
        padding: 10px 15px;
        color: #fff;
    }
    .settingBody {
        padding: 20px 0;
        border-bottom: 1px solid rgba(7, 33, 72, 0.1);
        button {
            width: 221px;
            height: 32px;
            color: #52536b;
            border-radius: 5px;
            background-color: #e3e6f8;
            border: 1px solid #fff;
            border-color: #fff;
            padding: 5px 5px;
            margin-top: 15px;
            margin-left: 10px;
            outline: none;
            cursor: pointer;
        }
        .options_selected {
            color: #fff !important;
            border-color: #c6e2ff;
            background-color: $color-primary;
        }
    }
    .settingBottom {
        padding: 20px 0 15px;
        height: calc(100% - 290px);
        border-bottom: 1px solid rgba(7, 33, 72, 0.1);
    }
    .settingSelect {
        padding: 20px;
    }
    .settingSubmit {
        display: flex;
        justify-content: space-between;
        padding: 20px 15px;
        .el-button {
            width: 100px;
        }
    }
}
</style>
