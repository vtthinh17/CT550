<template>
    <a-layout :name="admin">
        <div v-if="userLogin && userLogin.role == '3'">

            <h2>Quản lý tin tuyển dụng</h2>

            <a-layout-content v-if="loaded">
                <a-card :tab-list="tabListNoTitle" :active-tab-key="noTitleKey" @tabChange="key => onTabChange(key)">
                    <!-- Tin được tạo trên hệ thống -->
                    <div v-if="noTitleKey === 'tab1'">
                        <a-row style="background-color: #5b7fb4; padding: 1rem;">
                            <!-- <a-col :span="1">Bộ lọc</a-col> -->
                            <a-col :span="22">
                                <a-row>
                                    <a-col class="filterItem" :span="5">
                                        <a-input type="text" :allowClear="true" v-model:value="filter_jobTitle"
                                            style="height: 2rem; margin-right: 0.5rem;" placeholder="Tên tiêu đề" />
                                    </a-col>
                                    <a-col class="filterItem" :span="5">
                                        <a-input type="text" :allowClear="true" v-model:value="filter_major"
                                            style="height: 2rem" placeholder="Lĩnh vực tìm kiếm" />
                                    </a-col>
                                    <a-col class="filterItem" :span="5">
                                        <a-cascader class="filterOption" v-model:value="filter_salary" style=""
                                            max-tag-count="responsive" :options="filterOptions_salary"
                                            placeholder="Mức lương">
                                        </a-cascader>
                                    </a-col>
                                    <a-col class="filterItem" :span="5">
                                        <a-cascader class="filterOption" v-model:value="filter_education" style=""
                                            max-tag-count="responsive" :options="filterOptions_education"
                                            placeholder="Trình độ">
                                        </a-cascader>
                                    </a-col>
                                </a-row>
                                <a-row>
                                    <a-col class="filterItem" :span="5">
                                        <a-cascader class="filterOption" v-model:value="filter_expRequire" style=""
                                            max-tag-count="responsive" :options="filterOptions_expRequire"
                                            placeholder="Yêu cầu kinh nghiệm">
                                        </a-cascader>
                                    </a-col>
                                    <a-col class="filterItem" :span="5">
                                        <a-cascader class="filterOption" v-model:value="filter_workingType" style=";"
                                            max-tag-count="responsive" :options="filterOptions_workingType"
                                            placeholder="Hình thức làm việc">
                                        </a-cascader>
                                    </a-col>
                                    <a-col class="filterItem" :span="5">
                                        <a-cascader class="filterOption" v-model:value="filter_province" style=";"
                                            max-tag-count="responsive" :options="provincesOptions"
                                            placeholder="Tỉnh/Thành phố">
                                        </a-cascader>
                                    </a-col>
                                    <a-col class="filterItem" :span="5">
                                        <a-select ref="select" v-model:value="filter_postStatus">
                                            <a-select-option :value="0">Chờ duyệt</a-select-option>
                                            <a-select-option :value="1">Đang hiển thị</a-select-option>
                                            <a-select-option :value="2">Đã ẩn</a-select-option>
                                            <a-select-option :value="3">Tất cả</a-select-option>
                                        </a-select>
                                    </a-col>

                                </a-row>
                            </a-col>
                            <a-col :span="2">
                                <a-button style="background-color: yellow;" @click="reloadSystemPosts()">Lọc tin</a-button>
                            </a-col>
                        </a-row>
                        <a-list size="large" bordered :data-source="getSystemPosts">
                            <template #header>
                                <h1>Số lượng: {{ totalCount }}</h1>
                            </template>
                            <template #renderItem="{ item }">
                                <a-list-item style="border: 1px solid rgb(128, 121, 121);">
                                    <a-row style="width: 100%;">
                                        <a-col :span="10">
                                            <b>Tuyển dụng:</b> {{ item.job_title }}
                                            <div>
                                                <p>
                                                    Mức lương: {{ item.job_salary }}
                                                </p>
                                                <p>
                                                    Hạn nộp: {{ item.deadline }}
                                                </p>

                                                <p>Trạng thái:
                                                    <span v-if="item.status == 0"
                                                        style="background-color: rgb(240, 224, 131); padding: 0.4rem;">
                                                        Đang chờ duyệt
                                                    </span>
                                                    <span v-else-if="item.status == 1"
                                                        style="background-color: rgb(140, 228, 140); padding: 0.4rem;">
                                                        Đang hiển thị
                                                    </span>
                                                    <span v-else
                                                        style="background-color: rgb(237, 154, 154); padding: 0.4rem;">
                                                        Đã ẩn
                                                    </span>
                                                </p>

                                            </div>
                                        </a-col>
                                        <a-col :span="14">
                                            <a-button type="primary" @click="showJob(item)">Xem tin tuyển dụng</a-button>
                                            <a-divider type="vertical" />
                                            <a-button danger @click="deletePost(item)">Xóa tin</a-button>
                                            <a-divider type="vertical" />
                                            <a-button v-if="item.status == 1" @click="changePostStatus(item, 2)"
                                                style="background-color: rgb(240, 240, 132);"> Ẩn tin tuyển dụng
                                            </a-button>
                                            <a-button v-if="item.status == 0" @click="changePostStatus(item, 1)"
                                                style="background-color: rgba(91, 248, 119, 0.7)"> Duyệt/Hiển thị tin
                                            </a-button>
                                        </a-col>
                                    </a-row>
                                </a-list-item>
                            </template>
                            <div class="pagination">
                                <a-pagination @change="onChangePagination" v-model:current="currentPage" :pageSize="6"
                                    :total="totalCount" />
                            </div>
                        </a-list>
                    </div>
                    <!-- Tin tham khảo -->
                    <div v-else>
                        <a-row style="background-color: #5b7fb4; padding: 1rem;">
                            <!-- <a-col :span="1">Bộ lọc</a-col> -->
                            <a-col :span="22">
                                <a-row>
                                    <a-col class="filterItem" :span="5">
                                        <a-input type="text" :allowClear="true" v-model:value="filterRefer_jobTitle"
                                            style="height: 2rem; margin-right: 0.5rem;" placeholder="Tên tiêu đề" />
                                    </a-col>
                                    <a-col class="filterItem" :span="5">
                                        <a-input type="text" :allowClear="true" v-model:value="filterRefer_major"
                                            style="height: 2rem" placeholder="Lĩnh vực tìm kiếm" />
                                    </a-col>
                                    <a-col class="filterItem" :span="5">
                                        <a-cascader :allowClear="true" class="filterOption"
                                            v-model:value="filterRefer_salary" style="" max-tag-count="responsive"
                                            :options="filterOptions_salary" placeholder="Mức lương">
                                        </a-cascader>
                                    </a-col>
                                    <a-col class="filterItem" :span="5">
                                        <a-cascader :allowClear="true" class="filterOption"
                                            v-model:value="filterRefer_education" style="" max-tag-count="responsive"
                                            :options="filterOptionsRefer_education" placeholder="Trình độ">
                                        </a-cascader>
                                    </a-col>
                                </a-row>
                                <a-row>
                                    <a-col class="filterItem" :span="5">
                                        <a-cascader :allowClear="true" class="filterOption"
                                            v-model:value="filterRefer_expRequire" style="" max-tag-count="responsive"
                                            :options="filterOptionsRefer_expRequire" placeholder="Yêu cầu kinh nghiệm">
                                        </a-cascader>
                                    </a-col>
                                    <a-col class="filterItem" :span="5">
                                        <a-cascader :allowClear="true" class="filterOption"
                                            v-model:value="filterRefer_workingType" style=";" max-tag-count="responsive"
                                            :options="filterOptionsRefer_workingType" placeholder="Hình thức làm việc">
                                        </a-cascader>
                                    </a-col>
                                    <a-col class="filterItem" :span="5">
                                        <a-cascader :allowClear="true" class="filterOption"
                                            v-model:value="filterRefer_province" style=";" max-tag-count="responsive"
                                            :options="provincesOptions" placeholder="Tỉnh/Thành phố">
                                        </a-cascader>
                                    </a-col>
                                    <a-col class="filterItem" :span="5">
                                        <a-select ref="select" v-model:value="filterRefer_postStatus"  style="width: 90%;">
                                            <a-select-option :value="0">Chờ duyệt</a-select-option>
                                            <a-select-option :value="1">Đang hiển thị</a-select-option>
                                            <a-select-option :value="2">Đã ẩn</a-select-option>
                                            <a-select-option :value="3">Tất cả</a-select-option>
                                        </a-select>
                                    </a-col>

                                </a-row>
                            </a-col>
                            <a-col :span="2">
                                <a-button style="background-color: yellow;" @click="reloadReferPosts()">Lọc tin</a-button>
                            </a-col>
                        </a-row>
                        <a-list size="large" bordered :data-source="getReferPosts">
                            <template #header>
                                <h1>Số lượng: {{ totalReferCount }}</h1>
                            </template>
                            <template #renderItem="{ item }">
                                <a-list-item style="border: 1px solid rgb(128, 121, 121);">
                                    <a-row style="width: 100%;">
                                        <a-col :span="10">
                                            <b>Tuyển dụng:</b> {{ item.job_title }}
                                            <div>
                                                <p>
                                                    Mức lương: {{ item.job_salary }}
                                                </p>
                                                <p>
                                                    Hạn nộp: {{ item.deadline }}
                                                </p>

                                                <p>Trạng thái:
                                                    <span v-if="item.status == 0"
                                                        style="background-color: rgb(240, 224, 131); padding: 0.4rem;">
                                                        Đang chờ duyệt
                                                    </span>
                                                    <span v-else-if="item.status == 1"
                                                        style="background-color: rgb(140, 228, 140); padding: 0.4rem;">
                                                        Đang hiển thị
                                                    </span>
                                                    <span v-else
                                                        style="background-color: rgb(237, 154, 154); padding: 0.4rem;">
                                                        Đã ẩn
                                                    </span>
                                                </p>

                                            </div>
                                        </a-col>
                                        <a-col :span="14">
                                            <a-button type="primary" @click="showJob(item)">Xem tin tuyển dụng</a-button>
                                            <a-divider type="vertical" />
                                            <a-button danger @click="deletePost(item)">Xóa tin</a-button>
                                            <a-divider type="vertical" />
                                            <a-button v-if="item.status == 1" @click="changePostStatus(item, 2)"
                                                style="background-color: rgb(240, 240, 132);"> Ẩn tin tuyển dụng
                                            </a-button>
                                            <a-button v-if="item.status == 0" @click="changePostStatus(item, 1)"
                                                style="background-color: rgba(91, 248, 119, 0.7)"> Duyệt/Hiển thị tin
                                            </a-button>
                                        </a-col>
                                    </a-row>
                                </a-list-item>
                            </template>
                            <div class="pagination">
                                <a-pagination @change="onChangeReferPagination" v-model:current="currentReferPage"
                                    :pageSize="6" :total="totalReferCount" />
                            </div>
                        </a-list>
                    </div>

                </a-card>
            </a-layout-content>

            <!-- Modal show selected jobInfo -->
            <a-modal width="90%" v-model:open="openJob" @ok="this.openJob = false"
                v-bind:title="'Tuyển dụng: ' + selectedJob.job_title">
                <!-- Tin tham khảo -->
                <div v-if="selectedJob.job_link">
                    <a-row>
                        <a-col :span="8">
                            <div v-if="selectedJob.logo" style="display: flex;justify-content: center;">
                                <img style="width: 30%;" alt="example" v-bind:src=selectedJob.logo class="job-item_logo" />
                            </div>
                            <div v-else style="display: flex;justify-content: center;">
                                <img alt="example" src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg"
                                    class="job-item_logo" />
                            </div>
                        </a-col>
                        <a-col :span="16">
                            <h2>{{ selectedJob.company }}</h2>
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
                    <h4>Yêu cầu công việc:</h4>
                    <a-textarea v-model:value="selectedJob.job_requirement" rows="5"></a-textarea>
                    <h4 v-if="selectedJob.job_benefit">Lợi ích:</h4>
                    <a-textarea v-if="selectedJob.job_benefit" v-model:value="selectedJob.job_benefit"
                        rows="5"></a-textarea>

                </div>
                <!-- Tin trên hệ thống -->
                <div v-else>
                    <a-row>
                        <a-col :span="8">
                            <div v-if="companyInfo.com_logo" style="display: flex;justify-content: center;">
                                <img style="width: 30%;" alt="example" v-bind:src=companyInfo.com_logo
                                    class="job-item_logo" />
                            </div>
                            <div v-else style="display: flex;justify-content: center;">
                                <img style="width: 30%;" alt="example"
                                    src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg" class="job-item_logo" />
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
                    <a-textarea v-model:value="selectedJob.job_description" rows="5"></a-textarea>
                    <h4>Lợi ích:</h4>
                    <a-textarea v-model:value="selectedJob.job_benefit" rows="5"></a-textarea>
                </div>
            </a-modal>

        </div>
        <div v-else>
            Bạn cần đăng nhập với tài khoản quản trị
        </div>



    </a-layout>
</template>

<script>
import { message } from 'ant-design-vue';
import provinces from '../../assets/data/provinces';
import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
export default {

    setup() {
        definePageMeta({
            layout: 'admin'
        })
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
        const filterOptions_postStatus = [
            {
                label: 'Đang hiển thị',
                value: 1,

            },
            {
                label: 'Đã ẩn',
                value: 2,

            },

        ];
        return {
            filterOptions_postStatus,
            filterOptions_salary,
            filterOptions_education,
            filterOptions_expRequire,
            filterOptions_workingType,
            filterOptionsRefer_workingType,
            filterOptionsRefer_education,
            filterOptionsRefer_expRequire,
        }
    },
    data() {
        return {
            provincesOptions: provinces,
            noTitleKey: 'tab1',
            tabListNoTitle: [
                {
                    key: 'tab1',
                    tab: 'Tin từ hệ thống',
                },
                {
                    key: 'tab2',
                    tab: 'Tin tham khảo',
                },
            ],
            selectedJob: false,
            openJob: false,
            isLogin: false,
            userLogin: {},
            candidatesList: [],
            companyInfo: false,
            selectedCV: false,
            systemPosts: [],
            totalCount: 0,
            currentPage: 1,
            referPosts: [],
            totalReferCount: 0,
            currentReferPage: 1,
            loaded: false,
            filter_education: false,
            filter_province: false,
            filter_major: '',
            filter_expRequire: false,
            filter_workingType: false,
            filterRefer_salary: '',
            filter_salary: false,
            filter_jobTitle: '',
            filter_postStatus: 3,
            filterRefer_postStatus: 3,
            filterRefer_expRequire: false,
            filterRefer_province: false,
            filterRefer_workingType: false,
            filterRefer_education: false,
            filterRefer_major: '',
            filterRefer_jobTitle: '',
        }
    },
    methods: {
        onChangePagination() {
            this.reloadSystemPosts();
        },
        async reloadSystemPosts() {
            const postData = await this.getFilterOptions();
            this.systemPosts = postData.posts;
            this.totalCount = postData.totalCount;
        },
        async getFilterOptions() {
            try {
                return await $fetch(`http://localhost:8000/posts/getSysTemPosts?currentPage=${this.currentPage}&trangthai=${this.filter_postStatus}&title=${this.filter_jobTitle}&salary=${this.filter_salary ? this.filter_salary : ''}&major=${this.filter_major}${this.filter_workingType && this.filter_workingType[0] ? '&workingType=' + this.filter_workingType[0] : ''}${this.filter_education && this.filter_education[0] ? '&educationRequire=' + this.filter_education[0] : ''}${this.filter_expRequire && this.filter_expRequire[0] ? '&expRequire=' + this.filter_expRequire[0] : ''}${this.filter_province && this.filter_province[0] ? '&province=' + this.filter_province[0] : ''}`);
            } catch (error) {
                console.log(error)
            }
        },
        onChangeReferPagination() {
            this.reloadReferPosts();
        },
        async reloadReferPosts() {
            const postData = await this.getReferFilterOptions();
            console.log(postData)
            this.referPosts = postData.posts;
            this.totalReferCount = postData.totalReferCount;
        },
        async getReferFilterOptions() {
            try {
                return await $fetch(`http://localhost:8000/posts/getReferPosts?currentReferPage=${this.currentReferPage}&trangthai=${this.filterRefer_postStatus}&tieude=${this.filterRefer_jobTitle}&linhvuc=${this.filterRefer_major}&mucluong=${this.filterRefer_salary ? this.filterRefer_salary : ''}${this.filterRefer_workingType && this.filterRefer_workingType[0] ? '&hinhthuc=' + this.filterRefer_workingType[0] : ''}${this.filterRefer_education && this.filterRefer_education[0] ? '&trinhdo=' + this.filterRefer_education[0] : ''}${this.filterRefer_province && this.filterRefer_province[0] ? '&thanhpho=' + this.filterRefer_province[0] : ''}${this.filterRefer_expRequire && this.filterRefer_expRequire[0] ? '&kinhnghiem=' + this.filterRefer_expRequire[0] : ''}`);
            } catch (error) {
                console.log(error)
            }
        },
        onTabChange(value) {
            this.noTitleKey = value;
        },
        async changePostStatus(item, newState) {
            let text;
            if (newState == 2) {
                text = 'Bạn chắc chắn muốn ẩn tin tuyển dụng này?'
            } else {
                text = 'Bạn đồng ý hiển thị tin tuyển dụng này?'
            }
            let app = this;
            Modal.confirm({
                title: text,
                icon: createVNode(ExclamationCircleOutlined),
                okText: 'Xác nhận',
                okType: 'danger',
                cancelText: 'Hủy',
                async onOk() {
                    try {
                        await $fetch('http://localhost:8000/posts/changePostStatus/' + item._id,
                            {
                                method: 'PUT',
                                body: {
                                    status: newState
                                }
                            })
                        message.success('Thay đổi trạng thái tin tuyển dụng thành công');
                        app.reloadSystemPosts()
                        app.reloadReferPosts();
                    } catch (error) {
                        console.log(error)
                        // this.openNotificationWithIcon('error')
                    }
                },
                onCancel() {
                    console.log('Cancel');
                },
            });


        },
        deletePost(job) {
            let app = this;
            Modal.confirm({
                title: 'Bạn chắc chắn muốn xóa tin tuyển dụng này?',
                icon: createVNode(ExclamationCircleOutlined),
                okText: 'Xác nhận xóa',
                okType: 'danger',
                cancelText: 'Hủy',
                async onOk() {
                    try {
                        await $fetch('http://localhost:8000/posts/deletePost/' + job._id, { method: 'DELETE', })
                        message.success('Xóa tin thành công');
                        app.reloadSystemPosts()
                        app.reloadReferPosts();
                    } catch (error) {
                        console.log(error);
                    }
                },
                onCancel() {
                    console.log('Cancel');
                },
            });

        },
        async showJob(job) {
            this.selectedJob = job
            if (job.com_created) {
                this.companyInfo = await $fetch('http://localhost:8000/users/getUser/' + job.com_created)
            }
            this.openJob = true;
            console.log("show", job)
        },
    },
    async mounted() {
        if (process.client) {
            this.isLogin = localStorage.getItem('loginUserID');
            if (this.isLogin) {
                this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
            }
            this.reloadSystemPosts();
            this.reloadReferPosts();
            this.loaded = true;
        }
    },
    computed: {
        getSystemPosts() {
            return this.systemPosts;
        },
        getReferPosts() {
            return this.referPosts;
        },
    }
}
</script>

<style scoped lang="scss">
.filterItem {
    margin: 0.1rem 1rem;
}

.pagination {
    display: flex;
    justify-content: center;
    padding: 6px 0px;
    // background-color: rgb(203, 191, 191);
}
</style>