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
      message: "You already have more than a frxETH",
    });

  if (
    (await faucet.contract.read.checkEthClaimEligibility([address])) == false
  ) {
    const cooldown = await faucet.contract.read.ethClaimCooldown();
    return res.send({
      claim: false,
      message: `You can only claim once every ${
        (Number(cooldown) / 60) * 60 * 1000
      }hrs`,
    });
  }

  return res.send({ claimable: true });
});

router.get("/claim-eth", async (req, res) => {
  const { address } = req.query;

  if (typeof address != "string" || !isAddress(address))
    return res.sendStatus(400);

  if ((await faucet.contract.read.checkEthClaimEligibility([address])) == false)
    return res.sendStatus(401);

  await faucet.contract.write.claimEth([address], {
    account: faucet.account,
  });
  res.sendStatus(200);
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
      claim: false,
      message: `You can only claim once every ${
        (Number(cooldown) / 60) * 60 * 1000
      }hrs`,
    });
  }

  return res.send({ claimable: true });
});

router.get("/claim-frax", async (req, res) => {
  const { address } = req.query;

  if (typeof address != "string" || !isAddress(address))
    return res.sendStatus(400);

  if (
    (await faucet.contract.read.checkFraxClaimEligibility([address])) == false
  )
    return res.sendStatus(401);

  await faucet.contract.write.claimFrax([address], {
    account: faucet.account,
  });
  res.sendStatus(200);
});

export default router;
