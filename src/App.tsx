import './App.css';
import Main from './components/Main/Main';
import animateMotion, { useState } from "react";
import { concatMap, mergeMap, switchMap } from 'rxjs';

export interface SVGElement extends HTMLElement {
  beginElementAt(d: number): SVGElement;
}

function App() {

  console.log("render")

  const [run, setRun] = useState({ run: 0, operatorFunction: "concatMap" });
  const [run2, setRun2] = useState({ run: 0, operatorFunction: "switchMap" });
  const [run3, setRun3] = useState({ run: 0, operatorFunction: "mergeMap" });
  const [run4, setRun4] = useState({ run: 0, operatorFunction: "exhaustMap" });

  const restart = () => {
    setRun(prev => {
      return { run: run.run + 1, operatorFunction: prev.operatorFunction }
    });
    setRun2(prev => {
      return { run: run.run + 1, operatorFunction: prev.operatorFunction }
    });
    setRun3(prev => {
      return { run: run.run + 1, operatorFunction: prev.operatorFunction }
    });
    setRun4(prev => {
      return { run: run.run + 1, operatorFunction: prev.operatorFunction }
    });
  }

  return (
    <header className="App-header">
      <div>
        <h3>
          RXJS Higher-order Observables Mappings
        </h3>
      </div>
      <div className='container'>
        <button className='restart-button' onClick={restart}>
            Restart Observables
        </button>
      </div>
      <div className='container'>
        <div className='App-button'>
          <pre>
            concatMap: One after the other <br></br>
            observableA.pipe((take(3), concatMap( ()={'>'} ObservableB.pipe(take(3), map(callback)))))
          </pre>
        </div>
        <Main run={run}></Main>

      </div>
      <div className='container'>
        <div  className='App-button'>
          <pre>
            switchMap: Cancel Logic<br></br>
            observableA.pipe((take(3), switchMap( ()={'>'} ObservableB.pipe(take(3), map(callback)))))
          </pre>
        </div>
        <Main run={run2}></Main>
      </div>
      <div className='container'>
        <div  className='App-button'>
          <pre>
            mergeMap: Parallel logic <br></br>
            observableA.pipe((take(3), mergeMap( ()={'>'} ObservableB.pipe(take(3), map(callback)))))
          </pre>
        </div>
        <Main run={run3}></Main>
      </div>
      <div className='container'>
        <div className='App-button'>
          <pre>
            exhaustMap: Ignores incomming while processing <br></br>
            observableA.pipe((take(3), exhaustMap( ()={'>'} ObservableB.pipe(take(3), map(callback)))))
          </pre>
        </div>
        <Main run={run4}></Main>
      </div>
    </header>
  );
}

export default App;
