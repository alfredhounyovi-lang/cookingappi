export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const { paymentId, txid } = req.body;

    const response = await fetch(`https://minepi.com{paymentId}/complete`, {
      method: "POST",
      headers: { 
        "Authorization": `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ txid }) // Obligatoire pour lier la transaction
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Complete failed" });
  }
}
