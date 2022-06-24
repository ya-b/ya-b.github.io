# 首页

## 正则校验
输入字符串:

<input class="input reg-input" v-model="regExample" type="text" placeholder="e.g http://ya-b.github.io"/>

输入正则表达式:

<input class="input reg-input" v-model="regInput" type="text" placeholder="e.g [http|https]://([0-9a-z\-]*\.){1,2}[a-z\-]{2,3}$"/>

<div class="help">校验结果：{{regResult}}</div>

<script setup>
import { ref, computed } from 'vue'
const regExample = ref('')
const regInput = ref('')
const regResult = computed(() => {
  try {
    return new RegExp(regInput.value).test(regExample.value)
  } catch (error) {
    return false
  }
})
console.log(regResult.value)
</script>

<style>
input{
    outline-style: none ;
    border: .066rem solid #ccc;
    border-radius: .2rem;
    padding: .8rem 1rem;
    width: 41rem;
    font-size: 1.2rem;
}

.help {
  font-size: 1.5rem;
  margin-top: 1rem;
}

</style>