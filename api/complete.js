export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { paymentId } = req.body;

    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.PI_API_KEY}`
        }
      }
    );

    const data = await response.json();
    console.log("COMPLETE:", data);

    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "complete failed" });
  }
}
