import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { IPitch } from 'ssw-common';

import { getNearestIssue, isError } from '../../api';
import { getPitchBuckets } from '../../api/issue';
import { titleCase } from '../../utils/helpers';

import Pitch from './Pitch/Pitch';

import './styles.scss';

interface ColumnProps {
  name: string;
  items: IPitch[];
}

const onDragEnd = (
  result: DropResult,
  columns: ColumnProps[],
  setColumns: Dispatch<SetStateAction<ColumnProps[]>>,
): void => {
  if (!result.destination) {
    return;
  }

  const { source, destination } = result;

  const sourceColumnId = parseInt(source.droppableId);
  const targetColumnId = parseInt(destination.droppableId);

  const [pitch] = columns[sourceColumnId].items.splice(source.index, 1);
  columns[targetColumnId].items.splice(destination.index, 0, pitch);

  setColumns([...columns]);
};

const Kanban = (): ReactElement => {
  const [columns, setColumns] = useState<ColumnProps[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const res = await getNearestIssue();

      if (!isError(res)) {
        const pitchRes = await getPitchBuckets(res.data.result._id);
        if (!isError(pitchRes)) {
          const pitchBuckets = pitchRes.data.result;
          console.log(pitchBuckets);
          const newColumns: ColumnProps[] = pitchBuckets.map((bucket) => ({
            name: titleCase(bucket.status.split('_').join(' ')),
            items: bucket.pitches,
          }));
          console.log(newColumns);
          setColumns(newColumns);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="kanban-wrapper">
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {columns.map((column, index) => (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            key={index}
          >
            <h2>{column.name}</h2>
            <div style={{ margin: 8 }}>
              <Droppable droppableId={`${index}`} key={index}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
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
