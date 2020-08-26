<template>
    <div>
        <div id="bar"></div>
    </div>
</template>

<script>
import { registerTheme, Chart } from "@antv/g2";
// import { createThemeByStylesheet } from "@antv/g2/lib/util/theme";
let CHART;
export default {
    props: {
        dialogData: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {};
    },
    methods: {
        initChart() {
            const chart = new Chart({
                container: "bar",
                autoFit: true,
                height: 300
            });
            // 设置柱状图最大宽度
            registerTheme("newTheme", {
                maxColumnWidth: 40
            });
            chart.theme("newTheme");

            CHART = chart;
            chart.scale({
                range: [1, 20]
            });
            chart.scale("amount", {
                nice: true
            });
            chart.scale("dealTime", {
                type: "timeCat"
            });
            chart.axis("id", {
                label: {
                    // 使用 formatter 回调函数
                    formatter: val => {
                        return val.split(" ")[0];
                    }
                }
            });
            // 设置留白, 图形与侧边的距离的百分比
            chart.scale("card", {
                shared: true,
                range: [0.2, 0.8]
            });
            chart.tooltip({
                showTitle: false,
                showMarkers: false, // 不展示 tooltip markers
                itemTpl: `
                <ul class="g2-tooltip-list">
                    <li class="g2-tooltip-list-item">
                        <span class="g2-tooltip-marker" style="background: {color};"></span>
                        <span class="g2-tooltip-name">交易账号：</span>
                        <span class="g2-tooltip-value">{card}</span>
                    </li>
                    <li class="g2-tooltip-list-item">
                        <span class="g2-tooltip-marker" style="background: {color};"></span>
                        <span class="g2-tooltip-name">交易金额：</span>
                        <span class="g2-tooltip-value">{amount}</span>
                    </li>
                    <li class="g2-tooltip-list-item">
                        <span class="g2-tooltip-marker" style="background: {color};"></span>
                        <span class="g2-tooltip-name">交易时间：</span>
                        <span class="g2-tooltip-value">{dealTime}</span>
                    </li>
                </ul>
                `
            });
            chart.data(this.dialogData);
            chart.interaction("active-region"); // 使用 active-region 交互行为
            chart
                .interval()
                .position("id*amount")
                .tooltip("card*amount*dealTime", (card, amount, dealTime) => {
                    return {
                        card,
                        amount,
                        dealTime
                    };
                });
            chart.interaction("active-region");
            chart.render();
        }
    },
    mounted() {
        this.initChart();
    },
    watch: {
        dialogData() {
            CHART.changeData(this.dialogData);
        }
    }
};
</script>

<style lang="scss" scoped></style>
