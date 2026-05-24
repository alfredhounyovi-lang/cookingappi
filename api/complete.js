export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.PI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "PI_API_KEY manquante sur Vercel" });
    }

    const { paymentId, txid } = req.body || {};
    if (!paymentId) {
      return res.status(400).json({ error: "paymentId manquant" });
    }

    console.log(`[PI] Tentative de complétion pour le paiement : ${paymentId}`);

    // ÉTAPE DE SÉCURITÉ : On va d'abord demander à Pi quel est l'état réel du paiement
    const checkResponse = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
      method: "GET",
      headers: { Authorization: `Key ${apiKey}` }
    });

    if (!checkResponse.ok) {
      const checkErrorText = await checkResponse.text();
      console.error("[PI] Impossible de vérifier l'état du paiement :", checkErrorText);
      return res.status(checkResponse.status).json({ error: `Erreur vérification Pi: ${checkErrorText}` });
    }

    const paymentStatus = await checkResponse.json();
    console.log("[PI] État actuel du paiement chez Pi :", paymentStatus.status);

    // Si le paiement n'est pas encore approuvé par le développeur, on ne peut pas le compléter !
    if (!paymentStatus.status.developer_approved) {
      console.log("[PI] Le paiement n'est pas approuvé. Il faut d'abord appeler /api/approve");
      return res.status(400).json({ 
        error: "Ce paiement doit d'abord être approuvé via l'API d'approbation avant d'être complété." 
      });
    }

    // Si le paiement est déjà complété chez Pi, on simule une réussite pour libérer le frontend
    if (paymentStatus.status.developer_completed) {
      console.log("[PI] Le paiement était déjà complété chez Pi Network. Libération du compte.");
      return res.status(200).json({ ok: true, message: "Déjà complété" });
    }

    // 4. Appel à l'API Pi pour COMPLÉTER le paiement
    const response = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${apiKey}`,
          "Content-Type": "application/json"
        },
        // On n'envoie le txid que s'il existe réellement pour éviter de corrompre la requête
        body: txid ? JSON.stringify({ txid }) : JSON.stringify({})
      }
    );

    const text = await response.text();
    console.log("[PI] Réponse brute de l'API /complete :", text);

    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return res.status(response.status).json({
      ok: response.ok,
      status: response.status,
      paymentId,
      data
    });

  } catch (error) {
    console.error("❌ CRITICAL BACKEND ERROR:", error);
    return res.status(500).json({ error: error.message || "complete failed" });
  }
}
