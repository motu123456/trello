import { useState } from "react";
import './App.css';

function App() {
  const [columns, setColumns] = useState({
    //初期状態
    todo:{
      name: "未着手",
      items: [
        {id: "1", content: "タスク１"},
        {id: "2", content: "タスク２"},
      ]
    },
    inProgress: {
      name: "進行中",
      items: [
        {id: "3", content: "タスク３"},
        {id: "4", content: "タスク４"},
      ]
    },
    done:{
      name: "完了",
      items: [
        {id: "5", content: "タスク５"},
        {id: "6", content: "タスク６"},
      ]
    }
  });

  const [newTask, setNewTask] = useState("");

  const [activeColumns, setActiveColumn] = useState("todo");

  const [draggedItem, setDraggedItem] = useState(null);

  //新しいタスクを作成する関数
  const addNewTask = () => {
    //入力が空の場合はリターン
    if (newTask.trim() === "") return;

    //加工用。元のオブジェクトをコピーする。
    const updatedColumns = {...columns};

    //新しいタスクの追加
    updatedColumns[activeColumns].items.push({
      // TODO: UUIDに
      id: Date.now().toString(),
      content: newTask,
    });

    setColumns(updatedColumns);
    setNewTask("");
  };

  //タスクを削除する
  const removeTask = (columnId, taskId) => {
    const updatedColumns = {...columns};

    updatedColumns[columnId].items =
     updatedColumns[columnId].items.filter((item) => item.id != taskId);

    setColumns(updatedColumns)
  };

  // Drag開始
  const handleDragStart = (columnId, item) => {
    //どのタスクがDragされているかを追跡しはじめる
    setDraggedItem({columnId,item});
  };

  const handleDragOver = (e) => {
    //デフォルトの動作をキャンセルする
    //HTMLではデフォルトで Drag & Drop が許可されていないため
    //その動作をキャンセルしてDrag Over できるようにする。
    e.preventDefault();
  };

  //ボックス内へのタスクのDrop処理
  const handleDrop = (e, columnId) => {
    // デフォルトの動作をキャンセルする
    e.preventDefault();

    // Dragされたアイテムがない場合はリターン
    if (!draggedItem) return;

    // DragされたIDから元のアイテムの情報を取得
    const {columnId: sourceColumnId, item} = draggedItem;

    // 同じタスクの場合はリターン
    if (sourceColumnId === columnId) {
      console.log(2.5)
      return;
    }

    // 現在のカラムのコピーを作成する
    const updatedColumns = {...columns};

    console.log(updatedColumns)
    updatedColumns[sourceColumnId].items =
    updatedColumns[sourceColumnId].items.filter((i) => i.id !== item.id);

    console.log(draggedItem.item)
    updatedColumns[columnId].items.push(item);

    //状態を更新する
    setColumns(updatedColumns);
    setDraggedItem(null);
  };

  return (
    <>
      <div className="main-container">
        <div className="sub-container">

          <h1 className="title">カンバン</h1>
          
          {/* タスクを追加する領域 */}
          <div className="add-task-container">
            <input
              type="text"
              value={newTask}
              placeholder="新しいタスクを追加します"
              className="input-new-task"
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addNewTask()}
              />
              {/* 「未着手」「進行中」「完了」どのボックスに追加するか選択して追加する */}
              <select valu={activeColumns}
              onChange={(e) => setActiveColumn(e.target.value)}
              className="select-active-column">
                {Object.keys(columns).map((columnId) => (
                  <option value={columnId} key={columnId}>
                    {columns[columnId].name}
                  </option>
                ))}
              </select>

              <button onClick={addNewTask} className="button-new-task">追加</button>
          </div>

          {/* ３つのボックスが並ぶ領域 */}
          <div className="boxes-container">
            {Object.keys(columns).map((columnId) => (
              <div key={columnId}
              className="box-container"
              onDragOver={(e) => handleDragOver(e, columnId)}
              onDrop={(e) => handleDrop(e, columnId)}>
                <div className="active-column-head">
                  {columns[columnId].name}
                  <span className="active-column-count">
                    {columns[columnId].items.length}
                  </span>
                </div>

                <div className="drop-item-area">
                  {columns[columnId].items.length === 0 ? (
                    <div className="drop-first-item">ここにタスクをドロップ</div>
                  ) : (
                    columns[columnId].items.map((item) => (
                      <div key={item.id} 
                      className="dro p-item" 
                      draggable // 重要

                      onDragStart={() => handleDragStart(columnId, item)}>
                        <span className="item-content">{item.content}</span>
                        <button onClick={() => removeTask(columnId, item.id)} className="button-remove-task">
                          <span className="remove-task">削除</span>
                          </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
