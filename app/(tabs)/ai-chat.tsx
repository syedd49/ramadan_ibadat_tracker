const replies = [
  "Allah niyyat ko dekhta hai, amal ko nahi 🤍",
  "Aaj nahi ho paaya to kal ek naya mauka hoga 🌙",
  "Chhoti ibadat bhi Allah ko pasand hoti hai 🌿",
];

export function getAIReply(userText: string) {
  if (userText.includes("miss")) {
    return "Miss ho jaana failure nahi hai. Wapas uthna hi asal baat hai.";
  }

  return replies[Math.floor(Math.random() * replies.length)];
}
