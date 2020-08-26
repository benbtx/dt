<template>
    <div id="full">
        <div class="toolbar box-shadow">
            <template v-for="item in toolbarList">
                <el-tooltip
                    v-if="item.type == 'radio' && item.is"
                    class="item"
                    effect="dark"
                    popper-class="toolbarBottomTooltip"
                    :content="item.name"
                    placement="bottom"
                    :key="item.name"
                >
                    <div
                        class="radioButton"
                        @click="toolbarClick(item)"
                        @mouseenter="tooltipFullscreen('toolbarBottomTooltip')"
                        :class="{ 'is-active': item.isCheck }"
                    >
                        <kr-icon :icon="item.icon"></kr-icon>
                    </div>
                </el-tooltip>
                <el-tooltip
                    v-if="item.type == 'button' && item.is"
                    class="item"
                    effect="dark"
                    popper-class="toolbarBottomTooltip"
                    :content="item.name"
                    placement="bottom"
                    :key="item.name"
                >
                    <div
                        class="radioButton"
                        @click="toolbarClick(item)"
                        @mouseenter="tooltipFullscreen('toolbarBottomTooltip')"
                    >
                        <kr-icon :icon="item.icon"></kr-icon>
                    </div>
                </el-tooltip>
            </template>
            <div class="toolbar-right">
                <div class="block">
                    <el-date-picker
                        v-model="dateValue"
                        type="daterange"
                        align="right"
                        unlink-panels
                        size="small"
                        style="width: 230px"
                        range-separator="~"
                        start-placeholder="开始日期"
                        value-format="yyyyMMdd"
                        end-placeholder="结束日期"
                        :picker-options="$pickerOptions"
                        @focus="tooltipFullscreen('el-picker-panel')"
                        @change="dateChange"
                    ></el-date-picker>
                </div>
                <div class="block">
                    <el-button
                        @click="analysisHistory"
                        style="margin-right: 10px"
                        >分析记录</el-button
                    >
                    <el-button type="primary" @click="saveAnalysis"
                        >保存分析</el-button
                    >
                </div>
            </div>
        </div>
        <div class="toolbarBottom box-shadow">
            <div v-for="(item, index) in toolbarBottomList" :key="index">
                <el-tooltip
                    class="item"
                    effect="dark"
                    :content="toolbarBottomTooltip(item.name)"
                    :hide-after="0"
                    popper-class="toolbarBottomTooltip"
                    placement="right"
                    :key="item.name"
                    v-if="item.is"
                >
                    <div
                        style="margin: 20px 12px;font-size: 16px;cursor: pointer"
                        @click="toolbarBottomClick(item.name)"
                        @mouseenter="tooltipFullscreen('toolbarBottomTooltip')"
                    >
                        <kr-icon :icon="item.icon"></kr-icon>
                    </div>
                </el-tooltip>
            </div>
        </div>
        <div class="search box-shadow">
            <el-autocomplete
                popper-class="my-autocomplete"
                v-model="keyWords"
                :fetch-suggestions="querySearch"
                placeholder="请输入"
                style="width: 150px"
                clearable
                @focus="tooltipFullscreen('el-autocomplete-suggestion')"
                @select="handleSelect"
            >
                <i class="el-icon-search el-input__icon" slot="suffix"></i>
                <template slot-scope="{ item }">
                    <div class="name">{{ item.value }}</div>
                </template>
            </el-autocomplete>
        </div>
        <div class="select box-shadow" v-if="selectOptions.options.length">
            <el-select
                v-model="selectList"
                clearable
                style="width: 130px"
                :placeholder="selectOptions.title"
                @focus="tooltipFullscreen('el-select-dropdown')"
                @change="selectConfirm"
            >
                <el-option
                    v-for="item in selectOptions.options"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                ></el-option>
            </el-select>
        </div>
        <div class="tooltip">
            <ul>
                <li
                    v-for="(item, index) in imgs"
                    :key="index"
                    @click="tooltipClick(index)"
                    style="margin-top: 5px"
                >
                    <div style="float: left;cursor: pointer">
                        <div
                            style="float: left;overflow: hidden;width:25px;height:25px;border-radius: 50%"
                        >
                            <img :src="item.img" alt width="25" />
                        </div>

                        <div style="float: right;margin-left: 5px">
                            {{ item.type }}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="info">
            <slot name="info"></slot>
        </div>
        <el-dialog
            slot="info"
            :modal-append-to-body="false"
            :title="title"
            top="5vh"
            :visible.sync="dialogVisible"
            width="400px"
        >
            <div>
                <el-form
                    :model="editForm"
                    :rules="editFormRules"
                    ref="ruleForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="名称" prop="name">
                        <el-input
                            v-model="editForm.name"
                            style="width: 200px"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <el-button v-if="title == '编辑关系'" @click="deleteAddLink"
                    >删除</el-button
                >
                <el-button type="primary" @click="sureEdit">确 定</el-button>
            </div>
        </el-dialog>
        <div class="graphBox" id="main"></div>
    </div>
</template>

<script>
import * as d3 from "d3";
import { cloneDeep } from "loadsh";
import dqfxry from "@/assets/image/dqfxry.png";
import dqfxdw from "@/assets/image/dqfxdw.png";
import bary from "@/assets/image/bary.png";
import fbary from "@/assets/image/fbary.png";
import badw from "@/assets/image/badw.png";
import fbadw from "@/assets/image/fbadw.png";
import jian from "@/assets/image/jian.png";
import weizhiyhk from "@/assets/image/weizhiyhk.png";
import weizhidhk from "@/assets/image/weizhidhk.png";
import weizhi from "@/assets/image/weizhi.png";
export default {
    props: {
        selectOptions: {
            type: Object,
            default: () => {
                return {
                    options: [],
                    title: ""
                };
            }
        },
        graph: {
            type: Array,
            default() {
                return [];
            }
        },
        root: {
            type: Object
        },
        model: {
            type: String,
            default: "graph"
        },
        date: {
            type: Array,
            default() {
                return [];
            }
        },
        options: {
            type: Object,
            default() {
                return {
                    addNode: true,
                    addLink: true
                };
            }
        },
        condition: {
            type: Object
        },
        historyData: {
            type: Object
        }
    },
    data() {
        return {
            toolbarList: [
                {
                    name: "添加关系",
                    icon: "icon--kehuguanxiguanli",
                    isCheck: false,
                    type: "radio"
                },
                {
                    name: "回到中心",
                    icon: "icon-shouye",
                    isCheck: false,
                    type: "radio"
                },
                {
                    name: "刷新",
                    icon: "icon-shuaxin1",
                    isCheck: false,
                    type: "radio"
                }
            ],
            toolbarBottomList: [
                { name: "全屏", icon: "icon-quanpingzuidahua", is: true },
                { name: "退出全屏", icon: "icon-tuichuquanping", is: false },
                { name: "放大", icon: "icon-fangda", is: true },
                { name: "缩小", icon: "icon-suoxiao", is: true }
            ],

            graphData: {},
            treeData: [],

            //节点、连线相关数据
            nodesMap: {},
            linksMap: {},
            nodesData: [],
            linksData: [], //处理过的线
            linesData: [], //未处理的线
            addLinksData: [],
            menus: [
                { event: "扩展", proportion: 1 },
                { event: "收起", proportion: 1 },
                { event: "手动扩展", proportion: 1 }
            ],
            menusClickNode: "",
            conditonNode: [],

            selectList: [],
            dateValue: "",
            keyWords: "",
            restaurants: [],
            timer: "",
            isCtrl: false,
            isSpace: false,
            dragNode: "", //正在拖动的点
            dragNodeX: "", //拖动点X偏移
            dragNodeY: "", //拖动点Y偏移,
            moveNodes: [],
            dragStartPos: {},
            dragEndPos: {},
            isAddNode: false,
            isAddLine: false,
            isDeleteNodes: false, //自定删除
            addId: 1,
            addD3Event: "", //添加时的点击事件,
            addLineNodes: [],
            stepList: [],
            stepIndex: "end",
            zoomTransform: "",

            //svg 样式相关数据
            offsetX: 100,
            width: "",
            height: "",
            nodeConf: {
                fillColor: "#1490FF",
                borderColor: "#1490FF",
                strokeColor: "none",
                strokeWidth: 1,
                textFillColor: "#0C1231",
                textFontSzie: 12,
                radius: 23,
                clickFillColor: "#1490FF"
            },
            lineConf: {
                strokeColor: "#A3A4B5",
                lineTextFontSize: 12,
                strokeWidth: 1
            },
            menusConf: {
                innerRadius: 23,
                outerRadius: 60,
                fillColor: "rgba(20,144,255,0.7)",
                hoverFillColor: "rgba(20,144,255,1)",
                textFill: "#fff"
            },
            labelConf: {
                height: 25,
                fontSize: 12
            },
            imgs: {
                "001": {
                    img: dqfxry,
                    type: "当前分析对象"
                },
                "011": {
                    img: dqfxdw,
                    type: "当前分析单位"
                },
                "00": {
                    img: bary,
                    type: "本案人员"
                },
                "01": {
                    img: badw,
                    type: "本案单位"
                },
                "02": {
                    img: fbary,
                    type: "非本案人员"
                },
                "03": {
                    img: fbadw,
                    type: "非本案单位"
                },
                "04": {
                    img: weizhiyhk,
                    type: "未知银行卡"
                },
                "05": {
                    img: weizhidhk,
                    type: "未知电话卡"
                }
            },

            //图形配置项
            scaleExtent: [0.2, 3], //缩放范围
            clickDistance: 3, //拖动距离小于这个值的视为点击事件
            isFixed: true,
            dragMoveTtoggleNode: true, //是否开启按住空格拖动时移动相关一级节点,
            isMaker: false, //是否显示箭头
            bezierDistance: 50, //二阶贝塞尔曲线顶点间隔

            dialogVisible: false,
            editForm: {
                name: ""
            },
            editFormRules: {
                name: [
                    {
                        required: true,
                        message: "请输入关系名称",
                        trigger: "blur"
                    },
                    {
                        min: 1,
                        max: 20,
                        message: "长度在 1 到 20 个字符",
                        trigger: "blur"
                    }
                ]
            },
            editLine: {},
            title: ""
        };
    },
    mounted() {
        document.getElementById("main").oncontextmenu = function() {
            return false;
        };
        document.addEventListener("fullscreenchange", () => {
            var userAgent = navigator.userAgent,
                isFull;
            if (userAgent.indexOf("Firefox") > -1) {
                //判断是否Firefox浏览器
                isFull = document.mozFullScreen;
            }
            if (userAgent.indexOf("Chrome") > -1) {
                isFull = document.webkitIsFullScreen;
            }
            this.toolbarBottomList.map(value => {
                if (value.name == "全屏") {
                    value.is = !isFull;
                }
                if (value.name == "退出全屏") {
                    value.is = isFull;
                }
            });
        });
        this.width = document.getElementById("main").offsetWidth;
        this.height = document.getElementById("main").offsetHeight;
        this.initToolbarList();
        if (this.dragMoveTtoggleNode) {
            //开启事件监听
            this.createEventListener();
        }
        this.createSvg();
    },
    methods: {
        sureEdit() {
            this.$refs.ruleForm.validate(valid => {
                if (valid) {
                    this.editLine.label = this.editForm.name;
                    if (this.title == "添加关系") {
                        this.addLinksData.push(this.editLine);
                        this.dialogVisible = false;
                        this.createNodeAndLine();
                    }
                    if (this.title == "编辑关系") {
                        if (this.editLine.target.data.type == "add") {
                            this.editLine.target.data.relation = this.editForm.name;
                        } else {
                            this.editLine.label = this.editForm.name;
                        }
                        this.dialogVisible = false;
                        this.bindNodeLine();
                    }
                } else {
                    return false;
                }
            });
        },
        initToolbarList() {
            this.toolbarList = [
                {
                    name: "添加关系",
                    icon: "icon--kehuguanxiguanli",
                    isCheck: false,
                    type: "radio",
                    is: this.options.addNode
                },
                {
                    name: "回到中心",
                    icon: "icon-shouye",
                    isCheck: false,
                    type: "radio",
                    is: true
                },
                {
                    name: "刷新",
                    icon: "icon-shuaxin1",
                    isCheck: false,
                    type: "radio",
                    is: true
                }
            ];
        },
        analysisHistory() {
            this.$emit("analysisHistory");
        },
        saveAnalysis() {
            this.$emit("saveAnalysis");
        },
        selectConfirm() {
            this.$emit("selectChange", this.selectList);
        },
        dateChange() {
            this.$emit("dateChange", this.dateValue);
        },
        querySearch(queryString, cb) {
            let map = {};
            this.restaurants = [];
            this.nodesData.map(value => {
                map[value.data.id] = value.data;
            });
            for (let key in map) {
                this.restaurants.push({
                    value: map[key].realName,
                    id: key
                });
            }
            var restaurants = this.restaurants;
            var results = queryString
                ? restaurants.filter(this.createFilter(queryString))
                : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        handleSelect(item) {
            const shelf = this;
            this.nodeCircle.each(function(node) {
                if (node.data.id == item.id) {
                    d3.select(this)
                        .select("circle")
                        .style("stroke", shelf.nodeConf.clickFillColor)
                        .style("stroke-width", 5);
                } else {
                    d3.select(this)
                        .select("circle")
                        .style("stroke", "none")
                        .style("stroke-width", 0);
                }
            });
        },
        createFilter(queryString) {
            return restaurant => {
                return (
                    restaurant.value
                        .toLowerCase()
                        .indexOf(queryString.toLowerCase()) === 0
                );
            };
        },

        //创建图形
        createSvg() {
            // 缩放器
            this.zoom = d3
                .zoom()
                .scaleExtent(this.scaleExtent)
                .on("start", this.zoomStart)
                .on("zoom", this.zoomFn)
                .on("end", this.zoomEnd);

            // SVG
            this.svg = d3
                .select("#main")
                .append("svg")
                .attr("width", this.width)
                .attr("height", this.height)
                .append("g")
                .call(this.zoom)
                .on("dblclick.zoom", null);

            // 缩放层
            this.zoomOverlay = this.svg
                .append("rect")
                .attr("width", this.width)
                .attr("height", this.height)
                .attr("class", "background")
                .style("fill", "none")
                .style("cursor", "move")
                .style("pointer-events", "all")
                .on("click", () => {
                    this.clearStatus();
                    if (this.isAddNode) {
                        let x0 = this.getLeft(document.getElementById("main"));
                        let y0 = this.getTop(document.getElementById("main"));
                        let transfrom = d3.zoomTransform(this.svg.node());
                        let offsetX = d3.event.clientX - x0,
                            offsetY = d3.event.clientY - y0;
                        let x = (offsetX - transfrom.x) / transfrom.k,
                            y = (offsetY - transfrom.y) / transfrom.k;
                        this.$emit("add", "node", {
                            fx: x,
                            fy: y,
                            x,
                            y
                        });
                    }
                })
                .on("mousedown", () => {
                    // if (d3.event.button == 0){
                    //     this.isZoomMove=false
                    // }
                });

            //监听添加关系事件
            this.svg.on("mousemove", () => {
                if (this.isAddLine && this.addLineNodes.length == 1) {
                    var transform = d3.zoomTransform(this.svg.node());

                    d3.select("#main")
                        .select(".movePath")
                        .remove();

                    d3.select("#main")
                        .select(".container")
                        .insert("path", "#linkGroup")
                        .attr("class", "movePath");
                    let x0 = this.getLeft(document.getElementById("main"));
                    let y0 = this.getTop(document.getElementById("main"));
                    let offsetX = d3.event.clientX - x0,
                        offsetY = d3.event.clientY - y0;
                    var m =
                        "M" +
                        this.addLineNodes[0].y +
                        "," +
                        this.addLineNodes[0].x +
                        " L" +
                        (offsetX / transform.k - transform.x / transform.k) +
                        "," +
                        (offsetY / transform.k - transform.y / transform.k);
                    d3.select(".movePath")
                        .style("stroke", () => this.lineConf.strokeColor)
                        .attr("stroke-dasharray", "2 2")
                        .attr("d", m);
                }
            });

            this.container = this.svg.append("g").attr("class", "container");

            //监听框选事件
            this.selectEvent();

            //连线组
            this.linkLineGroup = this.container
                .append("g")
                .attr("id", "linkGroup");

            // 连线文字组
            this.lineTextGroup = this.container.append("g");

            //节点组
            this.nodeCircleGroup = this.container.append("g");
        },

        initData() {
            this.tree = d3
                .tree()
                .size([this.height, this.width])
                .nodeSize([70, 70])
                .separation(function(a, b) {
                    return a.parent === b.parent ? 1 : 2;
                });

            this.treeData = d3.hierarchy(this.graphData).sum(function(d) {
                return d.value;
            });

            this.setDepth(this.graphData);

            let treeData = this.tree(this.treeData);

            this.nodesData = treeData.descendants();

            this.nodesData.forEach(d => {
                d.y = d.depth * 250 + 150;
                d.x = d.x + this.height / 2;
            });

            this.linksData = treeData.links();

            this.addLinksData.map(item => {
                if (!item.source.data || !item.target.data) {
                    this.nodesData.forEach(value => {
                        if (
                            item.source.depth == value.depth &&
                            item.source.id == value.data.id
                        ) {
                            item.source = value;
                        }
                        if (
                            item.target.depth == value.depth &&
                            item.target.id == value.data.id
                        ) {
                            item.target = value;
                        }
                    });
                }
            });

            for (let n = 0; n < this.addLinksData.length; n++) {
                let isSource = false,
                    isTarget = false,
                    source = this.addLinksData[n].source,
                    taget = this.addLinksData[n].target;
                this.nodesData.forEach(d => {
                    if (
                        d.depth == source.depth &&
                        d.data.id == source.data.id
                    ) {
                        this.addLinksData[n].source = d;
                        isSource = true;
                    }
                    if (d.depth == taget.depth && d.data.id == taget.data.id) {
                        this.addLinksData[n].target = d;
                        isTarget = true;
                    }
                });
                if (!(isSource && isTarget)) {
                    this.addLinksData.splice(n--, 1);
                }
            }

            this.createNodeAndLine();
        },
        //初始化数据
        initNodeAndLine(graphData) {
            let { nodes, links } = graphData;

            this.linesData = [...links];

            this.linksMap = this.getLinksMap(links);

            // 生成 nodes map
            this.nodesMap = this.getNodesMap(nodes);

            //节点数据
            this.nodesData = nodes;

            //连线数据
            this.linksData = this.getLinksData(links);
        },

        //创建节点和边
        createNodeAndLine() {
            const shelf = this;
            // 节点g
            var enterNode = this.nodeCircleGroup
                .selectAll(".node")
                .data(this.nodesData)
                .enter()
                .append("g")
                .style("cursor", "pointer")
                .attr("class", "node")
                .attr("id", node => "node-" + node.id);

            //添加circle
            enterNode
                .append("circle")
                .style("fill", this.nodeConf.fillColor)
                .style("stroke", this.nodeConf.strokeColor)
                .style("stroke-width", 5)
                .attr("class", "node-circle")
                .attr("id", node => "node-circle-" + node.data.id)
                .attr("r", node => this.getRadius(node))
                .style("fill", d => {
                    //创建圆形图片
                    var defs = this.svg
                        .append("defs")
                        .attr("id", "imgdefs" + d.data.id);

                    var catpattern = defs
                        .append("pattern")
                        .attr("id", "catpattern" + d.data.id)
                        .attr("height", 1)
                        .attr("width", 1);

                    catpattern
                        .append("image")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", this.getRadius(d) * 2)
                        .attr("height", this.getRadius(d) * 2)
                        .attr("xlink:href", this.getImg(d));

                    return "url(#catpattern" + d.data.id + ")";
                });

            // 节点文字
            enterNode
                .append("text")
                .attr("class", "nodetext")
                .attr("id", node => "node-text-" + node.id)
                .style("font-size", this.nodeConf.textFontSzie)
                .style("font-weight", 400)
                .style("fill", () => this.nodeConf.textFillColor)
                .attr("text-anchor", "middle")
                .attr("dy", node => this.getRadius(node) + 10)
                .text(d => {
                    return d.data.sex
                        ? `${d.data.realName ? d.data.realName : ""}(${
                              d.data.sex
                          })`
                        : d.data.realName
                        ? d.data.realName
                        : "";
                });

            // 鼠标交互
            enterNode
                .on("mouseleave", () => {
                    this.deleteMenu();
                })
                .on("mousedown", function(currNode) {
                    if (shelf.menus.length && d3.event.button == 2) {
                        shelf.createMenu(this, currNode);
                    }
                })
                .on("click", currNode => {
                    this.nodeToggleClick(currNode);
                    if (this.isAddLine) {
                        if (this.addLineNodes.length > 1) {
                            this.addLineNodes.splice(0, 1);
                        }
                        this.addLineNodes.push(currNode);
                        if (this.addLineNodes.length == 2) {
                            var line = {
                                source: this.addLineNodes[0],
                                target: this.addLineNodes[1],
                                type: "add"
                            };
                            let isHave = this.checkAddLinkData(line);
                            if (isHave) {
                                this.$message.warning(
                                    "已存在添加关系，不能再添加"
                                );
                            } else {
                                this.dialogVisible = true;
                                this.title = "添加关系";
                                this.editLine = line;
                            }
                            this.addLineNodes = [];
                            d3.select(".movePath").remove();
                            this.clearStatus();
                        }
                        return;
                    }
                    this.$emit("nodeClick", currNode);
                });

            if (this.isMaker) {
                this.container
                    .append("marker")
                    .attr("id", "resolved")
                    .attr("markerUnits", "strokeWidth")
                    .style("fill", this.lineConf.strokeColor)
                    .attr("markerWidth", "6")
                    .attr("markerHeight", "6")
                    .attr("viewBox", "0 0 12 12")
                    .attr("refX", this.nodeConf.radius + 10)
                    .attr("refY", "6")
                    .attr("orient", "auto")
                    .append("path")
                    .style("stroke", this.lineConf.strokeColor)
                    .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2");
            }
            var enterLine = this.linkLineGroup
                .selectAll(".link")
                .data(this.linksData)
                .enter()
                .append("path")
                .attr("class", "link")
                .attr(
                    "d",
                    d3
                        .linkHorizontal()
                        .x(function(d) {
                            return d.y;
                        })
                        .y(function(d) {
                            return d.x;
                        })
                )
                .style("stroke", this.lineConf.strokeColor)
                .style("stroke-width", this.lineConf.strokeWidth)
                .style("cursor", "pointer")
                .style("fill", "none")
                .attr("stroke-dasharray", link =>
                    link.target.data.type == "add" ? "2 2" : "none"
                )
                .attr("marker-end", "url(#resolved)");

            //线事件
            enterLine.on("click", currNode => {
                this.lineClick(currNode);
            });

            var enterAddLine = this.linkLineGroup
                .selectAll(".addLink")
                .data(this.addLinksData)
                .enter();
            enterAddLine
                .append("path")
                .attr("class", "addLink")
                .attr("d", link => this.getAddlinkPath(link))
                .style("stroke", this.lineConf.strokeColor)
                .style("stroke-width", this.lineConf.strokeWidth)
                .style("cursor", "pointer")
                .style("fill", "none")
                .attr("stroke-dasharray", "2 2");

            var enterAddText = this.lineTextGroup
                .selectAll(".addLinetext")
                .data(this.addLinksData)
                .enter()
                .append("g")
                .attr("class", "addLinetext")
                .style("cursor", "pointer")
                .on("click", link => this.addTextClick(link));

            enterAddText
                .append("rect")
                .attr("height", this.labelConf.height)
                .attr("width", link => this.getLabelWidth(link.label))
                .attr("rx", "5")
                .attr("ry", "5")
                .attr("fill", "#fff")
                .style("stroke", "#c9c9c9")
                .style("stroke-width", 1);

            enterAddText
                .append("text")
                .style("font-size", this.labelConf.fontSize)
                .attr("fill", "#1490FF")
                .attr("dy", 17)
                .attr("dx", 3)
                .text(link => link.label);

            // 连线的文字
            var enterLineText = this.lineTextGroup
                .selectAll(".linetext")
                .data(this.linksData)
                .enter()
                .append("g")
                .attr("class", "linetext")
                .style("cursor", "pointer");
            enterLineText
                .append("rect")
                .attr("height", this.labelConf.height)
                .attr("width", line =>
                    this.getLabelWidth(this.getLabeltext(line))
                )
                .attr("rx", "5")
                .attr("ry", "5")
                .attr("fill", "#fff")
                .style("stroke", "#c9c9c9")
                .style("stroke-width", 1);
            enterLineText
                .append("text")
                .style("font-size", this.labelConf.fontSize)
                .attr("fill", line => this.getLabelColor(line))
                .attr("dy", 17)
                .attr("dx", 3)
                .text(link => this.getLabeltext(link));

            enterLineText.on("click", function(currNode) {
                shelf.lineTextClick(currNode, this);
            });

            this.bindNodeLine();
            this.tick();
        },

        //绑定数据
        bindNodeLine() {
            this.nodeCircle = this.nodeCircleGroup
                .selectAll(".node")
                .data(this.nodesData);

            this.linkLine = this.linkLineGroup
                .selectAll(".link")
                .data(this.linksData);

            this.lineText = this.lineTextGroup
                .selectAll(".linetext")
                .data(this.linksData);

            this.addLinks = this.linkLineGroup
                .selectAll(".addLink")
                .data(this.addLinksData);

            this.addLineText = this.lineTextGroup
                .selectAll(".addLinetext")
                .data(this.addLinksData);

            this.nodeCircle.exit().remove();
            this.linkLine.exit().remove();
            this.lineText.exit().remove();
            this.addLinks.exit().remove();
            this.addLineText.exit().remove();

            this.updateSvg();
        },

        //更新数据
        updateSvg() {
            this.addLineText
                .select("rect")
                .attr("width", link => this.getLabelWidth(link.label));
            this.addLineText.select("text").text(link => link.label);

            this.lineText
                .select("rect")
                .attr("width", link =>
                    this.getLabelWidth(this.getLabeltext(link))
                );
            this.lineText.select("text").text(link => this.getLabeltext(link));

            this.nodeCircle.attr("id", node => "node-" + node.id);

            this.nodeCircle.select(".expand").remove();

            this.nodeCircle
                .filter(node => node.children)
                .append("image")
                .attr("class", "expand")
                .attr("width", 16)
                .attr("x", 13)
                .attr("y", 5)
                .attr("xlink:href", jian)
                .style("cursor", "pointer")
                .on("click", node => {
                    this.deleteNoChildrenNode(node, this.graphData);
                    this.initData();
                    d3.event.stopPropagation();
                });

            this.nodeCircle
                .select("circle")
                .attr("id", node => "node-circle-" + node.data.id)
                .style("fill", d => {
                    //创建圆形图片
                    var defs = this.svg
                        .append("defs")
                        .attr("id", "imgdefs" + d.data.id);

                    var catpattern = defs
                        .append("pattern")
                        .attr("id", "catpattern" + d.data.id)
                        .attr("height", 1)
                        .attr("width", 1);

                    catpattern
                        .append("image")
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr("width", this.getRadius(d) * 2)
                        .attr("height", this.getRadius(d) * 2)
                        .attr("xlink:href", this.getImg(d));

                    return "url(#catpattern" + d.data.id + ")";
                });

            this.nodeCircle
                .select("text")
                .attr("id", node => "node-text-" + node.id)
                .text(d => {
                    return d.data.sex
                        ? `${d.data.realName ? d.data.realName : ""}(${
                              d.data.sex
                          })`
                        : d.data.realName
                        ? d.data.realName
                        : "";
                });

            this.linkLine.attr("stroke-dasharray", link =>
                link.target.data.type == "add" ? "2 2" : "none"
            );
            this.lineText
                .select("rect")
                .attr("width", line =>
                    this.getLabelWidth(this.getLabeltext(line))
                );

            this.lineText
                .select("text")
                .attr("fill", line => this.getLabelColor(line))
                .text(link => this.getLabeltext(link));
        },

        zoomStart() {
            this.zoomTransform = cloneDeep(d3.event.transform);
        },
        //缩放和平移
        zoomFn() {
            const { transform } = d3.event;
            this.container.attr("transform", transform);
        },

        zoomEnd() {
            let transform = cloneDeep(d3.event.transform);
            this.addStep({
                type: "zoom",
                transformStart: this.zoomTransform,
                transformEnd: transform
            });
        },

        // 更新位置
        tick() {
            const shelf = this;
            this.nodeCircle.attr(
                "transform",
                node => "translate(" + node.y + "," + node.x + ")"
            );
            // 连线路径
            this.linkLine.attr(
                "d",
                d3
                    .linkHorizontal()
                    .x(function(d) {
                        return d.y;
                    })
                    .y(function(d) {
                        return d.x;
                    })
            );
            // 连线文字位置
            this.lineText.attr("transform", function(link) {
                return shelf.getLineText(link);
            });

            this.addLinks.attr("d", link => this.getAddlinkPath(link));

            this.addLineText.attr("transform", function(link) {
                return shelf.getAddLinkText(link);
            });
        },

        //生成节点map
        getNodesMap(nodes) {
            const hash = {};
            nodes.map(value => {
                value.weight = 0;
                this.linesData.map(line => {
                    if (line.source == value.id || line.target == value.id) {
                        value.weight += 1;
                    }
                });
                hash[value.id] = value;
            });

            return hash;
        },

        //生成节点map
        getLinksMap(links) {
            const hash = {};
            links.map(value => {
                const key = value.source + "-" + value.target;
                hash[key] = value;
            });
            return hash;
        },

        //生产连线数据
        getLinksData(links) {
            let data = [];
            links.map(value => {
                let item = { ...value };
                if (item.id == undefined) {
                    item.id = "line" + this.addId;
                    this.addId += 1;
                }
                item.source = this.nodesMap[item.source];
                item.target = this.nodesMap[item.target];
                data.push(item);
            });
            return data;
        },

        getAddlinkPath(link) {
            let sx = link.source.y;
            let tx = link.target.y;
            let sy = link.source.x;
            let ty = link.target.x;
            return "M" + sx + "," + sy + " L" + tx + "," + ty;
        },

        getAddLinkText(d) {
            let x0 = d.source.y,
                y0 = d.source.x,
                x2 = d.target.y,
                y2 = d.target.x,
                x,
                y,
                k = (y2 - y0) / (x2 - x0),
                b = y2 - k * x2;
            if (x0 < x2) {
                x = x0 + (x2 - x0) * 0.65;
            } else {
                x = x2 + (x0 - x2) * 0.65;
            }
            y = k * x + b - this.labelConf.height / 2;
            x = x - this.getLabelWidth(d.label) / 2;
            return "translate(" + x + "," + y + ")";
        },

        getLineTextDx(d) {
            const sr = this.nodeConf.radius;
            const sx = d.source.x;
            const sy = d.source.y;
            const tx = d.target.x;
            const ty = d.target.y;

            const distance = Math.sqrt(
                Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2)
            );

            // const textLength = d.label.length;
            const textLength = d.label.toString().length;
            const deviation = 8; // 调整误差
            const dx =
                (distance - sr - textLength * this.lineConf.lineTextFontSize) /
                    2 +
                deviation;

            return dx;
        },

        getLineText(line) {
            let x =
                    (line.source.y + line.target.y) / 2 -
                    this.getLabelWidth(this.getLabeltext(line)) / 2,
                y = (line.source.x + line.target.x - this.labelConf.height) / 2;

            return "translate(" + x + "," + y + ")";
        },

        getLabelWidth(label) {
            var regPos = new RegExp("^[0-9]*$");
            const textLength = label.toString().length;
            label = label + "";
            let l = 0;
            for (let n = 0; n < textLength; n++) {
                if (regPos.test(label[n])) {
                    l = l + 7;
                } else {
                    l += this.labelConf.fontSize;
                }
            }
            return l + 6;
        },

        getLabeltext(link) {
            if (link.target.data.type == "add") {
                return link.target.data.relation;
            }
            return link.target.data.relation.intimacy;
        },

        getLabelColor(link) {
            let color = "";
            let s = parseInt(link.target.data.relation.intimacy);
            if (s < 61) {
                color = "#1490FF";
            }
            if (s > 60 && s < 81) {
                color = "#22B0B5";
            }
            if (s > 80) {
                color = "#E02020";
            }
            return color;
        },

        //节点选中时的状态
        nodeToggleClick(currNode) {
            const shelf = this;
            this.nodeCircle.each(function(node) {
                if (
                    node.data.id == currNode.data.id &&
                    node.depth == currNode.depth
                ) {
                    d3.select(this)
                        .select("circle")
                        .style("stroke", shelf.nodeConf.clickFillColor)
                        .style("stroke-width", 5);
                } else {
                    d3.select(this)
                        .select("circle")
                        .style("stroke", "none")
                        .style("stroke-width", 0);
                }
            });
        },

        //边点击事件
        lineClick(line) {
            this.$emit("lineClick", line);
        },

        //线文字点击
        lineTextClick(line) {
            if (line.target.data.type != "add") {
                this.$emit("lineClick", line);
            } else {
                this.addNodeTextClick(line);
            }
        },

        //创建鼠标右键菜单
        createMenu(th, node) {
            const shelf = this;
            var menu = d3
                .select(th)
                .append("g")
                .attr("id", "graphNodeMenu");
            var arc_generator = d3
                .arc()
                .innerRadius(this.menusConf.innerRadius)
                .outerRadius(this.menusConf.outerRadius);

            var angle_data = d3.pie().value(d => {
                return d.proportion;
            });

            var pieg = menu
                .selectAll("g")
                .data(angle_data(this.menus))
                .enter()
                .append("g")
                .attr("class", "pie")
                .style("fill", this.menusConf.fillColor)
                .on("click", d => {
                    shelf.menusClickNode = node;
                    this.menuClick(d.data.event);
                    this.deleteMenu();
                    d3.event.stopPropagation();
                })
                .on("mouseover", function() {
                    d3.select(this).style(
                        "fill",
                        shelf.menusConf.hoverFillColor
                    );
                })
                .on("mouseleave", function() {
                    d3.select(this).style("fill", shelf.menusConf.fillColor);
                });

            //pie
            pieg.append("path")
                .attr("d", arc_generator)
                .style("stroke", "rgba(255,255,255)")
                .style("stroke-width", 4)
                .on("click", d => {
                    shelf.menusClickNode = node;
                    this.menuClick(d.data.event);
                    this.deleteMenu();
                    d3.event.stopPropagation();
                });

            //text
            pieg.append("text")
                .text(d => {
                    return d.data.event;
                })
                .attr("transform", d => {
                    var deg =
                        (((d.startAngle + d.endAngle) / Math.PI) * 180) / 2;
                    return (
                        "translate(" +
                        arc_generator.centroid(d) +
                        ") rotate(" +
                        deg +
                        ")"
                    );
                })
                .attr("text-anchor", "middle")
                .attr("dy", "5")
                .style("fill", this.menusConf.textFill)
                .attr("class", "pieText");
        },

        //节点菜单点击
        menuClick(type) {
            switch (type) {
                case "扩展":
                    this.$emit("expand", this.menusClickNode.data.id);
                    break;
                case "手动扩展":
                    this.$emit("handExpand");
                    break;
                case "收起":
                    this.deleteNodeChildren(
                        this.menusClickNode,
                        this.graphData
                    );
                    this.initData();
                    break;
            }
        },

        //删除邮件菜单
        deleteMenu() {
            d3.selectAll("#graphNodeMenu").remove();
        },

        //删除节点
        deleteNodes(nodes = [], lines = [], isStep = true) {
            const shelf = this;
            let deleteNodes = [],
                deleteLines = [];

            //删除图形相关元素
            nodes.forEach(node => {
                this.nodeCircle.filter(function(d) {
                    if (d.id == node.id) {
                        d3.select(this).remove();
                    }
                });
                this.linkLine.filter(function(line) {
                    if (
                        line.source.id == node.id ||
                        line.target.id == node.id
                    ) {
                        d3.select(this).remove();
                    }
                });
                this.lineText.filter(function(line) {
                    if (
                        line.source.id == node.id ||
                        line.target.id == node.id
                    ) {
                        d3.select(this).remove();
                    }
                });
            });

            lines.forEach(link => {
                this.linkLine.filter(function(line) {
                    if (link.id == line.id) {
                        d3.select(this).remove();
                    }
                });
                this.lineText.filter(function(line) {
                    if (link.id == line.id) {
                        d3.select(this).remove();
                    }
                });
            });

            //点删除数据
            for (let n = 0; n < shelf.nodesData.length; n++) {
                let index = nodes.findIndex(d => d.id == shelf.nodesData[n].id);
                if (index != -1) {
                    deleteNodes.push(shelf.nodesData[n]);
                    shelf.nodesData.splice(n--, 1);
                }
            }
            for (let n = 0; n < shelf.linksData.length; n++) {
                let index = nodes.findIndex(
                    d =>
                        shelf.linksData[n].source.id == d.id ||
                        shelf.linksData[n].target.id == d.id
                );
                if (index != -1) {
                    shelf.linksData.splice(n--, 1);
                }
            }
            for (let n = 0; n < shelf.linesData.length; n++) {
                let index = nodes.findIndex(
                    d =>
                        shelf.linesData[n].source == d.id ||
                        shelf.linesData[n].target == d.id
                );
                if (index != -1) {
                    deleteLines.push(shelf.linesData[n]);
                    shelf.linesData.splice(n--, 1);
                }
            }

            //线删除数据
            for (let n = 0; n < shelf.linksData.length; n++) {
                let index = lines.findIndex(d => {
                    return d.id == shelf.linksData[n].id;
                });
                if (index != -1) {
                    shelf.linksData.splice(n--, 1);
                }
            }
            for (let n = 0; n < shelf.linesData.length; n++) {
                let index = lines.findIndex(
                    d =>
                        d.source == shelf.linesData[n].source &&
                        d.target == shelf.linesData[n].target
                );
                if (index != -1) {
                    shelf.linesData.splice(n--, 1);
                }
            }
            if (!isStep) {
                this.addStep({
                    type: "delete",
                    nodes: deleteNodes,
                    links: deleteLines
                });
            }

            this.bindNodeLine();
        },

        //添加节点和线
        addNodeLine(nodes, lines, isStep) {
            let addNodes = [],
                addLinks = [];
            nodes.map(value => {
                let index = this.nodesData.findIndex(n => n.id == value.id);
                if (index == -1) {
                    this.nodesData.push(value);
                    addNodes.push(value);
                } else {
                    this.$message.warning("对象" + value.nodeName + "已存在");
                }
            });
            lines.map(value => {
                let isPush = true;
                this.linesData.map(l => {
                    let source = value.source,
                        target = value.target,
                        source0 = l.source,
                        target0 = l.target;
                    if (
                        value.type == "add" &&
                        l.type == "add" &&
                        ((source == source0 && target == target0) ||
                            (source == target0 && target == source0))
                    ) {
                        isPush = false;
                    }
                    if (
                        value.type != "add" &&
                        l.type != "add" &&
                        ((source == source0 && target == target0) ||
                            (source == target0 && target == source0))
                    ) {
                        isPush = false;
                    }
                });
                if (isPush) {
                    this.linesData.push(value);
                    addLinks.push(value);
                }
            });
            this.initNodeAndLine({
                nodes: this.nodesData,
                links: this.linesData
            });
            if (!isStep) {
                this.addStep({
                    type: "add",
                    nodes: addNodes,
                    links: addLinks
                });
            }
        },

        //创建事件监听
        createEventListener() {
            const shelf = this;
            document.addEventListener("keydown", shelf.keydownEvent);
            document.addEventListener("keyup", shelf.keyupEvent);
        },

        //监听键盘keydown事件
        keydownEvent(event) {
            const shelf = this;
            var e =
                event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 32) {
                shelf.isSpace = true;
                event.preventDefault();
                return false;
            }
            if (e && e.keyCode == 17) {
                shelf.isCtrl = true;
                event.preventDefault();
                return false;
            }
            if (e && e.keyCode == 90) {
                if (shelf.isCtrl) {
                    shelf.previousStep();
                }
            }
            if (e && e.keyCode == 89) {
                if (shelf.isCtrl) {
                    shelf.nextStep();
                }
            }
        },

        //监听键盘keydup事件
        keyupEvent(event) {
            const shelf = this;
            var e =
                event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 32) {
                shelf.isSpace = false;
            }
            if (e && e.keyCode == 17) {
                shelf.isCtrl = true;
            }
        },

        //头部工具栏操作
        toolbarClick(item) {
            if (item.type == "radio") {
                this.toolbarList.map(value => {
                    if (value.name != item.name && value.type == "radio") {
                        value.isCheck = false;
                    }
                    if (value.name == item.name) {
                        value.isCheck = !value.isCheck;
                    }
                });
            }
            this.isAddNode = false;
            this.isAddLine = false;
            this.isDeleteNodes = false;
            this.addLineNodes = [];
            this.clearStatus();
            switch (item.name) {
                case "添加节点":
                    this.isAddNode = item.isCheck;
                    break;
                case "添加关系":
                    this.isAddLine = item.isCheck;
                    break;
                case "删除节点":
                    this.isDeleteNodes = item.isCheck;
                    break;
                case "回到中心":
                    var zoom = d3.zoomTransform(this.svg.node()),
                        zoomStart = cloneDeep(zoom);
                    zoom.k = 1;
                    zoom.x = 0;
                    zoom.y = 0;
                    this.addStep({
                        type: "zoom",
                        transformStart: zoomStart,
                        transformEnd: cloneDeep(zoom)
                    });
                    d3.zoom().transform(this.svg, zoom);
                    this.container.attr("transform", zoom);
                    break;
                case "刷新":
                    this.emptyData();
                    this.createSvg();
                    break;
                case "筛选":
                    this.$emit("filterClick");
                    break;
            }
        },

        //左下角工具栏操作
        toolbarBottomClick(type) {
            switch (type) {
                case "全屏":
                    var fullDiv = document.getElementById("full");
                    this.fullscreen(fullDiv);
                    this.setWidthHeight();
                    break;
                case "退出全屏":
                    this.setWidthHeight();
                    this.fullscreen();
                    break;
                case "放大":
                    var zoom = d3.zoomTransform(this.svg.node()),
                        x = zoom.x,
                        y = zoom.y,
                        zoomStart = cloneDeep(zoom);
                    zoom.k =
                        zoom.k + 0.4 < this.scaleExtent[1]
                            ? zoom.k + 0.4
                            : this.scaleExtent[1];
                    zoom.x = x;
                    zoom.y = y;
                    this.addStep({
                        type: "zoom",
                        transformStart: zoomStart,
                        transformEnd: cloneDeep(zoom)
                    });
                    d3.zoom().transform(this.svg, zoom);
                    this.container.attr("transform", zoom);
                    break;
                case "缩小":
                    var zoom = d3.zoomTransform(this.svg.node()),
                        x = zoom.x,
                        y = zoom.y,
                        zoomStart = cloneDeep(zoom);
                    zoom.k =
                        zoom.k - 0.2 > this.scaleExtent[0]
                            ? zoom.k - 0.2
                            : this.scaleExtent[0];
                    zoom.x = x;
                    zoom.y = y;
                    this.addStep({
                        type: "zoom",
                        transformStart: zoomStart,
                        transformEnd: cloneDeep(zoom)
                    });
                    d3.zoom().transform(this.svg, zoom);
                    this.container.attr("transform", zoom);
                    break;
                case "上一步":
                    this.previousStep();
                    break;
                case "下一步":
                    this.nextStep();
                    break;
            }
        },

        //清楚状态
        clearStatus() {
            if (this.nodeCircle) {
                this.nodeCircle
                    .select("circle")
                    .style("stroke", "none")
                    .style("stroke-width", 0);
                this.nodeCircle.style("opacity", 1);
                this.linkLine.style("opacity", 1);
                this.lineText.style("opacity", 1);
            }
        },

        //全屏
        fullscreen(div) {
            if (!div) {
                // 退出全屏
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                // 进入全屏
                if (div.requestFullscreen) {
                    div.requestFullscreen();
                } else if (div.webkitRequestFullScreen) {
                    div.webkitRequestFullScreen();
                } else if (div.mozRequestFullScreen) {
                    div.mozRequestFullScreen();
                } else if (div.msRequestFullscreen) {
                    div.msRequestFullscreen();
                }
            }
        },

        tooltipFullscreen(name) {
            var userAgent = navigator.userAgent,
                isFull;
            if (userAgent.indexOf("Firefox") > -1) {
                //判断是否Firefox浏览器
                isFull = document.mozFullScreen;
            }
            if (userAgent.indexOf("Chrome") > -1) {
                isFull = document.webkitIsFullScreen;
            }
            if (isFull) {
                setTimeout(() => {
                    var htmls = document.getElementsByClassName(name);
                    for (let n = 0; n < htmls.length; n++) {
                        document.getElementById("main").appendChild(htmls[n]);
                    }
                }, 100);
            } else {
                d3.select("#main")
                    .selectAll("." + name)
                    .remove();
            }
        },

        //监听框选事件
        selectEvent() {
            let start = [0, 0],
                end = [0, 0],
                isdown = false,
                isMove = false;

            d3.select("#main")
                .select("svg")
                .on("mousedown", () => {
                    let x = this.getLeft(document.getElementById("main"));
                    let y = this.getTop(document.getElementById("main"));

                    if (d3.event.button == 0 && this.isDeleteNodes) {
                        start = [d3.event.clientX - x, d3.event.clientY - y];
                        isdown = true;
                        d3.select(".selectBox").remove();
                        d3.select("#main svg")
                            .append("rect")
                            .attr("width", 0)
                            .attr("height", 0)
                            .attr("class", "selectBox")
                            .attr("x", start[0])
                            .attr("y", start[1])
                            .style("stroke", "red")
                            .style("stroke-width", 1)
                            .style("stroke-dasharray", "3 2")
                            .style("fill", "none");
                    }
                })
                .on("mousemove", () => {
                    if (isdown) {
                        let x = this.getLeft(document.getElementById("main"));
                        let y = this.getTop(document.getElementById("main"));
                        isMove = true;
                        end = [d3.event.clientX - x, d3.event.clientY - y];
                        var w = end[0] - start[0],
                            h = end[1] - start[1];
                        d3.select(".selectBox")
                            .attr("width", Math.abs(w))
                            .attr("height", Math.abs(h));
                        if (w >= 0 && h < 0) {
                            d3.select(".selectBox")
                                .attr("x", start[0])
                                .attr("y", end[1]);
                        } else if (w < 0 && h >= 0) {
                            d3.select(".selectBox")
                                .attr("x", end[0])
                                .attr("y", start[1]);
                        } else if (w < 0 && h < 0) {
                            d3.select(".selectBox")
                                .attr("x", end[0])
                                .attr("y", end[1]);
                        }
                    }
                })
                .on("mouseup", () => {
                    if (d3.event.button == 0) {
                        this.findSelectNode(start, end);
                        isdown = false;
                        isMove = false;
                        start = [0, 0];
                        end = [0, 0];
                        d3.select(".selectBox").remove();
                    }
                })
                .on("mouseleave", () => {
                    if (isdown == true) {
                        isdown = false;
                        start = [0, 0];
                        end = [0, 0];
                        d3.select(".selectBox").remove();
                    }
                });
        },

        //查找选中的点
        findSelectNode(start, end) {
            let boxX,
                boxY,
                hideList = [],
                zoom = d3.zoomTransform(this.svg.node()),
                sacle = zoom.k,
                translate = [zoom.x, zoom.y];
            if (start[0] <= end[0]) {
                boxX = [start[0], end[0]];
            } else {
                boxX = [end[0], start[0]];
            }
            if (start[1] <= end[1]) {
                boxY = [start[1], end[1]];
            } else {
                boxY = [end[1], start[1]];
            }

            this.nodesData.map(node => {
                var isX = false,
                    isY = false;
                var outW = this.nodeConf.radius * sacle;
                var x = node.x * sacle + translate[0];
                var y = node.y * sacle + translate[1];
                var minx = x - outW,
                    maxx = x + outW,
                    maxy = y + outW,
                    miny = y - outW;
                if (minx > boxX[1]) {
                    isX = false;
                } else if (maxx < boxX[0]) {
                    isX = false;
                } else {
                    isX = true;
                }
                if (miny > boxY[1]) {
                    isY = false;
                } else if (maxy < boxY[0]) {
                    isY = false;
                } else {
                    isY = true;
                }
                if (isX && isY) {
                    hideList.push(node);
                    return true;
                } else {
                    return false;
                }
            });
            if (hideList.length > 0) {
                this.deleteNodes(hideList, [], true);
            }
        },

        //自定义删除时停止zoom事件
        stopZoom() {
            if (this.isDeleteNodes) {
                this.svg.on("mousedown.zoom", null);
                this.svg.on("mousemove.zoom", null);
                this.svg.on("dblclick.zoom", null);
                this.svg.on("touchstart.zoom", null);
                this.svg.on("wheel.zoom", null);
                this.svg.on("mousewheel.zoom", null);
            } else {
                this.svg.call(this.zoom);
            }
        },

        //清空数据和图形
        emptyData() {
            //节点、连线相关数据
            this.nodesData = [];
            this.linksData = [];
            this.addLinksData = [];
            this.graphData = {};
            this.dragNodeX = "";
            this.dragNodeY = "";
            this.isAddNode = false;
            this.isAddLine = false;
            this.isDeleteNodes = false;
            this.addLineNodes = [];
            this.stepList = [];
            this.stepIndex = "end";
            d3.select("#main")
                .select("svg")
                .remove();
        },

        //添加操作步骤
        addStep(step) {
            if (this.stepIndex == "start") {
                this.stepList = [];
                this.stepIndex = "end";
            }
            if (this.stepList[this.stepIndex]) {
                this.stepList.splice(
                    this.stepIndex,
                    this.stepList.length - this.stepIndex
                );
            }
            this.stepList.push(step);
        },

        //上一步
        previousStep() {
            if (!this.stepList.length) {
                return;
            }
            this.stepIndex =
                this.stepIndex == "end"
                    ? this.stepList.length - 1
                    : this.stepIndex;
            if (this.stepIndex != "start") {
                let step = this.stepList[this.stepIndex];
                switch (step.type) {
                    case "add":
                        this.deleteNodes(step.nodes, step.links, true);
                        break;
                    case "delete":
                        this.addNodeLine(step.nodes, step.links, true);
                        break;
                    case "zoom":
                        d3.zoom().transform(this.svg, step.transformStart);
                        this.container.attr("transform", step.transformStart);
                        break;
                    case "drag":
                        step.nodes.map(value => {
                            value.x = value.x - step.endPos.x + step.startPos.x;
                            value.y = value.y - step.endPos.y + step.startPos.y;
                        });
                        this.tick();
                        break;
                }
                this.stepIndex =
                    this.stepIndex > 0 ? this.stepIndex - 1 : "start";
            }
        },

        //下一步
        nextStep() {
            if (!this.stepList.length || this.stepIndex == "end") {
                return;
            }
            let step;
            this.stepIndex = this.stepIndex == "start" ? 0 : this.stepIndex;
            step = this.stepList[this.stepIndex];
            switch (step.type) {
                case "add":
                    this.addNodeLine(step.nodes, step.links, true);
                    break;
                case "delete":
                    this.deleteNodes(step.nodes, step.links, true);
                    break;
                case "zoom":
                    d3.zoom().transform(this.svg, step.transformEnd);
                    this.container.attr("transform", step.transformEnd);
                    break;
                case "drag":
                    step.nodes.map(value => {
                        value.x = value.x + step.endPos.x - step.startPos.x;
                        value.y = value.y + step.endPos.y - step.startPos.y;
                    });
                    this.tick();
                    break;
            }
            this.stepIndex = this.stepList[this.stepIndex + 1]
                ? this.stepIndex + 1
                : "end";
        },

        toolbarBottomTooltip(name) {
            var tip = name;
            if (name == "上一步") {
                if (!this.stepList.length || this.stepIndex == "start") {
                    tip = "无上一步";
                }
            }
            if (name == "下一步") {
                if (!this.stepList.length || this.stepIndex == "end") {
                    tip = "无下一步";
                }
            }
            return tip;
        },

        getImg(node) {
            let ob = "";
            if (node.data.objectType == "1") {
                ob = node.data.nodeType + "" + node.data.objectType;
                return this.imgs[ob] ? this.imgs[ob].img : weizhi;
            } else {
                ob = node.data.nodeType;
                return this.imgs[ob] ? this.imgs[ob].img : weizhi;
            }
        },

        getRadius() {
            return this.nodeConf.radius;
        },

        tooltipClick(type) {
            const shelf = this;
            this.nodeCircle.each(function(node) {
                let t =
                    node.data.objectType == 1
                        ? node.data.nodeType + "" + node.data.objectType
                        : node.data.nodeType;
                if (t == type) {
                    d3.select(this)
                        .select("circle")
                        .style("stroke", shelf.nodeConf.clickFillColor)
                        .style("stroke-width", 5);
                } else {
                    d3.select(this)
                        .select("circle")
                        .style("stroke", "none")
                        .style("stroke-width", 0);
                }
            });
        },

        addNode(node, data, addData) {
            if (data.id == node.data.id && node.depth == data.depth) {
                data.condition = {
                    ...this.condition,
                    idCard: data.id,
                    level: data.depth,
                    nodeId: data.id
                };
                if (data.children && data.children.length) {
                    data.children.map(value => {
                        if (value.type == "add") {
                            let index = addData.findIndex(
                                item => item.id == value.id
                            );
                            if (index != -1) {
                                addData[index].children = value.children;
                                addData[index].depth = data.depth + 1;
                                this.addLinksData.push({
                                    source: data,
                                    target: addData[index],
                                    label: value.relationLabel
                                        ? value.relationLabel
                                        : value.relation
                                });
                            }
                            value.type = "";
                        }
                    });
                }
                // data.children = [...addData];
            } else {
                if (data.children && data.children.length) {
                    data.children.map(value => {
                        this.addNode(node, value, addData);
                    });
                }
            }
        },

        deleteNodeChildren(node, data) {
            if (data.id == node.data.id && node.depth == data.depth) {
                if (!data.children || data.children.length == 0) {
                    this.$message("该节点无下级节点");
                }
                data.children = null;
            } else {
                if (data.children && data.children.length) {
                    data.children.map(value => {
                        this.deleteNodeChildren(node, value);
                    });
                }
            }
        },

        deleteNoChildrenNode(node, data) {
            if (data.id == node.data.id && node.depth == data.depth) {
                this.checkChildren(data.children);
            } else {
                if (data.children && data.children.length) {
                    data.children.map(value => {
                        this.deleteNoChildrenNode(node, value);
                    });
                }
            }
        },

        checkChildren(children) {
            for (let n = 0; n < children.length; n++) {
                if (children[n].children && children[n].children.length == 0) {
                    children[n].children = null;
                }
                if (!children[n].children) {
                    children.splice(n--, 1);
                }
            }
        },

        checkAddLinkData(link) {
            let is = false;
            let sou = link.source.data ? link.source.data : link.source,
                tar = link.target.data ? link.target.data : link.target;
            this.addLinksData.map(value => {
                let s = value.source.data,
                    t = value.target.data;
                if (
                    sou.id == s.id &&
                    sou.depth == s.depth &&
                    tar.id == t.id &&
                    t.depth == tar.depth
                ) {
                    is = true;
                }
                if (
                    sou.id == t.id &&
                    sou.depth == t.depth &&
                    tar.id == s.id &&
                    s.depth == tar.depth
                ) {
                    is = true;
                }
            });
            return is;
        },

        setDepth(data, level = 0) {
            data.depth = level;
            if (data.children) {
                data.children.map(value => {
                    this.setDepth(value, level + 1);
                });
            }
        },

        addTextClick(link) {
            this.editLine = link;
            this.dialogVisible = true;
            this.title = "编辑关系";
            this.editForm.name = link.label;
        },
        addNodeTextClick(link) {
            if (link.target.data.type == "add") {
                this.editLine = link;
                this.dialogVisible = true;
                this.title = "编辑关系";
                this.editForm.name = link.target.data.relation;
            }
        },
        deleteAddLink() {
            for (let n = 0; n < this.addLinksData.length; n++) {
                let source = this.addLinksData[n].source,
                    taget = this.addLinksData[n].target,
                    s = this.editLine.source,
                    t = this.editLine.target;
                if (
                    source.depth == s.depth &&
                    source.data.id == s.data.id &&
                    taget.depth == t.depth &&
                    taget.data.id == t.data.id
                ) {
                    this.addLinksData.splice(n, 1);
                }
            }
            this.dialogVisible = false;
            this.editLine = {
                name: ""
            };
            this.bindNodeLine();
        },

        getConditonNode(data) {
            if (data.condition) {
                this.conditonNode.push(data.condition);
            }
            if (data.children) {
                data.children.map(value => {
                    this.getConditonNode(value);
                });
            }
        },

        getParams() {
            this.conditonNode = [];
            this.getConditonNode(this.graphData);
            let list = [],
                nodes = [];
            this.addLinksData.map(value => {
                list.push({
                    label: value.label,
                    source: {
                        depth: value.source.depth,
                        data: {
                            id: value.source.data.id,
                            idCard: value.source.data.idCard,
                            nodeId: value.source.data.nodeId
                        }
                    },
                    target: {
                        depth: value.target.depth,
                        data: {
                            id: value.target.data.id,
                            idCard: value.target.data.idCard,
                            nodeId: value.target.data.nodeId
                        }
                    }
                });
            });
            this.nodesData.map(value => {
                if (value.data.type == "add") {
                    nodes.push({
                        ...value.data,
                        depth: value.depth,
                        parent: {
                            id: value.parent.data.id,
                            depth: value.parent.depth
                        }
                    });
                }
            });
            return {
                links: cloneDeep(list),
                params: this.conditonNode,
                nodes
            };
        },

        setWidthHeight() {
            setTimeout(() => {
                this.width = document.getElementById("main").offsetWidth;
                this.height = document.getElementById("main").offsetHeight;
                d3.select("#main")
                    .select("svg")
                    .attr("width", this.width)
                    .attr("height", this.height);
                this.zoomOverlay
                    .attr("width", this.width)
                    .attr("height", this.height);
            }, 100);
        },

        handlAdd(node) {
            this.handlAddNode(this.menusClickNode, this.graphData, node);
            this.initData();
        },

        handlAddNode(node, data, addData) {
            var line = {
                source: node,
                target: "",
                type: "add",
                label: addData.relation
            };
            if (node.data.children) {
                let data = node.data;
                let index = data.children.findIndex(
                    item => item.id == addData.id
                );
                if (index == -1) {
                    data.children.push(addData);
                    line.target = addData;
                } else {
                    line.target = data.children[index];
                    let isHave = this.checkAddLinkData(line);
                    if (isHave) {
                        this.$message.warning("已存在添加关系，不能再添加");
                    } else {
                        this.addLinksData.push(line);
                    }
                }
            } else {
                node.data.children = [addData];
            }
            // if (data.id == node.data.id && node.depth == data.depth) {
            //     if (data.children) {
            //     } else {
            //         data.children = [addData];
            //     }
            // } else {
            //     if (data.children && data.children.length) {
            //         data.children.map(value => {
            //             this.addNode(node, value, addData);
            //         });
            //     }
            // }
        },

        setHistoryAddNode(node, data) {
            if (node.parent.depth == data.depth && node.parent.id == data.id) {
                if (data.children) {
                    let index = data.children.findIndex(v => v.id == node.id);
                    if (index != -1) {
                        var line = {
                            source: data,
                            target: "",
                            type: "add",
                            label: node.relation
                        };
                        data.children[index].children = node.children;
                        line.target = data.children[index];
                        let isHave = this.checkAddLinkData(line);
                        if (!isHave) {
                            this.addLinksData.push(line);
                        }
                    } else {
                        data.children.push(node);
                    }
                } else {
                    data.children = [node];
                }
            } else {
                if (data.children) {
                    data.children.map(value => {
                        this.setHistoryAddNode(node, value);
                    });
                }
            }
        },

        getLeft(e) {
            let offset = e.offsetLeft;
            if (e.offsetParent != null) offset += this.getLeft(e.offsetParent);
            return offset;
        },

        getTop(e) {
            let offset = e.offsetTop;
            if (e.offsetParent != null) offset += this.getTop(e.offsetParent);
            return offset;
        }
    },
    destroyed() {
        document.removeEventListener("keydown", this.keydownEvent);
        document.removeEventListener("keyup", this.keyupEvent);
    },
    watch: {
        graph() {
            if (!this.graphData.children && this.root.id) {
                this.graphData.condition = {
                    ...this.condition,
                    idCard: this.root.id,
                    level: 0,
                    nodeId: this.root.id
                };
                this.graphData.children = [...this.graph];
            } else {
                if (this.menusClickNode.data.children) {
                    this.graph.map(value => {
                        this.menusClickNode.data.children.map(item => {
                            if (item.type == "add" && value.id == item.id) {
                                value.type = "add";
                                value.relationLabel = item.relation;
                            }
                        });
                    });
                }
                this.menusClickNode.data.children = this.graph;
                this.addNode(this.menusClickNode, this.graphData, this.graph);
            }
            this.initData();
            console.log(this.linksData);
        },
        selectOptions() {
            if (this.selectOptions.value) {
                this.selectList = this.selectOptions.value;
            }
        },
        date() {
            this.dateValue = this.date;
        },
        dialogVisible() {
            if (!this.dialogVisible && this.$refs.ruleForm) {
                this.$refs.ruleForm.clearValidate();
                this.ruleForm = {
                    title: "",
                    desc: ""
                };
            }
        },
        root() {
            this.emptyData();
            this.graphData = {
                ...this.root
            };
            this.createSvg();
            this.initData();
        },

        historyData() {
            this.emptyData();
            this.createSvg();
            this.addLinksData = this.historyData.links;
            this.graphData = cloneDeep(this.historyData.data);
            this.graphData.objectType = "1";

            if (this.historyData.nodes.length) {
                this.historyData.nodes.map(value => {
                    this.setHistoryAddNode(value, this.graphData);
                });
            }
            if (this.graphData.id) {
                this.initData();
            }
        }
    }
};
</script>

<style scoped lang="scss">
@import "@/styles/basic-color.scss";
#full {
    background-color: #fff;
    background: url("../..//assets/image/wangge.jpg") repeat;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.graphBox {
    height: 100%;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
}
.radioButton {
    display: inline-block;
    background-color: #fff;
    padding: 6px 10px;
    border-radius: 3px;
    font-size: 16px;
    border: 1px solid silver;
    margin-left: 20px;
    cursor: pointer;
    &:active {
        color: $color-primary;
        border: 1px solid $color-primary;
    }
}
.is-active {
    color: $color-primary;
    border: 1px solid $color-primary;
}
.toolbar {
    padding: 10px 0;
    background-color: #fff;
    .toolbar-right {
        float: right;
        .block {
            display: inline-block;
            margin-right: 20px;
        }
    }
}
.toolbarBottom {
    position: absolute;
    bottom: 20px;
    left: 20px;
    background-color: #fff;
}
.search {
    position: absolute;
    top: 70px;
    left: 20px;
    border-radius: 5px;
}
.select {
    position: absolute;
    top: 70px;
    left: 190px;
    border-radius: 5px;
}
.info {
    position: absolute;
    top: 70px;
    right: 20px;
    height: calc(100% - 80px);
    overflow: hidden;
}
.tooltip {
    position: absolute;
    top: 126px;
    left: 20px;
    line-height: 25px;
    font-size: 12px;
    ul {
        margin: 0;
        padding: 0;
        li {
            height: 25px;
        }
    }
}
</style>
