export function generateNotificationText(params: {
  salah: string;
  missedRecently: boolean;
}) {
  if (params.missedRecently) {
    return `⏰ ${params.salah} ka waqt qareeb hai. Aaj ek naya start karein.`;
  }

  return `🌙 ${params.salah} ka waqt ho gaya. Allah tumhari ibadat qubool kare.`;
}
