const FriendRequest = require('../../model/friendReqSchema/friendReqSchema');
const User = require('../../model/userSchema/userSchema');

// Send friend request
const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

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
    }).populate('sender', 'name username email');

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching friend requests' });
  }
};



// view all sent friend request 

const getSentFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await FriendRequest.find({
      sender: userId,
      status: 'pending'
    }).populate('receiver', 'name username email');

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching friend requests' });
  }
};


// View the friend list
const getFriendsList = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate('friends');

    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching friends list' });
  }
};


// View the friend
const getSingleFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const friendId = req.params.friendId;

    const user = await User.findById(userId)
      .populate({
        path: 'friends',
        select: '-password'
      });

    const singleFriend = user.friends.find(friend => friend._id.toString() === friendId)

    if (singleFriend) {
      res.status(200).json(singleFriend);
    } else {
      res.status(404).json({ error: 'Friend not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching friend' });
  }
};



// get all users 
const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentUser = await User.findById(userId).populate('friends');
    const friendsIds = currentUser.friends.map(friend => friend._id);
    const sentRequests = await FriendRequest.find({ sender: userId }).select('receiver');
    const receivedRequests = await FriendRequest.find({ receiver: userId }).select('sender');
    const requestedUserIds = sentRequests.map(req => req.receiver.toString());
    const receivedUserIds = receivedRequests.map(req => req.sender.toString());
    const excludeIds = [...friendsIds, ...requestedUserIds, ...receivedUserIds, userId];
    const users = await User.find({
      _id: { $nin: excludeIds }
    }).select('-password');

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};



module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getSentFriendRequest,
  getFriendsList,
  getSingleFriend,
  getAllUsers
};
