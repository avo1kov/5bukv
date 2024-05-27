export interface Rule {
    no: string[]
    exact: string[]
    notThere: string[]
}

export type Word = {
    letter: string
    color: string | undefined
}[]
