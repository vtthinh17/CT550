<template>
  <a-layout :name="nhatuyendung">

    <div v-if="this && this.isLogin">
      <a-row class="gradient_list">
        <a-col :span="7"
          style="font-size: 1rem;color: #0c0606; display: flex; flex-direction: column;background-color: rgb(219, 213, 213);"
          class="gradient_item">
          Số bài đã đăng
          <b>{{ getNewCompanyPosts.length }}</b>
          <!-- {{ console.log("so luong:", this.companyPost) }} -->
          <img src="" alt="">
        </a-col>
        <a-col :span="7" @click="showAddModal"
          style="cursor: pointer; font-size: 1rem;color: #0c0606;  background: transparent linear-gradient(90deg,#41bfad,#3bd3e6) 0 0 no-repeat padding-box;"
          class="gradient_item">
          Đăng tin mới +
        </a-col>
        <a-col :span="7" @click="() => { navigateTo('/nhatuyendung/companyProfile') }"
          style="cursor: pointer; font-size: 1rem;color: #0c0606; background: transparent linear-gradient(90deg,#a1dc65,#66cc80) 0 0 no-repeat padding-box;"
          class="gradient_item">
          Cập nhật thông tin
        </a-col>
      </a-row>
      <!-- Job list -->
      <h1>Tin của tôi</h1>
      <div v-if="getNewCompanyPosts.length" class="post_list">
        <div v-for="post in getNewCompanyPosts" class="job_item">
          <div style="display: flex; flex-direction: row; justify-content: space-around; margin-bottom: 1rem;">
            <span>
              <p v-if="post.status == 0" style="background-color: rgb(240, 224, 131);margin-right: 1rem;">
                Đang chờ duyệt
              </p>
              <p v-else-if="post.status == 1" style="background-color: rgb(140, 228, 140);margin-right: 1rem;">
                Đang hiển thị
              </p>
              <p v-else style="background-color: rgb(237, 154, 154);margin-right: 1rem;">
                Đã ẩn
              </p>
            </span>
            <span>Đăng vào: {{ post.createdAt.slice(0, 24) }}</span>
          </div>
          <div>
            <b>Tuyển dụng: {{ post.job_title }}</b>
          </div>
          <div style="display: flex;">
            <div style="flex:2; display: flex;justify-content: center;">
              <img v-if="userLogin.com_logo" style="width:50%;" v-bind:src="userLogin.com_logo" alt="">
              <img v-else style="width:50%;" src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg" alt="">
            </div>
            <div style="flex:2">
              <b>{{ userLogin.com_name }}</b>
              {{ console.log("123123", userLogin) }}
              <p v-if="post.job_salary.includes('tr', 'triệu,TR,TRIỆU')"> Mức lương: {{ post.job_salary }}</p>
              <p v-else>Mức lương: {{ post.job_salary }}</p>

              <span class="xemhoso" @click="viewAppiedCandidates(post._id)">
                <a-tooltip>
                  <template #title>Xem danh sách hồ sơ</template>
                  <UserOutlined /> Hồ sơ đã nộp: {{ post.applied.length }}
                </a-tooltip>
              </span>
            </div>
            <div style="flex: 6;">
              <a-button danger v-if="post.status == 1" @click="hidePost(post._id)">
                <EyeInvisibleOutlined /> Ngưng tuyển dụng
              </a-button>
              <a-divider type="vertical" v-if="post.status == 1" />

              <a-button v-if="post.status != 2" key="submit" type="primary" @click="handleEdit(post._id)">
                <EditOutlined />Xem/Chỉnh sửa bài đăng
              </a-button>
              <div>

              </div>
            </div>
          </div>
        </div>

      </div>
      <div v-else>
        <p>Chưa có dữ liệu, hãy tạo tin mới</p>
      </div>

      <!-- Edit modal -->
      <a-modal v-model:open="modalEditOpen" title="Nội dung chi tiết bài đăng" width="100%">
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol" layout="horizontal" :disabled="componentDisabled"
          style="max-width: 90%">
          <a-form-item label="Tiêu đề tuyển dụng">
            <a-input v-model:value="selectedPost.data.job_title"></a-input>
          </a-form-item>
          <a-row>
            <a-col :span="12">
              <!-- Lĩnh vực -->
              <a-form-item label="Lĩnh vực">
                <a-input type="text" class="input" name="add_major" v-model:value="selectedPost.data.major" />
              </a-form-item>
            </a-col>
            <!-- Hình thức làm việc -->
            <a-col :span="12">
              <a-form-item label="Hình thức làm việc">
                <a-select ref="select" v-model:value="selectedPost.data.workingType" @focus="focus"
                  @change="console.log(add_workingType)">
                  <a-select-option value="Fulltime">Toàn thời gian/Fulltime</a-select-option>
                  <a-select-option value="Partime">Bán thời gian/Partime</a-select-option>
                  <a-select-option value="Intern">Thực tập/Intern</a-select-option>
                </a-select>
                <!-- <a-input type="text" class="input" name="add_workingType" v-model:value="selectedPost.data.workingType"
                  style="width: 100%;" /> -->
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <!-- Kinh nghiệm -->
            <a-col :span="12">
              <a-form-item label="Yêu cầu kinh nghiệm">
                <a-select ref="select" v-model:value="selectedPost.data.exReequire" @focus="focus"
                  @change="console.log(add_expRequire)">
                  <a-select-option value="Không yêu cầu">Không yêu cầu</a-select-option>
                  <a-select-option value="Dưới 1 năm">Dưới 1 năm</a-select-option>
                  <a-select-option value="1 năm">1 năm</a-select-option>
                  <a-select-option value="2 năm">2 năm</a-select-option>
                  <a-select-option value="3 năm">3 năm</a-select-option>
                  <a-select-option value="4 năm">4 năm</a-select-option>
                  <a-select-option value="Trên 5 năm">Trên 5 năm</a-select-option>
                </a-select>
                <!-- <a-input type="text" class="input" name="add_expRequire" v-model:value="selectedPost.data.expRequire" /> -->
              </a-form-item>
            </a-col>
            <!-- Trình độ -->
            <a-col :span="12">
              <a-form-item label="Yêu cầu trình độ">
                <a-select ref="select" v-model:value="selectedPost.data.educationRequire" @focus="focus"
                  @change="console.log(add_educationRequire)">
                  <a-select-option value="Không yêu cầu">Không yêu cầu</a-select-option>
                  <a-select-option value="Đại học">Đại học</a-select-option>
                  <a-select-option value="Cao đẳng">Cao đẳng</a-select-option>
                  <a-select-option value="Trung cấp">Trung cấp</a-select-option>
                </a-select>
                <!-- <a-input type="text" class="input" name="add_educationRequire"
                  v-model:value="selectedPost.data.educationRequire" /> -->
              </a-form-item>
            </a-col>
          </a-row>
          <!-- Lương -->
          <a-form-item label="Mức lương">
            <a-input v-model:value="selectedPost.data.job_salary"></a-input>
          </a-form-item>
          <!-- Hạn nộp -->
          <a-row>
            <a-col :span="12">
              <a-form-item label="Hạn nộp">
                <a-date-picker v-model:value="hannop" :format="'DD/MM/YYYY'" :disabled-date="disabledDate"
                  @change="console.log('a-date-picker:', useDayjs(hannop).format('DD/MM/YYYY'))" />
                <!-- <a-date-picker v-model:value="selectedPost.data.deadline" :format="'DD/MM/YYYY'" :disabled-date="disabledDate"
              @change="console.log('a-date-picker:', useDayjs(hannop).format('DD/MM/YYYY'))" /> -->
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Tỉnh/Thành phố">
                <a-select ref="select" v-model:value="selectedPost.data.province" style="width: 120px" :options="provinceOption"
                  @focus="focus" @change="handleChange"></a-select>
              </a-form-item>
            </a-col>
          </a-row>

          <a-form-item label="Mô tả công việc">
            <a-textarea v-model:value="selectedPost.data.job_description" rows="4" cols="30">
            </a-textarea>
          </a-form-item>
          <a-form-item label="Yêu cầu công việc">
            <a-textarea :rows="4" v-model:value="selectedPost.data.job_requirement"></a-textarea>

          </a-form-item>
          <a-form-item label="Quyền lợi">
            <a-textarea :rows="4" v-model:value="selectedPost.data.job_benefit"></a-textarea>
          </a-form-item>

        </a-form>
        <template #footer>
          <a-button key="back" @click="this.modalEditOpen = false">Đóng</a-button>
          <a-button type="primary" @click="changeInfo">Cập nhật</a-button>
        </template>
      </a-modal>

      <!-- Add post form -->
      <a-modal v-model:open="open" title="Thêm tin tuyển dụng" width="100%">
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol" layout="horizontal" :disabled="componentDisabled"
          style="max-width: 90%">
          <a-form-item label="Tiêu đề tuyển dụng">
            <a-input type="text" class="input" name="add_jobTitle" v-model:value="add_jobTitle" />
          </a-form-item>
          <!-- Major -->
          <a-row>
            <a-col :span="12">
              <a-form-item label="Lĩnh vực/Ngành nghề">
                <a-input type="text" class="input" name="add_major" v-model:value="add_major" />
              </a-form-item>
            </a-col>
            <!-- WorkingType -->
            <a-col :span="12">
              <a-form-item label="Hình thức làm việc">
                <a-select ref="select" v-model:value="add_workingType" @focus="focus"
                  @change="console.log(add_workingType)">
                  <a-select-option value="Toàn thời gian/Fulltime">Toàn thời gian/Fulltime</a-select-option>
                  <a-select-option value="Bán thời gian/Partime">Bán thời gian/Partime</a-select-option>
                  <a-select-option value="Làm việc từ xa/Remote">Làm việc từ xa/Remote</a-select-option>
                  <a-select-option value="Thực tập/Intern">Thực tập/Intern</a-select-option>
                </a-select>
                <!-- <a-input type="text" class="input" name="add_workingType" v-model:value="add_workingType"
                  style="width: 100%;" /> -->
              </a-form-item>
            </a-col>
          </a-row>
          <!-- Kinh nghiệm, trình độ -->
          <a-row>
            <a-col :span="12">
              <a-form-item label="Yêu cầu kinh nghiệm">
                <a-select ref="select" v-model:value="add_expRequire" @focus="focus"
                  @change="console.log(add_expRequire)">
                  <a-select-option value="Không yêu cầu">Không yêu cầu</a-select-option>
                  <a-select-option value="Dưới 1 năm">Dưới 1 năm</a-select-option>
                  <a-select-option value="1 năm">1 năm</a-select-option>
                  <a-select-option value="2 năm">2 năm</a-select-option>
                  <a-select-option value="3 năm">3 năm</a-select-option>
                  <a-select-option value="4 năm">4 năm</a-select-option>
                  <a-select-option value="Trên 5 năm">Trên 5 năm</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Yêu cầu trình độ">
                <a-select ref="select" v-model:value="add_educationRequire" @focus="focus"
                  @change="console.log(add_educationRequire)">
                  <a-select-option value="Không yêu cầu">Không yêu cầu</a-select-option>
                  <a-select-option value="Đại học">Đại học</a-select-option>
                  <a-select-option value="Cao đẳng">Cao đẳng</a-select-option>
                  <a-select-option value="Trung cấp">Trung cấp</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="Mức lương">
            <a-input type="text" class="input" name="add_jobSalary" v-model:value="add_jobSalary" />
          </a-form-item>
          <a-row>
            <a-col :span="12">
              <a-form-item label="Hạn nộp">
                <a-date-picker v-model:value="add_deadline" :format="'DD/MM/YYYY'" :disabled-date="disabledDate"
                  @change="console.log('a-date-picker:', useDayjs(birthday).format('DD/MM/YYYY'))" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Tỉnh/Thành phố">
                <a-select ref="select" v-model:value="add_province" style="width: 120px" :options="provinceOption"
                  @focus="focus" @change="handleChange"></a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item label="Mô tả công việc">
            <a-textarea v-model:value="add_jobDescription" rows="4" cols="30">
            </a-textarea>
          </a-form-item>
          <a-form-item label="Yêu cầu công việc">
            <a-textarea v-model:value="add_jobRequirement" rows="4" cols="30">
            </a-textarea>
          </a-form-item>
          <a-form-item label="Quyền lợi">
            <a-textarea v-model:value="add_jobBenefit" rows="4" cols="30">
            </a-textarea>
          </a-form-item>
        </a-form>
        <template #footer>
          <a-button key="back" @click="this.open = false">Đóng</a-button>
          <a-button type="primary" @click="handleAdd">Tạo tin</a-button>
        </template>
      </a-modal>

    </div>

    <div v-else>
      <h1>Nhà tuyển dụng</h1>
      <a-grow style="display: flex; justify-content: space-around;">
        <a-col :span="6" style="    display: flex; justify-content: center; align-items: center;">
          <a-card title="1">
            <h3>Tạo tài khoản miễn phí của bạn</h3>
            <p>Tất cả những gì bạn cần là địa chỉ email để tạo tài khoản và bắt đầu tạo bài đăng việc làm của mình.</p>
          </a-card>
        </a-col>
        <a-col :span="6" style="    display: flex; justify-content: center; align-items: center;">
          <a-card title="2">
            <h3>Tạo bài đăng việc làm của bạn</h3>
            <p>Sau đó chỉ cần thêm chức danh, mô tả và địa điểm vào bài đăng việc làm của bạn, và bạn đã sẵn sàng tuyển
              dụng.</p>
          </a-card>
        </a-col>
        <a-col :span="6" style="    display: flex; justify-content: center; align-items: center;">
          <a-card title="3">
            <h3>Đăng việc làm của bạnt</h3>
            <p>Sau khi đăng việc làm, hãy sử dụng các công cụ hiện đại của chúng tôi để giúp bạn tìm thấy nhân tài mong
              muốn.</p>
          </a-card>
        </a-col>
      </a-grow>
      <div
        style="display: flex;align-items: center; flex-direction: column; margin-top: 2rem; background-color: rgb(123, 160, 237); height: 7.5rem;">
        <p style="font-size: 14px; font-weight: 500;">Tạo việc làm nhanh chóng</p>
        <button @click="() => {
          navigateTo('/login')
        }"
          style="cursor: pointer; width: 9rem; padding: 1rem; background-color: #164081; color: white; font-size: 0.8rem; font-weight: 700; border: none; border-radius: 10px;">
          Bắt đầu ngay
        </button>
      </div>
      <a-grow style="display:flex;padding: 1rem 0;">
        <a-col :span="6" style="    display: flex;justify-content: center;align-items: center;">
          <img src="./../../assets/images/icons8-profile-100.png" alt="">
          <h4>Tìm ứng viên chất lượng</h4>
        </a-col>
        <a-col :span="6" style="    display: flex;justify-content: center;align-items: center;">
          <img src="./../../assets/images/icons8-task-100.png" alt="">
          <h4>Đăng tuyển miễn phí</h4>
        </a-col>
        <a-col :span="6" style="    display: flex;justify-content: center;align-items: center;">
          <img src="./../../assets/images/icons8-ratings-100.png" alt="">
          <h4>Quảng cáo tuyển dụng</h4>
        </a-col>
        <a-col :span="6" style="    display: flex;justify-content: center;align-items: center;">
          <img src="./../../assets/images/icons8-documents-100.png" alt="">
          <h4>Quản lý thông tin dễ dàng</h4>
        </a-col>
      </a-grow>
    </div>

  </a-layout>
</template>

<script>
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import provinces from '../../assets/data/provinces';
import { notification } from 'ant-design-vue';
export default {
  setup() {
    definePageMeta({
      layout: 'nhatuyendung'
    })
  },
  data() {
    return {
      disabledDate(current) {
        // Can not select days before today and today
        return current && current < dayjs().endOf('day');
      },
      hannop: dayjs('01/01/2015', 'DD/MM/YYYY'),
      add_jobDescription: '',
      com_created: '',
      add_workingType: '',
      add_expRequire: '',
      add_major: '',
      add_educationRequire: '',
      add_jobBenefit: '',
      add_jobTitle: '',
      add_jobRequirement: '',
      add_jobSalary: '',
      add_deadline: '',
      add_province: '',
      add_logo: '',
      provinceOption: provinces,
      open: false,
      modalEditOpen: false,
      isLogin: null,
      userLogin: {},
      companyPost: [],
      selectedPost: {},
    }
  },
  async mounted() {
    if (process.client) {
      this.isLogin = localStorage.getItem('loginUserID');
      if (this.isLogin !== '') {
        this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
        console.log("nha tuyen dung login profile:", this.userLogin);
        this.getCompanyPosts();
        this.clearOutDatePosts();
      }
    }
  },
  methods: {
    async clearOutDatePosts() {
      try {
        await $fetch('http://localhost:8000/posts/getOutDatePosts', { method: 'PUT', })
      } catch (error) {
        console.log(error);
      }
    },
    async changeInfo() {
      try {
        await $fetch('http://localhost:8000/posts/updatePost/' + this.selectedPost.data._id, {
          method: 'PUT',
          body: {
            job_title: this.selectedPost.data.job_title,
            job_salary: this.selectedPost.data.job_salary,
            deadline: dayjs(this.hannop).format('DD/MM/YYYY'),
            job_description: this.selectedPost.data.job_description,
            job_requirement: this.selectedPost.data.job_requirement,
            job_benefit: this.selectedPost.data.job_benefit,
            major: this.selectedPost.data.major,
            workingType: this.selectedPost.data.workingType,
            expRequire: this.selectedPost.data.expRequire,
            educationRequire: this.selectedPost.data.educationRequire,
          }
        })
        // this.openNotificationWithIcon(
        //                 'success',
        //                 'Cập nhật thông tin tuyển dụng thành công!',
        //                 'Bạn có thể xem và chỉnh sửa thông tin của bài tuyển dụng này trước khi được duyệt.'
        //             )
        message.success('Cập nhật thông tin tuyển dụng thành công');
        this.modalEditOpen = false;
        this.getCompanyPosts();
      } catch (error) {
        console.log(error)
      }
    },
    async getCompanyPosts() {
      this.companyPost = await $fetch('http://localhost:8000/posts/getCompanyPosts/' + this.isLogin);
    },

    openNotificationWithIcon(type, mess, des) {
      notification[type]({
        placement: "top",
        message: mess,
        description: des,
      })

    },

    viewAppiedCandidates(postID) {
      navigateTo('/nhatuyendung/post/' + postID)
    },
    showDrawer() {
      this.open = true;
    },
    showAddModal() {
      this.open = true;
    },

    async handleAdd() {
      try {
        const res = await $fetch('http://localhost:8000/posts/create', {
          method: 'POST',
          body: {
            job_description: this.add_jobDescription,
            workingType: this.add_workingType,
            expRequire: this.add_expRequire,
            major: this.add_major,
            educationRequire: this.add_educationRequire,
            job_title: this.add_jobTitle,
            job_requirement: this.add_jobRequirement,
            job_benefit: this.add_jobBenefit,
            com_created: this.userLogin._id,
            job_salary: this.add_jobSalary,
            province: this.add_province,
            deadline: dayjs(this.add_deadline).format('DD/MM/YYYY'),
          }
        })
        this.openNotificationWithIcon(
          'success',
          'Tạo tin tuyển dụng thành công!',
          'Bạn có thể xem và chỉnh sửa thông tin của bài tuyển dụng này trước khi được duyệt.'
        )
        this.getCompanyPosts();
        this.open = false
      } catch (error) {
        console.log(error)
        this.openNotificationWithIcon('error')
      }

    },
    async hidePost(id) {
      if (confirm("Xác nhận ngưng tuyển dụng vị trí này?") == true) {
        try {
          await $fetch('http://localhost:8000/posts/changePostStatus/' + id, {
            method: 'PUT',
            body: {
              status: 2
            }
          })
          this.companyPost = await $fetch('http://localhost:8000/posts/getCompanyPosts/' + this.isLogin);
          message.success('Ngưng tuyển dụng vị trí này');
        } catch (error) {
          console.log(error);
        }
      } else {
      }




    },

    async handleEdit(id) {
      
      this.selectedPost = await useFetch('http://localhost:8000/posts/getPost/' + id)
      console.log("chon", this.selectedPost)
      this.hannop = dayjs(this.selectedPost.data.deadline, 'DD/MM/YYYY')
      // this.hannop = dayjs(useDayjs(dayjs(this.selectedPost.data.deadline, 'DD/MM/YYYY')), 'DD/MM/YYYY')
      // console.log('han: ', useDayjs(this.hannop).format('DD/MM/YYYY'))
      //  = .data.deadline
      this.modalEditOpen = true;
    },
    handleOk(e) {
      console.log(e);
      this.modalEditOpen = false;
    },
    onClose() {
      this.open = false;
    },
    addPost() {
      console.log("them post")
    },
    rowSelection(event) {
      console.log(event)
    },
    onChange(pagination, filters, sorter, extra) {
      console.log('params', pagination, filters, sorter, extra);
    },
    clearLoginInfo() {
      console.log("thoat")
      localStorage.removeItem("loginUserID");
      navigateTo('/login')
    }
  },
  computed: {
    getNewCompanyPosts() {
      return this.companyPost;
    }
  }
}
</script>

<style scoped lang="scss">
.xemhoso:hover {
  cursor: pointer;
  background-color: rgb(228, 217, 217);
  padding: 2px;
}

.post_list {

  // background-color: rgb(67, 61, 61);
  .job_item {
    background-color: rgb(255, 254, 254);
    margin: 2rem 0;
    box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;


  }
}


.message {
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

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