<template>
    <a-layout :name="Ungvien">
        <div class="mainContent">
            <div>
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
                <h2 class="job_type">
                    <CaretRightOutlined />Tin tham khảo
                </h2>
                <a-divider />
                <a-row style="display: flex;justify-content: space-evenly;">
                    <a-col :span="7" v-for="job in getReferPosts" class="job-item">
                        <a-card hoverable @click="showModal(job)">
                            <p style="color: #41cf37; font-weight: 550;">
                                {{ job.company }}
                            </p>
                            <a-card-meta v-bind:title="job.job_title" v-bind:description="'Mức lương: ' + job.job_salary">
                            </a-card-meta>
                            <div v-if="typeof (job.deadline) == 'string' && job.deadline.includes('*')">
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
                    <a-pagination @change="onChangeReferPagination" v-model:current="currentReferPage" :pageSize="6"
                        :total="totalReferCount" />
                </div>

                <h2 class="job_type">
                    <CaretRightOutlined />Có thể ứng tuyển
                </h2>
                <div style="background-color: #5b7fb4; padding: 1rem;">
                    <div style="display: flex; justify-content: center;">
                        <p>Bộ lọc:</p>
                        <!-- <a-cascader class="filterOption" v-model:value="filter_major" style="width: 30%" multiple
                            max-tag-count="responsive" :options="filterOptions_major" placeholder="Lĩnh vực">
                        </a-cascader> -->
                        <a-cascader class="filterOption" v-model:value="filter_education" style="width: 10%" 
                            max-tag-count="responsive" :options="filterOptions_education" placeholder="Trình độ">
                        </a-cascader>
                        <a-cascader class="filterOption" v-model:value="filter_expRequire" style="width: 20%" 
                            max-tag-count="responsive" :options="filterOptions_expRequire"
                            placeholder="Yêu cầu kinh nghiệm">
                        </a-cascader>
                        <a-cascader class="filterOption" v-model:value="filter_workingType" style="width: 20%" 
                            max-tag-count="responsive" :options="filterOptions_workingType"
                            placeholder="Hình thức làm việc">
                        </a-cascader>
                        <a-cascader class="filterOption" v-model:value="filter_province" style="width: 20%"
                            max-tag-count="responsive" :options="provincesOptions" placeholder="Tỉnh/Thành phố">
                        </a-cascader>
                        <a-button style="background-color: yellow;" @click="reloadPostApplyable()">Lọc tin</a-button>
                    </div>
                </div>
                <a-divider />
                <a-row v-if="getPosts.length > 0" style="display: flex;justify-content: space-evenly;">
                    <a-col :span="7" v-for="job in getPosts" class="job-item">
                        <a-card hoverable @click="showModal(job)">
                            <p style="color: #41cf37; font-weight: 550;">
                                {{ job.tenCongty }}
                            </p>
                            <a-card-meta v-bind:title="job.job_title" v-bind:description="'Mức lương: ' + job.job_salary">
                            </a-card-meta>
                            <div v-if="typeof (job.deadline) == 'string' && job.deadline.includes('*')">
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
                <a-result v-else 
                title="Không có tin tuyển dụng nào thỏa yêu cầu tìm kiếm của bạn!"
                sub-title="Hãy thử tìm kiếm với các lựa chọn khác hoặc xóa bỏ tất cả lựa chọn để làm mới danh sách tin tuyển dụng."
                >
                    <template #icon>
                        <FrownOutlined />
                    </template>
                </a-result>

                <!-- Pagination -->
                <div class="pagination">
                    <a-pagination @change="onChangePagination" v-model:current="currentPage" :pageSize="6"
                        :total="totalCount" />
                </div>

                <!-- Modal job info -->
                <a-modal v-model:open="open" v-bind:title="'Tuyển dụng: ' + selectedJob.job_title" @ok="handleOk"
                    width="100%">
                    <div v-if="selectedJob.job_link">
                        {{ console.log("select", selectedJob) }}
                        <a-row>
                            <a-col :span="8">
                                <div v-if="selectedJob.logo" style="display: flex;justify-content: center;">
                                    <img style="width: 30%;" alt="example" v-bind:src=selectedJob.logo
                                        class="job-item_logo" />
                                </div>
                                <div v-else style="display: flex;justify-content: center;">
                                    <img style="width: 30%;" alt="example"
                                        src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg"
                                        class="job-item_logo" />
                                </div>
                            </a-col>
                            <a-col :span="16">
                                <h2>{{ selectedJob.company }}</h2>
                                <a-row>
                                    <a-col :span="4"><b> Lĩnh vực:</b></a-col>
                                    {{ console.log("linh vuc", selectedJob) }}
                                    <a-col :span="10">{{ selectedJob.major }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="4"><b> Hình thức làm việc:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.workingType }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="4"><b> Mức lương:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.job_salary }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="4"><b>Yêu cầu kinh nghiệm:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.expRequire }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="4"><b>Yêu cầu bằng cấp:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.educationRequire }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="4"><b>Địa chỉ công ty:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.com_location }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="4"><b>Số điện thoại:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.com_phone }}</a-col>
                                </a-row>
                            </a-col>
                        </a-row>
                        <h4>Mô tả công việc:</h4>
                        <a-textarea v-model:value="selectedJob.job_description" rows="5"></a-textarea>
                        <!-- <p>{{ selectedJob.job_description }}</p> -->

                        <h4>Yêu cầu công việc:</h4>
                        <a-textarea v-model:value="selectedJob.job_requirement" rows="5"></a-textarea>
                        <!-- {{ selectedJob.job_requirement }} -->


                        <h4 v-if="selectedJob.job_benefit">Lợi ích:</h4>
                        <a-textarea v-if="selectedJob.job_benefit" v-model:value="selectedJob.job_benefit"
                            rows="5"></a-textarea>
                        <!-- {{ selectedJob.job_benefit }} -->

                    </div>
                    <div v-else>
                        <a-row>
                            <a-col :span="8">
                                <div v-if="companyInfo.com_logo" style="display: flex;justify-content: center;">
                                    <img style="width: 30%;" alt="example" v-bind:src=companyInfo.com_logo
                                        class="job-item_logo" />
                                </div>
                                <div v-else style="display: flex;justify-content: center;">
                                    <img style="width: 30%;" alt="example"
                                        src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg"
                                        class="job-item_logo" />
                                </div>
                            </a-col>
                            <a-col :span="16">
                                <h2>{{ companyInfo.com_name }}</h2>
                                <a-row>
                                    <a-col :span="4"><b> Lĩnh vực:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.major }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="4"><b> Hình thức làm việc:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.workingType }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="4"><b> Mức lương:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.job_salary }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="4"><b>Yêu cầu kinh nghiệm:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.expRequire }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="4"><b>Yêu cầu bằng cấp:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.educationRequire }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="4"><b>Địa chỉ công ty:</b></a-col>
                                    <a-col :span="10">{{ companyInfo.com_location }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="4"><b>Số điện thoại:</b></a-col>
                                    <a-col :span="10">{{ companyInfo.com_phone }}</a-col>
                                </a-row>
                            </a-col>
                        </a-row>
                        <h4>Mô tả công việc:</h4>
                        <a-textarea v-model:value="selectedJob.job_description" rows="5"></a-textarea>
                        <h4>Yêu cầu công việc:</h4>
                        <a-textarea v-model:value="selectedJob.job_requirement" rows="5"></a-textarea>
                        <h4>Lợi ích:</h4>
                        <a-textarea v-model:value="selectedJob.job_benefit" rows="5"></a-textarea>
                    </div>
                    <template #footer>
                        <div v-if="selectedJob.job_link">
                            <a-button danger :loading="loading" @click="goToJobLink(selectedJob.job_link)">
                                Tham khảo
                            </a-button>
                        </div>
                        <div v-else>
                            <div v-if="selectedJob.applied && Object.values(selectedJob.applied).filter(obj => {
                                return obj.userId === this.userLogin._id
                            }).length > 0">
                                <a-button key="back" @click="handleCancel">Close</a-button>
                                <a-button disabled danger>Đã nộp</a-button>
                            </div>
                            <div v-else>
                                <a-button key="back" @click="handleCancel">Close</a-button>
                                <a-button v-if="selectedJob.job_links == undefined" key="submit" type="primary"
                                    :loading="loading" @click="handleSubmitCV(selectedJob)">Ứng tuyển
                                </a-button>

                            </div>
                        </div>


                    </template>
                </a-modal>

                <!-- Modal create CV -->
                <a-modal v-model:open="openMessage" title="Bạn chưa đăng ký thông tin cá nhân">
                    <div>
                        Bạn cần có thông tin cá nhân để nhà tuyển dụng có thể xem thông tin của bạn. Bạn có muốn đi đến
                        trang đăng ký thông tin cá nhân?
                    </div>
                    <template #footer>
                        <a-button key="back" @click="handleCancel">Close</a-button>
                        <a-button key="submit" type="primary" :loading="loading" @click="handleCreateCV">
                            Ok
                        </a-button>
                    </template>
                </a-modal>
            </div>

        </div>
        <hr>
    </a-layout>
</template>
<script >
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { notification } from 'ant-design-vue';
import 'swiper/css/navigation';
import myData from '../../assets/data/data';
import provinces from '../../assets/data/provinces';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { message } from 'ant-design-vue';
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
                label: 'Không yêu cầu',
                value: 'Không yêu cầu',

            },
            {
                label: 'Cao đẳng',
                value: 'Cao đẳng',

            },
            {
                label: 'Trung cấp',
                value: 'Trung cấp',

            },
            {
                label: 'Đại học',
                value: 'Đại học',

            },

        ];
        const filterOptions_expRequire = [
            {
                label: 'Không yêu cầu',
                value: 'Không yêu cầu',

            },
            {
                label: 'Dưới 1 năm',
                value: 'Dưới 1 năm',

            },
            {
                label: '1 năm',
                value: '1 năm',

            },
            {
                label: '2 năm',
                value: '2 năm',

            },
            {
                label: '3 năm',
                value: '3 năm',

            },
            {
                label: '4 năm',
                value: '4 năm',

            },
            {
                label: 'Trên 5 năm',
                value: 'Trên 5 năm',

            },

        ];
        const filterOptions_workingType = [
            {
                label: 'Toàn thời gian/Fulltime',
                value: 'Toàn thời gian/Fulltime',

            },
            {
                label: 'Bán thời gian/Partime',
                value: 'Bán thời gian/Partime',

            },
            {
                label: 'Làm việc từ xa/Remote',
                value: 'Làm việc từ xa/Remote',

            },
            {
                label: 'Thực tập/Intern',
                value: 'Thực tập/Intern',

            },

        ];
        const filterSearchOption = (input, option) => {
            return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
        };
        const onSlideChange = () => {
            console.log('slide change');
        };
        return {
            filterOptions_major,
            filterOptions_education,
            filterOptions_expRequire,
            filterOptions_workingType,
            onSlideChange,
            filterSearchOption,
            modules: [Navigation, Pagination, A11y],
        };
    },
    data() {
        return {
            slides: 7,
            filter_education: false,
            filter_province: false,
            filter_major: false,
            filter_expRequire: false,
            filter_workingType: false,
            open: false,
            openMessage: false,
            selectedJob: false,
            companyInfo: false,
            searchOptions: [],
            data: [],
            provincesOptions: provinces,
            postsApplyable: [],
            referPosts: [],
            userLogin: false,
            isLogin: false,
            totalCount: 0,
            currentPage: 1,
            totalReferCount: 0,
            currentReferPage: 1,
            temp: false
        }

    },

    async mounted() {
        if (process.client) {
            this.isLogin = localStorage.getItem('loginUserID');
            if (this.isLogin) {
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
                this.clearOutDatePosts();
            }
        }
        this.clearOutDatePosts();
        console.log("clear outdate")
        this.reloadReferPost();
        this.reloadPostApplyable();
        this.data = myData;
        this.searchOptions = this.data.map((item) => {
            return {
                ...item,
                label: item.job_title,
                value: item._id
            }
        });
    },
    methods: {
        getKeyWordsSearch(value) {
            console.log(value)
        },
        handleChange(value) {
            console.log("select tags:", value)
        },
        async clearOutDatePosts() {
            try {
                await $fetch('http://localhost:8000/posts/getOutDatePosts', { method: 'PUT', })
            } catch (error) {
                console.log(error);
            }
        },
        onChangePagination() {
            this.reloadPostApplyable();
        },
        onChangeReferPagination() {
            this.reloadReferPost();
        },
        async reloadPostApplyable() {
            const postData = await this.getFilterOptions();
            console.log("reload", postData)
            this.postsApplyable = [];
            this.totalCount = postData.totalCount;
            for (let post of postData.posts) {
                let congty = await $fetch('http://localhost:8000/users/getUser/' + post.com_created);
                post.tenCongty = congty.com_name;
                this.postsApplyable.push(post);
            }
        },
        async reloadReferPost() {
            const referPostData = await this.getReferPostFilterOptions();
            console.log("reload refer post,", referPostData)
            this.referPosts = referPostData.posts;
            this.totalReferCount = referPostData.totalReferCount;
        },
        async getFilterOptions() {
            try {
                return await $fetch(`http://localhost:8000/posts/getPostByFilter?currentPage=${this.currentPage}&${this.filter_workingType && this.filter_workingType[0] ? '&workingType=' + this.filter_workingType[0] : ''}${this.filter_education && this.filter_education[0] ? '&educationRequire=' + this.filter_education[0] : ''}${this.filter_expRequire && this.filter_expRequire[0] ? '&expRequire=' + this.filter_expRequire[0] : ''}${this.filter_province && this.filter_province[0] ? '&province=' + this.filter_province[0] : ''}`);
            } catch (error) {
                console.log(error)
            }
        },
        async getReferPostFilterOptions() {
            try {
                ``
                return await $fetch(`http://localhost:8000/posts/getReferPostByFilter?currentReferPage=${this.currentReferPage}`);
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
                    'Bạn có thể xem lại tin đã ứng tuyển và xem lịch hẹn nếu được nhà tuyển dụng hẹn phỏng vấn!'
                    : (type == 'info'
                        ? 'Info'
                        : (type == 'warning'
                            ? 'Có gì đó không đúng!'
                            : 'Vui lòng thử lại sau.'))),
            })

        },
        async showModal(job) {
            this.selectedJob = job
            if (job.com_created) {
                this.companyInfo = await $fetch('http://localhost:8000/users/getUser/' + job.com_created)
            }

            this.open = true;
        },
        handleOk(job) {
            this.openMessage = false;
        },
        handleCreateCV() {
            navigateTo('createCV')
        },
        async handleSubmitCV(selectedJob) {
            if (this.userLogin.role == '1') {
                // Chưa có CV => open modal tạo CV
                if (!this.userLogin.cv.avatar) {
                    this.openMessage = true
                    // Có CV nhưng selectedJob muốn apply đã tồn tại userId => đã nộp 
                } else if (selectedJob.applied && Object.values(selectedJob.applied).filter(obj => {
                    return obj.userId === this.userLogin._id
                }).length > 0) {
                    message.info('Đã nộp');
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
                        // console.log("them cv vao selectedJob:", this.userLogin)
                        this.open = false
                    } catch (error) {
                        console.log(error)
                    }
                }
            } else {
                message.warning("Bạn cần đăng nhập với tài khoản ứng viên")
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
        },
        getReferPosts() {
            return this.referPosts;
        },

    }
}
</script>

<style scoped lang="scss">
.job-item {
    margin: 2px 0;
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
    margin-left: 2rem;
    font-size: 1.4rem;
    color: rgb(41, 27, 167);
    width: 13rem;
}

.ant-card {
    height: 13rem;
}
</style>