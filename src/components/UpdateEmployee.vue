<template>
  <div class="tool-panel p-3 p-md-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2 class="h5 mb-0">Update Employee</h2>
      <button type="button" class="btn btn-sm btn-outline-secondary" @click="$emit('cancel')">
        Cancel
      </button>
    </div>

    <form @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="updateEmployeeId" class="form-label">Employee ID</label>
        <input
          id="updateEmployeeId"
          v-model.trim="form.employeeId"
          type="text"
          class="form-control"
          required
        >
      </div>

      <div class="mb-3">
        <label for="updateEmployeeName" class="form-label">Name</label>
        <input
          id="updateEmployeeName"
          v-model.trim="form.name"
          type="text"
          class="form-control"
          required
        >
      </div>

      <div class="mb-3">
        <label for="updateDesignation" class="form-label">Designation</label>
        <input
          id="updateDesignation"
          v-model.trim="form.designation"
          type="text"
          class="form-control"
          required
        >
      </div>

      <div class="mb-3">
        <label for="updateDepartment" class="form-label">Department</label>
        <select
          id="updateDepartment"
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
        <label for="updateSalary" class="form-label">Salary</label>
        <input
          id="updateSalary"
          v-model.number="form.salary"
          type="number"
          class="form-control"
          min="1"
          step="1"
          required
        >
      </div>

      <button type="submit" class="btn btn-primary w-100" :disabled="isSaving">
        {{ isSaving ? "Saving..." : "Update Employee" }}
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
  name: "UpdateEmployee",

  props: {
    employee: {
      type: Object,
      required: true,
    },
    departments: {
      type: Array,
      required: true,
    },
    isSaving: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update", "cancel"],

  data() {
    return {
      form: blankForm(),
    };
  },

  watch: {
    employee: {
      immediate: true,
      handler(employee) {
        this.form = {
          employeeId: employee.employeeId,
          name: employee.name,
          designation: employee.designation,
          department: employee.department,
          salary: employee.salary,
        };
      },
    },
  },

  methods: {
    submitForm() {
      this.$emit("update", {
        id: this.employee.id,
        data: { ...this.form },
      });
    },
  },
};
</script>

