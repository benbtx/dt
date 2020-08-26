<template>
    <imp-panel ref="impPanel">
        <template slot="body" titleA="事件频率列表" titleB="时空轴分析">
            <div style="padding:10px;height: calc(100% - 5px);">
                <!-- <div v-show="isShowToolbar" class="toolbar">
                    <div style="width: 100%;font-size:12px;">
                        <el-date-picker
                            size="mini"
                            style=" float: right;;padding-right:20px;width: 230px"
                            v-model="dskfx_time"
                            value-format="yyyy-MM-dd"
                            type="daterange"
                            range-separator="~"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            :picker-options="pickerOptions"
                            @change="dskfxTimeChange"
                        ></el-date-picker>

                        <el-select
                            size="mini"
                            style=" float: right;width:120px;padding-right:20px"
                            v-model="sjdvalue"
                            placeholder="前后1天"
                            @change="dskfxTimeChange"
                        >
                            <el-option
                                v-for="item in sjdoptions"
                                :key="item.intervalId"
                                :label="item.intervalName"
                                :value="item.intervalId"
                            ></el-option>
                        </el-select>
                        <span style=" float: right;margin-top:5px">-</span>
                        <el-select
                            size="mini"
                            style=" float: right;width:135px;"
                            v-model="zysjvalue"
                            placeholder="重要时间选择(例:春节)"
                            @change="dskfxTimeChange"
                        >
                            <el-option
                                v-for="item in zysjoptions"
                                :key="item.importantTimeId"
                                :label="item.importantTimeName"
                                :value="item.importantTimeId"
                            ></el-option>
                        </el-select>
                    </div>
                </div> -->

                <el-tabs
                    id="tab_sjkj"
                    style="  height: 100%;"
                    v-model="activeName"
                    type="card"
                    @tab-click="handleClick"
                >
                    <el-tab-pane label="时空轴分析" name="first">
                        <!-- dfgd -->
                        <!-- :prop_cztags="tags_sj_cz" -->
                        <collapse-tool-page
                            ref="collapsetoolpage"
                            :prop_tags="tags_sj"
                            @handleClose="handleClose"
                            @resetFilter="resetFilter"
                            @startAnalysis="confirmAnalysis"
                        >
                            <div slot="conditions">
                                <div>
                                    <kr-section-title
                                        title="特殊时段选择"
                                        :size="18"
                                    ></kr-section-title>
                                    <el-checkbox
                                        :indeterminate="isIndeterminate_jr"
                                        v-model="checkAll_jr"
                                        @change="handleCheckAllChange_jr"
                                        >全选</el-checkbox
                                    >

                                    <el-checkbox-group
                                        ref="wd"
                                        style="margin:20px 0px 0px 20px;display: inline-block"
                                        v-model="jr"
                                        @change="handleCheckedWDChange_jr"
                                    >
                                        <el-checkbox
                                            v-for="item in zysjoptions"
                                            :label="item.importantTimeName"
                                            :key="item.importantTimeId"
                                            @change="handleChange_jr"
                                            >{{
                                                item.importantTimeName
                                            }}</el-checkbox
                                        >
                                    </el-checkbox-group>

                                    <el-select
                                        size="mini"
                                        style="width:120px;margin-left:20px;padding-right:20px"
                                        v-model="sjdvalue"
                                        placeholder="前后1天"
                                        @change="dskfxTimeChange"
                                    >
                                        <el-option
                                            v-for="item in sjdoptions"
                                            :key="item.intervalId"
                                            :label="item.intervalName"
                                            :value="item.intervalId"
                                        ></el-option>
                                    </el-select>

                                    <kr-section-title
                                        title="维度选择"
                                        :size="18"
                                    ></kr-section-title>

                                    <el-checkbox
                                        :indeterminate="isIndeterminate"
                                        v-model="checkAll"
                                        @change="handleCheckAllChange"
                                        >全选</el-checkbox
                                    >

                                    <el-checkbox-group
                                        ref="wd"
                                        style="margin:20px 0px 0px 20px;display: inline-block"
                                        v-model="checkedSJLX_sj"
                                        @change="handleCheckedWDChange"
                                    >
                                        <el-checkbox
                                            v-for="item in sjlxdata"
                                            :label="item.name"
                                            :key="item.value"
                                            @change="handleChange"
                                            >{{ item.name }}</el-checkbox
                                        >
                                    </el-checkbox-group>
                                </div>
                            </div>

                            <div
                                slot="content"
                                style="height:100%"
                                :class="{
                                    noData: ymdata.length < 1
                                }"
                            >
                                <span
                                    v-if="ymdata.length < 1"
                                    class="noData_text"
                                    >暂无数据！</span
                                >

                                <div
                                    v-else
                                    style="height:100%;padding-top:10px"
                                >
                                    <!-- <div class="head">
                                        <el-card class="box-card">
                                            <el-row :gutter="1">
                                                <el-col
                                                    style="margin-bottom:5px"
                                                    v-for="item in sjlxdata"
                                                    :key="item.id"
                                                    :xs="12"
                                                    :sm="8"
                                                    :md="4"
                                                    :lg="3"
                                                    :xl="2"
                                                >
                                                    <el-button
                                                        type="info"
                                                        :class="{
                                                            sjlx_select:
                                                                item.status
                                                        }"
                                                        @click="search(item)"
                                                        >{{
                                                            item.name
                                                        }}</el-button
                                                    >
                                                </el-col>
                                            </el-row>
                                        </el-card>
                                    </div> -->
                                    <div class="content_skz">
                                        <div class="con-left">
                                            <div class="timeline">
                                                <div
                                                    class="timeparent"
                                                    v-for="item in ymdata"
                                                    :key="item.id"
                                                    :class="{
                                                        currentjd: item.status
                                                    }"
                                                >
                                                    <label
                                                        v-if="item.status"
                                                        class="timelabel"
                                                    ></label>
                                                    <span
                                                        class="timespan"
                                                    ></span>
                                                    <div
                                                        class="timediv"
                                                        @click="getTime(item)"
                                                    >
                                                        {{
                                                            item.month == ""
                                                                ? item.year
                                                                : item.month +
                                                                  "月"
                                                        }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="con-right">
                                            <div class="sjxz">
                                                <el-date-picker
                                                    size="mini"
                                                    style="left:-600px;padding-right:20px;width: 230px"
                                                    v-model="dskfx_time"
                                                    value-format="yyyy-MM-dd"
                                                    type="daterange"
                                                    range-separator="~"
                                                    start-placeholder="开始日期"
                                                    end-placeholder="结束日期"
                                                    :picker-options="
                                                        $pickerOptions
                                                    "
                                                    @change="dskfxTimeChange"
                                                ></el-date-picker>
                                            </div>
                                            <div
                                                id="parent"
                                                class="eventline"
                                                v-if="
                                                    ymdataInfo.items.length != 0
                                                "
                                            >
                                                <div class="eventparent">
                                                    <label
                                                        class="eventlabel eventlabel_event"
                                                    ></label>
                                                    <span
                                                        class="eventspan eventspan_event"
                                                    ></span>
                                                    <div
                                                        class="eventdiv eventdiv_ny"
                                                    >
                                                        <div
                                                            class="eventdiv_event"
                                                        >
                                                            {{
                                                                ymdataInfo.year +
                                                                    "-" +
                                                                    ymdataInfo.month
                                                            }}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div
                                                    v-for="item in ymdataInfo.items"
                                                    :key="item.id"
                                                    class="eventparent"
                                                >
                                                    <label
                                                        class="eventlabel"
                                                        :style="{
                                                            'border-color':
                                                                item.color
                                                        }"
                                                    ></label>
                                                    <span
                                                        class="eventspan eventspan_info"
                                                    ></span>
                                                    <div class="eventdiv">
                                                        <span
                                                            :style="{
                                                                color:
                                                                    item.color
                                                            }"
                                                        >
                                                            {{
                                                                item.eventTime +
                                                                    " " +
                                                                    item.name
                                                            }}
                                                            <span
                                                                v-if="
                                                                    item.label !=
                                                                        ''
                                                                "
                                                                style="    border: 1px solid #f0c180;  background: #fcf3e6;; color: #cc7e10;"
                                                                >{{
                                                                    item.label
                                                                }}</span
                                                            >
                                                        </span>
                                                        <div
                                                            class="eventdivconten"
                                                        >
                                                            <div
                                                                class="eventdivcontentimg"
                                                            >
                                                                <kr-icon
                                                                    class="kjpic"
                                                                    :icon="
                                                                        item.img
                                                                    "
                                                                    :color="
                                                                        item.color
                                                                    "
                                                                    :size="48"
                                                                ></kr-icon>
                                                            </div>
                                                            <div
                                                                class="eventdivcontentinfo"
                                                            >
                                                                <p
                                                                    style="font-weight:bold"
                                                                >
                                                                    {{
                                                                        item.title
                                                                    }}
                                                                </p>
                                                                <br />
                                                                <p
                                                                    v-html="
                                                                        item.content
                                                                    "
                                                                ></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <!-- <div v-else>暂无数据</div> -->
                                            <!-- <div
                                                v-else
                                                style="height: 100%;width: 100%;"
                                            >
                                                <div
                                                    class="noData"
                                                    style="height: 100%;width: 100%;"
                                                >
                                                    <span class="noData_text"
                                                        >暂无数据！</span
                                                    >
                                                </div>
                                            </div> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </collapse-tool-page>
                    </el-tab-pane>
                    <el-tab-pane
                        label="地图轨迹分析"
                        style="height:100%"
                        class="dtgj_second"
                        name="second"
                    >
                        <!-- dfg -->
                        <!-- :prop_cztags="tags_kj_cz" -->
                        <collapse-tool-page
                            ref="collapsetoolpage2"
                            :prop_tags="tags_kj"
                            @handleClose="handleClose"
                            @resetFilter="resetFilter"
                            @startAnalysis="confirmAnalysis"
                        >
                            <div slot="conditions">
                                <div>
                                    <kr-section-title
                                        title="轨迹类型"
                                        :size="18"
                                    ></kr-section-title>
                                    <el-checkbox
                                        :indeterminate="isIndeterminate_gj"
                                        v-model="checkAll_gj"
                                        @change="handleCheckAllChange_gj"
                                        >全选</el-checkbox
                                    >

                                    <el-checkbox-group
                                        ref="wd"
                                        style="margin:20px 0px 0px 20px;display: inline-block"
                                        v-model="gj"
                                        @change="handleCheckedWDChange_gj"
                                    >
                                        <el-checkbox
                                            v-for="item in this.selectOptions
                                                .options"
                                            :label="item.name"
                                            :key="item.value"
                                            @change="handleChange_gj"
                                            >{{ item.name }}</el-checkbox
                                        >
                                    </el-checkbox-group>

                                    <kr-section-title
                                        title="特殊时段选择"
                                        :size="18"
                                    ></kr-section-title>
                                    <el-checkbox
                                        :indeterminate="isIndeterminate_jr"
                                        v-model="checkAll_jr"
                                        @change="handleCheckAllChange_jr"
                                        >全选</el-checkbox
                                    >

                                    <el-checkbox-group
                                        ref="wd"
                                        style="margin:20px 0px 0px 20px;display: inline-block"
                                        v-model="jr"
                                        @change="handleCheckedWDChange_jr"
                                    >
                                        <el-checkbox
                                            v-for="item in zysjoptions"
                                            :label="item.importantTimeName"
                                            :key="item.importantTimeId"
                                            @change="handleChange_jr"
                                            >{{
                                                item.importantTimeName
                                            }}</el-checkbox
                                        >
                                    </el-checkbox-group>

                                    <el-select
                                        size="mini"
                                        style="width:120px;margin-left:20px;padding-right:20px"
                                        v-model="sjdvalue"
                                        placeholder="前后1天"
                                        @change="dskfxTimeChange"
                                    >
                                        <el-option
                                            v-for="item in sjdoptions"
                                            :key="item.intervalId"
                                            :label="item.intervalName"
                                            :value="item.intervalId"
                                        ></el-option>
                                    </el-select>

                                    <kr-section-title
                                        title="维度选择"
                                        :size="18"
                                    ></kr-section-title>

                                    <el-checkbox
                                        :indeterminate="isIndeterminate_kj"
                                        v-model="checkAll_kj"
                                        @change="handleCheckAllChange_kj"
                                        >全选</el-checkbox
                                    >

                                    <el-checkbox-group
                                        ref="wd"
                                        style="margin:20px 0px 0px 20px;display: inline-block"
                                        v-model="checkedSJLX_kj"
                                        @change="handleCheckedWDChange_kj"
                                    >
                                        <el-checkbox
                                            v-for="item in sjlxdata"
                                            :label="item.name"
                                            :key="item.value"
                                            @change="handleChange"
                                            >{{ item.name }}</el-checkbox
                                        >
                                    </el-checkbox-group>
                                </div>
                            </div>

                            <div slot="content" style="height: 100%;">
                                <div id="DSKmap" class="dskmap">
                                    <div class="dskmap-left">
                                        <!-- <el-card class="box-card">
                                            <el-row :gutter="1">
                                                <el-col
                                                    v-for="item in kjlxdata"
                                                    :key="item.id"
                                                    :xs="12"
                                                    :sm="12"
                                                    :md="12"
                                                    :lg="12"
                                                    :xl="12"
                                                    style="margin-top:5px"
                                                >
                                                    <el-button
                                                        type="info"
                                                        :class="{
                                                            sjlx_select:
                                                                item.status
                                                        }"
                                                        @click="searchkj(item)"
                                                        >{{
                                                            item.name
                                                        }}</el-button
                                                    >
                                                </el-col>
                                            </el-row>
                                        </el-card> -->
                                        <div class="timelb">
                                            <el-card
                                                class="box-card"
                                                style="    height: 100%;overflow-y: auto;"
                                                :class="{
                                                    noData_aside:
                                                        ymdataInfo2.length <= 1
                                                }"
                                            >
                                                <div
                                                    id="parent"
                                                    class="eventlinekjqy"
                                                >
                                                    <template
                                                        v-for="item in ymdataInfo2"
                                                    >
                                                        <div
                                                            v-if="
                                                                item.dataId ==
                                                                    null
                                                            "
                                                            :key="item.id"
                                                            class="eventlinechild"
                                                        >
                                                            <span
                                                                class="child_line_ny"
                                                            ></span>
                                                            <div
                                                                class="eventdiv child_content_ny"
                                                            >
                                                                <div
                                                                    class="eventdiv_event"
                                                                >
                                                                    {{
                                                                        item.name
                                                                    }}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div
                                                            v-else
                                                            :key="item.id"
                                                            class="eventlinechild"
                                                            :class="{
                                                                currentryjd:
                                                                    item.status
                                                            }"
                                                            @click="
                                                                btnZbdw(item)
                                                            "
                                                        >
                                                            <label
                                                                class="child_point"
                                                                :class="{
                                                                    currentrypoint:
                                                                        item.status
                                                                }"
                                                            ></label>
                                                            <span
                                                                class="child_line"
                                                            ></span>
                                                            <div
                                                                class="child_content"
                                                            >
                                                                <span>
                                                                    {{
                                                                        item.eventTime.split(
                                                                            "-"
                                                                        )[2]
                                                                    }}
                                                                </span>
                                                                <br />
                                                                <span>
                                                                    <kr-icon
                                                                        class="kjpic"
                                                                        :icon="
                                                                            item.img
                                                                        "
                                                                        :size="
                                                                            16
                                                                        "
                                                                        :color="
                                                                            item.color
                                                                        "
                                                                    ></kr-icon>
                                                                </span>

                                                                <span>
                                                                    {{
                                                                        item.name
                                                                    }}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </template>
                                                </div>
                                            </el-card>
                                        </div>
                                    </div>
                                    <div class="dskmap-right">
                                        <!-- :selectOptions="selectOptions" -->
                                        <kr-map
                                            ref="map"
                                            :highlightPoint="highlightPoint"
                                            :mapPoint="mapPoint"
                                            :bigScreenBtn="true"
                                            :markerNumber="true"
                                            :isLine="false"
                                            :isShowSearch="true"
                                            :isShowDatePick="true"
                                            :isShowTrack="true"
                                            :markerClick="true"
                                            :ryinfo="checkedsarsinfo"
                                            @selectChange="selectChange($event)"
                                            @handleBigScreen="
                                                handleBigScreen($event)
                                            "
                                            @handleMarkerClick="
                                                handleMarkerClick($event)
                                            "
                                            @pathMove="pathMove"
                                        ></kr-map>
                                    </div>
                                </div>
                            </div>
                        </collapse-tool-page>
                    </el-tab-pane>

                    <el-tab-pane
                        label="特殊时刻分析"
                        style="height:100%"
                        name="third"
                    >
                        <div class="searchTool">
                            <el-row style="width: 100%;">
                                <el-col
                                    class="elcol"
                                    :xs="24"
                                    :sm="24"
                                    :md="6"
                                    :lg="4"
                                    :xl="4"
                                >
                                    <div
                                        class="el-input"
                                        style=" float: right;"
                                    >
                                        <el-dropdown
                                            style="border:1px solid #eee;border-radius:5px"
                                            ref="dropdown"
                                            size="medium"
                                            split-button
                                            type="primary"
                                            trigger="click"
                                            :hide-on-click="false"
                                        >
                                            <span class="el-dropdown-link">
                                                维度选择
                                            </span>
                                            <el-dropdown-menu
                                                class="gjlx"
                                                style="border:1px solid #eee;"
                                                slot="dropdown"
                                            >
                                                <el-checkbox-group
                                                    v-model="wdselectList"
                                                >
                                                    <el-dropdown-item
                                                        v-for="item in sjlxdata"
                                                        :key="item.value"
                                                    >
                                                        <el-checkbox
                                                            :label="item.value"
                                                            >{{
                                                                item.name
                                                            }}</el-checkbox
                                                        >
                                                    </el-dropdown-item>
                                                </el-checkbox-group>
                                                <!-- <el-dropdown-item divided style="text-align: center">
                                                            <el-button type="text" @click="selectConfirm"
                                                                >确认</el-button
                                                            >
                                                        </el-dropdown-item> -->
                                            </el-dropdown-menu>
                                        </el-dropdown>

                                        <!-- <el-select
                                               
                                                style="width:135px;"
                                                v-model="zysjvalue"
                                                placeholder="维度选择"
                                            >
                                                 <el-option
                                                    v-for="item in  sjlxdata"
                                                    :key="item.value"
                                                    :label="item.name"
                                                    :value="item.value"
                                                ></el-option>
                                                
                                            </el-select> -->
                                    </div>
                                </el-col>

                                <el-col
                                    class="elcol"
                                    :xs="24"
                                    :sm="24"
                                    :md="12"
                                    :lg="8"
                                    :xl="8"
                                >
                                    <div
                                        class="el-input"
                                        style=" float: right;"
                                    >
                                        <el-select
                                            style="width:135px;"
                                            v-model="zysjvalue"
                                            placeholder="重要时间选择(例:春节)"
                                        >
                                            <el-option
                                                v-for="item in zysjoptions"
                                                :key="item.importantTimeId"
                                                :label="item.importantTimeName"
                                                :value="item.importantTimeId"
                                            ></el-option>
                                        </el-select>
                                        -
                                        <el-select
                                            style="width:120px;padding-right:20px"
                                            v-model="sjdvalue"
                                            placeholder="前后1天"
                                        >
                                            <el-option
                                                v-for="item in sjdoptions"
                                                :key="item.intervalId"
                                                :label="item.intervalName"
                                                :value="item.intervalId"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                </el-col>

                                <el-col
                                    class="elcol"
                                    :xs="24"
                                    :sm="24"
                                    :md="6"
                                    :lg="5"
                                    :xl="4"
                                >
                                    <el-date-picker
                                        style="width: 230px"
                                        v-model="dskfx_time"
                                        value-format="yyyy-MM-dd"
                                        type="daterange"
                                        range-separator="~"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :picker-options="$pickerOptions"
                                    ></el-date-picker>
                                </el-col>

                                <el-col
                                    class="elcol"
                                    :xs="24"
                                    :sm="24"
                                    :md="6"
                                    :lg="3"
                                    :xl="3"
                                >
                                    <div
                                        class="el-input"
                                        style=" float: right;"
                                    >
                                        <el-button
                                            type="primary"
                                            icon="plus"
                                            @click="specialMomentSearch"
                                            >搜索</el-button
                                        >
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <kr-table
                            style="height:calc(100% - 50px);"
                            :total="total"
                            :rows="pageData"
                            :columns="columns"
                            :current="page"
                            :indexRow="false"
                            @sort-change="sortChange"
                            @on-page-change="onPageChange"
                        ></kr-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </template>

        <kr-choose
            ref="personChoose"
            @startAnalysis="startAnalysis($event)"
            @clearAll="clearAll"
            :all="sars"
            :isPerson="true"
            slot="aside"
            :max="100"
            @search="searchPerson"
        ></kr-choose>
        <detail-info slot="body" ref="detailInfo" :row="row" />
    </imp-panel>
</template>
<script type="text/babel">
import {
    getLxBySj,
    getLxByKj,
    getZysj,
    getTackTypes,
    getNyInfo,
    getInfobyny,
    getTrackTimeLine,
    getTrack,
    getSpecialMomentStatistics,
    getDetialForSpecialMoment,
    getSAObjectByDABH
} from "../../../api/zhfx/dskfx";
import { DSK_COLOR } from "@/config/index.js";
import detailInfo from "./detail-info";
import eventConten from "./eventConten";
import { cloneDeep } from "loadsh";
// import collapseToolPage from "./collapse-tool-page";

export default {
    // mixins: [ treeter ],
    components: {
        detailInfo
    },
    data() {
        const shelf = this;
        return {
            tags_sj: [],
            tags_kj: [],
            tags_sj_cz: [],
            tags_kj_cz: [],
            //改造条件
            checkedSJLX_sj: [],
            checkedSJLX_sj_copy: [],
            checkedSJLX_kj: [],
            checkedSJLX_kj_copy: [],
            jr: [],
            gj: [],
            isIndeterminate: true, //默认是时间维度
            checkAll: false, //默认是时间维度
            isIndeterminate_jr: true, //节日类型 统一的
            checkAll_jr: false,
            isIndeterminate_gj: true, //轨迹类型
            checkAll_gj: false,
            isIndeterminate_kj: true, //空间维度
            checkAll_kj: false,
            //改造条件

            curtabpanename: "first",
            sortName: "eventTotalNum",
            sortRule: "DESC",

            input_qsr: "",
            isShowToolbar: true,
            size: 10,
            page: 1,
            total: 0,
            pageData: [],
            columns: [
                {
                    title: "事件总频次",
                    width: 130,
                    sortable: true,
                    key: "eventTotalNum"
                },
                {
                    title: "时间",
                    width: 320,
                    sortable: true,
                    key: "date",
                    // formatter(row) {
                    //     // return row.date + row.label;
                    //     return row.date + "adsf";
                    // }
                    component: {
                        render(h, row) {
                            if (row.label != "") {
                                return (
                                    <div>
                                        {row.date}
                                        <span
                                            style=" border: 1px solid #f0c180;  background: #fcf3e6;; color: #cc7e10;"
                                            type="text"
                                        >
                                            {row.label}
                                        </span>
                                    </div>
                                );
                            } else {
                                return <div>{row.date}</div>;
                            }
                        }
                    }
                },
                {
                    title: "事件内容",
                    component: {
                        render(h, row) {
                            return h(eventConten, {
                                props: {
                                    row: row
                                },
                                on: {
                                    ["detail"]: data => {
                                        // console.log(data);
                                        // data.item.typeItems[0].subTypes[0].name
                                        //   data.item.typeItems[0].subTypes[0].code
                                        // 组合
                                        var lx_nc = []; //包含name code
                                        var lx_n = []; //包含name
                                        var lx_c = []; //包含code
                                        var items = data.item.typeItems;
                                        for (var i = 0; i < items.length; i++) {
                                            for (
                                                var j = 0;
                                                j < items[i].subTypes.length;
                                                j++
                                            ) {
                                                // lx_nc.push({
                                                //     name:
                                                //         items[i].subTypes[j]
                                                //             .name,
                                                //     code:
                                                //         items[i].subTypes[j]
                                                //             .code
                                                // });
                                                lx_nc[
                                                    items[i].subTypes[j].name
                                                ] = items[i].subTypes[j].code;
                                                lx_n.push(
                                                    items[i].subTypes[j].name
                                                );
                                                lx_c.push(
                                                    items[i].subTypes[j].code
                                                );
                                            }
                                        }

                                        shelf.$refs.detailInfo.isVisible = true;
                                        var dt = {
                                            // dimensionList: [
                                            //     data.item.typeItems[0].typeName
                                            // ],
                                            dimensionList: lx_n,
                                            ids: [],
                                            lx_nc: lx_nc,
                                            list: {
                                                dabh: shelf.dabh,
                                                date: data.date,
                                                idCard: data.item.idCard,
                                                lx: lx_c
                                                // pageNum: this
                                                //     .pageNum_tssk_detail,
                                                // pageSize: this
                                                //     .pageSize_tssk_detail
                                            }
                                        };
                                        shelf.row = dt;
                                        // shelf.getTSSKTJ_detail(data);
                                    }
                                }
                            });
                        }
                        // render(h, row) {
                        //     var name = [];
                        //     var namestr = "";

                        //     row.events.forEach(element => {
                        //         // name.push(element.showInfo);
                        //         namestr +=
                        //             "  <el-button " +
                        //             element.showInfo +
                        //             "  </el-button>";
                        //     });
                        //     return namestr;
                        //     // <el-button
                        //     //     v-for="item in row.events"
                        //     //     type="text"
                        //     //     onClick={() => $shelf.lookDetails(item)}
                        //     // >
                        //     //     {name.join(",")}
                        //     // </el-button>
                        //     // <template    v-for="item in options" :key="item.value">
                        //     // </template>
                        // }
                    }
                }
            ],
            row: {}, //detail info 组建传值
            query: null, //全局axios 查询条件
            dabh: "",
            pickerOptions: {
                shortcuts: [
                    {
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 7
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近一个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 30
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    },
                    {
                        text: "最近三个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(
                                start.getTime() - 3600 * 1000 * 24 * 90
                            );
                            picker.$emit("pick", [start, end]);
                        }
                    }
                ]
            },

            selectOptions: {
                options: [
                    { name: "国内轨迹", value: "1" },
                    { name: "上班轨迹", value: "2" },
                    { name: "节假日轨迹", value: "3" },
                    { name: "出入境轨迹", value: "4" },
                    { name: "上下班轨迹", value: "5" }
                ],
                title: "轨迹类型"
            },

            wdselectList: [],

            tracktype: [],
            highlightPoint: null,
            mapPoint: [],
            iconMarker: "",

            zysjoptions: [
                {
                    importantTimeId: "选项1",
                    importantTimeName: "黄金糕"
                },
                {
                    importantTimeId: "选项2",
                    importantTimeName: "双皮奶"
                }
            ],
            zysjvalue: "",

            sjdoptions: [
                {
                    intervalId: "选项1",
                    intervalName: "前后1天"
                },
                {
                    intervalId: "选项4",
                    intervalName: "前后3天"
                },
                {
                    intervalId: "选项5",
                    intervalName: "前后5天"
                }
            ],
            sjdvalue: "",

            dskfx_time: "",

            sjlxdata: [
                {
                    name: "通话",
                    value: "TH",
                    status: false
                },
                {
                    name: "住宿",
                    value: "ZS",
                    status: false
                },
                {
                    name: "出行",
                    value: "CX",
                    status: false
                }
            ],
            kjlxdata: [
                {
                    name: "通话",
                    value: "TH",
                    status: false
                },
                {
                    name: "住宿",
                    value: "ZS",
                    status: false
                },
                {
                    name: "出行",
                    value: "CX",
                    status: false
                }
            ],

            ymdata: [
                // {
                //     year: "",
                //     month: "",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2020",
                //     month: "",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2020",
                //     month: "9",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2020",
                //     month: "8",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2020",
                //     month: "7",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2019",
                //     month: "",
                //     value: "",
                //     status: false
                // },
                // {
                //     year: "2019",
                //     month: "9",
                //     value: "",
                //     status: false
                // }
            ],
            ymdataInfo: {
                year: "2020",
                month: "9",

                status: false,
                items: [
                    // {
                    //     name:'刘某',
                    //     num: "c093a3d182b911eabf9a0242ac110002",
                    //     eventTime: " 13 13:35:26 ",
                    //     content:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                    //     color:'blue'
                    // },{
                    //     name:'刘某',
                    //     num: "c093a3d182b911eabf9a0242ac110002",
                    //     eventTime: " 13 13:35:26 ",
                    //     content:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                    //     color: "blue",
                    // }
                ]
            },
            ymdataInfo2_copy: [],
            ymdataInfo2: [
                // {
                //     id:'ewrewr',
                //     year: "2020",
                //     month: "9",
                //     status: false,
                //     name:'2020-07',
                //     eventTime: " ",
                //     info:'',
                // },
                // {
                //     id:'1',
                //     num: "c093a3d182b911eabf9a0242ac110002",
                //     longitude: 114.001,
                //     latitude: 22.55,
                //     year: "2020",
                //     month: "9",
                //     status: false,
                //     name:'刘某',
                //     color: "blue",
                //     eventTime: " 13 13:35:26 ",
                //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                //     infowindow:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                // },{
                //     id:'2',
                //     num: "c095f6a882b911eabf9a0242ac110002",
                //     longitude: 114.0143,
                //     latitude: 22.55,
                //     year: "2020",
                //     month: "9",
                //     status: false,
                //     name:'3513',
                //     color: "green",
                //     eventTime: " 13 13:35:26 ",
                //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                //     infowindow:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                // },{
                //     id:'3',
                //     num: "c093a3d182b911eabf9a0242ac110002",
                //     longitude: 114.0286,
                //     latitude: 22.54,
                //     year: "2020",
                //     month: "9",
                //     status: false,
                //     name:'刘某',
                //     color: "blue",
                //     eventTime: " 13 13:35:26 ",
                //     info:'',
                //     infowindow:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
                // }
            ],

            // ymdataInfo: [

            //     {
            //         year: "2020",
            //         month: "9",

            //         status: false,
            //         points:[{
            //             name:'张三',
            //             date: " 13 13:35:26 ",
            //             info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //         },{
            //             name:'张三',
            //             date: " 13 13:35:26 ",
            //             info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //         },{
            //             name:'张三',
            //             date: " 13 13:35:26 ",
            //             info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //         }],
            //     },

            //     // {
            //     //     name:'张三',
            //     //     date: " 13 13:35:26 ",
            //     //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //     //     year: "2020",
            //     //     month: "9",
            //     //     status: false,
            //     // },
            //     // {
            //     //     name:'张三',
            //     //     date: " 13 13:35:26 ",
            //     //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //     //     year: "2020",
            //     //     month: "9",
            //     //     status: false,
            //     // },
            //     // {
            //     //     name:'张三',
            //     //     date: " 13 13:35:26 ",
            //     //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //     //     year: "2020",
            //     //     month: "9",
            //     //     status: false,
            //     // },{
            //     //     name:'张三',
            //     //     date: " 13 13:35:26 ",
            //     //     info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //     //     year: "2020",
            //     //     month: "9",
            //     //     status: false,
            //     // }

            //     // {
            //     //     year: "2020",
            //     //     month: "8",
            //     //     value: "",
            //     //     status: false
            //     // },
            //     // {
            //     //     year: "2020",
            //     //     month: "7",
            //     //     value: "",
            //     //     status: false
            //     // },
            //     // {
            //     //     year: "2019",
            //     //     month: "8",
            //     //     value: "",
            //     //     status: false
            //     // },
            //     // {
            //     //     year: "2019",
            //     //     month: "7",
            //     //     value: "",
            //     //     status: false
            //     // }

            //     // {
            //     //    year:'2020',
            //     //    months:[9,8,7]
            //     // },{
            //     //    year:'2019',
            //     //    months:[9,8,7]
            //     // },
            // ],

            hascurrentjd: true,
            hasnojd: false,

            currentjd: {
                year: "",
                month: ""
            },
            activeName: "first",
            gxlx: "PPTransfer", //人与人关系类型

            saryx: "",
            lxr: "",

            maxnum: 100000,
            minnum: 1,
            // sjdvalue: "",
            nr: "",
            yxh: "",
            startvalue: "",
            endvalue: "",

            loading: false,
            archiveNum: "1", //档案编号
            options: [],
            list: [],
            checkedsars: [], //只包含了id
            checkedsarsinfo: [], //重新构造 传给map 全部信息
            sars: [
                // {
                //     num: "c093a3d182b911eabf9a0242ac110012",
                //     archivesNum: "c092c85582b911eabf9a",
                //     name: "王某",
                //     sex: "女",
                //     identifier: "792892196811231931",
                //         "zjhm": "792892196811231931",
                //     phone: "18828193833",
                //     gjindexs: [],
                //     gjline: [],
                //     color: "blue",
                //     state: false,
                //     isDeleted: "N",
                //     createTime: "2020-04-20 11:48:09.0",
                //          "mc": "1931",
                // },
                //  {
                //     "sabh": "846adaabc6fe11ea82f00242ac110002",
                //     "dabh": "84646445c6fe11ea82f0",
                //     "mc": "1931",
                //     "xb": "男",
                //     "zjhm": "792892196811231931",
                //     "dhhm": "null",
                //     "gx": "null",
                //     "sfzysar": "N",
                //     "zt": "0",
                //     "bgsj": "null",
                //     "sfsc": "N",
                //     "cjsj": "2020-07-16 08:51:43.0",
                //     "sfsarylx": "N",
                //     "hxbh": "null",
                //     "fsabh": "null",
                //     "zp": "null",
                //     "sarbh": "null",
                //       gjindexs: [],
                //     gjline: [],
                //     color: "blue",
                // },
            ]
        };
    },
    computed: {},
    methods: {
        //重置条件
        resetFilter() {
            //日期统一
            // this.jr = this.jr_copy;
            if (this.curtabpanename == "first") {
                this.jr = this.jr_copy;
                this.checkedSJLX_sj = this.checkedSJLX_sj_copy;
            } else if (this.curtabpanename == "second") {
                this.jr = this.jr_copy;
                this.gj = this.gj_copy;
                this.checkedSJLX_kj = this.checkedSJLX_kj_copy;
            }
            this.tags_sj = [...this.jr, ...this.checkedSJLX_sj];
            this.tags_kj = [...this.gj, ...this.checkedSJLX_kj, ...this.jr];
        },
        handleClose(val) {
            //日期统一
            // let jr = this.jr.filter(value => {
            //     return value != val.tag;
            // });
            // this.jr = jr;
            if (this.curtabpanename == "first") {
                let jr = this.jr.filter(value => {
                    return value != val.tag;
                });
                this.jr = jr;
                let sj = this.checkedSJLX_sj.filter(value => {
                    return value != val.tag;
                });
                this.checkedSJLX_sj = sj;
            } else if (this.curtabpanename == "second") {
                let jr = this.jr.filter(value => {
                    return value != val.tag;
                });
                this.jr = jr;
                let gj = this.gj.filter(value => {
                    return value != val.tag;
                });
                this.gj = gj;
                let kj = this.checkedSJLX_kj.filter(value => {
                    return value != val.tag;
                });
                this.checkedSJLX_kj = kj;
            }
            this.tags_sj = [...this.jr, ...this.checkedSJLX_sj];
            this.tags_kj = [...this.gj, ...this.checkedSJLX_kj, ...this.jr];

            //重新查询
            this.startAnalysis();
            // this.getNyList();
            // this.getGjTimeLine();
            // this.getGj();
        },
        confirmAnalysis() {
            // this.startAnalysis();

            if (this.curtabpanename == "first") {
                this.$refs.collapsetoolpage.isShowfxtj = false;
                if (this.$refs.personChoose.checkedPersons.length == 0) {
                    this.$message("请选择人员对象！");
                    return;
                }

                this.checkedsarsinfo = this.$refs.personChoose.checkedPersons; //person;

                //获取时间轴年月 ,默认选择最新一个月数据
                this.getNyList();
            } else if (this.curtabpanename == "second") {
                this.$refs.collapsetoolpage2.isShowfxtj = false;

                if (this.$refs.personChoose.checkedPersons.length == 0) {
                    this.$message("请选择人员对象！");
                    return;
                }

                this.checkedsarsinfo = this.$refs.personChoose.checkedPersons; //person;
                this.getGjTimeLine();
                this.getGj();
            }
        },
        //条件改造
        //时间的 节日的
        handleCheckAllChange(val) {
            this.checkedSJLX_sj = val ? this.checkedSJLX_sj_copy : [];
            this.isIndeterminate = false;
            this.tags_sj = [...this.jr, ...this.checkedSJLX_sj];
        },
        handleCheckedWDChange(value) {
            let checkedCount = value.length;
            this.checkAll = checkedCount === this.checkedSJLX_sj_copy.length;
            this.isIndeterminate =
                checkedCount > 0 && checkedCount < this.checkedSJLX_sj.length;

            this.tags_sj = [...this.jr, ...this.checkedSJLX_sj];
        },
        handleChange() {
            // console.log(value);
            this.checkedSJLX_sj;

            this.tags_sj = [...this.jr, ...this.checkedSJLX_sj];
        },
        //时间的 节日的
        handleCheckAllChange_jr(val) {
            this.jr = val ? this.jr_copy : [];
            this.isIndeterminate_jr = false;

            this.tags_sj = [...this.jr, ...this.checkedSJLX_sj];
            this.tags_kj = [...this.gj, ...this.checkedSJLX_kj, ...this.jr];
        },
        handleCheckedWDChange_jr(value) {
            let checkedCount = value.length;
            this.checkAll_jr = checkedCount === this.checkedSJLX_sj_copy.length;
            this.isIndeterminate_jr =
                checkedCount > 0 && checkedCount < this.checkedSJLX_sj.length;

            this.tags_sj = [...this.jr, ...this.checkedSJLX_sj];
            this.tags_kj = [...this.gj, ...this.checkedSJLX_kj, ...this.jr];
        },
        handleChange_jr() {
            // console.log(value);
            this.checkedSJLX_sj;

            this.tags_sj = [...this.jr, ...this.checkedSJLX_sj];
            this.tags_kj = [...this.gj, ...this.checkedSJLX_kj, ...this.jr];
        },
        //空间的 轨迹的  节日
        handleCheckAllChange_gj(val) {
            this.gj = val ? this.gj_copy : [];
            this.isIndeterminate_gj = false;

            this.tags_kj = [...this.gj, ...this.checkedSJLX_kj, ...this.jr];
        },
        handleCheckedWDChange_gj(value) {
            let checkedCount = value.length;
            this.checkAll_gj = checkedCount === this.checkedSJLX_kj_copy.length;
            this.isIndeterminate_gj =
                checkedCount > 0 && checkedCount < this.checkedSJLX_kj.length;

            this.tags_kj = [...this.gj, ...this.checkedSJLX_kj, ...this.jr];
        },
        handleChange_gj() {
            // console.log(value);
            this.checkedSJLX_kj;

            this.tags_kj = [...this.gj, ...this.checkedSJLX_kj, ...this.jr];
        },
        //空间的 轨迹的
        handleCheckAllChange_kj(val) {
            this.checkedSJLX_kj = val ? this.checkedSJLX_kj_copy : [];
            this.isIndeterminate_kj = false;

            this.tags_kj = [...this.gj, ...this.checkedSJLX_kj, ...this.jr];
        },
        handleCheckedWDChange_kj(value) {
            let checkedCount = value.length;
            this.checkAll_kj = checkedCount === this.checkedSJLX_kj_copy.length;
            this.isIndeterminate_kj =
                checkedCount > 0 && checkedCount < this.checkedSJLX_kj.length;

            this.tags_kj = [...this.gj, ...this.checkedSJLX_kj, ...this.jr];
        },
        handleChange_kj() {
            // console.log(value);
            this.checkedSJLX_kj;
            this.tags_kj = [...this.gj, ...this.checkedSJLX_kj, ...this.jr];
        },

        //条件改造

        //特殊时刻分析
        specialMomentSearch() {
            this.getTSSKTJ();
        },
        // 开始分析
        startAnalysis() {
            // console.log("开始分析");
            // var _this = this;
            //获取当前选择人员的轨迹信息 mapPoint{name:'刘某',points},{name:'3513',points}
            //人员信息增加 ‘显示轨迹按钮’，点击地图上显示那个时间轴拖动 ，再次点击关闭，切换人员点击则传入相应坐标
            //传值给map 对象

            // if (this.dskfx_time == "") {
            //     this.$message("请选择开始日期和结束日期！");
            //     return;
            // }

            // if (person.length == 0) {
            //     this.$message("请选择对象！");
            //     return;
            // }

            // this.checkedsarsinfo = person;

            if (this.$refs.personChoose.checkedPersons.length == 0) {
                this.$message("请选择人员对象！");
                return;
            }

            this.checkedsarsinfo = this.$refs.personChoose.checkedPersons; //person;

            //获取时间轴年月 ,默认选择最新一个月数据
            this.getNyList();

            this.getGjTimeLine();

            this.getGj();
        },

        //3个时间事件 统一处理
        dskfxTimeChange() {
            if (this.checkedsarsinfo == 0) {
                // this.$message("请选择对象,并开始分析！");
                return;
            }
            this.getNyList();
            this.getGjTimeLine();
            this.getGj();
        },

        search(item) {
            item.status = !item.status;
            if (this.checkedsarsinfo == 0) {
                this.$message("请选择对象,并开始分析！");
                return;
            }
            // this.startAnalysis(this.checkedsarsinfo);

            //获取时间轴年月 ,默认选择最新一个月数据
            this.getNyList();
        },
        searchkj(item) {
            item.status = !item.status;
            if (this.checkedsarsinfo == 0) {
                this.$message("请选择对象,并开始分析！");
                return;
            }

            this.getGjTimeLine();
            this.getGj();
        },
        //地图轨迹类型确认事件
        selectChange(type) {
            this.tracktype = type;
            if (this.checkedsarsinfo == 0) {
                this.$message("请选择对象,并开始分析！");
                return;
            }

            this.getGjTimeLine();
            this.getGj();
        },

        // 搜索
        searchPerson() {
            // console.log("search");
        },
        //情况对象
        clearAll() {
            this.checkedsarsinfo = [];
            this.mapPoint = [];
            //   this.ymdataInfo=[]
            this.ymdataInfo2 = [];
        },

        // isShowGJ(item, val, v) {
        //     // item.state=!item.state;
        // },
        btnZbdw(item) {
            //地图点击 左侧人员 高亮 右侧人员定位
            item.status = !item.status;
            //其他变为false,
            this.ymdataInfo2.forEach(function(it) {
                if (item != it) {
                    it.status = false;
                }
            });
            // this.highlightPoint={longitude:item.longitude,latitude:item.latitude};
            this.highlightPoint = item;
        },
        btnKsfx() {},

        getTime(item) {
            if (item.month == "") {
                return;
            }
            // this.currentjd.year;
            // this.currentjd.month;
            item.status = true;
            //其他变为false,
            this.ymdata.forEach(function(it) {
                if (item.value != it.value) {
                    it.status = false;
                }
            });

            this.getInfobyny(item);

            // this.ymdataInfo={ year: "2020",
            //     month: "8",

            //     status: false,
            //     points:[{
            //         name:'刘某d',
            //         num: "c093a3d182b911eabf9a0242ac110002",
            //         date: " 13 13:35:26 ",
            //         info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //         color:'blue'
            //     },{
            //         name:'刘某',
            //         num: "c093a3d182b911eabf9a0242ac110002",
            //         date: " 13 13:35:26 ",
            //         info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //         color: "blue",
            //     },{
            //         name:'3513',
            //         num:'c095f6a882b911eabf9a0242ac110002',
            //         date: " 13 13:35:26 ",
            //         info:'  航班信息-川航c0890<br>  起始地： 时间 ：   目的地： 时间：',
            //         color: "green",
            //     }],
            // };

            // // alert(item.year + "-" + item.month);

            // //获取与当前li想匹配的div距离页面顶端的距离
            // var dom=document.getElementById(item.year+'-'+item.month);
            // if(dom==null) return;
            // var div_top = dom.offsetTop;
            // console.log(div_top);
            // // console.log(dom.offset().top);

            // window.scrollTo(0, div_top);

            // var parent=document.getElementById('parent');
            // parent.scrollTop+=div_top;
        },
        pathMove(val) {
            //左侧列表增加消失，高亮的的特殊处理
            this.mapPoint;
            this.ymdataInfo2_copy;
            this.ymdataInfo2 = [];

            this.ymdataInfo2_copy.forEach(element => {
                if (new Date(element.eventTime) > new Date(val.val.eventTime)) {
                    //
                } else {
                    this.ymdataInfo2.push(element);
                }
            });
        },

        handleMarkerClick(e) {
            var _this = this;
            console.log("地图触发列表联动： " + e);
            // this.btnZbdw(e);
            //地图点击 左侧人员 高亮 右侧人员定位
            // item.status = !item.status;
            //其他变为false,
            this.ymdataInfo2.forEach(function(it) {
                if (e.dataId != it.dataId) {
                    it.status = false;
                } else {
                    it.status = true;
                    _this.highlightPoint = it;
                }
            });
        },

        handleBigScreen(isBigScreen) {
            //处理大屏幕
            console.log("大屏： " + isBigScreen);
            this.$refs.map.map.enableAutoResize();
            if (!isBigScreen) {
                //折叠人员列表
                this.$refs.impPanel.hasAside = false;
                var fullDiv = document.getElementById("DSKmap");
                this.fullscreen(fullDiv);
            } else {
                this.$refs.impPanel.hasAside = true;
                this.fullscreen();
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

        // dataTransform(data, year, month) {
        //     //根据年月获取该月数据
        // },
        // dataTransform2() {},

        handleClick(tab, event) {
            this.curtabpanename = tab.paneName;
            // console.log(tab, event);
            if (tab.paneName == "second") {
                //切换到地图时 地图特殊处理
                //可以去除那个特殊样式了 tab_sjkj  pane-second
                // document
                //     .querySelector("#tab_sjkj")
                //     .querySelector("#pane-second").style.display =
                //     "none";
                //移除dtgj_second
                let seconddom = document
                    .querySelector("#tab_sjkj")
                    .querySelector("#pane-second");
                seconddom.className = "el-tab-pane";

                // if (this.checkedSJLX_kj.length == 0) {
                //     //第一次点击时触发
                // }

                // this.getZysjList();
                // this.getKjlxList();
                // this.getGjlxList();
            }
            if (tab.paneName == "third") {
                //移除dtgj_second
                let seconddom = document
                    .querySelector("#tab_sjkj")
                    .querySelector("#pane-second");
                seconddom.className = "el-tab-pane";
                //切换到地图时 地图特殊处理
                this.isShowToolbar = false;
            } else {
                this.isShowToolbar = true;

                // this.getZysjList();
                // this.getSjlxList();
            }
        },

        // handleClose(done) {
        //     this.dialogVisible = false;
        // },

        sortChange({ prop, order }) {
            // if (order == "ascending") {
            //     this.table = this.table.sort((a, b) => a.length - b.length);
            // } else if (order == "descending") {
            //     this.table = this.table.sort((a, b) => b.length - a.length);
            // }
            if (order == "ascending") {
                this.sortRule = "ASC";
            } else if (order == "descending") {
                this.sortRule = "DESC";
            }
            this.sortName = prop;
            this.getTSSKTJ();
            // this.getTablePage();
        },
        // getTablePage() {
        //     let start = (this.page - 1) * this.pageSize;
        //     let end = this.page * this.pageSize;
        //     if (!this.table[end]) {
        //         end = this.table.length;
        //     }
        //     this.rows = this.table.slice(start, end);
        // },
        onPageChange(current, size) {
            this.page = current;
            this.size = size;
            // this.getTablePage();
            this.getTSSKTJ();
        },
        // handlePageChange(current, size) {
        //     this.page = current;
        //     this.pageSize = size;
        //     this.getLjdTj();
        // },

        //根据案件查图信息
        getSAR() {
            var _this = this;
            //根据url获取案件编号
            this.checkedsars = [];
            this.query = {
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm
            };
            getSAObjectByDABH(this.query)
                .then(response => {
                    // this.loading = false;
                    //根据人员个数产生随机色
                    // var colors = this.getColor(response.data.saxxModels.length);
                    //追加颜色字段
                    //   for (const item of  response.data.saxxModels) {
                    //      item.color=_this.getRandomColor();
                    //      item.gjindexs=[];
                    //      item.gjline=[];
                    //  }
                    response.data.saxxModels.forEach((item, i) => {
                        // item.color=colors[i].style.background;
                        item.color = DSK_COLOR[i];
                        item.gjindexs = [];
                        item.gjline = [];
                        item.status = false;
                    });
                    // console.log(response.data.saxxModels);
                    _this.sars = response.data.saxxModels;
                })
                .catch(() => {
                    // this.loading = false;
                    _this.sars = [];
                });
        },
        //生成随机色 ,不能产生白色相近的颜色
        // getRandomColor(){
        //     //   return '#'+Math.floor(Math.random()*0xffffff).toString(16);
        //       return 'rgba('+Math.floor(Math.random()*255)+','+ Math.floor(Math.random()*255) +','+ Math.floor(Math.random()*255) +',0.8)';
        // },
        /*
        其它一切应该都是不言自明的
        random() 生成[0, 1)
        乘以0xffffff 变成[0, 0xffffff)
        这样会产生一个bug, 因为0xffffff 不会产生
        然后取整rounded/floored, 转换成前缀为#的字符串
        */

        getRandomColor() {
            return (
                "#" +
                (function a(color) {
                    return (color += "5678956789defdef"[
                        Math.floor(Math.random() * 16)
                    ]) && color.length == 6
                        ? color
                        : a(color);
                })("")
            );
        },

        //随机色开始
        getColor(hslLength) {
            var self = this;
            var hlscolor = this.getHslArray(hslLength);
            var rgbArray = hlscolor.map(function(item) {
                return self.hslToRgb.apply(this, item);
            });

            return rgbArray.map(function(item) {
                return {
                    value: item,
                    style: { background: "rgb(" + item.toString() + ")" }
                };
            });
        },

        /**
         * HSL颜色值转换为RGB
         * H，S，L 设定在 [0, 1] 之间
         * R，G，B 返回在 [0, 255] 之间
         *
         * @param H 色相
         * @param S 饱和度
         * @param L 亮度
         * @returns Array RGB色值
         */
        hslToRgb: function(H, S, L) {
            var R, G, B;
            if (+S === 0) {
                R = G = B = L; // 饱和度为0 为灰色
            } else {
                var hue2Rgb = function(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };
                var Q = L < 0.5 ? L * (1 + S) : L + S - L * S;
                var P = 2 * L - Q;
                R = hue2Rgb(P, Q, H + 1 / 3);
                G = hue2Rgb(P, Q, H);
                B = hue2Rgb(P, Q, H - 1 / 3);
            }
            return [
                Math.round(R * 255),
                Math.round(G * 255),
                Math.round(B * 255)
            ];
        },

        // 获取随机HSL
        randomHsl: function() {
            var H = Math.random();
            var S = Math.random();
            var L = Math.random();
            return [H, S, L];
        },

        // 获取HSL数组
        getHslArray: function(hslLength) {
            var HSL = [];
            //   var hslLength = 16; // 获取数量
            for (var i = 0; i < hslLength; i++) {
                var ret = this.randomHsl();

                // 颜色相邻颜色差异须大于 0.25
                if (i > 0 && Math.abs(ret[0] - HSL[i - 1][0]) < 0.25) {
                    i--;
                    continue; // 重新获取随机色
                }
                ret[1] = 0.7 + ret[1] * 0.2; // [0.7 - 0.9] 排除过灰颜色
                ret[2] = 0.4 + ret[2] * 0.4; // [0.4 - 0.8] 排除过亮过暗色

                // 数据转化到小数点后两位
                ret = ret.map(function(item) {
                    return parseFloat(item.toFixed(2));
                });

                HSL.push(ret);
            }
            return HSL;
        },

        //随机色结束

        getSjlxList() {
            // this.loading = true;
            var _this = this;
            this.sjlxdata = [];
            this.checkedSJLX_sj = [];
            getLxBySj()
                .then(response => {
                    // this.loading = false;
                    for (var item of response.data) {
                        item.status = true;
                        _this.checkedSJLX_sj.push(item.name);
                    }
                    _this.sjlxdata = response.data;

                    _this.checkedSJLX_sj_copy = cloneDeep(_this.checkedSJLX_sj);

                    if (
                        _this.jr.length > 0 &&
                        _this.checkedSJLX_sj.length > 0
                    ) {
                        _this.tags_sj = [..._this.jr, ..._this.checkedSJLX_sj];
                        _this.tags_sj_cz = [
                            ..._this.jr,
                            ..._this.checkedSJLX_sj_copy
                        ];
                    }
                })
                .catch(() => {
                    // this.loading = false;
                    _this.sjlxdata = [];
                });
        },
        getKjlxList() {
            var _this = this;
            this.kjlxdata = [];
            this.checkedSJLX_kj = [];
            getLxByKj()
                .then(response => {
                    for (var item of response.data) {
                        item.status = true;
                        _this.checkedSJLX_kj.push(item.name);
                    }
                    _this.kjlxdata = response.data;

                    _this.checkedSJLX_kj_copy = cloneDeep(_this.checkedSJLX_kj);

                    if (
                        _this.jr.length > 0 &&
                        _this.gj.length > 0 &&
                        _this.checkedSJLX_kj.length > 0
                    ) {
                        _this.tags_kj = [
                            ..._this.jr,
                            ..._this.gj,
                            ..._this.checkedSJLX_kj
                        ];
                        _this.tags_kj_cz = [
                            ..._this.jr,
                            ..._this.gj,
                            ..._this.checkedSJLX_kj_copy
                        ];
                        // console.log("kj", _this.tags_kj);
                    }
                })
                .catch(() => {
                    _this.kjlxdata = [];
                });
        },
        getZysjList() {
            var _this = this;
            this.jr = [];
            this.zysjoptions = [];
            this.sjdoptions = [];
            this.query = {
                // dabh: this.archiveNum
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm
            };
            getZysj(this.query)
                .then(response => {
                    _this.zysjoptions = response.data.importantTimes;
                    _this.zysjoptions.shift();
                    _this.zysjoptions.pop();

                    _this.sjdoptions = response.data.intervals;
                    if (
                        response.data.importantTimes.length == 0 ||
                        response.data.intervals.length == 0
                    ) {
                        return;
                    }
                    _this.zysjvalue =
                        response.data.importantTimes[0].importantTimeId;

                    _this.sjdvalue = response.data.intervals[0].intervalId;

                    for (var item of response.data.importantTimes) {
                        _this.jr.push(item.importantTimeName);
                    }
                    // _this.jr.shift();
                    // _this.jr.pop();
                    _this.jr_copy = cloneDeep(_this.jr);
                    if (
                        _this.jr.length > 0 &&
                        _this.checkedSJLX_sj.length > 0
                    ) {
                        _this.tags_sj = [..._this.jr, ..._this.checkedSJLX_sj];
                        _this.tags_sj_cz = [
                            ..._this.jr,
                            ..._this.checkedSJLX_sj_copy
                        ];
                    }

                    if (
                        _this.jr.length > 0 &&
                        _this.gj.length > 0 &&
                        _this.checkedSJLX_kj.length > 0
                    ) {
                        _this.tags_kj = [
                            ..._this.jr,
                            ..._this.gj,
                            ..._this.checkedSJLX_kj
                        ];
                        _this.tags_kj_cz = [
                            ..._this.jr,
                            ..._this.gj,
                            ..._this.checkedSJLX_kj_copy
                        ];
                        // console.log("kj", _this.tags_kj);
                    }
                })
                .catch(() => {
                    _this.zysjoptions = [];
                    _this.sjdoptions = [];
                });
        },
        getGjlxList() {
            var _this = this;
            this.selectOptions.options = [];
            this.gj = [];
            getTackTypes()
                .then(response => {
                    _this.selectOptions.options = response.data;

                    for (var item of response.data) {
                        _this.gj.push(item.name);
                    }
                    _this.gj_copy = cloneDeep(_this.gj);
                    if (
                        _this.jr.length > 0 &&
                        _this.gj.length > 0 &&
                        _this.checkedSJLX_kj.length > 0
                    ) {
                        _this.tags_kj = [
                            ..._this.jr,
                            ..._this.gj,
                            ..._this.checkedSJLX_kj
                        ];
                        _this.tags_kj_cz = [
                            ..._this.jr,
                            ..._this.gj,
                            ..._this.checkedSJLX_kj_copy
                        ];
                        // console.log("kj", _this.tags_kj);
                    }
                })
                .catch(() => {
                    _this.selectOptions.options = [];
                });
        },

        getNyList() {
            var _this = this;

            //构造时间类型数据 this.sjlxdata
            let sjlx = [];
            this.sjlxdata.forEach(element => {
                if (this.checkedSJLX_sj.toString().indexOf(element.name) > -1) {
                    sjlx.push(element.value);
                }
            });
            //构造空间类型数据 this.sjlxdata
            let kjlx = [];
            this.kjlxdata.forEach(element => {
                if (this.checkedSJLX_kj.toString().indexOf(element.name) > -1) {
                    kjlx.push(element.value);
                }
            });

            //构造节日类型数据 this.sjlxdata
            let jr = [];
            this.zysjoptions.forEach(element => {
                if (
                    this.jr.toString().indexOf(element.importantTimeName) > -1
                ) {
                    jr.push(element.importantTimeId);
                }
            });

            //构造轨迹类型数据 this.sjlxdata
            let gj = [];
            this.selectOptions.options.forEach(element => {
                if (this.gj.toString().indexOf(element.name) > -1) {
                    gj.push(element.value);
                }
            });

            //构造人员信息
            var person = [];
            this.checkedsarsinfo.forEach(element => {
                person.push({
                    idCards: element.zjhm,
                    logo: "01"
                });
            });
            //构建类型
            // this.tags_sj;
            // this.tags_kj;
            // this.checkedSJLX_sj;
            // this.checkedSJLX_kj;
            // this.jr;
            // this.gj;
            // this.selectOptions.options;
            // this.zysjoptions;
            // this.sjdoptions;
            // this.kjlxdata;
            // this.sjlxdata;

            this.query = {
                // beginTime: this.dskfx_time[0] || "2020-06-01",
                // finishTime: this.dskfx_time[1] || "2020-09-30"
                beginTime:
                    this.dskfx_time == "" || this.dskfx_time == null
                        ? ""
                        : this.dskfx_time[0] || "2020-06-01",
                // dabh: this.dabh || "84646445c6fe11ea82f0",
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                finishTime:
                    this.dskfx_time == "" || this.dskfx_time == null
                        ? ""
                        : this.dskfx_time[1] || "2020-09-30",

                idCards: person,
                // importantTimeId: this.zysjvalue,
                // intervalId: this.sjdvalue,
                // lx: sjlx.toString()
                importantTimeId: jr.toString(),
                intervalId: this.sjdvalue,
                lx: sjlx.toString()
            };
            getNyInfo(this.query)
                .then(response => {
                    if (response.data.length == 0) {
                        this.$message("未查询到相关月份的数据！");

                        // this.ymdataInfo = {
                        //     year: "2020",
                        //     month: "9",

                        //     status: false,
                        //     items: []
                        // };
                        return;
                    }
                    if (response.msg.indexOf("缩小查询范围") > -1) {
                        this.$message(response.msg);
                    }
                    for (var item of response.data) {
                        item.status = false;
                    }
                    let a = {
                        name: "",
                        year: "",
                        month: "",
                        value: "",
                        status: false
                    };
                    _this.ymdata = [];
                    _this.ymdata = [a, ...response.data];

                    //默认获取最新一个月数据
                    //月份高亮
                    _this.ymdata[2].status = true;
                    _this.getInfobyny(response.data[1]);
                })
                .catch(() => {
                    _this.ymdata = [];
                    _this.ymdataInfo = {
                        year: "2020",
                        month: "9",

                        status: false,
                        items: []
                    };
                });
        },
        getInfobyny(item) {
            var _this = this;
            // this.ymdata=[];
            // //构造时间类型数据 this.sjlxdata
            // var sjlx = [];
            // this.sjlxdata.forEach(element => {
            //     if (element.status) {
            //         sjlx.push(element.value);
            //     }
            // });
            //构造时间类型数据 this.sjlxdata
            let sjlx = [];
            this.sjlxdata.forEach(element => {
                if (this.checkedSJLX_sj.toString().indexOf(element.name) > -1) {
                    sjlx.push(element.value);
                }
            });
            //构造空间类型数据 this.sjlxdata
            let kjlx = [];
            this.kjlxdata.forEach(element => {
                if (this.checkedSJLX_kj.toString().indexOf(element.name) > -1) {
                    kjlx.push(element.value);
                }
            });

            //构造节日类型数据 this.sjlxdata
            let jr = [];
            this.zysjoptions.forEach(element => {
                if (
                    this.jr.toString().indexOf(element.importantTimeName) > -1
                ) {
                    jr.push(element.importantTimeId);
                }
            });

            //构造轨迹类型数据 this.sjlxdata
            let gj = [];
            this.selectOptions.options.forEach(element => {
                if (this.gj.toString().indexOf(element.name) > -1) {
                    gj.push(element.value);
                }
            });
            //构造人员信息
            var person = [];
            this.checkedsarsinfo.forEach(element => {
                person.push({
                    idCards: element.zjhm,
                    logo: "01"
                });
            });
            this.query = {
                beginTime:
                    this.dskfx_time == "" || this.dskfx_time == null
                        ? ""
                        : this.dskfx_time[0] || "2020-06-01",
                // dabh: this.dabh || "84646445c6fe11ea82f0",
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                finishTime:
                    this.dskfx_time == "" || this.dskfx_time == null
                        ? ""
                        : this.dskfx_time[1] || "2020-09-30",

                idCards: person,
                // importantTimeId: this.zysjvalue,
                // intervalId: this.sjdvalue,
                // lx: sjlx.toString(),
                importantTimeId: jr.toString(),
                intervalId: this.sjdvalue,
                lx: sjlx.toString(),
                timeInterval: item.value || "2019-09-01to2019-09-30"
            };
            getInfobyny(this.query)
                .then(response => {
                    if (response.data == null) {
                        _this.ymdataInfo = {
                            year: "2020",
                            month: "9",

                            status: false,
                            items: []
                        };
                        this.$message("未查询到相关时间轨迹轴信息！");
                        return;
                    }

                    for (var i = 0; i < response.data.items.length; i++) {
                        //添加颜色字段
                        for (var j = 0; j < _this.checkedsarsinfo.length; j++) {
                            if (
                                response.data.items[i].identifier ==
                                _this.checkedsarsinfo[j].zjhm
                            ) {
                                response.data.items[i].color =
                                    _this.checkedsarsinfo[j].color;
                            }
                        }
                        //添加图片位置字段
                        switch (response.data.items[i].value) {
                            case "01":
                                // response.data.items[i].img=require('../../assets/image/kakou48.png');
                                response.data.items[i].img = "icon-qiche1";
                                break;
                            case "02":
                                response.data.items[i].img = "icon-gaosu";
                                break;
                            case "03":
                                response.data.items[i].img = "icon-gaosu";
                                break;
                            case "04":
                                response.data.items[i].img =
                                    "icon-tubiaozhizuomoban_feiji";
                                break;
                            case "05":
                                response.data.items[i].img = "icon-huoche";
                                break;
                            case "06":
                                response.data.items[i].img = "icon-piaoju";
                                break;
                            case "07":
                                response.data.items[i].img = "icon-jiudian1";
                                break;
                            case "08":
                                response.data.items[i].img =
                                    "icon-touziyixiangyuce";
                                break;
                            case "09":
                                response.data.items[i].img = "icon-qiandai";
                                break;
                            default:
                                response.data.items[i].img =
                                    "icon-qiakoushexiangtou";
                            // break;
                        }
                    }

                    _this.ymdataInfo = response.data;
                })
                .catch(() => {
                    _this.ymdataInfo = [];
                });
        },
        getGjTimeLine() {
            var _this = this;
            // this.ymdata=[];
            // //构造时间类型数据 this.sjlxdata
            // var kjlx = [];
            // this.kjlxdata.forEach(element => {
            //     if (element.status) {
            //         kjlx.push(element.value);
            //     }
            // });
            //构造时间类型数据 this.sjlxdata
            let sjlx = [];
            this.sjlxdata.forEach(element => {
                if (this.checkedSJLX_sj.toString().indexOf(element.name) > -1) {
                    sjlx.push(element.value);
                }
            });
            //构造空间类型数据 this.sjlxdata
            let kjlx = [];
            this.kjlxdata.forEach(element => {
                if (this.checkedSJLX_kj.toString().indexOf(element.name) > -1) {
                    kjlx.push(element.value);
                }
            });

            //构造节日类型数据 this.sjlxdata
            let jr = [];
            this.zysjoptions.forEach(element => {
                if (
                    this.jr.toString().indexOf(element.importantTimeName) > -1
                ) {
                    jr.push(element.importantTimeId);
                }
            });

            //构造轨迹类型数据 this.sjlxdata
            let gj = [];
            this.selectOptions.options.forEach(element => {
                if (this.gj.toString().indexOf(element.name) > -1) {
                    gj.push(element.value);
                }
            });

            //构造人员信息
            var person = [];
            this.checkedsarsinfo.forEach(element => {
                person.push({
                    idCards: element.zjhm,
                    logo: "01"
                });
            });
            this.query = {
                beginTime:
                    this.$refs.map.datesj_time == "" ||
                    this.$refs.map.datesj_time == null
                        ? ""
                        : this.$refs.map.datesj_time[0] || "2020-06-01",
                finishTime:
                    this.$refs.map.datesj_time == "" ||
                    this.$refs.map.datesj_time == null
                        ? ""
                        : this.$refs.map.datesj_time[1] || "2020-09-30",

                // dabh: this.dabh || "84646445c6fe11ea82f0",
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,

                // beginTime: this.$refs.map.datesj_time[0],
                // finishTime: this.$refs.map.datesj_time[1],

                idCards: person,
                // importantTimeId: this.zysjvalue,
                // intervalId: this.sjdvalue,
                // lx: kjlx.toString(),
                // trackTypeCodes: this.tracktype.toString()

                importantTimeId: jr.toString(),
                intervalId: this.sjdvalue,
                lx: kjlx.toString(),
                trackTypeCodes: gj.toString()
            };
            getTrackTimeLine(this.query)
                .then(response => {
                    if (response.data.length == 0) {
                        this.$message("未查询到相关空间轨迹轴信息！");
                        // return;
                    }
                    if (response.msg.indexOf("缩小查询范围") > -1) {
                        this.$message(response.msg);
                    }
                    for (var item of response.data) {
                        item.status = false;
                    }
                    //添加颜色字段
                    for (var i = 0; i < response.data.length; i++) {
                        for (var j = 0; j < _this.checkedsarsinfo.length; j++) {
                            if (
                                response.data[i].identifier ==
                                _this.checkedsarsinfo[j].zjhm
                            ) {
                                response.data[i].color =
                                    _this.checkedsarsinfo[j].color;
                            }
                        }
                        //添加图片位置字段
                        // switch (response.data[i].value) {
                        //     case "01":
                        //         // response.data[i].img=require('../../assets/image/kakou16.png');
                        //         response.data[i].img = "icon-qiakoushexiangtou";
                        //         break;
                        //     case "02":
                        //         response.data[i].img = "icon-qiakoushexiangtou";
                        //         break;
                        //     case "03":
                        //         response.data[i].img = "icon-qiakoushexiangtou";
                        //         break;
                        //     case "04":
                        //         response.data[i].img =
                        //             "icon-tubiaozhizuomoban_feiji";
                        //         break;
                        //     case "05":
                        //         response.data[i].img = "icon-huoche";
                        //         break;
                        //     case "06":
                        //         response.data[i].img = "icon-qiakoushexiangtou";
                        //         break;
                        //     case "07":
                        //         response.data[i].img = "icon-jiudian1";
                        //         break;
                        //     case "08":
                        //         response.data[i].img = "icon-qiakoushexiangtou";
                        //         break;
                        //     case "09":
                        //         response.data[i].img = "icon-qiandai";
                        //         break;
                        //     default:
                        //         // response.data[i].img=require('../../assets/image/kakou16.png');
                        //         response.data[i].img = "icon-qiakoushexiangtou";
                        //         break;
                        // }
                        switch (response.data[i].value) {
                            case "01":
                                // response.data.items[i].img=require('../../assets/image/kakou48.png');
                                response.data[i].img = "icon-qiche1";
                                break;
                            case "02":
                                response.data[i].img = "icon-gaosu";
                                break;
                            case "03":
                                response.data[i].img = "icon-gaosu";
                                break;
                            case "04":
                                response.data[i].img =
                                    "icon-tubiaozhizuomoban_feiji";
                                break;
                            case "05":
                                response.data[i].img = "icon-huoche";
                                break;
                            case "06":
                                response.data[i].img = "icon-piaoju";
                                break;
                            case "07":
                                response.data[i].img = "icon-jiudian1";
                                break;
                            case "08":
                                response.data[i].img = "icon-touziyixiangyuce";
                                break;
                            case "09":
                                response.data[i].img = "icon-qiandai";
                                break;
                            default:
                                response.data[i].img = "icon-qiakoushexiangtou";
                            // break;
                        }
                    }

                    _this.ymdataInfo2 = response.data;
                    _this.ymdataInfo2_copy = cloneDeep(_this.ymdataInfo2);
                })
                .catch(e => {
                    // console.log(e);
                    _this.ymdataInfo2 = [];
                });
        },

        getGj() {
            // var _this = this;
            // this.ymdata=[];
            //构造时间类型数据 this.sjlxdata
            // var kjlx = [];
            // this.kjlxdata.forEach(element => {
            //     if (element.status) {
            //         kjlx.push(element.value);
            //     }
            // });
            //构造时间类型数据 this.sjlxdata
            let sjlx = [];
            this.sjlxdata.forEach(element => {
                if (this.checkedSJLX_sj.toString().indexOf(element.name) > -1) {
                    sjlx.push(element.value);
                }
            });
            //构造空间类型数据 this.sjlxdata
            let kjlx = [];
            this.kjlxdata.forEach(element => {
                if (this.checkedSJLX_kj.toString().indexOf(element.name) > -1) {
                    kjlx.push(element.value);
                }
            });

            //构造节日类型数据 this.sjlxdata
            let jr = [];
            this.zysjoptions.forEach(element => {
                if (
                    this.jr.toString().indexOf(element.importantTimeName) > -1
                ) {
                    jr.push(element.importantTimeId);
                }
            });

            //构造轨迹类型数据 this.sjlxdata
            let gj = [];
            this.selectOptions.options.forEach(element => {
                if (this.gj.toString().indexOf(element.name) > -1) {
                    gj.push(element.value);
                }
            });
            //构造人员信息
            var person = [];
            this.checkedsarsinfo.forEach(element => {
                person.push({
                    idCards: element.zjhm,
                    logo: "01"
                });
            });
            this.query = {
                // beginTime:
                //     this.dskfx_time == "" || this.dskfx_time == null
                //         ? ""
                //         : this.dskfx_time[0] || "2020-06-01",

                // finishTime:
                //     this.dskfx_time == "" || this.dskfx_time == null
                //         ? ""
                //         : this.dskfx_time[1] || "2020-09-30",
                beginTime:
                    this.$refs.map.datesj_time == "" ||
                    this.$refs.map.datesj_time == null
                        ? ""
                        : this.$refs.map.datesj_time[0] || "2020-06-01",
                finishTime:
                    this.$refs.map.datesj_time == "" ||
                    this.$refs.map.datesj_time == null
                        ? ""
                        : this.$refs.map.datesj_time[1] || "2020-09-30",

                // beginTime: this.$refs.map.datesj_time[0],
                // finishTime: this.$refs.map.datesj_time[1],
                // dabh: this.dabh || "84646445c6fe11ea82f0",
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                idCards: person,
                // importantTimeId: this.zysjvalue,
                // intervalId: this.sjdvalue,
                // lx: kjlx.toString(),
                // trackTypeCodes: this.tracktype.toString()
                importantTimeId: jr.toString(),
                intervalId: this.sjdvalue,
                lx: kjlx.toString(),
                trackTypeCodes: gj.toString()
            };
            getTrack(this.query)
                .then(response => {
                    // console.log(response);
                    if (response.data.length == 0) {
                        this.$message("未查询到相关地图轨迹点信息！");
                        // return;
                    }
                    if (response.msg.indexOf("缩小查询范围") > -1) {
                        this.$message(response.msg);
                    }
                    this.mapPoint = response.data;
                    //      for (const item of  response.data) {
                    //          item.status=false;
                    //      }
                    //    _this.ymdataInfo2=response.data;
                })
                .catch(() => {
                    // _this.ymdataInfo2 =[];
                });
        },

        getTSSKTJ() {
            // var _this = this;
            // this.ymdata=[];
            //构造时间类型数据 this.sjlxdata
            // var sjlx = [];
            // this.sjlxdata.forEach(element => {
            //     if (element.status) {
            //         sjlx.push(element.value);
            //     }
            // });

            //构造时间类型数据 this.sjlxdata
            let sjlx = [];
            this.sjlxdata.forEach(element => {
                if (this.checkedSJLX_sj.toString().indexOf(element.name) > -1) {
                    sjlx.push(element.value);
                }
            });
            //构造空间类型数据 this.sjlxdata
            let kjlx = [];
            this.kjlxdata.forEach(element => {
                if (this.checkedSJLX_kj.toString().indexOf(element.name) > -1) {
                    kjlx.push(element.value);
                }
            });

            //构造节日类型数据 this.sjlxdata
            let jr = [];
            this.zysjoptions.forEach(element => {
                if (
                    this.jr.toString().indexOf(element.importantTimeName) > -1
                ) {
                    jr.push(element.importantTimeId);
                }
            });

            //构造轨迹类型数据 this.sjlxdata
            let gj = [];
            this.selectOptions.options.forEach(element => {
                if (this.gj.toString().indexOf(element.name) > -1) {
                    gj.push(element.value);
                }
            });

            //构造人员信息
            var person = [];
            if (this.$refs.personChoose.checkedPersons.length == 0) {
                this.$message("请选择人员对象！");
                return;
            }

            this.checkedsarsinfo = this.$refs.personChoose.checkedPersons; //person;
            this.checkedsarsinfo.forEach(element => {
                person.push({
                    idCards: element.zjhm,
                    logo: "01"
                });
            });
            this.query = {
                beginTime:
                    this.dskfx_time == "" || this.dskfx_time == null
                        ? ""
                        : this.dskfx_time[0] || "2020-06-01",
                // dabh: this.dabh || "84646445c6fe11ea82f0",
                dabh: this.$route.query.dabh,
                isMultipleCases: this.$route.query.isMultipleCases,
                dwbm: this.$route.query.dwbm,
                finishTime:
                    this.dskfx_time == "" || this.dskfx_time == null
                        ? ""
                        : this.dskfx_time[1] || "2020-09-30",
                idCards: person,
                // importantTimeId: this.zysjvalue,
                // intervalId: this.sjdvalue,
                // lx: this.wdselectList.toString(),
                importantTimeId: jr.toString(),
                intervalId: this.sjdvalue,
                lx: sjlx.toString(),
                pageSize: this.size,
                pageNum: this.page,
                sortName: this.sortName,
                sortRule: this.sortRule
            };
            getSpecialMomentStatistics(this.query)
                .then(response => {
                    // console.log(response);
                    if (response.data.length == 0) {
                        this.$message("未查询到相关信息！");
                        return;
                    }
                    this.pageData = response.data.rows;
                    this.total = response.data.total;
                    // this.mapPoint = response.data;
                    //      for (const item of  response.data) {
                    //          item.status=false;
                    //      }
                    //    _this.ymdataInfo2=response.data;
                })
                .catch(() => {
                    // _this.ymdataInfo2 =[];
                });
        },
        getTSSKTJ_detail(data) {
            this.query = {
                dabh: this.dabh || "84646445c6fe11ea82f0",
                date: data.date || "2020-05-13",
                idCard: data.item.idCard || "792892196811231931",
                lx: this.wdselectList.toString(),
                pageNum: this.pageNum_tssk_detail,
                pageSize: this.pageSize_tssk_detail
            };
            getDetialForSpecialMoment(this.query)
                .then(response => {
                    // console.log(response);
                    if (response.data.length == 0) {
                        this.$message("未查询到相关地图轨迹点信息！");
                        // return;
                    }
                })
                .catch(() => {
                    // _this.ymdataInfo2 =[];
                });
        }
    },
    created() {
        // this.getDWDGX();

        // if (location.href.search("=") != -1) {
        //     this.dabh = location.href.split("=")[1];
        // } else {
        //     this.$message("未传入案件编号！");
        //     return;
        // }
        this.getSAR();

        this.getSjlxList();
        this.getZysjList();

        this.getKjlxList();
        this.getGjlxList();
    },
    mounted() {
        // this.getSjlxList();
        // this.getZysjList();
        // this.getKjlxList();
        // this.getGjlxList();
    }
};
</script>

<style type="text/scss" lang="scss" scoped>
@import "@/styles/basic-color.scss";
.select-tree .icons-wrapper {
    display: block;
}

.select-tree .is-empty i {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
}

.select-tree .is-empty i:hover {
    background-color: #0d6aad;
    color: #ffffff;
}
.el-pagination {
    float: right;
    margin-top: 15px;
}
.fgzsdyjfxleft {
    height: 600px;
    overflow-y: auto;
}
.txx {
    height: 350px;
    overflow-y: auto;
}
.xqfxlb {
    height: 200px;
    overflow-y: auto;
}
.lb {
    margin-top: 10px;
    margin-left: 10px;
}
#sjylxtree >>> .el-tree-node__content {
    margin-top: 5px;
    font-size: 16px;
}
/* .el-select--340{
    max-width: 550px;
    min-width: 455px;

  } */
.el-input-number {
    width: 120px;
}
.elcol {
    margin-bottom: 5px;
}
.grid-content {
    background: $color-primary;
    color: #ffffff;
    border-radius: 4px;
    min-height: 36px;
}
.content {
    // margin-top: 20px;
    /* height: calc(100% - 20px); */
    /* height: calc(100% - 60px); */
}

.toolbar {
    // background: red;
    right: 20px;
    height: 30px;
    position: absolute;
    // width: calc(100% - 200px);
    width: calc(100% -375px); //每个tab 宽125
    z-index: 10;
}

.sjlx {
    width: 101px;
    height: 32px;
    line-height: 32px;
    background: #e3e6f8;
}
.sjlx_select {
    background: $color-primary;
}

.timeline {
    margin-left: 80px;
}
.currentjd {
    margin-left: -8px;
    color: $color-primary;
}

.timeparent {
    /* min-height: 300px; */
    display: flex;
}
.timelabel {
    border-radius: 5px;
    height: 8px;
    width: 8px;
    border: 1px solid rgb(21, 214, 214);

    /* background-color: rgb(21, 214, 214); */
}
.timespan {
    /* border: 1px solid rgb(21, 214, 214); */
    border: 1px solid #eee;
    margin-left: -5px;
    margin-top: 8px;
    margin-bottom: -9px;
    height: 35px; /* timediv- timelabel*/
}
.timediv {
    height: 35px;
    padding-left: 10px;
    cursor: pointer;
    position: relative;
    top: -5px;
}

.eventline {
    margin-left: 20px;
    padding-left: 10px;
    // height: 460px;
    // overflow-y: scroll;
    // overflow-y: auto;
}

.eventparent {
    /* min-height: 300px; */
    display: flex;
}

.eventlabel {
    border-radius: 5px;
    height: 8px;
    width: 8px;
    border: 2px solid rgb(77, 82, 82);
    /* background-color: rgb(21, 214, 214); */
}

.eventlabel_event {
    /* width: 80px; */
}
.eventspan {
    /* border: 1px solid rgb(21, 214, 214); */
    border: 1px solid #f0f0f0;
    margin-left: -5px;
    margin-top: 8px;
    margin-bottom: -9px;
    height: 72px; /* timediv- timelabel 80-8*/
}

.eventspan_info {
    /* margin-left: -75px; */
    height: 112px; /* timediv- timelabel  120-8*/
}

.eventdiv {
    height: 120px;
    padding-left: 10px;
    width: 90%;
}

.eventdiv_ny {
    height: 80px;
}
.eventdiv_event {
    /* height: 50px; */
    margin-left: -20px;
    background: $color-primary;
    color: white;
    height: 40px;
    width: 80px;
    border-radius: 5px;
    text-align: center;
    line-height: 40px;
}
.sjpic {
    width: 50px;
    height: 50px;
}
.kjpic {
    width: 16px;
    height: 16px;
}
.eventdivcontentimg {
    float: left;
}
.eventdivcontentinfo {
    float: left;
    margin-left: 20px;
}
.eventdivconten {
    height: 80%;
    background: #f6f7fc;
    width: 100%;
    display: flex;
    align-items: center;
}
.dskmap {
    display: flex;
    height: 100%;
}
.dskmap-left {
    flex-basis: 240px;
}
.dskmap-right {
    flex: 1;
    height: 100%;
}

.rytl {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    display: inline-block;
    background: red;
}
// //a标签去除默认样式
// a {
//     text-decoration: none;
//         color: gray;
// }
// /*正常的未被访问过的链接*/
// a:link {
//     text-decoration: none;
// }
// /*已经访问过的链接*/
// a:visited {
//     text-decoration: none;
// }
// /*鼠标划过(停留)的链接*/
// a:hover {
//     text-decoration: none;
// }
// /* 正在点击的链接*/
// a:active {
//     text-decoration: none;
// }
.content_skz {
    height: 100%;
    display: flex;
    .con-left {
        // flex-basis: 200px;
        flex-basis: 160px;

        overflow-y: auto;
    }
    .con-right {
        flex: 1;
        overflow-y: auto;
    }
    .sjxz {
        //  style=" position: absolute; top: 10px;left: 400px;"
        float: right;
    }
}
.timelb {
    // margin-top: 20px;
    // height: calc(100% - 210px);
    // padding-top: 20px;
    height: 100%;
}

#tab_sjkj {
    /deep/ {
        .el-tabs__content {
            height: calc(100% - 41px);
        }
    }
}
#tab_sjkj {
    /deep/ {
        .el-tab-pane {
            // height: calc(100% - 41px);
            height: 100%;
        }
    }
}

#tab_sjkj {
    /deep/ {
        #pane-second {
            // height: calc(100% - 41px);
            // display: block !important; // element 的tab 控件对地图有影响去掉此样式
        }
        .dtgj_second {
            display: block !important; // element 的tab 控件对地图有影响去掉此样式
        }
    }
}

//地图左侧时间线开始

$jj_ny_content: 50px;
$jj_content_content: 50px;
//事件线控件区域
.eventlinekjqy {
    // margin-left: 10px;
    // padding-left: 10px;
    // height: 500px;
    // overflow-y: scroll;
    // overflow-y: auto;
}
.eventlinechild {
    /* min-height: 300px; */
    display: flex;
    padding: 0px 20px;
}
.child_point {
    border-radius: 5px;
    height: 8px;
    width: 8px;
    // border: 1px solid #4d5252;
    // background-color: rgb(21, 214, 214);
    z-index: 2;
    position: relative;
    top: 6px;
    margin-left: -8px;
}
.child_line_ny {
    /* border: 1px solid rgb(21, 214, 214); */
    border: 1px solid #eee;
    margin-left: -5px;
    // margin-top: 8px;
    margin-bottom: -9px;
    height: $jj_ny_content; //年月和内容之间的间距
}
.child_line {
    border: 1px solid #eee;
    margin-left: -5px;
    // margin-top: 8px;
    margin-bottom: -9px;
    height: $jj_content_content; //内容和内容之间的间距
}

.child_content_ny {
    height: $jj_ny_content; //年月的高度
    padding-left: 10px;
}
.child_content {
    height: $jj_content_content; //内容的高度
    margin-left: 10px;
    padding-top: 4px;
    padding-bottom: 4px;
}
.currentryjd {
    // margin-left: -8px;
    color: $color-primary;
    background: #e5f4ff;
}
.currentrypoint {
    border: 2px solid $color-primary;
    background-color: white;
}

//地图左侧时间线结束

.noData {
    height: auto;
    width: 100%;
    background-image: url("~@/assets/image/暂无数据.png");
    background-repeat: no-repeat;
    background-size: 50% 80%;
    background-position: 50% 50%;
    position: relative;
    .noData_text {
        position: absolute;
        bottom: calc(40% - 120px);
        left: calc(50% - 60px);
        font-size: 24px;
        color: #ccc;
    }
}
.noData_aside {
    height: auto;
    width: 100%;
    background-image: url("~@/assets/image/暂无数据.png");
    background-repeat: no-repeat;
    background-size: 100% 45%;
    background-position: 50% 50%;
    position: relative;
    .noData_text {
        position: absolute;
        bottom: calc(40% - 120px);
        left: calc(50% - 60px);
        font-size: 24px;
        color: #ccc;
    }
}
</style>
