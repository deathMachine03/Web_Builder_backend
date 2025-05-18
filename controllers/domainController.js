const User = require("../models/User");

// 🔽 Назначение домена
exports.assignDomain = async (req, res) => {
  const { domain } = req.body;
  const userId = req.user.id;

  if (!domain || !/^[a-zA-Z0-9\-]+$/.test(domain)) {
    return res.status(400).json({ message: "Недопустимое имя домена" });
  }

  try {
    const existing = await User.findOne({ customDomain: domain });
    if (existing) {
      return res.status(409).json({ message: "Домен уже занят" });
    }

    await User.findByIdAndUpdate(userId, { customDomain: domain });
    res.json({ message: "Домен успешно назначен", domain });
  } catch (err) {
    res.status(500).json({ message: "Ошибка при назначении домена", error: err });
  }
};

// 🔼 Получить текущий домен юзера
exports.getDomain = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ domain: user.customDomain || null });
  } catch (err) {
    res.status(500).json({ message: "Ошибка получения домена", error: err });
  }
};

// 📌 Получить userId по домену (для storefront)
exports.getUserIdByDomain = async (req, res) => {
  try {
    const { domain } = req.params;

    if (!domain) {
      return res.status(400).json({ message: "Домен не указан" });
    }

    const user = await User.findOne({ customDomain: domain });

    if (!user) {
      return res.status(404).json({ message: "Пользователь с таким доменом не найден" });
    }

    res.json({ userId: user._id });
  } catch (err) {
    console.error("Ошибка поиска userId по домену:", err);
    res.status(500).json({ message: "Ошибка на сервере", error: err });
  }
};
