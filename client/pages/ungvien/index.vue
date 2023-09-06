<template>
    <a-layout :name="Ungvien">
        <div class="mainContent">
            <div>
                <!-- <button @click="getData">get data</button> -->
                <div class="searchBox">
                    <div style="display: flex; justify-content: center;">
                        <a-auto-complete v-model:value="value" :options="options" style="width: 30%"
                            placeholder="input here" :filter-option="filterOption" />
                        <a-tooltip title="search">
                            <a-button>
                                <SearchOutlined />
                            </a-button>
                        </a-tooltip>
                    </div>
                    <!-- <ungvienFilter /> -->
                </div>
                <hr>
                <div class="list-jobs">
                    <h2>Việc làm hot</h2>
                    <!-- display most view post -->
                    <a-row style="margin: 0 1rem;">
                        <swiper :modules="modules" navigation :pagination="{ clickable: true }" :slides-per-view="3"
                            :space-between="50" @slideChange="onSlideChange">
                            <swiper-slide v-for="job in  this.data " class="sliderItem">
                                <a-card hoverable @click="showModal(job)" style="margin: 0.7rem 0; ">
                                    <p style="color: #41cf37; font-weight: 550;">{{ job.company[0] }}</p>
                                    <a-card-meta v-bind:title="job.job_title"
                                        v-bind:description="'Mức lương: ' + job.job_salary">
                                    </a-card-meta>
                                    <div v-if="job.deadline_apply[0].includes('*')">
                                        <a-card-meta v-bind:description=job.deadline_apply>
                                        </a-card-meta>
                                    </div>
                                    <div v-else>
                                        <a-card-meta v-bind:description="'* Hạn nộp: ' + job.deadline_apply">
                                        </a-card-meta>
                                    </div>
                                </a-card>
                            </swiper-slide>
                        </swiper>

                    </a-row>
                    <div v-if="this.loginUser != ''">
                        <h2>Việc làm phù hợp với bạn</h2>

                        <a-row style="    margin: 0 1rem;">
                            <swiper :modules="modules" navigation :pagination="{ clickable: true }" :slides-per-view="3"
                                :space-between="50" @slideChange="onSlideChange">
                                <swiper-slide v-for="job in  this.data " class="sliderItem">
                                    <a-card hoverable @click="showModal(job)" style="margin: 0.7rem 0; ">
                                        <p style="color: #41cf37; font-weight: 550;">{{ job.company[0] }}</p>
                                        <a-card-meta v-bind:title="job.job_title"
                                            v-bind:description="'Mức lương: ' + job.job_salary">
                                        </a-card-meta>
                                        <div v-if="job.deadline_apply[0].includes('*')">
                                            <a-card-meta v-bind:description=job.deadline_apply>
                                            </a-card-meta>
                                        </div>
                                        <div v-else>
                                            <a-card-meta v-bind:description="'* Hạn nộp: ' + job.deadline_apply">
                                            </a-card-meta>
                                        </div>
                                    </a-card>
                                </swiper-slide>
                            </swiper>

                        </a-row>
                    </div>
                    <h2 class="job_type">Tin tổng hợp</h2>
                    <a-row style="display: flex;justify-content: space-evenly;">
                        <a-col :span="7" v-for="job in  this.data " class="job-item">
                            <a-card hoverable @click="showModal(job)" style="margin: 0.7rem 0; ">
                                <p style="color: #41cf37; font-weight: 550;">{{ job.company[0] }}</p>
                                <a-card-meta v-bind:title="job.job_title"
                                    v-bind:description="'Mức lương: ' + job.job_salary">
                                </a-card-meta>
                                <div v-if="job.deadline_apply[0].includes('*')">
                                    <a-card-meta v-bind:description=job.deadline_apply>
                                    </a-card-meta>
                                </div>
                                <div v-else>
                                    <a-card-meta v-bind:description="'* Hạn nộp: ' + job.deadline_apply">
                                    </a-card-meta>
                                </div>
                            </a-card>

                        </a-col>

                    </a-row>
                    <div class="pagination">
                        <a-pagination v-model:current="current" simple :total="50" />
                    </div>

                    <a-modal v-model:open="open" title="Job title" @ok="handleOk">
                        <template #footer>
                            <a-button key="back" @click="handleCancel">Close</a-button>
                            <a-button key="submit" type="primary" :loading="loading" @click="handleSubmitCV">Nộp
                                CV
                            </a-button>
                            <a-popconfirm title="Are you sure delete this task?" ok-text="Yes" cancel-text="No"
                                @confirm="confirm" @cancel="cancel">
                            </a-popconfirm>
                        </template>
                        <div>
                            <div style="display: flex;justify-content: center;">
                                <img alt="example" v-bind:src=selectedJob.logo[0] class="job-item_logo" />
                            </div>
                            <h4>Yêu cầu công việc:</h4>
                            <span v-for=" i  in  selectedJob.job_requirement ">
                                {{ i }}
                            </span>

                            <h4>Lợi ích:</h4>
                            <span v-for=" i  in  selectedJob.job_benefit ">
                                {{ i }}
                            </span>
                        </div>
                    </a-modal>
                </div>
            </div>
        </div>
        <hr>
    </a-layout>
</template>
<script >
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';
import myData from '../../assets/data/data';
import { SearchOutlined } from '@ant-design/icons-vue';
// import Ungvien from './../../layouts/ungvien.vue'
// import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';
definePageMeta({
    layout: 'ungvien'
})

export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    layout: 'ungvien',
    setup() {
        const filterOption = (input, option) => {
            return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
        };
        // const onSwiper = (swiper) => {
        //     console.log(swiper);
        // };
        const onSlideChange = () => {
            console.log('slide change');
        };
        return {
            // onSwiper,
            onSlideChange,
            filterOption,
            modules: [Navigation, Pagination, A11y],
            // users
        };
    },
    data() {
        return {
            slides: 7,
            value: ref(),
            open: false,
            selectedJob: {},
            options: [],
            data: [],
            userLogin: {},
            isLogin: '',
        }

    },
    async mounted() {
        if (this.isLogin != '') {
            this.userLogin = await useFetch('http://localhost:8000/users/getUser/' + this.isLogin);
            console.log("profile ung vien login:", this.userLogin)
        }
        this.data = myData;
        // console.log(this.users)
        this.options = this.data.map((item) => {
            return {
                ...item,
                label: item.job_title,
                value: item.job_title
            }
        });
    },
    methods: {
        getSearchList(value) {
            if (this.value.length > 0) {
                console.log
            }
        },
        showModal(job) {
            this.selectedJob = job
            this.open = true;
        },

        handleSubmitCV() {
            if (this.userLogin.data.role == '1' && this.userLogin.data.hasOwnProperty('CV')) {
                console.log("nop ok")
            } else {
                alert("Bạn chưa có CV")
            }

            this.open = false;
        },

        handleCancel() {
            this.open = false;
        },
        getSearchList() {

            this.options = this.data.map((item) => {
                return {
                    ...item,
                    label: item.job_title,
                    value: item.job_title
                }
            });
        },
    },

}
</script>

<style scoped lang="scss">
:deep(.slick-slide) {
    text-align: center;
    height: 160px;
    line-height: 160px;
    background: #364d79;
    overflow: hidden;
}

.slick-arrow.custom-slick-arrow {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    background-color: rgba(119, 175, 35, 0.11);
    transition: ease all 0.3s;
    opacity: 0.3;
    z-index: 1;
}

.slick-arrow.custom-slick-arrow:before {
    display: none;
}

.slick-arrow.custom-slick-arrow:hover {
    color: #fff;
    opacity: 0.5;
}

.slick-slide h3 {
    color: #fff;
}

body {
    overflow-y: hidden;
    /* Hide vertical scrollbar */
}

.mainContent {
    background-color: gainsboro;
}

.pagination {
    display: flex;
    justify-content: center;
    padding: 6px 0px;
    // background-color: rgb(203, 191, 191);
}

.searchBox {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 10px;

}

.job-item_logo {
    width: 50%;
    /* image-fi */
}

.job_type {

    width: 13rem;
}

.ant-card {
    height: 13rem;
}

// .sliderItem{
//     background-color: red;
// }
</style>