const FileSystem = require("fs")
    , Path = require("path")
    , archiver = require("archiver")
    , mkdirp = require('mkdirp');

// const FileType = { None: 0, Directory: 1, File: 2, Link: 3 }

// function getFileType(path) {
//     return new Promise((resolve, reject) => {
//         FileSystem.stat(path, (err, stats) => {
//             if (err) { resolve(FileType.None); return; }

//             if (stats.isFile()) { resolve(FileType.File); }
//             else if (stats.isDirectory()) { resolve(FileType.Directory); }
//             else if (stats.isSymbolicLink()) { resolve(FileType.Link); }
//             else { resolve(FileType.None); }
//         });
//     });
// }

function mkdirpAsync(dir, opts) {
    return new Promise((resolve, reject) => {
        if (opts !== undefined) {
            mkdirp(dir, opts, (err) => err ? reject(err) : resolve());
        } else {
            mkdirp(dir, (err) => err ? reject(err) : resolve());
        }
    });
}

function readFileAsync(file) {
    return new Promise((resolve, reject) => {
        FileSystem.readFile(file, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

function writeFileAsync(file, data) {
    return new Promise((resolve, reject) => {
        FileSystem.writeFile(file, data, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

/**
 * This makes sure that the version of the manifest file matches the version of the package.json.
 */
async function manifestFix(version) {
    const manifestString = (await readFileAsync("dist/manifest.json")).toString("utf8");
    const manifest = JSON.parse(manifestString);

    if (!manifest.version) {
        console.warn("[WARNING] NO MANIFEST VERSION FOUND. ADDING.");
    } else if (manifest.version != version) {
        console.warn("[WARNING] MANIFEST VERSION (%s) DOES NOT MATCH PACKAGE VERSION (%s). CHANGING.", manifest.version, version);
    }

    manifest.version = version;
    const newManifestString = JSON.stringify(manifest, null, 2);
    await writeFileAsync("dist/manifest.json", newManifestString);
    console.log("Wrote new manifest.json file.");
}

async function main(args) {
    const package = require("../package.json");
    await manifestFix(package.version);

    const output = args[0].replace("[version]", package.version);
    const outputDirName = Path.dirname(output);
    if (outputDirName && outputDirName.length > 0) {
        await mkdirpAsync(outputDirName);
    }

    const outputStream = FileSystem.createWriteStream(output);
    const archive = archiver("zip", {
        zlib: {level: 9}
    });

    outputStream.on("close", () => {
        console.log("Wrote %d bytes.", archive.pointer());
    });

    archive.on("warning", (err) => {
        if (err.code === "ENOENT") {
            console.warn("ARCHIVE WARNING: ", err);
        } else {
            console.error("ARCHIVE ERROR: ", err);
            throw err;
        }
    });

    archive.on("error", (err) => {
        console.error("ARCHIVE ERROR: ", err);
        throw err;
    });

    archive.pipe(outputStream);

    // actual archiving...
    archive.directory("./dist/", false);
    console.log("[ARCHIVE] dist/");

    await archive.finalize();
    console.log("Finalized archive.");
}

main(process.argv.slice(2)).then(() => {
    console.log("DONE");
}, (err) => {
    console.error("There was an error while creating the archive.", err);
});