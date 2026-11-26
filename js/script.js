// ==========================================================================
// AfyaBora Kenya - Interactive JavaScript (Game, Estimator, Myths & Glossary)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initWindowEstimator();
    initMythsCards();
    initGlossarySearch();
    initKnowledgeQuestGame();
    initKenyaCareMap();
    initContactForm();
});

// --------------------------------------------------------------------------
// 1. Interactive HIV Window Period & Retest Estimator
// --------------------------------------------------------------------------
function initWindowEstimator() {
    const form = document.getElementById("windowEstimatorForm");
    const resultBox = document.getElementById("estimatorResult");
    if (!form || !resultBox) return;

    const windows = {
        nat: { name: "Nucleic Acid Test (NAT)", min: 10, max: 33 },
        lab_ag_ab: { name: "Laboratory Antigen/Antibody Test", min: 18, max: 45 },
        rapid_ag_ab: { name: "Rapid Finger-Prick Antigen/Antibody Test", min: 18, max: 90 },
        antibody: { name: "Antibody-Only Test", min: 23, max: 90 }
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const typeKey = document.getElementById("testTypeSelect").value;
        const days = parseInt(document.getElementById("daysSinceExposure").value, 10);
        const info = windows[typeKey];

        if (isNaN(days) || days < 0) {
            resultBox.className = "mt-3 p-3 rounded-3 bg-warning-subtle border border-warning small";
            resultBox.innerHTML = "Please enter a valid number of days (0 or higher).";
            return;
        }

        let urgentPepNote = "";
        if (days <= 3) {
            urgentPepNote = `<div class="alert alert-danger py-2 px-3 mt-2 mb-0">
                <strong>Within 72 Hours!</strong> If this was a recent high-risk exposure, visit a Kenyan hospital or CCC immediately to ask about emergency <strong>PEP</strong>.
            </div>`;
        }

        if (days < info.min) {
            resultBox.className = "mt-3 p-3 rounded-3 bg-warning-subtle border border-warning small";
            resultBox.innerHTML = `
                <strong>Too Early for Reliable Detection (${days} days):</strong><br>
                The typical window period for a <strong>${info.name}</strong> starts around <strong>${info.min} days</strong> (up to ${info.max} days). Testing now may give a false negative; plan a test after day ${info.min} and a confirmatory retest after day ${info.max}.
                ${urgentPepNote}
            `;
        } else if (days >= info.min && days < info.max) {
            resultBox.className = "mt-3 p-3 rounded-3 bg-info-subtle border border-info small";
            resultBox.innerHTML = `
                <strong>Within Detection Window (${days} days):</strong><br>
                A <strong>${info.name}</strong> can often detect HIV now (${info.min}–${info.max} day window), but a negative result should still be retested after <strong>day ${info.max}</strong> for conclusive confirmation.
                ${urgentPepNote}
            `;
        } else {
            resultBox.className = "mt-3 p-3 rounded-3 bg-success-subtle border border-success small";
            resultBox.innerHTML = `
                <strong>Past Typical Window Period (${days} days):</strong><br>
                At ${days} days post-exposure, a <strong>${info.name}</strong> (typical window: ${info.min}–${info.max} days) is generally conclusive, provided there have been no newer exposures. Consult a Kenyan clinician for personalized advice.
            `;
        }
    });
}

// --------------------------------------------------------------------------
// 2. Interactive Myths vs. Facts Cards
// --------------------------------------------------------------------------
function initMythsCards() {
    const container = document.getElementById("mythsContainer");
    if (!container) return;

    const mythsData = [
        {
            myth: "HIV and AIDS are the same thing.",
            fact: "HIV is the virus; AIDS is its most advanced stage. With daily ART, most people living with HIV never develop AIDS."
        },
        {
            myth: "HIV can spread through hugging or sharing food.",
            fact: "HIV is NOT spread through hugging, shaking hands, sharing plates/cups, or sharing food."
        },
        {
            myth: "You can identify someone with HIV by their appearance.",
            fact: "You cannot tell by looking at someone. Only an HIV test can establish HIV status."
        },
        {
            myth: "HIV has no treatment, or every HIV-positive person has AIDS.",
            fact: "Effective Antiretroviral Therapy (ART) controls HIV and prevents progression to AIDS."
        },
        {
            myth: "HIV can be transmitted by mosquitoes.",
            fact: "Mosquitoes and other insects do not transmit HIV."
        },
        {
            myth: "People with HIV cannot have children.",
            fact: "People living with HIV can have healthy, HIV-negative children with proper ART and medical care (PMTCT)."
        },
        {
            myth: "HIV treatment cures the infection permanently.",
            fact: "ART controls HIV and suppresses the virus to undetectable levels, but does not currently cure it."
        },
        {
            myth: "People with undetectable viral loads still transmit HIV sexually.",
            fact: "Sustained viral suppression prevents sexual transmission (U=U: Undetectable = Untransmittable)."
        }
    ];

    container.innerHTML = mythsData.map((item, idx) => `
        <div class="col-sm-6 col-lg-3">
            <div class="card h-100 rounded-4 shadow-sm myth-flip-card p-3" tabindex="0" role="button" aria-pressed="false" data-idx="${idx}">
                <div class="card-body d-flex flex-column justify-content-between p-1">
                    <div class="myth-view">
                        <span class="badge bg-danger-subtle text-danger fw-bold mb-2">MYTH</span>
                        <p class="fw-bold text-dark mb-0">"${item.myth}"</p>
                    </div>
                    <div class="fact-view d-none">
                        <span class="badge bg-success text-white fw-bold mb-2">FACT</span>
                        <p class="small fw-semibold text-dark mb-0">${item.fact}</p>
                    </div>
                    <div class="mt-3 small fw-bold text-teal toggle-prompt">
                        <i class="bi bi-arrow-repeat me-1"></i> Tap to reveal Fact
                    </div>
                </div>
            </div>
        </div>
    `).join("");

    container.querySelectorAll(".myth-flip-card").forEach(card => {
        const flip = () => {
            const isFact = card.classList.toggle("is-fact");
            card.setAttribute("aria-pressed", String(isFact));
            card.querySelector(".myth-view").classList.toggle("d-none", isFact);
            card.querySelector(".fact-view").classList.toggle("d-none", !isFact);
            card.querySelector(".toggle-prompt").innerHTML = isFact
                ? `<i class="bi bi-arrow-repeat me-1"></i> Tap to see Myth`
                : `<i class="bi bi-arrow-repeat me-1"></i> Tap to reveal Fact`;
        };
        card.addEventListener("click", flip);
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                flip();
            }
        });
    });
}

// --------------------------------------------------------------------------
// 3. Searchable HIV Glossary
// --------------------------------------------------------------------------
function initGlossarySearch() {
    const grid = document.getElementById("glossaryGrid");
    const input = document.getElementById("glossarySearchInput");
    const emptyState = document.getElementById("glossaryEmptyState");
    if (!grid || !input) return;

    const terms = [
        { term: "HIV", desc: "Human Immunodeficiency Virus — attacks CD4 immune cells." },
        { term: "AIDS", desc: "Acquired Immunodeficiency Syndrome — the most advanced stage of untreated HIV." },
        { term: "ART", desc: "Antiretroviral Therapy — combination medicines that prevent HIV from multiplying." },
        { term: "ARVs", desc: "Antiretroviral medicines used in HIV treatment and prevention." },
        { term: "TLD", desc: "Tenofovir + Lamivudine + Dolutegravir — common first-line adult ART regimen in Kenya." },
        { term: "CD4", desc: "White blood cells targeted by HIV that help coordinate the immune response." },
        { term: "Viral Load", desc: "The amount of HIV present in a person's blood." },
        { term: "U=U", desc: "Undetectable = Untransmittable — sustained viral suppression prevents sexual transmission." },
        { term: "PrEP", desc: "Pre-Exposure Prophylaxis — medicine taken before exposure to prevent HIV." },
        { term: "PEP", desc: "Post-Exposure Prophylaxis — emergency medicine started within 72 hours after exposure." },
        { term: "PMTCT", desc: "Prevention of Mother-to-Child Transmission during pregnancy, childbirth, and breastfeeding." },
        { term: "PLHIV", desc: "People Living with HIV." },
        { term: "CCC", desc: "Comprehensive Care Centre — dedicated HIV clinic in Kenyan health facilities." },
        { term: "Opportunistic Infection", desc: "An infection that takes advantage of weakened immunity." },
        { term: "Window Period", desc: "Time between HIV acquisition and when a test can reliably detect it." },
        { term: "Serodiscordant Couple", desc: "A couple in which one partner has HIV and the other does not (also called serodifferent)." }
    ];

    const renderTerms = (filter = "") => {
        const q = filter.trim().toLowerCase();
        const filtered = terms.filter(t => t.term.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q));
        grid.innerHTML = filtered.map(t => `
            <div class="col-sm-6 col-lg-3">
                <div class="card h-100 border-0 shadow-sm rounded-3 p-3 glossary-card">
                    <div class="fw-extrabold text-teal mb-1">${t.term}</div>
                    <div class="small text-muted">${t.desc}</div>
                </div>
            </div>
        `).join("");
        emptyState.classList.toggle("d-none", filtered.length > 0);
    };

    renderTerms();
    input.addEventListener("input", (e) => renderTerms(e.target.value));
}

// --------------------------------------------------------------------------
// 4. AfyaBora HIV Knowledge Quest (Interactive Mini-Game)
// --------------------------------------------------------------------------
function initKnowledgeQuestGame() {
    const startScreen = document.getElementById("gameStartScreen");
    const playScreen = document.getElementById("gamePlayScreen");
    const endScreen = document.getElementById("gameEndScreen");
    const startBtn = document.getElementById("startGameBtn");
    const nextBtn = document.getElementById("nextQuestionBtn");
    const playAgainBtn = document.getElementById("playAgainBtn");
    const shareScoreBtn = document.getElementById("shareScoreBtn");
    const timerToggle = document.getElementById("timerToggle");
    const timerBadge = document.getElementById("gameTimerBadge");

    if (!startBtn) return;

    const questionBank = [
        {
            category: "EMERGENCY PEP SCENARIO",
            q: "A condom breaks during sex with a partner whose HIV status is unknown. Within how many hours must emergency PEP be started?",
            options: [
                "Within 72 hours (ideally within 24 hours)",
                "Within 14 days after symptoms start",
                "Only after waiting 3 months for a blood test",
                "Within 10 days"
            ],
            correct: 0,
            explanation: "PEP must be started as soon as possible—ideally within 24 hours and no later than 72 hours after exposure—and taken for 28 days."
        },
        {
            category: "SCIENCE OF U=U",
            q: "What does U=U (Undetectable = Untransmittable) mean for a person living with HIV on daily ART?",
            options: [
                "They no longer need to take HIV medicine",
                "They cannot transmit HIV to their sexual partners while maintaining an undetectable viral load",
                "They are completely cured of HIV",
                "Mosquitoes cannot bite them"
            ],
            correct: 1,
            explanation: "Maintaining an undetectable viral load through daily ART prevents sexual transmission of HIV (U=U), though treatment must continue."
        },
        {
            category: "MYTH VS. FACT",
            q: "Can HIV be transmitted by sharing plates, cups, spoons, or hugging a colleague living with HIV?",
            options: [
                "Yes, if the food is warm",
                "Only if you share the same cup",
                "No, HIV is never spread through ordinary everyday contact",
                "Yes, through sweat or tears"
            ],
            correct: 2,
            explanation: "HIV is NOT spread through shaking hands, hugging, sharing food or utensils, toilets, sweat, tears, or mosquito bites."
        },
        {
            category: "KENYA TREATMENT CARE",
            q: "What is TLD, the commonly prescribed first-line adult HIV treatment combination in Kenya?",
            options: [
                "Tenofovir + Lamivudine + Dolutegravir",
                "A single-dose vaccine",
                "A herbal nutritional supplement",
                "An antibiotic for malaria"
            ],
            correct: 0,
            explanation: "TLD combines Tenofovir (TDF), Lamivudine (3TC), and Dolutegravir (DTG) to stop HIV from multiplying."
        },
        {
            category: "TESTING & WINDOW PERIOD",
            q: "Why might an HIV test taken 3 days after exposure come back negative even if someone acquired HIV?",
            options: [
                "Because the person is still inside the HIV window period",
                "Because HIV disappears during the first week",
                "Because rapid tests only work after 1 year",
                "Because drinking water erases antibodies"
            ],
            correct: 0,
            explanation: "The window period (10–90 days depending on test type) is the time needed before tests can reliably detect HIV."
        },
        {
            category: "FAMILY & PMTCT",
            q: "Can a pregnant woman living with HIV in Kenya give birth to a healthy, HIV-negative baby?",
            options: [
                "No, HIV always passes to the baby",
                "Yes, with effective ART, antenatal care, and medical infant-feeding guidance (PMTCT)",
                "Only if she stops taking ART during pregnancy",
                "Only if she avoids all clinics"
            ],
            correct: 1,
            explanation: "With PMTCT services, maternal ART, and medical guidance on childbirth and infant feeding, women living with HIV can have HIV-negative babies."
        },
        {
            category: "HIV VS. AIDS",
            q: "Which statement accurately describes the difference between HIV and AIDS?",
            options: [
                "HIV and AIDS are exact synonyms",
                "HIV is the virus; AIDS is the most advanced stage if HIV severely damages the immune system",
                "Everyone diagnosed with HIV automatically has AIDS",
                "AIDS is caused by mosquito bites"
            ],
            correct: 1,
            explanation: "HIV is the virus that attacks CD4 cells; AIDS is the advanced stage. With ART, most people living with HIV never develop AIDS."
        },
        {
            category: "PREVENTION (PrEP)",
            q: "Who is Pre-Exposure Prophylaxis (PrEP) designed for?",
            options: [
                "HIV-negative people at substantial risk of acquiring HIV, taken before exposure",
                "People who have already developed AIDS",
                "Treating flu symptoms after exposure",
                "Replacing all medical checkups"
            ],
            correct: 0,
            explanation: "PrEP is preventive medication started after an HIV-negative test to protect HIV-negative individuals before potential exposure."
        },
        {
            category: "KENYAN HEALTH SERVICES",
            q: "What does CCC stand for in Kenyan public hospitals and health centres?",
            options: [
                "Comprehensive Care Centre",
                "Community Cardiology Clinic",
                "Central Child Care",
                "County Cancer Council"
            ],
            correct: 0,
            explanation: "Comprehensive Care Centres (CCCs) provide confidential HIV testing, counselling, ART, viral load monitoring, and support in Kenya."
        },
        {
            category: "DIAGNOSIS",
            q: "What is the ONLY reliable way to know whether someone has HIV?",
            options: [
                "Checking if they look thin or tired",
                "Taking an HIV test",
                "Checking for a fever",
                "Asking about their diet"
            ],
            correct: 1,
            explanation: "You cannot determine HIV status by appearance or symptoms alone. An HIV test is the only reliable method."
        }
    ];

    let questions = [];
    let currentIndex = 0;
    let score = 0;
    let streak = 0;
    let correctCount = 0;
    let timerInterval = null;
    let timeLeft = 20;
    let answered = false;

    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const stopTimer = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    };

    const startTimer = () => {
        stopTimer();
        if (!timerToggle.checked) {
            timerBadge.classList.add("d-none");
            return;
        }
        timerBadge.classList.remove("d-none");
        timeLeft = 20;
        document.getElementById("gameTimer").textContent = timeLeft;

        timerInterval = setInterval(() => {
            timeLeft--;
            document.getElementById("gameTimer").textContent = timeLeft;
            if (timeLeft <= 0) {
                stopTimer();
                handleTimeOut();
            }
        }, 1000);
    };

    const handleTimeOut = () => {
        if (answered) return;
        answered = true;
        streak = 0;
        document.getElementById("gameStreak").textContent = streak;

        const qObj = questions[currentIndex];
        const buttons = document.querySelectorAll("#optionsContainer .option-btn");
        buttons.forEach((btn, i) => {
            btn.disabled = true;
            if (i === qObj.correct) btn.classList.add("correct");
        });

        const fb = document.getElementById("feedbackBox");
        fb.className = "alert alert-warning mb-3";
        document.getElementById("feedbackTitle").textContent = "Time's Up!";
        document.getElementById("feedbackExplanation").textContent = qObj.explanation;
        nextBtn.classList.remove("d-none");
    };

    const renderQuestion = () => {
        answered = false;
        const qObj = questions[currentIndex];
        document.getElementById("questionCategory").textContent = qObj.category;
        document.getElementById("questionCounter").textContent = `Question ${currentIndex + 1} of ${questions.length}`;
        document.getElementById("questionText").textContent = qObj.q;

        const pct = Math.round(((currentIndex) / questions.length) * 100);
        const pb = document.getElementById("gameProgressBar");
        pb.style.width = `${Math.max(10, pct)}%`;

        const fb = document.getElementById("feedbackBox");
        fb.className = "alert d-none mb-3";
        nextBtn.classList.add("d-none");

        const optionsContainer = document.getElementById("optionsContainer");
        optionsContainer.innerHTML = qObj.options.map((opt, idx) => `
            <button type="button" class="option-btn" data-opt="${idx}">
                <span class="badge bg-light text-dark border me-2">${String.fromCharCode(65 + idx)}</span> ${opt}
            </button>
        `).join("");

        optionsContainer.querySelectorAll(".option-btn").forEach(btn => {
            btn.addEventListener("click", () => selectAnswer(parseInt(btn.getAttribute("data-opt"), 10)));
        });

        startTimer();
    };

    const selectAnswer = (selectedIdx) => {
        if (answered) return;
        answered = true;
        stopTimer();

        const qObj = questions[currentIndex];
        const isCorrect = selectedIdx === qObj.correct;
        const buttons = document.querySelectorAll("#optionsContainer .option-btn");

        buttons.forEach((btn, i) => {
            btn.disabled = true;
            if (i === qObj.correct) btn.classList.add("correct");
            else if (i === selectedIdx && !isCorrect) btn.classList.add("incorrect");
        });

        const fb = document.getElementById("feedbackBox");
        if (isCorrect) {
            streak++;
            correctCount++;
            const earned = 100 + (streak > 1 ? (streak - 1) * 20 : 0);
            score += earned;
            fb.className = "alert alert-success mb-3";
            document.getElementById("feedbackTitle").textContent = `Correct! +${earned} pts`;
        } else {
            streak = 0;
            fb.className = "alert alert-danger mb-3";
            document.getElementById("feedbackTitle").textContent = "Not quite — here is the medical fact:";
        }

        document.getElementById("gameScore").textContent = score;
        document.getElementById("gameStreak").textContent = streak;
        document.getElementById("feedbackExplanation").textContent = qObj.explanation;
        nextBtn.classList.remove("d-none");
    };

    const showEndScreen = () => {
        stopTimer();
        playScreen.classList.add("d-none");
        endScreen.classList.remove("d-none");
        document.getElementById("gameProgressBar").style.width = "100%";

        document.getElementById("finalScoreDisplay").textContent = score;
        document.getElementById("finalAccuracyDisplay").textContent = `${correctCount}/${questions.length}`;

        let title = "AfyaBora Community Advocate";
        if (correctCount >= 9) title = "AfyaBora Master Health Champion";
        else if (correctCount >= 7) title = "AfyaBora Health Champion";
        document.getElementById("championRankTitle").textContent = title;
        document.getElementById("shareStatusMsg").textContent = "";
    };

    const startGame = () => {
        questions = shuffle(questionBank);
        currentIndex = 0;
        score = 0;
        streak = 0;
        correctCount = 0;
        document.getElementById("gameScore").textContent = "0";
        document.getElementById("gameStreak").textContent = "0";
        startScreen.classList.add("d-none");
        endScreen.classList.add("d-none");
        playScreen.classList.remove("d-none");
        renderQuestion();
    };

    startBtn.addEventListener("click", startGame);
    playAgainBtn.addEventListener("click", startGame);

    nextBtn.addEventListener("click", () => {
        currentIndex++;
        if (currentIndex < questions.length) {
            renderQuestion();
        } else {
            showEndScreen();
        }
    });

    timerToggle.addEventListener("change", () => {
        if (!playScreen.classList.contains("d-none") && !answered) {
            startTimer();
        }
    });

    shareScoreBtn.addEventListener("click", async () => {
        const shareText = `I scored ${score} points (${correctCount}/${questions.length}) on the AfyaBora Kenya HIV & AIDS Knowledge Quest! Know your status, U=U, and end HIV stigma.`;
        try {
            await navigator.clipboard.writeText(shareText);
            document.getElementById("shareStatusMsg").textContent = "Result copied to clipboard! Share it with friends and family.";
        } catch {
            document.getElementById("shareStatusMsg").textContent = shareText;
        }
    });
}


// --------------------------------------------------------------------------
// 5. Interactive Kenya HIV Care Map (Leaflet + OpenStreetMap)
// --------------------------------------------------------------------------
function initKenyaCareMap() {
    const mapEl = document.getElementById("kenyaMap");
    const listEl = document.getElementById("kenyaFacilityList");
    if (!mapEl || !listEl || typeof L === "undefined") return;

    // Centered on Kenya
    const kenyaCenter = [-0.0236, 37.9062];
    const defaultZoom = 6;

    const map = L.map("kenyaMap", {
        center: kenyaCenter,
        zoom: defaultZoom,
        scrollWheelZoom: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | AfyaBora Kenya'
    }).addTo(map);

    const facilities = [
        {
            id: "knh",
            name: "Kenyatta National Hospital (KNH) CCC",
            county: "Nairobi",
            region: "Nairobi",
            coords: [-1.3013, 36.8070],
            address: "Hospital Road, Upper Hill, Nairobi",
            services: "24/7 PEP, HIV Testing, ART, Viral Load Lab, PMTCT",
            phone: "+254 20 2726300"
        },
        {
            id: "mdh",
            name: "Mbagathi County Referral Hospital CCC",
            county: "Nairobi",
            region: "Nairobi",
            coords: [-1.3088, 36.7937],
            address: "Mbagathi Way, Nairobi",
            services: "HIV Testing, ART (TLD), PrEP, PEP, TB Screening",
            phone: "1190 (Toll-Free)"
        },
        {
            id: "cgh",
            name: "Coast General Teaching & Referral Hospital",
            county: "Mombasa",
            region: "Coast",
            coords: [-4.0547, 39.6636],
            address: "Kisauni Road, Mombasa",
            services: "24/7 PEP, Comprehensive Care Centre, PrEP, PMTCT",
            phone: "+254 41 2314201"
        },
        {
            id: "kilifi",
            name: "Kilifi County Referral Hospital CCC",
            county: "Kilifi",
            region: "Coast",
            coords: [-3.6305, 39.8499],
            address: "Bofa Road, Kilifi Town",
            services: "Confidential Testing, ART, Youth-Friendly PrEP/PEP",
            phone: "1190 (Toll-Free)"
        },
        {
            id: "jaramogi",
            name: "Jaramogi Oginga Odinga Teaching & Referral Hospital",
            county: "Kisumu",
            region: "Western",
            coords: [-0.0886, 34.7717],
            address: "Kakamega Road, Kisumu",
            services: "24/7 PEP, ART, Viral Load Monitoring, Peer Support",
            phone: "+254 57 2020801"
        },
        {
            id: "mtrh",
            name: "Moi Teaching & Referral Hospital (AMPATH CCC)",
            county: "Uasin Gishu",
            region: "Western",
            coords: [0.5110, 35.2804],
            address: "Nandi Road, Eldoret",
            services: "24/7 PEP, AMPATH HIV Care, PrEP, PMTCT, Nutrition",
            phone: "+254 53 2033471"
        },
        {
            id: "nakuru",
            name: "Nakuru Level 5 County Referral Hospital",
            county: "Nakuru",
            region: "Rift & Central",
            coords: [-0.2756, 36.0663],
            address: "Hospital Road, Nakuru",
            services: "HIV Testing, ART, PrEP, Emergency PEP, TB Care",
            phone: "+254 51 2215580"
        },
        {
            id: "nyeri",
            name: "Nyeri County Referral Hospital CCC",
            county: "Nyeri",
            region: "Rift & Central",
            coords: [-0.4212, 36.9476],
            address: "Kenyatta Road, Nyeri",
            services: "Confidential Testing, ART, PrEP, PEP, Counselling",
            phone: "1190 (Toll-Free)"
        }
    ];

    const customPin = L.divIcon({
        className: "",
        html: '<div class="afya-map-pin"><i class="bi bi-heart-pulse-fill"></i></div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });

    const markersById = {};
    const markerLayer = L.layerGroup().addTo(map);

    const renderFacilities = (regionFilter = "all") => {
        listEl.innerHTML = "";
        markerLayer.clearLayers();

        const filtered = regionFilter === "all"
            ? facilities
            : facilities.filter(f => f.region === regionFilter);

        const bounds = [];

        filtered.forEach((fac) => {
            bounds.push(fac.coords);

            const popupHtml = `
                <div style="min-width: 220px; font-family: 'Plus Jakarta Sans', sans-serif;">
                    <span class="badge bg-success mb-1">${fac.county} County</span>
                    <h6 class="fw-bold mb-1 text-dark">${fac.name}</h6>
                    <p class="small text-muted mb-1"><i class="bi bi-geo-alt-fill text-danger"></i> ${fac.address}</p>
                    <p class="small mb-1"><strong>Services:</strong> ${fac.services}</p>
                    <p class="small mb-0"><strong>Contact:</strong> ${fac.phone}</p>
                </div>
            `;

            const marker = L.marker(fac.coords, { icon: customPin })
                .bindPopup(popupHtml)
                .addTo(markerLayer);

            markersById[fac.id] = marker;

            const itemBtn = document.createElement("button");
            itemBtn.type = "button";
            itemBtn.className = "list-group-item list-group-item-action p-3 facility-item text-start";
            itemBtn.innerHTML = `
                <div class="d-flex justify-content-between align-items-start gap-2">
                    <strong class="small text-dark">${fac.name}</strong>
                    <span class="badge bg-teal-soft text-teal rounded-pill flex-shrink-0">${fac.county}</span>
                </div>
                <div class="small text-muted mt-1"><i class="bi bi-geo-alt me-1"></i>${fac.address}</div>
                <div class="small text-success fw-semibold mt-1">${fac.services}</div>
            `;

            itemBtn.addEventListener("click", () => {
                document.querySelectorAll(".facility-item").forEach(el => el.classList.remove("active-facility"));
                itemBtn.classList.add("active-facility");
                map.flyTo(fac.coords, 14, { duration: 0.9 });
                marker.openPopup();
            });

            listEl.appendChild(itemBtn);
        });

        if (regionFilter === "all") {
            map.setView(kenyaCenter, defaultZoom);
        } else if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
        }
    };

    renderFacilities("all");

    // Region Filter Buttons
    const filterButtons = document.querySelectorAll("#regionFilterGroup button");
    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            filterButtons.forEach((b) => {
                b.classList.remove("btn-teal", "text-white", "active");
                b.classList.add("btn-outline-secondary");
            });
            btn.classList.remove("btn-outline-secondary");
            btn.classList.add("btn-teal", "text-white", "active");
            renderFacilities(btn.dataset.region);
        });
    });

    // Reset Map Button
    const resetBtn = document.getElementById("resetKenyaMapBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            document.querySelectorAll(".facility-item").forEach(el => el.classList.remove("active-facility"));
            map.flyTo(kenyaCenter, defaultZoom, { duration: 0.8 });
        });
    }
}

// --------------------------------------------------------------------------
// 6. Interactive Contact Inquiry Form Validation & Feedback
// --------------------------------------------------------------------------
function initContactForm() {
    const form = document.getElementById("contactInquiryForm");
    const feedback = document.getElementById("contactFormFeedback");
    if (!form || !feedback) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const county = document.getElementById("contactCounty").value;
        const topic = document.getElementById("contactTopic").value;
        const message = document.getElementById("contactMessage").value.trim();
        const consent = document.getElementById("privacyConsent").checked;

        if (!name || !email || !county || !message || !consent) {
            feedback.className = "mt-4 alert alert-warning rounded-3 small";
            feedback.innerHTML = '<i class="bi bi-exclamation-circle-fill me-2"></i>Please complete all required fields and confirm the confidentiality notice before sending.';
            feedback.classList.remove("d-none");
            return;
        }

        const refCode = "AB-KE-" + Math.floor(100000 + Math.random() * 900000);
        feedback.className = "mt-4 alert alert-success rounded-4 p-4 small";
        feedback.innerHTML = `
            <div class="d-flex align-items-start gap-3">
                <i class="bi bi-check-circle-fill fs-4 text-success"></i>
                <div>
                    <h4 class="h6 fw-bold mb-1">Asante, ${name}! Your Confidential Message Has Been Received.</h4>
                    <p class="mb-2">Reference ID: <strong>${refCode}</strong> | County: <strong>${county}</strong> | Topic: <strong>${topic}</strong></p>
                    <p class="mb-0 text-muted">An AfyaBora Kenya counsellor will respond to <strong>${email}</strong>. For urgent 72-hour PEP or immediate support, call the toll-free Kenyan helpline at <strong>1190</strong>.</p>
                </div>
            </div>
        `;
        feedback.classList.remove("d-none");
        form.reset();
    });
}
