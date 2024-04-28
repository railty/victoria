import React, {useState} from 'react';

export default function Popup(): JSX.Element {
  const [tab, setTab] = useState<chrome.tabs.Tab | null>(null);

  const test = async ()=>{
    console.log("test");
  }
  
  const sendMsg = async ()=>{
    console.log("sendMsg", tab);
    const response = await chrome.tabs.sendMessage(tab.id, {msg: "xxxxxxxxxxxxxx"});
    console.log(response)

    //const response = await chrome.runtime.sendMessage({greeting: "hello"});
    //console.log(response);
  }

  const create = async ()=>{
    const tab = await chrome.tabs.create({
      active: false,
      url: 'src/pages/newtab/index.html',
    });
    console.log("create", tab);
    setTab(tab);
  }

  const getTitle = (x) => { 
    console.log("x", x);
    return document.title; 
  }

  const getTables = (option) => { 
    console.log("option", option);
    
    const tbls = Array.from(document.querySelectorAll("table"));

    if (option.includeShadowDom) {
      const findRoots = (ele) => {
        return [
            ele,
            ...ele.querySelectorAll('*')
        ].filter(e => !!e.shadowRoot)
            .flatMap(e => [e.shadowRoot, ...findRoots(e.shadowRoot)])
      }
      const roots = findRoots(document);
      console.log("roots", roots);
      for (const root of roots) {
        let tables = Array.from(root.querySelectorAll("table"));
        console.log("tables", tables);
        tables = tables.map((tbl)=>{
          let trs = Array.from(tbl.querySelectorAll("tr"));
          trs = trs.map((tr)=>{
            let tds = Array.from(tr.querySelectorAll("td"));
            tds = tds.map((td)=>{
              return td.innerText;
            });
            return tds;
          });
          return trs;
        })
        tbls.push(...tables);
      }
    }
    console.log("tables=", tbls);
    return tbls;
  }

  const inject = async ()=>{
    const [tab] = await chrome.tabs.query({ active: true });
    const title = await chrome.scripting.executeScript({
      target: {tabId: tab.id, allFrames: true},
      func : getTitle,
      args : [ 123 ],
      //files: ['src/pages/inject/index.js']
    })
    console.log("title", title);
  }

  const extractTables = async ()=>{
    console.log("extractTables");
    const [tab] = await chrome.tabs.query({ active: true });
    console.log("extractTables", tab);
    const tables = await chrome.scripting.executeScript({
      target: {tabId: tab.id, allFrames: true},
      func : getTables,
      args : [ {
        includeShadowDom: true,
      } ],
    })
    console.log("tables=", tables);
  }

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
      <header className="flex flex-col items-center justify-center text-white">
        Inject
      </header>

      <main className="flex flex-col h-screen">
        <div className="flex-none flex items-center justify-start m-2">
          <div className="p-2 pr-6 text-white">tabs</div>
          <button onClick={create} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-4 rounded-sm" >
            Create
          </button>
          <button onClick={sendMsg} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-4 rounded-sm" >
            Message
          </button>
        </div>

        <div className="flex-none flex items-center justify-start m-2">
          <div className="p-2 pr-6 text-white">extract</div>
          <button onClick={extractTables} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-4 rounded-sm" >
            Tables
          </button>
          <button onClick={test} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-4 rounded-sm" >
            Test
          </button>
        </div>

      </main>

    </div>
  );
}
