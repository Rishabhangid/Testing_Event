const { EventNotification } = require("./models/eventNotification");

// Create an event notification
const createEventNotification = async (req, res) => {
  try {
    const { message, notificationType, title, userId, url, isActive } = req.body;

    const notification = new EventNotification({
      message,
      notificationType,
      title,
      userId,
      url,
      isActive,
    });

    await notification.save();
    return res.status(201).json({ message: "Notification created successfully.", notification });
  } catch (error) {
    return res.status(400).json({ message: "Error creating notification", error });
  }
};

// Fetch all notifications for a user
const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await EventNotification.find({ userId, isActive: true }).sort({ createdAt: -1 });
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(400).json({ message: "Error fetching notifications", error });
  }
};

// Update a notification's read status or other fields
const updateEventNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const notification = await EventNotification.findByIdAndUpdate(id, updates, { new: true });
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    return res.status(200).json({ message: "Notification updated successfully.", notification });
  } catch (error) {
    return res.status(400).json({ message: "Error updating notification", error });
  }
};

// Delete an event notification
const deleteEventNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await EventNotification.findByIdAndDelete(id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    return res.status(200).json({ message: "Notification deleted successfully." });
  } catch (error) {
    return res.status(400).json({ message: "Error deleting notification", error });
  }
};

module.exports = {
  createEventNotification,
  getNotificationsByUser,
  updateEventNotification,
  deleteEventNotification,
};
