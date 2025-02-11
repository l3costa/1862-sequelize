const database = require('../models')
const Sequelize = require('sequelize')
const { PessoasService } = require('../services')

const pessoaService = new PessoasService()


class PessoaController {
  static async pegaTodasAsPessoasAtivas(req, res) {
    try {
      const pessoasAtivas = await pessoaService.obterTodosOsRegistros()
      return res.status(200).json(pessoasAtivas)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaTodasAsPessoas(req, res) {
    try {
      const todasAsPessoas = await database.Pessoas.scope('todos').findAll()
      return res.status(200).json(todasAsPessoas)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaUmaPessoa(req, res) {
    const { id } = req.params
    try {
      const umaPessoa = await database.Pessoas.findOne({
        where: {
          id: Number(id)
        }
      })
      return res.status(200).json(umaPessoa)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async criaPessoa(req, res) {
    const novaPessoa = req.body
    try {
      const novaPessoaCriada = await database.Pessoas.create(novaPessoa)
      return res.status(200).json(novaPessoaCriada)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async atualizaPessoa(req, res) {
    const { id } = req.params
    const novasInfos = req.body
    try {
      await database.Pessoas.update(novasInfos, { where: { id: Number(id) } })
      const pessoaAtualizada = await database.Pessoas.findOne({ where: { id: Number(id) } })
      return res.status(200).json(pessoaAtualizada)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async apagaPessoa(req, res) {
    const { id } = req.params
    try {
      await database.Pessoas.destroy({ where: { id: Number(id) } })
      return res.status(200).json({ mensagem: `id ${id} deletado` })

    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaUmaMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params
    try {
      const umaMatricula = await database.Matriculas.findOne({
        where: {
          id: Number(matriculaId),
          estudante_id: Number(estudanteId)
        }
      })
      return res.status(200).json(umaMatricula)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async cancelaPessoa(req, res) {
    const { estudanteId } = req.params
    try {

      await database.sequelize.transaction((transacao) => {
        database.Pessoas.update({ ativo: 0 }, { where: { id: estudanteId } }, { transaction: transacao })

        database.Matriculas.update({ status: 'cancelado' }, { where: { estudante_id: estudanteId } }, { transaction: transacao })

        return res.status(200).json(`Estudante ${estudanteId} cancelado com sucesso`)
      })
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async criaMatricula(req, res) {
    const { estudanteId } = req.params
    const novaMatricula = { ...req.body, estudante_id: Number(estudanteId) }
    try {
      const novaMatriculaCriada = await database.Matriculas.create(novaMatricula)
      return res.status(200).json(novaMatriculaCriada)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async atualizaMatricula(req, res) {
    const { estudanteId, matriculaId } = req.params
    const novasInfos = req.body
    try {
      await database.Matriculas.update(novasInfos, {
        where: {
          id: Number(matriculaId),
          estudante_id: Number(estudanteId)
        }
      })
      const MatriculaAtualizada = await database.Matriculas.findOne({ where: { id: Number(matriculaId) } })
      return res.status(200).json(MatriculaAtualizada)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async apagaMatricula(req, res) {
    const { matriculaId } = req.params
    try {
      await database.Matriculas.destroy({ where: { id: Number(matriculaId) } })
      return res.status(200).json({ mensagem: `id ${matriculaId} deletado` })

    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async obterMatriculasPeloEstudanteId(req, res) {
    const { estudanteId } = req.params
    try {
      const pessoa = await database.Pessoas.findOne({ where: { id: estudanteId } })
      const matriculas = await pessoa.getAulasMatriculadas()

      return res.status(200).json(matriculas)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaMatriculaPorTurma(req, res) {
    const { turmaId } = req.params
    try {
      const todasAsMatriculas = await database.Matriculas.findAndCountAll({
        where: {
          turma_id: turmaId,
          status: 'confirmado'
        },
        limit: 1,
        order: [['estudante_id', 'DESC']]
      })

      return res.status(200).json(todasAsMatriculas)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async pegaTurmaLotada(req, res) {
    const maximo = 2
    try {
      const turmasLotadas = await database.Matriculas.findAndCountAll({
        where: {
          status: 'confirmado'
        },
        attribute: [['turma_id']],
        group: [['turma_id']],
        having: Sequelize.literal(`count(turma_id) >= ${maximo}`)
      })

      return res.status(200).json(turmasLotadas.count)
    } catch (error) {
      return res.status(500).json(error.message)
    }
  }

  static async restauraPessoa(req, res) {
    const { id } = req.params
    try {
      database.Pessoas.restore({ where: { id: id } })
      return res.status(200).json({ 'message': `id ${id} restaurado com sucesso` })
    } catch (error) {
      return res.status(500).json({ 'message': error.mensagem })
    }
  }

}

module.exports = PessoaController