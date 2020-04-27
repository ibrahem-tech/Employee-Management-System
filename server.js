const inquirer = require("inquirer");
const mysql = require("mysql");


let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "yourRootPassword",
    database: "company_db"
});

connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id:" + connection.threadId)
    startF()
});

const startF = () => {
    inquirer.prompt({
        type: "rawlist",
        choises: [
            "Add department",
            "Add Role",
            "Add Employee",
            "View Departments",
            "view roles",
            "view Employees",
            "Update employee manager",
            "Update Employee Role",
            "View Employees By Department",
            "View Employees By Manager",
            "Delete department",
            "Delete Role",
            "Delete Employee",
            "View the total utilized budget of a department",
            "Exit",
        ]
    }).then(function(res){
        switch(res.options){
            case "Add department":
                addDepartment();
                break;
                
                case "Add Role":
                    addRole();
                    break;

                    case "Add Employee":
                    addEmployee();
                    break;

                    case "View Departments":
                        viewAll("department");
                    break;

                    case "view roles":
                        viewAll("role");
                    break;
                    
                    case "view Employees":
                        viewAll("employee");
                    break;

                    case  "Update employee manager":
                        updateEmployeeManager();
                    break;

                    case "Update Employee Role":
                        updateEmployeeRole();
                    break;

                    case "View Employees By Department":
                        viewByDepartment();
                        break;

                case  "View Employees By Manager":
                    viewByManager();
                    break;

                    case  "Delete department":
                        deleteDepartment();
                    break;

                    case "Delete Role":
                        deleteRole();
                    break;

                    case "Delete Employee":
                        deleteEmployee();
                        break;

                    case  "View the total utilized budget of a department":
                        utilizedBudget();
                        break;

                        default:
                            connection.end();
                            break;
                       
    
        }
    });
};

const addDepartment = () => {
    inquirer.prompt({
        name: "departmentName",
        message: "Please enter department name"
    }).then(res => {
        connection.query{
            "INSERT INTO department SET ?",{
                department_name: res.departmentName
            },
            function(err,res){
                if (err) throw err;
                console.log("Added!");
                startF();
            }
        };

    });
}

const addRole =  () => {
    connection.query("SELECT * FROM department", function (err, result) {
        if (err) throw err;
        
        inquirer.prompt([{
            name: "roleTitle",
            message: "Enter the role title: "
        },
        {
            type: "number",
            name: "salary",
            message: "Enter the salary for this position: "
        },
        {
            type: "list",
            name: "chooseDepartment",
            message: "Which department is this position in?",
            choices: function () {
                var choiceArray = [];
                for (var i = 0; i < result.length; i++) {
                    choiceArray.push(result[i].department_name);
                }
                return choiceArray;
            },
        }
    ])
    .then(res => {
       
        let chosenD;
        for (var i = 0; i < result.length; i++) {
            if (result[i].department_name === res.chooseDepartment) {
                chosenD = result[i];
            }
        }
        
        connection.query(
            "INSERT INTO role SET ?",
            {
                title: res.roleTitle,
                salary: res.salary,
                department_id: chosenD.id
            },
            function (err, res) {
                if (err) throw err;
                console.log('Successfully added!');
                console.log("--------------------------------------------------------------------------");
                startSystem();
            }
        );
    });
});
};