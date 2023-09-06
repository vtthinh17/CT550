<template>
    <div class="filter">

        <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
                Mức lương
                <DownOutlined />
            </a>
            <template #overlay>
                <a-menu @click="onClick">
                    <a-menu-item key="1">1st menu item</a-menu-item>
                    <a-menu-item key="2">2nd menu item</a-menu-item>
                    <a-menu-item key="3">3rd menu item</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>

        <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
                Tuổi
                <DownOutlined />
            </a>
            <template #overlay>
                <a-menu @click="onClick">
                    <a-menu-item key="1">1st menu item</a-menu-item>
                    <a-menu-item key="2">2nd menu item</a-menu-item>
                    <a-menu-item key="3">3rd menu item</a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>
<script lang="ts" setup>
import { DownOutlined } from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';
const onClick: MenuProps['onClick'] = ({ key }) => {
  console.log(`Click on item ${key}`);
};

</script>
<style lang="scss">
.filter {
    display: flex;
    justify-content: space-around;
    margin-top: 1rem;
    // background-color: gainsboro;
    padding: 1rem 0;

    .filterItem {
        background-color: rgb(168, 182, 227);
        border: 1px solid black;
        padding: 4px;
        border-radius: 5px;
    }
}
</style>