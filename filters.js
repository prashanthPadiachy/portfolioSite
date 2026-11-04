const grid = document.querySelector('.grid');
const buttons = document.querySelectorAll('.filters button');
const cards = [...document.querySelectorAll('.card')];
const toggle = document.getElementById('show-more');

let currentFilter = 'All';
let expanded = false;

// how many columns the grid has right now (changes with screen width)
//browser reports the columns "xpx xpx xpx", so we count them.
function columnCount() {
  return getComputedStyle(grid).gridTemplateColumns.split(' ').length;
}

function update() {
  const perRow = columnCount();

  // which cards match the current filter?
  const matching = cards.filter(card =>
    currentFilter === 'All' || card.dataset.tags.split(',').includes(currentFilter)
  );

  //hide everything, then show matching cards up to the limit
  const limit = expanded ? Infinity : perRow;
  cards.forEach(card => (card.hidden = true));
  matching.forEach((card, i) => (card.hidden = i >= limit));

  //only show the button if there's more than one row to reveal
  toggle.hidden = matching.length <= perRow;
  toggle.textContent = expanded ? 'Show less' : `Show all (${matching.length})`;
}

//filter buttons
buttons.forEach(button => {
  button.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter;
    update();
  });
});

//show all / Show less
toggle.addEventListener('click', () => {
  expanded = !expanded;
  update();
  // after collapsing, jump back
  if (!expanded) document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
});

// Recount when the window is resized
window.addEventListener('resize', update);

update();