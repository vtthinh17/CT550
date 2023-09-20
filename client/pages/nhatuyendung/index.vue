<template>
  <a-layout :name="nhatuyendung">

    <div v-if="this && this.isLogin">
      <a-row class="gradient_list">
        <a-col :span="7"
          style="font-size: 1rem;color: #0c0606; display: flex; flex-direction: column;background-color: rgb(219, 213, 213);"
          class="gradient_item">
          Số bài đã đăng
          <b>{{ companyPost.length }}</b>
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
      <h1>Tin của tôi</h1>
      <div v-if="companyPost.length" class="post_list">
        <div v-for="post in companyPost" class="job_item">
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
            <span>Đăng ngày: 12/03/2024</span>
            <span>Lượt xem: 204 người</span>
          </div>
          <div>
            <b>Tuyển dụng: {{ post.job_title }}</b>
          </div>
          <div style="display: flex;">
            <div style="flex:2; display: flex;justify-content: center;">
              <img style="width:50%;" src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg" alt="">
            </div>
            <div style="flex:2">
              <b>{{ userLogin.com_name }}</b>
              <p v-if="post.job_salary.includes('tr', 'triệu,TR,TRIỆU')"> Mức lương: {{ post.job_salary }}</p>
              <p v-else>Mức lương: {{ post.job_salary }}tr</p>

              <span class="xemhoso" @click="viewAppiedCandidates(post._id)">
                <a-tooltip>
                  <template #title>Xem danh sách hồ sơ</template>
                  <UserOutlined /> Hồ sơ đã nộp: {{ post.applied.length }}
                </a-tooltip>
              </span>
            </div>
            <div style="flex: 6;">
              <button class="button-36" role="button" @click="showModal(post._id)">Xem nội dung chi tiết</button>
              <br>
              <a-button v-if="post.status != 2 && post.status != 0" type="primary" class="xemhoso"
                @click="hidePost(post._id)">
                <DeleteOutlined /> Ẩn bài đăng
              </a-button>
              <br>
              <a-button v-if="post.status != 2" key="submit" type="primary" @click="handleEdit(post._id)">
                <EditOutlined /> Chỉnh sửa bài đăng
              </a-button>
              <div>

              </div>
              <!-- <span style="cursor: pointer; background-color: white;"><EditOutlined /> Chỉnh sửa bài đăng</span> -->
            </div>
          </div>
        </div>

      </div>
      <div v-else>
        <p>Chưa có dữ liệu, hãy tạo tin mới</p>
      </div>
      <!-- View post modal -->
      <a-modal width="80%" v-model:open="modalOpen" title="Nội dung chi tiết bài đăng" @ok="handleOk">
        <h2>Yêu cầu công việc</h2>
        <p style="font-weight: lighter;">
          {{ selectedPost.data.job_requirement }}
        </p>
        <h2>Quyền lợi</h2>
        <p style="font-weight: lighter;">
          {{ selectedPost.data.job_benefit }}
        </p>

        <template #footer>
          <a-button key="back" @click="this.modalOpen = false">OK</a-button>
        </template>
      </a-modal>
      <!-- Edit modal -->
      <a-modal v-model:open="modalEditOpen" title="Nội dung chi tiết bài đăng" @ok="handleAdd">
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol" layout="horizontal" :disabled="componentDisabled"
          style="max-width: 600px">
          <a-form-item label="Tên bài tuyển dụng">
              {{selectedPost.data.job_title}} 
              <EditOutlined @click="changeInfo" />
            <!-- <input type="text" class="input" name="add_jobTitle" > -->
          </a-form-item>
          <a-form-item label="Mức lương">
            {{selectedPost.data.job_title}} 
              <EditOutlined @click="changeInfo" />
            <!-- <input type="text" class="input" name="add_jobSalary" v-model="add_jobSalary"> -->
          </a-form-item>
          <a-form-item label="Hạn nộp">
            {{selectedPost.data.deadline}} 
            <input type="date" class="input" name="add_deadline" v-model="add_deadline">
              <!-- <EditOutlined @click="changeInfo" /> -->
            <!-- <input type="date" class="input" name="add_deadline" v-model="add_deadline"> -->
          </a-form-item>
          <a-form-item label="Yêu cầu công việc">
            {{selectedPost.data.job_requirement}}
            <EditOutlined @click="changeInfo" />
            <!-- <textarea v-model="selectedPost.data.job_requirement" rows="4" cols="30">
            </textarea> -->
          </a-form-item>
          <a-form-item label="Quyền lợi">
            {{selectedPost.data.job_benefit}}
            <EditOutlined @click="changeInfo" />
            <!-- <textarea v-model="selectedPost.data.job_benefit" rows="4" cols="30">
            </textarea> -->
    
          </a-form-item>
        
        </a-form>
      </a-modal>
      <!-- Add post form -->
      <a-modal v-model:open="open" title="Thêm tin tuyển dụng" @ok="handleAdd">
        <a-form :label-col="labelCol" :wrapper-col="wrapperCol" layout="horizontal" :disabled="componentDisabled"
          style="max-width: 600px">
          <a-form-item label="Tên bài tuyển dụng">
            <input type="text" class="input" name="add_jobTitle" v-model="add_jobTitle">
            <!-- <a-input v-model:job_title="add_jobTitle" name="add_jobTitle" /> -->
          </a-form-item>
          <a-form-item label="Mức lương">
            <input type="text" class="input" name="add_jobSalary" v-model="add_jobSalary">
            <!-- <a-input v-model:job_salary="add_jobSalary" /> -->
          </a-form-item>
          <a-form-item label="Hạn nộp">
            <input type="date" class="input" name="add_deadline" v-model="add_deadline">
            <!-- <a-date-picker v-model:deadline_apply="add_deadlineApply" /> -->
          </a-form-item>
          <a-form-item label="Yêu cầu công việc">
            <textarea v-model="add_jobRequirement" rows="4" cols="30">
            </textarea>
            <!-- <a-textarea v-model:job_requirement="add_jobRequirement" :rows="3" /> -->
          </a-form-item>
          <a-form-item label="Quyền lợi">
            <textarea v-model="add_jobBenefit" rows="4" cols="30">
            </textarea>
            <!-- <a-textarea v-model:job_benefit="add_jobBenefit" :rows="3" /> -->
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
    <div v-else>
      <h1>Nhà tuyển dụng</h1>
      <a-grow style="display: flex; justify-content: space-around;">
        <a-col :span="6" style="    display: flex;
    justify-content: center;
    align-items: center;">
          <a-card title="1">
            <h3>Tạo tài khoản miễn phí của bạn</h3>
            <p>Tất cả những gì bạn cần là địa chỉ email để tạo tài khoản và bắt đầu tạo bài đăng việc làm của mình.</p>
          </a-card>
        </a-col>
        <a-col :span="6" style="    display: flex;
    justify-content: center;
    align-items: center;">
          <a-card title="2">
            <h3>Tạo bài đăng việc làm của bạn</h3>
            <p>Sau đó chỉ cần thêm chức danh, mô tả và địa điểm vào bài đăng việc làm của bạn, và bạn đã sẵn sàng tuyển
              dụng.</p>
          </a-card>
        </a-col>
        <a-col :span="6" style="    display: flex;
    justify-content: center;
    align-items: center;">
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
import { notification } from 'ant-design-vue';
export default {
  setup() {
    definePageMeta({
      layout: 'nhatuyendung'
    })
  },
  data() {
    return {
      com_created: '',
      add_jobBenefit: '',
      add_jobTitle: '',
      add_jobRequirement: '',
      add_jobSalary: '',
      add_deadline: '',
      add_logo: '',
      open: false,
      modalOpen: false,
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
        this.companyPost = await $fetch('http://localhost:8000/posts/getCompanyPosts/' + this.isLogin);
        console.log("getCompanyPost:",this.companyPost);
      }
    }
  },
  methods: {
    changeInfo(){
      console.log('click')
    },
    openNotificationWithIcon(type) {
      notification[type]({
        placement: "topRight",
        message: (type == 'success' ? 'Thêm tin mới thành công!' : (type == 'info' ? 'Info' : (type == 'warning' ? 'Cảnh báo' : 'Oops, đã có lỗi xảy ra'))),
        description:
          (type == 'success' ?
            'Tin sẽ được hiển thị trên hệ thống sau khi được duyệt. Cảm ơn bạn đã sử dụng hệ thống của chúng tôi.'
            : (type == 'info'
              ? 'Info'
              : (type == 'warning'
                ? 'Cảnh báo'
                : 'Vui lòng thử lại sau.')))

      });
    },
    viewAppiedCandidates(postID) {
      navigateTo('/nhatuyendung/post/'+ postID) 
    },
    showDrawer() {
      this.open = true;
    },
    async showModal(postId) {
      this.selectedPost = await useFetch('http://localhost:8000/posts/getPost/' + postId)
      this.modalOpen = true;
    },
    showAddModal() {
      this.open = true;
    },

    async handleAdd() {
      try {
        console.log("before",this.userLogin._id)
        const res =  await $fetch('http://localhost:8000/posts/create', {
          method: 'POST',
          body: {
            job_title: this.add_jobTitle,
            job_requirement: this.add_jobRequirement,
            job_benefit: this.add_jobBenefit,
            com_created: this.userLogin._id,
            job_salary: this.add_jobSalary,
            deadline: this.add_deadline,
          }
        })
        console.log("response them tin tuyen dung:",res)
        this.openNotificationWithIcon('success')
        this.open = false
      } catch (error) {
        console.log(error)
        this.openNotificationWithIcon('error')
      }

    },
    async hidePost(id) {
      try {
        await $fetch('http://localhost:8000/posts/hidePost/' + id, { method: 'PUT', })
        this.openNotificationWithIcon('success')
      } catch (error) {
        console.log(error)
        this.openNotificationWithIcon('error')
      }
    },

    async handleEdit(id) {
      this.selectedPost = await useFetch('http://localhost:8000/posts/getPost/' + id)
      this.modalEditOpen = true;
    },
    handleOk(e) {
      console.log(e);
      this.modalEditOpen = false;
      this.modalOpen = false;
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
  }
}
</script>

<style scoped lang="scss">
.xemhoso:hover {
  cursor: pointer;
  background-color: rgb(228, 217, 217);
  padding: 2px;
}

.button-36 {
  background-image: linear-gradient(92.88deg, #455EB5 9.16%, #5643CC 43.89%, #673FD7 64.72%);
  border-radius: 8px;
  border-style: none;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  flex-shrink: 0;
  font-family: "Inter UI", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  font-weight: 500;
  height: 3rem;
  padding: 0 1.6rem;
  text-align: center;
  text-shadow: rgba(0, 0, 0, 0.25) 0 3px 8px;
  transition: all .5s;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-36:hover {
  box-shadow: rgba(80, 63, 205, 0.5) 0 1px 30px;
  transition-duration: .1s;
}

@media (min-width: 768px) {
  .button-36 {
    padding: 0 2.6rem;
  }
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