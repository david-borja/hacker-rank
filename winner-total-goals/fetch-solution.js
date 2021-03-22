async function getWinnerTotalGoals(competition, year) {
  const competitionsUrl = `https://jsonmock.hackerrank.com/api/football_competitions?name=${competition}&year=${year}`;

  const matchesUrlAssembler = (page, side) =>
    `https://jsonmock.hackerrank.com/api/football_matches?competition=${competition}&year=${year}&team${side}=${winner}&page=${page}`;

  async function fetchData(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((data) => resolve(data))
        .catch((err) => console.log(err));
    });
  }

  const winnerData = await fetchData(competitionsUrl);
  const winner = winnerData.data[0].winner;

  const goalsRequests = [];

  async function loadGoals() {
    const homeOrAway = {
      local: 1,
      visiting: 2,
    };

    for (let side in homeOrAway) {
      let page = 1;
      let url = matchesUrlAssembler(page, homeOrAway[side]);
      goalsRequests.push(fetchData(url));
      const goalsResponse = await fetchData(url);
      const totalPages = goalsResponse.total_pages;
      while (page < totalPages) {
        url = matchesUrlAssembler(++page, homeOrAway[side]);
        goalsRequests.push(fetchData(url));
      }
    }

    return Promise.all(goalsRequests).then(
      (allGoalResponses) => allGoalResponses
    );
  }

  function transformGoalsResponses(arr) {
    const goalsArr = [];
    const pagesArray = arr.map((el) => el.data);
    for (let i = 0; i < pagesArray.length; i++) {
      let page = pagesArray[i];
      for (let match in page) {
        i + 1 <= pagesArray.length / 2
          ? goalsArr.push(parseInt(page[match].team1goals))
          : goalsArr.push(parseInt(page[match].team2goals));
      }
    }
    const reducedGoalsArr = goalsArr.reduce((acc, currVal) => acc + currVal);
    console.log(reducedGoalsArr);
    return reducedGoalsArr;
  }

  const goalsResponses = await loadGoals();
  return transformGoalsResponses(goalsResponses);
}

// run on the browser with: await getWinnerTotalGoals('UEFA Champions League', 2011)