import User from '../models/user'

class UserController {
  async store(req, res) {
    const userExist = await User.findOne({ where: { email: req.body.email } })
    if (userExist) {
      return res.status(400).json({ error: 'user already exists.' })
    }

    const { id, name, email, provider } = await User.create(req.body)
    return res.json({
      id,
      name,
      email,
      provider,
    })
  }

  async update(req, res) {
    const { email, oldPassword } = req.body

    const user = await User.findByPk(req.userId)

    if (user.email !== email) {
      const userExist = await User.findAll({ where: { email } })
      if (userExist.length) {
        return res.status(401).json({ error: 'User already exists' })
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' })
    }
    const { id, name, provider } = await user.update(req.body)
    return res.json({
      id,
      name,
      email,
      provider,
    })
  }
}

export default new UserController()
