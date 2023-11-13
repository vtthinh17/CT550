<template>
  <a-layout :name="nhatuyendung">
    <div v-if="isLogin">
      <h1>Danh sách ứng viên</h1>
      <div style="background-color: #5b7fb4; padding: 1rem;">
        <div style="display: flex; justify-content: center;">
          <a-cascader class="filterOption" v-model:value="filter_gender" style="width: 10%" max-tag-count="responsive"
            :options="filterOptions_gender" placeholder="Giới tính">
          </a-cascader>

          <a-divider type="vertical"></a-divider>
          <a-cascader class="filterOption" v-model:value="filter_education" style="width: 10%" max-tag-count="responsive"
            :options="filterOptions_education" placeholder="Trình độ">
          </a-cascader>
          <a-divider type="vertical"></a-divider>
          <a-cascader class="filterOption" v-model:value="filter_province" style="width: 20%" max-tag-count="responsive"
            :options="provincesOptions" placeholder="Tỉnh/Thành phố">
          </a-cascader>
          <a-divider type="vertical"></a-divider>
          <a-button style="background-color: yellow;" @click="reloadCandidatesList()">Lọc danh sách ứng viên</a-button>
        </div>
      </div>
      <a-row v-if="totalCount > 0" justify="space-around">
        <a-col :span="7" v-for="candidate in getCandidatesList">
          <a-card v-if="candidate.cv" hoverable @click="showModal(candidate)" style="margin: 4px 0">
            <a-card-meta v-if="candidate.cv.sex" v-bind:title="candidate.cv.fullName"
              v-bind:description='"Giới tính: " + toStringSex(candidate.cv.sex) + " - Năm sinh: " + candidate.cv.birthday.slice(6)'>
              <template #avatar>
                <a-avatar v-if="candidate.cv.avatar" v-bind:src="candidate.cv.avatar" />
                <a-avatar v-else src="/_nuxt/assets/images/avatar_7610857.png" />

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
      <a-result v-else title="Không có tin tuyển dụng nào thỏa yêu cầu tìm kiếm của bạn!"
        sub-title="Hãy thử tìm kiếm với các lựa chọn khác hoặc xóa bỏ tất cả lựa chọn để làm mới danh sách tin tuyển dụng.">
        <template #icon>
          <FrownOutlined />
        </template>
      </a-result>
      <div class="pagination">
        <a-pagination @change="onChangePagination" v-model:current="currentPage" :pageSize="6" :total="totalCount" />
      </div>
      <!-- modal show candidate CV -->
      <a-modal v-model:open="open" title="Hồ sơ cá nhân" width="100%" wrap-class-name="full-modal" @ok="handleOk">
        <div class="CV_header">
          <a-row>
            <!-- Thông tin ứng viên -->
            <a-col :span="6">
              <div style="width:60%">
                <img v-if="selectedCV.cv.avatar" style="width: 30%; border-radius: 10%;" v-bind:src="selectedCV.cv.avatar"
                  alt="">
                <img v-else style="width: 40%; border-radius: 10%;" src="/_nuxt/assets/images/avatar_7610857.png" alt="">
              </div>
              <div>
                <h2>{{ selectedCV.cv.fullName ? selectedCV.cv.fullName : "Chưa cập nhật" }}</h2>
                <div>
                  <p style="font-weight: lighter;">Giới tính: {{ selectedCV.cv.sex ? toStringSex(selectedCV.cv.sex) :
                    "Chưa cập nhật" }}
                    <br> Ngày sinh: {{ selectedCV.cv.birthday ? selectedCV.cv.birthday : "Chưa cập nhật" }}
                    <br>Nơi sinh sống: {{ selectedCV.cv.province ? selectedCV.cv.province : "Chưa cập nhật" }}
                  </p>
                </div>
                <a-divider />
                <h3>Thông tin liên hệ
                  <img width="30" height="30" src="https://img.icons8.com/ios/50/contact-card.png" alt="contact-card" />
                </h3>
                <div>Địa chỉ: {{ selectedCV.cv.address ? selectedCV.cv.address : "Chưa cập nhật" }}</div>
                <div>Email: {{ selectedCV.username ? selectedCV.cv.username : "Chưa cập nhật" }}</div>
                <div>Số điện thoại: {{ selectedCV.cv.phone ? selectedCV.cv.phone : "Chưa cập nhật" }}</div>
              </div>
            </a-col>
            <!-- Thông tin CV -->
            <a-col :span="16">
              <div>
                <div>
                  <h3>Giới thiệu</h3>
                  <p>{{ selectedCV.cv.brief_intro ? selectedCV.cv.brief_intro : "Chưa cập nhật" }}</p>
                </div>
                <a-divider />
                <h3>Học vấn
                  <img width="30" height="30" src="https://img.icons8.com/ios-glyphs/60/flying-motarboard.png"
                    alt="flying-motarboard" />
                </h3>
                <div v-if="selectedCV.cv.education.length > 0">
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
                  <img width="30" height="30" src="https://img.icons8.com/windows/32/winner-document.png"
                    alt="winner-document" />
                </h3>
                <div v-if="selectedCV.cv.degreeList.length > 0">
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
import provinces from '../../assets/data/provinces';
definePageMeta({
  layout: 'nhatuyendung'
})
export default {
  data() {
    return {
      filter_education: false,
      filter_province: false,
      filter_gender: false,
      provincesOptions: provinces,
      filterOptions_education: [
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

      ],
      filterOptions_gender: [
        {
          label: 'Nam',
          value: 1,

        },
        {
          label: 'Nữ',
          value: 2,

        },
      ],
      isLogin: null,
      userLogin: {},
      open: false,
      candidatesList: [],
      selectedCV: null,
      totalCount: 0,
      currentPage: 1,
    }
  },
  async mounted() {
    if (process.client) {
      this.isLogin = localStorage.getItem('loginUserID');
      if (this.isLogin !== '') {
        this.userLogin = await $fetch('http://localhost:8000/users/getUser/' + this.isLogin);
      }
      this.reloadCandidatesList();
    }
  },
  methods: {
    onChangePagination() {
      this.reloadCandidatesList();
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
    async reloadCandidatesList() {
      const userData = await this.getFilterOptions();
      console.log(">>>>>", userData)
      this.candidatesList = [];
      this.totalCount = userData.totalCount;
      for (let user of userData.users) {
        if (user.cv.fullName) {
          this.candidatesList.push(user);
        }
      }

    },
    async getFilterOptions() {
      try {
        return await $fetch(`http://localhost:8000/users/getAllCandidates?currentPage=${this.currentPage}${this.filter_gender && this.filter_gender[0] ? '&gender=' + this.filter_gender[0] : ''}${this.filter_education && this.filter_education[0] ? '&educationRequire=' + this.filter_education[0] : ''}${this.filter_province && this.filter_province[0] ? '&province=' + this.filter_province[0] : ''}`);
      } catch (error) {
        console.log(error)
      }
    },
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
  },
  computed: {
    getCandidatesList() {
      return this.candidatesList;
    }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  padding: 6px 0px;
}

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