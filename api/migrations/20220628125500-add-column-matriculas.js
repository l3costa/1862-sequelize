'use strict'
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Matriculas', 'deletedAt', {
            type: Sequelize.DATE,
            allowNull: true
        })
    },
    down: (queryInterface) => {
        return queryInterface.removeColumn('Matriculas', 'deletedAt')
    }
}