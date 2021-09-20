var babel = require("@babel/core");
var fs = require('fs');
var JavaScriptObfuscator = require('javascript-obfuscator');
const { gzip, ungzip } = require('node-gzip');

async function main(file) {
    const source = fs.readFileSync(`./inputs/${file}`, "utf8");
    const result = babel.transformSync(source, {
        "presets": [
            [
                "@babel/env",
                {
                    "targets": {
                        "edge": "17",
                        "firefox": "60",
                        "chrome": "67",
                        "safari": "11.1",
                        "ie": "11"
                    },
                }
            ]
        ],
        "plugins": [
            ["babel-plugin-remove-comments"],
            ["babel-plugin-transform-remove-console"]
        ],

    });

    fs.writeFileSync(`./babels/${file.split(".")[0]}.min.js`, result.code)

    var obfuscationResult = JavaScriptObfuscator.obfuscate(result.code,
        {
            compact: true,
            controlFlowFlattening: false,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: false,
            simplify: true,
            shuffleStringArray: true,
            splitStrings: true,
            stringArrayThreshold: 1,
            target: "browser",
            seed: 0,
            stringArray: true,
            rotateStringArray: true,
            shuffleStringArray: true,
            stringArrayThreshold: 0.75,
            stringArrayIndexShift: true,
            stringArrayIndexesType: ['hexadecimal-number'],
            stringArrayWrappersCount: 1,
            stringArrayWrappersType: 'variable',
            stringArrayWrappersChainedCalls: true,
            stringArrayEncoding: ['none'],
            identifierNamesGenerator: 'hexadecimal',
            domainLockRedirectUrl: "about:blank"
        }
    );

    const compressed = await gzip(obfuscationResult.getObfuscatedCode());
    fs.writeFileSync(`./outputs/${file.split(".")[0]}.min.js`, compressed)
}


const testFolder = './inputs/';

fs.readdirSync(testFolder).forEach(file => {
    if(file.includes(".js")){
          main(file);
    }
});