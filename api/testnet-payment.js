export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {

    const { userWalletAddress, uid } = req.body;

    if (!userWalletAddress || !uid) {
      return res.status(400).json({
        error: "Adresse wallet ou UID manquant"
      });
    }

    const response = await fetch(
      "https://api.minepi.com/v2/payments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PI_API_KEY}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          payment: {
            amount: 0.1,
            memo: "CookingApp Testnet Reward",

            metadata: {
              type: "testnet_validation"
            },

            uid: uid,

            recipient_address:
              userWalletAddress
          }
        })
      }
    );

    const data = await response.json();

    console.log("TESTNET STATUS:", response.status);
    console.log("TESTNET RESPONSE:", data);

    if (!response.ok) {

      return res.status(response.status).json({
        error: "Pi payment failed",
        details: data
      });
    }

    return res.status(200).json(data);

  } catch (error) {

    console.error(
      "TESTNET PAYMENT ERROR:",
      error
    );

    return res.status(500).json({
      error: "Testnet payment failed"
    });
  }
}
