document.addEventListener('DOMContentLoaded', () => {

  boardDiv = document.querySelector('.board');
  n = 8;
  darkColour = 'black';
  lightColour = 'white';

  player1 = { name: 'Player 1', colour: darkColour };
  player2 = { name: 'Player 2', colour: lightColour };
  // players = [player1, player2];
  players = [player2, player1];

  addBoard();

  addMan(document.querySelector('#space41'), lightColour);
  addMan(document.querySelector('#space43'), lightColour);
  addMan(document.querySelector('#space36'), darkColour);
  makeKing(document.querySelector('#man52'));
  makeKing(document.querySelector('#man25'));

  const currentPlayerPieces = identifyCurrentPlayerPieces();
  const piecesThatCanCapture = identifyPiecesThatCanCapture();
  // const movablePieces = identifyMovablePieces(currentPlayerPieces);
  // identifyPiecesThatCanBeCapturedBy(document.querySelector('#man12'));
  identifyPiecesThatCanBeCapturedBy(document.querySelector('#man54'));
  identifyPiecesThatCanBeCapturedBy(document.querySelector('#man25'));

  getReadyToMove(piecesThatCanCapture);

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
      space.style.backgroundColor = 'tan';
    } else {
      space.style.backgroundColor = 'saddlebrown';
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

  function identifyCurrentPlayerPieces() {
    const tempCurrentPlayerPieces = [];
    const men = document.querySelectorAll('.man');
    for (i=0; i<men.length; i++) {
      if (men[i].style.backgroundColor == players[0].colour) {
        tempCurrentPlayerPieces.push(men[i]);
      }
    }
    return tempCurrentPlayerPieces;
  }

  function identifyPiecesThatCanCapture() {
    const tempPiecesThatCanCapture = [];
    for (j=0; j<currentPlayerPieces.length; j++) {
      if (identifyPiecesThatCanBeCapturedBy(currentPlayerPieces[j]).length > 0) {
        tempPiecesThatCanCapture.push(currentPlayerPieces[j]);
      }
    }
    return tempPiecesThatCanCapture;
  }

  function identifyPiecesThatCanBeCapturedBy(piece) {
    const tempPotentialCaptees = [];

    if (piece.childNodes.length == 1 || players[0] == player1) {
      if ((piece.id[3] > 1) && (piece.id[4] > 1)) {
        if (spaceRelation('upleft', piece).firstChild != null) {
          if (spaceRelation('upleft', piece).firstChild.style.backgroundColor == players[1].colour) {
            if (spaceRelation('upleft', spaceRelation('upleft', piece).firstChild).childNodes.length == 0) {
              tempPotentialCaptees.push(spaceRelation('upleft', piece).firstChild);
            }
          }
        }
      }
      if ((piece.id[3] > 1) && (piece.id[4] < n-2)) {
        if (spaceRelation('upright', piece).firstChild != null) {
          if (spaceRelation('upright', piece).firstChild.style.backgroundColor == players[1].colour) {
            if (spaceRelation('upright', spaceRelation('upright', piece).firstChild).childNodes.length == 0) {
              tempPotentialCaptees.push(spaceRelation('upright', piece).firstChild);
            }
          }
        }
      }
    }

    if (piece.childNodes.length == 1 || players[0] == player2) {
      if ((piece.id[3] < n-2) && (piece.id[4] > 1)) {
        if (spaceRelation('downleft', piece).firstChild != null) {
          if (spaceRelation('downleft', piece).firstChild.style.backgroundColor == players[1].colour) {
            if (spaceRelation('downleft', spaceRelation('downleft', piece).firstChild).childNodes.length == 0) {
              tempPotentialCaptees.push(spaceRelation('downleft', piece).firstChild);
            }
          }
        }
      }
      if ((piece.id[3] < n-2) && (piece.id[4] < n-2)) {
        if (spaceRelation('downright', piece).firstChild != null) {
          if (spaceRelation('downright', piece).firstChild.style.backgroundColor == players[1].colour) {
            if (spaceRelation('downright', spaceRelation('downright', piece).firstChild).childNodes.length == 0) {
              tempPotentialCaptees.push(spaceRelation('downright', piece).firstChild);
            }
          }
        }
      }
    }

    // console.log(tempPotentialCaptees);
    return tempPotentialCaptees;
  }

  function spaceRelation(relation, piece) {
    if (relation == 'upleft') { return document.querySelector(`#space${parseInt(piece.id[3])-1}${parseInt(piece.id[4])-1}`); }
    if (relation == 'upright') { return document.querySelector(`#space${parseInt(piece.id[3])-1}${parseInt(piece.id[4])+1}`); }
    if (relation == 'downleft') { return document.querySelector(`#space${parseInt(piece.id[3])+1}${parseInt(piece.id[4])-1}`); }
    if (relation == 'downright') { return document.querySelector(`#space${parseInt(piece.id[3])+1}${parseInt(piece.id[4])+1}`); }
  }

  function getReadyToMove(pieces) {
    console.log(pieces);
    for (i=0; i<pieces.length; i++) {
      console.log(identifyPiecesThatCanBeCapturedBy(pieces[i]));
    }
  }

  // function identifyMovablePieces(currentPlayerPieces) {
  //   const tempMovablePieces = [];
  //   for (i=0; i<currentPlayerPieces.length; i++) {
  //     // console.log(document.querySelector(`#space${parseInt(currentPlayerPieces[i].id[3])-1}${parseInt(currentPlayerPieces[i].id[4])+1}`));
  //     if (parseInt(currentPlayerPieces[i].id[3]) - 1 >= 0 && parseInt(currentPlayerPieces[i].id[4]) + 1 < n) {
  //       // console.log(document.querySelector(`#space${parseInt(currentPlayerPieces[i].id[3])-1}${parseInt(currentPlayerPieces[i].id[4])+1}`));
  //       if (document.querySelector(`#space${parseInt(currentPlayerPieces[i].id[3])-1}${parseInt(currentPlayerPieces[i].id[4])+1}`).childNodes[0] == null) {
  //         const currentI = i;
  //         currentPlayerPieces[i].addEventListener('click', makeMove);
  //         // () => {
  //         //   // console.log(currentI);
  //         //   // console.log(currentPlayerPieces[currentI]);
  //         //   // moveMan(currentPlayerPieces[currentI].style.backgroundColor, document.querySelector(`#space${parseInt(currentPlayerPieces[currentI].id[3])-1}${parseInt(currentPlayerPieces[currentI].id[4])+1}`));
  //         //   addMan(document.querySelector(`#space${parseInt(currentPlayerPieces[currentI].id[3])-1}${parseInt(currentPlayerPieces[currentI].id[4])+1}`), currentPlayerPieces[currentI].style.backgroundColor);
  //         //   removeMan(currentPlayerPieces[currentI]);
  //         // })
  //         // console.log(document.querySelector(`#space${parseInt(currentPlayerPieces[i].id[3])-1}${parseInt(currentPlayerPieces[i].id[4])+1}`).id);
  //       }
  //       // document.querySelector(`#space${parseInt(currentPlayerPieces[i].id[3])-1}${parseInt(currentPlayerPieces[i].id[4])+1}`).style.backgroundColor = 'red';
  //     }
  //     // console.log(document.querySelector(`#${currentPlayerPieces[i].id}`).style.backgroundColor);
  //     // console.log(`#space${parseInt(currentPlayerPieces[i].id[3])-1}${parseInt(currentPlayerPieces[i].id[4])+1}`);
  //   }
  // }

  function makeMove() {
    console.log(this);
    this.removeEventListener('click', makeMove);
    addMan(document.querySelector(`#space${parseInt(this.id[3])-1}${parseInt(this.id[4])+1}`), this.style.backgroundColor);
    removeMan(this);
  }

  function removeMan(man) {
    man.parentNode.removeChild(man.parentNode.firstChild);
  }

  function makeKing(man) {
    const ring = document.createElement('div');
    const king = document.createElement('div');
    ring.className = 'ring';
    king.className = 'king';
    man.appendChild(ring);
    ring.appendChild(king);
    if (man.style.backgroundColor == darkColour) {
      ring.style.backgroundColor = lightColour;
      king.style.backgroundColor = darkColour;
    } else if (man.style.backgroundColor == lightColour) {
      ring.style.backgroundColor = darkColour;
      king.style.backgroundColor = lightColour;
    }
  }


})
