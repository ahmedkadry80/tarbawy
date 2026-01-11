let lang = 'ar';

const t = {
  ar: {
    title: 'تسجيل الدخول',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    login: 'تسجيل الدخول',
    noAccount: 'ليس لديك حساب؟',
    register: 'إنشاء حساب'
  },
  en: {
    title: 'Login',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    noAccount: 'Don’t have an account?',
    register: 'Register'
  }
};

// Toggle language
document.getElementById('langBtn').addEventListener('click', () => {
  lang = lang === 'ar' ? 'en' : 'ar';

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t[lang][el.dataset.i18n];
  });
});

// Login submit
document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      // حفظ التوكن
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));

      // Redirect حسب الدور
      if (result.user.role === 'teacher') {
        window.location.href = 'teacher-dashboard.html';
      } else {
        window.location.href = 'student-dashboard.html';
      }
    } else {
      alert(result.message || 'Login failed');
    }
  } catch {
    alert('Server error');
  }
});
