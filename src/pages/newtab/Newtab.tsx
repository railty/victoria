import React, {useState, useEffect} from 'react';
import logo from '@assets/img/logo.svg';
import '@pages/newtab/Newtab.css';
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "nnnnnnnnnnnnn from a content script:" + sender.tab.url :
                "ttttttttttt  from the extension");
    if (request.greeting === "hello")
      sendResponse({farewell: "goodbye111"});
  }
);

export default function Newtab(): JSX.Element {
  const [x, setX] = useState<number>(123);
  const [worker, setWorker] = useState<any>(null);
  useEffect(() => {
    const worker = new Worker('../sqlWorker/index.js', { type: 'module' });
    worker.onmessage = (e) => {
      console.log("Message received from worker", e);
    };
    setWorker(worker);
  }, []);

  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/newtab/Newtab.tsx</code> and save to reload.
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={()=>{
          worker.postMessage({cmd: 'insert'});
        }}>Insert</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={()=>{
          worker.postMessage({cmd: 'select'});
        }}>Select</button>



      </header>
    </div>
  );
}
