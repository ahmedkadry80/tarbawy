/*document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      role: document.getElementById('role').value
    })
  });

  const data = await res.json();
  console.log(data);
});
*/

let lang = 'ar';

const t = {
  ar: {
    title: 'إنشاء حساب',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    role: 'نوع الحساب',
    student: 'طالب',
    teacher: 'معلم',
    create: 'إنشاء حساب',
    haveAccount: 'لديك حساب؟',
    login: 'تسجيل الدخول'
  },
  en: {
    title: 'Create Account',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    role: 'Account Type',
    student: 'Student',
    teacher: 'Teacher',
    create: 'Create Account',
    haveAccount: 'Already have an account?',
    login: 'Login'
  }
};

document.getElementById('langBtn').addEventListener('click', () => {
  lang = lang === 'ar' ? 'en' : 'ar';

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t[lang][el.dataset.i18n];
  });
});

document.getElementById('registerForm').addEventListener('submit', async e => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      alert('Registration successful');
      window.location.href = 'login.html';
    } else {
      alert(result.error || 'Error');
    }
  } catch {
    alert('Server error');
  }
});
 