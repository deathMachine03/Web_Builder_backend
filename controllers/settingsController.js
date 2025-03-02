const DraftSettings = require("../models/draftSettings");
const LiveSettings = require("../models/liveSettings");

// 📌 Получение черновика (GET /api/draft) - используется в конструкторе
exports.getDraftSettings = async (req, res) => {
    try {
        let settings = await DraftSettings.findOne();
        if (!settings) {
            settings = await DraftSettings.create({}); // Создаем черновик, если его нет
        }
        res.json(settings);
    } catch (error) {
        console.error("❌ Ошибка получения черновика:", error);
        res.status(500).json({ message: "Ошибка получения черновика", error });
    }
};

// 📌 Обновление черновика (PATCH /api/draft) - используется в конструкторе
exports.updateDraftSettings = async (req, res) => {
    try {
        let settings = await DraftSettings.findOne();
        if (settings) {
            Object.assign(settings, req.body); // Обновляем существующий черновик
            await settings.save();
        } else {
            settings = await DraftSettings.create(req.body); // Создаем, если не найден
        }
        res.json(settings);
    } catch (error) {
        console.error("❌ Ошибка обновления черновика:", error);
        res.status(500).json({ message: "Ошибка обновления черновика", error });
    }
};

// 🚀 Публикация настроек (POST /api/publish) - копирует данные из черновика в live
exports.publishSettings = async (req, res) => {
    try {
        const draft = await DraftSettings.findOne();
        if (!draft) return res.status(404).json({ message: "Черновик не найден" });

        await LiveSettings.deleteMany(); // Очищаем опубликованные настройки
        await LiveSettings.create(draft.toObject()); // Копируем черновик в live

        res.json({ message: "Настройки успешно опубликованы!" });
    } catch (error) {
        console.error("❌ Ошибка публикации настроек:", error);
        res.status(500).json({ message: "Ошибка публикации", error });
    }
};

// 📌 Получение опубликованных настроек (GET /api/live) - используется storefront
exports.getLiveSettings = async (req, res) => {
    try {
        let settings = await LiveSettings.findOne();
        if (!settings) {
            settings = await LiveSettings.create({}); // Создаем пустой live, если его нет
        }
        res.json(settings);
    } catch (error) {
        console.error("❌ Ошибка получения опубликованных настроек:", error);
        res.status(500).json({ message: "Ошибка получения опубликованных настроек", error });
    }
};
