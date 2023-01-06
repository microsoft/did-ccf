// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the Apache 2.0 License.
import { readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const args = process.argv.slice(2);

const getAllFiles = function (dirPath, arrayOfFiles) {
  arrayOfFiles = arrayOfFiles || [];

  const files = readdirSync(dirPath);
  for (const file of files) {
    const filePath = join(dirPath, file);
    if (statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  }

  return arrayOfFiles;
};

const rootDir = args[0];
const bundlePath = "dist/bundle.json";
const bundle = JSON.parse(readFileSync(bundlePath, "utf-8"));

const proposalPath = join(rootDir, "proposal.json");
const proposal = {
  actions: [{
    name: "set_js_app",
    args: {
      bundle
    },
  }]
}

writeFileSync(proposalPath, JSON.stringify(proposal));