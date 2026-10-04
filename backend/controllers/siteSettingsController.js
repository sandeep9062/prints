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

/*
 * Explicit allowlist of writable fields.
 *
 * These two handlers previously passed `req.body` straight into
 * findByIdAndUpdate / the model constructor, which is a mass-assignment hole:
 * any field on the schema could be set by the client. Both routes are
 * admin-only, but the shape of the write is still restricted so an unexpected
 * field cannot be persisted.
 */
const WRITABLE_SETTINGS_FIELDS = [
  "websiteName",
  "websiteUrl",
  "email",
  "mainOffice",
  "branchOffice",
  "contactNo1",
  "contactNo2",
  "whatsAppNo",
  "logoUrl",
  "bannerUrl",
  "favicon",
  "facebook",
  "instagram",
  "twitter",
  "linkedin",
  "youtubeUrl",
  "pinterest",
  "github",
];

/** Picks only allowlisted keys that were actually supplied. */
function pickWritableFields(body = {}) {
  const out = {};
  for (const key of WRITABLE_SETTINGS_FIELDS) {
    if (body[key] !== undefined) out[key] = body[key];
  }
  return out;
}

// Create or Update Site Settings (upsert – single document)
export const createSiteSettings = async (req, res) => {
  try {
    const provided = pickWritableFields(req.body);

    const existing = await SiteSettings.findOne();
    if (existing) {
      // Settings already exist – update them instead of rejecting
      const settings = await SiteSettings.findByIdAndUpdate(
        existing._id,
        provided,
        { new: true, runValidators: true },
      );
      return res.status(200).json(settings);
    }

    // Ensure required fields have non-empty defaults to avoid validation errors
    const payload = {
      ...provided,
      websiteName: provided.websiteName?.trim() || "Ink of Memories",
      email: provided.email?.trim() || "info@inkofmemories.com",
      mainOffice:
        provided.mainOffice?.trim() ||
        "123 Printing Street, Design District, Mumbai 400001",
      branchOffice: provided.branchOffice?.trim() || "Branch Office, City",
      contactNo1: provided.contactNo1?.trim() || "",
      whatsAppNo: provided.whatsAppNo?.trim() || "",
    };

    const settings = new SiteSettings(payload);
    await settings.save();
    res.status(201).json(settings);
  } catch (error) {
    console.error("CREATE SITE SETTINGS ERROR:", error.message);
    res
      .status(400)
      .json({ message: "Error creating site settings" });
  }
};

// Update Site Settings
export const updateSiteSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const settings = await SiteSettings.findByIdAndUpdate(
      id,
      pickWritableFields(req.body),
      {
        new: true,
        runValidators: true,
      },
    );

    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error("UPDATE SITE SETTINGS ERROR:", error.message);
    res
      .status(400)
      .json({ message: "Error updating site settings" });
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
