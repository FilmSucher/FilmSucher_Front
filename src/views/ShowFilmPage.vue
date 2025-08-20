<template>
    <div class="film">
        <div class="column poster">
          <img :src="form.bildUrl" :alt="form.title"/>
        </div>
        <div class="column info">
          <h2 class="title">{{ form.title }}</h2>
          <p class="year"><strong>Year:</strong>{{ form.year }}</p>
          <p class="genre"><strong>Genre:</strong> {{ form.genre }}</p>
          <p class="duration"><strong>Duration:</strong>{{ form.duration }}</p>
          <p class="country"><strong>Country:</strong>{{ form.country }}</p>
          <p class="rating">{{ form.rating }}</p>
        </div>
        <div class="desc">
          <p class="description">{{ form.description }}</p>
        </div>
        <div class="actions">
          <template v-if="isAuthenticated">
              <button @click="addFavorite">Add in MyList</button>
              <button @click="delFavorite">Delete from MyList</button>
          </template>
          <template v-if="isAdmin">
              <button @click="editMovie">Edit Film</button>
              <button @click="deleteMovie">Delete Film</button>
          </template>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getRoleFromToken, useAuth } from '@/utils/auth';

export default {
  setup() {
    const token = localStorage.getItem('token');
    const route = useRoute();
    const router = useRouter();
    const { isAuthenticated } = ref(useAuth());
    const isAdmin = ref(getRoleFromToken() === 'ADMIN');
    const form = ref({
        filmId: '',
        title: '',
        year: '',
        genre: '',
        duration: '',
        country: '',
        rating: '',
        description: '',
        bildUrl : '',
    });

    onMounted( async () => {
        try{
            const res = await fetch(`/api/films/films/${route.params.id}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json', 
                Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            
            if (res.ok) {
              Object.assign(form.value, data);
            } else {
              alert(data.message || `Error fetching film: ${res.status}`);
            }
        } catch (e){
             alert("Error loading user: " + e.message);
        }
    });
    
    const editMovie = async () => {
        router.push({ name: 'Edit', params: { id: form.value.filmId } });
    };

    const deleteMovie = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this movie?');
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/films/admin_films/${form.value.filmId}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.ok){
                alert(data.message || 'Film deleted');
            } else {
                alert(data.message || 'Error! Film not deleted!');
            }
        } catch (err) {
            alert('Error deleting film: ' + err.message);
        }
        router.push("/");
    };

    const addFavorite = async () => {
        try {
            const res = await fetch(`/api/films/favorites/${form.value.filmId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message || 'Film added in MyList!');
            } else {
                alert(data.message || 'Error! Film not added!');
            }
        } catch (err) {
            alert('Error adding favorite: '+ err);
        }
    };
    const delFavorite = async() => {
      try {
            const res = await fetch(`/api/favors/${this.filmId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            });
            
            if (res.ok) {
              alert('Film deleted from MyList!');
            } else {
              alert('Error! Film not deleted!');
            }
          } catch (err) {
            console.error('Error:', err);
          }
    };
    
    return {
        form,
        isAdmin,
        isAuthenticated,
        editMovie,
        deleteMovie,
        addFavorite,
        delFavorite
    };
  }
};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: row;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  padding: 15px;
  margin: 20px auto;
  width: 90%;
  max-width: 1000px;
  align-items: flex-start;
  gap: 20px;
}
.column {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.poster img {
  width: 150px;
  border-radius: 6px;
}
.info {
  flex: 1;
}
.desc {
  margin-top: 10px;
  color: #666;
}
.actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
button {
  flex: 1;
  padding: 10px;
  background: #444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background: #666;
}
.message {
  margin-top: 15px;
  font-weight: bold;
  color: #c00;
}
</style>