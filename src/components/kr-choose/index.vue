<template>
    <div class="rightBox">
        <kr-section-title :title="title" :size="18"></kr-section-title>
        <div class="warnTextContent">
            <el-alert
                :title="warnTitle"
                type="warning"
                v-if="warnTitle"
            ></el-alert>
            <el-input
                clearable
                class="inline-input"
                v-if="hasSearch"
                placeholder="请输入"
                suffix-icon="el-icon-search"
                v-model="searchMsg"
                size="mini"
                @input="handleSearch(searchMsg)"
                :style="{ marginTop: '15px' }"
            ></el-input>
            <div class="radioWrapper" v-if="hsaRadio">
                <el-radio v-model="radio" label="1">全部</el-radio>
                <el-radio v-model="radio" label="2"
                    >已选 {{ checkedPersons.length }}</el-radio
                >
            </div>
            <div class="checkbox-group" v-if="isCheckbox">
                <el-checkbox-group v-model="checkedPersons" :max="max">
                    <div class="checkWrapper">
                        <template v-if="radio === '1' && all.length != 0">
                            <template v-if="isPerson">
                                <el-checkbox
                                    v-for="item in person"
                                    :checked="item.status"
                                    :key="item.zjhm"
                                    :label="item"
                                    @change="handleCheckAllChange"
                                >
                                    {{ item.mc }}
                                    <!-- <span v-if="checkedPersons[index]"> -->
                                    <span
                                        class="dot"
                                        :style="{
                                            background: item.status
                                                ? item.color
                                                : ''
                                        }"
                                    ></span>
                                    <!-- </span> -->
                                </el-checkbox>
                            </template>
                            <template v-else>
                                <el-checkbox
                                    v-for="item in allin"
                                    :label="item.org"
                                    :key="item.org.zjhm || item.org.tyshxydm"
                                >
                                    {{ item.org.mc || item.org.ztmc }}
                                    <span
                                        class="dot"
                                        :style="{ background: item.color }"
                                    ></span>
                                </el-checkbox>
                            </template>
                        </template>
                        <template v-else>
                            <el-checkbox
                                v-for="item in checkedPersons"
                                :key="item.zjhm || item.tyshxydm"
                                :label="item"
                            >
                                {{ item.mc || item.ztmc }}
                                <span
                                    class="dot"
                                    :style="{
                                        background: item.status
                                            ? item.color
                                            : ''
                                    }"
                                ></span>
                            </el-checkbox>
                        </template>
                    </div>
                </el-checkbox-group>
            </div>
            <div v-else class="radioBox radio-group">
                <el-radio-group v-model="checkedPersons">
                    <el-radio
                        v-for="item in allin"
                        :label="item.org"
                        :key="item.org.zjhm || item.org.tyshxydm"
                        :disabled="item.org.tyshxydm && isPerson"
                    >
                        {{ item.org.mc || item.org.ztmc }}</el-radio
                    >
                </el-radio-group>
            </div>
            <div class="doubleButton">
                <el-button
                    @click="handleClick"
                    type="primary"
                    :loading="btnLoading"
                >
                    {{ buttonTitle[0] }}
                </el-button>
                <el-button @click="clearOptions">
                    {{ buttonTitle[1] }}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
var allArr = [];
export default {
    props: {
        // 只传入人员
        isPerson: {
            type: Boolean,
            default: false
        },
        hasCompany: {
            type: Boolean,
            default: false
        },
        isCheckbox: {
            type: Boolean,
            default: true
        },
        btnLoading: {
            type: Boolean,
            default: false
        },
        all: null,
        // 按钮文字
        buttonTitle: {
            type: Array,
            default: () => ["开始分析", "清空对象"]
        },
        // 是否有单选框
        hsaRadio: {
            type: Boolean,
            default: true
        },
        // 是否有搜索框
        hasSearch: {
            type: Boolean,
            default: true
        },
        // 最多选择几个
        max: {
            type: Number,
            default: Infinity
        },
        // 标题大小
        size: {
            type: Number,
            default: 18
        },
        // 标题内容
        title: {
            type: String,
            default: "选择对象"
        },
        // 警告内容
        warnTitle: {
            type: String,
            default: "请选择多个对象进行分析"
        },

        checkList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            person: [], //传值all 需改变临时中间变量
            checkedPersons: [],
            radio: "1",
            searchMsg: "",
            allin: []
        };
    },
    methods: {
        // 清空选项
        clearOptions() {
            this.checkedPersons = [];
            for (const i in this.person) {
                this.person[i].status = false;
            }
            this.$emit("clearAll");
        },
        // 开始分析
        handleClick() {
            this.$emit("startAnalysis", this.checkedPersons);
        },
        // 搜索
        handleSearch(queryString) {
            this.allin = [];
            allArr.map(item => {
                if (item.value.indexOf(queryString) !== -1) {
                    this.allin.push(item);
                }
            });
        },
        handleCheckAllChange() {
            //根据当前选中，设置 false  checkedPersons
            var count = 0;
            for (const i in this.person) {
                count = 0;
                for (const j of this.checkedPersons) {
                    if (this.person[i].zjhm != j.zjhm) {
                        count = count + 1;
                    }
                }
                if (count == this.checkedPersons.length) {
                    this.person[i].status = false;
                } else {
                    this.person[i].status = true;
                }
            }
        }
    },

    watch: {
        checkList() {
            this.checkedPersons = [];
            if (this.all.saqyModels) {
                this.all.saqyModels.map(value => {
                    this.checkList.map(id => {
                        if (value.zjhm == id || value.tyshxydm == id) {
                            this.checkedPersons.push(value);
                        }
                    });
                });
            }
            if (this.all.saxxModels) {
                this.all.saxxModels.map(value => {
                    this.checkList.map(id => {
                        if (value.zjhm == id || value.tyshxydm == id) {
                            this.checkedPersons.push(value);
                        }
                    });
                });
            }
            if (!this.all.saxxModels && !this.all.saqyModels && this.all) {
                this.all.map(value => {
                    this.checkList.map(id => {
                        if (value.zjhm == id || value.tyshxydm == id) {
                            this.checkedPersons.push(value);
                        }
                    });
                });
            }
        },

        all() {
            allArr = [];
            if (this.all.saqyModels == undefined) {
                this.person = this.all;
                let com = this.all;
                com.map(item => {
                    let obj = {};
                    obj.value = item.mc;
                    obj.org = item;
                    allArr.push(obj);
                });

                this.allin = allArr;
            } else {
                let com = [...this.all.saqyModels, ...this.all.saxxModels];
                com.map(item => {
                    let obj = {};
                    obj.value = item.mc || item.ztmc;
                    obj.org = item;
                    allArr.push(obj);
                });
                this.allin = allArr;
            }
        }
    },
    mounted() {
        this.allin = allArr;
    }
};
</script>

<style lang="scss" scoped>
@import "@/styles/basic-color.scss";
.dot {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    display: inline-block;
    position: absolute;
    left: 70px;
    top: 6px;
}
.rightBox {
    height: 100%;
    overflow: hidden;
}
.doubleButton {
    position: absolute;
    bottom: 60px;
    margin-top: 10px;
    display: flex;
    flex-flow: column;
    /* align-items: stretch; */
    width: 160px;
}

.checkbox-group {
    height: calc(100% - 280px);
    overflow-y: auto;
}
.radio-group {
    height: calc(100% - 180px);
    overflow-y: auto;
}
.warnTextContent {
    padding: 10px 20px 20px 20px;
    height: 100%;
    position: relative;
    .radioWrapper {
        margin-top: 15px;
        padding-bottom: 15px;
        border-bottom: 2px solid #e3e6f8;
    }
}
.checkWrapper {
    display: flex;
    flex-direction: column;
}
.warnTextContent /deep/ .el-input {
    margin-top: 10px !important;
}
.doubleButton /deep/ .el-button + .el-button {
    margin-left: 0;
    margin-top: 20px;
}

.checkWrapper /deep/ .el-checkbox {
    margin-top: 15px;
}
.radioBox /deep/ .el-radio {
    margin-top: 15px;
    display: block;
}
.rightBox /deep/ .el-radio__inner::after {
    width: 12px;
    height: 12px;
    background-color: transparent;
    border: 2px solid #fff;
}
.warnTextContent /deep/ .is-light {
    background-color: rgba(233, 186, 122, 0.2);
    border: 1px solid $color-warning;
    color: $color-warning;
}

.warnTextContent /deep/ .el-icon-close:before {
    position: relative;
    right: -14px;
    top: -12px;
    color: $color-warning;
}

.warnTextContent /deep/ .el-alert {
    border-radius: 0;
}
</style>
