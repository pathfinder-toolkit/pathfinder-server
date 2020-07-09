const db = require('../models');
const { Image } = require('../models');

const cloudinary = require('../utils/cloudinary');

const sequelize = db.sequelize;

const {
    clearDirectoryWithInterval
} = require('../utils/cleanup');

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

            const publicId = cloudinaryResponse.public_id;

            const imageObject = await Image.create({
                image: publicId,
                authorSub: author
            },
            {transaction: t});

            console.log(imageObject.toJSON());

            const JSONresponse = {
                publicId: publicId
            }
            await t.commit();

            //Remove any 30 seconds or older images
            clearDirectoryWithInterval(30000);
            response.status(201).json(JSONresponse);
        } else {
            await t.rollback();
            response.status(413).send("File size limit has been reached, upload unsuccessful");
        }
    } catch (error) {
        await t.rollback();
        //Remove any 30 seconds or older images
        clearDirectoryWithInterval(30000);
        console.log(error);
        response.status(500).send("Internal server error");
    }
}

const getUserImages = async (request, response) => {
    const t = await sequelize.transaction();
    try {
        const author = request.user.sub;

        const images = await Image.findAll({
            where: {
                authorSub: author
            },
            attributes: [['image','publicId'], ['updatedAt','date']]
        });

        const imageList = [];

        for (const image of images) {
            imageList.push(image.toJSON());
        }

        await t.commit();

        response.status(200).json(imageList);
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send("Internal server error")
    }
}

const deleteUserImage = async (request, response) => {
    const t = await sequelize.transaction();
    try {

        console.log("rollback for safety");
        await t.rollback();

        response.status(200).send("Success!");
    } catch (error) {
        await t.rollback();
        console.log(error);
        response.status(500).send("Internal server error");
    }
}

module.exports = {
    uploadImageToCloudinary,
    getUserImages,
    deleteUserImage
};