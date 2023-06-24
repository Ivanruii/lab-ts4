import './style.css';

let cardsInPiles: number = 40;
let roundScore: number = 0;
let totalGameScore: number = 0;

interface Card {
    name: string;
    value: number;
    url: string
}

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

function initializeElements() {
    const elements = {
        onlyOnGameContainer: getElementOrThrow('only-on-game'),
        onlyWhenGameEnded: getElementOrThrow('only-when-game-ended'),
        score: getElementOrThrow('score'),
        remainingCards: getElementOrThrow('remaining-cards'),
        card: getElementOrThrow('card'),
        pickCardButton: getElementOrThrow('pick-card-button'),
        stayButton: getElementOrThrow('stay-button'),
        message: getElementOrThrow('message'),
        newGameButton: getElementOrThrow('new-game-button'),
    };

    return elements;
}

function getElementOrThrow(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element with id "${id}" not found.`);
    }
    return element;
}

function setMessageText(elementId: string, text: string | number, resetTime?: number): void {
    const element = getElementOrThrow(elementId);

    if (element) {
        element.innerText = String(text);
    }

    if (resetTime) {
        setTimeout(() => {
            element.innerText = '';
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

function giveRandomCard(cardsInPiles: number): Card | undefined {
    if (cardsInPiles <= 0) {
        return undefined;
    }

    const randomIndex = Math.floor(Math.random() * cardsInPiles);
    const pickedCard = cardsOfDeck[randomIndex];

    cardsInPiles -= 1;
    return pickedCard;
}

function stayButton() {
    const pickedCard = giveRandomCard(cardsInPiles);
    roundScore = 0;

    if (pickedCard) {
        setMessageText("message", `Has decidido plantarte. Si hubieras cogido una carta, te hubiera tocado: ${pickedCard.value}`);
    }
}

function gameOver() {
    const elements = initializeElements();
    elements.onlyOnGameContainer.style.display = "none",
        elements.onlyWhenGameEnded.style.display = "block",
        cardsInPiles = 40;
    roundScore = 0;
    setMessageText("message", `Has perdido la partida.`);
}

function pickCardButton() {
    const pickedCard = giveRandomCard(cardsInPiles);
    if (pickedCard) {
        cardsInPiles -= 1;
        roundScore += pickedCard.value;
        totalGameScore += pickedCard.value;
        if (roundScore > 7.5) {
            gameOver();
            changeImage("card-img", pickedCard.url)
            setMessageText("card", roundScore);
        } else {
            gameWinned();
            changeImage("card-img", pickedCard.url)
            setMessageText("card", roundScore);
        }
    }
    updateElements()
}

function newGameButton() {
    const elements = initializeElements();
    elements.onlyOnGameContainer.style.display = "block",
        elements.onlyWhenGameEnded.style.display = "none"
    setMessageText("message", `Has empezado una nueva partida.`);
}

function gameWinned() {
    const elements = initializeElements();
    if (roundScore === 7.5) {
        setMessageText("message", `Has ganado la partida.`);
        elements.onlyWhenGameEnded.style.display = "block"
    } else if (cardsInPiles === 0) {
        setMessageText("message", `Te has quedado sin cartas, has ganado la partida con una puntuación de ${totalGameScore}.`);
        elements.onlyWhenGameEnded.style.display = "block"
    }
}

function updateElements() {
    const elements = initializeElements();

    elements.remainingCards.innerHTML = `Cartas restantes: ${String(cardsInPiles)}`;
}

function startGame() {
    const elements = initializeElements();

    elements.pickCardButton.onclick = pickCardButton;

    elements.stayButton.onclick = stayButton;

    elements.newGameButton.onclick = newGameButton;
}

startGame();