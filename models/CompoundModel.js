module.exports = (sequelize, Sequelize) => {

    const Compound = sequelize.define("compounds", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement:true,
            primaryKey: true
        },
        CompoundName: {
            type: Sequelize.STRING
        },
        CompoundDescription: {
            type: Sequelize.TEXT
        },
        strImageSource: {
            type: Sequelize.STRING
        },
        strImageAttribution: {
            type: Sequelize.TEXT
        }
    })

    return Compound;

}