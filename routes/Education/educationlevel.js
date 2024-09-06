import express from 'express';
import { EducationLevel } from '../../models.js';

const router = express.Router();

router.get('/' , async (req,res) => {
    try {
        const educationlevel = await EducationLevel.findAll();
        if(educationlevel.length === 0) return res.status(400).send("Not Data to fetch");
        const educationlevelformatted = educationlevel.map( educationlevel => ({
            id : educationlevel.id,
            education : educationlevel.educationlevel,
            createdAt : educationlevel.createdAt,
            updatedAt : educationlevel.updatedAt,
        }));
        res.status(200).send(educationlevelformatted);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    };
});

router.get("/:id", async (req, res) => {
    const educationlevelid = req.params.id;
    try {
        const educationlevel = await EducationLevel.findByPk(educationlevelid);
        if (!educationlevel) return res.status(400).send("Id not Found");

        const educationlevelformatted = {
            id : educationlevel.id,
            education : educationlevel.educationlevel,
            createdAt: educationlevel.createdAt,
            updatedAt: educationlevel.updatedAt,
        };

        res.status(200).send(educationlevelformatted);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    };
});

router.post("/", async (req, res) => {
    try {
        const { educationlevel } = req.body;
        if (!educationlevel) return res.status(400).send("Please input all required data");

        const neweeducationlevel = await EducationLevel.create({ educationlevel });
    

        const educationlevelformatted = {
            id: neweeducationlevel.id,
            education: neweeducationlevel.educationlevel,
            createdAt: neweeducationlevel.createdAt,
            updatedAt: neweeducationlevel.updatedAt,
        };

        res.status(200).send(educationlevelformatted);

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    };
});

router.patch("/:id", async (req, res) => {
    const educationlevelid = req.params.id;
    try {
  
        const educationlevel = await EducationLevel.findByPk(educationlevelid);
        if (!educationlevel) return res.status(400).send("ID not Found");

        const patcheducationlevel = req.body;


        await educationlevel.update({
            educationlevel: patcheducationlevel.educationlevel || educationlevel.educationlevel,
        });
        const educationlevelformatted = {
            id: educationlevel.id,
            educationlevel: educationlevel.educationlevel,
            createdAt: educationlevel.createdAt,
            updatedAt: educationlevel.updatedAt,
        };

        res.status(200).send(educationlevelformatted);

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    };
});

router.delete("/:id" , async (req,res) => {
    const educationlevelid = req.params.id;
   try {
       const educationlevel = await EducationLevel.findByPk(educationlevelid);
       if(!educationlevel) return res.status(400).send("ID not found");

       await educationlevel.destroy();

       const educationformatted = {
            id: educationlevel.id,
            educationlevel: educationlevel.educationlevel,
            createdAt: educationlevel.createdAt,
            updatedAt: educationlevel.updatedAt,
       };

       res.status(200).send(educationformatted);

   } catch (error){
       console.log(error.message);
       res.status(500).send(error.message);
   };
});


export default router;