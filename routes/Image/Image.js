import express from 'express';
import { Image, PersonalInfo } from '../../models.js';

const router = express.Router();


router.get('/' , async (req,res) => {
    try {
        const image = await Image.findAll({
            include : [{
                model : PersonalInfo,
                attributes : ["firstname"]
            }]
        });
        if(image.length === 0) return res.status(400).send("Not Data to fetch");
        const imageformatted = image.map( image => ({
            id : image.id,
            personalinfo : image.personalinfo,
            image : image.image,
            createdAt : image.createdAt,
            updatedAt : image.updatedAt,
        }));
        res.status(200).send(imageformatted);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    };
});

router.get("/:id", async (req, res) => {
    const imageid = req.params.id;
    try {
        const image = await Image.findByPk(imageid);
        if (!image) return res.status(400).send("Id not Found");

        const imageidformatted = {
            id : image.id,
            personalinfo : image.personalinfo,
            image : image.image,
            createdAt: image.createdAt,
            updatedAt: image.updatedAt,
        };

        res.status(200).send(imageidformatted);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    };
});

router.post("/", async (req, res) => {
    try {
        const { image , personalinfo} = req.body;
        if (!image || !personalinfo) return res.status(400).send("Please input all required data");

        const newimage = await Image.create({ image , personalinfo });

        const imagelformatted = {
            id: newimage.id,
            personalinfo : newimage.personalinfo,
            image: newimage.image,
            createdAt: newimage.createdAt,
            updatedAt: newimage.updatedAt,
        };

        res.status(200).send(imagelformatted);

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    };
});

router.patch("/:id", async (req, res) => {
    const imageid = req.params.id;
    try {
  
        const image = await Image.findByPk(imageid);
        if (!image) return res.status(400).send("ID not Found");

        const patchimage = req.body;

        await image.update({
            personalinfo: patchimage.personalinfo || image.personalinfo,
            image: patchimage.image || image.image
        });

        const imageformatted = {
            id: image.id,
            personalinfo : image.personalinfo,
            image: image.image,
            createdAt: image.createdAt,
            updatedAt: image.updatedAt,
        };

        res.status(200).send(imageformatted);

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    };
});

router.delete("/:id" , async (req,res) => {
    const imageid = req.params.id;
   try {
       const image = await Image.findByPk(imageid);
       if(!image) return res.status(400).send("ID not found");

       await image.destroy();

       const imageformatted = {
            id: image.id,
            personalinfo : image.personalinfo,
            image: image.image,
            createdAt: image.createdAt,
            updatedAt: image.updatedAt,
       };

       res.status(200).send(imageformatted);

   } catch (error){
       console.log(error.message);
       res.status(500).send(error.message);
   };
});

export default router;