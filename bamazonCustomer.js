var mysql = require("mysql");
var inquirer = require("inquirer");
var clear = require("clear");

var cats = [];


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  database: 'bamazon'
});

// connection.connect(function (err) {
//   if (err) throw (err);
//   console.log(`connected as id ${connection.threadId}`);
// });
grabCats()


function grabCats() {
  clear();
  var query = "SELECT department_name FROM products GROUP BY department_name HAVING count(*)";
  connection.query(query, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      cats.push(res[i].department_name);
    }
    run();
  });
}

function run() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'pick',
      message: 'Welcome to Bamazon! Please choose a category!',
      choices: cats
    }
  ])
    .then(answer => {
      chosenCat(answer.pick)
    })
}

var catItem = [];
var catCounter = []
var item;

function chosenCat(x) {
  var query = "SELECT * FROM products GROUP BY item_id HAVING ?";
  connection.query(query, { department_name: x }, function (err, res) {
    for (var i = 0; i < res.length; i++) {
      catCounter.push(res[i].item_id);
      catItem.push(
        `Name: ${res[i].product_name} | Price: ${res[i].price} | Quantity: ${res[i].stock_quantity} `)
    }
    inquirer.prompt([
      {
        type: 'list',
        name: 'Item',
        message: 'Choose an Item!',
        choices:
          catItem
      }
    ])
      .then(answer => {
        clear();
        item = catItem.indexOf(answer.Item)
        console.log(answer.Item)
        console.log(answer.Item)
        order();
      })
  });
}

var stock;
var thing;

function order() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'amount',
      message: 'Nice Choice! Enter amount.'
    }
  ])
    .then(answer => {
      var key = catCounter[item];
      var query = "SELECT * FROM products WHERE ?";
      connection.query(query, { item_id: key }, function (err, res) {
        for (var i = 0; i < res.length; i++) {
          stock = res[i].stock_quantity;
          thing = res[i].product_name;
        }
        if (answer.amount > stock) {
          console.log("invalid amount please lower quantity!");
          order();
        } else {
          console.log(`Your order of ${answer.amount} ${thing} has been placed!`)
        }
      });
    })
}



// var query = "SELECT department_name FROM products GROUP BY department_name HAVING count(*)";
// connection.query(query, function (err, res) {
  
// });