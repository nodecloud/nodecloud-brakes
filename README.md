# cloud-client

## Usage

### ResourceClient
``` javascript
import BrakeClient from 'brake-client';

import * as resourceInterface from './ResourceInterface';

const SERVICE_NAME = 'a-service';
const brake = new BrakeClient(SERVICE_NAME);

//set health check.
brake.setHealthCheck(resourceInterface.checkHealth);

//register http request api.
export default brake.registerApi(resourceInterface);
```

### ResourceInterface

``` javascript
import rp from 'request-promise';

/**
 * Check the service's health status.
 */
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
    return rp({
        method: 'get',
        url: `/${SERVICE_NAME}/v1/resources/:id`,
        params: {id: id},
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
```

You can use brake client to invoke resource interface's function. example is

``` javascript
import resourceClient from './ResourceClient';

resourceClient.getResource(id);
```

## API

### new CloudClient(serviceName, options)

##### serviceName

The service name.

##### options

* logger: Default is console. you can use any other logger that implements logger.log function.
* Other options param is the same as [brakes](https://github.com/node-cloud/brakes)

### brake.setHealthCheck(callback)

Set a callback, when the circuit is open, the callback will be used for checking the service's health status, if the status is ok, the circuit will close.

### brake.registerApi(interface)

##### interface

The key-value object for sending request.
