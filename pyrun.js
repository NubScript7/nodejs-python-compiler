const { spawn, spawnSync } = require('child_process');
const prompt = require('prompt-sync')();
const readline = require('readline');

console.log('Python interpreter test in Node.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let code = '';
let lastOutput = '';

function runPython(cb) {
    while(true) {
    if(lastOutput)console.log(lastOutput)
    const code = prompt('> ');
    if (code === 'exit') {
      rl.close();
      break;
    }

    const pythonProcess = spawn('python', ['-c', code]);
    let output = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.on('close', (exitCode) => {
	lastOutput = output;
//      console.log(output,exitCode)
//      cb(output, exitCode);
  });
 }
}

function runPythonV2(code) {
  const pythonProcess = spawnSync('python', ['-c', code]);

  if (pythonProcess.error) {
    console.error(pythonProcess.error.message);
    return null;
  }

  const output = pythonProcess.stdout.toString();
  return output;
}

console.log(runPythonV2('print("hello world")'));
