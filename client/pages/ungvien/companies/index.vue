<template>
  <a-layout :name="Ungvien">
    <h2>Danh sách công ty</h2>
    <a-row justify="space-around" style="padding: 0px 20px;">
      <a-col v-for="company in propertyComputed" :span="7">
        <a-card hoverable class="cardItem" @click="gotoCompanyInfo(company)">
          <div class="khungAvatar">
            <img v-if="company.com_logo" class="com_img" v-bind:src="company.com_logo" alt="">
            <img v-else class="com_img" src="https://cdn-icons-png.flaticon.com/128/1607/1607966.png" alt="">
          </div>
          <b>{{ company.com_name }}</b>
          <p style="color: rgb(66,118,221);">
            {{ company.totalDisplayPosts > 0 ? 'Đang tuyển '+ company.totalDisplayPosts + ' việc': 'Chưa có tin tuyển dụng nào' }}
          </p>
        </a-card>
      </a-col>
    </a-row>
  </a-layout>
</template>
  
<script>
import myData from '../../../assets/data/data';
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
      filterOption
    };
  },
  data() {
    return {
      companies: false,
      value: ref(),
      open: false,
      selectedCompany: {},
      data: [],
      open: Boolean,
      options: [],
    }

  },
  methods: {

  },

  async mounted() {
    if (process.client) {
      this.data = myData;
      this.companies = await $fetch('http://localhost:8000/users/getAllCompanies');
      console.log("getAllCompanies:", this.companies);
    }
  },

  computed: {
    propertyComputed() {
      console.log(this.companies);
      return this.companies
    },
    posts() {
      return this.companies.posts;
    }
  },
  
  methods: {
    gotoCompanyInfo(com) {
      navigateTo('/ungvien/companies/' + com._id)
    },
  }

}

</script>

<style scoped lang="scss">
:where(.css-dev-only-do-not-override-eq3tly).ant-modal-root .ant-modal-mask {
  background: rgba(0, 0, 0, 0.1) !important;
}

.job-item_logo {
  width: 50%;
  /* image-fi */
}

.cardItem {
  height: 15rem;
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;
  justify-content: center;
  align-items: center;
}

.khungAvatar {
  height: 60%;
  // width: 200px;
  display: flex;
  overflow: hidden;
  justify-content: center;
  // border: 1px solid black;
}

.com_img {
  width: 50%;
}

.searchBox {
  display: flex;
  justify-content: center;
  padding-top: 10px;

}
</style>