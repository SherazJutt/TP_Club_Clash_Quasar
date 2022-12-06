<template>
  <div id="app">
    <ul>
      <div>{{ myArray }}</div>
      <li v-for="(item, index) in myArray" :key="index">
        {{ item }}
        <button @click="deleteItem(index)">Delete</button>
      </li>
    </ul>
    <div>
      Remove Object from Array
      <div>{{ students }}</div>
      <ul>
        <li v-for="student in students" :key="student.id">
          <span>Name: {{ student.name }}</span> | subject: {{ student.sub }}
          <button @click="deleteObj(student.id)">Delete</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      myArray: ["tiger", "cat", "dog", "crow"],
      students: [
        {
          id: 1,
          name: "Jake",
          sub: "English",
        },
        {
          id: 2,
          name: "Jimmy",
          sub: "Science",
        },
        {
          id: 3,
          name: "Tom",
          sub: "Math",
        },
      ],
    };
  },
  methods: {
    deleteItem(index) {
      this.myArray.splice(index, 1);
    },
    deleteObj(id) {
      let updateStudentList = this.students.filter((el) => el.id !== id);
      this.students = updateStudentList;
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

li {
  padding-bottom: 10px;
}
</style>
