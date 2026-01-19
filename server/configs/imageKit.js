import ImageKit from '@imagekit/nodejs';
import config from './config.js';

const client = new ImageKit({
    privateKey: config.imageKitPrivateKey, // This is the default and can be omitted
});

export default client 