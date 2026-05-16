# Amana Protocol — Smart Contracts

Solidity contracts for the Amana Protocol DEX with Chainlink Oracle integration.

## Contracts

| Contract | Description |
|---|---|
| `PriceFeedConsumer.sol` | Generic Chainlink price feed reader |
| `AmanaLendingOracle.sol` | Lending collateral valuation + health factor |
| `AmanaSwapPricing.sol` | Swap price validation with slippage protection |

## Chainlink Price Feed Addresses (Ethereum Mainnet)

| Pair | Address |
|---|---|
| ETH/USD | `0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419` |
| BTC/USD | `0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c` |
| USDC/USD | `0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6` |
| SOL/USD | `0x4ffC43a60e009B551865A93d232E33Fce9f01507` |
| BNB/USD | `0x14e613AC691a42F21B17e645ee1A1A02068d3F8b` |
| MATIC/USD | `0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676` |
| LINK/USD | `0x2c1d072e956AFFC0D435Cb7AC38EF18d24d9127c` |

## Sepolia Testnet Addresses

| Pair | Address |
|---|---|
| ETH/USD | `0x694AA1769357215DE4FAC081bf1f309aDC325306` |
| BTC/USD | `0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43` |
| LINK/USD | `0xc59E3633BAAC79493d908e63626716e204A45EdF` |

## Development

```bash
# Install dependencies
npm install @chainlink/contracts

# Using with Foundry
forge install smartcontractkit/chainlink --no-commit
forge build

# Using with Hardhat
npx hardhat compile
npx hardhat test
```

## Deployment

Deploy to Sepolia testnet first for testing:
```bash
forge script script/Deploy.s.sol --rpc-url sepolia --broadcast
```
