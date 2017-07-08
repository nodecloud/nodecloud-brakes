# cloud-client

## Usage

### ResourceClient
``` javascript
import BrakeClient from 'brake-client';
import rp from 'request-promise';

const SERVICE_NAME = 'a-service';
const brake = new BrakeClient(SERVICE_NAME);

//set health check.
brake.healthCheck(resourceInterface.checkHealth);

brake.on('circuitOpen', () => {
    logger.warn(`The service: ${SERVICE_NAME}'s circuit is opened.`);
});

brake.on('circuitClosed', () => {
    logger.info(`The service: ${SERVICE_NAME}'s circuit is closed.`);
});

brake.fallback(err => {
    throw new Error('Cannot invoke downstream service. please try again soon.', err);
});

export function checkHealth() {
    return rp({
        method: 'get',
        url: `/${SERVICE_NAME}/health`,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export function getResource(id) {
    const request = {
        method: 'get',
        url: `/${SERVICE_NAME}/v1/resources/:id`,
        params: {id: id},
        headers: {
            'Content-Type': 'application/json'
        }
    };
    return brake.circuit({send: rp}).send(request);
}
```

You can use brake client to invoke resource api. The example is

``` javascript
import resourceClient from './ResourceClient';

resourceClient.getResource(id).then(resource => {
    console.log(resource);
})
```

## API

### new BrakeClient(serviceName, options)

##### serviceName

The service name.

##### options

The options param is the same as [brakes](https://github.com/node-cloud/brakes).
We extend it, and support request handlers
* options.handler.preHandle(request)
* options.handler.postHandle(err, response)
* options.handler.postCircuit(response);

### brake.healthCheck(callback)

Set a callback, when the circuit is open, the callback will be used for checking the service's health status, if the status is ok, the circuit will close.

### brake.on(eventName, callback)

See [brakes](https://github.com/node-cloud/brakes) for detail.

### brake.isOpen()

Return the circuit's status.

### brake.circuit(client, fallback, options) : {send(request)}

* client: {send() {}}
* fallback(err)
* options the same as [brakes](https://github.com/node-cloud/brakes).

### brake.fallback(callback)
