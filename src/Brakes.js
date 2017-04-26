import Brakes from 'brakes';


/**
 * Get a brakes.
 *
 * @param name
 * @param options
 * @return {*|Brakes}
 */
export function getBrakes(name, options = {}) {
    return new Brakes({
        name: name,
        statInterval: options.statInterval || 2500,
        threshold: options.threshold || 0.5,
        circuitDuration: options.circuitDuration || 15000,
        timeout: options.timeout || 10000
    });
}