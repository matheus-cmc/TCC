// Mensagens Script - Versão Melhorada
document.addEventListener('DOMContentLoaded', function() {
  // Elementos do modal
  const newMessageBtn = document.getElementById('newMessageBtn');
  const newMessageModal = document.getElementById('newMessageModal');
  const newMessageModalClose = document.getElementById('newMessageModalClose');
  const newMessageCancelBtn = document.getElementById('newMessageCancelBtn');
  const newMessageSendBtn = document.getElementById('newMessageSendBtn');

  // Elementos do chat
  const conversations = document.querySelectorAll('.conversation');
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatMessages = document.querySelector('.chat-messages');
  const chatArea = document.querySelector('.chat-area');
  const conversationSearch = document.getElementById('conversationSearch');

  // Estado atual da conversa
  let currentConversation = '1';

  // Abrir modal nova mensagem
  newMessageBtn.addEventListener('click', function() {
    newMessageModal.classList.add('show');
  });

  // Fechar modal nova mensagem
  function closeNewMessageModal() {
    newMessageModal.classList.remove('show');
    document.getElementById('recipient').value = '';
    document.getElementById('newMessage').value = '';
  }

  newMessageModalClose.addEventListener('click', closeNewMessageModal);
  newMessageCancelBtn.addEventListener('click', closeNewMessageModal);

  // Fechar modal ao clicar fora
  newMessageModal.addEventListener('click', function(e) {
    if (e.target === newMessageModal) {
      closeNewMessageModal();
    }
  });

  // Enviar nova mensagem do modal
  newMessageSendBtn.addEventListener('click', function() {
    const recipient = document.getElementById('recipient').value;
    const message = document.getElementById('newMessage').value;
    
    if (!recipient || !message) {
      showNotification('Por favor, preencha todos os campos.', 'error');
      return;
    }
    
    // Simular envio
    newMessageSendBtn.textContent = 'Enviando...';
    newMessageSendBtn.disabled = true;
    
    setTimeout(() => {
      console.log('Nova mensagem enviada:', { recipient, message });
      closeNewMessageModal();
      showNotification('Mensagem enviada com sucesso!', 'success');
      
      // Restaurar botão
      setTimeout(() => {
        newMessageSendBtn.textContent = 'Enviar Mensagem';
        newMessageSendBtn.disabled = false;
      }, 500);
    }, 1500);
  });

  // Selecionar conversa
  conversations.forEach(conversation => {
    conversation.addEventListener('click', function() {
      const conversationId = this.getAttribute('data-conversation');
      const userName = this.getAttribute('data-user');
      
      // Atualizar conversa atual
      currentConversation = conversationId;
      
      // Remover active de todas as conversas
      conversations.forEach(c => c.classList.remove('active'));
      
      // Adicionar active na conversa clicada
      this.classList.add('active');
      
      // Remover badge de notificação
      const badge = this.querySelector('.conversation-badge');
      if (badge) {
        badge.remove();
      }
      
      // Atualizar header do chat
      document.querySelector('.chat-user-name').textContent = userName;
      
      // Atualizar mensagens do chat
      updateChatMessages(conversationId, userName);
      
      // Garantir que a área de chat está visível
      chatArea.classList.add('has-conversation');
      
      console.log('Conversa selecionada:', userName);
    });
  });

  // Atualizar mensagens do chat baseado na conversa selecionada
  function updateChatMessages(conversationId, userName) {
    // Limpar mensagens atuais
    chatMessages.innerHTML = '';
    
    // Adicionar mensagens baseado na conversa selecionada
    const messages = getConversationMessages(conversationId, userName);
    messages.forEach(message => {
      const messageElement = createMessageElement(message);
      chatMessages.appendChild(messageElement);
    });
    
    // Scroll para baixo
    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
  }

  // Obter mensagens da conversa
  function getConversationMessages(conversationId, userName) {
    const messagesData = {
      '1': [
        { type: 'received', text: 'Olá Alone, tudo bem?', time: '10:15' },
        { type: 'received', text: 'Precisamos ajustar o briefing do projeto Verão. Podemos conversar?', time: '10:16' },
        { type: 'sent', text: 'Oi Maria! Tudo ótimo, e com você?', time: '10:28' },
        { type: 'sent', text: 'Claro, quais ajustes você sugere?', time: '10:29' },
        { type: 'received', text: 'Acho que precisamos reforçar mais o público-alvo jovem. O que você acha?', time: '10:30' },
        { type: 'sent', text: 'Concordo plenamente! Vou revisar o briefing e trazer algumas ideias.', time: '10:31' },
        { type: 'received', text: 'Perfeito! Podemos marcar uma call amanhã para alinhar os detalhes?', time: '10:32' }
      ],
      '2': [
        { type: 'received', text: 'Alone, os designs do projeto Verão estão prontos!', time: '14:20' },
        { type: 'received', text: 'Preciso que você dê uma olhada antes de enviar para o cliente.', time: '14:21' },
        { type: 'sent', text: 'Ótimo! Pode enviar os arquivos?', time: '14:35' },
        { type: 'received', text: 'Já enviei por email. Vou mandar o link do Figma também.', time: '14:36' }
      ],
      '3': [
        { type: 'received', text: 'Boa tarde! O copy da campanha foi aprovado pelo cliente.', time: '11:15' },
        { type: 'sent', text: 'Que ótima notícia! Vamos começar a produção então.', time: '11:20' },
        { type: 'received', text: 'Sim! Preciso que você revise os textos finais antes de publicar.', time: '11:21' }
      ]
    };
    
    return messagesData[conversationId] || [
      { type: 'info', text: `Inicie uma conversa com ${userName}`, time: '' }
    ];
  }

  // Criar elemento de mensagem
  function createMessageElement(message) {
    const messageElement = document.createElement('div');
    
    if (message.type === 'info') {
      messageElement.className = 'no-conversation';
      messageElement.innerHTML = `
        <div class="no-conversation-icon"></div>
        <h3>Inicie a conversa</h3>
        <p>${message.text}</p>
      `;
      return messageElement;
    }
    
    messageElement.className = `message ${message.type}`;
    
    if (message.type === 'received') {
      messageElement.innerHTML = `
        <div class="message-avatar"></div>
        <div class="message-content">
          <div class="message-text">${message.text}</div>
          <div class="message-time">${message.time}</div>
        </div>
      `;
    } else {
      messageElement.innerHTML = `
        <div class="message-content">
          <div class="message-text">${message.text}</div>
          <div class="message-time">${message.time}</div>
        </div>
      `;
    }
    
    return messageElement;
  }

  // Enviar mensagem no chat
  function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Criar elemento de mensagem
    const messageElement = document.createElement('div');
    messageElement.className = 'message sent';
    messageElement.innerHTML = `
      <div class="message-content">
        <div class="message-text">${message}</div>
        <div class="message-time">${getCurrentTime()}</div>
      </div>
    `;
    
    // Adicionar mensagem ao chat
    chatMessages.appendChild(messageElement);
    
    // Limpar input
    messageInput.value = '';
    
    // Scroll para baixo
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simular resposta após 1-3 segundos
    setTimeout(simulateReply, 1000 + Math.random() * 2000);
    
    console.log('Mensagem enviada:', message);
  }

  // Simular resposta
  function simulateReply() {
    const currentUser = document.querySelector('.conversation.active').getAttribute('data-user');
    const replies = {
      'Maria Silva': [
        "Entendi, vou verificar isso.",
        "Perfeito! Obrigada pelo retorno.",
        "Podemos marcar uma reunião para discutir?",
        "Já estou trabalhando nisso.",
        "Excelente ideia! Vamos implementar."
      ],
      'João Santos': [
        "Certo, vou ajustar os designs.",
        "Ótimo feedback! Vou fazer as alterações.",
        "Pode revisar novamente amanhã?",
        "Já enviei a versão atualizada."
      ],
      'Ana Costa': [
        "Perfeito! Vou preparar os textos.",
        "Obrigada pela rápida resposta!",
        "Vou enviar a versão final hoje.",
        "Alguma sugestão para melhorar?"
      ]
    };
    
    const userReplies = replies[currentUser] || ["Obrigada pelo retorno!"];
    const randomReply = userReplies[Math.floor(Math.random() * userReplies.length)];
    
    const replyElement = document.createElement('div');
    replyElement.className = 'message received';
    replyElement.innerHTML = `
      <div class="message-avatar"></div>
      <div class="message-content">
        <div class="message-text">${randomReply}</div>
        <div class="message-time">${getCurrentTime()}</div>
      </div>
    `;
    
    chatMessages.appendChild(replyElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Obter hora atual
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  // Event listeners para envio
  sendBtn.addEventListener('click', sendMessage);
  
  messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Buscar conversas
  conversationSearch.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    conversations.forEach(conversation => {
      const name = conversation.querySelector('.conversation-name').textContent.toLowerCase();
      const preview = conversation.querySelector('.conversation-preview').textContent.toLowerCase();
      
      if (name.includes(searchTerm) || preview.includes(searchTerm)) {
        conversation.style.display = 'flex';
      } else {
        conversation.style.display = 'none';
      }
    });
  });

  // Efeitos visuais melhorados
  messageInput.addEventListener('focus', function() {
    this.parentElement.parentElement.style.borderColor = 'var(--g1)';
    this.parentElement.parentElement.style.background = 'white';
    this.parentElement.parentElement.style.boxShadow = '0 0 0 3px rgba(109, 40, 217, 0.1)';
  });

  messageInput.addEventListener('blur', function() {
    this.parentElement.parentElement.style.borderColor = 'var(--line)';
    this.parentElement.parentElement.style.background = '#f8fafc';
    this.parentElement.parentElement.style.boxShadow = 'none';
  });
});

// Função de notificação
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border: 1px solid var(--line);
    border-radius: 12px;
    box-shadow: var(--shadow);
    padding: 16px;
    z-index: 10000;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    max-width: 300px;
  `;
  
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-message">${message}</div>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.style.cssText = `
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: var(--muted);
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  `;
  
  closeBtn.addEventListener('click', () => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => notification.remove(), 300);
  });
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.style.transform = 'translateX(0)', 100);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}