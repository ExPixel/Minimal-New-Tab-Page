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

async function main(args) {
    const package = require("../package.json");
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