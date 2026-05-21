export default async function handler(req, res) {

  console.log("➡️ APPROVE HIT");

  try {

    // 1. Method check
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method not allowed"
      });
    }

    // 2. API KEY check
    const apiKey = process.env.PI_API_KEY;

    console.log("🔑 API KEY EXISTS:", !!apiKey);

    if (!apiKey) {
      return res.status(500).json({
        error: "PI_API_KEY manquante sur Vercel"
      });
    }

    // 3. Body check
    const { paymentId } = req.body || {};

    console.log("📦 BODY:", req.body);

    if (!paymentId) {
      return res.status(400).json({
        error: "paymentId manquant"
      });
    }

    console.log("🔄 APPROVE PAYMENT:", paymentId);

    // 4. Call Pi API
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

    console.log("📡 RAW RESPONSE:", text);

    // 5. Safe parse
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    console.log("📡 STATUS:", response.status);
    console.log("📡 PARSED RESPONSE:", data);

    // 6. Final response (important fix)
    return res.status(response.status).json({
      ok: response.ok,
      status: response.status,
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
