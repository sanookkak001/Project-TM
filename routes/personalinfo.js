import express from 'express';
import { BloodGroup, BloodType, HobbyGroup, Hobbylist, PersonalInfo } from '../models.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const personalInfo = await PersonalInfo.findAll({
            // include: [
            //     {
            //         model: BloodGroup,
            //         include: [{
            //             model: BloodType,
            //             attributes: ['bloodtype'],
            //         }],
            //         attributes: ['type']
            //     },
            //     {
            //         model: HobbyGroup,
            //         include: [{
            //             model: Hobbylist,
            //             attributes: ['hobbylist'],
            //         }],
            //         attributes: ['hobby']
            //     }
            // ]
        });

        const modifiedPersonalInfo = personalInfo.map(person => ({
            id: person.id,
            username: person.username,
            password: person.password,
            email: person.email,
            phone: person.phone,
            firstname: person.firstname,
            surname: person.surname,
            height: person.height,
            birthday: person.birthday,
            // bloodgroup: person.BloodGroup && person.BloodGroup.BloodType ? person.BloodGroup.BloodType.bloodtype : null,
            // hobbygroup: person.HobbyGroups ? person.HobbyGroups.map(hg => ({
            //     hobbylist: hg.Hobbylist ? hg.Hobbylist.hobbylist : null
            // })) : [],
            createdAt: person.createdAt,
            updatedAt: person.updatedAt,
        }));

        res.status(200).send(modifiedPersonalInfo);
    } catch (error) {
        console.log(error);
        res.status(500).send({ Error: error.message });
    }
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


router.patch("/:id", async (req, res) => {
    const personalInfoId = req.params.id;
    try {
  
        const personalInfo = await PersonalInfo.findByPk(personalInfoId);
        if (!personalInfo) return res.status(400).send("ID not Found");

        const patchpersonalInfo = req.body;

        await personalInfo.update({
            username: patchpersonalInfo.username || personalInfo.username,
            password: patchpersonalInfo.password || personalInfo.password,
            email: patchpersonalInfo.email || personalInfo.email,
            phone: patchpersonalInfo.phone || personalInfo.phone,
            firstname: patchpersonalInfo.firstname || personalInfo.firstname,
            surname: patchpersonalInfo.surname || personalInfo.surname,
            height : patchpersonalInfo.height || personalInfo.height,
            birthday: patchpersonalInfo.birthday || personalInfo.birthday,
        });

        const personalInformatted = {
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

        res.status(200).send(personalInformatted);

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
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