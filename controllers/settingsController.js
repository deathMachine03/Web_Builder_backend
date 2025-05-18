const DraftSettings = require("../models/draftSettings");
const LiveSettings = require("../models/liveSettings");


exports.getDraftSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    let settings = await DraftSettings.findOne({ userId });
    if (!settings) {
      settings = await DraftSettings.create({ userId });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Ошибка получения черновика", error });
  }
};


exports.updateDraftSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    if (Array.isArray(req.body.socialLinks)) {
      const uniqueLinks = [];
      const seenIds = new Set();

      for (const link of req.body.socialLinks) {
        if (!seenIds.has(link.id)) {
          seenIds.add(link.id);
          uniqueLinks.push(link);
        }
      }

      req.body.socialLinks = uniqueLinks;
    }

    const updated = await DraftSettings.findOneAndUpdate(
      { userId },
      { $set: req.body },
      { new: true, upsert: true }    
    );

    res.json(updated);
  } catch (error) {
    console.error("Ошибка обновления черновика:", error);
    res.status(500).json({ message: "Ошибка обновления черновика", error });
  }
};


exports.publishSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const draft = await DraftSettings.findOne({ userId });

    if (!draft) {
      return res.status(404).json({ message: "Черновик не найден" });
    }

    await LiveSettings.deleteMany({ userId });

    const draftObject = draft.toObject();
    delete draftObject._id;
    await LiveSettings.create({ ...draftObject, userId });

    res.json({ message: "Настройки успешно опубликованы!" });
  } catch (error) {
    console.error(" Ошибка публикации настроек:", error);
    res.status(500).json({ message: "Ошибка публикации", error });
  }
};


exports.getLiveSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    let settings = await LiveSettings.findOne({ userId });

    if (!settings) {
      settings = await LiveSettings.create({ userId }); 
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Ошибка получения опубликованных настроек", error });
  }
};

exports.getLiveSettingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const settings = await require("../models/liveSettings").findOne({ userId });
    if (!settings) return res.status(404).json({ message: "Настройки не найдены" });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Ошибка получения настроек", error: err });
  }
};


