<template>
    <div class="bar-graph">
        <div id="barContainer"></div>
    </div>
</template>

<script>
import Slider from "@antv/g2/lib/chart/controller/slider";
import { registerComponentController, registerTheme, Chart } from "@antv/g2";
registerTheme("myStyle", {
    maxColumnWidth: 40
});
registerComponentController("slider", Slider);

export default {
    components: {},
    props: {
        barData: {
            type: Array,
            default: () => [
                // {
                //     name,
                //     amount,
                //     date
                // }
            ]
        }
    },
    data() {
        return {};
    },
    watch: {
        barData: {
            handler() {
                this.updateChart();
            },
            deep: true
            // immediate: true
        }
    },
    computed: {},
    created() {},
    mounted() {
        this.initChart();
        let self = this;
        let { ResizeObserver } = window;
        if (ResizeObserver) {
            // 如果浏览器支持 ResizeObserver则开启，开启时在屏幕切换时会有更好的体验
            const resizeObserver = new ResizeObserver(() => {
                self.updateChart();
                // 监听barContainer大小变化，变化后重绘图
            });
            resizeObserver.observe(document.querySelector("#barContainer"));
            this.$once("hook:beforeDestroy", () => {
                resizeObserver.disconnect(
                    document.querySelector("#barContainer")
                );
            });
        }
    },
    methods: {
        updateChart() {
            this.$nextTick(() => {
                let dom = document.querySelector("#barContainer");
                if (dom) {
                    dom.innerHTML = "";
                    this.initChart();
                }
            });
        },
        initChart() {
            const chart = new Chart({
                container: "barContainer",
                autoFit: true,
                height: 500
            });
            chart.theme("myStyle");
            chart.data(this.barData);
            chart.scale({
                amount: {
                    nice: true
                }
                // date: {
                //     // type: "timeCat"
                //     formatter: val => val
                // }
            });
            chart.tooltip({
                showMarkers: false,
                shared: true
            });
            chart
                .interval()
                .position("date*amount")
                .color("name")
                .adjust([
                    {
                        type: "dodge",
                        dodgeBy: "name",
                        marginRatio: 0
                    }
                ]);
            chart.legend("name", { position: "top" });
            chart.option("slider", {
                end: 0.6
            });
            chart.interaction("active-region");
            chart.render();
        }
    }
};
</script>
<style lang="scss" scoped>
.bar-graph {
    padding: 12px;
    box-sizing: border-box;
    position: relative;
}
</style>
