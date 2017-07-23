import React, { Component } from 'react';
import logo from './logo.svg';
import i from 'react-fontawesome';
import _ from 'lodash';

import {row, col} from 'react-bootstrap';
import './App.css';


// =======================================================================

// =======================================================================

const OriginalLayout = () => 
{
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          This is a simple game using React.JS.
        </p>
      </div>
    );
}; // end OriginalLayout()

// Checking possible combinations -- source: bit.ly/s-pcs
var possibleCombinationsSum = function(arr, n)
{
    if (arr.indexOf(n) >=0)
    {
        return true; 
    }

    if (arr[0] > n)
    {
        return false; 
    }

    if (arr[arr.length -1] > n)
    {
        arr.pop(); 
        return possibleCombinationsSum(arr, n); 
    }

    var listSize = arr.length, combinationsCount = (1 << listSize); 
    for (var i = 1; i < combinationsCount; i++)
    {
        var combinationSum = 0; 
        for (var j=0; j < listSize; j++)
        {
            if (i & (1 << j))
            {
                combinationSum += arr[j];
            }
        }// end for:j

        if (n === combinationSum)
        {
            return true;
        }
    }// end for:i

    return false;

};// end possibleCombinationsSum()

/* 
    Creating the stars Component

    Need to install font-awesome inside your project folder from terimainl: 
        $ npm install --save react-fontawesome
        $ npm install --save font-awesome

        and have to put link inside index.js 
        # import '../node_modules/font-awesome/css/font-awesome.min.css'; 
*/


const Stars = (props) => 
{
    // const numOfStars = 1 + Math.floor(Math.random() * 9); 

    // let stars = []; 

    // for (let i=0; i < numOfStars; i++)
    // {
    //     stars.push(<i key={i} className="fa fa-star"></i>); 
    // } 

    
    
    return (
        <div className="col-md-5">
        {
            _.range(props.numOfStars)
            .filter(n => function (n){ if (n%4 === 0) return <br />; })
            .map (c =>
                        <i key={c} className="fa fa-star"> </i>
                        
                        
                    )
        }
        </div>
    )
}

const Button = (props) => 
{
    // Storing the UI 
    let buttonObj; 

    switch(props.answerIsCorrect)
    {
        case true: 
            buttonObj = <button className="btn btn-success" onClick={props.acceptAnswer} > 
                            <i className="fa fa-check"></i>
                        </button>;
            break; 

        case false:
            buttonObj = <button className="btn btn-danger" > 
                <i className="fa fa-times"></i></button>;
            break; 

        default:
            buttonObj = <button className="btn" 
                                onClick={props.checkAnswer}
                                disabled={props.selectedNums.length === 0}> = </button>;
            break;     

    }

    return (
        <div className="col-md-2">
            {buttonObj}

            <br />
            <br />
            <button className="btn btn-warning btn-sm" onClick={props.redraw} disabled={props.redraws === 0} > 
                <i className="fa fa-refresh"> {props.redraws} </i>
            </button>
        </div>
    )
}

const Answer = (props) => 
{
    return (
        <div className="col-md-5">
            {props.selectedNums.map((num, i) => 
                <span key={i} onClick={() => props.unselectNum(num)}> {num} </span>
                )}
        </div>
    )
}

const Numbers = (props) =>
{
    /*
        Using the loddash
        $ npm install loddash
    */
    // const arrayOfNums = _.range(1, 10); 

    // Creating numberClassName function to check the selected nums 
   
    const numberClassName = (nums) => 
    {
        // Note: selected is define in App.css
        if (props.selectedNums.indexOf(nums) >= 0)
        {
            return 'selected'; 
        }

        // Used nums check 
        if (props.usedNums.indexOf(nums) >= 0)
        {
            return 'selected'; 
        }
    }

    return (
        <div className="card text-center">
            <div>
                {
                    Numbers.list
                        .map((nums, i) =>
                            <span key={i} className={numberClassName(nums)}
                                          onClick={() => props.selectNum(nums)}>
                                {nums} 
                            </span>
                )}
            </div>
        </div>
    )
}// end Numbers()

Numbers.list = _.range(1, 10); 

const DoneFrame = (props) => 
{
    return(
        <div className="text-center" >
            <h2> {props.doneStatus} </h2>

            <button className="btn btn-secondary" onClick={props.resetGame} > Play Again </button>
        </div>
    ); 

}// end DoneFrame()

class Game extends Component
{
    // Creating a random class level generator
    static randomNumber = () => 1 + Math.floor(Math.random() * 9); 

    // Storing the selected numbers as the main 
    static initialState = () => ({
        selectedNums: [],
        usedNums: [],
        randNumOfStars: Game.randomNumber(), // Peventing from re-rendering 
        answerIsCorrect: null,
        redraws: 5,
        doneStatus: null,
    }); 

    state = Game.initialState(); 

    // Adding the selected nums to the state 
    selectNum = (clickedNum) => 
    {

        // Selected nums can't select anymore 
        if (this.state.selectedNums.indexOf(clickedNum) >= 0)
        {
            return; 
        }
 
        this.setState(prevState => ({
            answerIsCorrect: null,        
            selectedNums : prevState.selectedNums.concat(clickedNum)
        }))
    };

    // If the user selected the wrong num, the user can undo it. 
    unselectNum = (clickedNum) => {
        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNums: prevState.selectedNums
                                   .filter(num => num !== clickedNum)
        }))
    };

    // Checking the answer numOfStars == selectedNums
    checkAnswer = () => 
    {
        // Answer is correct 
        this.setState(prevState => ({
            answerIsCorrect : prevState.randNumOfStars === prevState.selectedNums.reduce((acc, n) => acc + n, 0)
        })); 
    };

    acceptAnswer = () => 
    {
        // Accepted numbers as used 
        // Re-rendering the answers are accepted 
        this.setState(prevState => ({

            usedNums: prevState.usedNums.concat(prevState.selectedNums),

            // Resetting the objs 
            selectedNums: [], 
            answerIsCorrect: null,
            randNumOfStars: Game.randomNumber(),
        }), this.updateDoneStatus); 

    };

    // Redrawing the item
    redraw = () => {
        // Checking the redraw status == 0 
        if (this.state.redraws === 0)
        {
            return;
        }

        this.setState((prevState) => ({
            randNumOfStars: Game.randomNumber(),
            // Resetting the objs 
            selectedNums: [], 
            answerIsCorrect: null,
            redraws: prevState.redraws - 1,
        }), this.updateDoneStatus);
    };

    // Checking for possible solutions 
    possibleSolutions = ({randNumOfStars, usedNums}) => 
    {
        const possibleNumbers = _.range(1, 10)
                                 .filter(nums => usedNums.indexOf(nums) === -1); 

        return possibleCombinationsSum(possibleNumbers, randNumOfStars);                         
    };

    // Update done status 
    updateDoneStatus = () => 
    {
        this.setState(prevState => {
            // Success case 
            if (prevState.usedNums.length === 9)
            {
                return {doneStatus: "Done Nice!"}; 
            }

            // Game over because of no more possible solution left. 
            if (prevState.redraws === 0 && !this.possibleSolutions(prevState))
            {
                return {doneStatus: "Game Over !!!"}; 
            }
        });
    };

    // Resetting the whole components and start over again 
    resetGame = () => this.setState(Game.initialState());
 

    // <!-- Adding the Stars, Button and Answer components with Bootstrap -->
    // <!-- Adding Numbers -->
    render ()
    {
        // Initialization the this.state to reuse the variables driectly.
        const {selectedNums, randNumOfStars, answerIsCorrect, usedNums, redraws, doneStatus} = this.state; 

        return (
            <div className="container">
                <h3> Play Nine </h3>

                <div className="row">
                    <Stars numOfStars={randNumOfStars} />
                    <Button selectedNums={selectedNums} 
                            checkAnswer={this.checkAnswer}
                            acceptAnswer={this.acceptAnswer}
                            answerIsCorrect={answerIsCorrect}
                            redraw={this.redraw}
                            redraws={redraws}
                    /> 


                    <Answer selectedNums={selectedNums} unselectNum={this.unselectNum} />
                </div>

                <br />
                {
                    doneStatus ? 
                    <DoneFrame doneStatus={doneStatus} resetGame={this.resetGame} /> : 
                    <Numbers selectedNums={selectedNums} selectNum={this.selectNum} usedNums={usedNums} />
                }
                

              
                

            </div>
        );// end return()

    }// end render

}// end Game class

class App extends Component 
{
  render() 
  {
      return (
        <div>
            <OriginalLayout />

            <Game />

        </div>
      );
  }// end render()
}

export default App;
