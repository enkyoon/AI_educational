// =========================================================
// 바이브코딩 강의자료 공통 스크립트
// 모든 DAY 페이지(html/dayXX.html)에서 공통으로 사용합니다.
// =========================================================

// Font Size Controller Logic (sm: 15px, md: 18px, lg: 21px)
function setFontSize(size) {
  const root = document.documentElement;
  root.classList.remove('font-sm', 'font-md', 'font-lg');
  root.classList.add(`font-${size}`);

  const sizes = ['sm', 'md', 'lg'];
  sizes.forEach(s => {
    const btn = document.getElementById(`btn-font-${s}`);
    if (!btn) return;
    if (s === size) {
      btn.className = "px-2.5 py-1 rounded-lg transition-all font-bold bg-white text-indigo-600 shadow-xs border border-slate-200/60 text-xs";
    } else {
      btn.className = "px-2.5 py-1 rounded-lg transition-all font-medium text-slate-600 hover:text-slate-900 text-xs";
    }
  });
}

// Toggle Sidebar (Desktop & Mobile)
// 데스크톱에서는 사이드바가 화면 왼쪽에 고정되어 있으므로, 접었을 때
// 본문(#mainWrapper)이 확보해두었던 왼쪽 여백도 함께 없애 가운데 공간을 넓게 씀
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const isHidden = sidebar.classList.toggle('hidden');
  const label = document.getElementById('sidebarToggleLabel');
  const btn = document.getElementById('sidebarToggleBtn');
  const mainWrapper = document.getElementById('mainWrapper');

  if (label) {
    label.innerText = isHidden ? '열기' : '접기';
  }

  if (btn) {
    if (isHidden) {
      btn.classList.remove('bg-slate-100', 'text-slate-700');
      btn.classList.add('bg-indigo-600', 'text-white');
    } else {
      btn.classList.remove('bg-indigo-600', 'text-white');
      btn.classList.add('bg-slate-100', 'text-slate-700');
    }
  }

  if (mainWrapper) {
    mainWrapper.classList.toggle('lg:pl-[280px]', !isHidden);
    mainWrapper.classList.toggle('lg:pl-0', isHidden);
  }
}

// Toast Notification helper (without using native alert)
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast || !toastMsg) return;
  toastMsg.innerText = message;
  toast.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none');
  }, 2500);
}

// Safe Clipboard Copying fallback
function copyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    showToast("클립보드에 복사되었습니다!");
  } catch (err) {
    showToast("복사에 실패했습니다.");
  }
  document.body.removeChild(textArea);
}

// Copy the innerText of any element by id (프롬프트 예시 복사 버튼 등에서 공통으로 사용)
function copyTextById(id) {
  const el = document.getElementById(id);
  if (!el) return;
  copyToClipboard(el.innerText);
}

// Simple In-page keyword filter
function searchInPage() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  const query = input.value.toLowerCase().trim();
  const sections = document.querySelectorAll('#mainContent > section');

  if (!query) {
    sections.forEach(sec => sec.style.display = 'block');
    return;
  }

  sections.forEach(sec => {
    const text = sec.innerText.toLowerCase();
    sec.style.display = text.includes(query) ? 'block' : 'none';
  });
}

// 페이지 로드 시 공통 초기화: 기본 글자 크기 적용 + 스크롤에 따른 목차 활성화 표시
window.addEventListener('DOMContentLoaded', () => {
  setFontSize('md');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const tocLink = document.querySelector(`.toc-link[href="#${id}"]`);
      if (entry.isIntersecting && tocLink) {
        document.querySelectorAll('.toc-link').forEach(link => {
          link.classList.remove('bg-indigo-50', 'text-indigo-600', 'font-bold');
        });
        tocLink.classList.add('bg-indigo-50', 'text-indigo-600', 'font-bold');
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  document.querySelectorAll('#mainContent section[id]').forEach(section => {
    observer.observe(section);
  });
});
