const Message = require("../../model/messageSchema/messageSchema");

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user.id;

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content
    });

    await message.save();
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending message' });
  }
};

// Get all messages between two users
const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    })
      .sort('timestamp')
      .populate('sender')
      .populate('receiver');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

module.exports = {
  sendMessage,
  getMessages
}
