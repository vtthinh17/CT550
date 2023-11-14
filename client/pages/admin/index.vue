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
                    </a-col>
                    <a-col :span="6"
                        style="font-size: 1rem;color: #0c0606; display: flex; flex-direction: column; background: transparent linear-gradient(90deg,#a1dc65,#66cc80) 0 0 no-repeat padding-box;"
                        class="gradient_item" @click="navigateTo('./admin/posts/unApprovedPosts')">
                        <CarryOutOutlined />Tin chờ duyệt
                    </a-col>
                </a-row>
                <div style="padding: 24px; background: #fff;"></div>

            </a-layout-content>

            <!-- Chart -->
            <a-layout-content>
                <Bar v-if="loaded" :data="chartData" :options="options" />
                <!-- <div id="main" style="width: 70%; height:30rem;"></div> -->
            </a-layout-content>
        </div>
        <div v-else>
            Bạn cần đăng nhập với tài khoản quản trị
        </div>



    </a-layout>
</template>
<script>
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
export default {
    components: {
        Bar
    },
    setup() {
        definePageMeta({
            layout: 'admin'
        })
    },
    data() {
        return {
            chartData: {
                labels: [
                    'Tháng 1',
                    'Tháng 2',
                    'Tháng 3',
                    'Tháng 4',
                    'Tháng 5',
                    'Tháng 6',
                    'Tháng 7',
                    'Tháng 8',
                    'Tháng 9',
                    'Tháng 10',
                    'Tháng 11',
                    'Tháng 12'
                ],
                datasets: [
                    {
                        label: 'Số tin tuyển dụng theo từng tháng tháng',
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 205, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(201, 203, 207, 0.2)',
                            'rgba(255, 253, 99 , 0.2)',
                            'rgba(99, 255, 128 , 0.2)',
                            'rgba(115, 25, 25 , 0.2)',
                            'rgba(85, 85, 85 , 0.2)',
                            'rgba(0, 0, 85 , 0.2)',




                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(153, 102, 255)',
                            'rgb(201, 203, 207)',
                            'rgb(255, 253, 99 )',
                            'rgb(99, 255, 128)',
                            'rgb(115, 25, 25)',
                            'rgb(85, 85, 85)',
                            'rgb(0, 0, 85)',
                        ],
                        borderWidth: 1,
                        data: [40, 20, 12, 39, 10, 40, 39, 60, 40, 20, 12, 11]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            },
            isLogin: false,
            userLogin: {},
            allPostData: false,
            loaded: false,
        }
    },
    methods: {
        getNumberOrPostEachMonth() {
            let temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            this.allPostData.forEach(post => {
                console.log(post.job_title)
                console.log('=>>>>thang', post.deadline.slice(3, 5))
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
                this.allPostData = await $fetch('http://localhost:8000/posts/getAll');
                let postPerMonth = this.getNumberOrPostEachMonth();
                // bỏ dòng 151 để ra giá trị khởi tạo
                this.chartData.datasets[0].data = postPerMonth;
                this.loaded = true;
            }

        }

    },
    computed: {
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
        cursor: pointer;
        opacity: 0.75;
        background: #2e6edf;
    }
}
</style>