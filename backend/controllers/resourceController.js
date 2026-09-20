import Resource from "../models/Resource.js";
import Topic from "../models/Topic.js";
import Domain from "../models/Domain.js";

// @desc   Add a new resource to a topic or domain master list
// @route  POST /api/resources
// @access Private
export const createResource = async (req, res, next) => {
  try {
    const { topic, domain, title, url, type, description, isMasterCourse } = req.body;

    if (!title || !url || !type) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    let targetDomainId = domain;
    let targetTopicId = topic || null;

    if (targetTopicId) {
      const topicExists = await Topic.findById(targetTopicId);
      if (!topicExists) {
        return res.status(404).json({ message: "Topic not found" });
      }
      targetDomainId = topicExists.domain;
    } else if (!targetDomainId) {
      return res.status(400).json({ message: "Either a topic or domain is required" });
    }

    const resource = await Resource.create({
      topic: targetTopicId,
      domain: targetDomainId,
      isMasterCourse: Boolean(isMasterCourse && !targetTopicId),
      title,
      url,
      type,
      description,
      addedBy: req.user._id,
    });

    await resource.populate("addedBy", "name email");
    await resource.populate({
      path: "topic",
      select: "title domain",
      populate: { path: "domain", select: "name slug" },
    });
    await resource.populate("domain", "name slug color icon");

    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
};

// @desc   Search / filter resources across all domains
// @route  GET /api/resources/search?q=&type=&domain=
// @access Public
export const searchResources = async (req, res, next) => {
  try {
    const { q, type, domain } = req.query;
    const filter = {};

    if (q && q.trim()) {
      const escaped = q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: escaped, $options: "i" } },
        { description: { $regex: escaped, $options: "i" } },
      ];
    }

    if (type && type.trim()) {
      filter.type = type.trim();
    }

    if (domain && domain.trim()) {
      // Find domain by slug or ID
      const domainDoc = await Domain.findOne({
        $or: [{ slug: domain.trim() }, { _id: domain.match(/^[0-9a-fA-F]{24}$/) ? domain : null }],
      });
      if (domainDoc) {
        filter.domain = domainDoc._id;
      }
    }

    const resources = await Resource.find(filter)
      .populate({
        path: "topic",
        select: "title domain",
        populate: { path: "domain", select: "name slug color icon" },
      })
      .populate("domain", "name slug color icon")
      .populate("addedBy", "name")
      .sort({ createdAt: -1 })
      .limit(100);

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
    res.json({ message: "Resource removed", deletedId: req.params.id });
  } catch (error) {
    next(error);
  }
};
