import Notification from "../../model/notification.model.js";

const serialize = (notification, userId) => ({
  ...notification,
  id: notification._id,
  read: notification.readBy?.some((id) => String(id) === String(userId)),
  time: new Date(notification.createdAt).toLocaleDateString("en-IN"),
});

export const getNotifications = async (req, res) => {
  try { const data = await Notification.find().sort({ createdAt: -1 }).lean(); return res.json({ success: true, data: data.map((item) => serialize(item, req.user._id)) }); }
  catch (error) { return res.status(500).json({ success: false, message: "Failed to load notifications", error: error.message }); }
};

export const createNotification = async (req, res) => {
  try { const { title, message, type = "INFO" } = req.body; if (!title?.trim() || !message?.trim()) return res.status(400).json({ success: false, message: "Title and message are required" }); const item = await Notification.create({ title: title.trim(), message: message.trim(), type, createdBy: req.user._id }); return res.status(201).json({ success: true, data: serialize(item.toObject(), req.user._id) }); }
  catch (error) { return res.status(500).json({ success: false, message: "Failed to create notification", error: error.message }); }
};

export const updateNotification = async (req, res) => {
  try { const { title, message, type } = req.body; const item = await Notification.findByIdAndUpdate(req.params.id, { $set: { title: title?.trim(), message: message?.trim(), type } }, { new: true, runValidators: true }).lean(); if (!item) return res.status(404).json({ success: false, message: "Notification not found" }); return res.json({ success: true, data: serialize(item, req.user._id) }); }
  catch (error) { return res.status(500).json({ success: false, message: "Failed to update notification", error: error.message }); }
};

export const deleteNotification = async (req, res) => {
  try { const item = await Notification.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ success: false, message: "Notification not found" }); return res.json({ success: true, message: "Notification deleted successfully" }); }
  catch (error) { return res.status(500).json({ success: false, message: "Failed to delete notification", error: error.message }); }
};

export const markNotificationRead = async (req, res) => {
  try { const item = await Notification.findByIdAndUpdate(req.params.id, { $addToSet: { readBy: req.user._id } }, { new: true }).lean(); if (!item) return res.status(404).json({ success: false, message: "Notification not found" }); return res.json({ success: true, data: serialize(item, req.user._id) }); }
  catch (error) { return res.status(500).json({ success: false, message: "Failed to mark notification read", error: error.message }); }
};

export const markAllNotificationsRead = async (req, res) => {
  try { await Notification.updateMany({}, { $addToSet: { readBy: req.user._id } }); return res.json({ success: true, message: "All notifications marked as read" }); }
  catch (error) { return res.status(500).json({ success: false, message: "Failed to mark notifications read", error: error.message }); }
};