use wasm_bindgen::prelude::*;
use rand::prelude::*;
use std::{char, u8, f64};

// TODO: ERROR CHECK THIS WHOLE DAMN THING.
// TODO: DOCUMENT THIS WHOLE DAMN THING.
#[wasm_bindgen]
pub struct GASimulation {
    target_colour: String,
    population_size: u16,
    mutation_rate: f32,
    _population: Vec<String>,
    _running: bool,
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
        }
    }

    // TODO: Look into converting this into a Future to be returned as a Promise to JS?
    pub fn simulate_generation(&mut self, update_fn: &js_sys::Function) {
        let this = JsValue::NULL;
        let top_organism = self.get_top_organism();
        let top_organism_value = JsValue::from(top_organism.0);
        let top_organism_score = JsValue::from(top_organism.1 as f32);
        update_fn.call2(&this, &top_organism_value, &top_organism_score).unwrap();
    }

    pub fn is_running(&self) -> bool {
        self._running
    }

    fn get_top_organism(&self) -> (String, f64) {
        let mut iterator = self._population
            .iter()
            .enumerate()
            .map(|(idx, organism)| (idx, evaluate_organism(&organism, &self.target_colour)));
        let init = iterator.next().unwrap();
        let top_index = iterator.try_fold(init, |acc, x| {
            let cmp = x.1.partial_cmp(&acc.1)?;
            let min = if let std::cmp::Ordering::Less = cmp {
                x
            } else {
                acc
            };
            Some(min)
        }).unwrap();
        let top_organism = self._population[top_index.0].clone();
        let top_organism_score = evaluate_organism(&top_organism, &self.target_colour);
        (top_organism, top_organism_score)
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

#[wasm_bindgen]
pub fn hello() -> String {
    "Hello from Rust 👋".to_string()
}
