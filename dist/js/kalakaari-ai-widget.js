/**
 * Kalakaari AI Chat Widget
 * Custom interactive assistant for Kalakaari Studios
 */
(function() {
  if (document.getElementById('kalakaari-ai-widget-root')) return;

  // 1. Inject Styles
  const style = document.createElement('style');
  style.id = 'kalakaari-ai-widget-styles';
  style.textContent = `
    #kalakaari-ai-widget-root,
    #kalakaari-ai-widget-root * {
      box-sizing: border-box !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased !important;
      text-transform: none !important;
    }

    #kalakaari-ai-widget-root {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      user-select: none;
    }

    /* Floating Launcher Button */
    .kai-launcher {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      background: #FFFFFF !important;
      color: #111827 !important;
      padding: 8px 18px 8px 10px !important;
      border-radius: 9999px !important;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.15) !important;
      border: 1px solid rgba(0, 0, 0, 0.08) !important;
      cursor: pointer !important;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease !important;
      position: relative !important;
    }
    .kai-launcher:hover {
      transform: translateY(-2px) scale(1.02) !important;
      box-shadow: 0 14px 30px -4px rgba(0, 0, 0, 0.3) !important;
    }
    .kai-launcher-icon {
      width: 32px !important;
      height: 32px !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, #FF6B4A, #FF4B4B) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: #FFFFFF !important;
      flex-shrink: 0 !important;
      box-shadow: 0 2px 8px rgba(255, 75, 75, 0.35) !important;
    }
    .kai-launcher-icon svg {
      width: 17px !important;
      height: 17px !important;
      fill: #FFFFFF !important;
      display: block !important;
    }
    .kai-launcher-text {
      font-size: 14.5px !important;
      font-weight: 600 !important;
      letter-spacing: -0.01em !important;
      color: #111827 !important;
      white-space: nowrap !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    /* Chat Modal Window */
    .kai-modal {
      position: fixed !important;
      bottom: 24px !important;
      right: 24px !important;
      width: 440px !important;
      max-width: calc(100vw - 32px) !important;
      height: 620px !important;
      max-height: calc(100vh - 48px) !important;
      background: #E5E7EB !important;
      border-radius: 24px !important;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.08) !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
      opacity: 0 !important;
      transform: translateY(20px) scale(0.96) !important;
      pointer-events: none !important;
      transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
      z-index: 100000 !important;
    }
    .kai-modal.kai-open {
      opacity: 1 !important;
      transform: translateY(0) scale(1) !important;
      pointer-events: auto !important;
    }

    /* Top Bar */
    .kai-header {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding: 16px 20px 14px 20px !important;
      background: #E5E7EB !important;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
      flex-shrink: 0 !important;
      position: relative !important;
    }
    .kai-header-logo {
      display: flex !important;
      align-items: center !important;
    }
    .kai-header-logo img {
      height: 30px !important;
      width: auto !important;
      max-width: 145px !important;
      object-fit: contain !important;
      display: block !important;
    }
    .kai-header-actions {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
    }
    .kai-btn-icon {
      width: 32px !important;
      height: 32px !important;
      border-radius: 50% !important;
      background: #D1D5DB !important;
      border: 1px solid rgba(0, 0, 0, 0.06) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: #374151 !important;
      cursor: pointer !important;
      transition: background 0.15s, color 0.15s, transform 0.15s !important;
      padding: 0 !important;
      margin: 0 !important;
      outline: none !important;
    }
    .kai-btn-icon:hover {
      background: #9CA3AF !important;
      color: #111827 !important;
      transform: scale(1.05) !important;
    }
    .kai-btn-icon svg {
      width: 16px !important;
      height: 16px !important;
      fill: #374151 !important;
      display: block !important;
    }

    /* Options Popup Menu */
    .kai-options-menu {
      position: absolute !important;
      top: 56px !important;
      right: 20px !important;
      background: #FFFFFF !important;
      border-radius: 14px !important;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.08) !important;
      padding: 8px !important;
      width: 220px !important;
      display: none !important;
      flex-direction: column !important;
      gap: 4px !important;
      z-index: 100001 !important;
    }
    .kai-options-menu.kai-menu-visible {
      display: flex !important;
    }
    .kai-menu-item {
      padding: 8px 12px !important;
      font-size: 13px !important;
      font-weight: 500 !important;
      color: #1F2937 !important;
      border-radius: 8px !important;
      cursor: pointer !important;
      text-decoration: none !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      transition: background 0.15s !important;
    }
    .kai-menu-item:hover {
      background: #F3F4F6 !important;
      color: #000000 !important;
    }

    /* Scrollable Content Body */
    .kai-body {
      flex: 1 !important;
      overflow-y: auto !important;
      padding: 20px !important;
      display: flex !important;
      flex-direction: column !important;
      scroll-behavior: smooth !important;
      background: #E5E7EB !important;
    }

    /* Welcome / Hero State */
    .kai-modal:not(.kai-in-chat) .kai-welcome {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      text-align: center !important;
      margin-top: auto !important;
      margin-bottom: auto !important;
      padding: 10px 0 !important;
    }
    .kai-modal.kai-in-chat .kai-welcome {
      display: none !important;
    }

    .kai-welcome-badge {
      width: 62px !important;
      height: 62px !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, #FF6B4A, #FF4B4B) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: #FFFFFF !important;
      box-shadow: 0 8px 22px rgba(255, 75, 75, 0.4) !important;
      margin-bottom: 18px !important;
    }
    .kai-welcome-badge svg {
      width: 30px !important;
      height: 30px !important;
      fill: #FFFFFF !important;
      display: block !important;
    }
    .kai-welcome-title {
      font-size: 24px !important;
      font-weight: 700 !important;
      color: #111827 !important;
      margin: 0 0 6px 0 !important;
      letter-spacing: -0.02em !important;
      line-height: 1.25 !important;
    }
    .kai-welcome-subtitle {
      font-size: 15px !important;
      color: #4B5563 !important;
      margin: 0 0 24px 0 !important;
      font-weight: 400 !important;
    }

    /* Suggestion Chips */
    .kai-chips {
      display: flex !important;
      flex-wrap: wrap !important;
      justify-content: center !important;
      gap: 10px !important;
      max-width: 390px !important;
    }
    .kai-chip {
      background: #D1D5DB !important;
      color: #111827 !important;
      border: 1.5px solid #9CA3AF !important;
      border-radius: 12px !important;
      padding: 9px 15px !important;
      font-size: 13.5px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1) !important;
      text-align: center !important;
      line-height: 1.3 !important;
      outline: none !important;
    }
    .kai-chip:hover {
      background: #FFFFFF !important;
      color: #000000 !important;
      border-color: #4B5563 !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1) !important;
    }

    /* Message Thread */
    .kai-modal:not(.kai-in-chat) .kai-messages {
      display: none !important;
    }
    .kai-modal.kai-in-chat .kai-messages {
      display: flex !important;
      flex-direction: column !important;
      gap: 14px !important;
      width: 100% !important;
    }
    .kai-msg {
      max-width: 85% !important;
      font-size: 14px !important;
      line-height: 1.55 !important;
      word-break: break-word !important;
      animation: kaiFadeUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .kai-msg-user {
      align-self: flex-end !important;
      background: #111827 !important;
      color: #FFFFFF !important;
      padding: 11px 16px !important;
      border-radius: 18px 18px 4px 18px !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
    }
    .kai-msg-bot {
      align-self: flex-start !important;
      background: #FFFFFF !important;
      color: #1F2937 !important;
      padding: 14px 18px !important;
      border-radius: 18px 18px 18px 4px !important;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06) !important;
      border: 1px solid rgba(0, 0, 0, 0.05) !important;
    }
    .kai-msg-bot strong {
      color: #111827 !important;
    }
    .kai-msg-bot ul {
      margin: 8px 0 8px 18px !important;
      padding: 0 !important;
    }
    .kai-msg-bot li {
      margin-bottom: 4px !important;
    }
    .kai-wa-btn {
      display: inline-flex !important;
      align-items: center !important;
      gap: 8px !important;
      background: #25D366 !important;
      color: #FFFFFF !important;
      font-weight: 600 !important;
      font-size: 13.5px !important;
      padding: 8px 15px !important;
      border-radius: 9999px !important;
      text-decoration: none !important;
      margin-top: 10px !important;
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.35) !important;
      transition: transform 0.15s, background 0.15s !important;
    }
    .kai-wa-btn:hover {
      background: #20BD5A !important;
      transform: translateY(-1px) !important;
    }

    /* Typing Indicator */
    .kai-typing {
      display: flex !important;
      align-items: center !important;
      gap: 5px !important;
      padding: 12px 18px !important;
      background: #FFFFFF !important;
      border-radius: 18px 18px 18px 4px !important;
      align-self: flex-start !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
    }
    .kai-typing-dot {
      width: 7px !important;
      height: 7px !important;
      border-radius: 50% !important;
      background: #9CA3AF !important;
      animation: kaiPulse 1.2s infinite ease-in-out !important;
    }
    .kai-typing-dot:nth-child(2) { animation-delay: 0.2s !important; }
    .kai-typing-dot:nth-child(3) { animation-delay: 0.4s !important; }

    @keyframes kaiPulse {
      0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
      40% { transform: scale(1.1); opacity: 1; }
    }
    @keyframes kaiFadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Footer & Input */
    .kai-footer {
      padding: 12px 18px 14px 18px !important;
      background: #E5E7EB !important;
      border-top: 1px solid rgba(0, 0, 0, 0.06) !important;
      flex-shrink: 0 !important;
    }
    .kai-input-wrap {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      background: #E5E7EB !important;
      border: 1.5px solid #9CA3AF !important;
      border-radius: 16px !important;
      padding: 6px 6px 6px 16px !important;
      transition: border-color 0.15s, background 0.15s !important;
    }
    .kai-input-wrap:focus-within {
      background: #FFFFFF !important;
      border-color: #4B5563 !important;
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.06) !important;
    }
    .kai-input {
      flex: 1 !important;
      border: none !important;
      background: transparent !important;
      outline: none !important;
      font-size: 14px !important;
      color: #111827 !important;
      padding: 4px 0 !important;
      margin: 0 !important;
    }
    .kai-input::placeholder {
      color: #6B7280 !important;
    }
    .kai-send-btn {
      width: 32px !important;
      height: 32px !important;
      border-radius: 50% !important;
      background: #111827 !important;
      color: #FFFFFF !important;
      border: none !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      transition: background 0.15s, transform 0.15s !important;
      flex-shrink: 0 !important;
      padding: 0 !important;
      margin: 0 !important;
      outline: none !important;
      box-shadow: none !important;
    }
    .kai-send-btn:hover {
      background: #000000 !important;
      transform: scale(1.08) !important;
    }
    .kai-send-btn svg {
      width: 15px !important;
      height: 15px !important;
      fill: #FFFFFF !important;
      display: block !important;
    }
    .kai-credit {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 5px !important;
      font-size: 11.5px !important;
      color: #6B7280 !important;
      margin-top: 8px !important;
    }
    .kai-credit svg {
      width: 13px !important;
      height: 13px !important;
      fill: #6B7280 !important;
      display: block !important;
    }

    /* Mobile Responsive */
    @media (max-width: 480px) {
      #kalakaari-ai-widget-root {
        bottom: 16px !important;
        right: 16px !important;
      }
      .kai-modal {
        bottom: 12px !important;
        right: 12px !important;
        left: 12px !important;
        width: auto !important;
        max-width: none !important;
        height: calc(100vh - 24px) !important;
        border-radius: 20px !important;
      }
      .kai-welcome-title {
        font-size: 21px !important;
      }
      .kai-chips {
        gap: 8px !important;
      }
      .kai-chip {
        padding: 8px 12px !important;
        font-size: 12.5px !important;
      }
    }
  `;
  document.head.appendChild(style);

  // 2. Knowledge Base for Kalakaari Studios
  const KNOWLEDGE_BASE = {
    editor: {
      match: ['same editor', 'editor', 'work with', 'dedicated', 'who edits'],
      reply: '<strong>Yes! At Kalakaari Studios, you are paired with a dedicated editor.</strong><br><br>They learn your branding, pacing, color grading, sound design, and visual humor so every video maintains consistent high quality.'
    },
    revisions: {
      match: ['unlimited revisions', 'revision', 'changes', 'edits', 're-edit'],
      reply: '<strong>We offer unlimited revisions on all projects!</strong><br><br>We collaborate with you on Frame.io until you are 100% completely thrilled with the final cut — at no extra charge.'
    },
    turnaround: {
      match: ['turnaround', 'time', 'how long', 'fast', 'hours', 'timeline'],
      reply: '<strong>Our turnaround times:</strong><ul><li><strong>Short-Form (Reels, TikTok, Shorts):</strong> 24 to 48 hours</li><li><strong>Long-Form (YouTube, Vlogs, Podcasts):</strong> 48 to 72 hours</li></ul>Rush turnaround is also available upon request!'
    },
    footage: {
      match: ['send footage', 'footage', 'upload', 'google drive', 'dropbox', 'raw files', 'wetransfer'],
      reply: '<strong>Sending footage is effortless!</strong><br><br>You can share files via Google Drive, Dropbox, Frame.io, or WeTransfer. Just paste the link, and our team takes care of the rest.'
    },
    seo: {
      match: ['seo', 'strategy', 'thumbnail', 'title', 'growth', 'retention'],
      reply: '<strong>Yes, we provide full retention & packaging strategy!</strong><br><br>This includes click-worthy YouTube title variations, eye-catching thumbnail concepts, hook optimization, and fast-paced retention pacing.'
    },
    pricing: {
      match: ['pricing', 'price', 'cost', 'charge', 'rate', 'package', 'plan', 'how much'],
      reply: '<strong>We offer flexible monthly plans and custom project rates:</strong><br><br>Whether you need high-volume short-form reels or cinematic YouTube long-form videos, we have packages tailored to creators and businesses.<br><br><a href="https://wa.me/917000371321?text=Hello%20Kalakaari%20Studios!%20I%20want%20to%20inquire%20about%20pricing%20packages." target="_blank" class="kai-wa-btn">💬 Inquire on WhatsApp</a>'
    }
  };

  function getAnswer(query) {
    const q = query.toLowerCase();
    for (const key in KNOWLEDGE_BASE) {
      const item = KNOWLEDGE_BASE[key];
      if (item.match.some(m => q.includes(m))) {
        return item.reply;
      }
    }
    return `Thank you for asking! Kalakaari Studios is your premier full-service video editing partner for creators, businesses, and YouTubers.<br><br>Would you like to speak directly with our team to discuss your project?<br><br><a href="https://wa.me/917000371321?text=Hello%20Kalakaari%20Studios!%20I%20have%20a%20question:%20${encodeURIComponent(query)}" target="_blank" class="kai-wa-btn">💬 Chat with us on WhatsApp</a>`;
  }

  // 3. Create DOM Structure
  const root = document.createElement('div');
  root.id = 'kalakaari-ai-widget-root';

  root.innerHTML = `
    <!-- Launcher Pill Button -->
    <div class="kai-launcher" id="kai-launcher" role="button" tabindex="0" aria-label="Open Kalakaari AI Assistant">
      <div class="kai-launcher-icon">
        <svg viewBox="0 0 24 24"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg>
      </div>
      <span class="kai-launcher-text">Questions? Ask Kalakaari AI 😁</span>
    </div>

    <!-- Modal Window -->
    <div class="kai-modal" id="kai-modal" role="dialog" aria-modal="true" aria-hidden="true">
      <!-- Header -->
      <div class="kai-header">
        <div class="kai-header-logo">
          <img src="./img/kalakaari-logo-dark.svg" alt="Kalakaari Studio logo" width="1054" height="361">
        </div>
        <div class="kai-header-actions">
          <div class="kai-btn-icon" id="kai-btn-reset" role="button" tabindex="0" title="New chat" aria-label="New chat">
            <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </div>
          <div class="kai-btn-icon" id="kai-btn-dots" role="button" tabindex="0" title="Options" aria-label="Options">
            <svg viewBox="0 0 24 24"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
          </div>
          <div class="kai-btn-icon" id="kai-btn-close" role="button" tabindex="0" title="Close" aria-label="Close">
            <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
          </div>
        </div>

        <!-- Options Menu -->
        <div class="kai-options-menu" id="kai-options-menu">
          <a href="https://wa.me/917000371321?text=Hello%20Kalakaari%20Studios!%20I%20want%20to%20talk%20to%20your%20team." target="_blank" class="kai-menu-item">
            💬 Chat on WhatsApp
          </a>
          <div class="kai-menu-item" id="kai-menu-clear">
            🔄 Restart Conversation
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="kai-body" id="kai-body">
        <!-- Welcome Screen -->
        <div class="kai-welcome" id="kai-welcome">
          <div class="kai-welcome-badge">
            <svg viewBox="0 0 24 24"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg>
          </div>
          <h2 class="kai-welcome-title">Questions? Ask Kalakaari AI 😁</h2>
          <p class="kai-welcome-subtitle">How can we help you today?</p>
          <div class="kai-chips">
            <div class="kai-chip" role="button" tabindex="0" data-q="Will I work with the same editor?">Will I work with the same editor?</div>
            <div class="kai-chip" role="button" tabindex="0" data-q="Can I get unlimited revisions?">Can I get unlimited revisions?</div>
            <div class="kai-chip" role="button" tabindex="0" data-q="What are the turnaround times?">What are the turnaround times?</div>
            <div class="kai-chip" role="button" tabindex="0" data-q="How do I send you my footage?">How do I send you my footage?</div>
            <div class="kai-chip" role="button" tabindex="0" data-q="Do you provide SEO & strategy?">Do you provide SEO & strategy?</div>
          </div>
        </div>

        <!-- Messages Thread -->
        <div class="kai-messages" id="kai-messages"></div>
      </div>

      <!-- Footer & Input -->
      <div class="kai-footer">
        <form class="kai-input-wrap" id="kai-form" onsubmit="return false;">
          <input type="text" class="kai-input" id="kai-input" placeholder="What do you want to ask?" autocomplete="off">
          <div class="kai-send-btn" id="kai-send-btn" role="button" tabindex="0" aria-label="Send">
            <svg viewBox="0 0 24 24"><path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"/></svg>
          </div>
        </form>
        <div class="kai-credit">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          <span>Powered by Kalakaari AI</span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(root);

  // 4. Interaction Logic
  const launcher = document.getElementById('kai-launcher');
  const modal = document.getElementById('kai-modal');
  const btnClose = document.getElementById('kai-btn-close');
  const btnReset = document.getElementById('kai-btn-reset');
  const btnDots = document.getElementById('kai-btn-dots');
  const optionsMenu = document.getElementById('kai-options-menu');
  const menuClear = document.getElementById('kai-menu-clear');
  const sendBtn = document.getElementById('kai-send-btn');
  const input = document.getElementById('kai-input');
  const body = document.getElementById('kai-body');
  const messages = document.getElementById('kai-messages');

  function openModal() {
    modal.classList.add('kai-open');
    modal.setAttribute('aria-hidden', 'false');
    launcher.style.display = 'none';
    setTimeout(() => input.focus(), 200);
  }

  function closeModal() {
    modal.classList.remove('kai-open');
    modal.setAttribute('aria-hidden', 'true');
    optionsMenu.classList.remove('kai-menu-visible');
    launcher.style.display = 'flex';
  }

  function resetChat() {
    modal.classList.remove('kai-in-chat');
    optionsMenu.classList.remove('kai-menu-visible');
    messages.innerHTML = '';
    input.value = '';
    input.focus();
  }

  function scrollToBottom() {
    body.scrollTop = body.scrollHeight;
  }

  function sendMessage(text) {
    if (!text || !text.trim()) return;
    const q = text.trim();

    // Switch to message view
    modal.classList.add('kai-in-chat');
    optionsMenu.classList.remove('kai-menu-visible');

    // Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'kai-msg kai-msg-user';
    userMsg.textContent = q;
    messages.appendChild(userMsg);
    input.value = '';
    scrollToBottom();

    // Show Typing Indicator
    const typing = document.createElement('div');
    typing.className = 'kai-typing';
    typing.innerHTML = '<div class="kai-typing-dot"></div><div class="kai-typing-dot"></div><div class="kai-typing-dot"></div>';
    messages.appendChild(typing);
    scrollToBottom();

    // Answer delay
    setTimeout(() => {
      if (typing.parentNode) typing.parentNode.removeChild(typing);
      const botMsg = document.createElement('div');
      botMsg.className = 'kai-msg kai-msg-bot';
      botMsg.innerHTML = getAnswer(q);
      messages.appendChild(botMsg);
      scrollToBottom();
    }, 400);
  }

  // Event Listeners
  launcher.addEventListener('click', openModal);
  btnClose.addEventListener('click', closeModal);
  btnReset.addEventListener('click', resetChat);

  if (btnDots) {
    btnDots.addEventListener('click', (e) => {
      e.stopPropagation();
      optionsMenu.classList.toggle('kai-menu-visible');
    });
  }

  if (menuClear) {
    menuClear.addEventListener('click', resetChat);
  }

  document.addEventListener('click', (e) => {
    if (optionsMenu && !optionsMenu.contains(e.target) && e.target !== btnDots) {
      optionsMenu.classList.remove('kai-menu-visible');
    }
  });

  sendBtn.addEventListener('click', () => {
    sendMessage(input.value);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  // Chip Clicks
  root.querySelectorAll('.kai-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      sendMessage(chip.getAttribute('data-q'));
    });
  });

  // Close on Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('kai-open')) {
      closeModal();
    }
  });

  // Expose global controller
  window.KalakaariAI = {
    open: openModal,
    close: closeModal,
    reset: resetChat,
    ask: sendMessage
  };
})();
