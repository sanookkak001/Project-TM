import express from "express";
import { Hobbylist } from "../../models.js";

const router = express.Router();

router.get("/", async (req,res) => {
    try {
        const hobbylist = await Hobbylist.findAll();
        const hobbylistformate = hobbylist.map(hobby => ({
            id : hobby.id,
            hobbylist : hobby.hobbylist,
            createdAt : hobby.createdAt,
            updatedAt : hobby.updatedAt
        }));
        res.status(200).send(hobbylistformate);
    } catch (error){
        console.log({ Error: error.message });
        res.status(500).send({ Error: error.message });
    }
});

router.get('/:id', async (req,res) => {
    const hobbylistid = req.params.id;
    try {
        const hobbylist = await Hobbylist.findByPk(hobbylistid);
        if(!hobbylist) return res.status(400).send("ID not Found");
        
        const hobbygroupformate = {
            id : hobbylist.id,
            hobbylist : hobbylist.hobbylist,
            createdAt : hobbylist.createdAt,
            updatedAt : hobbylist.updatedAt
        };

        res.status(200).send(hobbygroupformate);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    };
});

router.post("/", async (req,res) => {
    try {
        const { hobbylist } = req.body;
        if(!hobbylist) return res.status(400).send("Pls enter hobbylist");

        const newhobbylist = await Hobbylist.create({ hobbylist });

        const hobbylistformate = {
            id : newhobbylist.id,
            hobbylist : newhobbylist.hobbylist,
            createdAt : newhobbylist.createdAt,
            updatedAt : newhobbylist.updatedAt 
        };
        res.status(200).send(hobbylistformate);

    } catch(error){
        console.log(error.message);
        res.status(500).send(error.message);
    };
});

router.patch("/:id", async (req, res) => {
    const hobbylistid = req.params.id;
    try {
        const patchhobbylist = await Hobbylist.findByPk(hobbylistid);
        if (!patchhobbylist) return res.status(400).send("ID Not Found");

        const hobbylistData = req.body;
        if (!hobbylistData || Object.keys(hobbylistData).length === 0) {
            return res.status(400).send({ message: "No data provided for update" });
        }

        const hobbylistformate = {
            id : patchhobbylist.id,
            hobbylist : hobbylistData.hobbylist,
            createdAt : patchhobbylist.createdAt,
            updatedAt : patchhobbylist.updatedAt 
        }

        await patchhobbylist.update(hobbylistData);

        res.status(200).send(hobbylistformate);

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
});


router.delete("/:id", async (req,res) => {
    const hobbylistid = req.params.id;
    try {
        const hobbylist = await Hobbylist.findByPk(hobbylistid);
        if(!hobbylist) return res.status(400).send("ID not Found");

        const hobbygroupformate = {
            id : hobbylist.id,
            hobbylist : hobbylist.hobbylist,
            createdAt : hobbylist.createdAt,
            updatedAt : hobbylist.updatedAt
        };
        await hobbylist.destroy();
        res.status(200).send(hobbygroupformate);

    } catch (error){
        console.log(error.message);
        res.status(500).send(error.message);
    };
});

export default router;
