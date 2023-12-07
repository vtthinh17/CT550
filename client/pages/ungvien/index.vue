<template>
    <a-layout :name="Ungvien">
        <div class="mainContent">
            <div>
                <div v-if="userLogin && userLogin.role=='1' && getSuitableJobs.length > 0">
                    <h2 class="job_type">
                        <CaretRightOutlined />Việc làm gần bạn: {{ getSuitableJobs.length }}
                    </h2>
                    <swiper :modules="modules" navigation :pagination="{ clickable: true }" :slides-per-view="3"
                        :space-between="30" @slideChange="onSlideChange" style="width: 95%;">
                        <swiper-slide v-for="job in getSuitableJobs " class="sliderItem">
                            <a-card hoverable @click="showModal(job)">
                                <p style="color: #41cf37; font-weight: 550;">{{ job.company }}</p>
                                <a-card-meta v-bind:title="job.job_title"
                                    v-bind:description="'Mức lương: ' + job.job_salary">
                                </a-card-meta>
                                <a-card-meta v-bind:description=job.deadline_apply>
                                </a-card-meta>
                            </a-card>
                        </swiper-slide>
                    </swiper>
                </div>
                <h2 class="job_type">
                    <CaretRightOutlined />Tin tham khảo: {{ totalReferCount }}
                </h2>
                <div style="background-color: #5b7fb4; padding: 1rem;">
                    <div style="display: flex; justify-content: center;">
                        <p>Bộ lọc:</p>
                        <a-input type="text" :allowClear="true" v-model:value="filterRefer_jobTitle"
                            style="width: 12%; height: 2rem; margin-right: 0.5rem;" placeholder="Tên tiêu đề" />
                        <a-input type="text" :allowClear="true" v-model:value="filterRefer_major"
                            style="width: 12%; height: 2rem" placeholder="Lĩnh vực tìm kiếm" />
                        <a-cascader :allowClear="true" class="filterOption" v-model:value="filterRefer_salary" style="width: 15%;"
                            max-tag-count="responsive" :options="filterOptions_salary"
                            placeholder="Mức lương">
                        </a-cascader>
                        <a-cascader :allowClear="true" class="filterOption" v-model:value="filterRefer_education" style="width: 10%;"
                            max-tag-count="responsive" :options="filterOptionsRefer_education" placeholder="Trình độ">
                        </a-cascader>
                        <a-cascader :allowClear="true" class="filterOption" v-model:value="filterRefer_expRequire" style="width: 15%;"
                            max-tag-count="responsive" :options="filterOptionsRefer_expRequire"
                            placeholder="Yêu cầu kinh nghiệm">
                        </a-cascader>
                        <a-cascader :allowClear="true" class="filterOption" v-model:value="filterRefer_workingType" style="width: 15%;"
                            max-tag-count="responsive" :options="filterOptionsRefer_workingType"
                            placeholder="Hình thức làm việc">
                        </a-cascader>
                        <a-cascader :allowClear="true" class="filterOption" v-model:value="filterRefer_province" style="width: 15%;"
                            max-tag-count="responsive" :options="provincesOptions" placeholder="Tỉnh/Thành phố">
                        </a-cascader>
                        <a-button style="background-color: yellow;" @click="reloadReferPost()">Lọc tin</a-button>
                    </div>
                </div>
                <a-divider />
                <a-row v-if="totalReferCount > 0" style="display: flex;justify-content: space-evenly;">
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
                <a-result v-else title="Không tìm thấy tin tuyển dụng!">
                    <template #icon>
                        <FrownOutlined />
                    </template>
                </a-result>

                <!-- Pagination -->
                <div class="pagination">
                    <a-pagination @change="onChangeReferPagination" v-model:current="currentReferPage" :pageSize="6"
                        :total="totalReferCount" :showSizeChanger=false />
                </div>

                <h2 class="job_type">
                    <CaretRightOutlined />Có thể ứng tuyển: {{ totalCount }}
                </h2>
                <div style="background-color: #5b7fb4; padding: 1rem;">
                    <div style="display: flex; justify-content: center;">
                        <p>Bộ lọc:</p>
                        <a-input type="text" :allowClear="true" v-model:value="filter_jobTitle"
                            style="width: 12%; height: 2rem; margin-right: 0.5rem;" placeholder="Tên tiêu đề" />
                        <a-input type="text" :allowClear="true" v-model:value="filter_major"
                            style="width: 20%; height: 2rem" placeholder="Nhập từ khóa lĩnh vực tìm kiếm" />
                            <a-cascader :allowClear="true" class="filterOption" v-model:value="filter_salary" style="width: 15%; height: 2rem;"
                            max-tag-count="responsive" :options="filterOptions_salary"
                            placeholder="Mức lương">
                        </a-cascader>
                        <a-cascader :allowClear="true" class="filterOption" v-model:value="filter_education" style="width: 10%;  height: 2rem;"
                            max-tag-count="responsive" :options="filterOptions_education" placeholder="Trình độ">
                        </a-cascader>
                        <a-cascader :allowClear="true" class="filterOption" v-model:value="filter_expRequire" style="width: 15%;  height: 2rem;"
                            max-tag-count="responsive" :options="filterOptions_expRequire"
                            placeholder="Yêu cầu kinh nghiệm">
                        </a-cascader>
                        <a-cascader :allowClear="true" class="filterOption" v-model:value="filter_workingType" style="width: 15%;  height: 2rem;"
                            max-tag-count="responsive" :options="filterOptions_workingType"
                            placeholder="Hình thức làm việc">
                        </a-cascader>
                        <a-cascader :allowClear="true" class="filterOption" v-model:value="filter_province" style="width: 15%;  height: 2rem;"
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
                <a-result v-else title="Không tìm thấy tin tuyển dụng!">
                    <template #icon>
                        <FrownOutlined />
                    </template>
                </a-result>

                <!-- Pagination -->
                <div class="pagination">
                    <a-pagination @change="onChangePagination" v-model:current="currentPage" :pageSize="6"
                        :total="totalCount" :showSizeChanger=false />
                </div>

                <!-- Modal job info -->
                <a-modal v-model:open="open" v-bind:title="'Tuyển dụng: ' + selectedJob.job_title"
                    width="100%">
                    <div v-if="selectedJob.job_link">
                        <a-row>
                            <a-col :span="8">
                                <div v-if="selectedJob.logo" style="display: flex;justify-content: center;">
                                    <img style="width: 50%;" alt="example" v-bind:src=selectedJob.logo />
                                </div>
                                <div v-else style="display: flex;justify-content: center;">
                                    <img style="width: 50%;" alt="example"
                                        src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg" />
                                </div>
                            </a-col>
                            <a-col :span="16">
                                <h2>{{ selectedJob.company }}</h2>
                                <a-row>
                                    <a-col :span="6"><b> Lĩnh vực:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.major }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="6"><b> Hình thức làm việc:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.workingType }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="6"><b> Mức lương:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.job_salary }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="6"><b>Yêu cầu kinh nghiệm:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.expRequire }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="6"><b>Yêu cầu bằng cấp:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.educationRequire }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="6"><b>Địa chỉ công ty:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.com_location }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="6"><b>Số điện thoại:</b></a-col>
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
                        <h4 v-if="selectedJob.job_benefit.length > 0">Lợi ích:</h4>
                        <a-textarea v-if="selectedJob.job_benefit.length > 0" v-model:value="selectedJob.job_benefit"
                            rows="5"></a-textarea>
                        <!-- {{ selectedJob.job_benefit }} -->

                    </div>
                    <div v-else>
                        <a-row>
                            <a-col :span="8">
                                <div v-if="companyInfo.com_logo" style="display: flex;justify-content: center;">
                                    <img style="width: 50%;" alt="example" v-bind:src=companyInfo.com_logo
                                        class="job-item_logo" />
                                </div>
                                <div v-else style="display: flex;justify-content: center;">
                                    <img style="width: 50%;" alt="example"
                                        src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg"
                                        class="job-item_logo" />
                                </div>
                            </a-col>
                            <a-col :span="16">
                                <h2>{{ companyInfo.com_name }}</h2>
                                <a-row>
                                    <a-col :span="6"><b> Lĩnh vực:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.major }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="6"><b> Hình thức làm việc:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.workingType }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="6"><b> Mức lương:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.job_salary }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="6"><b>Yêu cầu kinh nghiệm:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.expRequire }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="6"><b>Yêu cầu bằng cấp:</b></a-col>
                                    <a-col :span="10">{{ selectedJob.educationRequire }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="6"><b>Địa chỉ công ty:</b></a-col>
                                    <a-col :span="10">{{ companyInfo.com_location }}</a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="6"><b>Số điện thoại:</b></a-col>
                                    <a-col :span="10">{{ companyInfo.com_phone }}</a-col>
                                </a-row>
                            </a-col>
                        </a-row>
                        <h4>Mô tả công việc:</h4>
                        <a-textarea v-model:value="selectedJob.job_description" rows="5"></a-textarea>
                        <h4>Yêu cầu công việc:</h4>
                        <a-textarea v-model:value="selectedJob.job_requirement" rows="5"></a-textarea>
                        <h4 v-if="selectedJob.job_benefit.length > 0">Lợi ích:</h4>
                        <a-textarea v-if="selectedJob.job_benefit.length > 0" v-model:value="selectedJob.job_benefit" rows="5"></a-textarea>
                    </div>
                    <template #footer>
                        <div v-if="selectedJob.job_link">
                            <a-button key="back" @click="this.open = false">Đóng</a-button>
                            <a-button danger :loading="loading" @click="goToJobLink(selectedJob.job_link)">
                                Tham khảo
                            </a-button>                         
                        </div>
                        <div v-else>
                            <div v-if="selectedJob.applied && Object.values(selectedJob.applied).filter(obj => {
                                return obj.userId === this.userLogin._id
                            }).length > 0">
                                <a-button key="back" @click="handleCancel">Đóng</a-button>
                                <a-button disabled danger>Đã nộp</a-button>
                            </div>
                            <div v-else>
                                <a-button key="back" @click="handleCancel">Đóng</a-button>
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
import { notification } from 'ant-design-vue';
import 'swiper/css/navigation';
import provinces from '../../assets/data/provinces';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
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
        const filterOptions_salary = [
            {
                label: 'Thỏa thuận',
                value: 'Th',

            },          
            {
                label: '3 - 6 triệu',
                value: '3 - 6',

            },
            {
                label: '6 - 10 triệu',
                value: '6 - 10',

            },
            {
                label: 'Dưới 10 triệu',
                value: 'duoi10',

            },
            {
                label: 'Trên 10 triệu',
                value: 'tren10',

            },
            {
                label: '10 - 15 triệu',
                value: '10 - 15',

            },
            {
                label: '15 - 20 triệu',
                value: '15 - 20',

            },
            {
                label: 'Trên 20 triệu',
                value: 'tren20',

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
                label: 'Phổ thông',
                value: 'Phổ thông',

            },
            {
                label: 'Cử nhân',
                value: 'Cử nhân',

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
        const filterOptionsRefer_expRequire = [
            {
                label: 'Không yêu cầu',
                value: 'Không yêu cầu',
            },
            {
                label: 'Dưới 1 năm',
                value: 'Dưới 1',

            },
            {
                label: '1 năm',
                value: '1',

            },
            {
                label: '2 năm',
                value: '2',

            },
            {
                label: '3 năm',
                value: '3',

            },
            {
                label: '4 năm',
                value: '4',

            },
            {
                label: 'Trên 5 năm',
                value: '5',

            },

        ];
        const filterOptionsRefer_workingType = [
            {
                label: 'Toàn thời gian/Fulltime',
                value: 'Toàn',

            },
            {
                label: 'Bán thời gian/Partime',
                value: 'Bán',

            },
            {
                label: 'Khác',
                value: 'Khác',

            },
            // {
            //     label: 'Làm việc từ xa/Remote',
            //     value: 'Làm việc từ xa/Remote',

            // },
            // {
            //     label: 'Thực tập/Intern',
            //     value: 'Thực tập',

            // },

        ];
        const filterOptionsRefer_education = [
            {
                label: 'Không yêu cầu',
                value: 'Không yêu cầu',

            },
            {
                label: 'Cao đẳng',
                value: 'Cao đẳng',

            },
            {
                label: 'Phổ thông',
                value: 'Phổ thông',

            },
            {
                label: 'Cử nhân',
                value: 'Cử nhân',

            },
            {
                label: 'Trung cấp',
                value: 'Trung',

            },
            {
                label: 'Đại học',
                value: 'Đại học',

            },

        ];
        return {
            filterOptions_salary,
            filterOptions_education,
            filterOptions_expRequire,
            filterOptions_workingType,
            filterOptionsRefer_workingType,
            filterOptionsRefer_education,
            filterOptionsRefer_expRequire,
            modules: [Navigation, Pagination],
        };
    },
    data() {
        return {
            slides: 7,
            filter_education: false,
            filter_province: false,
            filter_major: '',
            filter_expRequire: false,
            filter_workingType: false,
            filterRefer_salary: '',
            filter_salary: false,
            filter_jobTitle: '',
            filterRefer_expRequire: false,
            filterRefer_province: false,
            filterRefer_workingType: false,
            filterRefer_education: false,
            filterRefer_major: '',
            filterRefer_jobTitle: '',          
            open: false,
            openMessage: false,
            selectedJob: false,
            companyInfo: false,
            provincesOptions: provinces,
            postsApplyable: [],
            referPosts: [],
            suitableJobs: [],
            userLogin: false,
            isLogin: false,
            totalCount: 0,
            currentPage: 1,
            totalReferCount: 0,
            currentReferPage: 1,
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
        if (this.userLogin && this.userLogin.cv.province) {
            const danhsachtam = await $fetch('http://localhost:8000/posts/getSuitableJobs/' + this.isLogin);
            for (let i = 0; i <= danhsachtam.posts.length - 1; i++) {
                if (danhsachtam.posts[i].com_created) {
                    let congty = await $fetch('http://localhost:8000/users/getUser/' + danhsachtam.posts[i].com_created);
                    danhsachtam.posts[i].company = congty.com_name;
                }
                this.suitableJobs.push(danhsachtam.posts[i]);
            }
        }
        this.clearOutDatePosts();
        console.log("clear outdate")
        this.reloadReferPost();
        this.reloadPostApplyable();
        this.loaded = true;
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
            this.referPosts = referPostData.posts;
            this.totalReferCount = referPostData.totalReferCount;
        },
        async getFilterOptions() {
            try {
                return await $fetch(`http://localhost:8000/posts/getPostByFilter?currentPage=${this.currentPage}&title=${this.filter_jobTitle}&salary=${this.filter_salary? this.filter_salary : ''}&major=${this.filter_major}${this.filter_workingType && this.filter_workingType[0] ? '&workingType=' + this.filter_workingType[0] : ''}${this.filter_education && this.filter_education[0] ? '&educationRequire=' + this.filter_education[0] : ''}${this.filter_expRequire && this.filter_expRequire[0] ? '&expRequire=' + this.filter_expRequire[0] : ''}${this.filter_province && this.filter_province[0] ? '&province=' + this.filter_province[0] : ''}`);
            } catch (error) {
                console.log(error)
            }
        },
        async getReferPostFilterOptions() {
            try {
                return await $fetch(`http://localhost:8000/posts/getReferPostByFilter?currentReferPage=${this.currentReferPage}&tieude=${this.filterRefer_jobTitle}&linhvuc=${this.filterRefer_major}&mucluong=${this.filterRefer_salary ? this.filterRefer_salary : ''}${this.filterRefer_workingType && this.filterRefer_workingType[0] ? '&hinhthuc=' + this.filterRefer_workingType[0] : ''}${this.filterRefer_education && this.filterRefer_education[0] ? '&trinhdo=' + this.filterRefer_education[0] : ''}${this.filterRefer_province && this.filterRefer_province[0] ? '&thanhpho=' + this.filterRefer_province[0] : ''}${this.filterRefer_expRequire && this.filterRefer_expRequire[0] ? '&kinhnghiem=' + this.filterRefer_expRequire[0] : ''}`);
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
        handleCreateCV() {
            navigateTo('ungvien/createCV')
        },
        async handleSubmitCV(selectedJob) {
            if (this.userLogin.role == '1') {
                // Chưa có CV => open modal tạo CV
                if (!this.userLogin.cv.fullName && !this.userLogin.cv.address && !this.userLogin.cv.province) {
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
                        await $fetch('http://localhost:8000/notifications/create/', {
                            method: 'POST',
                            body: {
                                fromUserID: this.userLogin._id,
                                toUserID: selectedJob.com_created,
                                postID: selectedJob._id,
                                action: "applyJob"
                            }
                        })
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
        getSuitableJobs() {
            return this.suitableJobs;
        }

    }
}
</script>

<style scoped lang="scss">
.job-item {
    margin: 2px 0;
}

.filterOption {
    margin: 0 0.5rem; 
    height: 2rem;
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
    font-size: 1.2rem;
    color: rgb(41, 27, 167);
    width: 20rem;
}

.ant-card {
    height: 13rem;
}
</style>