<script lang="ts">
    type Word = {
        letter: string;
        color: string | undefined;
    }[];

    let possible: string[] = [];
    let nouns: string[] = [];
    const filename: string = '/sorted_nouns.txt';

    let word: Word = [
        { letter: '', color: undefined },
        { letter: '', color: undefined },
        { letter: '', color: undefined },
        { letter: '', color: undefined },
        { letter: '', color: undefined }
    ];

    interface Rule {
        no: string[];
        exact: string[];
        notThere: string[];
    }

    let rule: Rule = {
        no: [],
        exact: ['', '', '', '', ''],
        notThere: ['', 'р', '', '', '']
    }

    let rulesHistory: Rule[] = [];
    
    let currentColorInputIndex: number = 0;

    loadNouns(filename)
        .then((n: string[]) => {
            nouns = n;
            updateWord();
        })
        .catch((error: Error) => {
            console.error('Error loading nouns:', error);
        });

    function findLettersFromNotThere(rule: Rule): string[] {
        const foundLetters: Set<string> = new Set();

        for (let i = 0; i < rule.notThere.length; i++) {
            const splitted = rule.notThere.map(position => position.split(''))
            splitted.forEach(letters => letters.forEach(letter => foundLetters.add(letter)))
        }

        return Array.from(foundLetters);
    }

    console.log(rule.notThere)
    console.log('=>', findLettersFromNotThere(rule))

    function fillLetter(index: number, color: string): void {
        word[index].color = color;
        currentColorInputIndex++;

        while (currentColorInputIndex < 5 && word[currentColorInputIndex].color === 'yellow') {
            currentColorInputIndex++;
        }

        if (currentColorInputIndex >= 5) {
            currentColorInputIndex = 0;

            while (currentColorInputIndex < 5 && word[currentColorInputIndex].color === 'yellow') {
                currentColorInputIndex++;
            }

            updateState();
        }

        const greyLetters: string[] = word.filter(letter => letter.color === 'grey').map(l => l.letter);

        const newRule = { ...rule };
        newRule.no.push(...greyLetters);

        for (let i = 0; i < 5; i++) {
            if (word[i].color === 'yellow') {
                newRule.exact[i] = word[i].letter;
            } else if (word[i].color === 'white') {
                newRule.notThere[i] += word[i].letter;
            }
        }

        rulesHistory.push(rule)
        rule = { ...newRule }
    }

    function updateState(): void {
        updateWord();
    }

    function updateWord(): void {
        const result = filterNouns(nouns, rule)
        rulesHistory.push(result.newRule)
        rule = result.newRule
        possible = result.possible

        console.log({possible})

        if (!possible.length) return;

        for (let i = 0; i < 5; i++) {
            word[i].letter = possible[0][i];
            word[i].color = word[i].color === 'yellow' ? 'yellow' : undefined;
        }
    }

    function loadNouns(filename: string): Promise<string[]> {
        return fetch(filename)
            .then(response => response.text())
            .then(data => data.split('\n').map(line => line.trim()));
    }

    function containsNoChars(noun: string, no: string[]): boolean {
        return no.some(char => noun.includes(char));
    }

    function doesNotMatchExact(noun: string, exact: string[]): boolean {
        for (let i = 0; i < 5; i++) {
            if (exact[i] !== '' && noun[i] !== exact[i]) {
                console.log('here', i, exact[i], noun[i], exact)
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

    function filterNouns(nouns: string[], rule: Rule): {possible: string[], newRule} {
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
</script>

<template>
    <div class=wrap>
        <div class=history>
            <div class=label>
                Хм-м-м. Что же это может быть...
            </div>
            <div class="word">
                {#each word as {letter, color}, index}
                    <div
                        class={`
                            letter
                            ${color === 'yellow' && color}
                        `}
                    >
                        {color === 'yellow' && letter || ''}
                    </div>
                {/each}
            </div>
        </div>
        <div class=hint>
            <div class=label>
                Попробуйте это слово и заполните цвета
            </div>
            <div class=word>
                {#each word as {letter, color}, index}
                    <div
                        class={`
                            letter
                            ${color}
                            ${currentColorInputIndex !== undefined && index !== currentColorInputIndex && 'disabled'}
                        `}
                    >
                        {letter}
                    </div>
                {/each}
            </div>
            <div class=color-input>
                <div class="letter grey" on:click={() => fillLetter(currentColorInputIndex, 'grey')} on:keydown={() => {}}>
                    {word[currentColorInputIndex].letter}
                </div>
                <div class="letter white" on:click={() => fillLetter(currentColorInputIndex, 'white')} on:keydown={() => {}}>
                    {word[currentColorInputIndex].letter}
                </div>
                <div class="letter yellow" on:click={() => fillLetter(currentColorInputIndex, 'yellow')} on:keydown={() => {}}>
                    {word[currentColorInputIndex].letter}
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 100vh;
        width: 100vw;
    }

    .history {
        margin-top: 5vw;
    }

    .hint {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100vw;
    }

    .label {
        text-transform: none;
        text-align: center;
        font-size: 13px;
        font-family: monospace;
    }

    .color-input {
        display: flex;
        gap: 1.5vw;
        margin: 0 auto 20vw auto;
    }

    .word {
        display: flex;
        justify-content: center;
        gap: 1.5vw;
        margin: 5vw auto;
    }

    .letter {
        width: 15vw;
        aspect-ratio: 1/1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 10vw;
        border: solid 1px #FFDD2D;
        border-radius: 2vw 2vw;
        color: white;

        &.disabled {
            pointer-events: none;
            opacity: 0.2;
        }

        &.grey {
            border: none;
            background-color: #5F5F5F;
            color: white;
        }

        &.white {
            border: none;
            background-color: white;
            color: black;
        }

        &.yellow {
            border: none;
            background-color: #FFDD2D;
            color: black;
        }
    }

    .next-button {
        background: black;
        border: solid 1px #FFDD2D;
        color: white;
    }
</style>