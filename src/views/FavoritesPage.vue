<template>
  <div class="favors">
    <h1>MyList</h1>

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
            @deleted="refresh"
            />
    </div>
  </div>
</template>

<script>
import MovieCard from '@/components/MovieCard.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getRoleFromToken } from '@/utils/auth';


export default {
    components: {MovieCard},
    setup() {
        // values
        const router = useRouter();
        const films = ref([]);
        const loading = ref(false);

        const token = localStorage.getItem('token')   
        const isAdmin = ref(getRoleFromToken() === 'ADMIN')     

        // func for request
        const fetchFavors = async () => {
            if (!token) {
                router.push('/login');
                return;
            }
            loading.value = true;
            
            try {
                // do request
                const res = await fetch('/api/films/favorites', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 
                Authorization: `Bearer ${token}`},
                })
                // get json
                const data = await res.json();

                if (res.ok && Array.isArray(data)) {
                    films.value = data;
                } else {
                    films.value = [];
                    alert(data.message || 'Error! Favorites not fetched!');
                }
            } catch (error) {
                alert ('Request Error: ' + error.message);
                films.value = [];
            } finally {
                loading.value = false;
            }
        };

        const refresh = () => { fetchFavors(); };

        // func for start page
        onMounted(fetchFavors);

        return {
            films,
            loading,
            isAdmin,
            refresh
        };
    }
};
</script>

<style scoped>
.favors {
    padding: 20px;
}
.cards {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin: 40px auto;
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