<template>
  <a-layout :name="nhatuyendung">
    <div v-if="isLogin">
      <h1>Danh sách ứng viên</h1>
      <a-row justify="space-around">
        <a-col style :span="6" v-for="candidate in candidatesData">
          <a-card hoverable @click="showModal(candidate)">
            <a-card-meta v-if="candidate.cv.sex" v-bind:title="candidate.cv.fullName"
              v-bind:description='toStringSex(candidate.cv.sex) + " - Năm sinh: " + candidate.cv.birthday.slice(6)'>
              <template #avatar>
                <a-avatar v-bind:src="candidate.cv.avatar" />
              </template>
            </a-card-meta>
            <a-divider />
            <a-row>
              <a-col :span="10">Trình độ:</a-col>
              <a-col :span="14">{{ candidate.cv.level }}</a-col>
            </a-row>
            <a-row>
              <a-col :span="10">Tỉnh/Thành phố:</a-col>
              <a-col :span="14">{{ candidate.cv.province }}</a-col>
            </a-row>
          </a-card>
        </a-col>
      </a-row>
      <!-- modal show candidate CV -->
      <a-modal v-model:open="open" title="Hồ sơ cá nhân" width="100%" wrap-class-name="full-modal" @ok="handleOk">
        <div class="CV_header">
          <a-row>
            <!-- Thông tin ứng viên -->
            <a-col :span="6">
              <img style="width: 30%; border-radius: 10%;" v-bind:src="selectedCV.cv.avatar" alt="">
              <div>
                <h2>{{ selectedCV.cv.fullName }}</h2>
                <div>
                  <p style="font-weight: lighter;">Giới tính: {{ toStringSex(selectedCV.cv.sex) }} 
                    <br> Ngày sinh: {{ selectedCV.cv.birthday }}
                    <br>Nơi sinh sống: {{ selectedCV.cv.province }} 
                  </p>
                </div>
                <a-divider />
                <h3>Thông tin liên hệ 
                  <img width="30" height="30" src="https://img.icons8.com/ios/50/contact-card.png" alt="contact-card"/>
                </h3>
                <div>Địa chỉ: {{ selectedCV.cv.address }}</div>
                <div>Email: {{ selectedCV.username }}</div>
                <div>Số điện thoại: {{ selectedCV.cv.phone }}</div>
              </div>
            </a-col>
            <!-- Thông tin CV -->
            <a-col :span="16">
              <div>
                <div>
                  <h3>Giới thiệu</h3>
                  <p>{{ selectedCV.cv.brief_intro }}</p>
                </div>
                <a-divider />
                <h3>Học vấn 
                    <img width="30" height="30" src="https://img.icons8.com/ios-glyphs/60/flying-motarboard.png" alt="flying-motarboard"/>
                  </h3>
                <div v-if="selectedCV.cv.education.length>0">
                  <a-divider />
                  <div v-for="edu in selectedCV.cv.education">
                    <a-row class="education_item">
                      <a-col :span="20">
                        <div>
                          <PushpinOutlined /> <b>{{ edu.school }} ({{ edu.start }} - {{ edu.end }})</b>
                        </div>
                        <div>Chuyên ngành: {{ edu.major }}</div>
                        <div>Xếp loại : {{ edu.graded }}</div>
                      </a-col>
                    </a-row>
                  </div>
                </div>
                <div v-else>
                  Chưa cập nhật
                </div>
                <a-divider />
                <h3>Bằng cấp
                    <img width="30" height="30" src="https://img.icons8.com/windows/32/winner-document.png" alt="winner-document"/>
                  </h3>
                <div v-if="selectedCV.cv.degreeList.length>0">                                
                  <div v-for="degree in selectedCV.cv.degreeList">
                    <a-row class="education_item">
                      <a-col :span="20">
                        <div>
                          <BookOutlined /> <b>{{ degree.degreeName }}</b>
                          <p>Kết quả: {{ degree.result }}</p>
                        </div>
                        <div></div>
                      </a-col>

                    </a-row>
                  </div>
                </div>
                <div v-else>
                  Chưa cập nhật
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
        <template #footer>
          <a-button type="primary" @click="handleOk">Đóng</a-button>
        </template>
      </a-modal>
    </div>
    <div v-else>
      <h3>Bạn cần đăng nhập với tài khoản của nhà tuyển dụng để xem danh sách ứng viên</h3>
      <a-button type="primary" @click="navigateTo('./../login')">
        Đăng nhập ngay
      </a-button>
    </div>
  </a-layout>
</template>

<script>

definePageMeta({
  layout: 'nhatuyendung'
})
export default {
  data() {
    return {
      isLogin: null,
      userLogin: {},
      open: false,
      candidatesData: false,
      selectedCV: null,
    }
  },
  async mounted() {
    if (process.client) {
      this.isLogin = localStorage.getItem('loginUserID');
      if (this.isLogin !== '') {
        this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
      }
      this.candidatesData = await $fetch('http://localhost:8000/users/getCandidates');
      console.log("candidates data", this.candidatesData);
    }
  },
  methods: {
    checkIsFollowed(id) {
      return this.userLogin.follow.some(ele => {
        if (ele === id) {
          console.log(`elem:${ele} vs id:${id}`)
          return true
        }
        else { return false }
      })
    },
    toStringSex(numb) {
      if (numb == 1) return "Nam"
      return "Nữ"
    },
    async handleUnFollowCV(candidateId) {
      try {
        await $fetch('http://localhost:8000/users/unfollow/' + this.isLogin, {
          method: 'PUT',
          body: {
            unfollowId: candidateId
          }
        });
        this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
        alert("unfollow")
      } catch (error) {
        console.log(error)
      }
    },
    async handleFollowCV(candidateId) {
      console.log("them candidate ID vao follow list =>>  ", candidateId)
      try {
        await $fetch('http://localhost:8000/notifications/create/', {
          method: 'POST',
          body: {
            fromUserID: this.isLogin,
            toUserID: candidateId,
            action: "follow"
          }
        })
        this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
        alert("follow thanh cong")
      } catch (error) {
        console.log(error)
      }
    },
    showModal(candidate) {
      this.selectedCV = candidate
      console.log("cv:", this.selectedCV)
      this.open = true;
    },
    handleOk() {
      this.open = false;
    },
  }
}
</script>

<style scoped>
.ant-modal {
  max-width: 100%;
  top: 0;
  padding-bottom: 0;
  margin: 0;
}

.ant-modal-content {
  display: flex;
  flex-direction: column;
  height: calc(100vh);
}

.ant-modal-body {
  flex: 1;
}

.candidate_CV {
  cursor: pointer;
}
</style>