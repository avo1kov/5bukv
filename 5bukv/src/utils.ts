import type { Rule } from './types'

export function loadNouns(filename: string): Promise<string[]> {
    return fetch(filename)
        .then(response => response.text())
        .then(data => data.split('\n').map(line => line.trim()));
}

export function filterNouns(nouns: string[], rule: Rule): {possible: string[], newRule} {
    const newRule = { ...rule };
    let mustBe: Set<string> = new Set();

    for (let i = 0; i < 5; i++) {
        for (const element of rule.exact[i]) {
            mustBe.add(element);
        }
        for (const element of rule.notThere[i].split('')) {
            mustBe.add(element);
        }
    }

    mustBe = new Set([...mustBe].filter(item => item !== undefined));
    newRule.no = rule.no.filter(char => !mustBe.has(char));

    const possible: string[] = [];
    for (const noun of nouns) {
        if (containsNoChars(noun, rule.no)) continue;
        if (doesNotMatchExact(noun, rule.exact)) continue;
        if (matchesNotThere(noun, rule.notThere)) continue;
        if (doesNotContainMustBe(noun, mustBe)) continue;

        possible.push(noun);
    }

    return {possible, newRule};
}

function containsNoChars(noun: string, no: string[]): boolean {
    return no.some(char => noun.includes(char));
}

function doesNotMatchExact(noun: string, exact: string[]): boolean {
    for (let i = 0; i < 5; i++) {
        if (exact[i] !== '' && noun[i] !== exact[i]) {
            return true;
        }
    }
    return false;
}

function matchesNotThere(noun: string, notThere: string[]): boolean {
    for (let i = 0; i < 5; i++) {
        for (const l of notThere[i]) {
            if (l !== '' && noun[i] === l) {
                return true;
            }
        }
    }
    return false;
}

function doesNotContainMustBe(noun: string, mustBe: Set<string>): boolean {
    return mustBe.size === 0 ? false : !Array.from(mustBe).every(char => noun.includes(char));
}