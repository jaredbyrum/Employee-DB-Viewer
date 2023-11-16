const inquirer = require('inquirer');
require('dotenv').config();
const mysql = require('mysql2');

const user = process.env.DB_USER;
const pw = process.env.DB_PASSWORD;
const name = process.env.DB_NAME;

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: user,
    password: pw,
    database: name
  });

db.connect((err) => {
  if (err) throw err;
  startApp();
});

// first question in app
function startApp() {
  inquirer
    .prompt(
      {
        name: "choice",
        message: "What you you like to do?", 
        type: "list",
        choices: [
          "View All Employees", 
          "View All Roles", 
          "View All Departments", 
          "Add A Department", 
          "Add A Role", 
          "Add An Employee", 
          "Update An Employee's Role",
        ],
      })
      .then(function(answer) {
    switch (answer.choice) {
      case  "View All Employees":
            viewEmployees();
            break;

      case  "View All Roles":
            viewRoles();
            break;

      case  "View All Departments":
            viewDepartments();
            break;

      case  "Add A Department":
            addDepartment();   
            break;
            
      case  "Add A Role":
            addRole();
            break;
            
      case  "Add An Employee":
            addEmployee();
            break;
            
      case  "Update An Employee's Role":
            updateEmployee();  
            break;
    }; 
  });
};

//view all employees
function viewEmployees () {
  let query = "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments on roles.department_id = departments.id LEFT JOIN employees manager on manager.id = employees.manager_id;"
  
  db.query(query, (err, res) => {
    if (err) {
      console.log(err);
    };

    console.table(res)
    startApp();
  })              
}

//view all roles
function viewRoles () {
  db.query('SELECT roles.id, roles.title, roles.salary, departments.name AS department FROM roles JOIN departments on roles.department_id = departments.id', 
  (err, res) => {
    if (err) {
      console.log(err);
    }
    console.table(res);
    startApp();  
  })
}

//view all departments
function viewDepartments () {
  db.query('SELECT * FROM departments', (err, res) => {
    if (err) {
      console.log(err);
    }
    console.table(res);
    startApp();  
  })
}


//add functions
//add department
function addDepartment() {
  inquirer
  .prompt([
    {
      name: "addDepartment",
      message: "Please enter a name for your new department.",
      type: "input",
    }
  ])
  .then(function(answer) {
    db.query('INSERT INTO departments (name) VALUES ( ? )', answer.addDepartment, (err, res) => {
      if (err) {
        console.log(err);
      }
      console.log("New Department added!");
      startApp();
    })                  
  }) 
}

//add role
function addRole() {
  var question = [
    {
      name: "roleDepartment",
      message: "Which department would you like to add a role to? (department_id)",
      type: "input",
    },
    {
      name: "roleTitle",
      message: "Enter the name of the new role.",
      type: "input",
    },
    {
      name: "roleSalary",
      message: "What is the salary for this new role?",
      type: "input",
    }
  ]
   
  inquirer
  .prompt(question).then(function (answers) {              
    db.query(
      'INSERT INTO roles SET ?', 
      { 
        title: answers.roleTitle, 
        salary: answers.roleSalary,
        department_id: answers.roleDepartment,
      },
      (err, res) => {
      if (err) {
        console.log(err);
      }
      console.log("New Role added!");
      startApp();
    })                  
  })
}

//add employee
function addEmployee() {
  var question = [
    {
      name: "employeeFirst",
      message: "Enter the first name of the employee.",
      type: "input",
      },
      {
        name: "employeeLast",
        message: "Enter the last name of the employee.",
        type: "input",
      },
      {
        name: "employeeRole",
        message: "What role does this employee have? (role_id)",
        type: "input", 
      },
      {
        name: "employeeManager",
        message: "Who is their manager? (employee_id)",
        type: "input",
      }
  ]
  inquirer
    .prompt(question).then(function(answer) {
      db.query(
        'INSERT INTO employees SET ?',
        {
          first_name: answer.employeeFirst,
          last_name: answer.employeeLast,
          role_id: answer.employeeRole,
          manager_id: answer.employeeManager,
        },
        (err, res) => {
          if (err) {
            console.log(err)
          }
            console.log("New Employee Created!");
            startApp();
        })
    })
}  




//update employee role
function updateEmployee() {
  inquirer.prompt([
    {
      name: "employee",
      type: "input",
      message: "What employee would you like to update? (employee_id)",
    },
    {
      name: "role",
      type: "input",
      message: "What role would you like to assign them? (role_id)",
    }]
  )
  .then(function(answer) {
    db.query(`UPDATE employees SET role_id = ${answer.role} WHERE employees.id = ${answer.employee}`, (err, res) => {
      if (err){
        console.log(err)
      }
      console.log("Successfully updated this employees role!")
      startApp();
    })
  })
}
