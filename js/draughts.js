document.addEventListener('DOMContentLoaded', () => {

  boardDiv = document.querySelector('.board');
  n = 8;
  lightColour = 'white';
  darkColour = 'black';

  addBoard();


  function addBoard() {
    for (i=0; i<n; i++) {
      addRow(i);
    }
  }

  function addRow(i) {
    const row = document.createElement('div');
    row.className = 'row';
    row.id = `row${i}`;
    row.style.height = `${100/n}%`;
    boardDiv.appendChild(row);
    for (j=0; j<n; j++) {
      addSpace(row, i, j);
    }
  }

  function addSpace(row, i, j) {
    const space = document.createElement('div');
    space.className = 'space';
    space.id = `space${i}${j}`;
    space.style.width = `${100/n}%`;
    row.appendChild(space);
    if ((i+j)%2 == 0) {
      space.style.backgroundColor = 'yellow';
    } else {
      space.style.backgroundColor = 'sienna';
      if (space.id[5] < n/2 - 1) {
        addMan(space, lightColour);
      } else if (space.id[5] > n/2) {
        addMan(space, darkColour);
      }
    }
  }

  function addMan(space, colour) {
    const man = document.createElement('div');
    man.className = 'man';
    man.id = `man${space.id.slice(5)}`;
    space.appendChild(man);
    man.style.backgroundColor = colour;
  }

})
