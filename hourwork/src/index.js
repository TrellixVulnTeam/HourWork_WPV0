import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Mindmap} from './ReactComponents/MindmapComponent.js';

// Imports for Object JS classNamees
import {Card} from './js/Card';
import {Node} from './js/Node'
import {MindmapObj} from './js/MindmapObj';
import './index.css'

// Defines where the App gets rendered in the DOM
const root = createRoot(document.getElementById("root"));
// initial definition of the  application controller
var appController = new MindmapObj();

//** Reads in data from session storage and updates the application data structure **/
function updateStructure(){
  // retrieve nestedArray and title from localStorage
  var retrievedData = sessionStorage.getItem("file-array");
  var nestedArray = JSON.parse(retrievedData);
  var title = sessionStorage.getItem("file-name");
  
  // initialize our graph
  appController = new MindmapObj();

  // If the nested array is null -> then it wont parse the data in local storage
  if (nestedArray != null) {
    // title card
    var titleCard = new Node(0, new Card(title));
    appController.setTitle(titleCard.getLabel());

    //sets dueDate for the MindMap
    appController.setDueDate(sessionStorage.getItem("due-date"));

    // empty array for the parent nodes
    var parents = [];
    // counter for the node id #'s
    var id_counter = 0;
    // flashcardText variable for each child node
    var child;

    /* loop through the top layer of the nested array and fill in the parent
    * nodes */
    for (var i = 0; i < nestedArray.length; i++) {
      id_counter++;
      parents[i] = new Node(id_counter, new Card(nestedArray[i][0], nestedArray[i][1]));
    }

    /* make the titleCard the vertex, then loop through and make each parent
    * node an edge to that card */
    appController.addNode(titleCard);
    for (var i = 0; i < nestedArray.length; i++) {
      appController.addNode(parents[i]);
      appController.addEdge(titleCard, parents[i]);
    }

    /* go through the children and add them as edges to their parent nodes */
    for (var i = 0; i < nestedArray.length; i++) {
      for (var j = 2; j < nestedArray[i].length; j++) {
        id_counter++;
        child = new Node(id_counter, new Card(nestedArray[i][j][0], nestedArray[i][j][1]));
        appController.addEdge(parents[i], child);
      }
    }

    // Generates deck of cards from the Mindmap
    appController.generateDeck();
  }
}

// Function definition for when the user uploads a file
var uploadHandler = function(e) {
  root.render(<App/>);
};
// defines the listener for the file upload, and then executes the function to rerender
document.addEventListener("newFileUploaded", uploadHandler, false);

// Structures the React Parent Component
const App = () => {
  // Updates the structure with values from browser storage
  updateStructure();
  
  // Handler for Next Card Button Press
  function handleNext(e) {
    e.preventDefault();
    appController.nextCard();
    var frontString, backString;
    var c = appController.getCurrentCard();
    if(c == null){
      frontString = "";
      backString = "";
    } else {
      frontString = c.getFrontText();
      backString = c.getBackText();
    }
    document.getElementById('flashcardText').innerHTML = frontString;
    document.getElementById('flashcardBackText').innerHTML = backString;
  }
   // Handler for Previous Card Button Press
  function handlePrevious(e) {
    e.preventDefault();
    appController.previousCard();
    var frontString, backString;
    var c = appController.getCurrentCard();
    if(c == null){
      frontString = "";
      backString = "";
    } else {
      frontString = c.getFrontText();
      backString = c.getBackText();
    }
    document.getElementById('flashcardText').innerHTML = frontString;
    document.getElementById('flashcardBackText').innerHTML = backString;
    
    
  }

  function handleNo(e) {
    e.preventDefault();
    var c = appController.getCurrentCard();
    if(c != null){
      var currentCard = appController.getCurrentCard();
      var weight = currentCard.getWeight();
      weight += 1;
      currentCard.setWeight(weight);
      appController.putInDeck(currentCard);
      appController.logDeck();
      appController.nextCard();
      var frontString, backString;
      var c = appController.getCurrentCard();
      if(c == null){
        frontString = "";
        backString = "";
      } 
      else {
        frontString = c.getFrontText();
        backString = c.getBackText();
      }
      document.getElementById('flashcardText').innerHTML = frontString;
      document.getElementById('flashcardBackText').innerHTML = backString;
      
    }  
  }

  function handleYes(e) {
    e.preventDefault();
    var c = appController.getCurrentCard();
    if(c != null){
      var currentCard = appController.getCurrentCard();
      var weight = currentCard.getWeight();
      if (weight > 0){
        weight -= 1;
      }
      currentCard.setWeight(weight);
      appController.putInDeck(currentCard);
      appController.logDeck();
      appController.nextCard();
      var frontString, backString;
      var c = appController.getCurrentCard();
      if(c == null){
        frontString = "";
        backString = "";
      } 
      else {
        frontString = c.getFrontText();
        backString = c.getBackText();
      }
      document.getElementById('flashcardText').innerHTML = frontString;
      document.getElementById('flashcardBackText').innerHTML = backString;
    }
  }

 ////can probably get away with just going to next
  function handlePartially(e){
    e.preventDefault();
    var c = appController.getCurrentCard();
    if(c != null){
      var currentCard = appController.getCurrentCard();
      var weight = currentCard.getWeight();
      currentCard.setWeight(weight);
      appController.putInDeck(currentCard);
      appController.logDeck();
      appController.nextCard();
      var frontString, backString;
      var c = appController.getCurrentCard();
      if(c == null){
        frontString = "";
        backString = "";
      } 
      else {
        frontString = c.getFrontText();
        backString = c.getBackText();
      }
      document.getElementById('flashcardText').innerHTML = frontString;
      document.getElementById('flashcardBackText').innerHTML = backString;
    }
  }


  // Flips flashcard
  function flipCard(e) {
    e.preventDefault();
    var currCard = appController.getCurrentCard();
    var currText = document.getElementById('flashcardText').innerHTML;

    if (currText == currCard.getFrontText()) {
      document.getElementById('flashcardText').innerHTML = appController.getCurrentCard().getBackText();
    } else if (currText == currCard.getBackText()) {
      document.getElementById('flashcardText').innerHTML = appController.getCurrentCard().getFrontText();
    }
  }



  // Renders MindMap from the MindMapComponent
  function MindMap() {

    // allows for callback from MindmapComponent js file
    const [node, setNode] = useState('No Node Selected');





    // Updates Current Card with the callback node ID
    var clickedCard = appController.getCardByNodeID(node[0]);

    if(clickedCard.getFrontText() != "card not found"){
      appController.setCurrentCard(clickedCard);
      // Delete this line once Flashcard React Component is implemented
      document.getElementById('flashcardText').innerHTML = appController.getCurrentCard().getFrontText();
      document.getElementById('flashcardBackText').innerHTML = appController.getCurrentCard().getBackText();
      
    }

    // returns formatted React Component
    return (
      <div>
        <Mindmap nodes={appController.getNodes()} adjacent={appController.getEdges()} sendBackNode={node => setNode(node)}/>
      </div>
    );
  }
 
  function Flashcard(){
    const [flip, setFlip] = useState(false)
    return (
      <div  className={`card ${flip ? 'flip' : ''}`} onClick={() => setFlip(!flip)}>
          <div className="front" id="flashcardText"> </div>
          <div className="back" id="flashcardBackText"></div>
      </div>
  );
    }


  // This is what gets rendered
  return (
    <div>
      <div className="u-clearfix u-expanded-width u-layout-wrap u-layout-wrap-2">
          <div className="u-layout">
            <div className="u-layout-row">

      {/** LEFT SIDE **/ }

            {/** JSX for the Flashcard view **/}
              <div className="u-container-style u-layout-cell u-shape-rectangle u-size-30 u-layout-cell-2">
                <div className="u-border-1 u-border-custom-color-1 u-border-no-bottom u-border-no-left u-border-no-top u-container-layout u-container-layout-3">
                  <button id="easy" onclick="changeDifficulty(1)" style= {{color: "white", background: "#04ce71" , cursor: "pointer" }} >Easy</button>
                  <button id="medium" onclick="changeDifficulty(2)" style= {{color: "white", background: "#ffd450" , cursor: "pointer"}} >Medium</button>
                  <button id="hard" onclick="changeDifficulty(3)" style= {{color: "white", background: "red" , cursor: "pointer" }} >Hard</button>
                  <div className="u-container-style u-group u-radius-5 u-shape-round u-group-2">
                    <div className="u-container-layout u-container-layout-4">
                      <Flashcard/>
                    </div>
                  </div>

                  {/** Previous Button **/ }
                  <div className="u-shape u-shape-svg u-text-custom-color-3 u-shape-1">
                    <button id="next-button" className="u-svg-link" onClick={handlePrevious} style={{background: "transparent", border: "none", cursor: "pointer" }}>
                      <svg className="u-svg-link" preserveAspectRatio="none" viewBox="0 0 160 100" ><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#svg-8406"></use></svg>
                      <svg className="u-svg-content" viewBox="0 0 160 100" x="0px" y="0px" id="svg-8406" ><g><path d="M109.2,99.9L160,50L109.2,0H75.6l38.7,38H0v24.2h114L75.6,100L109.2,99.9z"></path></g></svg>
                    </button>
                  </div>

                  {/** Next Button **/ }
                  <div className="u-flip-horizontal u-shape u-shape-svg u-text-custom-color-3 u-shape-2">
                    <button id="previous-button" className="u-svg-link" onClick={handleNext} style={{background: "transparent", border: "none", cursor: "pointer" }}>
                      <svg className="u-svg-link" preserveAspectRatio="none" viewBox="0 0 160 100" ><use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#svg-a94c"></use></svg>
                      <svg className="u-svg-content" viewBox="0 0 160 100" x="0px" y="0px" id="svg-a94c" ><g><path d="M109.2,99.9L160,50L109.2,0H75.6l38.7,38H0v24.2h114L75.6,100L109.2,99.9z"></path></g></svg>
                    </button>
                  </div>

                  {/** yes, no, and partially buttons **/}
                  <div className="u-container-layout u-container-layout-6">
                    <button id="yes-button" className="u-border-none u-btn u-btn-round u-button-style u-custom-color-3 u-custom-font u-hover-custom-color-2 u-radius-50 u-btn-2"
                     onClick={handleYes}>
                      yes
                    </button>
                    <button id="partially-button" className="u-border-none u-btn u-btn-round u-button-style u-custom-color-3 u-custom-font u-hover-custom-color-2 u-radius-50 u-btn-2"
                    onClick={handlePartially}>
                      partially
                    </button>
                    <button id="yes-button" className="u-border-none u-btn u-btn-round u-button-style u-custom-color-3 u-custom-font u-hover-custom-color-2 u-radius-50 u-btn-2"
                    onClick={handleNo}>
                      no
                    </button>
                  </div>

                </div>
              </div>

      {/** RIGHT SIDE **/ }
            {/** JSX for the Mindmap view **/}
              <div className="u-container-style u-layout-cell u-size-30 u-layout-cell-3">
                <div className="u-container-layout u-container-layout-5">
                  <div>
                    <MindMap/>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
    </div>
  );
}

// In Charge of Initial Render
root.render(<App/>);