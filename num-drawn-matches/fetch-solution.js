async function getNumDraws(year) {
  function fetchData(numGoals) {
    return new Promise((resolve, reject) => {
      fetch(
        `https://jsonmock.hackerrank.com/api/football_matches?year=${year}&team1goals=${numGoals}&team2goals=${numGoals}&page=1`
      )
        .then((res) => res.json())
        .then((data) => resolve(data.total))
        .catch((err) => console.log(err));
    });
  }

  function loadMultipleDrawRequests() {
    const numMaxPossibleGoals = 10;
    const possibleNumOfGoalsScoredByTeam = [];

    for (let i = 0; i <= numMaxPossibleGoals; i++) {
      possibleNumOfGoalsScoredByTeam.push(i);
    }

    const numOfDrawRequests = [];

    possibleNumOfGoalsScoredByTeam.forEach((goalsByTeam) => {
      numOfDrawRequests.push(fetchData(goalsByTeam));
    });

    return Promise.all(numOfDrawRequests).then((allDrawData) => {
      const numOfDrawnMatchesInYear = allDrawData.reduce(
        (acc, currVal) => acc + currVal
      );
      return numOfDrawnMatchesInYear;
    });
  }

  let innerFunctionReturnVal = loadMultipleDrawRequests();
  return innerFunctionReturnVal;
}

// invoke function with 'await' on the browser: await getNumDraws(2011)