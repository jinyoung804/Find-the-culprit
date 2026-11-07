const IMAGE_DIR = "../assets/image/";
const DEFAULT_IMAGE = IMAGE_DIR + "file.png";

// ---------- 배경 이미지 매핑 ----------
const BACKGROUND_MAP = {
    radio: "radio.png",
    apartment: "apartment.png",
    icecream: "icecream.png",
    animal: "animal.png",
    festival: "festivities.png",

    workshop: "Workshop.png",
    ticket: "Ticket.png",
    yoga: "Yoga.png",
    flea_market: "Flea_Market.png",
    test: "test.png"
};

// ---------- 열쇠 아이콘 (공통 이미지 3종 재사용) ----------
const KEY_ICON_MAP = {
    key1: IMAGE_DIR + "key1.png",
    key2: IMAGE_DIR + "key2.png",
    key3: IMAGE_DIR + "key3.png"
};

// ---------- 용의자 아이콘 매핑 ----------
const SUSPECT_ICON_MAP = {
    // level1 suspects[].id
    broadcast_member: "mike.png",
    teacher: "teacher.png",
    manager: "Laptop.png",
    cleaner: "broomstick.png",
    bike_neighbor: "mike.png",
    janitor: "broomstick.png",
    guard: "teacher.png",
    neighbor: "teacher.png",
    parttimer: "mike.png",
    store_owner: "teacher.png",
    delivery_man: "broomstick.png",
    regular_customer: "mike.png",
    staff_a: "mike.png",
    staff_b: "teacher.png",
    cafe_owner: "teacher.png",
    guest: "mike.png",
    staff: "teacher.png",
    village_head: "teacher.png",
    resident: "mike.png",
    host: "teacher.png",

    // level2 suspects[].id
    workshop1: "Workshop1.png",
    workshop2: "Workshop2.png",
    workshop3: "Workshop3.png",
    workshop4: "Workshop4.png",
    ticket1: "Ticket1.png",
    ticket2: "Ticket2.png",
    ticket3: "Ticket3.png",
    ticket4: "Ticket4.png",
    ticket5: "Ticket5.png",
    yoga1: "Yoga1.png",
    yoga2: "Yoga2.png",
    yoga3: "Yoga3.png",
    yoga4: "Yoga4.png",
    flea_market1: "Flea_Market1.png",
    flea_market2: "Flea_Market2.png",
    flea_market3: "Flea_Market3.png",
    flea_market4: "Flea_Market4.png",
    test1: "test1.png",
    test2: "test2.png",
    test3: "test3.png",
    test4: "test4.png",

    // 기존 icon 값 호환
    mike: "mike.png",
    laptop: "Laptop.png",
    broomstick: "broomstick.png",
    person_silhouette: "mike.png",
    guard: "teacher.png",
    couple: "teacher.png",
    parttimer: "mike.png",
    store_owner: "teacher.png",
    delivery: "broomstick.png",
    customer: "mike.png",
    staff_a: "mike.png",
    staff_b: "teacher.png",
    cafe_owner: "teacher.png",
    guest: "mike.png",
    staff: "teacher.png",
    village_head: "teacher.png",
    resident: "mike.png",
    host: "teacher.png",

    // 사건별 별칭
    workshop_t: "Workshop1.png",
    studenta: "Workshop2.png",
    studentb: "Workshop3.png",
    workshop_ceo: "Workshop4.png",
    ticket_designer: "Ticket1.png",
    theater_manager: "Ticket2.png",
    employee: "Ticket3.png",
    theater_actor: "Ticket4.png",
    ticket5: "Ticket5.png",
    yoga1: "Yoga1.png",
    yoga2: "Yoga2.png",
    yoga3: "Yoga3.png",
    yoga4: "Yoga4.png",
    flea_market1: "Flea_Market1.png",
    flea_market2: "Flea_Market2.png",
    flea_market3: "Flea_Market3.png",
    flea_market4: "Flea_Market4.png",
    test1: "test1.png",
    test2: "test2.png",
    test3: "test3.png",
    test4: "test4.png"
};

// ---------- 열쇠 위치 ----------
const CLUE_POSITION_MAP = {
    workshop: {
        key1: { top: "39%", left: "15%" },
        key2: { top: "31%", left: "55%" },
        key3: { top: "51%", left: "78%" }
    },
    ticket: {
        key1: { top: "29%", left: "12%" },
        key2: { top: "28%", left: "65%" },
        key3: { top: "52%", left: "80%" }
    },
    yoga: {
        key1: { top: "41%", left: "26%" },
        key2: { top: "31%", left: "59%" },
        key3: { top: "54%", left: "77%" }
    },
    flea_market: {
        key1: { top: "41%", left: "26%" },
        key2: { top: "31%", left: "59%" },
        key3: { top: "54%", left: "77%" }
    },
    test: {
        key1: { top: "30%", left: "13%" },
        key2: { top: "29%", left: "65%" },
        key3: { top: "53%", left: "78%" }
    }
};

let currentLevel = null;
let selectedSuspectId = null;
let timerInterval = null;
let isGameCleared = false;

// ---------- 경로 헬퍼 ----------
function getBackgroundPath(bgKey) {
    if (!bgKey) return DEFAULT_IMAGE;
    const mapped = BACKGROUND_MAP[String(bgKey).toLowerCase()];
    return mapped ? IMAGE_DIR + mapped : `${IMAGE_DIR}${bgKey}.png`;
}

function getSuspectIconPath(suspect) {
    const suspectKey = suspect?.id || suspect?.icon;
    if (!suspectKey) return IMAGE_DIR + "mike.png";

    const mapped = SUSPECT_ICON_MAP[String(suspectKey).toLowerCase()];
    return mapped ? IMAGE_DIR + mapped : IMAGE_DIR + "mike.png";
}

function getCluePosition(clue, bgKey) {
    if (clue.position) return clue.position;

    const bgPositions = CLUE_POSITION_MAP[String(bgKey).toLowerCase()];
    if (bgPositions && bgPositions[clue.id]) return bgPositions[clue.id];

    return { top: "50%", left: "50%" };
}

function setImageWithFallback(imgEl, path) {
    imgEl.onerror = () => {
        console.warn(`이미지를 찾을 수 없음: ${path}`);
        imgEl.onerror = null;
        imgEl.src = DEFAULT_IMAGE;
    };
    imgEl.src = path;
}

// ---------- 실시간 타이머 기능 ----------
function startTimer() {
    let startTime = sessionStorage.getItem("startTime");

    if (!startTime) {
        startTime = Date.now();
        sessionStorage.setItem("startTime", startTime);
    }

    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - Number(startTime)) / 1000);

        const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, "0");
        const seconds = String(elapsedTime % 60).padStart(2, "0");
        const timeString = `${minutes}:${seconds}`;

        // 1단계(story-time)와 2단계(suspect-time) 두 텍스트 영역 모두 업데이트
        const storyTimer = document.getElementById("story-time");
        const suspectTimer = document.getElementById("suspect-time");

        if (storyTimer) storyTimer.innerText = timeString;
        if (suspectTimer) suspectTimer.innerText = timeString;
    }, 1000);
}

// ---------- URL에서 level, title 읽기 ----------
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        level: params.get("level") || "1",
        title: params.get("title") || ""
    };
}

// ---------- 데이터 불러오기 ----------
async function loadLevelByTitle(targetTitle, level) {
    try {
        const res = await fetch(`../data/level${level}.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const dataList = await res.json();
        const found = dataList.find((item) => item.title === targetTitle);

        if (!found) {
            console.log("해당 제목의 사건을 찾을 수 없습니다.");
            return null;
        }
        return found;
    } catch (err) {
        console.error("사건 데이터를 불러오지 못했습니다:", err);
        return null;
    }
}

// ---------- 1단계: 사건 설명 화면 ----------
function renderStoryScene(level) {
    document.getElementById("story-title").textContent = level.title;
    document.getElementById("story-text").textContent = level.story;

    setImageWithFallback(
        document.getElementById("bg-image"),
        getBackgroundPath(level.background)
    );

    renderClueMarkers(level.clues, level.background);
}

// ---------- [추가] 힌트 구역 층을 "화면에 실제로 보이는 이미지"와 똑같은 크기/위치로 맞춤 ----------
// 배경 이미지는 원래 코드 그대로 object-fit: cover 로 표시하고,
// 힌트 구역 층만 이미지가 실제로 그려진 영역에 겹쳐 놓음.
// 그래서 창 크기가 달라져도 이미지가 잘리는 대로 구역이 같이 움직여서 항상 같은 물건 위에 있음.
// (position의 % 값은 "화면"이 아니라 "이미지 자체" 기준)
function layoutClueLayer() {
    const img = document.getElementById("bg-image");
    const layer = document.getElementById("clue-markers");
    if (!img || !layer || !img.naturalWidth) return;

    const area = img.parentElement;
    if (layer.parentElement !== area) area.appendChild(layer);

    const W = area.clientWidth;
    const H = area.clientHeight;
    if (!W || !H) return; // 다른 화면이 켜져 있어서 크기를 잴 수 없을 때

    const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;

    layer.style.position = "absolute";
    layer.style.width = w + "px";
    layer.style.height = h + "px";
    layer.style.left = (W - w) / 2 + "px";
    layer.style.top = (H - h) / 2 + "px";
}

function renderClueMarkers(clues, bgKey) {
    const container = document.getElementById("clue-markers");
    container.innerHTML = "";

    clues.forEach((clue) => {
        // JSON 내부 position 사용
        const pos = clue.position || { top: "50%", left: "50%", width: "80px", height: "80px" };

        const btn = document.createElement("button");
        btn.className = "clue-marker";

        // 위치 및 너비/높이 동적 할당
        btn.style.top = pos.top;
        btn.style.left = pos.left;
        btn.style.width = pos.width || "80px";
        btn.style.height = pos.height || "80px";

        // 물건 모양대로 구역을 깎고 싶을 때: position에 "shape": "polygon(...)" 추가
        if (pos.shape) btn.style.clipPath = pos.shape;

        // title 속성을 쓰면 브라우저 기본 말풍선이 떠서 쓰지 않음
        if (clue.label) btn.setAttribute("aria-label", clue.label);

        // 클릭 시 힌트 팝업
        btn.addEventListener("click", () => showCluePopup(clue.text));

        container.appendChild(btn);
    });
}

function showCluePopup(text) {
    document.getElementById("clue-text").textContent = text;
    document.getElementById("clue-popup").classList.remove("hidden");
}

function closeCluePopup() {
    document.getElementById("clue-popup").classList.add("hidden");
}

// ---------- [추가] 좌표 측정 도구 ----------
// 사용법: 사건 화면 주소 끝에 &debug=1 을 붙여서 열고,
//        이미지에서 힌트로 쓸 물건 위를 마우스로 드래그해서 사각형을 그리면
//        화면 위쪽에 "position" 값이 나타나고 클립보드에도 복사됩니다.
//        그 값을 JSON의 해당 clue 안에 붙여넣으면 끝.
function enableClueDebug() {
    const stage = document.getElementById("clue-markers");
    const area = document.querySelector(".scene-bg");

    const box = document.createElement("div");
    box.style.cssText =
        "position:absolute;border:2px dashed #00e5ff;background:rgba(0,229,255,.25);" +
        "pointer-events:none;z-index:999;display:none";
    stage.appendChild(box);

    const panel = document.createElement("div");
    panel.style.cssText =
        "position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:99999;" +
        "background:#000;color:#0ff;font:13px/1.5 monospace;padding:8px 14px;" +
        "border-radius:8px;max-width:92vw;user-select:text;";
    panel.textContent = "좌표 측정 모드: 물건 위를 드래그해 보세요";
    document.body.appendChild(panel);

    let startX = 0, startY = 0, drawing = false, moved = false;

    const pointIn = (e) => {
        const r = stage.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    area.addEventListener("mousedown", (e) => {
        if (e.target.closest(".arrow-btn, .story-box")) return;
        e.preventDefault();
        const p = pointIn(e);
        startX = p.x;
        startY = p.y;
        drawing = true;
        moved = false;
        box.style.display = "block";
        box.style.left = startX + "px";
        box.style.top = startY + "px";
        box.style.width = "0px";
        box.style.height = "0px";
    }, true);

    window.addEventListener("mousemove", (e) => {
        if (!drawing) return;
        moved = true;
        const p = pointIn(e);
        box.style.left = Math.min(startX, p.x) + "px";
        box.style.top = Math.min(startY, p.y) + "px";
        box.style.width = Math.abs(p.x - startX) + "px";
        box.style.height = Math.abs(p.y - startY) + "px";
    });

    window.addEventListener("mouseup", () => {
        if (!drawing) return;
        drawing = false;
        if (!moved) return;

        const r = stage.getBoundingClientRect();
        const pct = (v, total) => ((v / total) * 100).toFixed(1) + "%";
        const text =
            `"position": { "top": "${pct(parseFloat(box.style.top), r.height)}", ` +
            `"left": "${pct(parseFloat(box.style.left), r.width)}", ` +
            `"width": "${pct(parseFloat(box.style.width), r.width)}", ` +
            `"height": "${pct(parseFloat(box.style.height), r.height)}" }`;

        panel.textContent = text;
        console.log(text);
        if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    });

    // 드래그 직후 힌트 팝업이 열리지 않게 막기
    area.addEventListener("click", (e) => {
        if (moved) {
            e.stopPropagation();
            e.preventDefault();
            moved = false;
        }
    }, true);
}

// ---------- 2단계: 범인 선택 화면 ----------
function renderSuspectScene(level) {
    selectedSuspectId = null;

    const grid = document.getElementById("suspect-grid");
    grid.innerHTML = "";

    level.suspects.forEach((suspect) => {
        const item = document.createElement("button");
        item.className = "suspect-item";
        item.dataset.id = suspect.id;

        const img = document.createElement("img");
        img.alt = suspect.name;
        setImageWithFallback(img, getSuspectIconPath(suspect));

        const label = document.createElement("span");
        label.textContent = suspect.name;

        item.appendChild(img);
        item.appendChild(label);

        item.addEventListener("click", () => {
            document.querySelectorAll(".suspect-item").forEach((el) =>
                el.classList.remove("selected")
            );
            item.classList.add("selected");
            selectedSuspectId = suspect.id;
        });

        grid.appendChild(item);
    });
}

function checkAnswer(level) {
    if (!selectedSuspectId) {
        showResultPopup("범인을 먼저 선택해주세요.");
        return;
    }

    const isCorrect = selectedSuspectId === level.answer;

    if (isCorrect) {
        // 타이머 중지 및 소요 시간 저장
        clearInterval(timerInterval);

        const startTime = sessionStorage.getItem("startTime");
        const totalSeconds = startTime ? Math.floor((Date.now() - Number(startTime)) / 1000) : 0;
        sessionStorage.setItem("clearTime", totalSeconds);
        sessionStorage.removeItem("startTime");

        isGameCleared = true;

        let message = "정답입니다! 사건을 해결했습니다.";
        if (level.explanation) message += `\n\n${level.explanation}`;
        showResultPopup(message);
    } else {
        showResultPopup("오답입니다. 다시 추리해보세요.");
    }
}

function showResultPopup(text) {
    const el = document.getElementById("result-text");
    el.textContent = text;
    el.style.whiteSpace = "pre-line";
    document.getElementById("result-popup").classList.remove("hidden");
}

function closeResultPopup() {
    document.getElementById("result-popup").classList.add("hidden");

    if (isGameCleared) {
        window.location.href = "../pages/result.html";
    }
}

// ---------- 화면 전환 ----------
function switchScene(fromId, toId) {
    document.getElementById(fromId).classList.remove("active");
    document.getElementById(toId).classList.add("active");
}

// ---------- 초기 실행 ----------
async function init() {
    const { level, title } = getQueryParams();
    const levelData = await loadLevelByTitle(title, level);

    if (!levelData) {
        console.log("사건 데이터를 불러오지 못했습니다.");
        return;
    }

    currentLevel = levelData;

    // 이미지가 로드되거나 창 크기가 바뀔 때마다 힌트 구역 층을 이미지에 다시 맞춤
    const bgImg = document.getElementById("bg-image");
    bgImg.addEventListener("load", layoutClueLayer);
    window.addEventListener("resize", layoutClueLayer);

    renderStoryScene(levelData);
    layoutClueLayer(); // 이미 캐시된 이미지일 때 대비

    // 주소 끝에 &debug=1 이 있으면 좌표 측정 도구 켜기
    if (new URLSearchParams(location.search).get("debug") === "1") {
        enableClueDebug();
    }

    // 실시간 타이머 시작
    startTimer();

    document.getElementById("next-btn").addEventListener("click", () => {
        renderSuspectScene(currentLevel);
        switchScene("scene-story", "scene-suspects");
    });

    document.getElementById("back-btn").addEventListener("click", () => {
        switchScene("scene-suspects", "scene-story");
        layoutClueLayer(); // 다시 보일 때 크기 재계산
    });

    document.getElementById("check-btn").addEventListener("click", () => {
        checkAnswer(currentLevel);
    });

    document.getElementById("clue-close").addEventListener("click", closeCluePopup);
    document.getElementById("result-close").addEventListener("click", closeResultPopup);
}

init();