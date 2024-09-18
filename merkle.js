// merkle.js

// this generates the merkle root and proof

const fs = require('fs');
const csv = require('csv-parser');
const keccak256 = require('keccak256');
const { MerkleTree } = require('merkletreejs');

// reading CSV file and return data as array of objects

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

// Generate Merkle Tree and proofs
async function generateProofs(csvFilePath) {

    const data = await readCSV(csvFilePath);

  // Create leaf nodes by hashing each address and amount
  const leaves = data.map((row) => {

    const address = row.address; 
    const amount = row.amount;  
    return keccak256(Buffer.from(`${address}${amount}`));

  });

  // Create Merkle Tree
  const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const merkleRoot = merkleTree.getHexRoot();
  console.log('Merkle Root:', merkleRoot);

  // Generate proof for each participant
  data.forEach((row) => {
    const address = row.address;
    const amount = row.amount;
    const leaf = keccak256(Buffer.from(`${address}${amount}`));
    const proof = merkleTree.getHexProof(leaf);

    console.log(`Proof for ${address} (Amount: ${amount}):`);
    console.log(proof);
  });
}

const csvFilePath = 'whitelist.csv';
generateProofs(csvFilePath);
