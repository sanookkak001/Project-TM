import express from 'express';
import { BloodGroup, BloodType } from '../../models.js';

const router = express.Router();

router.get("/", async (req,res) => {
    try {
        const bloodgroup = await BloodGroup.findAll({
            include : [{
                model : BloodType,
                attributes : ['bloodtype']
            }]
        });

        if(bloodgroup.length === 0) return res.status(404).send("ID NOT FOUND");
        const modifiedbloodgroup = bloodgroup.map(bloodgroup => ({
            id : bloodgroup.id,
            personalinfo : bloodgroup.personalinfo,
            type :  bloodgroup.BloodType.bloodtype ? bloodgroup.BloodType.bloodtype : bloodgroup.type, 
            createdAt : bloodgroup.createdAt,
            updatedAt : bloodgroup.updatedAt,
        }));
        res.status(200).send(modifiedbloodgroup);
    } catch (error){
        console.log(error);
        res.status(500).send({ Error: error.message });
    };
});

router.get("/:id", async (req,res) => {
    const bloodgroupid = req.params.id;
    try {
        const bloodgroup = await BloodGroup.findByPk(bloodgroupid , {
            include : [{
                model : BloodType,
                attributes : ['bloodtype']
            }]
        });
        if(!bloodgroup) return res.status(400).send("ID not Found");

        const bloodgroupformatted  = {
            id : bloodgroup.id,
            personalinfo : bloodgroup.personalinfo,
            type :  bloodgroup.BloodType.bloodtype ? bloodgroup.BloodType.bloodtype : bloodgroup.type,
            createdAt : bloodgroup.createdAt,
            updatedAt : bloodgroup.updatedAt,
        };
        res.status(200).send(bloodgroupformatted);
    } catch (error){
        console.log(error.message);
        res.status(500).send("Server internal error");
    };
});

router.post("/", async (req, res) => {
    const { personalinfo, type } = req.body;
    if (!personalinfo || !type) {
        return res.status(400).send("Please provide all required inputs.");
    };

    try {
        const bloodGroup = await BloodGroup.create({ personalinfo, type });

        const newbloodGroup = await BloodGroup.findByPk(bloodGroup.id , {
            include : [{
                model : BloodType,
                attributes : ['bloodtype']
            }]
        })

        const bloodGroupFormatted = {
            id: newbloodGroup.id,
            personalinfo: newbloodGroup.personalinfo,
            type: newbloodGroup.BloodType.bloodtype ? newbloodGroup.BloodType.bloodtype : newbloodGroup.type,
            createdAt: newbloodGroup.createdAt,
            updatedAt: newbloodGroup.updatedAt,
        };

        res.status(201).send(bloodGroupFormatted);
    } catch (error) {
        console.error("Error creating blood group:", error); 
        res.status(500).send("Internal Server Error");
    }
});

router.delete("/:id", async (req,res) => {
    const bloodgroupid = req.params.id;
    try {
        const bloodgroup = await BloodGroup.findByPk(bloodgroupid , {
            include : [{
                model : BloodType,
                attributes : ['bloodtype']
            }]
        });
        if(!bloodgroup) return res.status(400).send("ID NOT FOUND");
        const bloodgroupformatted = {
            id : bloodgroup.id,
            personalinfo : bloodgroup.personalinfo,
            type : bloodgroup.BloodType.bloodtype ? bloodgroup.BloodType.bloodtype : bloodgroup.type,
            createdAt : bloodgroup.createdAt,
            updatedAt : bloodgroup.updatedAt,
        };
        await bloodgroup.destroy();
        res.status(200).send(bloodgroupformatted);
    } catch(error) {
        console.log(error.message);
        res.status(500).send("Server internal error");
    };
});

router.patch("/:id", async (req, res) => {
    const bloodGroupid = req.params.id;
    try {
        const { personalinfo, type } = req.body;

        // ค้นหา bloodGroup จาก id
        const updatedBloodGroup = await BloodGroup.findByPk(bloodGroupid, {
            include: [
                {
                    model: BloodType,
                    attributes: ['bloodtype']
                }
            ]
        });

        if (!updatedBloodGroup) return res.status(404).send("ID not Found");

        // เก็บข้อมูลที่จะอัปเดต
        const updateData = {};
        if (personalinfo) updateData.personalinfo = personalinfo;
        if (type) updateData.type = type;

        // อัปเดตข้อมูลใหม่
        await updatedBloodGroup.update(updateData);

        // รีเฟรชข้อมูลจากฐานข้อมูล
        const refreshedBloodGroup = await BloodGroup.findByPk(bloodGroupid, {
            include: [
                {
                    model: BloodType,
                    attributes: ['bloodtype']
                }
            ]
        });

        // จัดรูปแบบข้อมูลก่อนส่งกลับ
        const BloodgroupFormatted = {
            personalinfo: refreshedBloodGroup.personalinfo,
            type: refreshedBloodGroup.BloodType ? refreshedBloodGroup.BloodType.bloodtype : refreshedBloodGroup.type,
            createdAt: refreshedBloodGroup.createdAt,
            updatedAt: refreshedBloodGroup.updatedAt
        };

        res.status(200).send(BloodgroupFormatted);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ Error: error.message });
    }
});


export default router;