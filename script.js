const timeline = document.getElementById("timeline");
const prevButton = document.getElementById("timelinePrev");
const nextButton = document.getElementById("timelineNext");
const experienceTrack = document.getElementById("experienceTrack");
const experiencePrevButton = document.getElementById("experiencePrev");
const experienceNextButton = document.getElementById("experienceNext");
const heroPhoto = document.querySelector(".hero-photo");
const navigationEntry = performance.getEntriesByType("navigation")[0];

if (navigationEntry?.type === "reload") {
  history.scrollRestoration = "manual";
  history.replaceState(null, "", `${location.pathname}${location.search}`);
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  window.addEventListener(
    "pageshow",
    () => window.scrollTo({ top: 0, left: 0, behavior: "instant" }),
    { once: true }
  );
}

if (heroPhoto) {
  const hideUnavailableHeroPhoto = () => {
    heroPhoto.classList.add("is-unavailable");
  };

  if (heroPhoto.complete && heroPhoto.naturalWidth === 0) {
    hideUnavailableHeroPhoto();
  } else {
    heroPhoto.addEventListener("error", hideUnavailableHeroPhoto, {
      once: true,
    });
  }
}

if (timeline) {
  function getScrollAmount() {
    const card = timeline.querySelector(".timeline-card");
    if (!card) return 320;
    return card.getBoundingClientRect().width + 18;
  }

  prevButton?.addEventListener("click", () => {
    timeline.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  });

  nextButton?.addEventListener("click", () => {
    timeline.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
  });
}

if (experienceTrack) {
  function scrollExperience(direction) {
    const card = experienceTrack.querySelector(".experience-card");
    if (!card) return;

    const gap = Number.parseFloat(getComputedStyle(experienceTrack).gap) || 0;
    experienceTrack.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: "smooth",
    });
  }

  experiencePrevButton?.addEventListener("click", () => {
    scrollExperience(-1);
  });

  experienceNextButton?.addEventListener("click", () => {
    scrollExperience(1);
  });
}

/* =========================================
   MY JOURNEY LEVEL SYSTEM
   ========================================= */

const journeyStories = {
  1: {
    title: "Rookie",
    chapter: "Freshman Year",

    story: [
      "I entered college without much programming knowledge.",
      "I got into my first few computer science classes: CSE 114 Object-Oriented Programming, CSE 214 Data Structures, and CSE 215 Discrete Math.",
      "I studied hard, earned a 4.0 that year, and worked as a student assistant in the stock room for the organic chemistry lab.",
      "But I did not do much outside the classroom, and thus I was determined to up my game.",
    ],

    links: [],
  },

  2: {
    title: "Novice",
    chapter: "Freshmen Summer",

    story: [
      "I got together with three friends, and we brainstormed project ideas.",
      "We settled on an RPG-like 2D game, where the protagonist collects equipment, levels up, and fights mobs and bosses.",
      "It was a hard journey as it was our first big project.",
      "Most of my friends got busy along the way, but I stayed all the way through.",
      "After three months of consistent effort, I was proud to publish the game online.",
      "At the time, I was just happy to be done. Little did I know, the perseverance demonstrated by the project impressed people enough that it got me my first summer internship experience.",
    ],

    links: [
      {
        label: "Check out Raven @ Projects for more info →",
        href: "#raven",
      },
    ],
  },

  3: {
    title: "Explorer",
    chapter: "Sophomore Summer",

    story: [
      "I got into the REU program at University of Missouri Columbia. The hiring team was very impressed that I handled such a grand project mainly by myself.",
      "On the college campus at Missouri, I worked on researching drones. To be fair, most of what I did was just learning, as I had no prior exposure to drones nor do I have any background in research.",
      "I did a lot of grunt work: classifying images, setting up container environments, doing literature review, and prototyping the drone analysis environment.",
    ],

    links: [
      {
        label: "Check out NSF REU @ Experience for more info →",
        href: "#missouri-reu",
      },
      {
        label: "Check out Drones paper @ Publications for more info →",
        href: "#drone-paper",
      },
    ],
  },

  4: {
    title: "Challenger",
    chapter: "Junior Year",

    story: [
      "I never thought much of the Stony Brook IT career fair, so I did not expect anything when I went for fun this time around.",
      "However, to my surprise, I received interest from the University marketing department.",
      "I interviewed and apparently did the best out of many candidates, and so I now officially make websites for the University.",
      "Around the same time, I grew interested in security through CSE360 Software Security and ended up pursuing research with the professor.",
    ],

    links: [
      {
        label: "Check out SBU Web Services @ Experience for more info →",
        href: "#sbu-web-services",
      },
      {
        label: "Check out ETHOS Lab @ Experience for more info →",
        href: "#ethos-lab",
      },
    ],
  },

  5: {
    title: "Contender",
    chapter: "Junior Summer",

    story: [
      "This is my first corporate internship at First Citizens Bank.",
      "I never had to dress up so professionally before, so this was quite the new experience.",
      "I learned a lot about enterprise software development through mentorship from senior software engineers.",
      "I was now working in a large existing codebase where my changes had to coexist with many legacy systems already used by others.",
      "Code reviews, daily standups, and testing became a big part of my daily job.",
    ],

    links: [
      {
        label: "Check out First Citizens Bank @ Experience for more info →",
        href: "#first-citizens",
      },
    ],
  },

  6: {
    title: "Veteran",
    chapter: "Senior Year",

    story: [
      "I decided to pursue the accelerated BS/MS Computer Science program at Stony Brook University.",
      "At this point, I wanted to advance my knowledge beyond basic software engineering.",
      "I began taking more advanced coursework such as graduate-level operating systems and computer graphics.",
      "My security research also grew into a much larger project, where I took on a leading role and began working toward my first-author workshop paper.",
    ],

    links: [
      {
        label: "Check out Security paper @ Publications for more info →",
        href: "#security-paper",
      },
    ],
  },
};

const journeyNodes = [...document.querySelectorAll(".journey-node")];

const journeyModal = document.getElementById("journeyModal");

const modalLevel = document.getElementById("modalLevel");

const modalTitle = document.getElementById("modalTitle");

const modalChapter = document.getElementById("modalChapter");

const journeyStory = document.getElementById("journeyStory");

const journeyLinks = document.getElementById("journeyLinks");

const skipTypingButton = document.getElementById("skipTyping");

const closeModalButton = document.getElementById("closeJourneyModal");

const exitJourneyButton = document.getElementById("exitJourney");

const resetJourneyButton = document.getElementById("resetJourney");

const progressFill = document.getElementById("journeyProgressFill");

const progressText = document.getElementById("journeyProgressText");

const TOTAL_LEVELS = journeyNodes.length;

let unlockedLevel = Number(localStorage.getItem("journeyUnlockedLevel")) || 1;

let completedLevels = new Set(
  JSON.parse(localStorage.getItem("journeyCompletedLevels") || "[]")
);

let activeLevel = 1;

let skipTyping = false;

let typingSession = 0;

/* -----------------------------------------
     SAVE PROGRESS
     ----------------------------------------- */

function saveJourneyProgress() {
  localStorage.setItem("journeyUnlockedLevel", unlockedLevel);

  localStorage.setItem(
    "journeyCompletedLevels",
    JSON.stringify([...completedLevels])
  );
}

/* -----------------------------------------
     UPDATE LEVEL UI
     ----------------------------------------- */

function renderJourney() {
  journeyNodes.forEach((node) => {
    const level = Number(node.dataset.level);

    const action = node.querySelector(".level-action");

    const isLocked = level > unlockedLevel;

    const isCompleted = completedLevels.has(level);

    const isCurrent = level === unlockedLevel && !isCompleted;

    node.disabled = isLocked;

    node.classList.toggle("locked", isLocked);

    node.classList.toggle("completed", isCompleted);

    node.classList.toggle("current", isCurrent);

    if (isLocked) {
      action.textContent = "🔒 LOCKED";
    } else if (isCompleted) {
      action.textContent = "✓ REPLAY";
    } else {
      action.textContent = "ENTER LEVEL";
    }
  });

  const percentage =
    TOTAL_LEVELS === 1 ? 100 : ((unlockedLevel - 1) / (TOTAL_LEVELS - 1)) * 100;

  progressFill.style.width = `${percentage}%`;

  progressText.textContent = `${Math.min(
    unlockedLevel,
    TOTAL_LEVELS
  )} / ${TOTAL_LEVELS}`;
}

/* -----------------------------------------
     TYPEWRITER STORY
     ----------------------------------------- */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function typeStory(lines) {
  const thisSession = ++typingSession;

  journeyStory.innerHTML = "";

  journeyLinks.innerHTML = "";

  skipTyping = false;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  for (const line of lines) {
    if (thisSession !== typingSession) return;

    const paragraph = document.createElement("p");

    journeyStory.appendChild(paragraph);

    if (reducedMotion || skipTyping) {
      paragraph.textContent = line;
    } else {
      for (const character of line) {
        if (thisSession !== typingSession) return;

        paragraph.textContent += character;

        if (skipTyping) {
          paragraph.textContent = line;

          break;
        }

        await sleep(18);
      }
    }

    await sleep(skipTyping ? 0 : 250);
  }

  if (thisSession !== typingSession) return;

  renderStoryLinks();
}

/* -----------------------------------------
     STORY LINKS
     ----------------------------------------- */

function renderStoryLinks() {
  const story = journeyStories[activeLevel];

  journeyLinks.innerHTML = "";

  story.links.forEach((link) => {
    const anchor = document.createElement("a");

    anchor.href = link.href;

    anchor.textContent = link.label;

    anchor.addEventListener("click", (event) => {
      const targetHash = new URL(anchor.href).hash;
      const target = document.querySelector(targetHash);

      if (!target) return;

      event.preventDefault();
      typingSession++;
      journeyModal.close();
      history.pushState(null, "", targetHash);

      requestAnimationFrame(() => {
        const targetSection = target.closest("section") ?? target;
        targetSection.scrollIntoView({
          block: "start",
          inline: "nearest",
          behavior: "smooth",
        });

        const horizontalTrack = target.closest(".experience-grid");
        if (horizontalTrack) {
          const targetRect = target.getBoundingClientRect();
          const trackRect = horizontalTrack.getBoundingClientRect();
          let horizontalAdjustment = 0;

          if (targetRect.left < trackRect.left) {
            horizontalAdjustment = targetRect.left - trackRect.left;
          } else if (targetRect.right > trackRect.right) {
            horizontalAdjustment = targetRect.right - trackRect.right;
          }

          if (horizontalAdjustment) {
            horizontalTrack.scrollBy({
              left: horizontalAdjustment,
              behavior: "smooth",
            });
          }
        }
      });
    });

    journeyLinks.appendChild(anchor);
  });
}

/* -----------------------------------------
     OPEN LEVEL
     ----------------------------------------- */

function openJourneyLevel(level) {
  const story = journeyStories[level];

  if (!story) return;

  activeLevel = level;

  if (level === unlockedLevel && !completedLevels.has(level)) {
    completedLevels.add(level);

    if (level < TOTAL_LEVELS) {
      unlockedLevel = level + 1;
    }

    saveJourneyProgress();
    renderJourney();
  }

  modalLevel.textContent = `LEVEL ${String(level).padStart(2, "0")}`;
  modalTitle.textContent = story.title;
  modalChapter.textContent = story.chapter;

  if (!journeyModal.open) {
    journeyModal.showModal();
  }

  typeStory(story.story);
}

/* -----------------------------------------
     CLICK LEVELS
     ----------------------------------------- */

journeyNodes.forEach((node) => {
  node.addEventListener("click", () => {
    const level = Number(node.dataset.level);

    if (level <= unlockedLevel) {
      openJourneyLevel(level);
    }
  });
});

/* -----------------------------------------
     SKIP TYPEWRITER
     ----------------------------------------- */

skipTypingButton.addEventListener("click", () => {
  skipTyping = true;
});

/* -----------------------------------------
  EXIT JOURNEY
  ----------------------------------------- */

function exitJourney() {
  typingSession++;
  journeyModal.close();

  const nextNode = document.querySelector(
    `.journey-node[data-level="${activeLevel + 1}"]`
  );

  if (nextNode) {
    setTimeout(() => {
      nextNode.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }, 180);
  }
}

/* -----------------------------------------
     CLOSE MODAL
     ----------------------------------------- */

closeModalButton.addEventListener("click", () => {
  exitJourney();
});

exitJourneyButton.addEventListener("click", exitJourney);

journeyModal.addEventListener("cancel", (event) => {
  event.preventDefault();
  typingSession++;
  journeyModal.close();
});

/* -----------------------------------------
     RESET JOURNEY
     ----------------------------------------- */

resetJourneyButton.addEventListener("click", () => {
  unlockedLevel = 1;

  completedLevels.clear();

  saveJourneyProgress();

  renderJourney();
});

/* -----------------------------------------
     INITIALIZE
     ----------------------------------------- */

const highestCompletedLevel = Math.max(0, ...completedLevels);
const migratedUnlockedLevel = Math.min(
  TOTAL_LEVELS,
  Math.max(unlockedLevel, highestCompletedLevel + 1)
);

if (migratedUnlockedLevel !== unlockedLevel) {
  unlockedLevel = migratedUnlockedLevel;
  saveJourneyProgress();
}

renderJourney();
