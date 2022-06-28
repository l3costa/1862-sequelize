'use strict'
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Pessoas', 'deletedAt', {
            type: Sequelize.DATE,
            allowNull: true
        })
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn('Pessoas', 'deletedAt')
    }
}