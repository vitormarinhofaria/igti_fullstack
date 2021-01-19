import React from "react";

export default function SeparadorSumario({ sumario }) {

    return (
        <div className={"d-flex flex-column mb-2"} style={styles.separator}>
            {sumario !== undefined && (
                <div className={"d-flex flex-row m-2 justify-content-end align-items-center"}>
                    <h6 className={"m-1"} style={styles.concluidas}>Concluidas: {sumario.concluidas}</h6>
                    <h5 className={"m-1"}>|</h5>
                    <h6 className={"m-1"} style={styles.naoConcluidas}>Não Concluidas: {sumario.naoConcluidas}</h6>
                    <h5 className={"m-1"}>|</h5>
                    <h6 className={"m-1"} style={styles.total}>Total: {sumario.total}</h6>
                </div>
            )}
        </div>
    )
}

const styles = {
    spacin: {
        marginLeft: '1rem',
        marginRigth: '1rem',
    },
    naoConcluidas: {
        color: "red",
    },
    concluidas: {
        color: "green",
    },
    total: {
        color: "blue",
    },
    separator: {
        height: 'max-content',
        width: '80%',
        borderBottom: '2px solid #333333',
    }
}