import express from 'express';
import { Zodiaclist } from '../../models.js';

const router = express.Router();

router.get('/' , async (req,res) => {
    try {
        const zodiaclist = await Zodiaclist.findAll();
        if(zodiaclist.length === 0) return res.status(400).send("Not Data to fetch");
        const zodiaclistformatted = zodiaclist.map( zodiaclist => ({
            id : zodiaclist.id,
            zodiaclist : zodiaclist.zodiaclist,
            createdAt : zodiaclist.createdAt,
            updatedAt : zodiaclist.updatedAt,
        }));
        res.status(200).send(zodiaclistformatted);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    };
});

router.get("/:id", async (req, res) => {
    const zodiaclistid = req.params.id;
    try {
        const zodiaclist = await Zodiaclist.findByPk(zodiaclistid);
        if (!zodiaclist) return res.status(400).send("Id not Found");

        const zodiaclistformatted = {
            id : zodiaclist.id,
            zodiaclist : zodiaclist.zodiaclist,
            createdAt: zodiaclist.createdAt,
            updatedAt: zodiaclist.updatedAt,
        };

        res.status(200).send(zodiaclistformatted);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    };
});

router.post("/", async (req, res) => {
    try {
        const { zodiaclist } = req.body;
        if (!zodiaclist) return res.status(400).send("Please input all required data");

        const neweezodiaclist = await Zodiaclist.create({ zodiaclist });

        const zodiaclistlformatted = {
            id: neweezodiaclist.id,
            zodiaclist: neweezodiaclist.zodiaclist,
            createdAt: neweezodiaclist.createdAt,
            updatedAt: neweezodiaclist.updatedAt,
        };

        res.status(200).send(zodiaclistlformatted);

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    };
});

router.patch("/:id", async (req, res) => {
    const zodiaclistid = req.params.id;
    try {
  
        const zodiaclist = await Zodiaclist.findByPk(zodiaclistid);
        if (!zodiaclist) return res.status(400).send("ID not Found");

        const patchezodiaclist = req.body;


        await zodiaclist.update({
            zodiaclist: patchezodiaclist.zodiaclist || zodiaclist.zodiaclist,
        });
        const zodiaclistformatted = {
            id: zodiaclist.id,
            zodiaclist: zodiaclist.zodiaclist,
            createdAt: zodiaclist.createdAt,
            updatedAt: zodiaclist.updatedAt,
        };

        res.status(200).send(zodiaclistformatted);

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    };
});

router.delete("/:id" , async (req,res) => {
    const zodiaclistid = req.params.id;
   try {
       const zodiaclist = await Zodiaclist.findByPk(zodiaclistid);
       if(!zodiaclist) return res.status(400).send("ID not found");

       await zodiaclist.destroy();

       const zodiaclistformatted = {
            id: zodiaclist.id,
            zodiaclist: zodiaclist.zodiaclist,
            createdAt: zodiaclist.createdAt,
            updatedAt: zodiaclist.updatedAt,
       };

       res.status(200).send(zodiaclistformatted);

   } catch (error){
       console.log(error.message);
       res.status(500).send(error.message);
   };
});

export default router