import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createChat } from '@n8n/chat';
import '@n8n/chat/style.css';

const FloatingChatbot: React.FC = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const location = useLocation();

    // Check if current page is cart or checkout
    const isCartOrCheckout = location.pathname === '/checkout' || location.pathname.includes('/cart');

    useEffect(() => {
        if (!isInitialized) {
            createChat({
                webhookUrl: 'https://nil1902.app.n8n.cloud/webhook/8f9c7496-c2a1-4a4a-8d0f-3cf42ef7c12f/chat',
                mode: 'window',
                chatInputKey: 'chatInput',
                chatSessionKey: 'sessionId',
                defaultLanguage: 'en',
                showWelcomeScreen: true,
                initialMessages: [
                    'Hi there! 👋',
                    'I\'m your AI assistant. How can I help you today?'
                ],
                i18n: {
                    en: {
                        title: 'Chat with us',
                        subtitle: 'Ask me anything!',
                        footer: '',
                        getStarted: 'Start chatting',
                        inputPlaceholder: 'Type your message...',
                        closeButtonTooltip: 'Close chat'
                    }
                }
            });
            setIsInitialized(true);
        }
    }, [isInitialized]);

    // Hide/show chatbot based on route
    useEffect(() => {
        const updateChatVisibility = () => {
            const chatButton = document.querySelector('.n8n-chat-button') as HTMLElement;
            const chatWindow = document.querySelector('[data-n8n-chat]') as HTMLElement;

            if (chatButton) {
                chatButton.style.display = isCartOrCheckout ? 'none' : 'block';
                chatButton.style.visibility = isCartOrCheckout ? 'hidden' : 'visible';
                chatButton.style.opacity = isCartOrCheckout ? '0' : '1';
                chatButton.style.pointerEvents = isCartOrCheckout ? 'none' : 'auto';
            }
            if (chatWindow) {
                chatWindow.style.display = isCartOrCheckout ? 'none' : 'block';
                chatWindow.style.visibility = isCartOrCheckout ? 'hidden' : 'visible';
                chatWindow.style.opacity = isCartOrCheckout ? '0' : '1';
            }
        };

        // Run immediately
        updateChatVisibility();

        // Also run after a short delay to catch any late-loading elements
        const timer = setTimeout(updateChatVisibility, 100);

        return () => clearTimeout(timer);
    }, [isCartOrCheckout, location.pathname]);

    return (
        <>
            {/* Custom styles for n8n chat */}
            <style>{`
        /* Style the n8n chat window */
        [data-n8n-chat] {
          position: fixed !important;
          bottom: 100px !important;
          right: 24px !important;
          z-index: 9999 !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
          border-radius: 16px !important;
          overflow: hidden !important;
          max-width: 400px !important;
          width: calc(100vw - 48px) !important;
          max-height: 600px !important;
        }

        @media (max-width: 640px) {
          [data-n8n-chat] {
            bottom: 90px !important;
            right: 12px !important;
            left: 12px !important;
            width: calc(100vw - 24px) !important;
            max-height: 500px !important;
          }
        }

        /* Style the n8n default button - keep it visible and styled */
        .n8n-chat-button {
          position: fixed !important;
          bottom: 24px !important;
          right: 24px !important;
          z-index: 9998 !important;
        }
      `}</style>
        </>
    );
};

export default FloatingChatbot;
