const fs = require('fs');
var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'hdzvdkljx', 
    api_key: '245568641867713', 
    api_secret: 'fUEhfjczQdqFYl6TIp_gA_CyY-I' 
  });

module.exports = {
    getHome: (req, res) => {
        res.render('home.ejs', {
            title: "Welcome to Socka | Add a new player"
            ,message: ''
        });
    },
    customerSignupPage: (req, res) => {
        res.render('customerSignup.ejs', {
            title: "Welcome to Socka | Add a new player"
            ,message: ''
        });
    },

    addCustomer:(req, res) =>  {
        let today = new Date();
        let customer_name = req.body.customer_name;
        let customer_info = req.body.customer_info;
        let email = req.body.email;
        let password = req.body.password;
      
        let emailQuery = "SELECT * FROM `customers` WHERE email = '" + email + "'";

        db.query(emailQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
          
            } else {
                let query = "INSERT INTO `customers` (customer_name,customer_info, email, password) VALUES ('" +
                customer_name + "', '" + customer_info + "', '" + email + "', '" + password +  "')";
            db.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/');
            });

            }

});
    },
    customerLogin: (req, res) =>  {
        var email= req.body.email;
        var password = req.body.password;
        let user_status = "";
        db.query('SELECT * FROM customers WHERE email = ?',[email], function (error, results, fields) {
        if (error) {
          // console.log("error ocurred",error);
          res.send({
            "code":400,
            "failed":"error ocurred"
          })
        } else{
          // console.log('The solution is: ', results);
          if(results.length >0){
            if(results[0].password == password){
                //console.log(results[0]);
                res.render('productList.ejs', {
                    title: "Welcome to Socka | View Players"
                    ,customer: results[0], user_status: "loggined"
                });
                //   res.redirect('/supplier');
                  
            }
            else{
              res.send({
                "code":204,
                "success":"Email and password does not match"
                  });
            }
          }
          else{
            res.send({
              "code":204,
              "success":"Email does not exits"
                });
          }
        }
        });
    },
    customerLoginPage: (req, res) => {
        res.render('CustomerLogin.ejs', {
            title: "Welcome to Socka | Add a new player"
            ,message: ''
        });
    },
    editCustomerPage: (req, res) => {
        let customerId = req.params.id;
        let query = "SELECT * FROM `customers` WHERE customer_id = '" + customerId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('editcustomer.ejs', {
                title: "Edit  Customer"
                ,customer: result[0]
                ,message: '',user_status:"loggined"
            });
        });
    },
    editCustomer: (req, res) => {
        let customerId = req.params.id;
        let customerName = req.body.customer_name;
        let customerInfo = req.body.customer_info;
        let address = req.body.address;
        let website = req.body.website;
        let regCap = req.body.reg_cap;
      
        let buyerEmail = req.body.buyer_email;
        let foundYear = req.body.found_year;
       
if (typeof req.files.image !== "undefined"){
    let uploadedFile = req.files.image;
    let image_name = uploadedFile.name;
    // let fileExtension = uploadedFile.mimetype.split('/')[1];
    let image_name1 = uploadedFile.name.split('.')[0];
    // let colinary_url = 'https://api.cloudinary.com/v1_1/hdzvdkljx/upload';
    // var cloudinary_upload_preset ='pqoenb7k';
    
    //image_name = customerName + '.' + fileExtension;
    let filename = 'company_logo/' + image_name1
    console.log(filename);
        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
            // upload the file to the /public/assets/img directory
               uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                if (err) {
                     return res.status(500).send(err);
                 }
                
             });
            cloudinary.v2.uploader.upload(`public/assets/img/${image_name}`, {public_id: filename } ,
  function(error, result) {console.log(result, error)});
          
            let query = "UPDATE `customers` SET `customer_name` = '" + customerName + "', `customer_info` = '" + customerInfo  + "', `address` = '" + address + "', `website` = '" + website + "', `photo` = '" + image_name + "', `reg_cap` = '" + regCap +"', `found_year` = '" + foundYear + "', `buyer_email` = '" + buyerEmail + "' WHERE `customer_id` = '" + customerId + "'";
            
            
            db.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                let query1 = "SELECT * FROM `customers` WHERE customer_id = '" + customerId + "' ";
        db.query(query1, (err, result1) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('customerPage.ejs', {
                title: "Welcome to Socka | View Players"
                , customer: result1[0], user_status: "loggined",
            });
        });
               
            });
        } else {
            message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
            // res.render('add-player.ejs', {
            //     message,
            //     title: "Welcome to Socka | Add a new player"
            // });
        }
    } 
    
    else {
        let query = "UPDATE `customers` SET `customer_name` = '" + customerName + "', `customer_info` = '" + customerInfo + "', `address` = '" + address + "', `website` = '" + website + "', `reg_cap` = '" + regCap + "', `found_year` = '" + foundYear + "', `buyer_email` = '" + buyerEmail + "' WHERE `customer_id` = '" + customerId + "'";
        //console.log(query);
        
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
        });
        let query1 = "SELECT * FROM `customers` WHERE customer_id = '" + customerId + "' ";
        db.query(query1, (err, result1) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('customerPage.ejs', {
                title: "Welcome to Socka | View Players"
                , customer: result1[0], user_status: "loggined",
            });
        });
    }


    
    },
    
    productListPage: (req, res) => {
        let customerId = req.params.id;
        let query = "SELECT * FROM `customers` WHERE customer_id = '" + customerId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('productList.ejs', {
                title: "Edit  Customer"
                ,customer: result[0]
                ,message: '',user_status:"loggined"
            });
        });
             
    },
    getSupplierList: (req, res) => {
       
        let businessType = req.params.business_type;
        let customerId = req.params.id;
        let query = "SELECT * FROM `suppliers` WHERE business_type = '" + businessType + " ' ORDER BY supplier_id ASC"; // query database to get all the players
        let query1 = "SELECT * FROM `customers` WHERE customer_id = '" + customerId + "'" // query database to get all the players

         //console.log(query1);
        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
           
            db.query(query1, (err, result1) => {
                if (err) {
                    res.redirect('/');
                }

            res.render('supplierList.ejs', {
                title: "Welcome to Socka | View Players"
                ,suppliers: result,customer: result1[0],user_status:"loggined",businessType:businessType
            });
            //console.log(result1);
        });
    });
    },
    sendMail: (req, res) => {
    let customerId = req.params.cid;
    let supplierId = req.params.sid;
    let query = "SELECT * FROM `customers` WHERE customer_id = '" + customerId + "' ";
    let query1 = "SELECT * FROM `suppliers` WHERE supplier_id = '" + supplierId + "' ";
    db.query(query, (err, result) => {
        if (err) {
            res.redirect('/');
        }
    
       
        db.query(query1, (err, result1) => {
            if (err) {
                res.redirect('/');
            }
        
            let query2 = "INSERT INTO `rfq` (customer_id, customer_name,supplier_id, supplier_name) VALUES ('" +
            result[0].customer_id + "', '" + result[0].customer_name + "', '" + result1[0].supplier_id + "', '" + result1[0].supplier_name +  "')";
            
            db.query(query2, (err, result2) => {
                if (err) {
                    res.redirect('/');
                }
                console.log(result2.insertId);
                // let query3 = "SELECT COUNT(rfq_id) AS numberofid FROM RFQ;";
                // db.query(query3, (err, result3) => {
                //     if (err) {
                //         res.redirect('/');
                //     }
               
        
    //         var supplierEmail = result1[0].email;
    //     var subject ="RFQ# " +  result2.insertId +" from " + result[0].customer_name;
    //    // +  result2[0].rfq_id +
    //     var emailBody =  "";;
    //     // var attach = 'path';
    //     var mail = "mailto:"+supplierEmail+"?subject="+subject+"&body="+encodeURIComponent(emailBody);
    //     res.redirect(mail);
    });
    });
    });

    }
    
};
    