const inquirer = require("inquirer");
const { removeEmployee } = require("./db");
const db = require("./db");
require("console.table");

console.log(`╔═════════════════════════════════════════════════════╗
║                                                     ║
║     _____                 _                         ║
║    | ____|_ __ ___  _ __ | | ___  _   _  ___  ___   ║
║    |  _| | '_ \` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\  ║
║    | |___| | | | | | |_) | | (_) | |_| |  __/  __/  ║
║    |_____|_| |_| |_| .__/|_|\\___/ \\__, |\\___|\\___|  ║
║                    |_|            |___/             ║
║                                                     ║
║     __  __                                          ║
║    |  \\/  | __ _ _ __   __ _  __ _  ___ _ __        ║
║    | |\\/| |/ _\` | '_ \\ / _\` |/ _\` |\/ _ \\ '__|       ║
║    | |  | | (_| | | | | (_| | (_| |  __/ |          ║
║    |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|          ║
║                              |___/                  ║
║                                                     ║
\╚═════════════════════════════════════════════════════╝
`);

function crossroads() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What would you like to do?',
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "Add Role",
        "Remove Role",

        "End"]
    }
  ]).then(res => {
    switch (res.choice) {
      case 'View All Employees':
        return viewAllEmployees()
      case 'View All Employees By Department':
        return viewAllEmployeesByDepartment()
      case 'View All Employees by Manager':
        return viewAllEmployeesByManager()
      case 'Add Employee':
        return addEmployee()
      case 'Remove Employee':
        return removeEmployee()
      case 'Update Employee Role':
        return updateEmployeeRole()
      case 'Update Employee Manager':
        return updateEmployeeManager()
      case 'Add Role':
        return addRole()
      case 'Remove Role':
        return removeRole()
      case 'View All Departments':
        return viewAllDepartments()
      case 'Add Department':
        return addDepartment()
      case 'Remove Department':
        return removeDepartment()
    }
  })
}

async function viewAllEmployees() {
      const employees = await db.findAllEmployees();

      console.log("\n");
      console.table(employees);

      crossroads();
    }

async function viewAllEmployeesByDepartment() {
      const departments = await db.findAllDepartments();

      const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
      }));

      const { departmentId } = await prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Which department would you like to see employees for?",
          choices: departmentChoices
        }
      ]);

      const employees = await db.findAllEmployeesByDepartment(departmentId);

      console.log("\n");
      console.table(employees);

      crossroads();
    }

async function viewAllEmployeesByManager() {
      const managers = await db.findAllEmployees();

      const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      const { managerId } = await prompt([
        {
          type: "list",
          name: "managerId",
          message: "Which employee do you want to see direct reports for?",
          choices: managerChoices
        }
      ]);

      const employees = await db.findAllEmployeesByManager(managerId);

      console.log("\n");

      if (employees.length === 0) {
        console.log("The selected employee has no direct reports");
      } else {
        console.table(employees);
      }

      crossroads();
    }

async function addEmployee() {
      const employees = await db.findAllEmployees();

      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      const { employeeId } = await prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee do you want to remove?",
          choices: employeeChoices
        }
      ]);

      await db.db(employeeId);

      console.log("Removed employee from the database");

      crossroads();
    }

async function updateEmployeeRole() {
      const employees = await db.findAllEmployees();

      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      const { employeeId } = await prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee's role do you want to update?",
          choices: employeeChoices
        }
      ]);

      const roles = await db.findAllRoles();

      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
      }));

      const { roleId } = await prompt([
        {
          type: "list",
          name: "roleId",
          message: "Which role do you want to assign the selected employee?",
          choices: roleChoices
        }
      ]);

      await db.updateEmployeeRole(employeeId, roleId);

      console.log("Updated employee's role");

      crossroads();
    }

async function updateEmployeeManager() {
      const employees = await db.findAllEmployees();

      const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      const { employeeId } = await prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee's manager do you want to update?",
          choices: employeeChoices
        }
      ]);

      const managers = await db.findAllPossibleManagers(employeeId);

      const managerChoices = managers.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));

      const { managerId } = await prompt([
        {
          type: "list",
          name: "managerId",
          message:
            "Which employee do you want to set as manager for the selected employee?",
          choices: managerChoices
        }
      ]);

      await db.updateEmployeeManager(employeeId, managerId);

      console.log("Updated employee's manager");

      crossroads();
    }

async function viewRoles() {
      const roles = await db.findAllRoles();

      console.log("\n");
      console.table(roles);

      crossroads();
    }

async function addRole() {
      const departments = await db.findAllDepartments();

      const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
      }));

      const role = await prompt([
        {
          name: "title",
          message: "What is the name of the role?"
        },
        {
          name: "salary",
          message: "What is the salary of the role?"
        },
        {
          type: "list",
          name: "department_id",
          message: "Which department does the role belong to?",
          choices: departmentChoices
        }
      ]);

      await db.createRole(role);

      console.log(`Added ${role.title} to the database`);

      crossroads();
    }

async function removeRole() {
      const roles = await db.findAllRoles();

      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
      }));

      const { roleId } = await prompt([
        {
          type: "list",
          name: "roleId",
          message:
            "Which role do you want to remove? (Warning: This will also remove employees)",
          choices: roleChoices
        }
      ]);

      await db.removeRole(roleId);

      console.log("Removed role from the database");

      crossroads();
    }

async function viewAllDepartments() {
      const departments = await db.findAllDepartments();

      console.log("\n");
      console.table(departments);

      crossroads();
    }

async function addDepartment() {
      const department = await prompt([
        {
          name: "name",
          message: "What is the name of the department?"
        }
      ]);

      await db.createDepartment(department);

      console.log(`Added ${department.name} to the database`);

      crossroads();
    }

async function removeDepartment() {
      const departments = await db.findAllDepartments();

      const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
      }));

      const { departmentId } = await prompt({
        type: "list",
        name: "departmentId",
        message:
          "Which department would you like to remove? (Warning: This will also remove associated roles and employees)",
        choices: departmentChoices
      });

      await db.removeDepartment(departmentId);

      console.log(`Removed department from the database`);

      crossroads();
    }

async function addEmployee() {
      const roles = await db.findAllRoles();
      const employees = await db.findAllEmployees();

      const employee = await prompt([
        {
          name: "first_name",
          message: "What is the employee's first name?"
        },
        {
          name: "last_name",
          message: "What is the employee's last name?"
        }
      ]);

      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
      }));

      const { roleId } = await prompt({
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices
      });

      employee.role_id = roleId;

      const managerChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
      }));
      managerChoices.unshift({ name: "None", value: null });

      const { managerId } = await prompt({
        type: "list",
        name: "managerId",
        message: "Who is the employee's manager?",
        choices: managerChoices
      });

      employee.manager_id = managerId;

      await db.createEmployee(employee);

      console.log(
        `Added ${employee.first_name} ${employee.last_name} to the database`
      );

      crossroads();
    }

function end() {
      console.log("See U next Time!");
      process.exit();
    }
crossroads();