import { ethers } from "hardhat";

/**
 * Deploys the Amana lending demo to Base Sepolia:
 *   - mWETH  (18 decimals) collateral asset, priced at $3000
 *   - mUSDC  (6 decimals)  borrow asset, priced at $1
 *   - AmanaLendingPool with both assets listed
 *   - Seeds the pool with mUSDC liquidity so borrowing works
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const WAD = 10n ** 18n;

  // --- Tokens ---
  const Mock = await ethers.getContractFactory("MockToken");

  const mWETH = await Mock.deploy("Amana Mock WETH", "mWETH", 18, ethers.parseUnits("1", 18));
  await mWETH.waitForDeployment();
  const wethAddr = await mWETH.getAddress();
  console.log("mWETH:", wethAddr);

  const mUSDC = await Mock.deploy("Amana Mock USDC", "mUSDC", 6, ethers.parseUnits("5000", 6));
  await mUSDC.waitForDeployment();
  const usdcAddr = await mUSDC.getAddress();
  console.log("mUSDC:", usdcAddr);

  // --- Pool ---
  const Pool = await ethers.getContractFactory("AmanaLendingPool");
  const pool = await Pool.deploy();
  await pool.waitForDeployment();
  const poolAddr = await pool.getAddress();
  console.log("AmanaLendingPool:", poolAddr);

  // List mWETH: price $3000, LTV 75%, liq threshold 80%
  await (await pool.listAsset(wethAddr, 18, 3000n * WAD, 7500, 8000)).wait();
  // List mUSDC: price $1, LTV 85%, liq threshold 90%
  await (await pool.listAsset(usdcAddr, 6, 1n * WAD, 8500, 9000)).wait();
  console.log("Assets listed.");

  // Seed pool with mUSDC liquidity for borrowing
  await (await mUSDC.mint(deployer.address, ethers.parseUnits("100000", 6))).wait();
  await (await mUSDC.transfer(poolAddr, ethers.parseUnits("50000", 6))).wait();
  console.log("Seeded 50,000 mUSDC liquidity.");

  console.log("\n=== ENV VALUES ===");
  console.log(`NEXT_PUBLIC_LENDING_POOL_ADDRESS=${poolAddr}`);
  console.log(`NEXT_PUBLIC_MWETH_ADDRESS=${wethAddr}`);
  console.log(`NEXT_PUBLIC_MUSDC_ADDRESS=${usdcAddr}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
