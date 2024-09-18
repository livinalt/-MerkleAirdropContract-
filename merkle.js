// merkle.js
const fs = require('fs');
const csv = require('csv-parser');
const keccak256 = require('keccak256');
const { MerkleTree } = require('merkletreejs');

// Function to read CSV and generate Merkle Root
async function generateMerkleRoot(csvFilePath) {
    const elements = [];

    // Read the CSV file
    return new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                const address = row['address'];
                const amount = row['amount'];
                // Hash the address and amount
                const hash = keccak256(`${address}${amount}`);
                elements.push(hash);
            })
            .on('end', () => {
                // Create the Merkle Tree
                const merkleTree = new MerkleTree(elements, keccak256, { sortPairs: true });
                const merkleRoot = merkleTree.getHexRoot();
                resolve({ merkleTree, merkleRoot });
            })
            .on('error', (error) => reject(error));
    });
}

// Call the function and output the Merkle root
generateMerkleRoot('whitelist.csv')
    .then(({ merkleRoot }) => {
        console.log('Merkle Root:', merkleRoot);
    })
    .catch((error) => {
        console.error('Error generating Merkle Root:', error);
    });
