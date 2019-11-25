declare module "*.toml" {
    const value: typeof import('../crate/pkg/simple_wasm_ga');
    export default value;
}
