// Perfil Script
document.addEventListener('DOMContentLoaded', function() {
  // Elementos do modal de avatar
  const editAvatarBtn = document.getElementById('editAvatar');
  const avatarModal = document.getElementById('avatarModal');
  const avatarModalClose = document.getElementById('avatarModalClose');
  const avatarCancelBtn = document.getElementById('avatarCancelBtn');
  const avatarSaveBtn = document.getElementById('avatarSaveBtn');
  const avatarUpload = document.getElementById('avatarUpload');

  // Elementos do formulário
  const profileForm = document.getElementById('profileForm');
  const cancelBtn = document.getElementById('cancelBtn');

  // Abrir modal de avatar
  editAvatarBtn.addEventListener('click', function() {
    avatarModal.classList.add('show');
  });

  // Fechar modal de avatar
  function closeAvatarModal() {
    avatarModal.classList.remove('show');
    avatarUpload.value = '';
  }

  avatarModalClose.addEventListener('click', closeAvatarModal);
  avatarCancelBtn.addEventListener('click', closeAvatarModal);

  // Fechar modal ao clicar fora
  avatarModal.addEventListener('click', function(e) {
    if (e.target === avatarModal) {
      closeAvatarModal();
    }
  });

  // Salvar nova foto
  avatarSaveBtn.addEventListener('click', function() {
    if (avatarUpload.files && avatarUpload.files[0]) {
      const file = avatarUpload.files[0];
      
      // Simular upload
      avatarSaveBtn.textContent = 'Salvando...';
      avatarSaveBtn.disabled = true;
      
      setTimeout(() => {
        // Em uma aplicação real, aqui faria o upload para o servidor
        const reader = new FileReader();
        reader.onload = function(e) {
          // Atualizar avatar (em uma aplicação real)
          console.log('Nova foto carregada:', file.name);
        };
        reader.readAsDataURL(file);
        
        // Fechar modal e mostrar sucesso
        closeAvatarModal();
        showNotification('Foto do perfil atualizada com sucesso!', 'success');
        
        // Resetar botão
        setTimeout(() => {
          avatarSaveBtn.textContent = 'Salvar Foto';
          avatarSaveBtn.disabled = false;
        }, 500);
      }, 1500);
    } else {
      showNotification('Por favor, selecione uma foto.', 'error');
    }
  });

  // Cancelar edição do formulário
  cancelBtn.addEventListener('click', function() {
    if (confirm('Tem certeza que deseja descartar as alterações?')) {
      profileForm.reset();
      showNotification('Alterações descartadas.', 'info');
    }
  });

  // Submeter formulário
  profileForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simular salvamento
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Salvando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      // Em uma aplicação real, aqui enviaria os dados para o servidor
      console.log('Dados do perfil salvos:', {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        bio: document.getElementById('bio').value
      });
      
      showNotification('Perfil atualizado com sucesso!', 'success');
      
      // Restaurar botão
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });

  // Toggle switches
  const toggles = document.querySelectorAll('.toggle input');
  toggles.forEach(toggle => {
    toggle.addEventListener('change', function() {
      const preference = this.closest('.preference-item').querySelector('.preference-title').textContent;
      const status = this.checked ? 'ativada' : 'desativada';
      console.log(`Preferência "${preference}" ${status}`);
    });
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
  
  // Animação de entrada
  setTimeout(() => notification.style.transform = 'translateX(0)', 100);
  
  // Auto-remover após 5 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}