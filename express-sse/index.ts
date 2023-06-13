import express, { Response } from "express";

const app = express();

// Rota SSE
app.get("/events", (req, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();


  // Função para enviar eventos periodicamente
  const sendEvent = () => {
    const data = {
      message: "Evento SSE",
      timestamp: Date.now(),
    };

    res.write(`id: ${Math.random()}\n`);
    res.write("event: message\n");
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Enviar eventos a cada segundo
  const intervalId = setInterval(sendEvent, 1000);

  // Encerrar a conexão após 10 segundos
  setTimeout(() => {
    clearInterval(intervalId);
    res.write("event: close\n");
    res.write("data: Conexão encerrada\n\n");
    res.end();
  }, 10000);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Iniciar o servidor na porta 3000
app.listen(3000, () => {
  console.log("Servidor escutando na porta 3000");
});
