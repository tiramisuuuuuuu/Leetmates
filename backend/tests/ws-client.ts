const userId = process.argv[2];

if (!userId) {
  console.log('Usage: bun tests/ws-client.ts <userId>');
  process.exit(1);
}

const ws = new WebSocket(`ws://localhost:3000/ws?userId=${userId}`);

ws.addEventListener('open', () => {
  console.log(`connected as user ${userId}`);
});

ws.addEventListener('message', (event) => {
  console.log('received:', event.data);
});

ws.addEventListener('close', () => {
  console.log('closed');
});
