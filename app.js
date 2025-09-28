document.getElementById("gen").addEventListener("click", function () {
  const category = document.getElementById("category").value;
  const tone = document.getElementById("tone").value;

  const hook = `🔥 ${tone.toUpperCase()} hook for ${category}`;
  const ig = `Today’s IG post about ${category} with a ${tone} tone.`;
  const wa = `Hey! Here’s your WhatsApp message about ${category} with a ${tone} feel.`;
  const subject = `New Post: ${category} | ${tone}`;
  const quote = `“Discipline is strength. Be the Gibor.”`;
  const image = `A powerful image of a student training in martial arts, ${tone} vibe.`;

  document.getElementById("hook").value = hook;
  document.getElementById("ig").value = ig;
  document.getElementById("wa").value = wa;
  document.getElementById("subject").value = subject;
  document.getElementById("quote").value = quote;
  document.getElementById("image").value = image;

  const date = new Date().toLocaleDateString();
  document.getElementById("dateBadge").textContent = date;
});
