export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { paymentId } = req.body;

    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await response.json();

    console.log("APPROVE STATUS:", response.status);
    console.log("APPROVE RESPONSE:", data);

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Pi approve failed",
        details: data
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("APPROVE ERROR:", error);
    return res.status(500).json({ error: "approve failed" });
  }
}
