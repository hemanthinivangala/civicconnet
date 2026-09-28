import React, { useEffect, useRef } from 'react';

const N8N_WEBHOOK_URL =
  'https://hemanthinivangala.app.n8n.cloud/webhook/e84bc967-5dc7-4e3f-acbf-dcfa8bbff6c8/chat';

export const N8nChatWidget: React.FC = () => {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Check if n8n script already injected
    if (document.getElementById('n8n-chat-script')) return;

    const script = document.createElement('script');
    script.id = 'n8n-chat-script';
    script.type = 'module';
    script.textContent = `
      try {
        const { createChat } = await import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js');
        if (typeof createChat === 'function') {
          createChat({
            webhookUrl: '${N8N_WEBHOOK_URL}',
            webhookConfig: {
              method: 'POST',
              headers: {},
            },
            chatInputKey: 'chatInput',
            chatSessionKey: 'sessionId',
            defaultLanguage: 'en',
            initialMessages: [
              '👋 Hello! I am the CivicConnect AI Agent powered by your n8n workflow. How can I assist you with municipal services today?'
            ],
            i18n: {
              en: {
                title: 'CivicConnect AI Agent',
                subtitle: 'Powered by n8n workflow',
                footer: 'CivicConnect Municipal Services',
                getStarted: 'Start Consultation',
                inputPlaceholder: 'Ask about birth certificates, potholes, garbage...',
              },
            },
          });
        }
      } catch (e) {
        console.info('n8n embed notice:', e);
      }
    `;

    document.body.appendChild(script);
  }, []);

  return null;
};
