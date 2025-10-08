export function generateInitialPassword(length = 8) {
  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$&";

  if (length < 4) {
    throw new Error("Password length must be at least 4 to include all required character types.");
  }

  // Ensure at least one of each required type
  const mandatoryChars = [
    upperCaseChars[Math.floor(Math.random() * upperCaseChars.length)],
    numberChars[Math.floor(Math.random() * numberChars.length)],
    specialChars[Math.floor(Math.random() * specialChars.length)],
    lowerCaseChars[Math.floor(Math.random() * lowerCaseChars.length)],
  ];

  // Fill the remaining characters randomly from all types
  const allChars = upperCaseChars + lowerCaseChars + numberChars + specialChars;
  for (let i = mandatoryChars.length; i < length; i++) {
    mandatoryChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // Shuffle the array to avoid predictable positions
  for (let i = mandatoryChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mandatoryChars[i], mandatoryChars[j]] = [mandatoryChars[j], mandatoryChars[i]];
  }

  return mandatoryChars.join("");
}
