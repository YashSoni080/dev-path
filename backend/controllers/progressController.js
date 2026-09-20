import User from "../models/User.js";
import Topic from "../models/Topic.js";

// @desc   Get current user's completed topics
// @route  GET /api/progress
// @access Private
export const getUserProgress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("completedTopics");
    res.json({
      completedTopics: user?.completedTopics?.map((id) => id.toString()) || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Toggle completion status for a topic
// @route  POST /api/progress/toggle
// @access Private
export const toggleTopicProgress = async (req, res, next) => {
  try {
    const { topicId } = req.body;

    if (!topicId) {
      return res.status(400).json({ message: "Topic ID is required" });
    }

    const topicExists = await Topic.findById(topicId);
    if (!topicExists) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.completedTopics) {
      user.completedTopics = [];
    }

    const index = user.completedTopics.findIndex(
      (id) => id.toString() === topicId.toString()
    );

    let isCompleted = false;
    if (index > -1) {
      // Already completed, remove it
      user.completedTopics.splice(index, 1);
      isCompleted = false;
    } else {
      // Not completed, add it
      user.completedTopics.push(topicId);
      isCompleted = true;
    }

    await user.save();

    res.json({
      message: isCompleted ? "Topic marked as completed!" : "Topic marked as incomplete",
      isCompleted,
      completedTopics: user.completedTopics.map((id) => id.toString()),
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Sync guest progress after logging in
// @route  POST /api/progress/sync
// @access Private
export const syncProgress = async (req, res, next) => {
  try {
    const { topicIds } = req.body;
    if (!Array.isArray(topicIds) || topicIds.length === 0) {
      return res.json({
        message: "No topics to sync",
        completedTopics: req.user.completedTopics?.map((id) => id.toString()) || [],
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentSet = new Set(
      (user.completedTopics || []).map((id) => id.toString())
    );

    for (const tid of topicIds) {
      if (tid && typeof tid === "string" && tid.match(/^[0-9a-fA-F]{24}$/)) {
        currentSet.add(tid);
      }
    }

    user.completedTopics = Array.from(currentSet);
    await user.save();

    res.json({
      message: "Progress synced successfully",
      completedTopics: user.completedTopics.map((id) => id.toString()),
    });
  } catch (error) {
    next(error);
  }
};
