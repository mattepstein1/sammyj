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
    let next3 = new Date(now);
    next3.setHours(15, 0, 0, 0); // 3:00 PM
    if (now >= next3) {
        next3.setDate(next3.getDate() + 1);
    }
    return next3;
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
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    document.getElementById('countdown').textContent = `${hours}h ${minutes}m ${seconds}s`;
    setTimeout(updateCountdown, 1000);
}

function showConfetti() {
    const confetti = document.getElementById('confetti');
    confetti.innerHTML = '';
    for (let i = 0; i < 150; i++) {
        const div = document.createElement('div');
        div.className = 'confetti';
        div.style.left = Math.random() * 100 + 'vw';
        div.style.top = '-10px';
        div.style.background = `hsl(${Math.random()*360},100%,50%)`;
        div.style.width = div.style.height = Math.random() * 8 + 4 + 'px';
        div.style.position = 'absolute';
        div.style.borderRadius = '50%';
        div.style.opacity = Math.random();
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
