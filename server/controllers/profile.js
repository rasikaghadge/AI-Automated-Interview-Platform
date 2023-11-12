
import Profile from '../models/ProfileModel.js';
import User from '../models/userModel.js';

 
export const getProfiles = async (req, res) => { 
  try {
      const page = parseInt(req.query.page) || 1; // Current page (default to 1 if not provided)
      const limit = parseInt(req.query.limit) || 10; // Number of profiles per page (default to 10 if not provided)
      const skip = (page - 1) * limit; // Calculate the number of profiles to skip

      const profiles = await Profile.find().skip(skip).limit(limit);
      const totalProfiles = await Profile.countDocuments(); // Get the total number of profiles

      res.status(200).json({
        profiles,
        currentPage: page,
        totalPages: Math.ceil(totalProfiles / limit),
      });
  } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
  }
}

export const getProfile = async (req, res) => { 
  const { id } = req.params;
  const userId = req.id;
  try {
      var selfProfile = false;
      if (id == userId) {
        selfProfile = true;
      }
      const profile = await Profile.findOne({_id: id});
      if(profile && profile.email) {
          const userEmail = profile.email;
          const user = await User.findOne({email: userEmail});
          if(user) {
          res.status(200).json({
            name: `${user.firstName} ${user.lastName}`,
            profilePicture: profile.profilePicture,
            website: profile.website,
            city: profile.city,
            country: profile.country,
            selfProfile: selfProfile,
            role: profile.role
          })
        } else {
          res.status(404).json({message: 'User not found'})
        }

      } else{
          res.status(404).json({message: 'Profile not Found'});
      }
  } catch (error) {
      console.log(error);
      res.status(401).json({ message: error.message });
  }
}

export const getProfilesBySearch = async (req, res) => {
  const { searchQuery } = req.query;

  try {
      const searchRegex = new RegExp(searchQuery, "i");
      const profiles = await User.find({ $or: [ { firstName: searchRegex }, { lastName: searchRegex }, { email: searchRegex } ] });
      res.json({ data: profiles });
  } catch (error) { 
      console.log(error);   
      res.status(404).json({ message: error.message });
  }
}

export const updateProfile = async (req, res) => {
  const userId = req.id;
  const profile = req.body;
  try {
    const updatedProfile = await Profile.findOneAndUpdate({ _id: userId }, profile, { new: true });
    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

export const deleteProfile = async (req, res) => {
    const userId = req.id;
    const deleteProfile = await Profile.findOneAndDelete({_id: userId});
    if(!deleteProfile) {
        return res.status(404).json({message: 'Profile not found'});
    }
    res.json({ message: "Profile deleted successfully." });
}

