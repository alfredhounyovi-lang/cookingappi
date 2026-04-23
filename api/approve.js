export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { paymentId } = req.body;
  console.log("Approve:", paymentId);

  return res.status(200).json({ success: true });
}
