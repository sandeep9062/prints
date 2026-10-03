import Newsletter from "../models/Newsletter.js";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

// @desc    Subscribe an email to the newsletter
// @route   POST /api/v1/newsletter
// @access  Public
export const subscribeNewsletter = async (req, res) => {
  try {
    const email = String(req.body?.email ?? "")
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    if (!EMAIL_PATTERN.test(email)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address." });
    }

    const existing = await Newsletter.findOne({ email });

    if (existing) {
      return res.status(200).json({
        message: "You are already subscribed to our newsletter.",
        alreadySubscribed: true,
      });
    }

    await Newsletter.create({ email });

    return res.status(201).json({
      message: "Thank you for subscribing to our newsletter!",
      alreadySubscribed: false,
    });
  } catch (error) {
    // Duplicate key error (race condition on unique email index)
    if (error?.code === 11000) {
      return res.status(200).json({
        message: "You are already subscribed to our newsletter.",
        alreadySubscribed: true,
      });
    }

    console.error("Error subscribing to newsletter:", error);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/v1/newsletter
// @access  Private/Admin
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json(subscribers);
  } catch (error) {
    console.error("Error fetching newsletter subscribers:", error);
    res.status(500).json({ error: "Failed to fetch subscribers." });
  }
};