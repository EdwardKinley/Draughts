document.addEventListener('DOMContentLoaded', () => {

  boardDiv = document.querySelector('.board');
  buttonsSpace = document.querySelector('.buttons');

  n = 8;

  player1 = { id: 'player1', name: 'Black', colour: 'black', score: 12 };
  player2 = { id: 'player2', name: 'White', colour: 'white', score: 12 };
  players = [player1, player2];

  addBoard();
  setUpScores();
  addButtons();

  currentPlayerPieces = [];

  piecesThatCanCapture = [];
  piecesThatCanBeCaptured = [];
  captor = null;

  piecesThatCanMove = [];
  spacesThatCanBeMovedTo = [];
  mover = null;

  getReadyToMove();

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
        addMan(space, player2.colour);
      } else if (space.id[5] > n/2) {
        addMan(space, player1.colour);
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

  function setUpScores() {
    document.querySelector('#player1').style.color = player1.colour;
    // document.querySelector('#player1Colour').textContent = captitalizedPlayerColour(player1);
    document.querySelector('#player1Colour').textContent = player1.name;
    document.querySelector('#player2').style.color = player2.colour;
    // document.querySelector('#player2Colour').textContent = captitalizedPlayerColour(player2);
    document.querySelector('#player2Colour').textContent = player2.name;
    addScoreBorder(player1);
  }

  // function captitalizedPlayerColour(player) {
  //   return `${player.colour.charAt(0).toUpperCase()}${player.colour.slice(1)}`;
  // }

  function addScoreBorder(player) {
    // document.querySelector(`#${player.id}`).style.border = '3px solid gold';
    document.querySelector(`#${player.id}`).style.backgroundColor = 'saddlebrown';
    document.querySelector(`#${player.id}Colour`).style.backgroundColor = 'tan';
    document.querySelector(`#${player.id}Score`).style.backgroundColor = 'tan';
  }

  function removeScoreBorder(player) {
    document.querySelector(`#${player.id}`).style.backgroundColor = 'tan';
  }

  function addButtons() {
    addPersonalizeButton();
    addNewGameButton();
    addResetButton();
  }

  function addPersonalizeButton() {
    const personalizeButton = document.createElement('button');
    personalizeButton.textContent = 'Personalize';
    buttonsSpace.appendChild(personalizeButton);
    personalizeButton.addEventListener('click', () => {
      document.querySelector('#player1NameLabelSpace').textContent = `Name (${player1.name}):`;
      document.querySelector('#player1NameLabelSpace').style.color = player1.colour;
      const player1Input = document.createElement('input');
      document.querySelector('#player1NameInputSpace').appendChild(player1Input);
      player1Input.focus();
      document.querySelector('#player2NameLabelSpace').textContent = `Name (${player2.name}):`;
      document.querySelector('#player2NameLabelSpace').style.color = player2.colour;
      const player2Input = document.createElement('input');
      document.querySelector('#player2NameInputSpace').appendChild(player2Input);
      const okayButton = document.createElement('button');
      okayButton.textContent = 'Okay';
      document.querySelector('#playerNamesOkaySpace').appendChild(okayButton);
      okayButton.addEventListener('click', () => {
        player1.name = player1Input.value;
        document.querySelector('#player1Colour').textContent = player1.name;
        player2.name = player2Input.value;
        document.querySelector('#player2Colour').textContent = player2.name;
        document.querySelector('#player1NameLabelSpace').innerHTML = '';
        document.querySelector('#player1NameInputSpace').innerHTML = '';
        document.querySelector('#player2NameLabelSpace').innerHTML = '';
        document.querySelector('#player2NameInputSpace').innerHTML = '';
        document.querySelector('#playerNamesOkaySpace').innerHTML = '';
        const hintText = document.querySelector('#hint').textContent;
        if (hintText != '' && hintText[hintText.length-1] != '!') {
          removeHint();
          showHint();
        }
      })
    })
  }

  function addNewGameButton() {
    const newGameButton = document.createElement('button');
    newGameButton.textContent = 'New game';
    buttonsSpace.appendChild(newGameButton);
    newGameButton.addEventListener('click', () => {
      document.querySelector('.board').innerHTML = '';
      document.querySelector('.buttons').innerHTML = '';
      document.querySelector('#hint').textContent = '';
      removeScoreBorder(player1);
      removeScoreBorder(player2);
      players = [player1, player2];
      player1.score = 12;
      player2.score = 12;
      updateScores(player1);
      updateScores(player2);
      addBoard();
      setUpScores();
      addButtons();
      getReadyToMove();
    })
  }

  function addResetButton() {
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    buttonsSpace.appendChild(resetButton);
    resetButton.addEventListener('click', () => {
      location.reload();
    })
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

    return tempPotentialCaptees;
  }

  function spaceRelation(relation, piece) {
    if (relation == 'upleft') { return document.querySelector(`#space${parseInt(piece.id[3])-1}${parseInt(piece.id[4])-1}`); }
    if (relation == 'upright') { return document.querySelector(`#space${parseInt(piece.id[3])-1}${parseInt(piece.id[4])+1}`); }
    if (relation == 'downleft') { return document.querySelector(`#space${parseInt(piece.id[3])+1}${parseInt(piece.id[4])-1}`); }
    if (relation == 'downright') { return document.querySelector(`#space${parseInt(piece.id[3])+1}${parseInt(piece.id[4])+1}`); }
  }

  function getReadyToMove() {
    updateCurrentPlayerPieces();
    updatePiecesThatCanCapture();
    if (canCapture()) {
      showHint();
      enableCapture();
    } else {
      enableNonCapturingMove();
    }
  }

  function updateCurrentPlayerPieces() {
    currentPlayerPieces = identifyCurrentPlayerPieces();
  }

  function updatePiecesThatCanCapture() {
    piecesThatCanCapture = identifyPiecesThatCanCapture();
  }

  function canCapture() {
    return (piecesThatCanCapture.length > 0);
  }

  function showHint() {
    document.querySelector(`#hint`).textContent = `${players[0].name} must capture`;
    document.querySelector(`#hint`).style.color = players[0].colour;
  }

  function removeHint() {
    document.querySelector(`#hint`).textContent = '';
  }

  function enableCapture() {
    for (i=0; i<piecesThatCanCapture.length; i++) {
      piecesThatCanCapture[i].addEventListener('click', potentialCaptorClicked);
    }
  }

  function disableCapture() {
    for (i=0; i<piecesThatCanCapture.length; i++) {
      piecesThatCanCapture[i].removeEventListener('click', potentialCaptorClicked);
    }
  }

  function canCaptureAgain() {
    return (identifyPiecesThatCanBeCapturedBy(captor).length > 0);
  }

  function potentialCaptorClicked() {
    if (captor == null) {
      captor = this;
      addBorder(captor.parentNode);
      piecesThatCanBeCaptured = identifyPiecesThatCanBeCapturedBy(captor);
      makeCapturable();
    } else if (captor != null && captor != this) {
      removeBorder(captor.parentNode);
      makeUncapturable();
      captor = this;
      addBorder(captor.parentNode);
      piecesThatCanBeCaptured = identifyPiecesThatCanBeCapturedBy(captor);
      makeCapturable();
    } else if (captor == this) {
      removeBorder(captor.parentNode);
      makeUncapturable();
      captor = null;
      piecesThatCanBeCaptured = [];
      enableCapture();
    }
  }

  function makeCapturable() {
    for (i=0; i<piecesThatCanBeCaptured.length; i++) {
      spaceRelation(relationDirection(captor, piecesThatCanBeCaptured[i]), piecesThatCanBeCaptured[i]).addEventListener('click', capturePiece);
    }
  }

  function makeUncapturable() {
    for (i=0; i<piecesThatCanBeCaptured.length; i++) {
      spaceRelation(relationDirection(captor, piecesThatCanBeCaptured[i]), piecesThatCanBeCaptured[i]).removeEventListener('click', capturePiece);
    }
  }

  function capturePiece() {
    removeHint();
    makeUncapturable();
    disableCapture();
    const colour = captor.style.backgroundColor;
    const spaceToWhichCaptorMoves = this;
    addMan(spaceToWhichCaptorMoves, colour);
    makeKingIfAppropriate(spaceToWhichCaptorMoves);
    removeMan(spaceRelation(relationDirection(captor, spaceToWhichCaptorMoves.firstChild), captor).firstChild);
    removeBorder(captor.parentNode);
    removeMan(captor);
    captor = spaceToWhichCaptorMoves.firstChild;
    currentPlayerPieces = identifyCurrentPlayerPieces();
    piecesThatCanBeCaptured = identifyPiecesThatCanBeCapturedBy(captor);
    players[1].score --;
    updateScores(players[1]);
    if (canCaptureAgain()) {
      showHint();
      enableFurtherCapture();
    } else {
      switchPlayers();
    }
  }

  function updateScores(player) {
    document.querySelector(`#${player.id}Score`).textContent = player.score;
  }

  function enableFurtherCapture() {
    addBorder(captor.parentNode);
    makeCapturable();
  }

  function makeKingIfAppropriate(space) {
    const isKing = captor.childNodes.length;
    if (isKing == 1 || ((players[0] == player1 && space.id[5] == 0) || (players[0] == player2 && space.id[5] == n-1))) { makeKing(space.firstChild); }
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
    if (man.style.backgroundColor == player1.colour) {
      ring.style.backgroundColor = player2.colour;
      king.style.backgroundColor = player1.colour;
    } else if (man.style.backgroundColor == player2.colour) {
      ring.style.backgroundColor = player1.colour;
      king.style.backgroundColor = player2.colour;
    }
  }

  function switchPlayers() {
    removeScoreBorder(players[0]);
    players.splice(0, 0, players.pop());
    addScoreBorder(players[0]);
    piecesThatCanCapture = identifyPiecesThatCanCapture();
    piecesThatCanBeCaptured = [];
    captor = null;
    piecesThatCanMove = [];
    spacesThatCanBeMovedTo = [];
    mover = null;
    getReadyToMove();
  }

  function enableNonCapturingMove() {
    piecesThatCanMove = identifyPiecesThatCanMove();
    if (piecesThatCanMove.length == 0) { endGame(); }
    enableMoves();
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

  function enableMoves() {
    for (i=0; i<piecesThatCanMove.length; i++) {
      piecesThatCanMove[i].addEventListener('click', selectMover);
    }
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
      spacesThatCanBeMovedTo[i].addEventListener('click', movePiece);
    }
  }

  function movePiece() {
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
    if (isKing == 1 || ((players[0] == player1 && spaceToWhichPieceMoves.id[5] == 0) || (players[0] == player2 && spaceToWhichPieceMoves.id[5] == n-1))) { makeKing(spaceToWhichPieceMoves.firstChild); }
    switchPlayers();
  }

  function endGame() {
    document.querySelector('#hint').textContent = `${players[1].name} wins!`;
  }

})
