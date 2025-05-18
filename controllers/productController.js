const DraftProduct = require("../models/draftProduct");
const LiveProduct = require("../models/liveProduct");

exports.getDraftProducts = async (req, res) => {
  try {
    const products = await DraftProduct.find({ userId: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Ошибка получения товаров", error });
  }
};


exports.addDraftProduct = async (req, res) => {
  try {
    const { name, price, description, imageUrl, quantity } = req.body;

    const newProduct = await DraftProduct.create({
      userId: req.user.id,
      name,
      price,
      description,
      imageUrl,
      quantity: quantity ?? 1
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Ошибка добавления товара", error });
  }
};



exports.updateDraftProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedProduct = await DraftProduct.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Товар не найден или нет доступа" });
    }

    res.json(updatedProduct);
  } catch (error) {
    console.error("Ошибка обновления товара:", error);
    res.status(500).json({ message: "Ошибка обновления товара", error });
  }
};


exports.deleteDraftProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await DraftProduct.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({ message: "Товар не найден или нет доступа" });
    }

    res.json({ message: "Товар удален" });
  } catch (error) {
    console.error("Ошибка удаления товара:", error);
    res.status(500).json({ message: "Ошибка удаления товара", error });
  }
};



exports.getDraftProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await DraftProduct.findOne({ _id: req.params.id, userId: req.user.id });
        if (!product) {
            return res.status(404).json({ message: "Товар не найден" });
        }
        res.json(product);
    } catch (error) {
        console.error("Ошибка получения товара:", error);
        res.status(500).json({ message: "Ошибка получения товара", error });
    }
};



exports.publishProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    const draftProducts = await DraftProduct.find({ userId });
    if (!draftProducts.length) {
      return res.status(404).json({ message: "Нет товаров для публикации" });
    }

    await LiveProduct.deleteMany({ userId });

    const liveProducts = draftProducts.map((p) => {
      const { _id, ...data } = p.toObject();
      return { ...data, userId };
    });

    await LiveProduct.insertMany(liveProducts);

    res.json({ message: "Товары опубликованы" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка публикации товаров", error });
  }
};


exports.getLiveProducts = async (req, res) => {
  try {
    const products = await LiveProduct.find({ userId: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Ошибка получения опубликованных товаров", error });
  }
};

exports.getLiveProductsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const products = await LiveProduct.find({ userId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Ошибка получения товаров", error });
  }
};

exports.getLiveProductById = async (req, res) => {
  try {
    const { userId, id } = req.params;
    const product = await LiveProduct.findOne({ _id: id, userId });
    if (!product) return res.status(404).json({ message: "Товар не найден" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Ошибка получения товара", error });
  }
};



