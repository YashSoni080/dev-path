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

// @desc   Get complete platform data (all domains with master courses, topics, and resources)
// @route  GET /api/all or /api/domains/all/data
export const getAllData = async (req, res, next) => {
  try {
    const domains = await Domain.find().sort({ name: 1 });

    // 1. All master courses & sheets
    const masterResources = await Resource.find({ isMasterCourse: true })
      .populate("addedBy", "name email")
      .sort({ createdAt: 1 });

    // 2. All topics across all domains
    const topics = await Topic.find().sort({ order: 1 });

    // 3. All waypoint resources
    const topicResources = await Resource.find({ isMasterCourse: false })
      .populate("addedBy", "name email")
      .sort({ createdAt: 1 });

    const completeDomains = domains.map((domain) => {
      const domainMasters = masterResources.filter(
        (r) => r.domain && r.domain.toString() === domain._id.toString()
      );

      const domainTopics = topics
        .filter((t) => t.domain && t.domain.toString() === domain._id.toString())
        .map((t) => ({
          ...t.toObject(),
          resources: topicResources.filter(
            (r) => r.topic && r.topic.toString() === t._id.toString()
          ),
        }));

      return {
        ...domain.toObject(),
        masterResources: domainMasters,
        topics: domainTopics,
      };
    });

    res.json({
      success: true,
      summary: {
        totalDomains: domains.length,
        totalMasterCourses: masterResources.length,
        totalTopics: topics.length,
        totalResources: masterResources.length + topicResources.length,
      },
      domains: completeDomains,
    });
  } catch (error) {
    next(error);
  }
};

