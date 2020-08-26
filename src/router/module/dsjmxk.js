import Home from "@/views/home/index.vue";
export const xzqrmx = [
    {
        path: "/dsjmxk",
        redirect: "/dsjmxk/xzqrmx",
        component: Home,
        icon: "icon-neirongmoxingshezhi",
        name: "大数据模型库",
        meta: {
            title: "大数据模型库"
            // authRule: ["ad_manage"]
        },
        children: (one => [
            {
                path: "xzqrmx",
                component: () => import("@/views/dsjmxk/xzqrmx/index.vue"),
                name: `${one}xzqrmx`,
                icon: "",
                meta: {
                    title: "寻找情人模型"
                }
            },
            {
                path: "jjrfbmx",
                component: () =>
                    import(
                        /* webpackChunkName: "jjrfbmx" */ "@/views/dsjmxk/jjrfbmx/index.vue"
                    ),
                name: `${one}jjrfbmx`,
                icon: "",
                meta: {
                    title: "节假日腐败"
                }
            },
            // {
            //     path: "glzcmx",
            //     component: () =>
            //         import(
            //             /* webpackChunkName: "glzcmx" */ "@/views/dsjmxk/glzcmx/index.vue"
            //         ),
            //     name: `${one}glzcmx`,
            //     icon: "",
            //     meta: {
            //         title: "关联资产模型"
            //     }
            // },
            {
                path: "gtgxfxmx",
                component: () => import("@/views/dsjmxk/gtgxfxmx/index.vue"),
                name: `${one}gtgxfxmx`,
                icon: "",
                meta: {
                    title: "共同关系分析模型"
                }
            },
            {
                path: "dskbs",
                component: () =>
                    import(
                        "@/views/dsjmxk/multiple-spatiotemporal-adjoint/dskbs.vue"
                    ),
                name: `${one}dskbs`,
                icon: "",
                meta: {
                    title: "多时空伴随分析模型"
                }
            },
            {
                path: "sjgz",
                component: () =>
                    import("@/views/dsjmxk/data-resonance/sjgz.vue"),
                name: `${one}sjgz`,
                icon: "",
                meta: {
                    title: "数据共振分析模型"
                }
            },
            {
                path: "pm",
                component: () => import("@/views/dsjmxk/meet/pm.vue"),
                name: `${one}pm`,
                icon: "",
                meta: {
                    title: "碰面分析模型"
                }
            },
            {
                path: "xqtzfxmx",
                component: () => import("@/views/dsjmxk/xqtzfxmx"),
                name: `${one}xqtzfxmx`,
                icon: "",
                meta: {
                    title: "洗钱特征分析模型"
                }
            }
        ])("userManage_")
    }
];
export default xzqrmx;
