import module from '../crate/Cargo.toml';

// CONSTANTS
const TARGET_COLOUR_DEFAULT = '#81E6D9';
const TARGET_COLOUR_INPUT: HTMLInputElement = document.querySelector('#target-colour-input');
const TARGET_COLOUR_DISPLAY: HTMLElement = document.querySelector('#target-colour-display');

const POPULATION_SIZE_DEFAULT = '100';
const POPULATION_SIZE_INPUT: HTMLInputElement = document.querySelector('#population-size-input');

const MUTATION_RATE_DEFAULT = '0.2';
const MUTATION_RATE_INPUT: HTMLInputElement = document.querySelector('#mutation-rate-input');

const RUN_BUTTON = document.querySelector('#run-button');
const STOP_BUTTON = document.querySelector('#stop-button');
const RESET_BUTTON = document.querySelector('#reset-button');

const GENERATION_DISPLAY = document.querySelector('#generation-history-display');
const DEFAULT_GENERATION_CARD = `
<div class="inline-flex items-center w-full my-2 p-4 bg-white rounded-lg overflow-hidden border border-gray-300"
        generation-display-card>
    <div>
        <h3 class="font-bold">No results</h3>
        <p class="normal-case text-gray-500">Input your parameters and press start to begin!</p>
    </div>
</div>
`;

// FUNCTIONS
const createGenerationCard = (generation, colour) => {
    return `
    <div class="inline-flex items-center w-full my-2 p-4 bg-white rounded-lg overflow-hidden border border-gray-300"
            generation-display-card>
        <div class="w-12 h-12 rounded mr-4" style="background-color: ${colour}"></div>
        <div>
            <h3 class="font-bold capitalize">generation ${generation}</h3>
            <p class="uppercase text-gray-500">${colour}</p>
        </div>
    </div>
    `;
};

const updateColourDisplay = () => {
    // Update the colour display when input changes.
    let colour = TARGET_COLOUR_INPUT.value;
    if (!colour.startsWith('#')) {
        colour = '#' + colour;
    }
    TARGET_COLOUR_DISPLAY.style.backgroundColor = colour;
};

const clearGenerationDisplay = () => {
    document.querySelectorAll('[generation-display-card]').forEach(
        elem => elem.parentNode.removeChild(elem)
    );
    GENERATION_DISPLAY.insertAdjacentHTML('beforeend', DEFAULT_GENERATION_CARD);
};

// EVENT LISTENERS
TARGET_COLOUR_INPUT.addEventListener('change', updateColourDisplay);

RUN_BUTTON.addEventListener('click', () => {
    // TODO: Add form validation
    // TODO: Make this a Event that extends custom event for completion
    const startSimEvent = new CustomEvent('startSim', { detail: {
        "id": GENERATION_DISPLAY.id,
        "targetColour": TARGET_COLOUR_INPUT.value,
        "popSize": POPULATION_SIZE_INPUT.value,
        "mutRate": MUTATION_RATE_INPUT.value
     }});
     GENERATION_DISPLAY.dispatchEvent(startSimEvent);
});

STOP_BUTTON.addEventListener('click', () => {
    const stopSimEvent = new CustomEvent('stopSim', { detail: GENERATION_DISPLAY.id });
    GENERATION_DISPLAY.dispatchEvent(stopSimEvent);
});

RESET_BUTTON.addEventListener('click',  () => {
    // TODO: Add reset event for the generation history
    console.log('Resetting simulation params...');
    // Reset the form element values back to default.
    TARGET_COLOUR_INPUT.value = TARGET_COLOUR_DEFAULT;
    updateColourDisplay();
    POPULATION_SIZE_INPUT.value = POPULATION_SIZE_DEFAULT;
    MUTATION_RATE_INPUT.value = MUTATION_RATE_DEFAULT;
    clearGenerationDisplay();
});

console.log(module.hello());

let GASim = new module.GASimulation(
    TARGET_COLOUR_INPUT.value.substring(1),
    POPULATION_SIZE_INPUT.value,
    MUTATION_RATE_INPUT.value
);
console.log(GASim.get_population());
GASim.simulate_generation((value, score) => console.log(`${value} scored ${score}`));
console.log(GASim.get_population());
GASim.simulate_generation((value, score) => console.log(`${value} scored ${score}`));
