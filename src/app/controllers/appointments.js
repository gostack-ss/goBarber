import * as Yup from 'yup'
import { startOfHour, parseISO, isBefore } from 'date-fns'

import Appointment from '../models/appointments'
import User from '../models/user'

class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    })
    const { provider_id, date } = req.body

    const provider = await User.findOne({
      where: { id: provider_id, provider: true },
    })
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' })
    }
    if (!provider) {
      return res
        .status(401)
        .json({ error: 'you can only create appointments with providers' })
    }

    const hourStart = startOfHour(parseISO(date))

    if (isBefore(hourStart, new Date())) {
      return res.status(401).json({ error: 'Past dates are not permitted' })
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    })

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' })
    }
    const appointment = await Appointment.create({
      user_id: req.user_id,
      provider_id,
      date,
    })
    return res.json(appointment)
  }

  async index(req, res) {
    const appointments = await Appointment.findAll({
      where: { user_id: req.userId },
    })
    res.json(appointments)
  }
}

export default new AppointmentController()
