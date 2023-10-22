const { spawn, spawnSync } = require('child_process');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.json());

function runPython(code,cb) {
    const pythonProcess = spawn('python', ['-c', code]);
    let output = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.on('close', (exitCode) => {
      console.log(output,exitCode)
      cb(output, exitCode);
  });
}

function runPython3(code) {
  const pythonProcess = spawnSync('python', ['-u','-c', code]);

  if (pythonProcess.error) {
    console.error(pythonProcess.error.message);
    return null;
  }

  const output = pythonProcess.stdout.toString() || pythonProcess.stderr.toString();
  return output;
}
/*
let runPy = new Promise(function(success=()=>{}, nosuccess=()=>{}) {
    const pyprog = spawn('python', ['./runPy.py']);

    pyprog.stdout.on('data', function(data) {

        success(data);
    });

    pyprog.stderr.on('data', (data) => {

        nosuccess(data);
    });
});
*/
app.get('/',(req,res)=>{
  res.sendFile(__dirname + "/views/webpy.html")
})

io.on('connection',socket=>{
  socket.on('compile',code=>{
    io.to(socket.id).emit('output',runPython3(code));
  })
})

server.listen(3000,()=>{
  console.log('server listening at port 3000');
})

