import React, { Component } from 'react';

import css from "../TextTransformer.module.css";

export default class TransformedOutput extends Component {
    render() {
        return (
            <div className={css.inputContainer}>
                <span>{this.props.transformDescription}</span>
                <input className={css.input} type="text" value={this.props.inputDisplay} disabled={true}></input>
            </div>
        )
    }
}
