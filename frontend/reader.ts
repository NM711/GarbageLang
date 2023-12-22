import fs from "node:fs";

function readGarbageFiles (location: string): string {
  const file = fs.readFileSync(location);

  return file.toString();
};

export default readGarbageFiles;
