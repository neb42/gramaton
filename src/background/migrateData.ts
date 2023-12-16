import { getStorage } from "../storage";

const migrations: Record<string, () => Promise<void>> = {}

export const migrateData = async () => {
  const storage = getStorage();

  const currentDataVersion = (await storage.get('__version__'))['__version__'];
  const manifestVersion = chrome.runtime.getManifest().version;

  console.log('currentDataVersion', currentDataVersion);
  console.log('manifestVersion', manifestVersion);

  if (currentDataVersion === manifestVersion) return;

  if (currentDataVersion === undefined) {
    await storage.set({ '__version__': manifestVersion });
    return;
  }

  const migrationsToRun = Object.keys(migrations).filter(version => version > currentDataVersion && version <= manifestVersion);
  for (const version of migrationsToRun) {
    console.log('running migration', version);
    await migrations[version]();
    await storage.set({ '__version__': version });
  }
};