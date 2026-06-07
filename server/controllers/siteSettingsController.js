import { SiteSettings } from "../models/SiteSettings.js";

// Get Site Settings
export const getSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSettings.findOne();
    res.status(200).json(settings || {});
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching site settings", error: error.message });
  }
};

// Create or Update Site Settings (upsert – single document)
export const createSiteSettings = async (req, res) => {
  try {
    const existing = await SiteSettings.findOne();
    if (existing) {
      // Settings already exist – update them instead of rejecting
      const settings = await SiteSettings.findByIdAndUpdate(
        existing._id,
        req.body,
        { new: true, runValidators: true },
      );
      return res.status(200).json(settings);
    }

    // Ensure required fields have non-empty defaults to avoid validation errors
    const payload = {
      ...req.body,
      websiteName: req.body.websiteName?.trim() || "Ink of Memories",
      email: req.body.email?.trim() || "info@inkofmemories.com",
      mainOffice:
        req.body.mainOffice?.trim() ||
        "123 Printing Street, Design District, Mumbai 400001",
      branchOffice: req.body.branchOffice?.trim() || "Branch Office, City",
      contactNo1: req.body.contactNo1?.trim() || "",
      whatsAppNo: req.body.whatsAppNo?.trim() || "",
    };

    const settings = new SiteSettings(payload);
    await settings.save();
    res.status(201).json(settings);
  } catch (error) {
    console.error("CREATE SITE SETTINGS ERROR:", error);
    res
      .status(400)
      .json({ message: "Error creating site settings", error: error.message });
  }
};

// Update Site Settings
export const updateSiteSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const settings = await SiteSettings.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    res.status(200).json(settings);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating site settings", error: error.message });
  }
};

// Delete Site Settings
export const deleteSiteSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const settings = await SiteSettings.findByIdAndDelete(id);

    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    res.status(200).json({ message: "Settings deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting site settings", error: error.message });
  }
};
