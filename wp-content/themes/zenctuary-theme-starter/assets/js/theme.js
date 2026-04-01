document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.zen-faq__question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.zen-faq__item');
      if (item) item.classList.toggle('is-open');
    });
  });
});
