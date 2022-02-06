<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.5/xlsx.full.min.js"></script>

<template>
  <div style="display: flex">
  <v-card class="mx-auto my-12"
          width="1000"
          height="620">
<!--    <v-card :loading="loading"-->
<!--            class="mx-auto my-12"-->
<!--            width="1000"-->
<!--            height="620">-->
    <p style="color: black; font-size:24px" class="jb-bolder">네이버 기사를 통한 시민들의 "한강 의대생 사건"에 대한 관심도 파악</p>
    <form @submit.prevent="submitForm">
      <br><br>
      <div class="row">
        <v-text-field
            v-model="search"
            style="padding: 0 32px 0 32px"
            label="검색어를 입력해주세요."
        ></v-text-field>
      </div>
      <div class="row">
        <v-col cols="12" sm="6">
          <v-date-picker
              v-model="dates"
              range
          ></v-date-picker>
        </v-col>
        <v-col
            cols="12"
            sm="6"
        >
          <v-text-field
              v-model="dateRangeText"
              label="선택된 날짜 범위"
              prepend-icon="mdi-calendar"
              readonly
              style="padding: 0 20px 0 15px"
          ></v-text-field>
        </v-col>
      </div>
      <v-btn
            color="grey;"
            class="mr-4"
            type="submit"
        >
          그래프보기
        </v-btn>

    </form>
  </v-card>
  </div>
</template>
<script>

export default{
  components:{
  },
  props: {
    model: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data: () => ({
    dates: ['2021-04-25', '2021-04-25'],
    search: "",
    files: [],
    excelData: {},
    len: 0
  }),
  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
  methods: {
    submitForm() {
      this.$router.push({name: 'Dashboard', params: {name: 'sohyunPark', date: this.dates, keyword: this.search, file: this.files}})
    }
  }
}

</script>
<style>
.jb-bolder {
  font-weight: bolder;
  size: 50px;
}
</style>
