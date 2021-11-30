import React, { ReactElement, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { IPitch } from 'ssw-common';

import { getNearestIssue, getPitchById, isError } from '../../api';

import Pitch from './Pitch/Pitch';

import './styles.scss';

// const itemsFromBackend = [
//   { id: '1', content: 'First task' },
//   { id: '2', content: 'Second task' },
//   { id: '3', content: 'Third task' },
//   { id: '4', content: 'Fourth task' },
//   { id: '5', content: 'Fifth task' },
// ];

interface ColumnProps {
  [key: number]: {
    name: string;
    items: IPitch[];
  };
}

const columnsFromBackend: ColumnProps = {
  ['1']: {
    name: 'Requested',
    items: [],
  },
  ['2']: {
    name: 'To do',
    items: [],
  },
  ['3']: {
    name: 'In Progress',
    items: [],
  },
  ['4']: {
    name: 'Done',
    items: [],
  },
};

const onDragEnd = (result: any, columns: any, setColumns: any): void => {
  if (!result.destination) {
    return;
  }
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

const Kanban = (): ReactElement => {
  const [columns, setColumns] = useState(columnsFromBackend);
  // const [pitches, setPitches] = useState<IPitch[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const res = await getNearestIssue();

      if (!isError(res)) {
        const pitchResponses = await Promise.all(
          res.data.result.pitches.map((pitchId: string) =>
            getPitchById(pitchId),
          ),
        );
        const tempPitches = pitchResponses.map((res) =>
          !isError(res) ? res.data.result : null,
        );
        const nonNullPitches = tempPitches.filter((pitch) => pitch !== null);
        columnsFromBackend[1].items = nonNullPitches as IPitch[];
        setColumns({ ...columnsFromBackend });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="kanban-wrapper">
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            key={columnId}
          >
            <h2>{column.name}</h2>
            <div style={{ margin: 8 }}>
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    // style={{
                    //   background: snapshot.isDraggingOver
                    //     ? 'lightblue'
                    //     : 'white',
                    //   padding: 4,
                    //   width: 250,
                    //   minHeight: 500,
                    // }}
                    className={`kanban-column ${
                      snapshot.isDraggingOver && 'dragging'
                    }`}
                  >
                    {column.items.map((item: IPitch, index: number) => (
                      <Draggable
                        key={item._id}
                        draggableId={item._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                          >
                            <Pitch
                              className={`${snapshot.isDragging && 'dragging'}`}
                              pitchId={item._id}
                            />
                          </div>

                          // <div
                          //   ref={provided.innerRef}
                          //   {...provided.draggableProps}
                          //   {...provided.dragHandleProps}
                          //   style={{
                          //     userSelect: 'none',
                          //     padding: 16,
                          //     margin: '0 0 8px 0',
                          //     minHeight: '50px',
                          //     backgroundColor: snapshot.isDragging
                          //       ? '#263B4A'
                          //       : '#456C86',
                          //     color: 'white',
                          //     ...provided.draggableProps.style,
                          //   }}
                          // >
                          //   {item.content}
                          // </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default Kanban;
