<template>
  <div class="tool-panel p-3 p-md-4">
    <h2 class="h5 mb-3">Add Employee</h2>

    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="createEmployeeId" class="form-label">Employee ID</label>
        <input
          id="createEmployeeId"
          v-model.trim="form.employeeId"
          type="text"
          class="form-control"
          placeholder="EMP004"
          required
        >
      </div>

      <div class="mb-3">
        <label for="createEmployeeName" class="form-label">Name</label>
        <input
          id="createEmployeeName"
          v-model.trim="form.name"
          type="text"
          class="form-control"
          placeholder="Employee name"
          required
        >
      </div>

      <div class="mb-3">
        <label for="createDesignation" class="form-label">Designation</label>
        <input
          id="createDesignation"
          v-model.trim="form.designation"
          type="text"
          class="form-control"
          placeholder="Software Engineer"
          required
        >
      </div>

      <div class="mb-3">
        <label for="createDepartment" class="form-label">Department</label>
        <select
          id="createDepartment"
          v-model="form.department"
          class="form-select"
          required
        >
          <option value="" disabled>Select department</option>
          <option v-for="department in departments" :key="department">
            {{ department }}
          </option>
        </select>
      </div>

      <div class="mb-4">
        <label for="createSalary" class="form-label">Salary</label>
        <input
          id="createSalary"
          v-model.number="form.salary"
          type="number"
          class="form-control"
          min="1"
          step="1"
          placeholder="50000"
          required
        >
      </div>

      <button type="submit" class="btn btn-primary w-100" :disabled="isSaving">
        {{ isSaving ? "Saving..." : "Add Employee" }}
      </button>
    </form>
  </div>
</template>

<script>
const blankForm = () => ({
  employeeId: "",
  name: "",
  designation: "",
  department: "",
  salary: "",
});

export default {
  name: "CreateEmployee",

  props: {
    departments: {
      type: Array,
      required: true,
    },
    isSaving: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["create"],

  data() {
    return {
      form: blankForm(),
    };
  },

  methods: {
    submitForm() {
      this.$emit("create", { ...this.form });
    },

    resetForm() {
      this.form = blankForm();
    },
  },
};
</script>
