import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'

import FileController from './app/controllers/file'
import UserController from './app/controllers/user'
import SessionController from './app/controllers/session'
import ProviderController from './app/controllers/provider'
import AppointmentController from './app/controllers/appointments'
import authMiddleware from './app/middlewares/auth'

const routes = new Router()
const upload = multer(multerConfig)

// rotas publicas
routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(authMiddleware)

// rotas privadas
routes.put('/users', UserController.update)

routes.get('/providers', ProviderController.index)

routes.post('/files', upload.single('file'), FileController.store)

routes.get('/appointments', AppointmentController.index)
routes.post('/appointments', AppointmentController.store)

export default routes
