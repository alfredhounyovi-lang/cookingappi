export default async function handler(req, res) {

  try {

    if (req.method !== "POST") {

      return res.status(405).json({
        error: "Method not allowed"
      });

    }

    const { uid } = req.body;

    if (!uid) {

      return res.status(400).json({
        error: "UID manquant"
      });

    }

    console.log("🔄 CREATE TESTNET PAYMENT");

    const response = await fetch(

      "https://api.minepi.com/v2/payments",

      {

        method: "POST",

        headers: {

          Authorization: `Key ${process.env.PI_API_KEY}`,

          "Content-Type": "application/json"

        },

        body: JSON.stringify({

          payment: {

            amount: 0.01,

            memo: "Cooking App Testnet Reward",

            metadata: {

              type: "testnet_reward"

            },

            uid: uid

          }

        })

      }

    );

    const data = await response.json();

    console.log("✅ PAYMENT STATUS:", response.status);

    console.log("✅ PAYMENT RESPONSE:", data);

    if (!response.ok) {

      return res.status(response.status).json({

        error: "Pi payment failed",

        details: data

      });

    }

    return res.status(200).json({

      success: true,

      data

    });

  } catch (error) {

    console.error("❌ TESTNET PAYMENT ERROR:", error);

    return res.status(500).json({

      error: error.message || "Testnet payment failed"

    });

  }

      }
