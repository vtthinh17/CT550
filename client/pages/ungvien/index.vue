<template>
    <a-layout :name="Ungvien">
        <div class="mainContent">
            <div>
                <!-- <button @click="getData">get data</button> -->
                <div class="searchBox">
                    <a-auto-complete v-model:value="value" :options="options" style="width: 30%" placeholder="input here"
                        :filter-option="filterOption" />
                    <a-tooltip title="search">
                        <a-button>
                            <SearchOutlined />
                        </a-button>
                    </a-tooltip>
                </div>

                <div class="list-jobs">
                    <h2 class="job_type">Popular Jobs</h2>
                    <a-row>
                        <a-col :span="8" v-for="job in this.data" class="job-item" >
                            <a-card hoverable @click="showModal(job)">
                                <!-- <a-row> -->
                                <!-- <a-col :span="8">
                                        <template #cover class="anhbia">
                                            <img alt="example" v-bind:src=job.logo[0] class="job-item_logo" />
                                        </template>
                                    </a-col> -->
                                <!-- <a-col :span="16"> -->
                                <h4>
                                    {{ job.company[0] }}
                                </h4>
                                <a-card-meta v-bind:title=job.job_title v-bind:description=job.job_salary>
                                </a-card-meta>
                                <a-card-meta v-bind:description=job.deadline_apply>
                                </a-card-meta>

                                <!-- </a-col> -->

                                <!-- </a-row> -->
                            </a-card>

                        </a-col>

                    </a-row>
                    <div class="pagination" >
                        <a-pagination v-model:current="current" simple :total="50" />
                    </div>
                    <h2 class="job_type">News Jobs</h2>
                    <a-row>
                        <a-col :span="8" v-for="job in this.data" class="job-item">
                            <a-card hoverable @click="showModal(job)">
                                <!-- <a-row> -->
                                <!-- <a-col :span="8">
                                        <template #cover class="anhbia">
                                            <img alt="example" v-bind:src=job.logo[0] class="job-item_logo" />
                                        </template>
                                    </a-col> -->
                                <!-- <a-col :span="16"> -->
                                <h4>
                                    {{ job.company[0] }}
                                </h4>
                                <a-card-meta v-bind:title=job.job_title v-bind:description=job.job_salary>
                                </a-card-meta>
                                <a-card-meta v-bind:description=job.deadline_apply>
                                </a-card-meta>

                                <!-- </a-col> -->

                                <!-- </a-row> -->
                            </a-card>
                        </a-col>

                    </a-row>
                    <div class="pagination" >
                        <a-pagination v-model:current="current" simple :total="50" />
                    </div>
                    <a-modal v-model:open="open" title="Job title" @ok="handleOk">
                        <template #footer>
                            <a-button key="back" @click="handleCancel">Close</a-button>
                            <a-button key="submit" type="primary" :loading="loading" @click="handleOk">Nộp CV</a-button>
                        </template>
                        <div>
                            <div style="display: flex;justify-content: center;">
                                <img alt="example" v-bind:src=selectedJob.logo[0] class="job-item_logo" />
                            </div>
                            <h4>Yêu cầu công việc:</h4>
                            <span v-for="i in selectedJob.job_requirement">
                                {{ i }}
                            </span>

                            <h4>Lợi ích:</h4>
                            <span v-for="i in selectedJob.job_benefit">
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

import myData from '../../assets/data/data';
import { SearchOutlined } from '@ant-design/icons-vue';
import Ungvien from './../../layouts/ungvien.vue'
definePageMeta({
    layout: 'ungvien'
})

export default {
    layout: 'ungvien',
    setup() {
        const filterOption = (input, option) => {
            return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
        };
        return {
            filterOption,
            // users
        };
    },
    data() {
        return {
            value: ref(),
            open: false,
            selectedJob: {},
            options: [],
            data: [],
            users:[]
        }

    },
    mounted() {
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

        handleOk() {
            console.log("ok")
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
        async getData(){
             this.users = await useFetch('http://localhost:8000/users/getAll');
             console.log(this.users)
        }
    },

}
</script>

<style scoped lang="scss">
body {
    overflow-y: hidden;
    /* Hide vertical scrollbar */
}
.mainContent{
    background-color: gainsboro;
}
.pagination{
    display: flex;
    justify-content: center;
    padding: 6px 0px;
    // background-color: rgb(203, 191, 191);
}
.searchBox {
    display: flex;
    justify-content: center;
    padding-top: 10px;

}

.job-item_logo {
    width: 50%;
    /* image-fi */
}

.job_type {

    width: 13rem;
    // background-color: rgba($color: #000000, $alpha: 0.1);
}
// .ant-card-body{
  
// }   


</style>