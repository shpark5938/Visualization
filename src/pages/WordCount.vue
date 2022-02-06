<template>
<v-simple-table>
<template v-slot:default>
  <thead>
  <tr>
    <th class="text-left">
      언급 순위
    </th>
    <th class="text-left">
      단어
    </th>
    <th class="text-left">
      반복 횟수
    </th>
  </tr>
  </thead>
  <tbody>
  <tr
      v-for="(value, key, index) in dicwordCount"
      :key="index"
  >
    <td class="text-left">{{ index + 1 }}</td>
    <td class="text-left">{{ key }}</td>
    <td class="text-left">{{ value }}</td>
  </tr>
  </tbody>
</template>
</v-simple-table>
</template>

<script>
export default {
  name: 'WordCount',
  data () {
    return{
      dicwordCount: {}
    }
  },
  mounted() {
    this.dicwordCount = this.$route.params.words;
  }
}
</script>
