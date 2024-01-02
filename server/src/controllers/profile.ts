import Profile from "../models/ProfileModel.js";
import User from "../models/userModel.js";

export const getProfiles = async (req: any, res: any) => {
  try {
    const role = req.query.role || "candidate";
    const page = parseInt(req.query.page) || 1; // Current page (default to 1 if not provided)
    const limit = parseInt(req.query.limit) || 10; // Number of profiles per page (default to 10 if not provided)
    const skip = (page - 1) * limit; // Calculate the number of profiles to skip

    const users = await User.find({ role: role })
      .populate({
        path: "profile",
        select: "-interviews",
      })
      .skip(skip)
      .limit(limit)
      .exec();
    const totalProfiles = await Profile.countDocuments(); // Get the total number of profiles

    res.status(200).json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalProfiles / limit),
    });
  } catch (error: any) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getProfile = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const profile = await Profile.findOne({ user: id }).populate("user");
    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error: any) {
    console.log(error);
    res.status(401).json({ message: error.message });
  }
};

export const getProfilesBySearch = async (req: any, res: any) => {
  const { searchQuery } = req.query;
  try {
    const searchRegex = new RegExp(searchQuery, "i");
    const profiles = await User.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ],
    });
    res.json({ data: profiles });
  } catch (error: any) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updateProfile = async (req: any, res: any) => {
  const profileData = req.body;

  try {
    const user: any = await User.findById(req.id).populate("profile");
    const profile = await Profile.findByIdAndUpdate(user.profile, profileData, {
      new: true,
    });
    // return user object in response which contains updatedProfile data
    user.profile = profile;
    await user.save();
    res.json(user);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProfile = async (req: any, res: any) => {
  try {
    const userId = req.id; // Assuming you have a way to get the user ID
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ error: "Requested user profile not found" });
    }

    const profileId = user.profile;

    // Delete the user
    await User.deleteOne({ _id: userId });

    // Delete the associated profile
    await Profile.findOneAndDelete({ _id: profileId });

    res.json({ message: "Profile deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const selfProfile = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.id).populate("profile");
    if (!user) {
      return res.status(404).json({ message: "Profile Does Not Exist" });
    }
    res.json(user);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: String(error) });
  }
};
