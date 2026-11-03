const buttons = document.querySelectorAll('.filters button');
const cards = document.querySelectorAll('.card');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;          

    buttons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');

    cards.forEach(card => {
      const tags = card.dataset.tags.split(',');   
      card.hidden = filter !== 'All' && !tags.includes(filter);
    });
  });
});