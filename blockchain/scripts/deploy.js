const hre = require("hardhat");

async function main() {
    const MusicNFT = await hre.ethers.getContractFactory("MusicNFT");
    const musicNFT = await MusicNFT.deploy();

    await musicNFT.waitForDeployment(); // 🔥 Fix for Ethers v6

    console.log("MusicNFT deployed to:", await musicNFT.getAddress()); // 🔥 Fix for getting contract address
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
