const axios = require('axios');
const { groqApiKey } = require('../config');

const CYBERSENTINEL_DESC = 'CyberSentinel is a smart, self-learning cybersecurity expert and companion. I detect threats, educate users, and evolve with crowdsourced intelligence. I act before damage is done, spotting red flags in real-time.';

const scamStats = [
  {
    type: 'phishing',
    summary: `Phishing scams are a major threat worldwide. In 2023, global losses from phishing attacks exceeded $3 billion. Recent high-profile cases include:
- A major bank losing $100M to spear-phishing.
- Thousands of users targeted by fake government emails.
- Over 50,000 phishing websites detected monthly.
Always verify links and never share sensitive info via email or chat.`
  },
  {
    type: 'malware',
    summary: `Malware attacks caused over $10 billion in damages in 2023. Ransomware and spyware are the most common types. Notable cases:
- A hospital system paid $2M in ransom.
- Spyware campaigns targeting mobile users in Asia.`
  }
];

function isCybersecurityRelated(text) {
  return /cyber|threat|malware|phish|security|attack|breach|vulnerability|scam|privacy|data|protection|risk|awareness|sandbox|analytics|extension|detection|incident|forensic|firewall|encryption|password|breach|phishing|ransomware|antivirus|spyware|trojan|worm|botnet|hacker|exploit|zero-day|social engineering|user education|threat intelligence/i.test(text);
}

function filterResponse(text) {
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .split('\n')
    .filter(line =>
      !/DeepSeek|AI assistant|Chinese company|developed by|model|product|documentation|Inc\./i.test(line) &&
      !/^okay,|^let me|^i should|^i need to|^next,|^then,|^after that,|^finally,|^wrap it up|^maybe|^wait,|^first,/i.test(line.trim())
    )
    .join('\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

function enrichWithScamStats(userMessage, response) {
  const lowerMsg = userMessage.toLowerCase();
  for (const scam of scamStats) {
    if (lowerMsg.includes(scam.type)) {
      return response + '\n\n---\n' + scam.summary;
    }
  }
  return response;
}

let franc;
async function getLanguage(message) {
  if (!franc) {
    const mod = await import('franc-min');
    franc = mod.default || mod.franc;
  }
  const langCode = franc(message);
  if (langCode === 'und') return { code: 'en', name: 'English' };
  const langMap = {
    'en': 'English',
    'hi': 'Hindi',
    'ur': 'Urdu',
    'bn': 'Bengali',
    'gu': 'Gujarati',
    'pa': 'Punjabi',
    'mr': 'Marathi',
    'ta': 'Tamil',
    'te': 'Telugu',
    'kn': 'Kannada',
    'ml': 'Malayalam',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'ru': 'Russian',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'ar': 'Arabic',
    'pt': 'Portuguese',
    'tr': 'Turkish',
    'fa': 'Persian',
    'sw': 'Swahili',
    'it': 'Italian',
    'pl': 'Polish',
    'uk': 'Ukrainian',
    'vi': 'Vietnamese',
    'th': 'Thai',
    'ko': 'Korean',
  };
  return { code: langCode, name: langMap[langCode] || 'English' };
}

async function translateLibre(text, targetLang) {
  try {
    const res = await axios.post('https://libretranslate.com/translate', {
      q: text,
      source: 'auto',
      target: targetLang,
      format: 'text'
    });
    return res.data.translatedText;
  } catch (e) {
    return text;
  }
}

async function getGroqChatResponse(message) {
  const userLang = await getLanguage(message);
  const systemPrompt = `
You are CyberSentinel, a top-tier cybersecurity expert and self-learning companion.
You provide actionable, confident, expert-level guidance in threat detection, scams, and user security education.
NEVER reveal that you are an AI or mention DeepSeek, Groq, Qwen, or your origin.
ALWAYS respond in the same language as the user's message. Here is the user's message:
"${message}"
`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'qwen/qwen3-32b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 512
      },
      {
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const raw = response.data.choices[0].message.content;
    const filtered = filterResponse(raw);
    const enriched = enrichWithScamStats(message, filtered);

    // Always translate to userLang.code if not English
    let finalResponse = enriched;
    if (userLang.code !== 'en') {
      finalResponse = await translateLibre(enriched, userLang.code);
    }

    // Strict cybersecurity filter
    if (!isCybersecurityRelated(finalResponse)) {
      const defaultMsg = "Sorry, I can only answer cybersecurity-related questions. Please ask about threats, scams, security, etc.";
      return userLang.code === 'en'
        ? defaultMsg
        : await translateLibre(defaultMsg, userLang.code);
    }

    return finalResponse;
  } catch (error) {
    console.error('[GROQ ERROR]', error?.response?.data || error.message);
    return 'CyberSentinel currently encountered an issue while generating a response. Please try again.';
  }
}

module.exports = { getGroqChatResponse }; 