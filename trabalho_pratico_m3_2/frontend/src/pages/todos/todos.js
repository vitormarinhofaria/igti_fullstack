import React, { useState, useEffect } from "react";

import TodoItem from "./components/todo-item.js";
import SeparadorSumario from "./components/separador-summario.js";

import { GetTodosList } from "../../services/api.js";

export default function Todos() {
    let [todos, setTodos] = useState([]);
    let [selectedYear, setSelectedYear] = useState(2020);
    let [selectedMonth, setSelectedMonth] = useState(6);

    const avaliableYears = [2019, 2020, 2021];
    const months = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

    let [totalDeTarefas, setTotalDeTarefas] = useState(0);
    let [tarefasCumpridas, setTarefasCumpridas] = useState(0);
    let [tarefasNaoCumpridas, setTarefasNaoCumpridas] = useState(0);


    const fetchData = async (year, month) => {
        let json = await GetTodosList(year, month);
        console.log("Buscando na api");
        console.log(`Mes ${year} Ano ${month}`);
        json.sort((a, b) => a.day - b.day);
        setTodos(json);
    };

    useEffect(() => {
        if (todos.length !== 0) {
            setTotalDeTarefas(todos.length);
            setTarefasCumpridas(todos.reduce((total, curr) => curr.done ? total + 1 : total, 0));
            setTarefasNaoCumpridas(todos.reduce((total, current) => current.done ? total : total + 1, 0));
        }
    }, [todos]);

    useEffect(() => {
        fetchData(selectedYear, selectedMonth);
    }, [selectedYear, selectedMonth]);

    let currentDay = 1;

    return (
        <div className={"container"}>
            <div className={"d-flex flex-column align-items-center"}>
                <h1>React TODOS</h1>

                <div className={"d-flex flex-row"}>
                    {avaliableYears.map((year, index) => {
                        return (
                            <button className={selectedYear === year ? "btn btn-primary m-1" : "btn btn-secondary m-1"} key={index} onClick={() => { setSelectedYear(year); console.log(`Selecionando ano: ${year}`) }}>
                                {year}
                            </button>
                        )
                    })}
                </div>

                <div className={"d-flex flex-row"}>
                    {months.map((month, index) => {
                        return (
                            <button className={(selectedMonth === index + 1) ? "btn btn-primary m-1" : "btn btn-secondary m-1"} key={index} onClick={() => { setSelectedMonth(index + 1); console.log(`Selecionando mes: ${index + 1}`) }}>
                                {month}
                            </button>
                        )
                    })}
                </div>

                <div className={"d-flex flex-row mt-3 align-items-center mb-3"}>
                    <label>Total de tarefas: <label style={{ color: 'blue', fontWeight: 'bold', marginRight: '2px', marginLeft: '2px' }}>{totalDeTarefas}</label></label>
                    <h2 style={{ marginLeft: '4px', marginRight: '4px' }}>|</h2>
                    <label>Tarefas Cumpridas: <label style={{ color: 'green', fontWeight: 'bold', marginRight: '2px', marginLeft: '2px' }}>{tarefasCumpridas}</label></label>
                    <h2 style={{ marginLeft: '4px', marginRight: '4px' }}>|</h2>
                    <label>Tarefas Não Cumpridas: <label style={{ color: 'red', fontWeight: 'bold', marginRight: '2px', marginLeft: '2px' }}>{tarefasNaoCumpridas}</label></label>
                </div>

                {todos.map((todo, index) => {
                    function getSumario() {
                        return todos.reduce((acumulador, ltodo) => {
                            if (ltodo.day === todo.day - 1) {
                                acumulador.total++;
                                if (ltodo.done) {
                                    acumulador.concluidas++;
                                } else {
                                    acumulador.naoConcluidas++;
                                }
                            }
                            return acumulador;
                        }, { total: 0, concluidas: 0, naoConcluidas: 0 });
                    }

                    if (index === 0) {
                        currentDay = todo.day;
                        return (
                            <>
                                <SeparadorSumario key={index} />
                                <TodoItem key={todo.id} id={todo.id} todoItem={todo} />
                            </>
                        );
                    } else if (index === todos.length - 1) {
                        currentDay = todo.day;
                        return (
                            <>
                                <TodoItem key={todo.id} id={todo.id} todoItem={todo} />
                                <SeparadorSumario key={index} />
                            </>
                        );
                    }
                    else if (currentDay !== todo.day) {
                        currentDay = todo.day;
                        return (
                            <>
                                <SeparadorSumario key={index} sumario={getSumario()} />
                                <TodoItem key={todo.id} id={todo.id} todoItem={todo} />
                            </>
                        );
                    } else {
                        currentDay = todo.day;
                        return (
                            <TodoItem key={todo.id} id={todo.id} todoItem={todo} />
                        );
                    }
                })}
            </div>
        </div>
    );
}