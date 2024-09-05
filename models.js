import { Sequelize, DataTypes } from "sequelize";

// Initialize Sequelize
export const sequelize = new Sequelize("gf", "root", "12345678", {
    host: "localhost",
    dialect: "mysql",
    timezone: "+07:00",
    logging: console.log, // Enable logging for better debugging
});

// Authenticate the connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

// Define models

// PersonalInfo Model
export const PersonalInfo = sequelize.define("PersonalInfo", {
    username: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        unique: true,
    },
    firstname: {
        type: DataTypes.STRING,
    },
    surname: {
        type: DataTypes.STRING,
    },
    height: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return formatDateT(this.getDataValue('birthday'));
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return formatDateT(this.getDataValue('createdAt'));
        }
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return formatDateT(this.getDataValue('updatedAt'));
        }
    }
}, {
    tableName: "personalinfo"
});

// BloodGroup Model
export const BloodGroup = sequelize.define("BloodGroup", {
    personalinfo: {
        type: DataTypes.INTEGER,
        unique: true,
        references: {
            model: PersonalInfo,
            key: "id"
        }
    },
    type: {
        type: DataTypes.INTEGER,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return formatDateT(this.getDataValue('createdAt'));
        }
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return formatDateT(this.getDataValue('updatedAt'));
        }
    }
}, {
    tableName: "bloodgroup"
});

// BloodType Model
export const BloodType = sequelize.define('BloodType', {
    bloodtype : {
        type : DataTypes.STRING,
        unique : true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return formatDateT(this.getDataValue('createdAt'));
        }
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return formatDateT(this.getDataValue('updatedAt'));
        }
    }
} , {
    tableName : "bloodtype"
});

// Hobbylist
export const Hobbylist = sequelize.define("Hobbylist" , {
    hobbylist : {
        type : DataTypes.STRING(255),
        unique  : true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return formatDateT(this.getDataValue('createdAt'));
        }
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return formatDateT(this.getDataValue('updatedAt'));
        }
    }
},{
    tableName : "hobbylist"
});

// Hobbit Model
export const HobbyGroup =  sequelize.define('HobbyGroup' , {
    personalinfo: {
        type: DataTypes.INTEGER,
        unique: false,
        references: {
            model: PersonalInfo,
            key: "id"
        }
    },
    hobby : {
        type : DataTypes.INTEGER,
        unique : false,
        references : {
            model : Hobbylist,
            foreignKey : "id"
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return formatDateT(this.getDataValue('createdAt'));
        }
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return formatDateT(this.getDataValue('updatedAt'));
        }
    }
} , {
    tableName : "hobbyGroup"
});


// EducationLevel

export const EducationLevel = sequelize.define("EducationLevel" , {
    educationlevel : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return formatDateT(this.getDataValue('createdAt'));
        }
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return formatDateT(this.getDataValue('updatedAt'));
        }
    }
} , {
    tableName: "educationlevel"
});

// EducationTable 

export const Education = sequelize.define("Education" , {
    personalinfo : {
        type : DataTypes.INTEGER,
        unique : false,
        allowNull : true,
        references : {
            model : PersonalInfo,
            foreignKey : "id"
        }
    },
    education: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: EducationLevel, 
            key: "id"
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return formatDateT(this.getDataValue('createdAt'));
        }
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
            return formatDateT(this.getDataValue('updatedAt'));
        }
    }
} , {
    tableName : "education"
});


// Helper functions

function padZero(num) {
    return num < 10 ? `0${num}` : num;
}

export function formatDateT(isoDateString) {
    const date = new Date(isoDateString);
    const formattedDate = `${padZero(date.getDate())}-${padZero(date.getMonth() + 1)}-${padZero(date.getFullYear())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
    return formattedDate;
}

// Define associations

BloodType.hasMany(BloodGroup, {foreignKey: "type", onUpdate: "CASCADE", onDelete: "CASCADE" });  
BloodGroup.belongsTo(BloodType, {foreignKey: "type", onUpdate: "CASCADE", onDelete: "CASCADE"});

// Define associations
PersonalInfo.hasOne(BloodGroup, { foreignKey: "personalinfo", onUpdate: "CASCADE", onDelete: "CASCADE" });
BloodGroup.belongsTo(PersonalInfo, { foreignKey: "personalinfo", onUpdate: "CASCADE", onDelete: "CASCADE" });

  
Hobbylist.hasMany(HobbyGroup, { foreignKey : "hobby"});
HobbyGroup.belongsTo(Hobbylist, { foreignKey : "hobby"});

PersonalInfo.hasMany(HobbyGroup, { foreignKey : "personalinfo", onUpdate: "CASCADE", onDelete: "CASCADE" });
HobbyGroup.belongsTo(PersonalInfo, { foreignKey : "personalinfo", onUpdate: "CASCADE", onDelete: "CASCADE" });

// Define Education to EducationLevel

EducationLevel.hasMany(Education, { foreignKey : "education"});
Education.belongsTo(EducationLevel, { foreignKey : "education"});


// Define PersonalInfo to Education

PersonalInfo.hasOne(Education, { foreignKey : "personalinfo", onUpdate: "CASCADE", onDelete: "CASCADE" });
Education.belongsTo(PersonalInfo, { foreignKey: "personalinfo", onUpdate: "CASCADE", onDelete: "CASCADE" });