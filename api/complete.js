export default async function handler(req, res) {

  try {

    if (req.method !== "POST") {

      return res.status(405).json({
        error: "Method not allowed"
      });

    }

    const { paymentId, txid } = req.body;

    if (!paymentId || !txid) {

      return res.status(400).json({
        error: "paymentId ou txid manquant"
      });

    }

    console.log("🔄 COMPLETE PAYMENT:", paymentId);
    console.log("🔄 TXID:", txid);

    const response = await fetch(

      `https://api.minepi.com/v2/payments/${paymentId}/complete`,

      {
        method: "POST",

        headers: {

          Authorization: `Key ${process.env.PI_API_KEY}`,

          "Content-Type": "application/json"

        },

        body: JSON.stringify({
          txid
        })

      }

    );

    const data = await response.json();

    console.log("✅ COMPLETE STATUS:", response.status);
    console.log("✅ COMPLETE RESPONSE:", data);

    if (!response.ok) {

      return res.status(response.status).json({

        error: "Pi complete failed",

        details: data

      });

    }

    return res.status(200).json({

      success: true,
      paymentId,
      txid,
      data

    });

  } catch (error) {

    console.error("❌ COMPLETE ERROR:", error);

    return res.status(500).json({

      error: error.message || "complete failed"

    });

  }

}
