import express from 'express';
import { BloodType } from '../../models.js';

const router = express.Router();

router.get("/", async (req,res) => {
    try {
        const BloodTypes = await BloodType.findAll();

        if (!BloodTypes.length) return res.status(404).send("Not found anything");

        const bloodtypeFormatted = BloodTypes.map(BloodType => ({
            id : BloodTypes.id,
            bloodtype : BloodType.bloodtype,
            createdAt : BloodType.createdAt,
            updatedAt : BloodType.updatedAt
        }));

        res.status(200).send(bloodtypeFormatted);             

    } catch (error){
        console.log(error);
        res.status(500).send({ Error: error.message });
    }
});


router.get("/:id", async(req,res) => {
    const bloodtypeid = req.params.id;
    try {
        const Bloodtypeid = await BloodType.findByPk(bloodtypeid);
        if(!Bloodtypeid) return res.status(404).send("Ths ID not found");
        const bloodtypeFormatted = {
            id : Bloodtypeid.id,
            bloodtype : Bloodtypeid.bloodtype,
            createdAt : Bloodtypeid.createdAt,
            updatedAt : Bloodtypeid.updatedAt
        }
        res.status(200).send(bloodtypeFormatted);
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ Error: error.message });
    };
});

router.post("/", async (req,res) => {
    const { bloodtype } = req.body;
    try {
        if(!bloodtype) return res.status(404).send("Request infomation");
        const bloodtypecreate = await BloodType.create({
            bloodtype
        });
        const bloodtypeFormatted = {
            id : bloodtypecreate.id,
            bloodtype : bloodtypecreate.bloodtype,
            createdAt : bloodtypecreate.createdAt,
            updatedAt : bloodtypecreate.updatedAt
        };
        res.status(200).send(bloodtypeFormatted);
    } catch(error){
        console.log(error.message);
        res.status(500).send({ Error: error.message });
    };
});

router.delete("/:id" , async (req,res) => {
    const bloodtypeid = req.params.id;
    try {
        const bloodtypedeleted = await BloodType.findByPk(bloodtypeid);
        if(!bloodtypedeleted) return res.status(404).send("this id not found");
        await bloodtypedeleted.destroy();

        const bloodtypedeletedformatted = {
            id : bloodtypedeleted.id,
            bloodtype : bloodtypedeleted.bloodtype,
            createdAt : bloodtypedeleted.createdAt,
            updatedAt : bloodtypedeleted.updatedAt
        };
        res.status(200).send(bloodtypedeletedformatted);
    } catch (error){
        console.log(error.message);
        res.status(500).send({ Error : error.message });
    };
});

router.patch("/:id", async (req, res) => {
    const bloodTypeid = req.params.id;
    try {
        const bloodtype = req.body;

        const updatedBloodType = await BloodType.findByPk(bloodTypeid);
        if (!updatedBloodType) return res.status(404).send("ID not Found");

        await updatedBloodType.update(bloodtype);

        const BloodGtypeformated = {
            bloodtype: updatedBloodType.bloodtype, 
            updatedAt: updatedBloodType.updatedAt
        };

        res.status(200).send(BloodGtypeformated);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ Error: error.message });
    };
});


export default router;