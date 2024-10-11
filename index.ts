import init, { generate, prove, verify } from "./zk-wasm/bridge/zk_wasm.js";


const generateSeed = () => {
    let seed = new Uint32Array(8);
    self.crypto.getRandomValues(seed);
    return seed;
}

const generatePrivateKey = (seed: Uint32Array) => {
    const privateKey = generate(seed).params
    return privateKey;
}

const generateProof = (privateKey: string, secret: string) => {
    const proof = prove(generateSeed(), privateKey, stringToHex(secret));
    return proof;
};

const verifyProofOrgin = (proof: { proof: string, h: string }, privateKey: string) => {
    const isValid = verify(privateKey, proof.proof, proof.h);
    return isValid;
}

const stringToHex = (str: string) => {
    return Array.from(str)
        .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');
};



await init();
const seed = generateSeed();
const privateKey = generatePrivateKey(seed);
const proof = generateProof(privateKey, "hello");
const proof2 = generateProof(generatePrivateKey(generateSeed()), "should return false");


console.log(`Seed: ${seed}`);
//console.log(`Private Key: ${privateKey}`);
console.log(proof, proof2);
console.log(verifyProofOrgin(proof, privateKey));
console.log(verifyProofOrgin(proof2, privateKey));


