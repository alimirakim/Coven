'use strict';
module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define('Topic', {
    name: {
      type: DataTypes.STRING(40),
      allowNull: false
    }
  }, {});
  Topic.associate = function (models) {
    // associations can be defined here
  };
  return Topic;
};