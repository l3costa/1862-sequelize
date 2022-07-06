const database = require('../models')

class Services {
    constructor(nomeModelo) {
        this.nomeModelo = nomeModelo
    }

    async obterTodosOsRegistros() {
        return database[this.nomeModelo].findAll()
    }
}

module.exports = Services