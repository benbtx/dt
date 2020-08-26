<template>
    <div class="main">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "index"
};
</script>

<style scoped lang="scss">
.main {
    position: relative;
    height: 100%;
    width: 100%;
    border: 1px solid #d3dce6;
    border-radius: 8px;
    box-shadow: 2px 2px 2px #ced3d9;
    overflow: hidden;
    background: #fff;
}
</style>
