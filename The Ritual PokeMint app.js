// Log smart contract events
    logEvent('tx', `RitualPokemonNFT: mintCard() minted ${currentRevealedCard.name} (${currentRevealedCard.rarity})`, "0x" + Math.random().toString(16).slice(2, 10));
    showToast("Card Minted to Album!");
    
    // Switch to success view instead of closing overlay immediately
    unboxActions.style.display = 'none';
    successActions.style.display = 'flex';
  });
  btnDiscard.addEventListener('click', () => {
    overlay.classList.remove('active');
    logEvent('info', "Unboxed card discarded by player.");
  });
  btnShare.addEventListener('click', () => {
    if (!currentRevealedCard) return;
    const msg = `I just minted ${currentRevealedCard.name} (${currentRevealedCard.rarity} tier, HP ${currentRevealedCard.hp}) on The Ritual PokeMint! 🪐 Join the Ritual: http://skills.ritualfoundation.org @RitualNet`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`, '_blank');
  });
  btnClose.addEventListener('click', () => {
    overlay.classList.remove('active');
  });
}
function triggerUnboxingSequence(ballType) {
  const overlay = document.getElementById('unboxing-overlay');
  const uBall = document.getElementById('unboxing-ball');
  const card = document.getElementById('revealed-card');
  const actions = document.getElementById('unboxing-actions');
  const successActions = document.getElementById('mint-success-actions');
  const flash = document.getElementById('flash-effect');
  // Configure correct ball style
  if (ballType === 'ultra') {
    uBall.classList.add('ultra-ball');
  } else {
    uBall.classList.remove('ultra-ball');
  }
  // Reset states
  overlay.classList.add('active');
  uBall.style.display = 'block';
  uBall.classList.add('shake');
  card.classList.remove('reveal');
  actions.classList.remove('active');
  actions.style.display = 'flex';
  successActions.style.display = 'none';
  flash.classList.remove('trigger');
  // Gacha probability
  setTimeout(() => {
    // Shake completed: trigger flash burst
    uBall.classList.remove('shake');
    uBall.style.display = 'none';
    flash.classList.add('trigger');
    // Pick card based on ball type
    let templates = [...CARD_TEMPLATES];
    if (ballType === 'ultra') {
      // Ultra ball has higher weight for rare/legendary
      templates = templates.filter(t => t.rarity === 'Legendary' || t.rarity === 'Epic' || t.rarity === 'Rare');
    }
    
    const pickedIndex = Math.floor(Math.random() * templates.length);
    currentRevealedCard = templates[pickedIndex];
    // Populate Card UI
    document.getElementById('card-name').textContent = currentRevealedCard.name;
    document.getElementById('card-hp').textContent = `HP ${currentRevealedCard.hp}`;
    document.getElementById('card-image').src = currentRevealedCard.image;
    document.getElementById('card-rarity').textContent = currentRevealedCard.rarity;
    document.getElementById('card-attack').textContent = currentRevealedCard.attack;
    document.getElementById('card-power').textContent = currentRevealedCard.power;
    document.getElementById('card-desc').textContent = currentRevealedCard.desc;
    // Show Card Reveal and action buttons
    setTimeout(() => {
      card.classList.add('reveal');
      actions.classList.add('active');
    }, 400);
  }, 1800);
}
// ═══════════════════════════════════════════════════════════════
// 5. Inventory Renderer
// ═══════════════════════════════════════════════════════════════
function updateInventoryUI() {
  const container = document.getElementById('inventory-container');
  const empty = document.getElementById('inventory-empty');
  const count = document.getElementById('album-count');
  if (!container) return;
  // Clear existing items
  container.querySelectorAll('.inventory-card-wrapper').forEach(e => e.remove());
  
  if (cardsInventory.length > 0) {
    empty.style.display = 'none';
    count.textContent = `${cardsInventory.length} Cards Owned`;
    
    cardsInventory.forEach(item => {
      const card = document.createElement('div');
      card.className = 'inventory-card-wrapper';
      card.style.position = 'relative';
      card.innerHTML = `
        <div class="mini-card-preview">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="inventory-card-name">${item.name}</div>
        <div class="inventory-card-meta" style="margin-bottom: 10px;">${item.rarity} - HP ${item.hp}</div>
        <button class="btn-share-card" style="width: 100%; background: linear-gradient(135deg, #1d9bf0, #1a8cd8); border: none; color: white; padding: 8px 12px; border-radius: 6px; font-family: var(--font-mono); font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; transition: opacity 0.2s;">🐦 Share Card</button>
      `;
      
      const shareBtn = card.querySelector('.btn-share-card');
      shareBtn.addEventListener('click', () => {
        const msg = `Check out my minted ${item.name} (${item.rarity} tier, HP ${item.hp}) on The Ritual PokeMint! 🪐 Join the Ritual: http://skills.ritualfoundation.org @RitualNet`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`, '_blank');
      });
      shareBtn.addEventListener('mouseover', () => shareBtn.style.opacity = '0.9');
      shareBtn.addEventListener('mouseout', () => shareBtn.style.opacity = '1');
      container.appendChild(card);
    });
  } else {
    empty.style.display = 'block';
    count.textContent = `0 Cards Owned`;
  }
}
