function loadNouns(filename) {
    // Simulating an asynchronous file read operation
    return fetch(filename)
        .then(response => response.text())
        .then(data => data.split('\n').map(line => line.trim()));
}

function containsNoChars(noun, no) {
    return no.some(char => noun.includes(char));
}

function doesNotMatchExact(noun, exact) {
    for (let i = 0; i < 5; i++) {
        if (exact[i] !== '' && noun[i] !== exact[i]) {
            return true;
        }
    }
    return false;
}

function matchesNotThere(noun, notThere) {
    for (let i = 0; i < 5; i++) {
        for (const l of notThere[i]) {
            if (l !== '' && noun[i] === l) {
                return true;
            }
        }
    }
    return false;
}

function doesNotContainMustBe(noun, mustBe) {
    Array.from(mustBe).map((char) => console.log(noun, char))
    return mustBe.size === 0 ? false : !Array.from(mustBe).every(char => noun.includes(char));
}

function filterNouns(nouns, no, exact, notThere) {
    let mustBe = new Set();

    for (let i = 0; i < 5; i++) {
        mustBe.add(...exact[i]);
        mustBe.add(...notThere[i].split(''));
    }

    mustBe = new Set([...mustBe].filter(item => item !== undefined));

    no = no.filter(char => !mustBe.has(char));

    const possible = [];
    for (const noun of nouns) {
        if (containsNoChars(noun, no)) continue;
        if (doesNotMatchExact(noun, exact)) continue;
        if (matchesNotThere(noun, notThere)) continue;
        if (doesNotContainMustBe(noun, mustBe)) continue;

        possible.push(noun);
    }

    return possible;
}

const filename = 'sorted_nouns.txt';
let no = [];
const exact = ['', '', '', '', ''];
const notThere = ['', '', '', '', ''];

loadNouns(filename)
    .then(nouns => {
        const possible = filterNouns(nouns, no, exact, notThere);
        console.log(possible.length);
        console.log(possible);
    })
    .catch(error => {
        console.error('Error loading nouns:', error);
    });
