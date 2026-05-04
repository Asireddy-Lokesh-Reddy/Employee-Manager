<template>
  <div class="app-shell">
    <header class="top-band py-4 py-md-5">
      <div class="container">
        <div class="d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-lg-end">
          <div>
            <p class="text-uppercase fw-bold mb-2 small text-success-emphasis bg-success-subtle d-inline-block px-3 py-1 rounded-pill">
              WP Assignment 2
            </p>
            <h1 class="page-title mb-2">Employee Management System</h1>
            <p class="page-subtitle mb-0">
              Vue.js application using separate CRUD components, Axios, MockAPI integration, and Bootstrap styling.
            </p>
          </div>
          <span class="badge api-badge rounded-pill px-3 py-2 align-self-start align-self-lg-end">
            {{ apiModeLabel }}
          </span>
        </div>
      </div>
    </header>

    <main class="container py-4 py-md-5">
      <section class="row g-3 mb-4">
        <div class="col-12 col-md-4">
          <div class="metric-panel p-3 h-100">
            <div class="metric-label">Total Employees</div>
            <div class="metric-value">{{ employeeCount }}</div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="metric-panel p-3 h-100">
            <div class="metric-label">Departments</div>
            <div class="metric-value">{{ departmentCount }}</div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="metric-panel p-3 h-100">
            <div class="metric-label">Monthly Payroll</div>
            <div class="metric-value">{{ formatCurrency(monthlyPayroll) }}</div>
          </div>
        </div>
      </section>

      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="alert alert-success" role="status">
        {{ successMessage }}
      </div>

      <section class="row g-4 align-items-start">
        <div class="col-12 col-lg-4">
          <UpdateEmployee
            v-if="selectedEmployee"
            :employee="selectedEmployee"
            :departments="departments"
            :is-saving="isSaving"
            @update="updateEmployee"
            @cancel="cancelUpdate"
          />
          <CreateEmployee
            v-else
            ref="createEmployeeForm"
            :departments="departments"
            :is-saving="isSaving"
            @create="createEmployee"
          />
        </div>

        <div class="col-12 col-lg-8">
          <ReadEmployees
            :employees="sortedEmployees"
            :is-loading="isLoading"
            :deleting-employee-id="isDeleting"
            @refresh="loadEmployees"
            @edit="startUpdate"
            @delete="deleteEmployee"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import CreateEmployee from "./components/CreateEmployee.vue";
import ReadEmployees from "./components/ReadEmployees.vue";
import UpdateEmployee from "./components/UpdateEmployee.vue";
import { employeeApi } from "./services/employeeService";

export default {
  name: "App",

  components: {
    CreateEmployee,
    ReadEmployees,
    UpdateEmployee,
  },

  data() {
    return {
      employees: [],
      departments: [
        "Engineering",
        "Human Resources",
        "Finance",
        "Marketing",
        "Sales",
        "Operations",
      ],
      editingId: null,
      isLoading: false,
      isSaving: false,
      isDeleting: null,
      errorMessage: "",
      successMessage: "",
    };
  },

  computed: {
    apiModeLabel() {
      return employeeApi.isUsingLocalStorage ? "Local demo mode" : "MockAPI connected";
    },

    selectedEmployee() {
      return this.employees.find((employee) => employee.id === this.editingId) || null;
    },

    sortedEmployees() {
      return [...this.employees].sort((firstEmployee, secondEmployee) =>
        firstEmployee.employeeId.localeCompare(secondEmployee.employeeId)
      );
    },

    employeeCount() {
      return this.employees.length;
    },

    departmentCount() {
      return new Set(this.employees.map((employee) => employee.department)).size;
    },

    monthlyPayroll() {
      return this.employees.reduce(
        (total, employee) => total + Number(employee.salary || 0),
        0
      );
    },
  },

  mounted() {
    this.loadEmployees();
  },

  methods: {
    async loadEmployees() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        this.employees = await employeeApi.getEmployees();
      } catch (error) {
        this.errorMessage = this.readableError(error, "Unable to load employee records.");
      } finally {
        this.isLoading = false;
      }
    },

    async createEmployee(employeeData) {
      this.errorMessage = "";
      this.successMessage = "";

      if (!this.isEmployeeValid(employeeData)) {
        return;
      }

      if (this.hasDuplicateEmployeeId(employeeData.employeeId)) {
        this.errorMessage = "Employee ID already exists.";
        return;
      }

      this.isSaving = true;

      try {
        const createdEmployee = await employeeApi.createEmployee(employeeData);
        this.employees = [createdEmployee, ...this.employees];
        this.successMessage = "Employee record added successfully.";

        if (this.$refs.createEmployeeForm) {
          this.$refs.createEmployeeForm.resetForm();
        }
      } catch (error) {
        this.errorMessage = this.readableError(error, "Unable to save employee record.");
      } finally {
        this.isSaving = false;
      }
    },

    startUpdate(employee) {
      this.errorMessage = "";
      this.successMessage = "";
      this.editingId = employee.id;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    async updateEmployee({ id, data }) {
      this.errorMessage = "";
      this.successMessage = "";

      if (!this.isEmployeeValid(data)) {
        return;
      }

      if (this.hasDuplicateEmployeeId(data.employeeId, id)) {
        this.errorMessage = "Employee ID already exists.";
        return;
      }

      this.isSaving = true;

      try {
        const updatedEmployee = await employeeApi.updateEmployee(id, data);
        this.employees = this.employees.map((employee) =>
          employee.id === id ? updatedEmployee : employee
        );
        this.successMessage = "Employee record updated successfully.";
        this.cancelUpdate();
      } catch (error) {
        this.errorMessage = this.readableError(error, "Unable to save employee record.");
      } finally {
        this.isSaving = false;
      }
    },

    async deleteEmployee(employee) {
      this.errorMessage = "";
      this.successMessage = "";
      this.isDeleting = employee.id;

      try {
        await employeeApi.deleteEmployee(employee.id);
        this.employees = this.employees.filter(
          (currentEmployee) => currentEmployee.id !== employee.id
        );

        if (this.editingId === employee.id) {
          this.cancelUpdate();
        }

        this.successMessage = "Employee record deleted successfully.";
      } catch (error) {
        this.errorMessage = this.readableError(error, "Unable to delete employee record.");
      } finally {
        this.isDeleting = null;
      }
    },

    cancelUpdate() {
      this.editingId = null;
    },

    hasDuplicateEmployeeId(employeeId, currentEmployeeId = null) {
      return this.employees.some(
        (employee) =>
          employee.employeeId.toLowerCase() === employeeId.toLowerCase() &&
          employee.id !== currentEmployeeId
      );
    },

    isEmployeeValid(employee) {
      if (
        !employee.employeeId ||
        !employee.name ||
        !employee.designation ||
        !employee.department
      ) {
        this.errorMessage = "Please fill all employee fields.";
        return false;
      }

      if (!Number(employee.salary) || Number(employee.salary) <= 0) {
        this.errorMessage = "Salary must be greater than zero.";
        return false;
      }

      return true;
    },

    readableError(error, fallbackMessage) {
      if (error.response && error.response.data && error.response.data.message) {
        return error.response.data.message;
      }

      if (error.message) {
        return `${fallbackMessage} ${error.message}`;
      }

      return fallbackMessage;
    },

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

