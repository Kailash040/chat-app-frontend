import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; 

class SocketService {
  socket = null;
  connect() {
    this.socket = io(SOCKET_URL);
    return this.socket;
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  joinRoom(roomId) {
    if (this.socket) {
      this.socket.emit('join_room', roomId);
    }
  }
  sendMessage(data) {
    if (this.socket) {
      this.socket.emit('send_message', data);
    }
  }
  onReceiveMessage(callback) {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }
  offReceiveMessage() {
    if (this.socket) {
      this.socket.off('receive_message');
    }
  }
}
export default new SocketService();