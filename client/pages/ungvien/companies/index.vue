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
      filterOption,
      // users
    };
  },
  data() {
    return {
      value: ref(),
      open: false,
      selectedCompany: {},
      data: [],
      open: Boolean,
      options: [],
    }

  },
  mounted() {
    this.data = myData;
    this.options = this.data.map((item) => {
      return {
        ...item,
        label: item.company,
        value: item.company
      }
    });

  },
  methods: {
    gotoCompanyInfo(com) {
      console.log(com.company)
      navigateTo('/ungvien/companies/'+com.company)
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