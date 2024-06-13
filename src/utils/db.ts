import Config from "../models/Config";

export async function ensureConfig() {
  const configExists = await Config.countDocuments();
  if (configExists == 0) {
    console.log("Creating new config");
    const newConfig = await Config.create({});
    await newConfig.save();
  }
}
