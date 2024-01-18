const mysql = require("mysql")
const inquirer = require("inquirer")
require ("console.table")
const db = mysql.createConnection({
    host: "localHost", 
    user: "root",
    password: "Chingchong@1369",
    port: 3306,
    database: "employeeTracker_db"

})

db.connect (()=>{
    menu()
})

function menu (){
    inquirer.prompt([{
        type: "list",
        message: "What do you want to do?",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"],
        name: "menu",
    }])
    .then (data => {
        if (data.menu === "View all departments") {
            viewDepartments()
        }
        if (data.menu === "View all roles") {
            viewRoles()
        }
        if (data.menu === "View all employees") {
            viewEmployees()
        }
        if (data.menu === "Add a department") {
            addDepartment()
        }
        if (data.menu === "Add a role") {
            addRole()
        }
        if (data.menu === "Add an employee") {
            addEmployee()
        }
        if (data.menu === "Update an employee role") {
            updateEmployee()
        }
    })
    
}

function viewDepartments () {
    db.query("select * from department", (err,data)=> {
        console.table(data)
        menu()
    })
}

function viewRoles () {
    db.query("select * from role", (err,data)=> {
        console.table(data)
        menu()
    })
}

function viewEmployees () {
    db.query("select * from employee", (err,data)=> {
        console.table(data)
        menu()
    })
}

function addDepartment () {
    inquirer.prompt([{
        type:"input",
        message: "What is the new department name?",
        name: "newDepartment"
    }])
    .then(response => {
        db.query(`INSERT INTO department (name) 
        VALUES ("${response.newDepartment}")`, (err,data)=> {
            viewDepartments()
        })
    })
    
}

function addRole () {
    inquirer.prompt([
        {
            type:"input",
            message: "What is the title of the new role?", 
            name: "newRole"
        },
        {
            type:"input",
            message: "What is the salary of the new role?", 
            name: "newRoleSalary"  
        },
        {
            type:"input",
            message: "Which department does the new role belong to?", 
            name: "newRoleDepartment"
        }
    ])
    .then(response => {
        db.query(`INSERT INTO role (title, salary, department_id) 
        VALUES (? , ? , ?)`,[response.newRole, response.newRoleSalary, response.newRoleDepartment], (err,data)=> {
            viewRoles()
        })
    })
}

function addEmployee () {
    inquirer.prompt([
        {
            type:"input",
            message: "What is the new employee's first name?", 
            name: "newEmployeeFN"
        },
        {
            type:"input",
            message: "What is the new employee's last name?", 
            name: "newEmployeeLN"  
        },
        {
            type:"input",
            message: "What is the role of the new employee?", 
            name: "newEmployeeRole"
        },
        {
            type:"input",
            message: "Who is the new employee's manager?", 
            name: "newEmployeeManager"
        }
    ])
    .then(response => {
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
        VALUES (? , ? , ? , ?)`,[response.newEmployeeFN, response.newEmployeeLN, response.newEmployeeRole, response.newEmployeeManager], (err,data)=> {
            viewEmployees()
        })
    })
}

function updateEmployee () {
    inquirer.prompt([
        {
            type:"input",
            message: "What is id of the employee who's role you would like to update?", 
            name: "employeeRoleUpdate"
        },
        {
            type:"input",
            message: "What is the id of the role you would like to asign them?", 
            name: "updatedRole"  
        },
    ])
    .then(response => {
        console.log(response)
        const empRoleId = parseInt(response.employeeRoleUpdate);
        const empId = parseInt(response.updatedRole);
        console.log(empRoleId)
        console.log(empId)
        // db.query(`UPDATE employee SET role_id = ? WHERE id = ?`,[empRoleId, empId], (err,data)=> {
        //     if(err) console.log('errorr')
        //     console.log(data)
        //     viewEmployees()
        // })

        db.query('update employee set role_id = ? where id = ?', [empRoleId, empId], (err, data) => {
            if(err) console.log('errorr')
            console.log(data)
            viewEmployees()
        })
    })
}