// Sliding background images
const bgImages = [
    './DSCF3525.JPG',
    './1.JPG',
    './3.JPG',
    './4.JPG',
    './5.JPG',
    './6.JPG',
    './7.JPG',
];
let bgIndex = 0;
function changeBackground() {
    bgIndex = (bgIndex + 1) % bgImages.length;
    document.querySelector('.main-bg').style.backgroundImage = `url('${bgImages[bgIndex]}')`;
}
setInterval(changeBackground, 10000);
function getNZTTime() {
    // Get current time in NZT (UTC+12 or UTC+13 for daylight saving)
    const now = new Date();
    // NZT is UTC+12, adjust for daylight saving if needed
    let offset = 12;
    // NZDT starts last Sunday in September, ends first Sunday in April
    const year = now.getUTCFullYear();
    const lastSepSun = new Date(Date.UTC(year, 8, 30 - (new Date(Date.UTC(year, 8, 30)).getUTCDay())));
    const firstAprSun = new Date(Date.UTC(year, 3, 7 - (new Date(Date.UTC(year, 3, 7)).getUTCDay())));
    if (now >= lastSepSun || now < firstAprSun) offset = 13;
    return new Date(now.getTime() + (offset - now.getTimezoneOffset() / 60) * 3600000);
}

function getNext3OClockNZT() {
    const now = getNZTTime();
    // Find next Friday in NZT
    let daysUntilFri = (5 - now.getDay() + 7) % 7;
    let target = new Date(now);
    if (daysUntilFri === 0 && now.getHours() >= 15) {
        // If it's Friday and after 3pm NZT, go to next week's Friday
        daysUntilFri = 7;
    }
    target.setDate(now.getDate() + daysUntilFri + 1);
    target.setHours(15, 0, 0, 0); // 3:00 PM NZT
    return target;
}

function updateCountdown() {
    const now = getNZTTime();
    const next3 = getNext3OClockNZT();
    const diff = next3 - now;
    if (diff <= 0) {
        showConfetti();
        setTimeout(hideConfetti, 5000);
        setTimeout(updateCountdown, 1000); // Wait for confetti
        return;
    }
    const days = Math.floor(diff / (24 * 3600000));
    const hours = Math.floor((diff % (24 * 3600000)) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    document.getElementById('countdown').textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    setTimeout(updateCountdown, 1000);
}

function showConfetti() {
    const confetti = document.getElementById('confetti');
    confetti.innerHTML = '';
    for (let i = 0; i < 400; i++) {
        const div = document.createElement('div');
        div.className = 'confetti';
        div.style.left = Math.random() * 100 + 'vw';
        div.style.top = '-10px';
        div.style.background = `hsl(${Math.random()*360},100%,60%)`;
        div.style.width = div.style.height = Math.random() * 16 + 8 + 'px';
        div.style.position = 'absolute';
        div.style.borderRadius = '50%';
        div.style.opacity = 0.7 + Math.random() * 0.3;
        div.style.animation = `confetti-fall ${Math.random()*2+2}s linear forwards`;
        confetti.appendChild(div);
    }
}

function hideConfetti() {
    document.getElementById('confetti').innerHTML = '';
}

// Confetti animation CSS
const style = document.createElement('style');
style.textContent = `
@keyframes confetti-fall {
    to {
        transform: translateY(100vh) rotate(360deg);
    }
}
.confetti {
    will-change: transform;
}
`;
document.head.appendChild(style);

document.getElementById('partyBtn').addEventListener('click', function() {
    showConfetti();
    setTimeout(hideConfetti, 5000);
});

updateCountdown();
