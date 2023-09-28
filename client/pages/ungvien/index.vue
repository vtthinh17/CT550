<template>
    <a-layout :name="Ungvien">
        <div class="mainContent">
            <div>
                <div class="searchBox">
                    <div style="display: flex; justify-content: center;">
                        <span style="padding-top: 5px; padding-right: 10px;">Tìm kiếm bài đăng:</span>
                        <a-auto-complete v-model:value="value" :options="options" style="width: 30%"
                            placeholder="Nhập tên bài tuyển dụng" :filter-option="filterOption" />
                        <a-tooltip title="search">
                            <a-button>
                                <SearchOutlined />
                            </a-button>
                        </a-tooltip>
                    </div>
                </div>
                <hr>
                <!-- filter -->
                <div style="display: flex; justify-content: center;">
                    <a-cascader class="filterOption" v-model:value="filter_major" style="width: 30%" multiple
                        max-tag-count="responsive" :options="filterOptions_major" placeholder="Lĩnh vực">
                    </a-cascader>
                    <a-cascader class="filterOption" v-model:value="filter_education" style="width: 10%" multiple
                        max-tag-count="responsive" :options="filterOptions_education" placeholder="Trình độ">
                    </a-cascader>
                    <a-cascader class="filterOption" v-model:value="filter_expPrequire" style="width: 20%" multiple
                        max-tag-count="responsive" :options="filterOptions_expPrequire" placeholder="Yêu cầu kinh nghiệm">
                    </a-cascader>
                    <a-cascader class="filterOption" v-model:value="filter_workingType" style="width: 20%" multiple
                        max-tag-count="responsive" :options="filterOptions_workingType" placeholder="Hình thức làm việc">
                    </a-cascader>
                    <button class="button-32" role="button" @click="getFilterOptions">Tìm kiếm</button>
                </div>
                <div>
                </div>
                <!-- list jobs -->
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
                    <div v-if="isLogin">
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
                    <!-- Post from database -->
                    <h2 class="job_type">Có thể ứng tuyển</h2>
                    <a-row style="display: flex;justify-content: space-evenly;">
                        <a-col :span="7" v-for="job in getPosts" class="job-item">
                            <a-card hoverable @click="showModal(job)" style="margin: 0.7rem 0; ">
                                <p style="color: #41cf37; font-weight: 550;">Job.Company</p>
                                <a-card-meta v-bind:title="job.job_title"
                                    v-bind:description="'Mức lương: ' + job.job_salary">
                                </a-card-meta>
                                <div v-if="job.deadline.includes('*')">
                                    <a-card-meta v-bind:description=job.deadline>
                                    </a-card-meta>
                                </div>
                                <div v-else>
                                    <a-card-meta v-bind:description="'* Hạn nộp: ' + job.deadline">
                                    </a-card-meta>
                                </div>
                            </a-card>

                        </a-col>

                    </a-row>
                    <!-- Pagination -->
                    <div class="pagination">
                        <a-pagination @change="onChangePagination" v-model:current="current" :total="totalCount"
                            show-less-items />
                    </div>
                    <!-- Selected Job info -->
                    <a-modal v-model:open="open" title="Job title" @ok="handleOk">
                        <div>
                            <div v-if="selectedJob.logo" style="display: flex;justify-content: center;">
                                <img alt="example" v-bind:src=selectedJob.logo[0] class="job-item_logo" />
                            </div>
                            <div v-else style="display: flex;justify-content: center;">
                                <img alt="example" src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg"
                                    class="job-item_logo" />
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
                        <template #footer>
                            <div v-if="selectedJob.applied && Object.values(selectedJob.applied).filter(obj => {
                                return obj.userId === this.userLogin._id
                            }).length > 0">
                                <a-button key="back" @click="handleCancel">Close</a-button>
                                <a-button disabled danger>Đã nộp</a-button>
                            </div>
                            <div v-else>
                                <a-button key="back" @click="handleCancel">Close</a-button>
                                <a-button v-if="selectedJob.job_links == undefined" key="submit" type="primary"
                                    :loading="loading" @click="handleSubmitCV(selectedJob)">Nộp CV
                                </a-button>
                                <a-button v-else danger :loading="loading" @click="goToJobLink(selectedJob.job_links)">
                                    Tham khảo
                                </a-button>
                            </div>
                        </template>
                    </a-modal>
                    <!-- Model ask to create CV -->
                    <a-modal v-model:open="openMessage" title="Bạn chưa có CV">
                        <div>
                            Tạo cv mới?+
                        </div>
                        <template #footer>
                            <a-button key="back" @click="handleCancel">Close</a-button>
                            <a-button key="submit" type="primary" :loading="loading" @click="handleCreateCV">Tạo
                                CV
                            </a-button>
                        </template>
                    </a-modal>
                </div>
            </div>
        </div>
        <hr>
    </a-layout>
</template>
<script >
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { notification } from 'ant-design-vue';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import myData from '../../assets/data/data';
import { SearchOutlined } from '@ant-design/icons-vue';
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
        const filterOptions_major = [
            {
                label: 'Kế toán',
                value: 'kt',

            },
            {
                label: 'Công nghệ thông tin',
                value: 'cntt',

            },
            {
                label: 'Du lịch',
                value: 'dulich',

            },
            {
                label: 'Sức khỏe',
                value: 'suckhoe',

            },
        ];
        const filterOptions_education = [
            {
                label: 'Tự do',
                value: 'tudo',

            },
            {
                label: 'Cao đẳng',
                value: 'caodang',

            },
            {
                label: 'Đại học',
                value: 'daihoc',

            },

        ];
        const filterOptions_expPrequire = [
            {
                label: 'Chưa có kinh nghiệm',
                value: '0',

            },
            {
                label: 'dưới 1 năm',
                value: 'under1y',

            },
            {
                label: '1 năm',
                value: '1y',

            },
            {
                label: '2 năm',
                value: '2y',

            },
            {
                label: '3 năm',
                value: '3y',

            },

        ];
        const filterOptions_workingType = [
            {
                label: 'Toàn thời gian',
                value: 'fulltime',

            },
            {
                label: 'Bán thời gian',
                value: 'part time',

            },
            {
                label: 'Remote',
                value: 'remote',

            },


        ];
        const filterOption = (input, option) => {
            return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
        };
        const onSlideChange = () => {
            console.log('slide change');
        };
        return {
            filterOptions_major,
            filterOptions_education,
            filterOptions_expPrequire,
            filterOptions_workingType,
            onSlideChange,
            filterOption,
            modules: [Navigation, Pagination, A11y],
        };
    },
    data() {
        return {
            inputValue: 0,
            inputValue1: 1,
            slides: 7,
            filter_education: '',
            filter_major: '',
            filter_expPrequire: '',
            filter_workingType: '',
            open: false,
            openMessage: false,
            selectedJob: false,
            options: [],
            data: [],
            postsApplyable: [],
            userLogin: false,
            isLogin: false,
            mess: '',
            totalCount: 0,
            current: 1
        }

    },

    async mounted() {
        if (process.client) {
            this.isLogin = localStorage.getItem('loginUserID');
            if (this.isLogin) {
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
                console.log("ung vien>>>  login:", this.userLogin);
            }
        }
        this.clearOutDatePosts();
        this.reloadPostApplyable();
        this.data = myData;
        this.options = this.data.map((item) => {
            return {
                ...item,
                label: item.job_title,
                value: item.job_title
            }
        });
    },
    methods: {
        async  clearOutDatePosts(){
          try {
            await $fetch('http://localhost:8000/posts/getOutDatePosts', {method: 'PUT',})
          } catch (error) {
            console.log(error);
          }
        },
        onChangePagination() {
            this.reloadPostApplyable();
        },
        async reloadPostApplyable() {
            const postData = await this.getFilterOptions();
            console.log(postData.posts);
            this.postsApplyable = postData.posts;
            this.totalCount = postData.totalCount;
        },
        async getFilterOptions() {
            try {
                console.log(this.current);
                return await $fetch(`http://localhost:8000/posts/getPostByFilter?currentPage=${this.current}&${this.filter_workingType[0] ? '&workingType=' + this.filter_workingType[0] : ''}${this.filter_major[0] ? '&major=' + this.filter_major[0] : ''}${this.filter_education[0] ? '&educationPrequire=' + this.filter_education[0] : ''}${this.filter_expPrequire[0] ? '&expPrequire=' + this.filter_expPrequire[0] : ''}`);
            } catch (error) {
                console.log(error)
            }
        },
        goToJobLink(link) {
            window.open(link);
        },
        openNotificationWithIcon(type) {
            notification[type]({
                placement: "topRight",
                message: (type == 'success' ? 'Ứng tuyển thành công!' : (type == 'info' ? 'Info' : (type == 'warning' ? 'Cảnh báo' : 'Oops, đã có lỗi xảy ra'))),
                description: (type == 'success' ?
                    'Cảm ơn bạn đã sử dụng hệ thống của chúng tôi.'
                    : (type == 'info'
                        ? 'Info'
                        : (type == 'warning'
                            ? 'Cảnh báo'
                            : 'Vui lòng thử lại sau.'))),
            })

        },
        showModal(job) {
            this.selectedJob = job
            this.open = true;
        },
        handleOk(job) {
            this.openMessage = false;
        },
        handleCreateCV() {
            navigateTo('./createCV')
        },
        async handleSubmitCV(selectedJob) {
            if (this.userLogin.role == '1') {
                // Chưa có CV => open modal tạo CV
                if (!this.userLogin.cv) {
                    this.openMessage = true
                    // Có CV nhưng selectedJob muốn apply đã tồn tại userId => đã nộp 
                } else if (selectedJob.applied && Object.values(selectedJob.applied).filter(obj => {
                    return obj.userId === this.userLogin._id
                }).length > 0) {
                    alert("Đã nộp")
                } else {
                    try {
                        await $fetch('http://localhost:8000/posts/applyJob/' + selectedJob._id, {
                            method: 'PUT',
                            body: {
                                "userId": this.userLogin._id,
                                "profile": this.userLogin.cv,
                            }
                        })
                        this.openNotificationWithIcon('success')
                        this.reloadPostApplyable();
                        console.log("them cv vao selectedJob:", this.userLogin)
                        this.open = false
                    } catch (error) {
                        console.log(error)
                    }
                }
            } else {
                alert("bạn cần đăng nhập với tài khoản ứng viên")
            }

            this.open = false;
        },

        handleCancel() {
            this.open = false;
            this.openMessage = false;
        },
       
    },
    computed: {
        getPosts() {
            return this.postsApplyable;
        }
    }
}
</script>

<style scoped lang="scss">
.button-32 {
    background-color: #fff000;
    border-radius: 12px;
    color: #000;
    cursor: pointer;
    font-weight: bold;
    padding: 10px 15px;
    text-align: center;
    transition: 200ms;
    width: 8%;
    box-sizing: border-box;
    border: 0;
    font-size: 16px;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
}

.button-32:not(:disabled):hover,
.button-32:not(:disabled):focus {
    outline: 0;
    background: #f4e603;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, .2), 0 3px 8px 0 rgba(0, 0, 0, .15);
}

.button-32:disabled {
    filter: saturate(0.2) opacity(0.5);
    -webkit-filter: saturate(0.2) opacity(0.5);
    cursor: not-allowed;
}

.filterOption {
    margin: 0 0.5rem;
}

.code-box-demo .ant-slider {
    margin-bottom: 16px;
}

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