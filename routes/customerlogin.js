const fs = require('fs');
var cloudinary = require('cloudinary');
const querystring = require('querystring');  
var pendingRFQ;
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
                let cust_id = results[0].customer_id;
                let query1 = "SELECT rfq_id FROM `rfq` WHERE customer_id = '" + cust_id + "' AND rfq_status IS NULL";
                db.query(query1, (err, result1) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    pendingRFQ = result1.length;
                //console.log(results[0]);
                res.render('productList.ejs', {
                    title: "Welcome to Socka | View Players"
                    ,customer: results[0], user_status: "loggined",count:pendingRFQ
                });
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
    // customerPage : (req, res) =>  {
    //     let customerId = req.params.id;
    //     let query1 = "SELECT * FROM `customers` WHERE customer_id = '" + customerId + "' ";
    //     db.query(query1, (err, result1) => {
    //         if (err) {
    //             return res.status(500).send(err);
    //         }
    //         res.render('customerPage.ejs', {
    //             title: "Welcome to Socka | View Players"
    //             , customer: result1[0], user_status: "loggined",
    //         });
    //     });
    // },
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
                ,message: '',user_status:"loggined",count:pendingRFQ
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
    //console.log(filename);
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
                , customer: result1[0], user_status: "loggined",count:pendingRFQ
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
                , customer: result1[0], user_status: "loggined",count:pendingRFQ
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
                ,message: '',user_status:"loggined",count:pendingRFQ
            });
        });
             
    },
    customerInbox: (req, res) => {

        let customerId = req.params.cid;
        let rfqstatus = req.params.rfqstatus;
        let pageNo = req.params.pageno;
        let maxPage;
        let query = "SELECT rfq_id,customer_id FROM `rfq` WHERE customer_id = '" + customerId + "' AND rfq_status IS NULL  ORDER BY rfq_date DESC"; // query database to get all the players
        let query1 = "SELECT rfq_id,supplier_name,topic,message,rfq_status,DATE_FORMAT(rfq_date,'%a %e %b %Y') AS rfq_date1 FROM `rfq` WHERE customer_id = '" + customerId + "' AND rfq_status IS NULL ORDER BY rfq_date DESC LIMIT " + (pageNo-1)*10 + ", 10"; // query database to get all the players
        if (pageNo === "") {
            pageNo= 1;
        }
        // console.log(query);
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            if (result.length != ""){
                pendingRFQ = result.length;
           maxPage = Math.ceil(result.length/10);
        } else {
            maxPage = 0;
        }
        db.query(query1, (err, result1) => {
            if (err) {
                res.redirect('/');
            }
            
        res.render('customerInbox.ejs', {
            title: "Pending RFQ"
            ,message: 'pending', user_status:"loggined",rfqlists:result1,customer_id:customerId,maxPage:maxPage,pageNo:pageNo,count:pendingRFQ
        });
    });
});
    },
    customerSubmit: (req, res) => {

        let customerId = req.params.cid;
     
        let pageNo = req.params.pageno;
        let maxPage;
        let query = "SELECT rfq_id,customer_id FROM `rfq` WHERE customer_id = '" + customerId + "' AND rfq_status IS NOT NULL  ORDER BY rfq_date DESC"; // query database to get all the players
        let query1 = "SELECT rfq_id,supplier_name,topic,message,rfq_status,DATE_FORMAT(update_date,'%a %e %b %Y') AS rfq_date1 FROM `rfq` WHERE customer_id = '" + customerId + "' AND rfq_status IS NOT NULL ORDER BY update_date DESC LIMIT " + (pageNo-1)*10 + ", 10"; // query database to get all the players
        if (pageNo === "") {
            pageNo= 1;
        }
        // console.log(query);
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            if (result.length != ""){
              pendingRFQ = result.length;
           maxPage = Math.ceil(result.length/10);
        } else {
            maxPage = 0;
        }
        db.query(query1, (err, result1) => {
            if (err) {
                res.redirect('/');
            }
            
        res.render('customerInbox.ejs', {
            title: "RFQ History"
            ,message: '', user_status:"loggined",rfqlists:result1,customer_id:customerId,maxPage:maxPage,pageNo:pageNo,count:pendingRFQ
        });
    });
});
    },
    getSupplierList: (req, res) => {
       
        let businessType = req.params.business_type;
        let customerId = req.params.id;
        
        let query = "SELECT * FROM `suppliers` WHERE business_type = '" + businessType + " ' ORDER BY supplier_id ASC"; // query database to get all the players
        let query1 = "SELECT * FROM `customers` WHERE customer_id = '" + customerId + "'" // query database to get all the players
        let query2 = "SELECT supplier_id FROM `avl` WHERE customer_id = '" + customerId + "'";
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
                db.query(query2, (err, result2) => {
                    if (err) {
                        res.redirect('/');
                    }
                    var avl_no = [];    
                    for (var i = 0; i < result2.length; i++) {
                        if (result2[i] !== ""){
                           
                            avl_no.push(result2[i].supplier_id);
                        }
                       
                        // 
                    }
                
                    //console.log(avl_no);
                
let search ="";

            res.render('supplierList.ejs', {
                title: "Welcome to Socka | View Players"
                ,suppliers: result,customer: result1[0],user_status:"loggined",businessType:businessType,search:search,checked:false,avls:avl_no,count:pendingRFQ
           
            });
        });       
               
    });
});

    },
    getSearchList: (req, res) => {
       
        let businessType = req.params.business_type;
        let customerId = req.params.id;
        let search = req.params.search;
        let query2 = "SELECT supplier_id FROM `avl` WHERE customer_id = '" + customerId + "'";
        
        // console.log(search);
    
              query = "SELECT * FROM `suppliers` WHERE business_type = '" + businessType + "' AND (supplier_name LIKE '%" + search + "%' OR supplier_info LIKE '%" + search + "%' OR product_info LIKE '%" + search + "%' OR address LIKE '%" + search + "% ') ORDER BY supplier_id ASC"; // query database to get all the players
       
         let query1 = "SELECT * FROM `customers` WHERE customer_id = '" + customerId + "'" // query database to get all the players

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
           
            db.query(query1, (err, result1) => {
                if (err) {
                    res.redirect('/');
                }
                db.query(query2, (err, result2) => {
                    if (err) {
                        res.redirect('/');
                    }
                    var avl_no = [];    
                    for (var i = 0; i < result2.length; i++) {
                        if (result2[i] !== ""){
                           
                            avl_no.push(result2[i].supplier_id);
                        }
                        //console.log(avl_no);
                        // 
                    }
            res.render('supplierList.ejs', {
                title: "Welcome to Socka | View Players"
                ,suppliers: result,customer: result1[0],user_status:"loggined",businessType:businessType,search:search,checked:false,avls:avl_no,count:pendingRFQ
            });
            
        });
    });
});
    },
    getAVL: (req, res) => {
       
        let businessType = req.params.business_type;
        let customerId = req.params.id;
        let query = "SELECT avl.supplier_id, suppliers.supplier_name, suppliers.supplier_info, suppliers.product_info, suppliers.address, suppliers.sale_email, suppliers.Photo FROM avl" 
        + " INNER JOIN suppliers ON avl.supplier_id=suppliers.supplier_id" +
        " WHERE suppliers.business_type = '" + businessType + "' AND customer_id = '" + customerId + "'";
        let query1 = "SELECT * FROM `customers` WHERE customer_id = '" + customerId + "'" // query database to get all the players
        let query2 = "SELECT supplier_id FROM `avl` WHERE customer_id = '" + customerId + "'";
       
          //console.log(query);
        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
           
            db.query(query1, (err, result1) => {
                if (err) {
                    res.redirect('/');
                }
                db.query(query2, (err, result2) => {
                    if (err) {
                        res.redirect('/');
                    }
                    var avl_no = [];    
                    for (var i = 0; i < result2.length; i++) {
                        if (result2[i] !== ""){
                           
                            avl_no.push(result2[i].supplier_id);
                        }
                        //console.log(avl_no);
                        // 
                    }


                let search ="";
            res.render('supplierList.ejs', {
                title: "Welcome to Socka | View Players"
                ,suppliers: result,customer: result1[0],user_status:"loggined",businessType:businessType,search:search,checked:true,avls:avl_no,count:pendingRFQ
            });
           // console.log(result);
        });
    });
});
    },
    getSearchAVL: (req, res) => {
       
        let businessType = req.params.business_type;
        let customerId = req.params.id;
        let search = req.params.search;
        let query = "SELECT avl.supplier_id, suppliers.supplier_name, suppliers.supplier_info, suppliers.product_info, suppliers.address, suppliers.sale_email, suppliers.Photo FROM avl" 
        + " INNER JOIN suppliers ON avl.supplier_id=suppliers.supplier_id" +
        " WHERE suppliers.business_type = '" + businessType + "' AND (suppliers.supplier_name LIKE '%" + search + "%' OR suppliers.supplier_info LIKE '%" + search + "%' OR suppliers.product_info LIKE '%" + search + "%' OR suppliers.address LIKE '%" + search + "% ') ORDER BY avl.supplier_id ASC"; ;
        let query1 = "SELECT * FROM `customers` WHERE customer_id = '" + customerId + "'" // query database to get all the players
        let query2 = "SELECT supplier_id FROM `avl` WHERE customer_id = '" + customerId + "'";
     
        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
           
            db.query(query1, (err, result1) => {
                if (err) {
                    res.redirect('/');
                }
                
                db.query(query2, (err, result2) => {
                    if (err) {
                        res.redirect('/');
                    }
                    var avl_no = [];    
                    for (var i = 0; i < result2.length; i++) {
                        if (result2[i] !== ""){
                           
                            avl_no.push(result2[i].supplier_id);
                        }
                        //console.log(avl_no);
                        // 
                    }
               
            res.render('supplierList.ejs', {
                title: "Welcome to Socka | View Players"
                ,suppliers: result,customer: result1[0],user_status:"loggined",businessType:businessType,search:search,checked:true,avls:avl_no,count:pendingRFQ
            });
            //console.log(result1);
        });
    });
    });
    },
    saveAVL: (req, res) => {
       
        let customer_id = req.body.customerid;
        let supplier_id = req.body.supplierid;
        let avl_number = req.body.supplierno;
        let contact_no = req.body.contactNo;
        let contact_email = req.body.contactEmail;

      
        // let query1 = "SELECT * FROM `suppliers` WHERE supplier_id = '" + supplier_id + "'";

        // db.query(query1, (err, result) => {
        //     if (err) {
        //         return res.status(500).send(err);
        //     } 
        let query1 = "SELECT * FROM avl WHERE customer_id = '" + customer_id + "' AND supplier_id = '" + supplier_id + "'";
                let query2 = "INSERT INTO `avl` (customer_id,supplier_id,avl_no,contact_number,contact_email) VALUES ('" +
                customer_id + "', '" + supplier_id + "', '" + avl_number + "', '" + contact_no + "', '" + contact_email+ "')";
               // console.log(query);
               db.query(query1, (err, result1) => {
                if (err) {
                 return res.status(500).send(err);
                }
                if (result1.length == 0){
                    db.query(query2, (err, result2) => {
                        if (err) {
                         return res.status(500).send(err);
                        }

                }
            )} else {
                console.log("Already AVL");

            }
                    res.redirect('back');
                   
                 
            
                });
                
           

            },

            removeAVL: (req, res) => {
                let customer_id = req.body.customerid1;
                let supplier_id = req.body.supplierid1;
                let query = "DELETE FROM avl WHERE `customer_id`= '" + customer_id + "' AND `supplier_id`= '" + supplier_id + "'";
                //console.log(query);
                 db.query(query, (err, result) => {
                     if (err) {
                        res.redirect('/');
                  }
                    res.redirect('back');
                  });
                
            },



    sendMail: (req, res) => {
    let customerId = req.params.cid;
    let supplierId = req.params.sid.split(",");
    let topic = req.params.topic;
    let message = req.params.message;
    let supplierEmail = req.params.sidg.split(",");
   
     //console.log(supplierEmail);
    let query = "SELECT customer_name FROM `customers` WHERE customer_id = '" + customerId + "' ";
   // let query1 = "SELECT supplier_name FROM `suppliers` WHERE supplier_id = '" + supplierId + "' ";
   //console.log(query);
    db.query(query, (err, result) => {
        if (err) {
            res.redirect('/');
        }
        let customerName = result[0].customer_name;
   
    //console.log(customerName);
        for( var i = 0; i < supplierId.length; i ++ ) {
            let query1 = "SELECT supplier_id,supplier_name FROM `suppliers` WHERE supplier_id = '" + supplierId[i] + "' ";
        //console.log(query1); 
            db.query(query1, (err, result1) => {
                if (err) {
                    res.redirect('/');
              }
              let query2;
             
            
        query2 = "INSERT INTO `rfq` (customer_id,customer_name,supplier_id,supplier_name,topic,message) VALUES ('" +
        customerId + "', '" + customerName + "', '" + result1[0].supplier_id + "', '"+ result1[0].supplier_name + "', '" + topic + "', '" + message + "')";
        //console.log(query2);     
   
              db.query(query2, (err, result2) => {
                  if (err) {
                      res.redirect('/');
                }
               // console.log(result2.insertId);
            });
    });
     }
    });

            //      
                //  let query3 = "SELECT COUNT(rfq_id) AS numberofid FROM RFQ;";
                //  db.query(query3, (err, result3) => {
                //      if (err) {
                //          res.redirect('/');
                //      }
               
        
    //         var supplierEmail = result1[0].email;
    //     var subject ="RFQ# " +  result2.insertId +" from " + result[0].customer_name;
    //    // +  result2[0].rfq_id +
    // var emailBody =  "";
    //     // var attach = 'path';
    // for( var i = 0; i < supplierEmail.length; i ++ ) {
    // //   var mail = "mailto:"+supplierEmail[i]+"?subject= RFQ"+"&body="+encodeURIComponent(emailBody);
    // // res.redirect(mail);
    // console.log(supplierEmail[i]);
    // }
    res.redirect('back');
  



},
customerSummaryPage: (req, res) => {
    let customerId = req.params.id;
    let query = "SELECT DATE_FORMAT(rfq_date,'%b-%y') as rfqdate, COUNT(*) COUNT FROM rfq WHERE (YEAR(rfq_date) = '2018' OR YEAR(rfq_date) = '2019') && customer_id = '" + customerId + "' GROUP BY  MONTH(rfq_date) ORDER BY rfq_date DESC;"
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        
        x = [];
        y = [];
        for( var i in results ) {
            x[i] = results[i].rfqdate;
            y[i] = results[i].COUNT;
        }
    });
        let query1 = "SELECT supplier_name, COUNT(*) COUNT FROM rfq WHERE (YEAR(rfq_date) = '2018' OR YEAR(rfq_date) = '2019') && customer_id = '" + customerId + "' GROUP BY  supplier_name ORDER BY COUNT DESC LIMIT 0,5;"
        db.query(query1, (err, results) => {
            if (err) {
                return res.status(500).send(err);
            }
            
            c = [];
            q = [];
            for( var i in results ) {
                c[i] = (results[i].supplier_name).substr(0, 8);
                q[i] = results[i].COUNT;
            }
       
    res.render('customerSummary.ejs', {
        title: "RFQ Summary"
        ,message: '', user_status: "loggined",customer_id:customerId,months:x,rfqqty:y,supplier:c,rfqqty1:q,count:pendingRFQ
    });
    // console.log(x);
    // console.log(y);
    // console.log(supplierId);

    // console.log(query);
    // console.log(results);
   
    

});
},
getBiddingList: (req, res) => {
    let customerId = req.params.cid;
    let status = req.params.sta;
    let query;
    //console.log(status);
    if (status == "active" ) {
        
        query = "SELECT post_id,customer_name,project_name,scope,requirement,leadtime,DATE_FORMAT(deadline,'%Y-%m-%d') as deadline1,DATEDIFF( deadline,CURDATE()) AS DateDiff FROM `bidding_room` WHERE customer_id = '" + customerId + "' AND DATEDIFF( deadline,CURDATE()) >= '0' ";
  
    } else {
        
        query = "SELECT post_id,customer_name,project_name,scope,requirement,leadtime,DATE_FORMAT(deadline,'%Y-%m-%d') as deadline1,DATEDIFF( deadline,CURDATE()) AS DateDiff FROM `bidding_room` WHERE customer_id = '" + customerId + "' AND DATEDIFF( deadline,CURDATE()) < '0' ";
  
    }
    let query1 = "SELECT * FROM `customers` WHERE customer_id = '" + customerId + "'";
    //console.log(query);
    db.query(query, (err, result) => {
        if (err) {
            res.redirect('/');
        }
       // console.log(query);  
        db.query(query1, (err, result1) => {
            if (err) {
                res.redirect('/');
            }
        res.render('biddingRoom.ejs', {
            title: "List of bidding"
            ,biddings: result,customerid:customerId,customername:result1[0].customer_name,customer_photo:result1[0].photo,user_status:"loggined",customer:customerId,count:pendingRFQ,post_status:status
        });
    });

    });
},
addPost: (req, res) => {
    let custId = req.params.cid;
    let custName = req.body.customer_name;
    let projectName = req.body.project_name;
    let projectScope = req.body.scope;
    let requirement = req.body.requirement;
    let leadtime = req.body.leadtime;
    let deadline = req.body.deadline;
  
    let query = "INSERT INTO `bidding_room` (customer_id,customer_name,project_name,scope, requirement, leadtime, deadline) VALUES ('" +
    + custId + "', '"  + custName + "', '"  + projectName + "', '" + projectScope + "', '" + requirement + "', '" + leadtime + "', '" + deadline +  "')";     
    //console.log(query);  

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('back');
                   
    });
},

updatePost: (req, res) => {
    let postId = req.params.id;
    let projectName = req.body.project_name;
    let projectScope = req.body.scope;
    let requirement = req.body.requirement;
    let leadtime = req.body.leadtime;
    let deadline = req.body.deadline;
    let query = "UPDATE `bidding_room` SET `project_name` = '" + projectName + "', `scope` = '" + projectScope  + "', `requirement` = '" + requirement + "', `leadtime` = '" + leadtime + "', `deadline` = '" + deadline + "' WHERE `post_id` = '" + postId + "'";
            
   //console.log(query);        
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('back');
                   
    });
},
deletePost: (req, res) => {
    let postId = req.body.postId;
   
    let query = "DELETE FROM bidding_room WHERE post_id = " + postId ;

   //console.log(query);        
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('back');
                   
    });
},

}