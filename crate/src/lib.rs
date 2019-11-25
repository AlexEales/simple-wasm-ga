#[macro_use]
extern crate cfg_if;

use wasm_bindgen::prelude::*;

use rand::prelude::*;

use std::{char, u8};

cfg_if! {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function to get better error messages if we ever panic.
    if #[cfg(feature = "console_error_panic_hook")] {
        extern crate console_error_panic_hook;
        use console_error_panic_hook::set_once as set_panic_hook;
    } else {
        #[inline]
        fn set_panic_hook() {}
    }
}

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
    pub fn simulate_generation(&mut self) {}

    pub fn is_running(&self) -> bool {
        self._running
    }

    pub fn get_top_organism(&self) -> String {
        "".to_string()
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

#[wasm_bindgen]
pub fn hex_to_rgb(hex_code: String) -> Vec<u8> {
    vec![
        u8::from_str_radix(&hex_code[0..2], 16).unwrap(), // R
        u8::from_str_radix(&hex_code[2..4], 16).unwrap(), // G
        u8::from_str_radix(&hex_code[4..6], 16).unwrap(), // B
    ]
}

#[wasm_bindgen]
pub fn hello() -> String {
    "Hello from Rust 👋".to_string()
}
