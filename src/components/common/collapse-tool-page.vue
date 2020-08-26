<template>
    <div style="height:100%;width:100%">
        <div class="collapsetoolbar" id="collapsetool">
            <div class="fxtjhead">
                <div style="margin-left: 40px;margin-top:20px;display:flex">
                    <div style="flex-basis: 100px;">
                        分析条件 ：
                    </div>
                    <div style="width:80%">
                        <el-tag
                            :key="tag.name"
                            v-for="tag in tags"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tag)"
                        >
                            {{ tag }}
                        </el-tag>
                    </div>
                </div>

                <div class="fxtjbtn">
                    <el-button type="primary" size="mini" @click="toggle()">
                        分析条件
                        <i
                            class="el-icon-d-arrow-left"
                            style="transition: all .3s linear"
                            :style="{
                                transform: !isShowfxtj
                                    ? 'rotate(-90deg)'
                                    : 'rotate(90deg)'
                            }"
                        ></i>
                    </el-button>
                </div>
                <!-- <div class="qrfxbtn">
                        <el-button
                            type="primary"
                            size="mini"
                            @click="startAnalysis"
                        >
                            确认分析
                            <i class="el-icon-search"></i>
                        </el-button>
                    </div> -->
            </div>

            <!-- v-show="isShowfxtj" -->
            <!-- :class="{
                        showfxtj: isShowfxtj,
                        noshowfxtj: !isShowfxtj
                    }" -->
            <div class="fxtjbox" v-show="isShowfxtj">
                <div class="tj">
                    <slot
                        name="conditions"
                        ref="conditions"
                        v-show="$slots.conditions"
                    >
                        暂无内容显示
                    </slot>
                    <!-- <slot v-else> </slot> -->
                </div>
                <div class="toolbar_cz">
                    <el-button
                        type=""
                        class="primarycolor"
                        size="mini"
                        @click="resetTJ()"
                        >重置</el-button
                    >
                    <el-button
                        type="primary"
                        size="mini"
                        @click="startAnalysis()"
                        >确认分析</el-button
                    >
                </div>
                <div class="togglebtn" @click="toggle()">
                    <i
                        class="el-icon-d-arrow-left"
                        style="transition: all .3s linear"
                        :style="{
                            transform: !isShowfxtj
                                ? 'rotate(-90deg)'
                                : 'rotate(90deg)'
                        }"
                    ></i>
                    {{ isShowfxtj ? "收起" : "展开" }}
                </div>
            </div>
        </div>

        <div class="footercontent">
            <slot name="content" v-show="$slots.content">
                暂无内容显示
            </slot>
            <!-- <slot v-else> </slot> -->
        </div>
    </div>
</template>
<script>
// import { cloneDeep } from "loadsh";
export default {
    name: "collapse-tool-page",
    props: {
        // prop_tags_copy: { type: Array } //所有数据
        prop_tags: { type: Array } //所有数据
    },
    components: {},
    data() {
        return {
            isShowHead: true,
            isShowfxtj: false,
            tags: []
            // tags_copy: []
            // cztags: []
        };
    },
    computed: {},
    watch: {
        prop_tags: {
            handler() {
                this.tags = this.prop_tags;
            },
            immediate: true
        },
        tags: {
            handler() {
                this.$nextTick(function() {
                    //操作外层div 高度
                    var toolbar = document.querySelectorAll(".collapsetoolbar");
                    var content = document.querySelectorAll(".footercontent");
                    var toolbar_height;
                    if (document.querySelectorAll(".footercontent") != null) {
                        toolbar.forEach((element, i) => {
                            toolbar_height = getComputedStyle(element).height;
                            if (toolbar_height != "auto") {
                                var h = parseInt(toolbar_height) + 20; //加上底部20px
                                // alert(toolbar_height);
                                content[i].style.height =
                                    "calc(100% - " + h + "px)";
                            }
                        });
                    }
                    // //toobar 高度
                    // var toolbar_height = getComputedStyle(
                    //     document.querySelectorAll(".collapsetoolbar")
                    // ).height;
                    // var h = parseInt(toolbar_height) + 20; //加上底部20px
                    // // alert(toolbar_height);
                    // document.querySelector(".footercontent").style.height =
                    //     "calc(100% - " + h + "px)";
                });
                setTimeout(() => {
                    //操作外层div 高度
                    var toolbar = document.querySelectorAll(".collapsetoolbar");
                    var content = document.querySelectorAll(".footercontent");
                    var toolbar_height;
                    if (document.querySelectorAll(".footercontent") != null) {
                        toolbar.forEach((element, i) => {
                            toolbar_height = getComputedStyle(element).height;
                            if (toolbar_height != "auto") {
                                var h = parseInt(toolbar_height) + 20; //加上底部20px
                                // alert(toolbar_height);
                                content[i].style.height =
                                    "calc(100% - " + h + "px)";
                            }
                        });
                    }

                    // //操作外层div 高度
                    // if (document.querySelectorAll(".footercontent") != null) {
                    //     //toobar 高度
                    //     var toolbar_height = getComputedStyle(
                    //         document.querySelectorAll(".collapsetoolbar")
                    //     ).height;
                    //     var h = parseInt(toolbar_height) + 20; //加上底部20px
                    //     // alert(toolbar_height);
                    //     document.querySelectorAll(
                    //         ".footercontent"
                    //     ).style.height = "calc(100% - " + h + "px)";
                    // }
                }, 1000);
            },
            immediate: true
        }
    },
    methods: {
        //搜索条件
        toggle() {
            this.isShowfxtj = !this.isShowfxtj;
        },
        resetTJ() {
            //传 prop_tags 表示重置
            this.tags = this.prop_tags;
            this.$emit("resetFilter", { tags: this.tags });
        },
        handleClose(tag) {
            //当前删除的元素
            // this.tags = tag;
            var sjlx = this.tags.filter(value => {
                return value != tag;
            });
            this.tags = sjlx;
            //当前删除的元素tag

            this.$emit("handleClose", { tag: tag });
        },
        startAnalysis() {
            //开始分析
            this.$emit("startAnalysis");
        }
    },
    created() {},
    mounted() {},
    beforeDestroy() {}
};
</script>
<style lang="scss" scoped>
@import "@/styles/basic-color.scss";
//搜索条件
.collapsetoolbar {
    width: 100%;
    // height: 100px;

    z-index: 10;
}
.footercontent {
    // height: calc(100% - 126px);
    height: 100%;
    width: 100%;
    // bottom: 20px;
    position: absolute;
}
.sjlx_select {
    background: $color-primary;
}
.toolbar_zd {
    height: 60px;
}
.fxtjhead {
    height: 100%;
    min-height: 58px;
    width: 100%;
    border: 2px solid #eee;
    border-left: 2px solid $color-primary;
    font-size: 18px;
    background: white;
    position: relative;
    z-index: 12;
}
.togglebtn {
    // position: absolute;
    // right: 20px;
    // top: 180px;
    float: right;
    margin: 20px -300px 20px;
    color: $color-primary;
    cursor: pointer;
}
.fxtjbox {
    position: absolute;
    // z-index: 1001;
    z-index: 10;
    width: 100%;
    // width: calc(100% - 20px);
    // height: 240px;
    // height: 280px;
    // height: 120%;
    background: white;
    border: 1px solid #eee;
    box-shadow: 1px 1px 2px #888888;
}

.tj {
    // margin-left: 40px;
    margin: 20px 40px 0px 40px;
}
.fxtjbtn {
    // width: 100%;
    position: absolute;
    right: 20px;
    top: 20px;
}
.qrfxbtn {
    position: absolute;
    right: 20px;
    top: 60px;
}
.toolbar_cz {
    // position: absolute;
    // right: 100px;
    // top: 180px;
    float: right;
    margin: 20px 100px 20px;
}
.primarycolor {
    color: $color-primary;
}

.el-tag {
    margin-left: 10px;
    margin-bottom: 10px;
}

//搜索条件
</style>
