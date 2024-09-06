import express from 'express';
import { Zodiac, Zodiaclist } from '../../models.js';
import { QueryTypes } from 'sequelize';

const router = express.Router();


router.get('/' , async (req,res) => {
    try {
        const zodiac = await Zodiac.findAll({
            include : [{
                model : Zodiaclist,
                attributes : ["zodiaclist"]
            }]
        });
        if(zodiac.length === 0) return res.status(400).send("Not Data to fetch");
        const zodiacformatted = zodiac.map( zodiac => ({
            id : zodiac.id,
            personalinfo : zodiac.personalinfo,
            zodiac : zodiac.Zodiaclist.zodiaclist ? zodiac.Zodiaclist.zodiaclist : zodiac.zodiac,
            createdAt : zodiac.createdAt,
            updatedAt : zodiac.updatedAt,
        }));
        res.status(200).send(zodiacformatted);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    };
});

router.get("/:id", async (req, res) => {
    const zodiacid = req.params.id;
    try {
        const zodiac = await Zodiac.findByPk(zodiacid, {
            include: [{
                model: Zodiaclist, 
                attributes: ['zodiaclist']  
            }]
        });
        if (!zodiac) return res.status(400).send("Id not Found");

        const zodiacformatted = {
            id: zodiac.id,
            personalinfo : zodiac.personalinfo,
            zodiac: zodiac.Zodiaclist.zodiaclist ? zodiac.Zodiaclist.zodiaclist : zodiac.zodiaclist,
            createdAt: zodiac.createdAt,
            updatedAt: zodiac.updatedAt,
        };

        res.status(200).send(zodiacformatted);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    };
});


router.post("/", async (req, res) => {
    try {
        const { zodiac , personalinfo } = req.body;
        if (!zodiac || !personalinfo) return res.status(400).send("Please input all required data");

        const neweezodiac = await Zodiac.create({ personalinfo , zodiac });

        const Queryzodiac = await Zodiac.findByPk(neweezodiac.id , {
            include : [{
                model : Zodiaclist,
                attributes : ['zodiaclist']
            }]
        })

        const zodiaclformatted = {
            id: Queryzodiac.id,
            personalinfo : Queryzodiac.personalinfo,
            zodiac: Queryzodiac.Zodiaclist.zodiaclist ? Queryzodiac.Zodiaclist.zodiaclist : QueryTypes.zodiac ,
            createdAt: Queryzodiac.createdAt,
            updatedAt: Queryzodiac.updatedAt,
        };

        res.status(200).send(zodiaclformatted);

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    };
});

router.patch("/:id", async (req, res) => {
    const zodiacid = req.params.id;
    try {
  
        const zodiac = await Zodiac.findByPk(zodiacid, {
            include: [{
                model: Zodiaclist,
                attributes: ['zodiaclist']
            }]
        });
        if (!zodiac) return res.status(400).send("ID not Found");

  
        const patchzodiac = req.body;

      
        await zodiac.update({
            personalinfo: patchzodiac.personalinfo || zodiac.personalinfo,
            zodiac: patchzodiac.zodiac || zodiac.zodiac,
        });

        const updatedZodiac = await Zodiac.findByPk(zodiacid, {
            include: [{
                model: Zodiaclist,
                attributes: ['zodiaclist']
            }]
        });

        const zodiacformatted = {
            id: updatedZodiac.id,
            personalinfo: updatedZodiac.personalinfo,
            zodiac: updatedZodiac.Zodiaclist.zodiaclist ? updatedZodiac.Zodiaclist.zodiaclist : updatedZodiac.zodiac,
            createdAt: updatedZodiac.createdAt,
            updatedAt: updatedZodiac.updatedAt,
        };

        res.status(200).send(zodiacformatted);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
});

router.delete("/:id" , async (req,res) => {
    const zodiacid = req.params.id;
   try {
       const zodiac = await Zodiac.findByPk(zodiacid , {
           include : [{
               model : Zodiaclist,
               attributes : ['zodiaclist']
           }]
       });
       if(!zodiac) return res.status(400).send("ID not found");

       await zodiac.destroy();

       const zodiacformatted = {
           id: zodiac.id,
           personalinfo : zodiac.personalinfo,
           zodiac: zodiac.Zodiaclist.zodiaclist ? zodiac.Zodiaclist.zodiaclist : zodiac.zodiac,
           createdAt: zodiac.createdAt,
           updatedAt: zodiac.updatedAt,
       };

       res.status(200).send(zodiacformatted);

   } catch (error){
       console.log(error.message);
       res.status(500).send(error.message);
   };
});


export default router;