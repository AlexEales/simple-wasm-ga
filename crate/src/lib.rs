use wasm_bindgen::prelude::*;
use rand::prelude::*;
use std::{char, u8, f64};

// TODO: CLEAN UP THIS WHOLE DAMN THING
// TODO: ERROR CHECK THIS WHOLE DAMN THING.
// TODO: DOCUMENT THIS WHOLE DAMN THING.
#[wasm_bindgen]
pub struct GASimulation {
    target_colour: String,
    population_size: u16,
    mutation_rate: f32,
    _population: Vec<String>,
    _running: bool,
    _generation_number: u16,
}

#[wasm_bindgen]
impl GASimulation {
    #[wasm_bindgen(constructor)]
    pub fn new(target_colour: String, population_size: u16, mutation_rate: f32) -> GASimulation {
        // Initialise population to random set of hex codes.
        let population: Vec<String> = (0..population_size as usize).map(|_| {
            random_hexcode()
        }).collect();
        // Return GASimulation instance.
        Self {
            target_colour,
            population_size,
            mutation_rate,
            _population: population,
            _running: false,
            _generation_number: 0
        }
    }

    pub fn simulate_generation(&mut self, update_fn: &js_sys::Function) {
        // Order population by fitness
        let mut ordered_pop = self._population.clone();
        ordered_pop.sort_by(|a, b| {
            let a_score = evaluate_organism(&a, &self.target_colour);
            let b_score = evaluate_organism(&b, &self.target_colour);
            a_score.partial_cmp(&b_score).unwrap()
        });
        // Call callback, passing top scoring organism value and score.
        let this = JsValue::NULL;
        let gen_number = JsValue::from(self._generation_number);
        let top_organism_value = JsValue::from(&ordered_pop[0]);
        let top_organism_score = JsValue::from(evaluate_organism(&ordered_pop[0], &self.target_colour) as f32);
        update_fn.call3(&this, &gen_number, &top_organism_value, &top_organism_score).unwrap();
        // Cull bottom 50%
        ordered_pop = ordered_pop[0..self.population_size as usize / 2].to_vec();
        // Crossover and mutate remaining
        // TODO: In practive this can result in not converging on small differences so worth throwing some random ones in (crossover 30% maybe?)
        let mut new_pop: Vec<String> = Vec::new();
        for organism in ordered_pop.clone() {
            let mate_idx = rand::thread_rng().gen_range(0, ordered_pop.len());
            let mut new_organism = crossover(&organism, &ordered_pop[mate_idx]);
            if rand::thread_rng().gen::<f32>() <= self.mutation_rate {
                new_organism = mutate(new_organism);
            }
            new_pop.push(new_organism);
        }
        // Set population to be old, culled population plus new organisms
        ordered_pop.append(&mut new_pop);
        self._population = ordered_pop;
        // Increment the generation counter.
        self._generation_number += 1;
    }

    pub fn get_population(&self) -> Vec<JsValue> {
        // Exporting a vector of strings is unsupported by wasm-bindgen?
        self._population.iter().map(JsValue::from).collect()
    }
}

fn random_hexcode() -> String {
    let mut random = rand::thread_rng();
    (0..6).map(|_| {
        char::from_digit(random.gen_range(0, 15), 16).unwrap()
    }).collect()
}

pub fn hex_to_rgb(hex_code: &String) -> [u8; 3] {
    [
        u8::from_str_radix(&hex_code[0..2], 16).unwrap(), // R
        u8::from_str_radix(&hex_code[2..4], 16).unwrap(), // G
        u8::from_str_radix(&hex_code[4..6], 16).unwrap(), // B
    ]
}

fn evaluate_organism(organism: &String, target: &String) -> f64 {
    hex_to_rgb(&organism)
        .iter() // Convert array to iterator
        .zip(hex_to_rgb(&target).iter()) // Zip with target iterator
        .map(|(org_val, target_val)| f64::powf((target_val - org_val) as f64, 2.0)) // Square contents
        .sum::<f64>() // Sum resulting vec
        .sqrt() // Square root result
}

fn crossover(organism_1: &String, organism_2: &String) -> String {
    let split_idx = rand::thread_rng().gen_range(0, 6);
    format!("{}{}", &organism_1[..split_idx], &organism_2[split_idx..])
}

fn mutate(organism: String) -> String {
    let mutate_idx = rand::thread_rng().gen_range(0, 6);
    format!("{}{}{}",
        &organism[..mutate_idx],
        char::from_digit(rand::thread_rng().gen_range(0, 15), 16).unwrap(),
        &organism[(mutate_idx + 1)..]
    )
}

#[wasm_bindgen]
pub fn hello() -> String {
    "Hello from Rust 👋".to_string()
}
