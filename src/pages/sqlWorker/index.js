// In `worker.js`.
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
let db;

onmessage = async (e) => {
  if (e.data.cmd == 'insert') {
    console.log('selecting');
    db.exec({
      sql: "INSERT INTO test (name) VALUES (?)",
      bind: ['aaa'],
      callback: (row) => {
        console.log(row);
      }
    });
  }
  else if (e.data.cmd == 'select') {
    console.log('selecting');
    db.exec({
      sql: 'SELECT * FROM test',
      callback: (row) => {
        console.log(row);
        //postMessage({row});
      },
    });
  }
};

const log = (...args) => {
  //console.log(...args);
}
const error = (...args) => console.error(...args);

const start = function (sqlite3) {
  log('Running SQLite3 version', sqlite3.version.libVersion);
  if ('opfs' in sqlite3) {
    db = new sqlite3.oo1.OpfsDb('/mydb.sqlite3');
    log('OPFS is available, created persisted database at', db.filename);

  } else {
    db = new sqlite3.oo1.DB('/mydb.sqlite3', 'ct');
    log('OPFS is not available, created transient database', db.filename);
  }
  db.exec("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT);");
  db.exec("INSERT INTO test (name) VALUES ('Hello World');");
};

log('Loading and initializing SQLite3 module...');

sqlite3InitModule({
  print: log,
  printErr: error,
}).then((sqlite3) => {
  try {
    start(sqlite3);
  } catch (err) {
    error(err.name, err.message);
  }
});