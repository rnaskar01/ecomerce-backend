const { User } = require("../model/User");

exports.createUser= async (req,res)=>{
    // this product we have to get from API body 
    const user = new User(req.body);
    try{
        const doc = await user.save();
        res.status(201).json({id:doc.id,role:doc.role});
    }
    catch(err){
        res.status(400).json(err);

    }
}


exports.loginUser= async (req,res)=>{
    try {
        const user = await User.findOne({email:req.body.email}).exec();
        if(!user){
            res.status(401).json({message: "No such a user found"});
        }
        else if(user.password===req.body.password){
            // ToDo: we will make addresses independent of login
            res.status(201).json({id:user.id, role:user.role});
        }else{
            res.status(401).json({message: 'Invalid email id or password'});
        }

    } catch (err) {
        res.status(400).json(err);

    }
}