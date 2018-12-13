const fs = require('fs');

var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'hdzvdkljx', 
    api_key: '245568641867713', 
    api_secret: 'fUEhfjczQdqFYl6TIp_gA_CyY-I' 
  });
  
module.exports = {
   
    supplierSignupPage: (req, res) => {
        res.render('supplierSignup.ejs', {
            title: "Welcome to Socka | Add a new player"
            ,message: ''
        });
    },
    
    addSupplier:(req, res) =>  {
        let today = new Date();
        let supplier_name = req.body.supplier_name;
        let supplier_info = req.body.supplier_info;
        let email = req.body.email;
        let password = req.body.password;
      
        let emailQuery = "SELECT * FROM `suppliers` WHERE email = '" + email + "'";

        db.query(emailQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
          
            } else {
                let query = "INSERT INTO `suppliers` (supplier_name, supplier_info, email, password) VALUES ('" +
                supplier_name + "', '" + supplier_info + "', '" + email + "', '" + password +  "')";
            db.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/');
            });

            }

});
    },
    supplierLoginPage: (req, res) => {
        res.render('SupplierLogin.ejs', {
            title: "Welcome to Socka | Add a new player"
            ,message: ''
        });
    },
    supplierInbox: (req, res) => {

        let supplierId = req.params.sid;
        let rfqstatus = req.params.rfqstatus;
        let pageNo = req.params.pageno;
        let maxPage;
        let query = "SELECT rfq_id,supplier_id FROM `rfq` WHERE supplier_id = '" + supplierId + "' AND rfq_status IS NULL  ORDER BY rfq_date DESC"; // query database to get all the players
        let query1 = "SELECT rfq_id,customer_name,topic,message,rfq_status,DATE_FORMAT(rfq_date,'%a %e %b %Y') AS rfq_date1 FROM `rfq` WHERE supplier_id = '" + supplierId + "' AND rfq_status IS NULL ORDER BY rfq_date DESC LIMIT " + (pageNo-1)*10 + ", 10"; // query database to get all the players
        if (pageNo === "") {
            pageNo= 1;
        }
        // console.log(query);
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            if (result.length != ""){
           maxPage = Math.ceil(result.length/10);
        } else {
            maxPage = 0;
        }
        db.query(query1, (err, result1) => {
            if (err) {
                res.redirect('/');
            }
            
        res.render('supplierInbox.ejs', {
            title: "Supplier Inbox"
            ,message: '', user_status:"loggined",rfqlists:result1,supplier_id:supplierId,maxPage:maxPage
        });
    });
});
    },
    supplierLogin: (req, res) =>  {
        var email= req.body.email;
        var password = req.body.password;
        let user_status = "";
        let supplierid = "";
        db.query('SELECT * FROM suppliers WHERE email = ?',[email], function (error, results, fields) {
        if (error) {
          // console.log("error ocurred",error);
          res.send({
            "code":400,
            "failed":"error ocurred"
          })
        } else{
        //   console.log('The solution is: ', results);
          if(results.length >0){
            if(results[0].password == password){
                var supp_id = results[0].supplier_id;
                res.render('supplierPage.ejs', {
                    title: "Welcome to Socka | View Players"
                    , supplier: results[0], user_status: "loggined",
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
    
    editSupplierConfigPage: (req, res) => {
        let supplierId = req.params.id;
        let query = "SELECT * FROM `suppliers` WHERE supplier_id = '" + supplierId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
           
            res.render('editSupplierConfig.ejs', {
                title: "Edit  Supplier"
                ,supplier: result[0]
                ,message: '',user_status:"loggined"
            });
        });
      
    },
    updateStatus: (req, res) => {
        let rfqId = req.body.rfqid1;
        
        let query = "UPDATE `rfq` SET `rfq_status` = 'submitted' WHERE `rfq_id` = '" + rfqId + "'";
        //console.log(query);
         db.query(query, (err, result) => {
             if (err) {
                res.redirect('/');
          }
            res.redirect('back');
          });
        
    },
    editSupplierPage: (req, res) => {
        let supplierId = req.params.id;
        let query = "SELECT * FROM `suppliers` WHERE supplier_id = '" + supplierId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('editsupplier.ejs', {
                title: "Edit  Supplier"
                ,supplier: result[0]
                ,message: '',user_status:"loggined"
            });
        });
    },
    
    editSupplier: (req, res) => {
        let supplierId = req.params.id;
        let supplierName = req.body.supplier_name;
        let supplierInfo = req.body.supplier_info;
        let productInfo = req.body.product_info;
        let capacity = req.body.capacity;
        let address = req.body.address;
        let website = req.body.website;
        let regCap = req.body.reg_cap;
        let saleemail = req.body.sale_email;
        let businessType = req.body.business_type;
        let foundyear = req.body.found_year;
       
if (typeof req.files.image !== "undefined"){
    let uploadedFile = req.files.image;
    let image_name = uploadedFile.name;
    let fileExtension = uploadedFile.mimetype.split('/')[1];
  
    // let image_name1 = uploadedFile.name.split('.')[0];
    // let colinary_url = 'https://api.cloudinary.com/v1_1/hdzvdkljx/upload';
    // var cloudinary_upload_preset ='pqoenb7k';
    image_name = supplierName + '.' + fileExtension;
    //image_name = customerName + '.' + fileExtension;
    let filename = 'supplier_logo/' + supplierName
    
        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
            // upload the file to the /public/assets/img directory
            uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                if (err) {
                    return res.status(500).send(err);
                }
                
            });
            
            cloudinary.v2.uploader.upload(`public/assets/img/${image_name}`, {public_id: filename } ,
            function(error, result) {console.log(result, error)});

            let query = "UPDATE `suppliers` SET `supplier_name` = '" + supplierName + "', `supplier_info` = '" + supplierInfo + "', `product_info` = '" + productInfo + "', `capacity` = '" + capacity + "', `address` = '" + address + "', `website` = '" + website + "', `photo` = '" + image_name + "', `reg_cap` = '" + regCap +"', `found_year` = '" + foundyear + "', `business_type` = '" + businessType +"', `sale_email` = '" + saleemail + "' WHERE `supplier_id` = '" + supplierId + "'";
            // console.log(query);
            
            db.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }

                let query1 = "SELECT * FROM `suppliers` WHERE supplier_id = '" + supplierId + "' ";
        db.query(query1, (err, result1) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('supplierPage.ejs', {
                title: "Welcome to Socka | View Players"
                , supplier: result1[0], user_status: "loggined",
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
        let query = "UPDATE `suppliers` SET `supplier_name` = '" + supplierName + "', `supplier_info` = '" + supplierInfo + "', `product_info` = '" + productInfo + "', `capacity` = '" + capacity + "', `address` = '" + address + "', `website` = '" + website + "', `reg_cap` = '" + regCap + "', `found_year` = '" + foundyear + "', `business_type` = '" + businessType +"', `sale_email` = '" + saleemail + "' WHERE `supplier_id` = '" + supplierId + "'";
        //console.log(query);
        
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
        });
        let query1 = "SELECT * FROM `suppliers` WHERE supplier_id = '" + supplierId + "' ";
        db.query(query1, (err, result1) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('supplierPage.ejs', {
                title: "Welcome to Socka | View Players"
                , supplier: result1[0], user_status: "loggined",
            });
        });
    }


    
    },
    editSupplierConfig: (req, res) => {
        let supplierId = req.params.id;
        let creditTerm = req.body.credit_term;
        let specificArea = req.body.specific_area;
        let moq = req.body.moq;
        let certificate = req.body.certificate;
        let boi = req.body.BOI;
        let vat = req.body.VAT;
        let query = "UPDATE `suppliers` SET `credit_term` = '" + creditTerm + "', `specific_area` = '" + specificArea + "', `moq` = '" + moq + "', `certificate` = '" + certificate + "', `BOI` = '" + boi + "', `VAT` = '" + vat +  "' WHERE `supplier_id` = '" + supplierId + "'";
        // console.log(query);
        
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            let query1 = "SELECT * FROM `suppliers` WHERE supplier_id = '" + supplierId + "' ";
            db.query(query1, (err, result1) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.render('supplierPage.ejs', {
                    title: "Welcome to Socka | View Players"
                    , supplier: result1[0], user_status: "loggined",
                });
            });
        });
    },
    supplierSummaryPage: (req, res) => {
        let supplierId = req.params.id;
        let query = "SELECT DATE_FORMAT(rfq_date,'%b-%y') as rfqdate, COUNT(*) COUNT FROM rfq WHERE YEAR(rfq_date) = '2018' && supplier_id = '" + supplierId + "' GROUP BY  MONTH(rfq_date) ORDER BY MONTH(rfq_date) DESC;"
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
            let query1 = "SELECT customer_name, COUNT(*) COUNT FROM rfq WHERE YEAR(rfq_date) = '2018' && supplier_id = '" + supplierId + "' GROUP BY  customer_name ORDER BY COUNT DESC;"
            db.query(query1, (err, results) => {
                if (err) {
                    return res.status(500).send(err);
                }
                
                c = [];
                q = [];
                for( var i in results ) {
                    c[i] = results[i].customer_name;
                    q[i] = results[i].COUNT;
                }
           
        res.render('supplierSummary.ejs', {
            title: "Welcome to Socka | Add a new player"
            ,message: '', user_status: "loggined",supplier_id:supplierId,months:x,rfqqty:y,customer:c,rfqqty1:q
        });
        // console.log(x);
        // console.log(y);
        // console.log(supplierId);
   
        // console.log(query);
        // console.log(results);
       
        
  
});
    },


    
    
    
};
    