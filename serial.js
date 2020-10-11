
// In the future, implementation for serial port communication with an Arduino board
// For  now, fake substitute for testing purposes

function getDataSample() {
  return (Date.now() / 1000) % 60;
}

module.exports = {getDataSample};
