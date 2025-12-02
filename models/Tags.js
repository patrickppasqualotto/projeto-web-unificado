module.exports = (sequelize, DataTypes) => {
    const Tags = sequelize.define('Tags', {
        id_tag: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        tableName: 'Tags'
    });
    return Tags;
}