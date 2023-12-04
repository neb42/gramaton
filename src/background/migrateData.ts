const migrations: Record<string, () => Promise<void>> = {}

export const migrateData = async () => {
  const currentDataVersion = (await chrome.storage.sync.get('__version__'))['__version__'];
  const manifestVersion = chrome.runtime.getManifest().version;

  console.log('currentDataVersion', currentDataVersion);
  console.log('manifestVersion', manifestVersion);

  if (currentDataVersion === manifestVersion) return;

  if (currentDataVersion === undefined) {
    await chrome.storage.sync.set({ '__version__': manifestVersion });
    return;
  }

  const migrationsToRun = Object.keys(migrations).filter(version => version > currentDataVersion && version <= manifestVersion);
  for (const version of migrationsToRun) {
    console.log('running migration', version);
    await migrations[version]();
    await chrome.storage.sync.set({ '__version__': version });
  }
};