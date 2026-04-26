export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const { userWalletAddress } = req.body;

    const response = await fetch(`https://minepi.com`, {
      method: "POST",
      headers: { 
        "Authorization": `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        payment: {
          amount: 0.1,
          memo: "Testnet Reward - CookingApp",
          metadata: { type: "testnet_validation" },
          uid: "user_unique_id_here", // ID de l'utilisateur dans ton app
          recipient_address: userWalletAddress // L'adresse du portefeuille de test de l'ami
        }
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Testnet payment failed" });
  }
                           }

