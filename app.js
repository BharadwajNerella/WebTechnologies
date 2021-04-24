const express = require('express')  // Adding a express by runnig nmp install --save express
const path=require('path');
const http=require('http');
var bodyParser = require('body-parser')


const app = express() 
const port = 3000  

var MongoClient = require('mongodb').MongoClient;

   

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/www/'));

app.set('view engine', 'ejs')

var databaseurl = "mongodb://localhost:27017/bakery"; 

app.listen(port, () => {    
    console.log(`Website running at: http://localhost:${port}`)  
  });


app.get('/', function (req, response) {
    response.sendFile(path.join(__dirname,'/index.html'));
  });

  app.get('/cakelist', function (req, response) {
    response.sendFile(path.join(__dirname,'www','cakelist.html'));
  });
  app.get('/login', function (req, response) {
    
    response.sendFile(path.join(__dirname,'www','login.html'));
  });

  app.get('/register', function (req, response) {
    
    response.sendFile(path.join(__dirname,'www','register.html'));
  });

  app.get('/dashboard', function (req, response) {
    response.sendFile(path.join(__dirname,'www','dashboard.html'));
  });


  // REGISTER API
  app.post('/register', function (req, response) {
    var name=req.body.name;
    var email=req.body.email;
    var phone=req.body.phone;
    var age=req.body.age;
    var password = req.body.password;
    console.log(password);
    var data = { result : "default"};

      
                MongoClient.connect(databaseurl, {useNewUrlParser:true }, function(err, db) { 
                if (err){
                    response.statusCode = 404;
                    data = { result : "Unable to connect to database"};
                    console.log("unable to connect to database");  
                    response.send(data)
                }
                else 
                {
                    var dbo = db.db("bakery"); 
                    var myobj = { name:name,email:email,age:age,phone:phone,password:password };  
                    dbo.collection("userstable").insertOne(myobj, function(err, res) 
                    {    
                        if (err)
                        {
                            response.statusCode = 404;
                            console.log("Could not Insert");    
                            data = { result : "Could not Insert"};
                            response.send(data)
                        }
                        else 
                        {  
                            console.log("Record inserted");    
                            db.close(); 
                            response.statusCode = 200;
                            response.sendFile(path.join(__dirname,'www','login.html'));
                        
                        }
                    }); 
                }     
            });           
  });

  //login API
app.post('/login', function (req, response) {
    var email = req.body.email;
    var password = req.body.password;
    var data = { result : "default"};
    
            MongoClient.connect(databaseurl, {useNewUrlParser:true }, function(err, db) { 
                if (err)
                {
                    response.statusCode = 404;
                    data = { result : "Unable to connect to database"};
                    console.log("unable to connect to database");  
                    response.send(data)
                }
                else 
                {
                    var dbo = db.db("bakery"); 
                    var query = { email: email, password: password };  
                    dbo.collection("userstable").find(query).toArray(function(err, res) 
                    {    
                        if(res.length == 0){
                            response.statusCode = 404;
                            response.send("<center><br><hr><h1 style='color:red;'>Could not login!!!</h1><hr><br><a href='/login'> Try Again</a></center>")
                        } else {
                            response.statusCode = 200;
                            //response.sendFile(path.join(__dirname,'www','dashboard.html'));
                            var name = 'hello';

                            response.render('dashboard',{data :{email:email}});
                        }
                        
                    });                    

                }
            }); 

  });


  
  app.get('/favlist', function (req, response) {
   
    var data = { result : "default"};
 
       
            MongoClient.connect(databaseurl, {useNewUrlParser:true }, function(err, db) { 
                if (err){
                    response.statusCode = 404;
                    data = { result : "Connection failed"};
                    console.log("Connection failed");  
                    response.send(data)
                }else {
                    var dbo = db.db("bakery"); 
                    
                    dbo.collection("favourite").find().toArray(function(err, res) 
                    {    
                        if(res.length == 0){
                            response.statusCode = 404;
                            response.send(' <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous"><center><hr><h1 style="color:red;">No Items</h1></hr></center>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="/" class="btn btn-success">Home</a>');
                        } else {
                            response.statusCode = 200;
                            var s=' <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">';
                            s+="<body><h1>Favourite List</h1><table width='50%' class='table table-stripped table-bordered'><tr><th>Name</th>";
                            s+="<th>Image</th></tr>";
                            for(i=0;i<res.length;i++)
                            {
                              s+="<tr>";
                              s=s+"<td>"+res[i].name+"</td>";
                              s=s+"<td><img style='width:100px;' src='img/"+res[i].fav+"'></td>";
                             
                              s+="</tr>";
                            }
                            s+="</table><a href='/' class='btn btn-success'>Home</a> <a href='/delfav' class='btn btn-danger'>Delete List</a></body>";
                            response.send(s);
                        }
                        
                    });                    

                }
            }); 

        
  
  });

  app.get('/delfav', function (req, response) {
   
    var data = { result : "default"};
    
       
            MongoClient.connect(databaseurl, {useNewUrlParser:true }, function(err, db) { 
                if (err){
                    response.statusCode = 404;
                    data = { result : "Connection failed"};
                    console.log("Connection failed");  
                    response.send(data)
                }else {
                    var dbo = db.db("bakery"); 
                    
                    dbo.collection("favourite").deleteMany(); 
                    
                    response.sendFile(path.join(__dirname,'www','/index.html'));
                                  

                }
            }); 

        
  
  });


  


  
  app.post('/addfavorite', function (req, response) {
    var name=req.body.name;
    var fav = req.body.fav;

    var data = { result : "default"};

      
                MongoClient.connect(databaseurl, {useNewUrlParser:true }, function(err, db) { 
                if (err){
                    response.statusCode = 404;
                    data = { result : "Unable to connect to database"};
                    console.log("unable to connect to database");  
                    response.send(data)
                }
                else 
                {
                    var dbo = db.db("bakery"); 
                    var myobj = { name:name,fav:fav};  
                    dbo.collection("favourite").insertOne(myobj, function(err, res) 
                    {    
                        if (err)
                        {
                            response.statusCode = 404;
                            console.log("Could not Insert");    
                            data = { result : "Could not Insert"};
                            response.send(data)
                        }
                        else 
                        {  
                            console.log("1 document inserted");    
                            db.close(); 
                            response.statusCode = 200;
                            response.sendFile(path.join(__dirname,'www','cakelist.html'));
                            
                        }
                    }); 
                }     
            });           
  });
  
  






  
