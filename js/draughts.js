document.addEventListener('DOMContentLoaded', () => {

  boardDiv = document.querySelector('.board');
  n = 8;
  darkColour = 'black';
  lightColour = 'white';

  player1 = { name: 'Player 1', colour: darkColour };
  player2 = { name: 'Player 2', colour: lightColour };
  players = [player1, player2];
  // players = [player2, player1];

  addBoard();

  addMan(document.querySelector('#space41'), lightColour);
  addMan(document.querySelector('#space43'), lightColour);
  addMan(document.querySelector('#space36'), darkColour);
  makeKing(document.querySelector('#man52'));
  makeKing(document.querySelector('#man25'));

  currentPlayerPieces = identifyCurrentPlayerPieces();
  piecesThatCanCapture = identifyPiecesThatCanCapture();
  piecesThatCanBeCaptured = [];
  captor = null;
  // const movablePieces = identifyMovablePieces(currentPlayerPieces);
  // identifyPiecesThatCanBeCapturedBy(document.querySelector('#man12'));
  // identifyPiecesThatCanBeCapturedBy(document.querySelector('#man54'));
  // identifyPiecesThatCanBeCapturedBy(document.querySelector('#man25'));

  getReadyToSelect();

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
    row.style.height = `${92/n}vh`;
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
    space.style.width = `${92/n}vh`;
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

  function getReadyToSelect() {
    for (i=0; i<piecesThatCanCapture.length; i++) {
      piecesThatCanCapture[i].addEventListener('click', makeSelected);
    }
  }

  function makeSelected() {

    // for (i=0; i<piecesThatCanCapture; i++) {
    //   piecesThatCanCapture[i].removeEventListener('click', makeSelected);
    // }
    // piecesThatCanCapture = [];
    if (captor != null && captor != this) {
      makeUnselected();
    }
    captor = this;
    captor.addEventListener('click', makeUnselected);
    piecesThatCanBeCaptured = identifyPiecesThatCanBeCapturedBy(this);
    addBorder(captor.parentNode);

    makeCapturable();

    // if (this.parentNode.classList.contains('selected')) {
    //   this.parentNode.classList.remove('selected');
    //   removeBorder(this.parentNode);
    //   // piecesThatCanBeCaptured = [];
    //   makeUncapturable();
    // } else if (document.getElementsByClassName('selected').length > 0) {
    //   removeBorder(document.querySelector('.selected'));
    //   document.querySelector('.selected').classList.remove('selected');
    //   this.parentNode.classList.add('selected');
    //   addBorder(this.parentNode);
    //   piecesThatCanBeCaptured = identifyPiecesThatCanBeCapturedBy(this);
    //   makeCapturable();
    // } else {
    //   this.parentNode.classList.add('selected');
    //   addBorder(this.parentNode);
    //   piecesThatCanBeCaptured = identifyPiecesThatCanBeCapturedBy(this);
    //   makeCapturable();
    // }
    // const placesCurrentlySelectedPieceCouldMoveTo = placesPieceCouldMoveToAfterCapture(piece);

    // for (i=0; i<piecesThatCanCapture.length; i++) {
    //   // piecesThatCanCapture[i].removeEventListener('click', makeSelected);
    // }
  }

  function makeUnselected() {
    captor.removeEventListener('click', makeUnselected);
    console.log(captor.parentNode);
    removeBorder(captor.parentNode);
    captor.addEventListener('click', makeSelected);
    for (i=0; i<piecesThatCanBeCaptured.length; i++) {
      piecesThatCanBeCaptured[i].removeEventListener('click', makeCapturable);
    }
    piecesThatCanBeCaptured = [];
    captor = null;
  }

  function makeCapturable() {
    // piecesThatCanBeCaptured = identifyPiecesThatCanBeCapturedBy(potentialCaptor);
    for (i=0; i<piecesThatCanBeCaptured.length; i++) {
      // piecesThatCanBeCaptured[i].addEventListener('click', capturePiece);
      spaceRelation(relationDirection(captor, piecesThatCanBeCaptured[i]), piecesThatCanBeCaptured[i]).addEventListener('click', capturePiece);
    }
  }

  function makeUncapturable() {
    // const potentialCaptor = document.querySelector('.selected').firstChild;
    // piecesThatCanBeCaptured = identifyPiecesThatCanBeCapturedBy(potentialCaptor);
    for (i=0; i<piecesThatCanBeCaptured.length; i++) {
      // piecesThatCanBeCaptured[i].removeEventListener('click', capturePiece);
      spaceRelation(relationDirection(captor, piecesThatCanBeCaptured[i]), piecesThatCanBeCaptured[i]).removeEventListener('click', capturePiece);
    }
    piecesThatCanBeCaptured = [];
  }

  function capturePiece() {
    const colour = captor.style.backgroundColor;
    const spaceToWhichCaptorMoves = this;
    addMan(spaceToWhichCaptorMoves, colour);
    removeMan(spaceRelation(relationDirection(captor, spaceToWhichCaptorMoves.firstChild), captor).firstChild);
    removeBorder(captor.parentNode);
    removeMan(captor);
    // this.style.backgroundColor = 'pink'
    switchPlayers();
  }

  function relationDirection(from, to) {
    if ((parseInt(to.id[3]) < parseInt(from.id[3])) && (parseInt(to.id[4]) < parseInt(from.id[4]))) { console.log('upleft'); return 'upleft'; }
    if ((parseInt(to.id[3]) < parseInt(from.id[3])) && (parseInt(to.id[4]) > parseInt(from.id[4]))) { console.log('upright'); return 'upright'; }
    if ((parseInt(to.id[3]) > parseInt(from.id[3])) && (parseInt(to.id[4]) < parseInt(from.id[4]))) { console.log('downleft'); return 'downleft'; }
    if ((parseInt(to.id[3]) > parseInt(from.id[3])) && (parseInt(to.id[4]) > parseInt(from.id[4]))) { console.log('downright'); return 'downright'; }
    // if (relation == 'upleft') { return document.querySelector(`#space${parseInt(piece.id[3])-1}${parseInt(piece.id[4])-1}`); }
    // if (relation == 'upright') { return document.querySelector(`#space${parseInt(piece.id[3])-1}${parseInt(piece.id[4])+1}`); }
    // if (relation == 'downleft') { return document.querySelector(`#space${parseInt(piece.id[3])+1}${parseInt(piece.id[4])-1}`); }
    // if (relation == 'downright') { return document.querySelector(`#space${parseInt(piece.id[3])+1}${parseInt(piece.id[4])+1}`); }
  }


  function addBorder(element) {
    element.style.border = `${4.6/n}vh solid gold`;
    element.firstChild.style.height = '100%';
    element.firstChild.style.width = '100%';
  }

  function removeBorder(element) {
    element.style.border = 0;
    element.firstChild.style.height = '90%';
    element.firstChild.style.width = '90%';
  }

  function placesPieceCouldMoveToAfterCapture(piece) {
    // console.log(piece);
  }


  function makeMove() {
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

  function switchPlayers() {
    players.splice(0, 0, players.pop());
    console.log(players);
    currentPlayerPieces = identifyCurrentPlayerPieces();
    piecesThatCanCapture = identifyPiecesThatCanCapture();
    piecesThatCanBeCaptured = [];
    captor = null;
    getReadyToSelect();
  }


})
