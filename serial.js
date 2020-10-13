
// In the future, implementation for serial port communication with an Arduino board
// For  now, fake substitute for testing purposes

function getDataSample() {
  return {
    date: new Date(),
    value: Math.sin(((new Date()).getMilliseconds()) * 2 * Math.PI / 1000)
  };
}

module.exports = {getDataSample};
