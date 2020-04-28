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
    startF();
});

const startF = () => {
    // prompt for things that user can do 
    inquirer
        .prompt({
            type: "rawlist",
            message: "Hello! What would you like to do?",
            name: "options",
            choices: [
                "View Employees",
                "View Employees By Department",
                "View Employees By Manager",
                "Add Employee",
                "Delete Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "View Roles",
                "Add Role",
                "Delete Role",
                "View Departments",
                "Add Department",
                "Delete Department",
                "View Utilized Budget of Departments",
                "End"
            ]
        })
        .then(function (res) {
           
            switch (res.options) {
                case "View All Employees":
                    viewAll("employee");
                    break;

                case "View Employees By Department":
                    viewByDepartment();
                    break;

                case "View Employees By Manager":
                    viewByManager();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Delete Employee":
                    deleteEmployee();
                    break;

                case "Update Employee Role":
                    updateEmployeeRole();
                    break;

                case "Update Employee Manager":
                    updateEmployeeManager();
                    break;

                case "View All Roles":
                    viewAll("role");
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Delete Role":
                    deleteRole();
                    break;

                case "View All Departments":
                    viewAll("department");
                    break;

                case "Add Department":
                    addDepartment();
                    break;

                case "Delete Department":
                    deleteDepartment();
                    break;

                case "View Utilized Budget of Departments":
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
        connection.query(
            "INSERT INTO department SET ?",{
                department_name: res.departmentName
            },
            function(err,res){
                if (err) throw err;
                console.log("Added!");
                startF();
            }
        );

    });
}

const addRole =  () => {
    connection.query("SELECT * FROM department", function (err, result) {
        if (err) throw err;
        
        inquirer.prompt([{
            name: "roleTitle",
            message: "Please enter the role title: "
        },
        {
            type: "number",
            name: "salary",
            message: "Please enter the salary for this position: "
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
                console.log('Added!');
            startF();
            }
        );
    });
});
};

const addEmployee = () => {
    connection.query("SELECT * FROM employee", function (err, resultE) {
        if (err) throw err;
        connection.query("SELECT * FROM role", function (err, resultR) {
            if (err) throw err;
            
            inquirer .prompt([ {
                name: "firstName",
                message: "What is the employee's first name? "
            },
            {
                name: "lastName",
                message: "What is the employee's last name? "
            },
            {
                type: "list",
                name: "chooseRole",
                message: "What is the employee's role?",
                choices: function () {
                    var choiceRole = [];
                    for (var i = 0; i < resultR.length; i++) {
                        choiceRole.push(resultR[i].title);
                    }
                    return choiceRole;
                },
            },
            {
                type: "list",
                name: "choosemanager",
                message: "Who is the manager of this employee?",
                choices: function () {
                    var choiceManager = [];
                    for (var i = 0; i < resultE.length; i++) {
                        if (resultE[i].manager_or_not == 1) {
                            choiceManager.push(resultE[i].first_name + " " + resultE[i].last_name);
                        }
                    }
                    return choiceManager;
                },
            }
        ])
        .then(res => {
            
            let chosenR;
            for (var i = 0; i < resultR.length; i++) {
                if (resultR[i].title === res.chooseRole) {
                    chosenR = resultR[i];
                }
            };
            
            let nameArr = res.choosemanager.split(" ");
            let chosenM;
            for (var i = 0; i < resultE.length; i++) {
                if (resultE[i].first_name === nameArr[0]) {
                    chosenM = resultE[i];
                }
            };

            
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: res.firstName,
                    last_name: res.lastName,
                    role_id: chosenR.id,
                    manager_id: chosenM.id,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("Added!");
                   
                   startF();
                }
            );
        });

});
});
};

const viewAll = tableName => {
    var query;
    switch (tableName) {
        case "employee":
          
            query = "SELECT employee.id, employee.first_name, employee.last_name,employee.manager_id, department.department_name, role.title, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id"
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.table(res);
             startF();
            });
            break;

            case "role":
                
                query = "SELECT role.id,role.title, department.department_name FROM role JOIN department ON role.department_id = department.id ORDER BY role.id"
                connection.query(query, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                });
                break;
    
            case "department":
               
                connection.query("SELECT * FROM department", (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    startF();
                });
                break;
        }
    };

const updateEmployeeManager = () => {
    connection.query("SELECT * FROM employee WHERE manager_or_not = 1", function (err, resultM){
        if (err) throw err;
        connection.query("SELECT * FROM employee", function (err, resultE) {
            if (err) throw err;


  inquirer.prompt([
                    {
                        type: "list",
                        name: "chooseEmployee",
                        message: "Please choose the employee that needs to be updated?",
                        choices: function () {
                            var choiceEmployee = [];
                            for (var i = 0; i < resultE.length; i++) {
                                choiceEmployee.push(resultE[i].first_name + " " + resultE[i].last_name);
                            }
                            return choiceEmployee;
                        },
                    },
                    {
                        type: "list",
                        name: "chooseManager",
                        message: "Who will be the new manager of this employee?",
                        choices: function () {
                            var choiceManager = [];
                            for (var i = 0; i < resultM.length; i++) {
                                choiceManager.push(resultM[i].first_name + " " + resultM[i].last_name);
                            }
                            return choiceManager;
                        },
                    },
                ])
                .then(res => {
                    
                    let nameE = res.chooseEmployee.split(" ");
                    let chosenE;
                    for (var i = 0; i < resultE.length; i++) {
                        if (resultE[i].first_name === nameE[0]) {
                            chosenE = resultE[i];
                        }
                    };
                    
                    let nameM = res.chooseManager.split(" ");
                    let chosenM;
                    for (var i = 0; i < resultM.length; i++) {
                        if (resultM[i].first_name === nameM[0]) {
                            chosenM = resultM[i];
                        }
                    };
                    
                    connection.query(
                        "UPDATE employee SET ? WHERE ?",
                        [{
                            manager_id: chosenM.id
                        },
                        {
                            id: chosenE.id
                        }],
                        function (err, res) {
                            if (err) throw err;
                            console.log('Successfully added!');
                            startF();
                        }
                    );
                });
        });
    });
};

const updateEmployeeRole = () => {
    connection.query("SELECT * FROM employee", function (err, resultE) {
        if (err) throw err;
        connection.query("SELECT * FROM role", function (err, resultR) {
            if (err) throw err;

            inquirer.prompt([
                    {
                        type: "list",
                        name: "chooseEmployee",
                        message: "Please choose the employee that needs to be updated??",
                        choices: function () {
                            var choiceArray = [];
                            for (var i = 0; i < resultE.length; i++) {
                                choiceArray.push(resultE[i].first_name + " " + resultE[i].last_name);
                            }
                            return choiceArray;
                        },
                    },
                    {
                        type: "list",
                        name: "chooseRole",
                        message: "What whould be his new role?",
                        choices: function () {
                            var choiceArray = [];
                            for (var i = 0; i < resultR.length; i++) {
                                choiceArray.push(resultR[i].title);
                            }
                            return choiceArray;
                        },
                    },
                    {
                        type: "confirm",
                        name: "managerOrNot",
                        message: "Is this person a manager?"
                    },
                ])
                .then(res => {
                    
                    let nameArr = res.chooseEmployee.split(" ");
                    let chosenE;
                    for (var i = 0; i < resultE.length; i++) {
                        if (resultE[i].first_name === nameArr[0]) {
                            chosenE = resultE[i];
                        }
                    };
                    
                    let chosenR;
                    for (var i = 0; i < resultR.length; i++) {
                        if (resultR[i].title === res.chooseRole) {
                            chosenR = resultR[i];
                        }
                    };
                    
                    connection.query(
                        "UPDATE employee SET ? WHERE ? ",
                        [
                            {
                                role_id: chosenR.id,
                                manager_or_not: res.managerOrNot
                            },
                            {
                                id: chosenE.id
                            },
                        ], function (err, res) {
                            if (err) throw err;
                            console.log("\n Updated!");
                            startF();
                        }
                    );
                });
        });
    });

};


const viewByDepartment = () => {
    connection.query("SELECT * FROM department", function (err, resultD) {
        if (err) throw err;
        inquirer.prompt(
                {
                    type: "list",
                    name: "chooseDepartment",
                    message: "Which department would you like to choose?",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < resultD.length; i++) {
                            choiceArray.push(resultD[i].department_name);
                        }
                        return choiceArray;
                    },
                })
            .then(res => {
                getAndRenderByD(res);
            });
    });
};

const getAndRenderByD = inquirerRes => {
    connection.query("SELECT * FROM department", function (err, resultD) {
        if (err) throw err;
       
        var chosen;
        for (var i = 0; i < resultD.length; i++) {
            if (resultD[i].department_name === inquirerRes.chooseDepartment) {
                chosen = resultD[i];
            }
        }
        
        connection.query(
            "SELECT employee.id, employee.first_name, employee.last_name,department.department_name, role.title, role.salary FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.id = ?",
            [chosen.id], function (err, res) {
                if (err) throw err;
                console.table(res);
               startF();
            });
    });
};

const viewByManager =() => {
    connection.query("SELECT * FROM employee WHERE manager_or_not = 1", function (err, resultM) {
        if (err) throw err;
        inquirer
            .prompt(
                {
                    type: "list",
                    name: "chooseManager",
                    message: "Choose one manager: ",
                    choices: function () {
                        var choiceManager = [];
                        for (var i = 0; i < resultM.length; i++) {
                            choiceManager.push(resultM[i].first_name + " " + resultM[i].last_name);
                        }
                        return choiceManager;
                    },
                },
            )
            .then(res => {
                getAndRenderByManager(res);
            });
    });
};

const getAndRenderByManager = inquirerRes => {
    connection.query("SELECT * FROM employee WHERE manager_or_not = 1", function (err, resultM) {
        if (err) throw err;

        let nameM = inquirerRes.chooseManager.split(" ");
        let chosenM;
        for (var i = 0; i < resultM.length; i++) {
            if (resultM[i].first_name === nameM[0]) {
                chosenM = resultM[i];
            }
        };
        connection.query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id WHERE manager_id = ?",
            [chosenM.id], function (err, res) {
                if (err) throw err;
                console.table(res);
                startF();
            });
    });
}

const deleteDepartment = () => {
    connection.query("SELECT * FROM department", function (err, resultD) {
        if (err) throw err;
        inquirer.prompt(
             {
                    type: "list",
                    name: "chooseDepartment",
                    message: "Which department would you like to delete?",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < resultD.length; i++) {
                            choiceArray.push(resultD[i].department_name);
                        }
                        return choiceArray;
                    },
                }
            ).then(res => {
                connection.query("DELETE FROM department WHERE department_name = ?", [res.chooseDepartment], (err, res) => {
                    if (err) throw err;
                    console.log("Deleted!!");
                    startF();
                });
            });
    });
}

const deleteRole = () => {
    connection.query("SELECT * FROM role", function (err, resultR) {
        if (err) throw err;
        inquirer.prompt(
                {
                    type: "list",
                    name: "chooseRole",
                    message: "What is the employee's role?",
                    choices: function () {
                        var choiceRole = [];
                        for (var i = 0; i < resultR.length; i++) {
                            choiceRole.push(resultR[i].title);
                        }
                        return choiceRole;
                    },
                })
            .then(res => {
                connection.query(
                    "DELETE FROM role WHERE title = ?", [res.chooseRole], function (err, res) {
                        if (err) throw err;
                        console.log('Deleted!!');
                        startF();
                    });
            });
    });
}

const deleteEmployee = () => {
    connection.query("SELECT * FROM employee", function (err, resultE) {
        if (err) throw err;
        inquirer.prompt(
                {
                    type: "list",
                    name: "chooseEmployee",
                    message: "Which empolyee would you like to choose?",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < resultE.length; i++) {
                            choiceArray.push(resultE[i].first_name + " " + resultE[i].last_name);
                        }
                        return choiceArray;
                    },
                })
            .then(res => {
                let nameArr = res.chooseEmployee.split(" ");
                let chosenE;
                for (var i = 0; i < resultE.length; i++) {
                    if (resultE[i].first_name === nameArr[0]) {
                        chosenE = resultE[i];
                    }
                };
                connection.query(
                    "DELETE FROM employee WHERE id =? ", [chosenE.id], function (err, res) {
                        if (err) throw err;
                        console.log('Deleted!!');
                        startF();
                    });
            });
    });
}

const utilizedBudget = () => {
    connection.query("SELECT * FROM department", function (err, resultD) {
        if (err) throw err;
        inquirer.prompt({
                type: "list",
                name: "chooseDepartment",
                message: "Which department would you like to view?",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < resultD.length; i++) {
                        choiceArray.push(resultD[i].department_name);
                    }
                    return choiceArray;
                },
            })
            .then(res => {
                var chosenD;
                for (var i = 0; i < resultD.length; i++) {
                    if (resultD[i].department_name === res.chooseDepartment) {
                        chosenD = resultD[i];
                    }
                };
                connection.query(
                    "SELECT SUM(salary) FROM role WHERE department_id = ?",
                    [chosenD.id], function (err, res) {
                        if (err) throw err;
                        console.log(`The total utilized budget of ${chosenD.department_name} department: $${res[0]['SUM(salary)']}`);
                startF();
                    }
                );

            });
    });
};
