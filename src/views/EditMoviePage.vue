<template>
  <div class="form">
    <h2>{{ isEdit ? "Edit Film" : "Add New Film"}}</h2>
    <input v-model="form.title" placeholder="Titel" />
    <input v-model="form.year" placeholder="Year" />
    <input v-model="form.genre" placeholder="Ganre" />
    <input v-model="form.duration" placeholder="Duration" />
    <input v-model="form.country" placeholder="Country" />
    <textarea v-model="form.description" placeholder="Description"></textarea>
    <input v-model="form.rating" placeholder="Rating" />
    <input v-model="form.image" placeholder="Image URL" />
    <button @click="loadImage">Load Image</button>

    <div v-if="imagePreview">
      <p>Bild preview:</p>
      <img :src="imagePreview" alt="Preview" style="max-width: 100%; max-height: 300px;" />
    </div>
    <div v-if="imageError" class="message">
      {{ imageError }}
    </div>

    <button @click="submit">Save</button>
    <button v-if="isEdit" @click="deleteMovie">Delete</button>
  </div>
</template>

<script>
import { ref, onMounted} from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  setup() {
    const token = localStorage.getItem('token');
    const route = useRoute();
    const router = useRouter();
    const isEdit = ref(route.params.id !== undefined);
    const form = ref({
        title: '',
        year: '',
        genre: '',
        duration: '',
        country: '',
        description: '',
        rating: '',
        image: ''
        });

      const imagePreview = ref('');
      const imageError = ref('');

    onMounted( async () => {
        if (isEdit.value) {
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
                alert(data.message || 'Error! Film not found!');
            }
          } catch (e){
             alert("Error loading film: " + e.message);
          }
        }
    });

    // save button
    const submit = async () => {
        const confirmed = window.confirm('Are you sure?');
        if (!confirmed) return;
      
        if (!form.value.title.trim()) {
          alert("Title is required");
          return;
        }
        if (isNaN(Number(form.value.year)) || Number(form.value.year) < 1888) {
          alert("Enter a valid year");
          return;
        }
        if (!form.value.genre.trim()) {
          alert("Genre is required");
          return;
        }
        if (isNaN(Number(form.value.duration)) || Number(form.value.duration) < 0) {
          alert("Enter a valid duration");
          return;
        }
        if (!form.value.country.trim()) {
          alert("Country is required");
          return;
        }
        if (!form.value.description.trim()) {
          alert("Description is required");
          return;
        }
        if (isNaN(Number(form.value.rating)) || Number(form.value.rating) < 0 || Number(form.value.rating) > 10) {
          alert("Enter a valid rating");
          return;
        }

        const method = isEdit.value? "PUT" : "POST";
        const url = isEdit.value
                    ? `/api/films/admin_films/${route.params.id}`
                    : `/api/films/admin_films`;
        const body = {
          ...form.value,
          year: Number(form.value.year),
          duration: Number(form.value.duration),
          rating: Number(form.value.rating)
        };
        
        try{
          const res = await fetch(url, {
              method,
              headers: { 'Content-Type': 'application/json', 
                  Authorization: `Bearer ${token}` },
              body: JSON.stringify(body)
          });
  
          const data = await res.json();
  
          if (res.ok) {
              alert(data.message || 'Film saved!');
              router.push("/");
          } else {
              alert(data.message || 'Error! Film not saved!');
          }
        } catch (err){
            alert("Error saved film: " + err.message);
        }
    };

    const deleteMovie = async() => {
      const confirmed = window.confirm('Are you sure you want to delete this movie?');
      if (!confirmed) return;
            
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`/api/films/${this.filmId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          alert('Film deleted');
          this.$emit('deleted');
        } else {
          alert('Error! Film not deleted!');
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    //preview image 
    const loadImage = async () => {
      const url = form.value.image.trim();

      imagePreview.value = '';
      imageError.value = '';

      if (!url.startsWith('http')) {
        imageError.value = 'Wrong URL. Usually start with http/https';
        return;
      }

      try {
        const res = await fetch(url, { method: 'HEAD' });

        const contentType = res.headers.get('Content-Type') || '';
        if (!res.ok || !contentType.startsWith('image/')) {
          imageError.value = 'URL is not found!';
          return;
        }

        imagePreview.value = url;
      } catch (e) {
        imageError.value = 'Image loading Error: ' + e.message;
      }
    };

    return {
        form,
        loadImage,
        imagePreview,
        imageError,
        isEdit,
        submit,
        deleteMovie
    };
  }
};
</script>

<style scoped>
.form {
  max-width: 400px;
  margin: 80px auto;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

input {
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ccc;
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