import Resource from "../models/Resource.js";
import Topic from "../models/Topic.js";

// @desc   Add a new resource to a topic
// @route  POST /api/resources
// @access Private
export const createResource = async (req, res, next) => {
  try {
    const { topic, title, url, type, description } = req.body;

    if (!topic || !title || !url || !type) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const topicExists = await Topic.findById(topic);
    if (!topicExists) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const resource = await Resource.create({
      topic,
      title,
      url,
      type,
      description,
      addedBy: req.user._id,
    });

    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
};

// @desc   Search / filter resources across all domains
// @route  GET /api/resources/search?q=&type=
// @access Public
export const searchResources = async (req, res, next) => {
  try {
    const { q, type } = req.query;
    const filter = {};

    if (q) {
      filter.$text = { $search: q };
    }
    if (type) {
      filter.type = type;
    }

    const resources = await Resource.find(filter)
      .populate({ path: "topic", select: "title domain", populate: { path: "domain", select: "name slug" } })
      .limit(50);

    res.json(resources);
  } catch (error) {
    next(error);
  }
};

// @desc   Delete a resource (only the user who added it)
// @route  DELETE /api/resources/:id
// @access Private
export const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    if (!resource.addedBy || resource.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete resources you added" });
    }
    await resource.deleteOne();
    res.json({ message: "Resource removed" });
  } catch (error) {
    next(error);
  }
};
