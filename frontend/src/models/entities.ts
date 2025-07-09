
export type Vacancy = {
    PK: string;
    SK: string;
    title: string;
    skills: string[];
    progress: number;
    score: number;
}

export type Question = {
    PK: string;
    SK: string;
    question: string;
    answer?: string;
}