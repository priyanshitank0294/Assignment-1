const policies={
      //read access to all
    "product:read":[
()=>true
],
"product:create":[
    ({user})=>user.role==="admin",
    ({user})=>user.role==="seller"
],
"product:update":[
    ({user})=>user.role==="admin",
    ({user,product})=>user.role==="seller" && user._id.toString()===product.owner.toString()
],

"product:delete":[
    ({user})=>user.role==="admin",
    ({user,product})=>user.role==="seller" && user._id.toString()===product.owner.toString() && product.price<=50000
]
  
}
module.exports=policies;