<template>
  <div class="tool-panel p-3 p-md-4">
    <div class="d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center mb-3">
      <div>
        <h2 class="h5 mb-1">Employee Records</h2>
        <p class="text-secondary mb-0">View, edit, and delete employee details.</p>
      </div>
      <button
        type="button"
        class="btn btn-outline-primary"
        :disabled="isLoading"
        @click="$emit('refresh')"
      >
        {{ isLoading ? "Refreshing..." : "Refresh" }}
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading</span>
      </div>
    </div>

    <div v-else-if="employees.length === 0" class="empty-state text-center py-5 px-3">
      No employee records found.
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th scope="col">Employee ID</th>
            <th scope="col">Name</th>
            <th scope="col">Designation</th>
            <th scope="col">Department</th>
            <th scope="col" class="text-end">Salary</th>
            <th scope="col" class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in employees" :key="employee.id">
            <td class="employee-id">{{ employee.employeeId }}</td>
            <td>{{ employee.name }}</td>
            <td>{{ employee.designation }}</td>
            <td>{{ employee.department }}</td>
            <td class="text-end">{{ formatCurrency(employee.salary) }}</td>
            <td class="text-end action-cell">
              <div class="btn-group btn-group-sm" role="group" aria-label="Employee actions">
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  @click="$emit('edit', employee)"
                >
                  Edit
                </button>
                <DeleteEmployee
                  :employee="employee"
                  :is-deleting="deletingEmployeeId === employee.id"
                  @delete="$emit('delete', $event)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import DeleteEmployee from "./DeleteEmployee.vue";

export default {
  name: "ReadEmployees",

  components: {
    DeleteEmployee,
  },

  props: {
    employees: {
      type: Array,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    deletingEmployeeId: {
      type: [String, Number],
      default: null,
    },
  },

  emits: ["refresh", "edit", "delete"],

  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Number(amount) || 0);
    },
  },
};
</script>
