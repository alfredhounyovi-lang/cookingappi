export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const { paymentId } = req.body;

    const response = await fetch(`https://minepi.com{paymentId}/approve`, {
      method: "POST",
      headers: { 
        "Authorization": `Key ${process.env.PI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Approve failed" });
  }
}
