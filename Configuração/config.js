// Configurações Script
document.addEventListener('DOMContentLoaded', function() {
  // Navegação entre abas
  const navItems = document.querySelectorAll('.settings-nav-item');
  const panels = document.querySelectorAll('.settings-panel');

  // Alternar entre abas
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remover active de todos os itens e painéis
      navItems.forEach(nav => nav.classList.remove('active'));
      panels.forEach(panel => panel.classList.remove('active'));
      
      // Adicionar active no item clicado
      this.classList.add('active');
      
      // Mostrar painel correspondente
      const tab = this.getAttribute('data-tab');
      const targetPanel = document.getElementById(`${tab}-panel`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Formulário de Conta
  const accountForm = document.querySelector('#conta-panel .settings-form');
  if (accountForm) {
    accountForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Salvando...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        console.log('Configurações da conta salvas');
        showNotification('Configurações salvas com sucesso!', 'success');
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  // Formulário de Segurança
  const securityForm = document.querySelector('.security-form');
  if (securityForm) {
    securityForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (!currentPassword || !newPassword || !confirmPassword) {
        showNotification('Por favor, preencha todos os campos.', 'error');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        showNotification('As senhas não coincidem.', 'error');
        return;
      }
      
      if (newPassword.length < 6) {
        showNotification('A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
      }
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Alterando...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        console.log('Senha alterada');
        showNotification('Senha alterada com sucesso!', 'success');
        
        this.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  // Toggle switches
  const toggles = document.querySelectorAll('.toggle input');
  toggles.forEach(toggle => {
    toggle.addEventListener('change', function() {
      const setting = this.closest('.toggle-item').querySelector('.toggle-title').textContent;
      const status = this.checked ? 'ativado' : 'desativado';
      console.log(`Configuração "${setting}" ${status}`);
    });
  });

  // Radio buttons
  const radios = document.querySelectorAll('.radio-option input');
  radios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        const setting = this.closest('.radio-option').querySelector('.radio-title').textContent;
        console.log(`Configuração alterada para: ${setting}`);
      }
    });
  });

  // Botões de integração
  const integrationButtons = document.querySelectorAll('.integration-item button');
  integrationButtons.forEach(button => {
    button.addEventListener('click', function() {
      const integration = this.closest('.integration-item').querySelector('.integration-name').textContent;
      
      if (this.textContent === 'Conectar') {
        // Simular conexão
        this.textContent = 'Conectando...';
        this.disabled = true;
        
        setTimeout(() => {
          const item = this.closest('.integration-item');
          item.classList.add('connected');
          item.querySelector('.integration-status').textContent = 'Conectado';
          this.textContent = 'Gerenciar';
          this.disabled = false;
          showNotification(`${integration} conectado com sucesso!`, 'success');
        }, 2000);
      } else {
        console.log(`Gerenciar integração: ${integration}`);
      }
    });
  });

  // Botão exportar dados
  const exportBtn = document.querySelector('.data-control-item .btn-outline');
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      this.textContent = 'Exportando...';
      this.disabled = true;
      
      setTimeout(() => {
        showNotification('Seus dados foram exportados com sucesso!', 'success');
        this.textContent = 'Exportar';
        this.disabled = false;
      }, 2000);
    });
  }

  // Botão excluir conta
  const deleteBtn = document.querySelector('.btn-danger');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function() {
      if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
        this.textContent = 'Excluindo...';
        this.disabled = true;
        
        setTimeout(() => {
          showNotification('Sua conta foi excluída com sucesso.', 'success');
          // Em uma aplicação real, redirecionaria para a página de login
        }, 2000);
      }
    });
  }

  // Encerrar sessão
  const endSessionBtns = document.querySelectorAll('.session-item .btn-outline');
  endSessionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const session = this.closest('.session-item').querySelector('.session-device').textContent;
      
      if (confirm(`Deseja encerrar a sessão em ${session}?`)) {
        this.textContent = 'Encerrando...';
        this.disabled = true;
        
        setTimeout(() => {
          this.closest('.session-item').remove();
          showNotification('Sessão encerrada com sucesso.', 'success');
        }, 1000);
      }
    });
  });

  // Alterações de preferências
  const languageSelect = document.getElementById('language');
  const timezoneSelect = document.getElementById('timezone');

  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      console.log('Idioma alterado para:', this.value);
      showNotification('Idioma alterado com sucesso!', 'success');
    });
  }

  if (timezoneSelect) {
    timezoneSelect.addEventListener('change', function() {
      console.log('Fuso horário alterado para:', this.value);
      showNotification('Fuso horário alterado com sucesso!', 'success');
    });
  }
});

// Função de notificação (reutilizada)
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