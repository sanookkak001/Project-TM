import express from 'express';
import { Education, EducationLevel } from '../../models.js';


const router = express.Router();

router.get('/' , async (req,res) => {
    try {
        const education = await Education.findAll({
            include : [{
                model : EducationLevel,
                attributes : ["educationlevel"]
            }]
        });
        if(education.length === 0) return res.status(400).send("Not Data to fetch");
        const educationformatted = education.map( education => ({
            id : education.id,
            education : education.EducationLevel ? education.EducationLevel.educationlevel : education.education,
            createdAt : education.createdAt,
            updatedAt : education.updatedAt,
        }));
        res.status(200).send(educationformatted);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    };
});

router.get("/:id", async (req, res) => {
    const educationid = req.params.id;
    try {
        const education = await Education.findByPk(educationid, {
            include: [{
                model: EducationLevel, 
                attributes: ['educationlevel']  
            }]
        });
        if (!education) return res.status(400).send("Id not Found");

        const educationformatted = {
            id: education.id,
            education: education.EducationLevel ? education.EducationLevel.educationlevel : education.education,
            createdAt: education.createdAt,
            updatedAt: education.updatedAt,
        };

        res.status(200).send(educationformatted);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    };
});

router.post("/", async (req, res) => {
    try {
        const { personalinfo, education } = req.body;
        if (!personalinfo || !education) return res.status(400).send("Please input all required data");

      
        const neweducation = await Education.create({ personalinfo, education });
     
        const educationWithLevel = await Education.findByPk(neweducation.id, {
            include: [{
                model: EducationLevel,
                attributes: ['educationlevel']
            }]
        });

        const educationformatted = {
            id: educationWithLevel.id,
            education: educationWithLevel.EducationLevel ? educationWithLevel.EducationLevel.educationlevel : educationWithLevel.education,
            createdAt: educationWithLevel.createdAt,
            updatedAt: educationWithLevel.updatedAt,
        };

        res.status(200).send(educationformatted);

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
});

router.patch("/:id", async (req, res) => {
    const educationid = req.params.id;
    try {
        // ค้นหา education ตาม id
        const education = await Education.findByPk(educationid, {
            include: [{
                model: EducationLevel,
                attributes: ['educationlevel']
            }]
        });
        if (!education) return res.status(400).send("ID not Found");

        // รับข้อมูลที่ต้องการอัปเดตจาก body
        const patcheducation = req.body;

        // ใช้ instance ที่หาได้ อัปเดตข้อมูลโดยตรง
        await education.update({
            personalinfo: patcheducation.personalinfo || education.personalinfo,
            education: patcheducation.education || education.education,
        });

        // ดึงข้อมูลใหม่หลังการอัปเดต
        const updatedEducation = await Education.findByPk(educationid, {
            include: [{
                model: EducationLevel,
                attributes: ['educationlevel']
            }]
        });

        const educationformatted = {
            id: updatedEducation.id,
            personalinfo: updatedEducation.personalinfo,
            education: updatedEducation.EducationLevel ? updatedEducation.EducationLevel.educationlevel : updatedEducation.education,
            createdAt: updatedEducation.createdAt,
            updatedAt: updatedEducation.updatedAt,
        };

        res.status(200).send(educationformatted);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
});


router.delete("/:id" , async (req,res) => {
     const educationid = req.params.id;
    try {
        const education = await Education.findByPk(educationid , {
            include : [{
                model : EducationLevel,
                attributes : ['educationlevel']
            }]
        });
        if(!education) return res.status(400).send("ID not found");

        await education.destroy();

        const educationformatted = {
            id: education.id,
            personalinfo : education.personalinfo,
            education: education.EducationLevel ? education.EducationLevel.educationlevel : education.education,
            createdAt: education.createdAt,
            updatedAt: education.updatedAt,
        };

        res.status(200).send(educationformatted);

    } catch (error){
        console.log(error.message);
        res.status(500).send(error.message);
    };
});


export default router;