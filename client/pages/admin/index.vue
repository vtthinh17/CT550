<template>
    <a-layout :name="admin">
        <div v-if="userLogin && userLogin.role == '3'">
            <h2>Hệ thống tuyển dụng việc làm</h2>
            <a-layout-content>
                <a-row v-if="loaded" class="gradient_list" style="padding: 2rem;" justify="space-around">
                    <a-col :span="5"
                        style="font-size: 1rem;color: #0c0606; display: flex; flex-direction: column;background-color: rgb(219, 213, 213);"
                        class="gradient_item">
                        <FileSearchOutlined /><span style="font-weight: 370; font-size: 1rem;">Số tin tuyển dụng</span>
                        <b>{{ getAllPostDataLength }}</b>
                    </a-col>
                    <a-col :span="5"
                        style="font-size: 1rem;color: #0c0606; display: flex; flex-direction: column;background: rgba(255, 252, 86, 0.7) 0 0 no-repeat padding-box;"
                        class="gradient_item">
                        <UserOutlined /><span style="font-weight: 370; font-size: 1rem;">Số người dùng</span>
                        <b>{{ getAllUserDataLength }}</b>
                    </a-col>
                    <a-col :span="5"
                        style="font-size: 1rem;color: #0c0606; display: flex; flex-direction: column; background: rgba(91, 248, 119, 0.7) 0 0 no-repeat padding-box;"
                        class="gradient_item" @click="navigateTo('admin/posts/unApprovedPosts')">
                        <CarryOutOutlined /><span style="font-weight: 370; font-size: 1rem;">Tin chờ duyệt</span>
                        <b>{{ getTotalUnapprovedPosts }}</b>
                    </a-col>
                    <a-col :span="5"
                        style="font-size: 1rem;color: #0c0606; display: flex; flex-direction: column; background: rgba(255, 205, 86, 0.7) 0 0 no-repeat padding-box;"
                        class="gradient_item">
                        <RiseOutlined /><span style="font-weight: 370; font-size: 1rem;">Người dùng mới</span>
                        <!-- <CarryOutOutlined />Người dùng mới -->
                        <b>{{ getToDayNewAccount }}</b>
                    </a-col>
                </a-row>
            </a-layout-content>
            <!-- <a-divider></a-divider> -->
            <div style="padding: 24px; background: #fff;"></div>
            <!-- Chart -->
            <a-layout-content style="display: flex; height: 20rem; justify-content: center; padding: 1rem;">
                <Pie v-if="loaded" :data="pieData" />
            </a-layout-content>


            <div style="padding: 24px; background: #fff;"></div>
            <a-layout-content>
                <Bar v-if="loaded" :data="chartData" :options="options" />
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
    LinearScale,
    ArcElement
} from 'chart.js'
import { Bar, Pie } from 'vue-chartjs'
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)
export default {
    components: {
        Bar, Pie
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
            pieData: {
                labels: [
                    'Ứng viên',
                    'Nhà tuyển dụng',
                ],
                datasets: [{
                    label: 'Số lượng',
                    data: [300, 50],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            },
            isLogin: false,
            userLogin: {},
            allPostData: false,
            allUserData: false,
            todayNewAccount: false,
            totalUnapprovedPosts: 0,
            loaded: false,
        }
    },
    methods: {
        getNumberOfPostEachMonth() {
            let temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            this.allPostData.forEach(post => {
                for (let i = 1; i <= 12; i++) {
                    if (Number(post.deadline.slice(3, 5)) == i) {
                        temp[i - 1] = temp[i - 1] + 1;
                    }
                }
            })
            return temp
        },
        getNumberOfCandidates() {
            let temp = [0, 0];
            this.allUserData.forEach(user => {

                if (user.role == 1) {
                    temp[0] = temp[0] + 1;
                } else if (user.role == 2) {
                    temp[1] = temp[1] + 1;
                } else {

                }
            })
            return temp
        },
        getNumberOfUnApprovedPosts() {
            this.allPostData.forEach(post => {
                if (post.status === 0) {
                    this.totalUnapprovedPosts++;
                }
            })
        },

    },
    async mounted() {
        if (process.client) {
            this.isLogin = localStorage.getItem('loginUserID');
            if (this.isLogin) {
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
                this.allPostData = await $fetch('http://localhost:8000/posts/getAll');
                this.allUserData = await $fetch('http://localhost:8000/users/getAll');
                this.todayNewAccount = await $fetch('http://localhost:8000/users/getTodayCreatedAccount');
                console.log('all user', this.allUserData)
                let postPerMonth = this.getNumberOfPostEachMonth();
                this.chartData.datasets[0].data = postPerMonth;
                // console.log('so luong ung vien vs nha tuyen dung', this.getNumberOfCandidates())
                this.pieData.datasets[0].data = this.getNumberOfCandidates();
                this.getNumberOfUnApprovedPosts();
                this.loaded = true;
            }

        }

    },
    computed: {
        getAllUserDataLength() {
            return this.allUserData.length - 1;
        },
        getAllPostDataLength() {
            return this.allPostData.length;
        },
        getToDayNewAccount() {
            return this.todayNewAccount;
        },
        getTotalUnapprovedPosts(){
            return this.totalUnapprovedPosts;
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
        cursor: pointer;
        opacity: 0.75;
        background: #2e6edf;
    }
}
</style>