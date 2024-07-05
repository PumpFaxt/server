import express from "express";
import evm from "../../evm";
import faucet from "../../faucet";
import { isAddress } from "viem";
const router = express.Router();

router.get("/check-eth", async (req, res) => {
  const { address } = req.query;

  if (typeof address != "string" || !isAddress(address))
    return res.sendStatus(400);

  const bal = await faucet.getBalance({ address: address });

  if (bal >= BigInt(10 * Math.pow(10, 18)))
    return res.send({
      claimable: false,
      message: "You already have more than one frxETH",
    });

  if (
    (await faucet.contract.read.checkEthClaimEligibility([address])) == false
  ) {
    const cooldown = await faucet.contract.read.ethClaimCooldown();
    return res.send({
      claimable: false,
      message: `You can only claim once every ${
        (Number(cooldown) / 60) * 60 * 1000
      }hrs`,
    });
  }

  return res.send({ claimable: true });
});

router.get("/claim-eth", async (req, res) => {
  try {
    const { address } = req.query;

    if (typeof address != "string" || !isAddress(address))
      return res.sendStatus(400);

    if (
      (await faucet.contract.read.checkEthClaimEligibility([address])) == false
    )
      return res.sendStatus(401);

    await faucet.contract.write.claimEth([address], {
      account: faucet.account,
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get("/check-frax", async (req, res) => {
  const { address } = req.query;

  if (typeof address != "string" || !isAddress(address))
    return res.sendStatus(400);

  if (
    (await faucet.contract.read.checkFraxClaimEligibility([address])) == false
  ) {
    const cooldown = await faucet.contract.read.fraxClaimCooldown();
    return res.send({
      claimable: false,
      message: `You can only claim once every ${
        (Number(cooldown) / 60) * 60 * 1000
      }hrs`,
    });
  }

  return res.send({ claimable: true });
});

router.get("/claim-frax", async (req, res) => {
  try {
    const { address } = req.query;

    if (typeof address != "string" || !isAddress(address))
      return res.sendStatus(400);

    if (
      (await faucet.contract.read.checkFraxClaimEligibility([address])) == false
    )
      return res.sendStatus(401);

    await faucet.contract.write.claimFrax([address], {
      account: faucet.account,
      gas: 3000000n,
    });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

let faucetConfig = {
  eth: { cooldown: 0, amount: 0 },
  frax: { cooldown: 0, amount: 0 },
};
router.get("/config", async (req, res) => {
  if (faucetConfig.eth.amount === 0) {
    faucetConfig.eth.amount = Number(
      await faucet.contract.read.ethClaimAmount()
    );
  }
  if (faucetConfig.eth.cooldown === 0) {
    faucetConfig.eth.cooldown = Number(
      await faucet.contract.read.ethClaimCooldown()
    );
  }
  if (faucetConfig.frax.amount === 0) {
    faucetConfig.frax.amount = Number(
      await faucet.contract.read.fraxClaimAmount()
    );
  }
  if (faucetConfig.frax.cooldown === 0) {
    faucetConfig.frax.cooldown = Number(
      await faucet.contract.read.fraxClaimCooldown()
    );
  }

  return res.send(faucetConfig);
});

export default router;
