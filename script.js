
const passwordInput = document.getElementById("password");
const toggleButton = document.getElementById("togglePassword");
const strengthText = document.getElementById("strengthText");
const meter = document.getElementById("meter");
const meterFill = document.getElementById("meterFill");
const feedback = document.getElementById("feedback");

const requirements = {
  length: password => password.length >= 12,
  lowercase: password => /[a-z]/.test(password),
  uppercase: password => /[A-Z]/.test(password),
  number: password => /[0-9]/.test(password),
  symbol: password => /[^A-Za-z0-9]/.test(password)
};

function updateRequirement(id, passed, label) {
  const element = document.getElementById(id);

  element.classList.toggle("met", passed);
  element.textContent = `${passed ? "✓" : "✗"} ${label}`;
}

function checkPassword() {
  const password = passwordInput.value;

  if (password.length === 0) {
    strengthText.textContent = "Not checked";
    meterFill.style.width = "0%";
    meter.setAttribute("aria-valuenow", "0");
    feedback.textContent = "Enter a password to begin.";

    Object.entries(requirements).forEach(([id]) => {
      document.getElementById(id).classList.remove("met");
    });

    updateRequirement("length", false, "At least 12 characters");
    updateRequirement("lowercase", false, "A lowercase letter (a-z)");
    updateRequirement("uppercase", false, "An uppercase letter (A-Z)");
    updateRequirement("number", false, "A number (0-9)");
    updateRequirement("symbol", false, "A special character");

    return;
  }

  let score = 0;

  const checks = {
    length: password.length >= 12,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password)
  };

  const labels = {
    length: "At least 12 characters",
    lowercase: "A lowercase letter (a-z)",
    uppercase: "An uppercase letter (A-Z)",
    number: "A number (0-9)",
    symbol: "A special character"
  };

  Object.entries(checks).forEach(([id, passed]) => {
    updateRequirement(id, passed, labels[id]);

    if (passed) score++;
  });

  // Reward additional length.
  if (password.length >= 16) score++;
  if (password.length >= 20) score++;

  // Detect simple repeated or sequential patterns.
  const lower = password.toLowerCase();

  const commonPatterns = [
    "123456", "abcdef", "qwerty",
    "password", "letmein", "111111"
  ];

  const hasCommonPattern = commonPatterns.some(
    pattern => lower.includes(pattern)
  );

  // This is a simple educational heuristic, not a security audit.
  let level;
  let color;
  let percentage;

  if (password.length < 8 || score <= 2 || hasCommonPattern) {
    level = "Weak";
    color = "#ef4444";
    percentage = 25;
  } else if (score <= 4 || hasCommonPattern) {
    level = "Fair";
    color = "#f59e0b";
    percentage = 50;
  } else if (score <= 5) {
    level = "Good";
    color = "#3b82f6";
    percentage = 75;
  } else {
    level = "Strong";
    color = "#22c55e";
    percentage = 100;
  }

  strengthText.textContent = level;
  strengthText.style.color = color;
  meterFill.style.width = `${percentage}%`;
  meterFill.style.backgroundColor = color;
  meter.setAttribute("aria-valuenow", String(percentage));

  const missing = Object.entries(checks)
    .filter(([, passed]) => !passed)
    .map(([id]) => labels[id]);

  if (hasCommonPattern) {
    feedback.textContent =
      "Avoid common password patterns. Use a longer, unique passphrase.";
  } else if (missing.length > 0) {
    feedback.textContent =
      "Improve your password by meeting these requirements: " +
      missing.join(", ") + ".";
  } else if (password.length < 16) {
    feedback.textContent =
      "Good progress! Consider using 16 or more characters and making " +
      "sure the password is unique to this account.";
  } else {
    feedback.textContent =
      "All listed requirements are met. Use a unique password and " +
      "consider a password manager for extra security.";
  }
}

passwordInput.addEventListener("input", checkPassword);

toggleButton.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";

  passwordInput.type = isHidden ? "text" : "password";
  toggleButton.textContent = isHidden ? "Hide" : "Show";
});

checkPassword();
