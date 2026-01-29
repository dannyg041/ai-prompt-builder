const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");

generateBtn.addEventListener("click", () => {
  const role = document.getElementById("role").value;
  const goal = document.getElementById("goal").value;
  const audience = document.getElementById("audience").value;
  const tone = document.getElementById("tone").value;
  const output = document.getElementById("output").value;
  const constraints = document.getElementById("constraints").value;

  const prompt = `
You are an expert ${role}.

Your task:
${goal}

Target audience:
${audience}

Tone:
${tone}

Output format:
${output}

Constraints:
${constraints}

Respond clearly and concisely.
  `.trim();

  result.textContent = prompt;
});
