import axios from "axios";

const apiUrl = (
  process.env.VUE_APP_API_URL ||
  "https://69eedcf59163f839f892eecd.mockapi.io/api/employees"
).trim();

const storageKey = "employee-management-system-records";
const isConfiguredApi =
  apiUrl.startsWith("http") && !apiUrl.includes("YOUR_MOCKAPI_PROJECT");

const starterEmployees = [
  {
    id: "local-1",
    employeeId: "EMP001",
    name: "Aarav Sharma",
    designation: "Frontend Developer",
    department: "Engineering",
    salary: 55000,
  },
  {
    id: "local-2",
    employeeId: "EMP002",
    name: "Meera Rao",
    designation: "HR Executive",
    department: "Human Resources",
    salary: 42000,
  },
  {
    id: "local-3",
    employeeId: "EMP003",
    name: "Kiran Reddy",
    designation: "Accountant",
    department: "Finance",
    salary: 47000,
  },
];

const delay = () => new Promise((resolve) => setTimeout(resolve, 150));

function normalizeEmployee(employee) {
  return {
    id: employee.id,
    employeeId: employee.empid || employee.employeeId || "",
    name: employee.name || "",
    designation: employee.designation || "",
    department: employee.department || "",
    salary: Number(employee.salary) || 0,
  };
}

function buildPayload(employee) {
  return {
    empid: String(employee.employeeId).trim(),
    name: String(employee.name).trim(),
    designation: String(employee.designation).trim(),
    department: String(employee.department).trim(),
    salary: Number(employee.salary),
  };
}

function readLocalEmployees() {
  const savedEmployees = window.localStorage.getItem(storageKey);

  if (!savedEmployees) {
    window.localStorage.setItem(storageKey, JSON.stringify(starterEmployees));
    return starterEmployees;
  }

  try {
    return JSON.parse(savedEmployees).map(normalizeEmployee);
  } catch {
    window.localStorage.setItem(storageKey, JSON.stringify(starterEmployees));
    return starterEmployees;
  }
}

function writeLocalEmployees(employees) {
  window.localStorage.setItem(storageKey, JSON.stringify(employees));
}

export const employeeApi = {
  endpoint: apiUrl,
  isUsingLocalStorage: !isConfiguredApi,

  async getEmployees() {
    if (!isConfiguredApi) {
      await delay();
      return readLocalEmployees();
    }

    const response = await axios.get(apiUrl);
    return response.data.map(normalizeEmployee);
  },

  async createEmployee(employee) {
    const payload = buildPayload(employee);

    if (!isConfiguredApi) {
      await delay();
      const employees = readLocalEmployees();
      const createdEmployee = normalizeEmployee({
        id: `local-${Date.now()}`,
        ...payload,
      });

      writeLocalEmployees([createdEmployee, ...employees]);
      return createdEmployee;
    }

    const response = await axios.post(apiUrl, payload);
    return normalizeEmployee(response.data);
  },

  async updateEmployee(id, employee) {
    const payload = buildPayload(employee);

    if (!isConfiguredApi) {
      await delay();
      const employees = readLocalEmployees();
      const normalizedPayload = normalizeEmployee({ id, ...payload });
      const updatedEmployees = employees.map((currentEmployee) =>
        currentEmployee.id === id ? { ...currentEmployee, ...normalizedPayload } : currentEmployee
      );

      writeLocalEmployees(updatedEmployees);
      return normalizedPayload;
    }

    const response = await axios.put(`${apiUrl}/${id}`, payload);
    return normalizeEmployee(response.data);
  },

  async deleteEmployee(id) {
    if (!isConfiguredApi) {
      await delay();
      const employees = readLocalEmployees().filter(
        (employee) => employee.id !== id
      );

      writeLocalEmployees(employees);
      return;
    }

    await axios.delete(`${apiUrl}/${id}`);
  },
};
