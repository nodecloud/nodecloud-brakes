import Brakes from 'brakes';

import Logger from './Logger';

/**
 * Get a brakes.
 *
 * @param name
 * @param options
 * @return {*|Brakes}
 */
export function getBrakes(name, options = {}) {
    const logger = new Logger(options.logger);

    let brake = new Brakes({
        name: name,
        statInterval: options.statInterval || 2500,
        threshold: options.threshold || 0.5,
        circuitDuration: options.circuitDuration || 15000,
        timeout: options.timeout || 10000
    });

    brake.on('circuitOpen', () => {
        logger.warn(`The service: ${name}'s circuit is opened.`);
    });

    brake.on('circuitClosed', () => {
        logger.info(`The service: ${name}'s circuit is closed.`);
    });

    return brake;
}