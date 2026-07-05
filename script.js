(function () {
  "use strict";

  var APOLOGIES = [
    // Tier 1 (0-10)
    [
      "I'm sorry.",
      "My apologies.",
      "I apologize for the inconvenience.",
      "Sorry about that.",
      "Please forgive me.",
      "Pardon me.",
      "I regret this.",
      "My bad.",
      "I'm so sorry."
    ],
    // Tier 2 (11-25)
    [
      "I deeply apologize.",
      "I am so incredibly sorry.",
      "Please, I beg your forgiveness.",
      "I messed up, I'm sorry.",
      "I can't believe I did that, sorry.",
      "I feel terrible about this.",
      "I am groveling for your pardon.",
      "I am entirely at fault.",
      "My sincerest, deepest apologies.",
      "I am a fool, please forgive."
    ],
    // Tier 3 (26-50)
    [
      "I am unworthy of your time, sorry.",
      "Please, I am on my knees.",
      "I am a wretched creature, forgive me.",
      "I have brought shame upon my ancestors.",
      "The guilt is consuming me.",
      "I am sorry the moon is not closer to you today.",
      "I am a disaster, I am so sorry.",
      "I'll never forgive myself for this.",
      "If I could turn back time, I would.",
      "My existence is an apology."
    ],
    // Tier 4 (51+)
    [
      "I AM SORRY FOR EVERYTHING THAT HAS EVER HAPPENED.",
      "FORGIVE ME FOR I HAVE SINNED AGAINST YOU SPECIFICALLY.",
      "PUNISH ME, I DESERVE IT.",
      "I AM WEEPING UNCONTROLLABLY, PLEASE STOP CLICKING.",
      "THE STARS ARE DEAD AND IT IS ALL MY FAULT.",
      "I WILL WRITE A THOUSAND APOLOGIES IN MY OWN BLOOD.",
      "PLEASE I CANNOT TAKE THE GUILT ANYMORE.",
      "I AM SORRY THE UNIVERSE IS SO COLD AND EMPTY.",
      "EVERYTHING IS MY FAULT, EVEN THE THINGS THAT AREN'T.",
      "I AM JUST A MISTAKE WRAPPED IN AN APOLOGY.",
      "ENDLESS TIDE OF SORROW AND REGRET WASHES OVER ME."
    ]
  ];

  var BG_COLORS = [
    "#faf9f6", // cream
    "#f5ebe9", // light blush
    "#ead1cd", // more blush
    "#d6a3a1", // rosy
    "#b56563", // redder
    "#8a2b2b", // crimson
    "#4a0e0e", // dark blood
    "#1a0202", // almost black
    "#000000"  // black
  ];

  var TEXT_COLORS = [
    "#111111", // dark
    "#1a0f0f",
    "#2a1515",
    "#401a1a",
    "#ffffff", // flips to white when bg gets dark
    "#ffffff",
    "#ffdddd",
    "#ffbbbb",
    "#ff0000"  // dramatic red at the end
  ];

  var stage = document.getElementById("stage");
  var apologyEl = document.getElementById("apology");
  var countEl = document.getElementById("count");
  var counterEl = document.getElementById("counter");

  var clickCount = 0;
  var lastIndex = -1;

  function pickApology(nextCount) {
    var tierIndex = 0;
    if (nextCount > 50) tierIndex = 3;
    else if (nextCount > 25) tierIndex = 2;
    else if (nextCount > 10) tierIndex = 1;

    var pool = APOLOGIES[tierIndex];
    var randIdx = Math.floor(Math.random() * pool.length);

    if (randIdx === lastIndex && pool.length > 1) {
      randIdx = (randIdx + 1) % pool.length;
    }
    lastIndex = randIdx;

    return pool[randIdx];
  }

  function spawnParticle(x, y) {
    var particle = document.createElement("div");
    particle.className = "particle";
    particle.textContent = "sorry";
    particle.style.left = x + "px";
    particle.style.top = y + "px";
    particle.style.transform =
      "translate(0, 0) scale(0.5) rotate(" + (Math.random() * 40 - 20) + "deg)";
    document.body.appendChild(particle);

    // Force reflow so the transition triggers
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        particle.classList.add("fly");
        particle.style.transform =
          "translate(0, -100px) scale(2) rotate(" + (Math.random() * 80 - 40) + "deg)";
      });
    });

    setTimeout(function () {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 900);
  }

  function handleClick(e) {
    clickCount += 1;

    var intensityLevel = Math.min(
      Math.floor(clickCount / 8),
      BG_COLORS.length - 1
    );
    var bgColor = BG_COLORS[intensityLevel];
    var textColor = TEXT_COLORS[intensityLevel];
    var isDramatic = clickCount > 25;
    var isUnhinged = clickCount > 50;

    var text = pickApology(clickCount);

    stage.style.backgroundColor = bgColor;
    apologyEl.style.color = textColor;
    counterEl.style.color = textColor;

    apologyEl.textContent = text;
    apologyEl.classList.remove("dramatic", "unhinged");
    if (isUnhinged) {
      apologyEl.classList.add("unhinged");
    } else if (isDramatic) {
      apologyEl.classList.add("dramatic");
    }

    // Retrigger the entrance animation
    apologyEl.classList.remove("show");
    void apologyEl.offsetWidth; // reflow
    apologyEl.classList.add("show");

    // Screen shake
    stage.classList.remove("shake-medium", "shake-hard");
    if (isUnhinged) {
      void stage.offsetWidth;
      stage.classList.add("shake-hard");
    } else if (isDramatic) {
      void stage.offsetWidth;
      stage.classList.add("shake-medium");
    }

    countEl.textContent = String(clickCount);

    spawnParticle(e.clientX, e.clientY);
  }

  stage.addEventListener("click", handleClick);
})();
