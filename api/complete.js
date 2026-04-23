export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { paymentId, txid } = req.body;
  console.log("Complete:", paymentId, txid);

  return res.status(200).json({ success: true });
}
