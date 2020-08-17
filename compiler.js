// Break them down --- Tokenizer ------
'use strict';
function tokenizer(input) {
    let tokens = []; // array to push tokenized value.
    let whiteSpace = /\s/;
    let numberPattern = /[0-9]/;
    let letterPattern = /[a-z]/i;
    let numberValue = '';
    let stringValue = '';
    let nameValue = '';
    let isString = false;


    for (let i = 0; i < input.length; i++) {
        let currentChar = input[i];

        if (currentChar === '(') {
            tokens.push({
                type: 'paren',
                value: '('
            })
            continue;
        }

        if (currentChar === ')') {
            tokens.push({
                type: 'paren',
                value: ')'
            })
            continue;
        }


        // numbers

        if (numberPattern.test(currentChar)) {
            numberValue += currentChar;

            if (numberValue !== [] && !numberPattern.test(input[i + 1])) {
                tokens.push({
                    type: 'number',
                    value: numberValue
                });
                numberValue = '';
            }
            continue;
        }

        // strings

        if (currentChar === '"' || isString === true) {

            if (currentChar === '"' && isString === false) {
                isString = true;
                continue
            }

            if (currentChar === '"' && isString === true) {
                tokens.push(
                    {
                        type: 'string',
                        value: stringValue
                    }
                );
                stringValue = '';
                isString = false;
            }

            if (isString) {
                stringValue += currentChar;
            }

            continue;
        }

        // name 

        if (letterPattern.test(currentChar)) {
            nameValue += currentChar;
            if (nameValue !== [] && whiteSpace.test(input[i + 1])) {
                tokens.push({
                    type: 'name',
                    value: nameValue
                });
                nameValue = '';
            }
            continue;
        }

        // ignore whitespace

        if (whiteSpace.test(currentChar)) {
            continue
        }
    }
    return tokens;
}

let data = '(add 2 (subtract 4 2))';
let tokens = tokenizer(data);

console.log(tokens);

// parse them all! --- The parser. 


function parser(tokens) {
    let ast = {
        type: 'Program',
        body: []
    };

    function walk(tokensToUse) {
        let node = {
            type: 'CallExpression',
            name: '',
            params: [],
        }

        for (let i = 0; i < tokensToUse.length; i++) {
            let currentToken = tokensToUse[i];
            if (currentToken.type === 'paren' && currentToken.value === '(') {
                if (node.name !== '') {
                    let updatedTokens = tokensToUse.slice(i + 1);
                    let result = { ...walk(updatedTokens) }
                    node.params.push(result.x);
                    i = tokensToUse[result.i + i]
                    continue
                } else {
                    continue
                }
            }

            if (currentToken.type === 'name') {
                node.name = currentToken.value;
                continue
            }

            if (currentToken.type === 'number') {
                node.params.push({
                    type: 'NumberLiteral',
                    value: currentToken.value
                });
                continue;
            }

            if (currentToken.type === 'string') {
                node.params.push({
                    type: 'StringLiteral',
                    value: currentToken.value
                });
                continue;
            }

            if (currentToken.type === 'paren' && currentToken.value === ')') {
                let x = { ...node }
                return { x, i };
            }
        }

    }

    let mainResult = walk(tokens)
    ast.body.push(mainResult.x);
    return ast
};

let parsed = parser(tokens);
console.log(parsed.body[0].params, "====> parsed")

