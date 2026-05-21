export default async function handler(req, res) {

  try {

    if (req.method !== "POST") {

      return res.status(405).json({
        error: "Method not allowed"
      });

    }

    if (!process.env.PI_API_KEY) {

      return res.status(500).json({
        error: "PI_API_KEY manquante"
      });

    }

    const { paymentId } = req.body;

    if (!paymentId) {

      return res.status(400).json({
        error: "paymentId manquant"
      });

    }

    console.log(
      "🔄 APPROVE PAYMENT:",
      paymentId
    );

    const response = await fetch(

      `https://api.minepi.com/v2/payments/${paymentId}/approve`,

      {

        method: "POST",

        headers: {

          Authorization:
            `Key ${process.env.PI_API_KEY}`,

          "Content-Type":
            "application/json"

        }

      }

    );

    const text =
      await response.text();

    let data = {};

    try {

      data = JSON.parse(text);

    } catch {

      data = {
        raw: text
      };

    }

    console.log(
      "✅ APPROVE STATUS:",
      response.status
    );

    console.log(
      "✅ APPROVE RESPONSE:",
      data
    );

    if (!response.ok) {

      return res.status(
        response.status
      ).json({

        error:
          "Pi approve failed",

        details:
          data

      });

    }

    return res.status(200).json({

      success: true,

      paymentId,

      data

    });

  } catch (error) {

    console.error(
      "❌ APPROVE ERROR:",
      error
    );

    return res.status(500).json({

      error:
        error.message ||
        "approve failed"

    });

  }

      }
