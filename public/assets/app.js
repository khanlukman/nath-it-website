document.addEventListener('DOMContentLoaded', ()=>{
  const authModal = document.getElementById('authModal');
  const loginBtns = document.querySelectorAll('#loginBtn, #loginBtn2, #loginBtn3, #loginBtn4, #loginBtn5');
  const closeBtns = document.querySelectorAll('#closeModal, #closeModal2, #closeModal3');
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const forms = Array.from(document.querySelectorAll('.form'));
  const authMsg = document.querySelectorAll('.auth-msg');

  function openModal(){ authModal.setAttribute('aria-hidden','false'); }
  function closeModal(){ authModal.setAttribute('aria-hidden','true'); clearMessages(); }

  loginBtns.forEach(b=> b && b.addEventListener('click', openModal));
  closeBtns.forEach(b=> b && b.addEventListener('click', closeModal));

  tabs.forEach(t=> t.addEventListener('click', ()=>{
    tabs.forEach(x=> x.classList.remove('active'));
    t.classList.add('active');
    const target = t.dataset.target;
    forms.forEach(f=> f.id===target ? f.classList.add('active') : f.classList.remove('active'));
  }));

  function clearMessages(){ document.querySelectorAll('.auth-msg').forEach(el=> el.textContent=''); }

  // Signup
  const signupForms = document.querySelectorAll('#signupForm');
  signupForms.forEach(form=>{
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const resp = await fetch('/api/auth/signup', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
      const json = await resp.json();
      const msgEl = form.closest('.modal-panel').querySelector('.auth-msg');
      if(resp.ok){ msgEl.textContent = json.message || 'Signed up'; setTimeout(()=> location.reload(), 700); }
      else msgEl.textContent = json.message || 'Error';
    });
  });

  // Login
  const loginForms = document.querySelectorAll('#loginForm');
  loginForms.forEach(form=>{
    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const resp = await fetch('/api/auth/login', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
      const json = await resp.json();
      const msgEl = form.closest('.modal-panel').querySelector('.auth-msg');
      if(resp.ok){ msgEl.textContent = json.message || 'Logged in'; setTimeout(()=> location.reload(), 700); }
      else msgEl.textContent = json.message || 'Error';
    });
  });

  // Check current user to change UI
  (async ()=>{
    try{
      const r = await fetch('/api/auth/me');
      const j = await r.json();
      if(j.user){
        const nav = document.querySelector('.nav');
        const logout = document.createElement('button');
        logout.className = 'btn-link';
        logout.textContent = 'Logout';
        logout.addEventListener('click', async ()=>{
          await fetch('/api/auth/logout', {method:'POST'});
          location.reload();
        });
        nav.appendChild(logout);
      }
    }catch(e){}
  })();
});
