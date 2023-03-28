const router=require("express").Router();
const User=require("../models/User");

router.post('/',async(req,res)=>{
    try {
        const {name,email,password,picture}=req.body;
        console.log(req.body);
        const user1 =await User.create({name,email,password,picture});
        res.status(201).json(user1);
    } catch (e) {
        let msg;
        if(e.code==11000){
            msg="user already exist";
        }
        else{
            msg=e.message;
            console.log(e);
        }
        res.status(400).json(msg);
    }
})
//login user 

router.post("/login",async(req,res)=>{
try {
    const {email,password}=req.body;
    const user1=await user.findByCredentials(email,password);
    user1.status="online";
    await user1.save();
    res.status(200).json(user1);
} catch (e) {
    res.status(400).json(e.message);
}
}) 


module.exports=router;

 