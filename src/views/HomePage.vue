<template>
  <div class="home">
    <div class="search-box">
        <h1>Film Sucht</h1>
        <input v-model="query" @keyup.enter="search" placeholder="Text für suche" />
        <button @click="search">Such</button>
    </div>
  </div>
</template>

<script>

import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const query = ref('');
    const router = useRouter();
    const route = useRoute();

    const search = () => {
        const trimmed = query.value.trim();
        // if (trimmed.length === 0) return;

        router.push({ name: 'Results', 
                      query: { prompt: trimmed } });
    };

    onMounted(() => {
        const qParam = route.query.prompt;
        if (qParam) {
            query.value = qParam;
            search();
        }
    });

    return {
        query,
        search
    };
  }
};
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60px);
  background-color: #f0f0f0;
}

.search-box {
  text-align: center;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

input {
  padding: 10px;
  width: 250px;
  margin-right: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  padding: 10px 20px;
  background: #444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background: #666;
}
</style>