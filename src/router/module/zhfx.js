import Home from "@/views/home/index.vue";
export const ldgxfx = [
    {
        path: "/zhfx",
        redirect: "/zhfx/ldgxfx",
        component: Home,
        icon: "icon-shujuwajue",
        name: "综合分析",
        meta: {
            title: "综合分析"
            // authRule: ["ad_manage"]
        },
        children: (one => [
            {
                path: "ldgxfx",
                component: () =>
                    import(
                        "@/views/zhfx/dimension-relation-analysis/index.vue"
                    ),
                name: `${one}ldgxfx`,
                icon: "",
                meta: {
                    title: "六度关系分析"
                }
            },
            {
                path: "dskfx",
                component: () =>
                    import("@/views/zhfx/multi-space-time/dskfx.vue"),
                name: `${one}dskfx`,
                icon: "",
                meta: {
                    title: "多时空分析"
                }
            },
            {
                path: "gxwfx",
                component: () =>
                    import("@/views/zhfx/relation-network-analysis/index.vue"),
                name: `${one}gxwfx`,
                icon: "",
                meta: {
                    title: "关系网分析"
                }
            },
            {
                path: "ljdfx",
                component: () =>
                    import("@/views/zhfx/stopover-analysis/ljdfx.vue"),
                name: `${one}ljdfx`,
                icon: "",
                meta: {
                    title: "落脚点分析"
                }
            },
            {
                path: "ypty",
                component: () => import("@/views/zhfx/inference/"),
                name: `${one}ypty`,
                icon: "",
                meta: {
                    title: "研判推演"
                }
            },
            {
                path: "dataComparison",
                component: () =>
                    import("@/views/zhfx/data-comparison/index.vue"),
                name: `${one}dataComparison`,
                icon: "",
                meta: {
                    title: "数据比对"
                }
            }
        ])("userManage_")
    }
];
export default ldgxfx;
