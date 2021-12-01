module.exports = {
  dev: {
    testing: true,
    endpoint: 'http://localhost:8080/',
  },
  test: {
    testing: false,
    endpoint: 'http://localhost:8080/',
  },
  prod: {
    testing: false,
    endpoint: "http://localhost:8080/",
  },
};
