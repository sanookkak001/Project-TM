import express from 'express';
import { HobbyGroup, Hobbylist } from '../../models.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const hobbyGroups = await HobbyGroup.findAll({
            include : [{
                model : Hobbylist,
                attributes : ['hobbylist']
            }]
        });
        
        if (hobbyGroups.length === 0) return res.status(404).send("No hobby groups found");

        const hobbyGroupsFormatted = hobbyGroups.map(hobby => ({
            id: hobby.id,
            personalinfo: hobby.personalinfo,
            hobby: hobby.Hobbylist.hobbylist ? hobby.Hobbylist.hobbylist : hobby.hobby,
            createdAt: hobby.createdAt,
            updatedAt: hobby.updatedAt
        }));

        res.status(200).send(hobbyGroupsFormatted);
    } catch (error) {
        console.error("Error fetching hobby groups:", error);
        res.status(500).send("Internal Server Error");
    };
});


router.get("/:id", async (req, res) => {
    const hobbyId = req.params.id;
    
    try {
        const hobbyGroup = await HobbyGroup.findByPk(hobbyId , {
            include : [{
                model : Hobbylist,
                attributes : ['hobbylist']
            }]
        });
        
        if (!hobbyGroup)  return res.status(404).send("Hobby group not found");

        const hobbyGroupFormatted = {
            id: hobbyGroup.id,
            personalinfo: hobbyGroup.personalinfo,
            hobby: hobbyGroup.Hobbylist.hobbylist ? hobbyGroup.Hobbylist.hobbylist : hobbyGroup.hobby,
            createdAt: hobbyGroup.createdAt,
            updatedAt: hobbyGroup.updatedAt
        };

        res.status(200).send(hobbyGroupFormatted);
    } catch (error) {
        console.error("Error fetching hobby group by ID:", error);
        res.status(500).send("Internal Server Error");
    };
});

router.post("/", async (req,res) => {
    try {
        const { personalinfo , hobby } = req.body;
        if(!personalinfo || !hobby) return res.status(400).send(`Request All Data personalinfo and hobby `);

        const newhobbygroup = await HobbyGroup.create({ personalinfo , hobby });


        const QueryHobby = await HobbyGroup.findByPk(newhobbygroup.id , {
            include : [{
                model :  Hobbylist,
                attributes : ['hobbylist']
            }]
        })

        const newhobbyformate = {
            id : QueryHobby.id,
            personalinfo : QueryHobby.personalinfo,
            hobby  : QueryHobby.Hobbylist.hobbylist ? QueryHobby.Hobbylist.hobbylist : QueryHobby.hobby ,
            createdAt : QueryHobby.createdAt,
            updatedAt : QueryHobby.updatedAt
        };

        res.status(200).send(newhobbyformate);

    } catch(error){
        console.log(error);
        res.status(500).send("Internal Server Error");
    };
});

router.patch("/:id", async (req, res) => {
    const hobbyGroupId = req.params.id;
    try {
        // Find the hobby group by primary key
        const hobbyGroup = await HobbyGroup.findByPk(hobbyGroupId , {
            include : [{
                model : Hobbylist,
                attributes : ['hobbylist']
            }]
        });
        if (!hobbyGroup) {
            return res.status(400).send("ID not Found");
        };

        // Update the hobby group with the new data
        const data = req.body;
        await hobbyGroup.update(data);


        // Prepare the response format
        const patchFormat = {
            id: hobbyGroup.id,
            personalinfo: hobbyGroup.personalinfo,
            hobby : hobbyGroup.Hobbylist.hobbylist ? hobbyGroup.Hobbylist.hobbylist : hobbyGroup.hobby,
            createdAt: hobbyGroup.createdAt,
            updatedAt: hobbyGroup.updatedAt,
        };

        // Send the response
        res.status(200).send(patchFormat);

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});


router.delete("/:id", async (req,res) => {
    const hobbyid = req.params.id;
    try {
        const hobbyIDdelete = await HobbyGroup.findByPk(hobbyid);
        if(!hobbyIDdelete) return res.status(400).send("ID not Found");
        const hobbygroupformate = {
            id : hobbyIDdelete.id,
            personalinfo : hobbyIDdelete.personalinfo,
            hobby : hobbyIDdelete.hobby,
            createdAt : hobbyIDdelete.createdAt,
            updatedAt : hobbyIDdelete.updatedAt
        };
        await hobbyIDdelete.destroy();
        res.status(200).send(hobbygroupformate);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    };
});

export default router;