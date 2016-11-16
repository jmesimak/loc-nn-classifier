const fs = require('fs');

function calcDists(train, test) {

  test.forEach((te) => {

    dists = [];

    train.forEach((tr) => {

      let sumDiff = Math.sqrt(te.readings.reduce((a,b,idx) => {
        return a + Math.pow(b - tr.readings[idx],2);
      }, 0));

      dists.push({id: tr.location, dist: sumDiff});
    });

    te.nearest = dists.reduce((a,b) => {
      return b.dist < a.dist ? b : a;
    }, dists[0]);
  });
}

function convertTestReadings(raw) {
  return raw
    .filter(r => r.length > 0)
    .map((row) => {
      let r1 = row
        .split(',')
        .map(Number);
      let readings = r1
        .slice(0, r1.length - 1)
        .map((n) => {
          if (n !== 0) return n;
          return Math.floor(r1.reduce((a, b) => { return a + b }, 0) / (r1.length - 2));
        });
      return {
        readings: readings
      };
    });
}

function convertToReadings(raw) {
  return raw
    .filter(r => r.length > 0)
    .map((row) => {

      let r1 = row
        .slice(0, row.length - 1)
        .split(',')
        .map(Number);

      let readings = r1
        .slice(0, r1.length - 1)
        .map((n) => {
          if (n !== 0) return n;
          return Math.floor(r1.reduce((a, b) => { return a + b }, 0) / (r1.length - 2));
        });
      return {
        location: Number(row[row.length - 1]),
        readings: readings
      };
    });
  }

fs.readFile('training_set.csv', (err, data) => {
  let raw = data.toString().split('\n');
  let trainingSet = convertToReadings(raw);

  fs.readFile('testing_set.csv', (err, data) => {
    let raw = data.toString().split('\n');
    let testSet = convertTestReadings(raw);

    calcDists(trainingSet, testSet);

    testSet.forEach((t, idx) => {
      console.log(`Reading at ${idx} belongs to location ${t.nearest.id}`);
    });

  });

});
