import './style.css';

// Constants

const scoreToWin: number = 7.5;
const minOfCards: number = 0;

// Global variables

let cardsInPiles: number = 40;
let roundScore: number = 0;
let totalGameScore: number = 0;

// Interfaces

interface Card {
    name: string;
    value: number;
    url: string;
}

interface ElementWithInnerText {
    innerText: string;
}

// DOM elements

const elements = {
    onlyOnGameContainer: getElementOrThrow<HTMLDivElement>('only-on-game'),
    onlyWhenGameEnded: getElementOrThrow<HTMLDivElement>('only-when-game-ended'),
    score: getElementOrThrow<HTMLSpanElement>('score'),
    remainingCards: getElementOrThrow<HTMLSpanElement>('remaining-cards'),
    card: getElementOrThrow<HTMLDivElement>('card'),
    pickCardButton: getElementOrThrow<HTMLButtonElement>('pick-card-button'),
    stayButton: getElementOrThrow<HTMLButtonElement>('stay-button'),
    message: getElementOrThrow<HTMLDivElement>('message'),
    newGameButton: getElementOrThrow<HTMLButtonElement>('new-game-button'),
};

// Game elements

const cardsOfDeck: Card[] = [
    { name: "1 Copas", value: 1, url: "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/cartas/copas/1_as-copas.jpg" },
    { name: "2 Copas", value: 2, url: "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/cartas/copas/2_dos-copas.jpg" },
    { name: "3 Copas", value: 3, url: "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/cartas/copas/3_tres-copas.jpg" },
    { name: "4 Copas", value: 4, url: "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/cartas/copas/4_cuatro-copas.jpg" },
    { name: "5 Copas", value: 5, url: "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/cartas/copas/5_cinco-copas.jpg" },
    { name: "6 Copas", value: 6, url: "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/cartas/copas/6_seis-copas.jpg" },
    { name: "7 Copas", value: 7, url: "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/cartas/copas/7_siete-copas.jpg" },
    { name: "Sota de copas", value: 0.5, url: "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/cartas/copas/10_sota-copas.jpg" },
    { name: "Caballo de copas", value: 0.5, url: "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/cartas/copas/11_caballo-copas.jpg" },
    { name: "Rey de copas", value: 0.5, url: "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/cartas/copas/12_rey-copas.jpg" }
];

// Initialization

window.addEventListener("DOMContentLoaded", () => {
    startGame();
});

function initializeElements() {
    return {
        ...elements
    };
}

// Utility functions

function getElementOrThrow<Type>(id: string): Type {
    const element = document.getElementById(id) as Type;
    if (!element) {
        throw new Error(`Element with id "${id}" not found.`);
    }
    return element;
}

function setMessageText<Type extends ElementWithInnerText>(elementId: string, text: string, resetTime?: number): void {
    const element = getElementOrThrow(elementId);

    if (element) {
        (element as Type).innerText = String(text);
    }

    if (resetTime) {
        setTimeout(() => {
            (element as Type).innerText = '';
        }, resetTime);
    }
}

function changeImage(imgId: string, newSrc: string): void {
    const imgElement = document.getElementById(imgId) as HTMLImageElement;
    if (imgElement) {
        imgElement.src = newSrc;
    } else {
        throw new Error(`Image element with id "${imgId}" not found.`);
    }
}

// Update functions

function updateGame(pickedCard: Card) {
    cardsInPiles -= 1;
    roundScore += pickedCard.value;
    totalGameScore += pickedCard.value;
    if (roundScore > scoreToWin) {
        gameOver();
    } else {
        gameWinned();
    }
}

function updateUI(pickedCard: Card) {
    changeImage("card-img", pickedCard.url);
    setMessageText<HTMLDivElement>("card", String(roundScore));
}

function updateElements() {
    setMessageText<HTMLDivElement>("remaining-cards", `Cartas restantes: ${String(cardsInPiles)}`);
}

// Game functions

function startGame() {
    const elements = initializeElements();

    elements.pickCardButton.onclick = pickCardButton;

    elements.stayButton.onclick = stayButton;

    elements.newGameButton.onclick = newGameButton;
}

function gameWinned() {
    const elements = initializeElements();
    if (roundScore === scoreToWin) {
        setMessageText<HTMLDivElement>("message", `Has ganado la partida.`);
        elements.onlyWhenGameEnded.style.display = "block"
    } else if (cardsInPiles === minOfCards) {
        setMessageText<HTMLDivElement>("message", `Te has quedado sin cartas, has ganado la partida con una puntuación de ${totalGameScore}.`);
        elements.onlyWhenGameEnded.style.display = "block"
    }
}

function gameOver() {
    setMessageText<HTMLDivElement>("message", `Has perdido la partida.`);
    resetGame()
}

function resetGame() {
    const elements = initializeElements();
    changeImage("card-img", "https://raw.githubusercontent.com/Lemoncode/fotos-ejemplos/main/cartas/back.jpg");
    elements.onlyOnGameContainer.style.display = "none",
    elements.onlyWhenGameEnded.style.display = "block",
    cardsInPiles = 40;
    roundScore = 0;
}

function giveRandomCard(cardsInPiles: number): Card | undefined {
    if (cardsInPiles <= minOfCards) {
        return undefined;
    }

    const randomIndex = Math.floor(Math.random() * cardsInPiles);
    const pickedCard = cardsOfDeck[randomIndex];

    cardsInPiles -= 1;
    return pickedCard;
}

// Game actions

async function pickCardButton() {
    const pickedCard = giveRandomCard(cardsInPiles);
    if (pickedCard) {
        updateGame(pickedCard);
        updateUI(pickedCard);
        updateElements();
    }
}

function stayButton() {
    const pickedCard = giveRandomCard(cardsInPiles);
    roundScore = 0;

    if (pickedCard) {
        setMessageText<HTMLDivElement>("message", `Has decidido plantarte. Si hubieras cogido una carta, te hubiera tocado: ${pickedCard.value}`);
    }
}

function newGameButton() {
    const elements = initializeElements();
    elements.onlyOnGameContainer.style.display = "block",
        elements.onlyWhenGameEnded.style.display = "none"
    setMessageText<HTMLDivElement>("message", `Has empezado una nueva partida.`);
}