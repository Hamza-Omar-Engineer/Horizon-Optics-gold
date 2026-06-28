// ====================================
// Horizon Optics - Gemini Chatbot
// ضع API Key هنا فقط - لا تشاركه مع أحد
// ====================================
const GEMINI_API_KEY = "AQ.Ab8RN6La8aHOyzKESmnjKtiJ7DNpXcPUYrswqKAhFhqJohSs0A";

const SYSTEM_PROMPT = `أنت مساعد ذكي لشركة Horizon Optics (HO)، شركة متخصصة في البرمجة والتصميم.

خدمات الشركة:
البرمجة: تطبيقات الجوال (iOS/Android)، مواقع وأنظمة سحابية، برامج سطح المكتب، IoT وArduino/ESP32، أتمتة صناعية PLC
التصميم: تصميم داخلي، تصميم خارجي/معماري، تصميم ثلاثي الأبعاد، تصميم إعلاني وهوية بصرية

قواعد:
- رد بنفس لغة المستخدم (عربي←عربي، إنجليزي←إنجليزي)
- كن ودوداً ومختصراً (أقل من 80 كلمة)
- للأسعار: قل "الأسعار تختلف حسب المشروع، تواصل معنا للحصول على عرض مجاني"
- شجع دائماً على تقديم طلب مشروع عبر الموقع
- المؤسس: حمزة عمر`;

let conversationHistory = [];

async function sendToGemini(userMessage) {
  conversationHistory.push({
    role: "user",
    parts: [{ text: userMessage }]
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: conversationHistory
      })
    }
  );

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، حدث خطأ.";

  conversationHistory.push({
    role: "model",
    parts: [{ text: reply }]
  });

  return reply;
}

// ====================================
// واجهة المستخدم
// ====================================
function createChatbot() {
  const style = document.createElement("style");
  style.textContent = `
    #ho-chat-btn {
      position: fixed; bottom: 24px; right: 24px;
      width: 56px; height: 56px; border-radius: 50%;
      background: #b8972a; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 16px rgba(184,151,42,0.4);
      z-index: 9999; transition: transform 0.2s;
    }
    #ho-chat-btn:hover { transform: scale(1.08); }
    #ho-chat-btn svg { width: 26px; height: 26px; fill: white; }

    #ho-chat-box {
      position: fixed; bottom: 90px; right: 24px;
      width: 340px; height: 480px;
      background: #1a1a1a; border-radius: 16px;
      border: 1px solid #b8972a44;
      display: none; flex-direction: column;
      z-index: 9999; overflow: hidden;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }
    #ho-chat-box.open { display: flex; }

    #ho-chat-header {
      padding: 14px 16px;
      background: linear-gradient(135deg, #b8972a, #8a6f1e);
      display: flex; align-items: center; gap: 10px;
    }
    #ho-chat-header .avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px; color: white;
    }
    #ho-chat-header .title { color: white; font-size: 14px; font-weight: 600; }
    #ho-chat-header .subtitle { color: rgba(255,255,255,0.8); font-size: 11px; }
    #ho-close-btn {
      margin-left: auto; background: none; border: none;
      color: white; font-size: 20px; cursor: pointer; padding: 0 4px;
    }

    #ho-messages {
      flex: 1; overflow-y: auto; padding: 14px;
      display: flex; flex-direction: column; gap: 10px;
      scrollbar-width: thin; scrollbar-color: #b8972a44 transparent;
    }

    .ho-msg {
      max-width: 82%; padding: 9px 13px;
      border-radius: 12px; font-size: 13px;
      line-height: 1.5; font-family: inherit;
    }
    .ho-msg.bot {
      background: #2a2a2a; color: #e0e0e0;
      align-self: flex-start; border-bottom-left-radius: 3px;
      border: 0.5px solid #333;
    }
    .ho-msg.user {
      background: #b8972a; color: white;
      align-self: flex-end; border-bottom-right-radius: 3px;
    }
    .ho-msg.typing { color: #888; font-style: italic; }

    .ho-quick-btns {
      display: flex; flex-wrap: wrap; gap: 5px; margin-top: 7px;
    }
    .ho-qbtn {
      font-size: 11px; padding: 3px 9px;
      border: 1px solid #b8972a66; border-radius: 20px;
      background: transparent; color: #b8972a; cursor: pointer;
      transition: background 0.2s;
    }
    .ho-qbtn:hover { background: #b8972a22; }

    #ho-input-row {
      padding: 10px 12px;
      border-top: 1px solid #2a2a2a;
      display: flex; gap: 7px; background: #1a1a1a;
    }
    #ho-input {
      flex: 1; padding: 8px 11px;
      border: 1px solid #333; border-radius: 8px;
      background: #2a2a2a; color: #e0e0e0;
      font-size: 13px; outline: none;
      font-family: inherit;
    }
    #ho-input:focus { border-color: #b8972a; }
    #ho-send {
      padding: 8px 14px; background: #b8972a;
      color: white; border: none; border-radius: 8px;
      font-size: 13px; cursor: pointer; font-weight: 600;
    }
    #ho-send:hover { background: #9a7d22; }
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML("beforeend", `
    <button id="ho-chat-btn" aria-label="افتح المحادثة">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    </button>

    <div id="ho-chat-box">
      <div id="ho-chat-header">
        <div class="avatar">HO</div>
        <div>
          <div class="title">Horizon Optics</div>
          <div class="subtitle">● متصل الآن | Online</div>
        </div>
        <button id="ho-close-btn">✕</button>
      </div>
      <div id="ho-messages"></div>
      <div id="ho-input-row">
        <input id="ho-input" type="text" placeholder="اكتب سؤالك..." />
        <button id="ho-send">إرسال</button>
      </div>
    </div>
  `);

  const box = document.getElementById("ho-chat-box");
  const btn = document.getElementById("ho-chat-btn");
  const closeBtn = document.getElementById("ho-close-btn");
  const messages = document.getElementById("ho-messages");
  const input = document.getElementById("ho-input");
  const sendBtn = document.getElementById("ho-send");

  btn.onclick = () => {
    box.classList.toggle("open");
    if (box.classList.contains("open") && messages.children.length === 0) {
      addMessage(
        'أهلاً وسهلاً! أنا مساعد Horizon Optics الذكي 👋<br>بقدر أساعدك في البرمجة والتصميم. شو بتحتاج؟',
        "bot",
        true
      );
    }
  };
  closeBtn.onclick = () => box.classList.remove("open");

  function addMessage(text, role, withQuickBtns = false) {
    const div = document.createElement("div");
    div.className = "ho-msg " + role;
    div.innerHTML = text;
    if (withQuickBtns) {
      div.innerHTML += `
        <div class="ho-quick-btns">
          <button class="ho-qbtn" onclick="hoQuick('شو خدماتكم؟')">خدماتنا</button>
          <button class="ho-qbtn" onclick="hoQuick('كم أسعاركم؟')">الأسعار</button>
          <button class="ho-qbtn" onclick="hoQuick('بدي أطلب مشروع')">طلب مشروع</button>
        </div>`;
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  window.hoQuick = (text) => {
    input.value = text;
    sendMessage();
  };

 async function sendToGemini(userMessage) {
  conversationHistory.push({
    role: "user",
    parts: [{ text: userMessage }]
  });

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: conversationHistory
      })
    }
  );

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، حدث خطأ.";

  conversationHistory.push({
    role: "model",
    parts: [{ text: reply }]
  });

  return reply;
}

  sendBtn.onclick = sendMessage;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}

document.addEventListener("DOMContentLoaded", createChatbot);
