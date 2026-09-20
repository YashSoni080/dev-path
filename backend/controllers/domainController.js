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

// @desc   Get a single domain with its master courses and roadmap topics
// @route  GET /api/domains/:slug
export const getDomainBySlug = async (req, res, next) => {
  try {
    const domain = await Domain.findOne({ slug: req.params.slug });
    if (!domain) {
      return res.status(404).json({ message: "Domain not found" });
    }

    // 1. Fetch complete A-to-Z master courses & sheets for this domain
    const masterResources = await Resource.find({
      domain: domain._id,
      isMasterCourse: true,
    })
      .populate("addedBy", "name email")
      .sort({ createdAt: 1 });

    // 2. Fetch step-by-step waypoint topics
    const topics = await Topic.find({ domain: domain._id }).sort({ order: 1 });
    const topicIds = topics.map((t) => t._id);

    // 3. Fetch topic-specific resources (excluding master courses)
    const resources = await Resource.find({
      topic: { $in: topicIds },
      isMasterCourse: false,
    })
      .populate("addedBy", "name email")
      .sort({ createdAt: 1 });

    const resourcesByTopic = topics.map((topic) => ({
      ...topic.toObject(),
      resources: resources.filter(
        (r) => r.topic && r.topic.toString() === topic._id.toString()
      ),
    }));

    res.json({
      domain,
      masterResources: masterResources || [],
      topics: resourcesByTopic,
    });
  } catch (error) {
    next(error);
  }
};
