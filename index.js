
const express=require('express');
const mysql=require('mysql2');
const bodyParser=require('body-parser');
const cors=require('cors');


const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.listen(5001,()=>{
    console.log("5001 connected...")
});

let conn=mysql.createConnection({
    host:'localhost',
    user:"root",
    password:'B@tr$$*2022',
    database:'employeedb'
});

conn.connect(err=>{
    if(err){
        console.log(err)
    }else{
        console.log("db connected...")
    }
});

app.get("/searchEmp/:id",(req,res)=>{

    let {id}=req.params;

    conn.query("select * from employee where id=?",[id],(err,result)=>{

        if(err){

        }else{
            if(result.length>0){
                res.status(200).json(result[0]);
            }else{
                res.status(400).json("Employee not found"); 
            }
        }

    })

});

app.get("/listAll",(req,res)=>{

    conn.query("select * from employee",(err,result)=>{

        if(err){

        }else{
            res.status(200).json(result);
           
        }
    })
});

app.put("/updateEmp",(req,res)=>{

    let {id,name,salary}=req.body;

    console.log(id,name,salary);

    conn.query("update employee set name=?,salary=? where id=?",
        [name,salary,id],(err,result)=>{

            if(err){
                console.log(err);
            }else{
                if(result.affectedRows>0){
                    res.status(200).json("Employee updated");
                }else{
                    res.status(400).json("Employee not updated");
                }
            }
        })

})

app.delete("/deleteEmp",(req,res)=>{

    let {id}=req.body;

    console.log(id);

    conn.query("delete from employee where id=?",[id],
        (err,result)=>{
        if(err){
           console.log(err);
        }else{

        if(result.affectedRows){
           res.status(200).json({status:"Employee Deleted"});
        }else{
              
            res.status(400).json({status:"Employee not found"});
        }

            
        }

    })

})


app.post("/registerEmp",(req,res)=>{

    let{id,name,salary}=req.body;

    conn.query("insert into employee values(?,?,?)",
        [id,name,salary],(err,result)=>{

            if(err){
              res.status(400).json({status:"Id already exists"});
            }else{
             res.status(200).json({status:"Employee Registered"});
            }

        })
})

app.post("/authenticate",(req,res)=>{
    let{name,password}=req.body;
    conn.query("select password from user where name=?",
        [name],(err,result)=>{
            if(err){
                console.log(err)
            }else{
                if(result.length>0 && result[0].password===password){
                    res.status(200).json({status:true});
                }else{
                    res.status(400).json({status:false});
                }
            }

        }
    )

})

