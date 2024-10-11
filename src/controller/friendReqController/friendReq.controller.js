const FriendRequest = require('../../model/friendReqSchema/friendReqSchema');
const User = require('../../model/userSchema/userSchema');

// Send friend request
const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const { senderId } = req.body;

    const friendRequest = new FriendRequest({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    });

    await friendRequest.save();
    res.status(200).json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending friend request' });
  }
};

// Accept friend request
const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await FriendRequest.findById(requestId);

    if (!request || request.status !== 'pending') {
      return res.status(400).json({ error: 'Invalid request' });
    }

    request.status = 'accepted';
    await request.save();

    const sender = await User.findById(request.sender);
    const receiver = await User.findById(request.receiver);

    sender.friends.push(receiver._id);
    receiver.friends.push(sender._id);

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ error: 'Error accepting friend request' });
  }
};

// View all pending friend requests
const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await FriendRequest.find({
      receiver: userId,
      status: 'pending'
    }).populate('sender', 'username email');

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching friend requests' });
  }
};

// View the friend list
const getFriendsList = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate('friends', 'username email');

    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching friends list' });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getFriendsList
};
