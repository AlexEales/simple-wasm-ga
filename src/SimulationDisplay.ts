import module from '../crate/Cargo.toml';

const GENERATION_CARD_SELECTOR = '[generation-display-card]';
const DEFAULT_GENERATION_CARD = `
<div class="inline-flex items-center w-full my-2 p-4 bg-white rounded-lg overflow-hidden border border-gray-300"
        generation-display-card>
    <div>
        <h3 class="font-bold">No results</h3>
        <p class="normal-case text-gray-500">Input your parameters and press start to begin!</p>
    </div>
</div>
`;

const createGenerationCard = (generation, colour) => {
    return `
    <div class="inline-flex items-center w-full my-2 p-4 bg-white rounded-lg overflow-hidden border border-gray-300"
            generation-display-card>
        <div class="w-12 h-12 rounded mr-4" style="background-color: #${colour}"></div>
        <div>
            <h3 class="font-bold capitalize">generation ${generation}</h3>
            <p class="uppercase text-gray-500">${colour}</p>
        </div>
    </div>
    `;
};

export default class SimulationDisplay {
    _root: Element;
    _target: String;
    _simLoop: NodeJS.Timeout;
    _simulation: module.GASimulation;

    constructor(elem: Element) {
        // Bind to element
        this._root = elem;
        // Bind methods to instance
        this.updateDisplay = this.updateDisplay.bind(this);
        this.clearDisplay = this.clearDisplay.bind(this);
        this.resetDisplay = this.resetDisplay.bind(this);
        this.startSimulation = this.startSimulation.bind(this);
        this.stopSimulation = this.stopSimulation.bind(this);
        // Add event listeners
        this._root.addEventListener('startSimulation', this.startSimulation);
        this._root.addEventListener('stopSimulation', this.stopSimulation);
        this._root.addEventListener('resetSimulation', this.resetDisplay);
    }

    updateDisplay(generation: number, topValue: string, topScore: number) {
        // If the value is the same as the target then stop the simulation
        // TODO: Some way of communicating this
        if (topValue.toUpperCase() === this._target.toUpperCase()) {
            clearInterval(this._simLoop);
        }
        // Add a new generation card.
        this._root.insertAdjacentHTML('beforeend', createGenerationCard(generation, topValue));
        // Scroll to bottom
        this._root.scrollTop = this._root.scrollHeight;
    }

    clearDisplay() {
        this._root.querySelectorAll('[generation-display-card]').forEach(
            elem => elem.parentNode.removeChild(elem)
        );
    }

    resetDisplay(e?: CustomEvent) {
        // If this was called from a event perform some checks
        if (e) {
            // Check that there is the required info in the event.
            if (!e.detail) {
                return;
            }
            // Check that the event was meant for us
            if (e.detail !== this._root.id) {
                return;
            }
        }
        // Clear the display and add the default card.
        this.clearDisplay();
        this._root.insertAdjacentHTML('beforeend', DEFAULT_GENERATION_CARD);
    }

    startSimulation(e: CustomEvent) {
        // Check that there is the required info in the event.
        if (!e.detail) {
            return;
        }
        // Get the parameters for the simulation
        let targetColour = e.detail['targetColour'];
        let populationSize = e.detail['populationSize'];
        let mutationRate = e.detail['mutationRate'];
        // Set the target colour
        this._target = targetColour;
        // Clear the display
        this.clearDisplay();
        // Initialise the simulation object
        this._simulation = new module.GASimulation(targetColour, populationSize, mutationRate);
        // Start the simulation loop
        this._simLoop = setInterval(() => {
            this._simulation.simulate_generation(this.updateDisplay);
        }, 500);
    }

    stopSimulation(e: CustomEvent) {
        // Check that there is the required info in the event.
        if (!e.detail) {
            return;
        }
        // Check that the event was meant for us
        if (e.detail !== this._root.id) {
            return;
        }
        // Switch off simulation loop
        clearInterval(this._simLoop);
    }
}
