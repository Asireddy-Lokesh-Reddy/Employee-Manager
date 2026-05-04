# Employee Management System

Vue.js assignment project for employee CRUD operations using Axios, MockAPI, and Bootstrap CDN.

## Assignment Features

- Add employee records
- View employees in a responsive Bootstrap table
- Update existing employee records
- Delete employee records
- Fields: Employee ID, Name, Designation, Department, Salary
- Axios service connected to MockAPI CRUD calls
- Local demo mode is still available if the placeholder endpoint is restored

## CRUD Components

- `src/components/CreateEmployee.vue` handles create form UI.
- `src/components/ReadEmployees.vue` handles read/list table UI.
- `src/components/UpdateEmployee.vue` handles update form UI.
- `src/components/DeleteEmployee.vue` handles delete confirmation and delete action button.

## MockAPI Setup

1. Create a MockAPI project at `https://mockapi.io`.
2. Create a resource named `employees`.
3. Add these fields:
   - `empid`
   - `name`
   - `designation`
   - `department`
   - `salary`
4. The project is already configured to use this endpoint:

```env
VUE_APP_API_URL=https://69eedcf59163f839f892eecd.mockapi.io/api/employees
```

5. To use a different MockAPI project, copy `.env.example` to `.env.local` and replace `VUE_APP_API_URL`.

Example:

```env
VUE_APP_API_URL=https://your-project-id.mockapi.io/api/employees
```

## Project Commands

```bash
npm install
npm run dev
```

The app uses the configured MockAPI endpoint by default.

## GitHub Pages Deployment

The repository includes `.github/workflows/deploy.yml`.

1. Push changes to the `main` branch.
2. Open the repository on GitHub.
3. Go to `Settings` > `Pages`.
4. Set `Source` to `GitHub Actions`.
5. Wait for the `Deploy to GitHub Pages` action to finish.

The default GitHub Pages URL will be:

```text
https://asireddy-lokesh-reddy.github.io/Employee-Manager/
```

The repository also includes `public/CNAME` for this custom domain:

```text
employee-management-system.com
```
