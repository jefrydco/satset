const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { boolean } = require("boolean");
const got = require("got");

(async () => {
  const argument = yargs(hideBin(process.argv)).argv;
  const requestPayload = {
    name: argument["name"],
    loginUrl: argument["loginUrl"],
    usernameSelector: argument["usernameSelector"],
    passwordSelector: argument["passwordSelector"],
    submitSelector: argument["submitSelector"],
    hasPin: boolean(argument["hasPin"]),
    pinSelector: argument["pinSelector"],
    username: argument["username"],
    password: argument["password"],
    pin: argument["pin"],
    url: argument["url"],
    count: String(argument["count"]),
  };
  // console.log(JSON.stringify(requestPayload))
  const { body: runResponse } = await got.post("http://0.0.0.0:3001/api/v1/run", {
    json: requestPayload,
    responseType: "json",
  });

  const interval = setInterval(() => {
    got.post("http://0.0.0.0:3001/api/v1/run/status", {
    json: { measureMongoId: runResponse.measureMongoId },
    responseType: "json",
  }).then(({ body: runStatusResponse }) => {
    console.log(runStatusResponse.scores)
    if (runStatusResponse.progress === 'COMPLETED') {
      clearInterval(interval)
    }
  });
  }, 10000);
  //=> {hello: 'world'}
})();
