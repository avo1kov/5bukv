<script lang="ts">
    import { loadNouns, filterNouns } from "./utils"
    import type { Rule, Word } from "./types"

    let possible: string[] = []
    let randomShift = 0
    let nouns: string[] = []
    const filename: string = 'https://volkov.media/5bukv/sorted_nouns.txt'

    let word: Word = [
        { letter: '', color: undefined },
        { letter: '', color: undefined },
        { letter: '', color: undefined },
        { letter: '', color: undefined },
        { letter: '', color: undefined }
    ];

    let rule: Rule = {
        no: [],
        exact: ['', '', '', '', ''],
        notThere: ['', '', '', '', '']
    }

    const maxLettersNumbers: {[l: string]: number} = {}

    let rulesHistory: Rule[] = [];
    
    let currentColorInputIndex: number = 0;

    loadNouns(filename).then((n: string[]) => {
        nouns = n;
        updateWord();
    })

    // function findLettersFromNotThere(rule: Rule): string[] {
    //     const foundLetters: Set<string> = new Set();

    //     for (let i = 0; i < rule.notThere.length; i++) {
    //         const splitted = rule.notThere.map(position => position.split(''))
    //         splitted.forEach(letters => letters.forEach(letter => foundLetters.add(letter)))
    //     }

    //     return Array.from(foundLetters);
    // }

    // console.log(rule.notThere)
    // console.log('=>', findLettersFromNotThere(rule))

    function fillLetter(index: number, color: string): void {
        word[index].color = color;

        const newRule = { ...rule };

        if (word[currentColorInputIndex].color === 'yellow') {
            newRule.exact[currentColorInputIndex] = word[currentColorInputIndex].letter;
        } else if (word[currentColorInputIndex].color === 'white') {
            newRule.notThere[currentColorInputIndex] += word[currentColorInputIndex].letter;
        } else if (word[currentColorInputIndex].color === 'grey') {
            newRule.no.push(word[currentColorInputIndex].letter);
        }

        rulesHistory.push(rule)
        rule = { ...newRule }

        currentColorInputIndex = getNextColorInputIndex(word, currentColorInputIndex);

        if (currentColorInputIndex >= 5) {
            randomShift = 0
            updateWord()
        }
    }

    function getNextColorInputIndex(word: Word, currentIndex: number) {
        currentIndex++;

        while (currentIndex < 5 && word[currentIndex].color === 'yellow') {
            currentIndex++;
        }

        return currentIndex;
    }

    function updateWord(): void {
        currentColorInputIndex = getNextColorInputIndex(word, -1);
        const result = filterNouns(nouns, rule)
        rulesHistory.push(result.newRule)
        rule = result.newRule
        possible = result.possible
        
        console.log(rule)
        
        const lettersNumbers: {[letter: string]: number} = {}
        for (let i = 0; i < 5; i++) {
            if (word[i].color === 'white') {
                if (lettersNumbers[word[i].letter] !== undefined) {
                    lettersNumbers[word[i].letter] += 1;
                } else {
                    lettersNumbers[word[i].letter] = 1;
                }
                
                if (lettersNumbers[word[i].letter] > (maxLettersNumbers[word[i].letter] || 0)) {
                    maxLettersNumbers[word[i].letter] = lettersNumbers[word[i].letter];
                }
            }
        }

        console.log('=>', maxLettersNumbers)

        if (!possible.length) return;

        for (let i = 0; i < 5; i++) {
            word[i].letter = possible[randomShift][i];
            word[i].color = word[i].color === 'yellow' ? 'yellow' : undefined;
        }
    }

    const enterWord = () => {
        const newWord = prompt()

        for (let i = 0; i < 5; i++) {
            word[i].letter = newWord[i];
            word[i].color = word[i].color === 'yellow' ? 'yellow' : undefined;
        }
    }

    const setNextWord = () => {
        randomShift++
        updateWord()
    }
    
</script>

<template>
    <div class=wrap>
        <div class=history>
            <div class=label>
                Хм-м-м. Что же это за слово...
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
            <button on:click={enterWord}>Своё слово</button>
            <button on:click={setNextWord}>Другое</button>
        </div>
        <div class=hint>
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
            <div class=label>
                Попробуйте это слово и заполните цвета
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
        margin: 4vw auto 20vw auto;
    }

    .word {
        display: flex;
        justify-content: center;
        gap: 1.5vw;
        margin: 4vw auto;
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