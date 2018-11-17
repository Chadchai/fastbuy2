const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
// var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'hdzvdkljx', 
    api_key: '245568641867713', 
    api_secret: 'fUEhfjczQdqFYl6TIp_gA_CyY-I' 
  });
  
//For user login
// const jwt = require('jsonwebtoken');


// const {getHomePage} = require('./routes/index');
// const {addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage} = require('./routes/player');
const {getHome,customerSignupPage,addCustomer, customerLogin, customerLoginPage,editCustomerPage,editCustomer,productListPage,getSupplierList, sendMail} = require('./routes/customerlogin');
const {supplierSignupPage,addSupplier , supplierLoginPage,supplierLogin,editSupplierConfigPage,editSupplierPage,editSupplier,editSupplierConfig,supplierSummaryPage} = require('./routes/supplierlogin');

const port = process.env.PORT || 8000;


// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
   host: 'pfw0ltdr46khxib3.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
     user: 'h0fh806wbn807e8o',
     password: 'ghhpbwghaavxilm1',
     database: 'bjmh3rwe5d0ncn4f'
 });

// // connect to database
 db.connect((err) => {
     if (err) {
         throw err;
     }
     console.log('Connected to database');
 });
 global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app

app.get('/', getHome);

// app.get('/add', addPlayerPage);
app.get('/editsupplier/:id', editSupplierPage);
app.get('/editcustomer/:id', editCustomerPage);
app.get('/editsupplierconfig/:id', editSupplierConfigPage);
// app.get('/delete/:id', deletePlayer);
// app.post('/add', addPlayer);
app.get('/getsupplierlist/:business_type/:id', getSupplierList);
app.post('/editsupplier/:id', editSupplier);
app.post('/editcustomer/:id', editCustomer);
app.post('/editsupplierconfig/:id', editSupplierConfig);
app.get('/suppliersignup', supplierSignupPage);
app.get('/customersignup', customerSignupPage);
app.get('/supplierlogin', supplierLoginPage);
// app.get('/supplier', supplierPage);
app.get('/customerlogin', customerLoginPage);
app.post('/addsupplier', addSupplier);
app.post('/addcustomer', addCustomer);
app.post('/supplier', supplierLogin);
app.post('/customer', customerLogin);
app.get('/productlist/:id', productListPage);
app.get('/suppliersummary/:id', supplierSummaryPage);
app.get('/sendmail/:cid/:sid', sendMail);

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});