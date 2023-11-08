<template>
    <a-layout :name="admin">
        <div v-if="userLogin && userLogin.role == '3'">
            <h2>Hệ thống tuyển dụng việc làm</h2>
            <a-layout-content>
                <a-row class="gradient_list" style="padding: 2rem;">
                    <a-col :span="6"
                        style="font-size: 1rem;color: #0c0606; display: flex; flex-direction: column;background-color: rgb(219, 213, 213);"
                        class="gradient_item">
                        Số tin tuyển dụng
                        <b>1004</b>
                    </a-col>
                    <a-col :span="6"
                        style="font-size: 1rem;color: #0c0606; display: flex; flex-direction: column;background: transparent linear-gradient(90deg,#41bfad,#3bd3e6) 0 0 no-repeat padding-box;"
                        class="gradient_item">
                        Số lượng người dùng trên hệ thống
                        <b>{{ allUserData.length }}</b>
                    </a-col>
                    <a-col :span="6"
                        style="font-size: 1rem;color: #0c0606; display: flex; flex-direction: column; background: transparent linear-gradient(90deg,#a1dc65,#66cc80) 0 0 no-repeat padding-box;"
                        class="gradient_item">
                        <CarryOutOutlined />Tin chờ duyệt
                        <!-- {{ console.log("aaaaaaa",this.pendingPostList) }} -->
                        <!-- <b>{{ pendingPostList.length }}</b> -->
                    </a-col>
                </a-row>
                <div style="padding: 24px; background: #fff;"></div>

            </a-layout-content>
            <!-- Chart -->
            <a-layout-content>
                <div id="main" style="width: 70%; height:30rem;"></div>
            </a-layout-content>
        </div>
        <div v-else>
            Bạn cần đăng nhập với tài khoản quản trị
        </div>



    </a-layout>
</template>
<script>
import * as echarts from 'echarts';

export default {
    setup() {
        definePageMeta({
            layout: 'admin'
        })
    },
    data() {
        return {
            isLogin: false,
            userLogin: {},
            allUserData: false,
            allPostData: false,
        }
    },
    methods: {
        getNumberOrPostEachMonth() {
            let temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            this.allPostData.forEach(post => {
                for (let i = 1; i <= 12; i++) {
                    if (Number(post.deadline.slice(3, 5)) == i) {
                        temp[i - 1] = temp[i - 1] + 1;
                    }
                }
            })
            return temp
        }
    },
    async mounted() {
        if (process.client) {
            this.isLogin = localStorage.getItem('loginUserID');
            if (this.isLogin) {
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
                this.allUserData = await $fetch('http://localhost:8000/users/getAll');
                this.allPostData = await $fetch('http://localhost:8000/posts/getAll');
            }

        }
        if (typeof document !== 'undefined') {
            let data = this.getNumberOrPostEachMonth();
            console.log(data);
            let chartDom = document.getElementById('main');
            var myChart = echarts.init(chartDom);
            var option = {
                title: {
                    text: 'Số lượng tin tuyển dụng theo từng tháng'
                },
                tooltip: {},
                legend: {
                    data: ['Lượt đăng']
                },
                xAxis: {
                    data: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
                },
                yAxis: {},
                series: [
                    {
                        name: 'Tin tuyển dụng',
                        type: 'bar',
                        data: data
                    }
                ],

            };
            myChart.setOption(option);
        }


    },
    computed: {
        candidatesList() {
            let cdList = []
            if (this.allUserData) {
                this.allUserData.forEach(element => {
                    if (element.role == '1') {
                        cdList.push(element)
                    }
                });
            }

            return cdList;
        },
        pendingPostList() {
            let pendingList = []
            this.allPostData.forEach(element => {
                if (element.status == 0) {
                    pendingList.push(element)
                }
            });
            return pendingList;
        },

    }
}
</script>


<style scoped lang="scss">
.gradient_list {
    display: flex;
    flex-flow: row wrap;
    min-width: 0;
    justify-content: space-around;
    margin-top: 14px;

    .gradient_item {
        box-shadow: inset 0 0 0 0 blue;
        transition: .2s ease-out;
        height: 20rem;
        padding: 0;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 8rem;
    }

    .gradient_item:hover {
        background: #2e6edf;
    }
}
</style>