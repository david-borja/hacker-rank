function getNumDraws(year) {
  const https = require("https");
  const responses = [];
  const maxGoals = 10;
  let completedRequests = 0;

  for (let i = 0; i <= maxGoals; i++) {
    console.log("requesting i:", i);
    https
      .get(
        `https://jsonmock.hackerrank.com/api/football_matches?year=${year}&team1goals=${i}&team2goals=${i}&page=1`,
        (resp) => {
          let data = "";

          // A chunk of data has been received.
          resp.on("data", (chunk) => {
            data += chunk;
          });

          // The whole response has been received.
          resp.on("end", () => {
            let numOfDraws = JSON.parse(data).total;
            responses.push(numOfDraws);
            console.log(
              "i:",
              i,
              "numOfDraws",
              responses[completedRequests],
              numOfDraws
            );
            completedRequests++;
            if (completedRequests == 11) {
              // all requests compleated
              const reducer = (acc, currVal) => acc + currVal;
              const numOfDrawnMatches = responses.reduce(reducer);
              console.log(
                `Num of drawn matches in ${year}: ${numOfDrawnMatches}`
              );
              return numOfDrawnMatches;
            }
          });
        }
      )
      .on("error", (err) => {
        console.log("Error: " + err.message);
      });
  }
}

getNumDraws(2011);

// run on the terminal with: node https.get-solution.js