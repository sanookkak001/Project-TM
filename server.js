import express from 'express';
import { configDotenv } from 'dotenv';
import {sequelize, Zodiac } from '../gf/models.js';
import PersonalInforouter from '../gf/routes/personalinfo.js';
import BloodTyperouter from './routes/Blood/bloodtype.js';
import BloodGrouprouter from './routes/Blood/bloodgroup.js';
import HobbyGrouprouter from './routes/Hobby/hobbygroup.js';
import HobbyListrouter from './routes/Hobby/hobbylist.js';
import Educationrouter from './routes/Education/education.js';
import EducationLevelrouter from './routes/Education/educationlevel.js';
import Zodiaclistrouter from './routes/Zodiac/zodiaclist.js';
import Zodiacrouter from './routes/Zodiac/zodiac.js';
import Imagerouter from "./routes/Image/Image.js";
configDotenv();
const { Port } = process.env;
const app = express();

app.use(express.json());

app.use('/personalinfo',PersonalInforouter);
app.use('/bloodtype',BloodTyperouter);
app.use('/bloodgroup',BloodGrouprouter);
app.use('/hobbygroup',HobbyGrouprouter);
app.use('/hobbylist',HobbyListrouter);
app.use('/education', Educationrouter);
app.use('/educationlevel', EducationLevelrouter);
app.use('/zodiaclist' , Zodiaclistrouter);
app.use('/zodiac' , Zodiacrouter);
app.use('/image', Imagerouter);

app.get('/',(req,res)=>{
    res.send("Hello World");
});


app.listen(`${Port}`, async()=>{
    console.log(`This Server is Running on ${Port}`);
    await sequelize.sync({force : false });
});

