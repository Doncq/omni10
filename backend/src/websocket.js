const socketio = require('socket.io');
const parseStringAsArray = require('./models/utils/parseStringAsArray');
const calculateDistance = require('./models/utils/calculateDistance');

const connections = [];
let io;

exports.setupWebSocket = (server) => {
    io = socketio(server);


    io.on('connection', socket => {
        
       const { latitude, longitude, techs } = socket.handshake.query;

       connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs),
       });
    });
};


exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        return calculateDistance(coordinates, connections.coordinates) < 10
        && connection.techs.some(item => techs.includes(item))
    })
};



exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    })
}
