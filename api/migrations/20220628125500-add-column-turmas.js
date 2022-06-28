'use strict'
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Turmas', 'deletedAt', {
            type: Sequelize.DATE,
            allowNull: true
        })
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn('Turmas', 'deletedAt')
    }
}