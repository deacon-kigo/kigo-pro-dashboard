const hostedWalletManagerApiRoutes = {
  delete:
    "/dashboard/product-configurations/hosted-wallets/:hostedWalletConfigId",
  get: "/dashboard/product-configurations/hosted-wallets/:hostedWalletConfigId",
  list: "/dashboard/product-configurations/hosted-wallets",
  upsert: "/dashboard/product-configurations/hosted-wallets",
} as const;

const hostedWalletManagerWebRoutes = {
  view: "/hosted-wallet-manager",
} as const;

export { hostedWalletManagerApiRoutes, hostedWalletManagerWebRoutes };
