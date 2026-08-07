// ===== Scroll-triggered reveal =====
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el) => revealObserver.observe(el));

// ===== Expandable project cards =====
document.querySelectorAll('.card-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.project-card');
    const details = card.querySelector('.card-details');
    const expanded = btn.getAttribute('aria-expanded') === 'true';

    btn.setAttribute('aria-expanded', String(!expanded));
    details.classList.toggle('open', !expanded);
    btn.querySelector('.toggle-text').textContent = expanded ? 'Expand Specs' : 'Collapse Specs';
  });
});
