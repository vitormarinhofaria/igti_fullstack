import React, { Component } from 'react';

import CopyIcon from "../../../assets/svg/icons/copy.svg";

import css from "../TextTransformer.module.css";

export default class TransformedOutput extends Component {
    render() {
        return (
            <div className={css.inputContainer}>
                <span className={css.outputDescription}>{this.props.transformDescription}</span>
                <div className={css.row}>
                    <div className={css.col}>
                        <input className={css.input} type="text" value={this.props.inputDisplay} disabled={true}></input>
                        <span className={css.focusBorder}></span>
                    </div>
                    <button className={css.icon} onClick={async () => await navigator.clipboard.writeText(this.props.inputDisplay)}>
                        <img width={20} height={20} src={CopyIcon}></img>
                    </button>
                </div>
            </div>
        )
    }
}
