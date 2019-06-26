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

  // addMan(document.querySelector('#space41'), lightColour);
  // addMan(document.querySelector('#space43'), lightColour);
  // addMan(document.querySelector('#space36'), darkColour);
  // makeKing(document.querySelector('#man52'));
  // makeKing(document.querySelector('#man25'));
  // removeMan(document.querySelector('#man16'))
  // addMan(document.querySelector('#space16'), darkColour);
  // makeKing(document.querySelector('#man16'));

  currentPlayerPieces = identifyCurrentPlayerPieces();

  piecesThatCanCapture = identifyPiecesThatCanCapture();
  piecesThatCanBeCaptured = [];
  captor = null;

  piecesThatCanMove = [];
  spacesThatCanBeMovedTo = [];
  mover = null;

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
        console.log(currentPlayerPieces[j].id, 'can capture');
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

    return tempPotentialCaptees;
  }

  function spaceRelation(relation, piece) {
    if (relation == 'upleft') { return document.querySelector(`#space${parseInt(piece.id[3])-1}${parseInt(piece.id[4])-1}`); }
    if (relation == 'upright') { return document.querySelector(`#space${parseInt(piece.id[3])-1}${parseInt(piece.id[4])+1}`); }
    if (relation == 'downleft') { return document.querySelector(`#space${parseInt(piece.id[3])+1}${parseInt(piece.id[4])-1}`); }
    if (relation == 'downright') { return document.querySelector(`#space${parseInt(piece.id[3])+1}${parseInt(piece.id[4])+1}`); }
  }

  function getReadyToSelect() {
    currentPlayerPieces = identifyCurrentPlayerPieces();
    if (currentPlayerPieces.length == 0) { endGame(); }
    piecesThatCanCapture = identifyPiecesThatCanCapture();
    if (piecesThatCanCapture.length > 0) {
      console.log(players[0].colour, 'capture');
      for (i=0; i<piecesThatCanCapture.length; i++) {
        piecesThatCanCapture[i].addEventListener('click', makeSelected);
      }
    } else {
      console.log(players[0].colour, 'non capture');
      enableNonCapturingMove();
    }
  }

  function makeSelected() {
    if (captor != null && captor != this) {
      makeUnselected();
    }
    captor = this;
    captor.addEventListener('click', makeUnselected);
    piecesThatCanBeCaptured = identifyPiecesThatCanBeCapturedBy(this);
    addBorder(captor.parentNode);
    makeCapturable();
  }

  function makeUnselected() {
    captor.removeEventListener('click', makeUnselected);
    removeBorder(captor.parentNode);
    captor.addEventListener('click', makeSelected);
    for (i=0; i<piecesThatCanBeCaptured.length; i++) {
      piecesThatCanBeCaptured[i].removeEventListener('click', makeCapturable);
    }
    piecesThatCanBeCaptured = [];
    captor = null;
  }

  function makeCapturable() {
    for (i=0; i<piecesThatCanBeCaptured.length; i++) {
      spaceRelation(relationDirection(captor, piecesThatCanBeCaptured[i]), piecesThatCanBeCaptured[i]).addEventListener('click', capturePiece);
    }
  }

  // function makeUncapturable() {
  //   for (i=0; i<piecesThatCanBeCaptured.length; i++) {
  //     spaceRelation(relationDirection(captor, piecesThatCanBeCaptured[i]), piecesThatCanBeCaptured[i]).removeEventListener('click', capturePiece);
  //   }
  //   piecesThatCanBeCaptured = [];
  // }

  function capturePiece() {
    // this.removeEventListener('click', capturePiece);
    for (i=0; i<piecesThatCanBeCaptured.length; i++) {
      spaceRelation(relationDirection(captor, piecesThatCanBeCaptured[i]), piecesThatCanBeCaptured[i]).removeEventListener('click', capturePiece);
    }
    captor.removeEventListener('click', makeUnselected);
    const colour = captor.style.backgroundColor;
    const spaceToWhichCaptorMoves = this;
    const isKing = captor.childNodes.length;
    addMan(spaceToWhichCaptorMoves, colour);
    if (isKing == 1 || ((players[0] == player1 && spaceToWhichCaptorMoves.id[5] == 0) || (players[0] == player2 && spaceToWhichCaptorMoves.id[5] == n-1))) { makeKing(spaceToWhichCaptorMoves.firstChild); }
    removeMan(spaceRelation(relationDirection(captor, spaceToWhichCaptorMoves.firstChild), captor).firstChild);
    removeBorder(captor.parentNode);
    removeMan(captor);
    switchPlayers();
  }

  function relationDirection(from, to) {
    if ((parseInt(to.id[3]) < parseInt(from.id[3])) && (parseInt(to.id[4]) < parseInt(from.id[4]))) { return 'upleft'; }
    if ((parseInt(to.id[3]) < parseInt(from.id[3])) && (parseInt(to.id[4]) > parseInt(from.id[4]))) { return 'upright'; }
    if ((parseInt(to.id[3]) > parseInt(from.id[3])) && (parseInt(to.id[4]) < parseInt(from.id[4]))) { return 'downleft'; }
    if ((parseInt(to.id[3]) > parseInt(from.id[3])) && (parseInt(to.id[4]) > parseInt(from.id[4]))) { return 'downright'; }
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
    for (i=0; i<piecesThatCanCapture.length; i++) {
      piecesThatCanCapture[i].removeEventListener('click', makeSelected);
    }
    piecesThatCanCapture = identifyPiecesThatCanCapture();
    piecesThatCanBeCaptured = [];
    captor = null;

    for (j=0; j<spacesThatCanBeMovedTo.length; j++) {
      spacesThatCanBeMovedTo[j].removeEventListener('click', makeMoveToable);
    }
    piecesThatCanMove = [];
    spacesThatCanBeMovedTo = [];
    mover = null;
    getReadyToSelect();
  }

  function enableNonCapturingMove() {
    piecesThatCanMove = identifyPiecesThatCanMove();
    if (piecesThatCanMove.length == 0) { endGame(); }
    for (i=0; i<piecesThatCanMove.length; i++) {
      piecesThatCanMove[i].addEventListener('click', selectMover);
    }
  }

  function identifyPiecesThatCanMove() {
    const tempPiecesThatCanMove = [];
    for (j=0; j<currentPlayerPieces.length; j++) {
      if (identifySpacesThatCanBeMovedTo(currentPlayerPieces[j]).length > 0) {
        tempPiecesThatCanMove.push(currentPlayerPieces[j]);
      }
    }
    return tempPiecesThatCanMove;
  }

  function identifySpacesThatCanBeMovedTo(piece) {
    const tempPotentialSpaces = [];

    if (piece.childNodes.length == 1 || players[0] == player1) {
      if ((piece.id[3] > 0) && (piece.id[4] > 0)) {
        if (spaceRelation('upleft', piece).firstChild == null) {
          tempPotentialSpaces.push(spaceRelation('upleft', piece));
        }
      }
      if ((piece.id[3] > 0) && (piece.id[4] < n-1)) {
        if (spaceRelation('upright', piece).firstChild == null) {
          tempPotentialSpaces.push(spaceRelation('upright', piece));
        }
      }
    }

    if (piece.childNodes.length == 1 || players[0] == player2) {
      if ((piece.id[3] < n-1) && (piece.id[4] > 0)) {
        if (spaceRelation('downleft', piece).firstChild == null) {
          tempPotentialSpaces.push(spaceRelation('downleft', piece));
        }
      }
      if ((piece.id[3] < n-1) && (piece.id[4] < n-1)) {
        if (spaceRelation('downright', piece).firstChild == null) {
          tempPotentialSpaces.push(spaceRelation('downright', piece));
        }
      }
    }

    return tempPotentialSpaces;
  }

  function selectMover() {
    if (mover != null && mover != this) {
      unselectMover();
    }
    mover = this;
    spacesThatCanBeMovedTo = identifySpacesThatCanBeMovedTo(this);
    addBorder(mover.parentNode);
    makeMoveToable();
    mover.addEventListener('click', unselectMover);
  }

  function unselectMover() {
    mover.removeEventListener('click', unselectMover);
    removeBorder(mover.parentNode);
    mover.addEventListener('click', selectMover);
    for (i=0; i<spacesThatCanBeMovedTo.length; i++) {
      spacesThatCanBeMovedTo[i].removeEventListener('click', movePiece);
    }
    spacesThatCanBeMovedTo = [];
    mover = null;
  }

  function makeMoveToable() {
    for (i=0; i<spacesThatCanBeMovedTo.length; i++) {
      console.log('can move to', spacesThatCanBeMovedTo[i].id);
      spacesThatCanBeMovedTo[i].addEventListener('click', movePiece);
      // spacesThatCanBeMovedTo[i].style.backgroundColor = 'green';
    }
  }

  // function makeUnMoveToable() {
  //   for (i=0; i<spacesThatCanBeMovedTo.length; i++) {
  //     spacesThatCanBeMovedTo[i].removeEventListener('click', movePiece);
  //   }
  //   spacesThatCanBeMovedTo = [];
  // }

  function movePiece() {
    // console.log(mover);
    // this.removeEventListener('click', movePiece);
    const colour = mover.style.backgroundColor;
    const isKing = mover.childNodes.length;
    removeBorder(mover.parentNode);
    removeMan(mover);
    for (i=0; i<spacesThatCanBeMovedTo.length; i++) {
      spacesThatCanBeMovedTo[i].removeEventListener('click', movePiece);
    }
    for (j=0; j<piecesThatCanMove.length; j++) {
      piecesThatCanMove[j].removeEventListener('click', selectMover);
    }
    const spaceToWhichPieceMoves = this;
    addMan(spaceToWhichPieceMoves, colour);
    console.log('moves to', spaceToWhichPieceMoves.id);
    if (isKing == 1 || ((players[0] == player1 && spaceToWhichPieceMoves.id[5] == 0) || (players[0] == player2 && spaceToWhichPieceMoves.id[5] == n-1))) { makeKing(spaceToWhichPieceMoves.firstChild); }
    // removeMan(spaceRelation(relationDirection(mover, spaceToWhichPieceMoves.firstChild), mover).firstChild);
    switchPlayers();
  }

  function endGame() {
    console.log('game over!');
    console.log(players[1].colour, 'wins');
  }



})
