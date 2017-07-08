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
        ...options
    });
}