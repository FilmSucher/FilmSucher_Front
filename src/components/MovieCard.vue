<template>
    <div class="card">
        <div class="column poster">
            <router-link :to="`/film/${this.filmId}`">
                <img :src="bildUrl" :alt="title"/>
            </router-link>
        </div>
        <div class="column info">
            <router-link :to="`/film/${this.filmId}`">
                <h2 class="title">{{ title }}</h2>
            </router-link>
            <p class="year"><strong>Year:</strong>{{ year }}</p>
            <p class="genre"><strong>Genre:</strong> {{ genre }}</p>
            <p class="duration"><strong>Duration:</strong>{{ duration }}</p>
            <p class="country"><strong>Country:</strong>{{ country }}</p>
            <p class="description">{{ description }}</p>
            
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
        <div class="column rating">
            <p class="rating-value">{{ rating }}</p>
        </div>
    </div>
</template>

<script>
import router from '@/router';

export default{
    props: {
        filmId: {
            type: Number,
            required: true
        },
        bildUrl: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        year: {
            type: String,
            required: true
        },
        genre: {
            type: String,
            required: false
        },
        description: {
            type: String,
            required: false
        },
        rating: {
            type: [Number, String],
            required: false
        },
        duration: {
            type: Number,
            required: false
        },
        country: {
            type: String,
            required: false
        },
        isAuthenticated: {
            type: Boolean,
            default: false
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        async addFavorite() {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`/api/films/favorites/${this.filmId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });
                
                // debuging 
                const data = await res.json();

                if (res.ok) {
                    alert(data.message || 'Film added in MyList!');
                } else {
                    alert(data.message || 'Error! Film not added!');
                }
            } catch (err) {
                alert('Error adding favorite: '+ err);
            }
        },
        async delFavorite() {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`/api/films/favorites/${this.filmId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    alert(data.message || 'Film deleted from MyList!');
                } else {
                    alert(data.message || 'Error! Film not deleted!');
                }
            } catch (err) {
                alert('Error delete favorite: '+ err);
            }
        },
        async editMovie() {
            router.push({ name: 'Edit', params: { id: this.filmId } });
        },
        async deleteMovie() {
            const confirmed = window.confirm('Are you sure you want to delete this movie?');
            if (!confirmed) return;
            
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`/api/films/admin_films/${this.filmId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.ok){
                    alert(data.message || 'Film deleted');
                    this.$emit('deleted');
                } else {
                    alert(data.message || 'Error! Film not deleted!');
                }
            } catch (err) {
                console.error('Error:', err);
            }
        }
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

.title {
  margin: 0;
  font-size: 1.5rem;
}

.description {
  margin-top: 10px;
  color: #666;
}

.rating {
  justify-content: center;
  align-items: center;
  width: 100px;
  text-align: center;
}

.rating-value {
  font-size: 2rem;
  font-weight: bold;
  color: #444;
}

.actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  padding: 6px 10px;
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