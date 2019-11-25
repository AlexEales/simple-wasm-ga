import module from '../crate/Cargo.toml';
import SimulationDisplay from './SimulationDisplay';

// TODO: Add in error checking and a error display (for form validation etc.)

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

// FUNCTIONS
const updateColourDisplay = () => {
    // Update the colour display when input changes.
    let colour = TARGET_COLOUR_INPUT.value;
    if (!colour.startsWith('#')) {
        colour = '#' + colour;
    }
    TARGET_COLOUR_DISPLAY.style.backgroundColor = colour;
};

// EVENT LISTENERS
TARGET_COLOUR_INPUT.addEventListener('change', updateColourDisplay);

RUN_BUTTON.addEventListener('click', () => {
    // TODO: Add form validation
    // TODO: Make this a Event that extends custom event for completion
    const startSimEvent = new CustomEvent('startSimulation', { detail: {
        "id": GENERATION_DISPLAY.id,
        "targetColour": TARGET_COLOUR_INPUT.value,
        "populationSize": POPULATION_SIZE_INPUT.value,
        "mutationRate": MUTATION_RATE_INPUT.value
     }});
     GENERATION_DISPLAY.dispatchEvent(startSimEvent);
});

STOP_BUTTON.addEventListener('click', () => {
    const stopSimEvent = new CustomEvent('stopSimulation', { detail: GENERATION_DISPLAY.id });
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
    // Dispatc custom event to reset generation display
    const resetSimEvent = new CustomEvent('resetSimulation', { detail: GENERATION_DISPLAY.id });
    GENERATION_DISPLAY.dispatchEvent(resetSimEvent);
});

// Attach components
new SimulationDisplay(GENERATION_DISPLAY);
