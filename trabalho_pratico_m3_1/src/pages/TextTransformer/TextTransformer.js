import React from "react";

import css from "./TextTransformer.module.css";
import TransformedOutput from "./components/TransformedOutput.js"

export default class TextTransformer extends React.Component {
    constructor() {
        super();

        this.state = { userInput: '' };
    }

    handleKeyUp = (event) => {
        this.setState({
            userInput: event.target.value
        })
    }

    transformations = [{
        id: 1,
        transformDescription: "Texto invertido:",
        transformFunction: function (inputText) {
            let resultString = '';

            let resultArray = Array.from(inputText);
            resultArray.reverse();
            resultArray.forEach((e) => {
                resultString += e;
            });

            return resultString;
        }
    },
    {
        id: 2,
        transformDescription: "Texto numérico:",
        transformFunction: function (inputText) {
            let upperInputText = inputText.toUpperCase();
            let inputArray = Array.from(upperInputText);
            let resultString = ''

            inputArray.forEach((e) => {
                let letter = '';
                switch (e) {
                    case 'O':
                        letter = '0';
                        break;
                    case 'L':
                        letter = '1';
                        break;
                    case 'E':
                        letter = '3';
                        break;
                    case 'A':
                        letter = '4';
                        break;
                    case 'S':
                        letter = '5';
                        break;
                    case 'T':
                        letter = '7';
                        break;
                    default:
                        letter = e;
                        break;
                }
                resultString += letter;
            });

            return resultString;
        }
    }, {
        id: 3,
        transformDescription: "CSV:",
        transformFunction: function (inputText) {
            let resultString = '';

            if (inputText !== '') {
                let words = inputText.split(' ');

                words.forEach((e, index) => {
                    resultString += `"${e}"`
                    if (index < words.length - 1) {
                        resultString += ';';
                    }
                });
            }

            return resultString;
        }
    }, {
        id: 4,
        transformDescription: "Slug:",
        transformFunction: function (inputText) {
            let resultString = '';

            if (inputText !== '') {
                let words = inputText.toLowerCase().split(' ');

                words.forEach((e, index) => {
                    resultString += e;
                    if (index < words.length - 1) {
                        resultString += '-';
                    }
                });
            }

            return resultString;
        }
    }, {
        id: 5,
        transformDescription: "Somente vogais:",
        transformFunction: function (inputText) {
            let resultString = '';

            let stringArray = Array.from(inputText);

            const vogais = ['a', 'e', 'i', 'o', 'u', ' '];

            stringArray.forEach((letra) => {
                if (vogais.includes(letra.toLowerCase())) {
                    resultString += letra;
                }
            });

            return resultString;
        }
    }, {
        id: 6,
        transformDescription: "Soment consoantes:",
        transformFunction: function (inputText) {
            let resultString = '';

            let stringArray = Array.from(inputText);

            const vogais = ['a', 'e', 'i', 'o', 'u',];

            stringArray.forEach((letra) => {
                if (!vogais.includes(letra.toLowerCase())) {
                    resultString += letra;
                }
                return letra;
            });

            return resultString;
        }
    }, {
        id: 7,
        transformDescription: "Variável:",
        transformFunction: function (inputText) {
            let resultString = '';
            let words = inputText.toLowerCase().split(' ');

            words.forEach((e, index) => {
                if (index === 0) {
                    resultString += e;
                } else {
                    resultString += e.replace(e.charAt(0), e.charAt(0).toUpperCase());
                }
            });

            return resultString;
        }
    }]

    render() {
        return (
            <div className={css.container}>
                <h1>react-text-transformer</h1>

                <div className={css.inputContainer}>
                    <span className={css.outputDescription}>Digite um texto qualquer:</span>
                    <div className={css.col}>
                        <input className={css.input} type="text" onChange={this.handleKeyUp}></input>
                        <span className={css.focusBorder}></span>
                    </div>
                </div>

                <h2>Transformações</h2>
                <div className={css.container}>
                    {this.transformations.map((t) => {
                        return (
                            <TransformedOutput key={t.id} inputDisplay={t.transformFunction(this.state.userInput)} transformDescription={t.transformDescription} />
                        )
                    })}
                </div>
            </div>
        )
    };
}