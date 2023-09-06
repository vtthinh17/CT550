<template>
    <div class="filter">
        
        <div class="filterItem">Mức lương</div>
        <div class="filterItem">Đăng trong</div>
        <div class="filterItem">Kinh nghiệm</div>
        <div class="filterItem">Ngành nghề</div>
    </div>
</template>
<style lang="scss">
.filter {
    display: flex;
    justify-content: space-around;
    margin-top: 1rem;
    // background-color: gainsboro;
    padding: 1rem 0;
    .filterItem{
        background-color: rgb(168, 182, 227);
        border: 1px solid black;
        padding: 4px;
        border-radius: 5px;
    }
}
</style>