import Domain from "../models/Domain.js";
import Topic from "../models/Topic.js";
import Resource from "../models/Resource.js";

// @desc   Get all domains
// @route  GET /api/domains
export const getDomains = async (req, res, next) => {
  try {
    const domains = await Domain.find().sort({ name: 1 });
    res.json(domains);
  } catch (error) {
    next(error);
  }
};

// @desc   Get a single domain with its full roadmap (topics + resources)
// @route  GET /api/domains/:slug
export const getDomainBySlug = async (req, res, next) => {
  try {
    const domain = await Domain.findOne({ slug: req.params.slug });
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    const topics = await Topic.find({ domain: domain._id }).sort({ order: 1 });
    const topicIds = topics.map((t) => t._id);
    const resources = await Resource.find({ topic: { $in: topicIds } }).sort({ createdAt: 1 });

    const resourcesByTopic = topics.map((topic) => ({
      ...topic.toObject(),
      resources: resources.filter((r) => r.topic.toString() === topic._id.toString()),
    }));

    res.json({ domain, topics: resourcesByTopic });
  } catch (error) {
    next(error);
  }
};
