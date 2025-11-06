// Configurações - Funcionalidades Principais
class SettingsManager {
  constructor() {
    this.currentTab = 'conta';
    this.originalFormData = new Map();
    this.init();
  }

  init() {
    this.initTabNavigation();
    this.initFloatingMenu();
    this.initFormSubmissions();
    this.initToggleSwitches();
    this.initSocialConnections();
    this.initTeamManagement();
    this.saveOriginalFormData();
  }

  // Menu Flutuante Mobile
  initFloatingMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('close-floating-menu');
    const overlay = document.getElementById('menu-overlay');
    const floatingMenu = document.getElementById('floating-menu');

    toggleBtn.addEventListener('click', () => {
      floatingMenu.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', this.closeFloatingMenu);
    overlay.addEventListener('click', this.closeFloatingMenu);

    // Navegação no menu flutuante
    const floatingNavItems = document.querySelectorAll('.floating-nav-item');
    floatingNavItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.getAttribute('data-tab');
        this.switchTab(tab);
        this.closeFloatingMenu();
      });
    });
  }

  closeFloatingMenu = () => {
    const floatingMenu = document.getElementById('floating-menu');
    const overlay = document.getElementById('menu-overlay');
    
    floatingMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Navegação entre abas
  initTabNavigation() {
    const navItems = document.querySelectorAll('.settings-nav-item');
    const floatingNavItems = document.querySelectorAll('.floating-nav-item');

    const handleNavClick = (e, item) => {
      e.preventDefault();
      const tab = item.getAttribute('data-tab');
      this.switchTab(tab);
    };

    navItems.forEach(item => {
      item.addEventListener('click', (e) => handleNavClick(e, item));
    });

    floatingNavItems.forEach(item => {
      item.addEventListener('click', (e) => handleNavClick(e, item));
    });

    // Verifica hash na URL ao carregar
    const hash = window.location.hash.substring(1);
    if (hash && this.isValidTab(hash)) {
      this.switchTab(hash);
    }
  }

  switchTab(tab) {
    if (!this.isValidTab(tab)) return;

    // Remove classe active de todos os itens
    document.querySelectorAll('.settings-nav-item, .floating-nav-item').forEach(nav => {
      nav.classList.remove('active');
    });
    
    document.querySelectorAll('.settings-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    
    // Adiciona classe active ao item clicado
    const targetNav = document.querySelector(`[data-tab="${tab}"]`);
    const targetPanel = document.getElementById(`${tab}-panel`);
    
    if (targetNav) targetNav.classList.add('active');
    if (targetPanel) {
      targetPanel.classList.add('active');
      // Salva dados do formulário atual antes de trocar
      this.saveOriginalFormData();
    }

    this.currentTab = tab;

    // Atualiza URL
    history.pushState(null, null, `#${tab}`);

    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  isValidTab(tab) {
    return ['conta', 'agendamento', 'projetos', 'briefing', 'equipe'].includes(tab);
  }

  // Salva dados originais dos formulários
  saveOriginalFormData() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const formData = new FormData(form);
      const data = {};
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
      this.originalFormData.set(form.id, data);
    });
  }

  // Submissão de formulários
  initFormSubmissions() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Salva texto original dos botões
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.setAttribute('data-original-text', submitBtn.textContent);
      }

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit(form);
      });
    });

    // Botões de cancelar
    const cancelButtons = document.querySelectorAll('.btn-secondary');
    cancelButtons.forEach(button => {
      if (button.type === 'button') {
        button.addEventListener('click', () => {
          const form = button.closest('form');
          this.resetForm(form);
        });
      }
    });
  }

  // Conexões de redes sociais
  initSocialConnections() {
    const connectButtons = document.querySelectorAll('.social-connection .btn-primary');
    const disconnectButtons = document.querySelectorAll('.social-connection .btn-outline');

    connectButtons.forEach(button => {
      button.addEventListener('click', () => {
        const connection = button.closest('.social-connection');
        const socialName = connection.querySelector('.social-name').textContent;
        this.connectSocial(connection, socialName);
      });
    });

    disconnectButtons.forEach(button => {
      button.addEventListener('click', () => {
        const connection = button.closest('.social-connection');
        const socialName = connection.querySelector('.social-name').textContent;
        this.disconnectSocial(connection, socialName);
      });
    });
  }

  // Gestão de equipe
  initTeamManagement() {
    const editButtons = document.querySelectorAll('.member-actions .btn-outline');
    
    editButtons.forEach(button => {
      button.addEventListener('click', () => {
        const member = button.closest('.team-member');
        const memberName = member.querySelector('.member-name').textContent;
        this.editTeamMember(member, memberName);
      });
    });

    const inviteButton = document.querySelector('.team-actions .btn-primary');
    if (inviteButton) {
      inviteButton.addEventListener('click', () => {
        this.inviteTeamMember();
      });
    }
  }

  // Toggle switches
  initToggleSwitches() {
    const toggles = document.querySelectorAll('.toggle input[type="checkbox"]');
    
    toggles.forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const value = e.target.checked;
        const setting = e.target.closest('.toggle-item').querySelector('.toggle-title').textContent;
        
        this.showNotification(`${setting} ${value ? 'ativado' : 'desativado'}`, 'success');
        
        // Salva configuração
        this.saveSetting(setting, value);
      });
    });
  }

  // Métodos auxiliares
  handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    this.showLoading(form);
    
    // Simula envio para API
    setTimeout(() => {
      this.hideLoading(form);
      this.showNotification('Alterações salvas com sucesso!', 'success');
      
      // Atualiza dados originais
      this.originalFormData.set(form.id, data);
      
      console.log('Dados do formulário:', data);
    }, 1500);
  }

  resetForm(form) {
    const originalData = this.originalFormData.get(form.id);
    if (originalData) {
      Object.keys(originalData).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
          input.value = originalData[key];
        }
      });
    } else {
      form.reset();
    }
    this.showNotification('Alterações descartadas', 'info');
  }

  connectSocial(connection, socialName) {
    this.showLoading();
    
    setTimeout(() => {
      this.hideLoading();
      
      const status = connection.querySelector('.social-status');
      const button = connection.querySelector('button');
      
      status.textContent = 'Conectado';
      status.style.color = '#10b981';
      button.textContent = 'Gerenciar';
      button.className = 'btn-outline';
      
      this.showNotification(`${socialName} conectado com sucesso!`, 'success');
    }, 1500);
  }

  disconnectSocial(connection, socialName) {
    if (confirm(`Deseja desconectar ${socialName}?`)) {
      this.showLoading();
      
      setTimeout(() => {
        this.hideLoading();
        
        const status = connection.querySelector('.social-status');
        const button = connection.querySelector('button');
        
        status.textContent = 'Não conectado';
        status.style.color = '#64748b';
        button.textContent = 'Conectar';
        button.className = 'btn-primary';
        
        this.showNotification(`${socialName} desconectado com sucesso`, 'success');
      }, 1500);
    }
  }

  editTeamMember(member, memberName) {
    // Em uma aplicação real, abriria um modal de edição
    this.showNotification(`Editando informações de ${memberName}`, 'info');
  }

  inviteTeamMember() {
    const email = prompt('Digite o e-mail do novo membro:');
    if (email) {
      this.showLoading();
      
      setTimeout(() => {
        this.hideLoading();
        this.showNotification(`Convite enviado para ${email}`, 'success');
      }, 1500);
    }
  }

  saveSetting(key, value) {
    // Simula salvamento
    const settings = JSON.parse(localStorage.getItem('flowup-settings') || '{}');
    settings[key] = value;
    localStorage.setItem('flowup-settings', JSON.stringify(settings));
  }

  showNotification(message, type = 'info') {
    // Remove notificação existente
    const existingNotification = document.querySelector('.settings-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    // Cria nova notificação
    const notification = document.createElement('div');
    notification.className = `settings-notification settings-notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove automaticamente após 5 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }
    }, 5000);
  }

  showLoading(form = null) {
    if (form) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.getAttribute('data-original-text') || submitBtn.textContent;
        submitBtn.setAttribute('data-original-text', originalText);
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading-spinner"></div> Salvando...';
      }
    } else {
      // Loading global
      console.log('Loading...');
    }
  }

  hideLoading(form = null) {
    if (form) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.getAttribute('data-original-text');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    } else {
      // Fim do loading global
      console.log('Loading complete');
    }
  }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  new SettingsManager();
});

// Adiciona estilos de animação
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});