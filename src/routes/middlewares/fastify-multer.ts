import { randomBytes } from 'crypto'
import multer from 'fastify-multer'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'temp/')
  },

  filename: function (req, file, cb) {
    // Extração da extensão do arquivo original:
    const extensaoArquivo = file.originalname.split('.')[1]

    // Cria um código randômico que será o nome do arquivo
    const novoNomeArquivo = randomBytes(64).toString('hex')

    // Indica o novo nome do arquivo:
    cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
  },
})

export const upload = multer({ storage })
