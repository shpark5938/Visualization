<template>
  <div class="content">
    <br><p style="color: black; font-size:24px" class="jb-bolder">네이버 기사를 통한 시민들의 "한강 의대생 사건"에 대한 관심도 파악</p>
    <h4.5 style="color: dimgray">* 사용자가 선택한 날짜 범위에 따라 다른 시민들의 관심도를 확인할 수 있습니다. *</h4.5>
    <v-col cols="col-12">
      <v-tabs>
        <v-tabs-slider color="green"></v-tabs-slider>
        <v-tab style="color: grey" @click="openNew('daily')">Daily</v-tab>
        <v-tab style="color: grey" @click="openNew('monthly')">Monthly</v-tab>
      </v-tabs>
      <div style="padding: 50px 10px;">
        <line-chart
            height="auto"
            class="chart-area"
            ref="bigChart"
            chart-id="big-line-chart"
            :chart-data="bigLineChart.chartData"
            :gradient-colors="bigLineChart.gradientColors"
            :gradient-stops="bigLineChart.gradientStops"
            :extra-options="bigLineChart.extraOptions">
        </line-chart>
      </div>
      <v-btn @click="movewordCount">단어 반복횟수 확인하기</v-btn>
    </v-col>
  </div>
</template>

<script>
import {
  // Card
} from "@/components/index";

import LineChart from '@/components/Charts/LineChart';
import * as chartConfigs from '@/components/Charts/config';
import config from '@/config';
import excels from './news_result.json';


export default {
  name: 'Dashboard',
  components: {
    // Card,
    LineChart,
  },
  data(){
    return{
      items: [
      { subtitle: `<span class="font-weight-bold">입력한 검색어</span> &mdash;` + this.$route.params.keyword},
      { divider: true, inset: true },
      { subtitle: '<span class="font-weight-bold">선택한 날짜 범위</span> &mdash;' + this.$route.params.date[0] + " ~ " + this.$route.params.date[1]},
      ],
      date: [],
      keyword: "",
      startDate: "",
      endDate: "",
      excel: excels,
      bigLineChartCategories:[
        "Accounts",
        "Purchases",
        "Sessions"
      ],
      bigLineChart: {
        allData: [
          [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
          [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
          [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130]
        ],
        activeIndex: 0,
        chartData: { datasets: [{ }]},
        extraOptions: chartConfigs.purpleChartOptions,
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.4, 0],
        categories: []
      },
      xList: [],
      yList: [],
      searchDic: {},
      searchType: "",
      showArticle: [],
      showXList: [],
      wordCount: [],
      dicwordCount: {}
    }
  },
  computed:{
    enableRTL() {
      return this.$route.query.enableRTL;
    },
    isRTL(){
      return this.$rtl.isRTL;
    }
  },
  methods:{
    initBigChart(index) {
      let chartData = {
        datasets: [{
          fill: true,
          borderColor: config.colors.primary,
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: config.colors.primary,
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: config.colors.primary,
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: this.bigLineChart.allData[index]
        }],
        labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
      }
      this.$refs.bigChart.updateGradients(chartData);
      this.bigLineChart.chartData = chartData;
      this.bigLineChart.activeIndex = index;
    },
    openNew(sType){
      this.searchType = sType
      console.log(this.date) // 날짜 불러오기
      console.log(this.keyword)
      console.log(this.excel.sheet1.length)

      this.date[0] = this.date[0].replace(/-/g, '.')
      this.date[1] = this.date[1].replace(/-/g, '.')

      var ss_day = new Date(this.date[0]);
      var ee_day = new Date(this.date[1]);
      // console.log(ss_day.getMonth(), ee_day.getMonth())
      while(ss_day.getMonth() <= ee_day.getMonth()){
        var _mon_ = (ss_day.getMonth()+1);
        _mon_ = _mon_ < 10 ? '0'+_mon_ : _mon_;
        var temp
        temp = ss_day.getFullYear() + '.' + _mon_
        console.log(temp)
        // var dic = {}
        // dic[temp] = {}
        // this.showArticle[temp] = {}
        this.showXList.push(temp)
        ss_day.setMonth(ss_day.getMonth() + 1);
      }
      console.log(this.showXList)

      for (var j=0; j < this.showXList.length; j++) {
        // var dic = {}
        this.showArticle.push({})
        this.showArticle[j][this.showXList[j]] = []
        for (var i = 0; i < this.excel.sheet1.length; i++) {
          if (this.excel.sheet1[i].date.substring(0,7) == this.showXList[j] && this.excel.sheet1[i].title.indexOf(this.keyword) != -1) {
            // var imsi = {}
            // imsi[this.excel.sheet1[i].title] = this.excel.sheet1[i].url
            this.showArticle[j][this.showXList[j]].push(this.excel.sheet1[i])
            // this.searchDic[this.excel.sheet1[i].date.substring(0,7)] += 1
          }
        }
      }

      console.log(this.showArticle)

      this.getDateRangeData(this.date[0], this.date[1])

      // console.log(this.excelData)

      var tempWordCount = {}

      if(this.searchType == "daily") {
        for (i = 0; i < this.excel.sheet1.length; i++) {
          if (this.excel.sheet1[i].date >= this.date[0] && this.excel.sheet1[i].date <= this.date[1] && this.excel.sheet1[i].title.indexOf(this.keyword) != -1) {
            this.searchDic[this.excel.sheet1[i].date] += 1

            var splitWord = this.excel.sheet1[i].title.replace(/,/g , " ").replace(/"/g, " ").replace(/”/g, " ").replace(/“/g, " ").replace(/'/g, " ").replace(/’/g, " ").replace(/…/g, " ").replace(/‘/g, " ").split(" ") //.replace(/"/g, " ").replace(/“/g, " ").replace(/.../g, " ").replace(/”/g, " ").replace(/'/g, " ").split(" ")

            for(j = 0; j<splitWord.length; j++)
            {
              if(splitWord[j].length == 0) {
                continue
              }
              if(splitWord[j] in tempWordCount){
                tempWordCount[splitWord[j]] += 1
              }
              else{
                tempWordCount[splitWord[j]] = 1
              }
            }
          }
        }
      }
      else if(this.searchType == "monthly") {
        for (i = 0; i < this.excel.sheet1.length; i++) {
          if (this.excel.sheet1[i].date.substring(0,7) >= this.date[0].substring(0,7) && this.excel.sheet1[i].date.substring(0,7) <= this.date[1].substring(0,7) && this.excel.sheet1[i].title.indexOf(this.keyword) != -1) {
            this.searchDic[this.excel.sheet1[i].date.substring(0,7)] += 1

            splitWord = this.excel.sheet1[i].title.replace(/,/g , " ").replace(/"/g, " ").replace(/”/g, " ").replace(/“/g, " ").replace(/'/g, " ").replace(/’/g, " ").replace(/…/g, " ").replace(/‘/g, " ").split(" ") //.replace(/"/g, " ").replace(/“/g, " ").replace(/.../g, " ").replace(/”/g, " ").replace(/'/g, " ").split(" ")
            for(j = 0; j<splitWord.length; j++)
            {
              if(splitWord[j] in tempWordCount){
                tempWordCount[splitWord[j]] += 1
              }
              else{
                tempWordCount[splitWord[j]] = 1
              }
            }
          }
        }
      }

      var sorted = Object.entries(tempWordCount).sort((a, b) => b[1] - a[1]);
      for(var element of sorted) {
        this.wordCount.push(element[0])
        // console.log(element[0]+ ": " + element[1]);
        this.dicwordCount[element[0]] = element[1]
      }
      console.log(this.dicwordCount)

      for(var key in this.searchDic) {
        this.xList.push(key)
        this.yList.push(this.searchDic[key])
      }
      let chartData = {
        datasets: [{
          label: '선택한 날짜 내에서 검색어에 따른 네이버 기사 개수로 시민들의 관심도 측정 그래프',
          fill: true,
          borderColor: config.colors.primary,
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: config.colors.primary,
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: config.colors.primary,
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: this.yList,
        }],
        labels: this.xList,
      }
      this.$refs.bigChart.updateGradients(chartData);
      this.bigLineChart.chartData = chartData;
      this.bigLineChart.activeIndex = 0;

      this.xList = []
      this.yList = []
      this.searchDic = {}
    },
    movewordCount() {
      this.$router.push({name: 'WordCount', params: {words: this.dicwordCount}})
    },
    getDateRangeData(param1, param2) {  //param1은 시작일, param2는 종료일이다.
      var ss_day = new Date(param1);
      var ee_day = new Date(param2);
      while(ss_day.getTime() <= ee_day.getTime()){
        var _mon_ = (ss_day.getMonth()+1);
        _mon_ = _mon_ < 10 ? '0'+_mon_ : _mon_;
        var _day_ = ss_day.getDate();
        _day_ = _day_ < 10 ? '0'+_day_ : _day_;
        var temp
        if(this.searchType == "daily") {
          temp = ss_day.getFullYear() + '.' + _mon_ + '.' + _day_
        }
        else if(this.searchType == "monthly"){
          temp = ss_day.getFullYear() + '.' + _mon_
        }
        this.searchDic[temp] = 0 // key 추가
        ss_day.setDate(ss_day.getDate() + 1);
      }
    }
  },
  mounted(){
    this.i18n = this.$i18n;
    if (this.enableRTL) {
      this.i18n.locale = 'ar';
      this.$rtl.enableRTL();
    }
    this.openNew('daily')
  },
  created() {
    this.date = this.$route.params.date;
    console.log(this.date)
    this.keyword = this.$route.params.keyword;
    console.log(this.keyword)
    console.log(this.excel.sheet1.length)
  },
  beforeDestroy() {
    if (this.$rtl.isRTL) {
      this.i18n.locale = 'en';
      this.$rtl.disableRTL();
    }
  }
}
</script>
<style>
</style>
