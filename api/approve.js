export default async function handler(req, res) {

  try {

    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed"
      });
    }

    const apiKey = process.env.PI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "PI_API_KEY manquante sur Vercel"
      });
    }

    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        error: "paymentId manquant"
      });
    }

    console.log("🔄 APPROVE PAYMENT:", paymentId);

    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    console.log("📡 STATUS:", response.status);
    console.log("📡 RESPONSE:", data);

    return res.status(response.status).json({
      ok: response.ok,
      paymentId,
      data
    });

  } catch (error) {

    console.error("❌ APPROVE ERROR:", error);

    return res.status(500).json({
      error: error.message || "approve failed"
    });

  }
}
