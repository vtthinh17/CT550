<template>
  <a-layout :name="Ungvien">
    <div class="searchBox">
      <a-auto-complete v-model:value="value" :options="options" style="width: 30%" placeholder="input here"
        :filter-option="filterOption" />
      <a-tooltip title="search">
        <a-button>
          <SearchOutlined />
        </a-button>
      </a-tooltip>
    </div>
    <a-row justify="space-around" style="padding: 0px 20px;">
      <a-col v-for="item in data" :span="7">
        <a-card hoverable class="cardItem" @click="gotoCompanyInfo(item)">
          <div class="khungAvatar">
            <img class="com_img" v-bind:src="item.logo[0]" alt="">
          </div>
          <b>
            {{ item.company[0] }}
          </b>
          <p style="color: rgb(66,118,221);">
            Đăng tuyển (posts.count(companyID)) việc
          </p>
        </a-card>
      </a-col>
    </a-row>
    <h2>Danh sách công ty từ db</h2>
    <a-row justify="space-around" style="padding: 0px 20px;">
      <a-col v-for="company in propertyComputed" :span="7">
        <a-card hoverable class="cardItem" @click="gotoCompanyInfo(company)">
          <div class="khungAvatar">
            <img class="com_img" src="https://vieclam24h.vn/img/vieclam24h_logo_customer.jpg" alt="">
          </div>
          <b>
            {{ company.com_name }}
          </b>
          <p v-if="company.totalPost && company.totalPost>0" style="color: rgb(66,118,221);">
            Đăng tuyển {{ company.totalPost }} việc
          </p>
          <p v-else style="color: blue;">
            Chưa có tin tuyển dụng nào
          </p>
        </a-card>
      </a-col>
    </a-row>
  </a-layout>
</template>
  
<script>
import myData from '../../../assets/data/data';
// data get from database, each company have an id & its posts
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
    // async getCompanyPosts(id) {
    //   const posts = await $fetch('http://localhost:8000/posts/getCompanyPosts/' + id)
    //   console.log("rs", rs)
    //   return posts
    // },
    removeDuplicate() { },
    async getCompanyPosts(id) {
      return await $fetch('http://localhost:8000/posts/getCompanyPosts/' + id)
    }
  },
  async mounted() {
    if (process.client) {
      this.data = myData;
      this.companies = await $fetch('http://localhost:8000/users/getAllCompanies');
      console.log("getAllCompanies:", this.companies);
        }
     
      // let app = this;
      // this.companies = await this.companies.map(async (item) => {
      //   let list = [];
      //   console.log(list);
      //   list = await app.getCompanyPosts(item._id);
      //   console.log(list);
      //   return {
      //     ...item,
      //     posts: list
      //   }
      // });
    // let unique = this.groupBy(this.data,"company");
    // console.log("phanloai:", this.data);


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
    // groupBy(array, property) {
    //   array.reduce((grouped, element) => ({
    //     ...grouped,
    //     [element[property]]: [...(grouped[element[property]] || []), element]
    //   }), {})
    // },
    gotoCompanyInfo(com) {
      // console.log("selected company:", com._id)
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