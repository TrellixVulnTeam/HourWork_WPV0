import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Mindmap} from './ReactComponents/MindmapComponent.js';

// Imports for Object JS classes
import {Card} from './js/Card';
import {Node} from './js/Node'
import {MindmapObj} from './js/MindmapObj';

const App = () => {

  // retrieve nestedArray and title from localStorage
  var retrievedData = localStorage.getItem("file-array");
  var nestedArray = JSON.parse(retrievedData);
  var title = localStorage.getItem("file-name");

  // initialize our graph
  var appController = new MindmapObj();


  // Renders MindMap from the MindMapComponent
  function MindMap() {

    // title card
    var titleCard = new Node(0, new Card(title));
    appController.setTitle(titleCard.getLabel());

    //sets dueDate for the MindMap
    appController.setDueDate(localStorage.getItem("due-date"));

    // empty array for the parent nodes
    var parents = [];
    // counter for the node id #'s
    var id_counter = 0;
    // temp variable for each child node
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
    console.log(appController);


    // allows for callback from MindmapComponent js file
    const [node, setNode] = useState('No Node Selected');
    if(node != 'No Node Selected'){
      appController.currentCard = (appController.getCardByNodeID(node[0]));
      console.log(appController);
    }
    


    // returns formatted React
    return (
      <div>
        <Mindmap nodes={appController.getNodes()} adjacent={appController.getEdges()} sendBackNode={node => setNode(node)}/>
        <h4>{node}</h4>
      </div>
    );

  }
 
  function Flashcard(){
    // Handles Logid for when buttons are pressed
    function handleNext(e) {
      e.preventDefault();
      appController.nextCard();
      console.log(appController);
      // Delete next line later
      document.getElementById('temp').innerHTML = tempCurrentCardString();

    }
    function handlePrevious(e) {
      e.preventDefault();
      appController.previousCard();
      console.log(appController);
      // Delete next line later
      document.getElementById('temp').innerHTML = tempCurrentCardString();
    }

    
    // for testing -- delete me later
    function tempCurrentCardString(){
      var c = appController.getCurrentCard();
      if(c == null){
        return;
      }
      return c.getFrontText();
    }

    // React formatting
    return (
      <div>
        <button onClick={handlePrevious}>Prev</button>
        <h1>Flashcard</h1>
        <h4 id="temp"></h4>
        <button onClick={handleNext}>Next</button>
      </div>
    );
  
  }


  // This is what gets rendered
  return (
    <div>
      <div>
        <Flashcard/>
        <MindMap/>
      </div>
      
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);

