/**
 * socketHandler.js
 * Real-time synchronization between two roommates.
 * When Roommate A adds/updates/deletes an expense on Phone 1,
 * Roommate B on Phone 2 receives the event and updates live!
 */
const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`⚡ Roommate connected via Socket.IO: ${socket.id}`);

    // Join room channel
    socket.on('join_room', (roomId) => {
      if (roomId) {
        socket.join(roomId.toString());
        console.log(`👥 Socket ${socket.id} joined room channel: ${roomId}`);
        socket.to(roomId.toString()).emit('user_joined_room', {
          socketId: socket.id,
          message: 'Roommate came online!',
        });
      }
    });

    // Leave room channel
    socket.on('leave_room', (roomId) => {
      if (roomId) {
        socket.leave(roomId.toString());
        console.log(`👋 Socket ${socket.id} left room channel: ${roomId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Roommate disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;

