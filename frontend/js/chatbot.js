class ChatbotUI {
  constructor() {
    this.isOpen = false;
    this.loading = false;
    this.messages = [
      { type: 'bot', text: '🌾 Namaste! I\'m your Crop Assistant.\n\nTell me a crop name and I\'ll recommend the best seeds and fertilizers!\n\nTry: wheat, rice, tomato, cotton...' }
    ];
    this.init();
  }

  init() {
    const root = document.getElementById('chatbot-root');
    if (!root) return;

    this.container = document.createElement('div');
    this.container.className = 'chatbot-wrapper';
    root.appendChild(this.container);

    this.render();

    // Listen for custom open event
    window.addEventListener('open-chatbot', () => {
      this.isOpen = true;
      this.render();
    });
  }

  async handleSend() {
    const input = document.getElementById('chatbot-input');
    const text = input.value.trim();
    if (!text || this.loading) return;

    this.messages.push({ type: 'user', text });
    input.value = '';
    this.loading = true;
    this.render();

    try {
      const data = await fetchApi('/chatbot', {
        method: 'POST',
        body: JSON.stringify({ message: text })
      });
      this.messages.push({ type: 'bot', text: data.botResponse });
    } catch {
      this.messages.push({ type: 'bot', text: '⚠️ Sorry, something went wrong. Please try again.' });
    } finally {
      this.loading = false;
      this.render();
    }
  }

  renderMessages() {
    const msgsHtml = this.messages.map(msg => {
      const formattedText = msg.text.split('\n').map(line => {
        return line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      }).join('<br>');
      
      return `
        <div class="chat-msg chat-msg-${msg.type}">
          <div class="chat-bubble">${formattedText}</div>
        </div>
      `;
    }).join('');

    const loadingHtml = this.loading ? `
      <div class="chat-msg chat-msg-bot">
        <div class="chat-bubble typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    ` : '';

    return msgsHtml + loadingHtml;
  }

  render() {
    this.container.innerHTML = `
      <button class="chatbot-fab ${this.isOpen ? 'chatbot-fab-active' : ''}" onclick="window.chatbot.toggle()">
        ${this.isOpen ? '✖' : '💬'}
      </button>

      ${this.isOpen ? `
        <div class="chatbot-window animate-fade-in-up">
          <div class="chatbot-header">
            <div class="chatbot-header-info">
              <div>
                <h4>Crop Assistant</h4>
                <span class="chatbot-status">● Online</span>
              </div>
            </div>
            <button class="chatbot-close" onclick="window.chatbot.toggle()">✖</button>
          </div>

          <div class="chatbot-messages" id="chatbot-messages">
            ${this.renderMessages()}
          </div>

          <div class="chatbot-input-area">
            <input type="text" id="chatbot-input" placeholder="Type a crop name..." ${this.loading ? 'disabled' : ''} onkeydown="if(event.key === 'Enter') window.chatbot.handleSend()">
            <button class="chatbot-send" onclick="window.chatbot.handleSend()" ${this.loading ? 'disabled' : ''}>➤</button>
          </div>
        </div>
      ` : ''}
    `;

    if (this.isOpen) {
      const msgsContainer = document.getElementById('chatbot-messages');
      if (msgsContainer) msgsContainer.scrollTop = msgsContainer.scrollHeight;
      
      const input = document.getElementById('chatbot-input');
      if (input && !this.loading) input.focus();
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.render();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.chatbot = new ChatbotUI();
});
