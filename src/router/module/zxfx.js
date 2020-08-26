import Home from "@/views/home/index.vue";
export const fcfx = [
    {
        path: "/zxfx",
        redirect: "/zhfx/fcfx",
        component: Home,
        icon: "icon-zhandianshujutongji",
        name: "专项分析",
        meta: {
            title: "专项分析"
            // authRule: ["ad_manage"]
        },
        children: (one => [
            {
                path: "fcfx",
                component: () =>
                    import("@/views/zxfx/realestate-analysis/index.vue"),
                name: `${one}fcfx`,
                icon: "",
                meta: {
                    title: "房产分析"
                }
            },
            {
                path: "gsfx",
                component: () =>
                    import("@/views/zxfx/company-analysis/index.vue"),
                name: `${one}gsfx`,
                icon: "",
                meta: {
                    title: "工商分析"
                }
            }
        ])("userManage_")
    }
];
export default fcfx;
