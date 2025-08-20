<template>
  <div class="result">
    <div class="search-box">
        <h1>Film Sucht</h1>
        <input v-model="query" @keyup.enter="search" placeholder="query" />
        <button @click="search">Such</button>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="films.length === 0">Kein Results</div>

    <div class="cards">
        <MovieCard 
            v-for="film in films"
            :key="film.id"
            :filmId="film.id"
            :title="film.title"
            :year="film.year"
            :genre="film.genre"
            :description="film.description"
            :rating="film.rating"
            :bildUrl="film.bildUrl"
            :duration="film.duration"
            :country="film.country"
            :is-admin="isAdmin"
            :is-authenticated="isAuthenticated"
            @deleted="refresh"
        />
    </div>
  </div>
</template>

<script>

import MovieCard from '@/components/MovieCard.vue';
import { onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getRoleFromToken, useAuth } from '@/utils/auth';

export default {
    components: {MovieCard},
    setup() {
        // values
        const router = useRouter();
        const route = useRoute();

        const query = ref(route.query.prompt || '');
        const films = ref([]);
        const loading = ref(false);
        const isAuthenticated = ref(useAuth());
        const isAdmin = ref(getRoleFromToken() === 'ADMIN')

        // func for request
        const fetchFilms = async (searchTerm) => {
            if (!searchTerm) return;
            loading.value = true;
            
            try {
                // do request
                const res = await fetch(`/api/films/films?prompt=${encodeURIComponent(searchTerm)}`);

                // get json
                // json is valid?
                let data = {};
                try {
                    data = await res.json();
                } catch (e) {
                    alert('Invalid JSON in response');
                }

                if (res.ok && Array.isArray(data)) {
                    films.value = data;
                } else {
                    films.value = [];
                    alert(data.message || `Search failed with status ${res.status}`);
                }
            } catch (error) {
                films.value = [];
                alert ('Request Error: ' + error.message);
            } finally {
                loading.value = false;
            }
        };

        // read from inputfield
        const search = () => {
            const trimmed = query.value.trim();
            if (trimmed.length === 0) return;

            router.push({ name: 'Results', 
                        query: { prompt: trimmed } });
        };

        const refresh = () => { fetchFilms(query.value); };

        // func for start page
        onMounted(() => {
            if (query.value) {
                fetchFilms(query.value);
            }
        });

        // func watch on URL Change
        watch( () => route.query.prompt, (newPrompt) => {
            query.value = newPrompt || '';
            if (newPrompt) fetchFilms(newPrompt);
        });

        return {
            query,
            search,
            films,
            loading,
            isAdmin,
            isAuthenticated,
            refresh
        };
    }
};
</script>

<style scoped>
.result {
    padding: 20px;
}

.search-box {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
}

.cards {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin: 40px auto;
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