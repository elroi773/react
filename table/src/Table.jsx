import { useEffect, useRef, useState, createRef } from "react";
import "./Table.css";

const TableHeader = ({ index, column, columnRef, initResize }) => {
    const width = !!initResize ? column.width : "100%";

    return (
        <th
            ref={columnRef}
            style={{
                width: `${width}px`,
                minWidth: `${width}px`,
                maxWidth: `${width}px`,
            }}
        >
            {column.name}
            {!!initResize && (
                <span 
                    className="draggable"
                    onMouseDown={e => initResize(e, index)}
                ></span>
            )}
        </th>
    );
};

export const Table = ({ columns, data }) => {
    const [columnState, setColumnState] = useState(columns);
    const [columnRefs, setColumnRefs] = useState([]);
    const wrapperRef = useRef(null);
    const activeIndex = useRef(null);

    const resize = e => {
        const columnsCopy = [...columnState]; // 기존 columnState 사용
        const column = columnsCopy[activeIndex.current];
        const columnRef = columnRefs[activeIndex.current];
        const nextWidth = e.clientX - columnRef.current.offsetLeft;

        column.width = nextWidth;
        setColumnState(columnsCopy);
    };

    const stopResize = () => {
        document.body.style.cursor = "default";
        window.removeEventListener("mousemove", resize);
        window.removeEventListener("mouseup", stopResize);
    };

    const initResize = (e, index) => {
        activeIndex.current = index;
        e.stopPropagation();
        document.body.style.cursor = "col-resize";
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResize);
    };

    useEffect(() => {
        setColumnRefs(
            Array(columns.length)
                .fill()
                .map((_, i) => columnRefs[i] || createRef())
        );
    }, [columns.length]);

    return (
        <div className="wrapper" ref={wrapperRef}>
          <table>
            <thead>
              <tr>
                {columnState.map((column, index) => (
                  <TableHeader
                    key={column.name}
                    index={index}
                    column={column}
                    columnRef={columnRefs[index]}
                    initResize={
                      index === columnState.length - 1 ? null : initResize
                    }
                  />
                ))}
              </tr>
            </thead>
      
            {/* ✅ 추가된 부분 */}
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columnState.map((column, colIndex) => (
                    <td key={colIndex}>{row[column.name]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };      