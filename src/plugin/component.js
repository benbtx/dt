import Vue from "vue";

import HighchartsVue from "highcharts-vue";
import IconSvg from "@/components/common/IconSvg.vue"; // svg组件
import krGraph from "@/components/kr-graph/index.vue";
import krChoose from "@/components/kr-choose/index.vue";
import krMap from "@/components/kr-map/indexMap.vue";
import krRelationPath from "@/components/kr-relation-patn/index.vue";
import krAnalysisPage from "@/components/kr-analysis-page/index.vue";
import krAnalysisPageTable from "@/components/kr-analysis-page-table/index.vue";
import krTable from "@/components/kr-table/index.vue";
import krPagination from "@/components/kr-pagination/index.vue";
import KrSectionTitle from "@/components/kr-section-title";
import krIcon from "@/components/kr-icon";
import krPage from "@/components/kr-page";
import krFlowChart from "@/components/kr-flow-chart";
import KrDetailInfo from "@/components/kr-detail-info";
import krTreeGraph from "@/components/kr-tree-graph";
import krExcelImport from "@/components/kr-excel-import";
import krElTable from "@/components/kr-el-table";

import ImpPanel from "@/components/common/panel.vue";
import collapseToolPage from "@/components/common/collapse-tool-page.vue";

import krExport from "@/components/kr-excel-export/index.vue";
import krNoData from "@/components/kr-no-data/index.vue";
import krTableInfo from "@/components/kr-table-info/index.vue";
import krTableInfoNews from "@/components/kr-table-info-news/index.vue";

// 注册全局组件（register global）
Vue.component("icon-svg", IconSvg);
Vue.component(ImpPanel.name, ImpPanel);
Vue.component(collapseToolPage.name, collapseToolPage);
Vue.component("krGraph", krGraph);
Vue.component("krMap", krMap);
Vue.component("krRelationPath", krRelationPath);
Vue.component("krAnalysisPage", krAnalysisPage);
Vue.component("krAnalysisPageTable", krAnalysisPageTable);
Vue.component("krTable", krTable);
Vue.component("krPagination", krPagination);
Vue.component("KrSectionTitle", KrSectionTitle);
Vue.component("KrChoose", krChoose);
Vue.component("krIcon", krIcon);
Vue.component("krPage", krPage);
Vue.component("krFlowChart", krFlowChart);
Vue.component("KrDetailInfo", KrDetailInfo);
Vue.component("krTreeGraph", krTreeGraph);
Vue.component("krExcelImport", krExcelImport);
Vue.component("krElTable", krElTable);
Vue.use(HighchartsVue);
Vue.component("krExport", krExport);
Vue.component("krNoData", krNoData);
Vue.component("krTableInfo", krTableInfo);
Vue.component("krTableInfoNews", krTableInfoNews);
