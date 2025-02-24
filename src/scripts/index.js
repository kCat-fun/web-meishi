const card = document.querySelector(".card");
const frontCard = document.querySelector(".front");
const backCard = document.querySelector(".back");
const animation = document.querySelector(".slide-animation");

let isDragging = false;
let startX = 0, startY = 0;
let currentRotation = 0;
let currentTiltX = 0;

setTimeout(slideCardAnimation, 3000);

function slideCardAnimation() {
    animation.style = "display: block";
}

// 角度を 0~359° に正規化する関数
function normalizeAngle(angle) {
    return ((angle % 360) + 360) % 360;
}

// X軸の回転を -30° 〜 30° に制限
function clampTilt(angle) {
    return Math.max(-30, Math.min(30, angle));
}

// 回転をスナップする関数
function snapRotation() {
    let targetRotation = normalizeAngle(currentRotation);
    
    // 0°か180°にスナップ
    if (targetRotation < 90) {
        targetRotation = 0;
    }
    else if (270 < targetRotation) {
        targetRotation = 360;
    } 
    else {
        targetRotation = 180;
    }
    
    // アニメーションでスナップ
    frontCard.style.transition = "transform 0.3s ease-out";
    backCard.style.transition = "transform 0.3s ease-out";

    // X軸の傾きを 0° に戻す
    frontCard.style.transform = `rotateY(${targetRotation}deg) rotateX(0deg)`;
    backCard.style.transform = `rotateY(${180 + targetRotation}deg) rotateX(0deg) translateY(-100%)`;

    currentRotation = targetRotation;
    currentTiltX = 0;
}

// マウス・タッチ開始時の処理
function startDrag(event) {
    animation.style = "display: none";
    isDragging = true;
    startX = event.clientX ?? event.touches[0].clientX;
    startY = event.clientY ?? event.touches[0].clientY;

    // ドラッグ中はアニメーションを無効化
    frontCard.style.transition = "none";
    backCard.style.transition = "none";
}

// マウス・タッチ移動時の処理
function moveDrag(event) {
    if (!isDragging) return;
    
    let currentX = event.clientX ?? event.touches[0].clientX;
    let currentY = event.clientY ?? event.touches[0].clientY;
    
    let deltaX = currentX - startX;
    let deltaY = currentY - startY;

    // Y軸回転（左右）は 0〜359° の範囲で更新
    currentRotation = normalizeAngle(currentRotation + deltaX * 0.3);

    // X軸回転（上下）は -30° 〜 30° に制限
    currentTiltX = clampTilt(currentTiltX - deltaY * 0.2);

    frontCard.style.transform = `rotateY(${currentRotation}deg) rotateX(${currentTiltX}deg)`;
    backCard.style.transform = `rotateY(${180 + currentRotation}deg) rotateX(${-currentTiltX}deg) translateY(-100%)`;

    startX = currentX;
    startY = currentY;
}

// マウス・タッチ終了時の処理
function endDrag() {
    if (isDragging) {
        isDragging = false;
        snapRotation();
    }
}

// マウスイベント
card.addEventListener("mousedown", startDrag);
document.addEventListener("mousemove", moveDrag);
document.addEventListener("mouseup", endDrag);

// タッチイベント（モバイル対応）
card.addEventListener("touchstart", startDrag);
document.addEventListener("touchmove", moveDrag);
document.addEventListener("touchend", endDrag);
