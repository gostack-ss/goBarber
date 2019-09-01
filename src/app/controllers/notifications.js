import Notification from '../schema/notification'
import User from '../models/user'

class NotificationController {
  async index(req, res) {
    const provider = await User.findOne({
      where: { id: req.userId, provider: true },
    })
    if (!provider) {
      return res
        .status(401)
        .json({ error: 'only providers can load notifications' })
    }
    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20)
    return res.json(notifications)
  }

  async update(req, res) {
    const notifications = await Notification.findByIdAndUpdate(req.params.id, {
      read: true,
      new: true,
    })
    res.json(notifications)
  }
}

export default new NotificationController()
