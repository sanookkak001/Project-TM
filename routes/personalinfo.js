import express from 'express';
import { BloodGroup, PersonalInfo } from '../models.js';

const router = express.Router();

router.get("/",async (req,res) => {
    try {
        const personalInfo = await PersonalInfo.findAll();
        const modifieedPersonalInfo = personalInfo.map(personalInfo => ({
            id : personalInfo.id,
            username : personalInfo.username,
            password : personalInfo.password,
            email : personalInfo.email,
            phone : personalInfo.phone,
            firstname : personalInfo.firstname,
            surname  : personalInfo.surname,
            height : personalInfo.height,
            birthday : personalInfo.birthday,
            createdAt : personalInfo.createdAt,
            updatedAt : personalInfo.updatedAt,
        }));
        res.status(200).send(modifieedPersonalInfo);
    } catch (error){
        console.log(error);
        res.status(500).send({ Error: error.message });
    };
});


router.get("/:id", async (req, res) => {
    const personalInfoId = req.params.id;

    try {
        const personalInfo = await PersonalInfo.findByPk(personalInfoId);

        if (!personalInfo) {
            return res.status(404).send({ Error: "ID not found" });
        };

        const modifiedPersonalInfo = {
            id: personalInfo.id,
            username: personalInfo.username,
            password: personalInfo.password,
            email: personalInfo.email,
            phone: personalInfo.phone,
            firstname: personalInfo.firstname,
            surname: personalInfo.surname,
            height : personalInfo.height,
            birthday: personalInfo.birthday,
            createdAt: personalInfo.createdAt,
            updatedAt: personalInfo.updatedAt,
        };

        res.status(200).send(modifiedPersonalInfo);
    } catch (error) {
        console.log(error);
        res.status(500).send({ Error: error.message });
    };
});

router.post("/", async (req, res) => {
    try {
        const { username, password, email, phone, firstname, surname, birthday, height, bloodType } = req.body;

       
        if (!username || !password || !email || !phone || !firstname || !surname || !birthday || !height) {
            return res.status(400).send({ Error: "Please input all required data" });
        };

       
        const parsedBirthday = new Date(birthday);
        if (isNaN(parsedBirthday.getTime())) {
            return res.status(400).send({ Error: "Invalid date format for birthday. Use MM-DD-YYYY HH:mm:ss" });
        };

        const newPersonalInfo = await PersonalInfo.create({
            username,
            password,
            email,
            phone,
            firstname,
            surname,
            height,
            birthday: parsedBirthday,
        });

        const newBloodGroup = await BloodGroup.create({
            personalinfo: newPersonalInfo.id,
            type: bloodType
        });
     
        const newPersonalInfoFormatted = {
            id: newPersonalInfo.id,
            username: newPersonalInfo.username,
            password: newPersonalInfo.password,
            email: newPersonalInfo.email,
            phone: newPersonalInfo.phone,
            firstname: newPersonalInfo.firstname,
            surname: newPersonalInfo.surname,
            height : newPersonalInfo.height,
            birthday: newPersonalInfo.birthday,
            createdAt: newPersonalInfo.createdAt,
            updatedAt: newPersonalInfo.updatedAt,
        };

        res.status(201).send(newPersonalInfoFormatted);
    } catch (error) {
        console.log(error);
        res.status(500).send({ Error: error.message });
    };
});

router.delete('/:id', async (req, res) => {
    const personalInfoid = req.params.id;
    try {
        const personalInfo = await PersonalInfo.findByPk(personalInfoid);

        if (!personalInfo) {
            return res.status(404).send("ID not found");
        }

        await personalInfo.destroy(); 
        
        const responseFormatted = {
            status: "Delete was completed",
            id: personalInfo.id,
            username: personalInfo.username,
            email: personalInfo.email,
            phone: personalInfo.phone,
            firstname: personalInfo.firstname,
            surname: personalInfo.surname,
            height : personalInfo.height,
            birthday: personalInfo.birthday,
            createdAt: personalInfo.createdAt,
            updatedAt: personalInfo.updatedAt,
        };

        res.status(200).send(responseFormatted);

    } catch (error) {
        console.log({ Error: error.message });
        res.status(500).send({ Error: error.message });
    }
});

export default router;