export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { paymentId } = req.body;

    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        "Authorization": "1gfftilc2c1hl2vi5fhhyfn3a84nkb5nm4slow6rgmnktyvrjaqjshy13qoqhban"
      }
    });

    const data = await response.json();
    console.log("Complete response:", data);

    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "fail" });
  }
}
