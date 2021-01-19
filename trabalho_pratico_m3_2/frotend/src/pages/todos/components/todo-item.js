import css from "../todos.module.css";

export default function TodoItem(props) {
    const { todoItem } = props;
    const itemClass = todoItem.done ? css.doneTodoItem : css.notDoneTodoItem;
    return (
        <div className={`${itemClass} d-flex flex-row m-2 p-3 align-items-center rounded ${css.singleTodoItem}`}>
            <h4 className={css.todoItemDate}>{todoItem.day}/{todoItem.month}/{todoItem.year}</h4>
            <span>{todoItem.description}</span>
        </div>
    )
}