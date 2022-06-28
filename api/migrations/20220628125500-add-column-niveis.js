'use strict'
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Niveis', 'deletedAt', {
            type: Sequelize.DATE,
            allowNull: true
        })
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn('Niveis', 'deletedAt')
    }
}