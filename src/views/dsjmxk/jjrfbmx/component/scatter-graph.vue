<template>
    <div class="scatter-graph">
        <div id="container"></div>
    </div>
</template>

<script>
import Slider from "@antv/g2/lib/chart/controller/slider";
import { registerComponentController, Chart } from "@antv/g2";
registerComponentController("slider", Slider);
export default {
    components: {},
    props: {
        scatterDatas: {
            type: Array,
            default: () => {
                return [
                    // {
                    //     YAxis: 75.32,
                    //     radius: 75.32,
                    //     XAxis: "2019-01-01(元旦)"
                    // }
                ];
            }
        }
    },
    data() {
        return {
            chart: null
        };
    },
    watch: {
        scatterDatas: {
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
                // 监听container大小变化，变化后重绘图
            });
            resizeObserver.observe(document.querySelector("#container"));
            this.$once("hook:beforeDestroy", () => {
                resizeObserver.disconnect(document.querySelector("#container"));
            });
        }
    },
    methods: {
        computedColor(val) {
            let color = "#1890FF";
            if (val >= 5000 && val < 10000) {
                color = "#E6A23C";
            } else if (val > 10000) {
                color = "#F56C6C";
            }
            return color;
        },
        updateChart() {
            this.$nextTick(() => {
                let dom = document.querySelector("#container");
                if (dom) {
                    dom.innerHTML = "";
                    this.initChart();
                }
            });
        },
        initChart() {
            let self = this;
            const chart = new Chart({
                container: "container",
                autoFit: true,
                height: 500
                // padding: [16, 32, 64, 32]
            });
            chart.data(this.scatterDatas);
            // 为各个字段设置别名
            chart.scale({
                YAxis: {
                    alias: "交易金额（元）",
                    nice: true
                },
                XAxis: {
                    alias: "日期",
                    nice: true,
                    formatter(val) {
                        return String(val) || "-";
                    }
                },
                tradeTime: {
                    alias: "交易时间"
                },
                jydfkh: {
                    alias: "对方账号"
                },
                jydfxm: {
                    alias: "对方姓名"
                },
                cxkh: {
                    alias: "户主账号"
                }
            });
            chart.axis("XAxis", {
                label: {
                    formatter(val) {
                        return String(val) || "-";
                    }
                }
            });
            chart.tooltip({
                showTitle: false,
                showMarkers: false
            });
            chart.legend("radius", false); // 设置不展示的维度图例
            // chart.legend("YAxis", { position: "bottom" });
            chart
                .point()
                .position("XAxis*YAxis")
                .size("radius", [6, 40]) // 用于绘制图形大小的数据键名，可用其他数据键来绘制
                .color("radius", val => {
                    return self.computedColor(val);
                })
                // .label("YAxis", {
                //     offset: 0,
                //     style: {
                //         fill: "#000",
                //         stroke: "#FFF",
                //         lineWidth: 1
                //     }
                // })
                .shape("circle")
                .tooltip("tradeTime*YAxis*cxkh*jydfxm*jydfkh")
                .style("radius", val => {
                    return {
                        lineWidth: 1,
                        strokeOpacity: 1,
                        fillOpacity: 0.2,
                        opacity: 0.65,
                        stroke: self.computedColor(val)
                    };
                });
            chart.option("slider", {
                end: 0.6,
                formatter(val) {
                    return String(val) || "-";
                }
            });
            chart.interaction("element-active");
            this.chart = chart;
            chart.render();
        }
    }
};
</script>
<style lang="scss" scoped>
.scatter-graph {
    padding: 12px;
    box-sizing: border-box;
    position: relative;
}
</style>
