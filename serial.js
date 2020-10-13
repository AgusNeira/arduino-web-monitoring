
// In the future, implementation for serial port communication with an Arduino board
// For  now, fake substitute for testing purposes

function getDataSample() {
  return {
    date: new Date(),
    value: new Date().getSeconds()
  };
}

module.exports = {getDataSample};
