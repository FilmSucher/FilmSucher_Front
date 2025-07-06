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

    <button @click="submit">Save</button>
  </div>
</template>

<script>
import { ref, onMounted} from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const token = localStorage.getItem('token');
    const route = useRoute();
    const isEdit = ref(!!route.params.id);
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

    onMounted( async () => {
        if (isEdit.value) {
            const res = await fetch(`/api/films/${route.params.id}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json', 
                Authorization: `Bearer ${token}` },
            });
            form.value = await res.json();
        }
    });

    const submit = async () => {
        const method = isEdit.value? "PUT" : "POST";
        const url = isEdit.value
                    ? `/api/films/${route.params.id}`
                    : `/api/films`;
        
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', 
                Authorization: `Bearer ${token}` },
            body: JSON.stringify(form.value)
        });

        alert ('Movie saved!');
    };

    return {
        form,
        isEdit,
        submit
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