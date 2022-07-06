const database = require('../models')

class Services {
    constructor(nomeModelo) {
        this.nomeModelo = nomeModelo
        this.modelo = database[this.nomeModelo]
    }

    async obterTodosOsRegistros() {
        return this.modelo.findAll()
    }

    async obterRegistroPorID(id) {
        return this.modelo.findOne({ where: { id: Number(id) } })
    }

    async criarRegistro(registro) {
        return this.modelo.create(registro)
    }

    async apagarRegistro(id) {
        return this.modelo.destroy({ where: { id: Number(id) } })
    }

    async atualizarRegistro(registro, id) {
        return this.modelo.update(registro, { where: { id: Number(id) } })
    }
}

module.exports = Services