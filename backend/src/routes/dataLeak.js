const express = require("express")
const router = express.Router()

router.post("/check", async (req,res)=>{

  const { email } = req.body

  if(!email){
    return res.status(400).json({ error:"Email required" })
  }

  try{

    // TODO integrate HIBP API
    res.json({
      email,
      breached:false,
      message:"No breach found (placeholder)"
    })

  }catch(err){

    res.status(500).json({
      error:"Data leak check failed"
    })

  }

})

module.exports = router