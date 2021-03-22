function getWinnerTotalGoals(competition, year) {
  const https = require("https");
  const teamPlaysAs = {
    1: "local",
    2: "visiting",
  };

  const competitionsUrl = `https://jsonmock.hackerrank.com/api/football_competitions?name=${competition}&year=${year}`;

  https
    .get(competitionsUrl, (resp) => {
      let data = "";

      // A chunk of data has been received.
      resp.on("data", (chunk) => {
        data += chunk;
      });

      // The whole response has been received.
      resp.on("end", () => {
        const response = JSON.parse(data).data[0].winner;
        getCollectionOfMatches(response);
      });
    })
    .on("error", (err) => {
      console.log("Error: " + err.message);
    });

  function getCollectionOfMatches(team) {
    const responses = [];
    let completedRequests = 0;

    for (let i = 1; i <= 2; i++) {
      let page = 1;
      let totalPages;
      const matchesUrlAssembler = (page) =>
        `https://jsonmock.hackerrank.com/api/football_matches?competition=${competition}&year=${year}&team${i}=${team}&page=${page}`;

      let matchesUrl = matchesUrlAssembler(page);
      https
        .get(matchesUrl, (resp) => {
          let data = "";

          // A chunk of data has been received.
          resp.on("data", (chunk) => {
            data += chunk;
          });

          // The whole response has been received.
          resp.on("end", () => {
            let teamMatchesPage = JSON.parse(data);
            totalPages = teamMatchesPage.total_pages;
            let pageGoals = extractGoalsFromPage(
              teamMatchesPage.data,
              i,
              page,
              totalPages
            );
            responses.push(pageGoals);
            while (page < totalPages) {
              matchesUrl = matchesUrlAssembler(++page);
              https
                .get(matchesUrl, (resp) => {
                  let data = "";

                  // A chunk of data has been received.
                  resp.on("data", (chunk) => {
                    data += chunk;
                  });

                  // The whole response has been received.
                  resp.on("end", () => {
                    teamMatchesPage = JSON.parse(data);
                    pageGoals = extractGoalsFromPage(
                      teamMatchesPage.data,
                      i,
                      page,
                      totalPages
                    );
                    responses.push(pageGoals);
                    completedRequests++;
                    if (completedRequests === 2 * totalPages) {
                      return processResponsesArray(responses);
                    }
                  });
                })
                .on("error", (err) => {
                  console.log("Error: " + err.message);
                });
            }
            completedRequests++;
            if (totalPages === 1 && completedRequests === 2) {
              return processResponsesArray(responses);
            }
          });
        })
        .on("error", (err) => {
          console.log("Error: " + err.message);
        });
    }
  }

  function extractGoalsFromPage(arr, int, page, totalPages) {
    const localOrVisitant = int === 1 ? "team1goals" : "team2goals";
    const goalsArr = arr.map((match) => parseInt(match[localOrVisitant]));
    const homeOrAway = teamPlaysAs[int];
    return { homeOrAway, page: page, totalPages: totalPages, goalsArr };
  }

  function processResponsesArray(arr) {
    const arrayOfGoalsArr = arr.map(
      (responsePageInfo) => responsePageInfo.goalsArr
    );
    const finalArray = [];
    for (let goalsArr of arrayOfGoalsArr) {
      finalArray.push(...goalsArr);
    }
    const result = finalArray.reduce((acc, currVal) => acc + currVal);
    console.log(result);
    return result;
  }
}

getWinnerTotalGoals("La Liga", 2011);

// run on the terminal with: node https.get-solution.js