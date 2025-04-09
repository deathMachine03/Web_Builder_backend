const DraftProduct = require("../models/draftProduct");
const LiveProduct = require("../models/liveProduct");

// 📌 Получить все товары (DRAFT)
exports.getDraftProducts = async (req, res) => {
    try {
        const products = await DraftProduct.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Ошибка получения товаров", error });
    }
};

// 📌 Добавить товар (DRAFT)
exports.addDraftProduct = async (req, res) => {
    try {
        const { name, price, description, imageUrl, quantity } = req.body;

        const newProduct = await DraftProduct.create({
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


// 📌 Обновить товар (DRAFT)
exports.updateDraftProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🔧 Обновление товара:", id, req.body);
        const updatedProduct = await DraftProduct.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Товар не найден" });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error("Ошибка обновления товара:", error);
        res.status(500).json({ message: "Ошибка обновления товара", error });
    }
};




// 📌 Удалить товар (DRAFT)
exports.deleteDraftProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await DraftProduct.findByIdAndDelete(id);
        res.json({ message: "Товар удален" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка удаления товара", error });
    }
};


// 📌 Получение одного товара (DRAFT)
exports.getDraftProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await DraftProduct.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Товар не найден" });
        }
        res.json(product);
    } catch (error) {
        console.error("Ошибка получения товара:", error);
        res.status(500).json({ message: "Ошибка получения товара", error });
    }
};


// 🚀 Публикация товаров (перенос из DRAFT в LIVE)
exports.publishProducts = async (req, res) => {
    try {
        const draftProducts = await DraftProduct.find();
        if (!draftProducts.length) return res.status(404).json({ message: "Нет товаров для публикации" });

        // Очистка `live` и копирование данных из `draft`
        await LiveProduct.deleteMany();
        await LiveProduct.insertMany(draftProducts.map(p => p.toObject()));

        res.json({ message: "Товары опубликованы" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка публикации товаров", error });
    }
};

// 📌 Получить опубликованные товары (LIVE)
exports.getLiveProducts = async (req, res) => {
    try {
        const products = await LiveProduct.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Ошибка получения опубликованных товаров", error });
    }
};
