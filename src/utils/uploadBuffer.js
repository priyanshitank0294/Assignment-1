const cloudinary=require("../config/cloudinary.config");
const uploadBuffer=(buffer,folder="demo-cloud")=>{
    return new Promise((resolve,reject)=>{
        const stream=cloudinary.uploader.upload_stream(
            {
                folder:folder,
                resource_type:"image"
            },
            (error,result)=>{
                if(error){
                    return reject(error);
                }
                resolve(result)
            }
        );
        stream.end(buffer);
    })
}
const updateImage = async (buffer , oldPublic_id , folder="demo-cloud")=>{
    if(oldPublic_id){
        await cloudinary.uploader.destroy(oldPublic_id);
    }

   const  newResult = await uploadBuffer(
        buffer,
        folder
    );

    return newResult;
};

const deleteImage = async (oldPublic_id)=>{
    if(!oldPublic_id){
        throw new Error("image don't exists..");
    };

  const result =  await cloudinary.uploader.destroy(oldPublic_id);
  return result;
}
module.exports={uploadBuffer,updateImage,deleteImage};



