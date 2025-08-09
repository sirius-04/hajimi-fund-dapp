# 🏗 Hajimi Fund

- An Decentralized Scholarship Crowdfunding Platform that empowering students through transparent and blockchain-based fundraising.

⚙️ TechStack: Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

Key Feature:

🎯 Goal-Based Campaigns – Students set clear funding goals, deadlines, and project descriptions.

💰 Web3 Donations – Supporters contribute using Ethereum.

🌟 Donor Approver Role – Major contributors become “Approvers” with voting rights on fund usage.

🗳 DAO-Style Voting – Students submit spending requests with proof and approvers vote to approve or reject.

⚡ Automatic Fund Release – Approved requests instantly transfer funds to the student’s wallet via smart contracts.

🔒 Secure Donations – Funds remain locked until the funding goal is reached.

📚 Proof of Achievement – Students upload results and achievements to increase trust for future campaigns.

🛠 Program Creation – Build and manage multiple scholarship or project funding programs.


## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Hajimi Fund, follow the steps below:

1. Install dependencies if it was skipped in CLI:

```
cd my-dapp-example
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/hardhat/hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit the app on: `http://localhost:3000`. Interact with your smart contract using the `Debug Contracts` page. Tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contracts in `packages/hardhat/contracts`
- Edit your frontend homepage at `packages/nextjs/app/page.tsx`. For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts) checkout the Next.js documentation.
- Edit your deployment scripts in `packages/hardhat/deploy`
  
