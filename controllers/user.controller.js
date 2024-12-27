import User from '../models/User.js';

// Existing function to get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Existing function to update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, addresses } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.addresses = addresses || user.addresses;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        addresses: updatedUser.addresses
      });
    } else {
      console.log('User not found');
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// New function to add an address
export const addAddress = async (req, res) => {
  try {
    const address = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      user.addresses.push(address);

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        addresses: updatedUser.addresses || [], // Ensure addresses is an array
      });
    } else {
      console.log('User not found');
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
