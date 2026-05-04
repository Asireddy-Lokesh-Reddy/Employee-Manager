<template>
  <button
    type="button"
    class="btn btn-outline-danger"
    :disabled="isDeleting"
    @click="confirmDelete"
  >
    {{ isDeleting ? "Deleting" : "Delete" }}
  </button>
</template>

<script>
export default {
  name: "DeleteEmployee",

  props: {
    employee: {
      type: Object,
      required: true,
    },
    isDeleting: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["delete"],

  methods: {
    confirmDelete() {
      const confirmed = window.confirm(
        `Delete employee record for ${this.employee.name}?`
      );

      if (confirmed) {
        this.$emit("delete", this.employee);
      }
    },
  },
};
</script>

