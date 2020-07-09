const db = require('../models');
const { Image } = require('../models');

const cloudinary = require('../utils/cloudinary');

const sequelize = db.sequelize;



const uploadImageToCloudinary = async (request, response) => {
    const t = await sequelize.transaction();
    try {

        if (request.files.image.truncated === false) {
            const author = request.user.sub;
            console.log(author);
            const image = request.files.image;
            console.log(image);
            const cloudinaryResponse = await cloudinary.uploader.upload(image.tempFilePath, {upload_preset: 'pathfinder_userimages'});
            console.log(cloudinaryResponse);

            /*const publicId = cloudinaryResponse.public_id;

            const image = await Image.create({
                image: publicId,
                authorSub: author
            },
            {transaction: t});

            console.log(image.toJSON());*/

            console.log("rollback for safety");
            await t.rollback();
            response.status(200).send("Success!")
        } else {
            await t.rollback();
            response.status(413).send("File size limit has been reached, upload unsuccessful");
        }
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send("Internal server error");
    }
}

module.exports = {
    uploadImageToCloudinary
};