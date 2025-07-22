<template>
  <div class="userList">
    <div class="add_button">
        <h1>Add new User</h1>
        <button @click="addUser">Add User</button>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="films.length === 0">Kein Results</div>

    <div class="users">
        <UserCard 
            v-for="user in users"
            :id="user.id"
            :username="user.username"
            :role="user.role"
        />
    </div>
  </div>
</template>

<script>

import UserCard from '@/components/UserCard.vue';
import { onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
    components: {UserCard},
    setup() {
        // values
        const router = useRouter();
        const route = useRoute();

        const users = ref([]);
        const loading = ref(false);

        // func for request
        const fetchFilms = async (searchTerm) => {
            if (!searchTerm) return;
            loading.value = true;
            
            try {
                // do request
                const res = await fetch('/api/users');
                // get json
                // json is valid?
                let data = {};
                try {
                data = await res.json();
                } catch (e) {
                console.warn('Invalid JSON in response');
                }

                if (res.ok && Array.isArray(data)) {
                    users.value = data;
                } else {
                    users.value = [];
                    alert(data.message || `Fetching failed with status ${res.status}`);
                }
            } catch (error) {
                alert('Request Error:', error);
                users.value = [];
            } finally {
                loading.value = false;
            }
        };

        const refresh = () => { fetchFilms(query.value); };

        // func for start page
        onMounted(() => {
            if (query.value) {
                fetchFilms(query.value);
            }
        });


        return {
            query,
            search,
            films,
            loading,
            isAdmin
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