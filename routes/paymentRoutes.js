router.post("/create-checkout-session", async (req, res) => {
  const { items, address } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: "kzt",
          product_data: {
            name: item.name,
            description: item.description || "",
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity || 1,
      })),
      success_url: "http://localhost:3001/success",
      cancel_url: "http://localhost:3001/cancel",
      metadata: {
        shipping_address: address || "не указано"
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Ошибка создания сессии:", error);
    res.status(500).json({ error: "Ошибка Stripe" });
  }
});
